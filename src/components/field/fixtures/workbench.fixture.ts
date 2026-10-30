/**
 * EXAMPLE DATA ONLY — the "2 · Engagement Workbench" mock, shaped to
 * docs/contracts/FIELD-WORKBENCH.md. Loaded only by `src/lib/field-fixtures.ts`
 * when PUBLIC_FIELD_FIXTURES=1. The default export plays the backend for one
 * engagement: `?agent=`, `?panel=` and `?filter=` pick what it returns. To
 * strip examples: delete this file (or the whole fixtures/ folder).
 */
import type {
	FieldActionLink,
	Stream,
	WorkbenchArtifact,
	WorkbenchView,
} from "../field-types";

const ENGAGEMENT_ID = "6f278bf1-408e-5452-a2bc-0ea4bf42c816";
const CODER_PROMPT_ID = "cdbac60c-efb7-529f-913a-98cc85321084";
const base = `/field/main/e/${ENGAGEMENT_ID}`;
const studio = (artifactId: string) => `${base}?artifact=${artifactId}`;

const navigate = (
	label: string,
	href: string,
	emphasis: FieldActionLink["emphasis"] = "secondary",
): FieldActionLink => ({ label, kind: "navigate", href, enabled: true, emphasis });

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

type AgentSeed = {
	group: string;
	agent_id: string;
	label: string;
	description: string;
	status_text?: string;
	status_tone?: "neutral" | "warning";
	studio_href?: string;
};

const agentSeeds: AgentSeed[] = [
	{
		group: "Discovery",
		agent_id: "business-discovery",
		label: "Business Discovery",
		description:
			"Define the customer workflow, identify unresolved questions, and build the discovery brief.",
		status_text: "Drafting brief v0.3",
		status_tone: "neutral",
	},
	{
		group: "Discovery",
		agent_id: "technical-discovery",
		label: "Technical Discovery",
		description:
			"Inventory the systems, data and integrations the work will touch.",
		status_text: "2 open questions",
		status_tone: "neutral",
	},
	{
		group: "Outcomes",
		agent_id: "outcome-architect",
		label: "Outcome Architect",
		description: "Turn the discovery brief into a measurable outcome definition.",
		status_text: "v1.2 awaiting approval",
		status_tone: "warning",
	},
	{
		group: "Architecture",
		agent_id: "solution-architect",
		label: "Solution Architect",
		description: "Design the target architecture and the technology choices.",
	},
	{
		group: "Architecture",
		agent_id: "cornerstone",
		label: "Cornerstone",
		description: "Draft the requirements the customer signs.",
		status_text: "v2 awaiting customer sign-off",
		status_tone: "warning",
	},
	{
		group: "Delivery",
		agent_id: "delivery-planner",
		label: "Delivery Planner",
		description: "Plan batches and slices, and write coder prompts.",
	},
	{
		group: "Delivery",
		agent_id: "evidence-reviewer",
		label: "Evidence Reviewer",
		description: "Judge coder reports against the slice and its prompt.",
		status_text: "Slice 3 report ready",
		status_tone: "neutral",
		studio_href: studio(CODER_PROMPT_ID),
	},
	{
		group: "Adoption and learning",
		agent_id: "adoption-lead",
		label: "Adoption Lead",
		description: "Prepare the people and processes that will run the result.",
	},
	{
		group: "Adoption and learning",
		agent_id: "field-learnings",
		label: "Field Learnings",
		description: "Log reusable patterns for the platform team.",
		status_text: "1 pattern to log",
		status_tone: "neutral",
	},
];

const groupOrder = [
	"Discovery",
	"Outcomes",
	"Architecture",
	"Delivery",
	"Adoption and learning",
];

function agentGroups(selectedId: string): WorkbenchView["agent_groups"] {
	return groupOrder.map((label, i) => ({
		group_id: `g${i + 1}`,
		label,
		agents: agentSeeds
			.filter((a) => a.group === label)
			.map((a) => ({
				agent_id: a.agent_id,
				label: a.label,
				description: a.description,
				status_text: a.status_text,
				status_tone: a.status_tone,
				selected: a.agent_id === selectedId,
				open: navigate(a.label, a.studio_href ?? `${base}?agent=${a.agent_id}`),
			})),
	}));
}

const artifact = (
	artifact_id: string,
	title: string,
	type_label: string,
	version_label: string,
	state: WorkbenchArtifact["state"],
	visibility: WorkbenchArtifact["visibility"]["id"],
	owner_label: string,
	author_agent_label: string,
): WorkbenchArtifact => ({
	artifact_id,
	title,
	type_label,
	version_label,
	state,
	visibility: {
		id: visibility,
		label: visibility === "internal" ? "Internal" : "Customer-visible",
	},
	owner_label,
	author_agent_label,
	open: navigate("Open", studio(artifact_id)),
});

