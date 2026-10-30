import { z } from "astro/zod";

/**
 * Field read-model contracts. Schemas are the single source of the types:
 * every model is parsed before a component sees it (RES-05). Values are
 * backend-owned (BACK-01, ARCH-15): the UI renders labels, tones, order and
 * counts as given and never computes them. IDs are server-made UUIDs (IDN-06).
 * Screen contracts: docs/contracts/FIELD-*.md. Shapes here follow those files
 * section by section; a field the contract does not name is not here.
 */

const id = z.uuid();

/* ---- Shared value lists (docs/contracts/FIELD-MY-FIELD.md §2) ---- */

export const ToneSchema = z.enum([
	"neutral",
	"info",
	"success",
	"warning",
	"danger",
]);
export const LensStatusSchema = z.enum([
	"on_track",
	"in_progress",
	"needs_action",
	"needs_decision",
	"blocked",
	"not_started",
]);
/** Artifact lifecycle as the backend words it (FIELD-WORKBENCH.md "Artifact row"). */
export const ArtifactStateSchema = z.enum([
	"draft",
	"review",
	"approved",
	"signed",
	"published",
]);
export const VisibilitySchema = z.enum(["internal", "customer_visible"]);

const LabelToneSchema = z.object({ label: z.string(), tone: ToneSchema });
const StateSchema = LabelToneSchema;

/**
 * One action shape for every control: a link (`navigate`) or an intent
 * (`command`). A command carries what the §A7 envelope needs — the target
 * kind, id and version — so the client never guesses them (ART-02).
 */
export const ActionSchema = z
	.object({
		label: z.string(),
		kind: z.enum(["navigate", "command"]),
		href: z.string().optional(),
		command: z.string().optional(),
		/** The id the command acts on. */
		target: z.string().optional(),
		/** Noun kind of `target`, e.g. `draft`, `artifact`, `engagement`. */
		target_kind: z.string().optional(),
		/** Version the click is based on; the server refuses a stale one. */
		expected_version: z.number().int().optional(),
		/** Server-chosen inputs for this action (a decision option, a recipient). */
		input: z.record(z.string(), z.unknown()).optional(),
		enabled: z.boolean(),
		disabled_reason: z.string().optional(),
		emphasis: z.enum(["primary", "secondary"]),
	})
	.refine((a) => (a.kind === "navigate" ? !!a.href : !!a.command), {
		message: "navigate needs href; command needs command",
	});

const CrumbSchema = z.object({
	label: z.string(),
	href: z.string().optional(),
});

/* ---- Problem and command reply (every contract §"errors"; PRD §A7) ---- */

/** The shared problem format. The client branches on `code`, never on text (RES-04). */
export const ProblemSchema = z.object({
	code: z.string(),
	title: z.string(),
	detail: z.string(),
	retryable: z.boolean(),
	field: z.string().optional(),
	retry_after: z.number().int().optional(),
	request_id: z.string().optional(),
});

/** PRD §A7 reply. `saved[]` is where every later id and `expected_version` comes from (ART-02). */
export const CommandReplySchema = z.object({
	result: z.string(),
	saved: z.array(
		z.object({
			kind: z.string(),
			id: z.string(),
			version: z.number().int(),
			sha256: z.string(),
		}),
	),
	/** One line for a person, shown exactly as returned (RC-GUIDANCE-01). */
	next_step: z.string(),
	needs_decision: z.boolean().optional(),
	request_id: z.string().optional(),
});

/** What the browser posts to the same-origin command endpoint. */
export const CommandRequestSchema = z.object({
	command: z.string().min(1).max(80),
	target: z
		.object({
			kind: z.string().min(1).max(40),
			id: z.string().min(1).max(200),
			expected_version: z.number().int().optional(),
		})
		.optional(),
	input: z.record(z.string(), z.unknown()).optional(),
	idempotency_key: z.uuid(),
	engagement_id: z.uuid().optional(),
	workspace_id: z.uuid().optional(),
	/** `generated_at` of the view the click came from; the server refuses a stale one. */
	base_generated_at: z.string().optional(),
});

/* ---- My Field (`/field/main`) — docs/contracts/FIELD-MY-FIELD.md ---- */

export const ContinueItemSchema = z.object({
	title: z.string(),
	engagement_label: z.string(),
	specialist_label: z.string(),
	badges: z.array(LabelToneSchema),
	primary: ActionSchema,
});

