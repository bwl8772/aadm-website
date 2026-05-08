/**
 * MCP OAuth — Clerk OAuth application → browser callback on Account Portal.
 * Register redirect URL in Clerk Dashboard (OAuth app → Redirect URIs).
 */

/** Production default; override with MCP_OAUTH_REDIRECT_URI or derive from request URL. */
export const MCP_OAUTH_CALLBACK_PATH = "/oauth/mcp/callback";

export function clerkOAuthIssuer(): string {
	const raw = process.env.CLERK_OAUTH_ISSUER?.trim();
	if (raw) return raw.replace(/\/+$/, "");
	return "https://clerk.aadm.io";
}

export function mcpOAuthRedirectUri(requestUrl: string): string {
	const explicit = process.env.MCP_OAUTH_REDIRECT_URI?.trim();
	if (explicit) return explicit;
	return new URL(MCP_OAUTH_CALLBACK_PATH, requestUrl).toString();
}

export function mcpOAuthScopes(): string {
	return (
		process.env.MCP_OAUTH_SCOPES?.trim() ||
		"openid profile email offline_access"
	);
}

export function clerkOAuthClientId(): string | undefined {
	const id = process.env.CLERK_OAUTH_CLIENT_ID?.trim();
	return id || undefined;
}

export function clerkOAuthClientSecret(): string | undefined {
	const s = process.env.CLERK_OAUTH_CLIENT_SECRET?.trim();
	return s || undefined;
}
