import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { mapMidtransStatus } from '$lib/payment';
import { sendDonationSettlementEmail } from '$lib/notifications';

/**
 * POST /api/public/funding/payments/notification
 * Midtrans payment notification webhook.
 * Called by Midtrans when payment status changes.
 */
export async function POST({ request, locals }: RequestEvent) {
	try {
		const notification = await request.json();
		console.log('[Payment Webhook] Received:', JSON.stringify(notification));

		const { order_id, transaction_status, transaction_id, payment_type, gross_amount } = notification;

		if (!order_id) {
			return json({ success: false, error: 'Missing order_id' }, { status: 400 });
		}

		const sb = locals.serviceClient;

		// Find donation by order_id (donation_number)
		const { data: donation } = await sb
			.schema('business_funding')
			.from('donations')
			.select('id, campaign_id, amount, payment_status')
			.eq('donation_number', order_id)
			.maybeSingle();

		if (!donation) {
			console.error('[Payment Webhook] Donation not found:', order_id);
			return json({ success: false, error: 'Donation not found' }, { status: 404 });
		}

		// Map Midtrans status to our status
		const paymentStatus = mapMidtransStatus(transaction_status);

		// Build update payload
		const updates: Record<string, any> = {
			payment_status: paymentStatus,
			payment_gateway_ref: transaction_id || null,
		};

		if (paymentStatus === 'settlement') {
			updates.status = 'received';

			// Increment campaign raised_amount
			try {
				const { data: campaign } = await sb
					.schema('business_funding')
					.from('campaigns')
					.select('raised_amount, donor_count, title, slug')
					.eq('id', donation.campaign_id)
					.maybeSingle();

				if (campaign) {
					const addAmount = Number(gross_amount) || Number(donation.amount);
					await sb
						.schema('business_funding')
						.from('campaigns')
						.update({
							raised_amount: (campaign.raised_amount || 0) + addAmount,
							donor_count: (campaign.donor_count || 0) + 1,
						})
						.eq('id', donation.campaign_id);

					// Send settlement email (fire & forget)
					const { data: donor } = await sb
						.schema('business_funding')
						.from('donations')
						.select('donor_name, donor_email')
						.eq('id', donation.id)
						.maybeSingle();

					if (donor?.donor_email) {
						sendDonationSettlementEmail(sb, {
							to: donor.donor_email,
							donorName: donor.donor_name || 'Donatur',
							amount: donation.amount,
							donationNumber: order_id,
							campaignTitle: campaign.title || 'Campaign',
							campaignSlug: campaign.slug || donation.campaign_id,
							date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
						}).catch((e: unknown) => console.error('[Webhook] Email error:', e));
					}
				}
			} catch (err) {
				console.error('[Payment Webhook] Campaign update error:', err);
			}
		}

		// Update donation record
		await sb
			.schema('business_funding')
			.from('donations')
			.update(updates)
			.eq('id', donation.id);

		// Auto-acknowledge Midtrans
		return json({
			success: true,
			message: 'OK',
		});
	} catch (err: any) {
		console.error('[Payment Webhook] Error:', err);
		return json({ success: false, error: 'Internal error' }, { status: 500 });
	}
}
