/**
 * EXAMPLE DATA ONLY — the "3 · Artifact Studio" mock, shaped to
 * docs/contracts/FIELD-STUDIO.md. Loaded only by `src/lib/field-fixtures.ts`
 * when PUBLIC_FIELD_FIXTURES=1. The default export plays the backend for one
 * engagement: `?artifact=` and `?view=` pick what it returns. To strip
 * examples: delete this file (or the whole fixtures/ folder).
 */
import type {
	ArtifactVersion,
	FieldActionLink,
	RailItem,
	Stream,
	StudioSection,
	StudioView,
	StudioViewId,
} from "../field-types";

const ENGAGEMENT_ID = "6f278bf1-408e-5452-a2bc-0ea4bf42c816";
const CODER_PROMPT_ID = "cdbac60c-efb7-529f-913a-98cc85321084";
const base = `/field/main/e/${ENGAGEMENT_ID}`;
const open = (artifactId: string, view: StudioViewId = "built") =>
	`${base}?artifact=${artifactId}&view=${view}`;

const command = (
	label: string,
	verb: string,
	target: { kind: string; id: string; expected_version?: number } | null,
	opts: Partial<
		Pick<FieldActionLink, "emphasis" | "enabled" | "disabled_reason" | "input">
	> = {},
): FieldActionLink => ({
	label,
	kind: "command",
	command: verb,
	target: target?.id,
	target_kind: target?.kind,
	expected_version: target?.expected_version,
	enabled: true,
	emphasis: "secondary",
	...opts,
});

const item = (
	item_id: string,
	title: string,
	type_label: string,
	state: RailItem["state"],
	state_label: string,
	tone: RailItem["tone"],
): RailItem => ({
	item_id,
	title,
	type_label,
	state,
	state_label,
	tone,
	is_open: item_id === CODER_PROMPT_ID,
	href: open(item_id),
});

const collection = (
	collection_id: string,
	label: string,
	count: number,
	items: RailItem[],
	opts: { pinned?: boolean; default_expanded?: boolean } = {},
): StudioSection["collections"][number] => ({
	collection_id,
	label,
	count,
	pinned: opts.pinned ?? false,
	editable: true,
	default_expanded: opts.default_expanded ?? false,
	items,
	add_action: command("New in this collection", "artifact.create", null, {
		input: { collection_id },
	}),
});

