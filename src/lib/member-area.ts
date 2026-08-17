import { trim } from "./site-urls";

/** Protected subscriber area on aadm.io (embedded Clerk UserProfile). */
export const MEMBER_AREA_PATH = "/member";

/** Connectors OAuth tab (shared CLERK_OAUTH_CLIENT_ID) — aadm.io/member/mcp-oauth */
export const MEMBER_MCP_OAUTH_SEGMENT = "mcp-oauth";

/** Clerk UserProfile API keys route — aadm.io/member/api-keys (bearer how-to + key UI) */
export const MEMBER_API_KEYS_SEGMENT = "api-keys";

/** Legacy Bearer tab URL — redirects to api-keys */
export const MEMBER_BEARER_SEGMENT = "bearer";

/** Profile tab — aadm.io/member/account (Clerk account UI, Astro tabs own chrome) */
export const MEMBER_ACCOUNT_SEGMENT = "account";

/** Security tab — aadm.io/member/security */
export const MEMBER_SECURITY_SEGMENT = "security";

function marketingOrigin(env: ImportMetaEnv): string {
	const quickstart =
		trim(env.PUBLIC_MCP_QUICKSTART_URL) || "https://aadm.io/mcp";
	try {
		return new URL(quickstart).origin;
	} catch {
		return "https://aadm.io";
	}
}

/** Member area path — fixed at `/member` (must match `src/pages/member/` on disk). */
export function memberAreaPathFromEnv(_env?: ImportMetaEnv): string {
	return MEMBER_AREA_PATH;
}

export function memberAreaUrl(env: ImportMetaEnv): string {
	return `${marketingOrigin(env)}${memberAreaPathFromEnv(env)}`;
}

export function memberMcpOAuthTabUrl(env: ImportMetaEnv): string {
	return `${memberAreaUrl(env)}/${MEMBER_MCP_OAUTH_SEGMENT}`;
}
