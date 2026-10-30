import type { WorkbenchAgentGroup } from "../field-types";

interface Props {
	groups: WorkbenchAgentGroup[];
	activeId: string;
	onSelect: (agentId: string) => void;
}

export default function AgentRail({ groups, activeId, onSelect }: Props) {
	return (
		<nav aria-label="Agents" className="min-w-0 border-r border-border bg-surface-card px-3 py-6">
			<div className="px-3">
				<h2 className="font-semibold text-foreground">Agents</h2>
				<p className="mt-0.5 text-sm text-text-secondary">Your specialists, one shared context</p>
			</div>
			{groups.map((g) => (
				<div key={g.label} className="mt-6">
					<p className="px-3 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">{g.label}</p>
					<ul className="mt-2 flex flex-col gap-0.5">
						{g.agents.map((a) => {
							const active = a.agent_id === activeId;
							return (
								<li key={a.agent_id}>
									<button
										type="button"
										aria-current={active ? "true" : undefined}
										onClick={() => onSelect(a.agent_id)}
										className={`w-full rounded-md px-3 py-2 text-left transition ${active ? "bg-accent-blue/10" : "hover:bg-muted"}`}
									>
										<span className={`block font-medium ${active ? "text-accent-blue" : "text-foreground"}`}>{a.name}</span>
										{a.status ? (
											<span
												className={`mt-0.5 block text-sm ${a.status.tone === "warn" ? "font-medium text-brand-warn" : active ? "text-accent-blue" : "text-text-secondary"}`}
											>
												{a.status.label}
											</span>
										) : null}
									</button>
								</li>
							);
						})}
					</ul>
				</div>
			))}
		</nav>
	);
}
