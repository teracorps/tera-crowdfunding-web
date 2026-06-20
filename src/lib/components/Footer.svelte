<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="footer-bg">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<!-- Brand -->
			<div class="md:col-span-1">
				<div class="flex items-center gap-2 mb-4">
					<div class="w-8 h-8 rounded-lg bg-[#1a73e8] flex items-center justify-center">
						<span class="text-white font-bold text-sm">T</span>
					</div>
					<span class="font-bold text-xl text-white">Terabisa</span>
				</div>
				<p class="text-gray-400 text-sm leading-relaxed mb-4">
					Platform crowdfunding terpercaya untuk galang dana, donasi online, 
					dan saling membantu sesama.
				</p>
				<div class="flex gap-3">
					<a href="#" class="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-[#1a73e8] transition-colors">
						<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
					</a>
					<a href="#" class="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-[#1a73e8] transition-colors">
						<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
					</a>
					<a href="#" class="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-[#1a73e8] transition-colors">
						<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zM8 16v-6h2v-1H8V7h2v2h1v1h-1v6H8zm7 0h-1.5v-3.5c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5V16H9v-6h1.5v.75c.5-.5 1.2-.75 2-.75 1.5 0 2.5 1 2.5 2.5V16z"/></svg>
					</a>
				</div>
			</div>

			<!-- Links -->
			<div>
				<h4 class="font-semibold text-white mb-4">Bantuan</h4>
				<ul class="space-y-2.5">
					<li><a href="#" class="text-gray-400 text-sm hover:text-white transition-colors">Pusat Bantuan</a></li>
					<li><a href="#" class="text-gray-400 text-sm hover:text-white transition-colors">Syarat & Ketentuan</a></li>
					<li><a href="#" class="text-gray-400 text-sm hover:text-white transition-colors">Kebijakan Privasi</a></li>
					<li><a href="#" class="text-gray-400 text-sm hover:text-white transition-colors">FAQ</a></li>
				</ul>
			</div>

			<div>
				<h4 class="font-semibold text-white mb-4">Jelajahi</h4>
				<ul class="space-y-2.5">
					<li><a href="/campaigns" class="text-gray-400 text-sm hover:text-white transition-colors">Semua Campaign</a></li>
					<li><a href="/kategori/kesehatan" class="text-gray-400 text-sm hover:text-white transition-colors">Kesehatan</a></li>
					<li><a href="/kategori/pendidikan" class="text-gray-400 text-sm hover:text-white transition-colors">Pendidikan</a></li>
					<li><a href="/kategori/bencana-alam" class="text-gray-400 text-sm hover:text-white transition-colors">Bencana Alam</a></li>
				</ul>
			</div>

			<div>
				<h4 class="font-semibold text-white mb-4">Ikuti Kami</h4>
				<ul class="space-y-2.5">
					<li><a href="#" class="text-gray-400 text-sm hover:text-white transition-colors">Instagram</a></li>
					<li><a href="#" class="text-gray-400 text-sm hover:text-white transition-colors">Twitter</a></li>
					<li><a href="#" class="text-gray-400 text-sm hover:text-white transition-colors">Facebook</a></li>
					<li><a href="#" class="text-gray-400 text-sm hover:text-white transition-colors">YouTube</a></li>
				</ul>
			</div>
		</div>

		<!-- Divider -->
		<div class="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
			<p class="text-gray-500 text-xs">
				&copy; {year} Terabisa. All rights reserved.
			</p>
			<div class="flex items-center gap-4">
				<span class="text-gray-500 text-xs">Powered by Tera Platform</span>
				<div class="flex items-center gap-2">
					<span class="text-gray-500 text-xs">Metode Pembayaran:</span>
					<span class="text-gray-400 text-xs">🏦 💳 📱</span>
				</div>
			</div>
		</div>
	</div>
</footer>
