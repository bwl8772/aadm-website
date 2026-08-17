/**
 * Disposable Clerk test signup — operator types values; VO says “your name / your email”.
 * Password / OTP MUST come from env — never commit secrets.
 */
export type DemoSignupFixtureV1 = {
	firstName: string;
	lastName: string;
	email: string;
	passwordEnvKey: "DEMO_SIGNUP_PASSWORD";
	otpEnvKey: "DEMO_SIGNUP_OTP";
};

/** Viewer-facing labels for VO / timeline (not the typed strings). */
export const DEMO_SIGNUP_VIEWER_LABELS = {
	name: "your name",
	email: "your email",
	password: "your password",
} as const;

/**
 * On-camera typed values (demo operator). VO still says “your name”, “your email”.
 */
export const DEMO_SIGNUP_FIXTURE_V1: DemoSignupFixtureV1 = {
	firstName: process.env.DEMO_SIGNUP_FIRST_NAME?.trim() || "Auto",
	lastName: process.env.DEMO_SIGNUP_LAST_NAME?.trim() || "Composer",
	email:
		process.env.DEMO_SIGNUP_EMAIL?.trim() ||
		"auto.composer+clerk_test@aadm.io",
	passwordEnvKey: "DEMO_SIGNUP_PASSWORD",
	otpEnvKey: "DEMO_SIGNUP_OTP",
};

export function demoSignupPassword(): string | undefined {
	const v = process.env.DEMO_SIGNUP_PASSWORD?.trim();
	return v || undefined;
}

export function demoSignupOtp(): string {
	return process.env.DEMO_SIGNUP_OTP?.trim() || "424242";
}
