/**
 * FDE artifact register: every artifact type a forward-deployed engineer
 * produces or signs in an engagement, with the zod schema for its stored
 * body. One entry per type; the type id is the `type` on an ArtifactVersion
 * and the `create_types[].id` the Studio offers.
 *
 * Sources, in order of authority:
 *  - `aadm://doctrine/fde-engagement` (aadm-mcp): the five recon artifacts
 *    that must exist before any code change and before attestation.
 *  - docs/PRD-aadm-delivery-maps.md §A3: the versioned nouns.
 *  - docs/FIELD-CONTRACTS.md §9: the Field artifact `type` list.
 *  - The Studio and Workbench mocks: types with no noun yet (`source: "mock"`).
 *
 * The body is what a verb writes and what checks read. The Studio renders a
 * version as `blocks` (field-types.ts); `blocks_require` says which block
 * kinds a rendered version of this type must carry. Progress per type is
 * tracked in docs/contracts/FIELD-ARTIFACTS.md; the contract test keeps the
 * two lists equal.
 */
import { z } from "astro/zod";
import { BlockSchema } from "./field-types";

const unverified = z.literal("unverified");
const yesNoUnverified = z.enum(["yes", "no", "unverified"]);
const person = z.object({
	name: z.string(),
	role_label: z.string().optional(),
});
/** A named person or `unassigned`; never a blank (doctrine: unassigned keeps the gate open). */
const acceptor = z.union([person, z.literal("unassigned")]);

/** Where in the engagement the artifact is produced (doctrine: five stages). */
export const FdeStageSchema = z.enum([
	"decidability",
	"contract",
	"fenced_build",
	"calibration",
	"transfer",
]);

/** The concurrent lens the artifact mostly serves (FIELD-CONTRACTS.md §3). */
export const FdeLensSchema = z.enum([
	"strategy",
	"plan",
	"readiness",
	"adopt",
	"governance",
]);

/** Named acceptor roles (doctrine acceptor map) plus the Field product roles. */
export const AcceptorRoleSchema = z.enum([
	"sponsor",
	"eval_owner",
	"operator",
	"internal_successor",
	"security",
	"engineer",
	"customer",
]);

/** The Decision kind that freezes a version of this type (PRD §A3: never a flag). */
export const DecisionKindSchema = z.enum(["approve", "sign", "go", "confirm"]);

export const FdeArtifactTypeSchema = z.enum([
	// doctrine: the five recon artifacts
	"engagement_contract",
	"acceptor_map",
	"gate_register",
	"transfer_package",
	"engagement_verdict",
	// FIELD-CONTRACTS.md §9 and PRD nouns
	"use_case",
	"discovery_brief",
	"technical_assessment",
	"outcome_definition",
	"architecture_decision",
	"cornerstone",
	"delivery_plan",
	"coder_prompt",
	"coder_report",
	"acceptance_evidence",
	"adoption_package",
	"map",
	// mocks only: no noun yet
	"speed_layer_canvas",
	"api_payload_spec",
	"jira_tickets",
]);
export type FdeArtifactType = z.infer<typeof FdeArtifactTypeSchema>;

// ---------------------------------------------------------------------------
// Bodies
// ---------------------------------------------------------------------------

/** Doctrine artifact 1. */
export const EngagementContractBodySchema = z.object({
	problem: z.string().min(1),
	scope_in: z.string().min(1),
	scope_out: z.string().min(1),
	duration: z.union([z.string().min(1), z.literal("unspecified")]),
	outcome: z.string().min(1),
	baseline: z.union([z.string().min(1), unverified]),
	target: z.union([z.string().min(1), unverified]),
	value_demonstrable: yesNoUnverified,
	stop_conditions: z.array(z.string().min(1)).min(1),
	exit_criteria: z.array(z.string().min(1)).min(1),
});

/** Doctrine artifact 2. */
export const AcceptorMapBodySchema = z.object({
	sponsor: acceptor,
	eval_owner: acceptor,
	operator: acceptor,
	internal_successor: acceptor,
	security: acceptor,
});

