# Engineering Standards

## Stack

- **SvelteKit 5** — Uses `$state`, `$derived`, `$props`, `$effect`, `{@render children()}`
- **Tailwind CSS v4** — `@theme` directive in `layout.css`; postcss-free (Vite plugin)
- **TypeScript** — Strict mode, no `any`
- **Cloudflare Pages** — Adapter: `@sveltejs/adapter-cloudflare`

## Conventions

### Svelte 5 Runes
- Use `$state()` for reactive local variables
- Use `$derived()` for computed values (never `$state` + manual update)
- Use `$effect()` for side effects (scroll listeners, etc.)
- Use `{@render children()}` for slot content
- Avoid legacy `export let` / `$$props` / `on:click`

### Classes
- All colors via Tailwind theme classes: `text-primary`, `bg-primary`, `bg-secondary`, `text-accent`
- No hardcoded hex colors anywhere in `.svelte` files
- Inline JS styles use `var(--color-primary, #14B88C)` pattern

### Layout
- `/donasi` routes use **full-screen layout** (no Navbar/Footer/BottomNav)
- Detection in `+layout.svelte`: `page.url.pathname.includes('/donasi')`
- Main pages: `pt-16 pb-16 md:pb-0` (accounting for fixed navbar + bottomnav)

## Naming

- Routes: kebab-case (`/campaign/[slug]/donasi`)
- Components: PascalCase (`CampaignCard.svelte`, `BottomNav.svelte`)
- Types/interfaces: PascalCase (`TenantBranding`, `CampaignListItem`)
- Functions: camelCase (`resolveTenant`, `formatRupiah`)
- Files: camelCase for lib utilities (`api.ts`, `payment.ts`)

## Imports

```typescript
// Relative for sibling modules
import { CampaignCard } from '$lib/components/CampaignCard.svelte';
import { config } from '$lib/config';
```
