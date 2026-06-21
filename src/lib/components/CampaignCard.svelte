<script lang="ts">
	import type { CampaignListItem } from '$lib/types';

	interface Props {
		campaign: CampaignListItem;
	}

	let { campaign }: Props = $props();

	// Placeholder image for when no real image available
	const placeholderBg = 'linear-gradient(135deg, var(--color-primary, #14B88C), #34A853)';
</script>

<a href="/campaign/{campaign.slug}" class="block">
	<div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 card-hover">
		<!-- Campaign Image -->
		<div class="relative h-48 overflow-hidden">
			{#if campaign.cover_image}
				<img
					src={campaign.cover_image}
					alt={campaign.title}
					class="w-full h-full object-cover"
					loading="lazy"
				/>
			{:else}
				<div class="w-full h-full" style="background: {placeholderBg}"></div>
			{/if}

			<!-- Image overlay gradient -->
			<div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

			<!-- Badges -->
			<div class="absolute top-3 left-3 flex gap-2">
				{#if campaign.is_urgent}
					<span class="badge-urgent urgent-pulse">❗ DARURAT</span>
				{/if}
				{#if campaign.status === 'completed'}
					<span class="text-xs font-bold px-2.5 py-1 rounded-full bg-green-500 text-white">
						✅ Berhasil
					</span>
				{/if}
			</div>

			<!-- Amount overlay on image -->
			<div class="absolute bottom-3 left-3 right-3">
				<div class="text-white text-sm font-bold drop-shadow-lg">
					Terkumpul {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(campaign.raised_amount)}
				</div>
			</div>
		</div>

		<!-- Campaign Info -->
		<div class="p-4">
			<!-- Organizer -->
			<div class="flex items-center gap-1.5 mb-2">
				<span class="text-xs text-gray-500">{campaign.organizer_name}</span>
				<svg class="w-3.5 h-3.5 text-primary" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
				</svg>
				<span class="badge-org">ORG</span>
			</div>

			<!-- Title -->
			<h3 class="font-semibold text-gray-900 text-sm leading-snug mb-3 line-clamp-2">
				{campaign.title}
			</h3>

			<!-- Progress Bar -->
			<div class="progress-bar mb-2">
				<div
					class="progress-bar-fill"
					style="width: {Math.min(campaign.percentage, 100)}%"
				></div>
			</div>

			<!-- Stats row -->
			<div class="flex items-center justify-between text-xs">
				<span class="font-semibold text-gray-900">
					{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(campaign.raised_amount)}
				</span>
				<span class="text-gray-500">
					{campaign.days_remaining > 0 ? `${campaign.days_remaining} hari lagi` : 'Selesai'}
				</span>
			</div>
		</div>
	</div>
</a>
