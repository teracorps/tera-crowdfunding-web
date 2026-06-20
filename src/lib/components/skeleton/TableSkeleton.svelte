<script lang="ts">
	/**
	 * TableSkeleton — loading skeleton untuk tabel.
	 * Menampilkan baris dengan kolom-kolom gray box yang berpulse.
	 * Support responsif: pada mobile tampil stacked, desktop sebagai grid.
	 *
	 * @prop columns - Jumlah kolom (default: 4)
	 * @prop rows - Jumlah baris (default: 5)
	 */
	interface Props {
		columns?: number;
		rows?: number;
	}

	let { columns = 4, rows = 5 }: Props = $props();

	const colStyle = `grid-template-columns: repeat(${columns}, minmax(0, 1fr))`;
</script>

<div class="animate-pulse bg-white rounded-xl border border-gray-100 overflow-hidden">
	<!-- Table header -->
	<div
		class="hidden sm:grid gap-4 px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50"
		style={colStyle}
	>
		{#each Array(columns) as _}
			<div class="h-3 bg-gray-200 rounded w-3/4"></div>
		{/each}
	</div>

	<!-- Table rows -->
	<div class="divide-y divide-gray-50">
		{#each Array(rows) as _}
			<div
				class="hidden sm:grid gap-4 px-4 sm:px-6 py-4"
				style={colStyle}
			>
				{#each Array(columns) as _}
					<div class="flex items-center gap-2">
						<div class="h-4 bg-gray-200 rounded w-4/5"></div>
					</div>
				{/each}
			</div>

			<!-- Mobile row (stacked) -->
			<div class="sm:hidden px-4 py-4 space-y-2">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
					<div class="flex-1 space-y-1.5">
						<div class="h-4 bg-gray-200 rounded w-3/4"></div>
						<div class="h-3 bg-gray-200 rounded w-1/2"></div>
					</div>
				</div>
				<div class="flex gap-4 pl-13">
					{#each Array(Math.min(columns - 1, 3)) as _}
						<div class="flex-1">
							<div class="h-3 bg-gray-200 rounded w-full"></div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
