import { FIELD_HOME_PATH } from "./field-area";
import { memberAreaPathFromEnv } from "./member-area";

/**
 * Protected route patterns for clerkMiddleware — see docs/CLERK-AUTH.md.
 * Login UI stays on accounts.aadm.io; member area is embedded on aadm.io/member.
 * Field home is `/field/main` only — never `/field(.*)` (public `/field` stays public).
 */
export function clerkPrivateRoutePatternsFromEnv(env: ImportMetaEnv): string[] {
	return [`${memberAreaPathFromEnv(env)}(.*)`, `${FIELD_HOME_PATH}(.*)`];
}
