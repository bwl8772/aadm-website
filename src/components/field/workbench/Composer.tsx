const outline =
	"rounded-md border border-border bg-surface-card px-4 py-2 font-semibold text-foreground transition hover:border-foreground/30 hover:bg-muted";

export default function Composer() {
	return (
		<form className="rounded-xl border border-border bg-surface-card p-5" onSubmit={(e) => e.preventDefault()}>
			<label>
				<span className="sr-only">Message the agent</span>
				<textarea
					rows={2}
					placeholder="Ask, review, decide, create..."
					className="w-full resize-none bg-transparent text-foreground placeholder:text-text-muted focus:outline-none"
				/>
			</label>
			<div className="mt-3 flex flex-wrap items-center gap-3">
				<button type="button" className={outline}>
					Attach evidence
				</button>
				<button type="button" className={outline}>
					Switch agent
				</button>
				<p className="ml-auto text-sm text-text-muted">Drafts stay in the canvas until you save</p>
			</div>
		</form>
	);
}
