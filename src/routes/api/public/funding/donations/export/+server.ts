import type { RequestEvent } from '@sveltejs/kit';

/**
 * GET /api/public/funding/donations/export
 * Export donations to CSV file.
 *
 * Optional query params:
 *   - from_date: Filter donations on or after this date (YYYY-MM-DD)
 *   - to_date: Filter donations on or before this date (YYYY-MM-DD)
 *   - campaign_id: Filter by campaign
 *   - status: Filter by payment status (paid, waiting_payment, expired, failed, cancelled)
 */
export async function GET({ url, locals }: RequestEvent) {
	try {
		const sb = locals.serviceClient;

		// Build query with join to campaigns
		let query = sb
			.schema('business_funding')
			.from('donations')
			.select(`
				id,
				donation_number,
				donation_date,
				donor_name,
				donor_email,
				amount,
				method,
				payment_method,
				payment_status,
				message,
				is_anonymous,
				campaign:campaign_id (
					id,
					title
				)
			`)
			.order('created_at', { ascending: false });

		// Apply optional filters
		const fromDate = url.searchParams.get('from_date');
		const toDate = url.searchParams.get('to_date');
		const campaignId = url.searchParams.get('campaign_id');
		const status = url.searchParams.get('status');

		if (fromDate) {
			query = query.gte('donation_date', fromDate);
		}
		if (toDate) {
			query = query.lte('donation_date', toDate);
		}
		if (campaignId) {
			query = query.eq('campaign_id', campaignId);
		}
		if (status) {
			query = query.eq('payment_status', status);
		}

		const { data: donations, error } = await query;

		if (error) {
			console.error('[Export CSV] Query error:', error);
			return new Response('Gagal memuat data donasi', { status: 500 });
		}

		// CSV header row
		const headers = [
			'Donation Number',
			'Date',
			'Donor Name',
			'Donor Email',
			'Amount (IDR)',
			'Method',
			'Payment Status',
			'Campaign Title',
			'Message',
		];

		// Format each donation as a CSV row
		const rows = (donations || []).map((d: any) => {
			// Format amount using IDR currency format
			const formattedAmount = new Intl.NumberFormat('id-ID', {
				style: 'currency',
				currency: 'IDR',
				minimumFractionDigits: 0,
			}).format(Number(d.amount));

			// Escape and wrap string fields that may contain commas or quotes
			const escCsv = (val: string | null | undefined): string => {
				if (!val) return '';
				const str = String(val);
				if (str.includes(',') || str.includes('"') || str.includes('\n')) {
					return `"${str.replace(/"/g, '""')}"`;
				}
				return str;
			};

			return [
				escCsv(d.donation_number),
				escCsv(d.donation_date),
				d.is_anonymous ? 'Anonymous' : escCsv(d.donor_name),
				d.is_anonymous ? '' : escCsv(d.donor_email),
				formattedAmount,
				escCsv(d.method || d.payment_method || ''),
				escCsv(d.payment_status),
				escCsv(d.campaign?.title),
				d.is_anonymous ? '' : escCsv(d.message),
			].join(',');
		});

		// Combine header + rows
		const csvContent = [headers.join(','), ...rows].join('\r\n');

		return new Response(csvContent, {
			headers: {
				'Content-Type': 'text/csv; charset=utf-8',
				'Content-Disposition': 'attachment; filename="donasi-export.csv"',
			},
		});
	} catch (err: any) {
		console.error('[Export CSV] Unexpected error:', err);
		return new Response('Internal server error', { status: 500 });
	}
}
