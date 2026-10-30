import { FIELD_HOME_PATH } from "../../../lib/field-area";
import AccountMenu from "../AccountMenu";

const ghostButton =
	"hidden whitespace-nowrap rounded-md border border-border bg-surface-card px-4 py-2 font-semibold text-foreground transition hover:border-foreground/30 hover:bg-muted sm:inline-flex";

export default function WorkbenchHeader({
	customer,
	name,
}: {
	customer: string;
	name: string;
}) {
	return (
		<header className="sticky top-0 z-40 border-b border-border bg-surface-card pt-[env(safe-area-inset-top,0px)]">
			<div className="flex min-h-14 items-center gap-4 px-4 py-2 sm:h-16 sm:gap-6 sm:px-7 sm:py-0">
				<a
					href={FIELD_HOME_PATH}
					className="shrink-0 text-lg font-bold tracking-tight text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					AADM Field
				</a>
				<nav aria-label="Breadcrumb" className="min-w-0 truncate">
					<ol className="flex items-center gap-2 text-text-secondary">
						<li>
							<a href={FIELD_HOME_PATH} className="hover:text-foreground">
								My Field
							</a>
						</li>
						<li aria-hidden="true">/</li>
						<li>{customer}</li>
						<li aria-hidden="true">/</li>
						<li aria-current="page" className="font-semibold text-foreground">
							{name}
						</li>
					</ol>
				</nav>
				<div className="ml-auto flex items-center gap-3">
					<button type="button" className={ghostButton}>
						Brief
					</button>
					<button type="button" className={ghostButton}>
						Open in Claude
					</button>
					<button type="button" className={ghostButton}>
						Share in Slack
					</button>
					<AccountMenu />
				</div>
			</div>
		</header>
	);
}
