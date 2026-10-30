import type { ReactNode } from "react";
import type { LensStatus, ToneKey } from "../field-types";

export type PillTone = ToneKey;

const toneClass: Record<PillTone, string> = {
	neutral: "bg-muted text-foreground",
	warn: "bg-brand-warn-bg text-brand-warn",
	ok: "bg-brand-mcp-bg text-brand-mcp",
	danger: "bg-destructive/10 text-destructive",
	info: "bg-accent-blue/10 text-accent-blue",
};

export function Pill({ tone = "neutral", round = false, children }: { tone?: PillTone; round?: boolean; children: ReactNode }) {
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
	not_started: "bg-text-muted",
};

export function LensPill({ name, status, note }: { name: string; status: LensStatus; note?: string }) {
	const tone: PillTone = status === "needs_action" || status === "needs_decision" ? "warn" : "neutral";
	return (
		<Pill tone={tone} round>
			<span className={`h-2 w-2 rounded-full ${lensDot[status]}`} aria-hidden="true" />
			{note ? `${name} · ${note}` : name}
		</Pill>
	);
}
