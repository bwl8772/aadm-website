/**
 * When `NEXT_PUBLIC_CLERK_SIGN_IN_URL` is an absolute URL, Clerk auth runs on that
 * origin (e.g. Account Portal at accounts.*) instead of embedded routes on this app.
 */
export function isClerkAuthHostedExternally(): boolean {
  const u = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL?.trim() ?? "";
  return /^https?:\/\//i.test(u);
}

const DEFAULT_CLERK_SIGN_IN = "https://accounts.aadm.io/sign-in";
const DEFAULT_CLERK_SIGN_UP = "https://accounts.aadm.io/sign-up";

export function clerkSignInUrl(): string {
  return process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL?.trim() || DEFAULT_CLERK_SIGN_IN;
}

export function clerkSignUpUrl(): string {
  return process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL?.trim() || DEFAULT_CLERK_SIGN_UP;
}

/** Forgot-password / reset entry: hosted sign-in includes Clerk’s reset flow. */
export function clerkForgotPasswordHref(): string {
  if (isClerkAuthHostedExternally()) return clerkSignInUrl();
  return "/forgot-password";
}

/**
 * Hosted Account Portal **User profile** URL for `UserButton` → “Manage account”.
 * Clerk expects **`https://accounts.aadm.io/user`** (not `/profile` on the portal).
 */
const DEFAULT_CLERK_USER_PROFILE = "https://accounts.aadm.io/user";

/** Map legacy `/profile` on the Account Portal host to Clerk’s `/user` path. */
function normalizeClerkHostedUserProfileUrl(url: string): string {
	try {
		const parsed = new URL(url);
		const path = parsed.pathname.replace(/\/+$/, "") || "/";
		if (parsed.hostname.toLowerCase() === "accounts.aadm.io" && path === "/profile") {
			return `${parsed.origin}/user`;
		}
	} catch {
		/* keep url as-is if not parseable */
	}
	return url;
}

export function clerkUserProfileUrl(): string | undefined {
	const raw = process.env.NEXT_PUBLIC_CLERK_USER_PROFILE_URL;
	if (raw === "") return undefined;
	const u = raw?.trim();
	const resolved = u || DEFAULT_CLERK_USER_PROFILE;
	return normalizeClerkHostedUserProfileUrl(resolved);
}
