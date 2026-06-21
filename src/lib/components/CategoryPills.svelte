<script lang="ts">
	import type { CampaignCategory } from '$lib/types';

	interface Props {
		categories: CampaignCategory[];
		selected?: string;
		onselect?: (slug: string) => void;
	}

	let { categories, selected, onselect }: Props = $props();

	// Default category icons
	const iconMap: Record<string, string> = {
		'bencana-alam': '🏠',
		'balita-anak-sakit': '👶',
		'bantuan-medis': '🏥',
		'pendidikan': '📚',
		'kemanusiaan': '🤝',
		'keagamaan': '🕌',
		'hewan': '🐾',
		'lingkungan': '🌱',
		'ekonomi': '💰',
		'kesehatan': '💊',
		'bencana': '🌊',
		'sosial': '👥',
		'other': '📋',
	};
</script>

<section class="py-8 px-4 sm:px-6">
	<div class="max-w-7xl mx-auto">
		<h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-6">
			Pilih Kategori Favoritmu
		</h2>

		<div class="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
			{#each categories as cat}
				<button
					onclick={() => onselect?.(cat.slug)}
					class="flex flex-col items-center gap-2 min-w-[90px] p-3 rounded-xl transition-all duration-200 cursor-pointer"
					class:bg-primary-light={selected === cat.slug}
					class:hover:bg-gray-50={selected !== cat.slug}
				>
					<div
						class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all"
						class:bg-primary={selected === cat.slug}
						class:bg-gray-100={selected !== cat.slug}
						class:shadow-md={selected === cat.slug}
					>
						{iconMap[cat.slug] || '📋'}
					</div>
					<span
						class="text-xs font-medium text-center leading-tight"
						class:text-primary={selected === cat.slug}
						class:text-gray-600={selected !== cat.slug}
					>
						{cat.name}
					</span>
				</button>
			{/each}
		</div>
	</div>
</section>
