import { createServerSupabaseClient } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatINRSimple } from "@/lib/utils";
import { ShieldCheck, ArrowLeft, ArrowRight, Eye, Briefcase } from "lucide-react";
import { GlassCard, GlassPanel, GlassBadge, GlassButton } from "@/components/ui/glisse";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/auth/signin?redirect_url=/admin/orders");
  }

  const metaRole = (authUser.user_metadata?.role || "").toUpperCase();
  if (metaRole !== "ADMIN") {
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", authUser.id)
      .single();

    if ((userProfile?.role || "").toUpperCase() !== "ADMIN") {
      redirect("/");
    }
  }

  let orders: any[] = [];
  let count = 0;
  let fetchError: string | null = null;

  try {
    const { data, error, count: totalCount } = await supabase
      .from("orders")
      .select(
        `
        *,
        clients(name, email, company)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      fetchError = error.message;
    } else {
      orders = data || [];
      count = totalCount ?? orders.length;
    }
  } catch (err: any) {
    console.error("Exception fetching orders:", err);
    fetchError = err.message || "Failed to load orders";
  }

  return (
    <main className="p-6 sm:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <GlassPanel className="p-6 mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-display font-bold text-foreground">Orders Pipeline</h1>
            <GlassBadge variant="primary" size="sm">
              <span>{count} Total Orders</span>
            </GlassBadge>
          </div>
          <p className="text-xs text-muted-foreground">Admin order operations and fulfillment monitoring</p>
        </div>

        <GlassButton href="/admin" variant="glass" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
          Back to Overview
        </GlassButton>
      </GlassPanel>

      {fetchError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
          Database note: {fetchError}. Showing cached or local view.
        </div>
      )}

      {/* Orders Data Grid */}
      <GlassPanel className="p-6">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-display font-semibold text-foreground mb-1">No Orders in Database</h3>
            <p className="text-xs text-muted-foreground">Orders placed by clients via the catalog will populate here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-3">#</th>
                  <th className="pb-3 px-3">Order ID</th>
                  <th className="pb-3 px-3">Client Contact</th>
                  <th className="pb-3 px-3">Service & Tier</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">Fulfillment</th>
                  <th className="pb-3 px-3">Payment</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order, idx) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-3 text-muted-foreground">{idx + 1}</td>
                    <td className="py-4 px-3 font-mono font-medium text-foreground">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="py-4 px-3">
                      <div className="font-medium text-foreground">
                        {order.clients?.name || order.client_notes?.split("(")[0]?.replace("Client: ", "") || "Client"}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate max-w-xs">
                        {order.clients?.email || order.client_notes || "—"}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="font-medium text-foreground capitalize block">
                        {order.service_type?.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-primary">{order.package_tier || "Standard"}</span>
                    </td>
                    <td className="py-4 px-3 font-bold text-foreground">
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
                        className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
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
    </main>
  );
}
