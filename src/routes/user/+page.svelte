<script lang="ts">
	import AccountMenu from '$lib/components/AccountMenu.svelte';
	import { userMenuItems } from '$lib/userMenuData';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let user = $derived(data?.session?.user ?? null);
	let userMeta = $derived(user?.user_metadata ?? {});

	let showLogoutConfirm = $state(false);

	async function handleLogout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		window.location.href = '/';
	}

	function handleLogin() {
		window.location.href = '/auth/masuk';
	}
</script>

<svelte:head>
	<title>Akun - Terabisa</title>
</svelte:head>

<!-- Header Banner -->
<div class="bg-primary-light">
	<div class="max-w-2xl mx-auto px-4 sm:px-6 py-8 text-center">
		<h1 class="text-xl font-bold text-gray-900">Akun</h1>
	</div>
</div>

<div class="max-w-2xl mx-auto px-0 sm:px-6 -mt-4">
	<div class="bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-gray-100 overflow-hidden">
		{#if user}
			<!-- LOGGED IN: Profile -->
			<div class="px-4 sm:px-6 py-6 sm:py-8 text-center border-b border-gray-100">
				<div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-3 shadow-sm">
					<span class="text-3xl font-bold text-white">
						{userMeta.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'A'}
					</span>
				</div>
				<h2 class="text-lg font-semibold text-gray-900">{userMeta.full_name || user.email}</h2>
				<p class="text-xs text-gray-400 mt-0.5">{user.email}</p>
				<button class="mt-2 px-5 py-1.5 text-sm font-semibold text-primary border border-primary rounded-full hover:bg-green-50 transition-colors">
					Edit Profile
				</button>
			</div>

			<!-- Logged In Menu -->
			<!-- Setup Platform CTA for users without an org -->
			{#if !data?.tenant}
				<a
					href="/onboarding"
					class="block mx-4 sm:mx-6 my-4 p-4 rounded-xl border-2 border-dashed transition-all hover:shadow-sm"
					style="border-color: var(--color-primary, #14B88C);"
				>
					<div class="flex items-center gap-3">
						<div
							class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
							style="background-color: color-mix(in srgb, var(--color-primary, #14B88C) 10%, transparent);"
						>
							<svg class="w-6 h-6" style="color: var(--color-primary, #14B88C);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
							</svg>
						</div>
						<div class="flex-1">
							<p class="text-sm font-semibold" style="color: var(--color-text-primary, #111827);">Buat Platform Crowdfunding-mu</p>
							<p class="text-xs mt-0.5" style="color: var(--color-text-muted, #94a3b8);">
								Dapatkan subdomain, branding, dan dashboard sendiri
							</p>
						</div>
						<svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
						</svg>
					</div>
				</a>
			{/if}

			<AccountMenu items={userMenuItems.loggedIn} />

			<!-- Logout -->
			<div class="border-t border-gray-100">
				{#if showLogoutConfirm}
					<div class="px-4 sm:px-6 py-4 flex items-center justify-between bg-red-50">
						<span class="text-sm text-red-600 font-medium">Yakin ingin keluar?</span>
						<div class="flex gap-2">
							<button
								onclick={() => (showLogoutConfirm = false)}
								class="px-4 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
							>
								Batal
							</button>
							<button
								onclick={handleLogout}
								class="px-4 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
							>
								Keluar
							</button>
						</div>
					</div>
				{:else}
					<button
						onclick={() => (showLogoutConfirm = true)}
						class="w-full flex items-center gap-4 px-4 sm:px-6 py-4 text-gray-500 hover:bg-gray-50 transition-colors"
					>
						<div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
							</svg>
						</div>
						<span class="text-sm font-medium text-gray-900 flex-1 text-left">Keluar</span>
						<svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
						</svg>
					</button>
				{/if}
			</div>
		{:else}
			<!-- LOGGED OUT: Login Prompt -->
			<div class="px-4 sm:px-6 py-8 sm:py-10 text-center border-b border-gray-100">
				<div class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
					</svg>
				</div>
				<p class="text-sm text-gray-700 font-medium mb-5 max-w-xs mx-auto">
					Masuk untuk nikmati mudahnya donasi dan akses ke fitur lainnya!
				</p>
				<button
					onclick={handleLogin}
					class="inline-block px-8 py-2.5 text-sm font-semibold text-primary border-2 border-primary rounded-full hover:bg-green-50 transition-colors"
				>
					Masuk sekarang
				</button>
				<p class="text-xs text-gray-400 mt-3">
					Belum punya akun? <a href="/auth/daftar" class="text-primary font-semibold hover:underline">Daftar</a>
				</p>
			</div>

			<!-- Logged Out Menu -->
			<AccountMenu items={userMenuItems.loggedOut} />
		{/if}
	</div>

	<!-- Bottom Banner -->
	<div class="mt-6 px-4 sm:px-0 pb-8">
		<div class="bg-blue-50 rounded-2xl p-5 flex items-center gap-4">
			<div class="flex-1">
				<p class="text-sm font-semibold text-gray-800">Kebaikan nggak bikin memori ponsel penuh!</p>
			</div>
			<div class="w-16 h-16 flex-shrink-0">
				<svg class="w-full h-full text-blue-200" fill="currentColor" viewBox="0 0 24 24">
					<path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
				</svg>
			</div>
		</div>
	</div>
</div>
