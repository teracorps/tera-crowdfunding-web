<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import Navbar from '$lib/components/Navbar.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { TenantBranding } from '$lib/types';

	let { data, children } = $props();

	let isScrolled = $state(false);

	$effect(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 10;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// Tenant branding
	const branding: TenantBranding | null = $derived(data?.tenant?.branding ?? null);

	// Dynamic CSS variables for the theme
	const themeVars = $derived(branding
		? {
				'--color-primary': branding.primaryColor,
				'--color-secondary': branding.secondaryColor,
				'--color-accent': branding.accentColor,
				'--color-text-primary': branding.textPrimaryColor,
				'--color-text-secondary': branding.textSecondaryColor,
				'--color-bg': branding.backgroundColor,
				'--color-surface': branding.surfaceColor,
				'--font-family': branding.fontFamily,
				'--font-heading': branding.fontHeading,
		  }
		: {});

	// Pages with full-screen layout (no navbar/footer/bottomnav)
	const isFullScreenLayout = $derived(
		page.url.pathname.includes('/donasi')
	);
</script>

<svelte:head>
	{#if branding?.platformName}
		<title>{branding.platformName}</title>
		<meta name="description" content={branding.tagline || ''} />
	{/if}
	{#if branding?.faviconUrl}
		<link rel="icon" href={branding.faviconUrl} />
		<link rel="apple-touch-icon" href={branding.faviconUrl} />
	{/if}
	{#if branding?.ogImageUrl}
		<meta property="og:image" content={branding.ogImageUrl} />
		<meta name="twitter:image" content={branding.ogImageUrl} />
	{/if}
	<link rel="manifest" href="/manifest.json" />
	<meta name="theme-color" content="#14B88C" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="SB-Mid-client-your_client_key_here"></script>
</svelte:head>

<div
	class="app-root"
	style={Object.entries(themeVars)
		.map(([k, v]) => `${k}: ${v};`)
		.join(' ')}
>
	{#if isFullScreenLayout}
		<!-- Full-screen page: no navbar/footer/bottomnav — page handles its own layout -->
		{@render children()}
	{:else}
		<Navbar
			{isScrolled}
			user={data?.session?.user ?? null}
			branding={data?.tenant?.branding ?? null}
		/>

		<main class="min-h-screen pt-16 pb-16 md:pb-0">
			{@render children()}
		</main>

		<div class="hidden md:block">
			<Footer branding={data?.tenant?.branding ?? null} />
		</div>

		<BottomNav user={data?.session?.user ?? null} />
	{/if}
</div>
