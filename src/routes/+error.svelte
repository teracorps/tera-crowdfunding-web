<script lang="ts">
	import { page } from '$app/stores';
	import { dev } from '$app/environment';

	const status = $derived($page.status);
	const error = $derived($page.error);

	const is404 = $derived(status === 404);

	const title = $derived(is404 ? '404 - Halaman Tidak Ditemukan' : '500 - Terjadi Kesalahan');

	const description = $derived(
		is404
			? 'Halaman yang Anda cari tidak tersedia atau telah dipindahkan. Periksa kembali URL atau navigasi ke halaman lain.'
			: 'Maaf, terjadi kesalahan pada server kami. Tim kami sedang menanganinya. Silakan coba beberapa saat lagi.'
	);
</script>

<svelte:head>
	<title>{title} — Terabisa</title>
</svelte:head>

<div class="error-page">
	<div class="error-container">
		<!-- Illustration -->
		<div class="illustration">
			{#if is404}
				<!-- 404 Illustration: Search/map with question mark -->
				<svg
					width="200"
					height="200"
					viewBox="0 0 200 200"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					role="img"
					aria-label="Ilustrasi halaman tidak ditemukan"
				>
					<circle cx="100" cy="100" r="85" fill="var(--color-primary-light, #e8f0fe)" />
					<circle cx="90" cy="85" r="35" stroke="var(--color-primary, #14B88C)" stroke-width="4" fill="none" />
					<line x1="115" y1="110" x2="140" y2="135" stroke="var(--color-primary, #14B88C)" stroke-width="4" stroke-linecap="round" />
					<!-- Question mark -->
					<text x="90" y="92" text-anchor="middle" dominant-baseline="central" font-size="36" font-weight="700" font-family="var(--font-family, Inter, sans-serif)" fill="var(--color-primary, #14B88C)">?</text>
					<!-- Dashed path -->
					<path d="M140 60 Q 170 60 170 90 Q 170 120 145 125" stroke="var(--color-text-muted, #94a3b8)" stroke-width="2" stroke-dasharray="4 4" fill="none" />
					<circle cx="145" cy="125" r="3" fill="var(--color-text-muted, #94a3b8)" />
				</svg>
			{:else}
				<!-- 500 Illustration: Server/gear with warning sign -->
				<svg
					width="200"
					height="200"
					viewBox="0 0 200 200"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					role="img"
					aria-label="Ilustrasi kesalahan server"
				>
					<circle cx="100" cy="100" r="85" fill="var(--color-red-light, #fef2f2)" />
					<!-- Server rack -->
					<rect x="65" y="55" width="70" height="90" rx="6" stroke="var(--color-red, #ef4444)" stroke-width="3" fill="none" />
					<line x1="75" y1="70" x2="125" y2="70" stroke="var(--color-red, #ef4444)" stroke-width="2" />
					<line x1="75" y1="80" x2="125" y2="80" stroke="var(--color-red, #ef4444)" stroke-width="2" />
					<line x1="75" y1="90" x2="115" y2="90" stroke="var(--color-red, #ef4444)" stroke-width="2" />
					<line x1="75" y1="100" x2="125" y2="100" stroke="var(--color-red, #ef4444)" stroke-width="2" />
					<line x1="75" y1="110" x2="120" y2="110" stroke="var(--color-red, #ef4444)" stroke-width="2" />
					<line x1="75" y1="120" x2="125" y2="120" stroke="var(--color-red, #ef4444)" stroke-width="2" />
					<line x1="75" y1="130" x2="125" y2="130" stroke="var(--color-red, #ef4444)" stroke-width="2" />
					<!-- Exclamation mark -->
					<circle cx="100" cy="145" r="3" fill="var(--color-red, #ef4444)" />
					<rect x="97" y="135" width="6" height="6" rx="1" fill="var(--color-red, #ef4444)" />
					<!-- Warning triangle -->
					<path d="M160 50 L175 80 L145 80 Z" stroke="var(--color-secondary, #FF784B)" stroke-width="2" fill="var(--color-accent-light, #fff9e8)" />
					<text x="160" y="76" text-anchor="middle" font-size="12" font-weight="700" fill="var(--color-secondary, #FF784B)">!</text>
				</svg>
			{/if}
		</div>

		<!-- Status Code Badge -->
		<div class="status-badge" class:status-404={is404} class:status-500={!is404}>
			{status}
		</div>

		<!-- Title -->
		<h1 class="title">{title}</h1>

		<!-- Description -->
		<p class="description">{description}</p>

		<!-- Error detail in dev mode -->
		{#if dev && error}
			<details class="error-details">
				<summary>Detail Kesalahan</summary>
				<pre>{error.message}</pre>
				{#if error.stack}
					<pre class="stack">{error.stack}</pre>
				{/if}
			</details>
		{/if}

		<!-- Actions -->
		<div class="actions">
			<a href="/" class="btn-primary">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
					<polyline points="9 22 9 12 15 12 15 22" />
				</svg>
				Kembali ke Beranda
			</a>
			<button onclick={() => window.location.reload()} class="btn-secondary">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
				</svg>
				Coba Lagi
			</button>
		</div>
	</div>
</div>

<style>
	.error-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem 1rem;
		background-color: var(--color-bg, #ffffff);
		font-family: var(--font-family, 'Inter', system-ui, -apple-system, sans-serif);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		max-width: 480px;
		width: 100%;
	}

	.illustration {
		margin-bottom: 1.5rem;
		opacity: 0.9;
	}

	.illustration svg {
		display: block;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 700;
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		margin-bottom: 1rem;
		letter-spacing: 0.05em;
	}

	.status-404 {
		background-color: var(--color-primary-light, #e8f0fe);
		color: var(--color-primary, #14B88C);
	}

	.status-500 {
		background-color: var(--color-red-light, #fef2f2);
		color: var(--color-red, #ef4444);
	}

	.title {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text-primary, #1a1a2e);
		margin: 0 0 0.75rem;
		line-height: 1.3;
	}

	.description {
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color-text-secondary, #64748b);
		margin: 0 0 1.5rem;
		max-width: 400px;
	}

	.error-details {
		width: 100%;
		text-align: left;
		margin-bottom: 1.5rem;
		background: #f8f9fa;
		border-radius: 8px;
		padding: 0.75rem;
		font-size: 0.8125rem;
	}

	.error-details summary {
		cursor: pointer;
		font-weight: 600;
		color: var(--color-text-secondary, #64748b);
		padding: 0.25rem 0;
	}

	.error-details pre {
		margin: 0.5rem 0 0;
		padding: 0.75rem;
		background: #1e1e2e;
		color: #cdd6f4;
		border-radius: 6px;
		overflow-x: auto;
		font-size: 0.75rem;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.error-details .stack {
		margin-top: 0.5rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
	}

	.btn-primary,
	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border-radius: 999px;
		font-size: 0.9375rem;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		border: none;
		transition: all 0.2s ease;
		line-height: 1;
	}

	.btn-primary {
		background: linear-gradient(
			135deg,
			var(--color-primary, #14B88C),
			color-mix(in srgb, var(--color-primary, #14B88C) 80%, #000)
		);
		color: white;
		box-shadow: 0 2px 8px color-mix(in srgb, var(--color-primary, #14B88C) 30%, transparent);
	}

	.btn-primary:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 16px color-mix(in srgb, var(--color-primary, #14B88C) 40%, transparent);
	}

	.btn-secondary {
		background: var(--color-bg-section, #f5f7fa);
		color: var(--color-text-primary, #1a1a2e);
		border: 1px solid #e5e7eb;
	}

	.btn-secondary:hover {
		background: #e9ecef;
		transform: translateY(-1px);
	}

	@media (max-width: 480px) {
		.title {
			font-size: 1.5rem;
		}

		.description {
			font-size: 0.9375rem;
		}

		.illustration svg {
			width: 160px;
			height: 160px;
		}

		.actions {
			flex-direction: column;
			width: 100%;
		}

		.btn-primary,
		.btn-secondary {
			justify-content: center;
			width: 100%;
		}
	}
</style>
