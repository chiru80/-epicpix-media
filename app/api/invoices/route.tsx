import { createClient } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get("id");

    if (invoiceId) {
      const invoice = await stripe.invoices.retrieve(invoiceId);
      return new Response(JSON.stringify(invoice), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // List recent invoices
    const invoices = await stripe.invoices.list({ limit: 10 });

    return new Response(JSON.stringify(invoices), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Stripe GET error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, clientId, items, taxRate = 0.18 } = body;

    const supabase = createClient();

    // Get project and client details
    const { data: project, error: projError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projError) {
      return new Response(JSON.stringify({ error: projError.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get client email for Stripe customer
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("email")
      .eq("id", clientId)
      .single();

    if (clientError) {
      return new Response(JSON.stringify({ error: clientError.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Calculate amounts
    const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const totalAmount = subtotal + taxAmount;

    // Ensure we have a Stripe customer
    let stripeCustomerId = project.client_stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: client.email,
        name: project.title,
        metadata: {
          project_id: projectId,
          client_id: clientId,
        },
      });
      stripeCustomerId = customer.id;

      // Update client with Stripe customer ID
      await supabase.from("clients").update({ stripe_customer_id: stripeCustomerId }).eq("id", clientId);
    }

    // Create invoice items
    for (const item of items) {
      await stripe.invoiceItems.create({
        customer: stripeCustomerId,
        description: item.description,
        amount: Math.round(item.amount * 100),
        currency: "inr",
      });
    }

    // Create invoice in Supabase
    const { data: invoiceData, error: dbError } = await supabase
      .from("invoices")
      .insert({
        invoice_number: `INV-${Date.now()}`,
        project_id: projectId,
        client_id: clientId,
        items: JSON.stringify(items),
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        status: "sent",
        payment_status: "pending",
      });

    if (dbError) {
      console.error("DB error creating invoice:", dbError);
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // in paise
      currency: "inr",
      customer: stripeCustomerId,
      metadata: {
        invoice_number: (invoiceData as any)?.[0]?.invoice_number || `INV-${Date.now()}`,
        project_id: projectId,
        client_id: clientId,
      },
    });

    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      invoiceId: (invoiceData as any)?.[0]?.id,
    }), { status: 200 });

  } catch (error) {
    console.error("Invoice creation error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}