<script lang="ts">
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<div class="min-h-screen" style="background-color: var(--color-bg-section, #f5f7fa);">
	<!-- Top bar -->
	<div class="bg-white border-b border-gray-200 px-4 py-3">
		<div class="max-w-3xl mx-auto flex items-center justify-between">
			<a href="/" class="flex items-center gap-2">
				<div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background-color: var(--color-primary, #14B88C);">
					<span class="text-white font-bold text-xs">T</span>
				</div>
				<span class="font-bold text-lg" style="color: var(--color-text-primary, #111827);">
					Setup Platform
				</span>
			</a>
			<div class="text-xs" style="color: var(--color-text-muted, #94a3b8);">
				{data?.tenant?.name ?? 'Organisasi Baru'}
			</div>
		</div>
	</div>

	<main class="max-w-3xl mx-auto px-4 py-8">
		{@render children()}
	</main>
</div>