/** Doctrine artifact 3. */
export const GateRegisterBodySchema = z.object({
	gates: z.array(
		z.object({
			gate: z.string().min(1),
			status: z.enum(["open", "satisfied", "not_applicable", "stop"]),
			/** A path, a test, or `none`. */
			evidence: z.string().min(1),
			acceptor,
			note: z.string().optional(),
		}),
	),
});

/** Doctrine artifact 4. */
export const TransferPackageBodySchema = z.object({
	items: z.array(
		z.object({
			item: z.enum([
				"production_system",
				"evaluation_framework",
				"runbook",
				"productization_note",
				"residual_work",
			]),
			location: z.string().min(1),
			owner: acceptor,
			runnable_without_fde: yesNoUnverified.optional(),
			note: z.string().optional(),
		}),
	),
});

/** Doctrine artifact 5. The server never scores; a claim without evidence is `unverified`. */
export const EngagementVerdictBodySchema = z.object({
	engagement_posture: z.enum(["decidable", "proceed", "hold", "stop"]),
	residual_dependency_window: z.union([
		z.object({ duration: z.string().min(1), basis: z.string().min(1) }),
		z.literal("UNBOUNDED"),
	]),
	ownership_transferred: z.enum(["yes", "no", "partial", "unverified"]),
	productization_disposition: z.enum([
		"generalized",
		"local_only",
		"unverified",
		"not_applicable",
	]),
	reasons: z.array(z.string()),
});

/** PRD §13o use case record (`UC-<n>`), approved by the customer decision owner. */
export const UseCaseBodySchema = z.object({
	uc_id: z.string().regex(/^UC-\d+$/),
	title: z.string().min(1),
	problem: z.string().min(1),
	outcome_ref: z.string().optional(),
	readiness: z.array(
		z.object({
			check: z.string(),
			status: z.enum(["pass", "fail", "unverified"]),
		}),
	),
	acceptance_criteria: z.array(z.string().min(1)),
	pilot_shape: z.string().optional(),
});

/** FIELD-CONTRACTS.md §2 outcome (P0); PRD noun Vision. */
export const OutcomeDefinitionBodySchema = z.object({
	problem: z.string().min(1),
	outcome: z.string().min(1),
	baseline: z.object({
		text: z.string(),
		number: z.number().optional(),
		unit: z.string().optional(),
	}),
	target: z.object({
		text: z.string(),
		number: z.number().optional(),
		unit: z.string().optional(),
	}),
	value_demonstrable: yesNoUnverified,
	stop_conditions: z.array(z.string().min(1)),
	eval_owner: acceptor,
	measures: z.array(z.string()),
	open_questions: z.array(z.string()),
});

const requirementItem = z.object({
	id: z.string().regex(/^(REQ|AC|INV|THR|C|HC)-\d+$/),
	kind: z.enum([
		"requirement",
		"acceptance",
		"invariant",
		"threshold",
		"host_contract",
	]),
	text: z.string().min(1),
});

/** PRD noun Requirements ("Cornerstone" stays as the alias). */
export const CornerstoneBodySchema = z.object({
	items: z.array(requirementItem).min(1),
	fixtures: z.array(z.object({ id: z.string(), description: z.string() })),
	known_gaps: z.array(z.string()),
	delivery_mode: z.enum(["greenfield", "plug_in", "unspecified"]),
});

/** PRD noun Roadmap with Stages, Batches, Slices. */
export const DeliveryPlanBodySchema = z.object({
	roadmap_name: z.string().min(1),
	requirements_versions: z.array(
		z.object({ artifact_id: z.string(), version: z.number().int() }),
	),
	stages: z.array(
		z.object({
			name: z.string().min(1),
			order: z.number().int(),
			batches: z.array(
				z.object({
					name: z.string().min(1),
					why: z.string(),
					stop_point: z.string(),
					slices: z
						.array(
							z.object({
								slice_id: z.string(),
								does: z.string().min(1),
								done_check: z.string().min(1),
								serves: z.array(z.string()),
								status: z.enum([
									"todo",
									"in_progress",
									"reported",
									"done",
									"drift",
								]),
							}),
						)
						.min(2)
						.max(4),
				}),
			),
		}),
	),
	you_are_here: z.string().optional(),
});