export const ActionRowSchema = z.object({
	id,
	title: z.string(),
	blocks_label: z.string().optional(),
	engagement_label: z.string(),
	specialist_label: z.string(),
	owner_label: z.string(),
	/** Server labels for every workspace this engagement sits in. */
	workspace_labels: z.array(z.string()).min(1),
	waiting_label: z.string(),
	waiting_tone: ToneSchema,
	cta: ActionSchema,
});

export const EngagementCardSchema = z.object({
	engagement_id: id,
	customer_label: z.string(),
	engagement_label: z.string(),
	workspace_labels: z.array(z.string()).min(1),
	status: LabelToneSchema.optional(),
	/** Shown when the server has no `facts` for the card. */
	summary: z.string().optional(),
	facts: z.array(z.object({ label: z.string(), value: z.string() })),
	land_label: z.string().optional(),
	/** Only lenses needing attention. */
	lenses: z.array(
		z.object({
			id: z.string(),
			label: z.string(),
			state: LensStatusSchema,
			tone: ToneSchema,
		}),
	),
	drift: z.object({ text: z.string(), tone: ToneSchema }).optional(),
	open: ActionSchema,
});

export const MyFieldViewSchema = z.object({
	schema_version: z.string().regex(/^1\./, "unsupported major version"),
	generated_at: z.string(),
	viewer: z.object({ display_name: z.string(), initials: z.string() }),
	summary_label: z.string(),
	continue: ContinueItemSchema.nullable(),
	filters: z.array(
		z.object({
			id: z.string(),
			label: z.string(),
			count: z.number().int(),
			selected: z.boolean(),
		}),
	),
	actions: z.object({
		items: z.array(ActionRowSchema),
		next_cursor: z.string().nullable(),
	}),
	engagements: z.array(EngagementCardSchema),
	capture: z.object({
		available: z.boolean(),
		accept: z.array(z.string()),
		max_bytes: z.number().int(),
	}),
	empty_state: z.object({ heading: z.string(), line: z.string() }),
});

/* ---- Canvas stream — docs/contracts/FIELD-WORKBENCH.md §3 (Studio reuses it) ---- */

const EntryBase = z.object({
	entry_id: id,
	/** Server-formatted; never computed here. */
	created_at_label: z.string(),
	author: z.object({
		kind: z.enum(["engineer", "agent", "system"]),
		label: z.string(),
	}),
});

const AttachmentSchema = z.object({ label: z.string(), href: z.string() });

/** A draft's sections come with their headings; the client never names them. */
export const DraftSectionSchema = z.object({
	heading: z.string(),
	items: z.array(z.string()),
});

export const KnownEntrySchema = z.discriminatedUnion("type", [
	EntryBase.extend({
		type: z.literal("message"),
		text: z.string(),
		attachments: z.array(AttachmentSchema),
	}),
	EntryBase.extend({
		type: z.literal("upload"),
		file_label: z.string(),
		saved_to_label: z.string(),
	}),
	/** A short summary written for the engineer; never raw model reasoning. */
	EntryBase.extend({ type: z.literal("thinking"), summary: z.string() }),
	EntryBase.extend({
		type: z.literal("tool_call"),
		tool_label: z.string(),
		target_label: z.string(),
		status: z.enum(["running", "done", "failed"]),
		failure_reason: z.string().optional(),
	}),
	EntryBase.extend({
		type: z.literal("draft"),
		draft_id: id,
		title: z.string(),
		summary: z.string(),
		sections: z.array(DraftSectionSchema),
		actions: z.array(ActionSchema),
	}),
	EntryBase.extend({
		type: z.literal("question"),
		question_id: id,
		text: z.string(),
		recipient_label: z.string(),
		actions: z.array(ActionSchema),
	}),
	EntryBase.extend({
		type: z.literal("decision_request"),
		decision_id: id,
		text: z.string(),
		options: z.array(z.object({ id: z.string(), label: z.string() })),
		actions: z.array(ActionSchema),
	}),
	EntryBase.extend({
		type: z.literal("saved"),
		title: z.string(),
		version_label: z.string(),
		href: z.string(),
	}),
	EntryBase.extend({
		type: z.literal("error"),
		title: z.string(),
		detail: z.string(),
		request_id: z.string().optional(),
	}),
]);

