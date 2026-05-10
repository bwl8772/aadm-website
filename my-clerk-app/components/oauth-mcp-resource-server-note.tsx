/**
 * Explains Clerk IdP docs (Client ID + Secret on the OAuth client) vs aadm-mcp (resource server, no OAuth client secret).
 */
export function OauthMcpResourceServerNote() {
	return (
		<aside className="max-w-md rounded-lg border border-zinc-200 bg-zinc-50/90 p-4 text-left text-xs leading-relaxed text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400">
			<p className="font-semibold text-zinc-800 dark:text-zinc-200">MCP operators · OAuth vs MCP server</p>
			<p className="mt-2">
				Clerk’s documentation puts <strong className="text-zinc-900 dark:text-zinc-100">Client ID</strong> and{" "}
				<strong className="text-zinc-900 dark:text-zinc-100">Client Secret</strong> in the{" "}
				<strong className="text-zinc-900 dark:text-zinc-100">third-party OAuth client</strong> — the component that
				runs the authorization-code exchange with Clerk (
				<code className="rounded bg-zinc-200/90 px-1 font-mono dark:bg-zinc-800">/oauth/authorize</code> →{" "}
				<code className="rounded bg-zinc-200/90 px-1 font-mono dark:bg-zinc-800">/oauth/token</code>).
			</p>
			<p className="mt-2">
				The hosted <strong className="text-zinc-900 dark:text-zinc-100">aadm-mcp</strong> server does{" "}
				<strong className="text-zinc-900 dark:text-zinc-100">not</strong> use{" "}
				<code className="rounded bg-zinc-200/90 px-1 font-mono text-[11px] dark:bg-zinc-800">
					CLERK_OAUTH_CLIENT_SECRET
				</code>
				. It only verifies <code className="rounded bg-zinc-200/90 px-1 font-mono text-[11px] dark:bg-zinc-800">Bearer</code>{" "}
				access tokens using{" "}
				<code className="rounded bg-zinc-200/90 px-1 font-mono text-[11px] dark:bg-zinc-800">CLERK_SECRET_KEY</code> and{" "}
				<code className="rounded bg-zinc-200/90 px-1 font-mono text-[11px] dark:bg-zinc-800">CLERK_OAUTH_CLIENT_ID</code>{" "}
				on the MCP process. Details:{" "}
				<a
					href="https://github.com/bwl8772/aadm-mcp/blob/main/docs/INTEGRATION.md"
					className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-400"
					target="_blank"
					rel="noopener noreferrer"
				>
					docs/INTEGRATION.md
				</a>
				,{" "}
				<a
					href="https://github.com/bwl8772/aadm-mcp/blob/main/AGENTS.md"
					className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-400"
					target="_blank"
					rel="noopener noreferrer"
				>
					AGENTS.md
				</a>
				.
			</p>
		</aside>
	);
}
