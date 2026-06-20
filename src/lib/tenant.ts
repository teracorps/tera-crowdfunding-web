import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUBOMAIN, PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';
import type { TenantInfo } from '$lib/types';

/**
 * Resolve subdomain from Host header.
 * e.g. "org1.crowdfunding.tera-platform.my.id" → "org1"
 *      "crowdfunding.tera-platform.my.id" → null (main platform)
 */
export function resolveSubdomain(host: string | null): string | null {
	if (!host) return null;

	// Remove port if present
	const hostname = host.split(':')[0];

	// The base domain — subdomain is everything before the base
	// PUBLIC_SUBOMAIN tells us which subdomain is the "main" one
	// e.g., "crowdfunding" means the base is "crowdfunding.tera-platform.my.id"
	const mainSubdomain = PUBLIC_SUBOMAIN || 'crowdfunding';

	// Split and find where the main domain starts
	const parts = hostname.split('.');
	if (parts.length < 3) return null; // Not enough parts for subdomain

	// If it's exactly the main subdomain domain, no org subdomain
	const fullMainDomain = parts.slice(-2).join('.'); // e.g., "tera-platform.my.id"
	const mainHost = `${mainSubdomain}.${fullMainDomain}`;

	if (hostname === mainHost) return null;

	// If it has something before the main subdomain, that's the org subdomain
	// e.g., "org1.crowdfunding.tera-platform.my.id" → "org1"
	if (hostname.endsWith(`.${mainHost}`)) {
		return hostname.replace(`.${mainHost}`, '');
	}

	return null;
}

/**
 * Resolve organization from subdomain using Supabase.
 * Custom domains are also supported via organization_branding.
 */
export async function resolveTenant(
	event: RequestEvent
): Promise<TenantInfo | null> {
	const host = event.request.headers.get('host');
	const subdomain = resolveSubdomain(host);
	const customDomain = host?.split(':')[0] ?? null;

	// If no subdomain and not a custom domain, show main platform (no tenant)
	if (!subdomain && !customDomain) {
		return null;
	}

	const serviceClient = createServerClient(
		PUBLIC_SUPABASE_URL,
		SUPABASE_SERVICE_KEY,
		{
			cookies: {
				get: () => undefined,
				set: () => {},
				remove: () => {},
			},
			auth: { autoRefreshToken: false, persistSession: false },
		}
	);

	try {
		// Try subdomain first, then custom domain
		let org: any = null;
		let branding: any = null;

		if (subdomain) {
			// Look up by subdomain
			const { data } = await serviceClient
				.schema('business_core')
				.from('organizations')
				.select('id, name, slug, subdomain, logo_url, description')
				.eq('subdomain', subdomain)
				.maybeSingle();
			org = data;
		}

		if (!org && customDomain) {
			// Try custom domain via branding table
			const { data } = await serviceClient
				.schema('business_core')
				.from('organization_branding')
				.select('*, organization:organization_id(id, name, slug, subdomain, logo_url, description)')
				.eq('custom_domain', customDomain)
				.maybeSingle();
			if (data) {
				branding = data;
				org = data.organization;
			}
		}

		if (!org) return null;

		// Fetch branding
		if (!branding) {
			const { data: bData } = await serviceClient
				.schema('business_core')
				.from('organization_branding')
				.select('*')
				.eq('organization_id', org.id)
				.maybeSingle();
			branding = bData;
		}

		// Fetch subscription
		const { data: subscription } = await serviceClient
			.schema('platform_billing')
			.from('organization_subscriptions')
			.select('*, plan:plan_id(id, code, name)')
			.eq('organization_id', org.id)
			.maybeSingle();

		// Fetch entitlements
		const entitlements = new Set<string>();
		if (subscription?.plan_id) {
			const { data: ents } = await serviceClient
				.schema('platform_billing')
				.from('plan_entitlements')
				.select('entitlement_key')
				.eq('plan_id', subscription.plan_id)
				.eq('enabled', true);
			if (ents) {
				ents.forEach((e: any) => entitlements.add(e.entitlement_key));
			}
		}

		// Check overrides
		const { data: overrides } = await serviceClient
			.schema('platform_billing')
			.from('organization_entitlement_overrides')
			.select('entitlement_key, enabled')
			.eq('organization_id', org.id);
		if (overrides) {
			overrides.forEach((o: any) => {
				if (o.enabled) entitlements.add(o.entitlement_key);
				else entitlements.delete(o.entitlement_key);
			});
		}

		const tenant: TenantInfo = {
			id: org.id,
			name: org.name,
			slug: org.slug,
			subdomain: org.subdomain,
			description: org.description,
			branding: branding
				? {
						platformName: branding.platform_name || org.name,
						tagline: branding.tagline || 'Galang Dana & Donasi Online',
						primaryColor: branding.primary_color || '#2563eb',
						secondaryColor: branding.secondary_color || '#7c3aed',
						accentColor: branding.accent_color || '#f59e0b',
						textPrimaryColor: branding.text_primary_color || '#111827',
						textSecondaryColor: branding.text_secondary_color || '#6b7280',
						backgroundColor: branding.background_color || '#ffffff',
						surfaceColor: branding.surface_color || '#f9fafb',
						logoUrl: branding.logo_url || org.logo_url || null,
						faviconUrl: branding.favicon_url || null,
						ogImageUrl: branding.og_image_url || null,
						fontFamily: branding.font_family || 'Inter, system-ui, sans-serif',
						fontHeading: branding.font_heading || branding.font_family || 'Inter, system-ui, sans-serif',
						footerText: branding.footer_text || null,
						footerLinks: branding.footer_links || [],
						socialLinks: branding.social_links || [],
				  }
				: null,
			subscription: subscription
				? {
						planId: subscription.plan_id,
						planCode: subscription.plan?.code ?? 'starter',
						planName: subscription.plan?.name ?? 'Starter',
						status: subscription.status,
				  }
				: null,
			entitlements,
		};

		return tenant;
	} catch (err) {
		console.error('[Tenant] Resolution error:', err);
		return null;
	}
}
