<script lang="ts">
	interface Props {
		status: 'success' | 'loading' | 'error' | 'idle';
		message?: string;
	}

	let { status, message }: Props = $props();
</script>

{#if status === 'loading'}
	<div class="flex items-center justify-center py-8">
		<div class="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin"></div>
	</div>
{:else if status === 'error'}
	<div class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
		<svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
		</svg>
		<div>
			<p class="text-sm font-medium text-red-800">Terjadi kesalahan</p>
			{#if message}
				<p class="text-sm text-red-600 mt-1">{message}</p>
			{/if}
		</div>
	</div>
{:else if status === 'success'}
	<div class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
		<svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
		</svg>
		<div>
			<p class="text-sm font-medium text-green-800">Berhasil!</p>
			{#if message}
				<p class="text-sm text-green-600 mt-1">{message}</p>
			{/if}
		</div>
	</div>
{/if}
