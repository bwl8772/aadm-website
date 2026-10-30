# AADM Field Contract: Workspace

Oct 30, 2026 · Draft for Brian Lambert's review

Companions: [`FIELD-MY-FIELD.md`](FIELD-MY-FIELD.md) · [`FIELD-WORKBENCH.md`](FIELD-WORKBENCH.md) · [`FIELD-STUDIO.md`](FIELD-STUDIO.md) · [`../PRD-aadm-delivery-maps.md`](../PRD-aadm-delivery-maps.md) · [`../INVARIANTS.md`](../INVARIANTS.md) · [`../ENGINEERING_RULES.md`](../ENGINEERING_RULES.md)

## 1. Purpose, route and rules

The Workspace screen shows the engagements in one workspace as a collection, so an engineer or lead can see what needs a person next in each, and open one. The backend owns the workspace, its members and its engagements; the frontend renders what it is sent.

| | |
|---|---|
| **Route** | `/field/main/w/{workspaceId}` |
| **Answers** | Which engagements are in this workspace, what each needs next and from whom, and who is on each |
| **Never** | A portfolio dashboard, utilization, charts, health roll-ups or a stop on the way to work (rule R6, FLD-02) |
| **Exits** | An engagement opens the Workbench; its next item opens the Workbench or Studio on the right noun and version; My Field via the breadcrumb |

**Where it sits.** My Field spans every engagement the user can see, across every workspace. This screen is one workspace. The Workbench is one engagement.

```
My Field (all my work)
└── Workspace (a group of engagements)        ← this screen
    └── Engagement (one customer)             → Workbench, Studio
```

**Backend owns**

- The workspace: name, kind, members and their roles, bound Slack channel.
- Which engagements the user may see here, their order, labels and next items.
- Which actions appear (new engagement, invite, bind Slack), and the reason when one is unavailable.

**Frontend may hold only presentation state:** hover, focus, an open menu, scroll position, and the selected filter while a request is in flight. It never sorts, filters, counts or derives a status. Changing the filter is a new read.

**Workspace switcher.** The header shows the current workspace and a menu of the others the user belongs to, as the server sends them. Choosing one navigates to its route.

## 2. Read: `WorkspaceView`

`GET /api/v1/workspaces/{workspaceId}`, with optional `filter` and `cursor`. The server confirms membership from the session and returns 404 if the user is not a member, without saying whether the workspace exists.

| Field | Meaning |
|---|---|
| `schema_version`, `generated_at` | Contract version; base for every command |
| `workspace` | `id`, `name`, `kind` (`personal` or `team`), `slack_label` (bound channel or empty) |
| `viewer` | Display name, initials and role in this workspace |
| `switcher` | Ordered list of the user's workspaces: `id`, `name`, `href`, `current` |
| `breadcrumbs` | Ordered label and link pairs |
| `actions` | Header actions (Action shape): New engagement, Invite, Bind Slack, already filtered by role |
| `filters` | Ordered: `id`, `label`, `selected` (for example: Needs me, Waiting on customer, All) |
| `engagements` | Ordered page of Engagement rows, plus `next_cursor` |
| `members` | Ordered: `name`, `initials`, `role_label` |
| `empty_state` | Heading, line and the create action when there are no engagements |

### Engagement row

| Field | Meaning |
|---|---|
| `engagement_id` | Stable id |
| `customer_label`, `engagement_label` | Display names |
| `next` | The engagement's single next item: `title`, `owner_label`, `waiting_label`, `waiting_tone`, and an action that opens it. This leads the row |
| `position_label` | Roadmap position as text, e.g. "Stage V · batch F2-b" |
| `outcome_label` | One line from the Vision |
| `people` | Accountable engineer and named customer owner |
| `status` | Optional label and tone, sent only when the engagement is blocked or drifting, with `why` |
| `updated_label` | Already relative |
| `open` | An action that opens the Workbench |

The Action shape and shared value lists (tone, lens state) are those of `FIELD-MY-FIELD.md` §2.

## 3. Commands

Every command uses the PRD §A7 envelope (`verb`, `workspace_id`, `actor`, `client: "web"`, `source_ref`, `target {kind, id, expected_version}`, `input`, `idempotency_key`, `request_id`, `api_version`). The reply is `{result, saved[], next_step, needs_decision?}`. The client then re-reads. It sends only commands offered as an enabled Action.

| Command | Input | Effect |
|---|---|---|
| `engagement.create` | customer label, engagement label, accountable engineer | Adds an engagement to this workspace, with an empty Idea ready for **capture idea** |
| `engagement.archive` | engagement id | Hides it from active lists; nothing is deleted |
| `engagement.move` | engagement id, from workspace id, to workspace id | Unlinks it here and links it there; the record and its versions do not change |
| `engagement.link` | engagement id, workspace id | Lists the same engagement in another workspace too; no copy is made |
| `engagement.unlink` | engagement id, workspace id | Removes it from one workspace; refused if it would be in none |
| `member.invite` | email, role | Sends an invite; writes a `workspace_event` |
| `member.set_role` | member id, role | Writes a `workspace_event` |
| `workspace.bind_slack` | channel | Same as `/field bind` in Slack (§A6) |

**Live updates.** `GET /api/v1/workspaces/{workspaceId}/events` sends `view.invalidated`, driven by `artifact.saved`, `decision.recorded`, `run.judged` and `map.rendered` in any engagement here. The client re-reads.

