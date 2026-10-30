import { useState } from "react";
import { FIELD_HOME_PATH } from "../../../lib/field-area";
import Button from "../Button";
import Composer from "../Composer";
import type { StudioModel } from "../field-types";
import ScreenHeader from "../ScreenHeader";
import SegmentedTabs from "../SegmentedTabs";
import BuiltView from "./BuiltView";
import CollectionsRail from "./CollectionsRail";
import MapView from "./MapView";
import OutputsRail from "./OutputsRail";
import StudioStream from "./StudioStream";

type TabKey = keyof StudioModel["tabs"];

/** Artifact Studio: collections (left) · stream (middle) · outputs (right). Renders the model it is given. */
export default function ArtifactStudio({
	model,
	workbenchHref,
}: {
	model: StudioModel;
	workbenchHref: string;
}) {
	const [tab, setTab] = useState<TabKey>("stream");

	return (
		<div
			data-field-screen="studio"
			className="flex min-h-screen flex-col bg-surface-deep"
		>
			<ScreenHeader
				crumbs={[
					{ label: "My Field", href: FIELD_HOME_PATH },
					{ label: `${model.customer} · ${model.name}`, href: workbenchHref },
					{ label: "Studio" },
				]}
			>
				<Button className="hidden sm:inline-flex">Open in Claude</Button>
				<Button href={workbenchHref} className="hidden sm:inline-flex">
					Back to workbench
				</Button>
			</ScreenHeader>

			<div className="grid flex-1 grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)_21rem] xl:grid-cols-[18rem_minmax(0,1fr)_23rem]">
				<CollectionsRail
					pinned={model.pinned}
					sections={model.sections}
					connected={model.connected}
				/>

				<main id="main" className="flex min-w-0 flex-col">
					<div className="flex flex-wrap items-center gap-4 border-b border-border px-6 py-3 sm:px-8">
						<SegmentedTabs
							label="Studio view"
							tabs={(Object.keys(model.tabs) as TabKey[]).map((key) => ({
								key,
								label: model.tabs[key],
							}))}
							active={tab}
							onChange={setTab}
						/>
						<p className="text-text-secondary">{model.context_label}</p>
					</div>
					<div className="flex-1 px-6 py-6 sm:px-8">
						{tab === "stream" ? (
							<StudioStream
								events={model.stream}
								onOpenBuilt={() => setTab("built")}
							/>
						) : tab === "built" ? (
							<BuiltView built={model.built} onBack={() => setTab("stream")} />
						) : (
							<MapView map={model.map} />
						)}
					</div>
					<div className="border-t border-border px-6 py-4 sm:px-8">
						<Composer
							dropzone
							placeholder="Ask, review, decide, create... or drop files here"
							attachLabel="Attach files"
							agentLabel={model.agent_name}
							note="Uploads are saved to engagement evidence"
						/>
					</div>
				</main>

				<OutputsRail
					outputs={model.outputs}
					onOpenBuilt={() => setTab("built")}
				/>
			</div>
		</div>
	);
}
