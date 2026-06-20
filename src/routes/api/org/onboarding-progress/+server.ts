import { json } from '@sveltejs/kit';

/**
 * GET /api/org/onboarding-progress
 * Returns the current tenant's onboarding progress.
 */
export async function GET({ locals }) {
	const tenant = locals.tenant;
	if (!tenant) {
		return json({ progress: null, error: 'No tenant context.' });
	}

	try {
		const { data: onboarding } = await locals.serviceClient
			.schema('business_core')
			.from('organization_onboarding')
			.select('*')
			.eq('organization_id', tenant.id)
			.maybeSingle();

		if (!onboarding) {
			return json({
				progress: {
					currentStep: 'subdomain',
					steps: {
						subdomain: false,
						branding: false,
						payment: false,
						campaign: false,
					},
					completed: false,
				},
			});
		}

		return json({
			progress: {
				currentStep: onboarding.current_step,
				steps: {
					subdomain: onboarding.step_subdomain,
					branding: onboarding.step_branding,
					payment: onboarding.step_payment,
					campaign: onboarding.step_campaign,
				},
				completed: onboarding.step_complete,
				skippedSteps: onboarding.skipped_steps,
			},
		});
	} catch (err) {
		console.error('[OnboardingProgress] Error:', err);
		return json({ progress: null, error: 'Failed to load onboarding progress.' }, { status: 500 });
	}
}

/**
 * PUT /api/org/onboarding-progress
 * Update onboarding step progress.
 */
export async function PUT({ request, locals }) {
	const tenant = locals.tenant;
	if (!tenant) {
		return json({ success: false, error: 'No tenant context.' }, { status: 401 });
	}

	try {
		const { step, completed, skip } = await request.json();

		const validSteps = ['subdomain', 'branding', 'payment', 'campaign'];
		if (!validSteps.includes(step)) {
			return json({ success: false, error: 'Invalid step.' }, { status: 400 });
		}

		// Map step to column names
		const stepMap: Record<string, string> = {
			subdomain: 'step_subdomain',
			branding: 'step_branding',
			payment: 'step_payment',
			campaign: 'step_campaign',
		};

		const stepColumn = stepMap[step];
		const nextStepIndex = validSteps.indexOf(step) + 1;
		const nextStep = nextStepIndex < validSteps.length ? validSteps[nextStepIndex] : 'complete';
		const isComplete = nextStep === 'complete' && (completed ?? true);

		// Update onboarding
		const update: Record<string, any> = {
			[stepColumn]: completed ?? true,
			current_step: skip ? nextStep : isComplete ? 'complete' : nextStep,
		};

		if (skip) {
			// Add to skipped steps
			const { data: current } = await locals.serviceClient
				.schema('business_core')
				.from('organization_onboarding')
				.select('skipped_steps')
				.eq('organization_id', tenant.id)
				.maybeSingle();

			const skipped = current?.skipped_steps || [];
			skipped.push(step);
			update.skipped_steps = skipped;
		}

		if (isComplete) {
			update.step_complete = true;
			update.completed_at = new Date().toISOString();
		}

		// Upsert to handle first-time vs updates
		const { error: upsertError } = await locals.serviceClient
			.schema('business_core')
			.from('organization_onboarding')
			.upsert({
				organization_id: tenant.id,
				...update,
			}, { onConflict: 'organization_id' });

		if (upsertError) {
			console.error('[OnboardingUpdate] Error:', upsertError);
			return json({ success: false, error: 'Failed to update onboarding.' }, { status: 500 });
		}

		return json({
			success: true,
			nextStep: isComplete ? null : nextStep,
			completed: isComplete,
		});
	} catch (err) {
		console.error('[OnboardingUpdate] Error:', err);
		return json({ success: false, error: 'Internal error.' }, { status: 500 });
	}
}
