import type { ToneKey, WorkbenchAgentGroup } from "../field-types";

const statusClass: Record<ToneKey, string> = {
	neutral: "text-text-secondary",
	info: "text-accent-blue",
	success: "text-brand-mcp",
	warning: "font-medium text-brand-warn",
	danger: "font-medium text-destructive",
};

const itemClass = (selected: boolean) =>
	`block w-full rounded-md px-3 py-2 text-left transition ${selected ? "bg-accent-blue/10" : "hover:bg-muted"}`;

/**
 * Workbench left rail: specialist agents in the server's groups and order.
 * Selecting an agent follows its `open` action (a new read); the server says
 * which one is selected.
 */
export default function AgentRail({
	groups,
}: {
	groups: WorkbenchAgentGroup[];
}) {
	return (
		<nav
			aria-label="Agents"
			className="min-w-0 border-r border-border bg-surface-card px-3 py-6"
		>
			<div className="px-3">
				<h2 className="font-semibold text-foreground">Agents</h2>
				<p className="mt-0.5 text-sm text-text-secondary">
					Your specialists, one shared context
				</p>
			</div>
			{groups.map((g) => (
				<div key={g.group_id} className="mt-6">
					<p className="px-3 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
						{g.label}
					</p>
					<ul className="mt-2 flex flex-col gap-0.5">
						{g.agents.map((a) => {
							const body = (
								<>
									<span
										className={`block font-medium ${a.selected ? "text-accent-blue" : "text-foreground"}`}
									>
										{a.label}
									</span>
									{a.status_text ? (
										<span
											className={`mt-0.5 block text-sm ${a.selected ? "text-accent-blue" : statusClass[a.status_tone ?? "neutral"]}`}
										>
											{a.status_text}
										</span>
									) : null}
								</>
							);
							const href =
								a.open.kind === "navigate" && a.open.enabled
									? a.open.href
									: undefined;
							return (
								<li key={a.agent_id}>
									{href ? (
										<a
											href={href}
											aria-current={a.selected ? "page" : undefined}
											className={itemClass(a.selected)}
										>
											{body}
										</a>
									) : (
										<span
											aria-current={a.selected ? "page" : undefined}
											title={a.open.disabled_reason}
											className={`${itemClass(a.selected)} opacity-60`}
										>
											{body}
										</span>
									)}
								</li>
							);
						})}
					</ul>
				</div>
			))}
		</nav>
	);
}
