import { trim, URL_ACCOUNT_USER } from './site-urls';

/** Defaults match Account Portal host for aadm.io; override per deploy via `PUBLIC_*`. */
const DEFAULT_SIGN_IN = 'https://accounts.aadm.io/sign-in';
const DEFAULT_SIGN_UP = 'https://accounts.aadm.io/sign-up';

export type ClerkPortalUrls = {
	signInUrl: string;
	signUpUrl: string;
	/** Clerk Account Portal profile (accounts.aadm.io/user). */
	accountUserUrl: string;
	/** Astro subscriber page — shared OAuth Client ID (`/account/mcp` on this site). */
	accountMcpOAuthUrl: string;
};

/** Full-page Account Portal links — work without `clerk.browser.js` (unlike modal `SignInButton`). */
export function getClerkPortalUrls(env: ImportMetaEnv): ClerkPortalUrls {
	const signInUrl = trim(env.PUBLIC_CLERK_SIGN_IN_URL) || DEFAULT_SIGN_IN;
	return {
		signInUrl,
		signUpUrl: trim(env.PUBLIC_CLERK_SIGN_UP_URL) || DEFAULT_SIGN_UP,
		accountUserUrl: trim(env.PUBLIC_CLERK_USER_PROFILE_URL) || URL_ACCOUNT_USER,
		accountMcpOAuthUrl: '/account/mcp',
	};
}
