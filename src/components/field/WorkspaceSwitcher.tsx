import { useEffect, useRef, useState } from "react";
import type { WorkspaceSwitcher as Switcher } from "./field-types";

/** The current workspace and a menu of the others the server lists; choosing one navigates. */
export default function WorkspaceSwitcher({ items }: { items: Switcher }) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const current = items.find((w) => w.current);

	useEffect(() => {
		if (!open) return;
		const onDown = (e: MouseEvent) => {
			if (!ref.current?.contains(e.target as Node)) setOpen(false);
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("mousedown", onDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDown);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	if (!current) return null;
	return (
		<div className="relative" ref={ref} data-workspace-switcher>
			<button
				type="button"
				aria-haspopup="true"
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}
				className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
			>
				{current.name}
				<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
					<path d="M1 3l4 4 4-4" fill="currentColor" />
				</svg>
			</button>
			{open ? (
				<nav
					aria-label="Workspaces"
					className="absolute left-0 z-50 mt-2 min-w-48 rounded-md border border-border bg-surface-card py-1 shadow-lg"
				>
					<ul>
						{items.map((w) => (
							<li key={w.id}>
								<a
									href={w.href}
									aria-current={w.current ? "page" : undefined}
									className={`block px-3 py-2 text-sm hover:bg-muted ${w.current ? "font-semibold text-foreground" : "text-text-secondary hover:text-foreground"}`}
								>
									{w.name}
								</a>
							</li>
						))}
					</ul>
				</nav>
			) : null}
		</div>
	);
}
