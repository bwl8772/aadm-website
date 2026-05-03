/**
 * When `NEXT_PUBLIC_CLERK_SIGN_IN_URL` is an absolute URL, Clerk auth runs on that
 * origin (e.g. Account Portal at accounts.*) instead of embedded routes on this app.
 */
export function isClerkAuthHostedExternally(): boolean {
  const u = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL?.trim() ?? "";
  return /^https?:\/\//i.test(u);
}

export function clerkSignInUrl(): string {
  return process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL?.trim() || "/login";
}

export function clerkSignUpUrl(): string {
  return process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL?.trim() || "/signup";
}

/** Forgot-password / reset entry: hosted sign-in includes Clerk’s reset flow. */
export function clerkForgotPasswordHref(): string {
  if (isClerkAuthHostedExternally()) return clerkSignInUrl();
  return "/forgot-password";
}

export function clerkUserProfileUrl(): string | undefined {
  const u = process.env.NEXT_PUBLIC_CLERK_USER_PROFILE_URL?.trim();
  return u || undefined;
}
