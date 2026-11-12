import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = createClient();

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
    <section className="py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-display mb-8">
          Orders Management
        </h1>

        {fetchError && (
          <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/30 text-warning text-sm">
            Database connection note: {fetchError}. Showing cached or empty view.
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display">All Orders ({count || 0})</h2>

          {/* Bulk actions dropdown */}
          <div className="relative">
            <select className="select select-sm border rounded px-3 py-1.5 text-sm bg-card text-foreground">
              <option>Bulk action</option>
              <option>Change status to pending</option>
              <option>Export selected</option>
            </select>
          </div>
        </div>

        {orders.length === 0 && (
          <p className="text-muted-foreground">
            No orders yet.{" "}
            <Link href="/services" className="text-accent hover:underline">
              Add your first service
            </Link>
          </p>
        )}

        {orders.length > 0 && (
          <div className="overflow-x-auto rounded-lg bg-card">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 font-display font-medium text-muted-foreground border-b">
                    #
                  </th>
                  <th className="text-left py-3 px-4 font-display font-medium text-muted-foreground border-b">
                    Client
                  </th>
                  <th className="text-left py-3 px-4 font-display font-medium text-muted-foreground border-b">
                    Service
                  </th>
                  <th className="text-left py-3 px-4 font-display font-medium text-muted-foreground border-b">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 font-display font-medium text-muted-foreground border-b">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-display font-medium text-muted-foreground border-b">
                    Payment
                  </th>
                  <th className="text-left py-3 px-4 font-display font-medium text-muted-foreground border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-card/50 transition-colors"
                  >
                    <td className="py-4 px-4">{index + 1}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium">
                        {order.clients?.name || "Client"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.clients?.company || order.clients?.email || "—"}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize text-muted-foreground">
                        {getServiceName(order.service_type)}
                      </span>
                      {order.package_tier && (
                        <span className="text-xs ml-1 bg-primary/10 text-primary rounded px-1">
                          /{order.package_tier}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium">₹{order.total_price}</span>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-4">
                      <PaymentBadge status={order.payment_status} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/order/confirmation/${order.id}`}
                          className="text-primary text-sm hover:underline"
                          aria-label="View order"
                        >
                          View
                        </Link>
                      </div>
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
    in_progress: "bg-primary/10 text-primary",
    review: "bg-warning/10 text-warning",
    revisions: "bg-primary/10 text-primary",
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
    deposit_paid: "bg-primary/10 text-primary",
    paid: "bg-success/10 text-success",
    refunded: "bg-destructive/10 text-destructive",
    failed: "bg-warning/10 text-warning",
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

// Helper functions
const getServiceName = (service: string): string => {
  const names: Record<string, string> = {
    thumbnail: "Thumbnail",
    video_basic: "Video Editing (Basic)",
    video_pro: "Video Editing (Pro)",
    video_premium: "Video Editing (Premium)",
    color_grading: "Color Grading",
    motion_graphics: "Motion Graphics",
  };
  return names[service] || service;
};
