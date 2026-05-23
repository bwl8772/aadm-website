/**
 * Canonical paths for this app. Astro resolves HTTP routes from `src/pages/` only.
 *
 * - `/mcp` — this repo’s MCP **marketing** route when this app is served on your domain (production copy also lives at
 *   `https://aadm.io/mcp` on the main site).
 * - MCP **service** (JSON-RPC) is always the separate host `https://mcp.aadm.io` — see `getSiteUrlConfig().urlMcpEndpoint`.
 *
 * Order for `createRouteMatcher` arrays: **more specific paths first**, then broader `(.*)` prefixes.
 */
export const paths = {
	home: '/',
	mcp: '/mcp',
	governance: '/governance',
	health: '/health',
} as const;

/** Clerk `createRouteMatcher` patterns for routes that require an active session (see `src/middleware.ts`). */
export const clerkPrivateRoutePatterns: string[] = [
	// Add narrower paths above the `/account(.*)` umbrella when you introduce them.
	'/account(.*)',
];
