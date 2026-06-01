"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { clerkUserProfileUrl } from "@/lib/clerk-host";

const internalNav = [
	{ href: "/dashboard/tokens", label: "MCP access" },
	{ href: "/subscription", label: "Subscription" },
] as const;

const accountProfileUrl =
	clerkUserProfileUrl() ?? "https://accounts.aadm.io/user";

export function DashboardChrome({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
			<div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row lg:gap-10">
				<aside className="shrink-0 lg:w-56">
					<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
						Dashboard
					</p>
					<nav className="flex flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible">
						{internalNav.map(({ href, label }) => {
							const active =
								href === "/dashboard/tokens"
									? pathname === "/dashboard/tokens" || pathname === "/dashboard"
									: pathname === href || pathname.startsWith(`${href}/`);
							return (
								<Link
									key={href}
									href={href}
									className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition lg:whitespace-normal ${
										active
											? "bg-violet-600 text-white shadow-sm dark:bg-violet-600"
											: "text-zinc-700 hover:bg-zinc-200/80 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
									}`}
								>
									{label}
								</Link>
							);
						})}
						<a
							href={accountProfileUrl}
							className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200/80 lg:whitespace-normal dark:text-zinc-300 dark:hover:bg-zinc-800/80"
						>
							Account
						</a>
					</nav>
				</aside>
				<div className="min-w-0 flex-1">{children}</div>
			</div>
		</div>
	);
}
