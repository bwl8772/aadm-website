import type { WorkbenchModel } from "../field-types";
import { LensPill } from "../home/Pill";

export default function ContextBar({ context }: { context: WorkbenchModel["context"] }) {
	const facts: [string, string][] = [
		["Outcome", context.outcome],
		["Delivery", context.delivery],
		["Next milestone", context.next_milestone],
		["Waiting on", context.waiting_on],
		["Blockers", String(context.blockers)],
	];
	return (
		<div className="flex flex-wrap items-center gap-y-3 border-b border-border bg-surface-card px-4 py-3 sm:px-7">
			<dl className="flex flex-wrap items-center">
				{facts.map(([k, v]) => (
					<div key={k} className="border-r border-border px-5 py-1 first:pl-0">
						<dt className="text-sm text-text-muted">{k}</dt>
						<dd className="mt-0.5 text-sm font-semibold text-foreground">{v}</dd>
					</div>
				))}
			</dl>
			<ul className="flex flex-wrap gap-2 sm:pl-5" aria-label="Lenses">
				{context.lenses.map((l) => (
					<li key={l.name}>
						<LensPill name={l.name} status={l.status} />
					</li>
				))}
			</ul>
		</div>
	);
}
