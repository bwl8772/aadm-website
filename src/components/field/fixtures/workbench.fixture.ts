/**
 * EXAMPLE DATA ONLY — the "2 · Engagement Workbench" mock. Nothing else imports
 * this file except `src/pages/field/main/e/[engagementId].astro`, behind
 * PUBLIC_FIELD_FIXTURES=1. To strip examples: delete this file and that one import.
 */
import type { WorkbenchModel } from "../field-types";

const acmeIntake: WorkbenchModel = {
	engagement_id: "6f278bf1-408e-5452-a2bc-0ea4bf42c816",
	customer: "Acme Health",
	name: "Intake modernization",
	context: {
		outcome: "Intake time [baseline] → [target]",
		delivery: "3 of 5 slices",
		next_milestone: "Batch 4 review",
		waiting_on: "Customer · Cornerstone v2",
		blockers: 1,
		lenses: [
			{ name: "Strategy", status: "on_track" },
			{ name: "Plan", status: "in_progress" },
			{ name: "Readiness", status: "needs_action" },
			{ name: "Adopt", status: "not_started" },
			{ name: "Governance", status: "needs_decision" },
		],
	},
	agent_groups: [
		{
			label: "Discovery",
			agents: [
				{ agent_id: "business-discovery", name: "Business Discovery", status: { label: "Drafting brief v0.3", tone: "neutral" } },
				{ agent_id: "technical-discovery", name: "Technical Discovery", status: { label: "2 open questions", tone: "neutral" } },
			],
		},
		{
			label: "Outcomes",
			agents: [{ agent_id: "outcome-architect", name: "Outcome Architect", status: { label: "v1.2 awaiting approval", tone: "warn" } }],
		},
		{
			label: "Architecture",
			agents: [
				{ agent_id: "solution-architect", name: "Solution Architect" },
				{ agent_id: "cornerstone", name: "Cornerstone", status: { label: "v2 awaiting customer sign-off", tone: "warn" } },
			],
		},
		{
			label: "Delivery",
			agents: [
				{ agent_id: "delivery-planner", name: "Delivery Planner" },
				{ agent_id: "evidence-reviewer", name: "Evidence Reviewer", status: { label: "Slice 3 report ready", tone: "neutral" } },
			],
		},
		{
			label: "Adoption and learning",
			agents: [
				{ agent_id: "adoption-lead", name: "Adoption Lead" },
				{ agent_id: "field-learnings", name: "Field Learnings", status: { label: "1 pattern to log", tone: "neutral" } },
			],
		},
	],
	active_agent_id: "business-discovery",
	active_agent_purpose: "Define the customer workflow, identify unresolved questions, and build the discovery brief.",
	canvas: {
		prompt: {
			text: "Turn the intake workshop notes into a discovery brief. Flag anything we still need from the customer.",
			attachments: ["Intake workshop notes.docx"],
		},
		draft: {
			title: "Draft · Discovery brief",
			source_label: "From 1 source",
			saved: false,
			findings: [
				"Requests arrive by fax, portal and phone; staff re-key each one into the EHR.",
				"Referral completeness is checked by hand before scheduling.",
			],
			assumptions: ["Portal volume will grow after the patient app launch."],
			questions: [
				{ text: "Who owns the referral completeness rules today?", verb: "Ask customer" },
				{ text: "Can the EHR accept writes by API, or only feeds?", verb: "Ask customer" },
			],
			decisions: [{ text: "Pilot scope: one clinic or all three?", verb: "Decide" }],
			save_label: "Save as Discovery brief v0.3",
		},
	},
	artifacts: [
		{ artifact_id: "880dbcae-67be-5c0b-b472-3ad2c164ffc5", title: "Discovery brief", version_label: "v0.2", state: { label: "Review", tone: "info" }, meta: "Business Discovery · You", visibility: "internal" },
		{ artifact_id: "bd6c5eb9-1af5-53fb-8889-f6900dfe73b8", title: "Outcome definition", version_label: "v1.2", state: { label: "Review", tone: "info" }, meta: "Outcome Architect · You", visibility: "internal" },
		{ artifact_id: "a661410c-4b80-552f-956d-82e86fd82d29", title: "Cornerstone", version_label: "v1", state: { label: "Signed", tone: "ok" }, meta: "Customer-visible", visibility: "customer" },
		{ artifact_id: "4afa4d73-6329-5186-b56a-ea1192689687", title: "Delivery plan", version_label: "v3", state: { label: "Approved", tone: "ok" }, meta: "Delivery Planner", visibility: "customer" },
		{ artifact_id: "13cb8cc5-30f8-5246-9685-97165c2a43c0", title: "Acceptance evidence · Slice 3", version_label: "v0.4", state: { label: "Needs decision", tone: "warn" }, meta: "Internal", visibility: "internal" },
		{ artifact_id: "fdeda0f9-044f-510d-aa40-4fa67521999d", title: "Adoption pack", version_label: "v0.1", state: { label: "Draft", tone: "neutral" }, meta: "Adoption Lead", visibility: "internal" },
		{ artifact_id: "12786622-b425-5fb4-bae2-7ee8f82d52d1", title: "Field learnings", version_label: "4 entries", state: { label: "Internal", tone: "neutral" }, meta: "Routed to platform team", visibility: "internal" },
	],
};

export const workbenchFixtures: Record<string, WorkbenchModel> = { [acmeIntake.engagement_id]: acmeIntake };
