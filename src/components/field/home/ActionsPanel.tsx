import ActionControl from "../ActionControl";
import type { MyFieldView, ToneKey } from "../field-types";
import { Pill } from "../Pill";

const toneText: Record<ToneKey, string> = {
	neutral: "text-text-secondary",
	info: "text-accent-blue",
	success: "text-brand-mcp",
	warning: "font-medium text-brand-warn",
	danger: "font-medium text-destructive",
};

/**
 * Filter tabs and action rows, exactly as the server ordered and counted them.
 * A filter tab is a link: changing the filter is a new read, not a local filter.
 */
export default function ActionsPanel({
	filters,
	actions,
}: {
	filters: MyFieldView["filters"];
	actions: MyFieldView["actions"];
}) {
	return (
		<div className="overflow-hidden rounded-xl border border-border bg-surface-card">
			<nav className="flex flex-wrap gap-2 p-5" aria-label="Filter actions">
				{filters.map((f) => (
					<a
						key={f.id}
						href={`?filter=${encodeURIComponent(f.id)}`}
						aria-current={f.selected ? "page" : undefined}
						className={`rounded-md px-4 py-2 font-medium transition ${f.selected ? "bg-foreground text-background" : "text-text-secondary hover:bg-muted hover:text-foreground"}`}
					>
						{f.label} · {f.count}
					</a>
				))}
			</nav>
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
						{actions.items.map((a) => (
							<tr key={a.id} className="border-t border-border">
								<td className="px-5 py-4">
									<span className="block font-medium text-foreground">
										{a.title}
									</span>
									{a.blocks_label ? (
										<span
											className={`mt-0.5 block text-sm ${toneText[a.waiting_tone]}`}
										>
											{a.blocks_label}
										</span>
									) : null}
								</td>
								<td className="max-w-[15rem] px-3 py-4 text-text-secondary">
									{a.engagement_label}
								</td>
								<td className="px-3 py-4">
									<Pill>{a.specialist_label}</Pill>
								</td>
								<td className="px-3 py-4 text-foreground">{a.owner_label}</td>
								<td className={`px-3 py-4 ${toneText[a.waiting_tone]}`}>
									{a.waiting_label}
								</td>
								<td className="px-5 py-4 text-right">
									<ActionControl action={a.cta} className="w-28" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
