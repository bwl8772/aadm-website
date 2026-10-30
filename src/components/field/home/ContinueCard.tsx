import type { ContinueAction } from "../field-types";
import { Pill } from "./Pill";

type Props = ContinueAction;

export default function ContinueCard({
	label,
	engagement,
	specialist,
	blocks,
	verb,
}: Props) {
	return (
		<article className="flex flex-col gap-5 rounded-xl border border-accent-blue/30 bg-surface-card p-6 sm:flex-row sm:items-center sm:justify-between">
			<div className="min-w-0">
				<p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-blue">
					Continue · most consequential
				</p>
				<h2 className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
					{label}
				</h2>
				<div className="mt-3 flex flex-wrap items-center gap-2 text-text-secondary">
					<span>{engagement}</span>
					<Pill>{specialist}</Pill>
					{blocks ? <Pill tone="warn">{blocks}</Pill> : null}
				</div>
			</div>
			<button
				type="button"
				className="shrink-0 rounded-md bg-accent-blue px-5 py-3 font-semibold text-text-inverse transition hover:bg-accent-blue-dim focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			>
				{verb}
			</button>
		</article>
	);
}
