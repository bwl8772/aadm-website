import { FIELD_HOME_PATH } from "../../lib/field-area";
import AccountMenu from "./AccountMenu";

const tab =
	"shrink-0 whitespace-nowrap rounded-md px-4 py-2 font-medium transition";

const tabs = [
	{ key: "home", href: FIELD_HOME_PATH, label: "My Field" },
	{
		key: "engagements",
		href: `${FIELD_HOME_PATH}#engagements`,
		label: "Engagements",
	},
] as const;

interface Props {
	active?: "home" | "engagements";
}

export default function FieldHeader({ active = "home" }: Props) {
	return (
		<header
			className="sticky top-0 z-40 border-b border-border bg-surface-card pt-[env(safe-area-inset-top,0px)]"
			data-field-header
		>
			<div className="flex min-h-14 items-center gap-4 px-4 py-2 sm:h-16 sm:gap-8 sm:px-7 sm:py-0">
				<a
					href={FIELD_HOME_PATH}
					aria-label="AADM Field — My Field"
					className="shrink-0 text-lg font-bold tracking-tight text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					AADM Field
				</a>

				<nav className="flex min-w-0 items-center gap-1" aria-label="Field">
					{tabs.map((t) => (
						<a
							key={t.key}
							href={t.href}
							aria-current={active === t.key ? "page" : undefined}
							className={`${tab} ${active === t.key ? "bg-muted text-foreground" : "text-text-secondary hover:bg-muted hover:text-foreground"}`}
						>
							{t.label}
						</a>
					))}
				</nav>

				<div className="ml-auto flex min-w-0 items-center gap-3 sm:gap-5">
					<label className="hidden md:block">
						<span className="sr-only">Search</span>
						<input
							type="search"
							placeholder="Search engagements, artifacts, decisions"
							className="w-[min(30vw,21rem)] rounded-md border border-border bg-surface-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-text-muted focus:border-accent-blue focus:outline-none"
						/>
					</label>
					<AccountMenu />
				</div>
			</div>
		</header>
	);
}
