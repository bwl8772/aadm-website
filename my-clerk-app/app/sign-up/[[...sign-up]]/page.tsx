import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { clerkSignInUrl, clerkSignUpUrl, isClerkAuthHostedExternally } from "@/lib/clerk-host";

export default function SignUpPage() {
  if (isClerkAuthHostedExternally()) {
    redirect(clerkSignUpUrl());
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <SignUp path="/sign-up" routing="path" signInUrl={clerkSignInUrl()} />
    </div>
  );
}