/** An entry type this build does not know: shown as a plain line with its label, never hidden. */
export const UnknownEntrySchema = EntryBase.extend({
	type: z.string(),
	label: z.string(),
});

export const StreamEntrySchema = z.union([
	KnownEntrySchema,
	UnknownEntrySchema,
]);

/** True when this build knows how to draw the entry; otherwise show its `label`. */
export function isKnownEntry(
	entry: z.infer<typeof StreamEntrySchema>,
): entry is z.infer<typeof KnownEntrySchema> {
	return KnownEntrySchema.safeParse(entry).success;
}

export const StreamSchema = z.object({
	agent_id: z.string(),
	entries: z.array(StreamEntrySchema),
	/** Older entries; null when this is the oldest page. */
	next_cursor: z.string().nullable(),
	/** An active run: entries keep arriving and the server offers Stop. */
	run: z.object({ run_id: id, cancel: ActionSchema }).nullable(),
	/** The message box: `send` is the `canvas.send` command for this agent; copy is the server's. */
	composer: z.object({
		send: ActionSchema,
		placeholder: z.string(),
		note: z.string(),
	}),
});

/* ---- Engagement Workbench (`/field/main/e/{engagementId}`) — FIELD-WORKBENCH.md §2 ---- */

const EngagementRefSchema = z.object({
	engagement_id: id,
	customer_label: z.string(),
	engagement_label: z.string(),
});

export const WorkbenchAgentSchema = z.object({
	agent_id: z.string(),
	label: z.string(),
	/** One line shown at the top of the canvas when selected. */
	description: z.string(),
	status_text: z.string().optional(),
	status_tone: ToneSchema.optional(),
	selected: z.boolean(),
	open: ActionSchema,
});

export const WorkbenchAgentGroupSchema = z.object({
	group_id: z.string(),
	label: z.string(),
	agents: z.array(WorkbenchAgentSchema),
});

export const WorkbenchArtifactSchema = z.object({
	artifact_id: id,
	title: z.string(),
	type_label: z.string(),
	version_label: z.string(),
	state: StateSchema.extend({ id: ArtifactStateSchema }),
	visibility: z.object({ id: VisibilitySchema, label: z.string() }),
	owner_label: z.string(),
	author_agent_label: z.string(),
	open: ActionSchema,
});

/** "Lay of the land": the server's inventory types, in its order; an unknown type still renders. */
export const WorkbenchInventorySchema = z.object({
	inventory_id: id,
	type: z.string(),
	label: z.string(),
	description: z.string(),
	status: StateSchema,
	detail_label: z.string().optional(),
	agent_label: z.string(),
	primary: ActionSchema,
});

export const WorkbenchViewSchema = z.object({
	schema_version: z.string().regex(/^1\./, "unsupported major version"),
	generated_at: z.string(),
	engagement: EngagementRefSchema,
	breadcrumbs: z.array(CrumbSchema),
	/** Open in Claude, Share in Slack — carrying this engagement's identity. */
	client_links: z.array(ActionSchema),
	context_bar: z.array(
		z.object({
			label: z.string(),
			value: z.string(),
			tone: ToneSchema.optional(),
		}),
	),
	/** All five lenses, each with a link to its detail. */
	lenses: z.array(
		z.object({
			id: z.string(),
			label: z.string(),
			state: LensStatusSchema,
			tone: ToneSchema,
			href: z.string(),
		}),
	),
	agent_groups: z.array(WorkbenchAgentGroupSchema),
	canvas: z.object({
		agent_id: z.string(),
		/** Shown with the agent's description when the stream is empty. */
		starter_prompts: z.array(z.string()),
	}),
	panels: z.object({
		tabs: z.array(
			z.object({
				id: z.enum(["artifacts", "land"]),
				label: z.string(),
				count: z.number().int(),
			}),
		),
		selected: z.enum(["artifacts", "land"]),
	}),
	artifacts: z.object({
		items: z.array(WorkbenchArtifactSchema),
		/** Visibility filters the server allows; a filter is a new read. */
		filters: z.array(
			z.object({ id: z.string(), label: z.string(), selected: z.boolean() }),
		),
	}),
	land: z.object({
		items: z.array(WorkbenchInventorySchema),
		/** Import file, New inventory — as the server offers them. */
		actions: z.array(ActionSchema),
	}),
	uploads: z.object({
		accept: z.array(z.string()),
		max_bytes: z.number().int(),
	}),
});

