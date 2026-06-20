<script lang="ts">
	import './layout.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	let isScrolled = $state(false);

	function handleScroll() {
		isScrolled = window.scrollY > 10;
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<Navbar {isScrolled} />

<main class="min-h-screen">
	{@render children()}
</main>

<Footer />
