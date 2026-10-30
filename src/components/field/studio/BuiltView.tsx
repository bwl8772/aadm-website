import { useState } from "react";
import Button from "../Button";
import type { StudioBuilt } from "../field-types";
import { Pill } from "../Pill";

/** The built artifact, rendered as the backend sent it, with its share menu. */
export default function BuiltView({
	built,
	onBack,
}: {
	built: StudioBuilt;
	onBack: () => void;
}) {
	const [shareOpen, setShareOpen] = useState(false);

	return (
		<div className="flex flex-col gap-4">
			<div className="relative flex flex-wrap items-center gap-2">
				<Button size="sm" onClick={onBack}>
					← Back to stream
				</Button>
				{built.tags.map((t) => (
					<Pill key={t.label} tone={t.tone}>
						{t.label}
					</Pill>
				))}
				<span className="text-sm text-text-secondary">{built.meta}</span>
				<div className="ml-auto flex gap-2">
					<Button>Edit</Button>
					<Button>Save version</Button>
					<Button
						variant="primary"
						expanded={shareOpen}
						onClick={() => setShareOpen((v) => !v)}
					>
						Share ▾
					</Button>
				</div>
				{shareOpen ? (
					<div
						role="menu"
						aria-label="Share"
						className="absolute right-0 top-full z-20 mt-2 w-72 rounded-md border border-border bg-surface-card py-1 shadow-lg"
					>
						{built.share.map((group, gi) => (
							<div
								key={group.map((g) => g.label).join()}
								className={gi > 0 ? "border-t border-border pt-1" : ""}
							>
								{group.map((g) => (
									<button
										key={g.label}
										type="button"
										role="menuitem"
										className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
									>
										<span>{g.label}</span>
										{g.note ? (
											<span className="text-text-muted">{g.note}</span>
										) : null}
									</button>
								))}
							</div>
						))}
					</div>
				) : null}
			</div>

			<article className="rounded-xl border border-border bg-surface-card px-6 py-5 font-mono text-sm leading-relaxed text-foreground">
				{built.sections.map((sec) => (
					<section key={sec.heading} className="mt-4 first:mt-0">
						<h3 className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
							{sec.heading}
						</h3>
						{sec.lines.map((l) => (
							<p key={l}>{l}</p>
						))}
					</section>
				))}
			</article>
		</div>
	);
}
