<script lang="ts">
	interface Prayer {
		id: string;
		user: string;
		isAnonymous: boolean;
		timeAgo: string;
		campaignTitle: string;
		campaignSlug: string;
		prayer: string;
		aminCount: number;
	}

	interface Props {
		prayers?: Prayer[];
	}

	let { prayers }: Props = $props();

	const defaultPrayers: Prayer[] = [
		{
			id: '1',
			user: 'Anonim',
			isAnonymous: true,
			timeAgo: '5 menit lalu',
			campaignTitle: 'Darurat Kemanusiaan Sudan: Selamatkan Mereka',
			campaignSlug: '/campaign/sudan-emergency',
			prayer: 'Ya Allah, selamatkan saudara-saudara kami di Sudan dari kelaparan dan peperangan. Berikan mereka kekuatan dan pertolongan-Mu.',
			aminCount: 10,
		},
		{
			id: '2',
			user: 'Anonim',
			isAnonymous: true,
			timeAgo: '6 menit lalu',
			campaignTitle: 'Bantu Anak Yatim Dapatkan Pendidikan',
			campaignSlug: '/campaign/yatim-pendidikan',
			prayer: 'Semoga tercapai cita-cita mereka. Aamiin Ya Rabbal Alamin.',
			aminCount: 6,
		},
		{
			id: '3',
			user: 'Siti Nurhaliza',
			isAnonymous: false,
			timeAgo: '12 menit lalu',
			campaignTitle: 'Bantu Korban Banjir Jakarta',
			campaignSlug: '/campaign/banjir-jakarta',
			prayer: 'Semoga Allah mudahkan urusan saudara kita yang terkena musibah banjir. Aamiin.',
			aminCount: 15,
		},
		{
			id: '4',
			user: 'Anonim',
			isAnonymous: true,
			timeAgo: '20 menit lalu',
			campaignTitle: 'Sedekah Beras untuk Santri Penghafal Quran',
			campaignSlug: '/campaign/sedekah-beras-santri',
			prayer: 'Ya Allah, berkahi setiap butir beras yang kami sedekahkan untuk para penghafal Al-Quran.',
			aminCount: 8,
		},
		{
			id: '5',
			user: 'Ahmad Rizki',
			isAnonymous: false,
			timeAgo: '25 menit lalu',
			campaignTitle: 'Bantu Biaya Operasi Balita Sakit Jantung',
			campaignSlug: '/campaign/operasi-jantung-balita',
			prayer: 'Semoga lekas sembuh dan sehat selalu. Aamiin.',
			aminCount: 22,
		},
		{
			id: '6',
			user: 'Anonim',
			isAnonymous: true,
			timeAgo: '30 menit lalu',
			campaignTitle: 'Bantuan Medis untuk Palestina',
			campaignSlug: '/campaign/palestina-medis',
			prayer: 'Ya Allah, angkatlah kesulitan dari saudara-saudara kami di Palestina. Berikan mereka kesabaran dan kemenangan.',
			aminCount: 18,
		},
	];

	const items = $derived(prayers || defaultPrayers);

	let scrollContainer: HTMLDivElement | undefined = $state(undefined);

	function scrollRight() {
		if (!scrollContainer) return;
		scrollContainer.scrollBy({ left: 340, behavior: 'smooth' });
	}

	function scrollLeft() {
		if (!scrollContainer) return;
		scrollContainer.scrollBy({ left: -340, behavior: 'smooth' });
	}
</script>

<section class="py-12 px-4 sm:px-6 bg-white">
	<div class="max-w-7xl mx-auto">
		<!-- Section Header -->
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-xl md:text-2xl font-bold text-gray-900">
				Doa-doa <span class="text-primary">#OrangBaik</span>
			</h2>
			<a href="/doa" class="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
				Lihat semua →
			</a>
		</div>

		<div class="relative">
			<!-- Scroll Container -->
			<div
				bind:this={scrollContainer}
				class="scroll-container gap-4 pb-2"
			>
				<!-- Left decorative illustration -->
				<div class="flex-shrink-0 w-48 md:w-56 flex flex-col items-center justify-center">
					<div class="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-pink-100 via-pink-50 to-pink-200 flex items-center justify-center relative">
						<div class="text-6xl md:text-7xl">🤲</div>
						<div class="absolute -bottom-1 left-1/2 -translate-x-1/2">
							<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-400 text-white text-xs font-semibold">
								<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
								Aamiin
							</span>
						</div>
					</div>
					<p class="text-sm text-gray-500 mt-3 text-center font-medium">
						Doakan kebaikan<br/>sesama #OrangBaik
					</p>
				</div>

				<!-- Prayer Cards -->
				{#each items as prayer}
					<div class="flex-shrink-0 w-72 md:w-80 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
						<!-- User info -->
						<div class="flex items-center gap-2 mb-3">
							<div class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
								<svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
							</div>
							<div>
								<span class="text-sm font-medium text-gray-700">{prayer.user}</span>
								<span class="text-xs text-gray-400 ml-1.5">{prayer.timeAgo}</span>
							</div>
						</div>

						<!-- Campaign link -->
						<a
							href={prayer.campaignSlug}
							class="block text-xs text-primary font-medium truncate mb-2 hover:underline"
						>
							{prayer.campaignTitle}
						</a>

						<!-- Prayer text -->
						<p class="text-sm text-gray-700 leading-relaxed mb-4">
							"{prayer.prayer}"
						</p>

						<!-- Stats & Aamiin -->
						<div class="flex items-center justify-between pt-3 border-t border-gray-50">
							<span class="text-xs text-gray-500">
								<svg class="w-3.5 h-3.5 inline mr-1 text-pink-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
								{prayer.aminCount} orang mengaminkan doa ini
							</span>
							<button class="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:bg-pink-50 hover:text-pink-500 transition-all">
								<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
								Aamiin
							</button>
						</div>
					</div>
				{/each}
			</div>

			<!-- Scroll arrows -->
			<div class="hidden md:flex justify-end gap-2 mt-4">
				<button
					onclick={scrollLeft}
					class="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
				>
					<svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
				</button>
				<button
					onclick={scrollRight}
					class="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
				>
					<svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
				</button>
			</div>
		</div>
	</div>
</section>
