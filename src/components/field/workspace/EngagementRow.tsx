import ActionControl from "../ActionControl";
import type { ToneKey, WorkspaceEngagementRow } from "../field-types";
import { Pill } from "../Pill";

const toneText: Record<ToneKey, string> = {
	neutral: "text-text-secondary",
	info: "text-accent-blue",
	success: "text-brand-mcp",
	warning: "font-medium text-brand-warn",
	danger: "font-medium text-destructive",
};

/** One engagement row: the next item leads; position, outcome, people and status sit below it (FLD-02). */
export default function EngagementRow({
	row,
}: {
	row: WorkspaceEngagementRow;
}) {
	return (
		<li
			className="rounded-xl border border-border bg-surface-card p-5"
			data-engagement-id={row.engagement_id}
		>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0">
					<h2 className="text-lg font-semibold text-foreground">
						{row.next.title}
					</h2>
					<p className="mt-1 text-text-secondary">
						{row.next.owner_label} ·{" "}
						<span className={toneText[row.next.waiting_tone]}>
							{row.next.waiting_label}
						</span>
					</p>
				</div>
				<ActionControl action={row.next.open} />
			</div>

			<div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border pt-4 text-sm">
				<span className="font-medium text-foreground">
					{row.customer_label} · {row.engagement_label}
				</span>
				<span className="text-text-muted">· {row.position_label}</span>
				<span className="text-text-muted">· {row.updated_label}</span>
				{row.status ? (
					<span className="ml-auto" title={row.status.why}>
						<Pill tone={row.status.tone}>{row.status.label}</Pill>
					</span>
				) : null}
			</div>
			<p className="mt-2 text-sm text-text-secondary">{row.outcome_label}</p>
			<ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
				{row.people.map((p) => (
					<li key={`${p.role_label}:${p.label}`}>
						<span className="text-foreground">{p.label}</span> · {p.role_label}
					</li>
				))}
				<li className="ml-auto">
					<ActionControl action={row.open} size="sm" />
				</li>
			</ul>
			{row.status ? (
				<p className="mt-2 text-sm text-text-secondary">{row.status.why}</p>
			) : null}
		</li>
	);
}
