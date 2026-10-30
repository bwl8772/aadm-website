import { z } from "astro/zod";

/**
 * Field read-model contracts. Schemas are the single source of the types:
 * every model is parsed here before a component sees it (RES-05). Values are
 * backend-owned (BACK-01, ARCH-15): the UI renders `waiting_label` / `late`
 * as given and never computes them. IDs are server-made UUIDs (IDN-06).
 */

const id = z.uuid();

export const LensStatusSchema = z.enum(["on_track", "in_progress", "needs_action", "needs_decision", "not_started"]);
export const ToneSchema = z.enum(["neutral", "warn", "ok", "danger", "info"]);

const LensSchema = z.object({ name: z.string(), status: LensStatusSchema, note: z.string().optional() });

/* ---- My Field (`/field/main`) ---- */

export const FieldActionSchema = z.object({
	action_id: id,
	label: z.string(),
	engagement: z.string(),
	specialist: z.string(),
	owner_kind: z.enum(["engineer", "customer"]),
	owner_name: z.string(),
	waiting_label: z.string(),
	late: z.boolean(),
	verb: z.string(),
});

export const FieldEngagementSchema = z.object({
	engagement_id: id,
	/** Workbench link from the backend; absent = not openable yet. */
	href: z.string().optional(),
	customer: z.string(),
	name: z.string(),
	status: z.object({ label: z.string(), tone: z.enum(["ok", "blocked"]) }).optional(),
	summary: z.string().optional(),
	detail: z
		.object({
			outcome: z.string(),
			delivery: z.string(),
			next_milestone: z.string(),
			waiting_on: z.string(),
			lenses: z.array(LensSchema),
			drift: z.string().optional(),
		})
		.optional(),
});

export const ContinueActionSchema = z.object({
	label: z.string(),
	engagement: z.string(),
	specialist: z.string(),
	blocks: z.string().optional(),
	verb: z.string(),
});

export const MyFieldModelSchema = z.object({
	continue_action: ContinueActionSchema.nullable(),
	actions: z.array(FieldActionSchema),
	counts: z.object({
		engagements: z.number().int(),
		open_actions: z.number().int(),
		waiting_on_me: z.number().int(),
		waiting_on_customer: z.number().int(),
		all: z.number().int(),
	}),
	engagements: z.array(FieldEngagementSchema),
});

/* ---- Engagement Workbench (`/field/main/e/{engagementId}`) ---- */

export const WorkbenchAgentGroupSchema = z.object({
	label: z.string(),
	agents: z.array(
		z.object({
			agent_id: z.string(),
			name: z.string(),
			status: z.object({ label: z.string(), tone: z.enum(["neutral", "warn"]) }).optional(),
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
		lenses: z.array(LensSchema.omit({ note: true })),
	}),
	agent_groups: z.array(WorkbenchAgentGroupSchema),
	active_agent_id: z.string(),
	active_agent_purpose: z.string(),
	canvas: z.object({
		prompt: z.object({ text: z.string(), attachments: z.array(z.string()) }).nullable(),
		draft: WorkbenchDraftSchema.nullable(),
	}),
	artifacts: z.array(WorkbenchArtifactSchema),
});

export type LensStatus = z.infer<typeof LensStatusSchema>;
export type ToneKey = z.infer<typeof ToneSchema>;
export type FieldAction = z.infer<typeof FieldActionSchema>;
export type FieldEngagement = z.infer<typeof FieldEngagementSchema>;
export type ContinueAction = z.infer<typeof ContinueActionSchema>;
export type MyFieldModel = z.infer<typeof MyFieldModelSchema>;
export type WorkbenchAgentGroup = z.infer<typeof WorkbenchAgentGroupSchema>;
export type WorkbenchArtifact = z.infer<typeof WorkbenchArtifactSchema>;
export type WorkbenchDraft = z.infer<typeof WorkbenchDraftSchema>;
export type WorkbenchQuestion = z.infer<typeof QuestionSchema>;
export type WorkbenchModel = z.infer<typeof WorkbenchModelSchema>;
