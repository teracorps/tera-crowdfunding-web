<script lang="ts">
	import { onMount } from 'svelte';
	import { getDonationStatus, formatRupiah } from '$lib/api';
	import type { DonationHistoryItem } from '$lib/types';

	let { data } = $props();

	let params = $state<{ id: string }>(data.params as any);

	let donation = $state<DonationHistoryItem | null>(null);
	let status = $state<'success' | 'pending' | 'error' | 'loading'>('loading');
	let errorMsg = $state('');

	let urlStatus = $state('');

	onMount(() => {
		const u = new URL(window.location.href);
		urlStatus = u.searchParams.get('status') || '';
		loadDonation();
	});

	async function loadDonation() {
		try {
			const result = await getDonationStatus(params.id);
			if (result) {
				donation = result;
				status = result.payment_status === 'settlement' ? 'success' : result.payment_status?.startsWith('failed') ? 'error' : 'pending';
			} else {
				status = 'error';
				errorMsg = 'Donasi tidak ditemukan';
			}
		} catch {
			status = 'error';
			errorMsg = 'Gagal memuat informasi donasi';
		}
	}

	function goToCampaign() {
		if (donation?.campaign?.slug) {
			window.location.href = `/campaign/${donation.campaign.slug}`;
		} else {
			window.location.href = '/campaigns';
		}
	}

	function goToDonations() {
		window.location.href = '/user/donations';
	}

	const statusIcons: Record<string, string> = {
		success: `<svg class="w-16 h-16 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
		pending: `<svg class="w-16 h-16 text-yellow-500 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
		error: `<svg class="w-16 h-16 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
	};
</script>

<svelte:head>
	<title>Status Donasi - Terabisa</title>
</svelte:head>

<div class="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
	<div class="w-full max-w-md">
		{#if status === 'loading'}
			<div class="text-center py-12">
				<div class="w-10 h-10 border-2 border-gray-200 border-t-[#1a73e8] rounded-full animate-spin mx-auto mb-4"></div>
				<p class="text-sm text-gray-500">Memeriksa status pembayaran...</p>
			</div>
		{:else}
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
				<!-- Status Icon -->
				<div class="mb-4">{@html statusIcons[status] || statusIcons.error}</div>

				<!-- Title -->
				<h1 class="text-lg font-bold text-gray-900 mb-1">
					{#if status === 'success'}
						Pembayaran Berhasil! 🎉
					{:else if status === 'pending'}
						Menunggu Pembayaran ⏳
					{:else}
						Pembayaran Gagal 😔
					{/if}
				</h1>

				<p class="text-sm text-gray-500 mb-6">
					{#if donation}
						Donasi untuk <strong>{donation.campaign?.title || 'Campaign'}</strong>
					{:else}
						{errorMsg}
					{/if}
				</p>

				<!-- Donation Details -->
				{#if donation}
					<div class="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
						<div class="flex justify-between text-sm">
							<span class="text-gray-500">Nominal</span>
							<span class="font-semibold text-gray-900">{formatRupiah(donation.amount)}</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-gray-500">No. Donasi</span>
							<span class="text-gray-900">{donation.donation_number}</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-gray-500">Tanggal</span>
							<span class="text-gray-900">{donation.date}</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-gray-500">Status</span>
							<span class="font-medium" class:text-green-600={status === 'success'} class:text-yellow-600={status === 'pending'} class:text-red-600={status === 'error'}>
								{donation.payment_status === 'settlement' ? 'Berhasil' : donation.payment_status === 'pending' ? 'Menunggu' : 'Gagal'}
							</span>
						</div>
					</div>

					<!-- Download Invoice Button -->
					{#if status === 'success'}
						<a
							href="/donasi/invoice/{donation.id}"
							class="block w-full py-2.5 text-sm font-semibold text-white bg-[#14B88C] hover:bg-[#0F9A75] rounded-xl transition-colors text-center mb-3"
						>
							Download Invoice
						</a>
					{/if}
				{/if}

				<!-- Actions -->
				<div class="space-y-3">
					{#if status === 'pending'}
						<button
							onclick={() => window.location.reload()}
							class="w-full py-2.5 text-sm font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl transition-colors"
						>
							Cek Status Lagi
						</button>
					{/if}
					<button
						onclick={goToCampaign}
						class="w-full py-2.5 text-sm font-semibold text-[#1a73e8] border border-[#1a73e8] hover:bg-blue-50 rounded-xl transition-colors"
					>
						Lihat Campaign
					</button>
					<button
						onclick={goToDonations}
						class="w-full py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
					>
						Riwayat Donasi Saya
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