/** PRD noun Prompt: the exact text a coder gets for one slice. */
export const CoderPromptBodySchema = z.object({
	slice_id: z.string(),
	repo: z.string().min(1),
	commit_read: z.string().min(1),
	body: z.string().min(1),
	confirm_first_facts: z.array(z.string()),
	keep_list: z.array(z.string()),
	required_evidence: z.array(z.string()).min(1),
	lint_result: z.enum(["clean", "warning", "blocking"]),
});

/** PRD noun Run: one coder's attempt at one prompt, as reported back. Write-once. */
export const CoderReportBodySchema = z.object({
	prompt_version: z.number().int(),
	report_text: z.string().min(1),
	commit: z.string().min(1),
	files_changed: z.array(z.string()),
	tests_run: z.array(
		z.object({
			name: z.string(),
			passed: z.number().int(),
			failed: z.number().int(),
		}),
	),
	posted_by: z.enum(["coder_mcp", "person_slack", "person_web"]),
});

/** PRD nouns Evidence and Verdict for one Run; the confirming Decision is a person's. */
export const AcceptanceEvidenceBodySchema = z.object({
	run_id: z.string(),
	evidence: z
		.array(
			z.object({
				kind: z.enum([
					"commit",
					"test_result",
					"predone_review",
					"tool_receipt",
					"fixture_result",
				]),
				value: z.string().min(1),
				source: z.string().min(1),
			}),
		)
		.min(1),
	suggested_verdict: z.enum(["ON_PLAN", "DRIFT"]),
	reasons: z.array(z.string()),
	fix_list: z.array(z.string()),
});

/** PRD noun Map: the drawn roadmap at one moment. */
export const MapBodySchema = z.object({
	roadmap_version: z.number().int(),
	image_href: z.string().min(1),
	you_are_here: z.string().optional(),
});

/** Types whose stored body is only their rendered blocks (no noun or contract fields yet). */
export const BlocksBodySchema = z.object({
	blocks: z.array(BlockSchema).min(1),
});

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------

export const FdeArtifactEntrySchema = z.object({
	type: FdeArtifactTypeSchema,
	label: z.string(),
	/** Which document defines it. */
	source: z.enum(["doctrine", "prd", "contracts", "mock"]),
	/** The PRD §A3 noun it is a version of, or null when the PRD has none yet. */
	prd_noun: z.string().nullable(),
	stage: FdeStageSchema,
	lens: FdeLensSchema,
	/** The specialist that drafts it; null when a person or an external coder does. */
	producer_agent_id: z.string().nullable(),
	/** Who accepts it; null when nothing freezes it. */
	acceptor_role: AcceptorRoleSchema.nullable(),
	decision: DecisionKindSchema.nullable(),
	default_visibility: z.enum(["internal", "customer_visible"]),
	/** Block kinds a rendered version must carry (checked against fixtures). */
	blocks_require: z.array(z.string()),
});
export type FdeArtifactEntry = z.infer<typeof FdeArtifactEntrySchema> & {
	body: z.ZodTypeAny;
};

const entry = (e: FdeArtifactEntry): FdeArtifactEntry => e;

