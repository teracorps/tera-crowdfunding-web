<script lang="ts">
	let { data } = $props();
	let campaign = $derived(data.campaign);
	let donations = $derived(data.donations);
	let stats = $derived(data.stats);
	let session = $derived(data.session);

	// Rupiah formatter
	function formatRupiah(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	}

	function formatNumber(num: number): string {
		return new Intl.NumberFormat('id-ID').format(num);
	}

	function formatDate(dateStr: string): string {
		if (!dateStr) return '-';
		return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
	}

	function formatDateTime(dateStr: string): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}

	// Status helpers
	const statusLabels: Record<string, string> = {
		paid: 'Berhasil',
		settlement: 'Berhasil',
		pending: 'Menunggu',
		waiting_payment: 'Menunggu Pembayaran',
		failed: 'Gagal',
		expired: 'Kedaluwarsa',
		refunded: 'Dikembalikan',
	};

	const statusColors: Record<string, string> = {
		paid: 'bg-green-100 text-green-700',
		settlement: 'bg-green-100 text-green-700',
		pending: 'bg-yellow-100 text-yellow-700',
		waiting_payment: 'bg-yellow-100 text-yellow-700',
		failed: 'bg-red-100 text-red-700',
		expired: 'bg-red-100 text-red-700',
		refunded: 'bg-gray-100 text-gray-600',
	};

	const campaignStatusLabels: Record<string, string> = {
		active: 'Aktif',
		draft: 'Draft',
		paused: 'Dihentikan',
		completed: 'Selesai',
		cancelled: 'Dibatalkan',
	};

	const campaignStatusColors: Record<string, string> = {
		active: 'bg-green-100 text-green-700',
		draft: 'bg-gray-100 text-gray-600',
		paused: 'bg-yellow-100 text-yellow-700',
		completed: 'bg-blue-100 text-blue-700',
		cancelled: 'bg-red-100 text-red-700',
	};

	const percentage = $derived(
		campaign.target_amount > 0
			? Math.min(Math.round((campaign.raised_amount / campaign.target_amount) * 100), 100)
			: 0,
	);

	const campaignUrl = $derived(`${window.location.origin}/campaign/${campaign.slug}`);

	let filterStatus = $state<string>('all');
	let searchQuery = $state('');

	const filteredDonations = $derived(
		donations.filter((d: { payment_status: string; donor_name: string; donor_email: string; donation_number: string }) => {
			if (filterStatus !== 'all' && d.payment_status !== filterStatus) return false;
			if (searchQuery) {
				const q = searchQuery.toLowerCase();
				return (
					d.donor_name.toLowerCase().includes(q) ||
					d.donor_email.toLowerCase().includes(q) ||
					d.donation_number.toLowerCase().includes(q)
				);
			}
			return true;
		}),
	);

	let copied = $state(false);
	async function copyLink() {
		try {
			await navigator.clipboard.writeText(campaignUrl);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// Fallback
		}
	}
</script>

<svelte:head>
	<title>Kelola Campaign - {campaign.title} - Terabisa</title>
</svelte:head>

