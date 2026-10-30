# Field sign-in → engagement list — design (FIELD-NAV-1)

Design pass only. No code changes. Written for PRD F5-a1 / batch F5-l, slice 1 of 3. Slices 2
(FIELD-NAV-2: plan gate + list) and 3 (FIELD-NAV-3: open an engagement) build from this doc after
Brian approves it and `.tmp/field-nav-mock.html`.

Product vision and in-engagement IA: `docs/FIELD-VISION.md`. Record shapes: `docs/FIELD-CONTRACTS.md`.
This file is the **entry path only** (sign-in, plan gate, list, create, open). It is not the
homepage hierarchy or the engagement workspace.

AADM Field is the system of record for decisions, evidence, customer commitments, and delivery
plans. It is not a compliance or monitoring dashboard — nothing here tracks uptime, audits, or
server health.

**Nouns:** UI copy says **engagement**. Auth and tenancy keep **workspace** (INVARIANTS TEN-06).
The earlier three in-engagement tabs (Requirements gathering, Roadmap and delivery, Map) and the
Overview route are superseded by `docs/FIELD-VISION.md`: My Field + Engagement Workbench.
FIELD-NAV-3 lands on the workbench (not an overview). Artifact Studio is a query mode on the
same engagement route.

## Confirm-first results

Checked against `9ca4603` (ancestor of `HEAD`, clean tree):

1. **Confirmed.** `docs/CLERK-AUTH.md:11` — one login flow, `accounts.aadm.io`. `:111` forbids
   `<SignIn>`/`<SignUp>` on `aadm.io`. Every "Sign in" affordance below is a link to the Account
   Portal, never an embedded form.
2. **Confirmed.** `src/lib/routes.ts:10` protects only `/member(.*)` and `${FIELD_HOME_PATH}(.*)`;
   `src/lib/field-area.ts:2` sets `FIELD_HOME_PATH = "/field/main"`. All in-workspace routes below
   nest under `/field/main/…`; `routes.ts` needs no change.
3. **Confirmed.** `src/pages/field/main.astro:8-31` — signed-in renders an `<h1>` + one placeholder
   line; unsigned-and-sync-pending renders `SessionGatePage gate={Astro.locals.sessionGate}`;
   unsigned-and-not-sync-pending renders nothing.
4. **Confirmed.** `rg -n "fde_tools|mcp_fde|entitlement" src` → 0 hits. No plan check exists yet.
   Plans are `free`, `mcp`, `fde`, `mcp_fde`; Field needs `fde` or `mcp_fde`. The plan source is
   unchecked (PRD DM6-p2) — see Open questions.

## AADM tool findings

- **`ux_surface_pass`** → `READY_FOR_CHAIN`. PRD/spec material detected, review mode (not a
  from-scratch interview); recommended `user_flow` next with the stated goal.
- **`user_flow`** → `READY_FOR_UX_IMPLEMENTATION`, confirming Blueprint's prior run. 5 moves, one
  call row each: **Sign in** (existing — Clerk Account Portal via `SessionGatePage`,
  `src/components/SessionGatePage.astro:1`); **Land by plan**, **View workspace list**,
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
| (c) | Engagement list | Create engagement | `#state-list-ready`, `#state-list-empty`, `#state-list-error` |
| (d) | Create engagement | Create | `#state-create-dialog` |
| (e) | Inside an engagement | *(opens the workbench)* | `#state-workspace-nav`, `#state-workspace-notfound` |
| (f) | Customer view-only entry | Review and co-sign | `#state-viewer` |

Hats (product owner, architect, lead, planner, builder, owner) are steps a workspace moves
through, not separate screens or permission levels — none are designed here. **Viewer** is the
only other role, and it changes presentation only (no edit controls, no extra screen).

## Nav tree & routes

```
/field/main                                              My Field (or plan gate, or sync shell)
/field/main/e/{engagementId}                             Engagement Workbench
/field/main/e/{engagementId}?agent=&artifact=&action=    Deep link from a My Field row
/field/main/e/{engagementId}?artifact={id}               Artifact Studio mode
```

