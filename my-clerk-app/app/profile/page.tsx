"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (isLoaded && user && !initialized) {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setInitialized(true);
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

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-5 dark:border-violet-900 dark:bg-violet-950/20">
        <h2 className="text-sm font-semibold text-violet-900 dark:text-violet-200">MCP API access</h2>
        <p className="mt-2 text-sm text-violet-900/80 dark:text-violet-200/80">
          For MCP access you can use <strong className="text-violet-950 dark:text-violet-100">AADM tokens</strong> (
          <code className="rounded bg-violet-100/80 px-1 text-xs dark:bg-violet-900/60">aadm_</code>, created below)
          or a <strong className="text-violet-950 dark:text-violet-100">Clerk API key</strong> (
          <code className="rounded bg-violet-100/80 px-1 text-xs dark:bg-violet-900/60">ak_</code>) from your hosted
          Clerk account (<strong className="text-violet-950 dark:text-violet-100">API keys</strong> under Account /
          user profile). AADM tokens go in <code className="rounded bg-violet-100/80 px-1 text-xs dark:bg-violet-900/60">Authorization</code>{" "}
          in full with no <code className="rounded bg-violet-100/80 px-1 text-xs dark:bg-violet-900/60">Bearer</code>;{" "}
          <code className="rounded bg-violet-100/80 px-1 text-xs dark:bg-violet-900/60">ak_</code> keys also allow{" "}
          <code className="rounded bg-violet-100/80 px-1 text-xs dark:bg-violet-900/60">Bearer</code> per Clerk.
        </p>
        <Link
          href="/dashboard/tokens"
          className="mt-3 inline-flex rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Create and copy tokens
        </Link>
      </section>

      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Profile</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Name and email for your account. Use the section above for MCP access.
        </p>
      </div>

      <section className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Update profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="profile-email"
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
              <label htmlFor="profile-first" className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                id="profile-first"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900"
              />
            </div>
            <div>
              <label htmlFor="profile-last" className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                id="profile-last"
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
    </div>
  );
}
