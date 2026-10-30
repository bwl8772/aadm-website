/**
 * Clerk auth host policy — docs/CLERK-AUTH.md
 *
 * accounts.aadm.io = Clerk hosted Account Portal (CNAME — sign-in/up only).
 * aadm.io/member = embedded UserProfile; legacy /user and /account redirect to Clerk.
 */
import { trim } from "./site-urls";

export const ACCOUNTS_HOST_DEFAULT = "accounts.aadm.io";

/** Path prefixes served only on the accounts host (Clerk login area). */
export const CLERK_AUTH_PATH_PREFIXES = [
	"/sign-in",
	"/sign-up",
	"/user",
	"/account",
] as const;

export function isClerkAuthPath(pathname: string): boolean {
	const path = pathname.replace(/\/+$/, "") || "/";
	return CLERK_AUTH_PATH_PREFIXES.some(
		(prefix) => path === prefix || path.startsWith(`${prefix}/`),
	);
}

export function accountsOriginFromEnv(env: ImportMetaEnv): string {
	const signIn =
		trim(env.PUBLIC_CLERK_SIGN_IN_URL) || "https://accounts.aadm.io/sign-in";
	try {
		return new URL(signIn).origin;
	} catch {
		return "https://accounts.aadm.io";
	}
}

export function marketingHostFromEnv(env: ImportMetaEnv): string {
	const marketing =
		trim(env.PUBLIC_MCP_QUICKSTART_URL) || "https://aadm.io/mcp";
	try {
		return new URL(marketing).hostname;
	} catch {
		return "aadm.io";
	}
}

function marketingHostsFromEnv(env: ImportMetaEnv): Set<string> {
	const hosts = new Set<string>(["aadm.io", "www.aadm.io"]);
	const marketing = marketingHostFromEnv(env);
	hosts.add(marketing);
	hosts.add(`www.${marketing}`);
	for (const party of (trim(env.PUBLIC_CLERK_AUTHORIZED_PARTIES) || "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean)) {
		try {
			hosts.add(new URL(party).hostname);
		} catch {
			/* skip invalid authorized party */
		}
	}
	return hosts;
}

/** True when request is on the marketing host (aadm.io), not accounts or localhost. */
export function isMarketingHost(hostname: string, env: ImportMetaEnv): boolean {
	if (hostname === "localhost" || hostname === "127.0.0.1") {
		return false;
	}
	return marketingHostsFromEnv(env).has(hostname);
}

export function redirectAuthPathToAccounts(
	request: Request,
	env: ImportMetaEnv,
): Response | null {
	const url = new URL(request.url);
	if (!isMarketingHost(url.hostname, env) || !isClerkAuthPath(url.pathname)) {
		return null;
	}
	const target = new URL(url.pathname + url.search, accountsOriginFromEnv(env));
	return Response.redirect(target, 307);
}

/* ---- Unsigned private routes: what the browser gets ---- */

/** `@clerk/backend` AuthErrorReason.SessionTokenAndUATMissing — the browser sent no Clerk cookies. */
export const CLERK_REASON_NO_COOKIES = "session-token-and-uat-missing";

/** Counts recovery passes for a minute so an unverifiable session cannot loop. */
export const AUTH_BOUNCE_COOKIE = "aadm_auth_bounce";
export const AUTH_BOUNCE_MAX = 2;
export const AUTH_BOUNCE_TTL_S = 60;

export type UnsignedDecision = "sign_in" | "recover" | "stop";

/**
 * Decision table for an unsigned request to a private route.
 * - No Clerk cookies → the Account Portal (`sign_in`).
 * - Cookies the server could not verify (bad secret key, exhausted handshake,
 *   foreign `azp`, bad signature) → one recovery page where clerk-js reconciles
 *   (`recover`). Sending these to the Portal is the redirect loop: the Portal
 *   still holds the client and bounces straight back.
 * - AUTH_BOUNCE_MAX recovery passes inside AUTH_BOUNCE_TTL_S → a visible error
 *   with the request id (`stop`), never another bounce (ARCH-25, RES-04).
 */
export function decideUnsigned(
	reason: string | null | undefined,
	bounces: number,
): UnsignedDecision {
	if (!reason || reason === CLERK_REASON_NO_COOKIES) return "sign_in";
	return bounces >= AUTH_BOUNCE_MAX ? "stop" : "recover";
}

export function readBounceCount(cookieHeader: string | null): number {
	const match = cookieHeader?.match(
		new RegExp(`(?:^|;\\s*)${AUTH_BOUNCE_COOKIE}=(\\d+)`),
	);
	const count = match ? Number(match[1]) : 0;
	return Number.isFinite(count) ? count : 0;
}