/* ---- Artifact Studio (`…?artifact={artifactId}&view=`) — FIELD-STUDIO.md §2–3 ---- */

export const StudioViewIdSchema = z.enum(["stream", "built", "map"]);

export const RailItemSchema = z.object({
	item_id: id,
	title: z.string(),
	type_label: z.string(),
	state: ArtifactStateSchema,
	state_label: z.string(),
	tone: ToneSchema,
	/** This is the artifact in the center. */
	is_open: z.boolean(),
	href: z.string(),
});

export const StudioCollectionSchema = z.object({
	collection_id: id,
	label: z.string(),
	count: z.number().int(),
	pinned: z.boolean(),
	editable: z.boolean(),
	default_expanded: z.boolean(),
	items: z.array(RailItemSchema),
	add_action: ActionSchema.nullable(),
});

export const StudioSectionSchema = z.object({
	section_id: id,
	label: z.string(),
	order: z.number().int(),
	editable: z.boolean(),
	removable: z.boolean(),
	default_expanded: z.boolean(),
	collections: z.array(StudioCollectionSchema),
});

export const StudioOutputSchema = z.object({
	artifact_id: id,
	title: z.string(),
	type_label: z.string(),
	state: ArtifactStateSchema,
	state_label: z.string(),
	tone: ToneSchema,
	version_label: z.string(),
	visibility: VisibilitySchema,
	/** Where it went: Claude Code, Jira INT-142, Confluence. */
	destination_label: z.string().optional(),
	/** Already relative: Today, 2 days. */
	updated_label: z.string(),
	href: z.string(),
});

export const ShareOptionSchema = z.object({
	id: z.string(),
	label: z.string(),
	hint: z.string().optional(),
	kind: z.enum(["copy_text", "copy_link", "download", "command"]),
	format: z.enum(["pdf", "docx", "md"]).optional(),
	/** Export link for copy and download: the stored version, never the screen. */
	href: z.string().optional(),
	command: z.string().optional(),
	enabled: z.boolean(),
	disabled_reason: z.string().optional(),
	requires_approval: z.boolean(),
	target_label: z.string().optional(),
});

const BlockBase = z.object({ block_id: id });
const InlineText = z.string();

export const KnownBlockSchema = z.discriminatedUnion("kind", [
	BlockBase.extend({
		kind: z.literal("heading"),
		level: z.number().int().min(1).max(4),
		text: z.string(),
	}),
	BlockBase.extend({ kind: z.literal("paragraph"), text: InlineText }),
	BlockBase.extend({
		kind: z.literal("list"),
		ordered: z.boolean(),
		items: z.array(InlineText),
	}),
	BlockBase.extend({
		kind: z.literal("table"),
		columns: z.array(z.string()),
		rows: z.array(z.array(z.string())),
	}),
	/** Shown as text, never run. */
	BlockBase.extend({
		kind: z.literal("code_text"),
		language_label: z.string(),
		text: z.string(),
	}),
	BlockBase.extend({
		kind: z.literal("diagram"),
		notation: z.enum(["mermaid", "c4", "image"]),
		source: z.string().optional(),
		image_href: z.string().optional(),
		alt: z.string(),
	}),
	BlockBase.extend({
		kind: z.literal("schema"),
		name: z.string(),
		fields: z.array(
			z.object({
				name: z.string(),
				type: z.string(),
				required: z.boolean(),
				description: z.string(),
			}),
		),
		example: z.string(),
	}),
	BlockBase.extend({
		kind: z.literal("ticket_list"),
		tickets: z.array(
			z.object({
				key: z.string(),
				title: z.string(),
				status: z.string(),
				href: z.string().optional(),
				acceptance: z.array(z.string()),
			}),
		),
	}),
	BlockBase.extend({
		kind: z.literal("canvas"),
		grid_label: z.string(),
		cells: z.array(
			z.object({ row: z.string(), column: z.string(), text: z.string() }),
		),
	}),
	BlockBase.extend({
		kind: z.literal("review"),
		items: z.array(
			z.object({
				target: z.string(),
				verdict: z.string(),
				comment: z.string(),
			}),
		),
	}),
	BlockBase.extend({
		kind: z.literal("decision"),
		question: z.string(),
		options: z.array(z.string()),
		chosen: z.string().optional(),
		rationale: z.string().optional(),
		decided_by: z.string().optional(),
	}),
]);