const sections: StudioSection[] = [
	{
		section_id: "79cfdaab-ce56-558a-ab8e-afce0de41f45",
		label: "Discover",
		order: 1,
		editable: true,
		removable: false,
		default_expanded: true,
		collections: [
			collection(
				"9e14bf89-b4de-55a9-a0f4-5335c73c72d3",
				"Tech stack inventory",
				1,
				[
					item(
						"d4ad3d95-f7eb-5aa8-b1d4-00e8a03c8472",
						"Acme current stack",
						"Tech stack inventory",
						"approved",
						"Approved",
						"success",
					),
				],
			),
			collection(
				"bd84ba00-e1ee-5fc8-bc4d-de5117873c0f",
				"Speed Layer canvas",
				1,
				[
					item(
						"0607e0df-6bd8-5dfb-89d6-d665280017c8",
						"Intake data flow",
						"Speed Layer canvas",
						"review",
						"In review",
						"info",
					),
				],
			),
			collection("9e748d65-4f6d-5ed6-a30b-c780bd6b38c6", "Discovery brief", 1, [
				item(
					"917094f9-3a6f-5f45-a010-2144fab5d252",
					"Discovery brief v0.2",
					"Discovery brief",
					"review",
					"In review",
					"info",
				),
			]),
		],
	},
	{
		section_id: "3dd71594-070c-51e3-a870-f9bc56675dae",
		label: "Design",
		order: 2,
		editable: true,
		removable: false,
		default_expanded: true,
		collections: [
			collection(
				"7cd63507-5fac-5033-a2d7-11a84dd8e7e1",
				"Technical architecture",
				2,
				[
					item(
						"247ac460-daf8-552d-927e-9fbf695c6925",
						"Intake flow v2",
						"Architecture diagram",
						"review",
						"In review",
						"info",
					),
					item(
						"1f64bfab-3a6e-5717-ab13-72635fb61926",
						"Target state v0.1",
						"Architecture diagram",
						"draft",
						"Draft",
						"neutral",
					),
				],
			),
			collection(
				"860817b1-a467-5144-ae12-d65d7cafd0b0",
				"API payload specs",
				6,
				[
					item(
						"466e5efd-a1ee-548f-a035-28cca61de47d",
						"Referral validation",
						"API payload spec",
						"draft",
						"Draft",
						"neutral",
					),
					item(
						"b74f202c-62ab-58a0-809c-4396cf8f763e",
						"Referral submit",
						"API payload spec",
						"approved",
						"Approved",
						"success",
					),
					item(
						"e1a96683-7d7f-52ef-be27-10cf9cde630a",
						"Patient match",
						"API payload spec",
						"approved",
						"Approved",
						"success",
					),
				],
				{ pinned: true },
			),
			collection("be238baf-0598-5906-951f-8fcc9c325e66", "Recommendations", 2, [
				item(
					"7de67668-bfc1-5534-aa14-1a8d8dff17b8",
					"Validate in intake",
					"Recommendation",
					"approved",
					"Approved",
					"success",
				),
				item(
					"e8f7dd1c-acae-57a9-a45e-1dee8ab3ad0f",
					"Pilot one clinic first",
					"Recommendation",
					"review",
					"In review",
					"info",
				),
			]),
		],
	},
	{
		section_id: "b9d36f67-8b64-58bc-a591-4ef5d1d8012a",
		label: "Build",
		order: 3,
		editable: true,
		removable: false,
		default_expanded: true,
		collections: [
			collection("dc1c03c9-c760-590f-8d8e-2467ff4f36a5", "Jira tickets", 3, [
				item(
					"6f97fa98-a66c-5e54-ae84-83fbc87111a7",
					"Batch 4 · 12 tickets",
					"Jira tickets",
					"published",
					"Synced to Jira",
					"neutral",
				),
			]),
			collection(
				"868d6505-f098-50f6-9f08-d5c757447b54",
				"Coder prompts",
				3,
				[
					item(
						CODER_PROMPT_ID,
						"Slice 4 · Referral validation",
						"Coder prompt",
						"draft",
						"Draft",
						"neutral",
					),
					item(
						"fbbaaa15-9ec4-5e91-af52-7ac9435fda76",
						"Slice 3 · Patient matching",
						"Coder prompt",
						"approved",
						"Go given",
						"success",
					),
					item(
						"80ee7035-75da-536a-8875-948ccf2c8e2c",
						"Slice 2 · Intake queue",
						"Coder prompt",
						"approved",
						"Go given",
						"success",
					),
				],
				{ pinned: true, default_expanded: true },
			),
		],
	},
	{
		section_id: "dc57e043-0c94-557b-8907-7b64e8e256df",
		label: "Adopt",
		order: 4,
		editable: true,
		removable: true,
		default_expanded: false,
		collections: [
			collection("0d41da43-7f55-5ac6-8b81-b1fc8a4d84c5", "Process docs", 1, [
				item(
					"94e3d236-50f7-5899-bc5b-f63540c28f6a",
					"Handling flagged referrals",
					"Process doc",
					"draft",
					"Draft",
					"neutral",
				),
			]),
			collection(
				"0ea5bd02-0037-5a47-b7c3-0cbe51e077fb",
				"Acceptance evidence",
				2,
				[
					item(
						"efb53608-b2c0-5395-b6e1-ef75f75d97e0",
						"Slice 3",
						"Acceptance evidence",
						"review",
						"Awaiting verdict",
						"warning",
					),
					item(
						"d0592668-0b5c-5802-b639-2d3a6f69e181",
						"Slice 2",
						"Acceptance evidence",
						"approved",
						"ON PLAN",
						"success",
					),
				],
			),
		],
	},
];

const blockId = (n: number) =>
	`b1000000-0000-5000-8000-${String(n).padStart(12, "0")}`;

