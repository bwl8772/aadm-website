import { trim } from "./site-urls";

/** Protected subscriber area on aadm.io (embedded Clerk UserProfile). */
export const MEMBER_AREA_PATH = "/member";

/** Connectors OAuth tab (shared CLERK_OAUTH_CLIENT_ID) — aadm.io/member/mcp-oauth */
export const MEMBER_MCP_OAUTH_SEGMENT = "mcp-oauth";

function marketingOrigin(env: ImportMetaEnv): string {
	const quickstart =
		trim(env.PUBLIC_MCP_QUICKSTART_URL) || "https://aadm.io/mcp";
	try {
		return new URL(quickstart).origin;
	} catch {
		return "https://aadm.io";
	}
}

export function memberAreaPathFromEnv(env: ImportMetaEnv): string {
	const configured = trim(env.PUBLIC_MEMBER_AREA_PATH);
	const path = configured || MEMBER_AREA_PATH;
	return path.startsWith("/") ? path : `/${path}`;
}

export function memberAreaUrl(env: ImportMetaEnv): string {
	return `${marketingOrigin(env)}${memberAreaPathFromEnv(env)}`;
}

export function memberMcpOAuthTabUrl(env: ImportMetaEnv): string {
	return `${memberAreaUrl(env)}/${MEMBER_MCP_OAUTH_SEGMENT}`;
}
