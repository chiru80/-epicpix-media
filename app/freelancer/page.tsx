import { createServerSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatINRSimple } from "@/lib/utils";
import { Sparkles, Briefcase, CheckCircle2, Clock, DollarSign, Star, ShieldCheck, ArrowRight, Upload } from "lucide-react";
import { GlassCard, GlassPanel, GlassBadge, GlassButton } from "@/components/ui/glisse";

export const dynamic = "force-dynamic";

export default async function FreelancerDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin?redirect_url=/freelancer");
  }

  const role = (user.user_metadata?.role || "").toUpperCase();
  if (role !== "FREELANCER" && role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch freelancer profile and assigned orders
  let profile: any = null;
  let assignedOrders: any[] = [];

  try {
    const [profileRes, ordersRes] = await Promise.all([
      supabase.from("freelancer_profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("orders").select("*, deliveries(*)").eq("freelancer_id", user.id).order("created_at", { ascending: false }),
    ]);

    profile = profileRes.data;
    assignedOrders = ordersRes.data || [];
  } catch (err) {
    console.error("Freelancer data error:", err);
  }

  const activeOrdersCount = assignedOrders.filter((o) => o.status !== "completed" && o.status !== "cancelled").length;
  const completedDeliveriesCount = assignedOrders.filter((o) => o.status === "completed").length;
  const estimatedRevenue = assignedOrders
    .filter((o) => o.status === "completed" || o.payment_status === "paid")
    .reduce((sum, o) => sum + (Number(o.base_price) || 0), 0);

  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Creator Hub Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
          <div>
            <GlassBadge variant="primary" size="default" className="mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Creator Production Hub</span>
            </GlassBadge>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Welcome, {user.user_metadata?.full_name || user.email?.split("@")[0]}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Deliver assigned client briefs, manage revisions, and track escrow payouts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <GlassBadge variant={profile?.verified ? "primary" : "default"} size="default">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1" />
              <span>{profile?.verified ? "Verified Creator" : "Active Creator"}</span>
            </GlassBadge>
            <GlassBadge variant="success" size="default">
              ● {profile?.availability || "Available for Bookings"}
            </GlassBadge>
          </div>
        </div>

        {/* 4 Metric Glass Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <GlassCard variant="interactive" className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                Earned Revenue
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{formatINRSimple(estimatedRevenue)}</p>
            <span className="text-[10px] text-emerald-400 mt-1 block">Cleared & In Escrow</span>
          </GlassCard>

          <GlassCard variant="interactive" className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                Active Projects
              </span>
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">{activeOrdersCount}</p>
            <span className="text-[10px] text-sky-400 mt-1 block">In Production Queue</span>
          </GlassCard>

          <GlassCard variant="interactive" className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                Completed
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">{completedDeliveriesCount}</p>
            <span className="text-[10px] text-muted-foreground mt-1 block">Delivered Masters</span>
          </GlassCard>

          <GlassCard variant="interactive" className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                Creator Rating
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">
              ★ {profile?.rating ? Number(profile.rating).toFixed(1) : "5.0"}
            </p>
            <span className="text-[10px] text-amber-400 mt-1 block">Top Tier Ranking</span>
          </GlassCard>
        </div>

        {/* Assigned Orders Queue */}
        <GlassPanel className="p-7">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">Assigned Tasks & Deliveries</h2>
              <span className="text-xs text-muted-foreground">Protected by Supabase Row Level Security</span>
            </div>
          </div>

          {assignedOrders.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h3 className="text-lg font-display font-semibold text-foreground mb-1">Queue is Clear</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No orders are currently assigned to your profile. New client orders matched with your skills will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 px-3">Order ID</th>
                    <th className="pb-3 px-3">Service</th>
                    <th className="pb-3 px-3">Client Notes</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Payout</th>
                    <th className="pb-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {assignedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-3 font-mono font-medium text-foreground">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="py-4 px-3 font-medium text-foreground capitalize">
                        {order.service_type?.replace(/_/g, " ")}
                      </td>
                      <td className="py-4 px-3 text-muted-foreground max-w-xs truncate">
                        {order.client_notes || "Standard brief"}
                      </td>
                      <td className="py-4 px-3">
                        <GlassBadge
                          variant={order.status === "completed" ? "success" : "primary"}
                          size="sm"
                        >
                          {order.status}
                        </GlassBadge>
                      </td>
                      <td className="py-4 px-3 font-semibold text-foreground">
                        {formatINRSimple(order.base_price)}
                      </td>
                      <td className="py-4 px-3 text-right">
                        <Link
                          href={`/order/confirmation/${order.id}`}
                          className="inline-flex items-center gap-1 text-primary hover:underline font-semibold text-xs"
                        >
                          <span>Manage Delivery</span>
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
