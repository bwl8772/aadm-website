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
			{ name: "Strategy", status: "on_track", tone: "neutral" },
			{ name: "Plan", status: "in_progress", tone: "neutral" },
			{ name: "Readiness", status: "needs_action", tone: "warning" },
			{ name: "Adopt", status: "not_started", tone: "neutral" },
			{ name: "Governance", status: "needs_decision", tone: "warning" },
		],
	},
	agent_groups: [
		{
			label: "Discovery",
			agents: [
				{
					agent_id: "business-discovery",
					name: "Business Discovery",
					status: { label: "Drafting brief v0.3", tone: "neutral" },
				},
				{
					agent_id: "technical-discovery",
					name: "Technical Discovery",
					status: { label: "2 open questions", tone: "neutral" },
				},
			],
		},
		{
			label: "Outcomes",
			agents: [
				{
					agent_id: "outcome-architect",
					name: "Outcome Architect",
					status: { label: "v1.2 awaiting approval", tone: "warning" },
				},
			],
		},
		{
			label: "Architecture",
			agents: [
				{ agent_id: "solution-architect", name: "Solution Architect" },
				{
					agent_id: "cornerstone",
					name: "Cornerstone",
					status: { label: "v2 awaiting customer sign-off", tone: "warning" },
				},
			],
		},
		{
			label: "Delivery",
			agents: [
				{ agent_id: "delivery-planner", name: "Delivery Planner" },
				{
					agent_id: "evidence-reviewer",
					href: "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
					name: "Evidence Reviewer",
					status: { label: "Slice 3 report ready", tone: "neutral" },
				},
			],
		},
		{
			label: "Adoption and learning",
			agents: [
				{ agent_id: "adoption-lead", name: "Adoption Lead" },
				{
					agent_id: "field-learnings",
					name: "Field Learnings",
					status: { label: "1 pattern to log", tone: "neutral" },
				},
			],
		},
	],
	active_agent_id: "business-discovery",
	active_agent_purpose:
		"Define the customer workflow, identify unresolved questions, and build the discovery brief.",
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
				{
					text: "Who owns the referral completeness rules today?",
					verb: "Ask customer",
				},
				{
					text: "Can the EHR accept writes by API, or only feeds?",
					verb: "Ask customer",
				},
			],
			decisions: [
				{ text: "Pilot scope: one clinic or all three?", verb: "Decide" },
			],
			save_label: "Save as Discovery brief v0.3",
		},
	},
	artifacts: [
		{
			artifact_id: "917094f9-3a6f-5f45-a010-2144fab5d252",
			title: "Discovery brief",
			version_label: "v0.2",
			state: {
				label: "Review",
				tone: "info",
			},
			meta: "Business Discovery · You",
			visibility: "internal",
			href: "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
		},
		{
			artifact_id: "7de67668-bfc1-5534-aa14-1a8d8dff17b8",
			title: "Recommendation · validate in intake",
			version_label: "v1",
			state: {
				label: "Approved",
				tone: "success",
			},
			meta: "Solution Architect",
			visibility: "customer",
			href: "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
		},
		{
			artifact_id: "247ac460-daf8-552d-927e-9fbf695c6925",
			title: "Architecture · intake flow",
			version_label: "v2",
			state: {
				label: "Review",
				tone: "info",
			},
			meta: "Diagram · Solution Architect",
			visibility: "internal",
			href: "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
		},
		{
			artifact_id: "6f97fa98-a66c-5e54-ae84-83fbc87111a7",
			title: "Jira tickets · batch 4",
			version_label: "12",
			state: {
				label: "Synced to Jira",
				tone: "neutral",
			},
			meta: "Delivery Planner",
			visibility: "internal",
			href: "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
		},
		{
			artifact_id: "cdbac60c-efb7-529f-913a-98cc85321084",
			title: "Coder prompt · Slice 4",
			version_label: "v0.2",
			state: {
				label: "Draft",
				tone: "neutral",
			},
			meta: "For Claude Code",
			visibility: "internal",
			href: "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
		},
		{
			artifact_id: "94e3d236-50f7-5899-bc5b-f63540c28f6a",
			title: "Process doc · flagged referrals",
			version_label: "v0.1",
			state: {
				label: "Draft",
				tone: "neutral",
			},
			meta: "Adoption Lead",
			visibility: "internal",
			href: "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
		},
		{
			artifact_id: "b9558fdf-7ed6-5a34-ad56-590aeb1eb8d3",
			title: "Field learnings",
			version_label: "4 entries",
			state: {
				label: "Internal",
				tone: "neutral",
			},
			meta: "Routed to platform team",
			visibility: "internal",
			href: "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
		},
	],
	inventories: [
		{
			inventory_id: "38480e4a-2804-5352-9430-15573f3eb70a",
			title: "Tech stack",
			state: { label: "In progress", tone: "info" },
			summary: "Systems, versions, owners, hosting \u00b7 28 systems",
			agent_name: "Technical Discovery",
			action: { label: "Continue", primary: false },
			highlighted: true,
		},
		{
			inventory_id: "a8274ba9-908f-551e-bcd9-2a70210d7ca5",
			title: "People",
			state: { label: "In progress", tone: "info" },
			summary: "Teams, roles, skills, sponsor, owners, named acceptors",
			agent_name: "Adoption Lead",
			action: { label: "Continue", primary: false },
			highlighted: false,
		},
		{
			inventory_id: "1774eb3d-c912-5562-9cfb-ae6a50dc4e2d",
			title: "Processes",
			state: { label: "Not started", tone: "neutral" },
			summary: "Steps, handoffs, decisions, where AI could act",
			agent_name: "Business Discovery",
			action: { label: "Build", primary: true },
			highlighted: false,
		},
		{
			inventory_id: "9b5a9a12-1ec8-5150-baa1-2dc9ddf38774",
			title: "AI tools and spend",
			state: { label: "1 unapproved", tone: "warning" },
			summary: "Tools, models, licences, cost, approval \u00b7 6 tools",
			agent_name: "Outcome Architect",
			action: { label: "Open", primary: false },
			highlighted: false,
		},
		{
			inventory_id: "8b0fc3f2-341c-57c1-81b9-8bd9f0b2a734",
			title: "Data sources and access",
			state: { label: "3 awaiting access", tone: "warning" },
			summary: "Sources, owners, classification, access path \u00b7 11 sources",
			agent_name: "Technical Discovery",
			action: { label: "Open", primary: false },
			highlighted: false,
		},
		{
			inventory_id: "80f9db54-c92d-5974-be5b-b0e668c4dacb",
			title: "Integrations and APIs",
			state: { label: "Not started", tone: "neutral" },
			summary: "Endpoints, auth, sandboxes, read-back support",
			agent_name: "Solution Architect",
			action: { label: "Build", primary: true },
			highlighted: false,
		},
		{
			inventory_id: "c15be65c-846e-523a-88c7-39eca31deb86",
			title: "Risks and constraints",
			state: { label: "Not started", tone: "neutral" },
			summary: "Security, compliance, data residency, change windows",
			agent_name: "Solution Architect",
			action: { label: "Build", primary: true },
			highlighted: false,
		},
	],
};

const workbenchFixtures: Record<string, WorkbenchModel> = {
	[acmeIntake.engagement_id]: acmeIntake,
};

export default workbenchFixtures;
