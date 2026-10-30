import Button from "./Button";

interface Props {
	placeholder: string;
	attachLabel: string;
	/** Agent switcher label: the active agent's name, or a generic "Switch agent". */
	agentLabel: string;
	note: string;
	/** Dashed drop-zone border (Studio accepts file drops). */
	dropzone?: boolean;
}

/** Message box for a work canvas. Sending is not wired yet. */
export default function Composer({
	placeholder,
	attachLabel,
	agentLabel,
	note,
	dropzone = false,
}: Props) {
	return (
		<form
			className={`rounded-xl border bg-surface-card p-5 ${dropzone ? "border-dashed border-foreground/25" : "border-border"}`}
			onSubmit={(e) => e.preventDefault()}
		>
			<label>
				<span className="sr-only">Message the agent</span>
				<textarea
					rows={2}
					placeholder={placeholder}
					className="w-full resize-none bg-transparent text-foreground placeholder:text-text-muted focus:outline-none"
				/>
			</label>
			<div className="mt-3 flex flex-wrap items-center gap-3">
				<Button>{attachLabel}</Button>
				<Button>
					{agentLabel}
					{dropzone ? (
						<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
							<path d="M1 3l4 4 4-4" fill="currentColor" />
						</svg>
					) : null}
				</Button>
				<p className="ml-auto text-sm text-text-muted">{note}</p>
			</div>
		</form>
	);
}
