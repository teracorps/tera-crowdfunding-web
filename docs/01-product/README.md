# Terabisa — Product Overview

**Terabisa** adalah platform crowdfunding multi-tenant (seperti Kitabisa/GotFundMe) yang memungkinkan organisasi/yayasan membuat halaman donasi dengan branding mereka sendiri.

## Vision

Menjadi platform crowdfunding terpercaya di Indonesia yang memberdayakan organisasi sosial, yayasan, dan individu untuk menggalang dana dengan mudah — dengan identitas brand masing-masing.

## Target Users

- **Organisasi / Yayasan** — Ingin halaman donasi dengan brand sendiri (subdomain kustom, warna, logo)
- **Individu** — Campaign pribadi untuk biaya pengobatan, pendidikan, bencana
- **Admin Platform** — Mengelola campaign, payout, dan tenant

## Core Features

| Feature | Status | Priority |
| ------- | ------ | -------- |
| Campaign listing (grid + filter) | ✅ Done | P1 |
| Campaign detail page | ✅ Done | P1 |
| Donation form (mobile-first) | ✅ Done | P1 |
| Midtrans Snap payment | ✅ Done | P1 |
| Donation invoice & receipt | ✅ Done | P2 |
| User dashboard (riwayat donasi) | ✅ Done | P2 |
| Auth (register/login) | ✅ Done | P1 |
| Multi-tenant subdomain routing | ✅ Done | P2 |
| Config-driven theming (CSS vars) | ✅ Done | P2 |
| Tenant onboarding wizard | ✅ Done | P2 |
| Admin panel (campaign manage) | ✅ Done | P2 |
| Payment notification webhook | ✅ Done | P1 |
| Campaign creation flow | ✅ Done | P2 |
| Donation leaderboard | ❌ Missing | P3 |
| Campaign updates/timeline | ❌ Missing | P3 |
| Social sharing features | ❌ Missing | P3 |
| Recurring donation | ❌ Missing | Future |
| Payout/disbursement system | ❌ Missing | Future |
| Email/SMS notification | ❌ Missing | Future |

## Tech Stack

- **Frontend:** SvelteKit 5, Tailwind CSS v4
- **Payment:** Midtrans Snap (sandbox → production)
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Cloudflare Pages
- **Auth:** Supabase Auth
