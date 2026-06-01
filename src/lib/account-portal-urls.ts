/** Re-export auth URLs — see docs/CLERK-AUTH.md. */
export {
	type ClerkPortalUrls as AccountPortalUrls,
	getClerkPortalUrls as getAccountPortalUrls,
	getMemberMcpOAuthSignInUrl,
	getMemberSignInUrl,
} from "./clerk-portal-urls";
