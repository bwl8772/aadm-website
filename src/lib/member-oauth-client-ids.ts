import { trim } from "./site-urls";

/**
 * AADM's single Clerk OAuth application Client ID — operator-configured on Railway.
 * Same value for every signed-in member; not generated per user.
 * Used by mcp.aadm.io token verification and the member Connectors OAuth tab.
 *
 * Read from process.env at request time (Railway runtime var) — not import.meta.env,
 * which Vite inlines at build time and would stay empty when only set at deploy runtime.
 */
export function primaryOAuthClientIdFromEnv(_env?: ImportMetaEnv): string {
	const proc = (
		globalThis as {
			process?: { env?: Record<string, string | undefined> };
		}
	).process;
	const runtime = trim(proc?.env?.CLERK_OAUTH_CLIENT_ID ?? "");
	if (runtime) return runtime;
	return trim(_env?.CLERK_OAUTH_CLIENT_ID) || "";
}
