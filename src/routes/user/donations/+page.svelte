<script lang="ts">
	// TODO: Replace with actual donation data from API
	interface DonationItem {
		id: string;
		campaignTitle: string;
		campaignSlug: string;
		coverImage: string;
		amount: number;
		date: string;
		status: 'success' | 'pending' | 'failed';
		paymentMethod: string;
		isAnonymous: boolean;
	}

	let donations = $state<DonationItem[]>([
		{
			id: '1',
			campaignTitle: 'Darurat Kemanusiaan Sudan: Selamatkan Mereka',
			campaignSlug: '/campaign/sudan-emergency',
			coverImage: '',
			amount: 100000,
			date: '20 Jun 2026',
			status: 'success',
			paymentMethod: 'GoPay',
			isAnonymous: true,
		},
		{
			id: '2',
			campaignTitle: 'Bantu Anak Yatim Dapatkan Pendidikan',
			campaignSlug: '/campaign/yatim-pendidikan',
			coverImage: '',
			amount: 50000,
			date: '18 Jun 2026',
			status: 'success',
			paymentMethod: 'Transfer BCA',
			isAnonymous: false,
		},
		{
			id: '3',
			campaignTitle: 'Bantu Korban Banjir Jakarta',
			campaignSlug: '/campaign/banjir-jakarta',
			coverImage: '',
			amount: 250000,
			date: '15 Jun 2026',
			status: 'pending',
			paymentMethod: 'Virtual Account',
			isAnonymous: false,
		},
		{
			id: '4',
			campaignTitle: 'Sedekah Beras untuk Santri Penghafal Quran',
			campaignSlug: '/campaign/sedekah-beras-santri',
			coverImage: '',
			amount: 75000,
			date: '10 Jun 2026',
			status: 'success',
			paymentMethod: 'DANA',
			isAnonymous: true,
		},
	]);

	let activeFilter = $state<'all' | 'success' | 'pending'>('all');

	let filtered = $derived(
		activeFilter === 'all' ? donations : donations.filter((d) => d.status === activeFilter),
	);

	const statusLabels: Record<string, string> = {
		success: 'Berhasil',
		pending: 'Menunggu',
		failed: 'Gagal',
	};

	const statusColors: Record<string, string> = {
		success: 'bg-green-100 text-green-700',
		pending: 'bg-yellow-100 text-yellow-700',
		failed: 'bg-red-100 text-red-700',
	};
</script>

<svelte:head>
	<title>Donasi Saya - Terabisa</title>
</svelte:head>

<!-- Header -->
<div class="bg-[#e8f0fe]">
	<div class="max-w-2xl mx-auto px-4 sm:px-6 py-8 text-center">
		<h1 class="text-xl font-bold text-gray-900">Donasi Saya</h1>
	</div>
</div>

<div class="max-w-2xl mx-auto px-4 sm:px-6 -mt-4 pb-8">
	<div class="bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-gray-100 overflow-hidden">
		<!-- Filter Tabs -->
		<div class="flex border-b border-gray-100">
			<button
				class="flex-1 py-3.5 text-sm font-medium text-center transition-colors {activeFilter === 'all'
					? 'text-[#1a73e8] border-b-2 border-[#1a73e8]'
					: 'text-gray-500 hover:text-gray-700'}"
				onclick={() => (activeFilter = 'all')}
			>
				Semua
			</button>
			<button
				class="flex-1 py-3.5 text-sm font-medium text-center transition-colors {activeFilter === 'success'
					? 'text-[#1a73e8] border-b-2 border-[#1a73e8]'
					: 'text-gray-500 hover:text-gray-700'}"
				onclick={() => (activeFilter = 'success')}
			>
				Berhasil
			</button>
			<button
				class="flex-1 py-3.5 text-sm font-medium text-center transition-colors {activeFilter === 'pending'
					? 'text-[#1a73e8] border-b-2 border-[#1a73e8]'
					: 'text-gray-500 hover:text-gray-700'}"
				onclick={() => (activeFilter = 'pending')}
			>
				Menunggu
			</button>
		</div>

		<!-- Donation List -->
		{#if filtered.length === 0}
			<div class="py-12 text-center">
				<svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
				</svg>
				<p class="text-sm text-gray-500">Belum ada donasi {activeFilter === 'success' ? 'berhasil' : activeFilter === 'pending' ? 'menunggu' : ''}</p>
			</div>
		{:else}
			<div class="divide-y divide-gray-50">
				{#each filtered as donation}
					<a
						href={donation.campaignSlug}
						class="flex items-start gap-3 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
					>
						<!-- Thumbnail placeholder -->
						<div class="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
							<svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
							</svg>
						</div>

						<!-- Info -->
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium text-gray-900 line-clamp-2">{donation.campaignTitle}</p>
							<div class="flex items-center gap-2 mt-1">
								<span class="text-sm font-semibold text-[#14B88C]">
									{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(donation.amount)}
								</span>
								<span class="text-xs text-gray-400">•</span>
								<span class="text-xs text-gray-400">{donation.date}</span>
							</div>
							<div class="flex items-center gap-2 mt-1.5">
								<span class="text-[10px] font-medium px-1.5 py-0.5 rounded {statusColors[donation.status]}">
									{statusLabels[donation.status]}
								</span>
								<span class="text-[10px] text-gray-400">{donation.paymentMethod}</span>
								{#if donation.isAnonymous}
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
		{/if}
	</div>

	<!-- Total Summary -->
	{#if donations.length > 0}
		<div class="mt-4 bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-gray-100 px-4 sm:px-6 py-4">
			<div class="flex items-center justify-between text-sm">
				<span class="text-gray-500">Total donasi</span>
				<span class="font-bold text-gray-900">
					{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(donations.reduce((sum, d) => sum + d.amount, 0))}
				</span>
			</div>
		</div>
	{/if}
</div>
