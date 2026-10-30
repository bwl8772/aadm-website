import { type Block, isKnownBlock, type KnownBlock } from "../field-types";

const subhead = "text-xs font-bold uppercase tracking-[0.12em] text-text-muted";

/**
 * Draws one stored block by its `kind` (docs/contracts/FIELD-STUDIO.md §3
 * "Block"). Content is never interpreted; `code_text` is shown, never run;
 * an unknown kind shows the server's `fallback_text` and never errors.
 */
export default function BlockView({ block }: { block: Block }) {
	if (!isKnownBlock(block)) {
		return (
			<p className="text-text-secondary" data-block-kind={block.kind}>
				{block.fallback_text}
			</p>
		);
	}
	return <KnownBlockView block={block} />;
}

function KnownBlockView({ block }: { block: KnownBlock }) {
	switch (block.kind) {
		case "heading": {
			const cls = "font-semibold text-foreground";
			if (block.level === 1)
				return <h2 className={`text-xl ${cls}`}>{block.text}</h2>;
			if (block.level === 2)
				return <h3 className={`text-lg ${cls}`}>{block.text}</h3>;
			return <h4 className={cls}>{block.text}</h4>;
		}
		case "paragraph":
			return <p className="text-foreground">{block.text}</p>;
		case "list":
			return block.ordered ? (
				<ol className="list-decimal space-y-1 pl-6 text-foreground">
					{block.items.map((it) => (
						<li key={it}>{it}</li>
					))}
				</ol>
			) : (
				<ul className="list-disc space-y-1 pl-6 text-foreground">
					{block.items.map((it) => (
						<li key={it}>{it}</li>
					))}
				</ul>
			);
		case "table":
			return (
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="border-b border-border text-text-muted">
								{block.columns.map((c) => (
									<th key={c} className="py-2 pr-4 font-semibold">
										{c}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{block.rows.map((row) => (
								<tr key={row.join("\u0001")} className="border-b border-border">
									{row.map((cell, i) => (
										<td
											key={`${block.columns[i] ?? i}:${cell}`}
											className="py-2 pr-4 text-foreground"
										>
											{cell}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		case "code_text":
			return (
				<figure>
					<figcaption className={subhead}>{block.language_label}</figcaption>
					<pre className="mt-2 overflow-x-auto rounded-md bg-muted px-4 py-3 font-mono text-sm text-foreground">
						{block.text}
					</pre>
				</figure>
			);
		case "diagram":
			return block.notation === "image" && block.image_href ? (
				<figure>
					<img
						src={block.image_href}
						alt={block.alt}
						className="max-w-full rounded-md"
					/>
				</figure>
			) : (
				<figure>
					<figcaption className={subhead}>
						{block.notation} · {block.alt}
					</figcaption>
					<pre className="mt-2 overflow-x-auto rounded-md bg-muted px-4 py-3 font-mono text-sm text-foreground">
						{block.source}
					</pre>
				</figure>
			);
		case "schema":
			return (
				<div>
					<p className={subhead}>{block.name}</p>
					<dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
						{block.fields.map((f) => (
							<div key={f.name} className="contents">
								<dt className="font-mono text-foreground">
									{f.name}
									{f.required ? "" : "?"}
								</dt>
								<dd className="text-text-secondary">
									<span className="font-mono">{f.type}</span> — {f.description}
								</dd>
							</div>
						))}
					</dl>
					<pre className="mt-3 overflow-x-auto rounded-md bg-muted px-4 py-3 font-mono text-sm text-foreground">
						{block.example}
					</pre>
				</div>
			);
		case "ticket_list":
			return (
				<ul className="flex flex-col gap-2">
					{block.tickets.map((t) => (
						<li
							key={t.key}
							className="rounded-md border border-border px-4 py-3"
						>
							<p className="text-foreground">
								<span className="font-mono text-sm text-text-secondary">
									{t.href ? (
										<a href={t.href} className="underline">
											{t.key}
										</a>
									) : (
										t.key
									)}
								</span>{" "}
								{t.title}
								<span className="ml-2 text-sm text-text-muted">{t.status}</span>
							</p>
							{t.acceptance.length > 0 ? (
								<ul className="mt-1 list-disc pl-6 text-sm text-text-secondary">
									{t.acceptance.map((a) => (
										<li key={a}>{a}</li>
									))}
								</ul>
							) : null}
						</li>
					))}
				</ul>
			);
		case "canvas":
			return (
				<div>
					<p className={subhead}>{block.grid_label}</p>
					<ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
						{block.cells.map((c) => (
							<li
								key={`${c.row}/${c.column}`}
								className="rounded-md border border-border px-3 py-2"
							>
								<span className="block text-xs text-text-muted">
									{c.row} · {c.column}
								</span>
								<span className="text-sm text-foreground">{c.text}</span>
							</li>
						))}
					</ul>
				</div>
			);
		case "review":
			return (
				<ul className="flex flex-col gap-2">
					{block.items.map((it) => (
						<li
							key={it.target}
							className="rounded-md border border-border px-4 py-3 text-sm"
						>
							<span className="font-medium text-foreground">{it.target}</span>
							<span className="ml-2 text-text-secondary">{it.verdict}</span>
							<p className="mt-1 text-text-secondary">{it.comment}</p>
						</li>
					))}
				</ul>
			);
		case "decision":
			return (
				<div className="rounded-md border border-accent-blue/40 px-4 py-3">
					<p className="font-medium text-foreground">{block.question}</p>
					<ul className="mt-2 flex flex-wrap gap-2">
						{block.options.map((o) => (
							<li
								key={o}
								className={`rounded-full px-3 py-1 text-sm ${o === block.chosen ? "bg-accent-blue text-text-inverse" : "bg-muted text-foreground"}`}
							>
								{o}
							</li>
						))}
					</ul>
					{block.rationale ? (
						<p className="mt-2 text-sm text-text-secondary">
							{block.rationale}
						</p>
					) : null}
					{block.decided_by ? (
						<p className="mt-1 text-xs text-text-muted">
							Decided by {block.decided_by}
						</p>
					) : null}
				</div>
			);
		default:
			return null;
	}
}
