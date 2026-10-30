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

const toneDot: Record<PillTone, string> = {
	neutral: "bg-text-muted",
	warning: "bg-brand-warn",
	success: "bg-brand-mcp",
	danger: "bg-destructive",
	info: "bg-accent-blue",
};

/** A lens chip. Label and tone come from the server; the tone sets both chip and dot. */
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
				className={`h-2 w-2 rounded-full ${toneDot[tone]}`}
				data-lens-state={state}
				aria-hidden="true"
			/>
			{label}
		</Pill>
	);
}
