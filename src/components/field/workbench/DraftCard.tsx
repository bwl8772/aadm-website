import type { WorkbenchDraft, WorkbenchQuestion } from "../field-types";
import { Pill } from "../home/Pill";

const outline =
	"whitespace-nowrap rounded-md border border-border bg-surface-card px-4 py-2 font-semibold text-foreground transition hover:border-foreground/30 hover:bg-muted";

function Heading({ tone, children }: { tone: "ok" | "warn" | "info" | "muted"; children: string }) {
	const color = { ok: "text-brand-mcp", warn: "text-brand-warn", info: "text-accent-blue", muted: "text-text-muted" }[tone];
	return <h3 className={`text-xs font-bold uppercase tracking-[0.12em] ${color}`}>{children}</h3>;
}

function AskList({ items }: { items: WorkbenchQuestion[] }) {
	return (
		<ul className="mt-3 flex flex-col gap-3">
			{items.map((q) => (
				<li key={q.text} className="flex items-center justify-between gap-4">
					<span className="text-foreground">{q.text}</span>
					<button type="button" className={outline}>
						{q.verb}
					</button>
				</li>
			))}
		</ul>
	);
}

export default function DraftCard({ draft }: { draft: WorkbenchDraft }) {
	return (
		<article className="rounded-xl border border-border bg-surface-card">
			<header className="flex flex-wrap items-center gap-2 border-b border-border px-6 py-4">
				<h2 className="font-semibold text-foreground">{draft.title}</h2>
				<Pill>{draft.source_label}</Pill>
				{draft.saved ? null : <Pill tone="info">Not saved yet</Pill>}
			</header>
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="px-6 py-5 md:border-r md:border-border">
					<Heading tone="ok">Confirmed findings</Heading>
					<ul className="mt-3 flex flex-col gap-3 text-foreground">
						{draft.findings.map((f) => (
							<li key={f}>{f}</li>
						))}
					</ul>
					{draft.assumptions.length > 0 ? (
						<div className="mt-6">
							<Heading tone="muted">Assumptions</Heading>
							<ul className="mt-3 flex flex-col gap-3 text-foreground">
								{draft.assumptions.map((a) => (
									<li key={a}>{a}</li>
								))}
							</ul>
						</div>
					) : null}
				</div>
				<div className="border-t border-border px-6 py-5 md:border-t-0">
					{draft.questions.length > 0 ? (
						<>
							<Heading tone="warn">Unresolved questions</Heading>
							<AskList items={draft.questions} />
						</>
					) : null}
					{draft.decisions.length > 0 ? (
						<div className="mt-6">
							<Heading tone="info">Decision needed</Heading>
							<AskList items={draft.decisions} />
						</div>
					) : null}
				</div>
			</div>
			<footer className="flex flex-wrap items-center gap-3 border-t border-border px-6 py-4">
				<button
					type="button"
					className="rounded-md bg-accent-blue px-5 py-2.5 font-semibold text-white transition hover:bg-accent-blue-dim"
				>
					{draft.save_label}
				</button>
				<button type="button" className={outline}>
					Edit draft
				</button>
				<button type="button" className="ml-auto rounded-md px-4 py-2 font-medium text-text-secondary hover:bg-muted hover:text-foreground">
					Discard
				</button>
			</footer>
		</article>
	);
}
