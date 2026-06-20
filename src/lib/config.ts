export const config = {
	api: {
		// In production, this is proxied via Vite's proxy or SvelteKit hooks
		baseUrl: '/api',
		publicUrl: 'https://tera-platform--terawithapi.asia-southeast1.hosted.app/api',
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
} as const;
