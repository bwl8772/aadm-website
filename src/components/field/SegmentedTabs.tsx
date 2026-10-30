/** Segmented tab control (grey track, raised active tab) used across Field screens. */
export default function SegmentedTabs<K extends string>({
	tabs,
	active,
	onChange,
	label,
	stretch = false,
}: {
	tabs: { key: K; label: string }[];
	active: K;
	onChange: (key: K) => void;
	label: string;
	stretch?: boolean;
}) {
	return (
		<div
			role="tablist"
			aria-label={label}
			className={`gap-1 rounded-lg bg-muted p-1 ${stretch ? "grid grid-flow-col auto-cols-fr" : "inline-flex"}`}
		>
			{tabs.map((t) => (
				<button
					key={t.key}
					type="button"
					role="tab"
					aria-selected={active === t.key}
					onClick={() => onChange(t.key)}
					className={`whitespace-nowrap rounded-md px-4 py-2 font-medium transition ${active === t.key ? "bg-surface-card text-foreground shadow-sm" : "text-text-secondary hover:text-foreground"}`}
				>
					{t.label}
				</button>
			))}
		</div>
	);
}
