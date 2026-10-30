import { useState } from "react";
import type { WorkbenchArtifact, WorkbenchInventory } from "../field-types";
import SegmentedTabs from "../SegmentedTabs";
import ArtifactList from "./ArtifactList";
import InventoryList from "./InventoryList";

type Tab = "artifacts" | "land";

/** Workbench right rail: saved artifacts, or the customer's lay of the land. */
export default function SidePanel({
	artifacts,
	inventories,
}: {
	artifacts: WorkbenchArtifact[];
	inventories: WorkbenchInventory[];
}) {
	const [tab, setTab] = useState<Tab>("land");
	return (
		<aside
			aria-label="Engagement records"
			className="min-w-0 border-l border-border bg-surface-card px-5 py-6"
		>
			<SegmentedTabs
				label="Engagement records"
				stretch
				active={tab}
				onChange={setTab}
				tabs={[
					{ key: "artifacts", label: `Artifacts · ${artifacts.length}` },
					{ key: "land", label: `Lay of the land · ${inventories.length}` },
				]}
			/>
			<div className="mt-5">
				{tab === "artifacts" ? (
					<ArtifactList artifacts={artifacts} />
				) : (
					<InventoryList inventories={inventories} />
				)}
			</div>
		</aside>
	);
}
