# Subdomain Routing & DNS Setup

## Architecture

```
User requests: https://yayasan-sehat.crowdfunding.tera-platform.my.id
                                       ↓
                          Cloudflare (DNS wildcard)
                                       ↓
                        SvelteKit Server (Node/Firebase)
                                       ↓
                    hooks.server.ts → resolveTenant()
                                       ↓
                    Queries Supabase: organizations.subdomain = 'yayasan-sehat'
                                       ↓
                          Loads org branding + settings
                                       ↓
                     Renders white-labeled pages with org_id scoping
```

## DNS Configuration

### Wildcard Subdomain (Cloudflare)

Create a `CNAME` or `A` record for `*.crowdfunding.tera-platform.my.id` pointing to your deployment server.

| Type | Name | Target |
|------|------|--------|
| CNAME | `*.crowdfunding` | `your-deployment.vercel.app` (or your server IP) |

Or if using Node deployment:

| Type | Name | Target |
|------|------|--------|
| A | `*.crowdfunding` | `SERVER_IP_ADDRESS` |

### Custom Domain (per tenant)

For tenants who want their own domain (e.g., `donasi.yayasan.org`):

1. Tenant adds CNAME record pointing to `crowdfunding.tera-platform.my.id`
2. Admin verifies domain in Org Settings
3. `organization_branding.custom_domain` is set and verified

## How Tenant Resolution Works

The `resolveTenant()` function in `src/lib/tenant.ts`:

1. **Extract subdomain** from Host header
   - `yayasan-sehat.crowdfunding.tera-platform.my.id` → `yayasan-sehat`
   - `crowdfunding.tera-platform.my.id` → `null` (main platform)

2. **Lookup organization** in Supabase
   - Query `business_core.organizations` by `subdomain`
   - If custom domain, check `business_core.organization_branding.custom_domain`

3. **Load branding** from `business_core.organization_branding`

4. **Load subscription** from `platform_billing.organization_subscriptions`

5. **Load entitlements** from `platform_billing.plan_entitlements`

## Testing

### Local Development
Add entries to `/etc/hosts`:
```
127.0.0.1  localhost
127.0.0.1  yayasan-test.crowdfunding.tera-platform.my.id
```

### Staging
Deploy to staging URL and test with different subdomains.

## Tenant Scoping (Data Isolation)

All queries MUST filter by `organization_id`:

```typescript
// Correct — scoped to tenant
const { data } = await supabase
  .schema('business_funding')
  .from('campaigns')
  .select('*')
  .eq('organization_id', tenant.id);

// Main platform (no tenant) = show campaigns across all orgs
// but each org only sees their own when accessed via their subdomain
```

## Onboarding Flow

1. User visits main site → Sign up
2. After signup, redirected to `/onboarding`
3. Step 1: Choose subdomain → create org → activate trial
4. Step 2: Customize branding (colors, logo, name)
5. Step 3: Choose plan (Starter free / Business paid)
6. Step 4: Setup complete → redirected to org's subdomain
