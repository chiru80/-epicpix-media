# GLISSE INTEGRATION - EPICPIX MEDIA DESIGN ARCHITECTURE

## Repository Audit Summary

### 1. EXISTING DESIGN SYSTEM

**Current Framework:**
- Next.js 15 (App Router, React 19)
- Tailwind CSS 3.4 with CSS variables design tokens
- framer-motion for animations
- lucide-react for icons
- Radix UI primitives (@radix-ui/react-dropdown-menu)

**Theme System:**
- Dark mode enabled via `["class", "class"]` strategy
- CSS variables defined in `globals.css`:
  - `--background`, `--foreground` (dark/light mode)
  - `--primary` (sky/cyan: 217 91% 40%)
  - `--secondary` (43 75% 55%)
  - `--accent` (262 83% 63%)
  - `--card`, `--card-foreground`
  - `--border`, `--input`, `--ring`, `--muted`
  - `--destructive`, `--warning`, `--success`
  - Shadows: `--shadow-sm`, `--shadow`, `--shadow-lg`, `--shadow-glow`

**Typography:**
- Display: DM Serif Display (serif)
- Body: Inter, system-ui, sans-serif

**Custom Components:**
1. `Button` - variant: default|outline|ghost|secondary, size: default|sm|lg|icon
2. `StatCard` - KPI tile with trend indicators
3. `DashboardLayout` - centered container with header slot
4. `RevealOnScroll` - framer-motion animations
5. `SkeletonLoader` / `SkeletonText` / `SkeletonImage` - loading states
6. `StatusBadge` / `PaymentBadge` - status indicators
7. `ServiceDropdown` - Radix UI dropdown for service selection

### 2. PAGE ARCHITECTURE

#### Public Pages (Server Components)
- `/` - Home page with hero, featured work, CTA
- `/about` - Company story, values
- `/services` - Services catalog (Client Component)
- `/portfolio` - Project showcase
- `/contact` - Contact form
- `/auth/signin` - Login page (Client Component)
- `/auth/signup` - Registration page (Client Component)

#### Client Dashboards
- `/dashboard` - Client dashboard with orders, stats
- `/freelancer` - Creator hub with assigned orders
- `/admin` - Admin dashboard with overview metrics

#### Order Flow
- `/order/configure` - Service selection, pricing, form
- `/order/pay/[id]` - Payment details (Client Component)
- `/order/confirmation/[id]` - Order confirmation (Client Component)
- `/order/confirmation` - Summary page

#### Admin Pages
- `/admin` - Admin overview
- `/admin/orders` - Orders management table

### 3. API ROUTES

**Auth:**
- `app/api/auth/signup/route.tsx` - Signup handler
- `app/auth/callback/route.ts` - OAuth callback

**Payments:**
- `app/api/payments/route.tsx` - Payment order creation via YouPI-PG

**Webhooks:**
- `app/api/webhooks/youpi/route.tsx` - YouPI payment webhook (HMAC verified)
- `app/api/webhooks/stripe/route.tsx` - Stripe webhook stub

**Orders:**
- `app/api/orders/[id]/payment/route.tsx` - Order payment handler
- `app/api/orders/payment/route.tsx` - Order payment creation

**Other:**
- `app/api/contact/route.tsx` - Contact form submission
- `app/api/invoices/route.tsx` - Invoice generation

### 4. SUPABASE INTEGRATION

**Database Schema** (supabase/migrations/20261112000000_epicpix_schema.sql):
- `users` - Auth users with role (CLIENT, FREELANCER, ADMIN)
- `client_profiles` - Client company, industry
- `freelancer_profiles` - Skills, rating, verified status
- `clients` - Legacy client table
- `services` - Freelancer service catalog
- `orders` - Order management (status, payment_status, pricing)
- `projects` - Legacy projects table
- `invoices` - Invoice tracking
- `payments` - Payment records with YouPI gateway
- `deliveries` - Project deliveries
- `delivery_files` - File metadata (Supabase Storage links)
- `messages` - Order communication
- `reviews` - Client feedback
- `inquiries` - Contact form leads

