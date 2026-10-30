import ActionControl from "../ActionControl";
import type { ContinueItem } from "../field-types";
import { Pill } from "../Pill";

/** The one most consequential item, as the server chose and worded it. */
export default function ContinueCard({ item }: { item: ContinueItem }) {
	return (
		<article className="flex flex-col gap-5 rounded-xl border border-accent-blue/30 bg-surface-card p-6 sm:flex-row sm:items-center sm:justify-between">
			<div className="min-w-0">
				<p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-blue">
					Continue · most consequential
				</p>
				<h2 className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
					{item.title}
				</h2>
				<div className="mt-3 flex flex-wrap items-center gap-2 text-text-secondary">
					<span>{item.engagement_label}</span>
					<Pill>{item.specialist_label}</Pill>
					{item.badges.map((b) => (
						<Pill key={b.label} tone={b.tone}>
							{b.label}
						</Pill>
					))}
				</div>
			</div>
			<ActionControl action={item.primary} size="lg" />
		</article>
	);
}
