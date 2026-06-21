# Architecture Overview

## System Context (C4 Level 1)

```
┌──────────┐     ┌──────────────────┐     ┌──────────────┐
│  Browser  │────▶│  Cloudflare      │────▶│  SvelteKit 5 │
│  (User)   │     │  Pages (CDN)     │     │  (SSR)       │
└──────────┘     └──────────────────┘     └──────┬───────┘
                                                 │
                          ┌──────────────────────┼──────────────────┐
                          ▼                      ▼                   ▼
                   ┌────────────┐        ┌──────────────┐   ┌──────────────┐
                   │  Supabase  │        │   Midtrans   │   │   External   │
                   │ (Postgres) │        │   Snap API   │   │    APIs      │
                   └────────────┘        └──────────────┘   └──────────────┘
```

## Request Flow

```
Browser → Cloudflare Pages (Edge) → SvelteKit SSR → hooks.server.ts
                                                         │
                                          ┌──────────────┼──────────────┐
                                          ▼              ▼              ▼
                                   Supabase Auth  Resolve Tenant  Session Data
                                                         │
                                          ┌──────────────┘
                                          ▼
                                    +layout.svelte
                                    (theme injection)
                                          │
                                          ▼
                                    Page Component
```

## Tenant-aware Layout

```
hooks.server.ts → event.locals.tenant
                        │
                        ▼
+layout.svelte → $derived(branding) → themeVars (CSS vars)
                        │
          ┌─────────────┴─────────────┐
          ▼                           ▼
   isFullScreenLayout            Normal Layout
   (donasi routes)               (Navbar + Footer + BottomNav)
          │                           │
          ▼                           ▼
   {@render children()}      <main>{@render children()}</main>
```

## Data Flow (Donation)

```
User fills form → submitDonation()
      │
      ▼
POST /api/public/funding/donations
      │
      ▼
Create donation record (Supabase)
      │
      ▼
createSnapTransaction() → Midtrans Snap API
      │
      ▼
Return snap_token → Open Snap popup
      │
      ▼
User pays → Midtrans callback → POST /payments/notification
      │
      ▼
Update donation status → Send email
```
