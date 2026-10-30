import { SignOutButton } from "@clerk/astro/react";
import { useEffect, useRef, useState } from "react";
import { CLERK_ACCOUNTS_SIGN_IN } from "../../lib/clerk-portal-urls";
import { FIELD_HOME_PATH } from "../../lib/field-area";
import {
	MEMBER_ACCOUNT_SEGMENT,
	MEMBER_API_KEYS_SEGMENT,
	MEMBER_AREA_PATH,
	MEMBER_MCP_OAUTH_SEGMENT,
	MEMBER_SECURITY_SEGMENT,
} from "../../lib/member-area";
import ThemeToggle from "./ThemeToggle";

const chip =
	"shrink-0 whitespace-nowrap rounded-none border border-border bg-transparent px-2.5 py-1.5 text-xs font-semibold text-foreground transition hover:border-foreground/30 hover:bg-accent";
const chipActive =
	"!border-foreground !bg-foreground !text-background hover:!bg-foreground";

const accountItems = [
	{ href: `${MEMBER_AREA_PATH}/${MEMBER_API_KEYS_SEGMENT}`, label: "API keys" },
	{
		href: `${MEMBER_AREA_PATH}/${MEMBER_MCP_OAUTH_SEGMENT}`,
		label: "Connectors OAuth",
	},
	{ href: `${MEMBER_AREA_PATH}/${MEMBER_ACCOUNT_SEGMENT}`, label: "Profile" },
	{ href: `${MEMBER_AREA_PATH}/${MEMBER_SECURITY_SEGMENT}`, label: "Security" },
] as const;

interface Props {
	active?: "home";
}

export default function FieldHeader({ active = "home" }: Props) {
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

	return (
		<header
			className="sticky top-0 z-40 border-b border-border bg-background/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md"
			data-field-header
		>
			<div className="mx-auto flex min-h-14 max-w-6xl items-center gap-3 px-4 py-2 sm:h-16 sm:px-8 sm:py-0">
				<a
					href={FIELD_HOME_PATH}
					aria-label="AADM Field — My Field"
					className="relative z-10 shrink-0 font-display text-base font-bold tracking-tight text-foreground transition hover:text-brand-mcp focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-lg"
				>
					<span className="inline-flex items-center gap-2">
						<img
							src="/favicon.svg"
							alt=""
							width={28}
							height={28}
							className="h-6 w-6 sm:h-7 sm:w-7"
						/>
						AADM Field
					</span>
				</a>

				<nav
					className="flex min-w-0 flex-1 items-center gap-2"
					aria-label="Field"
				>
					<a
						href={FIELD_HOME_PATH}
						aria-current={active === "home" ? "page" : undefined}
						className={`${chip} ${active === "home" ? chipActive : ""}`}
					>
						My Field
					</a>
				</nav>

				<div className="ml-auto flex items-center gap-2">
					<ThemeToggle />
					<div className="relative" ref={menuRef}>
						<button
							type="button"
							className={`${chip} inline-flex items-center gap-1.5`}
							aria-expanded={open}
							aria-haspopup="menu"
							onClick={() => setOpen((value) => !value)}
						>
							Account
							<svg
								width="12"
								height="12"
								viewBox="0 0 12 12"
								fill="none"
								aria-hidden="true"
							>
								<path
									d="M2.5 4.5L6 8l3.5-3.5"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="square"
								/>
							</svg>
						</button>
						{open ? (
							<div
								className="absolute right-0 z-50 mt-1 min-w-52 border border-border bg-background py-1 shadow-lg"
								role="menu"
								aria-label="Account"
							>
								{accountItems.map((item) => (
									<a
										key={item.href}
										href={item.href}
										className="block px-3 py-2 text-sm text-foreground hover:bg-accent"
										role="menuitem"
										onClick={() => setOpen(false)}
									>
										{item.label}
									</a>
								))}
								<SignOutButton redirectUrl={CLERK_ACCOUNTS_SIGN_IN}>
									<button
										type="button"
										className="block w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-accent hover:text-foreground"
										role="menuitem"
									>
										Sign out
									</button>
								</SignOutButton>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</header>
	);
}
