"use client";

import { useCallback, useMemo, useState } from "react";

import { maskMcpOAuthClientId } from "@/components/mcp-oauth-client-id-box";

type McpOAuthConnectCardProps = {
	mcpServerUrl: string;
};

export function McpOAuthConnectCard({ mcpServerUrl }: McpOAuthConnectCardProps) {
	const clientId = useMemo(
		() => process.env.NEXT_PUBLIC_MCP_OAUTH_CLIENT_ID?.trim() ?? "",
		[],
	);
	const [hint, setHint] = useState<string | null>(null);

	const copy = useCallback((label: string, text: string) => {
		void navigator.clipboard.writeText(text).then(() => {
			setHint(`Copied ${label}`);
			window.setTimeout(() => setHint(null), 2000);
		});
	}, []);

	if (!clientId) {
		return null;
	}

	return (
		<section
			className="rounded-2xl border border-violet-300/80 bg-gradient-to-br from-violet-50/90 to-white p-6 shadow-sm dark:border-violet-800 dark:from-violet-950/40 dark:to-zinc-900"
			aria-labelledby="mcp-oauth-connect-heading"
		>
			<h2
				id="mcp-oauth-connect-heading"
				className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
			>
				Connect with OAuth
			</h2>
			<p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
				For <strong className="text-zinc-900 dark:text-zinc-100">Claude Code</strong>,{" "}
				<strong className="text-zinc-900 dark:text-zinc-100">claude.ai Connectors</strong>, and other hosts that run
				an OAuth login. Signing into this dashboard is not enough — your MCP host must complete OAuth against Clerk.
			</p>

			<div
				className="mt-4 rounded-xl border-2 border-amber-400/80 bg-amber-50 p-4 dark:border-amber-600 dark:bg-amber-950/40"
				role="note"
			>
				<p className="text-sm font-semibold text-amber-950 dark:text-amber-100">
					Do not combine OAuth with an <code className="rounded bg-amber-100/80 px-1 font-mono text-xs dark:bg-amber-900/60">aadm_</code>{" "}
					token
				</p>
				<ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-amber-950/90 dark:text-amber-100/90">
					<li>
						<strong>OAuth path (this card):</strong> paste only the <strong>OAuth Client ID</strong> below into your
						connector’s OAuth / Advanced settings. Leave <strong>Client Secret</strong> empty. Do{" "}
						<strong>not</strong> paste your <code className="rounded bg-amber-100/80 px-1 font-mono text-xs dark:bg-amber-900/60">aadm_</code>{" "}
						token anywhere in the OAuth flow — Claude obtains a <code className="rounded bg-amber-100/80 px-1 font-mono text-xs dark:bg-amber-900/60">Bearer</code>{" "}
						access token automatically after you sign in.
					</li>
					<li>
						<strong>Token path (below):</strong> paste only your <code className="rounded bg-amber-100/80 px-1 font-mono text-xs dark:bg-amber-900/60">aadm_</code>{" "}
						secret as the <code className="rounded bg-amber-100/80 px-1 font-mono text-xs dark:bg-amber-900/60">Authorization</code>{" "}
						header (Cursor, curl). Do <strong>not</strong> use the OAuth Client ID or any client secret with that
						token.
					</li>
					<li>
						<strong>Pick one method per client.</strong> claude.ai and Claude Code use OAuth only — they cannot use
						an <code className="rounded bg-amber-100/80 px-1 font-mono text-xs dark:bg-amber-900/60">aadm_</code>{" "}
						token. Cursor and Windsurf use the token only — they do not use OAuth Client ID.
					</li>
				</ul>
			</div>

			<div className="mt-5 grid gap-4 lg:grid-cols-2">
				<div className="rounded-xl border border-violet-200/90 bg-white/90 p-4 dark:border-violet-900 dark:bg-zinc-950/80">
					<p className="text-xs font-semibold uppercase tracking-wide text-violet-800 dark:text-violet-300">
						OAuth Client ID
					</p>
					<p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
						<strong className="text-zinc-800 dark:text-zinc-200">Not</strong> your{" "}
						<code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">aadm_</code> token. This is a public
						identifier for OAuth setup only. There is <strong className="text-zinc-800 dark:text-zinc-200">no Client Secret</strong>{" "}
						— leave that field empty.
					</p>
					<div className="mt-3 flex flex-wrap items-center gap-2">
						<code
							className="min-w-0 flex-1 break-all rounded-lg border border-violet-200/90 bg-white px-3 py-2 font-mono text-sm text-zinc-900 dark:border-violet-900 dark:bg-zinc-900 dark:text-zinc-100"
							title="Full Client ID is copied when you use Copy"
						>
							{maskMcpOAuthClientId(clientId)}
						</code>
						<button
							type="button"
							onClick={() => copy("Client ID", clientId)}
							className="shrink-0 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
						>
							Copy
						</button>
					</div>
				</div>

				<div className="rounded-xl border border-violet-200/90 bg-white/90 p-4 dark:border-violet-900 dark:bg-zinc-950/80">
					<p className="text-xs font-semibold uppercase tracking-wide text-violet-800 dark:text-violet-300">
						MCP server URL
					</p>
					<p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
						Use this exact URL in your connector — include the <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">/mcp</code>{" "}
						path.
					</p>
					<div className="mt-3 flex flex-wrap items-center gap-2">
						<code className="min-w-0 flex-1 break-all rounded-lg border border-violet-200/90 bg-white px-3 py-2 font-mono text-xs text-zinc-900 dark:border-violet-900 dark:bg-zinc-900 dark:text-zinc-100">
							{mcpServerUrl}
						</code>
						<button
							type="button"
							onClick={() => copy("server URL", mcpServerUrl)}
							className="shrink-0 rounded-lg border border-violet-300 bg-white px-3 py-2 text-sm font-semibold text-violet-800 transition hover:bg-violet-50 dark:border-violet-800 dark:bg-zinc-900 dark:text-violet-200 dark:hover:bg-violet-950/50"
						>
							Copy
						</button>
					</div>
				</div>
			</div>

			<div className="mt-5 rounded-xl border border-zinc-200/90 bg-white/70 p-4 dark:border-zinc-700 dark:bg-zinc-950/50">
				<h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Setup steps</h3>
				<ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
					<li>
						<strong className="text-zinc-900 dark:text-zinc-100">Claude Code</strong> — choose <strong>OAuth</strong>{" "}
						(not a pasted API key). Paste the <strong>OAuth Client ID</strong> above when asked. Server URL:{" "}
						<code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">{mcpServerUrl}</code>. Leave{" "}
						<strong className="text-zinc-900 dark:text-zinc-100">Client Secret</strong> blank. Do not paste an{" "}
						<code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">aadm_</code> token.
					</li>
					<li>
						<strong className="text-zinc-900 dark:text-zinc-100">claude.ai</strong> —{" "}
						<em>Settings → Connectors → Add custom connector</em>. Authentication: <strong>OAuth</strong> (not a
						bearer token field). Open <strong>Advanced</strong> and paste the <strong>OAuth Client ID</strong> above
						only — not your <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">aadm_</code> token.
						Server URL:{" "}
						<code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">{mcpServerUrl}</code>.
					</li>
					<li>
						Sign in with the <strong className="text-zinc-900 dark:text-zinc-100">same Clerk account</strong> you use
						for this dashboard when the OAuth consent screen appears.
					</li>
				</ol>
			</div>

			<p className="mt-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
				Using <strong className="text-zinc-800 dark:text-zinc-200">Cursor or curl</strong> instead? Skip this card.
				Generate an <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">aadm_</code> token in{" "}
				<strong>Your tokens</strong> below — that path does not use OAuth Client ID or client secret.
			</p>

			{hint ? (
				<p className="mt-3 text-xs font-medium text-violet-700 dark:text-violet-400">{hint}</p>
			) : null}
		</section>
	);
}
