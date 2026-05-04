import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { clerkSignInUrl, clerkSignUpUrl, isClerkAuthHostedExternally } from "@/lib/clerk-host";
export default function SignupPage() {
  if (isClerkAuthHostedExternally()) {
    redirect(clerkSignUpUrl());
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <SignUp path="/signup" routing="path" signInUrl={clerkSignInUrl()} />
    </div>
  );
}
