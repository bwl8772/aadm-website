/** Shared env-derived URLs for marketing pages (Astro `import.meta.env`). */

export function trim(v: string | undefined): string {
	return typeof v === 'string' ? v.trim() : '';
}

/** Normalize MCP URL. The endpoint is the origin itself (e.g. `https://mcp.aadm.io`), not `/mcp`. */
export function normalizeMcpRpcUrl(raw: string): string {
	const DEFAULT = 'https://mcp.aadm.io';
	const v = raw.trim();
	if (!v) return DEFAULT;
	try {
		const u = new URL(v);
		return `${u.origin}${u.pathname === '/' ? '' : u.pathname.replace(/\/+$/, '')}`;
	} catch {
		return DEFAULT;
	}
}

function accountPortalOrigin(signInUrl: string): string {
	try {
		return new URL(signInUrl).origin;
	} catch {
		return 'https://accounts.aadm.io';
	}
}

/** Canonical public origin for static marketing deploys (Railway / aadm.io). */
export const SITE_CANONICAL_ORIGIN = 'https://aadm.io';

/** After Clerk Account Portal sign-out, users always land on the public About page. */
export const CLERK_SIGN_OUT_REDIRECT_URL = 'https://aadm.io/';

/**
 * Clerk Account Portal entry URLs should include `redirect_url` (Clerk docs — direct links).
 * Appends or overwrites the query param so post-auth return is deterministic.
 */
export function appendAccountPortalRedirect(portalPageUrl: string, redirectAfterAuth: string): string {
	const raw = trim(portalPageUrl);
	const dest = trim(redirectAfterAuth);
	if (!raw || !dest) return raw;
	try {
		const u = new URL(raw);
		u.searchParams.set('redirect_url', dest);
		return u.toString();
	} catch {
		return raw;
	}
}

/**
 * Build the URL users should return to after Account Portal sign-in/up, for static pages.
 */
export function clerkReturnUrlForPathname(env: ImportMetaEnv, pathname: string, search: string): string {
	const origin = trim(env.PUBLIC_SITE_URL) || SITE_CANONICAL_ORIGIN;
	try {
		return new URL(`${pathname || '/'}${search || ''}`, origin).href;
	} catch {
		return CLERK_SIGN_OUT_REDIRECT_URL;
	}
}

/**
 * Clerk sign-out URL with `redirect_url` always set to {@link CLERK_SIGN_OUT_REDIRECT_URL}.
 * If `PUBLIC_CLERK_SIGN_OUT_URL` is set (e.g. non-default portal path), it is used as the base; the redirect query is still forced.
 */
export function buildClerkSignOutUrl(signOutOverride: string | undefined, signInUrl: string): string {
	const redirect = CLERK_SIGN_OUT_REDIRECT_URL;
	const raw = trim(signOutOverride);
	const fallback = `${accountPortalOrigin(signInUrl)}/sign-out?redirect_url=${encodeURIComponent(redirect)}`;
	if (!raw) return fallback;
	try {
		const u = new URL(raw, accountPortalOrigin(signInUrl));
		u.searchParams.set('redirect_url', redirect);
		return u.toString();
	} catch {
		return fallback;
	}
}

export type SiteUrlConfig = {
	urlStandard: string;
	urlMcpEndpoint: string;
	urlMcpQuickstart: string;
	urlMcpCustomerDocs: string;
	hasMcpDocsLink: boolean;
	urlClerkSignIn: string;
	urlClerkSignUp: string;
	urlClerkUserProfile: string;
	urlClerkSignOut: string;
	clerkPublishableKey: string;
	clerkSatelliteDomain: string;
	healthUrl: string;
	discoveryUrl: string;
	curlInit: string;
};

export function getSiteUrlConfig(
	env: ImportMetaEnv,
	opts?: { clerkReturnAfterAuth?: string },
): SiteUrlConfig {
	const urlStandard = trim(env.PUBLIC_STANDARD_REPO_URL) || '#configure-standard-url';
	const urlMcpRaw = trim(env.PUBLIC_MCP_REPO_URL);
	const urlMcpEndpoint = normalizeMcpRpcUrl(urlMcpRaw || 'https://mcp.aadm.io');
	const urlMcpQuickstart = trim(env.PUBLIC_MCP_QUICKSTART_URL) || 'https://aadm.io/mcp';
	const urlMcpCustomerDocs = trim(env.PUBLIC_MCP_CUSTOMER_DOCS_URL);
	const hasMcpDocsLink = urlMcpQuickstart.length > 0 && !urlMcpQuickstart.startsWith('#');

	const urlClerkSignInBase =
		trim(env.PUBLIC_CLERK_SIGN_IN_URL) || 'https://accounts.aadm.io/sign-in';
	const urlClerkSignUpBase =
		trim(env.PUBLIC_CLERK_SIGN_UP_URL) || 'https://accounts.aadm.io/sign-up';
	const clerkReturnAfterAuth =
		trim(opts?.clerkReturnAfterAuth) ||
		trim(env.PUBLIC_CLERK_POST_AUTH_REDIRECT) ||
		CLERK_SIGN_OUT_REDIRECT_URL;
	const urlClerkSignIn = appendAccountPortalRedirect(urlClerkSignInBase, clerkReturnAfterAuth);
	const urlClerkSignUp = appendAccountPortalRedirect(urlClerkSignUpBase, clerkReturnAfterAuth);
	const urlClerkUserProfile =
		trim(env.PUBLIC_CLERK_USER_PROFILE_URL) || 'https://accounts.aadm.io/user';
	const urlClerkSignOut = buildClerkSignOutUrl(env.PUBLIC_CLERK_SIGN_OUT_URL, urlClerkSignInBase);

	const clerkPublishableKey = trim(env.PUBLIC_CLERK_PUBLISHABLE_KEY) || '';
	const clerkSatelliteDomain = trim(env.PUBLIC_CLERK_SATELLITE_DOMAIN) || '';

	let healthUrl = '';
	let discoveryUrl = '';
	try {
		if (urlMcpEndpoint) {
			const u = new URL(urlMcpEndpoint);
			healthUrl = `${u.origin}/health`;
			discoveryUrl = `${u.origin}/`;
		}
	} catch {
		/* ignore invalid PUBLIC_MCP_REPO_URL */
	}

	const curlInit = urlMcpEndpoint
		? `curl -s -X POST ${urlMcpEndpoint} \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"1.0.0"}}}'`
		: '';

	return {
		urlStandard,
		urlMcpEndpoint,
		urlMcpQuickstart,
		urlMcpCustomerDocs,
		hasMcpDocsLink,
		urlClerkSignIn,
		urlClerkSignUp,
		urlClerkUserProfile,
		urlClerkSignOut,
		clerkPublishableKey,
		clerkSatelliteDomain,
		healthUrl,
		discoveryUrl,
		curlInit,
	};
}
