import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { clerkSignInUrl, clerkSignUpUrl, isClerkAuthHostedExternally } from "@/lib/clerk-host";
import { clerkSignUpForceRedirectUrl } from "@/lib/clerk-redirects";

export default function SignUpPage() {
  if (isClerkAuthHostedExternally()) {
    const portalUrl = new URL(clerkSignUpUrl());
    portalUrl.searchParams.set("redirect_url", clerkSignUpForceRedirectUrl());
    redirect(portalUrl.toString());
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl={clerkSignInUrl()}
        forceRedirectUrl={clerkSignUpForceRedirectUrl()}
      />
    </div>
  );
}
