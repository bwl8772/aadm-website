import { z } from "astro/zod";

/**
 * Field read-model contracts. Schemas are the single source of the types:
 * every model is parsed before a component sees it (RES-05). Values are
 * backend-owned (BACK-01, ARCH-15): the UI renders labels, tones, order and
 * counts as given and never computes them. IDs are server-made UUIDs (IDN-06).
 * Screen contracts: docs/contracts/FIELD-*.md.
 */

const id = z.uuid();

/* ---- Shared value lists (docs/contracts/FIELD-MY-FIELD.md) ---- */

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

const LabelToneSchema = z.object({ label: z.string(), tone: ToneSchema });

/** One action shape for every control: a link (`navigate`) or an intent (`command`). */
export const ActionSchema = z
	.object({
		label: z.string(),
		kind: z.enum(["navigate", "command"]),
		href: z.string().optional(),
		command: z.string().optional(),
		target: z.string().optional(),
		enabled: z.boolean(),
		disabled_reason: z.string().optional(),
		emphasis: z.enum(["primary", "secondary"]),
	})
	.refine((a) => (a.kind === "navigate" ? !!a.href : !!a.command), {
		message: "navigate needs href; command needs command",
	});

const LensSchema = z.object({
	name: z.string(),
	status: LensStatusSchema,
	note: z.string().optional(),
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
	waiting_label: z.string(),
	waiting_tone: ToneSchema,
	cta: ActionSchema,
});

