import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { session, tenant } }) => {
	return {
		session: session.session,
		tenant,
	};
};
