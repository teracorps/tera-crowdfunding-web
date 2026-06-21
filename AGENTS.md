# Tera Crowdfunding Web — Agent Guide

This is the **Terabisa** crowdfunding SvelteKit 5 app. Before making changes, read the relevant docs.

## Current Product State

- **MVP Core**: Campaign CRUD ✅, Donation flow ✅, Midtrans payment ✅
- **Multi-Tenant**: Subdomain routing ✅, Config theming ✅, Branding schema ✅
- **Missing**: Tests ❌, leaderboard ❌, search ❌, email notifications ❌

See [docs/03-roadmap/README.md](docs/03-roadmap/README.md) for full progress.

## Required Reading

1. `docs/README.md`
2. `docs/01-product/features/donation.md` (if touching donation flow)
3. `docs/01-product/features/theme-system.md` (if touching colors/logo)
4. `docs/01-product/features/multi-tenant.md` (if touching tenant/branding)
5. `docs/02-engineering/README.md` (coding conventions)
6. `docs/02-engineering/deployment.md` (build & deploy)

## Key Rules

- **No hardcoded hex colors** in `.svelte` files — use `text-primary`, `bg-primary`, etc.
- **Svelte 5 runes** — use `$state()`, `$derived()`, `$props()`, `{@render children()}`
- **Donation pages** (`/donasi` routes) use **full-screen layout** — no Navbar/Footer/BottomNav
- **Build**: `npm run build` (rolldown, ~12s)
- **Deploy**: `npx wrangler pages deploy .svelte-kit/cloudflare --project-name tera-crowdfunding-web`
- **Production**: `https://tera-crowdfunding-web.pages.dev`

## Verification

```bash
npm run build
npx wrangler pages deploy .svelte-kit/cloudflare --project-name tera-crowdfunding-web
```

## Git Conventions

- Commit messages: `type: description` (e.g., `feat: donation page mobile-first layout`)
- Branch from `main`, PR to `main`
- Commit after each logical batch of changes
