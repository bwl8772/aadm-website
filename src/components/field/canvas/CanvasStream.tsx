import type { ReactNode } from "react";
import ActionControl from "../ActionControl";
import {
	type FieldActionLink,
	isKnownEntry,
	type KnownEntry,
	type Stream,
	type StreamEntry,
} from "../field-types";
import PromptBubble from "../PromptBubble";
import DraftCard from "../workbench/DraftCard";

const label = "text-xs font-bold uppercase tracking-[0.12em] text-text-muted";

function Check() {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			aria-hidden="true"
			className="shrink-0 text-brand-mcp"
		>
			<path
				d="M2.5 7.5l3 3 6-7"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
			/>
		</svg>
	);
}

function SystemLine({ children }: { children: ReactNode }) {
	return (
		<p className="flex items-center gap-2 text-sm text-text-secondary">
			<Check />
			<span>{children}</span>
		</p>
	);
}

function Actions({ actions }: { actions: FieldActionLink[] }) {
	if (actions.length === 0) return null;
	return (
		<div className="mt-3 flex flex-wrap gap-2">
			{actions.map((a) => (
				<ActionControl
					key={`${a.command ?? a.href}:${a.label}`}
					action={a}
					size="sm"
				/>
			))}
		</div>
	);
}

/** One entry, drawn by its type. An unknown type is a plain line with its label. */
function Entry({ entry }: { entry: StreamEntry }) {
	if (!isKnownEntry(entry)) {
		return (
			<p className="text-sm text-text-secondary" data-entry-type={entry.type}>
				{entry.label}
			</p>
		);
	}
	return <KnownEntryView entry={entry} />;
}

function KnownEntryView({ entry }: { entry: KnownEntry }) {
	switch (entry.type) {
		case "message":
			return entry.author.kind === "engineer" ? (
				<PromptBubble
					text={entry.text}
					attachments={entry.attachments.map((a) => a.label)}
				/>
			) : (
				<div className="max-w-3xl">
					<p className="text-foreground">{entry.text}</p>
					{entry.attachments.length > 0 ? (
						<ul className="mt-2 flex flex-wrap gap-2">
							{entry.attachments.map((a) => (
								<li key={a.href}>
									<a
										href={a.href}
										className="rounded-md bg-muted px-2.5 py-1 text-sm font-medium text-foreground hover:bg-accent"
									>
										{a.label}
									</a>
								</li>
							))}
						</ul>
					) : null}
				</div>
			);
		case "upload":
			return (
				<SystemLine>
					{entry.file_label} saved to {entry.saved_to_label}
				</SystemLine>
			);
		case "thinking":
			return (
				<section className="rounded-xl border border-border bg-surface-card px-5 py-4">
					<h3 className={label}>Thinking</h3>
					<p className="mt-2 text-text-secondary">{entry.summary}</p>
				</section>
			);
		case "tool_call":
			return (
				<p
					className="flex flex-wrap items-center gap-3 text-sm"
					data-tool-status={entry.status}
				>
					{entry.status === "done" ? (
						<Check />
					) : entry.status === "running" ? (
						<span
							role="img"
							className="h-3.5 w-3.5 shrink-0 animate-pulse rounded-full bg-accent-blue"
							aria-label="Running"
						/>
					) : (
						<span
							role="img"
							className="h-3.5 w-3.5 shrink-0 rounded-full bg-destructive"
							aria-label="Failed"
						/>
					)}
					<code className="font-mono text-text-secondary">
						{entry.tool_label}
					</code>
					<span className="text-foreground">{entry.target_label}</span>
					{entry.failure_reason ? (
						<span className="text-destructive">{entry.failure_reason}</span>
					) : null}
				</p>
			);
		case "draft":
			return <DraftCard draft={entry} />;
		case "question":
			return (
				<section
					className="rounded-xl border border-brand-warn-border bg-surface-card px-5 py-4"
					data-question-id={entry.question_id}
				>
					<h3 className={`${label} text-brand-warn`}>Unresolved question</h3>
					<p className="mt-2 text-foreground">{entry.text}</p>
					<p className="mt-1 text-sm text-text-muted">
						{entry.recipient_label}
					</p>
					<Actions actions={entry.actions} />
				</section>
			);
		case "decision_request":
			return (
				<section
					className="rounded-xl border border-accent-blue/40 bg-surface-card px-5 py-4"
					data-decision-id={entry.decision_id}
				>
					<h3 className={`${label} text-accent-blue`}>Decision needed</h3>
					<p className="mt-2 text-foreground">{entry.text}</p>
					<Actions actions={entry.actions} />
				</section>
			);
		case "saved":
			return (
				<SystemLine>
					Saved{" "}
					<a
						href={entry.href}
						className="font-medium text-foreground underline"
					>
						{entry.title} {entry.version_label}
					</a>
				</SystemLine>
			);
		case "error":
			return (
				<p role="alert" className="text-sm text-destructive">
					<span className="font-semibold">{entry.title}</span> {entry.detail}
					{entry.request_id ? (
						<span className="block font-mono text-text-muted">
							request_id {entry.request_id}
						</span>
					) : null}
				</p>
			);
		default:
			return null;
	}
}

/**
 * The canvas stream for one agent (docs/contracts/FIELD-WORKBENCH.md §3),
 * shared by the Workbench and Studio's Stream view. Entries are drawn in
 * server order by type; a running agent shows its marker and Stop.
 */
export default function CanvasStream({
	stream,
	starterPrompts,
}: {
	stream: Stream;
	starterPrompts: string[];
}) {
	if (stream.entries.length === 0) {
		return (
			<div data-field-state="empty-canvas">
				{starterPrompts.length > 0 ? (
					<ul className="flex flex-col gap-2">
						{starterPrompts.map((p) => (
							<li
								key={p}
								className="rounded-xl border border-dashed border-border px-5 py-3 text-text-secondary"
							>
								{p}
							</li>
						))}
					</ul>
				) : null}
			</div>
		);
	}
	return (
		<ol className="flex flex-col gap-5" aria-live="polite">
			{stream.entries.map((e) => (
				<li key={e.entry_id} className="flex flex-col">
					<Entry entry={e} />
					<span className="mt-1 text-xs text-text-muted">
						{e.author.label} · {e.created_at_label}
					</span>
				</li>
			))}
			{stream.run ? (
				<li
					className="flex items-center gap-3 text-sm text-text-secondary"
					data-run-id={stream.run.run_id}
				>
					<span
						className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent-blue"
						aria-hidden="true"
					/>
					Working…
					<ActionControl action={stream.run.cancel} size="sm" />
				</li>
			) : null}
		</ol>
	);
}
