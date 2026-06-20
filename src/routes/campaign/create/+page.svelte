<script lang="ts">
	let currentStep = $state(1);
	const totalSteps = 3;

	let formData = $state({
		title: '',
		category: '',
		targetAmount: '',
		endDate: '',
		coverImage: null as File | null,
		coverPreview: '',
		story: '',
		beneficiaryName: '',
		beneficiaryRelation: '',
		phone: '',
		email: '',
	});

	let errors = $state<Record<string, string>>({});

	const categories = [
		{ value: 'medis', label: 'Medis & Kesehatan' },
		{ value: 'bencana', label: 'Bencana Alam' },
		{ value: 'pendidikan', label: 'Pendidikan' },
		{ value: 'sosial', label: 'Sosial & Kemanusiaan' },
		{ value: 'hewan', label: 'Hewan & Lingkungan' },
		{ value: 'ibadah', label: 'Ibadah & Keagamaan' },
	];

	function validateStep(step: number): boolean {
		const newErrors: Record<string, string> = {};

		if (step === 1) {
			if (!formData.title.trim()) newErrors.title = 'Masukkan judul campaign';
			if (!formData.category) newErrors.category = 'Pilih kategori';
			if (!formData.targetAmount || Number(formData.targetAmount) < 10000)
				newErrors.targetAmount = 'Minimal target Rp10.000';
			if (!formData.endDate) newErrors.endDate = 'Pilih tanggal akhir';
		} else if (step === 2) {
			if (!formData.story.trim()) newErrors.story = 'Tulis cerita campaign';
			if (!formData.coverImage && !formData.coverPreview)
				newErrors.coverImage = 'Upload foto sampul';
		} else if (step === 3) {
			if (!formData.beneficiaryName.trim()) newErrors.beneficiaryName = 'Masukkan nama penerima manfaat';
			if (!formData.phone.trim()) newErrors.phone = 'Masukkan nomor telepon';
			if (!formData.email.trim()) newErrors.email = 'Masukkan email';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	function nextStep() {
		if (validateStep(currentStep)) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 1) currentStep--;
	}

	function handleFileUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			formData.coverImage = input.files[0];
			const reader = new FileReader();
			reader.onload = () => {
				formData.coverPreview = reader.result as string;
			};
			reader.readAsDataURL(input.files[0]);
		}
	}

	function formatRupiah(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
		}).format(amount);
	}

	function handleSubmit() {
		if (validateStep(currentStep)) {
			// TODO: Submit to API
			window.location.href = '/campaign/create/success';
		}
	}
</script>

<svelte:head>
	<title>Buat Galang Dana - Terabisa</title>
</svelte:head>

<!-- Header -->
<div class="bg-gradient-to-r from-[#1a73e8] to-[#1557b0]">
	<div class="max-w-2xl mx-auto px-4 sm:px-6 py-8 text-center">
		<h1 class="text-xl font-bold text-white">Buat Galang Dana</h1>
		<p class="text-sm text-blue-200 mt-1">Mulai campaign kebaikanmu sekarang</p>
	</div>
</div>

