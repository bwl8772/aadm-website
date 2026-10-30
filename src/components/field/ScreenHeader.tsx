import type { ReactNode } from "react";
import { FIELD_HOME_PATH } from "../../lib/field-area";
import AccountMenu from "./AccountMenu";

export interface Crumb {
	label: string;
	href?: string;
}

/** Field screen header: brand · breadcrumb · actions · avatar. Last crumb is the current page. */
export default function ScreenHeader({
	crumbs,
	children,
}: {
	crumbs: Crumb[];
	children?: ReactNode;
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
						{crumbs.map((c, i) => {
							const last = i === crumbs.length - 1;
							return (
								<li key={c.label} className="flex items-center gap-2">
									{i > 0 ? <span aria-hidden="true">/</span> : null}
									{last ? (
										<span
											aria-current="page"
											className="font-semibold text-foreground"
										>
											{c.label}
										</span>
									) : c.href ? (
										<a href={c.href} className="hover:text-foreground">
											{c.label}
										</a>
									) : (
										c.label
									)}
								</li>
							);
						})}
					</ol>
				</nav>
				<div className="ml-auto flex items-center gap-3">
					{children}
					<AccountMenu />
				</div>
			</div>
		</header>
	);
}
