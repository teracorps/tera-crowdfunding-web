import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * GET /api/public/funding/donations/invoice/[id]
 * Returns print-friendly HTML invoice for a donation.
 */
export async function GET({ params, locals }: RequestEvent) {
	const { id } = params;

	if (!id) {
		throw error(400, 'ID donasi diperlukan');
	}

	const sb = locals.serviceClient;

	const { data: donation, error: dbError } = await sb
		.schema('business_funding')
		.from('donations')
		.select(`
			id,
			donation_number,
			amount,
			donation_date,
			payment_status,
			status,
			donor_name,
			donor_email,
			is_anonymous,
			message,
			created_at,
			campaign:campaign_id (
				id,
				title,
				slug
			)
		`)
		.eq('id', id)
		.maybeSingle();

	if (dbError) {
		console.error('[Invoice] DB error:', dbError);
		throw error(500, 'Gagal memuat data donasi');
	}

	if (!donation) {
		throw error(404, 'Donasi tidak ditemukan');
	}

	const amount = Number(donation.amount);
	const campaign = donation.campaign as { id: string; title: string; slug: string } | null;

	function formatRupiah(n: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
		}).format(n);
	}

	const statusLabels: Record<string, string> = {
		settlement: 'Dibayar',
		capture: 'Dibayar',
		pending: 'Menunggu Pembayaran',
		deny: 'Ditolak',
		cancel: 'Dibatalkan',
		expire: 'Kadaluwarsa',
		failure: 'Gagal',
		waiting_payment: 'Menunggu Pembayaran',
	};

	const paymentStatus = donation.payment_status || donation.status || 'waiting_payment';
	const statusLabel = statusLabels[paymentStatus] || paymentStatus;
	const isSuccess = ['settlement', 'capture'].includes(paymentStatus);
	const dateFormatted = donation.donation_date
		? new Date(donation.donation_date + 'T00:00:00').toLocaleDateString('id-ID', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
		  })
		: '-';

	const tenantName = 'Terabisa';

	const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Invoice Donasi - ${tenantName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            color: #1f2937;
            line-height: 1.5;
        }
        .invoice-wrapper {
            max-width: 480px;
            margin: 0 auto;
            padding: 24px 16px;
        }
        .invoice-card {
            background: #fff;
            border-radius: 16px;
            padding: 32px 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        /* Header */
        .invoice-header {
            text-align: center;
            border-bottom: 2px solid #f3f4f6;
            padding-bottom: 20px;
            margin-bottom: 24px;
        }
        .invoice-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 8px;
        }
        .invoice-logo svg {
            width: 36px;
            height: 36px;
        }
        .invoice-logo span {
            font-size: 22px;
            font-weight: 700;
            color: #14B88C;
        }
        .invoice-title {
            font-size: 14px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        /* Status Badge */
        .status-badge {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .status-badge.success {
            background: #d1fae5;
            color: #065f46;
        }
        .status-badge.pending {
            background: #fef3c7;
            color: #92400e;
        }
        .status-badge.other {
            background: #fee2e2;
            color: #991b1b;
        }
        /* Amount */
        .amount-box {
            text-align: center;
            margin-bottom: 24px;
        }
        .amount-label {
            font-size: 12px;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }
        .amount-value {
            font-size: 32px;
            font-weight: 800;
            color: #111827;
        }
        /* Detail rows */
        .detail-table {
            width: 100%;
            border-collapse: collapse;
        }
        .detail-table tr {
            border-bottom: 1px solid #f3f4f6;
        }
        .detail-table tr:last-child {
            border-bottom: none;
        }
        .detail-table td {
            padding: 10px 0;
            font-size: 14px;
        }
        .detail-table td:first-child {
            color: #6b7280;
            width: 38%;
        }
        .detail-table td:last-child {
            color: #1f2937;
            font-weight: 500;
            text-align: right;
        }
        /* Footer */
        .invoice-footer {
            text-align: center;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 2px solid #f3f4f6;
            font-size: 12px;
            color: #9ca3af;
        }
        .invoice-footer p + p {
            margin-top: 4px;
        }
        /* Print Styles */
        @media print {
            body {
                background: #fff;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .invoice-wrapper {
                max-width: 100%;
                padding: 0;
            }
            .invoice-card {
                box-shadow: none;
                border-radius: 0;
                padding: 40px;
            }
            .no-print {
                display: none !important;
            }
        }
        /* Print button (screen only) */
        .no-print {
            text-align: center;
            margin-top: 20px;
        }
        .btn-print {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 32px;
            background: #14B88C;
            color: #fff;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }
        .btn-print:hover {
            background: #0F9A75;
        }
        .btn-print svg {
            width: 18px;
            height: 18px;
        }
    </style>
</head>
<body>
    <div class="invoice-wrapper">
        <div class="invoice-card">
            <!-- Header -->
            <div class="invoice-header">
                <div class="invoice-logo">
                    <!-- Terabisa logo placeholder -->
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="32" rx="8" fill="#14B88C"/>
                        <path d="M16 7C13.5 7 9 10 9 16s4.5 9 7 9c1.5 0 3-1.5 3-3s-1.5-3-3-3-2 1-2 2 1 1 2 1c1 0 2-2 2-5s-2-5-4-5-4 2-4 4 2 3 4 3 3-1 3-2-1-1-2-1-1 .5-1 1 .5 1 1 1c2 0 3-1.5 3-4s-1-4-3-4z" fill="#fff"/>
                    </svg>
                    <span>${tenantName}</span>
                </div>
                <div class="invoice-title">Invoice Donasi</div>
            </div>

            <!-- Status Badge -->
            <div style="text-align:center;">
                <span class="status-badge ${isSuccess ? 'success' : paymentStatus === 'waiting_payment' || paymentStatus === 'pending' ? 'pending' : 'other'}">
                    ${statusLabel}
                </span>
            </div>

            <!-- Amount -->
            <div class="amount-box">
                <div class="amount-label">Total Donasi</div>
                <div class="amount-value">${formatRupiah(amount)}</div>
            </div>

            <!-- Details -->
            <table class="detail-table">
                <tr>
                    <td>No. Donasi</td>
                    <td>${donation.donation_number}</td>
                </tr>
                <tr>
                    <td>Campaign</td>
                    <td>${campaign?.title || '-'}</td>
                </tr>
                <tr>
                    <td>Nama Donatur</td>
                    <td>${donation.is_anonymous ? 'Anonim' : donation.donor_name || '-'}</td>
                </tr>
                <tr>
                    <td>Tanggal</td>
                    <td>${dateFormatted}</td>
                </tr>
                <tr>
                    <td>Status Pembayaran</td>
                    <td>${statusLabel}</td>
                </tr>
                ${donation.message ? `<tr><td>Pesan</td><td style="font-weight:400;font-style:italic;">${donation.message}</td></tr>` : ''}
            </table>

            <!-- QR Code Placeholder -->
            <div style="text-align:center;margin-top:24px;padding:16px;background:#f9fafb;border-radius:12px;">
                <div style="display:inline-block;background:#fff;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">
                    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="10" y="10" width="8" height="8" fill="#14B88C"/>
                        <rect x="22" y="10" width="8" height="8" fill="#14B88C"/>
                        <rect x="34" y="10" width="8" height="8" fill="#14B88C"/>
                        <rect x="46" y="10" width="8" height="8" fill="#14B88C"/>
                        <rect x="58" y="10" width="8" height="8" fill="#14B88C"/>
                        <rect x="10" y="22" width="8" height="8" fill="#14B88C"/>
                        <rect x="34" y="22" width="8" height="8" fill="#14B88C"/>
                        <rect x="58" y="22" width="8" height="8" fill="#14B88C"/>
                        <rect x="10" y="34" width="8" height="8" fill="#14B88C"/>
                        <rect x="22" y="34" width="8" height="8" fill="#14B88C"/>
                        <rect x="34" y="34" width="8" height="8" fill="#14B88C"/>
                        <rect x="46" y="34" width="8" height="8" fill="#14B88C"/>
                        <rect x="58" y="34" width="8" height="8" fill="#14B88C"/>
                        <rect x="10" y="46" width="8" height="8" fill="#14B88C"/>
                        <rect x="34" y="46" width="8" height="8" fill="#14B88C"/>
                        <rect x="58" y="46" width="8" height="8" fill="#14B88C"/>
                        <rect x="10" y="58" width="8" height="8" fill="#14B88C"/>
                        <rect x="22" y="58" width="8" height="8" fill="#14B88C"/>
                        <rect x="34" y="58" width="8" height="8" fill="#14B88C"/>
                        <rect x="46" y="58" width="8" height="8" fill="#14B88C"/>
                        <rect x="58" y="58" width="8" height="8" fill="#14B88C"/>
                        <rect x="70" y="10" width="8" height="8" fill="#14B88C"/>
                        <rect x="82" y="10" width="8" height="8" fill="#14B88C"/>
                        <rect x="70" y="22" width="8" height="8" fill="#14B88C"/>
                        <rect x="82" y="34" width="8" height="8" fill="#14B88C"/>
                        <rect x="70" y="46" width="8" height="8" fill="#14B88C"/>
                        <rect x="82" y="58" width="8" height="8" fill="#14B88C"/>
                        <rect x="70" y="70" width="8" height="8" fill="#14B88C"/>
                        <rect x="82" y="70" width="8" height="8" fill="#14B88C"/>
                        <rect x="46" y="70" width="8" height="8" fill="#14B88C"/>
                        <rect x="34" y="70" width="8" height="8" fill="#14B88C"/>
                        <rect x="22" y="70" width="8" height="8" fill="#14B88C"/>
                        <rect x="10" y="70" width="8" height="8" fill="#14B88C"/>
                        <rect x="58" y="70" width="8" height="8" fill="#14B88C"/>
                    </svg>
                </div>
                <p style="font-size:11px;color:#9ca3af;margin-top:8px;">Pindai untuk verifikasi donasi</p>
            </div>

            <!-- Footer -->
            <div class="invoice-footer">
                <p><strong>${tenantName}</strong> — Platform Crowdfunding Terpercaya</p>
                <p>Invoice ini sah dan diterbitkan secara elektronik</p>
                <p style="margin-top:8px;">${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>

        <!-- Print Button (hidden when printing) -->
        <div class="no-print">
            <button class="btn-print" onclick="window.print()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 9V2h12v7"/>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                    <path d="M6 14h12v8H6z"/>
                </svg>
                Cetak / Simpan PDF
            </button>
        </div>
    </div>
</body>
</html>`;

	return new Response(html, {
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': 'no-store',
		},
	});
}
