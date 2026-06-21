<script lang="ts">
	import { formatNumber } from '$lib/api';
	import type { FundingStats } from '$lib/types';

	interface Props {
		stats?: FundingStats;
	}

	let { stats }: Props = $props();

	const defaultStats: FundingStats = {
		total_campaigns: 15000,
		total_donations: 2500000,
		total_raised: 350000000000,
		total_donors: 1800000,
	};
</script>

<section class="py-16 bg-bg-section px-4 sm:px-6">
	<div class="max-w-7xl mx-auto">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
			<!-- Total Donasi -->
			<div class="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
				<div class="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mx-auto mb-3">
					<svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
					</svg>
				</div>
				<div class="stat-number text-2xl">
					Rp{formatNumber(stats?.total_raised || defaultStats.total_raised)}
				</div>
				<div class="text-gray-500 text-sm mt-1">Total Donasi Terkumpul</div>
			</div>

			<!-- Total Donatur -->
			<div class="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
				<div class="w-12 h-12 rounded-xl bg-[#fff0ea] flex items-center justify-center mx-auto mb-3">
					<svg class="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
					</svg>
				</div>
				<div class="stat-number text-2xl">
					{formatNumber(stats?.total_donors || defaultStats.total_donors)}
				</div>
				<div class="text-gray-500 text-sm mt-1">Total Donatur</div>
			</div>

			<!-- Total Program -->
			<div class="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
				<div class="w-12 h-12 rounded-xl bg-[#e8faf4] flex items-center justify-center mx-auto mb-3">
					<svg class="w-6 h-6 text--primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
					</svg>
				</div>
				<div class="stat-number text-2xl">
					{formatNumber(stats?.total_campaigns || defaultStats.total_campaigns)}+
				</div>
				<div class="text-gray-500 text-sm mt-1">Program Aktif</div>
			</div>

			<!-- Total Donasi Masuk -->
			<div class="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
				<div class="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mx-auto mb-3">
					<svg class="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
					</svg>
				</div>
				<div class="stat-number text-2xl">
					{formatNumber(Math.floor((stats?.total_donations || defaultStats.total_donations) / 1000000))} Juta
				</div>
				<div class="text-gray-500 text-sm mt-1">Donasi Masuk</div>
			</div>
		</div>
	</div>
</section>
