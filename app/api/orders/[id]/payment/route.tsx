import { createClient } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" ,
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { amount, paymentType } = await request.json();

    const supabase = createClient();

    // Create PaymentIntent in INR with Indian payment methods
    // Stripe supports UPI, cards (RuPay/Visa/MasterCard), net banking, wallets for INR
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // in paise
      currency: "inr",
      metadata: {
        order_id: id,
        client_id: "",
        project_type: "",
        payment_type: paymentType,
      },
      // Automatic payment methods (UPI, cards, net banking, wallets)
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // If deposit, mark order accordingly
    if (paymentType === "deposit") {
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "deposit_paid",
          deposit_amount: Math.round(amount),
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (updateError) throw updateError;
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount,
        currency: "inr",
        orderId: id
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Payment intent error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // This endpoint is POST only
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}