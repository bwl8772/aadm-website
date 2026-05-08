import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { CLERK_POST_AUTH_DEFAULT_PATH } from "@/lib/clerk-redirects";

const isProtectedRoute = createRouteMatcher([
	"/profile(.*)",
	"/subscription(.*)",
	"/dashboard(.*)",
]);

/** `/oauth/mcp/*` is intentionally public (Clerk redirects back with `code`; user may not be in-app yet). */
export default clerkMiddleware(async (auth, request) => {
	const { userId } = await auth();
	if (userId && request.nextUrl.pathname === "/") {
		return NextResponse.redirect(new URL(CLERK_POST_AUTH_DEFAULT_PATH, request.url));
	}
	if (isProtectedRoute(request)) {
		await auth.protect();
	}
});

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
