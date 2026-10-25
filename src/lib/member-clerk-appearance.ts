/**
 * Appearance for Clerk widgets under Astro-owned member tabs.
 * Values are semantic CSS vars from `src/styles/theme.css` so light/dark both apply
 * when `html.dark` / `data-theme` toggles — no separate Clerk baseTheme.
 * Hides Clerk sidenav so there is no empty split column.
 */
export const MEMBER_CLERK_CONTENT_ONLY_APPEARANCE = {
	variables: {
		colorBackground: "var(--card)",
		colorInputBackground: "var(--surface-mid)",
		colorInputText: "var(--foreground)",
		colorText: "var(--foreground)",
		colorTextSecondary: "var(--muted-foreground)",
		colorTextOnPrimaryBackground: "var(--primary-foreground)",
		colorPrimary: "var(--primary)",
		colorDanger: "var(--destructive)",
		colorSuccess: "var(--success)",
		colorWarning: "var(--warning)",
		colorNeutral: "var(--muted-foreground)",
		colorMuted: "var(--muted-foreground)",
		colorShimmer: "var(--border)",
		borderRadius: "var(--radius)",
		fontFamily: "var(--font-sans-family)",
		fontFamilyButtons: "var(--font-sans-family)",
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
		card: {
			backgroundColor: "transparent",
			boxShadow: "none",
		},
		scrollBox: { width: "100%", backgroundColor: "transparent" },
		pageScrollBox: { width: "100%", backgroundColor: "transparent" },
		headerTitle: { color: "var(--text-primary)" },
		headerSubtitle: { color: "var(--muted-foreground)" },
		profileSectionTitleText: { color: "var(--text-primary)" },
		profileSectionSubtitle: { color: "var(--muted-foreground)" },
		formFieldLabel: { color: "var(--text-primary)" },
		formFieldInput: {
			backgroundColor: "var(--surface-mid)",
			color: "var(--foreground)",
			borderColor: "var(--border)",
		},
		formButtonPrimary: {
			backgroundColor: "var(--primary)",
			color: "var(--primary-foreground)",
		},
		formButtonReset: {
			backgroundColor: "var(--muted)",
			color: "var(--foreground)",
			borderColor: "var(--border)",
		},
		badge: {
			backgroundColor: "var(--accent)",
			color: "var(--accent-foreground)",
		},
		tableHead: { color: "var(--text-primary)", backgroundColor: "transparent" },
		menuButton: {
			backgroundColor: "var(--muted)",
			color: "var(--foreground)",
			borderColor: "var(--border)",
		},
	},
} as const;
