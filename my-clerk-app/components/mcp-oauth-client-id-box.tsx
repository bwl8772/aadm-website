"use client";

import { useCallback, useMemo, useState } from "react";

/** First 5 characters visible; remainder shown as bullets (OAuth Client IDs are public). */
export function maskMcpOAuthClientId(id: string): string {
	const t = id.trim();
	if (t.length === 0) return "";
	if (t.length <= 5) return t;
	const hidden = t.length - 5;
	const dots = Math.min(hidden, 36);
	return `${t.slice(0, 5)}${"•".repeat(dots)}`;
}

export function McpOAuthClientIdBox() {
	const full = useMemo(() => process.env.NEXT_PUBLIC_MCP_OAUTH_CLIENT_ID?.trim() ?? "", []);
	const [hint, setHint] = useState<string | null>(null);

	const onCopy = useCallback(() => {
		if (!full) return;
		void navigator.clipboard.writeText(full).then(() => {
			setHint("Copied Client ID");
			window.setTimeout(() => setHint(null), 2000);
		});
	}, [full]);

	if (!full) {
		return null;
	}

	return (
		<div className="rounded-xl border border-violet-200/80 bg-violet-50/50 p-4 dark:border-violet-900/60 dark:bg-violet-950/30">
			<h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">MCP OAuth Client ID</h3>
			<p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
				Use this value in your MCP host’s OAuth setup (e.g. Claude Connector <strong className="text-zinc-800 dark:text-zinc-200">Advanced</strong>{" "}
				Client ID). It must match <code className="rounded bg-white/80 px-1 font-mono dark:bg-zinc-900">CLERK_OAUTH_CLIENT_ID</code> on the hosted
				MCP server.
			</p>
			<div className="mt-3 flex flex-wrap items-center gap-2">
				<code
					className="min-w-0 flex-1 break-all rounded-lg border border-violet-200/90 bg-white px-3 py-2 font-mono text-sm text-zinc-900 dark:border-violet-900 dark:bg-zinc-950 dark:text-zinc-100"
					title="Full Client ID is copied when you use Copy"
				>
					{maskMcpOAuthClientId(full)}
				</code>
				<button
					type="button"
					onClick={onCopy}
					className="shrink-0 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
				>
					Copy
				</button>
			</div>
			{hint ? <p className="mt-2 text-xs font-medium text-violet-700 dark:text-violet-400">{hint}</p> : null}
		</div>
	);
}
