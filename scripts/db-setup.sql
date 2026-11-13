-- ========================================================
-- EpicPix Media Complete Supabase Schema & Security Setup
-- ========================================================
-- Run via: Supabase SQL Editor or `supabase db push`
-- ========================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'CLIENT' CHECK (UPPER(role) IN ('CLIENT', 'FREELANCER', 'ADMIN')),
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Client Profiles table
CREATE TABLE IF NOT EXISTS public.client_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  company_name TEXT,
  industry TEXT DEFAULT 'corporate',
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Freelancer Profiles table
CREATE TABLE IF NOT EXISTS public.freelancer_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  hourly_rate NUMERIC,
  portfolio_url TEXT,
  availability TEXT DEFAULT 'available',
  verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 5.0,
  completed_projects INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Legacy clients table (for backward compatibility)
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  industry TEXT NOT NULL DEFAULT 'corporate',
  status TEXT NOT NULL DEFAULT 'active',
  source TEXT,
  contact_person TEXT,
  notes TEXT,
  project_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_interaction TIMESTAMPTZ
);

-- 5. Services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL,
  base_price NUMERIC NOT NULL,
  deliverables TEXT[] DEFAULT '{}',
  delivery_days INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  freelancer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  package_tier TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  base_price NUMERIC DEFAULT 0,
  add_ons_price NUMERIC DEFAULT 0,
  total_price NUMERIC DEFAULT 0,
  deposit_percentage NUMERIC DEFAULT 25,
  deposit_amount NUMERIC DEFAULT 0,
  remaining_balance NUMERIC DEFAULT 0,
  delivery_deadline TIMESTAMPTZ,
  project_description TEXT,
  client_notes TEXT,
  files_delivered JSONB DEFAULT '[]'::jsonb,
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Legacy projects table (for backward compatibility)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  freelancer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'video',
  status TEXT NOT NULL DEFAULT 'active',
  deposit_paid BOOLEAN DEFAULT FALSE,
  deposit_amount NUMERIC DEFAULT 0,
  total_project_fee NUMERIC DEFAULT 0,
  payment_schedule JSONB DEFAULT '[]'::jsonb,
  total_paid NUMERIC DEFAULT 0,
  amount_remaining NUMERIC DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  client_feedback TEXT,
  client_rating NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'sent',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC DEFAULT 0,
  tax_rate NUMERIC DEFAULT 0.18,
  tax_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Payments table (tracks YouPI and gateway transactions)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  gateway TEXT NOT NULL DEFAULT 'YOUPI',
  gateway_payment_id TEXT,
  gateway_order_id TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending',
  utr TEXT,
  verification_status TEXT DEFAULT 'pending',
  webhook_event_id TEXT UNIQUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Deliveries table
CREATE TABLE IF NOT EXISTS public.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'delivered',
  revision_count INTEGER DEFAULT 0,
  delivered_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Delivery files table (linked to private Supabase Storage bucket)
CREATE TABLE IF NOT EXISTS public.delivery_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID REFERENCES public.deliveries(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  storage_bucket TEXT NOT NULL DEFAULT 'media-deliveries',
  mime_type TEXT,
  size_bytes BIGINT,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Inquiries table (Contact form)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  service TEXT,
  budget TEXT,
  timeline TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'lead',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- Helper Security Functions (SECURITY DEFINER)
-- ========================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND UPPER(role) = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT UPPER(role) INTO v_role FROM public.users WHERE id = auth.uid();
  RETURN COALESCE(v_role, 'CLIENT');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================================
-- Automatic User Profile Creation Trigger
-- ========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_val TEXT;
  full_name_val TEXT;
BEGIN
  user_role_val := COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'CLIENT');
  full_name_val := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');

  -- Insert into public.users
  INSERT INTO public.users (id, email, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    UPPER(user_role_val),
    full_name_val
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), users.full_name),
      updated_at = NOW();

  -- Insert profile based on role
  IF UPPER(user_role_val) = 'FREELANCER' THEN
    INSERT INTO public.freelancer_profiles (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  ELSE
    INSERT INTO public.client_profiles (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelancer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 1. Users policies
CREATE POLICY "Users can read own profile or admin reads all" ON public.users
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile or admin updates all" ON public.users
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- 2. Client profiles policies
CREATE POLICY "Clients read own profile or admin" ON public.client_profiles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Clients update own profile or admin" ON public.client_profiles
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Clients insert own profile or admin" ON public.client_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 3. Freelancer profiles policies
CREATE POLICY "Public read verified freelancer profiles" ON public.freelancer_profiles
  FOR SELECT USING (true);

CREATE POLICY "Freelancers update own profile or admin" ON public.freelancer_profiles
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Freelancers insert own profile or admin" ON public.freelancer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 4. Services policies
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true OR auth.uid() = freelancer_id OR public.is_admin());

CREATE POLICY "Freelancers manage own services or admin" ON public.services
  FOR ALL USING (auth.uid() = freelancer_id OR public.is_admin());

-- 5. Orders policies
CREATE POLICY "Clients read own orders, freelancers read assigned, admins all" ON public.orders
  FOR SELECT USING (
    auth.uid() = client_id
    OR auth.uid() = freelancer_id
    OR public.is_admin()
  );

CREATE POLICY "Clients can create orders" ON public.orders
  FOR INSERT WITH CHECK (
    auth.uid() = client_id
    OR client_id IS NULL
    OR public.is_admin()
  );

CREATE POLICY "Clients and freelancers update assigned orders or admin" ON public.orders
  FOR UPDATE USING (
    auth.uid() = client_id
    OR auth.uid() = freelancer_id
    OR public.is_admin()
  );

-- 6. Invoices policies
CREATE POLICY "Clients and admins can read invoices" ON public.invoices
  FOR SELECT USING (
    auth.uid() = client_id
    OR EXISTS (SELECT 1 FROM public.orders WHERE orders.id = invoices.order_id AND (orders.client_id = auth.uid() OR orders.freelancer_id = auth.uid()))
    OR public.is_admin()
  );

CREATE POLICY "Admins can manage invoices" ON public.invoices
  FOR ALL USING (public.is_admin());

-- 7. Payments policies
CREATE POLICY "Clients and admins read payments" ON public.payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.client_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Only admin or service role can update payments" ON public.payments
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "System or client can insert pending payment" ON public.payments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND (orders.client_id = auth.uid() OR orders.client_id IS NULL))
    OR public.is_admin()
  );

