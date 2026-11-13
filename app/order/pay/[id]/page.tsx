"use client";

import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { formatINRSimple } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";

import Link from "next/link";

export default function OrderPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  // ds-allow-hardcode: Payment method options are business-defined and not configuration-driven
  const paymentMethods = [
    { value: "upi", label: "UPI (Google Pay, PhonePe, Paytm)" },
    { value: "bank_transfer", label: "Bank Transfer (NEFT/IMPS/RTGS)" },
    { value: "card", label: "Credit/Debit Card (Manual)" },
    { value: "cash", label: "Cash Deposit" },
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
          setFetchError("Order not found or database unavailable");
        } else {
          setOrder(orderData);
        }
      } catch (err: any) {
        setFetchError(err.message || "Failed to load order");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchOrder();
  }, [params]);

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-full border-b-2 border-primary mx-auto mb-6 animate-spin" style={{ width: 40, height: 40 }}></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order || fetchError) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-display mb-4">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {fetchError || "The requested order could not be located."}
          </p>
          <Link
            href="/services"
            className="inline-block px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { id } = await params;
    const formData = new FormData(e.currentTarget);
    const paymentMethod = formData.get("paymentMethod");
    const transactionId = formData.get("transactionId");

    if (!paymentMethod) {
      setError("Please select a payment method");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      await supabase
        .from("orders")
        .update({
          payment_status: "pending_verification",
          payment_method: paymentMethod,
          transaction_id: transactionId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      setPaymentSubmitted(true);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit payment details");
      setLoading(false);
    }
  };

  const remaining = order.payment_status === "deposit_paid" ? order.remaining_balance : 0;

  // If already paid or payment submitted, show success
  if (order.payment_status === "paid" || paymentSubmitted) {
    return (
      <section className="py-12 md:py-20 bg-background">
        <div className="max-w-xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-display mb-8">
            Payment {order.payment_status === "paid" ? "Confirmed" : "Submitted for Verification"}
          </h1>

          <div className="p-6 bg-card rounded-xl mb-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Order Total</span>
                <span className="font-medium">{formatINRSimple(order.total_price)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Amount Already Paid</span>
                <span className="font-medium">{order.payment_status === "deposit_paid" ? formatINRSimple(order.deposit_amount) : "0"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium text-2xl font-bold">{formatINRSimple(remaining)}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Your order total of {formatINRSimple(order.total_price)} includes: Base service ({formatINRSimple(order.base_price)}) + Add-ons ({formatINRSimple(order.add_ons_price || 0)}) + Rush delivery (if applicable).
            </p>
          </div>

          {paymentSubmitted && (
            <div className="mt-8 p-4 border border-accent/30 rounded-xl bg-accent/5">
              <p className="text-accent">
                Payment details submitted successfully! Our team will verify your payment within 24 hours.
                You&apos;ll receive a confirmation email once verified.
              </p>
            </div>
          )}

          {order.payment_status === "paid" && (
            <div className="mt-8 p-4 border border-success/30 rounded-xl bg-success/5">
              <p className="text-success">
                Payment successful! Your order is being processed.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <a href={`/order/confirmation/${order.id}`} className="btn btn-primary">
              View Order Confirmation
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="max-w-xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-display mb-8">
          Pay Order {order.id?.slice(0, 8) || "---"}
        </h1>

        {error && (
          <div className="mb-6 p-4 border border-destructive/30 rounded-xl bg-destructive/5">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        <div className="p-6 bg-card rounded-xl mb-8">
          <h3 className="text-xl font-display mb-4">Payment Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Order Total</span>
              <span className="font-medium">{formatINRSimple(order.total_price)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Amount Already Paid</span>
              <span className="font-medium">{order.payment_status === "deposit_paid" ? formatINRSimple(order.deposit_amount) : "0"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Remaining</span>
              <span className="font-medium text-2xl font-bold">{formatINRSimple(remaining)}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Your order total of {formatINRSimple(order.total_price)} includes: Base service ({formatINRSimple(order.base_price)}) + Add-ons ({formatINRSimple(order.add_ons_price || 0)}) + Rush delivery (if applicable).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="input w-full flex items-center justify-between"
                  aria-label="Select payment method"
                >
                  <span>{paymentMethod ? paymentMethods.find(p => p.value === paymentMethod)?.label : "Select payment method"}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-full">
                {paymentMethods.map((method) => (
                  <DropdownMenuItem
                    key={method.value}
                    onSelect={() => setPaymentMethod(method.value)}
                    className={`focus:bg-accent/5 ${paymentMethod === method.value ? "bg-accent/10" : ""}`}
                  >
                    <div className="flex items-center">
                      <span className="flex-1">{method.label}</span>
                      {paymentMethod === method.value && (
                        <span className="text-xs font-medium text-accent">Selected</span>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <input type="hidden" name="paymentMethod" value={paymentMethod} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Transaction ID / Reference Number</label>
            <input
              type="text"
              name="transactionId"
              className="input w-full"
              placeholder="Enter UPI transaction ID, bank reference number, or card last 4 digits"
              required
            />
          </div>

          <div className="p-4 bg-muted rounded-xl">
            <h4 className="font-medium mb-2">Payment Instructions</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              {/* ds-allow-hardcode: Bank account details are business-specific constants */}
              <p><strong>Account Name:</strong> EpicPix Media</p>
              <p><strong>Account Number:</strong> 1234567890</p>
              <p><strong>IFSC:</strong> EPIC0001234</p>
              <p><strong>Bank:</strong> HDFC Bank</p>
              <p><strong>UPI ID:</strong> epicpix@hdfcbank</p>
              <p className="mt-2">Please use your Order ID <strong>{order.id?.slice(0, 8)}</strong> as the payment reference.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Submitting..." : "Submit Payment Details"}
          </button>
        </form>
      </div>
    </section>
  );
}