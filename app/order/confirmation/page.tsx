"use client";

import { useEffect, useState, Suspense } from "react";
import { formatINRSimple, calculateDepositINR, calculateTotalWithGSTINR } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface OrderConfirmationData {
  id: string;
  service_type: string;
  package_tier: string;
  base_price: number;
  add_ons_price: number;
  total_price: number;
  deposit_amount: number;
  remaining_balance: number;
  status: string;
  payment_status: string;
  project_description: string;
  client_notes: string;
  delivery_deadline: string;
  created_at: string;
}

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<OrderConfirmationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.back();
      setOrder(null);
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data, error } = await createClient()
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (error) {
          console.error("Error fetching order:", error);
          router.back();
          setOrder(null);
          setLoading(false);
          return;
        }
        setOrder(data as OrderConfirmationData);
      } catch (err) {
        console.error("Unexpected error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-full border-b-2 border-primary mx-auto mb-6" style={{ width: 40, height: 40 }}></div>
          <h2 className="text-2xl font-display mb-4">Order Details</h2>
          <p className="text-muted-foreground">{loading ? "Loading order..." : "Order not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-block px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { deposit, remaining } = calculateDepositINR(order.total_price);
  const gstDetails = calculateTotalWithGSTINR(order.total_price);

  const formatIndianDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-IN", options);
  };

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 rounded-border border-primary text-primary-foreground hover:bg-primary/10 transition-colors mb-8"
        >
          ← Back to Order Form
        </button>

        <h1 className="text-5xl md:text-6xl font-display mb-8">
          Order Confirmation
        </h1>

        <div className="p-6 bg-card rounded-xl mb-10">
          <h3 className="text-xl font-display mb-4">Order #{order.id.slice(-6)}</h3>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-muted-foreground">Service:</span>
              <span className="font-medium">
                {order.service_type === "thumbnail"
                  ? "Thumbnail Creation"
                  : order.service_type?.includes("video")
                  ? "Video Editing"
                  : "Other"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Package:</span>
              <span className="font-medium">{order.package_tier}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <span className={order.status === "completed"
                ? "font-medium text-primary"
                : order.status === "in_progress"
                ? "font-medium text-primary"
                : order.status === "review"
                ? "font-medium text-primary"
                : "font-medium text-muted-foreground"
              }>{order.status}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Payment:</span>
              <span className={order.payment_status === "paid"
                ? "font-medium text-primary"
                : order.payment_status === "deposit_paid"
                ? "font-medium text-primary"
                : "font-medium text-muted-foreground"
              }>{order.payment_status}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <span className="font-medium text-lg">
              Subtotal: {formatINRSimple(order.base_price + order.add_ons_price)}
              <span className="font-medium ml-2 text-primary">
                + GST 18%: {formatINRSimple(gstDetails.gst)}
              </span>
            </span>
          </div>

          <div className="mt-6 pt-6 border-t">
            <span className="text-sm text-muted-foreground">
              Deposit (25%): {formatINRSimple(deposit)}
              <span className="font-medium ml-2">
                Remaining: {formatINRSimple(remaining)}
              </span>
            </span>
          </div>

          <div className="mt-6 pt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Project Description:
            </p>
            <p className="break-all whitespace-pre-wrap text-sm">{order.project_description}</p>
          </div>

          <div className="mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">
              Delivery By: {formatIndianDate(order.delivery_deadline)}
            </span>
          </div>
        </div>

        <div className="mt-8 p-6 bg-muted/20 rounded-xl">
          <h4 className="text-sm font-display mb-3">Client Notes</h4>
          <p className="text-sm break-all whitespace-pre-wrap">{order.client_notes}</p>
        </div>
      </div>
    </section>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="rounded-full border-b-2 border-primary mx-auto mb-6 animate-spin" style={{ width: 40, height: 40 }}></div>
            <p className="text-muted-foreground">Loading order...</p>
          </div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