export const FDE_ARTIFACTS: readonly FdeArtifactEntry[] = [
	entry({
		type: "engagement_contract",
		label: "Engagement contract",
		source: "doctrine",
		prd_noun: "Vision + Engagement",
		stage: "contract",
		lens: "strategy",
		producer_agent_id: "outcome-architect",
		acceptor_role: "eval_owner",
		decision: "sign",
		default_visibility: "customer_visible",
		blocks_require: ["heading", "paragraph"],
		body: EngagementContractBodySchema,
	}),
	entry({
		type: "acceptor_map",
		label: "Acceptor map",
		source: "doctrine",
		prd_noun: null,
		stage: "contract",
		lens: "governance",
		producer_agent_id: "business-discovery",
		acceptor_role: "sponsor",
		decision: "sign",
		default_visibility: "customer_visible",
		blocks_require: ["table"],
		body: AcceptorMapBodySchema,
	}),
	entry({
		type: "gate_register",
		label: "Gate register",
		source: "doctrine",
		prd_noun: null,
		stage: "decidability",
		lens: "governance",
		producer_agent_id: "evidence-reviewer",
		acceptor_role: null,
		decision: null,
		default_visibility: "internal",
		blocks_require: ["table"],
		body: GateRegisterBodySchema,
	}),
	entry({
		type: "transfer_package",
		label: "Transfer package",
		source: "doctrine",
		prd_noun: null,
		stage: "transfer",
		lens: "adopt",
		producer_agent_id: "adoption-lead",
		acceptor_role: "internal_successor",
		decision: "sign",
		default_visibility: "customer_visible",
		blocks_require: ["table"],
		body: TransferPackageBodySchema,
	}),
	entry({
		type: "engagement_verdict",
		label: "Engagement verdict",
		source: "doctrine",
		prd_noun: null,
		stage: "transfer",
		lens: "governance",
		producer_agent_id: "evidence-reviewer",
		acceptor_role: "eval_owner",
		decision: "confirm",
		default_visibility: "customer_visible",
		blocks_require: ["decision"],
		body: EngagementVerdictBodySchema,
	}),
	entry({
		type: "use_case",
		label: "Use case",
		source: "prd",
		prd_noun: "Idea → Vision (§13o UC-n)",
		stage: "decidability",
		lens: "strategy",
		producer_agent_id: "business-discovery",
		acceptor_role: "sponsor",
		decision: "sign",
		default_visibility: "customer_visible",
		blocks_require: ["heading", "paragraph", "list"],
		body: UseCaseBodySchema,
	}),
	entry({
		type: "discovery_brief",
		label: "Discovery brief",
		source: "contracts",
		prd_noun: "Idea",
		stage: "decidability",
		lens: "strategy",
		producer_agent_id: "business-discovery",
		acceptor_role: "engineer",
		decision: "approve",
		default_visibility: "internal",
		blocks_require: ["heading", "list"],
		body: BlocksBodySchema,
	}),
	entry({
		type: "technical_assessment",
		label: "Technical assessment",
		source: "contracts",
		prd_noun: null,
		stage: "decidability",
		lens: "readiness",
		producer_agent_id: "technical-discovery",
		acceptor_role: "engineer",
		decision: "approve",
		default_visibility: "internal",
		blocks_require: ["table"],
		body: BlocksBodySchema,
	}),
	entry({
		type: "outcome_definition",
		label: "Outcome definition",
		source: "contracts",
		prd_noun: "Vision",
		stage: "contract",
		lens: "strategy",
		producer_agent_id: "outcome-architect",
		acceptor_role: "eval_owner",
		decision: "sign",
		default_visibility: "customer_visible",
		blocks_require: ["heading", "paragraph"],
		body: OutcomeDefinitionBodySchema,
	}),
	entry({
		type: "architecture_decision",
		label: "Architecture decision",
		source: "contracts",
		prd_noun: null,
		stage: "contract",
		lens: "plan",
		producer_agent_id: "solution-architect",
		acceptor_role: "engineer",
		decision: "approve",
		default_visibility: "internal",
		blocks_require: ["diagram", "decision"],
		body: BlocksBodySchema,
	}),
	entry({
		type: "cornerstone",
		label: "Cornerstone (requirements)",
		source: "contracts",
		prd_noun: "Requirements",
		stage: "contract",
		lens: "plan",
		producer_agent_id: "cornerstone",
		acceptor_role: "sponsor",
		decision: "sign",
		default_visibility: "customer_visible",
		blocks_require: ["heading", "list"],
		body: CornerstoneBodySchema,
	}),
	entry({
		type: "delivery_plan",
		label: "Delivery plan",
		source: "contracts",
		prd_noun: "Roadmap (Stages, Batches, Slices)",
		stage: "fenced_build",
		lens: "plan",
		producer_agent_id: "delivery-planner",
		acceptor_role: "engineer",
		decision: "approve",
		default_visibility: "internal",
		blocks_require: ["heading", "table"],
		body: DeliveryPlanBodySchema,
	}),
	entry({
		type: "coder_prompt",
		label: "Coder prompt",
		source: "prd",
		prd_noun: "Prompt",
		stage: "fenced_build",
		lens: "plan",
		producer_agent_id: "delivery-planner",
		acceptor_role: "engineer",
		decision: "go",
		default_visibility: "internal",
		blocks_require: ["heading", "ticket_list", "code_text"],
		body: CoderPromptBodySchema,
	}),
	entry({
		type: "coder_report",
		label: "Coder report",
		source: "prd",
		prd_noun: "Run",
		stage: "fenced_build",
		lens: "plan",
		producer_agent_id: null,
		acceptor_role: null,
		decision: null,
		default_visibility: "internal",
		blocks_require: ["code_text"],
		body: CoderReportBodySchema,
	}),
	entry({
		type: "acceptance_evidence",
		label: "Acceptance evidence",
		source: "contracts",
		prd_noun: "Evidence + Verdict",
		stage: "calibration",
		lens: "plan",
		producer_agent_id: "evidence-reviewer",
		acceptor_role: "eval_owner",
		decision: "confirm",
		default_visibility: "internal",
		blocks_require: ["review", "decision"],
		body: AcceptanceEvidenceBodySchema,
	}),
	entry({
		type: "adoption_package",
		label: "Adoption package",
		source: "contracts",
		prd_noun: null,
		stage: "transfer",
		lens: "adopt",
		producer_agent_id: "adoption-lead",
		acceptor_role: "operator",
		decision: "approve",
		default_visibility: "customer_visible",
		blocks_require: ["heading", "list"],
		body: BlocksBodySchema,
	}),
	entry({
		type: "map",
		label: "Delivery map",
		source: "prd",
		prd_noun: "Map",
		stage: "fenced_build",
		lens: "plan",
		producer_agent_id: null,
		acceptor_role: null,
		decision: null,
		default_visibility: "internal",
		blocks_require: ["diagram"],
		body: MapBodySchema,
	}),
	entry({
		type: "speed_layer_canvas",
		label: "Speed Layer canvas",
		source: "mock",
		prd_noun: null,
		stage: "decidability",
		lens: "strategy",
		producer_agent_id: "business-discovery",
		acceptor_role: "engineer",
		decision: "approve",
		default_visibility: "internal",
		blocks_require: ["canvas"],
		body: BlocksBodySchema,
	}),
	entry({
		type: "api_payload_spec",
		label: "API payload spec",
		source: "mock",
		prd_noun: "Requirements (attachment)",
		stage: "contract",
		lens: "plan",
		producer_agent_id: "solution-architect",
		acceptor_role: "engineer",
		decision: "approve",
		default_visibility: "internal",
		blocks_require: ["schema"],
		body: BlocksBodySchema,
	}),
	entry({
		type: "jira_tickets",
		label: "Jira tickets",
		source: "mock",
		prd_noun: null,
		stage: "fenced_build",
		lens: "plan",
		producer_agent_id: "delivery-planner",
		acceptor_role: null,
		decision: null,
		default_visibility: "internal",
		blocks_require: ["ticket_list"],
		body: BlocksBodySchema,
	}),
];

export const FDE_ARTIFACT_BY_TYPE: Readonly<
	Record<FdeArtifactType, FdeArtifactEntry>
> = Object.fromEntries(FDE_ARTIFACTS.map((e) => [e.type, e])) as Record<
	FdeArtifactType,
	FdeArtifactEntry
>;

/** Parse a stored body for one type; unknown types are a contract error, not a guess. */
export function parseArtifactBody(type: string, body: unknown) {
	const t = FdeArtifactTypeSchema.safeParse(type);
	if (!t.success)
		return { success: false as const, error: `unknown artifact type ${type}` };
	const r = FDE_ARTIFACT_BY_TYPE[t.data].body.safeParse(body);
	return r.success
		? { success: true as const, data: r.data }
		: { success: false as const, error: r.error };
}
