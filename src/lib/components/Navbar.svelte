<script lang="ts">
	import { config } from '$lib/config';

	interface Props {
		isScrolled: boolean;
	}

	let { isScrolled }: Props = $props();

	let mobileMenuOpen = $state(false);
	let searchQuery = $state('');
</script>

<nav
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
	class:glass={isScrolled}
	class:bg-white={isScrolled}
	class:shadow-sm={isScrolled}
	class:bg-transparent={!isScrolled}
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2">
				<div class="w-8 h-8 rounded-lg kitabisa-header flex items-center justify-center">
					<span class="text-white font-bold text-sm">T</span>
				</div>
				<span
					class="font-bold text-xl transition-colors"
					class:text-white={!isScrolled}
					class:text-gray-900={isScrolled}
				>
					Terabisa
				</span>
			</a>

			<!-- Desktop Nav -->
			<div class="hidden md:flex items-center gap-6">
				<div class="relative">
					<input
						type="text"
						placeholder="Coba cari 'Tolong menolong'"
						class="w-72 pl-10 pr-4 py-2 rounded-full text-sm border border-gray-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent"
						bind:value={searchQuery}
					/>
					<svg class="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
					</svg>
				</div>

				<a href="/campaigns" class="text-sm font-medium transition-colors" class:text-white={!isScrolled} class:text-gray-700={isScrolled}>
					Jelajahi
				</a>
				<a href="/tentang" class="text-sm font-medium transition-colors" class:text-white={!isScrolled} class:text-gray-700={isScrolled}>
					Tentang
				</a>

				<a
					href="/galang-dana"
					class="donate-btn text-sm !px-5 !py-2"
				>
					Mulai Galang Dana
				</a>
			</div>

			<!-- Mobile menu button -->
			<button
				class="md:hidden p-2 rounded-lg transition-colors"
				class:text-white={!isScrolled}
				class:text-gray-700={isScrolled}
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					{#if mobileMenuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
					{/if}
				</svg>
			</button>
		</div>

		<!-- Mobile menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden pb-4 space-y-3">
				<div class="relative">
					<input
						type="text"
						placeholder="Coba cari 'Tolong menolong'"
						class="w-full pl-10 pr-4 py-2.5 rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
						bind:value={searchQuery}
					/>
					<svg class="absolute left-3.5 top-3 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7-11-14 0 7 7 0 0114 0z"/>
					</svg>
				</div>
				<div class="flex flex-col gap-2">
					<a href="/campaigns" class="text-sm font-medium text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100">
						Jelajahi
					</a>
					<a href="/tentang" class="text-sm font-medium text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100">
						Tentang
					</a>
					<a href="/galang-dana" class="donate-btn text-sm text-center">
						Mulai Galang Dana
					</a>
				</div>
			</div>
		{/if}
	</div>
</nav>
