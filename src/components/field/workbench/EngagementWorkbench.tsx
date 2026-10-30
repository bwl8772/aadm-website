import { useState } from "react";
import type { WorkbenchModel } from "../field-types";
import AgentRail from "./AgentRail";
import ArtifactRail from "./ArtifactRail";
import Composer from "./Composer";
import ContextBar from "./ContextBar";
import DraftCard from "./DraftCard";
import WorkbenchHeader from "./WorkbenchHeader";

/** Engagement Workbench: agents (left) · canvas (middle) · saved artifacts (right). Renders the model it is given. */
export default function EngagementWorkbench({ model }: { model: WorkbenchModel }) {
	const [activeId, setActiveId] = useState(model.active_agent_id);
	const active = model.agent_groups.flatMap((g) => g.agents).find((a) => a.agent_id === activeId);
	const isInitialAgent = activeId === model.active_agent_id;
	const { prompt, draft } = isInitialAgent ? model.canvas : { prompt: null, draft: null };

	return (
		<div data-field-screen="workbench" className="flex min-h-screen flex-col bg-surface-deep">
			<WorkbenchHeader customer={model.customer} name={model.name} />
			<ContextBar context={model.context} />
			<div className="grid flex-1 grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)_19rem] xl:grid-cols-[18rem_minmax(0,1fr)_21rem]">
				<AgentRail groups={model.agent_groups} activeId={activeId} onSelect={setActiveId} />

				<main id="main" className="flex min-w-0 flex-col">
					<div className="border-b border-border px-6 py-5 sm:px-10">
						<h1 className="text-xl font-semibold text-foreground">{active?.name}</h1>
						{isInitialAgent ? <p className="mt-1 text-text-secondary">{model.active_agent_purpose}</p> : null}
					</div>
					<div className="flex flex-1 flex-col gap-6 px-6 py-7 sm:px-10">
						{prompt ? (
							<div className="ml-auto max-w-3xl rounded-xl bg-foreground px-5 py-4 text-background">
								<p>{prompt.text}</p>
								{prompt.attachments.length > 0 ? (
									<ul className="mt-3 flex flex-wrap gap-2">
										{prompt.attachments.map((f) => (
											<li key={f} className="rounded-md bg-background/15 px-2.5 py-1 text-sm font-medium">
												{f}
											</li>
										))}
									</ul>
								) : null}
							</div>
						) : null}
						{draft ? <DraftCard draft={draft} /> : null}
						<div className="mt-auto">
							<Composer />
						</div>
					</div>
				</main>

				<ArtifactRail artifacts={model.artifacts} />
			</div>
		</div>
	);
}