**RLS Policies:** Comprehensive policy setup for data protection

**Storage Buckets:**
- `media-deliveries` (private)
- `public-portfolio` (public)

### 5. YOPI-PG INTEGRATION

**Payment Flow:**
1. Client submits order → `POST /api/orders/[id]/payment`
2. Payment created via YouPI-PG → Returns payment URL
3. Webhook at `POST /api/webhooks/youpi` updates payment status
4. Admin verification via `POST /api/orders/payment`

**Security:**
- HMAC SHA-256 signature verification
- Idempotency via webhook_event_id
- Order amount validation
- Server-side truth authority

### 6. REUSABLE COMPONENTS FOUND

| Component | Location | Type | Use Cases |
|-----------|----------|------|-----------|
| Button | components/ui/button.tsx | Client | Primary CTAs, buttons |
| StatCard | components/ui/stat-card.tsx | Client | Dashboard KPIs |
| DashboardLayout | components/ui/dashboard-layout.tsx | Client | Page containers |
| StatusBadge | components/ui/status-badge.tsx | Server | Order/payment status |
| PaymentBadge | components/ui/status-badge.tsx | Server | Payment status |
| SkeletonLoader | components/ui/skeleton-loader.tsx | Client | Loading states |
| ServiceDropdown | components/ui/service-dropdown.tsx | Client | Service selection |
| RevealOnScroll | components/ui/reveal-on-scroll.tsx | Client | Animations |
| Header | components/layout/header.tsx | Client | Navigation, auth |
| Footer | components/layout/footer.tsx | Server | Site footer |

### 7. DUPLICATED PATTERNS TO CONSOLIDATE

1. **Status Badges:** Two implementations (component vs inline in admin/orders)
2. **Service Name Mapping:** Duplicated in multiple pages
3. **Price Formatting:** Direct `formatINRSimple` usage vs inline
4. **Table Styles:** Similar admin tables in different pages

### 8. PAGES REQUIRING VISUAL REDESIGN

1. **Home Page** (`/`) - Needs premium hero with Glass effects
2. **Services Page** (`/services`) - Creator cards with portfolio preview
3. **Portfolio** (`/portfolio`) - Image gallery with overlay controls
4. **Creator Profile** (`/freelancer`) - Professional workspace
5. **Order Configuration** (`/order/configure`) - Multi-step booking flow
6. **Payment Page** (`/order/pay/[id]`) - YouPI payment state visualization
7. **Dashboards** - Premium metrics display
8. **Auth Pages** - Glass panel auth forms

### 9. COMPONENTS THAT SHOULD USE GLISSE

**High Priority:**
- Main CTAs on homepage
- Service cards on services page
- Portfolio project cards
- Order status indicators
- Payment status visualization
- Auth form cards

**Medium Priority:**
- Stat cards on dashboards
- Modal dialogs (create wrapper)
- Tabs for order details
- Form inputs for premium feel

**Low Priority (keep Tailwind):**
- Tables in admin (need information density)
- Complex forms with validation
- Raw HTML links where simplicity works

### 10. COMPONENTS THAT SHOULD REMAIN TAIWIND

- Admin data tables (need density)
- Navigation links
- Standard form inputs
- Simple badges without glow effects
- Footer content

---

## INTEGRATION PLAN

### PHASE 1: INSTALL GLISSE
- `npm install glisse`
- Verify TypeScript/Next.js compatibility
- Check client/component usage patterns

### PHASE 2: DESIGN SYSTEM CREATION
- Create `components/ui/glisse/` directory
- Build wrapper components: GlassCard, GlassButton, GlassPanel
- Define CSS variable mappings for Glisse tokens

### PHASE 3: GLOBAL VISUAL UPDATE
- Update `globals.css` with Liquid Glass effects
- Add backdrop-filter utilities
- Create glass utility classes

