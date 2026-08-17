/**
 * Appearance for Clerk widgets under Astro-owned member tabs.
 * Matches site surface tokens from `src/styles/global.css` (dark-first marketing shell).
 * Hides Clerk sidenav so there is no empty split column.
 */
export const MEMBER_CLERK_CONTENT_ONLY_APPEARANCE = {
	variables: {
		colorBackground: "#0f1424",
		colorInputBackground: "#0a0e1a",
		colorInputText: "#e2e8f0",
		colorText: "#e2e8f0",
		colorTextSecondary: "#94a3b8",
		colorPrimary: "#9d7bf5",
		colorDanger: "#f87171",
		colorSuccess: "#34d399",
		colorNeutral: "#94a3b8",
		colorMuted: "#64748b",
		borderRadius: "0.5rem",
	},
	elements: {
		navbar: { display: "none" },
		navbarMobileMenuRow: { display: "none" },
		navbarMobileMenuButton: { display: "none" },
		rootBox: { width: "100%" },
		cardBox: {
			width: "100%",
			boxShadow: "none",
			border: "none",
			backgroundColor: "transparent",
		},
		scrollBox: { width: "100%", backgroundColor: "transparent" },
		pageScrollBox: { width: "100%", backgroundColor: "transparent" },
		headerTitle: { color: "#f1f5f9" },
		headerSubtitle: { color: "#94a3b8" },
		formButtonPrimary: {
			backgroundColor: "#9d7bf5",
			color: "#05040a",
		},
	},
} as const;
