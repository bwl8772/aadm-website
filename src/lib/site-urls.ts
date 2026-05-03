/** Shared env-derived URLs for marketing pages (Astro `import.meta.env`). */

export function trim(v: string | undefined): string {
	return typeof v === 'string' ? v.trim() : '';
}

/** `PUBLIC_MCP_REPO_URL` may be origin-only; JSON-RPC expects `/mcp`. */
export function normalizeMcpRpcUrl(raw: string): string {
	const DEFAULT = 'https://mcp.aadm.io/mcp';
	const v = raw.trim();
	if (!v) return DEFAULT;
	try {
		const u = new URL(v);
		if (u.pathname === '/' || u.pathname === '') {
			return `${u.origin}/mcp`;
		}
		return `${u.origin}${u.pathname.replace(/\/+$/, '')}`;
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

export function getSiteUrlConfig(env: ImportMetaEnv): SiteUrlConfig {
	const urlStandard = trim(env.PUBLIC_STANDARD_REPO_URL) || '#configure-standard-url';
	const urlMcpRaw = trim(env.PUBLIC_MCP_REPO_URL);
	const urlMcpEndpoint = normalizeMcpRpcUrl(urlMcpRaw || 'https://mcp.aadm.io');
	const urlMcpQuickstart = trim(env.PUBLIC_MCP_QUICKSTART_URL) || 'https://aadm.io/mcp';
	const urlMcpCustomerDocs = trim(env.PUBLIC_MCP_CUSTOMER_DOCS_URL);
	const hasMcpDocsLink = urlMcpQuickstart.length > 0 && !urlMcpQuickstart.startsWith('#');

	const urlClerkSignIn =
		trim(env.PUBLIC_CLERK_SIGN_IN_URL) || 'https://accounts.aadm.io/sign-in';
	const urlClerkSignUp =
		trim(env.PUBLIC_CLERK_SIGN_UP_URL) || 'https://accounts.aadm.io/sign-up';
	const urlClerkUserProfile =
		trim(env.PUBLIC_CLERK_USER_PROFILE_URL) || 'https://accounts.aadm.io/user';
	const urlClerkSignOut =
		trim(env.PUBLIC_CLERK_SIGN_OUT_URL) ||
		`${accountPortalOrigin(urlClerkSignIn)}/sign-out?redirect_url=${encodeURIComponent('https://aadm.io/')}`;

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
