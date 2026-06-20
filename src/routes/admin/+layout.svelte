<script lang="ts">
	import type { LayoutData } from './$types';

	let { data, children } = $props();
	let { session, tenant } = data as LayoutData;

	// Redirect to login if not authenticated
	$effect(() => {
		if (!session) {
			window.location.href = '/auth/masuk?redirect=/admin';
		}
	});

	let activeTab = $state('overview');

	const tabs = [
		{ id: 'overview', label: 'Ringkasan', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
		{ id: 'campaigns', label: 'Campaign', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
		{ id: 'donations', label: 'Donasi', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z' },
		{ id: 'settings', label: 'Pengaturan', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
	];
</script>

<svelte:head>
	<title>Admin Dashboard - Terabisa</title>
</svelte:head>

{#if !session}
	<div class="flex items-center justify-center min-h-[60vh]">
		<div class="text-center">
			<div class="w-8 h-8 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
			<p class="text-sm text-gray-500">Mengalihkan ke halaman masuk...</p>
		</div>
	</div>
{:else}
	<!-- Admin Header -->
	<div class="bg-[#1a1a2e] text-white">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-xl font-bold">Admin Dashboard</h1>
					<p class="text-sm text-gray-400 mt-0.5">{tenant?.name || 'Terabisa'} • {tenant?.subdomain || ''}</p>
				</div>
				<a href="/" class="text-xs text-gray-400 hover:text-white transition-colors">
					&larr; Kembali
				</a>
			</div>
		</div>
	</div>

	<div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
		<!-- Tab Navigation -->
		<div class="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
			{#each tabs as tab}
				<button
					class="px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all {activeTab === tab.id
						? 'bg-white text-gray-900 shadow-sm'
						: 'text-gray-500 hover:text-gray-700'}"
					onclick={() => (activeTab = tab.id)}
				>
					{tab.label}
				</button>
			{/each}
		</div>

		<!-- Content -->
		{@render children()}
	</div>
{/if}
