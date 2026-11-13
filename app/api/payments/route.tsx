import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// Types for payment data
interface PaymentRequest {
  orderId: string;
  amount: number; // in rupees
  currency: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  returnUrl?: string;
}

interface YouPIOrderResponse {
  success: boolean;
  orderId?: string;
  paymentUrl?: string;
  error?: string;
}

/**
 * Creates a payment order via YouPI-PG
 * This endpoint is called by the frontend when a client wants to pay
 * The amount is validated against the database order to prevent tampering
 */
export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();
    const { orderId, amount, currency, customerInfo, returnUrl } = body;
    
    if (!orderId || !amount || !customerInfo?.name || !customerInfo?.email) {
      return NextResponse.json(
        { error: "Missing required fields: orderId, amount, customerInfo.name, customerInfo.email" },
        { status: 400 }
      );
    }
    
    const supabase = createServiceClient();
    
    // Fetch the order from database to validate amount
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, total_price, deposit_amount, remaining_balance, payment_status, client_id, service_type")
      .eq("id", orderId)
      .single();
    
    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    
    // Validate amount matches order total (in rupees, compare with stored paise value)
    const expectedTotalInRupees = order.total_price / 100;
    const tolerance = 0.50; // Allow 50 paise tolerance for rounding
    
    if (Math.abs(amount - expectedTotalInRupees) > tolerance) {
      console.error(`Payment amount mismatch: expected ${expectedTotalInRupees}, got ${amount}`);
      return NextResponse.json(
        { error: "Payment amount does not match order total" },
        { status: 400 }
      );
    }
    
    // Validate currency
    if (currency !== "INR") {
      return NextResponse.json(
        { error: "Only INR currency is supported" },
        { status: 400 }
      );
    }
    
    // Validate payment status
    if (order.payment_status === "paid") {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 }
      );
    }
    
    // Create order with YouPI-PG
    // Note: YouPI-PG requires specific API keys - this is a placeholder implementation
    // The actual integration would use fetch to call the YouPI-PG order creation endpoint
    const youPIResponse: YouPIOrderResponse = await createYouPIOrder({
      orderId,
      amount,
      currency,
      customerInfo,
      returnUrl,
    });
    
    if (!youPIResponse.success) {
      return NextResponse.json(
        { error: youPIResponse.error || "Failed to create payment order" },
        { status: 500 }
      );
    }
    
    // Store payment record
    const { data: paymentData, error: paymentError } = await supabase
      .from("payments")
      .insert({
        order_id: orderId,
        gateway: "YOUPI",
        amount: amount * 100, // Store in paise
        currency: currency,
        status: "pending",
        gateway_order_id: youPIResponse.orderId,
        verification_status: "pending",
        webhook_event_id: `youpi_${orderId}_${Date.now()}`,
      })
      .select()
      .single();
    
    if (paymentError) {
      console.error("Payment record error:", paymentError);
      return NextResponse.json(
        { error: "Failed to create payment record" },
        { status: 500 }
      );
    }
    
    // Update order payment status
    const newPaymentStatus = order.payment_status === "pending" ? "payment_pending" : order.payment_status;
    await supabase
      .from("orders")
      .update({
        payment_status: newPaymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);
    
    return NextResponse.json({
      success: true,
      paymentUrl: youPIResponse.paymentUrl,
      paymentId: paymentData.id,
      orderId: youPIResponse.orderId,
    });
    
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * Helper function to create YouPI-PG order
 * In production, this would call the actual YouPI-PG API
 */
async function createYouPIOrder(data: PaymentRequest): Promise<YouPIOrderResponse> {
  // YouPI-PG API integration
  // This is a placeholder - replace with actual YouPI-PG API call
  const youPIApiKey = process.env.YOUPI_API_KEY;
  const youPIApiUrl = process.env.YOUPI_API_URL || "https://api.youpi-pg.in/v1";
  
  if (!youPIApiKey) {
    // For development/testing, return a mock response
    return {
      success: true,
      orderId: `dev_${data.orderId}`,
      paymentUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/order/pay/${data.orderId}/simulate`,
    };
  }
  
  try {
    const response = await fetch(`${youPIApiUrl}/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${youPIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: data.amount * 100, // Convert to paise
        currency: data.currency,
        upi: {
          merchant_name: data.customerInfo.name,
          merchant_email: data.customerInfo.email,
        },
        redirect_url: data.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/order/confirmation/${data.orderId}`,
        metadata: {
          order_id: data.orderId,
          customer_name: data.customerInfo.name,
          customer_email: data.customerInfo.email,
        },
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.message || "Failed to create YouPI order",
      };
    }
    
    return {
      success: true,
      orderId: result.data?.order_id || result.orderId,
      paymentUrl: result.data?.payment_url || result.paymentUrl,
    };
  } catch (error) {
    console.error("YouPI API error:", error);
    return {
      success: false,
      error: "Failed to connect to payment gateway",
    };
  }
}

// GET endpoint to fetch payment status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("paymentId");
  const orderId = searchParams.get("orderId");
  
  if (!paymentId && !orderId) {
    return NextResponse.json(
      { error: "Payment ID or Order ID is required" },
      { status: 400 }
    );
  }
  
  const supabase = createServiceClient();
  
  let query = supabase.from("payments").select("*");
  
  if (paymentId) {
    query = query.eq("id", paymentId);
  } else if (orderId) {
    query = query.eq("order_id", orderId);
  }
  
  const { data, error } = await query.single();
  
  if (error) {
    return NextResponse.json(
      { error: "Payment not found" },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    payment: data,
  });
}
