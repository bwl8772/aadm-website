/**
 * EXAMPLE DATA ONLY — the "3 · Artifact Studio" mock. Loaded only by
 * `src/lib/field-fixtures.ts` when PUBLIC_FIELD_FIXTURES=1. To strip examples:
 * delete this file (or the whole fixtures/ folder).
 */
import type { StudioModel } from "../field-types";

const coderPromptSlice4: StudioModel = {
	engagement_id: "6f278bf1-408e-5452-a2bc-0ea4bf42c816",
	artifact_id: "cdbac60c-efb7-529f-913a-98cc85321084",
	customer: "Acme Health",
	name: "Intake modernization",
	pinned: [
		{
			collection_id: "868d6505-f098-50f6-9f08-d5c757447b54",
			label: "Coder prompts",
			count: 6,
		},
		{
			collection_id: "860817b1-a467-5144-ae12-d65d7cafd0b0",
			label: "API payload specs",
			count: 6,
		},
	],
	sections: [
		{
			section_id: "79cfdaab-ce56-558a-ab8e-afce0de41f45",
			label: "Discover",
			count: 3,
			expanded: true,
			collections: [
				{
					collection_id: "9e14bf89-b4de-55a9-a0f4-5335c73c72d3",
					label: "Tech stack inventory",
					count: 1,
					pinned: false,
					expanded: false,
					items: [
						{
							item_id: "d4ad3d95-f7eb-5aa8-b1d4-00e8a03c8472",
							label: "Acme current stack",
							status: "approved",
							current: false,
						},
					],
				},
				{
					collection_id: "bd84ba00-e1ee-5fc8-bc4d-de5117873c0f",
					label: "Speed Layer canvas",
					count: 1,
					pinned: false,
					expanded: false,
					items: [
						{
							item_id: "0607e0df-6bd8-5dfb-89d6-d665280017c8",
							label: "Intake data flow",
							status: "review",
							current: false,
						},
					],
				},
				{
					collection_id: "9e748d65-4f6d-5ed6-a30b-c780bd6b38c6",
					label: "Discovery brief",
					count: 1,
					pinned: false,
					expanded: false,
					items: [
						{
							item_id: "3a55dd7c-4e5d-54d3-834e-d87050298e69",
							label: "Discovery brief v0.2",
							status: "review",
							current: false,
						},
					],
				},
			],
		},
		{
			section_id: "3dd71594-070c-51e3-a870-f9bc56675dae",
			label: "Design",
			count: 15,
			expanded: true,
			collections: [
				{
					collection_id: "7cd63507-5fac-5033-a2d7-11a84dd8e7e1",
					label: "Technical architecture",
					count: 2,
					pinned: false,
					expanded: false,
					items: [
						{
							item_id: "8e0658b3-68c7-50c7-846c-1d96be791a77",
							label: "Intake flow v2",
							status: "review",
							current: false,
						},
						{
							item_id: "1f64bfab-3a6e-5717-ab13-72635fb61926",
							label: "Target state v0.1",
							status: "draft",
							current: false,
						},
					],
				},
				{
					collection_id: "860817b1-a467-5144-ae12-d65d7cafd0b0",
					label: "API payload specs",
					count: 6,
					pinned: true,
					expanded: false,
					items: [
						{
							item_id: "8de79604-3904-580e-9e56-595bd162ef1b",
							label: "Referral validation",
							status: "draft",
							current: false,
						},
						{
							item_id: "b74f202c-62ab-58a0-809c-4396cf8f763e",
							label: "Referral submit",
							status: "approved",
							current: false,
						},
						{
							item_id: "e1a96683-7d7f-52ef-be27-10cf9cde630a",
							label: "Patient match",
							status: "approved",
							current: false,
						},
					],
				},
				{
					collection_id: "8bee3c9e-33fc-5484-91db-62c3587aadb5",
					label: "Technology choices",
					count: 3,
					pinned: false,
					expanded: false,
					items: [
						{
							item_id: "d1d0055f-fd82-5c86-b0ae-b7dddd4b29c3",
							label: "Vector store",
							status: "review",
							current: false,
						},
						{
							item_id: "a491dfc6-2a4a-5fbc-b328-41d966acecfe",
							label: "Workflow engine",
							status: "approved",
							current: false,
						},
						{
							item_id: "f22bc155-bd67-51f8-ba0f-d5a92d11c829",
							label: "OCR service",
							status: "draft",
							current: false,
						},
					],
				},
				{
					collection_id: "be238baf-0598-5906-951f-8fcc9c325e66",
					label: "Recommendations",
					count: 4,
					pinned: false,
					expanded: false,
					items: [
						{
							item_id: "4af4689f-6088-585c-b452-b396353c74f7",
							label: "Validate in intake",
							status: "approved",
							current: false,
						},
						{
							item_id: "e8f7dd1c-acae-57a9-a45e-1dee8ab3ad0f",
							label: "Pilot one clinic first",
							status: "review",
							current: false,
						},
					],
				},
			],
		},
		{
			section_id: "b9d36f67-8b64-58bc-a591-4ef5d1d8012a",
			label: "Build",
			count: 27,
			expanded: true,
			collections: [
				{
					collection_id: "956c6007-c364-5eba-ba0c-5b4e78975a04",
					label: "User story reviews",
					count: 9,
					pinned: false,
					expanded: false,
					items: [
						{
							item_id: "199d58cc-4558-54e8-9362-4583ef8f5185",
							label: "Intake epic",
							status: "review",
							current: false,
						},
						{
							item_id: "33bc4b7f-91d4-54e6-b422-bb5e1248adf1",
							label: "Scheduling epic",
							status: "draft",
							current: false,
						},
					],
				},
				{
					collection_id: "dc1c03c9-c760-590f-8d8e-2467ff4f36a5",
					label: "Jira tickets",
					count: 12,
					pinned: false,
					expanded: false,
					items: [
						{
							item_id: "4e645d63-295d-5dcf-819e-2047cb4d2111",
							label: "INT-142 Validate insurance fields",
							status: "draft",
							current: false,
						},
						{
							item_id: "161362da-92bb-5445-b81a-c2a79b2d2bbc",
							label: "INT-143 Block flagged referrals",
							status: "draft",
							current: false,
						},
						{
							item_id: "0d53459c-917f-56b9-a450-eb885bd7aefb",
							label: "INT-138 Shared intake queue",
							status: "approved",
							current: false,
						},
					],
				},
				{
					collection_id: "868d6505-f098-50f6-9f08-d5c757447b54",
					label: "Coder prompts",
					count: 6,
					pinned: true,
					expanded: true,
					items: [
						{
							item_id: "d61470fa-5b40-53c2-a6aa-834c08ef7827",
							label: "Slice 4 · Referral validation",
							status: "draft",
							current: true,
						},
						{
							item_id: "fbbaaa15-9ec4-5e91-af52-7ac9435fda76",
							label: "Slice 3 · Patient matching",
							status: "approved",
							current: false,
						},
						{
							item_id: "80ee7035-75da-536a-8875-948ccf2c8e2c",
							label: "Slice 2 · Intake queue",
							status: "approved",
							current: false,
						},
					],
				},
			],
		},
		{
			section_id: "dc57e043-0c94-557b-8907-7b64e8e256df",
			label: "Adopt",
			count: 8,
			expanded: false,
			collections: [
				{
					collection_id: "0d41da43-7f55-5ac6-8b81-b1fc8a4d84c5",
					label: "Process docs",
					count: 5,
					pinned: false,
					expanded: false,
					items: [
						{
							item_id: "2e999f01-1137-521f-88a8-a3ae81f8451e",
							label: "Handling flagged referrals",
							status: "draft",
							current: false,
						},
						{
							item_id: "5bea87e7-ac41-5434-96fc-93ed0f03a73b",
							label: "Intake triage",
							status: "approved",
							current: false,
						},
					],
				},
				{
					collection_id: "0ea5bd02-0037-5a47-b7c3-0cbe51e077fb",
					label: "Acceptance evidence",
					count: 3,
					pinned: false,
					expanded: false,
					items: [
						{
							item_id: "efb53608-b2c0-5395-b6e1-ef75f75d97e0",
							label: "Slice 3",
							status: "review",
							current: false,
						},
						{
							item_id: "d0592668-0b5c-5802-b639-2d3a6f69e181",
							label: "Slice 2",
							status: "approved",
							current: false,
						},
						{
							item_id: "88e921bc-f7a1-586e-9539-eb3da058055f",
							label: "Slice 1",
							status: "approved",
							current: false,
						},
					],
				},
			],
		},
	],
	connected: ["Jira", "Confluence", "GitHub", "Claude Code"],
	tabs: {
		stream: "Stream",
		built: "Built · Coder prompt v0.2",
		map: "Map",
	},
	context_label: "Delivery Planner · Slice 4 · Referral validation",
	agent_name: "Delivery Planner",
	stream: [
		{
			kind: "prompt",
			text: "Write the coder prompt for Slice 4 from the approved recommendation and signed C-04. Use the API payload spec and the attached stack export.",
			attachments: ["Tech stack export.xlsx"],
		},
		{
			kind: "note",
			text: "Tech stack export.xlsx uploaded and saved to engagement evidence",
		},
		{
			kind: "thinking",
			text: "The recommendation puts validation in the intake service, so the prompt has to forbid EHR writes. Acceptance should come word for word from C-04, not be paraphrased.",
		},
		{
			kind: "tool_calls",
			calls: [
				{
					tool: "artifacts.get",
					detail: "Recommendation · validate in intake · v1 approved",
					ok: true,
				},
				{
					tool: "artifacts.get",
					detail: "Architecture · intake flow v2",
					ok: true,
				},
				{
					tool: "requirements.get",
					detail: "C-04 from signed Cornerstone v1",
					ok: true,
				},
				{
					tool: "specs.get",
					detail: "API payload spec · referral validation",
					ok: true,
				},
				{
					tool: "jira.get_issues",
					detail: "INT-142, INT-143",
					ok: true,
				},
			],
		},
		{
			kind: "message",
			text: "Draft ready. Validation stays in the intake service and the acceptance criteria are taken straight from C-04. One open question: should flagged referrals notify the referring clinic?",
		},
		{
			kind: "built",
			title: "Coder prompt · Slice 4 · Referral validation",
			summary:
				"Draft v0.2 · context, task, constraints, acceptance, report back",
			action_label: "View built",
		},
	],
	built: {
		tags: [
			{
				label: "Draft",
				tone: "neutral",
			},
			{
				label: "Internal",
				tone: "neutral",
			},
		],
		meta: "v0.2 · owned by you",
		sections: [
			{
				heading: "Context",
				lines: [
					"Acme Health intake service. Referrals arrive from fax, portal and phone",
					"into one intake queue. Follow Architecture · Intake flow v2.",
				],
			},
			{
				heading: "Task",
				lines: [
					"Flag referrals that are missing required insurance fields before they",
					"reach scheduling. Covers Jira INT-142 and INT-143.",
				],
			},
			{
				heading: "Constraints",
				lines: [
					"- Validate inside the intake service. Do not write to the EHR.",
					"- Request and response follow the referral validation payload spec.",
				],
			},
			{
				heading: "Acceptance · from signed C-04",
				lines: [
					"- Referrals missing a required insurance field are flagged.",
					"- Flagged referrals never enter the scheduling queue.",
					"- A test covers each required field.",
				],
			},
			{
				heading: "Report back",
				lines: [
					"Files changed, tests run, and any requirement you could not meet.",
				],
			},
		],
		share: [
			[
				{
					label: "Copy text",
					note: "Markdown",
				},
				{
					label: "Copy link",
					note: "Same version",
				},
				{
					label: "Download PDF",
				},
				{
					label: "Download Word or Markdown",
				},
			],
			[
				{
					label: "Send to Claude Code",
				},
				{
					label: "Attach to Jira INT-142",
				},
				{
					label: "Publish to Confluence",
					note: "Needs approval",
				},
				{
					label: "Share in Slack",
				},
			],
		],
	},
	map: {
		intro: "How this coder prompt connects to the rest of the engagement.",
		built_from: [
			{
				label: "Outcome definition",
				note: "Intake time [baseline] → [target]",
			},
			{
				label: "Requirement C-04",
				note: "Signed Cornerstone v1",
			},
			{
				label: "Recommendation · validate in intake",
				note: "Approved",
			},
			{
				label: "Architecture · intake flow v2",
				note: "In review",
			},
			{
				label: "API payload spec · referral validation",
				note: "Draft",
			},
			{
				label: "Tech stack inventory",
				note: "Evidence · uploaded today",
			},
		],
		self: {
			label: "Coder prompt · Slice 4",
			note: "Draft v0.2 · Delivery Planner",
		},
		produces: [
			{
				label: "Jira INT-142, INT-143",
				note: "Synced · to do",
			},
			{
				label: "Coder report",
				note: "Waiting on coder",
			},
			{
				label: "Acceptance evidence · Slice 4",
				note: "Not started",
			},
			{
				label: "Process doc · flagged referrals",
				note: "Draft · Adoption Lead",
			},
		],
	},
	outputs: [
		{
			artifact_id: "cdbac60c-efb7-529f-913a-98cc85321084",
			title: "Coder prompt · Slice 4",
			version_label: "v0.2",
			state: {
				label: "Draft",
				tone: "neutral",
			},
			meta: "Open now",
			active: true,
		},
		{
			artifact_id: "466e5efd-a1ee-548f-a035-28cca61de47d",
			title: "API payload spec · referral validation",
			version_label: "v0.3",
			state: {
				label: "Draft",
				tone: "neutral",
			},
			meta: "JSON schema",
			active: false,
		},
		{
			artifact_id: "290bbea4-231d-5aad-ab8c-c91770355e20",
			title: "Architecture · intake flow",
			version_label: "v2",
			state: {
				label: "Review",
				tone: "info",
			},
			meta: "Diagram",
			active: false,
		},
		{
			artifact_id: "7efa9d93-e38a-5847-82da-f81d6df7dc5b",
			title: "Recommendation · validate in intake",
			version_label: "v1",
			state: {
				label: "Approved",
				tone: "success",
			},
			meta: "Customer-visible",
			active: false,
		},
		{
			artifact_id: "1a29d9c8-4362-5e1e-961c-2b67dbf41495",
			title: "Jira tickets · INT-142, INT-143",
			version_label: "",
			state: {
				label: "Synced",
				tone: "neutral",
			},
			meta: "To do",
			active: false,
		},
		{
			artifact_id: "e316cf60-6431-525b-92ed-79b08471794c",
			title: "User story review · intake epic",
			version_label: "v1",
			state: {
				label: "3 comments open",
				tone: "warning",
			},
			meta: "",
			active: false,
		},
		{
			artifact_id: "3fc65abc-b365-51b2-bc48-60c60e824abd",
			title: "Process doc · flagged referrals",
			version_label: "v0.1",
			state: {
				label: "Draft",
				tone: "neutral",
			},
			meta: "Adoption Lead",
			active: false,
		},
	],
};

const studioFixtures: Record<string, StudioModel> = {
	[coderPromptSlice4.artifact_id]: coderPromptSlice4,
};

export default studioFixtures;
