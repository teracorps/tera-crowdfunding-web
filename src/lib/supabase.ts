import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export function createClient() {
	return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}

export function getSession() {
	if (!isBrowser()) return null;
	const cookies = parse(document.cookie);
	const accessToken = cookies['sb-access-token'];
	if (!accessToken) return null;
	return { access_token: accessToken };
}
