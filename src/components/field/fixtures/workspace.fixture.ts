/**
 * EXAMPLE DATA ONLY — the Workspace screen, shaped to
 * docs/contracts/FIELD-WORKSPACE.md. Loaded only by `src/lib/field-fixtures.ts`
 * when PUBLIC_FIELD_FIXTURES=1. The default export plays the backend for the
 * viewer's two workspaces: `?filter=` picks the rows. To strip examples:
 * delete this file (or the whole fixtures/ folder).
 */
import type {
	FieldActionLink,
	WorkspaceEngagementRow,
	WorkspaceView,
} from "../field-types";

const FIELD_TEAM_ID = "3f1d2c4b-5a6e-5f70-8a91-b2c3d4e5f601";
const MY_WORKSPACE_ID = "9c8b7a6d-5e4f-5a3b-8c2d-1e0f9a8b7c60";
const ws = (id: string) => `/field/main/w/${id}`;
const eng = (id: string) => `/field/main/e/${id}`;

const navigate = (
	label: string,
	href: string,
	emphasis: FieldActionLink["emphasis"] = "secondary",
): FieldActionLink => ({
	label,
	kind: "navigate",
	href,
	enabled: true,
	emphasis,
});

const command = (
	label: string,
	verb: string,
	opts: Partial<
		Pick<
			FieldActionLink,
			| "emphasis"
			| "enabled"
			| "disabled_reason"
			| "input"
			| "target"
			| "target_kind"
		>
	> = {},
): FieldActionLink => ({
	label,
	kind: "command",
	command: verb,
	enabled: true,
	emphasis: "secondary",
	...opts,
});

const ACME = "6f278bf1-408e-5452-a2bc-0ea4bf42c816";
const NORTHWIND = "0a080b74-152a-54a4-88da-dfc086bf511e";
const HARBOR = "b996431b-8967-50d2-a679-1bcbaceac1c5";

const rows: Record<string, WorkspaceEngagementRow> = {
	[ACME]: {
		engagement_id: ACME,
		customer_label: "Acme Health",
		engagement_label: "Intake modernization",
		next: {
			title: "Sign Cornerstone v2",
			owner_label: "Acme · VP Operations",
			waiting_label: "3 days",
			waiting_tone: "warning",
			open: navigate("Open", `${eng(ACME)}?agent=cornerstone`, "primary"),
		},
		position_label: "Stage V · batch 4",
		outcome_label: "Intake time [baseline] → [target]",
		people: [
			{ label: "You", role_label: "Accountable engineer" },
			{ label: "Acme · VP Operations", role_label: "Customer owner" },
		],
		status: {
			label: "Blocked",
			tone: "danger",
			why: "Slice 4 cannot start until Cornerstone v2 is signed.",
		},
		updated_label: "Today",
		open: navigate("Workbench", eng(ACME)),
	},
	[NORTHWIND]: {
		engagement_id: NORTHWIND,
		customer_label: "Northwind Logistics",
		engagement_label: "Dispatch copilot",
		next: {
			title: "Review coder report · Slice 2",
			owner_label: "You",
			waiting_label: "Today",
			waiting_tone: "neutral",
			open: navigate(
				"Review",
				`${eng(NORTHWIND)}?agent=evidence-reviewer`,
				"primary",
			),
		},
		position_label: "Stage V · batch 2",
		outcome_label: "Dispatcher handle time −30%",
		people: [
			{ label: "You", role_label: "Accountable engineer" },
			{ label: "Northwind · Head of Dispatch", role_label: "Customer owner" },
		],
		updated_label: "2 hours",
		open: navigate("Workbench", eng(NORTHWIND)),
	},
	[HARBOR]: {
		engagement_id: HARBOR,
		customer_label: "Harbor Credit Union",
		engagement_label: "Member onboarding",
		next: {
			title: "Confirm verdict · Slice 1",
			owner_label: "You",
			waiting_label: "1 day",
			waiting_tone: "neutral",
			open: navigate(
				"Confirm",
				`${eng(HARBOR)}?agent=evidence-reviewer`,
				"primary",
			),
		},
		position_label: "Stage V · batch 1",
		outcome_label: "Onboarding completion rate +15 pts",
		people: [
			{ label: "Priya N.", role_label: "Accountable engineer" },
			{ label: "Harbor · COO", role_label: "Customer owner" },
		],
		status: {
			label: "Drifting",
			tone: "warning",
			why: "Slice 1 report changed files outside the slice.",
		},
		updated_label: "Yesterday",
		open: navigate("Workbench", eng(HARBOR)),
	},
};

