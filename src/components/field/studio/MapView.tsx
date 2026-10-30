import type { ArtifactMap, MapNode, ToneKey } from "../field-types";

const colLabel =
	"text-xs font-bold uppercase tracking-[0.12em] text-text-muted";

const toneText: Record<ToneKey, string> = {
	neutral: "text-text-muted",
	info: "text-accent-blue",
	success: "text-brand-mcp",
	warning: "text-brand-warn",
	danger: "text-destructive",
};

function Node({ node, self = false }: { node: MapNode; self?: boolean }) {
	const inner = (
		<>
			<span className="block text-xs text-text-muted">{node.kind}</span>
			<span
				className={`block ${self ? "font-semibold" : "text-sm font-medium"} text-foreground`}
			>
				{node.label}
			</span>
			{node.sublabel ? (
				<span className={`block text-xs ${toneText[node.tone ?? "neutral"]}`}>
					{node.sublabel}
				</span>
			) : null}
		</>
	);
	const cls = self
		? "block rounded-xl border border-accent-blue bg-accent-blue/5 px-4 py-3"
		: "block rounded-lg border border-border bg-surface-card px-3 py-2";
	return (
		<li data-map-node={node.id}>
			{node.href ? (
				<a href={node.href} className={`${cls} hover:border-foreground/30`}>
					{inner}
				</a>
			) : (
				<span className={cls}>{inner}</span>
			)}
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

/**
 * The open artifact in the context of the engagement: nodes in three columns
 * by `role` (the server orders them within each), edges listed with their
 * relation labels (FIELD-STUDIO.md §3 "Map").
 */
export default function MapView({ map }: { map: ArtifactMap }) {
	const byRole = (role: MapNode["role"]) =>
		map.nodes.filter((n) => n.role === role);
	const label = (id: string) => map.nodes.find((n) => n.id === id)?.label ?? id;
	return (
		<div data-map-layout={map.layout_hint}>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
				<section>
					<h3 className={colLabel}>Inputs</h3>
					<ul className="mt-2 flex flex-col gap-2">
						{byRole("input").map((n) => (
							<Node key={n.id} node={n} />
						))}
					</ul>
				</section>
				<Arrow />
				<section className="self-center">
					<h3 className={colLabel}>This artifact</h3>
					<ul className="mt-2">
						{byRole("self").map((n) => (
							<Node key={n.id} node={n} self />
						))}
					</ul>
				</section>
				<Arrow />
				<section>
					<h3 className={colLabel}>Outputs</h3>
					<ul className="mt-2 flex flex-col gap-2">
						{byRole("output").map((n) => (
							<Node key={n.id} node={n} />
						))}
					</ul>
				</section>
			</div>
			<details className="mt-6 text-sm">
				<summary className="cursor-pointer text-text-secondary">
					Relations · {map.edges.length}
				</summary>
				<ul className="mt-2 flex flex-col gap-1 text-text-secondary">
					{map.edges.map((e) => (
						<li key={`${e.from}>${e.to}:${e.label}`}>
							<span className="text-foreground">{label(e.from)}</span> —{" "}
							{e.label} → <span className="text-foreground">{label(e.to)}</span>
						</li>
					))}
				</ul>
			</details>
		</div>
	);
}
