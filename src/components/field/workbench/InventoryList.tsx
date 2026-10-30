import ActionControl from "../ActionControl";
import type { WorkbenchView } from "../field-types";
import { Pill } from "../Pill";

/** "Lay of the land": the server's inventory types in its order, with the actions it offers. */
export default function InventoryList({ land }: { land: WorkbenchView["land"] }) {
	return (
		<div>
			{land.actions.length > 0 ? (
				<div className="flex flex-wrap gap-3">
					{land.actions.map((a) => (
						<ActionControl key={`${a.command ?? a.href}:${a.label}`} action={a} />
					))}
				</div>
			) : null}
			<ul className="mt-4 flex flex-col gap-3">
				{land.items.map((inv) => (
					<li
						key={inv.inventory_id}
						data-inventory-type={inv.type}
						className="rounded-xl border border-border bg-surface-card p-4"
					>
						<div className="flex items-start justify-between gap-3">
							<h3 className="font-semibold text-foreground">{inv.label}</h3>
							<Pill tone={inv.status.tone}>{inv.status.label}</Pill>
						</div>
						<p className="mt-2 text-sm text-text-secondary">
							{inv.description}
							{inv.detail_label ? ` · ${inv.detail_label}` : ""}
						</p>
						<div className="mt-3 flex items-center justify-between gap-3">
							<span className="text-sm text-text-muted">{inv.agent_label}</span>
							<ActionControl action={inv.primary} size="sm" />
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
