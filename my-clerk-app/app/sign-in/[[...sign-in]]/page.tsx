import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  clerkForgotPasswordHref,
  clerkSignInUrl,
  clerkSignUpUrl,
  isClerkAuthHostedExternally,
} from "@/lib/clerk-host";
import { clerkSignInForceRedirectUrl } from "@/lib/clerk-redirects";

export default function SignInPage() {
  if (isClerkAuthHostedExternally()) {
    const portalUrl = new URL(clerkSignInUrl());
    portalUrl.searchParams.set("redirect_url", clerkSignInForceRedirectUrl());
    redirect(portalUrl.toString());
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl={clerkSignUpUrl()}
        forceRedirectUrl={clerkSignInForceRedirectUrl()}
      />
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        <Link
          href={clerkForgotPasswordHref()}
          className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
        >
          Forgot password?
        </Link>
      </p>
    </div>
  );
}
