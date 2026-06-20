import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import { resolveTenant } from '$lib/tenant';

export const handle: Handle = async ({ event, resolve }) => {
	// Create Supabase client for this request
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.set(key, '', { ...options, path: '/' });
			},
		},
	});

	// Service client for admin operations
	event.locals.serviceClient = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, {
		cookies: {
			get: () => undefined,
			set: () => {},
			remove: () => {},
		},
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});

	// Get session
	event.locals.session = await event.locals.supabase.auth.getSession();

	// Resolve tenant (organization) from subdomain / custom domain
	event.locals.tenant = await resolveTenant(event);

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		},
	});
};
