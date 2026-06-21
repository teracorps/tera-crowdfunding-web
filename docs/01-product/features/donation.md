# Donation Flow

## Dedicated Donation Page

Donasi menggunakan **dedicated subpath** (`/campaign/[slug]/donasi`) — bukan modal — untuk UX mobile maksimal.

**Alasan:**
- Full-screen mobile layout tanpa distraksi navbar/footer/bottomnav
- URL bisa di-share langsung ke halaman donasi
- Flow fokus: pilih nominal → metode bayar → data donatur → bayar
- Tidak ada konflik z-index dengan modal

## Layout (Mobile-First)

```
┌──────────────────────┐
│ ← [Judul Campaign]   │  ← Back button + campaign name
├──────────────────────┤
│                      │
│ [Campaign Summary]   │  ← Cover image, raised amount
│                      │
│ [Nominal Grid]       │  ← 2×3 presets (100rb–1jt) + input custom
│                      │
│ [Metode Pembayaran]  │  ← Modal picker (BCA, Mandiri, GoPay, OVO, dll)
│                      │
│ [Data Donatur]       │  ← Sapaan, nama, toggle anonim
│                      │
├──────────────────────┤
│ Donasi - Rp XXX.XXX  │  ← Fixed bottom CTA
└──────────────────────┘
```

## Nominal Presets

| Button | Value |
|--------|-------|
| "Sering dipilih" | Rp 100.000 |
| | Rp 200.000 |
| | Rp 300.000 |
| | Rp 500.000 |
| | Rp 750.000 |
| | Rp 1.000.000 |

## Payment Methods

| Method | Type | Status |
| ------ | ---- | ------ |
| BCA Virtual Account | Bank Transfer | ✅ Implemented |
| Mandiri Bill | Bank Transfer | ✅ Implemented |
| GoPay | E-Wallet | ✅ Implemented |
| OVO | E-Wallet | ✅ Implemented |
| DANA | E-Wallet | ✅ Implemented |
| ShopeePay | E-Wallet | ✅ Implemented |

## Payment Integration (Midtrans Snap)

- **Client:** Midtrans Snap JS (snap.js) — embedded popup
- **Server:** `midtrans-client` npm package
- **Environment:** Sandbox (`app.sandbox.midtrans.com`) → Production (`app.midtrans.com`)
- **Status mapping:** capture/settlement → 'settlement', pending → 'pending', deny/cancel/expire → 'failed'

## API Endpoints

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/donations` | POST | Submit donation → return Snap token |
| `/donations/history` | GET | Riwayat donasi by email |
| `/donations/[id]` | GET | Donation status check |
| `/donations/invoice/[id]` | GET | Invoice data |
| `/payments/notification` | POST | Midtrans payment notification webhook |

## Routes

| Route | Description |
| ----- | ----------- |
| `/campaign/[slug]/donasi` | Full-screen donation page |
| `/donasi/invoice/[id]` | Invoice/receipt page |
| `/donasi/selesai/[id]` | Post-donation success page |
| `/user/donations` | User's donation history |
