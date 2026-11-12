-- Orders table for EpicPix Media client ordering system
-- Services: Thumbnails, Video Editing, Color Grading, Motion Graphics

-- Create the orders table
create table if not exists public.orders (
  id uuid not null references auth.users on delete cascade,
  client_id uuid references public.clients(id),
  service_type text not null,
  -- Valid service types: 'thumbnail', 'video_editing_basic', 'video_editing_pro',
  --   'video_editing_premium', 'color_grading', 'motion_graphics'
  package_tier text,
  -- Package tier: 'basic', 'pro', 'premium' (for video editing only)
  status text not null default 'pending',
  -- Status flow: 'pending' -> 'approved' -> 'in_progress' -> 'review' ->
  --   'revisions' -> 'completed' | 'cancelled'
  payment_status text not null default 'pending',
  -- Payment status: 'pending', 'deposit_paid', 'paid', 'refunded', 'failed'
  payment_type text,
  -- Payment type: 'deposit', 'full', 'milestone'
  base_price numeric default 0,
  add_ons_price numeric default 0,
  total_price numeric default 0,
  deposit_percentage numeric default 25,
  --: 25% upfront deposit
  deposit_amount numeric default 0,
  remaining_balance numeric default 0,
  delivery_deadline timestamptz,
  completed_at timestamptz,
  client_feedback text,
  client_rating numeric, --: 1-5
  files_delivered jsonb default '[]',
  --: [{"file_name": "...", "file_url": "...", "file_type": "..."}]
  project_description text,
  client_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint orders_pkey primary key (id)
);

alter table public.orders enable row level security;

-- Policies: Users can read/write their own orders (matched by client_id = auth.uid())

-- Users can read their own orders
create policy "Users can read own orders" on public.orders
  for select using (auth.uid() = client_id);

-- Users can insert their own orders
create policy "Users can insert own orders" on public.orders
  for insert with check (auth.uid() = client_id);

-- Users can update their own orders
create policy "Users can update own orders" on public.orders
  for update using (auth.uid() = client_id);

-- Index for performance
create index if not exists idx_orders_client_id on public.orders(client_id);
create index if not exists idx_orders_service_type on public.orders(service_type);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

comment on table public.orders is 'Client ordering system - EpicPix Media';
comment on column public.orders.service_type is 'Service type: thumbnail, video_editing_basic, video_editing_pro, video_editing_premium, color_grading, motion_graphics';
comment on column public.orders.package_tier is 'Package tier: basic, pro, premium (video editing only)';
comment on column public.orders.status is 'Order status flow: pending -> approved -> in_progress -> review -> revisions -> completed | cancelled';
comment on column public.orders.payment_status is 'Payment status: pending, deposit_paid, paid, refunded, failed';
comment on column public.orders.deposit_percentage is 'Deposit percentage upfront (default 25%)';
comment on column public.orders.files_delivered is 'JSONB array of delivered files';