<script lang="ts">
	let orgName = $state('');
	let subdomain = $state('');
	let suggestedSubdomain = $state('');
	let checking = $state(false);
	let available: boolean | null = $state(null);
	let error = $state('');
	let stepDone = $state(false);

	function generateSlug(name: string): string {
		return name.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '')
			.slice(0, 30);
	}

	function onNameChange() {
		suggestedSubdomain = generateSlug(orgName);
		if (!subdomain) {
			subdomain = suggestedSubdomain;
			checkSubdomain();
		}
	}

	async function checkSubdomain() {
		if (!subdomain || subdomain.length < 3) {
			available = null;
			return;
		}

		checking = true;
		error = '';
		available = null;

		try {
			const res = await fetch('/api/org/check-subdomain', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ subdomain }),
			});
			const data = await res.json();
			available = data.available;
			if (!data.available && data.error) {
				error = data.error;
			}
		} catch {
			available = null;
			error = 'Gagal cek subdomain.';
		} finally {
			checking = false;
		}
	}

	function confirmStep() {
		stepDone = true;
	}
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
	<!-- Progress indicator -->
	<div class="flex items-center justify-center gap-2 mb-8">
		<div class="flex items-center gap-1">
			<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style="background-color: var(--color-primary, #14B88C);">1</span>
			<span class="text-sm font-medium ml-1" style="color: var(--color-primary, #14B88C);">Subdomain</span>
		</div>
		<div class="w-12 h-0.5 bg-gray-200"></div>
		<div class="flex items-center gap-1">
			<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-400">2</span>
			<span class="text-sm font-medium ml-1 text-gray-400">Branding</span>
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

	<h1 class="text-2xl font-bold mb-2" style="color: var(--color-text-primary, #111827);">Siapkan Platform Galang Dana-mu</h1>
	<p class="mb-8" style="color: var(--color-text-secondary, #6b7280);">
		Buat platform crowdfunding dengan brand-mu sendiri. Mulai dengan memilih nama dan alamat website.
	</p>

	{#if !stepDone}
		<div class="space-y-6">
			<!-- Organization Name -->
			<div>
				<label class="block text-sm font-medium mb-1.5" style="color: var(--color-text-primary, #111827);">
					Nama Organisasi <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					bind:value={orgName}
					oninput={onNameChange}
					placeholder="Contoh: Yayasan Sehat Indonesia"
					class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-all text-sm"
					style="--tw-ring-color: var(--color-primary, #14B88C);"
				/>
			</div>

			<!-- Subdomain -->
			<div>
				<label class="block text-sm font-medium mb-1.5" style="color: var(--color-text-primary, #111827);">
					Alamat Website <span class="text-red-500">*</span>
				</label>
				<div class="flex items-center gap-0">
					<input
						type="text"
						bind:value={subdomain}
						oninput={() => { available = null; error = ''; }}
						placeholder="yayasan-sehat"
						class="flex-1 px-4 py-2.5 rounded-l-lg border border-r-0 border-gray-300 focus:outline-none focus:ring-2 transition-all text-sm"
						style="--tw-ring-color: var(--color-primary, #14B88C);"
					/>
					<span class="px-3 py-2.5 rounded-r-lg border border-gray-300 bg-gray-50 text-sm text-gray-500">
						.crowdfunding.tera-platform.my.id
					</span>
				</div>
				<p class="text-xs mt-1.5" style="color: var(--color-text-muted, #94a3b8);">
					Hanya huruf kecil, angka, dan tanda hubung. Minimal 3 karakter.
				</p>
			</div>

			<!-- Check Subdomain Button -->
			{#if subdomain.length >= 3}
				<button
					onclick={checkSubdomain}
					disabled={checking}
					class="px-6 py-2.5 rounded-lg text-white font-medium text-sm transition-all disabled:opacity-50"
					style="background-color: var(--color-primary, #14B88C);"
				>
					{checking ? 'Memeriksa...' : 'Cek Ketersediaan'}
				</button>
			{/if}

			<!-- Availability Result -->
			{#if available === true}
				<div class="p-4 rounded-lg bg-green-50 border border-green-200">
					<p class="text-sm font-medium text-green-800">✅ Subdomain <strong>{subdomain}.crowdfunding.tera-platform.my.id</strong> tersedia!</p>
				</div>
				<button
					onclick={async () => {
						const res = await fetch('/api/org/create', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								name: orgName,
								subdomain,
								platformName: orgName,
							}),
						});
						const data = await res.json();
						if (data.success) {
							confirmStep();
							// Proceed to step 2
							window.location.href = '/onboarding/step-2';
						} else {
							error = data.error || 'Gagal membuat organisasi.';
						}
					}}
					class="px-6 py-2.5 rounded-lg text-white font-medium text-sm transition-all"
					style="background-color: var(--color-primary, #14B88C);"
				>
					Lanjutkan ke Branding →
				</button>
			{:else if available === false && error}
				<div class="p-4 rounded-lg bg-red-50 border border-red-200">
					<p class="text-sm font-medium text-red-800">❌ {error}</p>
				</div>
			{/if}
		</div>
	{:else}
		<div class="text-center py-12">
			<div class="text-4xl mb-4">🎉</div>
			<h2 class="text-xl font-bold mb-2" style="color: var(--color-text-primary, #111827);">Platform berhasil dibuat!</h2>
			<p class="mb-6" style="color: var(--color-text-secondary, #6b7280);">
				Subdomain {subdomain}.crowdfunding.tera-platform.my.id sudah siap.
			</p>
			<a
				href="/onboarding/step-2"
				class="inline-block px-6 py-2.5 rounded-lg text-white font-medium text-sm"
				style="background-color: var(--color-primary, #14B88C);"
			>
				Lanjut ke Branding →
			</a>
		</div>
	{/if}
</div>
