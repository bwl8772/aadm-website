import { MEMBER_AREA_PATH } from "./member-area";

/**
 * Protected route patterns for clerkMiddleware — see docs/CLERK-AUTH.md.
 * Login UI stays on accounts.aadm.io; member area is embedded on aadm.io/member.
 */
export const clerkPrivateRoutePatterns: string[] = [`${MEMBER_AREA_PATH}(.*)`];
