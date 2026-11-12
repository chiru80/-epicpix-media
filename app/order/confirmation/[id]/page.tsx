import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { formatINRSimple, calculateDepositINR, calculateTotalWithGSTINR } from "@/lib/utils";
import Link from "next/link";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();
  const { id } = await params;

  // Fetch order details
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      clients(name, email, phone)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  // Mark as viewed
  supabase.from("orders").update({ viewed_at: new Date().toISOString() }).eq("id", id);

  const { deposit, remaining } = calculateDepositINR(order.total_price);
  const gstDetails = calculateTotalWithGSTINR(order.total_price);

  const paymentStatusConfig = {
    pending: {
      label: "Payment Pending",
      description: "Your order has been created. Please complete the deposit payment to begin work.",
      action: <Link href={`/order/pay/${id}`} className="btn btn-primary w-full">Proceed to Payment ({formatINRSimple(deposit)} deposit)</Link>,
    },
    pending_verification: {
      label: "Payment Submitted - Pending Verification",
      description: "Your payment details have been submitted. Our team will verify within 24 hours.",
      action: <p className="text-center text-muted-foreground">Verification typically completes within 24 business hours.</p>,
    },
    deposit_paid: {
      label: "Deposit Paid - Remaining Balance Due",
      description: "Deposit received. Please pay the remaining balance before delivery.",
      action: <Link href={`/order/pay/${id}`} className="btn btn-primary w-full">Pay Remaining Balance ({formatINRSimple(remaining)})</Link>,
    },
    paid: {
      label: "Paid in Full",
      description: "Payment complete. Your order is being processed.",
      action: <p className="text-center text-success font-medium">All payments received. Work will begin as scheduled.</p>,
    },
    refunded: {
      label: "Refunded",
      description: "This order has been refunded.",
      action: <p className="text-center text-muted-foreground">Refund processed successfully.</p>,
    },
    failed: {
      label: "Payment Failed",
      description: "There was an issue with the payment. Please try again.",
      action: <Link href={`/order/pay/${id}`} className="btn btn-primary w-full">Retry Payment</Link>,
    },
  };

  const paymentConfig = paymentStatusConfig[order.payment_status as keyof typeof paymentStatusConfig] || paymentStatusConfig.pending;

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl md:text-6xl font-display">
            Order Confirmation
          </h1>
          <Link href="/" className="text-muted-foreground hover:underline">
            Back to Services
          </Link>
        </div>

        <div className="p-6 bg-card rounded-xl mb-8">
          <h3 className="text-xl font-display mb-4">
            Order #{order.invoice_number || id.slice(-6)}
          </h3>
          <p className="text-muted-foreground">Status: <span className={order.status === "pending" ? "font-medium text-warning" : order.status === "in_progress" ? "font-medium text-primary" : "font-medium text-success"}>{orderStatusLabel(order.status)}</span></p>
          <p className="text-muted-foreground">Payment: <span className={order.payment_status === "paid" ? "font-medium text-success" : order.payment_status === "deposit_paid" ? "font-medium text-primary" : order.payment_status === "pending_verification" ? "font-medium text-info" : "font-medium text-warning"}>{paymentConfig.label}</span></p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Service</h4>
            <p className="font-medium">{getServiceName(order.service_type)}</p>
            <p className="text-xs text-muted-foreground">{order.package_tier || "N/A"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Total (with GST)</h4>
            <p className="text-2xl font-bold">{formatINRSimple(gstDetails.total)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Deposit</h4>
            <p className="text-lg font-medium">{formatINRSimple(deposit)} ({order.deposit_percentage}%)</p>
            <p className="text-xs text-muted-foreground">Remaining: {formatINRSimple(remaining)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Delivery</h4>
            <p>{order.delivery_deadline ? formatDate(order.delivery_deadline) : "TBD"}</p>
          </div>
        </div>

        {/* Project details */}
        {order.project_description && (
          <div className="mb-8">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Project Description</h4>
            <p className="text-muted-foreground">{order.project_description}</p>
          </div>
        )}

        {/* Files section (once completed) */}
        {order.status === "completed" && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Delivered Files</h4>
            <p className="text-muted-foreground small">{order.files_delivered?.length || 0} file(s) delivered</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {order.files_delivered?.map((file: any, idx: number) => (
                <a
                  key={idx}
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent text-sm underline">
                  {file.file_name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Payment Action */}
        <div className="mt-8 p-6 bg-muted/50 rounded-xl">
          <p className="text-muted-foreground mb-4">{paymentConfig.description}</p>
          {paymentConfig.action}
        </div>

        {order.status === "completed" && (
          <p className="mt-8 text-center text-muted-foreground">
            Thank you for your order! We'd love your feedback.
          </p>
        )}
      </div>
    </section>
  );
}

// Helper functions
const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
};

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

const orderStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    in_progress: "In Progress",
    review: "Under Review",
    revisions: "Revisions",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

const orderPaymentLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: "Pending",
    deposit_paid: "Deposit Paid",
    paid: "Paid in Full",
    refunded: "Refunded",
    failed: "Failed",
    pending_verification: "Pending Verification",
  };
  return labels[status] || status;
};