const allArtifacts: WorkbenchArtifact[] = [
	artifact(
		"917094f9-3a6f-5f45-a010-2144fab5d252",
		"Discovery brief",
		"Discovery brief",
		"v0.2",
		{ id: "review", label: "Review", tone: "info" },
		"internal",
		"You",
		"Business Discovery",
	),
	artifact(
		"7de67668-bfc1-5534-aa14-1a8d8dff17b8",
		"Recommendation · validate in intake",
		"Recommendation",
		"v1",
		{ id: "approved", label: "Approved", tone: "success" },
		"customer_visible",
		"You",
		"Solution Architect",
	),
	artifact(
		"247ac460-daf8-552d-927e-9fbf695c6925",
		"Architecture · intake flow",
		"Architecture diagram",
		"v2",
		{ id: "review", label: "Review", tone: "info" },
		"internal",
		"You",
		"Solution Architect",
	),
	artifact(
		"6f97fa98-a66c-5e54-ae84-83fbc87111a7",
		"Jira tickets · batch 4",
		"Jira tickets",
		"12 tickets",
		{ id: "published", label: "Synced to Jira", tone: "neutral" },
		"internal",
		"You",
		"Delivery Planner",
	),
	artifact(
		CODER_PROMPT_ID,
		"Coder prompt · Slice 4",
		"Coder prompt",
		"v0.2",
		{ id: "draft", label: "Draft", tone: "neutral" },
		"internal",
		"You",
		"Delivery Planner",
	),
	artifact(
		"94e3d236-50f7-5899-bc5b-f63540c28f6a",
		"Process doc · flagged referrals",
		"Process doc",
		"v0.1",
		{ id: "draft", label: "Draft", tone: "neutral" },
		"internal",
		"You",
		"Adoption Lead",
	),
];

const inventories: WorkbenchView["land"]["items"] = [
	{
		inventory_id: "38480e4a-2804-5352-9430-15573f3eb70a",
		type: "tech_stack",
		label: "Tech stack",
		description: "Systems, versions, owners, hosting",
		status: { label: "In progress", tone: "info" },
		detail_label: "28 systems",
		agent_label: "Technical Discovery",
		primary: command("Continue", "inventory.build", null, {
			input: { inventory_type: "tech_stack" },
		}),
	},
	{
		inventory_id: "a8274ba9-908f-551e-bcd9-2a70210d7ca5",
		type: "people",
		label: "People",
		description: "Teams, roles, skills, sponsor, owners, named acceptors",
		status: { label: "In progress", tone: "info" },
		agent_label: "Adoption Lead",
		primary: command("Continue", "inventory.build", null, {
			input: { inventory_type: "people" },
		}),
	},
	{
		inventory_id: "1774eb3d-c912-5562-9cfb-ae6a50dc4e2d",
		type: "processes",
		label: "Processes",
		description: "Steps, handoffs, decisions, where AI could act",
		status: { label: "Not started", tone: "neutral" },
		agent_label: "Business Discovery",
		primary: command("Build", "inventory.build", null, {
			emphasis: "primary",
			input: { inventory_type: "processes" },
		}),
	},
	{
		inventory_id: "9b5a9a12-1ec8-5150-baa1-2dc9ddf38774",
		type: "ai_tools",
		label: "AI tools and spend",
		description: "Tools, models, licences, cost, approval",
		status: { label: "1 unapproved", tone: "warning" },
		detail_label: "6 tools",
		agent_label: "Outcome Architect",
		primary: command("Open", "inventory.build", null, {
			input: { inventory_type: "ai_tools" },
		}),
	},
	{
		inventory_id: "8b0fc3f2-341c-57c1-81b9-8bd9f0b2a734",
		type: "data_sources",
		label: "Data sources and access",
		description: "Sources, owners, classification, access path",
		status: { label: "3 awaiting access", tone: "warning" },
		detail_label: "11 sources",
		agent_label: "Technical Discovery",
		primary: command("Open", "inventory.build", null, {
			input: { inventory_type: "data_sources" },
		}),
	},
	{
		inventory_id: "80f9db54-c92d-5974-be5b-b0e668c4dacb",
		type: "integrations",
		label: "Integrations and APIs",
		description: "Endpoints, auth, sandboxes, read-back support",
		status: { label: "Not started", tone: "neutral" },
		agent_label: "Solution Architect",
		primary: command("Build", "inventory.build", null, {
			emphasis: "primary",
			input: { inventory_type: "integrations" },
		}),
	},
	{
		inventory_id: "c15be65c-846e-523a-88c7-39eca31deb86",
		type: "risks",
		label: "Risks and constraints",
		description: "Security, compliance, data residency, change windows",
		status: { label: "Not started", tone: "neutral" },
		agent_label: "Solution Architect",
		primary: command("Build", "inventory.build", null, {
			emphasis: "primary",
			input: { inventory_type: "risks" },
		}),
	},
];

