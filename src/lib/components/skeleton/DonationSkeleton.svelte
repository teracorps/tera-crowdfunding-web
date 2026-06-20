<script lang="ts">
	/**
	 * DonationSkeleton — loading skeleton untuk donation form modal.
	 * Meniru layout: grid nominal, input fields, textarea, checkbox, tombol submit.
	 */
</script>

<div class="animate-pulse space-y-5">
	<!-- Title bar -->
	<div class="flex items-center justify-between mb-2">
		<div class="h-6 bg-gray-200 rounded-lg w-24"></div>
		<div class="h-5 w-5 bg-gray-200 rounded-lg"></div>
	</div>

	<!-- Preset amounts grid (3x2) -->
	<div class="space-y-2">
		<div class="h-4 bg-gray-200 rounded w-36"></div>
		<div class="grid grid-cols-3 gap-2">
			{#each Array(6) as _}
				<div class="h-10 bg-gray-200 rounded-lg"></div>
			{/each}
		</div>
		<div class="h-10 bg-gray-200 rounded-lg"></div>
	</div>

	<!-- Form fields -->
	<div class="space-y-4">
		<div>
			<div class="h-3 bg-gray-200 rounded w-28 mb-2"></div>
			<div class="h-10 bg-gray-200 rounded-lg"></div>
		</div>
		<div>
			<div class="h-3 bg-gray-200 rounded w-16 mb-2"></div>
			<div class="h-10 bg-gray-200 rounded-lg"></div>
		</div>
		<div>
			<div class="h-3 bg-gray-200 rounded w-32 mb-2"></div>
			<div class="h-10 bg-gray-200 rounded-lg"></div>
		</div>
		<div>
			<div class="h-3 bg-gray-200 rounded w-36 mb-2"></div>
			<div class="h-16 bg-gray-200 rounded-lg"></div>
		</div>
		<!-- Checkbox row -->
		<div class="flex items-center gap-2">
			<div class="h-4 w-4 bg-gray-200 rounded"></div>
			<div class="h-3 bg-gray-200 rounded w-44"></div>
		</div>
	</div>

	<!-- Submit button -->
	<div class="h-11 bg-gray-200 rounded-xl w-full"></div>
</div>
