import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * GET /api/public/funding/campaigns
 * List public campaigns with pagination, filtering, and sorting.
 *
 * Query params:
 *   page      - Page number (default: 1)
 *   per_page  - Items per page (default: 12, max: 50)
 *   category  - Filter by category slug
 *   status    - Filter by status (default: active)
 *   sort      - Sort order: popular, urgent, newest, ending_soon
 *   search    - Search in title/description
 */
export async function GET({ url, locals }) {
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
	const perPage = Math.min(50, Math.max(1, parseInt(url.searchParams.get('per_page') || '12')));
	const categorySlug = url.searchParams.get('category') || '';
	const statusFilter = url.searchParams.get('status') || 'active';
	const sort = url.searchParams.get('sort') || 'newest';
	const search = url.searchParams.get('search') || '';

	try {
		const sb = locals.serviceClient;
		let query = sb
			.schema('business_funding')
			.from('campaigns')
			.select('*', { count: 'exact' });

		// Filter by status
		if (statusFilter) {
			query = query.eq('status', statusFilter);
		}

		// Filter by category
		if (categorySlug) {
			const { data: cat } = await sb
				.schema('business_funding')
				.from('campaign_categories')
				.select('id')
				.eq('slug', categorySlug)
				.maybeSingle();
			if (cat) {
				query = query.eq('category_id', cat.id);
			}
		}

		// Search
		if (search) {
			query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
		}

		// Sort
		switch (sort) {
			case 'popular':
				query = query.order('donor_count', { ascending: false });
				break;
			case 'urgent':
				query = query.order('is_urgent', { ascending: false });
				query = query.order('created_at', { ascending: false });
				break;
			case 'ending_soon':
				query = query.not('end_date', 'is', null);
				query = query.order('end_date', { ascending: true });
				break;
			case 'newest':
			default:
				query = query.order('created_at', { ascending: false });
				break;
		}

		// Pagination
		const from = (page - 1) * perPage;
		const to = from + perPage - 1;
		query = query.range(from, to);

		const { data: campaigns, count, error } = await query;

		if (error) {
			console.error('[Funding/Campaigns] Error:', error);
			return json({ success: false, error: error.message }, { status: 500 });
		}

		// Transform to frontend format
		const items = (campaigns || []).map((c: any) => ({
			id: c.id,
			slug: c.slug,
			title: c.title,
			category: c.category_id,
			cover_image: c.cover_image_url,
			target_amount: Number(c.target_amount),
			raised_amount: Number(c.raised_amount),
			donor_count: c.donor_count,
			days_remaining: c.end_date
				? Math.max(0, Math.ceil((new Date(c.end_date).getTime() - Date.now()) / 86400000))
				: 999,
			status: c.status,
			organizer_name: c.organizer_name,
			is_urgent: c.is_urgent,
			percentage: c.target_amount > 0
				? Math.min(Math.round((Number(c.raised_amount) / Number(c.target_amount)) * 100), 100)
				: 0,
		}));

		return json({
			success: true,
			data: items,
			meta: {
				page,
				per_page: perPage,
				total: count || 0,
				total_pages: count ? Math.ceil(count / perPage) : 0,
			},
		});
	} catch (err: any) {
		console.error('[Funding/Campaigns] Unexpected error:', err);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}
