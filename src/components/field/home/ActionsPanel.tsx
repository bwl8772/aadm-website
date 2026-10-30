import { useState } from "react";
import type { FieldAction } from "../field-types";
import { Pill } from "./Pill";

type Tab = "me" | "customer" | "all";

interface Props {
	actions: FieldAction[];
	counts: { waiting_on_me: number; waiting_on_customer: number; all: number };
}

export default function ActionsPanel({ actions, counts }: Props) {
	const [tab, setTab] = useState<Tab>("me");
	const rows = actions.filter((a) =>
		tab === "all"
			? true
			: tab === "me"
				? a.owner_kind === "engineer"
				: a.owner_kind === "customer",
	);
	const tabs: { key: Tab; label: string }[] = [
		{ key: "me", label: `Waiting on me · ${counts.waiting_on_me}` },
		{
			key: "customer",
			label: `Waiting on customer · ${counts.waiting_on_customer}`,
		},
		{ key: "all", label: `All · ${counts.all}` },
	];

	return (
		<div className="overflow-hidden rounded-xl border border-border bg-surface-card">
			<div
				className="flex flex-wrap gap-2 p-5"
				role="tablist"
				aria-label="Filter actions"
			>
				{tabs.map((t) => (
					<button
						key={t.key}
						type="button"
						role="tab"
						aria-selected={tab === t.key}
						onClick={() => setTab(t.key)}
						className={`rounded-md px-4 py-2 font-medium transition ${tab === t.key ? "bg-foreground text-background" : "text-text-secondary hover:bg-muted hover:text-foreground"}`}
					>
						{t.label}
					</button>
				))}
			</div>
			<div className="overflow-x-auto">
				<table className="w-full min-w-[52rem] text-left">
					<thead>
						<tr className="border-t border-border text-xs uppercase tracking-[0.1em] text-text-muted">
							<th className="px-5 py-3 font-semibold">Action</th>
							<th className="px-3 py-3 font-semibold">Engagement</th>
							<th className="px-3 py-3 font-semibold">Specialist</th>
							<th className="px-3 py-3 font-semibold">Owner</th>
							<th className="px-3 py-3 font-semibold">Waiting</th>
							<th className="px-5 py-3">
								<span className="sr-only">Act</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((a) => (
							<tr key={a.action_id} className="border-t border-border">
								<td className="px-5 py-4 font-medium text-foreground">
									{a.label}
								</td>
								<td className="max-w-[15rem] px-3 py-4 text-text-secondary">
									{a.engagement}
								</td>
								<td className="px-3 py-4">
									<Pill>{a.specialist}</Pill>
								</td>
								<td className="px-3 py-4 text-foreground">{a.owner_name}</td>
								<td
									className={`px-3 py-4 ${a.late ? "font-medium text-destructive" : "text-text-secondary"}`}
								>
									{a.waiting_label}
								</td>
								<td className="px-5 py-4 text-right">
									<button
										type="button"
										className="w-28 rounded-md border border-border bg-surface-card px-4 py-2 font-semibold text-foreground transition hover:border-foreground/30 hover:bg-muted"
									>
										{a.verb}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
