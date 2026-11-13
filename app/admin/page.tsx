import { createServerSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Briefcase, FileText, IndianRupee, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";
import { GlassCard, GlassPanel, GlassBadge, GlassButton } from "@/components/ui/glisse";

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
  let totalRevenue = 0;

  try {
    const [
      clientsRes,
      projectsRes,
      pendingInvRes,
      ordersRes,
    ] = await Promise.all([
      supabase.from("clients").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*").eq("status", "active"),
      supabase.from("invoices").select("*").eq("status", "sent").eq("payment_status", "pending"),
      supabase.from("orders").select("total_price, payment_status"),
    ]);

    clientsCount = clientsRes.count || 0;
    activeProjects = projectsRes.data || [];
    pendingInvoices = pendingInvRes.data || [];

    const paidOrders = (ordersRes.data || []).filter((o: any) => o.payment_status === "paid" || o.payment_status === "deposit_paid");
    totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (Number(o.total_price) || 0), 0);
  } catch (err) {
    console.error("Error loading admin stats:", err);
  }

  return (
    <main className="p-6 sm:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Subtle Glass Admin Header */}
      <GlassPanel className="p-6 mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-display font-bold text-foreground">Platform Administration</h1>
            <GlassBadge variant="primary" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              <span>Full Access</span>
            </GlassBadge>
          </div>
          <p className="text-xs text-muted-foreground">Logged in as {authUser.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <GlassButton href="/admin/orders" variant="filled" size="sm">
            Manage Orders Pipeline
          </GlassButton>
        </div>
      </GlassPanel>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Total Clients</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{clientsCount}</p>
          <span className="text-[10px] text-muted-foreground mt-1 block">Active Profiles</span>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Active Projects</span>
            <Briefcase className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{activeProjects.length}</p>
          <span className="text-[10px] text-sky-400 mt-1 block">In Production</span>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Pending Invoices</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{pendingInvoices.length}</p>
          <span className="text-[10px] text-amber-400 mt-1 block">Awaiting Settlement</span>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Gross Volume</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-display font-bold text-foreground">₹{totalRevenue.toLocaleString("en-IN")}</p>
          <span className="text-[10px] text-emerald-400 mt-1 block">Processed via YouPI</span>
        </GlassCard>
      </div>

      {/* Admin Modules Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="font-display font-bold text-lg text-foreground mb-2">Orders Management</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Inspect all client bookings, review transactions, assign creators, and release delivery milestones.
          </p>
          <Link href="/admin/orders" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            <span>View All Client Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display font-bold text-lg text-foreground mb-2">Creator Marketplace Operations</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Verify newly registered creator profiles, audit portfolio showcases, and configure service catalog pricing.
          </p>
          <Link href="/explore" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            <span>Explore Creator Directory</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </GlassCard>
      </div>
    </main>
  );
}
