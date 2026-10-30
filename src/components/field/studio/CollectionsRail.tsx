import { useState } from "react";
import ActionControl from "../ActionControl";
import Button from "../Button";
import type { FieldActionLink, StudioView, ToneKey } from "../field-types";

const statusDot: Record<ToneKey, string> = {
	neutral: "bg-text-muted",
	info: "bg-accent-blue",
	success: "bg-brand-mcp",
	warning: "bg-brand-warn",
	danger: "bg-destructive",
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

/** `artifact.create` for one of the server's `create_types` (FIELD-STUDIO.md §4). */
function createAction(type: { id: string; label: string }): FieldActionLink {
	return {
		label: type.label,
		kind: "command",
		command: "artifact.create",
		input: { type: type.id },
		enabled: true,
		emphasis: "secondary",
	};
}

/**
 * Studio left rail: pinned collections, then sections of collections, in
 * server order. Expanded state is presentation, seeded by `default_expanded`;
 * the edit control appears only when the server says `can_edit_layout`.
 */
export default function CollectionsRail({
	rail,
}: {
	rail: StudioView["rail"];
}) {
	const [open, setOpen] = useState<Record<string, boolean>>(() =>
		Object.fromEntries(
			rail.sections.flatMap((s) => [
				[s.section_id, s.default_expanded],
				...s.collections.map((c) => [c.collection_id, c.default_expanded]),
			]),
		),
	);
	const [createOpen, setCreateOpen] = useState(false);
	const toggle = (key: string) => setOpen((o) => ({ ...o, [key]: !o[key] }));

	return (
		<nav
			aria-label="Collections"
			className="flex min-w-0 flex-col border-r border-border bg-surface-card"
		>
			<div className="flex-1 px-3 py-5">
				<div className="flex items-center justify-between px-2">
					<h2 className="font-semibold text-foreground">Collections</h2>
					{rail.can_edit_layout ? (
						<Button size="sm" disabled title="Layout editing arrives in F8.">
							Edit
						</Button>
					) : null}
				</div>
				{rail.create_types.length > 0 ? (
					<div className="relative mt-4">
						<Button
							variant="primary"
							className="w-full"
							expanded={createOpen}
							onClick={() => setCreateOpen((v) => !v)}
						>
							New artifact ▾
						</Button>
						{createOpen ? (
							<div
								role="menu"
								aria-label="Artifact type"
								className="absolute left-0 right-0 z-20 mt-2 flex flex-col gap-1 rounded-md border border-border bg-surface-card p-2 shadow-lg"
							>
								{rail.create_types.map((t) => (
									<ActionControl
										key={t.id}
										action={createAction(t)}
										size="sm"
										className="w-full justify-start"
									/>
								))}
							</div>
						) : null}
					</div>
				) : null}

				{rail.pinned.length > 0 ? (
					<>
						<p className={`mt-6 px-2 ${groupLabel}`}>Pinned</p>
						<ul className="mt-2">
							{rail.pinned.map((p) => (
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

				{rail.sections.map((s) => (
					<div key={s.section_id} className="mt-5">
						<button
							type="button"
							aria-expanded={open[s.section_id]}
							onClick={() => toggle(s.section_id)}
							className={`flex w-full items-center gap-2 px-2 py-1 ${groupLabel}`}
						>
							<Chevron open={!!open[s.section_id]} />
							<span className="flex-1 text-left">{s.label}</span>
						</button>
						{open[s.section_id] ? (
							<ul className="mt-1">
								{s.collections.map((c) => {
									const holdsOpen = c.items.some((it) => it.is_open);
									const more = c.count - c.items.length;
									return (
										<li key={c.collection_id}>
											<div
												className={`flex items-center gap-2 rounded-md px-2 ${holdsOpen ? "bg-accent-blue/10 text-accent-blue" : "text-foreground hover:bg-muted"}`}
											>
												<button
													type="button"
													aria-expanded={open[c.collection_id]}
													onClick={() => toggle(c.collection_id)}
													className="flex flex-1 items-center gap-2 py-2 text-left"
												>
													<Chevron open={!!open[c.collection_id]} />
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
														<li key={it.item_id}>
															<a
																href={it.href}
																aria-current={it.is_open ? "page" : undefined}
																title={`${it.type_label} · ${it.state_label}`}
																className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${it.is_open ? "bg-accent-blue/10 font-medium text-accent-blue" : "text-text-secondary hover:bg-muted hover:text-foreground"}`}
															>
																<span
																	className={`h-2 w-2 shrink-0 rounded-full ${statusDot[it.tone]}`}
																	data-artifact-state={it.state}
																	aria-hidden="true"
																/>
																{it.title}
															</a>
														</li>
													))}
													{more > 0 ? (
														<li className="px-2 py-1.5 text-sm text-text-muted">
															{more} more
														</li>
													) : null}
													{c.add_action ? (
														<li className="px-2 py-1">
															<ActionControl action={c.add_action} size="sm" />
														</li>
													) : null}
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
		</nav>
	);
}
