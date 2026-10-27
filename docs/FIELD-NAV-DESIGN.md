# Field sign-in → workspace nav — design (FIELD-NAV-1)

Design pass only. No code changes. Written for PRD F5-a1 / batch F5-l, slice 1 of 3. Slices 2
(FIELD-NAV-2: plan gate + list) and 3 (FIELD-NAV-3: workspace nav + Map) build from this doc after
Brian approves it and `.tmp/field-nav-mock.html`.

AADM Field turns a rough idea into signed requirements and a roadmap an AI coder can run. It is
not a compliance or monitoring dashboard — nothing here tracks uptime, audits, or server health.

## Confirm-first results

Checked against `9ca4603` (ancestor of `HEAD`, clean tree):

1. **Confirmed.** `docs/CLERK-AUTH.md:11` — one login flow, `accounts.aadm.io`. `:111` forbids
   `<SignIn>`/`<SignUp>` on `aadm.io`. Every "Sign in" affordance below is a link to the Account
   Portal, never an embedded form.
2. **Confirmed.** `src/lib/routes.ts:10` protects only `/member(.*)` and `${FIELD_HOME_PATH}(.*)`;
   `src/lib/field-area.ts:2` sets `FIELD_HOME_PATH = "/field/main"`. All in-workspace routes below
   nest under `/field/main/…`; `routes.ts` needs no change.
3. **Confirmed.** `src/pages/field/main.astro:8-31` — signed-in renders an `<h1>` + one placeholder
   line; unsigned-and-sync-pending renders `MemberSatelliteSyncPage returnPath={FIELD_HOME_PATH}`;
   unsigned-and-not-sync-pending renders nothing.
4. **Confirmed.** `rg -n "fde_tools|mcp_fde|entitlement" src` → 0 hits. No plan check exists yet.
   Plans are `free`, `mcp`, `fde`, `mcp_fde`; Field needs `fde` or `mcp_fde`. The plan source is
   unchecked (PRD DM6-p2) — see Open questions.

## AADM tool findings

- **`ux_surface_pass`** → `READY_FOR_CHAIN`. PRD/spec material detected, review mode (not a
  from-scratch interview); recommended `user_flow` next with the stated goal.
- **`user_flow`** → `READY_FOR_UX_IMPLEMENTATION`, confirming Blueprint's prior run. 5 moves, one
  call row each: **Sign in** (existing — Clerk Account Portal via `MemberSatelliteSyncPage`,
  `src/components/MemberSatelliteSyncPage.astro:1`); **Land by plan**, **View workspace list**,
  **Create workspace**, **Open workspace** (all new — fixture-backed `src/lib/field-backend.ts`,
  proposed). `open_workspace` is the move that reaches the user's goal (`reaches_goal: true`).
  Verdict × zone matrix: one `primary_panel` zone owns `unauthenticated`, `entitlement_required`,
  `storage_unavailable`, and `not_found`; `workspace_list` owns `ready_empty` and `ready` — no
  zone shows two primary actions for the same state (UF-DUP-01).

Neither tool reported a do-not-edit or halt condition.

## Screens

| # | Screen | Primary action | Mock anchor |
|---|---|---|---|
| (a) | Sign in | *(none while syncing — see state table)* | `#state-signin-idle`, `#state-signin-syncing` |
| (b) | No Field plan | Add AADM Field / See plans | `#state-plan-code`, `#state-plan-free` |
| (c) | Workspace list | Create workspace | `#state-list-ready`, `#state-list-empty`, `#state-list-error` |
| (d) | Create workspace | Create | `#state-create-dialog` |
| (e) | Inside a workspace | *(navigation — see state table)* | `#state-workspace-nav`, `#state-workspace-notfound` |
| (f) | Customer view-only entry | Review and co-sign | `#state-viewer` |

Hats (product owner, architect, lead, planner, builder, owner) are steps a workspace moves
through, not separate screens or permission levels — none are designed here. **Viewer** is the
only other role, and it changes presentation only (no edit controls, no extra screen).

