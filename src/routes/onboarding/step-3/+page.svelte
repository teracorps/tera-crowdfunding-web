<script lang="ts">
	let selectedPlan = $state('starter');
	let saving = $state(false);
	let saved = $state(false);

	const plans = [
		{
			id: 'starter',
			name: 'Starter',
			price: 'Gratis',
			period: 'selamanya',
			features: [
				'5 campaign aktif',
				'Branding dasar',
				'Statistik donasi',
				'Donasi via transfer bank',
			],
			highlight: false,
		},
		{
			id: 'business',
			name: 'Business',
			price: 'Rp 299.000',
			period: '/bulan',
			features: [
				'Unlimited campaign',
				'White-label branding',
				'Custom domain',
				'API akses',
				'Prioritas support',
				'Integrasi payment gateway',
			],
			highlight: true,
		},
		{
			id: 'enterprise',
			name: 'Enterprise',
			price: 'Custom',
			period: '',
			features: [
				'Semua fitur Business',
				'Dedicated server',
				'On-premise option',
				'Dedicated support',
				'SLA guarantee',
			],
			highlight: false,
		},
	];

	async function confirmPlan() {
		saving = true;
		try {
			const res = await fetch('/api/org/onboarding-progress', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					step: 'payment',
					completed: true,
				}),
			});
			const data = await res.json();
			if (data.success) {
				saved = true;
			}
		} catch {} finally {
			saving = false;
		}
	}
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
	<!-- Progress -->
	<div class="flex items-center justify-center gap-2 mb-8">
		<div class="flex items-center gap-1">
			<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-green-500">✓</span>
			<span class="text-sm font-medium ml-1 text-green-600">Subdomain</span>
		</div>
		<div class="w-12 h-0.5 bg-green-500"></div>
		<div class="flex items-center gap-1">
			<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-green-500">✓</span>
			<span class="text-sm font-medium ml-1 text-green-600">Branding</span>
		</div>
		<div class="w-12 h-0.5 bg-green-500"></div>
		<div class="flex items-center gap-1">
			<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style="background-color: var(--color-primary, #14B88C);">3</span>
			<span class="text-sm font-medium ml-1" style="color: var(--color-primary, #14B88C);">Paket</span>
		</div>
		<div class="w-12 h-0.5 bg-gray-200"></div>
		<div class="flex items-center gap-1">
			<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-400">4</span>
			<span class="text-sm font-medium ml-1 text-gray-400">Selesai</span>
		</div>
	</div>

	<h1 class="text-2xl font-bold mb-2" style="color: var(--color-text-primary, #111827);">Pilih Paket Langganan</h1>
	<p class="mb-8" style="color: var(--color-text-secondary, #6b7280);">
		Mulai dengan paket Starter gratis, atau upgrade untuk fitur yang lebih lengkap.
	</p>

	{#if !saved}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
			{#each plans as plan}
				<button
					onclick={() => selectedPlan = plan.id}
					class="relative rounded-xl border-2 p-6 text-left transition-all cursor-pointer"
					class:border-[var(--color-primary,#14B88C)]={selectedPlan === plan.id}
					class:shadow-md={selectedPlan === plan.id}
					class:border-gray-200={selectedPlan !== plan.id}
				>
					{#if plan.highlight}
						<div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white" style="background-color: var(--color-primary, #14B88C);">
							POPULER
						</div>
					{/if}
					<h3 class="font-bold text-lg mb-1" style="color: var(--color-text-primary, #111827);">{plan.name}</h3>
					<div class="mb-4">
						<span class="text-2xl font-bold" style="color: var(--color-text-primary, #111827);">{plan.price}</span>
						<span class="text-sm text-gray-500">{plan.period}</span>
					</div>
					<ul class="space-y-2">
						{#each plan.features as feature}
							<li class="flex items-start gap-2 text-sm" style="color: var(--color-text-secondary, #6b7280);">
								<svg class="w-4 h-4 mt-0.5 flex-shrink-0" style="color: var(--color-primary, #14B88C);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
								</svg>
								{feature}
							</li>
						{/each}
					</ul>
				</button>
			{/each}
		</div>

		<div class="flex items-center justify-between pt-6 border-t border-gray-200">
			<a href="/onboarding/step-2" class="text-sm px-4 py-2 text-gray-500 hover:text-gray-700">
				← Kembali
			</a>
			<button
				onclick={confirmPlan}
				disabled={saving}
				class="px-6 py-2.5 rounded-lg text-white font-medium text-sm transition-all disabled:opacity-50"
				style="background-color: var(--color-primary, #14B88C);"
			>
				{saving ? 'Menyimpan...' : 'Pilih & Lanjutkan →'}
			</button>
		</div>
	{:else}
		<div class="text-center py-12">
			<div class="text-4xl mb-4">🚀</div>
			<h2 class="text-xl font-bold mb-2" style="color: var(--color-text-primary, #111827);">Paket dipilih!</h2>
			<p class="mb-6" style="color: var(--color-text-secondary, #6b7280);">
				{selectedPlan === 'starter' ? 'Kamu bisa upgrade kapan saja.' : 'Tim kami akan menghubungi untuk payment.'}
			</p>
			<a
				href="/onboarding/step-4"
				class="inline-block px-6 py-2.5 rounded-lg text-white font-medium text-sm"
				style="background-color: var(--color-primary, #14B88C);"
			>
				Lanjut →
			</a>
		</div>
	{/if}
</div>
