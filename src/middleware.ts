import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";
import { redirectAuthPathToAccounts } from "./lib/clerk-auth-policy";
import {
	getClerkIntegrationOptions,
	redirectSatelliteFapiPath,
} from "./lib/clerk-portal-urls";
import {
	MEMBER_API_KEYS_SEGMENT,
	MEMBER_AREA_PATH,
	MEMBER_BEARER_SEGMENT,
} from "./lib/member-area";
import { clerkPrivateRoutePatternsFromEnv } from "./lib/routes";

/**
 * Clerk middleware + marketing-host guard.
 *
 * POLICY (docs/CLERK-AUTH.md): Sign-in on accounts.aadm.io; member UI on aadm.io/member.
 * Auth paths on aadm.io redirect to accounts.aadm.io — no embedded SignIn on marketing host.
 *
 * Satellite: clerk-js sync hits `/v1/*` on aadm.io; we 302 to clerk.aadm.io FAPI.
 *
 * @see https://clerk.com/docs/reference/astro/clerk-middleware
 */
const isPrivateRoute = createRouteMatcher([
	...clerkPrivateRoutePatternsFromEnv(import.meta.env),
]);
const clerkOptions = getClerkIntegrationOptions(import.meta.env);

export const onRequest = clerkMiddleware((auth, context, next) => {
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

	const { isAuthenticated } = auth();
	if (!isAuthenticated) {
		// Do not 307 to accounts.aadm.io/sign-in?redirect_url=/member here.
		// That URL is the bounce loop: portal sends the browser back to /member,
		// SSR still has no session, and redirectToSignIn() fires again.
		// Let MemberSatelliteSyncPage run clerk-js on this host (no credentials).
		context.locals.satelliteSyncPending = true;
		return next();
	}

	// Legacy fifth tab: /member/bearer → API keys (bearer how-to + Clerk key UI).
	// Bare /member → API keys (Astro tabs; default panel).
	const path = new URL(context.request.url).pathname.replace(/\/+$/, "") || "/";
	if (path === MEMBER_AREA_PATH) {
		return context.redirect(`${MEMBER_AREA_PATH}/${MEMBER_API_KEYS_SEGMENT}`);
	}
	if (path === `${MEMBER_AREA_PATH}/${MEMBER_BEARER_SEGMENT}`) {
		return context.redirect(`${MEMBER_AREA_PATH}/${MEMBER_API_KEYS_SEGMENT}`);
	}

	return next();
}, clerkOptions);
