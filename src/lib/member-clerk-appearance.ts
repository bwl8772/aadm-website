/**
 * Appearance for Clerk widgets mounted under Astro-owned member tabs.
 * Hides Clerk sidenav so there is no empty split column.
 */
export const MEMBER_CLERK_CONTENT_ONLY_APPEARANCE = {
	elements: {
		navbar: { display: "none" },
		navbarMobileMenuRow: { display: "none" },
		navbarMobileMenuButton: { display: "none" },
		rootBox: { width: "100%" },
		cardBox: {
			width: "100%",
			boxShadow: "none",
			border: "none",
		},
		scrollBox: { width: "100%" },
		pageScrollBox: { width: "100%" },
	},
} as const;
