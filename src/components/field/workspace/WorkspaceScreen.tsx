import ActionControl from "../ActionControl";
import { CommandScopeProvider, useViewInvalidated } from "../commands";
import type { WorkspaceView } from "../field-types";
import NextStepBanner from "../NextStepBanner";
import ScreenHeader from "../ScreenHeader";
import EngagementRow from "./EngagementRow";

/**
 * Workspace screen (docs/contracts/FIELD-WORKSPACE.md): one workspace's
 * engagements as a collection, each row led by its next item. Renders the
 * view exactly as sent; filters are links, so changing one is a new read.
 */
export default function WorkspaceScreen({ view }: { view: WorkspaceView }) {
	useViewInvalidated("workspace", view.workspace.id);
	const empty = view.engagements.items.length === 0;

	return (
		<CommandScopeProvider
			value={{
				workspace_id: view.workspace.id,
				generated_at: view.generated_at,
			}}
		>
			<div
				data-field-screen="workspace"
				className="flex min-h-screen flex-col bg-surface-deep"
			>
				<ScreenHeader
					crumbs={view.breadcrumbs}
					switcher={view.switcher}
					viewerInitials={view.viewer.initials}
				>
					{view.actions.map((a) => (
						<ActionControl
							key={`${a.command ?? a.href}:${a.label}`}
							action={a}
							className="hidden sm:inline-flex"
						/>
					))}
				</ScreenHeader>
				<NextStepBanner />

				<div className="grid flex-1 grid-cols-1 gap-8 px-4 py-8 sm:px-7 sm:py-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
					<main id="main" className="min-w-0">
						<div className="flex flex-wrap items-baseline justify-between gap-2">
							<h1 className="text-3xl font-bold tracking-tight text-foreground">
								{view.workspace.name}
							</h1>
							<p className="text-text-secondary">
								{view.viewer.role_label}
								{view.workspace.slack_label
									? ` · ${view.workspace.slack_label}`
									: ""}
							</p>
						</div>

						{empty ? (
							<div className="mt-8" data-field-state="empty">
								<h2 className="text-xl font-semibold text-foreground">
									{view.empty_state.heading}
								</h2>
								<p className="mt-3 max-w-2xl text-text-secondary">
									{view.empty_state.line}
								</p>
								{view.empty_state.create ? (
									<div className="mt-5">
										<ActionControl action={view.empty_state.create} />
									</div>
								) : null}
							</div>
						) : (
							<>
								<nav
									className="mt-6 flex flex-wrap gap-2"
									aria-label="Filter engagements"
								>
									{view.filters.map((f) => (
										<a
											key={f.id}
											href={`?filter=${encodeURIComponent(f.id)}`}
											aria-current={f.selected ? "page" : undefined}
											className={`rounded-md px-4 py-2 font-medium transition ${f.selected ? "bg-foreground text-background" : "text-text-secondary hover:bg-muted hover:text-foreground"}`}
										>
											{f.label}
										</a>
									))}
								</nav>
								<ol className="mt-4 flex flex-col gap-4">
									{view.engagements.items.map((row) => (
										<EngagementRow key={row.engagement_id} row={row} />
									))}
								</ol>
							</>
						)}
					</main>

					<aside
						className="min-w-0"
						aria-labelledby="workspace-members-heading"
					>
						<h2
							id="workspace-members-heading"
							className="text-lg font-semibold text-foreground"
						>
							Members
						</h2>
						<ul className="mt-4 flex flex-col gap-3">
							{view.members.map((m) => (
								<li key={m.member_id} className="flex items-center gap-3">
									<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
										{m.initials}
									</span>
									<span className="min-w-0">
										<span className="block truncate font-medium text-foreground">
											{m.name}
										</span>
										<span className="block text-sm text-text-muted">
											{m.role_label}
										</span>
									</span>
								</li>
							))}
						</ul>
					</aside>
				</div>
			</div>
		</CommandScopeProvider>
	);
}
