<script lang="ts">
	import type { TenantBranding } from '$lib/types';

	interface Props {
		branding?: TenantBranding | null;
	}

	let { branding = null }: Props = $props();

	const year = new Date().getFullYear();
	const platformName = branding?.platformName ?? 'Terabisa';
	const initial = platformName.charAt(0).toUpperCase();
	const primaryColor = branding?.primaryColor ?? '#14B88C';
	const logoUrl = branding?.logoUrl ?? null;
	const logoTextUrl = branding?.logoTextUrl ?? null;
	const logoMode = branding?.logoMode ?? 'icon-text';
	const footerText = branding?.footerText ?? null;
	const socialLinks = branding?.socialLinks ?? [];
	const footerLinks = branding?.footerLinks ?? [];
</script>

<footer style="background-color: #0f172a;">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<!-- Brand -->
			<div class="md:col-span-1">
				<div class="flex items-center gap-2 mb-4">
					{#if logoMode === 'logo-text'}
						{#if logoTextUrl}
							<img src={logoTextUrl} alt={platformName} class="h-10 w-auto max-w-[200px] object-contain" />
						{:else if logoUrl}
							<img src={logoUrl} alt={platformName} class="h-10 w-auto max-w-[200px] object-contain" />
						{:else}
							<span class="font-bold text-xl text-white">{platformName}</span>
						{/if}
					{:else if logoMode === 'icon-text'}
						{#if logoUrl}
							<img src={logoUrl} alt={platformName} class="h-8 w-auto" />
						{:else}
							<div
								class="w-8 h-8 rounded-lg flex items-center justify-center"
								style="background-color: {primaryColor};"
							>
								<span class="text-white font-bold text-sm">{initial}</span>
							</div>
						{/if}
						<span class="font-bold text-xl text-white">{platformName}</span>
					{:else}
						<span class="font-bold text-xl text-white">{platformName}</span>
					{/if}
				</div>
				<p class="text-gray-400 text-sm leading-relaxed mb-4">
					{footerText || branding?.tagline || 'Platform crowdfunding terpercaya untuk galang dana, donasi online, dan saling membantu sesama.'}
				</p>
				{#if socialLinks.length > 0}
					<div class="flex gap-3">
						{#each socialLinks as link}
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								class="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:opacity-80 transition-opacity"
							>
								<span class="text-white text-xs font-medium">{link.platform.charAt(0).toUpperCase()}</span>
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Links -->
			<div>
				<h4 class="font-semibold text-white mb-4">Bantuan</h4>
				<ul class="space-y-2.5">
					<li><a href="/bantuan" class="text-gray-400 text-sm hover:text-white transition-colors">Pusat Bantuan</a></li>
					<li><a href="/syarat-ketentuan" class="text-gray-400 text-sm hover:text-white transition-colors">Syarat & Ketentuan</a></li>
					<li><a href="/kebijakan-privasi" class="text-gray-400 text-sm hover:text-white transition-colors">Kebijakan Privasi</a></li>
					<li><a href="/faq" class="text-gray-400 text-sm hover:text-white transition-colors">FAQ</a></li>
				</ul>
			</div>

			<div>
				<h4 class="font-semibold text-white mb-4">Jelajahi</h4>
				<ul class="space-y-2.5">
					<li><a href="/campaigns" class="text-gray-400 text-sm hover:text-white transition-colors">Semua Campaign</a></li>
					<li><a href="/campaigns?category=kesehatan" class="text-gray-400 text-sm hover:text-white transition-colors">Kesehatan</a></li>
					<li><a href="/campaigns?category=pendidikan" class="text-gray-400 text-sm hover:text-white transition-colors">Pendidikan</a></li>
					<li><a href="/campaigns?category=bencana-alam" class="text-gray-400 text-sm hover:text-white transition-colors">Bencana Alam</a></li>
				</ul>
			</div>

			{#if footerLinks.length > 0}
				<div>
					<h4 class="font-semibold text-white mb-4">Tautan</h4>
					<ul class="space-y-2.5">
						{#each footerLinks as link}
							<li>
								<a href={link.url} class="text-gray-400 text-sm hover:text-white transition-colors">
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>

		<!-- Divider -->
		<div class="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
			<p class="text-gray-500 text-xs">
				&copy; {year} {platformName}. All rights reserved.
			</p>
			<div class="flex items-center gap-4">
				<span class="text-gray-500 text-xs">Powered by Tera Platform</span>
			</div>
		</div>
	</div>
</footer>
