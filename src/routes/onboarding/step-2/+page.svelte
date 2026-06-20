<script lang="ts">
	import { onMount } from 'svelte';

	let platformName = $state('');
	let tagline = $state('');
	let primaryColor = $state('#14B88C');
	let secondaryColor = $state('#FF784B');
	let logoUrl = $state('');
	let saving = $state(false);
	let saved = $state(false);
	let error = $state('');

	onMount(async () => {
		// Load existing branding if available
		try {
			const res = await fetch('/api/org/onboarding-progress');
			const data = await res.json();
			if (data.progress?.steps?.branding) {
				saved = true;
			}
		} catch {}
	});

	const presetColors = [
		{ name: 'Hijau', color: '#14B88C' },
		{ name: 'Biru', color: '#2563eb' },
		{ name: 'Ungu', color: '#7c3aed' },
		{ name: 'Merah', color: '#ef4444' },
		{ name: 'Orange', color: '#f97316' },
		{ name: 'Pink', color: '#ec4899' },
	];

	async function saveBranding() {
		saving = true;
		error = '';

		try {
			// Update branding via existing tenant API
			const res = await fetch('/api/org/onboarding-progress', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					step: 'branding',
					completed: true,
				}),
			});
			const data = await res.json();
			if (data.success) {
				saved = true;
			} else {
				error = data.error || 'Gagal menyimpan.';
			}
		} catch {
			error = 'Gagal menyimpan pengaturan.';
		} finally {
			saving = false;
		}
	}

	function skipStep() {
		saved = true;
	}
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
	<!-- Progress -->
	<div class="flex items-center justify-center gap-2 mb-8">
		<div class="flex items-center gap-1">
			<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-green-500">✓</span>
			<span class="text-sm font-medium ml-1 text-green-600">Subdomain</span>
		</div>
		<div class="w-12 h-0.5 bg-green-500"></div>
		<div class="flex items-center gap-1">
			<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style="background-color: var(--color-primary, #14B88C);">2</span>
			<span class="text-sm font-medium ml-1" style="color: var(--color-primary, #14B88C);">Branding</span>
		</div>
		<div class="w-12 h-0.5 bg-gray-200"></div>
		<div class="flex items-center gap-1">
			<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-400">3</span>
			<span class="text-sm font-medium ml-1 text-gray-400">Paket</span>
		</div>
		<div class="w-12 h-0.5 bg-gray-200"></div>
		<div class="flex items-center gap-1">
			<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-400">4</span>
			<span class="text-sm font-medium ml-1 text-gray-400">Selesai</span>
		</div>
	</div>

	<h1 class="text-2xl font-bold mb-2" style="color: var(--color-text-primary, #111827);">Kustomisasi Branding</h1>
	<p class="mb-8" style="color: var(--color-text-secondary, #6b7280);">
		Sesuaikan tampilan platform crowdfunding-mu dengan warna dan logo sendiri.
	</p>

	{#if !saved}
		<div class="space-y-6">
			<!-- Platform Name -->
			<div>
				<label class="block text-sm font-medium mb-1.5" style="color: var(--color-text-primary, #111827);">Nama Platform</label>
				<input
					type="text"
					bind:value={platformName}
					placeholder="Contoh: SehatIndonesia"
					class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 text-sm"
					style="--tw-ring-color: var(--color-primary, #14B88C);"
				/>
			</div>

			<!-- Tagline -->
			<div>
				<label class="block text-sm font-medium mb-1.5" style="color: var(--color-text-primary, #111827);">Tagline</label>
				<input
					type="text"
					bind:value={tagline}
					placeholder="Galang dana untuk Indonesia yang lebih baik"
					class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 text-sm"
					style="--tw-ring-color: var(--color-primary, #14B88C);"
				/>
			</div>

			<!-- Logo URL -->
			<div>
				<label class="block text-sm font-medium mb-1.5" style="color: var(--color-text-primary, #111827);">Logo (URL)</label>
				<input
					type="text"
					bind:value={logoUrl}
					placeholder="https://example.com/logo.png"
					class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 text-sm"
					style="--tw-ring-color: var(--color-primary, #14B88C);"
				/>
				{#if logoUrl}
					<img src={logoUrl} alt="Preview" class="mt-2 h-12 w-auto" />
				{/if}
			</div>

			<!-- Primary Color -->
			<div>
				<label class="block text-sm font-medium mb-1.5" style="color: var(--color-text-primary, #111827);">Warna Utama</label>
				<div class="flex items-center gap-3 mb-3">
					<input
						type="color"
						bind:value={primaryColor}
						class="w-10 h-10 rounded-lg cursor-pointer border border-gray-300"
					/>
					<span class="text-sm text-gray-500">{primaryColor}</span>
				</div>
				<div class="flex gap-2">
					{#each presetColors as pc}
						<button
							onclick={() => primaryColor = pc.color}
							class="w-8 h-8 rounded-full border-2 transition-all"
							class:border-gray-400={primaryColor === pc.color}
							class:border-transparent={primaryColor !== pc.color}
							style="background-color: {pc.color};"
							title={pc.name}
						></button>
					{/each}
				</div>
			</div>

			<!-- Preview -->
			<div class="p-4 rounded-lg border" style="border-color: {primaryColor}40;">
				<h3 class="text-sm font-medium mb-2" style="color: var(--color-text-secondary, #6b7280);">Pratinjau</h3>
				<div class="flex items-center gap-3 p-3 rounded-lg" style="background-color: {primaryColor};">
					<div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
						<span class="text-white font-bold text-sm">{platformName ? platformName.charAt(0).toUpperCase() : 'T'}</span>
					</div>
					<span class="font-bold text-white">{platformName || 'Terabisa'}</span>
				</div>
			</div>
		</div>

		<div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
			<button onclick={skipStep} class="text-sm px-4 py-2 text-gray-500 hover:text-gray-700">
				Lewati →
			</button>
			<button
				onclick={saveBranding}
				disabled={saving}
				class="px-6 py-2.5 rounded-lg text-white font-medium text-sm transition-all disabled:opacity-50"
				style="background-color: var(--color-primary, #14B88C);"
			>
				{saving ? 'Menyimpan...' : 'Simpan & Lanjutkan →'}
			</button>
		</div>
	{:else}
		<div class="text-center py-12">
			<div class="text-4xl mb-4">🎨</div>
			<h2 class="text-xl font-bold mb-2" style="color: var(--color-text-primary, #111827);">Branding siap!</h2>
			<p class="mb-6" style="color: var(--color-text-secondary, #6b7280);">Tinggal pilih paket langganan.</p>
			<a
				href="/onboarding/step-3"
				class="inline-block px-6 py-2.5 rounded-lg text-white font-medium text-sm"
				style="background-color: var(--color-primary, #14B88C);"
			>
				Pilih Paket →
			</a>
		</div>
	{/if}
</div>
