import {
	ClerkProvider,
	Show,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import {
	clerkForgotPasswordHref,
	clerkSignInUrl,
	clerkSignUpUrl,
	clerkUserProfileUrl,
} from "@/lib/clerk-host";
import {
	CLERK_AFTER_SIGN_OUT_URL,
	CLERK_POST_AUTH_DEFAULT_PATH,
} from "@/lib/clerk-redirects";
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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { userId } = await auth();
	const hostedUserProfileUrl = clerkUserProfileUrl();
	const signInPath = clerkSignInUrl();
	const signUpPath = clerkSignUpUrl();

	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				<ClerkProvider signInUrl={signInPath} signUpUrl={signUpPath} afterSignOutUrl={CLERK_AFTER_SIGN_OUT_URL}>
					<header className="flex items-center gap-2 border-b border-zinc-200 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 dark:border-zinc-800">
						<Link
							href={userId ? CLERK_POST_AUTH_DEFAULT_PATH : "/"}
							className="shrink-0 font-semibold text-base text-zinc-900 sm:text-lg dark:text-zinc-50"
						>
							Home
						</Link>
						<div className="min-w-0 flex-1" aria-hidden="true" />
						<nav
							className="scrollbar-none flex shrink-0 flex-nowrap items-center justify-end gap-2 overflow-x-auto sm:gap-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
							aria-label="Account"
						>
							<Show when="signed-in">
								<Link
									href="/dashboard/tokens"
									className="shrink-0 whitespace-nowrap text-sm font-medium text-zinc-800 hover:underline dark:text-zinc-200"
								>
									<span className="sm:hidden">Tokens</span>
									<span className="hidden sm:inline">Dashboard</span>
								</Link>
								<Link
									href="/user"
									className="shrink-0 whitespace-nowrap text-sm text-zinc-700 hover:underline dark:text-zinc-300"
								>
									Account
								</Link>
								<Link
									href="/subscription"
									className="shrink-0 whitespace-nowrap text-sm text-zinc-700 hover:underline dark:text-zinc-300"
								>
									<span className="sm:hidden">Plan</span>
									<span className="hidden sm:inline">Subscription</span>
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
								<SignInButton mode="redirect">
									<button
										type="button"
										className="shrink-0 cursor-pointer rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 sm:px-3 sm:text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
									>
										<span className="sm:hidden">Login</span>
										<span className="hidden sm:inline">Sign in</span>
									</button>
								</SignInButton>
								<Link
									href={clerkForgotPasswordHref()}
									className="shrink-0 whitespace-nowrap text-xs text-zinc-600 hover:underline sm:text-sm dark:text-zinc-400"
								>
									<span className="sm:hidden">Forgot?</span>
									<span className="hidden sm:inline">Forgot password?</span>
								</Link>
								<SignUpButton mode="redirect">
									<button
										type="button"
										className="shrink-0 cursor-pointer rounded-md bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-violet-700 sm:px-3 sm:text-sm"
									>
										<span className="sm:hidden">Join</span>
										<span className="hidden sm:inline">Sign up</span>
									</button>
								</SignUpButton>
							</Show>
						</nav>
					</header>
					<main className="flex-1">{children}</main>
				</ClerkProvider>
			</body>
		</html>
	);
}
