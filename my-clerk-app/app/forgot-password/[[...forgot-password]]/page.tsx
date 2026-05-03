import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="max-w-md text-center">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Forgot password</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Enter your email, then use the reset option in the form below (or your email provider link if you use magic links).
        </p>
      </div>
      <SignIn path="/forgot-password" routing="path" signUpUrl="/sign-up" />
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Remembered your password?{" "}
        <Link href="/sign-in" className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100">
          Sign in
        </Link>
      </p>
    </div>
  );
}
