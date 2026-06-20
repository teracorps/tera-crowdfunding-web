<script lang="ts">
	import { config } from '$lib/config';
	import { onMount } from 'svelte';

	let subdomain = $state('');
	let tenantUrl = $state('');

	onMount(async () => {
		try {
			const res = await fetch('/api/org/onboarding-progress');
			const data = await res.json();
			if (data.progress?.completed) {
				// Already completed, show done state
			}

			// Mark onboarding as complete
			await fetch('/api/org/onboarding-progress', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					step: 'campaign',
					completed: true,
				}),
			});
		} catch {}

		// Get tenant info from page context
		subdomain = window.location.hostname.split('.')[0];
		tenantUrl = `https://${subdomain}.crowdfunding.tera-platform.my.id`;
	});

	async function goToDashboard() {
		window.location.href = '/';
	}
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
	<!-- Progress -->
	<div class="flex items-center justify-center gap-2 mb-8">
		<div class="flex items-center gap-1">
			<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-green-500">✓</span>
			<span class="text-sm font-medium ml-1 text-green-600">Subdomain</span>
		</div>
		<div class="w-12 h-0.5 bg-green-500"></div>
		<div class="flex items-center gap-1">
			<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-green-500">✓</span>
			<span class="text-sm font-medium ml-1 text-green-600">Branding</span>
		</div>
		<div class="w-12 h-0.5 bg-green-500"></div>
		<div class="flex items-center gap-1">
			<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-green-500">✓</span>
			<span class="text-sm font-medium ml-1 text-green-600">Paket</span>
		</div>
		<div class="w-12 h-0.5 bg-green-500"></div>
		<div class="flex items-center gap-1">
			<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style="background-color: var(--color-primary, #14B88C);">4</span>
			<span class="text-sm font-medium ml-1" style="color: var(--color-primary, #14B88C);">Selesai</span>
		</div>
	</div>

	<div class="py-12">
		<div class="text-6xl mb-6">🎉</div>
		<h1 class="text-3xl font-bold mb-3" style="color: var(--color-text-primary, #111827);">
			Platform-mu Siap Digunakan!
		</h1>
		<p class="text-lg mb-4" style="color: var(--color-text-secondary, #6b7280);">
			Selamat! Platform crowdfunding dengan brand-mu sendiri sudah aktif.
		</p>

		{#if tenantUrl}
			<div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 mb-8">
				<span class="text-sm" style="color: var(--color-text-secondary, #6b7280);">🌐</span>
				<a href={tenantUrl} target="_blank" class="text-sm font-medium hover:underline" style="color: var(--color-primary, #14B88C);">
					{tenantUrl}
				</a>
			</div>
		{/if}

		<div class="max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
			<h3 class="text-sm font-bold text-blue-800 mb-2">📋 Langkah Selanjutnya</h3>
			<ul class="space-y-1.5 text-sm text-blue-700">
				<li>1. Upload logo dan lengkapi profil organisasi</li>
				<li>2. Buat campaign galang dana pertama</li>
				<li>3. Bagikan link campaign ke donatur</li>
				<li>4. Pantau donasi masuk di dashboard</li>
			</ul>
		</div>

		<div class="flex items-center justify-center gap-4">
			<a
				href="/campaign/create"
				class="px-6 py-3 rounded-lg text-white font-medium text-sm transition-all"
				style="background-color: var(--color-primary, #14B88C);"
			>
				Buat Campaign Pertama
			</a>
			<button
				onclick={goToDashboard}
				class="px-6 py-3 rounded-lg font-medium text-sm border border-gray-300 transition-all hover:bg-gray-50"
				style="color: var(--color-text-primary, #111827);"
			>
				Ke Beranda
			</button>
		</div>
	</div>
</div>
