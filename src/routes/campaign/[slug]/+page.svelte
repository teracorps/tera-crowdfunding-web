<script lang="ts">
	import { page } from '$app/state';
	import { getCampaign, submitDonation, formatRupiah, formatNumber } from '$lib/api';
	import type { Campaign, DonationRequest } from '$lib/types';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import StatusAlert from '$lib/components/StatusAlert.svelte';

	let { data } = $props();

	let campaign = $state<Campaign | null>(data.campaign || null);
	let loading = $state(data.campaign ? false : true);
	let error = $state('');

	// Donate form
	let showDonate = $state(false);
	let donateForm = $state({
		amount: 10000,
		name: '',
		email: '',
		phone: '',
		message: '',
		is_anonymous: false,
	});
	let donateStatus = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let donateMessage = $state('');

	const presetAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

	$effect(() => {
		// Only fetch client-side if no server data was loaded
		if (!campaign) {
			const slug = page.params.slug;
			if (slug) loadCampaign(slug);
		}
	});

	async function loadCampaign(slug: string) {
		loading = true;
		error = '';
		try {
			campaign = await getCampaign(slug);
		} catch (e: any) {
			error = e.message || 'Gagal memuat campaign';
		} finally {
			loading = false;
		}
	}

	function selectAmount(amount: number) {
		donateForm.amount = amount;
	}

	async function handleDonate() {
		if (!campaign || !donateForm.name || !donateForm.email) return;

		donateStatus = 'loading';
		try {
			const request: DonationRequest = {
				campaign_id: campaign.id,
				amount: donateForm.amount,
				name: donateForm.name,
				email: donateForm.email,
				phone: donateForm.phone,
				message: donateForm.message,
				is_anonymous: donateForm.is_anonymous,
				payment_method: 'snap',
			};
			const result = await submitDonation(request);
			if (result.snap_token) {
				// Open Midtrans Snap popup
				if (typeof window.snap !== 'undefined') {
					let donationId = result.id;
					window.snap.pay(result.snap_token, {
						onSuccess: function () {
							window.location.href = `/donasi/selesai/${donationId}?status=success`;
						},
						onPending: function () {
							window.location.href = `/donasi/selesai/${donationId}?status=pending`;
						},
						onError: function () {
							window.location.href = `/donasi/selesai/${donationId}?status=error`;
						},
						onClose: function () {
							// User closed popup, stay on page
							donateStatus = 'idle';
							donateMessage = '';
						},
					});
				} else {
					// Fallback: open in new tab
					window.open(result.redirect_url, '_blank');
					donateStatus = 'success';
					donateMessage = 'Pembayaran berhasil dibuat! Silakan selesaikan pembayaran.';
					showDonate = false;
				}
			} else if (result.redirect_url) {
				// Fallback to manual redirect
				window.location.href = result.redirect_url;
			} else {
				donateStatus = 'success';
				donateMessage = 'Donasi berhasil dicatat! Silakan lanjutkan pembayaran.';
				showDonate = false;
			}
		} catch (e: any) {
			donateStatus = 'error';
			donateMessage = e.message || 'Gagal memproses donasi';
		}
	}
</script>

