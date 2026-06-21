# Deployment Guide

## Build

```bash
npm run build    # rolldown build, ~12s
```

The build outputs to `.svelte-kit/cloudflare/`.

## Deploy to Cloudflare Pages

```bash
npx wrangler pages deploy .svelte-kit/cloudflare \
  --project-name tera-crowdfunding-web
```

### Env Variables

Must be set in Cloudflare Pages dashboard:

| Variable | Description |
| -------- | ----------- |
| `PUBLIC_SUPABASE_URL` | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `PUBLIC_SUBOMAIN` | Main subdomain (e.g., `crowdfunding`) |
| `MIDTRANS_SERVER_KEY` | Midtrans server key |
| `MIDTRANS_CLIENT_KEY` | Midtrans client key |
| `MIDTRANS_IS_PRODUCTION` | `true` or `false` |

⚠️ **Important:** Cloudflare Pages API `PATCH` replaces ALL env vars at once. Always include the full set.

## Production URL

`https://tera-crowdfunding-web.pages.dev`

## Docker (Node Deployment)

Alternative deployment via Docker:

```bash
docker-compose up -d
```

Uses `@sveltejs/adapter-node` for Node.js server deployment.

## Troubleshooting

- **Stale build:** `rm -rf .svelte-kit && npm run build`
- **`nodejs_compat` needed:** Enable via Cloudflare Pages dashboard → Settings → Functions → Compatibility flags
- **`account_id` error:** Don't put in `wrangler.toml` — use environment variable instead
