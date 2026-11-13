# EpicPix Media Architecture

## Overview

EpicPix Media is a media freelancer/portfolio management SaaS platform that connects clients with media professionals. The platform supports browsing portfolios, ordering services, processing payments, and managing project delivery.

## Technology Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS 4
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Payments**: YouPI-PG (UPI Payment Gateway)
- **Hosting**: Vercel-compatible

## Current Issues Identified

### Critical Security Issues

1. **No `users` table exists** - The admin page queries `users.role` but this table doesn't exist in the database
2. **Orders not linked to auth users** - Orders use `client_id` referring to a separate `clients` table, not `auth.users`
3. **Stripe integration instead of YouPI-PG** - Payment system uses Stripe, not YouPI-PG as specified
4. **Missing authentication flow** - No signup/login pages exist
5. **Insecure payment handling** - Payment endpoints trust frontend amounts
6. **RLS policies incomplete** - Not all tables have proper Row Level Security

### Database Schema Issues

- `orders` table uses `client_id` but RLS policy references `auth.uid()` - mismatch
- No `users` table for role-based access control
- No `payments` table with proper tracking fields
- No `deliveries`, `messages`, `revisions`, `reviews` tables

## Proposed Database Schema

### Users Table (NEW)
Central table linking Supabase Auth users to their profiles.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('CLIENT', 'FREELANCER', 'ADMIN')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Client Profiles Table (NEW)
```sql
CREATE TABLE client_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  company_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Freelancer Profiles Table (NEW)
```sql
CREATE TABLE freelancer_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  bio TEXT,
  skills TEXT[],
  hourly_rate NUMERIC,
  portfolio_url TEXT,
  availability JSONB,
  verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 0,
  completed_projects INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Services Table (NEW)
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC NOT NULL,
  duration_hours INTEGER,
  revision_count INTEGER DEFAULT 1,
  deliverables TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Orders Table (MIGRATE)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id),
  service_id UUID REFERENCES services(id),
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  base_price NUMERIC DEFAULT 0,
  add_ons_price NUMERIC DEFAULT 0,
  total_price NUMERIC DEFAULT 0,
  deposit_amount NUMERIC DEFAULT 0,
  remaining_balance NUMERIC DEFAULT 0,
  delivery_deadline TIMESTAMPTZ,
  notes TEXT,
  freelancer_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Payments Table (NEW)
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  gateway TEXT NOT NULL,
  gateway_payment_id TEXT,
  gateway_order_id TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending',
  utr TEXT,
  verification_status TEXT DEFAULT 'pending',
  webhook_event_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Deliveries Table (NEW)
```sql
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  freelancer_id UUID REFERENCES users(id),
  delivered_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  revision_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Delivery Files Table (NEW)
```sql
CREATE TABLE delivery_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID REFERENCES deliveries(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  version INTEGER DEFAULT 1,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Messages Table (NEW)
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Reviews Table (NEW)
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  client_id UUID REFERENCES users(id),
  freelancer_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Required RLS Policies

### Users Table
```sql
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));
```

### Orders Table
```sql
-- Clients can read their own orders
CREATE POLICY "Clients can read own orders" ON orders
  FOR SELECT USING (auth.uid() = client_id);

-- Clients can create orders
CREATE POLICY "Clients can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Freelancers can read assigned orders
CREATE POLICY "Freelancers can read assigned orders" ON orders
  FOR SELECT USING (auth.uid() = freelancer_id);

-- Freelancers can update assigned orders
CREATE POLICY "Freelancers can update assigned orders" ON orders
  FOR UPDATE USING (auth.uid() = freelancer_id);
```

## Authentication Flow

1. User visits `/auth/signup`
2. User fills registration form (email, password, role)
3. User signs up via Supabase Auth
4. Database trigger creates profile in `users` table
5. Based on role, creates corresponding profile table record
6. User redirected to respective dashboard

## Payment Flow (YouPI-PG)

1. Client configures order at `/order/configure`
2. Server calculates total price (never trust frontend)
3. Order created with `payment_status = 'pending'`
4. Client redirected to YouPI for payment
5. YouPI sends webhook to `/api/webhooks/youpi`
6. Webhook handler verifies signature (HMAC)
7. Checks idempotency (duplicate detection)
8. Validates order exists, amount matches
9. Creates payment record, marks order as `paid`
10. Generates invoice

## Order State Machine

```
CREATION:
DRAFT → PAYMENT_PENDING → PAYMENT_DETECTED → PAYMENT_CONFIRMED

FULFILLMENT:
ACCEPTED → IN_PROGRESS → DELIVERED → REVISION_REQUESTED → APPROVED → COMPLETED

FAILURE STATES:
PAYMENT_FAILED, CANCELLED, REFUND_PENDING, REFUNDED, DISPUTED
```

## Next Steps

1. Create `users` table with roles
2. Implement signup/login pages
3. Update RLS policies for all tables
4. Replace Stripe with YouPI-PG integration
5. Implement proper payment webhook verification
6. Add missing tables (payments, deliveries, messages, revisions, reviews)
7. Create client/freelancer dashboards
8. Add messaging functionality
9. Implement delivery workflow
10. Add review system