import Button from "./Button";
import { useCommand } from "./commands";
import type { FieldActionLink } from "./field-types";

/**
 * Renders one server action (docs/contracts/FIELD-MY-FIELD.md "Action shape").
 * `navigate` is a link; `command` is a button that sends the command through
 * `useCommand`, shows pending, and shows the server's problem — title, detail
 * and request id — with a retry that reuses the same idempotency key. A
 * disabled action shows the server's reason and cannot be sent.
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
	if (action.kind === "command" && action.enabled) {
		return <CommandButton action={action} size={size} className={className} />;
	}
	return (
		<Button
			variant={variant}
			size={size}
			className={className}
			disabled
			title={action.disabled_reason}
		>
			{action.label}
		</Button>
	);
}

function CommandButton({
	action,
	size,
	className,
}: {
	action: FieldActionLink;
	size?: "sm" | "md" | "lg";
	className?: string;
}) {
	const { run, pending, problem } = useCommand(action);
	const variant = action.emphasis === "primary" ? "primary" : "outline";
	return (
		<span className="inline-flex flex-col items-start gap-1">
			<Button
				variant={variant}
				size={size}
				className={className}
				disabled={pending}
				onClick={() => void run()}
			>
				{pending ? "Sending…" : action.label}
			</Button>
			{problem ? (
				<span
					role="alert"
					className="max-w-xs text-xs text-destructive"
					data-problem-code={problem.code}
				>
					<span className="font-semibold">{problem.title}</span> {problem.detail}
					{problem.request_id ? (
						<span className="block font-mono text-text-muted">
							request_id {problem.request_id}
						</span>
					) : null}
					{problem.retryable ? (
						<button
							type="button"
							className="mt-1 block font-semibold text-foreground underline"
							onClick={() => void run(true)}
						>
							Try again
						</button>
					) : null}
				</span>
			) : null}
		</span>
	);
}
