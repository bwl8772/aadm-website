"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { McpOAuthClientIdBox } from "@/components/mcp-oauth-client-id-box";
import { mcpRpcUrlForNextApp } from "@/lib/mcp-public-endpoint";

function safeMcpHost(endpoint: string): string {
  try {
    return new URL(endpoint).host;
  } catch {
    return "mcp.aadm.io";
  }
}

interface McpToken {
  id: string;
  name: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  expired: boolean;
}

export default function DashboardTokensPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const mcpEndpoint = useMemo(() => mcpRpcUrlForNextApp(), []);
  const mcpHost = useMemo(() => safeMcpHost(mcpEndpoint), [mcpEndpoint]);
  const [tokens, setTokens] = useState<McpToken[]>([]);
  const [tokenName, setTokenName] = useState("");
  const [newToken, setNewToken] = useState<string | null>(null);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);

  const refreshTokens = useCallback(async () => {
    const res = await fetch("/api/tokens");
    if (res.ok) {
      const data = await res.json();
      setTokens(data.tokens);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      queueMicrotask(() => setLoadingTokens(false));
      return;
    }
    let cancelled = false;
    (async () => {
      await refreshTokens();
      if (!cancelled) setLoadingTokens(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, refreshTokens]);

  async function handleCreateToken(e: React.FormEvent) {
    e.preventDefault();
    if (!tokenName.trim()) return;
    try {
      const res = await fetch("/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tokenName.trim() }),
      });
      if (res.ok) {
        const data = (await res.json()) as { token: string };
        setNewToken(data.token);
        setTokenName("");
        await refreshTokens();
      }
    } catch {
      // ignore
    }
  }

  async function handleRevokeToken(tokenId: string) {
    try {
      const res = await fetch("/api/tokens", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tokenId }),
      });
      if (res.ok) {
        setTokens((prev) => prev.filter((t) => t.id !== tokenId));
      }
    } catch {
      // ignore
    }
  }

  async function handleRegenerateToken(tokenId: string) {
    if (
      !confirm(
        "Regenerate this token? The current secret stops working immediately. You will get a new secret to copy once.",
      )
    ) {
      return;
    }
    setRotatingId(tokenId);
    try {
      const res = await fetch("/api/tokens/rotate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tokenId }),
      });
      if (res.ok) {
        const data = (await res.json()) as { token: string };
        setNewToken(data.token);
        await refreshTokens();
      }
    } catch {
      // ignore
    } finally {
      setRotatingId(null);
    }
  }

  function copyEndpoint() {
    void navigator.clipboard.writeText(mcpEndpoint);
    setCopyHint("Copied");
    setTimeout(() => setCopyHint(null), 2000);
  }

  function copyNewToken() {
    if (!newToken) return;
    void navigator.clipboard.writeText(newToken);
    setCopyHint("Token copied");
    setTimeout(() => setCopyHint(null), 2000);
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="space-y-6">
        <McpOAuthClientIdBox />
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">MCP access tokens</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Sign in to create and manage tokens.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <McpOAuthClientIdBox />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          MCP access tokens
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Secrets start with <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">aadm_</code>{" "}
          and are shown in full only when you create or regenerate one. Each is valid for{" "}
          <strong className="text-zinc-800 dark:text-zinc-200">365 days</strong> from that moment — copy it to a
          password manager. Use <strong className="text-zinc-800 dark:text-zinc-200">Regenerate</strong> before expiry
          (the previous secret stops immediately). <strong className="text-zinc-800 dark:text-zinc-200">Revoke</strong>{" "}
          if a token may have leaked.
        </p>
      </div>

      {copyHint && (
        <output className="block text-sm font-medium text-violet-600 dark:text-violet-400">{copyHint}</output>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Active (in date)
          </p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {loadingTokens
              ? "—"
              : tokens.filter((t) => !t.expired).length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Expired
          </p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-amber-700 dark:text-amber-400">
            {loadingTokens ? "—" : tokens.filter((t) => t.expired).length}
          </p>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Past 365-day window — regenerate to restore access.</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            MCP endpoint
          </p>
          <code className="mt-2 block break-all text-xs text-zinc-800 dark:text-zinc-200">{mcpEndpoint}</code>
          <button
            type="button"
            onClick={copyEndpoint}
            className="mt-3 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
          >
            Copy URL
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-violet-200 bg-violet-50/40 p-6 dark:border-violet-900 dark:bg-violet-950/25">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Connect your MCP client</h2>
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
          The MCP server accepts an <strong className="text-zinc-900 dark:text-zinc-100">AADM token</strong> from below (
          <code className="rounded bg-white/90 px-1 text-xs dark:bg-zinc-900">aadm_</code>), a{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">Clerk user API key</strong> (
          <code className="rounded bg-white/90 px-1 text-xs dark:bg-zinc-900">ak_</code>) from your hosted account
          under <strong className="text-zinc-900 dark:text-zinc-100">API keys</strong>, or a short-lived{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">OAuth access token</strong> (
          <code className="rounded bg-white/90 px-1 text-xs dark:bg-zinc-900">Bearer</code>) from{" "}
          <a
            href="/oauth/mcp/start"
            className="font-medium text-violet-800 underline-offset-2 hover:underline dark:text-violet-300"
          >
            Get OAuth token for MCP
          </a>{" "}
          (when the MCP host enables <code className="rounded bg-white/90 px-1 text-xs dark:bg-zinc-900">CLERK_OAUTH_CLIENT_ID</code>
          ).
        </p>
        <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          <strong className="text-zinc-800 dark:text-zinc-200">OAuth operators:</strong> Clerk’s docs put{" "}
          <strong className="text-zinc-800 dark:text-zinc-200">Client ID</strong> +{" "}
          <strong className="text-zinc-800 dark:text-zinc-200">Client Secret</strong> on the{" "}
          <strong className="text-zinc-800 dark:text-zinc-200">OAuth client</strong> that exchanges codes for tokens. The{" "}
          <strong className="text-zinc-800 dark:text-zinc-200">aadm-mcp</strong> process does{" "}
          <strong className="text-zinc-800 dark:text-zinc-200">not</strong> read{" "}
          <code className="rounded bg-white/90 px-1 font-mono text-[11px] dark:bg-zinc-900">CLERK_OAUTH_CLIENT_SECRET</code> — it
          verifies <code className="rounded bg-white/90 px-1 font-mono text-[11px] dark:bg-zinc-900">Bearer</code> access tokens
          with <code className="rounded bg-white/90 px-1 font-mono text-[11px] dark:bg-zinc-900">CLERK_SECRET_KEY</code> +{" "}
          <code className="rounded bg-white/90 px-1 font-mono text-[11px] dark:bg-zinc-900">CLERK_OAUTH_CLIENT_ID</code> (
          <a
            href="https://github.com/bwl8772/aadm-mcp/blob/main/docs/INTEGRATION.md"
            className="font-medium text-violet-800 underline-offset-2 hover:underline dark:text-violet-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            INTEGRATION.md
          </a>
          ,{" "}
          <a
            href="https://github.com/bwl8772/aadm-mcp/blob/main/AGENTS.md"
            className="font-medium text-violet-800 underline-offset-2 hover:underline dark:text-violet-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            AGENTS.md
          </a>
          ).
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>
            <strong className="text-zinc-900 dark:text-zinc-100">Server URL</strong> — set the MCP URL to{" "}
            <code className="rounded bg-white/90 px-1 text-xs dark:bg-zinc-900">{mcpEndpoint}</code> (Streamable HTTP at
            the service origin — no extra path).
          </li>
          <li>
            <strong className="text-zinc-900 dark:text-zinc-100">Authorization</strong> — for{" "}
            <code className="rounded bg-white/90 px-1 text-xs dark:bg-zinc-900">aadm_</code> tokens, set the header
            value to the <strong className="text-zinc-900 dark:text-zinc-100">entire</strong> secret (no{" "}
            <code className="rounded bg-white/90 px-1 text-xs dark:bg-zinc-900">Bearer</code>). For{" "}
            <code className="rounded bg-white/90 px-1 text-xs dark:bg-zinc-900">ak_</code> Clerk keys, use the full key
            or <code className="rounded bg-white/90 px-1 text-xs dark:bg-zinc-900">Bearer ak_…</code> — see{" "}
            <a
              href="https://clerk.com/docs/guides/development/machine-auth/api-keys"
              className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Clerk API keys
            </a>
            .
          </li>
          <li>
            <strong className="text-zinc-900 dark:text-zinc-100">Account</strong> — use the same Clerk user as this
            site; the MCP host validates against this instance.
          </li>
        </ol>
        <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
          Example — AADM token (header value is the whole secret):{" "}
          <code className="mt-1 block break-all rounded-lg border border-violet-200/80 bg-white/90 p-2 font-mono text-[11px] text-zinc-800 dark:border-violet-900 dark:bg-zinc-950 dark:text-zinc-200">
            Authorization: aadm_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
          </code>
        </p>
        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
          Example — Clerk API key:{" "}
          <code className="mt-1 block break-all rounded-lg border border-violet-200/80 bg-white/90 p-2 font-mono text-[11px] text-zinc-800 dark:border-violet-900 dark:bg-zinc-950 dark:text-zinc-200">
            Authorization: ak_22493YKV29XYSR37N44GMH3SNAK12CFM
          </code>
        </p>
        <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
          Cursor: set <code className="rounded bg-white/90 px-1 dark:bg-zinc-900">headers.Authorization</code> to the
          full <code className="rounded bg-white/90 px-1 dark:bg-zinc-900">aadm_…</code> or <code className="rounded bg-white/90 px-1 dark:bg-zinc-900">ak_…</code> value
          (or <code className="rounded bg-white/90 px-1 dark:bg-zinc-900">Bearer ak_…</code> for Clerk keys).
        </p>
        {process.env.NEXT_PUBLIC_MCP_HTTP_URL?.trim() ||
        process.env.NEXT_PUBLIC_MCP_REPO_URL?.trim() ? null : (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
            Default URL targets <code className="rounded bg-white/80 px-1 dark:bg-zinc-900">{mcpHost}</code>. Override with{" "}
            <code className="rounded bg-white/80 px-1 dark:bg-zinc-900">NEXT_PUBLIC_MCP_HTTP_URL</code> or{" "}
            <code className="rounded bg-white/80 px-1 dark:bg-zinc-900">NEXT_PUBLIC_MCP_REPO_URL</code> for staging or self-hosted MCP.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Create a token</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Use a label you will recognize later (e.g. laptop, CI job, Cursor workspace).
        </p>
        <form onSubmit={handleCreateToken} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            placeholder="Token name (e.g. my-agent)"
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-950"
          />
          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Generate token
          </button>
        </form>

        {newToken && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50/80 p-4 dark:border-green-800 dark:bg-green-950/30">
            <p className="text-sm font-medium text-green-900 dark:text-green-200">
              Copy this secret now — it will not be shown again.
            </p>
            <code className="mt-2 block break-all rounded-lg border border-green-200/80 bg-white p-3 text-xs dark:border-green-900 dark:bg-zinc-950">
              {newToken}
            </code>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyNewToken}
                className="text-sm font-medium text-green-800 underline-offset-2 hover:underline dark:text-green-300"
              >
                Copy token
              </button>
              <button
                type="button"
                onClick={() => setNewToken(null)}
                className="text-sm text-green-800/80 hover:text-green-900 dark:text-green-400/90"
              >
                Dismiss
              </button>
            </div>
            <p className="mt-3 text-xs text-green-800/90 dark:text-green-300/90">
              Paste this exact string as the <code className="rounded bg-white/80 px-1 dark:bg-zinc-900">Authorization</code> header value on every request to{" "}
              <code className="rounded bg-white/80 px-1 dark:bg-zinc-900">{mcpEndpoint}</code> — nothing before{" "}
              <code className="rounded bg-white/80 px-1 dark:bg-zinc-900">aadm_</code> (no{" "}
              <code className="rounded bg-white/80 px-1 dark:bg-zinc-900">Bearer</code>). The MCP host must use the same Clerk project as this site (
              <code className="rounded bg-white/80 px-1 dark:bg-zinc-900">CLERK_SECRET_KEY</code> on the server).
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Your tokens</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Stored values are masked (<code className="text-xs">***</code> plus last six of the hash). You cannot recover
          the full <code className="text-xs">aadm_…</code> secret here — regenerate if you need a new copy. Expiry is
          from creation or last regeneration; revoke to invalidate immediately.
        </p>

        {loadingTokens ? (
          <p className="mt-6 text-sm text-zinc-500">Loading…</p>
        ) : tokens.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 px-6 py-10 text-center dark:border-zinc-700 dark:bg-zinc-950/50">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No tokens yet</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Generate one above, then configure your client with the URL{" "}
              <code className="text-xs text-zinc-600 dark:text-zinc-500">{mcpEndpoint}</code> and{" "}
              <code className="text-xs text-zinc-600 dark:text-zinc-500">Authorization</code> set to the full{" "}
              <code className="text-xs text-zinc-600 dark:text-zinc-500">aadm_…</code> secret.
            </p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
            {tokens.map((t) => (
              <li
                key={t.id}
                className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{t.name}</p>
                    {t.expired ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-950/80 dark:text-amber-200">
                        Expired
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{t.token}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Issued {new Date(t.createdAt).toLocaleString()}
                    <span className="text-zinc-400"> · </span>
                    Expires {new Date(t.expiresAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-stretch">
                  <button
                    type="button"
                    disabled={rotatingId !== null}
                    onClick={() => handleRegenerateToken(t.id)}
                    className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-800 hover:bg-violet-100 disabled:opacity-50 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-200 dark:hover:bg-violet-950/80"
                  >
                    {rotatingId === t.id ? "Regenerating…" : "Regenerate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRevokeToken(t.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    Revoke
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
