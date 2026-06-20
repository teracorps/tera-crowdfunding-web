<script lang="ts">
	import { onMount } from 'svelte';

	let { data } = $props();

	let loading = $state(true);
	let invoiceHtml = $state('');
	let error = $state('');

	onMount(async () => {
		const pathParts = window.location.pathname.split('/');
		const id = pathParts[pathParts.length - 1] || '';

		try {
			const res = await fetch(`/api/public/funding/donations/invoice/${id}`);
			if (!res.ok) {
				throw new Error('Gagal memuat invoice');
			}
			invoiceHtml = await res.text();
			loading = false;

			// Auto-open print dialog after content loads
			setTimeout(() => {
				window.print();
			}, 600);
		} catch (e) {
			error = 'Gagal memuat invoice donasi';
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Invoice Donasi - Terabisa</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	{#if loading}
		<div class="max-w-lg mx-auto px-4 py-12 text-center">
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
				<svg class="w-16 h-16 text-[#14B88C] mx-auto mb-4 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M6 9V2h12v7"/>
					<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
					<path d="M6 14h12v8H6z"/>
				</svg>
				<h1 class="text-lg font-bold text-gray-900 mt-4 mb-2">Menyiapkan Invoice...</h1>
				<p class="text-sm text-gray-500">Invoice donasi akan dibuka dalam dialog cetak.</p>
			</div>
		</div>
	{:else if error}
		<div class="max-w-lg mx-auto px-4 py-12 text-center">
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
				<svg class="w-16 h-16 text-red-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
				</svg>
				<h1 class="text-lg font-bold text-gray-900 mb-2">Invoice Tidak Tersedia</h1>
				<p class="text-sm text-gray-500 mb-4">{error}</p>
				<a href="/user/donations" class="text-sm font-semibold text-[#1a73e8] hover:underline">Kembali ke Riwayat Donasi</a>
			</div>
		</div>
	{:else}
		<div class="invoice-content">
			{@html invoiceHtml}
		</div>
	{/if}
</div>

<style>
	@media print {
		.invoice-content :global(.no-print) {
			display: none !important;
		}
	}
</style>
