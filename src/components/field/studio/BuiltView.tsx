import type { ArtifactVersion } from "../field-types";
import { Pill } from "../Pill";
import BlockView from "./BlockView";
import ShareMenu from "./ShareMenu";

/**
 * One stored version exactly as saved: state, visibility, blocks by kind, and
 * the version label and content hash on screen (FIELD-STUDIO.md §3 "Built").
 * An older version shows a read-only bar; proof sits below the content (FLD-02).
 */
export default function BuiltView({ built }: { built: ArtifactVersion }) {
	const current = built.versions.find(
		(v) => v.version !== built.version && v.state === built.state,
	);
	return (
		<div className="flex flex-col gap-4" data-artifact-version={built.version}>
			{!built.is_current ? (
				<p
					role="status"
					className="flex flex-wrap items-center gap-3 rounded-md border border-brand-warn-border bg-brand-warn-bg px-4 py-2 text-sm text-brand-warn"
				>
					Viewing {built.version_label}, not the current version.
					{current ? (
						<a href={current.href} className="font-semibold underline">
							Go to current
						</a>
					) : null}
				</p>
			) : null}

			<div className="flex flex-wrap items-center gap-2">
				<h1 className="text-lg font-semibold text-foreground">{built.title}</h1>
				<Pill tone={built.tone}>{built.state_label}</Pill>
				<Pill>
					{built.visibility === "internal" ? "Internal" : "Customer-visible"}
				</Pill>
				<span className="text-sm text-text-secondary">
					{built.type_label} · {built.version_label} · {built.owner.label}
					{built.acceptor ? ` · accepts: ${built.acceptor.label}` : ""}
				</span>
				<div className="ml-auto">
					<ShareMenu
						options={built.share_options}
						artifactId={built.artifact_id}
						version={built.version}
					/>
				</div>
			</div>

			<article className="flex flex-col gap-4 rounded-xl border border-border bg-surface-card px-6 py-5 leading-relaxed">
				{built.blocks.map((b) => (
					<BlockView key={b.block_id} block={b} />
				))}
			</article>

			<footer className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
				<section>
					<h2 className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
						Built from
					</h2>
					<ul className="mt-2 flex flex-col gap-1">
						{built.built_from.map((s) => (
							<li key={s.id}>
								<a
									href={s.href}
									className="text-foreground hover:text-accent-blue hover:underline"
								>
									{s.label}
								</a>
							</li>
						))}
					</ul>
				</section>
				<section>
					<h2 className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
						Versions
					</h2>
					<ul className="mt-2 flex flex-col gap-1">
						{built.versions.map((v) => (
							<li
								key={v.version}
								className="flex flex-wrap gap-2 text-text-secondary"
							>
								<a
									href={v.href}
									aria-current={
										v.version === built.version ? "true" : undefined
									}
									className={`font-mono ${v.version === built.version ? "font-semibold text-foreground" : "hover:text-foreground"}`}
								>
									{v.version_label}
								</a>
								<span>
									{v.saved_by} · {v.saved_label}
								</span>
							</li>
						))}
					</ul>
					<p
						className="mt-3 font-mono text-xs text-text-muted"
						data-content-hash={built.content_hash}
					>
						{built.version_label} · {built.content_hash}
					</p>
				</section>
			</footer>
		</div>
	);
}
