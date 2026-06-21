<script lang="ts">
	import { getDonationHistory, formatRupiah } from '$lib/api';
	import type { DonationHistoryItem } from '$lib/types';

	let donations = $state<DonationHistoryItem[]>([]);
	let loading = $state(false);
	let email = $state('');
	let hasSearched = $state(false);

	let activeFilter = $state<'all' | 'settlement' | 'pending' | 'failed'>('all');

	let filtered = $derived(
		activeFilter === 'all' ? donations : donations.filter((d) => d.payment_status === activeFilter),
	);

	const statusLabels: Record<string, string> = {
		settlement: 'Berhasil',
		pending: 'Menunggu',
		failed: 'Gagal',
		waiting_payment: 'Menunggu Pembayaran',
	};

	const statusColors: Record<string, string> = {
		settlement: 'bg-green-100 text-green-700',
		pending: 'bg-yellow-100 text-yellow-700',
		waiting_payment: 'bg-yellow-100 text-yellow-700',
		failed: 'bg-red-100 text-red-700',
	};

	async function loadHistory() {
		if (!email.trim()) return;
		loading = true;
		hasSearched = true;
		try {
			donations = await getDonationHistory(email.trim());
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Donasi Saya - Terabisa</title>
</svelte:head>

<!-- Header -->
<div class="bg-primary-light">
	<div class="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 text-center">
		<h1 class="text-xl font-bold text-gray-900">Donasi Saya</h1>
		<p class="text-sm text-gray-500 mt-1">Cek riwayat donasi kamu berdasarkan email</p>
	</div>
</div>

<div class="max-w-2xl mx-auto px-4 sm:px-6 -mt-5 sm:-mt-6 pb-8">
	<!-- Email Search -->
	<div class="bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-gray-100 p-4 sm:p-6 mb-4">
		<div class="flex gap-3">
			<input
				type="email"
				placeholder="Masukkan email kamu"
				class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
				bind:value={email}
				onkeydown={(e) => e.key === 'Enter' && loadHistory()}
			/>
			<button
				class="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors disabled:opacity-50"
				disabled={!email.trim() || loading}
				onclick={loadHistory}
			>
				{#if loading}
					Cari...
				{:else}
					Cari
				{/if}
			</button>
		</div>
	</div>

	<!-- Results -->
	{#if hasSearched}
		{#if donations.length === 0 && !loading}
			<div class="bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-gray-100">
				<div class="py-12 text-center">
					<svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
					<p class="text-sm text-gray-500">Belum ada donasi ditemukan untuk email ini</p>
				</div>
			</div>
		{:else if !loading}
			<!-- Filter Tabs -->
			<div class="bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-gray-100 overflow-hidden">
				<div class="flex border-b border-gray-100">
					<button
						class="flex-1 py-3.5 text-sm font-medium text-center transition-colors {activeFilter === 'all'
							? 'text-primary border-b-2 border-primary'
							: 'text-gray-500 hover:text-gray-700'}"
						onclick={() => (activeFilter = 'all')}
					>
						Semua ({donations.length})
					</button>
					<button
						class="flex-1 py-3.5 text-sm font-medium text-center transition-colors {activeFilter === 'settlement'
							? 'text-primary border-b-2 border-primary'
							: 'text-gray-500 hover:text-gray-700'}"
						onclick={() => (activeFilter = 'settlement')}
					>
						Berhasil
					</button>
					<button
						class="flex-1 py-3.5 text-sm font-medium text-center transition-colors {activeFilter === 'pending'
							? 'text-primary border-b-2 border-primary'
							: 'text-gray-500 hover:text-gray-700'}"
						onclick={() => (activeFilter = 'pending')}
					>
						Menunggu
					</button>
				</div>

				<!-- Donation List -->
				<div class="divide-y divide-gray-50">
					{#each filtered as donation}
						<a
							href={donation.campaign ? `/campaign/${donation.campaign.slug}` : '#'}
							class="flex items-start gap-3 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
						>
							<!-- Thumbnail -->
							<div class="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
								{#if donation.campaign?.cover_image}
									<img src={donation.campaign.cover_image} alt="" class="w-full h-full object-cover" />
								{:else}
									<svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
									</svg>
								{/if}
							</div>

							<!-- Info -->
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-gray-900 line-clamp-2">
									{donation.campaign?.title || 'Campaign tidak tersedia'}
								</p>
								<div class="flex items-center gap-2 mt-1">
									<span class="text-sm font-semibold text-primary">{formatRupiah(donation.amount)}</span>
									<span class="text-xs text-gray-400">•</span>
									<span class="text-xs text-gray-400">{donation.date}</span>
								</div>
								<div class="flex items-center gap-2 mt-1.5">
									<span class="text-[10px] font-medium px-1.5 py-0.5 rounded {statusColors[donation.payment_status] || 'bg-gray-100 text-gray-600'}">
										{statusLabels[donation.payment_status] || donation.payment_status}
									</span>
									<span class="text-[10px] text-gray-400">{donation.payment_method || '-'}</span>
									{#if donation.is_anonymous}
										<span class="text-[10px] text-gray-400">• Anonim</span>
									{/if}
								</div>
							</div>

							<!-- Arrow -->
							<svg class="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
							</svg>
						</a>
					{/each}
				</div>
			</div>

			<!-- Total Summary -->
			<div class="mt-4 bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-gray-100 px-4 sm:px-6 py-4">
				<div class="flex items-center justify-between text-sm">
					<span class="text-gray-500">Total donasi</span>
					<span class="font-bold text-gray-900">{formatRupiah(donations.reduce((sum, d) => sum + d.amount, 0))}</span>
				</div>
			</div>
		{/if}
	{/if}
</div>
