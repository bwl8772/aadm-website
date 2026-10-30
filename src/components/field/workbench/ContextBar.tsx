import type { ToneKey, WorkbenchView } from "../field-types";
import { LensPill } from "../Pill";

const valueClass: Record<ToneKey, string> = {
	neutral: "text-foreground",
	info: "text-accent-blue",
	success: "text-brand-mcp",
	warning: "text-brand-warn",
	danger: "text-destructive",
};

/** Context bar: the server's ordered facts, then every lens with its link. Beside the work, not ahead of it (FLD-02). */
export default function ContextBar({
	facts,
	lenses,
}: {
	facts: WorkbenchView["context_bar"];
	lenses: WorkbenchView["lenses"];
}) {
	return (
		<div className="flex flex-wrap items-center gap-y-3 border-b border-border bg-surface-card px-4 py-3 sm:px-7">
			<dl className="flex flex-wrap items-center">
				{facts.map((f) => (
					<div
						key={f.label}
						className="border-r border-border px-5 py-1 first:pl-0"
					>
						<dt className="text-sm text-text-muted">{f.label}</dt>
						<dd
							className={`mt-0.5 text-sm font-semibold ${valueClass[f.tone ?? "neutral"]}`}
						>
							{f.value}
						</dd>
					</div>
				))}
			</dl>
			<ul className="flex flex-wrap gap-2 sm:pl-5" aria-label="Lenses">
				{lenses.map((l) => (
					<li key={l.id}>
						<a href={l.href} className="rounded-full hover:opacity-80">
							<LensPill label={l.label} state={l.state} tone={l.tone} />
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
