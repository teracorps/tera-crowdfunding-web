import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * GET /api/public/funding/donations/history
 * Get donation history by email (for guest users) or by user session.
 * Query params: email (optional if authenticated)
 */
export async function GET({ url, locals }: RequestEvent) {
	try {
		const sb = locals.serviceClient;
		const email = url.searchParams.get('email');

		if (!email) {
			return json({ success: false, error: 'Parameter email diperlukan' }, { status: 400 });
		}

		const { data: donations, error } = await sb
			.schema('business_funding')
			.from('donations')
			.select(`
				id,
				donation_number,
				amount,
				donation_date,
				payment_status,
				payment_method,
				is_anonymous,
				message,
				created_at,
				campaign_id,
				campaign:campaign_id (
					id,
					title,
					slug,
					cover_image
				)
			`)
			.eq('donor_email', email)
			.order('created_at', { ascending: false })
			.limit(50);

		if (error) {
			console.error('[Donation History] Error:', error);
			return json({ success: false, error: 'Gagal memuat riwayat donasi' }, { status: 500 });
		}

		// Format response
		const data = (donations || []).map((d: any) => ({
			id: d.id,
			donation_number: d.donation_number,
			amount: Number(d.amount),
			date: d.donation_date,
			payment_status: d.payment_status,
			payment_method: d.payment_method,
			is_anonymous: d.is_anonymous,
			message: d.message,
			campaign: d.campaign
				? {
						id: d.campaign.id,
						title: d.campaign.title,
						slug: d.campaign.slug,
						cover_image: d.campaign.cover_image,
					}
				: null,
		}));

		return json({ success: true, data });
	} catch (err: any) {
		console.error('[Donation History] Unexpected:', err);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}
