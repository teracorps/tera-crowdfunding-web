import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { slug } = params;
	const session = locals.session;
	const sb = locals.serviceClient;

	// Require authentication
	if (!session?.user) {
		redirect(302, `/auth/masuk?redirect=/campaign/manage/${slug}`);
	}

	// Load campaign by slug
	const { data: campaign, error: campaignErr } = await sb
		.schema('business_funding')
		.from('campaigns')
		.select('*')
		.eq('slug', slug)
		.maybeSingle();

	if (campaignErr) {
		console.error('[Campaign Manage] Load error:', campaignErr);
		error(500, 'Gagal memuat data campaign');
	}

	if (!campaign) {
		error(404, 'Campaign tidak ditemukan');
	}

	// Ownership check: must be the creator
	if (campaign.created_by !== session.user.id) {
		error(403, 'Kamu bukan pemilik campaign ini');
	}

	// Load donations for this campaign
	const { data: donations, error: donErr } = await sb
		.schema('business_funding')
		.from('donations')
		.select('*')
		.eq('campaign_id', campaign.id)
		.order('created_at', { ascending: false })
		.limit(200);

	if (donErr) {
		console.error('[Campaign Manage] Donations error:', donErr);
	}

	// Calculate summary stats
	const allDonations = (donations || []) as any[];
	const totalRaised = allDonations.reduce(
		(sum: number, d: any) => sum + (d.payment_status === 'paid' || d.payment_status === 'settlement' ? Number(d.amount) : 0),
		0,
	);
	const donorCount = new Set(
		allDonations
			.filter((d: any) => !d.is_anonymous)
			.map((d: any) => d.donor_email || d.donor_name),
	).size;

	return {
		session: session,
		campaign: {
			id: campaign.id,
			slug: campaign.slug,
			title: campaign.title,
			description: campaign.description || '',
			cover_image_url: campaign.cover_image_url || '',
			target_amount: Number(campaign.target_amount),
			raised_amount: Number(campaign.raised_amount),
			donor_count: campaign.donor_count || 0,
			status: campaign.status,
			organizer_name: campaign.organizer_name || '',
			created_at: campaign.created_at,
			end_date: campaign.end_date,
		},
		donations: allDonations.map((d: any) => ({
			id: d.id,
			donation_number: d.donation_number || '',
			donation_date: d.donation_date || d.created_at?.slice(0, 10),
			amount: Number(d.amount),
			donor_name: d.is_anonymous ? 'Anonim' : (d.donor_name || ''),
			donor_email: d.donor_email || '',
			is_anonymous: d.is_anonymous || false,
			message: d.message || '',
			payment_method: d.payment_method || '',
			payment_status: d.payment_status || 'pending',
			created_at: d.created_at,
		})),
		stats: {
			total_donations: allDonations.length,
			total_raised: totalRaised,
			donor_count: donorCount,
			paid_count: allDonations.filter(
				(d: any) => d.payment_status === 'paid' || d.payment_status === 'settlement',
			).length,
			pending_count: allDonations.filter(
				(d: any) => d.payment_status === 'pending' || d.payment_status === 'waiting_payment',
			).length,
		},
	};
};
