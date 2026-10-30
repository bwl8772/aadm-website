import { useState } from "react";
import ActionControl from "../ActionControl";
import Button from "../Button";
import type { FieldActionLink, ShareOption } from "../field-types";

/** Copy and download come from the export link: the stored version, never the screen (FIELD-STUDIO.md §3 "Share"). */
async function copyFrom(option: ShareOption): Promise<boolean> {
	try {
		if (option.kind === "copy_link" && option.href) {
			await navigator.clipboard.writeText(option.href);
			return true;
		}
		if (option.kind === "copy_text" && option.href) {
			const res = await fetch(option.href, { credentials: "same-origin" });
			if (!res.ok) return false;
			await navigator.clipboard.writeText(await res.text());
			return true;
		}
	} catch {
		/* reported below */
	}
	return false;
}

function commandAction(
	option: ShareOption,
	artifactId: string,
	version: number,
): FieldActionLink {
	return {
		label: option.label,
		kind: "command",
		command: option.command ?? "artifact.share",
		target: artifactId,
		target_kind: "artifact",
		expected_version: version,
		input: { share_option_id: option.id },
		enabled: option.enabled,
		disabled_reason: option.disabled_reason,
		emphasis: "secondary",
	};
}

/** The share menu: the server's options in its order, each by its kind. */
export default function ShareMenu({
	options,
	artifactId,
	version,
}: {
	options: ShareOption[];
	artifactId: string;
	version: number;
}) {
	const [open, setOpen] = useState(false);
	const [note, setNote] = useState<string | null>(null);

	return (
		<div className="relative">
			<Button
				variant="primary"
				expanded={open}
				onClick={() => setOpen((v) => !v)}
			>
				Share ▾
			</Button>
			{open ? (
				<div
					role="menu"
					aria-label="Share"
					className="absolute right-0 top-full z-20 mt-2 w-80 rounded-md border border-border bg-surface-card py-1 shadow-lg"
				>
					{options.map((o) => {
						const hint = o.target_label ?? o.hint;
						if (o.kind === "command") {
							return (
								<div key={o.id} className="px-3 py-1.5" role="none">
									<ActionControl
										action={commandAction(o, artifactId, version)}
										size="sm"
										className="w-full justify-between"
									/>
									{hint ? (
										<span className="block text-xs text-text-muted">
											{hint}
										</span>
									) : null}
								</div>
							);
						}
						if (o.kind === "download") {
							return (
								<a
									key={o.id}
									role="menuitem"
									href={o.enabled ? o.href : undefined}
									aria-disabled={!o.enabled}
									title={o.disabled_reason}
									className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm ${o.enabled ? "text-foreground hover:bg-muted" : "text-text-muted"}`}
								>
									<span>{o.label}</span>
									{hint ? (
										<span className="text-text-muted">{hint}</span>
									) : null}
								</a>
							);
						}
						return (
							<button
								key={o.id}
								type="button"
								role="menuitem"
								disabled={!o.enabled}
								title={o.disabled_reason}
								onClick={async () => {
									setNote(
										(await copyFrom(o))
											? `${o.label}: done`
											: `${o.label}: could not copy`,
									);
								}}
								className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-foreground hover:bg-muted disabled:text-text-muted"
							>
								<span>{o.label}</span>
								{hint ? <span className="text-text-muted">{hint}</span> : null}
							</button>
						);
					})}
					{note ? (
						<p
							role="status"
							className="border-t border-border px-3 py-2 text-xs text-text-secondary"
						>
							{note}
						</p>
					) : null}
				</div>
			) : null}
		</div>
	);
}
