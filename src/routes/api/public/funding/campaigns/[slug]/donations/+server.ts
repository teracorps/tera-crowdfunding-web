import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * GET /api/public/funding/campaigns/[slug]/donations
 * Get all donations for a campaign by its slug.
 * Returns paginated donations sorted by newest first.
 */
export async function GET({ params, url, locals }: RequestEvent) {
	const { slug } = params;
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
	const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get('per_page') || '50')));

	try {
		const sb = locals.serviceClient;

		// Find campaign by slug
		const { data: campaign, error: campaignError } = await sb
			.schema('business_funding')
			.from('campaigns')
			.select('id, title, slug')
			.eq('slug', slug)
			.maybeSingle();

		if (campaignError) {
			console.error('[Campaign Donations] Campaign fetch error:', campaignError);
			return json({ success: false, error: 'Gagal memuat campaign' }, { status: 500 });
		}

		if (!campaign) {
			return json({ success: false, error: 'Campaign tidak ditemukan' }, { status: 404 });
		}

		// Get donations with count
		const from = (page - 1) * perPage;
		const to = from + perPage - 1;

		const { data: donations, count, error } = await sb
			.schema('business_funding')
			.from('donations')
			.select('*', { count: 'exact' })
			.eq('campaign_id', campaign.id)
			.order('created_at', { ascending: false })
			.range(from, to);

		if (error) {
			console.error('[Campaign Donations] Query error:', error);
			return json({ success: false, error: 'Gagal memuat daftar donasi' }, { status: 500 });
		}

		// Format response
		const data = (donations || []).map((d: any) => ({
			id: d.id,
			donation_number: d.donation_number || '',
			donation_date: d.donation_date || d.created_at?.slice(0, 10),
			amount: Number(d.amount),
			donor_name: d.is_anonymous ? 'Anonim' : (d.donor_name || ''),
			donor_email: d.donor_email || '',
			is_anonymous: d.is_anonymous || false,
			message: d.message || '',
			payment_method: d.payment_method || '',
			payment_status: d.payment_status || 'pending',
			created_at: d.created_at,
		}));

		return json({
			success: true,
			data,
			meta: {
				page,
				per_page: perPage,
				total: count || 0,
				total_pages: count ? Math.ceil(count / perPage) : 0,
			},
		});
	} catch (err: any) {
		console.error('[Campaign Donations] Unexpected error:', err);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}
