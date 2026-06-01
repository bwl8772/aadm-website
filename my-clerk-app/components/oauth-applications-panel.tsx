"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

interface OAuthAppRow {
	id: string;
	name: string;
	clientId: string;
	redirectUris: string[];
	isPublic: boolean;
	scopes: string;
	createdAt: number;
	authorizeUrl: string;
	tokenFetchUrl: string;
	discoveryUrl: string;
}

export function OAuthApplicationsPanel() {
	const { isLoaded, isSignedIn } = useAuth();
	const [apps, setApps] = useState<OAuthAppRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [name, setName] = useState("");
	const [redirectUrisText, setRedirectUrisText] = useState("");
	const [isPublic, setIsPublic] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [newSecret, setNewSecret] = useState<{ clientId: string; secret: string } | null>(null);
	const [copyHint, setCopyHint] = useState<string | null>(null);
	const [busyId, setBusyId] = useState<string | null>(null);

	const refresh = useCallback(async () => {
		const res = await fetch("/api/oauth-applications");
		if (!res.ok) {
			setError("Could not load OAuth applications.");
			return;
		}
		const data = (await res.json()) as { applications: OAuthAppRow[] };
		setApps(data.applications);
		setError(null);
	}, []);

	useEffect(() => {
		if (!isLoaded || !isSignedIn) {
			queueMicrotask(() => setLoading(false));
			return;
		}
		let cancelled = false;
		(async () => {
			await refresh();
			if (!cancelled) setLoading(false);
		})();
		return () => {
			cancelled = true;
		};
	}, [isLoaded, isSignedIn, refresh]);

	async function handleCreate(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		const trimmedName = name.trim();
		if (!trimmedName) return;
		const redirectUris = redirectUrisText
			.split(/[\n,]+/)
			.map((s) => s.trim())
			.filter(Boolean);
		try {
			const res = await fetch("/api/oauth-applications", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: trimmedName,
					redirectUris,
					public: isPublic,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				setError(typeof data.error === "string" ? data.error : "Create failed.");
				return;
			}
			setNewSecret({
				clientId: data.clientId as string,
				secret: data.clientSecret as string,
			});
			setName("");
			setRedirectUrisText("");
			setIsPublic(false);
			await refresh();
		} catch {
			setError("Create failed.");
		}
	}

	async function handleDelete(id: string) {
		if (!confirm("Delete this OAuth application? Tokens issued for it will stop working.")) return;
		setBusyId(id);
		setError(null);
		try {
			const res = await fetch("/api/oauth-applications", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (!res.ok) {
				const data = await res.json();
				setError(typeof data.error === "string" ? data.error : "Delete failed.");
			} else {
				await refresh();
			}
		} catch {
			setError("Delete failed.");
		} finally {
			setBusyId(null);
		}
	}

	async function handleRotate(id: string) {
		if (
			!confirm(
				"Rotate the client secret? The old secret stops working immediately. You will see the new secret once.",
			)
		) {
			return;
		}
		setBusyId(id);
		setError(null);
		try {
			const res = await fetch("/api/oauth-applications/rotate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			const data = await res.json();
			if (!res.ok) {
				setError(typeof data.error === "string" ? data.error : "Rotate failed.");
				return;
			}
			setNewSecret({
				clientId: data.clientId as string,
				secret: data.clientSecret as string,
			});
			await refresh();
		} catch {
			setError("Rotate failed.");
		} finally {
			setBusyId(null);
		}
	}

	function copyText(label: string, text: string) {
		void navigator.clipboard.writeText(text).then(() => {
			setCopyHint(label);
			window.setTimeout(() => setCopyHint(null), 2000);
		});
	}

	if (!isLoaded || loading) {
		return (
			<section className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
				<p className="text-sm text-zinc-500">Loading OAuth applications…</p>
			</section>
		);
	}

	return (
		<section className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
			<h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">OAuth applications</h2>
			<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
				Follow Clerk’s IdP guidance: put <strong className="text-zinc-800 dark:text-zinc-200">Client ID</strong> and{" "}
				<strong className="text-zinc-800 dark:text-zinc-200">Client Secret</strong> (when confidential) into the{" "}
				<strong className="text-zinc-800 dark:text-zinc-200">third-party OAuth client</strong> — the app that runs the
				authorization-code exchange. Store the secret securely; it is only shown once after create or rotate (public /
				PKCE apps omit the secret).
			</p>
			<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
				The hosted <strong className="text-zinc-800 dark:text-zinc-200">aadm-mcp</strong> server does{" "}
				<strong className="text-zinc-800 dark:text-zinc-200">not</strong> use{" "}
				<code className="rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-800">CLERK_OAUTH_CLIENT_SECRET</code> — it
				only verifies access tokens with{" "}
				<code className="rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-800">CLERK_SECRET_KEY</code> and{" "}
				<code className="rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-800">CLERK_OAUTH_CLIENT_ID</code> (
				<a
					href="https://github.com/bwl8772/aadm-mcp/blob/main/docs/INTEGRATION.md"
					className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-400"
					target="_blank"
					rel="noopener noreferrer"
				>
					INTEGRATION.md
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
				). For hosted MCP with Claude Code or claude.ai, copy the shared Clerk OAuth app{" "}
				<code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">client_id</code> on{" "}
				<strong className="text-zinc-800 dark:text-zinc-200">MCP access</strong> (
				<code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">/dashboard/tokens</code>) — not{" "}
				<code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">accounts.aadm.io/user</code> and not a custom
				OAuth app from this panel unless building a separate integration.
			</p>

			{newSecret ? (
				<div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
					<p className="text-sm font-semibold text-amber-950 dark:text-amber-100">
						{newSecret.secret ? "Copy credentials now" : "Public OAuth client created"}
					</p>
					<p className="mt-1 text-xs text-amber-900/90 dark:text-amber-200/90">
						{newSecret.secret
							? "This is the only time we show the secret in full."
							: "Use the authorization code flow with PKCE. No client secret is issued."}
					</p>
					<dl className="mt-3 space-y-2 text-sm">
						<div>
							<dt className="font-medium text-zinc-700 dark:text-zinc-300">Client ID</dt>
							<dd className="mt-1 flex flex-wrap items-center gap-2">
								<code className="break-all rounded bg-white px-2 py-1 text-xs dark:bg-zinc-900">{newSecret.clientId}</code>
								<button
									type="button"
									onClick={() => copyText("client id", newSecret.clientId)}
									className="rounded-md border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-600"
								>
									Copy
								</button>
							</dd>
						</div>
						{newSecret.secret ? (
							<div>
								<dt className="font-medium text-zinc-700 dark:text-zinc-300">Client secret</dt>
								<dd className="mt-1 flex flex-wrap items-center gap-2">
									<code className="break-all rounded bg-white px-2 py-1 text-xs dark:bg-zinc-900">{newSecret.secret}</code>
									<button
										type="button"
										onClick={() => copyText("secret", newSecret.secret)}
										className="rounded-md border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-600"
									>
										Copy
									</button>
								</dd>
							</div>
						) : null}
					</dl>
					<button
						type="button"
						onClick={() => setNewSecret(null)}
						className="mt-4 text-sm font-medium text-violet-700 hover:underline dark:text-violet-300"
					>
						Dismiss
					</button>
				</div>
			) : null}

			{copyHint ? (
				<p className="mt-2 text-xs text-green-600 dark:text-green-400">Copied {copyHint}.</p>
			) : null}

			{error ? <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p> : null}

			<form onSubmit={handleCreate} className="mt-6 space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-700">
				<h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">New OAuth application</h3>
				<div>
					<label htmlFor="oauth-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
						Name
					</label>
					<input
						id="oauth-name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="My integration"
						className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
						maxLength={256}
					/>
				</div>
				<div>
					<label htmlFor="oauth-redirects" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
						Redirect URIs (one per line)
					</label>
					<textarea
						id="oauth-redirects"
						value={redirectUrisText}
						onChange={(e) => setRedirectUrisText(e.target.value)}
						placeholder={"https://your.app/oauth/callback"}
						rows={3}
						className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-900"
					/>
					<p className="mt-1 text-xs text-zinc-500">HTTPS required; http://localhost allowed for local development.</p>
				</div>
				<label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
					<input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
					Public client (PKCE; no client secret)
				</label>
				<button
					type="submit"
					className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
				>
					Create OAuth application
				</button>
			</form>

			<div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-700">
				<h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Your applications</h3>
				{apps.length === 0 ? (
					<p className="mt-2 text-sm text-zinc-500">None yet.</p>
				) : (
					<ul className="mt-4 space-y-4">
						{apps.map((app) => (
							<li
								key={app.id}
								className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/40"
							>
								<div className="flex flex-wrap items-start justify-between gap-2">
									<div>
										<p className="font-medium text-zinc-900 dark:text-zinc-50">{app.name}</p>
										<p className="text-xs text-zinc-500">
											{app.isPublic ? "Public (PKCE)" : "Confidential"} · {new Date(app.createdAt).toLocaleString()}
										</p>
									</div>
									<div className="flex flex-wrap gap-2">
										<button
											type="button"
											disabled={busyId === app.id || app.isPublic}
											onClick={() => handleRotate(app.id)}
											className="rounded-md border border-zinc-300 px-2 py-1 text-xs disabled:opacity-40 dark:border-zinc-600"
										>
											Rotate secret
										</button>
										<button
											type="button"
											disabled={busyId === app.id}
											onClick={() => handleDelete(app.id)}
											className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 dark:border-red-800 dark:text-red-300"
										>
											Delete
										</button>
									</div>
								</div>
								<dl className="mt-3 space-y-2 text-xs">
									<div>
										<dt className="font-medium text-zinc-600 dark:text-zinc-400">Client ID</dt>
										<dd className="mt-0.5 flex flex-wrap items-center gap-2">
											<code className="break-all rounded bg-white px-1.5 py-0.5 dark:bg-zinc-950">{app.clientId}</code>
											<button
												type="button"
												onClick={() => copyText("client id", app.clientId)}
												className="text-violet-700 hover:underline dark:text-violet-300"
											>
												Copy
											</button>
										</dd>
									</div>
									<div>
										<dt className="font-medium text-zinc-600 dark:text-zinc-400">Discovery URL</dt>
										<dd className="mt-0.5 break-all font-mono text-zinc-800 dark:text-zinc-200">{app.discoveryUrl}</dd>
									</div>
									<div>
										<dt className="font-medium text-zinc-600 dark:text-zinc-400">Redirect URIs</dt>
										<dd className="mt-0.5 space-y-1">
											{app.redirectUris.length === 0 ? (
												<span className="text-zinc-500">—</span>
											) : (
												app.redirectUris.map((u) => (
													<div key={u} className="break-all font-mono text-zinc-800 dark:text-zinc-200">
														{u}
													</div>
												))
											)}
										</dd>
									</div>
								</dl>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
}
