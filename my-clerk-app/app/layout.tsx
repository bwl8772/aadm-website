import type { Metadata } from "next";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import {
  clerkForgotPasswordHref,
  clerkUserProfileUrl,
} from "@/lib/clerk-host";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Clerk App",
  description: "Next.js app with Clerk auth and Stripe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hostedUserProfileUrl = clerkUserProfileUrl();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider taskUrls={{ "reset-password": "/forgot-password/complete" }}>
          <header className="flex flex-wrap items-center gap-3 p-4 border-b border-zinc-200 dark:border-zinc-800">
            <Link href="/" className="font-semibold text-lg mr-auto">
              Home
            </Link>
            <Show when="signed-in">
              <Link href="/dashboard/tokens" className="text-sm font-medium hover:underline">
                Dashboard
              </Link>
              <Link href="/profile" className="text-sm hover:underline">
                Profile
              </Link>
              <Link href="/subscription" className="text-sm hover:underline">
                Subscription
              </Link>
              {hostedUserProfileUrl ? (
                <UserButton
                  userProfileMode="navigation"
                  userProfileUrl={hostedUserProfileUrl}
                />
              ) : (
                <UserButton />
              )}
            </Show>
            <Show when="signed-out">
              <SignInButton mode="redirect" />
              <Link
                href={clerkForgotPasswordHref()}
                className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
              >
                Forgot password?
              </Link>
              <SignUpButton mode="redirect" />
            </Show>
          </header>
          <main className="flex-1">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
