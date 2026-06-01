/**
 * Clerk auth host policy — docs/CLERK-AUTH.md
 *
 * accounts.aadm.io = Clerk hosted Account Portal (CNAME — sign-in/up only).
 * aadm.io/member = embedded UserProfile; legacy /user and /account redirect to Clerk.
 */
import { trim } from './site-urls';

export const ACCOUNTS_HOST_DEFAULT = 'accounts.aadm.io';

/** Path prefixes served only on the accounts host (Clerk login area). */
export const CLERK_AUTH_PATH_PREFIXES = ['/sign-in', '/sign-up', '/user', '/account'] as const;

export function isClerkAuthPath(pathname: string): boolean {
	const path = pathname.replace(/\/+$/, '') || '/';
	return CLERK_AUTH_PATH_PREFIXES.some(
		(prefix) => path === prefix || path.startsWith(`${prefix}/`),
	);
}

export function accountsOriginFromEnv(env: ImportMetaEnv): string {
	const signIn = trim(env.PUBLIC_CLERK_SIGN_IN_URL) || 'https://accounts.aadm.io/sign-in';
	try {
		return new URL(signIn).origin;
	} catch {
		return 'https://accounts.aadm.io';
	}
}

export function marketingHostFromEnv(env: ImportMetaEnv): string {
	const marketing = trim(env.PUBLIC_MCP_QUICKSTART_URL) || 'https://aadm.io/mcp';
	try {
		return new URL(marketing).hostname;
	} catch {
		return 'aadm.io';
	}
}

/** True when request is on the marketing host (aadm.io), not accounts or localhost. */
export function isMarketingHost(hostname: string, env: ImportMetaEnv): boolean {
	if (hostname === 'localhost' || hostname === '127.0.0.1') {
		return false;
	}
	const marketing = marketingHostFromEnv(env);
	return hostname === marketing || hostname === `www.${marketing}`;
}

export function redirectAuthPathToAccounts(request: Request, env: ImportMetaEnv): Response | null {
	const url = new URL(request.url);
	if (!isMarketingHost(url.hostname, env) || !isClerkAuthPath(url.pathname)) {
		return null;
	}
	const target = new URL(url.pathname + url.search, accountsOriginFromEnv(env));
	return Response.redirect(target, 307);
}
