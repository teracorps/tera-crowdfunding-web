import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * GET /api/public/funding/donations/[id]/status
 * Check the payment status of a donation.
 */
export async function GET({ params, locals }: RequestEvent) {
	try {
		const { id } = params;

		if (!id) {
			return json({ success: false, error: 'ID donasi diperlukan' }, { status: 400 });
		}

		const sb = locals.serviceClient;

		const { data: donation, error } = await sb
			.schema('business_funding')
			.from('donations')
			.select('id, donation_number, amount, payment_status, payment_gateway_ref, payment_redirect_url, donation_date, campaign:campaign_id(title, slug)')
			.eq('id', id)
			.maybeSingle();

		if (error) {
			console.error('[Payment Status] Error:', error);
			return json({ success: false, error: 'Gagal memuat status donasi' }, { status: 500 });
		}

		if (!donation) {
			return json({ success: false, error: 'Donasi tidak ditemukan' }, { status: 404 });
		}

		return json({
			success: true,
			data: {
				id: donation.id,
				donation_number: donation.donation_number,
				amount: Number(donation.amount),
				date: donation.donation_date,
				payment_status: donation.payment_status,
				payment_gateway_ref: donation.payment_gateway_ref,
				redirect_url: donation.payment_redirect_url,
				campaign_title: donation.campaign?.title,
				campaign_slug: donation.campaign?.slug,
			},
		});
	} catch (err: any) {
		console.error('[Payment Status] Unexpected:', err);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}
