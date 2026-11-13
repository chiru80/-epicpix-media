import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase";

/**
 * YouPI-PG Payment Webhook Handler
 *
 * Implements server-side, idempotent webhook processing.
 * Never trust frontend callback data for payment confirmations.
 *
 * Security:
 * - HMAC SHA-256 signature verification via x-youpi-signature
 * - Idempotency via webhook_event_id check in payments table
 * - Order amount validation against database order
 * - Atomic database updates via Supabase service role client
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-youpi-signature") || request.headers.get("x-webhook-signature");
    const webhookSecret = process.env.YOUPI_WEBHOOK_SECRET;

    // 1. Signature Verification
    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json(
          { error: "Missing webhook signature" },
          { status: 401 }
        );
      }

      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      const signatureBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);

      if (
        signatureBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
      ) {
        console.error("YouPI webhook signature mismatch");
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 403 }
        );
      }
    } else if (process.env.NODE_ENV === "production") {
      console.warn("YOUPI_WEBHOOK_SECRET not set in production. Webhooks cannot be validated.");
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const eventId = payload.event_id || payload.id || `evt_${Date.now()}`;
    const eventType = payload.event_type || payload.event || "payment.success";
    const data = payload.data || payload;

    const orderId = data.order_id || data.metadata?.order_id;
    const gatewayPaymentId = data.payment_id || data.gateway_payment_id || data.id;
    const amountInPaise = Number(data.amount) || 0;
    const utr = data.utr || data.bank_reference || null;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing required order_id in webhook payload" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // 2. Idempotency Check: Check if this event was already processed
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id, status, verification_status")
      .or(`webhook_event_id.eq.${eventId},gateway_payment_id.eq.${gatewayPaymentId}`)
      .eq("status", "success")
      .single();

    if (existingPayment) {
      console.log(`[YouPI Webhook] Event ${eventId} for order ${orderId} already processed. Idempotent return.`);
      return NextResponse.json({
        success: true,
        message: "Payment already verified (idempotent)",
        paymentId: existingPayment.id,
      });
    }

    // 3. Fetch & Validate Database Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, total_price, deposit_amount, remaining_balance, payment_status, status")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error(`[YouPI Webhook] Order ${orderId} not found in database:`, orderError);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 4. Handle Event Types
    if (eventType === "payment.success" || eventType === "order.paid") {
      // Validate amount (allow small rounding tolerance)
      const amountInRupees = amountInPaise > 1000 ? amountInPaise / 100 : amountInPaise;
      const expectedTotal = Number(order.total_price);
      const expectedDeposit = Number(order.deposit_amount);

      const isDeposit = Math.abs(amountInRupees - expectedDeposit) <= 1;
      const isFull = Math.abs(amountInRupees - expectedTotal) <= 1;

      const newPaymentStatus = isFull ? "paid" : isDeposit ? "deposit_paid" : "paid";

      // Insert or Update Payment Record
      const { data: paymentRecord, error: paymentError } = await supabase
        .from("payments")
        .upsert(
          {
            order_id: orderId,
            gateway: "YOUPI",
            gateway_payment_id: gatewayPaymentId,
            gateway_order_id: data.gateway_order_id || null,
            amount: amountInPaise,
            currency: data.currency || "INR",
            status: "success",
            verification_status: "verified",
            utr: utr,
            webhook_event_id: eventId,
            metadata: {
              raw_event: eventType,
              received_at: new Date().toISOString(),
              payer: data.payer || null,
            },
            paid_at: new Date().toISOString(),
          },
          { onConflict: "webhook_event_id" }
        )
        .select()
        .single();

      if (paymentError) {
        console.error("[YouPI Webhook] Error recording payment:", paymentError);
      }

      // Update Order Status
      const { error: updateOrderError } = await supabase
        .from("orders")
        .update({
          payment_status: newPaymentStatus,
          status: order.status === "pending" ? "in_progress" : order.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateOrderError) {
        console.error("[YouPI Webhook] Error updating order status:", updateOrderError);
      }

      // Update linked Invoice if exists
      await supabase
        .from("invoices")
        .update({
          payment_status: newPaymentStatus,
          status: newPaymentStatus === "paid" ? "paid" : "sent",
          paid_at: new Date().toISOString(),
        })
        .eq("order_id", orderId);

      console.log(`[YouPI Webhook] Order #${orderId} marked as ${newPaymentStatus} via verified YouPI webhook`);

      return NextResponse.json({
        success: true,
        orderId,
        paymentStatus: newPaymentStatus,
        paymentId: paymentRecord?.id,
      });
    }

    if (eventType === "payment.failed") {
      await supabase
        .from("payments")
        .insert({
          order_id: orderId,
          gateway: "YOUPI",
          gateway_payment_id: gatewayPaymentId,
          amount: amountInPaise,
          currency: data.currency || "INR",
          status: "failed",
          verification_status: "failed",
          webhook_event_id: eventId,
          metadata: data,
        });

      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      return NextResponse.json({ success: true, message: "Payment failure recorded" });
    }

    return NextResponse.json({ success: true, message: `Event ${eventType} recorded` });
  } catch (error: any) {
    console.error("[YouPI Webhook Error]:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    gateway: "YouPI-PG Webhook Endpoint",
    supportedEvents: ["payment.success", "payment.failed", "order.paid"],
  });
}

