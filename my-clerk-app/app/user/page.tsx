import { UserProfile } from "@clerk/nextjs";

import { DashboardChrome } from "@/components/dashboard-chrome";
import { McpOAuthConnectCard } from "@/components/mcp-oauth-connect-card";
import { McpOAuthClientIdMissingNotice } from "@/components/mcp-oauth-client-id-missing-notice";
import { OAuthApplicationsPanel } from "@/components/oauth-applications-panel";
import { mcpRpcUrlForNextApp } from "@/lib/mcp-public-endpoint";

export default function UserAccountPage() {
	const mcpServerUrl = mcpRpcUrlForNextApp();
	const clientId = process.env.NEXT_PUBLIC_MCP_OAUTH_CLIENT_ID?.trim() ?? "";

	return (
		<DashboardChrome>
			<div className="space-y-8">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Account</h1>
					<p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
						For Claude Code and claude.ai, users enter the{" "}
						<code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">client_id</code> from their dashboard
						(copy in the card below). It is <strong className="text-zinc-800 dark:text-zinc-200">not</strong> the same
						as an API key (<code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">ak_…</code>) or an MCP
						token (<code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">aadm_…</code>).
						Cursor and Windsurf use tokens on{" "}
						<a href="/dashboard/tokens" className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300">
							MCP access tokens
						</a>
						.
					</p>
				</div>

				{clientId ? (
					<McpOAuthConnectCard mcpServerUrl={mcpServerUrl} />
				) : (
					<McpOAuthClientIdMissingNotice />
				)}

				<section aria-labelledby="clerk-account-heading">
					<h2 id="clerk-account-heading" className="sr-only">
						Profile, security, and API keys
					</h2>
					<UserProfile routing="path" path="/user" />
				</section>

				<OAuthApplicationsPanel />
			</div>
		</DashboardChrome>
	);
}
