-- ============================================================
-- EpicPix Media Database Schema (Supabase/Postgres 16)
-- ============================================================
-- Run via: supabase db push or psql connection
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. clients table - Client database
-- ============================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  industry TEXT NOT NULL DEFAULT 'corporate',
  status TEXT NOT NULL DEFAULT 'lead',
  source TEXT,
  contact_person TEXT,
  notes TEXT,
  project_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_interaction TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Clients can read own data" ON public.clients
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Clients can insert own data" ON public.clients
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Clients can update own data" ON public.clients
  FOR UPDATE USING (auth.uid() = id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_industry ON public.clients(industry);

-- ============================================================
-- 2. freelancers table - Creator/freelancer enrollment
-- ============================================================
CREATE TABLE IF NOT EXISTS public.freelancers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  portfolio_url TEXT,
  skills TEXT[] DEFAULT '{}',
  rate_hourly NUMERIC,
  rate_project NUMERIC,
  availability TEXT NOT NULL DEFAULT 'available',
  expertise_level TEXT NOT NULL DEFAULT 'mid',
  verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 0,
  completed_projects INTEGER DEFAULT 0,
  payment_history JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  time_zone TEXT DEFAULT 'UTC',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.freelancers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Freelancers can read own data" ON public.freelancers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can manage freelancers" ON public.freelancers
  FOR ALL USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_freelancers_skills ON public.freelancers USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_freelancers_availability ON public.freelancers(availability);
CREATE INDEX IF NOT EXISTS idx_freelancers_expertise ON public.freelancers(expertise_level);

-- ============================================================
-- 3. projects table - Project management
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  freelancer_id UUID REFERENCES public.freelancers(id) ON DELETE SET NULL,
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

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Projects readable by client + freelancer + admin" ON public.projects
  FOR SELECT USING (
    auth.uid() = client_id
    OR auth.uid() = freelancer_id
    OR EXISTS (SELECT 1 FROM public.clients WHERE id = auth.uid())
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_freelancer_id ON public.projects(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

-- ============================================================
-- 4. invoices table - Payment tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'draft',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC DEFAULT 0,
  tax_rate NUMERIC DEFAULT 0.18,
  tax_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Invoices readable by client + project freelancer + admin" ON public.invoices
  FOR SELECT USING (
    auth.uid() = client_id
    OR auth.uid() = project_id
    OR EXISTS (SELECT 1 FROM public.projects WHERE client_id = auth.uid())
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON public.invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_status ON public.invoices(payment_status);

-- ============================================================
-- 5. inquiries table - Contact form submissions
-- ============================================================
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON public.inquiries(created_at DESC);

-- ============================================================
-- 6. Demo data insertion (comment out for production)
-- ============================================================
INSERT INTO public.clients (name, email, phone, company, industry, status, source, contact_person, notes, project_history)
VALUES
  ('Acme Corp', 'contact@acme-corp.com', '+1 (555) 123-4567', 'Acme Corporation', 'corporate', 'active', 'website', 'Sarah Johnson',
   'Initial inquiry about corporate promotional video. Followed up with call on Jan 15. Sent proposal on Jan 20.',
   '[]'::jsonb);

INSERT INTO public.projects (title, description, category, status, deposit_paid, deposit_amount, total_project_fee, payment_schedule, total_paid, amount_remaining, client_id, started_at)
VALUES
  ('Corporate Promo Video', 'A 3-minute corporate promotional video for Acme Corp''s new product line launch.', 'video', 'active', true, 2500, 10000,
   '[]'::jsonb, 3500, 6500, (SELECT id FROM public.clients WHERE name = 'Acme Corp'), NOW());

INSERT INTO public.invoices (invoice_number, project_id, client_id, issue_date, due_date, status, payment_status, items, subtotal, tax_rate, tax_amount, total_amount)
VALUES
  ('INV-2024-001', (SELECT id FROM public.projects WHERE title = 'Corporate Promo Video'), (SELECT id FROM public.clients WHERE name = 'Acme Corp'), CURRENT_DATE, CURRENT_DATE + 25, 'sent', 'partial',
   '[]'::jsonb, 2500, 0.18, 450, 2950);

-- ============================================================
-- 7. Row-level security help functions (optional)
-- ============================================================
--
CREATE OR REPLACE FUNCTION public.handle_clients_auth()
RETURNS TRIGGER AS $$
BEGIN
  NEW.id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_clients_auth_user
  BEFORE INSERT ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.handle_clients_auth();

-- ============================================================
-- END OF SCHEMA