/** A block kind this build does not know: the client shows `fallback_text` and never errors. */
export const UnknownBlockSchema = BlockBase.extend({
	kind: z.string(),
	fallback_text: z.string(),
});

export const BlockSchema = z.union([KnownBlockSchema, UnknownBlockSchema]);

/** True when this build knows how to draw the block; otherwise show its `fallback_text`. */
export function isKnownBlock(
	block: z.infer<typeof BlockSchema>,
): block is z.infer<typeof KnownBlockSchema> {
	return KnownBlockSchema.safeParse(block).success;
}

const PartySchema = z.object({
	kind: z.enum(["person", "agent"]),
	label: z.string(),
});

/** One stored version, exactly as saved (`GET /api/v1/artifacts/{id}`). */
export const ArtifactVersionSchema = z.object({
	artifact_id: id,
	version: z.number().int(),
	version_label: z.string(),
	/** Shown in the footer and matched on approval (ARCH-14). */
	content_hash: z.string(),
	type: z.string(),
	type_label: z.string(),
	title: z.string(),
	state: ArtifactStateSchema,
	state_label: z.string(),
	tone: ToneSchema,
	visibility: VisibilitySchema,
	owner: PartySchema,
	acceptor: PartySchema.nullable(),
	built_from: z.array(z.object({ id, label: z.string(), href: z.string() })),
	versions: z.array(
		z.object({
			version: z.number().int(),
			version_label: z.string(),
			saved_by: z.string(),
			saved_label: z.string(),
			state: ArtifactStateSchema,
			href: z.string(),
		}),
	),
	blocks: z.array(BlockSchema),
	/** False shows the "older version" bar and hides edit actions. */
	is_current: z.boolean(),
	share_options: z.array(ShareOptionSchema),
});

export const MapNodeSchema = z.object({
	id: z.string(),
	label: z.string(),
	sublabel: z.string().optional(),
	role: z.enum(["input", "self", "output"]),
	kind: z.enum(["evidence", "decision", "artifact", "ticket", "agent"]),
	state: z.string().optional(),
	tone: ToneSchema.optional(),
	href: z.string().optional(),
});

export const ArtifactMapSchema = z.object({
	nodes: z.array(MapNodeSchema),
	edges: z.array(
		z.object({ from: z.string(), to: z.string(), label: z.string() }),
	),
	layout_hint: z.literal("columns_by_role"),
});

export const StudioStateSchema = z.enum([
	"ready",
	"empty",
	"no_artifact_open",
	"older_version",
	"read_only",
]);

export const StudioViewSchema = z.object({
	schema_version: z.string().regex(/^1\./, "unsupported major version"),
	generated_at: z.string(),
	engagement: EngagementRefSchema,
	breadcrumbs: z.array(CrumbSchema),
	/** The server says which state applies; the client never infers it. */
	state: StudioStateSchema,
	open_artifact_id: id.nullable(),
	views: z.array(
		z.object({
			id: StudioViewIdSchema,
			label: z.string(),
			enabled: z.boolean(),
			disabled_reason: z.string().optional(),
			count: z.number().int().optional(),
		}),
	),
	active_view: StudioViewIdSchema,
	/** Shown beside the view tabs: agent and what is open. */
	context_label: z.string(),
	rail: z.object({
		pinned: z.array(
			z.object({
				collection_id: id,
				label: z.string(),
				count: z.number().int(),
			}),
		),
		sections: z.array(StudioSectionSchema),
		can_edit_layout: z.boolean(),
		create_types: z.array(z.object({ id: z.string(), label: z.string() })),
	}),
	outputs: z.array(StudioOutputSchema),
	/** Buttons beside the title, already filtered by role and state. */
	header_actions: z.array(ActionSchema),
	/** The Workbench canvas stream, scoped to the open artifact. */
	stream: StreamSchema.nullable(),
	built: ArtifactVersionSchema.nullable(),
	map: ArtifactMapSchema.nullable(),
	empty_state: z.object({ heading: z.string(), line: z.string() }).nullable(),
	uploads: z.object({
		accept: z.array(z.string()),
		max_bytes: z.number().int(),
	}),
});

/* ---- Workspace (`/field/main/w/{workspaceId}`) — FIELD-WORKSPACE.md §2 ---- */

export const WorkspaceSwitcherSchema = z.array(
	z.object({ id, name: z.string(), href: z.string(), current: z.boolean() }),
);

