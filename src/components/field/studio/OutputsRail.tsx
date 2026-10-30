import type { StudioOutput } from "../field-types";
import { Pill } from "../Pill";

/** Studio right rail: saved versions for this work package. */
export default function OutputsRail({
	outputs,
	onOpenBuilt,
}: {
	outputs: StudioOutput[];
	onOpenBuilt: () => void;
}) {
	return (
		<aside
			aria-labelledby="studio-outputs-heading"
			className="min-w-0 border-l border-border bg-surface-card px-5 py-6"
		>
			<h2 id="studio-outputs-heading" className="font-semibold text-foreground">
				Outputs
			</h2>
			<p className="mt-0.5 text-sm text-text-secondary">
				Saved versions for this work package
			</p>
			<ul className="mt-4 flex flex-col gap-3">
				{outputs.map((o) => (
					<li key={o.artifact_id}>
						<button
							type="button"
							onClick={o.active ? onOpenBuilt : undefined}
							aria-current={o.active ? "true" : undefined}
							className={`block w-full text-left rounded-xl border p-4 ${o.active ? "border-accent-blue" : "border-border"} bg-surface-card`}
						>
							<div className="flex items-baseline justify-between gap-3">
								<h3 className="font-semibold text-foreground">{o.title}</h3>
								{o.version_label ? (
									<span className="shrink-0 font-mono text-sm text-text-secondary">
										{o.version_label}
									</span>
								) : null}
							</div>
							<div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
								<Pill tone={o.state.tone}>{o.state.label}</Pill>
								{o.meta ? <span>{o.meta}</span> : null}
							</div>
						</button>
					</li>
				))}
			</ul>
		</aside>
	);
}
