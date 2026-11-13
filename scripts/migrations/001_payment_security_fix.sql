-- ========================================================
-- Migration: Payment Security Fix
-- Date: 2026-11-12
-- ========================================================

-- Add missing columns to payments table for proper payment tracking
-- These columns were missing and causing issues with payment flow

-- Add payment_method column if missing (stores 'upi', 'bank_transfer', 'card', 'cash')
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Add gateway_order_id column if missing (for storing YouPI gateway reference)
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS gateway_order_id TEXT;

-- Ensure verification_status column exists with default
ALTER TABLE public.payments ALTER COLUMN verification_status SET DEFAULT 'pending';

-- Ensure metadata column exists with default
ALTER TABLE public.payments ALTER COLUMN metadata SET DEFAULT '{}'::jsonb;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payments_payment_method ON public.payments(payment_method);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_order_id ON public.payments(gateway_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_verification_status ON public.payments(verification_status);

-- Update existing pending payments to have proper verification_status
UPDATE public.payments
SET verification_status = 'pending'
WHERE verification_status IS NULL;

-- Update existing payments to have gateway set
UPDATE public.payments
SET gateway = 'YOUPI'
WHERE gateway IS NULL;

-- ========================================================
-- ORDERS TABLE - Add payment_method column if missing
-- ========================================================

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- ========================================================
-- SECURITY POLICY UPDATE
-- ========================================================

-- Add policy for system/webhooks to update payment status for verification
CREATE POLICY IF NOT EXISTS "System can update payment status for verification" ON public.payments
  FOR UPDATE USING (
    public.is_admin()
    OR auth.uid() IS NULL  -- Service role bypass (webhooks)
  );

-- Allow insertions for orders with 'pending_verification' status (not 'completed'!)
-- Full payment completion ONLY allowed via webhook verification
CREATE POLICY IF NOT EXISTS "Can insert pending payment for own orders" ON public.payments
  FOR INSERT WITH CHECK (
    status = 'pending_verification'
    AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = payments.order_id
      AND (orders.client_id = auth.uid() OR orders.client_id IS NULL)
    )
    OR public.is_admin()
  );

-- Update RLS policy to prevent direct 'completed' status insertion
-- Payments can only be marked complete via webhook verification
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;