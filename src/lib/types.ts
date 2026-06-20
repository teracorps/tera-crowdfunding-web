// --- Campaign Types ---

export interface Campaign {
	id: string;
	slug: string;
	title: string;
	description: string;
	story: string;
	category: string;
	cover_image: string;
	target_amount: number;
	raised_amount: number;
	donor_count: number;
	days_remaining: number;
	status: 'active' | 'completed' | 'closed';
	organizer_name: string;
	organizer_photo: string;
	is_urgent: boolean;
	created_at: string;
	updates: CampaignUpdate[];
}

export interface CampaignUpdate {
	id: string;
	content: string;
	created_at: string;
}

export interface CampaignListItem {
	id: string;
	slug: string;
	title: string;
	category: string;
	cover_image: string;
	target_amount: number;
	raised_amount: number;
	donor_count: number;
	days_remaining: number;
	status: 'active' | 'completed' | 'closed';
	organizer_name: string;
	is_urgent: boolean;
	percentage: number;
}

export interface CampaignCategory {
	id: string;
	name: string;
	slug: string;
	icon: string;
	campaign_count: number;
}

// --- Donation Types ---

export interface DonationRequest {
	campaign_id: string;
	amount: number;
	name: string;
	email: string;
	phone?: string;
	message?: string;
	is_anonymous: boolean;
	payment_method: string;
}

export interface DonationResponse {
	id: string;
	redirect_url: string;
	status: string;
}

// --- API Response Types ---

export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
	meta?: {
		page: number;
		per_page: number;
		total: number;
		total_pages: number;
	};
}

export interface FundingStats {
	total_campaigns: number;
	total_donations: number;
	total_raised: number;
	total_donors: number;
}
