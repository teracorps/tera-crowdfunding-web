<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { submitDonation, formatRupiah } from '$lib/api';
	import type { Campaign } from '$lib/types';
	import type { DonationRequest } from '$lib/types';

	let { data } = $props();

	let campaign = $state<Campaign | null>(data.campaign || null);
	let loading = $state(data.campaign ? false : true);

	// Form state
	let selectedAmount = $state(100000);
	let customAmount = $state('');
	let salutation = $state('Bapak');
	let fullName = $state('');
	let isAnonymous = $state(false);
	let paymentMethod = $state('snap');
	let paymentMethodLabel = $state('Pilih');
	let paymentMethodIcon = $state('🏦');
	let submitStatus = $state<'idle' | 'loading' | 'error'>('idle');
	let submitMessage = $state('');
	let showPaymentPicker = $state(false);

	const presetAmounts = [
		{ value: 100000, label: 'Rp 100rb', sublabel: 'sering dipilih' },
		{ value: 250000, label: 'Rp 250rb', sublabel: '' },
		{ value: 500000, label: 'Rp 500rb', sublabel: '' },
		{ value: 1000000, label: 'Rp 1jt', sublabel: '' },
		{ label: 'Nominal', sublabel: 'lainnya', custom: true },
	];

	const paymentMethods = [
		{ id: 'bca_va', label: 'BCA Virtual Account', icon: '🏦' },
		{ id: 'mandiri_va', label: 'Mandiri Virtual Account', icon: '🏦' },
		{ id: 'bni_va', label: 'BNI Virtual Account', icon: '🏦' },
		{ id: 'bri_va', label: 'BRI Virtual Account', icon: '🏦' },
		{ id: 'gopay', label: 'GoPay', icon: '📱' },
		{ id: 'ovo', label: 'OVO', icon: '📱' },
		{ id: 'dana', label: 'DANA', icon: '📱' },
		{ id: 'shopeepay', label: 'ShopeePay', icon: '📱' },
	];

	const displayAmount = $derived(
		customAmount ? parseInt(customAmount.replace(/\D/g, '')) || 0 : selectedAmount
	);

	const salutations = ['Bapak', 'Ibu', 'Kak'];

	function selectPreset(preset: typeof presetAmounts[0]) {
		if (preset.custom) {
			customAmount = '100000';
			selectedAmount = 0;
		} else {
			selectedAmount = preset.value;
			customAmount = '';
		}
	}

	function formatCurrencyInput(val: string) {
		const nums = val.replace(/\D/g, '');
		if (!nums) { customAmount = ''; return; }
		customAmount = nums;
	}

	async function handleSubmit() {
		if (!campaign || !fullName.trim()) return;
		const amount = displayAmount;
		if (amount < 1000) return;

		submitStatus = 'loading';
		try {
			const request: DonationRequest = {
				campaign_id: campaign.id,
				amount,
				name: fullName.trim(),
				email: '',
				phone: '',
				message: '',
				is_anonymous: isAnonymous,
				payment_method: 'snap',
			};
			const result = await submitDonation(request);
			if (result.snap_token) {
				if (typeof window.snap !== 'undefined') {
					const donationId = result.id;
					window.snap.pay(result.snap_token, {
						onSuccess: () => {
							window.location.href = `/donasi/selesai/${donationId}?status=success`;
						},
						onPending: () => {
							window.location.href = `/donasi/selesai/${donationId}?status=pending`;
						},
						onError: () => {
							window.location.href = `/donasi/selesai/${donationId}?status=error`;
						},
						onClose: () => {
							submitStatus = 'idle';
						},
					});
				} else {
					window.open(result.redirect_url, '_blank');
				}
			} else if (result.redirect_url) {
				window.location.href = result.redirect_url;
			}
		} catch (e: any) {
			submitStatus = 'error';
			submitMessage = e.message || 'Gagal memproses donasi';
		}
	}
</script>

