import { createClient } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(request: Request) {
  try {
    const { amount, paymentType, orderId, metadata } = await request.json();

    if (!amount || !orderId) {
      return new Response(JSON.stringify({ error: "Missing required fields: amount, orderId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient();

    // Verify order exists
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id")
      .eq("id", orderId)
      .single();

    if (orderError) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create PaymentIntent in INR with Indian payment methods
    // Stripe supports UPI, cards (RuPay/Visa/MasterCard), net banking, wallets for INR
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in smallest currency unit (paise)
      currency: "inr",
      metadata: {
        payment_type: paymentType,
        order_id: orderId,
        service_type: metadata?.service_type || "",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update order if deposit
    if (paymentType === "deposit") {
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "deposit_paid",
          deposit_amount: Math.round(amount * 100), // Storing in paise for consistency
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateError) throw updateError;
    }

    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
      currency: "inr",
      orderId,
    }), { status: 200 });

  } catch (error) {
    console.error("Payment intent error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(request: Request) {
  // This endpoint is POST only
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}