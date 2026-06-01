/** Shown when the accounts portal has no MCP OAuth Client ID configured. */
export function McpOAuthClientIdMissingNotice() {
	return (
		<section
			className="rounded-2xl border border-amber-300/80 bg-amber-50/90 p-6 dark:border-amber-800 dark:bg-amber-950/30"
			aria-labelledby="mcp-oauth-missing-heading"
		>
			<h2 id="mcp-oauth-missing-heading" className="text-lg font-semibold text-amber-950 dark:text-amber-100">
				OAuth Client ID not available yet
			</h2>
			<p className="mt-2 text-sm leading-relaxed text-amber-950/90 dark:text-amber-100/90">
				The shared MCP OAuth Client ID is not configured on the{" "}
				<strong className="text-amber-950 dark:text-amber-100">accounts portal</strong> (
				<code className="rounded bg-amber-100/80 px-1 font-mono text-xs dark:bg-amber-900/60">my-clerk-app</code>
				), not the Astro marketing site. Set{" "}
				<code className="rounded bg-amber-100/80 px-1 font-mono text-xs dark:bg-amber-900/60">
					CLERK_OAUTH_CLIENT_ID
				</code>{" "}
				(preferred, runtime) or{" "}
				<code className="rounded bg-amber-100/80 px-1 font-mono text-xs dark:bg-amber-900/60">
					NEXT_PUBLIC_MCP_OAUTH_CLIENT_ID
				</code>{" "}
				on that service and redeploy. All subscribers share the same public Client ID for Claude Code and claude.ai
				Connectors.
			</p>
		</section>
	);
}
