import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";
import {
	AUTH_BOUNCE_COOKIE,
	AUTH_BOUNCE_TTL_S,
	decideUnsigned,
	readBounceCount,
	redirectAuthPathToAccounts,
} from "./lib/clerk-auth-policy";
import {
	getClerkIntegrationOptions,
	getSignInUrlForRequest,
	redirectSatelliteFapiPath,
} from "./lib/clerk-portal-urls";
import {
	MEMBER_API_KEYS_SEGMENT,
	MEMBER_AREA_PATH,
	MEMBER_BEARER_SEGMENT,
} from "./lib/member-area";
import { clerkPrivateRoutePatternsFromEnv } from "./lib/routes";
import { logServer } from "./lib/server-log";

/**
 * Clerk middleware + marketing-host guard.
 *
 * POLICY (docs/CLERK-AUTH.md): sign-in on accounts.aadm.io; member UI on
 * aadm.io/member; Field on aadm.io/field/main. Auth paths on aadm.io redirect
 * to accounts.aadm.io — no embedded SignIn on the marketing host.
 *
 * Private routes (src/lib/routes.ts) when unsigned — `decideUnsigned`:
 * - no Clerk cookies            → 302 to the Account Portal, back here after sign-in
 * - cookies we could not verify → 200 SessionGatePage "recover" (no private content);
 *                                  clerk-js reconciles once, then reloads or signs in
 * - second pass within a minute → 200 SessionGatePage "stop" with the request id
 * Clerk's own handshake (expired token → 307 to the Frontend API) runs inside
 * clerkMiddleware before this handler and is untouched. Every private response
 * is `Cache-Control: no-store` (XO-05) and writes one JSON log line (OBS-01).
 *
 * Satellite FAPI (off today): clerk-js sync hits `/v1/*` on aadm.io; 302 to clerk.aadm.io.
 *
 * @see https://clerk.com/docs/reference/astro/clerk-middleware
 */
const isPrivateRoute = createRouteMatcher([
	...clerkPrivateRoutePatternsFromEnv(import.meta.env),
]);
const clerkOptions = getClerkIntegrationOptions(import.meta.env);

function noStore(res: Response): Response {
	res.headers.set("Cache-Control", "no-store");
	return res;
}

export const onRequest = clerkMiddleware(async (auth, context, next) => {
	const fapiRedirect = redirectSatelliteFapiPath(
		context.request,
		import.meta.env,
	);
	if (fapiRedirect) {
		return fapiRedirect;
	}

	const authRedirect = redirectAuthPathToAccounts(
		context.request,
		import.meta.env,
	);
	if (authRedirect) {
		return authRedirect;
	}

	if (!isPrivateRoute(context.request)) {
		return next();
	}

	const started = Date.now();
	const requestId = crypto.randomUUID();
	context.locals.requestId = requestId;
	const url = new URL(context.request.url);
	const route = url.pathname;
	const log = (
		level: "info" | "warn" | "error",
		code: string,
		actorId: string | null,
		extra: Record<string, unknown> = {},
	) =>
		logServer({
			level,
			route,
			request_id: requestId,
			code,
			actor_id: actorId,
			latency_ms: Date.now() - started,
			...extra,
		});
	const bounces = readBounceCount(context.request.headers.get("cookie"));

	const { isAuthenticated, userId } = auth();
	if (!isAuthenticated) {
		const reason = context.locals.authReason ?? null;
		const decision = decideUnsigned(reason, bounces);
		if (decision === "sign_in") {
			log("info", "unauthenticated", null, { clerk_reason: reason });
			return noStore(
				context.redirect(
					getSignInUrlForRequest(context.request, import.meta.env),
				),
			);
		}
		if (decision === "recover") {
			context.cookies.set(AUTH_BOUNCE_COOKIE, String(bounces + 1), {
				path: "/",
				maxAge: AUTH_BOUNCE_TTL_S,
				httpOnly: true,
				sameSite: "lax",
				secure: url.protocol === "https:",
			});
		} else {
			context.cookies.delete(AUTH_BOUNCE_COOKIE, { path: "/" });
		}
		context.locals.sessionGate = {
			state: decision,
			request_id: requestId,
			reason,
		};
		log(
			decision === "stop" ? "error" : "warn",
			decision === "stop" ? "auth_unconfirmed" : "auth_recover",
			null,
			{ clerk_reason: reason, bounces },
		);
		return noStore(await next());
	}

	if (bounces > 0) {
		context.cookies.delete(AUTH_BOUNCE_COOKIE, { path: "/" });
	}

	// Legacy fifth tab: /member/bearer → API keys (bearer how-to + Clerk key UI).
	// Bare /member → API keys (Astro tabs; default panel).
	const path = route.replace(/\/+$/, "") || "/";
	if (path === MEMBER_AREA_PATH) {
		return noStore(
			context.redirect(`${MEMBER_AREA_PATH}/${MEMBER_API_KEYS_SEGMENT}`),
		);
	}
	if (path === `${MEMBER_AREA_PATH}/${MEMBER_BEARER_SEGMENT}`) {
		return noStore(
			context.redirect(`${MEMBER_AREA_PATH}/${MEMBER_API_KEYS_SEGMENT}`),
		);
	}

	const res = noStore(await next());
	log("info", "ok", userId ?? null);
	return res;
}, clerkOptions);
