import { createServerSupabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { formatINRSimple, calculateDepositINR } from "@/lib/utils";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Clock, Calendar, Download, FileText, ArrowRight, Sparkles } from "lucide-react";
import { GlassCard, GlassPanel, GlassBadge, GlassButton } from "@/components/ui/glisse";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createServerSupabaseClient();
  const { id } = await params;

  // Fetch order details with deliverables
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      deliveries(*),
      invoices(*)
    `)
    .eq("id", id)
    .single();

  if (error || !order) {
    notFound();
  }

  // Mark as viewed
  try {
    await supabase.from("orders").update({ viewed_at: new Date().toISOString() }).eq("id", id);
  } catch (err) {
    console.error("Could not update viewed_at:", err);
  }

  const isPaid = order.payment_status === "paid";
  const isDepositPaid = order.payment_status === "deposit_paid";
  const isPendingVerification = order.payment_status === "pending_verification";

  // Production workflow milestones
  const timelineStages = [
    { label: "Payment", status: isPaid || isDepositPaid ? "completed" : isPendingVerification ? "current" : "pending" },
    { label: "Order Accepted", status: order.status !== "pending" ? "completed" : "current" },
    { label: "In Production", status: ["in_progress", "review", "completed"].includes(order.status) ? "completed" : "pending" },
    { label: "Review & Drafts", status: ["review", "completed"].includes(order.status) ? "completed" : "pending" },
    { label: "Final Master Delivery", status: order.status === "completed" ? "completed" : "pending" },
  ];

  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Confirmation Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <GlassBadge variant={isPaid ? "success" : isPendingVerification ? "warning" : "primary"} size="default" className="mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workspace #{order.id.slice(0, 8)}</span>
          </GlassBadge>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Project Workspace & Status
          </h1>
          <p className="text-xs text-muted-foreground">
            Track real-time production milestones, review watermarked cuts, and access private 4K masters.
          </p>
        </div>

        {/* Milestone Timeline */}
        <div className="mb-10">
          <GlassPanel className="p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Production Pipeline Timeline
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {timelineStages.map((stage, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                      stage.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : stage.status === "current"
                        ? "bg-primary/20 text-primary border border-primary/50 animate-pulse"
                        : "bg-white/5 text-muted-foreground border border-white/5"
                    }`}
                  >
                    {stage.status === "completed" ? "✓" : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-medium leading-tight ${
                      stage.status === "completed" ? "text-foreground font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Order Details & Invoicing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <GlassPanel className="p-7">
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">
                    Service Booked
                  </span>
                  <h2 className="text-2xl font-display font-bold text-foreground capitalize">
                    {order.service_type?.replace(/_/g, " ")}
                  </h2>
                  <span className="text-xs text-primary font-medium">{order.package_tier || "Standard"} Tier</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-foreground">
                    {formatINRSimple(order.total_price)}
                  </span>
                  <GlassBadge variant={isPaid ? "success" : isPendingVerification ? "warning" : "default"} size="sm" className="mt-1">
                    ● {isPaid ? "Paid in Full" : isPendingVerification ? "Verifying Payment" : "Payment Pending"}
                  </GlassBadge>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <strong className="text-foreground block text-xs uppercase tracking-wider mb-1">Creative Brief</strong>
                  <p className="text-muted-foreground leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                    {order.project_description || "Standard catalog production brief."}
                  </p>
                </div>

                {order.client_notes && (
                  <div>
                    <strong className="text-foreground block text-xs uppercase tracking-wider mb-1">Notes & Contact</strong>
                    <p className="text-muted-foreground">{order.client_notes}</p>
                  </div>
                )}
              </div>
            </GlassPanel>

            {/* Deliverables Section */}
            <GlassPanel className="p-7">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-lg text-foreground">
                  Deliverable Files & Masters
                </h3>
                <span className="text-xs text-muted-foreground">Encrypted Cloud Storage</span>
              </div>

              {order.deliveries && order.deliveries.length > 0 ? (
                <div className="space-y-3">
                  {order.deliveries.map((delivery: any) => (
                    <div key={delivery.id} className="p-4 rounded-xl glass-card flex justify-between items-center">
                      <div>
                        <strong className="text-xs font-semibold text-foreground block">{delivery.title || "Production Batch"}</strong>
                        <span className="text-[10px] text-muted-foreground">Version: {delivery.version} • Status: {delivery.status}</span>
                      </div>
                      <GlassButton variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                        Download
                      </GlassButton>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-black/20">
                  <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-muted-foreground">
                    Creators are preparing initial drafts. You will receive an alert once first cuts are uploaded.
                  </p>
                </div>
              )}
            </GlassPanel>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <GlassPanel glow className="p-6">
              <h3 className="font-display font-bold text-lg text-foreground mb-4">
                Next Steps
              </h3>

              {!isPaid && (
                <div className="mb-6 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {isPendingVerification
                      ? "Your transaction reference has been logged. Bank settlement will be verified shortly."
                      : "Deposit payment must be recorded to initiate video editing and cinematography."}
                  </p>
                  <GlassButton
                    href={`/order/pay/${order.id}`}
                    variant="filled"
                    size="default"
                    className="w-full justify-center"
                  >
                    Open Payment Gateway
                  </GlassButton>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 space-y-3">
                <GlassButton
                  href="/dashboard"
                  variant="glass"
                  size="default"
                  className="w-full justify-center"
                >
                  View Client Dashboard
                </GlassButton>
                <GlassButton
                  href="/contact"
                  variant="outline"
                  size="default"
                  className="w-full justify-center"
                >
                  Contact Project Manager
                </GlassButton>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <span className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Escrow Locked • Milestone Protected</span>
                </span>
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </main>
  );
}
