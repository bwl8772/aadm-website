**APP: AADM Field (aadm-website)** · FIELD-NAV-1 (design for PRD F5-a1 + batch F5-l): FDE signs in and lands on their workspaces — the design pass
Repo ~/github/aadm-website on `dev`, no branches. Read by Blueprint at 9ca4603 (clean tree), Oct 26, 2026, ~6:52 PM ET. Design only: no code in src/.

GOAL: Use the Claude design skill (`frontend-design`, enabled in `.claude/settings.json:3`) to design the AADM Field sign-in-to-workspace screens and nav. Write one spec doc plus a clickable mock, then STOP for Brian's look. Slices 2 and 3 build from this doc. Field turns a rough idea into requirements and a roadmap the coder can run. It is NOT a compliance or monitoring dashboard.

SCOPE
- NEW `docs/FIELD-NAV-DESIGN.md` (the only committed file): the screen list, nav tree, routes, a state table (state → server condition → the one primary action), the exact strings below, the fixture seam, and open questions.
- `.tmp/field-nav-mock.html` (one self-contained file, inline CSS, no network) plus screenshots in `.tmp/`. These are never staged.
- REUSE (read only, do not edit): `src/pages/field/main.astro`, `src/components/SessionGatePage.astro`, `src/layouts/Layout.astro`, `src/lib/field-area.ts`, `src/lib/routes.ts`, `src/lib/clerk-portal-urls.ts`, `src/styles/theme.css`, `docs/INVARIANTS.md`, `docs/CLERK-AUTH.md`.

DO NOT CHANGE: anything under `src/`, `astro.config.mjs`, `package.json`, `AGENTS.md`, `docs/INVARIANTS.md`, `docs/CLERK-AUTH.md`, `scripts/`.

CONFIRM FIRST (run `git merge-base --is-ancestor 9ca4603 HEAD`; check each fact in your checkout; stop and report only if one differs)
1. `docs/CLERK-AUTH.md:11` says there is exactly one login flow (accounts.aadm.io), and `:111` forbids `<SignIn>`/`<SignUp>` on aadm.io. So "Sign in" is a hop to the Account Portal, never an embedded form.
2. `src/lib/routes.ts:10` protects only `/member(.*)` and `${FIELD_HOME_PATH}(.*)`, where `src/lib/field-area.ts:2` sets `/field/main`. So every in-workspace route nests under `/field/main/…`, e.g. `/field/main/w/{id}/requirements`, and routes.ts needs no change.
3. `src/pages/field/main.astro:8-31` renders `Layout` with `SessionGatePage gate={Astro.locals.sessionGate}` while unsigned, plus one placeholder line when signed in.
4. `rg -n "fde_tools|mcp_fde|entitlement" src` returns 0 hits, so no plan check exists yet. Plans are free, mcp, fde and mcp_fde; Field needs fde or mcp_fde. The plan source is unchecked (PRD DM6-p2).

DESIGN STEPS
1. Call AADM `ux_surface_pass`, then `user_flow`. Blueprint's run of user_flow returned READY_FOR_UX_IMPLEMENTATION with 5 moves: sign in (existing), plus land by plan, list, create and open (all new, behind the seam). Report each tool's one-line finding.
2. Design 6 screens. Each gets the one primary action and the AADM result state it renders (TEN-07, ARCH-25):
   (a) Sign in: syncing, then the Account Portal, then back to /field/main.
   (b) No Field plan yet, with a plain upgrade path. Code-only and Free users see an offer, never an error.
   (c) Workspace list, with its empty state.
   (d) Create workspace.
   (e) Inside a workspace: nav to Requirements gathering, Roadmap and delivery, and Map.
   (f) Customer view-only entry: co-sign requirements and view progress.
