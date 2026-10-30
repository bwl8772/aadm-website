import { useState } from "react";
import type { WorkbenchView } from "../field-types";
import SegmentedTabs from "../SegmentedTabs";
import ArtifactList from "./ArtifactList";
import InventoryList from "./InventoryList";

type Tab = WorkbenchView["panels"]["selected"];

/**
 * Workbench right rail: the server's two panel tabs with their labels and
 * counts. Which tab is showing is presentation state, seeded by the server.
 */
export default function SidePanel({
	panels,
	artifacts,
	land,
	agentId,
}: {
	panels: WorkbenchView["panels"];
	artifacts: WorkbenchView["artifacts"];
	land: WorkbenchView["land"];
	agentId: string;
}) {
	const [tab, setTab] = useState<Tab>(panels.selected);
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
				tabs={panels.tabs.map((t) => ({
					key: t.id,
					label: `${t.label} · ${t.count}`,
				}))}
			/>
			<div className="mt-5">
				{tab === "artifacts" ? (
					<ArtifactList artifacts={artifacts} agentId={agentId} />
				) : (
					<InventoryList land={land} />
				)}
			</div>
		</aside>
	);
}
