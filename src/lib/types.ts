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
	donation_number?: string;
	snap_token?: string | null;
	redirect_url: string;
	status: string;
	warning?: string;
}

export interface DonationHistoryItem {
	id: string;
	donation_number: string;
	amount: number;
	date: string;
	payment_status: string;
	payment_method: string;
	is_anonymous: boolean;
	message?: string;
	campaign: {
		id: string;
		title: string;
		slug: string;
		cover_image: string;
	} | null;
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

// --- Multi-tenant Types ---

export interface TenantBranding {
	platformName: string;
	tagline: string;
	primaryColor: string;
	secondaryColor: string;
	accentColor: string;
	textPrimaryColor: string;
	textSecondaryColor: string;
	backgroundColor: string;
	surfaceColor: string;
	logoUrl: string | null;
	logoTextUrl: string | null;
	logoMode: 'text-only' | 'icon-text' | 'logo-text';
	faviconUrl: string | null;
	ogImageUrl: string | null;
	fontFamily: string;
	fontHeading: string;
	footerText: string | null;
	footerLinks: { label: string; url: string }[];
	socialLinks: { platform: string; url: string }[];
}

export interface TenantSubscription {
	planId: string;
	planCode: string;
	planName: string;
	status: string;
}

export interface TenantInfo {
	id: string;
	name: string;
	slug: string;
	subdomain: string | null;
	description: string | null;
	branding: TenantBranding | null;
	subscription: TenantSubscription | null;
	entitlements: Set<string>;
}

export type FeatureKey =
	| 'crowdfunding'
	| 'crowdfunding.branding'
	| 'crowdfunding.custom_domain'
	| 'crowdfunding.unlimited'
	| 'crowdfunding.api';
