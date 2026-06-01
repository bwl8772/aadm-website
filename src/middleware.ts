import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';
import { redirectAuthPathToAccounts } from './lib/clerk-auth-policy';
import { clerkPrivateRoutePatterns } from './lib/routes';

/**
 * Clerk middleware + marketing-host guard.
 *
 * POLICY (docs/CLERK-AUTH.md): The entire login area is Clerk on accounts.aadm.io only.
 * Auth paths on aadm.io redirect to accounts.aadm.io — no login surface on marketing host.
 *
 * @see https://clerk.com/docs/reference/astro/clerk-middleware
 */
const isPrivateRoute = createRouteMatcher([...clerkPrivateRoutePatterns]);

export const onRequest = clerkMiddleware((auth, context, next) => {
	const authRedirect = redirectAuthPathToAccounts(context.request, import.meta.env);
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
});
