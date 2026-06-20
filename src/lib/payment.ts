import Midtrans from 'midtrans-client';
import { MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, MIDTRANS_IS_PRODUCTION } from '$env/static/private';

let _snap: Midtrans.Snap | null = null;
let _core: Midtrans.CoreApi | null = null;

function getSnap(): Midtrans.Snap {
	if (!_snap) {
		_snap = new Midtrans.Snap({
			isProduction: MIDTRANS_IS_PRODUCTION === 'true',
			serverKey: MIDTRANS_SERVER_KEY,
			clientKey: MIDTRANS_CLIENT_KEY,
		});
	}
	return _snap;
}

function getCore(): Midtrans.CoreApi {
	if (!_core) {
		_core = new Midtrans.CoreApi({
			isProduction: MIDTRANS_IS_PRODUCTION === 'true',
			serverKey: MIDTRANS_SERVER_KEY,
			clientKey: MIDTRANS_CLIENT_KEY,
		});
	}
	return _core;
}

export interface CreateTransactionParams {
	donationId: string;
	donationNumber: string;
	amount: number;
	campaignTitle: string;
	campaignId: string;
	donorName: string;
	donorEmail: string;
	donorPhone?: string;
}

export async function createSnapTransaction(params: CreateTransactionParams) {
	const snap = getSnap();

	const transactionDetails = {
		order_id: params.donationNumber,
		gross_amount: params.amount,
	};

	const transaction = await snap.createTransaction({
		transaction_details: transactionDetails,
		credit_card: {
			secure: true,
		},
		customer_details: {
			first_name: params.donorName,
			email: params.donorEmail,
			phone: params.donorPhone || '',
		},
		item_details: [
			{
				id: params.campaignId,
				name: `Donasi: ${params.campaignTitle}`,
				price: params.amount,
				quantity: 1,
			},
		],
	});

	return {
		token: transaction.token,
		redirect_url: transaction.redirect_url,
	};
}

export async function getTransactionStatus(orderId: string) {
	try {
		const core = getCore();
		const status = await core.transaction.status(orderId);
		return status;
	} catch (err) {
		console.error('[Payment] Status check error:', err);
		return null;
	}
}

/**
 * Map Midtrans transaction status to our payment status.
 */
export function mapMidtransStatus(midtransStatus: string): string {
	switch (midtransStatus) {
		case 'capture':
		case 'settlement':
			return 'settlement';
		case 'pending':
		case 'authorize':
			return 'pending';
		case 'deny':
		case 'cancel':
		case 'expire':
			return 'failed';
		case 'refund':
		case 'partial_refund':
			return 'refund';
		default:
			return 'pending';
	}
}

export { MIDTRANS_CLIENT_KEY };
