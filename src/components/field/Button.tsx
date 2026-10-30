import type { ReactNode } from "react";

const base =
	"disabled:cursor-not-allowed disabled:opacity-50 inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const variants = {
	primary: "bg-accent-blue text-text-inverse hover:bg-accent-blue-dim",
	outline:
		"border border-border bg-surface-card text-foreground hover:border-foreground/30 hover:bg-muted",
	ghost: "text-text-secondary hover:bg-muted hover:text-foreground",
} as const;

const sizes = {
	sm: "px-3 py-1 text-sm",
	md: "px-4 py-2",
	lg: "px-5 py-3",
} as const;

/** The one Field button. Renders a link when `href` is given, else a button. */
export default function Button({
	href,
	onClick,
	expanded,
	disabled,
	title,
	variant = "outline",
	size = "md",
	className = "",
	children,
}: {
	href?: string;
	onClick?: () => void;
	/** For menu triggers. */
	expanded?: boolean;
	disabled?: boolean;
	title?: string;
	variant?: keyof typeof variants;
	size?: keyof typeof sizes;
	className?: string;
	children: ReactNode;
}) {
	const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
	return href ? (
		<a href={href} className={cls}>
			{children}
		</a>
	) : (
		<button
			type="button"
			className={cls}
			onClick={onClick}
			aria-expanded={expanded}
			disabled={disabled}
			title={title}
			aria-haspopup={expanded === undefined ? undefined : "menu"}
		>
			{children}
		</button>
	);
}
