import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { createSnapTransaction } from '$lib/payment';

/**
 * POST /api/public/funding/donations
 * Create a new donation and generate Midtrans Snap transaction.
 */
export async function POST({ request, locals }: RequestEvent) {
	try {
		const body = await request.json();
		const { campaign_id, amount, name, email, phone, message, is_anonymous, payment_method } = body;

		// Validation
		if (!campaign_id) return json({ success: false, error: 'Campaign ID diperlukan' }, { status: 400 });
		if (!amount || amount < 1000) return json({ success: false, error: 'Minimal donasi Rp 1.000' }, { status: 400 });
		if (!name) return json({ success: false, error: 'Nama donor diperlukan' }, { status: 400 });
		if (!email) return json({ success: false, error: 'Email diperlukan' }, { status: 400 });

		const sb = locals.serviceClient;

		// Verify campaign exists and is active
		const { data: campaign, error: campaignError } = await sb
			.schema('business_funding')
			.from('campaigns')
			.select('id, title, target_amount, raised_amount, status')
			.eq('id', campaign_id)
			.maybeSingle();

		if (campaignError) {
			console.error('[Donation] Campaign fetch error:', campaignError);
			return json({ success: false, error: 'Gagal memverifikasi campaign' }, { status: 500 });
		}

		if (!campaign) {
			return json({ success: false, error: 'Campaign tidak ditemukan' }, { status: 404 });
		}

		if (campaign.status !== 'active') {
			return json({ success: false, error: 'Campaign sudah tidak aktif' }, { status: 400 });
		}

		// Generate donation number
		const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
		const { count } = await sb
			.schema('business_funding')
			.from('donations')
			.select('*', { count: 'exact', head: true });
		const seq = ((count || 0) + 1001).toString().padStart(4, '0');
		const donationNumber = `DON-${dateStr}-${seq}`;

		// Determine payment method
		const method = payment_method || 'snap';
		const isSnap = method === 'snap' || method === 'midtrans' || method === 'all';

		// Create donation record
		const { data: donationRow, error: insertError } = await sb
			.schema('business_funding')
			.from('donations')
			.insert({
				campaign_id: campaign.id,
				donation_number: donationNumber,
				donation_date: new Date().toISOString().slice(0, 10),
				amount: amount,
				method: isSnap ? 'snap' : method,
				status: 'received',
				accounting_treatment: 'revenue_immediately',
				accounting_status: 'not_posted',
				donor_name: name,
				donor_email: email,
				donor_phone: phone || null,
				message: message || null,
				is_anonymous: is_anonymous || false,
				payment_method: isSnap ? 'gateway' : method,
				payment_status: 'waiting_payment',
			})
			.select('id')
			.maybeSingle();

		if (insertError) {
			console.error('[Donation] Insert error:', insertError);
			return json({ success: false, error: 'Gagal menyimpan donasi' }, { status: 500 });
		}

		if (!donationRow) {
			return json({ success: false, error: 'Gagal membuat donasi' }, { status: 500 });
		}

		const donation = donationRow;

		// Create Midtrans Snap transaction
		try {
			const snapResult = await createSnapTransaction({
				donationId: donation.id,
				donationNumber,
				amount,
				campaignTitle: campaign.title,
				campaignId: campaign.id,
				donorName: name,
				donorEmail: email,
				donorPhone: phone,
			});

			// Save Snap token & redirect URL to donation record
			await sb
				.schema('business_funding')
				.from('donations')
				.update({
					payment_gateway_ref: snapResult.token,
					payment_redirect_url: snapResult.redirect_url,
				})
				.eq('id', donation.id);

			return json({
				success: true,
				data: {
					id: donation.id,
					donation_number: donationNumber,
					snap_token: snapResult.token,
					redirect_url: snapResult.redirect_url,
					status: 'waiting_payment',
				},
			});
		} catch (snapErr: any) {
			console.error('[Donation] Midtrans Snap error:', snapErr);
			// Donation created but Snap failed — return donation ID with manual payment info
			return json({
				success: true,
				data: {
					id: donation.id,
					donation_number: donationNumber,
					snap_token: null,
					redirect_url: `/campaign/${campaign.id}/payment/${donation.id}`,
					status: 'waiting_payment',
					warning: 'Pembayaran gateway sedang tidak tersedia, silakan hubungi admin',
				},
			});
		}
	} catch (err: any) {
		console.error('[Donation] Unexpected error:', err);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}
