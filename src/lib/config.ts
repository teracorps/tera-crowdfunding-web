import { PUBLIC_SUPABASE_URL, PUBLIC_SUBOMAIN } from '$env/static/public';

export const config = {
	api: {
		baseUrl: '/api',
		publicUrl: 'https://terabisnis.id/api',
	},
	site: {
		name: 'Terabisa',
		tagline: 'Galang Dana & Donasi Online',
		description: 'Platform crowdfunding terpercaya untuk galang dana, donasi, dan saling membantu.',
		url: 'https://crowdfunding.tera-platform.my.id',
	},
	currency: {
		locale: 'id-ID',
		code: 'IDR',
	},
	colors: {
		primary: '#14B88C',
		primaryDark: '#0F9A75',
		secondary: '#FF784B',
		accent: '#FFD166',
	},
	tenant: {
		/** The main subdomain for this platform (e.g., "crowdfunding") */
		mainSubdomain: PUBLIC_SUBOMAIN || 'crowdfunding',
		/** Base domain without subdomain (e.g., "tera-platform.my.id") */
		baseDomain: PUBLIC_SUPABASE_URL
			? PUBLIC_SUPABASE_URL.replace('https://', '').split('.')[0] === 'myxferhvmxgiimaoldnc'
				? 'tera-platform.my.id'
				: 'tera-platform.my.id'
			: 'tera-platform.my.id',
	},
} as const;

/**
 * Get the full host for a tenant subdomain.
 * e.g., getTenantHost('yayasan-sehat') => 'yayasan-sehat.crowdfunding.tera-platform.my.id'
 */
export function getTenantHost(subdomain: string): string {
	if (!subdomain) return config.site.url;
	return `https://${subdomain}.${config.tenant.mainSubdomain}.${config.tenant.baseDomain}`;
}

/**
 * Check if the current request has a tenant context.
 */
export function hasTenant(tenant: any): tenant is NonNullable<typeof tenant> {
	return tenant !== null && typeof tenant.id === 'string';
}
