import { createServerSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatINRSimple } from "@/lib/utils";

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

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Creator Hub
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome back, {user.user_metadata?.full_name || user.email}
            </p>
          </div>
          <div className="flex gap-3">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {profile?.verified ? "✓ Verified Creator" : "Active Creator"}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Assigned Orders
            </h3>
            <p className="text-3xl font-bold text-foreground">{assignedOrders.length}</p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Completed Deliveries
            </h3>
            <p className="text-3xl font-bold text-primary">
              {assignedOrders.filter((o) => o.status === "completed").length}
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Rating
            </h3>
            <p className="text-3xl font-bold text-foreground">
              ★ {profile?.rating ? Number(profile.rating).toFixed(1) : "5.0"}
            </p>
          </div>
        </div>

        {/* Assigned Orders */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-display font-semibold text-foreground">Assigned Tasks & Deliveries</h2>
            <span className="text-xs text-muted-foreground font-medium">Supabase RLS Protected</span>
          </div>

          {assignedOrders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No orders currently assigned to your queue.</p>
              <p className="text-xs text-muted-foreground mt-1">Admin will assign incoming client bookings here.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {assignedOrders.map((order) => (
                <div key={order.id} className="p-6 flex flex-col md:flex-row justify-between gap-4 hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-foreground capitalize">
                        {order.service_type?.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium uppercase">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Order ID: #{order.id.slice(0, 8)}</p>
                    {order.project_description && (
                      <p className="text-sm text-foreground/80 mt-2 max-w-xl">
                        {order.project_description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col md:items-end justify-between gap-2">
                    <div className="text-base font-semibold text-foreground">
                      Total: {formatINRSimple(order.total_price)}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Link
                        href={`/order/confirmation/${order.id}`}
                        className="px-3 py-1.5 rounded text-xs font-medium border border-border hover:bg-muted text-foreground"
                      >
                        Order Brief
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

