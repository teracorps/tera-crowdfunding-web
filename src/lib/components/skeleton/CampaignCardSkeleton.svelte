<script lang="ts">
	/**
	 * CampaignCardSkeleton — loading skeleton untuk campaign card.
	 * Meniru layout: cover image area, organizer, title, progress bar, stats row.
	 */
</script>

<div class="animate-pulse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
	<!-- Image area -->
	<div class="h-48 bg-gray-200"></div>

	<!-- Info area -->
	<div class="p-4 space-y-3">
		<!-- Organizer row -->
		<div class="flex items-center gap-1.5">
			<div class="h-3 bg-gray-200 rounded w-24"></div>
			<div class="h-3.5 w-3.5 bg-gray-200 rounded-full"></div>
			<div class="h-3 bg-gray-200 rounded w-8"></div>
		</div>

		<!-- Title lines -->
		<div class="space-y-1.5">
			<div class="h-4 bg-gray-200 rounded w-full"></div>
			<div class="h-4 bg-gray-200 rounded w-3/4"></div>
		</div>

		<!-- Progress bar -->
		<div class="h-2.5 bg-gray-200 rounded-full w-full"></div>

		<!-- Stats row -->
		<div class="flex items-center justify-between">
			<div class="h-4 bg-gray-200 rounded w-20"></div>
			<div class="h-4 bg-gray-200 rounded w-16"></div>
		</div>
	</div>
</div>
