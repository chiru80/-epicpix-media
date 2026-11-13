import { createServerSupabaseClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    <section className="py-12 md:py-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Orders Management
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Review, track, and update client orders</p>
          </div>
          <Link
            href="/admin"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {fetchError && (
          <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/30 text-warning text-sm">
            Database note: {fetchError}. Showing cached or empty view.
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display font-semibold text-lg">All Orders ({count || 0})</h2>

          {/* Bulk actions dropdown */}
          <div className="relative">
            <select className="select select-sm border border-border rounded px-3 py-1.5 text-sm bg-card text-foreground">
              <option>Bulk actions</option>
              <option>Export CSV</option>
            </select>
          </div>
        </div>

        {orders.length === 0 && (
          <div className="p-8 border border-border rounded-xl bg-card text-center">
            <p className="text-muted-foreground mb-4">No orders placed yet.</p>
            <Link href="/services" className="text-primary hover:underline font-medium text-sm">
              Browse Services
            </Link>
          </div>
        )}

        {orders.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left py-3.5 px-4 font-display font-medium text-muted-foreground">
                    #
                  </th>
                  <th className="text-left py-3.5 px-4 font-display font-medium text-muted-foreground">
                    Client
                  </th>
                  <th className="text-left py-3.5 px-4 font-display font-medium text-muted-foreground">
                    Service
                  </th>
                  <th className="text-left py-3.5 px-4 font-display font-medium text-muted-foreground">
                    Total
                  </th>
                  <th className="text-left py-3.5 px-4 font-display font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3.5 px-4 font-display font-medium text-muted-foreground">
                    Payment
                  </th>
                  <th className="text-left py-3.5 px-4 font-display font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-card/50 transition-colors"
                  >
                    <td className="py-4 px-4 text-muted-foreground">{index + 1}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-foreground">
                        {order.clients?.name || "Client"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.clients?.company || order.clients?.email || order.client_notes || "—"}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize font-medium text-foreground">
                        {getServiceName(order.service_type)}
                      </span>
                      {order.package_tier && (
                        <span className="text-xs ml-1 bg-primary/10 text-primary rounded px-1.5 py-0.5">
                          {order.package_tier}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-semibold text-foreground">
                      ₹{Number(order.total_price).toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-4">
                      <PaymentBadge status={order.payment_status} />
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        href={`/order/confirmation/${order.id}`}
                        className="text-primary text-sm font-medium hover:underline"
                        aria-label="View order"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

// Status badge component
function StatusBadge({
  status,
}: {
  status: string;
}) {
  const variants: Record<string, string> = {
    pending: "bg-gray-100 text-gray-800",
    approved: "bg-primary/10 text-primary",
    in_progress: "bg-blue-100 text-blue-800",
    review: "bg-warning/10 text-warning",
    revisions: "bg-purple-100 text-purple-800",
    completed: "bg-success/10 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  };

  const baseClass = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  const label = status
    ? status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Unknown";

  return (
    <span className={cn(baseClass, variants[status] || "bg-gray-100 text-gray-800")}>
      {label}
    </span>
  );
}

// Payment badge component
function PaymentBadge({
  status,
}: {
  status: string;
}) {
  const variants: Record<string, string> = {
    pending: "bg-gray-100 text-gray-800",
    payment_pending: "bg-warning/10 text-warning",
    deposit_paid: "bg-blue-100 text-blue-800",
    paid: "bg-success/10 text-success",
    refunded: "bg-destructive/10 text-destructive",
    failed: "bg-destructive/10 text-destructive",
    pending_verification: "bg-warning/10 text-warning",
  };

  const baseClass = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  const label = status
    ? status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Unknown";

  return (
    <span className={cn(baseClass, variants[status] || "bg-gray-100 text-gray-800")}>
      {label}
    </span>
  );
}

const getServiceName = (service: string): string => {
  const names: Record<string, string> = {
    thumbnail: "Thumbnail Creation",
    video_basic: "Video Editing (Basic)",
    video_pro: "Video Editing (Pro)",
    video_premium: "Video Editing (Premium)",
    color_grading: "Color Grading",
    motion_graphics: "Motion Graphics",
  };
  return names[service] || service;
};
