import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "destructive";
}

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  // ds-allow-hardcode: status badge variants map semantic status to color tokens
  const variants = {
    pending: "bg-muted text-muted-foreground",
    approved: "bg-primary/10 text-primary",
    in_progress: "bg-primary/10 text-primary",
    review: "bg-warning/10 text-warning",
    revisions: "bg-primary/10 text-primary",
    completed: "bg-success/10 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  };

  const baseClass = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  return (
    <span className={cn(baseClass, variants[status])}>
      {status.split("_").map((word, idx) => {
        return idx === 0 ? word : ` ${word.charAt(0).toUpperCase() + word.slice(1)}`;
      }).join("")}
    </span>
  );
}

interface PaymentBadgeProps {
  status: string;
}

export function PaymentBadge({ status }: PaymentBadgeProps) {
  // ds-allow-hardcode: payment badge variants map semantic status to color tokens
  const variants = {
    pending: "bg-muted text-muted-foreground",
    deposit_paid: "bg-primary/10 text-primary",
    paid: "bg-success/10 text-success",
    refunded: "bg-destructive/10 text-destructive",
    failed: "bg-warning/10 text-warning",
  };

  const baseClass = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  return (
    <span className={cn(baseClass, variants[status])}>
      {status.split("_").map((word, idx) => {
        return idx === 0 ? word : ` ${word.charAt(0).toUpperCase() + word.slice(1)}`;
      }).join("")}
    </span>
  );
}