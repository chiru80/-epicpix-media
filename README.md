# EpicPix Media

Professional portfolio and management system for media freelancers and clients.

## Features

- **Client & Freelancer Portals** — dedicated dashboards for managing orders, invoices, and portfolios
- **Order Management** — configure, pay, and track orders with confirmation flows
- **Invoicing** — generate and send invoices with a reusable template
- **Supabase Backend** — authentication, database, and real-time subscriptions
- **Stripe Payments** — secure payment processing via webhooks
- **Animated UI** — scroll-reveal animations, skeleton loaders, and service dropdowns

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (PostgreSQL + Auth)
- **Stripe** (payments)
- **Framer Motion** (animations)
- **Vitest** (testing)

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Stripe credentials

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run the linter |
| `npm run test` | Run the test suite |
| `npm run db:push` | Push schema to Supabase |
| `npm run db:reset` | Reset the Supabase database |

## Project Structure

```
app/                    # Next.js app router pages and API routes
components/             # Reusable UI components
lib/                    # Utilities and Supabase client
scripts/                # Database setup and seed scripts
tests/                  # Unit tests
```

## License

Private — see LICENSE for details.