const coderPromptV2: ArtifactVersion = {
	artifact_id: CODER_PROMPT_ID,
	version: 2,
	version_label: "v0.2",
	content_hash: "sha256:9f2c…e41b",
	type: "prompt",
	type_label: "Coder prompt",
	title: "Coder prompt · Slice 4 · Referral validation",
	state: "draft",
	state_label: "Draft",
	tone: "neutral",
	visibility: "internal",
	owner: { kind: "person", label: "You" },
	acceptor: { kind: "person", label: "Acme · Integration architect" },
	built_from: [
		{
			id: "7de67668-bfc1-5534-aa14-1a8d8dff17b8",
			label: "Recommendation · validate in intake · v1",
			href: open("7de67668-bfc1-5534-aa14-1a8d8dff17b8"),
		},
		{
			id: "247ac460-daf8-552d-927e-9fbf695c6925",
			label: "Architecture · intake flow v2",
			href: open("247ac460-daf8-552d-927e-9fbf695c6925"),
		},
		{
			id: "466e5efd-a1ee-548f-a035-28cca61de47d",
			label: "API payload spec · referral validation",
			href: open("466e5efd-a1ee-548f-a035-28cca61de47d"),
		},
	],
	versions: [
		{
			version: 2,
			version_label: "v0.2",
			saved_by: "Delivery Planner",
			saved_label: "Today",
			state: "draft",
			href: open(CODER_PROMPT_ID),
		},
		{
			version: 1,
			version_label: "v0.1",
			saved_by: "Delivery Planner",
			saved_label: "Yesterday",
			state: "draft",
			href: `${open(CODER_PROMPT_ID)}&version=1`,
		},
	],
	blocks: [
		{ block_id: blockId(1), kind: "heading", level: 2, text: "Context" },
		{
			block_id: blockId(2),
			kind: "paragraph",
			text: "Acme Health intake service. Referrals arrive from fax, portal and phone into one intake queue. Follow Architecture · Intake flow v2.",
		},
		{ block_id: blockId(3), kind: "heading", level: 2, text: "Task" },
		{
			block_id: blockId(4),
			kind: "paragraph",
			text: "Flag referrals that are missing required insurance fields before they reach scheduling. Covers Jira INT-142 and INT-143.",
		},
		{ block_id: blockId(5), kind: "heading", level: 2, text: "Constraints" },
		{
			block_id: blockId(6),
			kind: "list",
			ordered: false,
			items: [
				"Validate inside the intake service. Do not write to the EHR.",
				"Request and response follow the referral validation payload spec.",
			],
		},
		{
			block_id: blockId(7),
			kind: "heading",
			level: 2,
			text: "Acceptance · from signed C-04",
		},
		{
			block_id: blockId(8),
			kind: "list",
			ordered: true,
			items: [
				"Referrals missing a required insurance field are flagged.",
				"Flagged referrals never enter the scheduling queue.",
				"A test covers each required field.",
			],
		},
		{
			block_id: blockId(9),
			kind: "ticket_list",
			tickets: [
				{
					key: "INT-142",
					title: "Validate insurance fields",
					status: "To do",
					href: "https://acme.atlassian.net/browse/INT-142",
					acceptance: ["Each required field has a test"],
				},
				{
					key: "INT-143",
					title: "Block flagged referrals",
					status: "To do",
					acceptance: ["Flagged referrals never reach scheduling"],
				},
			],
		},
		{ block_id: blockId(10), kind: "heading", level: 2, text: "Report back" },
		{
			block_id: blockId(11),
			kind: "code_text",
			language_label: "Report template",
			text: "Commit: <sha>\nFiles changed: …\nTests run: …\nRequirements not met: …",
		},
		{
			block_id: blockId(12),
			kind: "evidence_checklist",
			fallback_text:
				"Required evidence: commit SHA, files changed, named tests and counts, predone_review disposition.",
		},
	],
	is_current: true,
	share_options: [
		{
			id: "copy_text",
			label: "Copy text",
			hint: "Markdown",
			kind: "copy_text",
			href: `/api/field/export?artifact=${CODER_PROMPT_ID}&version=2&format=md`,
			enabled: true,
			requires_approval: false,
		},
		{
			id: "copy_link",
			label: "Copy link",
			hint: "Same version",
			kind: "copy_link",
			href: `https://aadm.io${open(CODER_PROMPT_ID)}`,
			enabled: true,
			requires_approval: false,
		},
		{
			id: "download_pdf",
			label: "Download PDF",
			kind: "download",
			format: "pdf",
			href: `/api/field/export?artifact=${CODER_PROMPT_ID}&version=2&format=pdf`,
			enabled: true,
			requires_approval: false,
		},
		{
			id: "send_claude_code",
			label: "Send to Claude Code",
			kind: "command",
			command: "artifact.share",
			target_label: "Claude Code",
			enabled: true,
			requires_approval: false,
		},
		{
			id: "attach_jira",
			label: "Attach to Jira INT-142",
			kind: "command",
			command: "artifact.share",
			target_label: "Jira INT-142",
			enabled: true,
			requires_approval: false,
		},
		{
			id: "publish_confluence",
			label: "Publish to Confluence",
			kind: "command",
			command: "artifact.publish",
			target_label: "Confluence · Acme intake",
			enabled: false,
			disabled_reason: "Needs approval first",
			requires_approval: true,
		},
		{
			id: "share_slack",
			label: "Share in Slack",
			kind: "command",
			command: "artifact.share",
			target_label: "#acme-intake",
			enabled: true,
			requires_approval: false,
		},
	],
};

