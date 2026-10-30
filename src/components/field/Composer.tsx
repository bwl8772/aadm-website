import { useState } from "react";
import Button from "./Button";
import {
	rereadView,
	sendFieldCommand,
	stashNextStep,
	useCommandScope,
} from "./commands";
import type { FieldActionLink, Problem } from "./field-types";

interface Props {
	/** The server's `canvas.send` action for this agent. */
	send: FieldActionLink;
	placeholder: string;
	note: string;
	/** Accepted types and size; empty means uploads are off (SRC-04). */
	uploads: { accept: string[]; max_bytes: number };
}

/**
 * Message box for a work canvas. Sending runs the server-offered `canvas.send`
 * with the typed text as input; the text is the only state held here.
 */
export default function Composer({ send, placeholder, note, uploads }: Props) {
	const scope = useCommandScope();
	const [text, setText] = useState("");
	const [pending, setPending] = useState(false);
	const [problem, setProblem] = useState<Problem | null>(null);
	const canSend = send.enabled && text.trim().length > 0 && !pending;

	async function submit() {
		if (!canSend) return;
		setPending(true);
		setProblem(null);
		const outcome = await sendFieldCommand(
			{ ...send, input: { ...send.input, text: text.trim() } },
			scope,
			crypto.randomUUID(),
		);
		if (outcome.ok) {
			stashNextStep(outcome.reply.next_step);
			rereadView();
			return;
		}
		setProblem(outcome.problem);
		setPending(false);
	}

	return (
		<form
			className="rounded-xl border border-border bg-surface-card p-5"
			onSubmit={(e) => {
				e.preventDefault();
				void submit();
			}}
		>
			<label>
				<span className="sr-only">Message the agent</span>
				<textarea
					rows={2}
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder={placeholder}
					disabled={pending}
					className="w-full resize-none bg-transparent text-foreground placeholder:text-text-muted focus:outline-none"
				/>
			</label>
			<div className="mt-3 flex flex-wrap items-center gap-3">
				{uploads.accept.length > 0 ? (
					<Button disabled>Attach evidence</Button>
				) : null}
				<Button
					variant="primary"
					disabled={!canSend}
					title={send.disabled_reason}
				>
					{pending ? "Sending…" : send.label}
				</Button>
				<p className="ml-auto text-sm text-text-muted">{note}</p>
			</div>
			{problem ? (
				<p role="alert" className="mt-3 text-sm text-destructive">
					<span className="font-semibold">{problem.title}</span>{" "}
					{problem.detail}
					{problem.request_id ? (
						<span className="block font-mono text-text-muted">
							request_id {problem.request_id}
						</span>
					) : null}
				</p>
			) : null}
		</form>
	);
}
