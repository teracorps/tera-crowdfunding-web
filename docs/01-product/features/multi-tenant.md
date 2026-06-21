# Multi-Tenant Architecture

## Subdomain Routing

```
https://[org].crowdfunding.tera-platform.my.id
```

| URL | Tenant |
| --- | ------ |
| `crowdfunding.tera-platform.my.id` | Main platform (no tenant) |
| `yayasan-sehat.crowdfunding.tera-platform.my.id` | "Yayasan Sehat" tenant |

### DNS (Cloudflare)

- Wildcard CNAME: `*.crowdfunding` → Cloudflare Pages

## Tenant Resolution Flow

1. **hooks.server.ts** reads `Host` header
2. **resolveTenant()** in `src/lib/tenant.ts`:
   - Extracts subdomain from host
   - Queries `business_core.organizations` by `subdomain`
   - Loads `business_core.organization_branding` (colors, logo, font)
   - Loads `platform_billing.organization_subscriptions` (plan)
   - Loads `platform_billing.plan_entitlements` (feature flags)
3. **event.locals.tenant** is passed to layout/page components

## Data Isolation

- All campaign/donation tables have `organization_id` column
- Queries filter by `organization_id` for tenant-scoped access
- Main platform (no subdomain) shows campaigns across all orgs

## Branding Schema (organization_branding)

| Field | Type | CSS Var |
| ----- | ---- | ------- |
| `primary_color` | string | `--color-primary` |
| `secondary_color` | string | `--color-secondary` |
| `accent_color` | string | `--color-accent` |
| `text_primary_color` | string | `--color-text-primary` |
| `text_secondary_color` | string | `--color-text-secondary` |
| `background_color` | string | `--color-bg` |
| `surface_color` | string | `--color-surface` |
| `logo_url` | string\|null | — |
| `favicon_url` | string\|null | — |
| `og_image_url` | string\|null | — |
| `font_family` | string | `--font-family` |
| `font_heading` | string | `--font-heading` |
| `footer_text` | string\|null | — |
| `footer_links` | json[] | — |
| `social_links` | json[] | — |

## Entitlements (Feature Flags)

Defined in `src/lib/types.ts` as `FeatureKey`:

- `crowdfunding` — Base feature
- `crowdfunding.branding` — Custom branding
- `crowdfunding.custom_domain` — Custom domain
- `crowdfunding.unlimited` — Unlimited campaigns
- `crowdfunding.api` — API access
