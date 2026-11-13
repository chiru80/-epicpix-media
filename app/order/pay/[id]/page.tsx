"use client";

import { createClient } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { formatINRSimple } from "@/lib/utils";
import Link from "next/link";
import { ShieldCheck, Copy, CheckCircle2, Clock, QrCode, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { GlassCard, GlassPanel, GlassBadge, GlassButton } from "@/components/ui/glisse";

export default function OrderPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [copiedUpi, setCopiedUpi] = useState(false);

  const paymentMethods = [
    { value: "upi", label: "Instant UPI (GPay, PhonePe, Paytm, CRED)", fee: "Zero Fee" },
    { value: "bank_transfer", label: "Direct Bank Transfer (NEFT / IMPS)", fee: "Instant" },
    { value: "card", label: "Corporate Credit / Debit Card", fee: "Standard" },
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { id } = await params;
        const supabase = createClient();
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .single();

        if (orderError) {
          console.error(orderError);
          setFetchError("Order not found or database record inaccessible.");
        } else {
          setOrder(orderData);
        }
      } catch (err: any) {
        setFetchError(err.message || "Failed to load order.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchOrder();
  }, [params]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { id } = await params;
    const formData = new FormData(e.currentTarget);
    const selectedMethod = formData.get("paymentMethod") as string;
    const transactionId = formData.get("transactionId") as string;

    if (!selectedMethod) {
      setError("Please select a payment method.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "pending_verification",
          client_notes: `${order.client_notes || ""} | Submitted Ref: ${transactionId} via ${selectedMethod}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) throw updateError;

      setPaymentSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit transaction reference.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <main className="min-h-screen bg-background py-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Securing transaction terminal...</p>
        </div>
      </main>
    );
  }

  if (!order || fetchError) {
    return (
      <main className="min-h-screen bg-background py-24 flex items-center justify-center px-4">
        <GlassPanel className="p-8 max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Order Not Located</h2>
          <p className="text-xs text-muted-foreground mb-6">{fetchError}</p>
          <GlassButton href="/services" variant="filled" size="default">
            Return to Catalog
          </GlassButton>
        </GlassPanel>
      </main>
    );
  }

  // Determine current lifecycle step based on real database state
  const isPaid = order.payment_status === "paid";
  const isVerifying = order.payment_status === "pending_verification" || paymentSubmitted;
  const isDepositPaid = order.payment_status === "deposit_paid";

  const paymentSteps = [
    { label: "Payment Pending", active: true, completed: isVerifying || isPaid || isDepositPaid },
    { label: "Payment Detected", active: isVerifying || isPaid || isDepositPaid, completed: isVerifying || isPaid },
    { label: "Verifying Payment", active: isVerifying && !isPaid, completed: isPaid },
    { label: "Payment Confirmed", active: isPaid, completed: isPaid },
    { label: "Order Confirmed", active: isPaid, completed: isPaid },
  ];

  const payableAmount = order.deposit_amount > 0 && !isDepositPaid ? order.deposit_amount : order.total_price;

  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Terminal Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <GlassBadge variant="primary" size="default" className="mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>YouPI-PG Escrow Terminal</span>
          </GlassBadge>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Order Payment #{order.id?.slice(0, 8)}
          </h1>
          <p className="text-xs text-muted-foreground">
            Funds are locked in milestone escrow and disbursed to creators only after you accept deliverables.
          </p>
        </div>

        {/* State Machine Progress Bar */}
        <div className="mb-10">
          <GlassCard className="p-4 sm:p-6">
            <div className="grid grid-cols-5 gap-2 text-center">
              {paymentSteps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all ${
                      step.completed
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : step.active
                        ? "bg-primary/20 text-primary border border-primary/50 ring-2 ring-primary/20 animate-pulse"
                        : "bg-white/5 text-muted-foreground border border-white/5"
                    }`}
                  >
                    {step.completed ? "✓" : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-medium leading-tight ${
                      step.active || step.completed ? "text-foreground font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Verification Alert Banner if submitted */}
        {(paymentSubmitted || order.payment_status === "pending_verification") && !isPaid && (
          <div className="mb-8 p-5 rounded-2xl glass-card border-sky-400/30 bg-sky-950/40 text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-sky-300 font-semibold text-sm">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Reference Submitted — Bank Verification In Progress</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">
              Our automated YouPI webhook listener validates UTR / transaction IDs in real-time. Once the gateway confirms settlement, your milestone activates immediately.
            </p>
            <div className="pt-2">
              <GlassButton href={`/order/confirmation/${order.id}`} variant="glass" size="sm">
                View Confirmation Timeline
              </GlassButton>
            </div>
          </div>
        )}

        {isPaid && (
          <div className="mb-8 p-5 rounded-2xl glass-card border-emerald-400/30 bg-emerald-950/40 text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-emerald-300 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Payment Confirmed by YouPI Server</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your production order has been confirmed and assigned to the production pipeline.
            </p>
            <div className="pt-2">
              <GlassButton href={`/order/confirmation/${order.id}`} variant="filled" size="sm">
                Go to Order Project Workspace
              </GlassButton>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Method Selector & Gateway Panel */}
          <div className="lg:col-span-2 space-y-6">
            <GlassPanel className="p-7">
              <h3 className="font-display font-bold text-lg text-foreground mb-4">
                Select Payment Channel
              </h3>

              <div className="space-y-3 mb-8">
                {paymentMethods.map((m) => (
                  <div
                    key={m.value}
                    onClick={() => setPaymentMethod(m.value)}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === m.value
                        ? "bg-primary/15 border-primary/50 text-foreground ring-1 ring-primary/30"
                        : "bg-black/30 border-white/5 text-muted-foreground hover:border-white/15"
                    }`}
                  >
                    <div>
                      <strong className="text-sm font-semibold text-foreground block">{m.label}</strong>
                      <span className="text-xs text-muted-foreground">{m.fee}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === m.value ? "border-primary bg-primary" : "border-white/20"
                      }`}
                    >
                      {paymentMethod === m.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* UPI Quick Pay Box */}
              {paymentMethod === "upi" && (
                <div className="p-5 rounded-xl bg-black/40 border border-white/10 mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground block font-semibold">
                        Official Merchant VPA
                      </span>
                      <strong className="text-base text-foreground font-mono">epicpix@hdfcbank</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("epicpix@hdfcbank")}
                      className="px-3 py-1.5 rounded-lg glass-card border-white/10 text-xs font-semibold text-sky-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      {copiedUpi ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? "Copied" : "Copy VPA"}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Open any UPI App (GPay, PhonePe, Paytm, BHIM, CRED), transfer <strong>{formatINRSimple(payableAmount)}</strong>, and paste the 12-digit UTR / Transaction Reference below.
                  </p>
                </div>
              )}

              {/* Form to submit transaction ID */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="paymentMethod" value={paymentMethod} />

                <div>
                  <label htmlFor="transactionId" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                    UTR / Transaction Reference Number *
                  </label>
                  <input
                    id="transactionId"
                    name="transactionId"
                    type="text"
                    required
                    disabled={isPaid}
                    placeholder="e.g. 412589632145 (12-digit UPI UTR or bank reference)"
                    className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-all font-mono"
                  />
                  {error && <p className="text-xs text-destructive mt-1">{error}</p>}
                </div>

                {!isPaid && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 shadow-lg shadow-primary/25 border border-primary/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Submitting to YouPI...</span>
                    ) : (
                      <>
                        <span>Submit for Verification</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </form>
            </GlassPanel>
          </div>

          {/* Amount Due & Bank Breakdown Sidebar */}
          <div className="space-y-6">
            <GlassPanel glow className="p-6">
              <h3 className="font-display font-bold text-lg text-foreground mb-4">
                Payable Amount
              </h3>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6 text-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider block">
                  {order.deposit_amount > 0 ? "Initial Escrow Deposit (25%)" : "Total Amount Due"}
                </span>
                <span className="text-3xl font-display font-bold text-foreground">
                  {formatINRSimple(payableAmount)}
                </span>
              </div>

              <div className="space-y-2.5 text-xs pb-4 border-b border-white/10">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Type</span>
                  <span className="text-foreground font-medium uppercase">{order.service_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Total with Tax</span>
                  <span className="text-foreground font-medium">{formatINRSimple(order.total_price)}</span>
                </div>
                {order.remaining_balance > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Balance on Delivery</span>
                    <span>{formatINRSimple(order.remaining_balance)}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-2 text-xs">
                <strong className="text-foreground block text-xs uppercase tracking-wider mb-2">Beneficiary Bank</strong>
                <div className="text-muted-foreground space-y-1">
                  <p>A/C Name: <strong>EpicPix Media Private Limited</strong></p>
                  <p>A/C No: <strong className="font-mono text-foreground">1234567890</strong></p>
                  <p>IFSC: <strong className="font-mono text-foreground">EPIC0001234</strong></p>
                  <p>Bank: HDFC Bank, Mumbai</p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </main>
  );
}
