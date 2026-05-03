import type { Metadata } from "next";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <header className="flex items-center gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800">
            <Link href="/" className="font-semibold text-lg mr-auto">
              Home
            </Link>
            <Show when="signed-in">
              <Link href="/profile" className="text-sm hover:underline">
                Profile
              </Link>
              <Link href="/subscription" className="text-sm hover:underline">
                Subscription
              </Link>
              <UserButton />
            </Show>
            <Show when="signed-out">
              <SignInButton />
              <SignUpButton />
            </Show>
          </header>
          <main className="flex-1">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