const filters = [
	{ id: "needs_me", label: "Needs me" },
	{ id: "waiting_customer", label: "Waiting on customer" },
	{ id: "all", label: "All" },
];

function rowsFor(ids: string[], filter: string): WorkspaceEngagementRow[] {
	const all = ids
		.map((id) => rows[id])
		.filter((r): r is WorkspaceEngagementRow => !!r);
	if (filter === "needs_me")
		return all.filter((r) => r.next.owner_label === "You");
	if (filter === "waiting_customer")
		return all.filter((r) => r.next.owner_label !== "You");
	return all;
}

function workspace(
	id: string,
	name: string,
	kind: "personal" | "team",
	slack_label: string | null,
	engagementIds: string[],
	query: Record<string, string>,
): WorkspaceView {
	const filter = filters.some((f) => f.id === query.filter)
		? query.filter
		: "all";
	const items = rowsFor(engagementIds, filter);
	return {
		schema_version: "1.0",
		generated_at: "2026-10-30T14:00:00Z",
		workspace: { id, name, kind, slack_label },
		viewer: {
			display_name: "Brian Lambert",
			initials: "BL",
			role_label: kind === "personal" ? "Owner" : "Lead",
		},
		switcher: [
			{
				id: MY_WORKSPACE_ID,
				name: "My Workspace",
				href: ws(MY_WORKSPACE_ID),
				current: id === MY_WORKSPACE_ID,
			},
			{
				id: FIELD_TEAM_ID,
				name: "Field team",
				href: ws(FIELD_TEAM_ID),
				current: id === FIELD_TEAM_ID,
			},
		],
		breadcrumbs: [{ label: "My Field", href: "/field/main" }, { label: name }],
		actions: [
			command("New engagement", "engagement.create", { emphasis: "primary" }),
			command("Invite", "member.invite", {
				enabled: kind === "team",
				disabled_reason:
					kind === "team" ? undefined : "My Workspace is yours alone.",
			}),
			command("Bind Slack", "workspace.bind_slack", {
				target: id,
				target_kind: "workspace",
				enabled: !slack_label,
				disabled_reason: slack_label ? `Bound to ${slack_label}` : undefined,
			}),
		],
		filters: filters.map((f) => ({ ...f, selected: f.id === filter })),
		engagements: { items, next_cursor: null },
		members:
			kind === "team"
				? [
						{
							member_id: "c1000000-0000-5000-8000-000000000001",
							name: "Brian Lambert",
							initials: "BL",
							role_label: "Lead",
						},
						{
							member_id: "c1000000-0000-5000-8000-000000000002",
							name: "Priya N.",
							initials: "PN",
							role_label: "Engineer",
						},
						{
							member_id: "c1000000-0000-5000-8000-000000000003",
							name: "Acme · VP Operations",
							initials: "AV",
							role_label: "Customer",
						},
					]
				: [
						{
							member_id: "c1000000-0000-5000-8000-000000000001",
							name: "Brian Lambert",
							initials: "BL",
							role_label: "Owner",
						},
					],
		empty_state: {
			heading: "No engagements here yet",
			line: "Create one, or link an engagement from another workspace.",
			create: command("New engagement", "engagement.create", {
				emphasis: "primary",
			}),
		},
	};
}

/** Plays `GET /api/v1/workspaces/{id}` for the viewer's workspaces. */
export default function workspaceFixture(query: Record<string, string>): {
	[workspaceId: string]: WorkspaceView;
} {
	return {
		[FIELD_TEAM_ID]: workspace(
			FIELD_TEAM_ID,
			"Field team",
			"team",
			"#field-team",
			[ACME, NORTHWIND, HARBOR],
			query,
		),
		[MY_WORKSPACE_ID]: workspace(
			MY_WORKSPACE_ID,
			"My Workspace",
			"personal",
			null,
			[ACME, HARBOR],
			query,
		),
	};
}
