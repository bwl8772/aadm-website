import { useState } from "react";
import { FIELD_HOME_PATH } from "../../../lib/field-area";
import Button from "../Button";
import Composer from "../Composer";
import type { WorkbenchModel } from "../field-types";
import PromptBubble from "../PromptBubble";
import ScreenHeader from "../ScreenHeader";
import AgentRail from "./AgentRail";
import ContextBar from "./ContextBar";
import DraftCard from "./DraftCard";
import SidePanel from "./SidePanel";

/** Engagement Workbench: agents (left) · canvas (middle) · saved artifacts (right). Renders the model it is given. */
export default function EngagementWorkbench({
	model,
}: {
	model: WorkbenchModel;
}) {
	const [activeId, setActiveId] = useState(model.active_agent_id);
	const active = model.agent_groups
		.flatMap((g) => g.agents)
		.find((a) => a.agent_id === activeId);
	const isInitialAgent = activeId === model.active_agent_id;
	const { prompt, draft } = isInitialAgent
		? model.canvas
		: { prompt: null, draft: null };

	return (
		<div
			data-field-screen="workbench"
			className="flex min-h-screen flex-col bg-surface-deep"
		>
			<ScreenHeader
				crumbs={[
					{ label: "My Field", href: FIELD_HOME_PATH },
					{ label: model.customer },
					{ label: model.name },
				]}
			>
				<Button className="hidden sm:inline-flex">Brief</Button>
				<Button className="hidden sm:inline-flex">Open in Claude</Button>
				<Button className="hidden sm:inline-flex">Share in Slack</Button>
			</ScreenHeader>
			<ContextBar context={model.context} />
			<div className="grid flex-1 grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)_21rem] xl:grid-cols-[18rem_minmax(0,1fr)_23rem]">
				<AgentRail
					groups={model.agent_groups}
					activeId={activeId}
					onSelect={setActiveId}
				/>

				<main id="main" className="flex min-w-0 flex-col">
					<div className="border-b border-border px-6 py-5 sm:px-10">
						<h1 className="text-xl font-semibold text-foreground">
							{active?.name}
						</h1>
						{isInitialAgent ? (
							<p className="mt-1 text-text-secondary">
								{model.active_agent_purpose}
							</p>
						) : null}
					</div>
					<div className="flex flex-1 flex-col gap-6 px-6 py-7 sm:px-10">
						{prompt ? <PromptBubble {...prompt} /> : null}
						{draft ? <DraftCard draft={draft} /> : null}
						<div className="mt-auto">
							<Composer
								placeholder="Ask, review, decide, create..."
								attachLabel="Attach evidence"
								agentLabel="Switch agent"
								note="Drafts stay in the canvas until you save"
							/>
						</div>
					</div>
				</main>

				<SidePanel
					artifacts={model.artifacts}
					inventories={model.inventories}
				/>
			</div>
		</div>
	);
}
