import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';

/**
 * POST /api/org/check-subdomain
 * Check if a subdomain is available.
 */
export async function POST({ request }) {
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, {
		cookies: { get: () => undefined, set: () => {}, remove: () => {} },
		auth: { autoRefreshToken: false, persistSession: false },
	});

	try {
		const { subdomain } = await request.json();

		if (!subdomain || typeof subdomain !== 'string') {
			return json({ available: false, error: 'Subdomain is required.' }, { status: 400 });
		}

		const cleaned = subdomain.toLowerCase().trim();
		if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(cleaned)) {
			return json({
				available: false,
				error: 'Subdomain hanya boleh berisi huruf kecil, angka, dan tanda hubung.',
			}, { status: 400 });
		}

		if (cleaned.length < 3 || cleaned.length > 30) {
			return json({
				available: false,
				error: 'Subdomain harus antara 3-30 karakter.',
			}, { status: 400 });
		}

		// Reserved subdomains
		const reserved = ['www', 'app', 'admin', 'api', 'mail', 'dev', 'staging', 'test', 'crowdfunding', 'dashboard', 'ops', 'help', 'support'];
		if (reserved.includes(cleaned)) {
			return json({ available: false, error: 'Subdomain ini sudah dipesan.' });
		}

		// Check uniqueness
		const { data: existing } = await supabase
			.schema('business_core')
			.from('organizations')
			.select('id')
			.eq('subdomain', cleaned)
			.maybeSingle();

		const available = !existing;

		return json({ available, subdomain: cleaned });
	} catch (err) {
		console.error('[CheckSubdomain] Error:', err);
		return json({ available: false, error: 'Internal error.' }, { status: 500 });
	}
}
