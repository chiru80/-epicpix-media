/**
 * Format a number as currency
 * @param amount - Amount in major units (e.g., 50000 for ₹50,000)
 * @param currency - Currency code (default: INR)
 */
export function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date in Indian style
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(dateObj);
}

/**
 * Convert paise to rupees for display
 * @param paise - Amount in paise (smallest unit)
 */
export function paiseToRupees(paise: number | string): number {
  const paiseNum = typeof paise === "string" ? parseInt(paise, 10) : paise;
  return Math.round(paiseNum) / 100;
}

/**
 * Convert rupees to paise for storage
 * @param rupees - Amount in rupees
 */
export function rupeesToPaise(rupees: number | string): number {
  const rupeesNum = typeof rupees === "string" ? parseFloat(rupees) : rupees;
  return Math.round(rupeesNum * 100);
}

/**
 * Format amount in paise as rupee display string
 * @param paise - Amount in paise (smallest unit)
 */
export function formatINR(paise: number | string | null | undefined): string {
  if (paise === null || paise === undefined) return "₹0";
  const rupees = paiseToRupees(paise);
  if (isNaN(rupees) || rupees === 0) return "₹0";
  return `₹${rupees.toLocaleString("en-IN")}`;
}

/**
 * Format amount in paise as simple rupee display string (no currency symbol)
 * @param paise - Amount in paise (smallest unit)
 */
export function formatINRSimple(paise: number | string): string {
  const rupees = paiseToRupees(paise);
  if (isNaN(rupees)) return "0";
  return rupees.toLocaleString("en-IN");
}

/**
 * Calculate deposit amount (25% of total)
 * @param totalPaise - Total amount in paise
 * @returns Object with deposit and remaining in paise
 */
export function calculateDeposit(totalPaise: number | string): { deposit: number; remaining: number } {
  const total = typeof totalPaise === "string" ? parseInt(totalPaise, 10) : totalPaise;
  const deposit = Math.round((total * 25) / 100);
  const remaining = total - deposit;
  return { deposit, remaining };
}

/**
 * Calculate GST (18%) on amount
 * @param amount - Amount in paise
 */
export function calculateGST(amount: number | string): number {
  const amt = typeof amount === "string" ? parseInt(amount, 10) : amount;
  return Math.round((amt * 18) / 100);
}

/**
 * Calculate total with GST
 * @param amount - Base amount in paise
 * @returns Object with subtotal, gst, and total in paise
 */
export function calculateTotalWithGST(amount: number | string): { subtotal: number; gst: number; total: number } {
  const amt = typeof amount === "string" ? parseInt(amount, 10) : amount;
  const gst = calculateGST(amt);
  const total = amt + gst;
  return { subtotal: amt, gst, total };
}

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use calculateDeposit instead
 */
export function calculateDepositINR(totalPrice: number): {
  deposit: number;
  remaining: number;
} {
  return calculateDeposit(totalPrice * 100);
}

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use calculateGST instead
 */
export function calculateGSTINR(amount: number): number {
  return calculateGST(amount * 100) / 100;
}

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use calculateTotalWithGST instead
 */
export function calculateTotalWithGSTINR(amount: number): {
  subtotal: number;
  gst: number;
  total: number;
} {
  return calculateTotalWithGST(amount * 100);
}

/**
 * Slugify a string for URLs
 */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Concatenate class names
 */
export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Generate unique ID
 */
export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Format Indian number system (lakhs, crores)
 */
export function formatIndianNumber(num: number): string {
  return num.toLocaleString("en-IN");
}

/**
 * Check if a string is a valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (supports Indian formats)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+91[6-9]\d{9}$|^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[\s()-]/g, ""));
}