## 4. States, errors and acceptance checks

| State | Trigger | Page shows |
|---|---|---|
| Loading | First read in flight | Row skeletons; no numbers |
| Empty | No engagements | The server's `empty_state` and New engagement |
| Ready | View returned | The view exactly as sent |
| Stale | Conflict on a command | Re-reads, then shows the fresh view |
| Forbidden | Not a member | 404-style page with a link to My Field |
| Unavailable | Server down | Last good view greyed with "Out of date" and retry; no commands |

Errors use the shared problem format (`code`, `title`, `detail`, `retryable`, optional `field`) over the D44 result families: `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `STALE_VIEW`, `INVALID_COMMAND`, `RATE_LIMITED`, `UNAVAILABLE`.

### Acceptance checks

- [ ] The page renders from a recorded view with no other data source.
- [ ] Each row leads with its next item, not a status, colour or count (FLD-02).
- [ ] Row order, filters and labels match the server exactly; nothing is sorted or counted in the browser.
- [ ] A non-member gets 404 with no hint that the workspace exists.
- [ ] The switcher lists only workspaces the user belongs to.
- [ ] Archiving an engagement deletes nothing.
- [ ] Invites and role changes appear as `workspace_event` rows, never as artifact versions.
- [ ] Every new user has My Workspace, and it cannot be deleted or left.
- [ ] An engagement linked to two workspaces shows the same versions in both; a save in one appears in the other after `view.invalidated`.
- [ ] Moving or linking an engagement creates no copy and changes no version.
- [ ] An engagement can never end up in zero workspaces.
- [ ] A customer-role member never sees another customer's engagement or an internal version.

## 5. Decisions and open questions

### Decided (Brian, Oct 30, 2026)

1. **Every user always has a personal workspace, named My Workspace.** It is created with the account and cannot be deleted or left.
2. **An engagement can move between workspaces.**
3. **An engagement can belong to more than one workspace.** It is one engagement with one record, listed in each workspace it belongs to; it is never copied.
4. **Anyone can create an engagement.** Every member of a workspace sees New engagement.
5. **Customer contacts join the workspace.** They are members with a customer role.

6. **The engagement is the tenant boundary for its own rows.** Each engagement carries its own access list; a workspace grants access to the engagements linked to it. Every read and write checks the engagement's access, not only the workspace (ARCH-01, TEN-06).
7. **Customer contacts see only their own customer.** Customer-role members see only engagements naming their customer, and only versions marked customer-visible.
8. **Moving or linking needs membership of both workspaces.** Any member of both the source and the destination workspace may move, link or unlink an engagement. Customer-role members may not.
9. **Leaving a workspace never strands an engagement.** When a member leaves a team workspace, their engagements stay in My Workspace and in every other workspace they are linked to.
10. **My Field shows where each item lives.** Every row and card carries the server's workspace label (or labels, when linked to several).

## 6. PRD binding

How this screen maps to `docs/PRD-aadm-delivery-maps.md` (v0.19). Where they disagree, the PRD wins until the PRD is changed.

### Hierarchy (needs a PRD decision)

| Level | This contract | PRD §A3 today |
|---|---|---|
| Workspace | A group of engagements; members (engineers and customer contacts), roles, Slack channel, model key. Every user has **My Workspace** | "One customer or project". Would be redefined |
| Engagement | One customer effort; owns Idea, Vision, Requirements, Roadmap and below. Linked to one or more workspaces; can move | Not one of the 14 nouns. **Proposed 15th noun** |

Because an engagement can belong to several workspaces, the PRD's tenancy guarantee (§A13: one workspace per credential, 0 cross-workspace rows, RLS) must be restated per engagement. This is the largest PRD change these decisions cause.

The PRD §A10 Workspaces screen ("picks or creates a workspace, binds its Slack channel and invites people") becomes this screen plus the switcher.

### Fields and commands to the PRD

| This contract | PRD |
|---|---|
| `workspace`, `members`, `slack_label` | §A3 Workspace fields: name, kind, members and roles, Slack channel |
| Engagement `next` | The backend's `next_step` for that engagement: a waiting **Decision**, a **Run** to judge, or the next ready **Slice** |
| `position_label` | **Roadmap** You are here, with its **Stage** and **Batch** |
| `outcome_label` | **Vision** |
| `status` with `why` | Read model over Verdicts (DRIFT) and blocking Decisions; not stored |
| `engagement.create` | New verb (the set is open, §A4), followed by **capture idea** |
| `member.invite`, `member.set_role`, `workspace.bind_slack` | `workspace_event` rows (AUD-03); `/field bind` (§A6) |

### Rules from the PRD that bind this screen

- **Rule R6, FLD-01 to FLD-04.** No dashboard, health roll-up or utilization. The screen answers "what needs a person next".
- **AUD-03.** Membership and role changes are `workspace_event` rows; no third store.
- **IDN-06.** Workspace and engagement ids are server-made UUIDs.
- **ARCH-01.** The workspace id in the route is checked against the session; it is never trusted from the URL alone.

### Stage

The PRD §A10 Workspaces screen; invites are **F8** (F5-s). Built ahead of that order on removable fixtures, if built now.

### Not in the PRD yet

Workspace as a group of engagements, My Workspace, Engagement as a noun linked to many workspaces, `engagement.create`, `.archive`, `.move`, `.link` and `.unlink`, the workspace switcher, and tenancy per engagement.
