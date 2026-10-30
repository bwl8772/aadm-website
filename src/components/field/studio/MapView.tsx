import type { StudioMap } from "../field-types";

const colLabel =
	"text-xs font-bold uppercase tracking-[0.12em] text-text-muted";

function Node({ label, note }: { label: string; note: string }) {
	return (
		<li className="rounded-lg border border-border bg-surface-card px-3 py-2">
			<span className="block text-sm font-medium text-foreground">{label}</span>
			<span className="block text-xs text-text-muted">{note}</span>
		</li>
	);
}

function Arrow() {
	return (
		<span aria-hidden="true" className="self-center text-xl text-text-muted">
			→
		</span>
	);
}

/** How this artifact connects to the rest of the engagement: inputs → artifact → outputs. */
export default function MapView({ map }: { map: StudioMap }) {
	return (
		<div>
			<p className="text-text-secondary">{map.intro}</p>
			<div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
				<section>
					<h3 className={colLabel}>Built from</h3>
					<ul className="mt-2 flex flex-col gap-2">
						{map.built_from.map((n) => (
							<Node key={n.label} {...n} />
						))}
					</ul>
				</section>
				<Arrow />
				<section className="self-center rounded-xl border border-accent-blue bg-accent-blue/5 px-4 py-3">
					<h3 className={colLabel}>This artifact</h3>
					<p className="mt-1 font-semibold text-foreground">{map.self.label}</p>
					<p className="text-sm text-text-muted">{map.self.note}</p>
				</section>
				<Arrow />
				<section>
					<h3 className={colLabel}>Produces</h3>
					<ul className="mt-2 flex flex-col gap-2">
						{map.produces.map((n) => (
							<Node key={n.label} {...n} />
						))}
					</ul>
				</section>
			</div>
		</div>
	);
}