3. Hats (product owner, architect, lead, planner, builder, owner) are steps in the loop, not roles. Design no role or permission screens. Viewer is the only other role.
4. Seam: design one server-only module (proposed `src/lib/field-backend.ts`: getFieldAccess, listWorkspaces, createWorkspace, getWorkspace). Until aadm-backend exists, it returns fixtures tagged `source: "fixture"`, and the UI shows "Sample data". No page holds plan, role or status logic (ARCH-05, ARCH-15, AUTHZ-04).
5. Styling: use theme.css tokens only, dark by default, square corners as in SiteHeader. Show one primary button per state. Header: "AADM Field" and a user menu (Account, Sign out). No MemberNavTabs.

STRINGS (use exactly)
- Sync: "Finishing authentication…".
- No plan: "AADM Field is a separate plan" · "Turn a rough idea into signed requirements and a roadmap your AI coder can run." · "Add AADM Field" (Code-only) / "See plans" (Free) · "Learn more".
- List: "Your workspaces" · "Open" · "Create workspace".
- Empty: "No workspace yet" · "Create one for each customer or product you're shaping. You'll start with an idea in Requirements gathering." · "Create workspace".
- Dialog: "Create workspace" · "Workspace name" · "Create" · "Cancel".
- Nav: "All workspaces" · "Requirements gathering" · "Roadmap and delivery" · "Map".
- Viewer: "View only" · "Review and co-sign" · "View progress".
- Errors: "We can't load your workspaces right now." · "Try again" · "Workspace not found" · "It doesn't exist or you don't have access."

TESTS (scoped; doc only, so nothing to run in src/)
- `git diff --cached --name-only` prints exactly `docs/FIELD-NAV-DESIGN.md`.
- `rg -n -i "compliance|monitor|uptime|latency|region|server health|audit" .tmp/field-nav-mock.html` returns 0 hits.
- Screenshots `.tmp/field-nav-1280-light.png` and `.tmp/field-nav-375-dark.png`, one full page per screen or a stacked page. Use the repo's existing Playwright and install nothing.

Scoped tests only; typecheck at column end, go at map end. MUST NOT run any typecheck (check:types:touched, npm run check, tsc, tsgo) or npm run go in this slice.
If any AADM tool says do not edit or halt, stop and report; do not continue.
git add only the named files; never stage .tmp/, walk scripts or session files
If the dev server shows a stale or cached error, stop and ask Brian; never edit config files or nudge containers to force a reload.
Skip baseline_guide; use no defect or triage tools. Do not call suggest_aadm_tools.
Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it.
If this slice turns out more complex than one behavior, stop, don't commit, and send Blueprint a batch request.

AADM PROOF: run `predone_review` on the staged diff and get `approve`. Fix only what it flags in the doc.
GIT: stay on `dev`. Never use git -A, stash, reset, restore or amend. Run `git add docs/FIELD-NAV-DESIGN.md`, then `git commit -m "FIELD-NAV-1: Field sign-in to workspace nav design"`. Do not push.
STOP AND REPORT, then STOP for Brian's look; build nothing:
- the commit hash and files;
- the test outputs;
- the predone_review verdict;
- the AADM tool findings;
- the screenshot paths;
- the confirm-first results;
- the open questions.

---
BATCH FIELD-NAV (3 slices; slices 2–3 are written only after Brian approves slice 1)
1. FIELD-NAV-1: design pass (above). Done: Brian approves the doc and mock.
2. FIELD-NAV-2: FDE signs in, gets past the plan gate, and sees the workspace list. Done: on /field/main, fixtures for Free, Code, Field and Code + Field render the offer or the list; 0 workspaces shows "No workspace yet" with one "Create workspace"; the seam's unavailable result shows "Try again"; `node scripts/field-home-smoke.mjs` (extended) passes.
3. FIELD-NAV-3: FDE opens a workspace and reaches both areas and the Map. Done: /field/main/w/{id}/… shows the nav with "Requirements gathering", "Roadmap and delivery" and "Map"; a viewer sees "View only" with no edit controls; an unknown id shows "Workspace not found"; the smoke script passes.
