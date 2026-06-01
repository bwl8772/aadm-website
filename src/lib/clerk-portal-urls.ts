import { trim, URL_ACCOUNT_USER, getSiteUrlConfig } from './site-urls';

/**
 * CANONICAL AUTH URLS — see docs/CLERK-AUTH.md
 *
 * Login/account: Clerk hosted Account Portal at accounts.aadm.io (Clerk CNAME — do not repoint).
 * aadm.io: marketing + MCP setup only. OAuth client_id copy: aadm.io/mcp#connect-oauth.
 */
const DEFAULT_SIGN_IN = 'https://accounts.aadm.io/sign-in';
const DEFAULT_SIGN_UP = 'https://accounts.aadm.io/sign-up';

export type ClerkPortalUrls = {
	signInUrl: string;
	signUpUrl: string;
	/** Clerk hosted UserProfile — accounts.aadm.io/user (API keys, profile). */
	accountUserUrl: string;
	/** Public MCP setup anchor — OAuth Client ID copy (not login). */
	accountMcpOAuthUrl: string;
};

function accountUserBase(env: ImportMetaEnv): string {
	return trim(env.PUBLIC_CLERK_USER_PROFILE_URL) || URL_ACCOUNT_USER;
}

function mcpOAuthSetupUrl(env: ImportMetaEnv): string {
	const base = getSiteUrlConfig(env).urlMcpMarketing.replace(/#.*$/, '').replace(/\/+$/, '');
	return `${base}#connect-oauth`;
}

/** Subscriber links for marketing pages. Auth → accounts.aadm.io (Clerk). OAuth ID → /mcp setup. */
export function getClerkPortalUrls(env: ImportMetaEnv): ClerkPortalUrls {
	return {
		signInUrl: trim(env.PUBLIC_CLERK_SIGN_IN_URL) || DEFAULT_SIGN_IN,
		signUpUrl: trim(env.PUBLIC_CLERK_SIGN_UP_URL) || DEFAULT_SIGN_UP,
		accountUserUrl: accountUserBase(env),
		accountMcpOAuthUrl: mcpOAuthSetupUrl(env),
	};
}
