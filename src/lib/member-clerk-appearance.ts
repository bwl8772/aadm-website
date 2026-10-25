/**
 * Appearance for Clerk widgets under Astro-owned member tabs.
 * Values are semantic CSS vars from `src/styles/theme.css` so light/dark both apply.
 * Hides Clerk sidenav so there is no empty split column.
 */
export const MEMBER_CLERK_CONTENT_ONLY_APPEARANCE = {
	variables: {
		colorBackground: "var(--card)",
		colorInputBackground: "var(--surface-mid)",
		colorInputText: "var(--foreground)",
		colorText: "var(--foreground)",
		colorTextSecondary: "var(--muted-foreground)",
		colorPrimary: "var(--primary)",
		colorDanger: "var(--destructive)",
		colorSuccess: "var(--success)",
		colorNeutral: "var(--muted-foreground)",
		colorMuted: "var(--muted-foreground)",
		borderRadius: "var(--radius)",
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
		headerTitle: { color: "var(--text-primary)" },
		headerSubtitle: { color: "var(--muted-foreground)" },
		formButtonPrimary: {
			backgroundColor: "var(--primary)",
			color: "var(--primary-foreground)",
		},
	},
} as const;
