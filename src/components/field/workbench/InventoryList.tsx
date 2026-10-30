import Button from "../Button";
import type { WorkbenchInventory } from "../field-types";
import { Pill } from "../Pill";

/** "Lay of the land": inventories of what the customer has today. */
export default function InventoryList({
	inventories,
}: {
	inventories: WorkbenchInventory[];
}) {
	return (
		<div>
			<p className="text-sm leading-relaxed text-text-secondary">
				Inventories of what the customer has today: technology, people,
				processes and data. Built with your agents from uploads, interviews and
				connected systems.
			</p>
			<div className="mt-4 grid grid-cols-[2fr_3fr] gap-3">
				<Button>Import file</Button>
				<Button>+ New inventory</Button>
			</div>
			<ul className="mt-4 flex flex-col gap-3">
				{inventories.map((inv) => (
					<li
						key={inv.inventory_id}
						className={`rounded-xl border p-4 ${inv.highlighted ? "border-accent-blue/40 bg-accent-blue/5" : "border-border bg-surface-card"}`}
					>
						<div className="flex items-start justify-between gap-3">
							<h3 className="font-semibold text-foreground">{inv.title}</h3>
							<Pill tone={inv.state.tone}>{inv.state.label}</Pill>
						</div>
						<p className="mt-2 text-sm text-text-secondary">{inv.summary}</p>
						<div className="mt-3 flex items-center justify-between gap-3">
							<span className="text-sm text-text-muted">{inv.agent_name}</span>
							<Button variant={inv.action.primary ? "primary" : "outline"}>
								{inv.action.label}
							</Button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