### PHASE 4: PUBLIC WEBSITE
- Hero section with Glass overlay
- Services catalog with Creator cards
- Portfolio gallery enhancements
- Footer updates

### PHASE 5: CLIENT EXPERIENCE
- Dashboard metrics with Glass cards
- Order flow improvements
- Payment UI state visualization

### PHASE 6: FREELANCER EXPERIENCE
- Creator profile page
- Order management interface
- Deliverables upload UI

### PHASE 7: ADMIN EXPERIENCE
- Keep tables functional with subtle Glass header
- Order filtering improvements
- Status badge updates

### PHASE 8: RESPONSIVE & ACCESSIBILITY
- Mobile-first Glass effects
- Reduced motion support
- Focus states and ARIA labels

### PHASE 9: PERFORMANCE OPTIMIZATION
- Client component audit
- Backdrop-filter usage guidelines
- Image optimization verification

### PHASE 10: TESTING & QA
- Run `npm run lint`
- Run `npm run test`
- Run `npm run build`
- Manual browser testing

---

## CSS VARIABLE TOKENS FOR GLOSS INTEGRATION

```css
/* EpicPix Glass Tokens - extend existing variables */
:root {
  --epicpix-glass-bg: 255 255 255 / 0.75;
  --epicpix-glass-border: 222 30% 18% / 0.4;
  --epicpix-glass-blur: 12px;
  --epicpix-glass-tint: 255 255 255 / 0.1;
  --epicpix-accent-glow: 56 189 248 / 0.25;
}
```

## COMPONENT MAPPING

| Current | Glisse Equivalent | Action |
|---------|------------------|--------|
| Button | Button | Use directly |
| StatCard | Card | Create GlassCard wrapper |
| StatusBadge | Badge | Create GlassBadge wrapper |
| ServiceDropdown | DropdownMenu | Use directly |
| SkeletonLoader | Loading | Create Glass variants |

---

## FILES TO MODIFY

### Core Files (global changes)
1. `globals.css` - Add Glass utilities
2. `tailwind.config.ts` - Add Glass classes
3. `package.json` - Add glisse dependency

### Pages (visual updates)
1. `app/page.tsx` - Homepage redesign
2. `app/services/page.tsx` - Services with cards
3. `app/portfolio/page.tsx` - Gallery
4. `app/dashboard/page.tsx` - Dashboard
5. `app/freelancer/page.tsx` - Creator hub
6. `app/admin/page.tsx` - Admin overview
7. `app/auth/signin/page.tsx` - Login form
8. `app/auth/signup/page.tsx` - Signup form
9. `app/order/configure/page.tsx` - Booking flow
10. `app/order/pay/[id]/page.tsx` - Payment UI

### Components (new wrappers)
1. `components/ui/glass-card.tsx` - New
2. `components/ui/glass-button.tsx` - New
3. `components/ui/glass-panel.tsx` - New
4. `components/ui/glass-badge.tsx` - New
5. `components/ui/glass-modal.tsx` - New

### Utilities
1. `lib/utils.ts` - May add format helpers

---

## IMPLEMENTATION PRIORITY

**Week 1: Foundation**
- Install Glisse
- Create design tokens
- Build core Glass components

**Week 2: Public Pages**
- Home page
- Services
- Portfolio
- About/Contact

**Week 3: Auth & Orders**
- Login/Signup pages
- Order configuration
- Payment flow

**Week 4: Dashboards**
- Client dashboard
- Freelancer hub
- Admin panel

**Week 5: Polish & Test**
- Responsive fixes
- Accessibility audit
- Performance optimization
- Final QA

---

## RISK MITIGATION

1. **SSR Hydration** - Use "use client" only where needed
2. **Performance** - Limit backdrop-filter, use static fallbacks
3. **RLS Security** - Never modify database policies
4. **YouPI Integration** - Preserve all webhook logic
5. **Supabase Auth** - Keep auth flow unchanged