<svelte:head>
	<title>{campaign?.title ? `${campaign.title} - Terabisa` : 'Loading... - Terabisa'}</title>
	{#if campaign}
		<meta name="description" content={(campaign.description || campaign.title || '').slice(0, 160)} />
		<!-- Open Graph -->
		<meta property="og:title" content="{campaign.title} - Terabisa" />
		<meta property="og:description" content={(campaign.description || campaign.title || '').slice(0, 160)} />
		<meta property="og:image" content={campaign.cover_image || ''} />
		<meta property="og:url" content={page.url.href} />
		<meta property="og:type" content="website" />
		<!-- Twitter Card -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content="{campaign.title} - Terabisa" />
		<meta name="twitter:description" content={(campaign.description || campaign.title || '').slice(0, 160)} />
		<meta name="twitter:image" content={campaign.cover_image || ''} />
	{/if}
</svelte:head>

{#if loading}
	<div class="flex items-center justify-center min-h-screen">
		<div class="w-10 h-10 border-3 border-gray-200 border-t-[#1a73e8] rounded-full animate-spin"></div>
	</div>
{:else if error}
	<div class="min-h-screen flex items-center justify-center px-4">
		<div class="text-center">
			<svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
			</svg>
			<h2 class="text-xl font-bold text-gray-900 mb-2">Campaign Tidak Ditemukan</h2>
			<p class="text-gray-500 mb-4">{error}</p>
			<a href="/" class="donate-btn inline-block">Kembali ke Beranda</a>
		</div>
	</div>
{:else if campaign}
	<!-- Campaign Header Image -->
	<div class="relative h-64 md:h-80 bg-gray-200">
		{#if campaign.cover_image}
			<img
				src={campaign.cover_image}
				alt={campaign.title}
				class="w-full h-full object-cover"
			/>
		{:else}
			<div class="w-full h-full bg-gradient-to-br from-[#1a73e8] to-[#0d47a1]"></div>
		{/if}
		<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

		<!-- Status badges -->
		<div class="absolute top-4 left-4 flex gap-2">
			{#if campaign.is_urgent}
				<span class="badge-urgent">❗ DARURAT</span>
			{/if}
			<span class="bg-white/90 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
				{campaign.category}
			</span>
		</div>
	</div>

	<div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
		<div class="grid lg:grid-cols-3 gap-8">
			<!-- Left: Campaign Details -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Title & Organizer -->
				<div>
					<h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
						{campaign.title}
					</h1>
					<div class="flex items-center gap-2">
						{#if campaign.organizer_photo}
							<img src={campaign.organizer_photo} alt="" class="w-8 h-8 rounded-full object-cover" />
						{:else}
							<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
								<svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
							</div>
						{/if}
						<span class="text-sm font-medium text-gray-700">{campaign.organizer_name}</span>
						<svg class="w-4 h-4 text-[#1a73e8]" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0c.552.41 1.184.648 1.745.723a3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clip-rule="evenodd"/>
						</svg>
					</div>
				</div>

				<!-- Story -->
				<div class="bg-white rounded-xl p-6 border border-gray-100">
					<h2 class="text-lg font-bold text-gray-900 mb-4">Cerita Penggalangan Dana</h2>
					<div class="prose prose-sm max-w-none text-gray-600 leading-relaxed">
						{@html (campaign.story || campaign.description || '').replace(/\n/g, '<br/>')}
					</div>
				</div>

				<!-- Updates -->
				{#if campaign.updates && campaign.updates.length > 0}
					<div class="bg-white rounded-xl p-6 border border-gray-100">
						<h2 class="text-lg font-bold text-gray-900 mb-4">Update Terbaru</h2>
						<div class="space-y-4">
							{#each campaign.updates as update}
								<div class="border-l-3 border-[#1a73e8] pl-4">
									<p class="text-xs text-gray-500 mb-1">
										{new Date(update.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
									</p>
									<p class="text-sm text-gray-700">{update.content}</p>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Right: Donation Sidebar -->
			<div class="lg:col-span-1">
				<div class="sticky top-24 bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-5">
					<!-- Progress -->
					<div>
						<div class="flex items-baseline justify-between mb-2">
							<span class="text-2xl font-bold text-gray-900">
								{formatRupiah(campaign.raised_amount)}
							</span>
						</div>
						<p class="text-sm text-gray-500 mb-3">
							terkumpul dari {formatRupiah(campaign.target_amount)}
						</p>
						<ProgressBar
							percentage={Math.min(Math.round((campaign.raised_amount / campaign.target_amount) * 100), 100)}
						/>
						<div class="flex items-center justify-between mt-3 text-sm">
							<span class="text-gray-600 font-medium">
								{formatNumber(campaign.donor_count)} donatur
							</span>
							<span class="text-gray-600">
								{campaign.days_remaining > 0 ? `${campaign.days_remaining} hari lagi` : 'Selesai'}
							</span>
						</div>
					</div>

					<!-- Donate Button -->
					<button
						class="donate-btn w-full !text-base !py-3"
						onclick={() => (showDonate = true)}
					>
						❤️ Donasi Sekarang
					</button>

					<!-- Share -->
					<div class="flex gap-2">
						<button class="flex-1 px-3 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
							<svg class="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
							Share
						</button>
						<button class="flex-1 px-3 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
							<svg class="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
							Aamiin
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Donate Modal -->
	{#if showDonate}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center"
			onclick={() => (showDonate = false)}
		>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto"
				onclick={(e) => e.stopPropagation()}
			>
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-bold text-gray-900">Donasi</h2>
					<button class="p-1 hover:bg-gray-100 rounded-lg" onclick={() => (showDonate = false)}>
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
					</button>
				</div>

				<StatusAlert status={donateStatus} message={donateMessage} />

				<!-- Amount Selection -->
				<div class="mb-6">
					<label class="text-sm font-medium text-gray-700 mb-3 block">Pilih Nominal Donasi</label>
					<div class="grid grid-cols-3 gap-2 mb-3">
						{#each presetAmounts as amount}
							<button
								class="px-3 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all"
								class:border-[#1a73e8]={donateForm.amount === amount}
								class:bg-[#e8f0fe]={donateForm.amount === amount}
								class:text-[#1a73e8]={donateForm.amount === amount}
								class:border-gray-200={donateForm.amount !== amount}
								class:text-gray-700={donateForm.amount !== amount}
								onclick={() => selectAmount(amount)}
							>
								{formatRupiah(amount)}
							</button>
						{/each}
					</div>
					<input
						type="number"
						placeholder="Atau masukkan nominal"
						class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
						bind:value={donateForm.amount}
						min="1000"
						step="1000"
					/>
				</div>

				<!-- Form -->
				<div class="space-y-4">
					<div>
						<label class="text-sm font-medium text-gray-700 mb-1.5 block">Nama Lengkap *</label>
						<input
							type="text"
							placeholder="Masukkan nama kamu"
							class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
							bind:value={donateForm.name}
						/>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 mb-1.5 block">Email *</label>
						<input
							type="email"
							placeholder="Masukkan email kamu"
							class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
							bind:value={donateForm.email}
						/>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 mb-1.5 block">No. HP (Opsional)</label>
						<input
							type="tel"
							placeholder="08xxxxxxxxxx"
							class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
							bind:value={donateForm.phone}
						/>
					</div>
					<div>
						<label class="text-sm font-medium text-gray-700 mb-1.5 block">Doa & Ucapan (Opsional)</label>
						<textarea
							placeholder="Tulis doa atau ucapan kamu..."
							rows="3"
							class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] resize-none"
							bind:value={donateForm.message}
						></textarea>
					</div>
					<div class="flex items-center gap-2">
						<input
							type="checkbox"
							id="anonymous"
							class="w-4 h-4 text-[#1a73e8] rounded"
							bind:checked={donateForm.is_anonymous}
						/>
						<label for="anonymous" class="text-sm text-gray-600">Sembunyikan nama saya (Anonim)</label>
					</div>
				</div>

				<!-- Submit -->
				<button
					class="donate-btn w-full !text-base !py-3 mt-6"
					disabled={!donateForm.name || !donateForm.email || donateForm.amount < 1000 || donateStatus === 'loading'}
					onclick={handleDonate}
				>
					{#if donateStatus === 'loading'}
						Memproses...
					{:else}
						Donasi {formatRupiah(donateForm.amount)} →
					{/if}
				</button>
			</div>
		</div>
	{/if}
{/if}
