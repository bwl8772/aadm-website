import Button from "../Button";
import type { StudioEvent } from "../field-types";
import PromptBubble from "../PromptBubble";

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

function Event({
	event,
	onOpenBuilt,
}: {
	event: StudioEvent;
	onOpenBuilt: () => void;
}) {
	switch (event.kind) {
		case "prompt":
			return <PromptBubble text={event.text} attachments={event.attachments} />;
		case "note":
			return (
				<p className="flex items-center gap-2 text-text-secondary">
					<Check />
					{event.text}
				</p>
			);
		case "thinking":
			return (
				<section className="rounded-xl border border-border bg-surface-card px-5 py-4">
					<h3 className={label}>Thinking</h3>
					<p className="mt-2 text-text-secondary">{event.text}</p>
				</section>
			);
		case "tool_calls":
			return (
				<section className="rounded-xl border border-border bg-surface-card px-5 py-4">
					<h3 className={label}>Tool calls · {event.calls.length}</h3>
					<ul className="mt-3 flex flex-col gap-2.5">
						{event.calls.map((c) => (
							<li
								key={`${c.tool} ${c.detail}`}
								className="flex items-center gap-3"
							>
								{c.ok ? <Check /> : <span className="h-3.5 w-3.5 shrink-0" />}
								<code className="font-mono text-text-secondary">{c.tool}</code>
								<span className="text-foreground">{c.detail}</span>
							</li>
						))}
					</ul>
				</section>
			);
		case "message":
			return <p className="max-w-3xl text-foreground">{event.text}</p>;
		case "built":
			return (
				<section className="flex max-w-3xl flex-wrap items-center justify-between gap-4 rounded-xl border border-accent-blue/30 bg-surface-card px-5 py-4">
					<div>
						<h3 className="font-semibold text-foreground">{event.title}</h3>
						<p className="mt-1 text-sm text-text-secondary">{event.summary}</p>
					</div>
					<Button variant="primary" onClick={onOpenBuilt}>
						{event.action_label}
					</Button>
				</section>
			);
	}
}

/** Studio stream: prompt, notes, thinking, tool calls, reply, built output — in backend order. */
export default function StudioStream({
	events,
	onOpenBuilt,
}: {
	events: StudioEvent[];
	onOpenBuilt: () => void;
}) {
	return (
		<ol className="flex flex-col gap-5">
			{events.map((e, i) => (
				// Events have no id in the read model; order is the backend's.
				// biome-ignore lint/suspicious/noArrayIndexKey: stream order is stable
				<li key={i}>
					<Event event={e} onOpenBuilt={onOpenBuilt} />
				</li>
			))}
		</ol>
	);
}