<!-- Header -->
<div class="bg-gradient-to-r from-[#1a73e8] to-[#1557b0]">
	<div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
		<div class="flex items-center justify-between flex-wrap gap-4">
			<div>
				<a href="/" class="text-blue-200 text-sm hover:text-white transition-colors">&larr; Dashboard</a>
				<h1 class="text-xl sm:text-2xl font-bold text-white mt-1">{campaign.title}</h1>
				<div class="flex items-center gap-2 mt-1">
					<span
						class="text-xs font-medium px-2 py-0.5 rounded-full {campaignStatusColors[campaign.status] || 'bg-gray-100 text-gray-600'}"
					>
						{campaignStatusLabels[campaign.status] || campaign.status}
					</span>
					<span class="text-xs text-blue-200">{campaign.organizer_name}</span>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<a
					href="/campaign/{campaign.slug}"
					class="px-4 py-2 text-sm font-semibold text-white bg-white/20 hover:bg-white/30 rounded-full transition-colors"
				>
					Lihat Campaign
				</a>
				<button
					class="px-4 py-2 text-sm font-semibold text-white bg-white/20 hover:bg-white/30 rounded-full transition-colors flex items-center gap-1.5"
					onclick={copyLink}
				>
					{#if copied}
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
						Tersalin!
					{:else}
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
						Salin Link
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>

<div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
	<!-- Stats Cards -->
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
		<div class="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
			<p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Terkumpul</p>
			<p class="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{formatRupiah(campaign.raised_amount)}</p>
			<p class="text-xs text-gray-400 mt-0.5">dari {formatRupiah(campaign.target_amount)}</p>
		</div>
		<div class="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
			<p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Donatur</p>
			<p class="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{formatNumber(campaign.donor_count)}</p>
			<p class="text-xs text-gray-400 mt-0.5">orang</p>
		</div>
		<div class="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
			<p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Donasi</p>
			<p class="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats.total_donations)}</p>
			<p class="text-xs text-gray-400 mt-0.5">
				{stats.paid_count} berhasil, {stats.pending_count} menunggu
			</p>
		</div>
		<div class="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
			<p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</p>
			<p class="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{percentage}%</p>
			<p class="text-xs text-gray-400 mt-0.5">tercapai</p>
		</div>
	</div>

	<!-- Progress Bar -->
	<div class="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
		<div class="flex items-center justify-between mb-2">
			<span class="text-sm font-medium text-gray-700">Progress Penggalangan Dana</span>
			<span class="text-sm font-semibold text-[#1a73e8]">{percentage}%</span>
		</div>
		<div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
			<div
				class="h-full rounded-full transition-all duration-500"
				class:bg-[#1a73e8]={percentage < 100}
				class:bg-green-500={percentage >= 100}
				style="width: {Math.min(percentage, 100)}%"
			></div>
		</div>
	</div>

	<!-- Donations Table -->
	<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
		<div class="px-4 sm:px-6 py-4 border-b border-gray-100">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
				<h2 class="text-base font-bold text-gray-900">
					Daftar Donasi
					<span class="text-sm font-normal text-gray-400 ml-1">({donations.length})</span>
				</h2>
				<div class="flex items-center gap-2 w-full sm:w-auto">
					<!-- Search -->
					<div class="relative flex-1 sm:flex-initial">
						<svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
						</svg>
						<input
							type="text"
							placeholder="Cari donatur..."
							bind:value={searchQuery}
							class="w-full sm:w-48 pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8]"
						/>
					</div>
					<!-- Filter -->
					<select
						bind:value={filterStatus}
						class="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8]"
					>
						<option value="all">Semua Status</option>
						<option value="paid">Berhasil</option>
						<option value="settlement">Settlement</option>
						<option value="pending">Menunggu</option>
						<option value="waiting_payment">Menunggu Bayar</option>
						<option value="failed">Gagal</option>
					</select>
				</div>
			</div>
		</div>

		{#if donations.length === 0}
			<!-- Empty state -->
			<div class="py-12 text-center">
				<svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
				</svg>
				<p class="text-sm text-gray-500">Belum ada donasi untuk campaign ini</p>
				<p class="text-xs text-gray-400 mt-1">Bagikan link campaign untuk mulai menggalang dana</p>
			</div>
		{:else if filteredDonations.length === 0}
			<div class="py-12 text-center">
				<svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
				</svg>
				<p class="text-sm text-gray-500">Tidak ada donasi yang cocok dengan filter</p>
			</div>
		{:else}
			<!-- Desktop Table -->
			<div class="hidden md:block overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							<th class="px-6 py-3 bg-gray-50">Tanggal</th>
							<th class="px-6 py-3 bg-gray-50">Donatur</th>
							<th class="px-6 py-3 bg-gray-50">Email</th>
							<th class="px-6 py-3 bg-gray-50 text-right">Nominal</th>
							<th class="px-6 py-3 bg-gray-50">Status</th>
							<th class="px-6 py-3 bg-gray-50">Pesan</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each filteredDonations as donation (donation.id)}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-6 py-3 text-sm text-gray-600 whitespace-nowrap">
									{formatDate(donation.donation_date)}
								</td>
								<td class="px-6 py-3 text-sm font-medium text-gray-900">
									{#if donation.is_anonymous}
										<span class="flex items-center gap-1">
											<svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
											Anonim
										</span>
									{:else}
										{donation.donor_name}
									{/if}
								</td>
								<td class="px-6 py-3 text-sm text-gray-500">
									{donation.is_anonymous ? '-' : donation.donor_email || '-'}
								</td>
								<td class="px-6 py-3 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">
									{formatRupiah(donation.amount)}
								</td>
								<td class="px-6 py-3 whitespace-nowrap">
									<span
										class="text-xs font-medium px-2 py-0.5 rounded-full {statusColors[donation.payment_status] || 'bg-gray-100 text-gray-600'}"
									>
										{statusLabels[donation.payment_status] || donation.payment_status}
									</span>
								</td>
								<td class="px-6 py-3 text-sm text-gray-500 max-w-[200px] truncate" title={donation.message || ''}>
									{donation.message || '-'}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Mobile Cards -->
			<div class="md:hidden divide-y divide-gray-50">
				{#each filteredDonations as donation (donation.id)}
					<div class="px-4 py-3 space-y-2">
						<div class="flex items-center justify-between">
							<span class="text-sm font-medium text-gray-900">
								{#if donation.is_anonymous}
									<span class="flex items-center gap-1">
										<svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
										Anonim
									</span>
								{:else}
									{donation.donor_name}
								{/if}
							</span>
							<span
								class="text-xs font-medium px-2 py-0.5 rounded-full {statusColors[donation.payment_status] || 'bg-gray-100 text-gray-600'}"
							>
								{statusLabels[donation.payment_status] || donation.payment_status}
							</span>
						</div>
						<div class="flex items-center justify-between">
							<div>
								<span class="text-sm font-bold text-gray-900">{formatRupiah(donation.amount)}</span>
								<span class="text-xs text-gray-400 ml-2">{formatDate(donation.donation_date)}</span>
							</div>
						</div>
						{#if donation.message}
							<p class="text-xs text-gray-500 italic">"{donation.message}"</p>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Table Footer Summary -->
			<div class="px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50/50">
				<div class="flex items-center justify-between text-sm">
					<span class="text-gray-500">
						Menampilkan {filteredDonations.length} dari {donations.length} donasi
					</span>
					<span class="font-semibold text-gray-900">
						Total: {formatRupiah(stats.total_raised)}
					</span>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		background-color: #f8f9fa;
	}
</style>