<svelte:head>
	<title>{campaign ? `Donasi - ${campaign.title}` : 'Donasi - Terabisa'}</title>
	<meta name="description" content="Donasi sekarang untuk {campaign?.title || 'campaign ini'}" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="sticky top-0 z-30 bg-white border-b border-gray-100">
		<div class="max-w-2xl mx-auto px-4">
			<div class="flex items-center h-14 gap-3">
				<button onclick={() => history.back()} class="p-1 -ml-1 rounded-lg hover:bg-gray-100 transition-colors">
					<svg class="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
					</svg>
				</button>
				<h1 class="text-sm font-semibold text-gray-900 truncate">
					{campaign?.title || 'Donasi'}
				</h1>
			</div>
		</div>
	</div>

	<div class="max-w-2xl mx-auto px-4 pb-32 pt-4">
		{#if campaign}
			<!-- Campaign Summary -->
			<div class="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
				<div class="flex gap-4 p-4">
					<div class="w-24 h-24 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
						{#if campaign.cover_image}
							<img src={campaign.cover_image} alt="" class="w-full h-full object-cover" />
						{:else}
							<div class="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
								<span class="text-white text-lg font-bold">{campaign.title?.charAt(0) || '?'}</span>
							</div>
						{/if}
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-xs text-gray-500 mb-1">Anda akan berdonasi dalam program:</p>
						<h2 class="text-sm font-bold text-gray-900 line-clamp-2">{campaign.title}</h2>
						<div class="flex items-center gap-2 mt-2">
							<span class="text-xs font-medium text-gray-500">
								{formatRupiah(campaign.raised_amount)} terkumpul
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Amount Selection -->
			<div class="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
				<label class="text-sm font-semibold text-gray-900 mb-3 block">
					Pilih Nominal Donasi
				</label>
				<div class="grid grid-cols-2 gap-3">
					{#each presetAmounts as preset}
						<button
							class="relative rounded-xl border-2 p-4 text-left transition-all"
							class:border-primary={!preset.custom && selectedAmount === preset.value}
							class:border-gray-200={preset.custom || selectedAmount !== preset.value}
							class:bg-primary-light={!preset.custom && selectedAmount === preset.value}
							onclick={() => selectPreset(preset)}
						>
							{#if !preset.custom && selectedAmount === preset.value}
								<div class="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
									<svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
									</svg>
								</div>
							{/if}
							<div class="text-sm font-bold text-gray-900">{preset.label}</div>
							{#if preset.sublabel}
								<div class="text-[10px] text-primary font-medium mt-0.5">{preset.sublabel}</div>
							{/if}
							{#if preset.custom}
								<div class="text-[10px] text-gray-400 mt-0.5">{preset.sublabel}</div>
							{/if}
						</button>
					{/each}
				</div>

				<!-- Custom Amount -->
				<div class="mt-3">
					<div class="relative">
						<span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">Rp</span>
						<input
							type="text"
							inputmode="numeric"
							placeholder="Masukkan nominal"
							value={customAmount ? parseInt(customAmount).toLocaleString('id-ID') : ''}
							oninput={(e) => formatCurrencyInput((e.target as HTMLInputElement).value)}
							class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
				</div>
			</div>

			<!-- Payment Method -->
			<div class="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
				<label class="text-sm font-semibold text-gray-900 mb-3 block">
					Metode Pembayaran
				</label>
				<button
					class="w-full flex items-center justify-between px-4 py-3.5 bg-blue-50 rounded-xl"
					onclick={() => (showPaymentPicker = true)}
				>
					<div class="flex items-center gap-3">
						<span class="text-xl">{paymentMethodIcon}</span>
						<span class="text-sm font-medium text-gray-700">
							{#if paymentMethod === 'snap'}
								Pilih Metode Pembayaran
							{:else}
								{paymentMethodLabel}
							{/if}
						</span>
					</div>
					<svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
					</svg>
				</button>
			</div>

			<!-- Donor Info -->
			<div class="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
				<label class="text-sm font-semibold text-gray-900 mb-4 block">
					Data Donatur
				</label>

				<!-- Salutation -->
				<div class="flex gap-2 mb-4">
					{#each salutations as s}
						<button
							class="px-5 py-2 rounded-xl text-sm font-medium transition-all border"
							class:bg-primary={salutation === s}
							class:text-white={salutation === s}
							class:border-primary={salutation === s}
							class:bg-white={salutation !== s}
							class:text-gray-700={salutation !== s}
							class:border-gray-200={salutation !== s}
							onclick={() => (salutation = s)}
						>
							{s}
						</button>
					{/each}
				</div>

				<!-- Name -->
				<div class="mb-4">
					<input
						type="text"
						placeholder="Nama Lengkap"
						class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						bind:value={fullName}
					/>
				</div>

				<!-- Anonymous Toggle -->
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-900">Sembunyikan nama saya</p>
						<p class="text-xs text-gray-400">(Orang Baik)</p>
					</div>
					<button
						class="relative w-12 h-7 rounded-full transition-colors"
						class:bg-primary={isAnonymous}
						class:bg-gray-300={!isAnonymous}
						onclick={() => (isAnonymous = !isAnonymous)}
					>
						<div
							class="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all"
							class:left-1={!isAnonymous}
							class:left-6={isAnonymous}
						></div>
					</button>
				</div>
			</div>

			{/if}

		<!-- Status -->
		{#if submitStatus === 'error'}
			<div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 mb-4">
				{submitMessage}
			</div>
		{/if}
	</div>

	<!-- Bottom CTA -->
	<div class="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 p-4">
		<div class="max-w-2xl mx-auto">
			<button
				class="w-full py-3.5 rounded-2xl text-white font-bold text-base transition-all"
				class:bg-primary={!submitStatus || submitStatus === 'idle'}
				class:bg-gray-400={submitStatus === 'loading'}
				class:opacity-50={!fullName.trim() || displayAmount < 1000}
				disabled={!fullName.trim() || displayAmount < 1000 || submitStatus === 'loading'}
				onclick={handleSubmit}
			>
				{#if submitStatus === 'loading'}
					Memproses...
				{:else}
					Donasi - Rp {displayAmount.toLocaleString('id-ID')}
				{/if}
			</button>
		</div>
	</div>
</div>

<!-- Payment Method Picker Modal -->
{#if showPaymentPicker}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center"
		onclick={() => (showPaymentPicker = false)}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl p-5"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-base font-bold text-gray-900">Metode Pembayaran</h3>
				<button class="p-1 hover:bg-gray-100 rounded-lg" onclick={() => (showPaymentPicker = false)}>
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
				</button>
			</div>
			<div class="space-y-1">
				{#each paymentMethods as pm}
					<button
						class="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
						class:bg-blue-50={paymentMethod === pm.id}
						onclick={() => {
							paymentMethod = pm.id;
							paymentMethodLabel = pm.label;
							paymentMethodIcon = pm.icon;
							showPaymentPicker = false;
						}}
					>
						<span class="text-xl">{pm.icon}</span>
						<span class="text-sm font-medium text-gray-700">{pm.label}</span>
						{#if paymentMethod === pm.id}
							<svg class="w-5 h-5 text-primary ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
							</svg>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}
