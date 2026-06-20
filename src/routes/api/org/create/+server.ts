import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';

/**
 * POST /api/org/create
 * Creates a new organization with branding and onboarding tracking.
 * Requires authenticated user.
 */
export async function POST({ request, locals }) {
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, {
		cookies: { get: () => undefined, set: () => {}, remove: () => {} },
		auth: { autoRefreshToken: false, persistSession: false },
	});

	try {
		// Verify authentication
		const session = locals.session;
		if (!session?.session?.user) {
			return json({ success: false, error: 'Not authenticated.' }, { status: 401 });
		}

		const { name, subdomain, platformName, primaryColor, logoUrl, plan } = await request.json();

		if (!name || !subdomain) {
			return json({ success: false, error: 'Nama organisasi dan subdomain diperlukan.' }, { status: 400 });
		}

		// Validate subdomain
		const cleaned = subdomain.toLowerCase().trim();
		if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(cleaned)) {
			return json({ success: false, error: 'Subdomain tidak valid.' }, { status: 400 });
		}

		// Generate a unique slug from name
		const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

		// Create organization
		const { data: org, error: orgError } = await supabase
			.schema('business_core')
			.from('organizations')
			.insert({
				name,
				slug,
				subdomain: cleaned,
			})
			.select('id, name, slug, subdomain')
			.single();

		if (orgError) {
			console.error('[CreateOrg] Error:', orgError);
			return json({ success: false, error: 'Gagal membuat organisasi. Mungkin subdomain sudah dipakai.' }, { status: 500 });
		}

		// Create branding
		const { error: brandingError } = await supabase
			.schema('business_core')
			.from('organization_branding')
			.insert({
				organization_id: org.id,
				platform_name: platformName || name,
				primary_color: primaryColor || '#14B88C',
				logo_url: logoUrl || null,
			});

		if (brandingError) {
			console.error('[CreateOrg] Branding error:', brandingError);
		}

		// Create onboarding tracking
		await supabase
			.schema('business_core')
			.from('organization_onboarding')
			.insert({
				organization_id: org.id,
				step_subdomain: false,
				current_step: 'branding',
			});

		// Assign default plan (starter if not specified)
		let planId: string | null = null;
		const planCode = plan || 'starter';
		const { data: planData } = await supabase
			.schema('platform_billing')
			.from('subscription_plans')
			.select('id')
			.eq('code', planCode)
			.maybeSingle();

		if (planData) {
			planId = planData.id;
			await supabase
				.schema('platform_billing')
				.from('organization_subscriptions')
				.insert({
					organization_id: org.id,
					plan_id: planId,
					status: 'trialing',
				});
		}

		return json({
			success: true,
			organization: org,
			tenantUrl: `https://${cleaned}.crowdfunding.tera-platform.my.id`,
		});
	} catch (err) {
		console.error('[CreateOrg] Error:', err);
		return json({ success: false, error: 'Internal error.' }, { status: 500 });
	}
}
