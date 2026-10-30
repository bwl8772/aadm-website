import Button from "./Button";
import type { FieldActionLink } from "./field-types";

/**
 * Renders one server action (docs/contracts/FIELD-MY-FIELD.md "Action shape").
 * `navigate` is a link; `command` is a button. A disabled action shows the
 * server's reason and cannot be sent. Commands are not wired to
 * POST /api/v1/commands yet, so a command click does nothing.
 */
export default function ActionControl({
	action,
	size,
	className,
}: {
	action: FieldActionLink;
	size?: "sm" | "md" | "lg";
	className?: string;
}) {
	const variant = action.emphasis === "primary" ? "primary" : "outline";
	if (action.kind === "navigate" && action.enabled) {
		return (
			<Button
				href={action.href}
				variant={variant}
				size={size}
				className={className}
			>
				{action.label}
			</Button>
		);
	}
	return (
		<Button
			variant={variant}
			size={size}
			className={className}
			disabled={!action.enabled}
			title={action.enabled ? undefined : action.disabled_reason}
		>
			{action.label}
		</Button>
	);
}
