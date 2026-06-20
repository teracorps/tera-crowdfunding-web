<script lang="ts">
	import type { User } from '@supabase/supabase-js';
	import type { TenantBranding } from '$lib/types';

	interface Props {
		isScrolled: boolean;
		user?: User | null;
		branding?: TenantBranding | null;
	}

	let { isScrolled, user = null, branding = null }: Props = $props();

	let mobileMenuOpen = $state(false);
	let searchQuery = $state('');

	// Resolve branding
	const platformName = $derived(branding?.platformName ?? 'Terabisa');
	const logoUrl = $derived(branding?.logoUrl ?? null);
	const initial = $derived(platformName.charAt(0).toUpperCase());
	const primaryColor = $derived(branding?.primaryColor ?? '#14B88C');
</script>

<nav
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
	class:shadow-sm={isScrolled}
	style={isScrolled
		? 'background-color: var(--color-surface, #ffffff);'
		: 'background: transparent;'}
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2">
				{#if logoUrl}
					<img src={logoUrl} alt={platformName} class="h-8 w-auto" />
				{:else}
					<div
						class="w-8 h-8 rounded-lg flex items-center justify-center"
						style="background-color: {primaryColor};"
					>
						<span class="text-white font-bold text-sm">{initial}</span>
					</div>
				{/if}
				<span
					class="font-bold text-xl transition-colors"
					style="color: {isScrolled
						? 'var(--color-text-primary, #111827)'
						: '#ffffff'};"
				>
					{platformName}
				</span>
			</a>

			<!-- Desktop Nav -->
			<div class="hidden md:flex items-center gap-4">
				<!-- Cross-platform SSO link -->
				<a
					href={user ? 'https://app.tera-platform.my.id' : 'https://app.tera-platform.my.id/auth/login?redirect=crowdfunding'}
					target="_blank"
					rel="noopener"
					class="text-xs font-medium px-3 py-1.5 rounded-full transition-all border {isScrolled ? 'border-gray-300' : 'border-white/40'}"
					style="color: {isScrolled ? 'var(--color-text-secondary, #6B7280)' : 'rgba(255,255,255,0.85)'};"
				>
					Platform Tera →
				</a>

				<div class="relative">
					<input
						type="text"
						placeholder="Coba cari..."
						class="w-72 pl-10 pr-4 py-2 rounded-full text-sm border border-gray-200 bg-white/90 focus:outline-none focus:ring-2 transition-all"
						style="--tw-ring-color: {primaryColor};"
						bind:value={searchQuery}
					/>
					<svg class="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
					</svg>
				</div>

				<a href="/campaigns" class="text-sm font-medium transition-colors" style="color: {isScrolled ? 'var(--color-text-primary, #374151)' : '#ffffff'};">
					Jelajahi
				</a>
				<a href="/tentang" class="text-sm font-medium transition-colors" style="color: {isScrolled ? 'var(--color-text-primary, #374151)' : '#ffffff'};">
					Tentang
				</a>

				<a
					href="/campaign/create"
					class="text-sm font-medium !px-5 !py-2 rounded-full text-white border-2 border-white/80 hover:bg-white/15 transition-all"
					style="background-color: {primaryColor}; border-color: {isScrolled ? primaryColor : 'rgba(255,255,255,0.8)'};"
				>
					Mulai Galang Dana
				</a>

				<a
					href={user ? '/user' : '/auth/masuk'}
					class="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
					style={isScrolled
						? 'background-color: var(--color-surface, #f3f4f6); color: var(--color-text-primary, #4b5563);'
						: 'background-color: rgba(255,255,255,0.15); color: #ffffff;'}
				>
					{#if user?.user_metadata?.full_name}
						<span class="text-sm font-bold">{user.user_metadata.full_name.charAt(0).toUpperCase()}</span>
					{:else}
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
						</svg>
					{/if}
				</a>
			</div>

			<!-- Mobile menu button -->
			<button
				class="md:hidden p-2 rounded-lg transition-colors"
				style="color: {isScrolled ? 'var(--color-text-primary, #374151)' : '#ffffff'};"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					{#if mobileMenuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
					{/if}
				</svg>
			</button>
		</div>

		<!-- Mobile menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden pb-4 space-y-3">
				<div class="relative">
					<input
						type="text"
						placeholder="Coba cari..."
						class="w-full pl-10 pr-4 py-2.5 rounded-full text-sm border border-gray-200 focus:outline-none"
						style="--tw-ring-color: {primaryColor};"
						bind:value={searchQuery}
					/>
					<svg class="absolute left-3.5 top-3 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
					</svg>
				</div>
				<div class="flex flex-col gap-2">
					<a href="/campaigns" class="text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100" style="color: var(--color-text-primary, #374151);">
						Jelajahi
					</a>
					<a href="/tentang" class="text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100" style="color: var(--color-text-primary, #374151);">
						Tentang
					</a>
					<a
						href="https://app.tera-platform.my.id"
						target="_blank"
						rel="noopener"
						class="text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
						style="color: var(--color-text-secondary, #6B7280);"
					>
						Platform Tera →
					</a>
					<a
						href="/campaign/create"
						class="text-sm font-medium text-center px-5 py-2.5 rounded-full text-white"
						style="background-color: {primaryColor};"
					>
						Mulai Galang Dana
					</a>
					<a href={user ? '/user' : '/auth/masuk'} class="text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2" style="color: var(--color-text-primary, #374151);">
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
						</svg>
						{user ? 'Akun' : 'Masuk'}
					</a>
				</div>
			</div>
		{/if}
	</div>
</nav>
