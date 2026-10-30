import { $userStore } from "@clerk/astro/client";
import { SignOutButton } from "@clerk/astro/react";
import { useEffect, useRef, useState } from "react";
import { CLERK_ACCOUNTS_SIGN_IN } from "../../lib/clerk-portal-urls";
import {
	MEMBER_ACCOUNT_SEGMENT,
	MEMBER_API_KEYS_SEGMENT,
	MEMBER_AREA_PATH,
	MEMBER_MCP_OAUTH_SEGMENT,
	MEMBER_SECURITY_SEGMENT,
} from "../../lib/member-area";
import ThemeToggle from "./ThemeToggle";

const accountItems = [
	{ href: `${MEMBER_AREA_PATH}/${MEMBER_API_KEYS_SEGMENT}`, label: "API keys" },
	{
		href: `${MEMBER_AREA_PATH}/${MEMBER_MCP_OAUTH_SEGMENT}`,
		label: "Connectors OAuth",
	},
	{ href: `${MEMBER_AREA_PATH}/${MEMBER_ACCOUNT_SEGMENT}`, label: "Profile" },
	{ href: `${MEMBER_AREA_PATH}/${MEMBER_SECURITY_SEGMENT}`, label: "Security" },
] as const;

/** Avatar button + account menu, shared by every Field screen header. */
export default function AccountMenu() {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		function onPointerDown(event: MouseEvent) {
			if (!menuRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		}
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") setOpen(false);
		}
		document.addEventListener("mousedown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("mousedown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open]);

	const [user, setUser] = useState($userStore.get());
	useEffect(() => $userStore.subscribe(setUser), []);
	const initials =
		[user?.firstName?.[0], user?.lastName?.[0]]
			.filter(Boolean)
			.join("")
			.toUpperCase() ||
		user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ||
		"";

	return (
		<div className="relative" ref={menuRef}>
			<button
				type="button"
				className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				aria-label="Account"
				aria-expanded={open}
				aria-haspopup="menu"
				onClick={() => setOpen((value) => !value)}
			>
				{initials}
			</button>
			{open ? (
				<div
					className="absolute right-0 z-50 mt-2 min-w-52 rounded-md border border-border bg-surface-card py-1 shadow-lg"
					role="menu"
					aria-label="Account"
				>
					{accountItems.map((item) => (
						<a
							key={item.href}
							href={item.href}
							className="block px-3 py-2 text-sm text-foreground hover:bg-muted"
							role="menuitem"
							onClick={() => setOpen(false)}
						>
							{item.label}
						</a>
					))}
					<div className="flex items-center justify-between px-3 py-1.5 text-sm text-text-secondary">
						Theme
						<ThemeToggle />
					</div>
					<SignOutButton redirectUrl={CLERK_ACCOUNTS_SIGN_IN}>
						<button
							type="button"
							className="block w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-muted hover:text-foreground"
							role="menuitem"
						>
							Sign out
						</button>
					</SignOutButton>
				</div>
			) : null}
		</div>
	);
}
