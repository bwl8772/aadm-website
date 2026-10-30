import { useState } from "react";
import type { WorkbenchArtifact } from "../field-types";
import { Pill } from "../Pill";

type Filter = "all" | "internal" | "customer";

const filters: { key: Filter; label: string }[] = [
	{ key: "all", label: "All" },
	{ key: "internal", label: "Internal" },
	{ key: "customer", label: "Customer-visible" },
];

/** Saved artifacts for the engagement, filterable by visibility. */
export default function ArtifactList({
	artifacts,
}: {
	artifacts: WorkbenchArtifact[];
}) {
	const [filter, setFilter] = useState<Filter>("all");
	const shown = artifacts.filter(
		(a) => filter === "all" || a.visibility === filter,
	);

	return (
		<div>
			<p className="text-sm text-text-secondary">
				Deliverables saved to the engagement
			</p>
			<div
				className="mt-3 flex flex-wrap gap-2"
				role="tablist"
				aria-label="Filter artifacts"
			>
				{filters.map((f) => (
					<button
						key={f.key}
						type="button"
						role="tab"
						aria-selected={filter === f.key}
						onClick={() => setFilter(f.key)}
						className={`rounded-full px-3 py-1 text-sm font-medium transition ${filter === f.key ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-accent"}`}
					>
						{f.label}
					</button>
				))}
			</div>
			<ul className="mt-4 flex flex-col gap-3">
				{shown.map((a) => (
					<li
						key={a.artifact_id}
						className="rounded-xl border border-border bg-surface-card p-4"
					>
						<div className="flex items-baseline justify-between gap-3">
							<h3 className="font-semibold text-foreground">
								{a.href ? (
									<a
										href={a.href}
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
						<div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
							<Pill tone={a.state.tone}>{a.state.label}</Pill>
							<span>{a.meta}</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
