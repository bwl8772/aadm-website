import { trim } from "./site-urls";

/**
 * AADM's single Clerk OAuth application Client ID — operator-configured on Railway.
 * Same value for every signed-in member; not generated per user.
 * Used by mcp.aadm.io token verification and the member Connectors OAuth tab.
 */
export function primaryOAuthClientIdFromEnv(env: ImportMetaEnv): string {
	return trim(env.CLERK_OAUTH_CLIENT_ID) || "";
}
