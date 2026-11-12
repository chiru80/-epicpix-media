import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

// Webhook endpoint for Stripe payment events
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  // Handle the payment intent succeeded event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    try {
      const supabase = createClient();

      // Extract order ID from metadata
      const orderId = paymentIntent.metadata?.order_id;

      if (orderId) {
        // Update order payment status
        const { error } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            deposit_amount: paymentIntent.amount / 100, // Convert from smallest unit
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        if (error) throw error;

        // Could also trigger email notifications, etc.
        console.log(`Payment received for order #${orderId}`);
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
    }
  }

  // Handle payment failed
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    try {
      const supabase = createClient();

      const orderId = paymentIntent.metadata?.order_id;

      if (orderId) {
        await supabase
          .from("orders")
          .update({
            payment_status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        console.log(`Payment failed for order #${orderId}`);
      }
    } catch (error) {
      console.error("Error processing failed payment:", error);
    }
  }

  // Handle other events as needed (checkout.session.completed, etc.)
  // ...

  console.log(`Handled event: ${event.type}`);

  return NextResponse.json({ received: true });
}

export async function GET(request: Request) {
  return NextResponse.json({
    message: "Stripe webhook endpoint. Use POST to receive events.",
    event_types: [
      "payment_intent.succeeded",
      "payment_intent.payment_failed"
    ]
  }, { status: 200 });
}