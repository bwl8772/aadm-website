"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

interface SubscriptionStatus {
  active: boolean;
  plan: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  trialEnd: string | null;
}

export default function SubscriptionPage() {
  const { isLoaded } = useUser();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [fetchTriggered, setFetchTriggered] = useState(false);

  if (isLoaded && !fetchTriggered) {
    setFetchTriggered(true);
    fetch("/api/stripe/checkout")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data) setSubscription(data); })
      .finally(() => setLoading(false));
  }

  async function handleSubscribe() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch {
      // ignore
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleManage() {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch {
      // ignore
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Subscription</h1>

      {subscription?.active ? (
        <section className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
            <h2 className="text-lg font-semibold">Active Subscription</h2>
          </div>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Plan:</span>{" "}
              {subscription.plan || "AADM Pro"}
            </p>
            {subscription.trialEnd && new Date(subscription.trialEnd) > new Date() && (
              <p className="text-violet-600 dark:text-violet-400">
                Free trial ends{" "}
                {new Date(subscription.trialEnd).toLocaleDateString()}
              </p>
            )}
            <p>
              <span className="font-medium">Renews:</span>{" "}
              {subscription.currentPeriodEnd
                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                : "—"}
            </p>
            {subscription.cancelAtPeriodEnd && (
              <p className="text-amber-600 dark:text-amber-400">
                Subscription will cancel at end of period.
              </p>
            )}
          </div>
          <button
            onClick={handleManage}
            className="mt-4 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm"
          >
            Manage Subscription
          </button>
        </section>
      ) : (
        <section className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">AADM Pro</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Full access to the AADM MCP service at mcp.aadm.io and the governed delivery framework.
          </p>
          <div className="mb-6">
            <p className="text-3xl font-bold">
              $48<span className="text-base font-normal text-zinc-500">/year</span>
            </p>
            <p className="text-sm text-violet-600 dark:text-violet-400 mt-1">
              Includes 7-day free trial
            </p>
          </div>
          <ul className="space-y-2 mb-6 text-sm text-zinc-700 dark:text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> MCP service access (mcp.aadm.io)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Token management
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Priority support
            </li>
          </ul>
          <button
            onClick={handleSubscribe}
            disabled={checkoutLoading}
            className="w-full px-4 py-3 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50 font-medium"
          >
            {checkoutLoading ? "Redirecting..." : "Start Free Trial"}
          </button>
        </section>
      )}
    </div>
  );
}
