import type { FieldEngagement } from "../field-types";
import { LensPill, Pill } from "./Pill";

export default function EngagementCard({
	engagement: e,
}: {
	engagement: FieldEngagement;
}) {
	return (
		<article className="rounded-xl border border-border bg-surface-card p-6">
			<div className="flex items-start justify-between gap-3">
				<div>
					<h3 className="text-lg font-semibold text-foreground">
						{e.href ? (
							<a
								href={e.href}
								className="hover:text-accent-blue hover:underline"
							>
								{e.customer}
							</a>
						) : (
							e.customer
						)}
					</h3>
					<p className="mt-0.5 text-text-secondary">{e.name}</p>
				</div>
				{e.status ? (
					<Pill tone={e.status.tone === "blocked" ? "danger" : "ok"}>
						{e.status.label}
					</Pill>
				) : null}
			</div>

			{e.summary ? (
				<p className="mt-4 text-sm text-text-secondary">{e.summary}</p>
			) : null}

			{e.detail ? (
				<>
					<dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
						{[
							["Outcome", e.detail.outcome],
							["Delivery", e.detail.delivery],
							["Next milestone", e.detail.next_milestone],
							["Waiting on", e.detail.waiting_on],
						].map(([k, v]) => (
							<div key={k}>
								<dt className="text-text-muted">{k}</dt>
								<dd className="mt-1 font-medium text-foreground">{v}</dd>
							</div>
						))}
					</dl>
					<ul className="mt-5 flex flex-wrap gap-2">
						{e.detail.lenses.map((l) => (
							<li key={l.name}>
								<LensPill {...l} />
							</li>
						))}
					</ul>
					{e.detail.drift ? (
						<p className="mt-5 rounded-md bg-brand-warn-bg px-3.5 py-2.5 text-sm text-brand-warn">
							{e.detail.drift}
						</p>
					) : null}
				</>
			) : null}
		</article>
	);
}