## Nav tree & routes

```
/field/main                              Workspace list (or plan gate, or sync shell)
/field/main/w/{workspaceId}/requirements  Requirements gathering  (default on open)
/field/main/w/{workspaceId}/roadmap       Roadmap and delivery
/field/main/w/{workspaceId}/map           Map
```

"Create workspace" is a modal over `/field/main`, not its own route. All four paths above already
fall under `${FIELD_HOME_PATH}(.*)` in `src/lib/routes.ts:10` — no routing change needed for this
batch. The in-workspace nav bar (`#state-workspace-nav`) renders three items — **Requirements
gathering**, **Roadmap and delivery**, **Map** — plus an **All workspaces** breadcrumb back to the
list. Nav items are flat, not numbered: Requirements gathering and Roadmap and delivery read as a
sequence, but Map doesn't fit that order, so no item gets a step number.

## State table

One primary action per state (TEN-07, ARCH-25). "Condition" is the backend result the fixture
seam (or later, aadm-backend) returns; nothing below is inferred from absence or timestamps
(ARCH-15).

| Screen | State | Server condition | Primary action |
|---|---|---|---|
| (a) | Signed out | No Clerk session, no sync pending | *(none — SiteHeader's existing "Sign in" chip is the entry point)* |
| (a) | Syncing | Returned from Account Portal, satellite handshake pending | *(none — resolves automatically; "Finishing authentication…")* |
| (b) | No plan — Code-only | `entitlement_required`, `plan: "mcp"` | Add AADM Field |
| (b) | No plan — Free | `entitlement_required`, `plan: "free"` | See plans |
| (c) | Workspaces | `ready`, `workspaces.length > 0` | Create workspace (per-card "Open" is a row action, not the state's primary) |
| (c) | No workspace yet | `ready_empty`, `workspaces.length === 0` | Create workspace |
| (c) | Can't load | `storage_unavailable` | Try again |
| (d) | Dialog open | User clicked "Create workspace" | Create |
| (d) | Name rejected | `rejected` (e.g. blank or duplicate name) | Create (inline message, field stays editable) |
| (e) | Workspace opened | `getWorkspace` succeeds, role is an FDE hat | *(navigation — lands on Requirements gathering)* |
| (e) | Workspace not found | `not_found` — no such workspace for this user | All workspaces |
| (f) | Viewer entry | `getWorkspace` succeeds, role is `viewer` | Review and co-sign |

`indeterminate`, `conflict`, `forbidden`, `rate_limited`, and `internal_error` are real TEN-07
families but have no call row in this batch's 5 moves — they're out of scope until FIELD-NAV-2/3
wire real calls, not designed away. `forbidden` in particular has no screen here because no move
in this slice can return it (viewer vs. FDE hat is presentation, not a blocked action — AUTHZ-04).

## Exact strings

Copied verbatim from the brief, including as-given text — see Open questions for one.

| Screen | Strings |
|---|---|
| Sign in (syncing) | "Finishing authentication…" |
| No plan | "AADM Field is a separate plan" · "Turn a rough idea into signed reqements and a roadmap your AI coder can run." · "Add AADM Field" (Code-only) · "See plans" (Free) · "Learn more" |
| List | "Your workspaces" · "Open" · "Create workspace" |
| Empty | "No workspace yet" · "Create one for each customer or product you're shaping. You'll start with an idea in Requirements gathering." · "Create workspace" |
| Dialog | "Create workspace" · "Workspace name" · "Create" · "Cancel" |
| Nav | "All workspaces" · "Requirements gathering" · "Roadmap and delivery" · "Map" |
| Viewer | "View only" · "Review and co-sign" · "View progress" |
| Errors | "We can't load your workspaces right now." · "Try again" · "Workspace not found" · "It doesn't exist or you don't have access." |

"Sample data" is new copy (not in the brief's string list) for the fixture-seam disclosure — see
below.

## Fixture seam

One proposed server-only module, `src/lib/field-backend.ts` (not created this slice):

```ts
getFieldAccess(userId): Promise<{ plan: "free" | "mcp" | "fde" | "mcp_fde"; hasFieldEntitlement: boolean; source: "fixture" }>
listWorkspaces(userId): Promise<{ workspaces: { id, name, updatedAt }[]; source: "fixture" }>
createWorkspace(userId, name): Promise<{ workspace: { id, name }; source: "fixture" }>
getWorkspace(userId, workspaceId): Promise<{ workspace: { id, name, role }; source: "fixture" } | { notFound: true }>
```

Until aadm-backend exists, every function returns fixture data tagged `source: "fixture"`. Pages
call these functions and render exactly what comes back — no page holds plan, role, or status
logic of its own (ARCH-05, ARCH-15). When `source === "fixture"`, the UI shows a small **Sample
data** tag next to "AADM Field" in the app header (see `#state-list-ready`, `#state-create-dialog`,
`#state-workspace-nav`). The plan-offer and not-found screens omit the tag — they're reachable
before or without a successful fixture read, so there's no sample content to label.

Button visibility follows the server's `role` field; it is not itself authorization (AUTHZ-04) —
the viewer screen has no edit controls because the server never sent them, not because the client
hid them.

## Styling

`theme.css` tokens only (`--surface-card`, `--border-subtle`, `--accent-violet`, etc.), dark by
default, square corners matching `SiteHeader`'s chip style. One exception: the syncing screen
reuses `MemberSatelliteSyncPage` unchanged, which currently ships `rounded-2xl` — see Open
questions. The product header ("AADM Field" + a user menu with Account / Sign out) is new chrome
distinct from the marketing `SiteHeader` above it; no `MemberNavTabs`.

## Mock

`.tmp/field-nav-mock.html` — one self-contained file, 11 states across the 6 screens, inline CSS
copied from `theme.css`, no network requests. `?theme=light|dark` query param for deterministic
screenshots; dark is the default with no param. Screenshots:
`.tmp/field-nav-1280-light.png`, `.tmp/field-nav-375-dark.png`.

## Open questions

1. **"reqements" typo.** The brief's no-plan copy reads "signed reqements" — copied verbatim into
   the doc and mock per "use exactly." Recommend fixing to "signed requirements" before FIELD-NAV-2
   ships it.
2. **"Workspace" vs. "engagement."** `.tmp/field-main-mock.html` (an earlier, uncommitted mock
   already in this repo) uses "engagement" throughout — "Your engagements," "No engagement yet,"
   `engagement-card`. This slice's brief says "workspace" throughout, which is what's used here and
   in the new mock. Which term is canonical before FIELD-NAV-2 writes real copy?
3. **Does a viewer need the Field plan?** The brief treats entitlement (screen b) as gating
   workspace *creation* for the FDE, and viewer as a role on one workspace (screen f). Proposed
   default: a viewer invited to a specific workspace bypasses the plan gate entirely — entitlement
   is evaluated for the workspace's FDE owner, not for every visitor. Confirm before FIELD-NAV-3
   wires `getWorkspace` for viewers.
4. **Create workspace: route or modal-only?** Designed as a modal with no dedicated URL (per the
   mock). If the dialog needs to be linkable or survive a refresh, it needs a route or query param
   — flagging so FIELD-NAV-2 doesn't have to guess.
5. **`MemberSatelliteSyncPage`'s rounded corners.** Reused unchanged per REUSE scope, but it's the
   one surface in this batch that doesn't match the new square-corner convention. Worth a follow-up
   slice to square it off, or intentional as-is?
6. **Plan source.** PRD DM6-p2 marks the plan source unchecked. `getFieldAccess` is designed
   fixture-only for this batch; FIELD-NAV-2's "Done" criteria already name Free/Code/Field/Code+Field
   fixtures, so this doesn't block slice 2 — flagging so the real plan source lands before
   aadm-backend replaces the fixture.
