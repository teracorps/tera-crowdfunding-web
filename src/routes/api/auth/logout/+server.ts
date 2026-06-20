import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals: { supabase } }) => {
	const { error: signOutError } = await supabase.auth.signOut();

	if (signOutError) {
		return error(500, 'Gagal keluar');
	}

	return redirect(302, '/');
};
