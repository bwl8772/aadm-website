import ActionControl from "../ActionControl";
import Composer from "../Composer";
import CanvasStream from "../canvas/CanvasStream";
import { CommandScopeProvider, useViewInvalidated } from "../commands";
import type { StudioView } from "../field-types";
import NextStepBanner from "../NextStepBanner";
import ScreenHeader from "../ScreenHeader";
import BuiltView from "./BuiltView";
import CollectionsRail from "./CollectionsRail";
import MapView from "./MapView";
import OutputsRail from "./OutputsRail";

/**
 * Artifact Studio (docs/contracts/FIELD-STUDIO.md): collections (left) ·
 * Stream, Built or Map (center) · Outputs (right). Renders the view exactly as
 * sent. The center view is chosen by the server (`active_view`); each tab is
 * a link, so changing it is a new read.
 */
export default function ArtifactStudio({ view }: { view: StudioView }) {
	useViewInvalidated("engagement", view.engagement.engagement_id);
	const viewHref = (id: string) =>
		`?artifact=${encodeURIComponent(view.open_artifact_id ?? "")}&view=${id}`;

	return (
		<CommandScopeProvider
			value={{
				engagement_id: view.engagement.engagement_id,
				generated_at: view.generated_at,
			}}
		>
			<div
				data-field-screen="studio"
				data-field-state={view.state}
				className="flex min-h-screen flex-col bg-surface-deep"
			>
				<ScreenHeader crumbs={view.breadcrumbs}>
					{view.header_actions.map((a) => (
						<ActionControl
							key={`${a.command ?? a.href}:${a.label}`}
							action={a}
							className="hidden sm:inline-flex"
						/>
					))}
				</ScreenHeader>
				<NextStepBanner />

				<div className="grid flex-1 grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)_21rem] xl:grid-cols-[18rem_minmax(0,1fr)_23rem]">
					<CollectionsRail rail={view.rail} />

					<main id="main" className="flex min-w-0 flex-col">
						<div className="flex flex-wrap items-center gap-4 border-b border-border px-6 py-3 sm:px-8">
							<nav
								aria-label="Studio view"
								className="inline-flex gap-1 rounded-lg bg-muted p-1"
							>
								{view.views.map((t) =>
									t.enabled ? (
										<a
											key={t.id}
											href={viewHref(t.id)}
											aria-current={
												t.id === view.active_view ? "page" : undefined
											}
											className={`whitespace-nowrap rounded-md px-4 py-2 font-medium transition ${t.id === view.active_view ? "bg-surface-card text-foreground shadow-sm" : "text-text-secondary hover:text-foreground"}`}
										>
											{t.label}
											{t.count !== undefined ? ` · ${t.count}` : ""}
										</a>
									) : (
										<span
											key={t.id}
											title={t.disabled_reason}
											className="whitespace-nowrap rounded-md px-4 py-2 font-medium text-text-muted"
										>
											{t.label}
										</span>
									),
								)}
							</nav>
							<p className="text-text-secondary">{view.context_label}</p>
						</div>

						<div className="flex-1 px-6 py-6 sm:px-8">
							{view.open_artifact_id === null ? (
								<div data-field-state="no-artifact-open">
									<h1 className="text-xl font-semibold text-foreground">
										{view.empty_state?.heading}
									</h1>
									<p className="mt-2 text-text-secondary">
										{view.empty_state?.line}
									</p>
								</div>
							) : view.active_view === "stream" ? (
								view.stream ? (
									<CanvasStream stream={view.stream} starterPrompts={[]} />
								) : (
									<RegionUnavailable what="stream" />
								)
							) : view.active_view === "built" ? (
								view.built ? (
									<BuiltView built={view.built} />
								) : (
									<RegionUnavailable what="artifact" />
								)
							) : view.map ? (
								<MapView map={view.map} />
							) : (
								<RegionUnavailable what="map" />
							)}
						</div>

						{view.active_view === "stream" && view.stream ? (
							<div className="border-t border-border px-6 py-4 sm:px-8">
								<Composer
									send={view.stream.composer.send}
									placeholder={view.stream.composer.placeholder}
									note={view.stream.composer.note}
									uploads={view.uploads}
								/>
							</div>
						) : null}
					</main>

					<OutputsRail outputs={view.outputs} />
				</div>
			</div>
		</CommandScopeProvider>
	);
}

/** One region failed on its own; the rest of the screen stays usable (§5). */
function RegionUnavailable({ what }: { what: string }) {
	return (
		<p
			className="rounded-xl border border-border bg-surface-card px-5 py-4 text-text-secondary"
			data-field-state="unavailable"
		>
			The {what} did not load.
		</p>
	);
}
