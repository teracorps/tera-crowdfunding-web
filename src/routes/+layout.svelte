<script lang="ts">
	import './layout.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { TenantBranding } from '$lib/types';

	let { data, children } = $props();

	let isScrolled = $state(false);

	$effect(() => {
		window.addEventListener('scroll', () => {
			isScrolled = window.scrollY > 10;
		});
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function handleScroll() {
		isScrolled = window.scrollY > 10;
	}

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
</svelte:head>

<div
	class="app-root"
	style={Object.entries(themeVars)
		.map(([k, v]) => `${k}: ${v};`)
		.join(' ')}
>
	<Navbar
		{isScrolled}
		user={data?.session?.user ?? null}
		branding={data?.tenant?.branding ?? null}
	/>

	<main class="min-h-screen">
		{@render children()}
	</main>

	<Footer branding={data?.tenant?.branding ?? null} />
</div>
