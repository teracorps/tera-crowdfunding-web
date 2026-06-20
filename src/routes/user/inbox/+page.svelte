<script lang="ts">
	interface InboxItem {
		id: string;
		type: 'donation' | 'update' | 'system' | 'reminder';
		title: string;
		message: string;
		campaignSlug?: string;
		time: string;
		isRead: boolean;
	}

	let inbox = $state<InboxItem[]>([
		{
			id: '1',
			type: 'donation',
			title: 'Donasi Diterima',
			message: 'Donasi Rp100.000 untuk "Darurat Kemanusiaan Sudan" telah berhasil diterima.',
			campaignSlug: '/campaign/sudan-emergency',
			time: '2 jam lalu',
			isRead: false,
		},
		{
			id: '2',
			type: 'update',
			title: 'Pembaruan Campaign',
			message: 'Campaign "Bantu Anak Yatim Dapatkan Pendidikan" telah mencapai 50% dari target!',
			campaignSlug: '/campaign/yatim-pendidikan',
			time: '5 jam lalu',
			isRead: false,
		},
		{
			id: '3',
			type: 'reminder',
			title: 'Pengingat Donasi',
			message: 'Jangan lupa donasi rutinmu untuk "Bantu Korban Banjir Jakarta" akan jatuh tempo besok.',
			campaignSlug: '/campaign/banjir-jakarta',
			time: '1 hari lalu',
			isRead: true,
		},
		{
			id: '4',
			type: 'system',
			title: 'Selamat Datang di Terabisa',
			message: 'Terima kasih telah bergabung! Mulai donasi dan sebarkan kebaikan.',
			time: '3 hari lalu',
			isRead: true,
		},
	]);

	const typeIcons: Record<string, string> = {
		donation: `<svg class="w-5 h-5 text-[#14B88C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
		update: `<svg class="w-5 h-5 text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>`,
		reminder: `<svg class="w-5 h-5 text-[#FF784B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>`,
		system: `<svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
	};

	function markAllRead() {
		inbox = inbox.map((item) => ({ ...item, isRead: true }));
	}

	function toggleRead(id: string) {
		inbox = inbox.map((item) => (item.id === id ? { ...item, isRead: !item.isRead } : item));
	}

	let unreadCount = $derived(inbox.filter((i) => !i.isRead).length);
</script>

<svelte:head>
	<title>Inbox - Terabisa</title>
</svelte:head>

<!-- Header -->
<div class="bg-[#e8f0fe]">
	<div class="max-w-2xl mx-auto px-4 sm:px-6 py-8 text-center">
		<h1 class="text-xl font-bold text-gray-900">Inbox</h1>
		{#if unreadCount > 0}
			<p class="text-sm text-gray-500 mt-1">{unreadCount} belum dibaca</p>
		{/if}
	</div>
</div>

<div class="max-w-2xl mx-auto px-4 sm:px-6 -mt-4 pb-8">
	<div class="bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-gray-100 overflow-hidden">
		<!-- Header Actions -->
		<div class="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100">
			<span class="text-xs font-medium text-gray-500">Notifikasi</span>
			{#if unreadCount > 0}
				<button
					onclick={markAllRead}
					class="text-xs font-semibold text-[#1a73e8] hover:text-[#1557b0] transition-colors"
				>
					Tandai sudah dibaca
				</button>
			{/if}
		</div>

		<!-- Inbox List -->
		{#if inbox.length === 0}
			<div class="py-12 text-center">
				<svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
				</svg>
				<p class="text-sm text-gray-500">Kotak masuk kosong</p>
			</div>
		{:else}
			<div class="divide-y divide-gray-50">
				{#each inbox as item}
					<button
						onclick={() => toggleRead(item.id)}
						class="w-full text-left flex items-start gap-3 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors {!item
							.isRead ? 'bg-blue-50/30' : ''}"
					>
						<!-- Icon -->
						<div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 relative">
							{@html typeIcons[item.type] || typeIcons.system}
							{#if !item.isRead}
								<span class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#1a73e8] rounded-full border-2 border-white"></span>
							{/if}
						</div>

						<!-- Content -->
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2">
								<span class="text-sm font-medium {!item.isRead ? 'text-gray-900' : 'text-gray-600'}">
									{item.title}
								</span>
							</div>
							<p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.message}</p>
							<span class="text-[10px] text-gray-400 mt-1 block">{item.time}</span>
						</div>

						<!-- Arrow -->
						<svg class="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
						</svg>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