export const EngagementCardSchema = z.object({
	engagement_id: id,
	customer_label: z.string(),
	engagement_label: z.string(),
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

/* ---- Engagement Workbench (`/field/main/e/{engagementId}`) ---- */

export const WorkbenchAgentGroupSchema = z.object({
	label: z.string(),
	agents: z.array(
		z.object({
			agent_id: z.string(),
			href: z.string().optional(),
			name: z.string(),
			status: z
				.object({ label: z.string(), tone: z.enum(["neutral", "warning"]) })
				.optional(),
		}),
	),
});

export const WorkbenchArtifactSchema = z.object({
	artifact_id: id,
	title: z.string(),
	version_label: z.string(),
	state: z.object({ label: z.string(), tone: ToneSchema }),
	meta: z.string(),
	visibility: z.enum(["internal", "customer"]),
	/** Studio link from the backend; absent = not openable yet. */
	href: z.string().optional(),
});

const StateSchema = z.object({ label: z.string(), tone: ToneSchema });

/** "Lay of the land": inventories of what the customer has today. */
export const WorkbenchInventorySchema = z.object({
	inventory_id: id,
	title: z.string(),
	state: StateSchema,
	summary: z.string(),
	agent_name: z.string(),
	action: z.object({ label: z.string(), primary: z.boolean() }),
	highlighted: z.boolean(),
});

const QuestionSchema = z.object({ text: z.string(), verb: z.string() });

export const WorkbenchDraftSchema = z.object({
	title: z.string(),
	source_label: z.string(),
	saved: z.boolean(),
	findings: z.array(z.string()),
	assumptions: z.array(z.string()),
	questions: z.array(QuestionSchema),
	decisions: z.array(QuestionSchema),
	save_label: z.string(),
});

export const WorkbenchModelSchema = z.object({
	engagement_id: id,
	customer: z.string(),
	name: z.string(),
	context: z.object({
		outcome: z.string(),
		delivery: z.string(),
		next_milestone: z.string(),
		waiting_on: z.string(),
		blockers: z.number().int(),
		lenses: z.array(
			LensSchema.omit({ note: true }).extend({ tone: ToneSchema }),
		),
	}),
	agent_groups: z.array(WorkbenchAgentGroupSchema),
	active_agent_id: z.string(),
	active_agent_purpose: z.string(),
	canvas: z.object({
		prompt: z
			.object({ text: z.string(), attachments: z.array(z.string()) })
			.nullable(),
		draft: WorkbenchDraftSchema.nullable(),
	}),
	artifacts: z.array(WorkbenchArtifactSchema),
	inventories: z.array(WorkbenchInventorySchema),
});

/* ---- Artifact Studio (`/field/main/e/{engagementId}?artifact={artifactId}`) ---- */

/** Item state as the backend words it; the UI maps it to a dot color. */
const ItemStatusSchema = z.enum(["draft", "review", "approved"]);

export const StudioCollectionSchema = z.object({
	collection_id: id,
	label: z.string(),
	count: z.number().int(),
	pinned: z.boolean(),
	expanded: z.boolean(),
	items: z.array(
		z.object({
			item_id: id,
			label: z.string(),
			status: ItemStatusSchema,
			/** The artifact open in this Studio. */
			current: z.boolean(),
		}),
	),
});

export const StudioSectionSchema = z.object({
	section_id: id,
	label: z.string(),
	count: z.number().int(),
	expanded: z.boolean(),
	collections: z.array(StudioCollectionSchema),
});

const StudioEventSchema = z.discriminatedUnion("kind", [
	z.object({
		kind: z.literal("prompt"),
		text: z.string(),
		attachments: z.array(z.string()),
	}),
	z.object({ kind: z.literal("note"), text: z.string() }),
	z.object({ kind: z.literal("thinking"), text: z.string() }),
	z.object({
		kind: z.literal("tool_calls"),
		calls: z.array(
			z.object({ tool: z.string(), detail: z.string(), ok: z.boolean() }),
		),
	}),
	z.object({ kind: z.literal("message"), text: z.string() }),
	/** Opens the Built tab. */
	z.object({
		kind: z.literal("built"),
		title: z.string(),
		summary: z.string(),
		action_label: z.string(),
	}),
]);

const MapNodeSchema = z.object({ label: z.string(), note: z.string() });

export const StudioBuiltSchema = z.object({
	tags: z.array(z.object({ label: z.string(), tone: ToneSchema })),
	meta: z.string(),
	sections: z.array(
		z.object({ heading: z.string(), lines: z.array(z.string()) }),
	),
	/** Share destinations, in groups; a note like "Needs approval" comes from the backend. */
	share: z.array(
		z.array(z.object({ label: z.string(), note: z.string().optional() })),
	),
});

export const StudioMapSchema = z.object({
	intro: z.string(),
	built_from: z.array(MapNodeSchema),
	self: MapNodeSchema,
	produces: z.array(MapNodeSchema),
});

export const StudioOutputSchema = z.object({
	artifact_id: id,
	title: z.string(),
	version_label: z.string(),
	state: StateSchema,
	meta: z.string(),
	/** The artifact open in this Studio; clicking it shows Built. */
	active: z.boolean(),
});

export const StudioModelSchema = z.object({
	engagement_id: id,
	artifact_id: id,
	customer: z.string(),
	name: z.string(),
	pinned: z.array(
		z.object({ collection_id: id, label: z.string(), count: z.number().int() }),
	),
	sections: z.array(StudioSectionSchema),
	connected: z.array(z.string()),
	tabs: z.object({ stream: z.string(), built: z.string(), map: z.string() }),
	context_label: z.string(),
	agent_name: z.string(),
	stream: z.array(StudioEventSchema),
	built: StudioBuiltSchema,
	map: StudioMapSchema,
	outputs: z.array(StudioOutputSchema),
});

export type LensStatus = z.infer<typeof LensStatusSchema>;
export type ToneKey = z.infer<typeof ToneSchema>;
export type FieldActionLink = z.infer<typeof ActionSchema>;
export type ContinueItem = z.infer<typeof ContinueItemSchema>;
export type ActionRow = z.infer<typeof ActionRowSchema>;
export type EngagementCardView = z.infer<typeof EngagementCardSchema>;
export type MyFieldView = z.infer<typeof MyFieldViewSchema>;
export type WorkbenchAgentGroup = z.infer<typeof WorkbenchAgentGroupSchema>;
export type WorkbenchArtifact = z.infer<typeof WorkbenchArtifactSchema>;
export type WorkbenchDraft = z.infer<typeof WorkbenchDraftSchema>;
export type WorkbenchQuestion = z.infer<typeof QuestionSchema>;
export type WorkbenchModel = z.infer<typeof WorkbenchModelSchema>;
export type WorkbenchInventory = z.infer<typeof WorkbenchInventorySchema>;
export type StudioCollection = z.infer<typeof StudioCollectionSchema>;
export type StudioSection = z.infer<typeof StudioSectionSchema>;
export type StudioBuilt = z.infer<typeof StudioBuiltSchema>;
export type StudioMap = z.infer<typeof StudioMapSchema>;
export type StudioEvent = z.infer<typeof StudioEventSchema>;
export type StudioOutput = z.infer<typeof StudioOutputSchema>;
export type StudioModel = z.infer<typeof StudioModelSchema>;
