<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import CategoryPills from '$lib/components/CategoryPills.svelte';
	import CampaignGrid from '$lib/components/CampaignGrid.svelte';
	import StatsSection from '$lib/components/StatsSection.svelte';
	import DoaSection from '$lib/components/DoaSection.svelte';
	import { getCampaigns, getCategories, getStats } from '$lib/api';
	import { onMount } from 'svelte';

	let featured = $state<any[]>([]);
	let urgent = $state<any[]>([]);
	let newCampaigns = $state<any[]>([]);
	let categories = $state<any[]>([]);
	let stats = $state<any>(undefined);
	let loading = $state(true);

	let selectedCategory = $state('');

	onMount(async () => {
		try {
			const [featuredRes, urgentRes, newRes, catRes, statsRes] = await Promise.allSettled([
				getCampaigns({ per_page: 6, sort: 'popular' }),
				getCampaigns({ per_page: 4, sort: 'urgent' }),
				getCampaigns({ per_page: 8, sort: 'newest' }),
				getCategories(),
				getStats(),
			]);

			if (featuredRes.status === 'fulfilled') featured = featuredRes.value.campaigns;
			if (urgentRes.status === 'fulfilled') urgent = urgentRes.value.campaigns;
			if (newRes.status === 'fulfilled') newCampaigns = newRes.value.campaigns;
			if (catRes.status === 'fulfilled') categories = catRes.value;
			if (statsRes.status === 'fulfilled') stats = statsRes.value;
		} catch (e) {
			console.error('Failed to load homepage data:', e);
		} finally {
			loading = false;
		}
	});

	function handleCategorySelect(slug: string) {
		selectedCategory = slug === selectedCategory ? '' : slug;
		if (selectedCategory) {
			window.location.href = `/campaigns?category=${slug}`;
		}
	}
</script>

<svelte:head>
	<title>Terabisa - Galang Dana & Donasi Online</title>
	<meta name="description" content="Platform crowdfunding terpercaya untuk galang dana, donasi online, zakat, wakaf, dan saling membantu sesama." />
</svelte:head>

<!-- Hero -->
<Hero {stats} />

<!-- Categories -->
{#if categories.length > 0}
	<CategoryPills {categories} selected={selectedCategory} onselect={handleCategorySelect} />
{/if}

<!-- Urgent Campaigns -->
{#if urgent.length > 0}
	<CampaignGrid
		campaigns={urgent}
		title="Penggalangan Dana Mendesak"
		subtitle="Bantu mereka yang sangat membutuhkan bantuanmu"
		seeAllLink="/campaigns?sort=urgent"
		variant="carousel"
	/>
{/if}

<!-- Featured / Curated -->
{#if featured.length > 0}
	<CampaignGrid
		campaigns={featured}
		title="Yang Baru di Terabisa"
		subtitle="Galang dana pilihan yang baru dimulai"
		seeAllLink="/campaigns?sort=popular"
	/>
{/if}

<!-- New Campaigns -->
{#if newCampaigns.length > 0}
	<CampaignGrid
		campaigns={newCampaigns}
		title="Pilihan Terabisa"
		subtitle="Galang dana pilihan kami yang layak didukung"
		seeAllLink="/campaigns"
	/>
	{/if}

<!-- Doa-doa #OrangBaik -->
<DoaSection />

<!-- Stats -->
<StatsSection {stats} />

<!-- How it works -->
<section class="py-16 px-4 sm:px-6 bg-white">
	<div class="max-w-7xl mx-auto text-center">
		<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Cara Kerja Terabisa</h2>
		<p class="text-gray-500 mb-10">Donasi dan galang dana dengan mudah & transparan</p>

		<div class="grid md:grid-cols-3 gap-8">
			<!-- Step 1 -->
			<div class="flex flex-col items-center">
				<div class="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-4">
					<svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
					</svg>
				</div>
				<h3 class="font-semibold text-gray-900 mb-2">Temukan Campaign</h3>
				<p class="text-sm text-gray-500 max-w-xs">Cari campaign yang sesuai dengan keinginanmu untuk membantu sesama</p>
			</div>

			<!-- Step 2 -->
			<div class="flex flex-col items-center">
				<div class="w-16 h-16 rounded-2xl bg-[#fff0ea] flex items-center justify-center mb-4">
					<svg class="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
					</svg>
				</div>
				<h3 class="font-semibold text-gray-900 mb-2">Donasi Sekarang</h3>
				<p class="text-sm text-gray-500 max-w-xs">Pilih nominal donasi dan bayar dengan mudah via berbagai metode pembayaran</p>
			</div>

			<!-- Step 3 -->
			<div class="flex flex-col items-center">
				<div class="w-16 h-16 rounded-2xl bg-[#e8faf4] flex items-center justify-center mb-4">
					<svg class="w-8 h-8 text--primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				</div>
				<h3 class="font-semibold text-gray-900 mb-2">Pantau Dampak</h3>
				<p class="text-sm text-gray-500 max-w-xs">Ikuti perkembangan campaign dan lihat dampak nyata donasimu</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA Banner -->
<section class="hero-gradient py-12 px-4 sm:px-6">
	<div class="max-w-4xl mx-auto text-center">
		<h2 class="text-2xl md:text-3xl font-bold text-white mb-3">
			Galang Dana Sekarang
		</h2>
		<p class="text-white/80 mb-6 max-w-lg mx-auto">
			Mulai galang dana untuk kebaikanmu sendiri atau orang yang kamu kenal. Gratis dan mudah.
		</p>
		<a
			href="/galang-dana"
			class="donate-btn inline-block !px-8 !py-3 !text-base"
		>
			Mulai Galang Dana →
		</a>
	</div>
</section>
