import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";
import { redirectAuthPathToAccounts } from "./lib/clerk-auth-policy";
import { getClerkIntegrationOptions } from "./lib/clerk-portal-urls";
import { clerkPrivateRoutePatternsFromEnv } from "./lib/routes";

/**
 * Clerk middleware + marketing-host guard.
 *
 * POLICY (docs/CLERK-AUTH.md): Sign-in on accounts.aadm.io; member UI on aadm.io/member.
 * Auth paths on aadm.io redirect to accounts.aadm.io — no embedded SignIn on marketing host.
 *
 * @see https://clerk.com/docs/reference/astro/clerk-middleware
 */
const isPrivateRoute = createRouteMatcher([
	...clerkPrivateRoutePatternsFromEnv(import.meta.env),
]);
const clerkOptions = getClerkIntegrationOptions(import.meta.env);

export const onRequest = clerkMiddleware((auth, context, next) => {
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

	const { isAuthenticated, redirectToSignIn } = auth();
	if (!isAuthenticated) {
		return redirectToSignIn();
	}

	return next();
}, clerkOptions);
