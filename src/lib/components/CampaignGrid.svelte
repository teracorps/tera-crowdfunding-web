<script lang="ts">
	import CampaignCard from './CampaignCard.svelte';
	import type { CampaignListItem } from '$lib/types';

	interface Props {
		campaigns: CampaignListItem[];
		title: string;
		subtitle?: string;
		seeAllLink?: string;
		variant?: 'grid' | 'carousel';
	}

	let {
		campaigns,
		title,
		subtitle,
		seeAllLink,
		variant = 'grid',
	}: Props = $props();
</script>

<section class="py-12 px-4 sm:px-6">
	<div class="max-w-7xl mx-auto">
		<!-- Section Header -->
		<div class="flex items-center justify-between mb-6">
			<div>
				<h2 class="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
				{#if subtitle}
					<p class="text-sm text-gray-500 mt-1">{subtitle}</p>
				{/if}
			</div>
			{#if seeAllLink && campaigns.length > 0}
				<a href={seeAllLink} class="text-sm font-semibold text-[#1a73e8] hover:text-[#1557b0] transition-colors">
					Lihat semua →
				</a>
			{/if}
		</div>

		<!-- Campaigns -->
		{#if campaigns.length === 0}
			<div class="text-center py-12">
				<svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
				</svg>
				<p class="text-gray-500 text-sm">Belum ada penggalangan dana</p>
			</div>
		{:else if variant === 'carousel'}
			<div class="scroll-container">
				{#each campaigns as campaign}
					<div class="w-72 md:w-80">
						<CampaignCard {campaign} />
					</div>
				{/each}
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
				{#each campaigns as campaign}
					<CampaignCard {campaign} />
				{/each}
			</div>
		{/if}
	</div>
</section>
