import ActionControl from "../ActionControl";
import CanvasStream from "../canvas/CanvasStream";
import Composer from "../Composer";
import { CommandScopeProvider, useViewInvalidated } from "../commands";
import type { Stream, WorkbenchView } from "../field-types";
import NextStepBanner from "../NextStepBanner";
import ScreenHeader from "../ScreenHeader";
import AgentRail from "./AgentRail";
import ContextBar from "./ContextBar";
import SidePanel from "./SidePanel";

/**
 * Engagement Workbench (docs/contracts/FIELD-WORKBENCH.md): agents (left) ·
 * canvas (middle) · artifacts or lay of the land (right). Renders the view
 * and the selected agent's stream exactly as sent; `stream` is null when that
 * region failed on its own (§5 "Partly unavailable").
 */
export default function EngagementWorkbench({
	view,
	stream,
}: {
	view: WorkbenchView;
	stream: Stream | null;
}) {
	useViewInvalidated("engagement", view.engagement.engagement_id);
	const agent = view.agent_groups
		.flatMap((g) => g.agents)
		.find((a) => a.agent_id === view.canvas.agent_id);

	return (
		<CommandScopeProvider
			value={{
				engagement_id: view.engagement.engagement_id,
				generated_at: view.generated_at,
			}}
		>
			<div
				data-field-screen="workbench"
				className="flex min-h-screen flex-col bg-surface-deep"
			>
				<ScreenHeader crumbs={view.breadcrumbs}>
					{view.client_links.map((a) => (
						<ActionControl
							key={`${a.kind}:${a.command ?? a.href}`}
							action={a}
							className="hidden sm:inline-flex"
						/>
					))}
				</ScreenHeader>
				<NextStepBanner />
				<ContextBar facts={view.context_bar} lenses={view.lenses} />
				<div className="grid flex-1 grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)_21rem] xl:grid-cols-[18rem_minmax(0,1fr)_23rem]">
					<AgentRail groups={view.agent_groups} />

					<main id="main" className="flex min-w-0 flex-col">
						<div className="border-b border-border px-6 py-5 sm:px-10">
							<h1 className="text-xl font-semibold text-foreground">
								{agent?.label}
							</h1>
							{agent ? (
								<p className="mt-1 text-text-secondary">{agent.description}</p>
							) : null}
						</div>
						<div className="flex flex-1 flex-col gap-6 px-6 py-7 sm:px-10">
							{stream ? (
								<>
									<CanvasStream
										stream={stream}
										starterPrompts={view.canvas.starter_prompts}
									/>
									<div className="mt-auto">
										<Composer
											send={stream.composer.send}
											placeholder={stream.composer.placeholder}
											note={stream.composer.note}
											uploads={view.uploads}
										/>
									</div>
								</>
							) : (
								<p
									className="rounded-xl border border-border bg-surface-card px-5 py-4 text-text-secondary"
									data-field-state="unavailable"
								>
									The canvas did not load. The rest of the engagement is still
									usable.
								</p>
							)}
						</div>
					</main>

					<SidePanel
						panels={view.panels}
						artifacts={view.artifacts}
						land={view.land}
						agentId={view.canvas.agent_id}
					/>
				</div>
			</div>
		</CommandScopeProvider>
	);
}
