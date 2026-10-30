import type { MyFieldModel } from "./field-types";
import ActionsPanel from "./home/ActionsPanel";
import ContinueCard from "./home/ContinueCard";
import EngagementCard from "./home/EngagementCard";

/** Renders the My Field read model it is given. `null` = no data source wired yet. */
export default function FieldHome({ model }: { model: MyFieldModel | null }) {
	if (!model) {
		return (
			<div className="min-w-0">
				<h1 className="text-3xl font-bold tracking-tight text-foreground">Where to act</h1>
				<p className="mt-4 max-w-2xl text-text-secondary">Your engagements will show here.</p>
			</div>
		);
	}

	const { continue_action, actions, counts, engagements } = model;

	return (
		<div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_23rem]">
			<section className="min-w-0">
				<div className="flex flex-wrap items-baseline justify-between gap-2">
					<h1 className="text-3xl font-bold tracking-tight text-foreground">Where to act</h1>
					<p className="text-text-secondary">
						{counts.engagements} engagements · {counts.open_actions} open actions
					</p>
				</div>
				{continue_action ? (
					<div className="mt-6">
						<ContinueCard {...continue_action} />
					</div>
				) : null}
				<div className="mt-6">
					<ActionsPanel actions={actions} counts={counts} />
				</div>
			</section>

			<aside id="engagements" className="min-w-0 scroll-mt-24" aria-labelledby="field-engagements-heading">
				<div className="flex items-baseline justify-between">
					<h2 id="field-engagements-heading" className="text-lg font-semibold text-foreground">
						Engagements
					</h2>
					<a href="#engagements" className="text-accent-blue hover:underline">
						See all
					</a>
				</div>
				<div className="mt-4 flex flex-col gap-5">
					{engagements.map((e) => (
						<EngagementCard key={e.engagement_id} engagement={e} />
					))}
				</div>
			</aside>
		</div>
	);
}
