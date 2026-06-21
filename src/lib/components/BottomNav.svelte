<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		user?: import('@supabase/supabase-js').User | null;
	}

	let { user = null }: Props = $props();

	let activePath = $derived(page.url.pathname);

	const baseNavItems = [
		{ label: 'Beranda', href: '/', icon: 'home' as const },
		{ label: 'Jelajahi', href: '/campaigns', icon: 'search' as const },
		{ label: 'Galang Dana', href: '/campaign/create', icon: 'plus' as const, prominent: true },
		{ label: 'Donasi Saya', href: '/user/donations', icon: 'heart' as const },
	];

	function accountHref() {
		return user ? '/user' : '/auth/masuk';
	}

	function isActive(item: { href: string; prominent?: boolean }): boolean {
		if (item.href === '/') return activePath === '/';
		return activePath.startsWith(item.href);
	}
</script>

<nav
	class="btm-nav md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 safe-bottom"
	style="background-color: #ffffff; padding-bottom: env(safe-area-inset-bottom, 0px);"
>
	<div class="flex items-center justify-around h-16 px-1">
		{#each baseNavItems as item}
			<a
				href={item.href}
				class="flex flex-col items-center justify-center gap-0.5 relative min-w-0 flex-1 h-full transition-colors"
				class:pt-3={!item.prominent}
				class:pb-1={!item.prominent}
			>
				{#if item.prominent}
					<!-- Prominent center button (Galang Dana) -->
					<div
						class="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
						style="background-color: #14B88C;"
					>
						<svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
						</svg>
					</div>
					<span class="text-[10px] font-medium mt-7" style="color: {isActive(item) ? '#14B88C' : '#9CA3AF'};">
						{item.label}
					</span>
				{:else if item.icon === 'home'}
					<svg class="w-5 h-5" style="color: {isActive(item) ? '#14B88C' : '#9CA3AF'};" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="{isActive(item) ? 2.5 : 1.5}">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
					</svg>
					<span class="text-[10px] font-medium" style="color: {isActive(item) ? '#14B88C' : '#9CA3AF'};">{item.label}</span>
				{:else if item.icon === 'search'}
					<svg class="w-5 h-5" style="color: {isActive(item) ? '#14B88C' : '#9CA3AF'};" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="{isActive(item) ? 2.5 : 1.5}">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
					</svg>
					<span class="text-[10px] font-medium" style="color: {isActive(item) ? '#14B88C' : '#9CA3AF'};">{item.label}</span>
				{:else if item.icon === 'heart'}
					<svg class="w-5 h-5" style="color: {isActive(item) ? '#14B88C' : '#9CA3AF'};" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="{isActive(item) ? 2.5 : 1.5}">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
					</svg>
					<span class="text-[10px] font-medium" style="color: {isActive(item) ? '#14B88C' : '#9CA3AF'};">{item.label}</span>
				{/if}
			</a>
		{/each}

		<!-- Akun (dynamic href) -->
		<a
			href={accountHref()}
			class="flex flex-col items-center justify-center gap-0.5 relative min-w-0 flex-1 h-full pt-3 pb-1 transition-colors"
		>
			{#if user}
				<div class="w-5 h-5 rounded-full flex items-center justify-center" style="background-color: {isActive({ href: '/user' }) ? '#14B88C' : '#9CA3AF'};">
					<span class="text-white text-[10px] font-bold">{user.email?.charAt(0).toUpperCase()}</span>
				</div>
			{:else}
				<svg class="w-5 h-5" style="color: {isActive({ href: '/auth/masuk' }) ? '#14B88C' : '#9CA3AF'};" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="{isActive({ href: '/auth/masuk' }) ? 2.5 : 1.5}">
					<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
				</svg>
			{/if}
			<span class="text-[10px] font-medium" style="color: {isActive({ href: user ? '/user' : '/auth/masuk' }) ? '#14B88C' : '#9CA3AF'};">Akun</span>
		</a>
	</div>
</nav>

<style>
	.safe-bottom {
		padding-bottom: env(safe-area-inset-bottom, 0px);
		box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
	}
</style>
