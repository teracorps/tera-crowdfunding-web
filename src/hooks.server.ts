import type { HandleFetch } from '@sveltejs/kit';
import { config } from '$lib/config';

// Proxy API requests to tera-platform backend
export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	const url = new URL(request.url);
	const apiPrefix = '/api';

	if (url.pathname.startsWith(apiPrefix)) {
		// In production, rewrite to the actual backend
		const backendUrl = config.api.publicUrl;
		const path = url.pathname.replace(apiPrefix, '');
		const newUrl = new URL(`${backendUrl}${path}${url.search}`);

		request = new Request(newUrl, {
			...request,
			headers: {
				...request.headers,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
	}

	return fetch(request);
};
