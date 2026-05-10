import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { OauthMcpResourceServerNote } from "@/components/oauth-mcp-resource-server-note";
import {
  clerkForgotPasswordHref,
  clerkSignInUrl,
  clerkSignUpUrl,
  isClerkAuthHostedExternally,
} from "@/lib/clerk-host";
export default function LoginPage() {
  if (isClerkAuthHostedExternally()) {
    redirect(clerkSignInUrl());
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <SignIn path="/login" routing="path" signUpUrl={clerkSignUpUrl()} />
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        <Link
          href={clerkForgotPasswordHref()}
          className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
        >
          Forgot password?
        </Link>
      </p>
      <OauthMcpResourceServerNote />
    </div>
  );
}
