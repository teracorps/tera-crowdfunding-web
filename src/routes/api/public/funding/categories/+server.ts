import { json } from '@sveltejs/kit';

/**
 * GET /api/public/funding/categories
 * List all campaign categories.
 */
export async function GET({ locals }) {
	try {
		const { data: categories, error } = await locals.serviceClient
			.schema('business_funding')
			.from('campaign_categories')
			.select('id, name, slug, icon')
			.order('order', { ascending: true });

		if (error) {
			console.error('[Funding/Categories] Error:', error);
			return json({ success: false, error: error.message }, { status: 500 });
		}

		// Add campaign count per category
		const categoriesWithCount = await Promise.all(
			(categories || []).map(async (cat: any) => {
				const { count } = await locals.serviceClient
					.schema('business_funding')
					.from('campaigns')
					.select('*', { count: 'exact', head: true })
					.eq('category_id', cat.id)
					.eq('status', 'active');

				return {
					...cat,
					campaign_count: count || 0,
				};
			})
		);

		return json({ success: true, data: categoriesWithCount });
	} catch (err: any) {
		console.error('[Funding/Categories] Unexpected error:', err);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}
