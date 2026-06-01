/** Re-export auth URLs — see docs/CLERK-AUTH.md. All links target accounts.aadm.io, not aadm.io. */
export {
	getClerkPortalUrls as getAccountPortalUrls,
	type ClerkPortalUrls as AccountPortalUrls,
} from './clerk-portal-urls';
