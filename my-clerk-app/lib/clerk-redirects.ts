/**
 * Post–sign-in/up destinations. Clerk falls back to env
 * `NEXT_PUBLIC_CLERK_*_FALLBACK_REDIRECT_URL` or `/`; this app treats `/` as legacy
 * and sends subscribers to **Profile** (account + MCP token CTA → `/dashboard/tokens`).
 */
export const CLERK_POST_AUTH_DEFAULT_PATH = "/profile";

function normalizeFallback(raw: string | undefined): string {
  const v = raw?.trim();
  if (!v || v === "/") return CLERK_POST_AUTH_DEFAULT_PATH;
  return v;
}

/** Used by ClerkProvider and sign-in/up flows (Account Portal + embedded components). */
export function clerkSignInFallbackRedirectUrl(): string {
  return normalizeFallback(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL);
}

export function clerkSignUpFallbackRedirectUrl(): string {
  return normalizeFallback(process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL);
}

/**
 * Build an absolute redirect URL for the Account Portal to return to.
 * When auth is hosted externally (e.g. accounts.aadm.io), Clerk needs the full
 * origin so it doesn't fall back to the production domain from the Dashboard.
 */
export function clerkSignInForceRedirectUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.trim() || "";
  const path = clerkSignInFallbackRedirectUrl();
  if (base) return `${base}${path}`;
  return path;
}

export function clerkSignUpForceRedirectUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.trim() || "";
  const path = clerkSignUpFallbackRedirectUrl();
  if (base) return `${base}${path}`;
  return path;
}
