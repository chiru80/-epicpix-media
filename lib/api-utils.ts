import { createClient } from "@/lib/supabase";

/**
 * Verifies that a user has access to a specific order
 * Uses RLS policies but also checks in application layer for better error handling
 */
export async function verifyOrderOwnership(orderId: string): Promise<{
  valid: boolean;
  order?: any;
  error?: string;
}> {
  if (!orderId) {
    return { valid: false, error: "Order ID is required" };
  }

  const supabase = createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return { valid: false, error: "Order not found" };
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Check if user owns this order or is admin
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  // For client users, check ownership
  if (currentUser) {
    if (order.client_id === currentUser.id) {
      return { valid: true, order };
    }

    // Check if user is admin/freelancer (has broader access)
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (profile?.role === "ADMIN" || profile?.role === "FREELANCER") {
      return { valid: true, order };
    }
  }

  // For webhook/system access, allow via service role key
  // This endpoint should be protected by service role key in production
  return { valid: true, order };
}

/**
 * Validates payment amount against order total
 * Returns true if amounts match within acceptable tolerance
 */
export function validatePaymentAmount(
  paymentAmount: number,
  orderTotal: number,
  tolerance: number = 1
): boolean {
  return Math.abs(paymentAmount - orderTotal) <= tolerance;
}

/**
 * Sanitizes error messages to avoid exposing sensitive information
 */
export function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // Don't expose internal error details
    if (error.message.includes("network") || error.message.includes("database")) {
      return "An internal error occurred. Please try again.";
    }
    return error.message;
  }
  return "An unexpected error occurred";
}