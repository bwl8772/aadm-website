"use client";

import { useCallback, useState } from "react";

import { maskMcpOAuthClientId } from "@/components/mcp-oauth-client-id-box";

type SharedOAuthClientIdCardProps = {
	clientId: string;
};

/** Shared Clerk OAuth app Client ID — same value for every signed-in user. */
export function SharedOAuthClientIdCard({ clientId }: SharedOAuthClientIdCardProps) {
	const [hint, setHint] = useState<string | null>(null);

	const copy = useCallback(() => {
		void navigator.clipboard.writeText(clientId).then(() => {
			setHint("Copied Client ID");
			window.setTimeout(() => setHint(null), 2000);
		});
	}, [clientId]);

	return (
		<section
			className="rounded-2xl border border-violet-300/80 bg-gradient-to-br from-violet-50/90 to-white p-5 shadow-sm dark:border-violet-800 dark:from-violet-950/40 dark:to-zinc-900"
			aria-labelledby="shared-oauth-client-id-heading"
		>
			<h2
				id="shared-oauth-client-id-heading"
				className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
			>
				OAuth Client ID
			</h2>
			<p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
				Shared for all AADM accounts. Paste into Claude Code or claude.ai Connectors when asked for{" "}
				<code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">client_id</code>. Leave{" "}
				<strong className="text-zinc-800 dark:text-zinc-200">Client Secret</strong> empty.
			</p>
			<div className="mt-4 flex flex-wrap items-center gap-2">
				<code
					className="min-w-0 flex-1 break-all rounded-lg border border-violet-200/90 bg-white px-3 py-2 font-mono text-sm text-zinc-900 dark:border-violet-900 dark:bg-zinc-900 dark:text-zinc-100"
					title="Full Client ID is copied when you use Copy"
				>
					{maskMcpOAuthClientId(clientId)}
				</code>
				<button
					type="button"
					onClick={copy}
					className="shrink-0 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
				>
					Copy
				</button>
			</div>
			{hint ? (
				<p className="mt-2 text-xs font-medium text-violet-700 dark:text-violet-400">{hint}</p>
			) : null}
		</section>
	);
}
