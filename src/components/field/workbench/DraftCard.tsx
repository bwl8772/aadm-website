import ActionControl from "../ActionControl";
import type { DraftEntry } from "../field-types";
import { Pill } from "../Pill";

/**
 * A draft in the canvas: not yet a saved version. Headings, items and actions
 * are the server's; the card decides nothing about what a draft means. It
 * becomes a record only when a save action it offers returns a `saved` entry.
 */
export default function DraftCard({ draft }: { draft: DraftEntry }) {
	return (
		<article
			className="rounded-xl border border-border bg-surface-card"
			data-draft-id={draft.draft_id}
		>
			<header className="flex flex-wrap items-center gap-2 border-b border-border px-6 py-4">
				<h3 className="font-semibold text-foreground">{draft.title}</h3>
				<Pill tone="info">{draft.summary}</Pill>
			</header>
			<div className="grid grid-cols-1 gap-6 px-6 py-5 md:grid-cols-2">
				{draft.sections.map((section) => (
					<section key={section.heading}>
						<h4 className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
							{section.heading}
						</h4>
						<ul className="mt-3 flex flex-col gap-3 text-foreground">
							{section.items.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</section>
				))}
			</div>
			{draft.actions.length > 0 ? (
				<footer className="flex flex-wrap items-center gap-3 border-t border-border px-6 py-4">
					{draft.actions.map((a) => (
						<ActionControl
							key={`${a.command ?? a.href}:${a.label}`}
							action={a}
						/>
					))}
				</footer>
			) : null}
		</article>
	);
}
