import type { ReactNode } from "react";
import type { LensStatus, ToneKey } from "./field-types";

export type PillTone = ToneKey;

const toneClass: Record<PillTone, string> = {
	neutral: "bg-muted text-foreground",
	warning: "bg-brand-warn-bg text-brand-warn",
	success: "bg-brand-mcp-bg text-brand-mcp",
	danger: "bg-destructive/10 text-destructive",
	info: "bg-accent-blue/10 text-accent-blue",
};

export function Pill({
	tone = "neutral",
	round = false,
	children,
}: {
	tone?: PillTone;
	round?: boolean;
	children: ReactNode;
}) {
	return (
		<span
			className={`inline-flex items-center gap-2 whitespace-nowrap px-2.5 py-1 text-sm font-medium ${round ? "rounded-full" : "rounded-md"} ${toneClass[tone]}`}
		>
			{children}
		</span>
	);
}

const lensDot: Record<LensStatus, string> = {
	on_track: "bg-brand-mcp",
	in_progress: "bg-accent-blue",
	needs_action: "bg-brand-warn",
	needs_decision: "bg-brand-warn",
	blocked: "bg-destructive",
	not_started: "bg-text-muted",
};

/** A lens chip. Label and tone come from the server; the dot follows the state enum. */
export function LensPill({
	label,
	state,
	tone,
}: {
	label: string;
	state: LensStatus;
	tone: PillTone;
}) {
	return (
		<Pill tone={tone} round>
			<span
				className={`h-2 w-2 rounded-full ${lensDot[state]}`}
				aria-hidden="true"
			/>
			{label}
		</Pill>
	);
}
