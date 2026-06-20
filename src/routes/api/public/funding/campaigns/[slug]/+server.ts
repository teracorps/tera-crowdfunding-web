import { json } from '@sveltejs/kit';

/**
 * GET /api/public/funding/campaigns/[slug]
 * Get a single campaign by slug with full details.
 */
export async function GET({ params, locals }) {
	const { slug } = params;

	try {
		const sb = locals.serviceClient;

		const { data: campaign, error } = await sb
			.schema('business_funding')
			.from('campaigns')
			.select('*')
			.eq('slug', slug)
			.maybeSingle();

		if (error) {
			console.error('[Funding/Campaign] Error:', error);
			return json({ success: false, error: error.message }, { status: 500 });
		}

		if (!campaign) {
			return json({ success: false, error: 'Campaign not found' }, { status: 404 });
		}

		// Get category name
		let categoryName = '';
		if (campaign.category_id) {
			const { data: cat } = await sb
				.schema('business_funding')
				.from('campaign_categories')
				.select('name')
				.eq('id', campaign.category_id)
				.maybeSingle();
			if (cat) categoryName = cat.name;
		}

		// Get campaign updates
		const { data: updates } = await sb
			.schema('business_funding')
			.from('campaign_updates')
			.select('id, content, created_at')
			.eq('campaign_id', campaign.id)
			.order('created_at', { ascending: false })
			.limit(20);

		// Transform to frontend format
		const daysRemaining = campaign.end_date
			? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / 86400000))
			: 999;

		const result = {
			id: campaign.id,
			slug: campaign.slug,
			title: campaign.title,
			description: campaign.description || '',
			story: campaign.story || '',
			category: categoryName,
			cover_image: campaign.cover_image_url || '',
			target_amount: Number(campaign.target_amount),
			raised_amount: Number(campaign.raised_amount),
			donor_count: campaign.donor_count,
			days_remaining: daysRemaining,
			status: campaign.status,
			organizer_name: campaign.organizer_name,
			organizer_photo: campaign.organizer_photo_url || '',
			is_urgent: campaign.is_urgent,
			created_at: campaign.created_at,
			updates: (updates || []).map((u: any) => ({
				id: u.id,
				content: u.content,
				created_at: u.created_at,
			})),
		};

		return json({ success: true, data: result });
	} catch (err: any) {
		console.error('[Funding/Campaign] Unexpected error:', err);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}
