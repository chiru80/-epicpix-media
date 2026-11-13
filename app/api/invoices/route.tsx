import { createClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const supabase = createClient();

  try {
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(invoices), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const body = await request.json();
    const { projectId, clientId, items, taxRate = 0.18 } = body;

    // Calculate amounts
    const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const totalAmount = subtotal + taxAmount;

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
      return new Response(JSON.stringify({ error: dbError.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        invoiceId: (invoiceData as any)?.[0]?.id,
        invoiceNumber: (invoiceData as any)?.[0]?.invoice_number,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Invoice creation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
