import { createServerSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    redirect(`/auth/signin?redirect_url=/admin`);
  }

  // Check if user has admin role in metadata or database
  let role = (authUser.user_metadata?.role || "").toUpperCase();

  if (role !== "ADMIN") {
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", authUser.id)
      .single();

    role = (userProfile?.role || "").toUpperCase();
  }

  if (role !== "ADMIN") {
    redirect("/");
  }

  // Fetch overview data in parallel with graceful error handling
  let clientsCount = 0;
  let activeProjects = [];
  let pendingInvoices = [];
  let overdueInvoices = [];
  let totalRevenue = 0;

  try {
    const [
      clientsRes,
      projectsRes,
      pendingInvRes,
      overdueInvRes,
      ordersRes,
    ] = await Promise.all([
      supabase.from("clients").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*").eq("status", "active"),
      supabase.from("invoices").select("*").eq("status", "sent").eq("payment_status", "pending"),
      supabase.from("invoices").select("*").eq("status", "sent").eq("payment_status", "overdue"),
      supabase.from("orders").select("total_price, payment_status"),
    ]);

    clientsCount = clientsRes.count || 0;
    activeProjects = projectsRes.data || [];
    pendingInvoices = pendingInvRes.data || [];
    overdueInvoices = overdueInvRes.data || [];

    const paidOrders = (ordersRes.data || []).filter((o: any) => o.payment_status === "paid" || o.payment_status === "deposit_paid");
    totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (Number(o.total_price) || 0), 0);
  } catch (err) {
    console.error("Error loading admin stats:", err);
  }

  return (
    <main className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {authUser.email}</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Clients</h3>
          <p className="text-3xl font-bold text-foreground">{clientsCount}</p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Active Projects</h3>
          <p className="text-3xl font-bold text-foreground">{activeProjects.length}</p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Pending Invoices</h3>
          <p className="text-3xl font-bold text-warning">{pendingInvoices.length}</p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold text-primary">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-display font-semibold">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <Link
              href="/admin/orders"
              className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="font-medium text-foreground text-sm">Review Client Orders</div>
              <div className="text-xs text-muted-foreground">View and manage order verification & deliveries</div>
            </Link>
            <Link
              href="/services"
              className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="font-medium text-foreground text-sm">Services Catalog</div>
              <div className="text-xs text-muted-foreground">Check published service packages and tiers</div>
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h2 className="text-xl font-display font-semibold mb-4">Security & Roles</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Logged in as:</strong> {authUser.email}</p>
            <p><strong>System Role:</strong> <span className="text-primary font-medium">{role}</span></p>
            <p><strong>Backend:</strong> Supabase PostgreSQL with RLS enabled</p>
            <p className="text-xs pt-2">Protected by server-side session authentication and Next.js middleware.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
