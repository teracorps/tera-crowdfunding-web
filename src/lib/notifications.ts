/**
 * Email notification service for crowdfunding platform.
 * Uses Supabase's built-in auth email or SMTP relay.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

interface DonationEmailParams {
	to: string;
	donorName: string;
	amount: number;
	donationNumber: string;
	campaignTitle: string;
	campaignSlug: string;
	date: string;
}

const SITE_URL = 'https://crowdfunding.tera-platform.my.id';

function formatRupiah(n: number): string {
	return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

export async function sendDonationReceivedEmail(
	sb: SupabaseClient,
	params: DonationEmailParams,
): Promise<void> {
	const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; background: #f5f5f5; padding: 24px;">
	<div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
		<div style="background: #1a73e8; padding: 32px; text-align: center;">
			<h1 style="color: white; margin: 0; font-size: 20px;">Donasi Diterima! 🎉</h1>
		</div>
		<div style="padding: 32px;">
			<p style="color: #333; font-size: 15px;">Hai <strong>${params.donorName}</strong>,</p>
			<p style="color: #666; font-size: 14px; line-height: 1.6;">
				Terima kasih! Donasi kamu sebesar <strong style="color: #14B88C;">${formatRupiah(params.amount)}</strong>
				untuk <strong>${params.campaignTitle}</strong> telah kami terima.
			</p>
			<div style="background: #f8f9fa; border-radius: 12px; padding: 16px; margin: 20px 0;">
				<table style="width: 100%; font-size: 13px;">
					<tr>
						<td style="color: #888; padding: 4px 0;">No. Donasi</td>
						<td style="text-align: right; font-weight: 600;">${params.donationNumber}</td>
					</tr>
					<tr>
						<td style="color: #888; padding: 4px 0;">Jumlah</td>
						<td style="text-align: right; font-weight: 600;">${formatRupiah(params.amount)}</td>
					</tr>
					<tr>
						<td style="color: #888; padding: 4px 0;">Tanggal</td>
						<td style="text-align: right;">${params.date}</td>
					</tr>
				</table>
			</div>
			<a href="${SITE_URL}/campaign/${params.campaignSlug}"
				style="display: block; text-align: center; padding: 12px; background: #1a73e8; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">
				Lihat Campaign
			</a>
		</div>
		<div style="background: #f8f9fa; padding: 16px 32px; text-align: center; font-size: 11px; color: #999;">
			Terabisa Crowdfunding Platform
		</div>
	</div>
</body>
</html>`;

	await sendEmail(sb, params.to, `Donasi diterima - ${params.campaignTitle}`, html);
}

export async function sendDonationSettlementEmail(
	sb: SupabaseClient,
	params: DonationEmailParams,
): Promise<void> {
	const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; background: #f5f5f5; padding: 24px;">
	<div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
		<div style="background: #14B88C; padding: 32px; text-align: center;">
			<h1 style="color: white; margin: 0; font-size: 20px;">Pembayaran Berhasil ✅</h1>
		</div>
		<div style="padding: 32px;">
			<p style="color: #333; font-size: 15px;">Hai <strong>${params.donorName}</strong>,</p>
			<p style="color: #666; font-size: 14px; line-height: 1.6;">
				Pembayaran donasi sebesar <strong style="color: #14B88C;">${formatRupiah(params.amount)}</strong>
				untuk <strong>${params.campaignTitle}</strong> telah berhasil dikonfirmasi!
			</p>
			<div style="background: #f0fdf4; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #bbf7d0;">
				<p style="color: #166534; font-size: 13px; font-weight: 600;">✅ Pembayaran berhasil diverifikasi</p>
			</div>
			<a href="${SITE_URL}/campaign/${params.campaignSlug}"
				style="display: block; text-align: center; padding: 12px; background: #1a73e8; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">
				Lihat Progress Campaign
			</a>
		</div>
		<div style="background: #f8f9fa; padding: 16px 32px; text-align: center; font-size: 11px; color: #999;">
			Terabisa Crowdfunding Platform
		</div>
	</div>
</body>
</html>`;

	await sendEmail(sb, params.to, `Pembayaran berhasil - ${params.campaignTitle}`, html);
}

async function sendEmail(
	sb: SupabaseClient,
	to: string,
	subject: string,
	html: string,
): Promise<void> {
	try {
		// Use Supabase's built-in email function if available
		const { error } = await sb.auth.admin.sendRawEmail({
			to,
			subject,
			html,
		});

		if (error) {
			console.error('[Email] Supabase send error:', error);
			// Fallback: log the email
			console.log(`[Email] Fallback - To: ${to}, Subject: ${subject}`);
		}
	} catch (err) {
		console.error('[Email] Failed to send:', err);
	}
}
