# Supabase Backend Setup & Integration Guide

This guide documents how the EpicPix Media platform connects to its Supabase PostgreSQL backend, authentication service, and storage buckets.

---

## 1. Where to Obtain Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your EpicPix Media project (or create a new project).
3. Navigate to **Project Settings** (gear icon in the left sidebar) → **API**:
   - **Project URL**: Located under **Project URL** (`https://<project-ref>.supabase.co`). This is your `NEXT_PUBLIC_SUPABASE_URL`.
   - **Public Anon Key**: Located under **Project API keys** → `anon` `public`. This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - **Service Role Secret**: Located under **Project API keys** → `service_role` `secret`. This is your `SUPABASE_SERVICE_ROLE_KEY`.

> [!CAUTION]
> **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser or in client-side code.**
> - The service-role key bypasses all Row Level Security (RLS) policies.
> - In this project, it is **strictly restricted to server-side code** (`createServiceClient()` in `lib/supabase.ts`, webhooks, and administrative operations).

---

## 2. Environment Variables

Create or update your `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key

# Server-side ONLY (Bypasses RLS - keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key

# YouPI-PG UPI Payment Gateway
YOUPI_API_KEY=your_youpi_api_key
YOUPI_API_URL=https://api.youpi-pg.in/v1
YOUPI_WEBHOOK_SECRET=your_youpi_webhook_secret

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="EpicPix Media"
NEXT_PUBLIC_CURRENCY=INR
NEXT_PUBLIC_GST_RATE=0.18
```

---

## 3. Database Schema & Required Migrations

The database migration is located at:
- `supabase/migrations/20261112000000_epicpix_schema.sql`
- `scripts/db-setup.sql`

To apply the migration, choose one of the following methods:

### Method A: Supabase Dashboard SQL Editor (Recommended)
1. Open the [Supabase Dashboard](https://supabase.com/dashboard) and go to your project.
2. Click **SQL Editor** in the left sidebar.
3. Open or paste the contents of `scripts/db-setup.sql` (or `supabase/migrations/20261112000000_epicpix_schema.sql`).
4. Click **Run**.

### Method B: Supabase CLI
```bash
# Link project
npx supabase link --project-ref <your-project-ref>

# Push migrations
npx supabase db push
```

### Tables Created:
1. `public.users` - User directory linked 1:1 to `auth.users(id)` with roles: `CLIENT`, `FREELANCER`, `ADMIN`.
2. `public.client_profiles` - Company details, address, and client preferences.
3. `public.freelancer_profiles` - Bio, portfolio links, verification status, and ratings.
4. `public.services` - Media services catalog (thumbnails, video editing, cinematography).
5. `public.orders` - Core booking and order state machine.
6. `public.invoices` - Tax invoices with GST calculations.
7. `public.payments` - Transaction ledger tracking gateway transactions, UTR, and idempotency.
8. `public.deliveries` - Order milestones and completed deliverable batches.
9. `public.delivery_files` - Reference to files in the private storage bucket.
10. `public.messages` - Direct communication between clients, freelancers, and admins.
11. `public.reviews` - Client feedback with 1-5 star ratings.
12. `public.inquiries` - Lead inquiries submitted via the contact form.

---

## 4. Row Level Security (RLS) Policies

All tables have Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).

| Table | Policy Summary |
| :--- | :--- |
| `users` | Users read/update their own profile; Admins have full access. |
| `client_profiles` | Client reads/updates own profile; Admins have full access. |
| `freelancer_profiles` | Public can browse verified profiles; Freelancers update own. |
| `services` | Anyone can view active services; Freelancers manage own services; Admins manage all. |
| `orders` | **Clients can only access their own orders** (`client_id = auth.uid()`). **Freelancers can only access assigned orders** (`freelancer_id = auth.uid()`). **Admins can access all orders.** |
| `invoices` | Clients can view own invoices; Admins can manage all. |
| `payments` | Clients can view payment history for their orders. **Direct frontend updates are blocked** (`FOR UPDATE USING (is_admin())`). |
| `deliveries` | Accessible only to order's client, assigned freelancer, and admins. |
| `delivery_files` | Private access scoped to order participants and admins. |
| `inquiries` | Public can submit (`INSERT`); only Admins can view (`SELECT`). |

---

## 5. Storage Buckets

Configure two buckets in **Supabase Dashboard** → **Storage**:

### 1. `media-deliveries` (Private Bucket)
- **Public**: `false` (Unchecked)
- **File size limit**: 500 MB (or your desired media limit)
- **Allowed MIME types**: `video/*`, `image/*`, `application/zip`, `application/pdf`
- **Access Policy**: Handled by RLS. Only the client who placed the order, the assigned freelancer, and admins can access delivery assets. Temporary access is generated via `getSignedDeliveryUrl(filePath, expiresInSeconds)`.

### 2. `public-portfolio` (Public Bucket)
- **Public**: `true` (Checked)
- **File size limit**: 25 MB
- **Allowed MIME types**: `image/*`, `video/mp4`
- **Access Policy**: Public read. Authenticated freelancers and admins can upload.

---

## 6. Authentication & Roles Setup

### Role Structure
- **`CLIENT`**: Default role for clients ordering video production, photography, and thumbnails.
- **`FREELANCER`**: Creative professionals delivering projects.
- **`ADMIN`**: Platform administrators.

### Automatic Profile Creation
When a user registers via `/auth/signup`, Supabase triggers `public.handle_new_user()` which automatically:
1. Records the user into `public.users` with the selected role.
2. Creates the corresponding `client_profiles` or `freelancer_profiles` record.

### Creating an Admin User
To promote a user to `ADMIN`:
1. Register the user normally in the app or via the Supabase Auth dashboard.
2. In the **SQL Editor**, execute:
   ```sql
   UPDATE public.users
   SET role = 'ADMIN'
   WHERE email = 'admin@epicpix.media';
   ```

---

## 7. YouPI-PG Webhook Integration

### Webhook URL
Configure the webhook in your YouPI Payment Gateway dashboard:
```
https://your-domain.com/api/webhooks/youpi
```
(For local development, use Ngrok or Cloudflare Tunnel: `https://<tunnel-id>.ngrok.app/api/webhooks/youpi`).

### Security & Idempotency
- **Signature Verification**: Every incoming webhook is checked with HMAC SHA-256 using `YOUPI_WEBHOOK_SECRET`.
- **Idempotency**: Checked against `webhook_event_id` in the `payments` table. If an event has already been processed, it returns `200 OK` immediately without duplicate side-effects.
- **Server-Side Confirmation**: Frontend callback URLs only notify the UI. **Payment is never confirmed until the server receives and validates the webhook directly from YouPI.**

---

## 8. Local Development Setup

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Copy environment file and configure credentials:
   ```bash
   cp .env.example .env.local
   ```
3. Run migrations on your Supabase project (see Section 3).
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 9. Production Deployment Setup (Vercel)

1. Connect your GitHub repository to Vercel.
2. In **Vercel Project Settings** → **Environment Variables**, configure:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `YOUPI_API_KEY`
   - `YOUPI_API_URL`
   - `YOUPI_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://epicpix.media`)
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_CURRENCY`
   - `NEXT_PUBLIC_GST_RATE`
3. In Supabase Dashboard → **Authentication** → **URL Configuration**:
   - Set **Site URL** to `https://epicpix.media`
   - Add **Redirect URLs**:
     - `https://epicpix.media/auth/callback`
     - `http://localhost:3000/auth/callback`
4. Deploy to production.

