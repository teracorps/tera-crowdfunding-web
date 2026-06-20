<script lang="ts">
	import { onMount } from 'svelte';
	import { getCampaigns, getStats } from '$lib/api';
	import { formatRupiah } from '$lib/api';
	import type { CampaignListItem, FundingStats } from '$lib/types';

	let stats = $state<FundingStats | null>(null);
	let recentCampaigns = $state<CampaignListItem[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const [statsData, campaignsData] = await Promise.all([
				getStats(),
				getCampaigns({}),
			]);
			stats = statsData;
			recentCampaigns = (campaignsData?.campaigns || []).slice(0, 5);
		} finally {
			loading = false;
		}
	});
</script>

<div>
	<!-- Stats Cards -->
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		<div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
			<p class="text-xs font-medium text-gray-500 mb-1">Total Campaign</p>
			<p class="text-xl sm:text-2xl font-bold text-gray-900">
				{#if loading}<span class="inline-block w-16 h-5 bg-gray-100 rounded animate-pulse"></span>{:else}{stats?.total_campaigns ?? '-'}{/if}
			</p>
		</div>
		<div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
			<p class="text-xs font-medium text-gray-500 mb-1">Total Terkumpul</p>
			<p class="text-xl sm:text-2xl font-bold text-gray-900">
				{#if loading}<span class="inline-block w-16 h-5 bg-gray-100 rounded animate-pulse"></span>{:else}{stats ? formatRupiah(stats.total_raised) : '-'}{/if}
			</p>
		</div>
		<div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
			<p class="text-xs font-medium text-gray-500 mb-1">Total Donasi</p>
			<p class="text-xl sm:text-2xl font-bold text-gray-900">
				{#if loading}<span class="inline-block w-16 h-5 bg-gray-100 rounded animate-pulse"></span>{:else}{stats?.total_donations ?? '-'}{/if}
			</p>
		</div>
		<div class="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
			<p class="text-xs font-medium text-gray-500 mb-1">Total Donatur</p>
			<p class="text-xl sm:text-2xl font-bold text-gray-900">
				{#if loading}<span class="inline-block w-16 h-5 bg-gray-100 rounded animate-pulse"></span>{:else}{stats?.total_donors ?? '-'}{/if}
			</p>
		</div>
	</div>

	<!-- Recent Campaigns -->
	<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
		<div class="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-50">
			<h2 class="text-sm font-bold text-gray-900">Campaign Terbaru</h2>
			<button
				class="text-xs font-semibold text-[#1a73e8] hover:text-[#1557b0] transition-colors"
				onclick={() => window.location.href = '/admin'}
			>
				Lihat Semua
			</button>
		</div>

		{#if loading}
			<div class="divide-y divide-gray-50">
				{#each Array(3) as _}
					<div class="px-4 sm:px-6 py-4">
						<div class="h-4 bg-gray-100 rounded w-3/4 mb-2 animate-pulse"></div>
						<div class="h-3 bg-gray-50 rounded w-1/2 animate-pulse"></div>
					</div>
				{/each}
			</div>
		{:else if recentCampaigns.length === 0}
			<div class="py-12 text-center">
				<svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
				</svg>
				<p class="text-sm text-gray-500">Belum ada campaign</p>
				<a href="/campaign/create" class="mt-3 text-xs font-semibold text-[#1a73e8] inline-block hover:underline">Buat Campaign Baru</a>
			</div>
		{:else}
			<div class="divide-y divide-gray-50">
				{#each recentCampaigns as c}
					<a href={`/campaign/${c.slug}`} class="flex items-center gap-3 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
						<div class="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
							{#if c.cover_image}
								<img src={c.cover_image} alt="" class="w-full h-full object-cover" />
							{/if}
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium text-gray-900 truncate">{c.title}</p>
							<div class="flex items-center gap-2 mt-0.5">
								<span class="text-xs text-gray-500">{c.category}</span>
								<span class="text-xs text-gray-300">•</span>
								<span class="text-xs font-medium" class:text-green-600={c.status === 'active'} class:text-gray-400={c.status !== 'active'}>
									{c.status === 'active' ? 'Aktif' : c.status}
								</span>
							</div>
						</div>
						<div class="text-right">
							<p class="text-xs font-semibold text-gray-900">{formatRupiah(c.raised_amount)}</p>
							<p class="text-[10px] text-gray-400">dari {formatRupiah(c.target_amount)}</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
