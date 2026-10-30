import type { StudioOutput } from "../field-types";
import { Pill } from "../Pill";

/** Studio right rail: output rows in server order; each opens in the center. */
export default function OutputsRail({ outputs }: { outputs: StudioOutput[] }) {
	return (
		<aside
			aria-labelledby="studio-outputs-heading"
			className="min-w-0 border-l border-border bg-surface-card px-5 py-6"
		>
			<h2 id="studio-outputs-heading" className="font-semibold text-foreground">
				Outputs
			</h2>
			<ul className="mt-4 flex flex-col gap-3">
				{outputs.map((o) => (
					<li key={o.artifact_id}>
						<a
							href={o.href}
							className="block rounded-xl border border-border bg-surface-card p-4 hover:border-foreground/30"
						>
							<div className="flex items-baseline justify-between gap-3">
								<h3 className="font-semibold text-foreground">{o.title}</h3>
								<span className="shrink-0 font-mono text-sm text-text-secondary">
									{o.version_label}
								</span>
							</div>
							<p className="mt-1 text-sm text-text-muted">
								{o.type_label} · {o.updated_label}
								{o.destination_label ? ` · ${o.destination_label}` : ""}
							</p>
							<div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
								<Pill tone={o.tone}>{o.state_label}</Pill>
								<span>
									{o.visibility === "internal"
										? "Internal"
										: "Customer-visible"}
								</span>
							</div>
						</a>
					</li>
				))}
			</ul>
		</aside>
	);
}
