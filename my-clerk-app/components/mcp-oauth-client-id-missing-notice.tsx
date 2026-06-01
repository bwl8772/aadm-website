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
				Set{" "}
				<code className="rounded bg-amber-100/80 px-1 font-mono text-xs dark:bg-amber-900/60">
					CLERK_OAUTH_CLIENT_ID
				</code>{" "}
				on the <code className="rounded bg-amber-100/80 px-1 font-mono text-xs dark:bg-amber-900/60">my-clerk-app</code>{" "}
				service (same Clerk OAuth application Client ID as on the MCP server), then redeploy.
			</p>
		</section>
	);
}
