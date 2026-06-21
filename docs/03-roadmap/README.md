# Roadmap & Progress

Progress tracker untuk platform **Terabisa (tera-crowdfunding-web)**.

## Legend

- ✅ **Done** — Implemented and deployed
- 🟡 **Partial** — Implemented but needs work
- ❌ **Missing** — Not yet implemented
- 🔮 **Future** — Planned for later phase

---

## Phase 1: MVP Core (✅ Done)

### Campaign Management
| Item | Status | Notes |
| ---- | ------ | ----- |
| Campaign listing (grid + pagination) | ✅ Done | Filter by category, sort, search |
| Campaign detail page | ✅ Done | Story, updates, progress bar |
| Campaign creation flow | ✅ Done | Form with image upload |
| Campaign management | ✅ Done | Edit, update status |
| Categories system | ✅ Done | Predefined + filterable |

### Donation Flow
| Item | Status | Notes |
| ---- | ------ | ----- |
| Dedicated donation page (`/donasi`) | ✅ Done | Full-screen mobile-first layout |
| Nominal presets (6 options) | ✅ Done | Rp 100rb – Rp 1jt |
| Custom nominal input | ✅ Done | User-defined amount |
| Payment method picker | ✅ Done | 6 methods (BCA, Mandiri, GoPay, OVO, DANA, ShopeePay) |
| Midtrans Snap integration | ✅ Done | Sandbox, token generation |
| Payment status check | ✅ Done | via Core API |
| Payment notification webhook | ✅ Done | POST callback |
| Invoice/receipt page | ✅ Done | `/donasi/invoice/[id]` |
| Post-donation success page | ✅ Done | `/donasi/selesai/[id]` |

### Auth & Users
| Item | Status | Notes |
| ---- | ------ | ----- |
| Register (email/password) | ✅ Done | `/auth/daftar` |
| Login | ✅ Done | `/auth/masuk` |
| User dashboard | ✅ Done | `/user` |
| Donation history | ✅ Done | `/user/donations` |
| User inbox | ✅ Done | `/user/inbox` |

### UI/UX
| Item | Status | Notes |
| ---- | ------ | ----- |
| Landing page (hero + stats) | ✅ Done | |
| Navbar (3 logo modes) | ✅ Done | text-only, icon-text, logo-text |
| Bottom navigation (mobile) | ✅ Done | |
| Footer (desktop) | ✅ Done | |
| Skeleton loading states | ✅ Done | |
| CampaignCard component | ✅ Done | |
| Responsive grid layout | ✅ Done | |
| Full-screen donation layout | ✅ Done | No navbar/bottomnav/footer on `/donasi` |

## Phase 2: Multi-Tenant & Theming (✅ Mostly Done)

| Item | Status | Notes |
| ---- | ------ | ----- |
| Subdomain routing | ✅ Done | `[org].crowdfunding.tera-platform.my.id` |
| Tenant resolution | ✅ Done | `resolveTenant()` in `hooks.server.ts` |
| Config-driven theming (CSS vars) | ✅ Done | `@theme` block + dynamic overrides |
| Logo 3 modes (Navbar + Footer) | ✅ Done | text-only, icon-text, logo-text |
| Branding schema (DB) | ✅ Done | `organization_branding` table |
| Tenant onboarding wizard | ✅ Done | 4 steps: subdomain → branding → plan → done |
| Feature entitlements | ✅ Done | Plan-based feature flags |
| Admin panel | 🟡 Partial | Basic campaign manage, needs enhancement |
| **Wire branding from API to tenant** | 🟡 **Partial** | Navbar/Footer render logo, but actual DB data not fully piped yet |
| Admin branding wizard update | ❌ **Missing** | Logo fields not in admin UI yet |

## Phase 3: Hardening (🟡 Partial)

| Item | Status | Notes |
| ---- | ------ | ----- |
| Campaign → API empty state | 🟡 Partial | API returns 0 campaigns (no seed data) |
| Error handling | 🟡 Partial | Basic try/catch, need more edge cases |
| Mobile responsive | ✅ Done | Tailwind responsive classes |
| PWA manifest | ✅ Done | `manifest.json` |
| svelte-check | ❌ Missing | Not run yet |
| Unit tests | ❌ Missing | No vitest setup |
| E2E tests | ❌ Missing | Playwright not configured |
| Performance optimization | ❌ Missing | Image optimization, lazy loading |

## Phase 4: Missing Features (❌ Missing)

| Item | Priority | Notes |
| ---- | -------- | ----- |
| **Donation leaderboard** | P3 | Top donors per campaign |
| **Campaign updates/timeline** | P3 | Organizer can post updates |
| **Social sharing** | P3 | Share campaign to WhatsApp, Twitter, etc. |
| **Campaign search** | P3 | Full-text search for campaigns |
| **Email notification system** | P3 | Confirmation emails, receipt |
| **Donation export (CSV)** | P3 | For campaign organizers |
| **Campaign report** | P3 | Donation stats, charts |
| **Midtrans Production** | P2 | Switch from sandbox → production key |

## Phase 5: Future Plans (🔮 Future)

| Item | Description |
| ---- | ----------- |
| **Recurring donation** | Monthly/auto-deduct donation via Midtrans |
| **Payout/disbursement system** | Auto-payout to campaign organizer's bank account |
| **Campaign verification** | KYC/verification badge for trusted campaigns |
| **SMS notifications** | Via Twilio or similar |
| **Campaign API (public)** | REST API for third-party integration |
| **Mobile app** | Flutter mobile app |
| **Multi-language** | English + Indonesia |
| **Advanced analytics** | Dashboard for platform admin |
| **Custom domain per tenant** | Tenant uses their own domain (e.g., `donasi.yayasan.org`) |
| **Referral program** | Share link → track → reward |
| **Crowdfunding tiers** | Reward-based (not just donation) |

---

## Current Progress Summary

```
Phase 1 (MVP Core):    ████████████  95%  (Donation flow complete)
Phase 2 (Multi-Tenant): █████████░░░  75%  (Branding wiring needs polish)
Phase 3 (Hardening):    ████░░░░░░░░  35%  (Tests, error handling)
Phase 4 (Missing):      █░░░░░░░░░░░  10%  (Leaderboard, sharing, search)
Phase 5 (Future):       ░░░░░░░░░░░░   0%
```