const artifactFilters = [
	{ id: "all", label: "All" },
	{ id: "internal", label: "Internal" },
	{ id: "customer_visible", label: "Customer-visible" },
];

function view(query: Record<string, string>): WorkbenchView {
	const agentId = agentSeeds.some((a) => a.agent_id === query.agent)
		? query.agent
		: "business-discovery";
	const panel = query.panel === "artifacts" ? "artifacts" : "land";
	const filter = artifactFilters.some((f) => f.id === query.filter)
		? query.filter
		: "all";
	const artifacts =
		filter === "all"
			? allArtifacts
			: allArtifacts.filter((a) => a.visibility.id === filter);
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
			{
				label: "Field team",
				href: "/field/main/w/3f1d2c4b-5a6e-5f70-8a91-b2c3d4e5f601",
			},
			{ label: "Acme Health · Intake modernization" },
		],
		client_links: [
			navigate("Brief", studio("917094f9-3a6f-5f45-a010-2144fab5d252")),
			command("Open in Claude", "client.open_in_claude", null),
			command("Share in Slack", "client.share_in_slack", null, {
				input: { channel: "#acme-intake" },
			}),
		],
		context_bar: [
			{ label: "Outcome", value: "Intake time [baseline] → [target]" },
			{ label: "Delivery", value: "3 of 5 slices" },
			{ label: "Next milestone", value: "Batch 4 review" },
			{
				label: "Waiting on",
				value: "Customer · Cornerstone v2",
				tone: "warning",
			},
			{ label: "Blockers", value: "1", tone: "danger" },
		],
		lenses: [
			{
				id: "strategy",
				label: "Strategy",
				state: "on_track",
				tone: "neutral",
				href: `${base}?agent=outcome-architect`,
			},
			{
				id: "plan",
				label: "Plan",
				state: "in_progress",
				tone: "neutral",
				href: `${base}?agent=delivery-planner`,
			},
			{
				id: "readiness",
				label: "Readiness",
				state: "needs_action",
				tone: "warning",
				href: `${base}?agent=technical-discovery&panel=land`,
			},
			{
				id: "adopt",
				label: "Adopt",
				state: "not_started",
				tone: "neutral",
				href: `${base}?agent=adoption-lead`,
			},
			{
				id: "governance",
				label: "Governance",
				state: "needs_decision",
				tone: "warning",
				href: `${base}?agent=cornerstone`,
			},
		],
		agent_groups: agentGroups(agentId),
		canvas: {
			agent_id: agentId,
			starter_prompts: [
				"Summarize what we know and what we still need from the customer.",
				"Turn the latest notes into a draft for review.",
			],
		},
		panels: {
			tabs: [
				{ id: "artifacts", label: "Artifacts", count: allArtifacts.length },
				{ id: "land", label: "Lay of the land", count: inventories.length },
			],
			selected: panel,
		},
		artifacts: {
			items: artifacts,
			filters: artifactFilters.map((f) => ({ ...f, selected: f.id === filter })),
		},
		land: {
			items: inventories,
			actions: [
				command("Import file", "inventory.import", null, {
					enabled: false,
					disabled_reason: "Uploads arrive with the backend.",
				}),
				command("New inventory", "inventory.build", null),
			],
		},
		uploads: { accept: [], max_bytes: 0 },
	};
}

const entryId = (n: number) =>
	`e0000000-0000-5000-8000-${String(n).padStart(12, "0")}`;
const DRAFT_ID = "d0000000-0000-5000-8000-000000000001";
const QUESTION_1 = "a0000000-0000-5000-8000-000000000001";
const QUESTION_2 = "a0000000-0000-5000-8000-000000000002";
const DECISION_1 = "b0000000-0000-5000-8000-000000000001";

const engineer = { kind: "engineer" as const, label: "You" };
const system = { kind: "system" as const, label: "Field" };

function composer(agentId: string, agentLabel: string): Stream["composer"] {
	return {
		send: command("Send", "canvas.send", { kind: "agent", id: agentId }, {
			emphasis: "primary",
		}),
		placeholder: `Ask ${agentLabel} to review, draft or decide…`,
		note: "Drafts stay in the canvas until you save",
	};
}

