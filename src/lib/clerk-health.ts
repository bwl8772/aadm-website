/**
 * Clerk key state for `/health` (docs/INVARIANTS.md ENV-03, OPS-03). Reports
 * presence, instance parity and whether Clerk accepts the secret key — never a
 * key value. A wrong or missing secret key is the failure that turned the
 * Account Portal hand-off into a redirect loop on Oct 24, 2026.
 */

export type ClerkKeyStatus = {
	publishable_key: "present" | "missing";
	secret_key: "present" | "missing";
	/** From the key prefixes; `mismatch` when pk and sk are from different instances. */
	instance: "production" | "development" | "mismatch" | "unknown";
	/** Clerk's Backend API accepted the secret key. `unknown` = Clerk not reachable. */
	secret_key_check: "valid" | "invalid" | "unknown" | "skipped";
	ok: boolean;
};

type Probe = ClerkKeyStatus["secret_key_check"];

const CLERK_JWKS_URL = "https://api.clerk.com/v1/jwks";
const PROBE_TIMEOUT_MS = 3_000;
const VALID_TTL_MS = 10 * 60_000;
const RETRY_TTL_MS = 30_000;

let probeCache: { until: number; result: Probe } | null = null;

const text = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

function instanceOf(key: string): "production" | "development" | null {
	if (/^(?:pk|sk)_live_/.test(key)) return "production";
	if (/^(?:pk|sk)_test_/.test(key)) return "development";
	return null;
}

/**
 * Asks Clerk's Backend API whether the secret key is accepted — the same call
 * `@clerk/backend` makes to resolve a handshake. Cached so `/health` stays cheap:
 * a good key is re-checked every 10 minutes, a bad or unreachable one every 30 s.
 */
async function probeSecretKey(secretKey: string): Promise<Probe> {
	if (probeCache && probeCache.until > Date.now()) return probeCache.result;
	let result: Probe = "unknown";
	try {
		const res = await fetch(CLERK_JWKS_URL, {
			headers: { Authorization: `Bearer ${secretKey}` },
			signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
		});
		if (res.ok) result = "valid";
		else if (res.status === 401 || res.status === 403) result = "invalid";
	} catch {
		result = "unknown";
	}
	probeCache = {
		until: Date.now() + (result === "valid" ? VALID_TTL_MS : RETRY_TTL_MS),
		result,
	};
	return result;
}

export async function clerkKeyStatus(
	env: ImportMetaEnv,
): Promise<ClerkKeyStatus> {
	const pk =
		text(env.PUBLIC_CLERK_PUBLISHABLE_KEY) ||
		text(process.env.PUBLIC_CLERK_PUBLISHABLE_KEY);
	const sk = text(process.env.CLERK_SECRET_KEY) || text(env.CLERK_SECRET_KEY);

	const pkInstance = pk ? instanceOf(pk) : null;
	const skInstance = sk ? instanceOf(sk) : null;
	let instance: ClerkKeyStatus["instance"] = "unknown";
	if (pkInstance && skInstance) {
		instance = pkInstance === skInstance ? pkInstance : "mismatch";
	} else if (pkInstance || skInstance) {
		instance = (pkInstance ?? skInstance) as "production" | "development";
	}

	const secret_key_check: Probe = sk ? await probeSecretKey(sk) : "skipped";

	return {
		publishable_key: pk ? "present" : "missing",
		secret_key: sk ? "present" : "missing",
		instance,
		secret_key_check,
		ok:
			!!pk && !!sk && instance !== "mismatch" && secret_key_check !== "invalid",
	};
}
