import { trim, URL_ACCOUNT_USER } from './site-urls';

/** Defaults match Account Portal host for aadm.io; override per deploy via `PUBLIC_*`. */
const DEFAULT_SIGN_IN = 'https://accounts.aadm.io/sign-in';
const DEFAULT_SIGN_UP = 'https://accounts.aadm.io/sign-up';

export type ClerkPortalUrls = {
	signInUrl: string;
	signUpUrl: string;
	accountUserUrl: string;
	/** MCP tokens + OAuth Client ID (authenticated dashboard). */
	accountMcpTokensUrl: string;
};

/** Full-page Account Portal links — work without `clerk.browser.js` (unlike modal `SignInButton`). */
export function getClerkPortalUrls(env: ImportMetaEnv): ClerkPortalUrls {
	const signInUrl = trim(env.PUBLIC_CLERK_SIGN_IN_URL) || DEFAULT_SIGN_IN;
	let accountOrigin = 'https://accounts.aadm.io';
	try {
		accountOrigin = new URL(signInUrl).origin;
	} catch {
		/* keep default */
	}
	return {
		signInUrl,
		signUpUrl: trim(env.PUBLIC_CLERK_SIGN_UP_URL) || DEFAULT_SIGN_UP,
		accountUserUrl: trim(env.PUBLIC_CLERK_USER_PROFILE_URL) || URL_ACCOUNT_USER,
		accountMcpTokensUrl: `${accountOrigin}/dashboard/tokens`,
	};
}
