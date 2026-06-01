import {
	MEMBER_MCP_OAUTH_SEGMENT,
	memberAreaPathFromEnv,
	memberAreaUrl,
	memberMcpOAuthTabUrl,
} from "./member-area";
import { trim } from "./site-urls";

/**
 * CANONICAL AUTH URLS — see docs/CLERK-AUTH.md
 *
 * Sign-in/up: Clerk Account Portal at accounts.aadm.io (CNAME — do not repoint).
 * Member area: protected aadm.io/member with embedded UserProfile.
 */
export const CLERK_ACCOUNTS_SIGN_IN = "https://accounts.aadm.io/sign-in";
export const CLERK_ACCOUNTS_SIGN_UP = "https://accounts.aadm.io/sign-up";

export type ClerkPortalUrls = {
	signInUrl: string;
	signUpUrl: string;
	/** Protected member area — aadm.io/member (embedded UserProfile). */
	memberAreaUrl: string;
	/** MCP OAuth custom tab — aadm.io/member/mcp-oauth */
	memberMcpOAuthUrl: string;
	/** Sign-in at accounts.aadm.io → return to aadm.io/member */
	memberSignInUrl: string;
	/** Sign-in at accounts.aadm.io → return to aadm.io/member/mcp-oauth */
	memberMcpOAuthSignInUrl: string;
	/** @deprecated Use memberAreaUrl — kept for gradual migration */
	accountUserUrl: string;
};

export type ClerkIntegrationOptions = {
	signInUrl: string;
	signUpUrl: string;
	authorizedParties?: string[];
};

function authorizedPartiesFromEnv(env: ImportMetaEnv): string[] {
	return (trim(env.PUBLIC_CLERK_AUTHORIZED_PARTIES) || "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
}

/** Marketing site origin — post-auth redirect target for Account Portal links. */
export function marketingOriginFromEnv(env: ImportMetaEnv): string {
	const quickstart =
		trim(env.PUBLIC_MCP_QUICKSTART_URL) || "https://aadm.io/mcp";
	try {
		return new URL(quickstart).origin;
	} catch {
		return "https://aadm.io";
	}
}

/** Append Clerk Account Portal `redirect_url` so users return to aadm.io after auth. */
export function withAccountPortalRedirect(
	portalUrl: string,
	returnPath: string,
	env: ImportMetaEnv,
): string {
	const origin = marketingOriginFromEnv(env);
	const path = returnPath.startsWith("/") ? returnPath : `/${returnPath}`;
	const returnTo = returnPath.startsWith("http")
		? returnPath
		: `${origin}${path}`;
	try {
		const url = new URL(portalUrl);
		url.searchParams.set("redirect_url", returnTo);
		return url.toString();
	} catch {
		return portalUrl;
	}
}

/** Options for `clerk()` integration and `clerkMiddleware()` — Account Portal URLs on accounts.aadm.io. */
export function getClerkIntegrationOptions(
	env: ImportMetaEnv,
): ClerkIntegrationOptions {
	const authorizedParties = authorizedPartiesFromEnv(env);
	return {
		signInUrl: trim(env.PUBLIC_CLERK_SIGN_IN_URL) || CLERK_ACCOUNTS_SIGN_IN,
		signUpUrl: trim(env.PUBLIC_CLERK_SIGN_UP_URL) || CLERK_ACCOUNTS_SIGN_UP,
		...(authorizedParties.length > 0 ? { authorizedParties } : {}),
	};
}

/** Sign-in at accounts.aadm.io with return to member area after auth. */
export function getMemberSignInUrl(env: ImportMetaEnv): string {
	const signInBase =
		trim(env.PUBLIC_CLERK_SIGN_IN_URL) || CLERK_ACCOUNTS_SIGN_IN;
	return withAccountPortalRedirect(signInBase, memberAreaPathFromEnv(env), env);
}

/** Sign-in at accounts.aadm.io with return to MCP OAuth tab after auth. */
export function getMemberMcpOAuthSignInUrl(env: ImportMetaEnv): string {
	const signInBase =
		trim(env.PUBLIC_CLERK_SIGN_IN_URL) || CLERK_ACCOUNTS_SIGN_IN;
	const oauthPath = `${memberAreaPathFromEnv(env)}/${MEMBER_MCP_OAUTH_SEGMENT}`;
	return withAccountPortalRedirect(signInBase, oauthPath, env);
}

/**
 * Auth links for marketing pages.
 * Pass `returnPath` for sign-in/up redirect (defaults to current page).
 * Member credential URLs always point at aadm.io/member.
 */
export function getClerkPortalUrls(
	env: ImportMetaEnv,
	returnPath?: string,
): ClerkPortalUrls {
	const signInBase =
		trim(env.PUBLIC_CLERK_SIGN_IN_URL) || CLERK_ACCOUNTS_SIGN_IN;
	const signUpBase =
		trim(env.PUBLIC_CLERK_SIGN_UP_URL) || CLERK_ACCOUNTS_SIGN_UP;
	const path = returnPath ?? "/";
	const member = memberAreaUrl(env);
	return {
		signInUrl: withAccountPortalRedirect(signInBase, path, env),
		signUpUrl: withAccountPortalRedirect(signUpBase, path, env),
		memberAreaUrl: member,
		memberMcpOAuthUrl: memberMcpOAuthTabUrl(env),
		memberSignInUrl: getMemberSignInUrl(env),
		memberMcpOAuthSignInUrl: getMemberMcpOAuthSignInUrl(env),
		accountUserUrl: member,
	};
}