const entryId = (n: number) =>
	`e1000000-0000-5000-8000-${String(n).padStart(12, "0")}`;
const planner = { kind: "agent" as const, label: "Delivery Planner" };

const coderPromptStream: Stream = {
	agent_id: "delivery-planner",
	entries: [
		{
			entry_id: entryId(1),
			type: "message",
			created_at_label: "11:40",
			author: { kind: "engineer", label: "You" },
			text: "Write the coder prompt for Slice 4 from the approved recommendation and signed C-04. Use the API payload spec and the attached stack export.",
			attachments: [
				{
					label: "Tech stack export.xlsx",
					href: `${base}/evidence/tech-stack-export`,
				},
			],
		},
		{
			entry_id: entryId(2),
			type: "upload",
			created_at_label: "11:40",
			author: { kind: "system", label: "Field" },
			file_label: "Tech stack export.xlsx",
			saved_to_label: "engagement evidence",
		},
		{
			entry_id: entryId(3),
			type: "thinking",
			created_at_label: "11:41",
			author: planner,
			summary:
				"The recommendation puts validation in the intake service, so the prompt has to forbid EHR writes. Acceptance should come word for word from C-04, not be paraphrased.",
		},
		{
			entry_id: entryId(4),
			type: "tool_call",
			created_at_label: "11:41",
			author: planner,
			tool_label: "artifacts.get",
			target_label: "Recommendation · validate in intake · v1 approved",
			status: "done",
		},
		{
			entry_id: entryId(5),
			type: "tool_call",
			created_at_label: "11:41",
			author: planner,
			tool_label: "requirements.get",
			target_label: "C-04 from signed Cornerstone v1",
			status: "done",
		},
		{
			entry_id: entryId(6),
			type: "tool_call",
			created_at_label: "11:41",
			author: planner,
			tool_label: "jira.get_issues",
			target_label: "INT-142, INT-143",
			status: "failed",
			failure_reason: "Jira did not answer; tickets taken from the saved batch",
		},
		{
			entry_id: entryId(7),
			type: "message",
			created_at_label: "11:42",
			author: planner,
			text: "Draft ready. Validation stays in the intake service and the acceptance criteria are taken straight from C-04. One open question: should flagged referrals notify the referring clinic?",
			attachments: [],
		},
		{
			entry_id: entryId(8),
			type: "saved",
			created_at_label: "11:42",
			author: { kind: "system", label: "Field" },
			title: "Coder prompt · Slice 4",
			version_label: "v0.2",
			href: open(CODER_PROMPT_ID),
		},
	],
	next_cursor: null,
	run: null,
	composer: {
		send: command(
			"Send",
			"canvas.send",
			{ kind: "agent", id: "delivery-planner" },
			{
				emphasis: "primary",
			},
		),
		placeholder: "Ask Delivery Planner to revise, review or decide…",
		note: "Uploads are saved to engagement evidence",
	},
};

const node = (
	id: string,
	label: string,
	role: "input" | "self" | "output",
	kind: "evidence" | "decision" | "artifact" | "ticket" | "agent",
	sublabel?: string,
	tone?: "neutral" | "info" | "success" | "warning" | "danger",
) => ({
	id,
	label,
	sublabel,
	role,
	kind,
	tone,
	href: kind === "artifact" ? open(id) : undefined,
});

