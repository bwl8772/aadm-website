"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

interface McpToken {
  id: string;
  name: string;
  token: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [initialized, setInitialized] = useState(false);

  const [tokens, setTokens] = useState<McpToken[]>([]);
  const [tokenName, setTokenName] = useState("");
  const [newToken, setNewToken] = useState<string | null>(null);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [tokensFetched, setTokensFetched] = useState(false);

  if (isLoaded && user && !initialized) {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setInitialized(true);
  }

  if (isLoaded && !tokensFetched) {
    setTokensFetched(true);
    fetch("/api/tokens")
      .then((res) => (res.ok ? res.json() : { tokens: [] }))
      .then((data) => setTokens(data.tokens))
      .finally(() => setLoadingTokens(false));
  }

  async function refreshTokens() {
    const res = await fetch("/api/tokens");
    if (res.ok) {
      const data = await res.json();
      setTokens(data.tokens);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage("");
    try {
      await user.update({ firstName, lastName });
      setMessage("Profile updated successfully.");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile.";
      setMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  }

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
        const data = await res.json();
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

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Update Name Section */}
      <section className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Update Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={user?.primaryEmailAddress?.emailAddress || ""}
              disabled
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-500"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Email is managed through Clerk account settings.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {message && (
            <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
          )}
        </form>
      </section>

      {/* MCP Token Management */}
      <section className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">MCP Tokens</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Generate tokens to authenticate with the AADM MCP service at{" "}
          <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">
            mcp.aadm.io
          </code>.
        </p>

        <form onSubmit={handleCreateToken} className="flex gap-2 mb-4">
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            placeholder="Token name (e.g. my-agent)"
            className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
          >
            Generate
          </button>
        </form>

        {newToken && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
              New token created — copy it now, it won&apos;t be shown again:
            </p>
            <code className="block text-xs bg-white dark:bg-zinc-900 p-2 rounded border break-all">
              {newToken}
            </code>
            <p className="text-xs text-green-700 dark:text-green-300 mt-2">
              Use this token as a Bearer token when connecting to{" "}
              <code>https://mcp.aadm.io/mcp</code>
            </p>
            <button
              onClick={() => setNewToken(null)}
              className="mt-2 text-xs text-green-700 dark:text-green-300 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {loadingTokens ? (
          <p className="text-sm text-zinc-500">Loading tokens...</p>
        ) : tokens.length === 0 ? (
          <p className="text-sm text-zinc-500">No tokens yet.</p>
        ) : (
          <ul className="space-y-2">
            {tokens.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-700 rounded-md"
              >
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-zinc-500">
                    Created {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRevokeToken(t.id)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
