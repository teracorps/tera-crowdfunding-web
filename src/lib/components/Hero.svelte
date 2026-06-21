<script lang="ts">
	import { formatRupiah, formatNumber } from '$lib/api';
	import type { FundingStats } from '$lib/types';

	interface Props {
		stats?: FundingStats;
	}

	let { stats }: Props = $props();
</script>

<!-- Hero Section - Kitabisa style -->
<section class="hero-gradient relative overflow-hidden">
	<!-- Decorative circles -->
	<div class="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
	<div class="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 blur-2xl"></div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 md:pt-36 md:pb-24">
		<div class="grid md:grid-cols-2 gap-10 items-center">
			<!-- Left: Text -->
			<div class="text-center md:text-left">
				<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
					Platform Donasi Terpercaya
				</div>

				<h1 class="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
					Galang Dana & Donasi <br/>
					<span class="text-accent">Online</span>
				</h1>
				<p class="text-white/80 text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0">
					Platform crowdfunding terpercaya untuk galang dana, donasi online, 
					zakat, wakaf, dan saling membantu sesama.
				</p>

				<!-- CTA Buttons -->
				<div class="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
					<a
						href="/campaigns"
						class="px-8 py-3 bg-white text-primary font-semibold rounded-full text-sm hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
					>
						Mulai Donasi
					</a>
					<a
						href="/galang-dana"
						class="px-8 py-3 bg-secondary text-white font-semibold rounded-full text-sm hover:bg-[#e0663a] transition-all shadow-lg hover:shadow-xl"
					>
						Galang Dana
					</a>
				</div>

				<!-- Stats -->
				{#if stats}
					<div class="flex flex-wrap gap-8 mt-10 justify-center md:justify-start">
						<div class="text-center">
							<div class="stat-number text-white !text-2xl md:!text-3xl !bg-none !text-white">
								Rp{formatNumber(stats.total_raised)}
							</div>
							<div class="text-white/70 text-xs mt-1">Total Donasi Terkumpul</div>
						</div>
						<div class="text-center">
							<div class="stat-number text-white !text-2xl md:!text-3xl !bg-none !text-white">
								{formatNumber(stats.total_donors)}+
							</div>
							<div class="text-white/70 text-xs mt-1">Donatur</div>
						</div>
						<div class="text-center">
							<div class="stat-number text-white !text-2xl md:!text-3xl !bg-none !text-white">
								{formatNumber(stats.total_campaigns)}+
							</div>
							<div class="text-white/70 text-xs mt-1">Program</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Right: Illustration -->
			<div class="hidden md:flex justify-center">
				<div class="relative w-80 h-80">
					<!-- Floating cards illustration -->
					<div class="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-2xl backdrop-blur border border-white/20 p-4">
						<div class="flex items-center gap-2 mb-3">
							<div class="w-8 h-8 rounded-full bg-white/20"></div>
							<div class="text-white text-xs">Donasi Terkumpul</div>
						</div>
						<div class="text-white text-2xl font-bold">Rp12,5 Juta</div>
						<div class="progress-bar mt-3 bg-white/20">
							<div class="progress-bar-fill !bg-white" style="width: 78%"></div>
						</div>
						<div class="text-white/60 text-xs mt-2">78% dari target</div>
					</div>
					<div class="absolute bottom-10 left-0 w-40 h-32 bg-secondary/20 rounded-2xl backdrop-blur border border-white/20 p-3">
						<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
						<div class="text-white text-xs mt-2">1.234 Donatur</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Wave divider -->
	<div class="absolute bottom-0 left-0 right-0">
		<svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="w-full h-12">
			<path d="M0 60V30C240 0 480 60 720 30C960 0 1200 60 1440 30V60H0Z" fill="white"/>
		</svg>
	</div>
</section>
