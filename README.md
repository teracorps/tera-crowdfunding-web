# Terabisa — Crowdfunding Web Platform

Multi-tenant platform crowdfunding dengan config-driven theming, integrasi Midtrans, dan deployment Cloudflare Pages.

## Tech Stack

- **SvelteKit 5** — Runes (`$state`, `$derived`, `$props`), `{@render children()}`
- **Tailwind CSS v4** — `@theme` directive via Vite plugin
- **Midtrans Snap** — Payment gateway (BCA, Mandiri, GoPay, OVO, DANA, ShopeePay)
- **Supabase** — Auth, database, realtime
- **Cloudflare Pages** — Hosting & CDN

## Quick Start

```bash
pnpm install
cp .env.example .env   # fill in Supabase + Midtrans keys
npm run dev
```

## Build & Deploy

```bash
npm run build
npx wrangler pages deploy .svelte-kit/cloudflare --project-name tera-crowdfunding-web
```

Production: `https://tera-crowdfunding-web.pages.dev`

## Documentation

See [docs/README.md](docs/README.md) for full documentation:

| Doc | Description |
| --- | ----------- |
| [Product Overview](docs/01-product/README.md) | Vision, features, status |
| [Donation Flow](docs/01-product/features/donation.md) | Payment, Midtrans, invoice |
| [Theme System](docs/01-product/features/theme-system.md) | Config-driven branding |
| [Multi-Tenant](docs/01-product/features/multi-tenant.md) | Subdomain routing |
| [Architecture](docs/02-engineering/architecture.md) | System overview |
| [Deployment](docs/02-engineering/deployment.md) | Build, env vars, deploy |
| [Roadmap](docs/03-roadmap/README.md) | Progress, missing, future plans |
