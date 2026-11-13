import { createServerSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatINRSimple } from "@/lib/utils";
import { Sparkles, Briefcase, CheckCircle2, Clock, CreditCard, ArrowRight, ShieldCheck, Plus } from "lucide-react";
import { GlassCard, GlassPanel, GlassBadge, GlassButton } from "@/components/ui/glisse";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin?redirect_url=/dashboard");
  }

  // Fetch client orders (RLS ensures client only reads their own orders)
  let orders: any[] = [];
  try {
    const { data } = await supabase
      .from("orders")
      .select("*, payments(*), invoices(*)")
      .or(`client_id.eq.${user.id},client_notes.ilike.%${user.email}%`)
      .order("created_at", { ascending: false });

    orders = data || [];
  } catch (err) {
    console.error("Dashboard error:", err);
  }

  const activeOrdersCount = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled").length;
  const completedOrdersCount = orders.filter((o) => o.status === "completed").length;
  const pendingPaymentsCount = orders.filter((o) => o.payment_status === "pending" || o.payment_status === "pending_verification").length;
  const totalInvested = orders
    .filter((o) => o.payment_status === "paid" || o.payment_status === "deposit_paid")
    .reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);

  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
          <div>
            <GlassBadge variant="primary" size="default" className="mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Client Command Center</span>
            </GlassBadge>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Welcome back, {user.user_metadata?.full_name || user.email?.split("@")[0]}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Track project milestones, review edits, and manage YouPI payments.
            </p>
          </div>

          <div className="flex gap-3">
            <GlassButton
              href="/order/configure"
              variant="filled"
              size="default"
              icon={<Plus className="w-4 h-4" />}
            >
              Order New Service
            </GlassButton>
          </div>
        </div>

        {/* 4 Metric Glass Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <GlassCard variant="interactive" className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                Active Orders
              </span>
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">{activeOrdersCount}</p>
            <span className="text-[10px] text-sky-400 mt-1 block">In Production Pipeline</span>
          </GlassCard>

          <GlassCard variant="interactive" className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                Completed
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">{completedOrdersCount}</p>
            <span className="text-[10px] text-emerald-400 mt-1 block">4K Masters Released</span>
          </GlassCard>

          <GlassCard variant="interactive" className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                Pending Actions
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">{pendingPaymentsCount}</p>
            <span className="text-[10px] text-amber-400 mt-1 block">Awaiting Verification</span>
          </GlassCard>

          <GlassCard variant="interactive" className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                Total Spend
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{formatINRSimple(totalInvested)}</p>
            <span className="text-[10px] text-muted-foreground mt-1 block">Protected in Escrow</span>
          </GlassCard>
        </div>

        {/* Orders Table Container */}
        <GlassPanel className="p-7">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">Your Production Orders</h2>
              <span className="text-xs text-muted-foreground">Data isolated by Supabase Row Level Security</span>
            </div>
            <GlassBadge variant="primary" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              <span>Authenticated Client</span>
            </GlassBadge>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h3 className="text-lg font-display font-semibold text-foreground mb-1">No Orders Yet</h3>
              <p className="text-xs text-muted-foreground mb-6 max-w-sm mx-auto">
                Select from thumbnail design, 4K commercial videos, or drone cinematography.
              </p>
              <GlassButton href="/services" variant="filled" size="default">
                Browse Production Catalog
              </GlassButton>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 px-3">Order ID</th>
                    <th className="pb-3 px-3">Service</th>
                    <th className="pb-3 px-3">Package</th>
                    <th className="pb-3 px-3">Amount</th>
                    <th className="pb-3 px-3">Production Status</th>
                    <th className="pb-3 px-3">Payment Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-3 font-mono font-medium text-foreground">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="py-4 px-3 font-medium text-foreground capitalize">
                        {order.service_type?.replace(/_/g, " ")}
                      </td>
                      <td className="py-4 px-3 text-muted-foreground">
                        {order.package_tier || "Standard"}
                      </td>
                      <td className="py-4 px-3 font-semibold text-foreground">
                        {formatINRSimple(order.total_price)}
                      </td>
                      <td className="py-4 px-3">
                        <GlassBadge
                          variant={order.status === "completed" ? "success" : order.status === "in_progress" ? "primary" : "default"}
                          size="sm"
                        >
                          {order.status}
                        </GlassBadge>
                      </td>
                      <td className="py-4 px-3">
                        <GlassBadge
                          variant={order.payment_status === "paid" ? "success" : order.payment_status === "pending_verification" ? "warning" : "default"}
                          size="sm"
                        >
                          {order.payment_status?.replace(/_/g, " ")}
                        </GlassBadge>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <Link
                          href={`/order/confirmation/${order.id}`}
                          className="inline-flex items-center gap-1 text-primary hover:underline font-semibold text-xs"
                        >
                          <span>Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassPanel>
      </div>
    </main>
  );
}
