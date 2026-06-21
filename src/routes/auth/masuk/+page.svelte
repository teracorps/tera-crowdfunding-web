<script lang="ts">
	import { createClient } from '$lib/supabase';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let session = $derived(data?.session);

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	// Redirect if already logged in
	$effect(() => {
		if (session) {
			goto('/user');
		}
	});

	async function handleLogin(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const supabase = createClient();
			const { error: authError } = await supabase.auth.signInWithPassword({
				email: email.trim(),
				password,
			});

			if (authError) {
				error = authError.message === 'Invalid login credentials'
					? 'Email atau password salah'
					: authError.message;
				return;
			}

			goto('/user');
		} catch (err) {
			error = 'Terjadi kesalahan. Silakan coba lagi.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Masuk - Terabisa</title>
</svelte:head>

<div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
	<div class="w-full max-w-sm">
		<div class="text-center mb-8">
			<div class="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
				<svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
				</svg>
			</div>
			<h1 class="text-2xl font-bold text-gray-900">Masuk</h1>
			<p class="text-sm text-gray-500 mt-1">Masuk ke akun Terabisamu</p>
		</div>

		<form onsubmit={handleLogin} class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
				<input
					type="email"
					bind:value={email}
					placeholder="email@contoh.com"
					required
					class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
				/>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
				<input
					type="password"
					bind:value={password}
					placeholder="••••••••"
					required
					class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
				/>
			</div>

			{#if error}
				<div class="px-4 py-3 rounded-xl bg-red-50 text-sm text-red-600">
					{error}
				</div>
			{/if}

			<button
				type="submit"
				disabled={loading}
				class="w-full py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors disabled:opacity-50"
			>
				{loading ? 'Memproses...' : 'Masuk'}
			</button>
		</form>

		<div class="mt-6 text-center text-sm text-gray-500">
			<a href="/auth/lupa-password" class="text-primary font-medium hover:underline">Lupa password?</a>
		</div>

		<p class="mt-6 text-center text-sm text-gray-500">
			Belum punya akun?
			<a href="/auth/daftar" class="text-primary font-semibold hover:underline">Daftar</a>
		</p>
	</div>
</div>