<div class="max-w-2xl mx-auto px-4 sm:px-6 -mt-4 pb-8">
	<div class="bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-gray-100 overflow-hidden">
		<!-- Steps Indicator -->
		<div class="flex items-center justify-center gap-2 px-4 sm:px-6 pt-6 pb-4">
			{#each Array(totalSteps) as _, i}
				{@const step = i + 1}
				<div class="flex items-center gap-2">
					<div
						class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors {step <=
						currentStep
							? 'bg-[#1a73e8] text-white'
							: 'bg-gray-100 text-gray-400'}"
					>
						{#if step < currentStep}
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
							</svg>
						{:else}
							{step}
						{/if}
					</div>
					<span class="text-xs font-medium {step <= currentStep ? 'text-[#1a73e8]' : 'text-gray-400'} hidden sm:inline">
						{step === 1 ? 'Informasi' : step === 2 ? 'Cerita' : 'Data Diri'}
					</span>
					{#if step < totalSteps}
						<div class="w-8 h-0.5 {step < currentStep ? 'bg-[#1a73e8]' : 'bg-gray-200'}"></div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Form -->
		<form class="px-4 sm:px-6 pb-6" onsubmit={(e) => { e.preventDefault(); currentStep === totalSteps ? handleSubmit() : nextStep(); }}>
			{#if currentStep === 1}
				<!-- Step 1: Info -->
				<div class="space-y-5">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1.5">Judul Campaign</label>
						<input
							type="text"
							bind:value={formData.title}
							placeholder="Misal: Bantu Biaya Operasi Balita"
							class="w-full px-4 py-3 border {errors.title ? 'border-red-300' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors"
						/>
						{#if errors.title}
							<p class="text-xs text-red-500 mt-1">{errors.title}</p>
						{/if}
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
						<select
							bind:value={formData.category}
							class="w-full px-4 py-3 border {errors.category ? 'border-red-300' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors bg-white appearance-none"
						>
							<option value="">Pilih kategori</option>
							{#each categories as cat}
								<option value={cat.value}>{cat.label}</option>
							{/each}
						</select>
						{#if errors.category}
							<p class="text-xs text-red-500 mt-1">{errors.category}</p>
						{/if}
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1.5">Target Dana</label>
							<div class="relative">
								<span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">Rp</span>
								<input
									type="number"
									bind:value={formData.targetAmount}
									placeholder="0"
									min="10000"
									class="w-full pl-10 pr-4 py-3 border {errors.targetAmount ? 'border-red-300' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors"
								/>
							</div>
							{#if errors.targetAmount}
								<p class="text-xs text-red-500 mt-1">{errors.targetAmount}</p>
							{/if}
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1.5">Batas Waktu</label>
							<input
								type="date"
								bind:value={formData.endDate}
								class="w-full px-4 py-3 border {errors.endDate ? 'border-red-300' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors"
							/>
							{#if errors.endDate}
								<p class="text-xs text-red-500 mt-1">{errors.endDate}</p>
							{/if}
						</div>
					</div>
				</div>

			{:else if currentStep === 2}
				<!-- Step 2: Story -->
				<div class="space-y-5">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1.5">Foto Sampul</label>
						<div
							class="border-2 border-dashed {errors.coverImage ? 'border-red-300' : 'border-gray-200'} rounded-xl p-6 text-center hover:border-[#1a73e8] transition-colors cursor-pointer"
							onclick={() => document.getElementById('cover-upload')?.click()}
							role="button"
							tabindex="0"
							onkeydown={(e) => e.key === 'Enter' && document.getElementById('cover-upload')?.click()}
						>
							{#if formData.coverPreview}
								<img src={formData.coverPreview} alt="Preview" class="max-h-40 mx-auto rounded-lg object-cover" />
								<p class="text-xs text-gray-500 mt-2">Klik untuk ganti foto</p>
							{:else}
								<svg class="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
								</svg>
								<p class="text-sm text-gray-500">Klik untuk upload foto sampul</p>
								<p class="text-xs text-gray-400 mt-1">Maks 5MB, format JPG/PNG</p>
							{/if}
							<input
								id="cover-upload"
								type="file"
								accept="image/*"
								class="hidden"
								onchange={handleFileUpload}
							/>
						</div>
						{#if errors.coverImage}
							<p class="text-xs text-red-500 mt-1">{errors.coverImage}</p>
						{/if}
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1.5">Cerita Campaign</label>
						<textarea
							bind:value={formData.story}
							rows="8"
							placeholder="Ceritakan tujuan campaignmu, siapa yang akan dibantu, dan mengapa mereka membutuhkan bantuan..."
							class="w-full px-4 py-3 border {errors.story ? 'border-red-300' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors resize-y"
						></textarea>
						{#if errors.story}
							<p class="text-xs text-red-500 mt-1">{errors.story}</p>
						{/if}
						<p class="text-xs text-gray-400 mt-1">{formData.story.length} karakter</p>
					</div>
				</div>

			{:else if currentStep === 3}
				<!-- Step 3: Personal Data -->
				<div class="space-y-5">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Penerima Manfaat</label>
						<input
							type="text"
							bind:value={formData.beneficiaryName}
							placeholder="Nama orang yang akan dibantu"
							class="w-full px-4 py-3 border {errors.beneficiaryName ? 'border-red-300' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors"
						/>
						{#if errors.beneficiaryName}
							<p class="text-xs text-red-500 mt-1">{errors.beneficiaryName}</p>
						{/if}
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1.5">Hubungan dengan Penerima</label>
						<select
							bind:value={formData.beneficiaryRelation}
							class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors bg-white"
						>
							<option value="">Pilih hubungan</option>
							<option value="diri-sendiri">Diri Sendiri</option>
							<option value="keluarga">Keluarga</option>
							<option value="teman">Teman</option>
							<option value="komunitas">Komunitas / Organisasi</option>
							<option value="lainnya">Lainnya</option>
						</select>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1.5">No. Telepon</label>
							<input
								type="tel"
								bind:value={formData.phone}
								placeholder="08xxxx"
								class="w-full px-4 py-3 border {errors.phone ? 'border-red-300' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors"
							/>
							{#if errors.phone}
								<p class="text-xs text-red-500 mt-1">{errors.phone}</p>
							{/if}
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
							<input
								type="email"
								bind:value={formData.email}
								placeholder="email@contoh.com"
								class="w-full px-4 py-3 border {errors.email ? 'border-red-300' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors"
							/>
							{#if errors.email}
								<p class="text-xs text-red-500 mt-1">{errors.email}</p>
							{/if}
						</div>
					</div>
				</div>
			{/if}

			<!-- Actions -->
			<div class="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
				{#if currentStep > 1}
					<button
						type="button"
						onclick={prevStep}
						class="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
					>
						← Kembali
					</button>
				{:else}
					<div></div>
				{/if}

				<button
					type="submit"
					class="px-8 py-2.5 text-sm font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full shadow-sm transition-colors"
				>
					{currentStep === totalSteps ? 'Ajukan Campaign' : 'Lanjut →'}
				</button>
			</div>
		</form>
	</div>
</div>
