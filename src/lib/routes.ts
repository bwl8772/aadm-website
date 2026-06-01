import { memberAreaPathFromEnv } from "./member-area";

/**
 * Protected route patterns for clerkMiddleware — see docs/CLERK-AUTH.md.
 * Login UI stays on accounts.aadm.io; member area is embedded on aadm.io/member.
 */
export function clerkPrivateRoutePatternsFromEnv(
	env: ImportMetaEnv,
): string[] {
	return [`${memberAreaPathFromEnv(env)}(.*)`];
}
