import type { PageServerLoad } from './$types';
import { config } from '$lib/config';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { slug } = params;

	try {
		const response = await fetch(`${config.api.baseUrl}/public/funding/campaigns/${slug}`, {
			headers: {
				Accept: 'application/json',
			},
		});

		if (!response.ok) {
			return { campaign: null };
		}

		const json = await response.json();
		return {
			campaign: json.data || null,
		};
	} catch (e) {
		console.error('[Campaign Detail] Server load error:', e);
		return { campaign: null };
	}
};
