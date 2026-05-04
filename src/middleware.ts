import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';
import { clerkPrivateRoutePatterns } from './lib/routes';

/**
 * Opt-in private routes only (Clerk pattern — not “protect everything”).
 *
 * Public marketing: `/`, `/mcp`; probe: `/health`. All other paths stay public unless listed in
 * `clerkPrivateRoutePatterns` (see `src/lib/routes.ts`; list more specific patterns before broad ones).
 *
 * @see https://clerk.com/docs/reference/astro/clerk-middleware
 * @see https://clerk.com/docs/guides/configure/session-tasks (pending → finish tasks via Clerk)
 */
const isPrivateRoute = createRouteMatcher([...clerkPrivateRoutePatterns]);

export const onRequest = clerkMiddleware((auth, context, next) => {
	if (!isPrivateRoute(context.request)) {
		return next();
	}

	const { isAuthenticated, redirectToSignIn } = auth();

	// Covers signed-out and `pending` (session tasks not finished — org, MFA, etc.):
	// Clerk treats pending as not authenticated for gates by default; Account Portal finishes tasks.
	if (!isAuthenticated) {
		return redirectToSignIn();
	}

	return next();
});
