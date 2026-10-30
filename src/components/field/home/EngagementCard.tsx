import type { EngagementCardView } from "../field-types";
import { LensPill, Pill } from "../Pill";

/** One engagement card; the whole card follows the server's `open` action. */
export default function EngagementCard({ card }: { card: EngagementCardView }) {
	const href =
		card.open.kind === "navigate" && card.open.enabled
			? card.open.href
			: undefined;
	return (
		<article className="relative rounded-xl border border-border bg-surface-card p-6 transition hover:border-foreground/25">
			<div className="flex items-start justify-between gap-3">
				<div>
					<h3 className="text-lg font-semibold text-foreground">
						{href ? (
							<a
								href={href}
								className="after:absolute after:inset-0 hover:text-accent-blue"
							>
								{card.customer_label}
							</a>
						) : (
							card.customer_label
						)}
					</h3>
					<p className="mt-0.5 text-text-secondary">{card.engagement_label}</p>
					<p className="mt-0.5 text-sm text-text-muted">
						{card.workspace_labels.join(" · ")}
					</p>
				</div>
				{card.status ? (
					<Pill tone={card.status.tone}>{card.status.label}</Pill>
				) : null}
			</div>

			{card.summary ? (
				<p className="mt-4 text-sm text-text-secondary">{card.summary}</p>
			) : null}

			{card.facts.length > 0 ? (
				<dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
					{card.facts.map((f) => (
						<div key={f.label}>
							<dt className="text-text-muted">{f.label}</dt>
							<dd className="mt-1 font-medium text-foreground">{f.value}</dd>
						</div>
					))}
				</dl>
			) : null}

			{card.land_label ? (
				<div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
					<span className="text-text-muted">Lay of the land</span>
					<span className="font-semibold text-foreground">
						{card.land_label}
					</span>
				</div>
			) : null}

			{card.lenses.length > 0 ? (
				<ul className="mt-4 flex flex-wrap gap-2">
					{card.lenses.map((l) => (
						<li key={l.id}>
							<LensPill label={l.label} state={l.state} tone={l.tone} />
						</li>
					))}
				</ul>
			) : null}

			{card.drift ? (
				<p
					className={`mt-4 rounded-md px-3.5 py-2.5 text-sm ${card.drift.tone === "danger" ? "bg-destructive/10 text-destructive" : "bg-brand-warn-bg text-brand-warn"}`}
				>
					{card.drift.text}
				</p>
			) : null}
		</article>
	);
}
