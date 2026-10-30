import { useState } from "react";
import Button from "../Button";
import type { StudioModel } from "../field-types";

type ItemStatus =
	StudioModel["sections"][number]["collections"][number]["items"][number]["status"];

const statusDot: Record<ItemStatus, string> = {
	draft: "bg-text-muted",
	review: "bg-accent-blue",
	approved: "bg-brand-mcp",
};

const groupLabel =
	"text-xs font-semibold uppercase tracking-[0.12em] text-text-muted";

function PinIcon({ pinned }: { pinned: boolean }) {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 24 24"
			aria-hidden="true"
			fill={pinned ? "currentColor" : "none"}
			stroke="currentColor"
			strokeWidth="2"
			className={pinned ? "text-accent-blue" : "text-text-muted"}
		>
			<path d="M12 17v5M5 17h14l-2-5V4H7v8z" />
		</svg>
	);
}

function Chevron({ open }: { open: boolean }) {
	return (
		<svg
			width="10"
			height="10"
			viewBox="0 0 24 24"
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
			className={`shrink-0 transition ${open ? "rotate-90" : ""}`}
		>
			<path d="M9 6l6 6-6 6" />
		</svg>
	);
}

/**
 * Studio left rail: pinned collections, sections of collections, connected systems.
 * Open/closed is local view state; pinning and editing are not wired yet.
 */
export default function CollectionsRail({
	pinned,
	sections,
	connected,
}: {
	pinned: StudioModel["pinned"];
	sections: StudioModel["sections"];
	connected: string[];
}) {
	const [open, setOpen] = useState<Record<string, boolean>>(() =>
		Object.fromEntries(
			sections.flatMap((s) => [
				[s.section_id, s.expanded],
				...s.collections.map((c) => [c.collection_id, c.expanded]),
			]),
		),
	);
	const toggle = (key: string) => setOpen((o) => ({ ...o, [key]: !o[key] }));

	return (
		<nav
			aria-label="Collections"
			className="flex min-w-0 flex-col border-r border-border bg-surface-card"
		>
			<div className="flex-1 px-3 py-5">
				<div className="flex items-center justify-between px-2">
					<h2 className="font-semibold text-foreground">Collections</h2>
					<Button size="sm">Edit</Button>
				</div>
				<Button variant="primary" className="mt-4 w-full">
					New artifact
				</Button>

				{pinned.length > 0 ? (
					<>
						<p className={`mt-6 px-2 ${groupLabel}`}>Pinned</p>
						<ul className="mt-2">
							{pinned.map((p) => (
								<li key={p.collection_id}>
									<button
										type="button"
										onClick={() =>
											setOpen((o) => ({ ...o, [p.collection_id]: true }))
										}
										className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-foreground hover:bg-muted"
									>
										<PinIcon pinned />
										<span className="flex-1 font-medium">{p.label}</span>
										<span className="text-sm text-text-secondary">
											{p.count}
										</span>
									</button>
								</li>
							))}
						</ul>
					</>
				) : null}

				{sections.map((s) => (
					<div key={s.section_id} className="mt-5">
						<button
							type="button"
							aria-expanded={open[s.section_id]}
							onClick={() => toggle(s.section_id)}
							className={`flex w-full items-center gap-2 px-2 py-1 ${groupLabel}`}
						>
							<Chevron open={open[s.section_id]} />
							<span className="flex-1 text-left">{s.label}</span>
							<span className="font-normal normal-case tracking-normal">
								{s.count}
							</span>
						</button>
						{open[s.section_id] ? (
							<ul className="mt-1">
								{s.collections.map((c) => {
									const current = c.items.some((it) => it.current);
									const more = c.count - c.items.length;
									return (
										<li key={c.collection_id}>
											<div
												className={`flex items-center gap-2 rounded-md px-2 ${current ? "bg-accent-blue/10 text-accent-blue" : "text-foreground hover:bg-muted"}`}
											>
												<button
													type="button"
													aria-expanded={open[c.collection_id]}
													onClick={() => toggle(c.collection_id)}
													className="flex flex-1 items-center gap-2 py-2 text-left"
												>
													<Chevron open={open[c.collection_id]} />
													<span className="flex-1 font-medium">{c.label}</span>
													<span className="text-sm text-text-secondary">
														{c.count}
													</span>
												</button>
												<PinIcon pinned={c.pinned} />
											</div>
											{open[c.collection_id] ? (
												<ul className="ml-6 mt-1">
													{c.items.map((it) => (
														<li
															key={it.item_id}
															aria-current={it.current ? "page" : undefined}
															className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${it.current ? "bg-accent-blue/10 font-medium text-accent-blue" : "text-text-secondary"}`}
														>
															<span
																className={`h-2 w-2 shrink-0 rounded-full ${statusDot[it.status]}`}
																aria-hidden="true"
															/>
															{it.label}
														</li>
													))}
													{more > 0 ? (
														<li className="px-2 py-1.5 text-sm text-text-muted">
															{more} more
														</li>
													) : null}
													<li className="px-2 py-1.5 text-sm font-medium text-accent-blue">
														+ New in {c.label}
													</li>
												</ul>
											) : null}
										</li>
									);
								})}
							</ul>
						) : null}
					</div>
				))}
			</div>

			<div className="border-t border-border px-5 py-4">
				<p className={groupLabel}>Connected</p>
				<ul className="mt-3 flex flex-wrap gap-2">
					{connected.map((c) => (
						<li
							key={c}
							className="rounded-full bg-muted px-3 py-1 text-sm text-foreground"
						>
							{c}
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}
