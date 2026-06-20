import type { TenantInfo, FeatureKey } from '$lib/types';

/**
 * Check if a tenant has a specific feature entitlement.
 */
export function hasEntitlement(tenant: TenantInfo | null, feature: FeatureKey): boolean {
	if (!tenant) return false;
	return tenant.entitlements.has(feature);
}

/**
 * Check if crowdfunding is available for this tenant.
 * Public platform (no tenant) always allows crowdfunding.
 */
export function canCrowdfund(tenant: TenantInfo | null): boolean {
	// No tenant = main platform, always allowed
	if (!tenant) return true;
	return hasEntitlement(tenant, 'crowdfunding');
}

/**
 * Check if tenant can customize branding.
 */
export function canCustomBranding(tenant: TenantInfo | null): boolean {
	if (!tenant) return true;
	return hasEntitlement(tenant, 'crowdfunding.branding');
}

/**
 * Check if tenant can use custom domain.
 */
export function canCustomDomain(tenant: TenantInfo | null): boolean {
	if (!tenant) return false;
	return hasEntitlement(tenant, 'crowdfunding.custom_domain');
}

/**
 * Check if tenant has unlimited campaigns.
 */
export function hasUnlimitedCampaigns(tenant: TenantInfo | null): boolean {
	if (!tenant) return true;
	return hasEntitlement(tenant, 'crowdfunding.unlimited');
}

/**
 * Check if tenant has API access.
 */
export function hasApiAccess(tenant: TenantInfo | null): boolean {
	if (!tenant) return true;
	return hasEntitlement(tenant, 'crowdfunding.api');
}

/**
 * Get the max number of active campaigns based on plan.
 */
export function getMaxActiveCampaigns(tenant: TenantInfo | null): number {
	if (!tenant) return Infinity;
	if (hasUnlimitedCampaigns(tenant)) return Infinity;

	// Starter plan limits
	switch (tenant.subscription?.planCode) {
		case 'starter':
			return 5;
		case 'business':
			return Infinity;
		default:
			return 3; // No subscription
	}
}
