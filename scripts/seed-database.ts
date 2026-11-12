import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function seedDatabase() {
  console.log("Seeding EpicPix Media database...");

  // 1. Create clients (sample data)
  const { error: clientsError } = await supabase
    .from("clients")
    .insert([
      {
        name: "Acme Corp",
        email: "contact@acme-corp.com",
        phone: "+1 (555) 123-4567",
        company: "Acme Corporation",
        industry: "corporate",
        status: "active",
        source: "website",
        contact_person: "Sarah Johnson",
        notes: "Initial inquiry about corporate promotional video. Followed up with call on Jan 15. Sent proposal on Jan 20.",
        project_history: JSON.stringify([
          { date: "2024-01-15", type: "call", topic: "discussion", follow_up: "send proposal", completed: true },
          { date: "2024-01-20", type: "email", topic: "proposal sent", follow_up: "awaiting signature", completed: false }
        ])
      },
      {
        name: "Luna Cosmetics",
        email: "hello@lunacosmetics.com",
        phone: "+1 (555) 987-6543",
        company: "Luna Cosmetics",
        industry: "beauty",
        status: "completed",
        source: "referral",
        contact_person: "Marcus Chen",
        notes: "Product photography project. Completed deliverables on time. Client very satisfied.",
        project_history: JSON.stringify([
          { date: "2024-03-01", type: "call", topic: "initial discovery", follow_up: "schedule shoot", completed: true },
          { date: "2024-03-15", type: "call", topic: "photo shoot", follow_up: "delivery", completed: true }
        ])
      }
    ]);

  if (clientsError) {
    console.error("Error seeding clients:", clientsError);
    return;
  }
  console.log("Clients seeded successfully");

  // 2. Create projects (sample data)
  const { error: projectsError } = await supabase
    .from("projects")
    .insert([
      {
        title: "Corporate Promo Video",
        description: "A 3-minute corporate promotional video for Acme Corp's new product line launch.",
        category: "video",
        status: "active",
        deposit_paid: true,
        deposit_amount: 2500,
        total_project_fee: 10000,
        payment_schedule: JSON.stringify([
          { milestone: "deposit", percentage: 25, due_date: "2024-01-15", status: "paid" },
          { milestone: "m1", percentage: 30, due_date: "2024-02-15", status: "pending" },
          { milestone: "m2", percentage: 25, due_date: "2024-03-15", status: "pending" },
          { milestone: "final", percentage: 20, due_date: "2024-04-01", status: "pending" }
        ]),
        total_paid: 3500,
        amount_remaining: 6500,
        started_at: new Date("2024-01-20").toISOString(),
        client_id: "client-1"
      },
      {
        title: "Product Photography",
        description: "Lifestyle and product photography for Luna Cosmetics new skincare line.",
        category: "photography",
        status: "completed",
        deposit_paid: true,
        deposit_amount: 1500,
        total_project_fee: 5000,
        payment_schedule: JSON.stringify([
          { milestone: "deposit", percentage: 30, due_date: "2024-03-01", status: "paid" },
          { milestone: "m1", percentage: 40, due_date: "2024-04-01", status: "paid" },
          { milestone: "final", percentage: 30, due_date: "2024-05-01", status: "paid" }
        ]),
        total_paid: 5000,
        amount_remaining: 0,
        started_at: new Date("2024-03-15").toISOString(),
        client_id: "client-2"
      }
    ]);

  if (projectsError) {
    console.error("Error seeding projects:", projectsError);
    return;
  }
  console.log("Projects seeded successfully");

  // 3. Create invoices (sample data)
  const { error: invoicesError } = await supabase
    .from("invoices")
    .insert([
      {
        invoice_number: "INV-2024-001",
        project_id: "proj-1",
        client_id: "client-1",
        issue_date: new Date("2024-01-20").toISOString().split("T")[0],
        due_date: new Date("2024-02-15").toISOString().split("T")[0],
        status: "sent",
        payment_status: "partial",
        items: JSON.stringify([
          { description: "Project deposit", quantity: 1, rate: 2500, amount: 2500 }
        ]),
        subtotal: 2500,
        tax_rate: 0.18,
        tax_amount: 450,
        total_amount: 2950
      },
      {
        invoice_number: "INV-2024-002",
        project_id: "proj-2",
        client_id: "client-2",
        issue_date: new Date("2024-03-15").toISOString().split("T")[0],
        due_date: new Date("2024-04-15").toISOString().split("T")[0],
        status: "paid",
        payment_status: "paid",
        items: JSON.stringify([
          { description: "Full project fee", quantity: 1, rate: 5000, amount: 5000 }
        ]),
        subtotal: 5000,
        tax_rate: 0.18,
        tax_amount: 900,
        total_amount: 5900
      }
    ]);

  if (invoicesError) {
    console.error("Error seeding invoices:", invoicesError);
    return;
  }
  console.log("Invoices seeded successfully");

  console.log("\nDatabase seeding complete!");
}

seedDatabase().catch(console.error);