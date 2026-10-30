/** The user's prompt in a work canvas, with its attachments. */
export default function PromptBubble({
	text,
	attachments,
}: {
	text: string;
	attachments: string[];
}) {
	return (
		<div className="ml-auto max-w-3xl rounded-xl bg-foreground px-5 py-4 text-background">
			<p>{text}</p>
			{attachments.length > 0 ? (
				<ul className="mt-3 flex flex-wrap gap-2">
					{attachments.map((f) => (
						<li
							key={f}
							className="rounded-md bg-background/15 px-2.5 py-1 text-sm font-medium"
						>
							{f}
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}
