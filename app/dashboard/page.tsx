import { createServerSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatINRSimple } from "@/lib/utils";

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

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Client Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome, {user.user_metadata?.full_name || user.email}
            </p>
          </div>
          <Link
            href="/services"
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            + Order New Service
          </Link>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Active Orders
            </h3>
            <p className="text-3xl font-bold text-foreground">
              {orders.filter((o) => o.status !== "completed" && o.status !== "cancelled").length}
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Completed Projects
            </h3>
            <p className="text-3xl font-bold text-primary">
              {orders.filter((o) => o.status === "completed").length}
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Account Role
            </h3>
            <p className="text-3xl font-bold text-foreground">
              {user.user_metadata?.role || "CLIENT"}
            </p>
          </div>
        </div>

        {/* Orders list */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-display font-semibold text-foreground">My Orders</h2>
            <span className="text-xs text-muted-foreground font-medium">Protected by Supabase RLS</span>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-4">You haven&apos;t placed any orders yet.</p>
              <Link
                href="/services"
                className="inline-block px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
              >
                Browse Services Catalog
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {orders.map((order) => (
                <div key={order.id} className="p-6 flex flex-col md:flex-row justify-between gap-4 hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-foreground capitalize">
                        {order.service_type?.replace(/_/g, " ")}
                      </span>
                      {order.package_tier && (
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                          {order.package_tier}
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium uppercase">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Order ID: #{order.id.slice(0, 8)}</p>
                    {order.project_description && (
                      <p className="text-sm text-foreground/80 mt-2 line-clamp-2 max-w-xl">
                        {order.project_description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col md:items-end justify-between gap-2">
                    <div className="text-lg font-bold text-foreground">
                      {formatINRSimple(order.total_price)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Payment: <span className="font-medium text-foreground">{order.payment_status}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {order.payment_status !== "paid" && (
                        <Link
                          href={`/order/pay/${order.id}`}
                          className="px-3 py-1.5 rounded text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Make Payment
                        </Link>
                      )}
                      <Link
                        href={`/order/confirmation/${order.id}`}
                        className="px-3 py-1.5 rounded text-xs font-medium border border-border hover:bg-muted text-foreground"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

