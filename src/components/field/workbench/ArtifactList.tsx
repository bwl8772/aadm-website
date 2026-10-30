import type { WorkbenchView } from "../field-types";
import { Pill } from "../Pill";

/**
 * Saved artifacts for the engagement. The visibility filters are the server's
 * and each is a link: changing the filter is a new read, never a local filter.
 */
export default function ArtifactList({
	artifacts,
	agentId,
}: {
	artifacts: WorkbenchView["artifacts"];
	agentId: string;
}) {
	const filterHref = (id: string) =>
		`?agent=${encodeURIComponent(agentId)}&panel=artifacts&filter=${encodeURIComponent(id)}`;
	return (
		<div>
			<nav
				className="flex flex-wrap gap-2"
				aria-label="Filter artifacts by visibility"
			>
				{artifacts.filters.map((f) => (
					<a
						key={f.id}
						href={filterHref(f.id)}
						aria-current={f.selected ? "page" : undefined}
						className={`rounded-full px-3 py-1 text-sm font-medium transition ${f.selected ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-accent"}`}
					>
						{f.label}
					</a>
				))}
			</nav>
			<ul className="mt-4 flex flex-col gap-3">
				{artifacts.items.map((a) => {
					const href =
						a.open.kind === "navigate" && a.open.enabled
							? a.open.href
							: undefined;
					return (
						<li
							key={a.artifact_id}
							className="rounded-xl border border-border bg-surface-card p-4"
						>
							<div className="flex items-baseline justify-between gap-3">
								<h3 className="font-semibold text-foreground">
									{href ? (
										<a
											href={href}
											className="hover:text-accent-blue hover:underline"
										>
											{a.title}
										</a>
									) : (
										a.title
									)}
								</h3>
								<span className="shrink-0 font-mono text-sm text-text-secondary">
									{a.version_label}
								</span>
							</div>
							<p className="mt-1 text-sm text-text-muted">
								{a.type_label} · {a.author_agent_label} · {a.owner_label}
							</p>
							<div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
								<Pill tone={a.state.tone}>{a.state.label}</Pill>
								<span>{a.visibility.label}</span>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
