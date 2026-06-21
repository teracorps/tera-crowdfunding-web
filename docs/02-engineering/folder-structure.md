# Project Structure

```
tera-crowdfunding-web/
├── src/
│   ├── app.d.ts                    # Type declarations
│   ├── hooks.server.ts             # Handle hook: supabase, tenant, session
│   ├── lib/
│   │   ├── api.ts                  # API client (campaigns, donations)
│   │   ├── config.ts               # App config, colors, tenant domain
│   │   ├── entitlements.ts         # Feature entitlements logic
│   │   ├── index.ts                # Re-exports
│   │   ├── notifications.ts        # Email notification templates
│   │   ├── payment.ts              # Midtrans Snap integration
│   │   ├── supabase.ts             # Supabase client factory
│   │   ├── tenant.ts               # Subdomain → tenant resolution
│   │   ├── types.ts                # All TypeScript interfaces
│   │   ├── userMenuData.ts         # User dropdown menu config
│   │   └── components/
│   │       ├── AccountMenu.svelte      # User dropdown menu
│   │       ├── BottomNav.svelte        # Mobile bottom navigation
│   │       ├── CampaignCard.svelte     # Campaign grid card
│   │       ├── CampaignGrid.svelte     # Responsive campaign grid
│   │       ├── CategoryPills.svelte    # Category filter pills
│   │       ├── DoaSection.svelte       # Doa/sharing section
│   │       ├── Footer.svelte           # Site footer (desktop)
│   │       ├── Hero.svelte             # Landing hero section
│   │       ├── Navbar.svelte           # Top navigation bar
│   │       ├── ProgressBar.svelte      # Funding progress bar
│   │       ├── StatsSection.svelte     # Stats counter section
│   │       ├── StatusAlert.svelte       # Status alert component
│   │       └── skeleton/
│   │           ├── CampaignCardSkeleton.svelte
│   │           ├── DonationSkeleton.svelte
│   │           └── TableSkeleton.svelte
│   └── routes/
│       ├── +error.svelte               # Global error page
│       ├── +layout.server.ts           # Layout server load
│       ├── +layout.svelte              # Root layout (navbar, footer, theme)
│       ├── +page.svelte                # Landing page
│       ├── layout.css                  # Tailwind @theme + global styles
│       ├── admin/
│       │   ├── +layout.server.ts
│       │   ├── +layout.svelte
│       │   └── +page.svelte
│       ├── api/
│       │   ├── auth/logout/+server.ts
│       │   ├── org/check-subdomain/+server.ts
│       │   ├── org/create/+server.ts
│       │   ├── org/onboarding-progress/+server.ts
│       │   └── public/funding/
│       │       ├── campaigns/+server.ts
│       │       ├── campaigns/[slug]/+server.ts
│       │       ├── campaigns/[slug]/donations/+server.ts
│       │       ├── categories/+server.ts
│       │       ├── donations/+server.ts
│       │       ├── donations/[id]/+server.ts
│       │       ├── donations/export/+server.ts
│       │       ├── donations/history/+server.ts
│       │       ├── donations/invoice/[id]/+server.ts
│       │       ├── payments/notification/+server.ts
│       │       └── stats/+server.ts
│       ├── auth/
│       │   ├── daftar/+page.svelte     # Register page
│       │   └── masuk/+page.svelte      # Login page
│       ├── campaign/
│       │   ├── [slug]/
│       │   │   ├── +page.server.ts
│       │   │   ├── +page.svelte        # Campaign detail
│       │   │   └── donasi/
│       │   │       ├── +page.server.ts # Donasi page load
│       │   │       └── +page.svelte    # Donasi form (full-screen)
│       │   ├── create/
│       │   │   └── +page.svelte        # Create campaign
│       │   └── manage/
│       │       └── [slug]/
│       │           ├── +page.server.ts
│       │           └── +page.svelte    # Manage campaign
│       ├── campaigns/+page.svelte      # Campaign listing
│       ├── donasi/
│       │   ├── invoice/[id]/+page.svelte
│       │   └── selesai/[id]/+page.svelte
│       ├── onboarding/
│       │   ├── +layout.svelte
│       │   ├── +page.ts
│       │   ├── step-1/+page.svelte
│       │   ├── step-2/+page.svelte
│       │   ├── step-3/+page.svelte
│       │   └── step-4/+page.svelte
│       └── user/
│           ├── +page.svelte            # User dashboard
│           ├── donations/+page.svelte  # Donation history
│           └── inbox/+page.svelte      # User inbox
├── static/                             # Static assets
├── docs/                               # Project documentation
├── migrations/                         # Supabase SQL migrations
├── docker-compose.yml                  # Production deployment
├── Dockerfile                          # Container build
├── wrangler.toml                       # Cloudflare Pages config
├── svelte.config.js
├── vite.config.ts                      # Tailwind v4 via @tailwindcss/vite
└── package.json
```
