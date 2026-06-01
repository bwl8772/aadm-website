import { trim } from './site-urls';

/** Clerk OAuth app Client ID — server-only on protected /member (CLERK_OAUTH_CLIENT_ID). */
export function mcpOAuthClientIdForDisplay(env: ImportMetaEnv): string {
	return trim(env.CLERK_OAUTH_CLIENT_ID) || trim(env.PUBLIC_CLERK_OAUTH_CLIENT_ID) || '';
}
