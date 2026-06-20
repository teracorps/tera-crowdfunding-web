import { config } from '$lib/config';
import type {
	ApiResponse,
	Campaign,
	CampaignListItem,
	CampaignCategory,
	DonationRequest,
	DonationResponse,
	FundingStats,
} from '$lib/types';

const API = config.api.baseUrl;

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
	const url = `${API}/public/funding${endpoint}`;

	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		...options,
	});

	if (!res.ok) {
		const errorBody = await res.text();
		throw new Error(`API Error ${res.status}: ${errorBody}`);
	}

	return res.json();
}

function formatRupiah(amount: number): string {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatNumber(num: number): string {
	return new Intl.NumberFormat('id-ID').format(num);
}

function getPercentage(raised: number, target: number): number {
	if (target <= 0) return 0;
	return Math.min(Math.round((raised / target) * 100), 100);
}

// --- Campaign API ---

export async function getCampaigns(params?: {
	page?: number;
	per_page?: number;
	category?: string;
	status?: string;
	sort?: string;
	search?: string;
}): Promise<{ campaigns: CampaignListItem[]; meta: ApiResponse<CampaignListItem[]>['meta'] }> {
	const searchParams = new URLSearchParams();
	if (params?.page) searchParams.set('page', String(params.page));
	if (params?.per_page) searchParams.set('per_page', String(params.per_page));
	if (params?.category) searchParams.set('category', params.category);
	if (params?.status) searchParams.set('status', params.status);
	if (params?.sort) searchParams.set('sort', params.sort);
	if (params?.search) searchParams.set('search', params.search);

	const query = searchParams.toString();
	const endpoint = `/campaigns${query ? `?${query}` : ''}`;

	const response = await fetchApi<ApiResponse<CampaignListItem[]>>(endpoint);

	const campaigns = (response.data || []).map((c) => ({
		...c,
		percentage: getPercentage(c.raised_amount, c.target_amount),
	}));

	return { campaigns, meta: response.meta };
}

export async function getCampaign(slug: string): Promise<Campaign> {
	const response = await fetchApi<ApiResponse<Campaign>>(`/campaigns/${slug}`);
	return response.data;
}

export async function getCategories(): Promise<CampaignCategory[]> {
	const response = await fetchApi<ApiResponse<CampaignCategory[]>>('/categories');
	return response.data || [];
}

export async function getFeaturedCampaigns(): Promise<CampaignListItem[]> {
	const { campaigns } = await getCampaigns({ per_page: 6, sort: 'popular' });
	return campaigns;
}

export async function getUrgentCampaigns(): Promise<CampaignListItem[]> {
	const { campaigns } = await getCampaigns({ per_page: 4, sort: 'urgent' });
	return campaigns;
}

export async function getStats(): Promise<FundingStats> {
	try {
		const response = await fetchApi<ApiResponse<FundingStats>>('/stats');
		return response.data;
	} catch {
		return {
			total_campaigns: 0,
			total_donations: 0,
			total_raised: 0,
			total_donors: 0,
		};
	}
}

// --- Donation API ---

export async function submitDonation(data: DonationRequest): Promise<DonationResponse> {
	const response = await fetchApi<ApiResponse<DonationResponse>>('/donations', {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return response.data;
}

export { formatRupiah, formatNumber, getPercentage };