-- 8. Deliveries policies
CREATE POLICY "Clients and freelancers read assigned deliveries" ON public.deliveries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = deliveries.order_id AND (orders.client_id = auth.uid() OR orders.freelancer_id = auth.uid()))
    OR auth.uid() = freelancer_id
    OR public.is_admin()
  );

CREATE POLICY "Freelancers can insert deliveries for assigned orders" ON public.deliveries
  FOR INSERT WITH CHECK (
    auth.uid() = freelancer_id
    OR public.is_admin()
  );

-- 9. Delivery files policies
CREATE POLICY "Clients, freelancers, and admins read delivery files" ON public.delivery_files
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = delivery_files.order_id AND (orders.client_id = auth.uid() OR orders.freelancer_id = auth.uid()))
    OR auth.uid() = uploaded_by
    OR public.is_admin()
  );

CREATE POLICY "Freelancers and admins can upload delivery files" ON public.delivery_files
  FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by
    OR public.is_admin()
  );

-- 10. Messages policies
CREATE POLICY "Participants read messages" ON public.messages
  FOR SELECT USING (
    auth.uid() = sender_id
    OR auth.uid() = receiver_id
    OR public.is_admin()
  );

CREATE POLICY "Participants send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    OR public.is_admin()
  );

-- 11. Reviews policies
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
  FOR SELECT USING (is_approved = true OR auth.uid() = client_id OR auth.uid() = freelancer_id OR public.is_admin());

CREATE POLICY "Clients can create reviews for their orders" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = client_id OR public.is_admin());

-- 12. Inquiries policies
CREATE POLICY "Anyone can submit inquiry" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins read inquiries" ON public.inquiries
  FOR SELECT USING (public.is_admin());

-- ========================================================
-- STORAGE BUCKETS SETUP
-- ========================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('media-deliveries', 'media-deliveries', false),
  ('public-portfolio', 'public-portfolio', true)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;

-- Storage RLS Policies: media-deliveries (Private)
CREATE POLICY "Deliveries private read policy" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'media-deliveries'
    AND (
      public.is_admin()
      OR EXISTS (
        SELECT 1 FROM public.delivery_files df
        JOIN public.orders o ON o.id = df.order_id
        WHERE df.file_path = name
          AND (o.client_id = auth.uid() OR o.freelancer_id = auth.uid())
      )
    )
  );

CREATE POLICY "Deliveries private upload policy" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media-deliveries'
    AND (
      public.is_admin()
      OR public.get_user_role() IN ('FREELANCER', 'ADMIN')
    )
  );

-- Storage RLS Policies: public-portfolio (Public)
CREATE POLICY "Portfolio public read policy" ON storage.objects
  FOR SELECT USING (bucket_id = 'public-portfolio');

CREATE POLICY "Portfolio upload policy for freelancers and admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'public-portfolio'
    AND (public.get_user_role() IN ('FREELANCER', 'ADMIN'))
  );

-- ========================================================
-- Performance Indexes
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON public.orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_freelancer_id ON public.orders(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_payment_id ON public.payments(gateway_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON public.deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON public.invoices(order_id);