function studioView(query: Record<string, string>): StudioView {
	const artifactId = query.artifact || CODER_PROMPT_ID;
	const isKnown = artifactId === CODER_PROMPT_ID;
	const activeView: StudioViewId =
		query.view === "stream" || query.view === "map" ? query.view : "built";
	return {
		schema_version: "1.0",
		generated_at: "2026-10-30T14:00:00Z",
		engagement: {
			engagement_id: ENGAGEMENT_ID,
			customer_label: "Acme Health",
			engagement_label: "Intake modernization",
		},
		breadcrumbs: [
			{ label: "My Field", href: "/field/main" },
			{ label: "Acme Health · Intake modernization", href: base },
			{ label: "Studio" },
		],
		state: isKnown ? "ready" : "no_artifact_open",
		open_artifact_id: isKnown ? CODER_PROMPT_ID : null,
		views: isKnown
			? [
					{ id: "stream", label: "Stream", enabled: true, count: 8 },
					{ id: "built", label: "Built · v0.2", enabled: true },
					{ id: "map", label: "Map", enabled: true },
				]
			: [
					{
						id: "stream",
						label: "Stream",
						enabled: false,
						disabled_reason: "Open an artifact first",
					},
					{
						id: "built",
						label: "Built",
						enabled: false,
						disabled_reason: "Open an artifact first",
					},
					{
						id: "map",
						label: "Map",
						enabled: false,
						disabled_reason: "Open an artifact first",
					},
				],
		active_view: activeView,
		context_label: isKnown
			? "Delivery Planner · Slice 4 · Referral validation"
			: "No artifact open",
		rail: {
			pinned: [
				{
					collection_id: "868d6505-f098-50f6-9f08-d5c757447b54",
					label: "Coder prompts",
					count: 3,
				},
				{
					collection_id: "860817b1-a467-5144-ae12-d65d7cafd0b0",
					label: "API payload specs",
					count: 6,
				},
			],
			sections: isKnown
				? sections
				: sections.map((s) => ({
						...s,
						collections: s.collections.map((c) => ({
							...c,
							items: c.items.map((it) => ({ ...it, is_open: false })),
						})),
					})),
			can_edit_layout: true,
			create_types: [
				{ id: "prompt", label: "Coder prompt" },
				{ id: "requirements", label: "Requirements" },
				{ id: "roadmap", label: "Delivery plan" },
				{ id: "evidence", label: "Acceptance evidence" },
			],
		},
		outputs: [
			{
				artifact_id: CODER_PROMPT_ID,
				title: "Coder prompt · Slice 4",
				type_label: "Coder prompt",
				state: "draft",
				state_label: "Draft",
				tone: "neutral",
				version_label: "v0.2",
				visibility: "internal",
				updated_label: "Today",
				href: open(CODER_PROMPT_ID),
			},
			{
				artifact_id: "466e5efd-a1ee-548f-a035-28cca61de47d",
				title: "API payload spec · referral validation",
				type_label: "API payload spec",
				state: "draft",
				state_label: "Draft",
				tone: "neutral",
				version_label: "v0.3",
				visibility: "internal",
				updated_label: "2 days",
				href: open("466e5efd-a1ee-548f-a035-28cca61de47d"),
			},
			{
				artifact_id: "7de67668-bfc1-5534-aa14-1a8d8dff17b8",
				title: "Recommendation · validate in intake",
				type_label: "Recommendation",
				state: "approved",
				state_label: "Approved",
				tone: "success",
				version_label: "v1",
				visibility: "customer_visible",
				updated_label: "5 days",
				href: open("7de67668-bfc1-5534-aa14-1a8d8dff17b8"),
			},
			{
				artifact_id: "6f97fa98-a66c-5e54-ae84-83fbc87111a7",
				title: "Jira tickets · batch 4",
				type_label: "Jira tickets",
				state: "published",
				state_label: "Synced",
				tone: "neutral",
				version_label: "12 tickets",
				visibility: "internal",
				destination_label: "Jira INT-142, INT-143",
				updated_label: "Today",
				href: open("6f97fa98-a66c-5e54-ae84-83fbc87111a7"),
			},
		],
		header_actions: isKnown
			? [
					command(
						"Edit",
						"artifact.save_version",
						{
							kind: "artifact",
							id: CODER_PROMPT_ID,
							expected_version: 2,
						},
						{ enabled: false, disabled_reason: "Editing arrives in F8." },
					),
					command("Send for review", "artifact.submit_review", {
						kind: "artifact",
						id: CODER_PROMPT_ID,
						expected_version: 2,
					}),
					command(
						"Go",
						"artifact.approve",
						{
							kind: "artifact",
							id: CODER_PROMPT_ID,
							expected_version: 2,
						},
						{
							emphasis: "primary",
							input: { content_hash: coderPromptV2.content_hash },
						},
					),
					command("Open in Claude", "client.open_in_claude", null),
				]
			: [],
		stream: isKnown ? coderPromptStream : null,
		built: isKnown ? coderPromptV2 : null,
		map: isKnown
			? {
					nodes: [
						node(
							"n-outcome",
							"Outcome definition",
							"input",
							"artifact",
							"Intake time [baseline] → [target]",
						),
						node(
							"n-c04",
							"Requirement C-04",
							"input",
							"decision",
							"Signed Cornerstone v1",
							"success",
						),
						node(
							"7de67668-bfc1-5534-aa14-1a8d8dff17b8",
							"Recommendation · validate in intake",
							"input",
							"artifact",
							"Approved",
							"success",
						),
						node(
							"247ac460-daf8-552d-927e-9fbf695c6925",
							"Architecture · intake flow v2",
							"input",
							"artifact",
							"In review",
							"info",
						),
						node(
							"466e5efd-a1ee-548f-a035-28cca61de47d",
							"API payload spec · referral validation",
							"input",
							"artifact",
							"Draft",
						),
						node(
							"n-stack",
							"Tech stack export",
							"input",
							"evidence",
							"Uploaded today",
						),
						node(
							CODER_PROMPT_ID,
							"Coder prompt · Slice 4",
							"self",
							"artifact",
							"Draft v0.2 · Delivery Planner",
						),
						node(
							"n-int142",
							"Jira INT-142, INT-143",
							"output",
							"ticket",
							"Synced · to do",
						),
						node(
							"n-report",
							"Coder report",
							"output",
							"evidence",
							"Waiting on coder",
							"warning",
						),
						node(
							"n-evidence",
							"Acceptance evidence · Slice 4",
							"output",
							"evidence",
							"Not started",
						),
						node(
							"94e3d236-50f7-5899-bc5b-f63540c28f6a",
							"Process doc · flagged referrals",
							"output",
							"artifact",
							"Draft · Adoption Lead",
						),
					],
					edges: [
						{ from: "n-outcome", to: CODER_PROMPT_ID, label: "built from" },
						{ from: "n-c04", to: CODER_PROMPT_ID, label: "decides" },
						{
							from: "7de67668-bfc1-5534-aa14-1a8d8dff17b8",
							to: CODER_PROMPT_ID,
							label: "built from",
						},
						{
							from: "247ac460-daf8-552d-927e-9fbf695c6925",
							to: CODER_PROMPT_ID,
							label: "built from",
						},
						{
							from: "466e5efd-a1ee-548f-a035-28cca61de47d",
							to: CODER_PROMPT_ID,
							label: "built from",
						},
						{ from: "n-stack", to: CODER_PROMPT_ID, label: "built from" },
						{ from: CODER_PROMPT_ID, to: "n-int142", label: "produces" },
						{ from: CODER_PROMPT_ID, to: "n-report", label: "produces" },
						{ from: CODER_PROMPT_ID, to: "n-evidence", label: "produces" },
						{
							from: CODER_PROMPT_ID,
							to: "94e3d236-50f7-5899-bc5b-f63540c28f6a",
							label: "produces",
						},
					],
					layout_hint: "columns_by_role",
				}
			: null,
		empty_state: isKnown
			? null
			: {
					heading: "Nothing open",
					line: "Choose an artifact from the collections or outputs.",
				},
		uploads: { accept: [], max_bytes: 0 },
	};
}

/** Plays `GET …/studio`, `GET /artifacts/{id}` and `GET /artifacts/{id}/map` for one engagement. */
export default function studioFixture(query: Record<string, string>): {
	[engagementId: string]: StudioView;
} {
	return { [ENGAGEMENT_ID]: studioView(query) };
}
