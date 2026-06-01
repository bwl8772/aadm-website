import { trim, URL_ACCOUNT_USER } from './site-urls';

/**
 * CANONICAL AUTH URLS — see docs/CLERK-AUTH.md
 *
 * Login/account: Clerk hosted Account Portal at accounts.aadm.io (Clerk CNAME — do not repoint).
 * aadm.io: marketing + MCP setup only. Session state via @clerk/astro; login UI on Clerk only.
 */
export const CLERK_ACCOUNTS_SIGN_IN = 'https://accounts.aadm.io/sign-in';
export const CLERK_ACCOUNTS_SIGN_UP = 'https://accounts.aadm.io/sign-up';

export type ClerkPortalUrls = {
	signInUrl: string;
	signUpUrl: string;
	/** Clerk hosted UserProfile — accounts.aadm.io/user (API keys, profile). */
	accountUserUrl: string;
};

export type ClerkIntegrationOptions = {
	signInUrl: string;
	signUpUrl: string;
	authorizedParties?: string[];
};

function accountUserBase(env: ImportMetaEnv): string {
	return trim(env.PUBLIC_CLERK_USER_PROFILE_URL) || URL_ACCOUNT_USER;
}

function authorizedPartiesFromEnv(env: ImportMetaEnv): string[] {
	return (trim(env.PUBLIC_CLERK_AUTHORIZED_PARTIES) || '')
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}

/** Marketing site origin — post-auth redirect target for Account Portal links. */
export function marketingOriginFromEnv(env: ImportMetaEnv): string {
	const quickstart = trim(env.PUBLIC_MCP_QUICKSTART_URL) || 'https://aadm.io/mcp';
	try {
		return new URL(quickstart).origin;
	} catch {
		return 'https://aadm.io';
	}
}

/** Append Clerk Account Portal `redirect_url` so users return to aadm.io after auth. */
export function withAccountPortalRedirect(portalUrl: string, returnPath: string, env: ImportMetaEnv): string {
	const origin = marketingOriginFromEnv(env);
	const path = returnPath.startsWith('/') ? returnPath : `/${returnPath}`;
	const returnTo = returnPath.startsWith('http') ? returnPath : `${origin}${path}`;
	try {
		const url = new URL(portalUrl);
		url.searchParams.set('redirect_url', returnTo);
		return url.toString();
	} catch {
		return portalUrl;
	}
}

/** Options for `clerk()` integration and `clerkMiddleware()` — Account Portal URLs on accounts.aadm.io. */
export function getClerkIntegrationOptions(env: ImportMetaEnv): ClerkIntegrationOptions {
	const authorizedParties = authorizedPartiesFromEnv(env);
	return {
		signInUrl: trim(env.PUBLIC_CLERK_SIGN_IN_URL) || CLERK_ACCOUNTS_SIGN_IN,
		signUpUrl: trim(env.PUBLIC_CLERK_SIGN_UP_URL) || CLERK_ACCOUNTS_SIGN_UP,
		...(authorizedParties.length > 0 ? { authorizedParties } : {}),
	};
}

/**
 * Subscriber auth links → accounts.aadm.io (Clerk Account Portal).
 * Pass `returnPath` (e.g. Astro.url.pathname + search) to send users back after sign-in/up.
 */
export function getClerkPortalUrls(env: ImportMetaEnv, returnPath?: string): ClerkPortalUrls {
	const signInBase = trim(env.PUBLIC_CLERK_SIGN_IN_URL) || CLERK_ACCOUNTS_SIGN_IN;
	const signUpBase = trim(env.PUBLIC_CLERK_SIGN_UP_URL) || CLERK_ACCOUNTS_SIGN_UP;
	const path = returnPath ?? '/';
	return {
		signInUrl: withAccountPortalRedirect(signInBase, path, env),
		signUpUrl: withAccountPortalRedirect(signUpBase, path, env),
		accountUserUrl: accountUserBase(env),
	};
}
