import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users, ShoppingCart, CheckCircle, IndianRupee, List, User, CreditCard, FileText } from "lucide-react";

// Admin dashboard component
export default async function AdminDashboardPage() {
  const supabase = createClient();

  // Get session
  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (authError || !session) {
    redirect(`/auth/signin?redirect_url=/admin/dashboard`);
  }

  // Check if user has admin role using service client (full access)
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", session.user.id)
    .single();

  if (userError || user?.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch overview data in parallel
  const { data: usersCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  const { data: ordersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { data: completedOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  const { data: revenueResult } = await supabase
    .from("payments")
    .select("amount")
    .eq("verification_status", "verified")
    .eq("status", "paid");

  const usersCountValue = (usersCount as any)?.count || 0;
  const totalOrders = (ordersCount as any)?.count || 0;
  const completedCount = (completedOrders as any)?.count || 0;
  const totalRevenue = (revenueResult as any[])?.reduce(
    (sum: number, p: any) => sum + (Number(p.amount) || 0),
    0
  ) || 0;

  // Format revenue in Lakhs
  const revenueLakhs = (totalRevenue / 100000).toFixed(1);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, <span className="font-medium">{user?.full_name || "Admin"}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={usersCountValue}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <StatCard
          title="Completed"
          value={completedCount}
          icon={<CheckCircle className="h-5 w-5" />}
          className="text-success"
        />
        <StatCard
          title="Revenue"
          value={`₹${revenueLakhs}L`}
          icon={<IndianRupee className="h-5 w-5" />}
          className="text-primary"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Actions Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-display font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/orders" className="block">
              <Button variant="default" className="w-full justify-start">
                <List className="mr-2 h-4 w-4" />
                Manage Orders
              </Button>
            </Link>
            <Link href="/admin/users" className="block">
              <Button variant="secondary" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/payments" className="block">
              <Button variant="default" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                View Payments
              </Button>
            </Link>
            <Link href="/admin/invoices" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View Invoices
              </Button>
            </Link>
          </div>
        </div>

        {/* System Info Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-display font-semibold mb-4">System Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Logged in as</span>
              <span className="font-medium text-foreground">{user?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium text-foreground text-sm">{session.user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role</span>
              <span className="inline-block px-2 py-0.5 rounded-md bg-primary/10 text-primary text-sm font-medium">
                {user?.role}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-muted-foreground">Backend</span>
              <span className="text-sm">Supabase PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-display font-semibold mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>No recent activity to display</p>
          <Link href="/admin/logs" className="mt-2 inline-block text-primary hover:underline text-sm">
            View audit logs
          </Link>
        </div>
      </div>
    </div>
  );
}

// Simple stat card component
function StatCard({
  title,
  value,
  icon,
  className = ""
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border bg-card p-4 sm:p-6", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold">{value}</p>
        </div>
        {icon && (
          <div className="text-muted-foreground">{icon}</div>
        )}
      </div>
    </div>
  );
}