export const WorkspaceEngagementRowSchema = z.object({
	engagement_id: id,
	customer_label: z.string(),
	engagement_label: z.string(),
	/** The single next item; it leads the row (FLD-02). */
	next: z.object({
		title: z.string(),
		owner_label: z.string(),
		waiting_label: z.string(),
		waiting_tone: ToneSchema,
		open: ActionSchema,
	}),
	position_label: z.string(),
	outcome_label: z.string(),
	people: z.array(z.object({ label: z.string(), role_label: z.string() })),
	/** Sent only when blocked or drifting. */
	status: LabelToneSchema.extend({ why: z.string() }).optional(),
	updated_label: z.string(),
	open: ActionSchema,
});

export const WorkspaceViewSchema = z.object({
	schema_version: z.string().regex(/^1\./, "unsupported major version"),
	generated_at: z.string(),
	workspace: z.object({
		id,
		name: z.string(),
		kind: z.enum(["personal", "team"]),
		slack_label: z.string().nullable(),
	}),
	viewer: z.object({
		display_name: z.string(),
		initials: z.string(),
		role_label: z.string(),
	}),
	switcher: WorkspaceSwitcherSchema,
	breadcrumbs: z.array(CrumbSchema),
	actions: z.array(ActionSchema),
	filters: z.array(
		z.object({ id: z.string(), label: z.string(), selected: z.boolean() }),
	),
	engagements: z.object({
		items: z.array(WorkspaceEngagementRowSchema),
		next_cursor: z.string().nullable(),
	}),
	members: z.array(
		z.object({
			member_id: id,
			name: z.string(),
			initials: z.string(),
			role_label: z.string(),
		}),
	),
	empty_state: z.object({
		heading: z.string(),
		line: z.string(),
		create: ActionSchema.nullable(),
	}),
});

/* ---- Types ---- */

export type LensStatus = z.infer<typeof LensStatusSchema>;
export type ToneKey = z.infer<typeof ToneSchema>;
export type ArtifactState = z.infer<typeof ArtifactStateSchema>;
export type FieldActionLink = z.infer<typeof ActionSchema>;
export type Problem = z.infer<typeof ProblemSchema>;
export type CommandReply = z.infer<typeof CommandReplySchema>;
export type CommandRequest = z.infer<typeof CommandRequestSchema>;
export type ContinueItem = z.infer<typeof ContinueItemSchema>;
export type ActionRow = z.infer<typeof ActionRowSchema>;
export type EngagementCardView = z.infer<typeof EngagementCardSchema>;
export type MyFieldView = z.infer<typeof MyFieldViewSchema>;
export type StreamEntry = z.infer<typeof StreamEntrySchema>;
export type KnownEntry = z.infer<typeof KnownEntrySchema>;
export type DraftEntry = Extract<KnownEntry, { type: "draft" }>;
export type Stream = z.infer<typeof StreamSchema>;
export type WorkbenchAgent = z.infer<typeof WorkbenchAgentSchema>;
export type WorkbenchAgentGroup = z.infer<typeof WorkbenchAgentGroupSchema>;
export type WorkbenchArtifact = z.infer<typeof WorkbenchArtifactSchema>;
export type WorkbenchInventory = z.infer<typeof WorkbenchInventorySchema>;
export type WorkbenchView = z.infer<typeof WorkbenchViewSchema>;
export type StudioViewId = z.infer<typeof StudioViewIdSchema>;
export type RailItem = z.infer<typeof RailItemSchema>;
export type StudioCollection = z.infer<typeof StudioCollectionSchema>;
export type StudioSection = z.infer<typeof StudioSectionSchema>;
export type StudioOutput = z.infer<typeof StudioOutputSchema>;
export type ShareOption = z.infer<typeof ShareOptionSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type KnownBlock = z.infer<typeof KnownBlockSchema>;
export type ArtifactVersion = z.infer<typeof ArtifactVersionSchema>;
export type MapNode = z.infer<typeof MapNodeSchema>;
export type ArtifactMap = z.infer<typeof ArtifactMapSchema>;
export type StudioView = z.infer<typeof StudioViewSchema>;
export type WorkspaceSwitcher = z.infer<typeof WorkspaceSwitcherSchema>;
export type WorkspaceEngagementRow = z.infer<
	typeof WorkspaceEngagementRowSchema
>;
export type WorkspaceView = z.infer<typeof WorkspaceViewSchema>;
