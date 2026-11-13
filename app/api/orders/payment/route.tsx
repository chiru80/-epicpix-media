import { createServiceClient } from "@/lib/supabase";
import { verifyOrderOwnership } from "@/lib/api-utils";

/**
 * Payment initiation endpoint
 *
 * SECURITY: This endpoint creates a PENDING payment record.
 * Actual payment verification MUST happen via webhook from YouPI gateway.
 *
 * The flow is:
 * 1. Client submits payment details (amount, method)
 * 2. Server creates payment record with status PENDING
 * 3. Payment is processed externally via YouPI gateway
 * 4. YouPI sends webhook to /api/webhooks/youpi/route.tsx
 * 5. Webhook verifies payment and updates order status to PAID
 *
 * DO NOT mark orders as paid here - only create the pending record.
 */
export async function POST(request: Request) {
  const supabase = createServiceClient();

  try {
    const body = await request.json();
    const { orderId, amount, paymentMethod, gatewayOrderId } = body;

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: orderId" }),
        { status: 400 }
      );
    }

    if (!amount || Number(amount) <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid amount. Payment amount is required." }),
        { status: 400 }
      );
    }

    // Verify order exists
    const { valid, order, error: verifyError } = await verifyOrderOwnership(orderId);
    if (!valid) {
      return new Response(
        JSON.stringify({ error: verifyError || "Order not found" }),
        { status: 404 }
      );
    }

    // Validate amount matches order total (with small tolerance for rounding)
    const orderTotal = Number(order.total_price);
    const paymentAmount = Number(amount);

    if (Math.abs(paymentAmount - orderTotal) > 1) {
      return new Response(
        JSON.stringify({ error: `Amount mismatch. Expected: ₹${orderTotal.toFixed(2)}, Received: ₹${paymentAmount.toFixed(2)}` }),
        { status: 400 }
      );
    }

    // Check for duplicate pending payment
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id, status")
      .eq("order_id", orderId)
      .eq("status", "pending_verification")
      .single();

    if (existingPayment) {
      return new Response(JSON.stringify({
        success: true,
        message: "Payment already in progress. Check back for updates.",
        paymentId: existingPayment.id,
        orderId,
      }), { status: 200 });
    }

    // Create PENDING payment record - NOT completed!
    // Actual payment verification happens via webhook from YouPI
    const paymentRecord = {
      order_id: orderId,
      amount: paymentAmount,
      payment_method: paymentMethod || "upi",
      status: "pending_verification", // CRITICAL: Not 'completed'!
      verification_status: "pending",
      gateway: "YOUPI",
      gateway_order_id: gatewayOrderId || `order_${orderId}_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    const { data: payment, error } = await supabase
      .from("payments")
      .insert([paymentRecord])
      .select()
      .single();

    if (error) {
      console.error("Payment record creation failed:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create payment record. Please try again." }),
        { status: 500 }
      );
    }

    // Update order status to indicate payment pending verification
    // This will be updated to 'paid' via YouPI webhook when payment is verified
    await supabase
      .from("orders")
      .update({
        payment_status: "pending_verification",
        payment_method: paymentMethod,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    // Return success - client needs to complete payment with YouPI
    return new Response(JSON.stringify({
      success: true,
      message: "Payment initiated. Complete payment via YouPI gateway.",
      paymentId: payment?.id,
      orderId: orderId,
      gatewayOrder: payment?.gateway_order_id,
      amount: paymentAmount,
      status: "pending_verification",
    }), { status: 200 });

  } catch (error) {
    console.error("Payment initiation error:", error);
    return new Response(
      JSON.stringify({ error: "Payment processing failed. Please try again." }),
      { status: 500 }
    );
  }
}

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
