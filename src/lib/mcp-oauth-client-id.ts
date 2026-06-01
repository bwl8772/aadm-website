import { trim } from './site-urls';

/** Shared Clerk OAuth app Client ID — runtime on Astro SSR (`CLERK_OAUTH_CLIENT_ID`) or build-time `PUBLIC_*`. */
export function mcpOAuthClientIdForDisplay(env: ImportMetaEnv): string {
	const runtime =
		typeof process !== 'undefined' ? trim(process.env.CLERK_OAUTH_CLIENT_ID) : '';
	if (runtime) return runtime;
	return trim(env.PUBLIC_MCP_OAUTH_CLIENT_ID);
}
