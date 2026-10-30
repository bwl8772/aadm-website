/**
 * EXAMPLE DATA ONLY — the "1 · My Field" mock. Loaded only by `src/lib/field-fixtures.ts` when PUBLIC_FIELD_FIXTURES=1.
 * To strip examples: delete this file (or the whole fixtures/ folder).
 */
import type {
	FieldAction,
	FieldEngagement,
	MyFieldModel,
} from "../field-types";

const continue_action = {
	label: "Review the coder report for Slice 3 against signed requirement C-04",
	engagement: "Acme Health · Intake modernization",
	specialist: "Evidence Reviewer",
	blocks: "Blocks batch 4",
	verb: "Open report",
};

const actions: FieldAction[] = [
	{
		action_id: "880dbcae-67be-5c0b-b472-3ad2c164ffc5",
		label: "Approve outcome definition v1.2",
		engagement: "Acme Health · Intake modernization",
		specialist: "Outcome Architect",
		owner_kind: "engineer",
		owner_name: "You",
		waiting_label: "2 days",
		late: false,
		verb: "Review",
	},
	{
		action_id: "bd6c5eb9-1af5-53fb-8889-f6900dfe73b8",
		label: "Plan slices for batch 4",
		engagement: "Acme Health · Intake modernization",
		specialist: "Delivery Planner",
		owner_kind: "engineer",
		owner_name: "You",
		waiting_label: "Today",
		late: false,
		verb: "Open",
	},
	{
		action_id: "a661410c-4b80-552f-956d-82e86fd82d29",
		label: "Answer 3 open discovery questions",
		engagement: "Northwind Logistics · Claims triage",
		specialist: "Business Discovery",
		owner_kind: "engineer",
		owner_name: "You",
		waiting_label: "1 day",
		late: false,
		verb: "Open",
	},
	{
		action_id: "4afa4d73-6329-5186-b56a-ea1192689687",
		label: "Log field learning: EHR export limits",
		engagement: "Acme Health · Intake modernization",
		specialist: "Field Learnings",
		owner_kind: "engineer",
		owner_name: "You",
		waiting_label: "Today",
		late: false,
		verb: "Log",
	},
	{
		action_id: "13cb8cc5-30f8-5246-9685-97165c2a43c0",
		label: "Sign Cornerstone v2",
		engagement: "Acme Health · Intake modernization",
		specialist: "Cornerstone",
		owner_kind: "customer",
		owner_name: "Customer · VP Operations",
		waiting_label: "3 days",
		late: true,
		verb: "Nudge",
	},
	{
		action_id: "fdeda0f9-044f-510d-aa40-4fa67521999d",
		label: "Grant read access to claims archive",
		engagement: "Northwind Logistics · Claims triage",
		specialist: "Technical Discovery",
		owner_kind: "customer",
		owner_name: "Customer · IT lead",
		waiting_label: "4 days",
		late: true,
		verb: "Nudge",
	},
];

const counts = {
	engagements: 3,
	open_actions: 9,
	waiting_on_me: 5,
	waiting_on_customer: 3,
	all: 9,
};

const engagements: FieldEngagement[] = [
	{
		engagement_id: "6f278bf1-408e-5452-a2bc-0ea4bf42c816",
		href: "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816",
		customer: "Acme Health",
		name: "Intake modernization",
		detail: {
			outcome: "Intake time [baseline] → [target]",
			delivery: "3 of 5 slices",
			next_milestone: "Batch 4 review",
			waiting_on: "Customer sign-off",
			lenses: [
				{ name: "Strategy", status: "on_track" },
				{ name: "Plan", status: "in_progress" },
				{ name: "Readiness", status: "needs_action", note: "action" },
				{ name: "Adopt", status: "not_started" },
				{ name: "Governance", status: "needs_decision", note: "decision" },
			],
			drift: "Drift: Cornerstone v2 sign-off is 3 days late",
		},
	},
	{
		engagement_id: "0a080b74-152a-54a4-88da-dfc086bf511e",
		customer: "Northwind Logistics",
		name: "Claims triage",
		status: { label: "Blocked", tone: "blocked" },
		summary: "1 of 4 slices · blocked on claims archive access",
	},
	{
		engagement_id: "b996431b-8967-50d2-a679-1bcbaceac1c5",
		customer: "Harbor Credit Union",
		name: "Member service desk",
		status: { label: "On track", tone: "ok" },
		summary: "Discovery · outcome definition in review",
	},
];

const myFieldFixture: MyFieldModel = {
	continue_action,
	actions,
	counts,
	engagements,
};

export default myFieldFixture;
