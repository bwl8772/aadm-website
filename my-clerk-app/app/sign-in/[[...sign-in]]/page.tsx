import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        <Link href="/forgot-password" className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100">
          Forgot password?
        </Link>
      </p>
    </div>
  );
}
