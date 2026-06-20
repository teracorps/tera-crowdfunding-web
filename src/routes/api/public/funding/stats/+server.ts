import { json } from '@sveltejs/kit';

/**
 * GET /api/public/funding/stats
 * Get aggregate funding statistics for the landing page.
 */
export async function GET({ locals }) {
	try {
		const sb = locals.serviceClient;

		// Total active campaigns
		const { count: totalCampaigns } = await sb
			.schema('business_funding')
			.from('campaigns')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'active');

		// Total donations (paid only)
		const { count: totalDonations } = await sb
			.schema('business_funding')
			.from('donations')
			.select('*', { count: 'exact', head: true })
			.in('payment_status', ['paid', 'waiting_payment']);

		// Total raised amount
		const { data: raisedData } = await sb
			.schema('business_funding')
			.from('donations')
			.select('amount')
			.in('payment_status', ['paid', 'waiting_payment']);

		const totalRaised = (raisedData || []).reduce(
			(sum: number, d: any) => sum + Number(d.amount),
			0
		);

		// Total unique donors
		const { count: totalDonors } = await sb
			.schema('business_funding')
			.from('donations')
			.select('*', { count: 'exact', head: true })
			.in('payment_status', ['paid', 'waiting_payment']);

		return json({
			success: true,
			data: {
				total_campaigns: totalCampaigns || 0,
				total_donations: totalDonations || 0,
				total_raised: totalRaised,
				total_donors: totalDonors || 0,
			},
		});
	} catch (err: any) {
		console.error('[Funding/Stats] Error:', err);
		return json({
			success: true,
			data: {
				total_campaigns: 0,
				total_donations: 0,
				total_raised: 0,
				total_donors: 0,
			},
		});
	}
}
