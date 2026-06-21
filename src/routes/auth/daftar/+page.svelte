<script lang="ts">
	import { createClient } from '$lib/supabase';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let session = $derived(data?.session);

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	let success = $state(false);

	$effect(() => {
		if (session) {
			goto('/user');
		}
	});

	async function handleRegister(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		if (password.length < 6) {
			error = 'Password minimal 6 karakter';
			loading = false;
			return;
		}

		try {
			const supabase = createClient();
			const { error: authError } = await supabase.auth.signUp({
				email: email.trim(),
				password,
				options: {
					data: {
						full_name: name.trim(),
					},
					emailRedirectTo: `${window.location.origin}/auth/konfirmasi`,
				},
			});

			if (authError) {
				error = authError.message;
				return;
			}

			success = true;
		} catch (err) {
			error = 'Terjadi kesalahan. Silakan coba lagi.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Daftar - Terabisa</title>
</svelte:head>

<div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
	<div class="w-full max-w-sm">
		<div class="text-center mb-8">
			<div class="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
				<svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
				</svg>
			</div>
			<h1 class="text-2xl font-bold text-gray-900">Daftar</h1>
			<p class="text-sm text-gray-500 mt-1">Buat akun Terabisamu</p>
		</div>

		{#if success}
			<div class="text-center py-8">
				<div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
					</svg>
				</div>
				<h2 class="text-lg font-semibold text-gray-900">Pendaftaran Berhasil!</h2>
				<p class="text-sm text-gray-500 mt-2">
					Cek email <strong>{email}</strong> untuk konfirmasi pendaftaran.
				</p>
				<p class="text-sm text-gray-400 mt-1">
					Setelah konfirmasi, kamu bisa mulai setup platform crowdfunding-mu.
				</p>
				<a href="/auth/masuk" class="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
					Masuk & Setup Platform →
				</a>
			</div>
		{:else}
			<form onsubmit={handleRegister} class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
					<input
						type="text"
						bind:value={name}
						placeholder="Nama kamu"
						required
						class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
					/>
				</div>

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
						placeholder="Minimal 6 karakter"
						required
						minlength={6}
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
					{loading ? 'Memproses...' : 'Daftar'}
				</button>
			</form>

			<p class="mt-6 text-center text-sm text-gray-500">
				Sudah punya akun?
				<a href="/auth/masuk" class="text-primary font-semibold hover:underline">Masuk</a>
			</p>
		{/if}
	</div>
</div>