function stream(agentId: string): Stream {
	const agent = agentSeeds.find((a) => a.agent_id === agentId) ?? agentSeeds[0];
	const author = { kind: "agent" as const, label: agent.label };
	if (agentId !== "business-discovery") {
		return {
			agent_id: agentId,
			entries: [],
			next_cursor: null,
			run: null,
			composer: composer(agentId, agent.label),
		};
	}
	return {
		agent_id: agentId,
		entries: [
			{
				entry_id: entryId(1),
				type: "message",
				created_at_label: "10:02",
				author: engineer,
				text: "Turn the intake workshop notes into a discovery brief. Flag anything we still need from the customer.",
				attachments: [
					{
						label: "Intake workshop notes.docx",
						href: `${base}/evidence/intake-workshop-notes`,
					},
				],
			},
			{
				entry_id: entryId(2),
				type: "upload",
				created_at_label: "10:02",
				author: system,
				file_label: "Intake workshop notes.docx",
				saved_to_label: "engagement evidence",
			},
			{
				entry_id: entryId(3),
				type: "thinking",
				created_at_label: "10:03",
				author,
				summary:
					"Three intake channels, each re-keyed by hand. The completeness check is manual and undocumented, so it needs an owner before it can be automated.",
			},
			{
				entry_id: entryId(4),
				type: "tool_call",
				created_at_label: "10:03",
				author,
				tool_label: "evidence.read",
				target_label: "Intake workshop notes.docx",
				status: "done",
			},
			{
				entry_id: entryId(5),
				type: "tool_call",
				created_at_label: "10:03",
				author,
				tool_label: "inventory.read",
				target_label: "Tech stack · 28 systems",
				status: "done",
			},
			{
				entry_id: entryId(6),
				type: "draft",
				created_at_label: "10:04",
				author,
				draft_id: DRAFT_ID,
				title: "Discovery brief",
				summary: "From 1 source · not saved yet",
				sections: [
					{
						heading: "Confirmed findings",
						items: [
							"Requests arrive by fax, portal and phone; staff re-key each one into the EHR.",
							"Referral completeness is checked by hand before scheduling.",
						],
					},
					{
						heading: "Assumptions",
						items: ["Portal volume will grow after the patient app launch."],
					},
				],
				actions: [
					command(
						"Save as Discovery brief v0.3",
						"draft.save",
						{
							kind: "draft",
							id: DRAFT_ID,
							expected_version: 2,
						},
						{
							emphasis: "primary",
							input: { artifact_id: "917094f9-3a6f-5f45-a010-2144fab5d252" },
						},
					),
					command("Discard", "draft.discard", { kind: "draft", id: DRAFT_ID }),
				],
			},
			{
				entry_id: entryId(7),
				type: "question",
				created_at_label: "10:04",
				author,
				question_id: QUESTION_1,
				text: "Who owns the referral completeness rules today?",
				recipient_label: "Acme · Intake operations lead",
				actions: [
					command("Ask customer", "question.send", {
						kind: "question",
						id: QUESTION_1,
					}),
				],
			},
			{
				entry_id: entryId(8),
				type: "question",
				created_at_label: "10:04",
				author,
				question_id: QUESTION_2,
				text: "Can the EHR accept writes by API, or only feeds?",
				recipient_label: "Acme · Integration architect",
				actions: [
					command("Ask customer", "question.send", {
						kind: "question",
						id: QUESTION_2,
					}),
				],
			},
			{
				entry_id: entryId(9),
				type: "decision_request",
				created_at_label: "10:04",
				author,
				decision_id: DECISION_1,
				text: "Pilot scope: one clinic or all three?",
				options: [
					{ id: "one_clinic", label: "One clinic" },
					{ id: "all_three", label: "All three" },
				],
				actions: [
					command("One clinic", "decision.record", {
						kind: "decision",
						id: DECISION_1,
					}, { input: { option_id: "one_clinic" } }),
					command("All three", "decision.record", {
						kind: "decision",
						id: DECISION_1,
					}, { input: { option_id: "all_three" } }),
				],
			},
			{
				entry_id: entryId(10),
				type: "handoff",
				created_at_label: "10:05",
				author: system,
				label: "Technical Discovery was given the same context",
			},
		],
		next_cursor: null,
		run: null,
		composer: composer(agentId, agent.label),
	};
}

/** Plays `GET …/workbench` and `GET …/agents/{agent}/stream` for one engagement. */
export default function workbenchFixture(query: Record<string, string>): {
	[engagementId: string]: { view: WorkbenchView; stream: Stream };
} {
	const v = view(query);
	return { [ENGAGEMENT_ID]: { view: v, stream: stream(v.canvas.agent_id) } };
}
