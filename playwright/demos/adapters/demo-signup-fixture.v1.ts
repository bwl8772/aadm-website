/**
 * Disposable Clerk test signup — typed values match viewer VO (“your name / your email”).
 * Prefer DEMO_SIGNUP_PASSWORD from env; when unset (or too short), use a Clerk-safe demo default.
 * Never log the password value.
 */
export type DemoSignupFixtureV1 = {
	firstName: string;
	lastName: string;
	/** Full name when Clerk exposes a single name field. */
	fullName: string;
	email: string;
	passwordEnvKey: "DEMO_SIGNUP_PASSWORD";
	otpEnvKey: "DEMO_SIGNUP_OTP";
};

/** Viewer-facing labels for VO / timeline (not secrets). */
export const DEMO_SIGNUP_VIEWER_LABELS = {
	name: "your name",
	email: "your email",
	password: "your password",
} as const;

/**
 * On-camera typed values — same words the VO says (plus a valid email shape).
 * Clerk often rejects short passwords; keep the default long + mixed.
 */
export const DEMO_SIGNUP_PASSWORD_DEFAULT = "YourPassword-demo-4242!";

export const DEMO_SIGNUP_FIXTURE_V1: DemoSignupFixtureV1 = {
	firstName: process.env.DEMO_SIGNUP_FIRST_NAME?.trim() || "your",
	lastName: process.env.DEMO_SIGNUP_LAST_NAME?.trim() || "name",
	fullName:
		process.env.DEMO_SIGNUP_FULL_NAME?.trim() ||
		DEMO_SIGNUP_VIEWER_LABELS.name,
	email:
		process.env.DEMO_SIGNUP_EMAIL?.trim() ||
		"your.email+clerk_test@aadm.io",
	passwordEnvKey: "DEMO_SIGNUP_PASSWORD",
	otpEnvKey: "DEMO_SIGNUP_OTP",
};

/** Min length we accept from env before falling back (Clerk often ≥8; we pad safety). */
const MIN_DEMO_PASSWORD_LEN = 12;

export function demoSignupPassword(): string {
	const fromEnv = process.env.DEMO_SIGNUP_PASSWORD?.trim() || "";
	if (fromEnv.length >= MIN_DEMO_PASSWORD_LEN) return fromEnv;
	return DEMO_SIGNUP_PASSWORD_DEFAULT;
}

export function demoSignupPasswordSource(): "env" | "default" {
	const fromEnv = process.env.DEMO_SIGNUP_PASSWORD?.trim() || "";
	return fromEnv.length >= MIN_DEMO_PASSWORD_LEN ? "env" : "default";
}

export function demoSignupOtp(): string {
	return process.env.DEMO_SIGNUP_OTP?.trim() || "424242";
}
