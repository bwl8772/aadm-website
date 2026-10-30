/**
 * EXAMPLE DATA ONLY — recorded MyFieldView responses for the "1 · My Field" mock,
 * one per filter id (docs/contracts/FIELD-MY-FIELD.md: changing the filter is a new
 * read). Loaded only by `src/lib/field-fixtures.ts` when PUBLIC_FIELD_FIXTURES=1.
 * To strip examples: delete this file (or the whole fixtures/ folder).
 */
import type { MyFieldView } from "../field-types";

const myFieldViews: Record<string, MyFieldView> = {
	"me": {
		"schema_version": "1.0",
		"generated_at": "2026-10-30T09:00:00Z",
		"viewer": {
			"display_name": "Field Demo",
			"initials": "FD"
		},
		"summary_label": "3 engagements · 9 open actions",
		"continue": {
			"title": "Finish the coder prompt for Slice 4: referral validation",
			"engagement_label": "Acme Health · Intake modernization",
			"specialist_label": "Delivery Planner",
			"badges": [
				{
					"label": "Blocks batch 4",
					"tone": "warning"
				}
			],
			"primary": {
				"label": "Open prompt",
				"kind": "navigate",
				"href": "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
				"enabled": true,
				"emphasis": "primary"
			}
		},
		"filters": [
			{
				"id": "me",
				"label": "Waiting on me",
				"count": 5,
				"selected": true
			},
			{
				"id": "customer",
				"label": "Waiting on customer",
				"count": 3,
				"selected": false
			},
			{
				"id": "all",
				"label": "All",
				"count": 9,
				"selected": false
			}
		],
		"actions": {
			"items": [
				{
					"id": "13c3afda-5319-562d-9c51-b533b24c6f66",
					"title": "Review user stories for the intake epic",
					"engagement_label": "Acme Health · Intake modernization",
					"specialist_label": "Delivery Planner",
					"owner_label": "You",
					"waiting_label": "1 day",
					"waiting_tone": "neutral",
					"cta": {
						"label": "Review",
						"kind": "navigate",
						"href": "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
						"enabled": true,
						"emphasis": "secondary"
					}
				},
				{
					"id": "28b60b77-d24a-5525-a0cf-391825658cca",
					"title": "Define the payload for referral validation",
					"engagement_label": "Acme Health · Intake modernization",
					"specialist_label": "Solution Architect",
					"owner_label": "You",
					"waiting_label": "Today",
					"waiting_tone": "neutral",
					"cta": {
						"label": "Open",
						"kind": "navigate",
						"href": "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
						"enabled": true,
						"emphasis": "secondary"
					}
				},
				{
					"id": "2dd7e573-acd9-5b9a-a1b7-7401b1099b11",
					"title": "Choose a vector store: 2 options ready",
					"engagement_label": "Northwind Logistics · Claims triage",
					"specialist_label": "Solution Architect",
					"owner_label": "You",
					"waiting_label": "2 days",
					"waiting_tone": "neutral",
					"cta": {
						"label": "Decide",
						"kind": "navigate",
						"href": "/field/main/e/0a080b74-152a-54a4-88da-dfc086bf511e",
						"enabled": true,
						"emphasis": "secondary"
					}
				},
				{
					"id": "2c3ff26b-59d0-5b07-8601-de1d082d06db",
					"title": "Finish the tech stack inventory",
					"engagement_label": "Northwind Logistics · Claims triage",
					"specialist_label": "Technical Discovery",
					"owner_label": "You",
					"waiting_label": "1 day",
					"waiting_tone": "neutral",
					"cta": {
						"label": "Continue",
						"kind": "navigate",
						"href": "/field/main/e/0a080b74-152a-54a4-88da-dfc086bf511e",
						"enabled": true,
						"emphasis": "secondary"
					}
				},
				{
					"id": "a5fb8fe7-3895-54ff-a761-c1d1a96ee979",
					"title": "Sign Cornerstone v2",
					"blocks_label": "Blocks batch 4",
					"engagement_label": "Acme Health · Intake modernization",
					"specialist_label": "Cornerstone",
					"owner_label": "Customer · VP Operations",
					"waiting_label": "3 days",
					"waiting_tone": "warning",
					"cta": {
						"label": "Nudge",
						"kind": "command",
						"command": "action.nudge",
						"target": "a5fb8fe7-3895-54ff-a761-c1d1a96ee979",
						"enabled": true,
						"emphasis": "secondary"
					}
				},
				{
					"id": "3cc01891-f365-547a-982e-6a545ca65f52",
					"title": "Grant read access to claims archive",
					"blocks_label": "Blocks data inventory and Slice 2",
					"engagement_label": "Northwind Logistics · Claims triage",
					"specialist_label": "Technical Discovery",
					"owner_label": "Customer · IT lead",
					"waiting_label": "4 days",
					"waiting_tone": "danger",
					"cta": {
						"label": "Nudge",
						"kind": "command",
						"command": "action.nudge",
						"target": "3cc01891-f365-547a-982e-6a545ca65f52",
						"enabled": true,
						"emphasis": "secondary"
					}
				}
			],
			"next_cursor": null
		},
		"engagements": [
			{
				"engagement_id": "6f278bf1-408e-5452-a2bc-0ea4bf42c816",
				"customer_label": "Acme Health",
				"engagement_label": "Intake modernization",
				"facts": [
					{
						"label": "Outcome",
						"value": "Intake time [baseline] → [target]"
					},
					{
						"label": "Delivery",
						"value": "3 of 5 slices"
					},
					{
						"label": "Next milestone",
						"value": "Batch 4 review"
					},
					{
						"label": "Waiting on",
						"value": "Customer sign-off"
					}
				],
				"land_label": "4 of 7 inventories",
				"lenses": [
					{
						"id": "readiness",
						"label": "Readiness · action",
						"state": "needs_action",
						"tone": "warning"
					},
					{
						"id": "governance",
						"label": "Governance · decision",
						"state": "needs_decision",
						"tone": "warning"
					}
				],
				"drift": {
					"text": "Drift: Cornerstone v2 sign-off is 3 days late",
					"tone": "warning"
				},
				"open": {
					"label": "Open",
					"kind": "navigate",
					"href": "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816",
					"enabled": true,
					"emphasis": "secondary"
				}
			},
			{
				"engagement_id": "0a080b74-152a-54a4-88da-dfc086bf511e",
				"customer_label": "Northwind Logistics",
				"engagement_label": "Claims triage",
				"status": {
					"label": "Blocked",
					"tone": "danger"
				},
				"summary": "1 of 4 slices · blocked on claims archive access",
				"facts": [],
				"land_label": "2 of 7 inventories",
				"lenses": [],
				"open": {
					"label": "Open",
					"kind": "navigate",
					"href": "/field/main/e/0a080b74-152a-54a4-88da-dfc086bf511e",
					"enabled": true,
					"emphasis": "secondary"
				}
			},
			{
				"engagement_id": "b996431b-8967-50d2-a679-1bcbaceac1c5",
				"customer_label": "Harbor Credit Union",
				"engagement_label": "Member service desk",
				"status": {
					"label": "On track",
					"tone": "success"
				},
				"summary": "Discovery · outcome definition in review",
				"facts": [],
				"land_label": "6 of 7 inventories",
				"lenses": [],
				"open": {
					"label": "Open",
					"kind": "navigate",
					"href": "/field/main/e/b996431b-8967-50d2-a679-1bcbaceac1c5",
					"enabled": true,
					"emphasis": "secondary"
				}
			}
		],
		"capture": {
			"available": true,
			"accept": [
				".docx",
				".pdf",
				".xlsx",
				".png",
				".txt"
			],
			"max_bytes": 26214400
		},
		"empty_state": {
			"heading": "Nothing waiting on you",
			"line": "New work shows here as soon as an agent or a customer hands it to you."
		}
	},
	"customer": {
		"schema_version": "1.0",
		"generated_at": "2026-10-30T09:00:00Z",
		"viewer": {
			"display_name": "Field Demo",
			"initials": "FD"
		},
		"summary_label": "3 engagements · 9 open actions",
		"continue": {
			"title": "Finish the coder prompt for Slice 4: referral validation",
			"engagement_label": "Acme Health · Intake modernization",
			"specialist_label": "Delivery Planner",
			"badges": [
				{
					"label": "Blocks batch 4",
					"tone": "warning"
				}
			],
			"primary": {
				"label": "Open prompt",
				"kind": "navigate",
				"href": "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
				"enabled": true,
				"emphasis": "primary"
			}
		},
		"filters": [
			{
				"id": "me",
				"label": "Waiting on me",
				"count": 5,
				"selected": false
			},
			{
				"id": "customer",
				"label": "Waiting on customer",
				"count": 3,
				"selected": true
			},
			{
				"id": "all",
				"label": "All",
				"count": 9,
				"selected": false
			}
		],
		"actions": {
			"items": [
				{
					"id": "a5fb8fe7-3895-54ff-a761-c1d1a96ee979",
					"title": "Sign Cornerstone v2",
					"blocks_label": "Blocks batch 4",
					"engagement_label": "Acme Health · Intake modernization",
					"specialist_label": "Cornerstone",
					"owner_label": "Customer · VP Operations",
					"waiting_label": "3 days",
					"waiting_tone": "warning",
					"cta": {
						"label": "Nudge",
						"kind": "command",
						"command": "action.nudge",
						"target": "a5fb8fe7-3895-54ff-a761-c1d1a96ee979",
						"enabled": true,
						"emphasis": "secondary"
					}
				},
				{
					"id": "3cc01891-f365-547a-982e-6a545ca65f52",
					"title": "Grant read access to claims archive",
					"blocks_label": "Blocks data inventory and Slice 2",
					"engagement_label": "Northwind Logistics · Claims triage",
					"specialist_label": "Technical Discovery",
					"owner_label": "Customer · IT lead",
					"waiting_label": "4 days",
					"waiting_tone": "danger",
					"cta": {
						"label": "Nudge",
						"kind": "command",
						"command": "action.nudge",
						"target": "3cc01891-f365-547a-982e-6a545ca65f52",
						"enabled": true,
						"emphasis": "secondary"
					}
				}
			],
			"next_cursor": null
		},
		"engagements": [
			{
				"engagement_id": "6f278bf1-408e-5452-a2bc-0ea4bf42c816",
				"customer_label": "Acme Health",
				"engagement_label": "Intake modernization",
				"facts": [
					{
						"label": "Outcome",
						"value": "Intake time [baseline] → [target]"
					},
					{
						"label": "Delivery",
						"value": "3 of 5 slices"
					},
					{
						"label": "Next milestone",
						"value": "Batch 4 review"
					},
					{
						"label": "Waiting on",
						"value": "Customer sign-off"
					}
				],
				"land_label": "4 of 7 inventories",
				"lenses": [
					{
						"id": "readiness",
						"label": "Readiness · action",
						"state": "needs_action",
						"tone": "warning"
					},
					{
						"id": "governance",
						"label": "Governance · decision",
						"state": "needs_decision",
						"tone": "warning"
					}
				],
				"drift": {
					"text": "Drift: Cornerstone v2 sign-off is 3 days late",
					"tone": "warning"
				},
				"open": {
					"label": "Open",
					"kind": "navigate",
					"href": "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816",
					"enabled": true,
					"emphasis": "secondary"
				}
			},
			{
				"engagement_id": "0a080b74-152a-54a4-88da-dfc086bf511e",
				"customer_label": "Northwind Logistics",
				"engagement_label": "Claims triage",
				"status": {
					"label": "Blocked",
					"tone": "danger"
				},
				"summary": "1 of 4 slices · blocked on claims archive access",
				"facts": [],
				"land_label": "2 of 7 inventories",
				"lenses": [],
				"open": {
					"label": "Open",
					"kind": "navigate",
					"href": "/field/main/e/0a080b74-152a-54a4-88da-dfc086bf511e",
					"enabled": true,
					"emphasis": "secondary"
				}
			},
			{
				"engagement_id": "b996431b-8967-50d2-a679-1bcbaceac1c5",
				"customer_label": "Harbor Credit Union",
				"engagement_label": "Member service desk",
				"status": {
					"label": "On track",
					"tone": "success"
				},
				"summary": "Discovery · outcome definition in review",
				"facts": [],
				"land_label": "6 of 7 inventories",
				"lenses": [],
				"open": {
					"label": "Open",
					"kind": "navigate",
					"href": "/field/main/e/b996431b-8967-50d2-a679-1bcbaceac1c5",
					"enabled": true,
					"emphasis": "secondary"
				}
			}
		],
		"capture": {
			"available": true,
			"accept": [
				".docx",
				".pdf",
				".xlsx",
				".png",
				".txt"
			],
			"max_bytes": 26214400
		},
		"empty_state": {
			"heading": "Nothing waiting on you",
			"line": "New work shows here as soon as an agent or a customer hands it to you."
		}
	},
	"all": {
		"schema_version": "1.0",
		"generated_at": "2026-10-30T09:00:00Z",
		"viewer": {
			"display_name": "Field Demo",
			"initials": "FD"
		},
		"summary_label": "3 engagements · 9 open actions",
		"continue": {
			"title": "Finish the coder prompt for Slice 4: referral validation",
			"engagement_label": "Acme Health · Intake modernization",
			"specialist_label": "Delivery Planner",
			"badges": [
				{
					"label": "Blocks batch 4",
					"tone": "warning"
				}
			],
			"primary": {
				"label": "Open prompt",
				"kind": "navigate",
				"href": "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
				"enabled": true,
				"emphasis": "primary"
			}
		},
		"filters": [
			{
				"id": "me",
				"label": "Waiting on me",
				"count": 5,
				"selected": false
			},
			{
				"id": "customer",
				"label": "Waiting on customer",
				"count": 3,
				"selected": false
			},
			{
				"id": "all",
				"label": "All",
				"count": 9,
				"selected": true
			}
		],
		"actions": {
			"items": [
				{
					"id": "13c3afda-5319-562d-9c51-b533b24c6f66",
					"title": "Review user stories for the intake epic",
					"engagement_label": "Acme Health · Intake modernization",
					"specialist_label": "Delivery Planner",
					"owner_label": "You",
					"waiting_label": "1 day",
					"waiting_tone": "neutral",
					"cta": {
						"label": "Review",
						"kind": "navigate",
						"href": "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
						"enabled": true,
						"emphasis": "secondary"
					}
				},
				{
					"id": "28b60b77-d24a-5525-a0cf-391825658cca",
					"title": "Define the payload for referral validation",
					"engagement_label": "Acme Health · Intake modernization",
					"specialist_label": "Solution Architect",
					"owner_label": "You",
					"waiting_label": "Today",
					"waiting_tone": "neutral",
					"cta": {
						"label": "Open",
						"kind": "navigate",
						"href": "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816?artifact=cdbac60c-efb7-529f-913a-98cc85321084",
						"enabled": true,
						"emphasis": "secondary"
					}
				},
				{
					"id": "2dd7e573-acd9-5b9a-a1b7-7401b1099b11",
					"title": "Choose a vector store: 2 options ready",
					"engagement_label": "Northwind Logistics · Claims triage",
					"specialist_label": "Solution Architect",
					"owner_label": "You",
					"waiting_label": "2 days",
					"waiting_tone": "neutral",
					"cta": {
						"label": "Decide",
						"kind": "navigate",
						"href": "/field/main/e/0a080b74-152a-54a4-88da-dfc086bf511e",
						"enabled": true,
						"emphasis": "secondary"
					}
				},
				{
					"id": "2c3ff26b-59d0-5b07-8601-de1d082d06db",
					"title": "Finish the tech stack inventory",
					"engagement_label": "Northwind Logistics · Claims triage",
					"specialist_label": "Technical Discovery",
					"owner_label": "You",
					"waiting_label": "1 day",
					"waiting_tone": "neutral",
					"cta": {
						"label": "Continue",
						"kind": "navigate",
						"href": "/field/main/e/0a080b74-152a-54a4-88da-dfc086bf511e",
						"enabled": true,
						"emphasis": "secondary"
					}
				},
				{
					"id": "a5fb8fe7-3895-54ff-a761-c1d1a96ee979",
					"title": "Sign Cornerstone v2",
					"blocks_label": "Blocks batch 4",
					"engagement_label": "Acme Health · Intake modernization",
					"specialist_label": "Cornerstone",
					"owner_label": "Customer · VP Operations",
					"waiting_label": "3 days",
					"waiting_tone": "warning",
					"cta": {
						"label": "Nudge",
						"kind": "command",
						"command": "action.nudge",
						"target": "a5fb8fe7-3895-54ff-a761-c1d1a96ee979",
						"enabled": true,
						"emphasis": "secondary"
					}
				},
				{
					"id": "3cc01891-f365-547a-982e-6a545ca65f52",
					"title": "Grant read access to claims archive",
					"blocks_label": "Blocks data inventory and Slice 2",
					"engagement_label": "Northwind Logistics · Claims triage",
					"specialist_label": "Technical Discovery",
					"owner_label": "Customer · IT lead",
					"waiting_label": "4 days",
					"waiting_tone": "danger",
					"cta": {
						"label": "Nudge",
						"kind": "command",
						"command": "action.nudge",
						"target": "3cc01891-f365-547a-982e-6a545ca65f52",
						"enabled": true,
						"emphasis": "secondary"
					}
				}
			],
			"next_cursor": null
		},
		"engagements": [
			{
				"engagement_id": "6f278bf1-408e-5452-a2bc-0ea4bf42c816",
				"customer_label": "Acme Health",
				"engagement_label": "Intake modernization",
				"facts": [
					{
						"label": "Outcome",
						"value": "Intake time [baseline] → [target]"
					},
					{
						"label": "Delivery",
						"value": "3 of 5 slices"
					},
					{
						"label": "Next milestone",
						"value": "Batch 4 review"
					},
					{
						"label": "Waiting on",
						"value": "Customer sign-off"
					}
				],
				"land_label": "4 of 7 inventories",
				"lenses": [
					{
						"id": "readiness",
						"label": "Readiness · action",
						"state": "needs_action",
						"tone": "warning"
					},
					{
						"id": "governance",
						"label": "Governance · decision",
						"state": "needs_decision",
						"tone": "warning"
					}
				],
				"drift": {
					"text": "Drift: Cornerstone v2 sign-off is 3 days late",
					"tone": "warning"
				},
				"open": {
					"label": "Open",
					"kind": "navigate",
					"href": "/field/main/e/6f278bf1-408e-5452-a2bc-0ea4bf42c816",
					"enabled": true,
					"emphasis": "secondary"
				}
			},
			{
				"engagement_id": "0a080b74-152a-54a4-88da-dfc086bf511e",
				"customer_label": "Northwind Logistics",
				"engagement_label": "Claims triage",
				"status": {
					"label": "Blocked",
					"tone": "danger"
				},
				"summary": "1 of 4 slices · blocked on claims archive access",
				"facts": [],
				"land_label": "2 of 7 inventories",
				"lenses": [],
				"open": {
					"label": "Open",
					"kind": "navigate",
					"href": "/field/main/e/0a080b74-152a-54a4-88da-dfc086bf511e",
					"enabled": true,
					"emphasis": "secondary"
				}
			},
			{
				"engagement_id": "b996431b-8967-50d2-a679-1bcbaceac1c5",
				"customer_label": "Harbor Credit Union",
				"engagement_label": "Member service desk",
				"status": {
					"label": "On track",
					"tone": "success"
				},
				"summary": "Discovery · outcome definition in review",
				"facts": [],
				"land_label": "6 of 7 inventories",
				"lenses": [],
				"open": {
					"label": "Open",
					"kind": "navigate",
					"href": "/field/main/e/b996431b-8967-50d2-a679-1bcbaceac1c5",
					"enabled": true,
					"emphasis": "secondary"
				}
			}
		],
		"capture": {
			"available": true,
			"accept": [
				".docx",
				".pdf",
				".xlsx",
				".png",
				".txt"
			],
			"max_bytes": 26214400
		},
		"empty_state": {
			"heading": "Nothing waiting on you",
			"line": "New work shows here as soon as an agent or a customer hands it to you."
		}
	}
};

export default myFieldViews;
