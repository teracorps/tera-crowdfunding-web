import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { TenantInfo } from '$lib/types';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			serviceClient: SupabaseClient;
			session: Session | null;
			/** Resolved tenant (organization) for this request */
			tenant: TenantInfo | null;
		}
		interface PageData {
			session: Session | null;
			/** Tenant info available to all pages */
			tenant: TenantInfo | null;
		}
	}
}

export {};
