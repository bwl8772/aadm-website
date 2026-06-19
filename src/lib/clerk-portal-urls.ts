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
/** Clerk Frontend API CNAME for aadm.io satellite handshake — see docs/CLERK-AUTH.md */
export const CLERK_SATELLITE_FAPI_PROXY_DEFAULT = "https://clerk.aadm.io";

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
	isSatellite?: boolean;
	domain?: string;
	proxyUrl?: string;
};

function authorizedPartiesFromEnv(env: ImportMetaEnv): string[] {
	return (trim(env.PUBLIC_CLERK_AUTHORIZED_PARTIES) || "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
}

function clerkDomainFromEnv(env: ImportMetaEnv): string {
	const configured = trim(env.PUBLIC_CLERK_DOMAIN);
	if (configured) return configured;
	return new URL(marketingOriginFromEnv(env)).hostname;
}

function proxyUrlFromEnv(env: ImportMetaEnv): string | undefined {
	const url =
		trim(env.PUBLIC_CLERK_PROXY_URL) || trim(env.CLERK_PROXY_URL) || "";
	return url || undefined;
}

/** Satellite apps need FAPI proxy; default clerk.aadm.io when unset. */
export function effectiveClerkProxyUrl(env: ImportMetaEnv): string | undefined {
	const configured = proxyUrlFromEnv(env);
	if (configured) return configured;
	if (isClerkSatelliteFromEnv(env)) return CLERK_SATELLITE_FAPI_PROXY_DEFAULT;
	return undefined;
}

/**
 * aadm.io hosts the app; accounts.aadm.io is Clerk Account Portal (primary auth).
 * Without satellite mode + sync param, sign-in loops: accounts → /member → sign-in → …
 */
export function isClerkSatelliteFromEnv(env: ImportMetaEnv): boolean {
	const explicit = trim(env.PUBLIC_CLERK_IS_SATELLITE);
	if (explicit) {
		return explicit.toLowerCase() === "true" || explicit === "1";
	}
	const signIn =
		trim(env.PUBLIC_CLERK_SIGN_IN_URL) || CLERK_ACCOUNTS_SIGN_IN;
	try {
		const signInHost = new URL(signIn).hostname;
		const marketingHost = new URL(marketingOriginFromEnv(env)).hostname;
		return signInHost !== marketingHost;
	} catch {
		return false;
	}
}

/** Matches Clerk `ClerkSyncStatus.NeedsSync` — session not yet on the satellite host. */
export const CLERK_SYNC_NEEDS_SYNC = "false";

/** True when user just returned from Account Portal and satellite handshake must run. */
export function isSatelliteHandshakePending(request: Request): boolean {
	try {
		return (
			new URL(request.url).searchParams.get("__clerk_synced") ===
			CLERK_SYNC_NEEDS_SYNC
		);
	} catch {
		return false;
	}
}

/** Satellite return URLs need __clerk_synced=false so handshake runs on aadm.io. */
function withSatelliteSyncParam(returnTo: string, env: ImportMetaEnv): string {
	if (!isClerkSatelliteFromEnv(env)) return returnTo;
	try {
		const url = new URL(returnTo);
		url.searchParams.set("__clerk_synced", CLERK_SYNC_NEEDS_SYNC);
		return url.toString();
	} catch {
		return returnTo;
	}
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
	const syncedReturnTo = withSatelliteSyncParam(returnTo, env);
	try {
		const url = new URL(portalUrl);
		url.searchParams.set("redirect_url", syncedReturnTo);
		return url.toString();
	} catch {
		return portalUrl;
	}
}

/** Options for `clerk()` integration and `clerkMiddleware()` — Account Portal on accounts.aadm.io; aadm.io is satellite. */
export function getClerkIntegrationOptions(
	env: ImportMetaEnv,
): ClerkIntegrationOptions {
	const authorizedParties = authorizedPartiesFromEnv(env);
	const satellite = isClerkSatelliteFromEnv(env);
	const proxyUrl = effectiveClerkProxyUrl(env);
	return {
		signInUrl: trim(env.PUBLIC_CLERK_SIGN_IN_URL) || CLERK_ACCOUNTS_SIGN_IN,
		signUpUrl: trim(env.PUBLIC_CLERK_SIGN_UP_URL) || CLERK_ACCOUNTS_SIGN_UP,
		...(authorizedParties.length > 0 ? { authorizedParties } : {}),
		...(satellite ? { isSatellite: true } : {}),
		// Clerk: on satellite, proxyUrl replaces domain — never set both.
		...(proxyUrl
			? { proxyUrl }
			: satellite
				? { domain: clerkDomainFromEnv(env) }
				: {}),
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
 * Pass `returnPath` to override post-auth redirect (defaults to member area).
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
	const path = returnPath ?? memberAreaPathFromEnv(env);
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