Two application routes. Studio is a mode, not a third app. "Create engagement" is a modal
over `/field/main`. All paths already fall under `${FIELD_HOME_PATH}(.*)` in
`src/lib/routes.ts:10`.

The list breadcrumb is **My Field**. Do not ship an Overview page.

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
| (c) | Engagements | `ready`, `engagements.length > 0` | Create engagement (per-card "Open" is a row action, not the state's primary) |
| (c) | No engagement yet | `ready_empty`, `engagements.length === 0` | Create engagement |
| (c) | Can't load | `storage_unavailable` | Try again |
| (d) | Dialog open | User clicked "Create engagement" | Create |
| (d) | Name rejected | `rejected` (e.g. blank or duplicate name) | Create (inline message, field stays editable) |
| (e) | Engagement opened | `getEngagementWorkbench` succeeds, role is an FDE hat | *(workbench — selected agent from the query, or Business Discovery)* |
| (e) | Engagement not found | `not_found` — no such engagement for this user | My Field |
| (f) | Viewer entry | `getEngagementWorkbench` succeeds, role is `viewer` | Review and co-sign |

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
| List | "Your engagements" · "Open" · "Create engagement" |
| Empty | "No engagement yet" · "Create one for each customer effort you are shaping. You'll start in the workbench." · "Create engagement" |
| Dialog | "Create engagement" · "Engagement name" · "Create" · "Cancel" |
| Nav | "My Field" · workbench agents · artifacts |
| Viewer | "View only" · "Review and co-sign" · "View progress" |
| Errors | "We can't load your engagements right now." · "Try again" · "Engagement not found" · "It doesn't exist or you don't have access." |

"Sample data" is new copy (not in the brief's string list) for the fixture-seam disclosure — see
below.

## Fixture seam

One proposed server-only module, `src/lib/field-backend.ts` (not created this slice):

```ts
getFieldAccess(userId): Promise<{ plan: "free" | "mcp" | "fde" | "mcp_fde"; hasFieldEntitlement: boolean; source: "fixture" }>
getFieldHome(userId): Promise<{ continue, waiting_on_you, customer_commitments, engagements, source: "fixture" }>
createEngagement(userId, name): Promise<{ engagement: { id, name }; source: "fixture" }>
getEngagementWorkbench(userId, engagementId, q): Promise<{ context_bar, agent_id, artifacts, source: "fixture" } | { notFound: true }>
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
reuses `SessionGatePage` unchanged, which currently ships `rounded-2xl` — see Open
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
2. **"Workspace" vs. "engagement."** **Closed.** UI noun is **engagement**. Tenant/auth noun
   stays **workspace**. See `docs/FIELD-VISION.md` §3. Update `field-nav-mock.html` copy before
   FIELD-NAV-2 ships it.
3. **Does a viewer need the Field plan?** The brief treats entitlement (screen b) as gating
   workspace *creation* for the FDE, and viewer as a role on one workspace (screen f). Proposed
   default: a viewer invited to a specific workspace bypasses the plan gate entirely — entitlement
   is evaluated for the workspace's FDE owner, not for every visitor. Confirm before FIELD-NAV-3
   wires `getWorkspace` for viewers.
4. **Create workspace: route or modal-only?** Designed as a modal with no dedicated URL (per the
   mock). If the dialog needs to be linkable or survive a refresh, it needs a route or query param
   — flagging so FIELD-NAV-2 doesn't have to guess.
5. **`SessionGatePage`'s rounded corners.** Reused unchanged per REUSE scope, but it's the
   one surface in this batch that doesn't match the new square-corner convention. Worth a follow-up
   slice to square it off, or intentional as-is?
6. **Plan source.** PRD DM6-p2 marks the plan source unchecked. `getFieldAccess` is designed
   fixture-only for this batch; FIELD-NAV-2's "Done" criteria already name Free/Code/Field/Code+Field
   fixtures, so this doesn't block slice 2 — flagging so the real plan source lands before
   aadm-backend replaces the fixture.
