import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

// Admin page component
export default async function AdminPage() {
  const supabase = createClient();
  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (authError || !session) {
    redirect(`/auth/signin?redirect_url=/admin`);
  }

  // Check if user has admin role
  const { data: user } = await supabase.from("users").select("role").eq("id", session.user.id).single();

  if (user?.role !== "admin") {
    redirect("/");
  }

  // Fetch overview data in parallel
  const [
    clientsCountResult,
    activeProjectsResult,
    invoicesPendingResult,
    invoicesOverdueResult
  ] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*").eq("status", "active"),
    supabase.from("invoices").select("*").eq("status", "sent").eq("payment_status", "pending"),
    supabase.from("invoices").select("*").eq("status", "sent").eq("payment_status", "overdue"),
  ]);

  const clientsCount = (clientsCountResult as any).data?.count || 0;
  const activeProjects = (activeProjectsResult as any).data || [];
  const pendingInvoices = (invoicesPendingResult as any).data || [];
  const overdueInvoices = (invoicesOverdueResult as any).data || [];
  const thisMonthRevenue = (invoicesPendingResult as any).data || [];

  return (
    <main className="p-4">
      <h1 className="text-3xl font-display mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl border bg-card">
          <h3 className="text-xl mb-2">Total Clients</h3>
          <p className="text-3xl font-bold">{clientsCount}</p>
        </div>

        <div className="p-6 rounded-xl border bg-card">
          <h3 className="text-xl mb-2">Active Projects</h3>
          <p className="text-3xl font-bold">{activeProjects.length || 0}</p>
        </div>

        <div className="p-6 rounded-xl border bg-card">
          <h3 className="text-xl mb-2">Pending Invoices</h3>
          <p className="text-3xl font-bold pending-badge">{pendingInvoices?.length || 0}</p>
        </div>

        <div className="p-6 rounded-xl border bg-card">
          <h3 className="text-xl mb-2">This Month Revenue</h3>
          <p className="text-3xl font-bold">${(thisMonthRevenue as any[]).reduce((sum, inv) => sum + ((inv as any).total_amount || 0), 0) || 0}</p>
        </div>
      </div>
    </main>
  );
}
