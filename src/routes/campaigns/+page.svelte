<script lang="ts">
	import { page } from '$app/state';
	import { getCampaigns, getCategories, formatRupiah } from '$lib/api';
	import CampaignCard from '$lib/components/CampaignCard.svelte';
	import type { CampaignListItem } from '$lib/types';

	let campaigns = $state<CampaignListItem[]>([]);
	let categories = $state<any[]>([]);
	let loading = $state(true);
	let selectedCategory = $state('');
	let sortBy = $state('popular');
	let searchQuery = $state('');
	let currentPage = $state(1);
	let totalPages = $state(1);
	let total = $state(0);

	$effect(() => {
		loadCampaigns();
	});

	async function loadCampaigns() {
		loading = true;
		try {
			const [campRes, catRes] = await Promise.all([
				getCampaigns({
					page: currentPage,
					per_page: 12,
					category: selectedCategory || undefined,
					sort: sortBy,
					search: searchQuery || undefined,
				}),
				getCategories(),
			]);
			campaigns = campRes.campaigns;
			totalPages = campRes.meta?.total_pages || 1;
			total = campRes.meta?.total || 0;
			categories = catRes;
		} catch (e) {
			console.error('Failed to load campaigns:', e);
		} finally {
			loading = false;
		}
	}

	function selectCategory(slug: string) {
		selectedCategory = slug === selectedCategory ? '' : slug;
		currentPage = 1;
		loadCampaigns();
	}

	function handleSearch(e: Event) {
		const target = e.target as HTMLInputElement;
		searchQuery = target.value;
		currentPage = 1;
		loadCampaigns();
	}
</script>

<svelte:head>
	<title>Jelajahi Campaign - Terabisa</title>
</svelte:head>

<!-- Header Banner -->
<section class="hero-gradient py-12 px-4 sm:px-6">
	<div class="max-w-7xl mx-auto text-center">
		<h1 class="text-2xl md:text-3xl font-bold text-white mb-2">Jelajahi Campaign</h1>
		<p class="text-white/70 text-sm mb-6">Temukan campaign yang ingin kamu dukung</p>

		<!-- Search -->
		<div class="max-w-xl mx-auto relative">
			<input
				type="text"
				placeholder="Cari campaign..."
				class="w-full px-5 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd166] bg-white/95"
				bind:value={searchQuery}
				oninput={handleSearch}
			/>
			<svg class="absolute right-4 top-3 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
			</svg>
		</div>
	</div>
</section>

<!-- Filters -->
<div class="bg-white border-b border-gray-100 sticky top-16 z-40">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 py-3">
		<div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
			<button
				class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all"
				class:bg-[#1a73e8]!text-white={!selectedCategory}
				class:bg-gray-100 text-gray-700={selectedCategory}
				class:hover:bg-gray-200={selectedCategory}
				onclick={() => selectCategory('')}
			>
				Semua
			</button>
			{#each categories as cat}
				<button
					class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all"
					class:bg-[#1a73e8]!text-white={selectedCategory === cat.slug}
					class:bg-gray-100 text-gray-700={selectedCategory !== cat.slug}
					class:hover:bg-gray-200={selectedCategory !== cat.slug}
					onclick={() => selectCategory(cat.slug)}
				>
					{cat.name}
				</button>
			{/each}
		</div>
	</div>
</div>

<!-- Campaign Grid -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
	<!-- Sort & Count -->
	<div class="flex items-center justify-between mb-6">
		<p class="text-sm text-gray-500">
			{total} campaign ditemukan
		</p>
		<select
			class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] bg-white"
			bind:value={sortBy}
			onchange={loadCampaigns}
		>
			<option value="popular">Terpopuler</option>
			<option value="newest">Terbaru</option>
			<option value="urgent">Paling Mendesak</option>
			<option value="almost">Hampir Tercapai</option>
		</select>
	</div>

	<!-- Loading -->
	{#if loading}
		<div class="flex justify-center py-16">
			<div class="w-10 h-10 border-3 border-gray-200 border-t-[#1a73e8] rounded-full animate-spin"></div>
		</div>
	{:else if campaigns.length === 0}
		<div class="text-center py-16">
			<svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
			</svg>
			<h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak ada campaign ditemukan</h3>
			<p class="text-gray-500 text-sm">Coba ubah filter atau kata kunci pencarian</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{#each campaigns as campaign}
				<CampaignCard {campaign} />
			{/each}
		</div>
	{/if}

	<!-- Pagination -->
	{#if totalPages > 1}
		<div class="flex items-center justify-center gap-2 mt-10">
			<button
				class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
				disabled={currentPage <= 1}
				onclick={() => { currentPage--; loadCampaigns(); }}
			>
				← Sebelumnya
			</button>

			<div class="flex gap-1">
				{#each Array.from({ length: totalPages }, (_, i) => i + 1) as p}
					<button
						class="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
						class:bg-[#1a73e8]!text-white={p === currentPage}
						class:hover:bg-gray-100={p !== currentPage}
						class:text-gray-700={p !== currentPage}
						onclick={() => { currentPage = p; loadCampaigns(); }}
					>
						{p}
					</button>
				{/each}
			</div>

			<button
				class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
				disabled={currentPage >= totalPages}
				onclick={() => { currentPage++; loadCampaigns(); }}
			>
				Selanjutnya →
			</button>
		</div>
	{/if}
</div>
