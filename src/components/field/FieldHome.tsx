import type { MyFieldView } from "./field-types";
import ActionsPanel from "./home/ActionsPanel";
import ContinueCard from "./home/ContinueCard";
import EngagementCard from "./home/EngagementCard";

/** Renders a MyFieldView exactly as sent (docs/contracts/FIELD-MY-FIELD.md). */
export default function FieldHome({ view }: { view: MyFieldView }) {
	const empty =
		view.actions.items.length === 0 && view.engagements.length === 0;

	if (empty) {
		return (
			<div className="min-w-0" data-field-screen="home">
				<h1 className="text-3xl font-bold tracking-tight text-foreground">
					{view.empty_state.heading}
				</h1>
				<p className="mt-4 max-w-2xl text-text-secondary">
					{view.empty_state.line}
				</p>
			</div>
		);
	}

	return (
		<div
			data-field-screen="home"
			className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_23rem]"
		>
			<section className="min-w-0">
				<div className="flex flex-wrap items-baseline justify-between gap-2">
					<h1 className="text-3xl font-bold tracking-tight text-foreground">
						Where to act
					</h1>
					<p className="text-text-secondary">{view.summary_label}</p>
				</div>
				{view.continue ? (
					<div className="mt-6">
						<ContinueCard item={view.continue} />
					</div>
				) : null}
				<div className="mt-6">
					<ActionsPanel filters={view.filters} actions={view.actions} />
				</div>
			</section>

			<aside
				id="engagements"
				className="min-w-0 scroll-mt-24"
				aria-labelledby="field-engagements-heading"
			>
				<h2
					id="field-engagements-heading"
					className="text-lg font-semibold text-foreground"
				>
					Engagements
				</h2>
				<div className="mt-4 flex flex-col gap-5">
					{view.engagements.map((c) => (
						<EngagementCard key={c.engagement_id} card={c} />
					))}
				</div>
			</aside>
		</div>
	);
}
