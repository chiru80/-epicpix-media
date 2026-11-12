export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(dateObj);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Indian Rupee (₹) number formatting utilities
 *
 * Indian numbering system:
 * - 1,00,000 = 1 lakh (100,000)
 * - 10,00,000 = 10 lakh (1,000,000)
 * - 1,00,00,000 = 1 crore (10,000,000)
 */

export function formatINR(amount: number): string {
  // Round to nearest 10
  const rounded = Math.round(amount / 10) * 10;

  if (rounded >= 100000) {
    // Lakhs format: 1,00,000
    const lakhs = Math.floor(rounded / 100000);
    const remainder = rounded % 100000;
    const thousands = Math.floor(remainder / 1000);
    const hundreds = remainder % 1000;

    return `${lakhs},${thousands.toString().padStart(3, "0")},${hundreds
      .toString()
      .padStart(3, "0")}`;
  } else if (rounded >= 1000) {
    // Thousands format: 1,000
    const thousands = Math.floor(rounded / 1000);
    const hundreds = rounded % 1000;

    return `${thousands},${hundreds
      .toString()
      .padStart(3, "0")}`;
  }

  return rounded.toLocaleString("en-IN");
}

export function formatINRSimple(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function calculateDepositINR(totalPrice: number): {
  deposit: number;
  remaining: number;
} {
  const percentage = 25; // 25% deposit
  const deposit = Math.round((totalPrice * percentage) / 100);
  const remaining = totalPrice - deposit;
  return { deposit, remaining };
}

export function calculateGSTINR(amount: number): number {
  // 18% GST on most services
  return Math.round((amount * 18) / 100);
}

export function calculateTotalWithGSTINR(amount: number): {
  subtotal: number;
  gst: number;
  total: number;
} {
  const gst = calculateGSTINR(amount);
  const total = amount + gst;
  return { subtotal: amount, gst, total };
}
