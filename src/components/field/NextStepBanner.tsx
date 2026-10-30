import { useEffect, useState } from "react";
import { takeNextStep } from "./commands";

/**
 * Shows the last command reply's `next_step` once, exactly as the backend
 * returned it (PRD §A7 "One voice"), after the page re-read that followed it.
 */
export default function NextStepBanner() {
	const [line, setLine] = useState<string | null>(null);
	useEffect(() => {
		setLine(takeNextStep());
	}, []);
	if (!line) return null;
	return (
		<p
			role="status"
			className="border-b border-accent-blue/30 bg-accent-blue/10 px-6 py-2.5 text-sm text-foreground sm:px-10"
			data-field-next-step
		>
			{line}
		</p>
	);
}
