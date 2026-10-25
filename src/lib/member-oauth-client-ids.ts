import { trim } from "./site-urls";

/**
 * AADM's single Clerk OAuth application Client ID — operator-configured on Railway.
 * Same value for every signed-in member; not generated per user.
 * Used by mcp.aadm.io token verification and the member Connectors OAuth tab.
 *
 * Read from process.env at request time (Railway runtime var) — not import.meta.env,
 * which Vite inlines at build time and would stay empty when only set at deploy runtime.
 *
 * The MCP server may list several comma-separated ids (the Clerk app id plus
 * Client ID Metadata Document URLs such as Cursor's), or `*` to accept any client
 * Clerk authorized. Members only ever see the Clerk app id: the first entry that
 * is neither a URL nor `*`.
 */
export function primaryOAuthClientIdFromEnv(_env?: ImportMetaEnv): string {
	const proc = (
		globalThis as {
			process?: { env?: Record<string, string | undefined> };
		}
	).process;
	const raw =
		trim(proc?.env?.CLERK_OAUTH_CLIENT_ID ?? "") ||
		trim(_env?.CLERK_OAUTH_CLIENT_ID) ||
		"";
	return (
		raw
			.split(",")
			.map((id) => id.trim())
			.find((id) => id !== "" && id !== "*" && !/^https?:\/\//i.test(id)) ?? ""
	);
}
