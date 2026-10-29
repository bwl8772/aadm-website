# PRD: AADM Field (Cornerstone and Delivery maps)

**APP: AADM (aadm-mcp, aadm-website, aadm-standard)**
**Product names (D35):** **AADM Code** is the coding MCP product (stateless; it saves nothing). **AADM Field** is the product for forward-deployed engineering (FDE) teams and firms. Both sit on **the AADM Standard**. Customer-facing plan labels are Free, Code, Field and Code + Field; the internal Clerk keys (`free`, `mcp`, `fde`, `mcp_fde`, `fde_tools`) don't change. AADM Field is a separate subscription from AADM Code, at the same price; Code + Field costs 15% less than both added together, and the MCP shows each user only the tools their subscription allows (D36, FIX-32). "FDE" still names the people and the practice. Promise: "AADM Code saves nothing; AADM Field keeps your engagement workspace, and your source code never leaves you."

Status: **v0.19** · the scope lock and the trace rules become invariants: a server-made UUID on every row and action, one `request_id` from the client's call to the version it saved and the log line that recorded it, metrics per verb, Field's own measures derived from versions, no dashboard-first slice (D55, Brian, Oct 29, 2026) · v0.18: Field kept to figuring things out and getting them done: rule R6, Stage V cut to the loop, the order check in `batch`, the verdict worded as an answer, old change notes moved out (D54, Brian, Oct 29, 2026) · v0.17: the Field core re-sequenced to the thin vertical, Stage V, with the six principles of §A16 (D53, Brian, Oct 29, 2026) · v0.16.1: the v0.16 text tightened on Oct 29, 2026 (order check, folded references, fixture paths, tool fit; no new slices, no new decisions) · Field reframe approved by Brian (D45, Oct 26, 2026, 6:38 PM ET), with the FDE hats and user stories added (D52, 6:41 PM ET) · decisions D1–D45 and D52 to D54 are Brian's; **D46 to D51 are Blueprint defaults, pending Brian** · Written by Blueprint (planning only; no code, no git) · v0.16 Oct 26, 2026, ~6:50 PM ET (v0.15 backed up as `.v0.15.bak`); v0.16.1 edited in aadm-website `docs/PRD-aadm-delivery-maps.md` on Oct 29, 2026, with Brian's v0.16 copy on his Desktop as the backup.

**v0.19 change (Brian, Oct 29, 2026; D55):**
- **Why.** Brian: lock the Field scope into invariants so no later slice drifts back toward a compliance app or a backend dashboard ("lets lock those in to avoid scope creep or compliance 'ooops'"), and build observability in from the start: "UUIDs for all user actions recorded" and "correct observability … as a way to continuously improve and see whats going on with the app."
- **Recon.** aadm-mcp's `docs/ARCHITECTURE_INVARIANTS.md` (164 lines, 120 rules at `b626e4b`) already has a server-made `request_id` per request, returned in `x-request-id` (CTX-01 to CTX-05); event rows with `event_id`, actor, request and release (EVT-01); JSON log lines with actor, workspace, latency and result code (OBS-01, OBS-02); the release in every log line and event (OPS-01); stable IDs (ARCH-19, IDN-01); and no secrets in logs (PRIV-01). Five gaps: no rule said IDs are UUIDs; the version row (F1-a1) carried no `request_id`, `idempotency_key` or `release`, so a log line could not reach the version it produced; `request_id` and `release` were minted in F4-g, after the Stage V loop, so the demo's versions would have been born without them; the backend to agent-worker hop had no context rule; and no rule covered metrics or Field's own measures.
- **§A17** holds the 11 new rules (IDN-06, CTX-06, ART-02, AUD-03, OBS-03 to OBS-05, FLD-01 to FLD-04) and retags OBS-01 to both repos. Rule **R7** in §18 binds them to every slice.
- **Slices.** One docs batch, **DM0-j**, closes Stage 0: DM0-j1 (INV4-MCP, not started; prompt `docs/prompts/INV4-MCP.md`) and DM0-j2 (INV4-WEB, done). F1-a3 mints the UUID `request_id` and logs each verb call in Stage V; F1-a1's version row carries `request_id`, `idempotency_key` and `release`; F1-a4's hop carries the context; F2-d1's Verdict and Decision carry their UUIDs and show the measures with the answer; DM0-d1 (F4-g) adds core's handler, the per-hop lines and the metrics endpoint; F5-a3 shows the measures inside the card drawer, never as a dashboard. No slice moves.
- **Counts:** 14 stages, 55 batches, 160 slices, 165 prompts, 7 done, You are here DM0-a3; 22 slices to the demo (DM0-j1 is docs). Map re-rendered.

**v0.18 change (Brian, Oct 29, 2026; D54):**
- **Why.** Five revisions of this PRD's batches, maps and focus each took a full session by hand. That work (find the gap, reorder, check dependencies, redraw the map, pick the next prompt) is what Field is for. The plan had drifted toward proving things to others, so v0.18 pulls it back.
- **Rule R6** at the top of §18: every Field-core slice helps a person decide what to do next or get it done; a slice that only proves something to someone else goes to Stage H or later; Field is not a compliance app or a backend dashboard.
- **Stage V is the loop alone:** 20 slices, 21 to the demo with DM0-a3 (26 in v0.17). DM0-b4 and DM0-d1 to DM0-d3 move to a new batch F4-g, before the public Slack relay; the tenancy suite F1-b1 moves to H-a. The demo is this PRD's fifth revision, replayed, and success is measured in time.
- **`batch` runs the order check** (F2-b0), so every roadmap edit shows what it broke and which move fixes it.
- **The verdict reads as an answer** (§A5 step 12, F2-d1): what worked, what didn't, the next prompt; ON PLAN or DRIFT is the label and the evidence is one click down.
- **§A16 gains a seventh principle**, which withdraws the earlier attestation framing and fixes the order: clarity, focus and precision; then speed; then proof; compliance tracking last. **Principle 1 becomes fleets of agents** (Brian's addition): orchestrators pull ready slices in parallel through AADM Code, proof and sign-offs append per slice, people still make every Decision, and the fleet batch is placed after F6 in §20.
- **The change notes for v0.15 and earlier** moved to `docs/PRD-aadm-delivery-maps-history.md`. Part B's sections stay, as reference that slices cite, not as the plan.
- **Counts:** 14 stages, 54 batches (F4-g added, DM0-d dissolved), 158 slices, 164 prompts, 6 done, You are here DM0-a3. Map re-rendered.

**v0.17 change (Brian, Oct 29, 2026; D53):**
- **The thin vertical.** Brian agreed the five-year read (§A16) and the replan it implies. §18 is re-sequenced so the loop of §A5 runs end to end on Blueprint's own roadmap before anything else: Stage 0 (done work and DM0-a3), then **Stage V** (25 slices, the demo at CV), **F3**, **F4** (Slack, kept thin), **H** (the hardening the demo did not need: 18 slices moved from Stages 0, F1 and F2), **F5** (browse views, map, evidence, co-sign), **F6**. Full web editing, invites, billing and landing move out of F5 into a later **Stage F8** (D45 (3) stands, later). The agreed loop was DM0-a3, DM0-b1/b2, DM0-d, F1-a1 to a3 and F1-b1, then `batch`, `write prompt`, `go`, `field_next_slice`, `submit report`, `judge` and `render map`; Stage V names the 8 load-bearing slices added to it and the 3 that could move out.
- **One new slice, `F2-b0` (`batch`).** The verb of §A4 row 6 had no slice in v0.16 (only F5-b2's web edit and DM6-g6's parity named it). It proposes from a Requirements version or text and edits an existing Roadmap, with `delivery_map` and `slice_issues` run through the registry.
- **§A16, six principles** for the next five years, read into every slice: concurrency (a lease per slice, verdicts that tolerate concurrent evidence), planners as input (F2-a1 reads JSON and later Spec Kit, Kiro and plan-mode files), thin surfaces (F5 shrinks, Slack stays thin, F2-e2 compares structure not pixels), re-judge (a stored Run under a newer `policy_revision` is a new Verdict version), an open verb set (§A4) and a replaceable transport (§A7). The first and fourth are §20 candidates, not slices.
- **Counts:** 14 stages, 54 batches, 158 slices, 164 prompts, 6 done, You are here still DM0-a3. Batches F1-b and F2-e dissolved; V-a, H-a, H-b added. `docs/aadm-delivery-maps-map.png` re-rendered from §18 by `docs/scripts/render_delivery_map.py` (this repo's J1 renderer; card titles are derived from the slice text where Blueprint's hand-written ones existed only in its PNG); `docs/scripts/order_check.py` is the §21 order script, now in the repo. The Desktop PNG is Blueprint's v0.16 render and is not changed.
- **Sections edited:** status; §A4, §A6, §A7, §A11, §A13, §A15, new §A16; §18 (header, order note, Stages 0, V, F3, F4, H, F5, F6, F8, counts); §19 (D53); §20 (v0.17 UNCHECKED); §21 (order check, `interrogate_plan`, `replan_check` rows). Nothing else moved.

**v0.16.1 change (Oct 29, 2026; a tightening pass on v0.16, in aadm-website `docs/`):**
- **Order check re-run** (the §21 row that v0.16 lacked): a script over §18 found 157 slices, 55 batches, 6 done, 57 folded, and **61 reference hits**: 35 in the Field core (19 real defects: an *In:* or body reference to a slice that comes later or no longer exists; 16 forward mentions the slice already states, such as "until X lands"), 20 later-stage *In:* or body references to folded IDs, and 6 batch headers that say "after" a later batch; plus, counted separately, 2 batches outside the 2–4 rule (F3-c with 1, DM1-e with 5, the second already listed in §20).
- **Fixes, no new slices:** `DM6-g6` (a parity test with nothing to compare in F1) moves from F1-r to F2-d, narrowed to the Field-core judgments; `F3-c1` becomes `F3-b4` (batch F3-c is gone); the `fde_tools` check moves from `DM6-c1` (6A) into `DM6-c3`, and `DM6-c3` moves from F5-l to F5-s so DM6-p can read it; `DM6-a4` and `DM6-a5` move from F7-p (gone) into F5-l and F5-s, because DM6-h2 and DM6-h9 store a preference; `DM5-a4` moves to the front of F5-x. Every other folded ID is repointed in place as `F<n>-x<k> (was DM…)`. Batches 55 → **53**; slices and prompts unchanged (157, 162); done unchanged (6).
- **Five Field-core rules** added at the top of §18 (R1 `field_*` names win; R2 Standard preset constants until F7; R3 which §8 tables survive F1-a1; R4 fixtures live in this repo; R5 `pressure_test` is per-surface, so `challenge` runs `interrogate_plan` and `grill_questions`).
- **Tool fit checked from the live schemas:** `pressure_test` takes `component_name` and `surface_kind` (component, hook, page, fetcher, contract, read_model) and no plan or requirements text, which closes the §20 item; `cross_surface_check` takes `contract_fields` with a producer surface and consumer surfaces, which is the owns/feeds row shape F3-b1 needs. §A2, §A4, §A5, F3-b1, D51 and §20 now say `grill_questions` where they said `pressure_test`.
- **Smaller fixes:** `model_key_missing` added under `rejected` in §10 (F1-a4 used it unlisted); F2-d1's done-check splits the deterministic verdict from the agent-drafted next prompt; F4-a2 states acknowledge-then-post; DM0-b1 carries its v0.16 refresh note (the entry point is `aadm-backend`'s `backend` mode, not `aadm-fde`); DM0-a3 also records the third start mode `aadm-agent` (D45 (1), D48) and the current AGENTS.md line (:124 at aadm-mcp `b626e4b`); DM7-c reads `field_next_slice`; the "engagements" copy in DM6-h4 and DM6-h8 says workspaces (§A10).
- **Fixtures:** `/workspace/blueprint/aadm/prompts/` is now in this repo as `docs/prompts/` (17 files, copied from Brian's `~/Desktop/aadm-prompts` on Oct 29, 2026), and this PRD is `docs/PRD-aadm-delivery-maps.md`; the WinBench fixture (F2-a3) still needs a repo path (§20).
- **Not changed:** D46 to D51 stay Blueprint defaults pending Brian; the DM1-e 5-slice batch stays as §20 records it; `aadm-delivery-maps-map.png` and `aadm-end-state-architecture.png` were not re-rendered (Blueprint's renderer); the PNG's Redis label ("sessions, run cache, plan cache") should read "session registry, run-store, entitlement cache" (§13d, DM0-a3) at the next render.

**v0.16 change (Brian, Oct 26, 2026, 6:27 to 6:41 PM ET; D45, D52):**
- **The reframe.** Brian: "STOP TRYING TO MAKE AADM FIELD UX A COMPLIANCE UX OR AN OBSERVABILITY PLATFORM" (6:27 PM). Field turns ambiguous ideas into structure and a disciplined pursuit of an outcome. The new **Part A** (below) is the product: its purpose (§A1), the FDE's hats and user stories (§A2), 14 plain nouns (§A3), 12 verbs (§A4), the loop (§A5), the agent backend with Slack first and a full-editing web shell (§A6), one client contract (§A7), the prompt library (§A8), evidence (§A9), two workspace areas (§A10), Blueprint's own roadmap as the first major feature (§A11), the worked example (§A12), what is under the hood (§A13), what was off and where it went (§A14), and the stage order (§A15).
- **D45 (Brian, 6:38 PM ET):** (1) the agent runs in a separate agent worker with a model key per workspace, which amends FIX-12; (2) Brian's own Slack in v1, with customer Slack later; (3) the web app has **full editing** in v1 (edit slices F5-b1 to F5-b4); (4) D44 is kept as is (10 result families, the capability list, the deletion tombstone); (5) the 67 FDE-extra slices stay in the plan as plumbing or later stages, never the Field UX purpose; (6) the FDE's hats section is added.
- **D52 (Brian, 6:41 PM ET):** §A2. One main user, the FDE, whose hats (Product owner, Architect, Lead, Planner, Builder, Owner) are steps in the loop, not roles, screens or permission levels. There are 8 FDE stories and 2 customer stories (C1 co-sign; C2 an executive views the map). These stories are **the acceptance tests for the Field core**, and each one names its F-stage slices.
- **Stages:** 0 (kept), **F1** store, verbs and agent worker; **F2** Blueprint's roadmap (first major feature); **F3** requirements gathering; **F4** Slack; **F5** the web shell with full editing; **F6** safe to depend on. Then the later stages F7, T, 6A, 6B, 6C and 8.
- **Slices:** +39 new (F1-a 4, F1-b 2, F2 12, F3 6, F4 8, F5-a 3, F5-b 4); 57 v0.15 slices folded into them, with the done-checks carried (table at the end of §18); 118 kept with their IDs; 0 deleted outright.
- **Totals:** 13 stages, 53 batches (v0.16.1; 55 in v0.16), **157 slices**, **162 prompts** (149 slice prompts and 13 column checks); **6 done**; You are here on **DM0-a3**. v0.15 had 12 stages, 53 batches, 175 slices and 179 prompts.
- **Sections edited:** Part A (new); §3 (the no-web-editing non-goal is withdrawn); §5 FIX-12 and FIX-25 rows; §18 (rebuilt); §19 (D45 to D52); §20 (v0.16 UNCHECKED); §21 (the v0.16 AADM runs). §1 to §17 otherwise keep their v0.15 text and are read through §A14.
- **Maps:** `aadm-delivery-maps-map.png` re-rendered to J1 for v0.16. `aadm-end-state-architecture.png` refreshed with the Slack, web and MCP clients, the core relay, the backend and the agent worker.

# Part A. AADM Field v0.16: the core (D45, D52)

Part A is the product. It says what Field is for, who uses it, what the backend stores, the verbs every client calls, and the stages that build it. §1 to §17 and §19 to §21 keep their v0.15 text. Where they describe compliance, readiness, health colors, the firm layer or settings presets, that text now describes **plumbing or a later stage** (§A14). It is never the purpose of the Field UX. Where Part A and an older section disagree, Part A wins.

## A1. What AADM Field is for

AADM Field takes an idea that is still vague and turns it into something a team can build and finish. An AI agent works through the idea with you in short rounds. The idea becomes a vision. The vision becomes requirements you can hold a coder to, and those requirements are checked against the contracts you already have. AADM then interrogates them. Next, they go into the one roadmap you already keep, as stages, batches and slices. Each slice has a done-check and one prompt. Coders run those prompts through AADM Code. What they send back (commits, tests and review results) is judged ON PLAN or DRIFT, and that verdict produces the next prompt. Everything is saved as versions, so you can stop, come back and pick up the next round.

Brian (Oct 26, 2026, 6:27 PM ET): "The GOAL OF AADM FIELD IS TO DEFINE THE VISION AND REQUIREMENTS AND THEN BUILD A ROADMAP THAT CAN BE EXECUTED UPON. STOP TRYING TO MAKE AADM FIELD UX A COMPLIANCE UX OR AN OBSERVABILITY PLATFORM."

Field is not a compliance tool and not a monitoring dashboard. Its job is to get from a fuzzy idea to a finished outcome by a disciplined path.

## A2. Who uses Field: the FDE's hats (Brian, Oct 26, 2026, 6:41 PM ET; D52)

Field is designed for **one main user, the FDE** (forward-deployed engineer). The FDE wears several hats. **Each hat is a step in the loop (§A5).** A hat is not a separate role, screen or permission level: one FDE wears all six, often within the same hour. Field never asks "which hat are you?". The hat is just the step the FDE is on.

### A2.1 The hats

| Hat | Field area | Loop steps (§A5) | In scope | Out of scope |
|---|---|---|---|---|
| **Product owner** | Requirements gathering → Ideas, Vision, Requirements, Sign-off | 1 Idea, 2 Vision, 3 Requirements, 6 Sign-off | Capturing the idea in their own words. Shaping the vision (outcome, users, measures) and the requirements (items, fixtures, known gaps) round by round with the agent, in Slack or on the web. Signing one version | Approval workflows with SLAs, use-case scoring, stakeholder sentiment (all later stages or cut, §A14) |
| **Architect** | Requirements gathering → Relationships | 4 Relationships | How the new contract fits the existing contracts: owns, feeds, must approve and cannot do. Flagging any second owner of the same data. Gates for a planned period with two writers | Stack inventory and fact freshness (Terrain, a later stage), server or region health |
| **Lead** | Requirements gathering → Interrogation (the Challenge button) | 5 Interrogation | Running AADM `interrogate_plan` and `grill_questions` on one requirements version, and turning each finding into a fix (version N+1) or a gate on that version | Risk registers, readiness checks and governance maps as gates on the work (later stages) |
| **Planner** | Roadmap and delivery → Map placement, Batches and slices | 7 Roadmap placement, 8 Batches and slices | Placing signed work into the one maintained roadmap (never a fresh plan when one exists). Stages, batches of 2 to 4 slices, and a done-check on every slice | Staffing, utilization and per-person metrics (the firm layer, later) |
| **Builder** | Roadmap and delivery → Slice (Prompt, Go, Runs, Verdict) and the Prompt library | 9 Prompt, 10 Go, 11 Coder report and evidence, 12 Verdict and next prompt | One short, ready-to-run prompt per slice. Saying go on that exact version. Pasting or pulling the coder's report. Confirming ON PLAN or DRIFT, then taking the next prompt | Writing the code itself (the coder does that through AADM Code), pushing, merging and deploying |
| **Owner** | Roadmap and delivery → Map, and the Replan banner | Render map, Replan (§A4 verbs 11 and 12), across all steps | The journey map with its colors and the You are here marker; knowing where things stand; being told which slices need a replan when a new requirements version is signed | Health colors as a monitoring layer, dashboards about people, alerts about servers |

**Customers wear no hats except these two:** they co-sign the requirements in their own words (story C1), and a customer executive views progress on the map (story C2). A customer is invited to the workspace as a member (DM6-a2, DM6-a3), signs as a linked person (F4-a3) and views with the viewer role (F5-a3).

### A2.2 User stories: the acceptance tests for the Field core

These ten stories are **the acceptance tests for the Field core** (Stages 0 and F1 to F6). The core is done when each story's test passes on dev against the named fixtures. Each story names the F-stage slices that deliver it. Every new slice in §18 lists the stories it serves. The F1 store, verbs, tenancy and export slices (F1-a1 to F1-a4, F1-b1, F1-b2) and the one-voice guard F5-b4 sit under all ten stories.

| # | Story | Acceptance test (passes when…) | Delivered by |
|---|---|---|---|
| **1** | As an FDE wearing the **Product owner** hat, I can turn a fuzzy idea into a vision through rounds in Slack, with every round saved. | An `idea:` message in the bound channel starts a thread and saves Idea v1. Each reply saves Vision v(N+1), along with what the agent was asked and what it answered. Five replies give five versions, each with a diff link, and the web shell shows the same five. | F3-a1, F1-a4, F4-a1, F4-a2, F4-a3, F4-b1, F4-b2, F5-a2 |
| **2** | As an FDE wearing the **Product owner** hat, I can get requirements a coder can be held to: fixtures such as the Steve and Charles profiles, known gaps listed, and edits in Slack or on the web saved as versions. | The Steve and Charles fixture (F3-b4) gives Requirements with the BIS core four, items, both profiles as fixtures and the 5 known gaps. An edit in Slack (iterate) and an edit in the web shell (F5-b1) each save version N+1, through the same verb, with author and client recorded. | F3-a2, F3-b4, F4-b2, F5-a2, F5-b1 |
| **3** | As an FDE wearing the **Architect** hat, I can see a relationship table showing how a new contract fits the existing ones, with any second owner of the same data flagged. | On the Steve and Charles fixture, Challenge gives the 6-row table (charter, Buyer Profile, target-contact research, buyer and persona model, seller field plane, buyer progression spine), each row being owns, feeds, must approve or cannot do. A seeded second owner of one field is flagged as blocking. | F3-b1, F5-a2 |
| **4** | As an FDE wearing the **Lead** hat, I can click Challenge to run AADM interrogate and grill (v0.16.1: `grill_questions`, not `pressure_test`), with the findings becoming fixes or gates on that version. | Challenge (a button on the web, or "check it" in Slack) saves the `interrogate_plan` and `grill_questions` results as write-once attachments on that version (D51). Accepting a fix saves version N+1. A gate is saved with its owner, test, removal condition and date. The fixture gives 0 blocking and the one two-writers gate. Sign-off is refused while a blocking finding is open. | F3-b1, F3-b2, F4-b2, F5-a2 |
| **5** | As an FDE wearing the **Planner** hat, I can place work into the maintained roadmap instead of a new plan. | `plan roadmap` on signed Requirements proposes a place in the workspace's existing roadmap (stage and batch) and saves Roadmap v(N+1). It creates a roadmap only when none exists. The fixture folds into the maintained CR plan, and the imported AADM roadmap stays one roadmap. Web edits to stages, batches and slices save a new roadmap version. | F3-b3, F2-a1, F2-a3, F3-b4, F5-b2 |
| **6** | As an FDE wearing the **Builder** hat, I can get one short, ready-to-run prompt per slice (with the repo rules, do-not-change items, confirm-first facts and required evidence) and say go on that exact version. | `write prompt` gives about 40 lines with the repo rules, the keep list, 2 to 4 confirm-first facts, every verbatim line, the commit read and the required evidence. A prompt with a blocking lint finding stays a draft. Go stores the prompt version and hash; editing the prompt afterwards needs a new Go. The coder gets nothing without a Go. | F2-a2, F2-b1, F2-b2, F2-c1, F2-c2, F4-b3, F4-c2, F5-b3 |
| **7** | As an FDE wearing the **Builder** hat, I can paste a coder report into the slice thread and get ON PLAN or DRIFT, a numbered fix list and the next prompt. | A pasted report saves a Run and its Evidence (commit, files, tests and `predone_review`). The judge replies in the thread with ON PLAN or DRIFT, its reasons, a numbered fix list for DRIFT and the next prompt, and the web shows the same text. Each seeded DRIFT rule fires. The slice turns green only after a person confirms ON PLAN. | F2-c3, F2-d1, F2-b2, F4-c1, F4-b3, F1-a4 |
| **8** | As an FDE wearing the **Owner** hat, I can see the journey map with colors and a You are here marker, and be told which slices need a replan when a new requirements version is signed. | `render map` draws the roadmap in the J1 visual language (green done, amber in progress, gray not started, purple needs replan, a legend and the You are here marker). For the AADM PRD fixture it matches Blueprint's PNG. Signing Requirements v(N+1) marks the linked slices (not started → needs replan, in progress → stop, done stays done) and posts the list to the roadmap thread. | F2-e1, F2-e2, F2-d2, F3-b3, F4-c2, F5-a3 |
| **C1** | As a customer, I can co-sign the requirements in my own words. | A customer member who has been invited and linked writes (or clicks) a sign-off on one version. The Decision stores their exact words, the version and its hash. An agent, a bot or an unlinked Slack user can't sign. An edit after the sign-off makes a new version, which needs a new sign-off. | F3-b2, F4-a3, F4-b3, F1-a2, DM6-a2, DM6-a3 |
| **C2** | As a customer's executive, I can view progress on the map. | A member with the viewer role opens the workspace and sees the map, You are here and slice status, read-only. They see nothing from any other workspace, and they get `forbidden` on every write verb. | F5-a1, F5-a3, F2-e1, F1-a2, DM6-a2, DM6-a3 |

**Proof order:** stories 6, 7, 8 and 5 pass first (F2, Blueprint's own roadmap), then 1 to 4 and C1 (F3, F4), then C2 and the web halves of 2, 5 and 6 (F5).

## A3. Backend in plain nouns

The backend stores **14 things a person would name out loud**. Nothing else is user-facing. Every one of them is saved as **versions**. A change never edits a row in place. It adds version N+1 with its author (a person or an agent), the client it came from (Slack, web or MCP), the Slack thread or web page it came from, its parent version and a content hash. "Signed" or "approved" is never a flag someone flips on a row. It is a **Decision** that points at one exact version.

| Noun | One sentence | Key fields | Links to |
|---|---|---|---|
| **Workspace** | One customer or project, with its people, Slack channel and everything below. | name, kind (personal or customer), members and roles (including viewer), Slack channel, model key (a secret) | owns everything |
| **Idea** | The rough thing someone wants, as they said it. | text or paste, who, where it came from (Slack thread or web) | → Vision |
| **Vision** | What success looks like, who it is for and how we will know. | outcome, users, measures, open questions | Idea → Vision → Requirements |
| **Requirements** (the contract; "Cornerstone" stays as an alias) | What must be true, written so a coder can be held to it. | items (REQ, AC, invariants, thresholds), fixtures, known gaps; attachments: relationship rows and challenge results | Vision → Requirements → Roadmap; ↔ other Requirements |
| **Decision** | A choice made by a person, in their own words. | kind (sign-off, co-sign, Go, ON PLAN or DRIFT confirm, choice), the exact words, who, when, the version and hash it applies to | points at any versioned noun |
| **Roadmap** | The one maintained plan for a workspace's work, which new requirements fold into. | name, the Requirements versions it carries, current position (You are here) | → Stages |
| **Stage** | A column of the roadmap, named by the result it delivers. | name, order, column check | → Batches |
| **Batch** | An ordered group of 2 to 4 slices inside a stage. | name, why, stop point | → Slices |
| **Slice** | One commit's worth of work with a done-check. | does, files, tests, done-check, rollback, keep, depends on, the requirement items it serves, status | → Prompts, Runs |
| **Prompt** | The exact text a coder gets for one slice. | body, repo, the commit it was grounded on, confirm-first facts, keep list, required evidence, lint result | Slice → Prompt → Run |
| **Run** (coder report) | One coder's attempt at one prompt, as reported back. | the report text, commit, files changed, tests run, posted by (a coder through MCP, or a person pasting in Slack) | Prompt → Run → Evidence, Verdict |
| **Evidence** | A checkable fact that came back, never a claim. | kind (commit, test result, `predone_review` result, AADM tool receipt, fixture result), value, source | Run → Evidence; also Requirements → Evidence |
| **Verdict** | ON PLAN or DRIFT for one Run, with reasons and the next prompt. | suggested verdict, reasons and numbered fix list (from the core judges), the confirming Decision, next Prompt or fix Slice | Run → Verdict → next Prompt |
| **Map** | The drawn roadmap at one moment. | image (SVG, PNG), the roadmap version it shows, You are here | Roadmap → Map |

**One version rule for all 14.** Each noun has a list of versions. A version holds its body, parent, author, client, source link, hash and time. (v0.19, D55) Every version, and so every Decision, Run, Evidence row and Verdict, has its own server-made UUID and records the `request_id` of the call that made it (§A17: IDN-06, ART-02). Reading the history of anything means reading that list. There is no separate audit table for the user's work. Requirements, Prompts and Roadmaps freeze at the version a Decision points to, and anything after that is a new version that needs its own Decision. Runs, Evidence and Decisions are write-once. **Relationship rows and challenge results are write-once attachments to one Requirements version (D51).** They don't make a new version; only an edit to the requirements does.

## A4. The 12 verbs

Every client (Slack, the web shell, and AADM Code through MCP) calls the same 12 verbs, and nothing else writes. The web shell edits through these same verbs (D45 (3)). **The set is open (v0.17, D53, §A16):** a later version may add a verb for a client that needs one, through the same envelope; what never changes is that nothing writes outside a verb, and that a Decision (`sign off`, `go`, confirm, and any Decision added later) is originated by a person and never by an agent, a bot or a tracker. The invariant is who may originate a Decision, not the count of verbs.

| # | Verb | What it does | Slack action | Web shell | MCP tool | Hat |
|---|---|---|---|---|---|---|
| 1 | **capture idea** | Saves an Idea and opens a requirements effort | a message starting `idea:` (or `/field idea`) starts an Idea thread | Requirements → New idea | `field_capture_idea` | Product owner |
| 2 | **iterate** | The agent (or a person editing directly) makes the next version of a Vision or Requirements, saving what the agent was asked and answered | reply in the Idea thread | Requirements → artifact → Ask the agent, or Edit | `field_iterate` | Product owner |
| 3 | **challenge** | Relationship rows against the workspace's other contracts, plus `interrogate_plan` and `grill_questions`, saved on the version | "check it" in the thread | Requirements → Challenge | `field_challenge` | Architect, Lead |
| 4 | **sign off** | A person's sign-off or co-sign Decision on one Requirements version | "sign v4", or the Sign button | Requirements → Sign-off | none: people only | Product owner, customer (C1) |
| 5 | **plan roadmap** | Places signed Requirements in the one maintained Roadmap (creating one only if none exists); also imports a plan file | "plan it"; `/field import` | Roadmap → Place requirements, or Import | `field_plan_roadmap` | Planner |
| 6 | **batch** | Proposes or edits stages, batches and slices with done-checks under the batching standard | the agent posts the proposal in the Roadmap thread | Roadmap → Batches and slices (edit) | `field_batch` | Planner |
| 7 | **write prompt** | Writes or edits one prompt for a slice from the library, grounded on a named commit, with the evidence it must return, then lints it | the agent posts the prompt in the slice thread | Roadmap → slice → Prompt (edit) | `field_write_prompt` | Builder |
| 8 | **go** | A person's Go on one prompt version and hash | "go", or the Go button | Roadmap → slice → Go | none: people only (`field_next_slice` pulls after Go) | Builder |
| 9 | **submit report** | Saves a Run and pulls its Evidence | paste the report in the slice thread | Roadmap → slice → Runs → Paste | `field_submit_report` | Builder |
| 10 | **judge** | Suggests ON PLAN or DRIFT with reasons, a numbered fix list and the next prompt; a person confirms | the agent replies; the person writes "on plan" or "drift" | Roadmap → slice → Verdict | `field_judge` (suggests only) | Builder |
| 11 | **replan** | When a new Requirements version is signed, marks the linked slices | the agent posts the affected slices in the Roadmap thread | Roadmap → Replan banner | `field_replan` | Owner |
| 12 | **render map** | Draws the Map for the current Roadmap version | the agent posts the PNG in the Roadmap thread | Roadmap → Map | `field_render_map` | Owner |

The tool names are Blueprint's. The stateless judges (`interrogate_plan`, `pressure_test`, `cross_surface_check`, `delivery_map`, `slice_issues`, `predone_review` and `replan_check`) do the judging, and the verbs store what they return (D38 stands).

## A5. The loop, with what the person has after each step

| Step | Hat | What the person sees | What the agent does | What gets saved | What the person has after this |
|---|---|---|---|---|---|
| 1. Idea | Product owner | Their own words in a Slack thread | Restates the idea and asks the 3 to 5 questions that matter most | Idea v1 | Idea v1 saved, with the vision step open in the same thread |
| 2. Vision | Product owner | A short draft of the outcome, the users and the measures | Drafts it, then revises on each reply | Vision v1…vN, plus each round | A vision version they agree with, and every round behind it |
| 3. Requirements | Product owner | Requirement items, fixtures and known gaps | Drafts the contract and fixtures, and names the gaps | Requirements v1…vN | A requirements version a coder could be held to, with its gaps named |
| 4. Relationships | Architect | A table of how the new contract relates to each existing one | Fills in the owns, feeds, must approve and cannot do rows, and flags any second owner | rows on that version | A checked fit with the existing contracts, with no hidden second owner |
| 5. Interrogation | Lead | Findings marked blocking, warning or note, each with a fix or a gate | Runs `interrogate_plan` and `grill_questions` and proposes the edits | results on that version; fixes as version N+1 | A version with 0 blocking findings, and each risk either fixed or gated |
| 6. Sign-off | Product owner (+ customer, C1) | "Sign v4?" | Asks; never answers | Decision (sign-off, co-sign) | A signed, frozen version, ready to hand off |
| 7. Roadmap placement | Planner | "This goes into Roadmap X, stage Y" | Finds the maintained roadmap and proposes where the work goes | Roadmap v(N+1) | The work placed in the one roadmap, not a new plan |
| 8. Batches and slices | Planner | Batches and slices, each slice with a done-check | Runs `delivery_map` and `slice_issues` under the batching standard | Stage, Batch and Slice versions | Slices of one commit each, every one with a done-check |
| 9. Prompt | Builder | One prompt per slice | Writes it from the library and lints it | Prompt version | A ready-to-run prompt for the next slice |
| 10. Go | Builder | The prompt and a Go button | Waits | Decision (Go), bound to the hash | That exact prompt released to the coder |
| 11. Coder report | Builder | The report and the facts pulled from it | Pulls out the commit, files, tests and `predone_review` | Run plus Evidence | A saved run and its checkable evidence |
| 12. Verdict | Builder | Did it do the thing: what worked, what didn't, and the next prompt (ON PLAN or DRIFT is the label; the evidence sits underneath for anyone who asks, v0.18) | Judges against the slice and its required evidence | Verdict, plus Decision (confirm) | A confirmed verdict, an updated map and the next prompt |
| (any) Map and replan | Owner | The map with You are here; the replan list after a new sign-off | Renders it and runs `replan_check` | Map; slice status changes | Knowing where things stand and what must be replanned |

The loop returns to step 2 or 3 whenever evidence shows a gap: a DRIFT, a failed fixture or a new requirement.

## A6. Where it runs: an agentic backend, an agent worker, Slack first, then a web shell with full editing

- **The backend owns the work** (`aadm-backend`). It runs the verbs and saves every artifact as versions (§A3). The clients hold no logic.
- **The agent worker makes the model calls (D45 (1); FIX-12 amended, D48).** It is a separate start mode, `aadm-agent`, on the private network. It uses a model key per workspace, a secret Brian sets, and it saves nothing. The backend sends it work and saves what comes back. Core (`aadm-core`) and the backend make no model calls. Slice F1-a4.
- **Slack is the primary surface, and in v1 it is Brian's own Slack (D45 (2)).** Customer Slack installs come later.
  - **Workspace ↔ channel.** `/field bind <workspace>` binds one channel to one workspace.
  - **Requirements effort ↔ thread.** An `idea:` message starts the thread, and each reply is an `iterate`. The agent replies with a short summary of the new version and a link to its diff in the web shell.
  - **Roadmap ↔ pinned thread.** Every `render map` posts the PNG and You are here there, and replan notices go there too.
  - **Slice ↔ thread.** A ready prompt is posted as one code block with a Go button. Reports are pasted as replies, and verdicts and next prompts come back as replies.
  - **Decisions are always a person's own words** (D49 phrases): a typed reply or a button, from a Slack user linked to a member with the right role. The exact words are stored at the moment they were written. Bots, apps and the agent never count.
  - **The relay.** Slack's events reach core, which verifies them and forwards them to the backend. The backend still has no public route (FIX-25 amended, D50).
- **The web shell has full editing in v1 (D45 (3)).** It browses and edits everything in both areas, and every edit calls the same verbs as Slack. It holds no business logic: a status, verdict or color is never worked out in the shell (F5-b4). (v0.17, D53: the browse views, the map, the evidence view and co-sign come in Stage F5; full editing, invites, billing, preferences and landing move to Stage F8, after F6, so the core stays thin, §A16.)
- **MCP (AADM Code)** is the third client. Coders pull prompts after a Go and submit reports, and planner agents such as Blueprint can call any verb except `sign off` and `go`.
- **Trackers come later as a fourth client (v0.16.1 note; later stage, not the Field core).** Linear and Jira issues are a projection of a Roadmap version: one issue per Slice, keyed by slice id and version hash, rendered by Field through the same envelope with `client: linear` or `jira` and the issue key in `source_ref` (the F4-b1 thread-mapping pattern); status flows back only as Evidence and Verdicts; an edit typed in the tracker changes nothing until a person pulls it through `batch`; `sign off` and `go` never originate in a tracker. The customer's agent harness then starts from a Field-written issue and talks to AADM Code (`field_next_slice`, `field_submit_report`, the judges), never to Field's database. So `source_ref` and the idempotency key are designed for any client ref, not Slack alone.

## A7. The client-to-backend contract (one contract, three clients)

- **Command:** `{verb, workspace_id, actor (person or agent), client (slack|web|mcp), source_ref (Slack channel and thread ts, page, or MCP session), target {kind, id, expected_version}, input, idempotency_key, request_id, api_version}`.
- **Reply:** `{result, saved: [{kind, id, version, sha256}], next_step (one line for a person), needs_decision?}`. The result families are the 10 from D44 (2).
- **Artifact types:** the 14 nouns of §A3, and no others.
- **Versioning:** every write is version N+1, and `expected_version` stops two writers from overwriting each other. A Decision points at `(kind, id, version, sha256)`.
- **Replan trigger:** a sign-off on Requirements v(N+1) runs `replan_check` over the slices linked to changed items. The result is saved on the Roadmap and posted to the Roadmap thread.
- **Events out:** `artifact.saved`, `decision.recorded`, `run.judged` and `map.rendered`. The Slack adapter posts them, and the web shell refreshes on them.
- **Idempotency:** a Slack event id is the `idempotency_key`, so one Slack retry makes one version, not two (RC-CONC-01). The window is 24 hours (CFG-TECH-18).
- **One voice:** Slack and the shell show the backend's `next_step` and verdict text exactly as returned (RC-AUTH-01, RC-GUIDANCE-01). A reply-shape fixture fails loudly on drift, and N-1 stands (RC-06).
- **Transport (v0.17, D53, §A16):** this envelope is the contract; MCP is how AADM Code reaches it today, and the Slack relay and the web shell's server call are the other two carriers. A later carrier (whatever a coding harness speaks in 2029, a tracker webhook, a CLI) carries the same envelope and the same reply, and no verb, result family or Decision rule changes for it. Nothing in the envelope names MCP.

## A8. Prompt library and required evidence

- **One library per workspace.** It holds templates (slice prompt, fix prompt, doc slice, a step Brian runs by hand), **verbatim lines** (VL-1 to VL-6 plus the "stop and send a batch request" line, stored once and inserted by name) and **standards** (the batching standard).
- **Each Prompt belongs to one Slice.** Versions are kept, and a Go binds one version and its hash.
- **Each Prompt lists the evidence it must return:** the commit SHA, the files changed, the named tests and their counts, the `predone_review` disposition and any AADM tool receipts. A missing item is a reason for DRIFT, not a judgment call.
- **Lint at save:** about 40 lines; the repo rules; the keep (do-not-change) list; the commit read; 2 to 4 confirm-first facts; every verbatim line; no secrets; "Do not push". A blocking finding keeps the prompt a draft.
- **Requirements-side prompting is saved too.** Every `iterate` round stores what the agent was asked and what it answered.

## A9. Evidence from AADM Code flows back

1. The coder pulls the prompt after a Go (`field_next_slice`) and works to one commit with no push.
2. The coder posts the report (`field_submit_report`), or the FDE pastes it in the slice thread. The backend saves a Run and pulls out the Evidence.
3. `judge` compares the Evidence with the slice and the prompt's required evidence. The verdict drawer and the Slack reply follow `aadm://doctrine/guidance-feedback-seam`: the backend's suggestion is shown as returned, and a person's confirmation is fed back as a Decision. The files must stay inside the slice's files, there must be one commit, the named tests must have run, there must be no typecheck or `npm run go` inside the slice, and `predone_review` must say approve. It then suggests ON PLAN or DRIFT with reasons, a numbered fix list and the next prompt.
4. A person confirms. ON PLAN turns the slice green and moves You are here. DRIFT sends the slice back. A DRIFT that exposes a requirements gap opens an `iterate`.

## A10. Workspace navigation and the screens

After choosing a workspace there are **two major areas**: **Requirements gathering** and **Roadmap and delivery** (Brian, t1385u).

```
Workspaces (list)
└── Workspace
    ├── Requirements gathering        (Product owner, Architect, Lead)
    │   ├── Ideas → Idea → Vision → Requirements (versions, diff, edit)
    │   ├── Relationships · Challenge (interrogate + pressure-test)
    │   └── Sign-off ─────────────┐  signed version
    └── Roadmap and delivery        ▼  (handoff: plan roadmap)            (Planner, Builder, Owner)
        ├── Map (You are here) · Stages · Batches · Slices (edit)
        ├── Prompt library (edit)
        └── Slice → Prompt → Go → Runs → Evidence → Verdict → next prompt
    A new signed Requirements version ──► replan ──► affected slices flagged on the Map
```

| Screen | Hat | What the person does | What the agent does | What gets saved |
|---|---|---|---|---|
| Workspaces | any | Picks or creates a workspace, binds its Slack channel and invites people (viewer for a customer executive) | — | Workspace, members |
| Requirements → Ideas | Product owner | Starts or reopens an idea | Lists open efforts with their last version and next step | Idea |
| Requirements → Vision, Requirements | Product owner | Reads, edits directly or asks the agent | Drafts the next version | Vision and Requirements versions, plus each round |
| Requirements → Relationships | Architect | Accepts or corrects rows | Builds the table and flags second owners | rows |
| Requirements → Challenge | Lead | Clicks Challenge, then accepts each fix or gate | Runs `interrogate_plan` and `grill_questions` and proposes edits | results; fixes as version N+1 |
| Requirements → Sign-off | Product owner, customer | Signs or co-signs one version | Asks; never signs | Decision |
| Roadmap → Map | Owner, customer executive | Reads where things stand | Renders | Map |
| Roadmap → Batches and slices | Planner | Accepts the proposal, or adds, moves, splits or edits | Proposes | Roadmap, Stage, Batch and Slice versions |
| Roadmap → Prompt library | Builder | Edits templates and verbatim lines | Lints | library versions |
| Roadmap → Slice | Builder | Reads or edits the prompt, presses Go, pastes reports, confirms verdicts | Writes, pulls evidence, suggests the verdict and the next prompt | Prompt, Decision, Run, Evidence, Verdict |

## A11. First major feature: Blueprint's own work runs from Field (Stage V; v0.17, D53; was Stage F2)

**What moves in:** journeys and stages, batches, slices with done-checks, the prompt library (VL-1 to VL-6, the batch-request line and the batching standard), the PNG journey maps, judging coder reports (ON PLAN or DRIFT with the next prompt) and evidence from AADM Code.

**Acceptance fixtures:**
1. **This PRD's §18 delivery map** (v0.19: 14 stages, 55 batches, 160 slices, 7 done, You are here on DM0-a3; aadm-website `docs/PRD-aadm-delivery-maps.md`), plus `docs/prompts/` in the same repo (17 files: Blueprint's 13 prompts, `prompt-DM0-a2/a3/b1.md` and `D-FIELD-MAIN-2.md`; rule R4). Import parity means equal counts and statuses, every prompt attached to its slice, and the rendered map matching `docs/aadm-delivery-maps-map.png` by structure (F2-e2).
2. **WinBench** (`/workspace/blueprint/winbench/`: 67 prompts, 16 map PNGs and the column plans). The Forge plan (442 slices) is a later stress fixture.

Roadmap and delivery is built before Requirements gathering, for three reasons. Real work exists to import and prove against. Brian uses that loop every day. And requirements need a roadmap to hand off to.

## A12. Worked example: Brian's Codex session, Oct 26, 2026, 6:09 to 6:27 PM ET

| Step and hat | What happened | What Field saves |
|---|---|---|
| 1 Idea (Product owner) | "seller understanding of buyers; buyer altitude" | Idea v1 |
| 2 Vision (Product owner) | Altitude: EXECUTIVE leads leaders, MANAGER leads teams, IC leads self. It is kept separate from function and from authority in a purchase, and is never assigned from a VP title alone | Vision v1 |
| 3 Requirements (Product owner) | SELLER_BUYER_UNDERSTANDING_CONTRACT_V1, plus Zod schemas and the Steve and Charles fixtures; 114 tests pass; 5 gaps named | Requirements v1; Evidence |
| 4 Relationships (Architect) | A 6-row table against the existing contracts | rows on v1 |
| 5 Interrogation (Lead) | 0 blocking; 1 risk (two writers during the migration) turned into a gate | results; v2 with the gate |
| 6 Sign-off | not yet | Brian's "sign v2" |
| 7 Placement (Planner) | Folded into the maintained SELLER_RUNTIME_BUYER_PROFILE_ACTION_GAP_PLAN_V1 | Roadmap v(N+1), with no new roadmap |
| 8 to 12 (Planner, Builder, Owner) | not yet | Slice, Prompt, Run, Evidence, Verdict, Map |

Slice F3-b4 (F3-c1 in v0.16) replays this session as an acceptance test (stories 1 to 5).

## A13. Guarantees under the hood

These are plumbing. They protect the user, but they are not what the user sees, and none of them is the purpose of Field.

| Guarantee | v0.16 |
|---|---|
| Tenancy: one workspace per credential, 0 cross-workspace rows, RLS as a second wall, `actor_id` | Kept (F1-a2, F1-b1) |
| Core saves nothing (FIX-27); source code never crosses (FIX-01); secrets refused (FIX-02, FIX-18) | Kept (F1-b1) |
| People-only Decisions (FIX-03); a signed version never changes (FIX-04) | Kept, worded as Decisions (F3-b2, F4-b3) |
| One set of judges in core (D38, FIX-33) | Kept |
| Plan tags and entitlement (FIX-32, FIX-34, D39) | Kept (DM6-p, DM6-c3) |
| Idempotency, expected version, 24-hour window | Kept (F1-a3, F4-a2) |
| N-1 API window, API version in `/health` | Kept: there are now 3 clients |
| CI gate, startup guard, request IDs, CORS | Kept (v0.18: the guard is F4-g, before the Slack relay; CI is Stage H; v0.19: the backend mints `request_id` in F1-a3, Stage V, and DM0-d1 adds core's handler, the per-hop lines and the metrics) |
| **D44 as is (D45 (4)):** 10 result families, the 9-capability list with side-effect class, the deletion tombstone | **Kept unchanged** (DM2-a3, F1-a3, DM7-a2) |
| Backups, restore drill, operator switches | Kept (F6, DM7-c) |
| FIX-12 "no model calls on the AADM server" | **Amended (D45 (1), D48):** core and the backend make none; the agent worker does |
| FIX-25 "the backend has 0 public routes" | **Kept, with the Slack relay on core (D50)** |
| Open verb set; the transport is replaceable; one Go per slice until a lease exists; re-judge as a new Verdict version | **New (v0.17, D53, §A16)** |
| Every ID a server-made UUID; one `request_id` from the client's call to the version row and the log line; one log line per call and per hop; metrics per verb; Field's measures derived from versions; no second audit table; observability is plumbing, never a customer screen | **New (v0.19, D55, §A17; INV4-MCP, INV4-WEB)** |

## A14. What in v0.15 is off for the Field UX, and where it went

In v0.15 the Field UX drifted toward compliance and monitoring: a five-phase value stream with a health color per phase; 141 settings with presets and approval rules; health roll-ups; risk, access and readiness gates; governance and stakeholder maps; use-case approval with an SLA; pilot co-signs; a history and drift timeline; firm utilization and per-FDE metrics; the Speed Layer rating; Terrain freshness; and a non-goal that blocked editing on the web. **None of these is the Field UX purpose any more.** Under D45 (5) **nothing is deleted from the plan**:

- **47 slices are folded into new slices** that carry their done-checks. The table at the end of §18 lists each one.
- **10 slices (use-case approval DM6-u and DM6-v, and the health colors DM6-g2 to DM6-g4) are folded** into requirements sign-off, delivery status and You are here (D46, Blueprint's default pending Brian).
- **67 slices stay as plumbing or later stages:** F7 (settings, preferences, handover), T (Terrain), 6A, 6B, 6C (the firm layer) and 8. They are built after the core and never shape the core UX (D47).
- **The §3 non-goal "No editing of a plan's structure in the web UI in v1" is withdrawn** (D45 (3)).

## A15. Stage order v0.19 (D53, D54, D55)

| Stage | Result | Batches (slices) |
|---|---|---|
| **0** (kept) | The ground rules are written down and checked | DM0-a (3; 2 done, DM0-a3 is You are here), DM0-i (4; done), **DM0-j** the v0.19 rules in both repos (2; 1 done; docs) |
| **V** (the demo) | The loop runs end to end on Blueprint's own roadmap | DM0-b backend and forwarding (3), **V-a** ports and standard (2), **F1-a** nouns, members, verbs, agent worker (4), **F2-a** registry, import roadmap and prompts (3), **F2-b** `batch` with the order check, `write prompt`, required evidence (3), **F2-c** Go, pull, report (3), **F2-d** judge, map (2) |
| **F3** | Ideas become signed requirements | **F3-a** (2), **F3-b** (4) |
| **F4** | Field runs in Slack (Brian's Slack; kept thin) | **F4-g** core guarded before the relay: release, request IDs and logs on core, metrics, boot guard, CORS (4; v0.18), **F4-a** app (3), **F4-b** threads (3), **F4-c** posting (2) |
| **H** | Hardened before anyone else depends on it | DM0-c standard published, `delivery_map` says batch (2), DM0-e CI (2), DM1-c inventory, model guard, migration lint (3), DM1-e portability, RLS off, core saves nothing proved, plan tags (4), F1-r result codes, org keys (2), **H-a** tenancy suite, export, WinBench (3), **H-b** replan, judgment parity, map parity (3) |
| **F5** | The web shell browses: map, evidence, co-sign | DM5-d (2), **F5-a** views (3) |
| **F6** | Safe to depend on | DM7-c (2), F6-r retention and host move (2) |
| **F8** (later) | The web shell edits everything, and people buy, invite and land | F5-b edits (4), F5-s invites, plan check, last opened (4), DM6-p (4), F5-l preferences and sign-in (4), F5-x extras (4); 20 slices |
| F7, T, 6A, 6B, 6C, 8 (later; plumbing) | Settings and preferences; Terrain; FDE customer context; readiness and pilots; the firm layer; customer data planes | 23 batches, 65 slices |

**Totals:** 14 stages, 55 batches, 160 slices (Field core: 7 stages, 27 batches, 75 slices, of which Stage V is 20; later: 7 stages, 28 batches, 85 slices, of which F8 is 20; v0.18 corrects v0.17's 75 and 83), 162 prompts, 10 done, You are here on **DM0-b2**. Slices to the demo at CV: 22 (DM0-a3, the docs slice DM0-j1, and Stage V); 21 in v0.18; 26 in v0.17; in v0.16.1 the first user-visible result (F2-c) came after 38.

## A16. What must outlast the surfaces (v0.17; Brian, Oct 29, 2026; D53)

Seven principles (the seventh added in v0.18), read into every slice. Each names where it binds today and what it keeps open.

1. **Fleets of agents (v0.18, D54, Brian: "multiple fleets of agent orchestrations are using AADM Field and AADM MCP to code features quickly").** The end state is many agents building one Roadmap at once: an orchestrator (Claude Code, Codex, Blueprint or whatever comes next) is just another client of the envelope. It pulls ready slices in parallel with `field_next_slice`, each agent works one slice, each `submit report` appends its Run and Evidence to that slice, `judge` answers per slice, and the map shows every agent's place. Proof and sign-offs append; nothing is overwritten. What never moves to an agent is a Decision: a person still says go and signs off, though one Go may release a whole ready batch to a fleet. The verbs and the 2-to-4 slice batches were written for one person, one agent, one slice at a time. `expected_version` is the v1 answer; a lease or claim per slice (`claimed_by`, `lease_until`; ADR 005 TEN-04 already has a claim function that DM7-a2 uses) and Verdicts that tolerate concurrent Evidence on one slice are §20 candidates, not Field-core slices. F2-c2 releases one prompt per Go until then.
2. **Planners are the input.** Plan modes and spec-to-plan tools are free in every coding tool. Field is the record and the judge, not a planner. F2-a1 reads this PRD's markdown and a JSON plan shape first, then the files other planners write (GitHub Spec Kit, Kiro, Claude Code plan mode), all into the same Roadmap versions. `batch` (F2-b0) is the same gap from the other side.
3. **Surfaces stay thin.** Twenty-three slices of web authoring, a Slack-first loop and a pixel-parity test are bets on a 2026 interface. The Field core ships the map, the evidence view and co-sign (F5); full editing, invites, billing and landing are F8; Slack is 8 slices and no more (F4-g, the core guard before the relay, is not a Slack slice); F2-e2 compares structure, not pixels.
4. **Judges are versioned and replayable.** Judges written against today's model behaviour will drift. Every Verdict carries `judged_by.policy_revision` (DM1-e4). A re-judge of a stored Run under a newer policy is a new Verdict version and never overwrites the old one; old Evidence is never re-run to be re-judged. The re-judge verb is a §20 candidate.
5. **The verb set is open.** Clients will want verbs not named here. A later verb joins the same envelope. The invariant is that nothing writes outside a verb and that every Decision is originated by a person (§A4).
6. **The transport is replaceable.** The envelope of §A7 is the contract. MCP is today's carrier for AADM Code; the Slack relay and the web's server call are the other two. Whatever a harness speaks in 2029 carries the same envelope, and no verb or Decision rule changes for it.

7. **Figure it out, then get it done (v0.18, D54; rule R6).** The order is fixed: **clarity, focus and precision first** (go slow to go fast: a clear outcome, signed requirements, one roadmap, slices with done-checks); **then speed** (the loop, then fleets); **then proof** (Evidence and verdicts appended as the work runs, so continuing is safe); **compliance tracking last**, as a later reading of proof that already exists, never as a reason to build a slice early. Field's value is the next right commit, sooner: turning a fuzzy idea and half-right plans into one maintained roadmap and the next prompt. Evidence and verdicts serve that answer ("did it work, what's next"); they are not the product and are not sold as attestation or compliance. This replaces the market note of Oct 29 that framed the value as judged provenance.

What ages well, and is kept at the centre: versioned Roadmaps, Evidence and Verdicts as the only inbound channel, Decisions only people make, a policy revision on every Verdict, and source that never leaves the customer. Trackers as a projection (§A6) follow the same rule: Field is the record; everything else is a projection.

## A17. Scope lock and trace rules, as invariants (v0.19; Brian, Oct 29, 2026; D55)

Brian asked for two things to be locked in so they can't creep: the Field scope of rule R6 (no compliance app, no backend dashboard), and observability built in from the first slice, with a UUID on every user action and a way to see what the app is doing and improve it. The recon (v0.19 change note) found that aadm-mcp's `docs/ARCHITECTURE_INVARIANTS.md` already covered request IDs, event rows, JSON logs, the release and secrets in logs, and left five gaps. The rules below close them. This section is the source of their wording; DM0-j1 (INV4-MCP) writes them into aadm-mcp's file with these IDs, DM0-j2 (INV4-WEB, done) mirrors the `[both]` and website ones into this repo's `docs/INVARIANTS.md`, and rule R7 (§18) binds them to every slice. Observability here serves rule R6: it helps a person see what happened and decide what to do next, and it helps Blueprint improve the prompts and the judges; it is never a product surface.

**Identity (one rule, untagged like IDN-01 to IDN-05):**
- IDN-06 Every internal ID (`actor_id`, `workspace_id`, `artifact.id`, `artifact_version.id`, `event_id`, `request_id`, and the ID of every Decision, Run, Evidence row and Verdict) is a UUID that Postgres generates as the column default (`uuidv7()` on Postgres 18 or later, else `gen_random_uuid()`; Brian, Oct 29, 2026); application code and clients never supply one, and no sequence, slug, filename or display name stands in for one (IDN-01, ARCH-19). `request_id`, which exists before any row, is the one exception: the server mints it with the same UUID shape and it is stored on every row the call writes.

**Request context:**
- CTX-06 [mcp] The backend to agent-worker hop carries `request_id`, `workspace_id`, `actor_id`, the verb and `release`; the worker answers with the same `request_id`, and the version that stores what the agent was asked and what it answered records it (F1-a4). A judge call through the registry (DM1-e4) carries the same `request_id`.

**Sources, artifacts and evidence:**
- ART-02 [both] Every `artifact_version` row (the record of one person's or agent's action, PRD §A3) carries its own UUID, `author_actor_id`, `client` (`slack`, `web` or `mcp`), `request_id`, the `idempotency_key` of the call that produced it (null for a server-made version such as a render), `release` and `created_at`. The reply's `saved[]` lists the version UUIDs, and clients use them for every later reference and `expected_version`. One action is traceable end to end, from the client's `idempotency_key` to the server's `request_id` to the version rows it produced and the log line that recorded it, with no second write.

**Events, audit, observability (OBS-01 is retagged `[both]`, so the website's server routes log the same shape):**
- AUD-03 [mcp] Field's user work has no separate audit or action table (PRD §A3, rule R3): Sign, Go, confirm and every edit are `artifact_version` rows (Decisions among them); membership, role, invite, credential, entitlement, retention and privileged writes are `workspace_event` rows. AUD-01 is met by those two tables and the log; nothing adds a third store of user actions.
- OBS-01 [both] Every log line (core, backend, the agent worker and the website's server routes) is one JSON object with `ts`, `level`, `service`, `release`, `request_id`, route or tool, `workspace_id`, `actor_id`, `latency_ms` and the result `code`.
- OBS-03 [mcp] Each service keeps, per verb or route, a request count, a latency histogram and a count per result family, labelled by `client`, credential kind and `release`, and serves them from one operator-only `GET /metrics` route per service (Prometheus text format; on core it needs an operator credential, and on the backend and the agent worker it is on the private network only; none exists today), never from a customer screen.
- OBS-04 [both] Field's own measures (time from Idea to signed Requirements, from Go to a confirmed Verdict, DRIFT rate per prompt template, replans per sign-off, slices done per workspace per week) are read models derived from version `created_at` and Decision rows: never a second write or a new table. They reach a person only inside an answer ("what to do next", PRD rule R6), and they feed the tuning of the prompt library.
- OBS-05 [mcp] `request_id` is the trace key: every hop (client to core, core to backend, backend to the agent worker, backend to a judge through the registry, and every outbound call under INT-01) writes its own log line with the same `request_id` and its own `latency_ms`, so a slow or failed verb is attributed to one hop without a tracing product.

**Field scope (a new section, `Field scope (PRD v0.19, D55; rule R6 of the delivery map)`):**
- FLD-01 [both] Every Field-core slice (PRD §18 Stages 0, V, F3, F4, H, F5 and F6) passes rule R6: it helps a person decide what to do next or get it done. A slice that only proves something to someone else (an auditor, a dashboard, a parity record) lands in Stage H or later, and no slice is pulled earlier than its place in the order clarity, speed, proof, compliance tracking.
- FLD-02 [both] Proof appends and never leads: Evidence, Verdicts and Decisions are written as the work runs and sit one click below the answer; no customer screen, Slack reply or MCP reply leads with evidence, attestation, health colors or counts.
- FLD-03 [both] Compliance tracking, attestation and audit views are the last batch of the plan, after the fleet batch; they are read models over existing Evidence, Verdict, Decision and `workspace_event` rows and add no table, no verb and no required user step.
- FLD-04 [both] Operator observability (`/health`, `/ready`, OBS-01 to OBS-05) is plumbing: it never becomes a customer screen, and no slice adds a dashboard for its own sake.

**Where each rule lands in §18.** IDN-06 and ART-02: F1-a1 (the store) and F1-a3 (the envelope and `saved[]`). CTX-01 and OBS-01 in Stage V: F1-a3 mints the `request_id` and logs each verb call, so the demo's versions are traceable from the first write; DM0-d1 (F4-g) then moves core's own handler and logger onto the same context. CTX-06: F1-a4. OBS-03 and OBS-05: DM0-d1. OBS-04: a backend read model read by F2-d1's verdict reply and F5-a3's card drawer. AUD-03: F1-a1 and rule R3. FLD-01 to FLD-04: every slice, through rule R7; the fleet batch and then the compliance view stay where §20 places them, last.

**What is not added.** No action table, no audit table beyond `artifact_version` and `workspace_event`, no tracing product, no analytics vendor, no customer-facing dashboard. The learn loop is a read model over timestamps that already exist.

---

# Part B. Reference carried from v0.15 (read through §A14; slices cite it by section number; it is not the plan, rule R6)

## Change notes for v0.15 and earlier

Moved to `docs/PRD-aadm-delivery-maps-history.md` in v0.18 (D54), unchanged.

## 1. Problem

Today Blueprint runs delivery mapping by hand on its own box (`/workspace/blueprint`):

- The plan is a Python data file. `src/forge_rebuild_plan_data.py` is 1,304 lines holding 13 stages, 66 batches and 442 slices, built with the helpers `S()`, `L()` and `B()`. A second file, `src/map_forge_rebuild.py`, draws it with PIL into PNGs as large as 4,400 × 4,776 px.
- Version history is file copies. There are **622 `.bak` files** across `src/` and `forge/`.
- Prompts are loose markdown files (82 `forge/prompt-*.md`). Coder reports and ON PLAN / DRIFT verdicts live only in chat.
- Brian copies and pastes every prompt and report between Blueprint and the coder. Nothing links card → prompt → report → verdict.
- The rules live in `CHUNKING_STANDARD.md` and `BLUEPRINT_CANONICAL_RULES.md`, which only Blueprint reads. Map numbers live in `map-registry.md` (next free: 0017).
- Requirements work (step 2 of the method) has no artifact of its own. It happens inside chat and plan files, so nothing gets signed and nothing is frozen. When requirements change, the plan drifts quietly. That is the PR #1374 failure class (circular prerequisites, unset thresholds, stray docs, hidden deletions).

AADM already has most of the *judgment* tools (`prd_outline`, `delivery_map`, `slice_issues`, `interrogate_plan`, `replan_check`, `predone_review`). All of them are stateless, and the host has to carry the plan. No AADM product stores a plan, a prompt, a report or a verdict.

## 2. Users and personas

1. **Brian (architect, approver).** Signs cornerstones, presses go on every slice, and reads the live map. Never copies or pastes prompts.
2. **Planner agent (Blueprint first).** Reads the repo, makes the judgment calls and calls the tools. It never signs and never presses go.
3. **Coder agent (Cursor, Claude Code, Codex).** Pulls its next approved prompt and posts its report back.
4. **Engineers (later AADM customers).** Build in their own repos, in one personal workspace they create themselves (there is no default workspace; D42), and use the same flow as Brian.
5. **Forward-deployed engineers (FDEs).** Work inside customer environments across several customer accounts and repos. What they need:
   - **Per-customer workspaces with strict isolation.** The FDE creates one AADM workspace per customer (our own `workspace` table, not Clerk Organizations) and is its owner. Switching customers changes the active workspace. No search, list, render or export ever crosses workspaces, and agent tokens are scoped to one workspace (§10).
   - **Bringing customer people in.** The FDE invites each customer person by a single-use link with a role (`viewer`, `coder` or `acceptor`) and an expiry (THR-14). The person signs in with their own Clerk account (accounts.aadm.io) and accepts. AADM sends no email in v1; the FDE sends the link.
   - **On-site requirements capture.** A Cornerstone draft can be filled live with customer stakeholders: notes, decisions with named owners, and the FDE named acceptors. The named acceptor (`eval_owner`, D8) joins the workspace with the `acceptor` role so they can co-sign.
   - **Read-only sharing with the customer.** An expiring, view-only link or viewer role for the cornerstone and live map. It never shows other workspaces, and by default it hides raw coder reports.
   - **Handing work to customer coders.** A customer coder (`coder` role, joined by invite) can pull approved prompts and post reports for that workspace only. It cannot sign, press go or edit the plan.
   - **End-of-engagement export.** A transfer package of the signed cornerstone, the plan, prompts, reports, verdicts, renders and history, shaped to the existing FDE outcome contract (§13).

6. **Internal FDE team at a large enterprise, deploying onto its own stack** (design scenario: a large bank's in-house FDE team; not a claim about any named bank). The same flow as an external FDE, but the "customer" is their own organization. They need a Terrain profile of their own platforms (§13b), their own storage and models (§13a, modes (b) or (c)), and their own controls on record (for a US bank, for example, model-risk guidance SR 11-7 and the 2023 interagency third-party guidance; sources in `research-fde-stack-context.md` §4). Public precedent for this pattern: BNY's FDE-lead posting and Mizuho's FDE pilot (same notes, §3).

7. **An FDE firm** (v0.13, D34; design scenario: a firm with 100 FDEs that sells forward-deployed engineering and sets up the configuration layer of customers' core data platforms, Palantir's being one example). It needs one view across all its engagements, playbooks it can reuse at the 40th customer, staffing and quality across its FDEs, its own brand on engagement workspaces, and configuration work treated as first-class (§13p). Customers stay sealed (FIX-06, FIX-28, FIX-29).

Both FDE personas start every engagement in **Terrain** (§13b): what systems, data, APIs, identity, environments, models, storage, controls and owners exist, each fact with a source and a verified date.

**How the FDE flow reuses the FDE tools.** All of these are stateless and store nothing; only `aadm-backend` saves (D30). Delivery maps becomes the host that holds what they judge.

| Tool | Where it runs in the FDE flow |
|---|---|
| `plan_delivery` with `engagement_kind: fde` | At Cornerstone start. It names the acceptors and the outcome contract (`resources/templates/fde-outcome-contract.md`). |
| `invariant_register` | Cornerstone "Define" step. Judges the invariant list. |
| `tenant_isolation_check` | Any slice touching customer tenancy, and our own new tables (DM1). |
| `cutover_parity_check` | Customer table cutovers, plus our export/import parity check (DM7-a). |
| `agent_op_contract_check` | Declares each new write tool: actor, budget and who commits. Agents propose; people commit. |
| `projection_budget` | Checks live-map read timings against §12. |
| `fanout_guide` | Batch slices split across subagents. |
| `lessons_register` | DRIFT verdicts become one-line lessons, stored per workspace. |
| `run_state_control` | Only for the existing optional cache, never for plan storage. |
| `assurance_run` with `engagement_kind: fde` and `sentinel_audit_slice_fde_engagement` | At engagement exit. Checks the transfer package. |

## 3. Goals and non-goals

**Goals**
- G1. One stored, versioned home for the signed cornerstone, the plan (stages, batches, slices), prompts, reports, verdicts and map renders, scoped per workspace.
- G2. Zero copy and paste. The coder pulls its prompt and posts its report through MCP. Brian presses go in the web app.
- G3. A live map with the same visual language as today: stage columns, slice cards, green done, amber in progress, gray not started, purple unclear, a legend, a "You are here" marker, and a column-check box per column.
- G4. A signed, frozen cornerstone is the only input to a delivery map, with full traceability from requirement to slice.
- G5. Requirement changes after sign-off automatically flag the affected slices (replan).
- G6. Work keeps going when AADM sign-in fails, using a local export and mirror.
- G7. **Customer source code never reaches AADM, in any mode.** Only allowlisted derived evidence crosses (§13a.2).
- G8. Customers can keep plan data in their own storage (mode b) or run the whole data plane in their own cloud (mode c), behind the same contracts (§13a).
- G9. Cornerstone and Delivery maps are grounded in a Terrain profile of the target stack, cited by fact ID (§13b).
- G10. Work can land in the customer's code (`code_in_source`) or beside it through the host's extension points (`plug_in`), with the host repo protected (§13l).
- G11. The batching standard is a published AADM standard that the tools enforce by rule ID (§13n).
- G12. In FDE workspaces, work starts only from a use case the customer approved: built from the FDE records by ID, ready by 12 numeric checks, and frozen (§13o).
- G13. A firm runs many engagements from one portfolio, reuses proven playbooks, staffs and compares its FDEs by its own policy, and brands its workspaces, while each customer workspace stays sealed and shares only what its policy allows (§13p).
- G14. Platform configuration work is first-class: configuration facts in Terrain, configuration targets in Cornerstone, and configuration slices with a read-back done-check and a prior-export rollback (§13p.6).

**Non-goals (v1)**
- Agents never sign a cornerstone and never press go. This follows the BIS rule "A tool cannot accept a BIS" (`resources/templates/bis-template.md`, Acceptance Gate 1).
- AADM never scans repos, runs git or runs tests. That stays with the host (aadm-mcp `AGENTS.md:241`).
- No branch, PR or merge workflow. `chunk_branch_check` is not used, because Brian's rule is no branches.
- No billing, seat or plan limits in v1, except plan features checked on the server: `fde_tools` is a Clerk Billing plan feature (D16, decided 11:08 AM ET), and since D36 the MCP tool list follows the caller's subscription (FIX-32). Plans and entitlements follow D-A to D-C.
- No price numbers in this PRD. AADM Field costs the same as AADM Code, and Code + Field is 15% less than the two added together (D36); the actual numbers live in Clerk Billing and Stripe (UNCHECKED here; Brian reads them in DM6-p1).
- No model calls on the AADM server, in v1 or in any mode, unless a later feature is approved with a per-workspace provider config (§13a.3).
- No AADM-side Google Drive integration in v1. Blueprint uploads finished renders (D6, decided).
- ~~No editing of a plan's structure in the web UI in v1.~~ **Withdrawn in v0.16 (D45 (3)):** the web shell edits everything, through the same verbs as Slack (F5-b1 to F5-b4).

## 4. The two stages and the handoff

```
(FDE) chosen use case ──► USE CASE (defined from FDE records, approved, frozen v N) ──┐
                                                                                         ▼
Idea / PRD ──► CORNERSTONE (requirements) ──signed, frozen v N──► DELIVERY MAPS (stages → batches → slices → prompts) ──► coder loop
                    ▲                                                              │
                    └──── amendment = cornerstone v N+1 ◄── replan trigger ◄───────────┘
                          (also on an approved use case v N+1, §13o.5)
```

**v0.9:** in a workspace with `fde_tools`, a Cornerstone can only be created from an **approved use-case version** (§13o). Its C0 step is pre-filled from that version's `OUT-`, `MEAS-`, `SH-` and `HC-` references by ID, so nothing is typed twice. Personal workspaces have no use cases and start at C1 as before.

### 4.1 Cornerstone stage: from idea to a signed cornerstone

The cornerstone document **is a stored, signed Build Intent Specification (BIS)**. Its section set is the BIS template (`resources/templates/bis-template.md`: Outcome, Scope boundaries, User roles, Success criteria, Open questions, Handoff Contract, Acceptance Gate 1) plus Brian's technical sections. Every item gets a stable ID.

| Step | What happens | AADM tools (REUSE) |
|---|---|---|
| C0 Clarify outcomes (v0.7; first) | Desired end state, problem, impact, stakeholders, measures, constraints, assumptions, horizon (§13f) at the kickoff with the sponsor; then the Speed Layer current/future state and the readiness assessment for FDE workspaces (§13g, §13h) | `grill_questions` (`aadm://doctrine/outcome-clarification`), `prd_outline` (stories cite `OUT-`), `speed_layer_assess`, `readiness_assess` (new) |
| C1 Capture | The idea or PRD, plus stakeholder notes taken on site | `prd_outline`, `prism_frame` (one business fact), `plan_delivery` (`engagement_kind: fde` for FDEs) |
| C2 Ground | Terrain facts (`TF-*`, §13b) and repo facts at a noted commit; anything unread is marked UNCHECKED | `terrain_get` (new), `repo_feature_map`, `repo_architecture_map`, `survey_context_brief` (host-provided evidence only) |
| C3 Define | Contracts (`REQ-C*`), data (`REQ-D*`), invariants (`INV-*`), numeric thresholds (`THR-*`), tenancy (`REQ-T*`), each REQ and AC citing an `OUT-` (§13f.3), target UDALI placements (`UDALI-T*`: system, layer or band, intended), user flow and UX designed first (`UX-*`), acceptance criteria (`AC-*`); v0.8: the `delivery_mode` (§13l) and, for `plug_in`, host-contract items (`HC-*`: calls, host version range, scopes, peak rate, owner after handoff) | `user_flow`, `ux_surface_pass`, `signal_stack_outline`, `invariant_register` |
| C4 Challenge | Lint, grill and gap-score the draft | `interrogate_plan` (`plan_kind: prd`), `grill_questions`, `gap_score` (feature roll-up includes PRD/BIS gaps) |
| C5 Decide | Every open decision is `DEC-*` with options, an owner, a default and a due date | `interrogate_plan` `existing_decisions` (its `DEC-` id pattern is reused) |
| C6 Sign | A human signs in the web app. For FDE work the customer `eval_owner` co-signs. | none (people commit) |
| C7 Freeze | Version N becomes immutable and stores a SHA-256 content hash | none |

### 4.2 Handoff contract (cornerstone → delivery map)

A delivery map can only be created from a cornerstone version that meets **all** of these. Which checks refuse and which only warn is CFG-HANDOFF-01; the checks in FIX-21 always refuse (§5):
1. The version is locked (FIX-21): `status = signed` when CFG-LOCK-01 names signers, or `locked` when it is `none`. A signed version carries `signed_by[]` (Brian, plus the customer `eval_owner` for FDE workspaces) and `signed_at`.
2. `content_sha256` is stored and matches the stored body.
3. The BIS core four (Outcome, Scope, User roles, Success criteria) are present and non-empty.
4. Every `THR-*` has a number and a unit. Zero matches for `TBD`, `TODO` or `?`.
5. Every `DEC-*` is either decided, or deferred with an owner, a default and a due date.
6. `interrogate_plan` on the frozen text returned `blocking_count = 0`, and that result is stored with the version.
7. Each repo in scope has a recorded grounding commit.
8. Every cited Terrain fact (`TF-*`) exists in the same workspace, has status `verified`, and is not stale (CFG-STALE-01, CFG-STALE-02).
9. Every `REQ-*` and `AC-*` cites an `OUT-`, and every outcome has a REQ (§13f.3; DM2-o2).
10. At least one outcome has a complete baseline, target and decision owner, and every outcome meets CFG-HANDOFF-02.
11. In an FDE workspace (`fde_tools`): the risk gate CFG-RISK-03 passes (enforced from DM6-e1).
12. **(v0.8)** `delivery_mode` is set (`code_in_source` or `plug_in`). A delivery map can't be saved without it, and the map's mode must equal the cornerstone version's (CS-H2; DM2-m1, DM2-m2).
13. **(v0.8)** For `plug_in`:
    - there is at least one `HC-` item, each holding the CFG-MODE-02 fields, citing a verified, non-stale `extension_point` fact (§13l.2);
    - the map's slices list no host-repo file as edited, except the named registration or config files in `host_registration_files[]` (CFG-MODE-01);
    - the host repo is in every slice's `keep[]`;
    - every slice's rollback is disable or unregister (CS-M1, CS-M2).
14. **(v0.9)** In an FDE workspace (`fde_tools`): the version records `(uc_id, uc_version, uc_content_sha256)` of a use-case version that is `approved` and not `superseded`; the hash matches the stored approved hash; the cornerstone's `delivery_mode` equals the use case's; and every `OUT-`, `MEAS-` and `HC-` reference in the use case appears in the cornerstone with the same item hash, or as a listed amendment (§13o.5; DM6-v3). In a personal workspace this check reads `n/a`.

The delivery map records `(cornerstone_id, cornerstone_version, content_sha256)` and, from v0.8, its `delivery_mode` and the batching-standard version it was checked against. Every slice lists the requirement IDs it satisfies (`REQ-*`, `AC-*`, `INV-*`) and the Terrain facts it relies on (`TF-*`). Any requirement no slice covers shows as a "No slice yet" gap.

### 4.3 When requirements change after the handoff

- A signed version is never edited. A change creates **cornerstone v N+1** (an amendment) with a diff by requirement ID. It needs a new signature to take effect.
- On signing v N+1, the server runs `replan_check`. It passes the diff as `observed_events` (`scope_added`, `assumption_invalidated`), plus the affected slices' `declared_scope_files`.
- The same flow runs when a cited Terrain fact changes (re-crawl or edit): the slices citing it are treated like slices tied to a changed requirement.
- **(v0.9)** The same flow runs when a use case v N+1 is approved: cornerstone versions citing v N show "amendment needed", and slices tracing to the changed references turn purple (§13o.5; DM7-a1).
- Slices tied to a changed requirement:
  - Not started: turn **purple (unclear)** and are blocked from `delivery_map_next_slice`.
  - In progress: get a stop flag, and the next report is judged DRIFT until the slice is replanned.
  - Done: stay green. The planner may add a follow-up slice.
- The planner saves the replanned map against v N+1. Brian presses go again. This matches the BIS "Backward (conflict re-entry)" rule.

## 5. User Configurations and Settings (v0.11; Brian, Oct 25, 2026, 12:43 PM ET)

Brian: "Pull out settings and configurations required into its own section of PRD. so its not buried sprinkled across a bunch of prd paragraphs. change the paragraphs to reference the new 'User Configurations and Settings:' section" (D29).

**This section is the only place a configurable value is written.** Every other section names a setting by its `CFG-` id (or a fixed rule by its `FIX-` id) and points here. The `THR-` ids in §12 stay as stable names, and each one maps to the `CFG-` and `FIX-` ids that hold its values. A coder reads values from this section and, at run time, from `workspace_policy` (5.1). Values are never copied into code comments, prompts or other PRD sections.

### 5.1 How settings work

- **Presets.** Every workspace starts from one preset: **Light**, **Standard** or **Regulated**. Personal workspaces default to Light. Customer (FDE) workspaces default to Standard. Regulated is chosen at creation for regulated customers, for example a US bank under SR 11-7. The **Standard** column holds the values this PRD was designed and tested with (all earlier decisions). Light and Regulated values are Blueprint's examples, to be confirmed (D29).
- **The `workspace_policy` model** (§8; DM1-f1). There is one row per workspace: `preset`, `overrides{policy_key: value}` and `revision`. Every change is an append-only `workspace_policy_event` holding the key, the old and new values, the actor, any co-signers, the reason and the time. **Effective value** = the override when one is set, otherwise the preset's value. The server resolves it, and tools and pages read it through `workspace_policy_get` (§9); pages never compute a setting or a color themselves (`aadm://doctrine/guidance-feedback-seam`). Nothing hard-codes a value.
- **Policy keys** are dotted names, for example `approval.use_case.approvers`. Each key has a type and allowed values, and anything outside them is refused (`policy_invalid`). Keys and their Standard values ship as `aadm://doctrine/workspace-policy-presets` (DM1-f1). The batching standard's `## Limits` (§13n) reads the same keys.
- **Who can change it** (the column used in every table):
  - **Owner (tighten):** the workspace owner may make it stricter at any time. Loosening needs the people CFG-APPROVAL-06 names (Light: the owner alone; Standard: the acceptor and a different named approver, D19), in a human web session, always logged.
  - **Owner:** the owner may change it either way, logged.
  - **Operator:** set by whoever runs the containers (5.18). It is not a workspace setting.
  - **Firm owner** and **Firm owner (tighten)** (v0.13): firm-level keys in `firm_policy` (5.22), with the same preset, override and append-only event model as `workspace_policy`. A firm key never loosens a customer workspace's own setting; where both exist, the stricter applies.
  - **Customer consent:** set only by the people CFG-FIRM-02 names in the customer workspace, in a human web session.
  - **Fixed:** not configurable (5.19). Only five kinds of rule are fixed: security, tenancy, data protection, integrity, and "aadm-core saves nothing" (D30, D31). 5.20 lists six more rules Brian confirmed as fixed (D32). 5.21 lists AADM's own build quality bars, which are not customer settings.
- **The no-sign-off path (Light, D31).** Brian: "some won't sign off ANYTHING". With the Light preset a workspace goes from idea to finished slices with zero approvals, and every step is still logged in `plan_event`:
  1. **Idea → Cornerstone:** the owner or an agent drafts the cornerstone; CFG-LOCK-01 is `none`, so nobody signs, and the version locks when the owner clicks Lock or a map is made from it (then FIX-04 holds).
  2. **Cornerstone → Delivery map:** `delivery_map_save` refuses only on the integrity checks (FIX-21) and on secrets (FIX-18); every other handoff check and `CS-` rule warns (CFG-HANDOFF-01, CFG-BATCH-07).
  3. **Map → slices:** CFG-LOCK-05 is `off` and CFG-RISK-03 and CFG-RISK-04 are `off`, so `delivery_map_next_slice` serves the next slice in order with no Go, risk or access gate.
  4. **Slice → done:** CFG-LOCK-04 is `suggested_on_plan`, so the coder's report with a suggested ON PLAN marks it done; no use-case approval (CFG-APPROVAL-01 `none`) or co-sign is needed anywhere.
- **Versioning.** A cornerstone version, a use-case version, a plan and a prompt each record the `workspace_policy` revision they were checked against. A later change never re-fails a saved artifact until it is saved again.
- **Where to change it.** The workspace **Settings** page (DM5-a3) shows each setting with its preset value, any override, who changed it and when. Agents can read settings but never change them.

Table columns, in every area below: ID · setting · what it controls · policy key · type and allowed values · Light · Standard · Regulated · who can change it · used in.

### 5.2 Workspace and roles

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-WS-01 | Workspace preset | which preset's values apply | `workspace.preset` | `light`, `standard`, `regulated` | personal default | customer default | chosen at creation | Owner at creation; moving to a looser preset needs CFG-APPROVAL-06 | 5.1, §10, DM1-f1 |
| CFG-WS-02 | Roles in use | which roles members can hold | `workspace.roles_enabled` | set of `owner`, `planner`, `coder`, `viewer`, `acceptor` | owner, planner, coder, viewer | all 5 | all 5 | Owner | §10, DM1-a1 |
| CFG-WS-03 | Invite expiry | how long an invite link works | `workspace.invite_expiry_days` | default and max, whole days 1–14 | default 7, max 14 | default 7, max 14 | default 3, max 7 | Owner (tighten) | §2, §10, DM6-a2 |
| CFG-WS-04 | Pending invites | open invites at one time | `workspace.max_pending_invites` | whole number 1–25 | 25 | 25 | 10 | Owner (tighten) | §10, DM6-a2 |
| CFG-WS-05 | Share link expiry | how long a read-only link works | `workspace.share_link_days` | default and max, whole days 1–90 | default 14, max 90 | default 14, max 90 | default 7, max 30 | Owner (tighten) | §7, §10, DM6-b1 |
| CFG-WS-06 | Reports in share links | whether raw coder reports show | `workspace.share_includes_reports` | `hidden`, `owner_opt_in` | owner_opt_in (off by default) | owner_opt_in (off by default) | hidden | Owner (tighten) | §2, §7, §10, DM6-b1 |
| CFG-WS-07 | Members per workspace | the membership cap | `workspace.max_members` | whole number 1–100 | 100 | 100 | 100 | Operator | §10 |
| CFG-WS-08 | Customer workspaces per user | how many a user may create | — (account) | whole number | 50 | 50 | 50 | Operator | §10, DM6-a1 |
| CFG-WS-09 | Data residency region | where this workspace's data is stored | `workspace.residency_region` | a region id | mode (a): the AADM Cloud region; modes (b), (c): the customer's | same | same; a change is refused while a pilot runs | Owner at creation; a change is export then import | §13a.5, DM8-a1 |
| CFG-WS-10 | Data plane mode | where plan data lives | `workspace.data_plane_mode` | `cloud`, `byo_storage`, `self_hosted` | cloud | cloud | byo_storage or self_hosted | Owner at creation; a change is export then import | §13a.4, DM8-a1 |
| CFG-WS-11 | Terrain caps | profiles and facts per workspace | — | whole numbers | 5 profiles; 5,000 facts each | same | same | Operator | §13b, DM1-d1 |
| CFG-WS-12 | Register caps | rows per workspace | — | whole numbers | 50 use cases; 20 versions per use case; 200 risks; 300 access rows; 200 governance entries; 100 stakeholders; 2,000 crosswalk terms per profile | same | same | Operator | §13h, §13i, §13j, §13k, §13o, §13b.6 |

### 5.3 Lock and sign-off mode

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-LOCK-01 | Cornerstone sign-off (lock mode) | who must sign before a version locks; with `none` the version locks when the owner clicks Lock or a map is made from it, and handoff check 1 reads "locked" instead of "signed" | `signoff.cornerstone` | `none`, `owner_only`, `owner_plus_acceptor`, `owner_acceptor_and_approver` | none | owner_plus_acceptor (D8) | owner_acceptor_and_approver | Owner (tighten) | §4.1 C6, §4.2 check 1, §13k, DM2-b3 |
| CFG-LOCK-02 | Gate switch | whether the owner may turn a gate off for the workspace (the rollback switches in DM6-e1 and DM6-v3) | `signoff.gate_switch` | `allowed_logged`, `allowed_with_acceptor`, `not_allowed` | allowed_logged | allowed_with_acceptor | not_allowed | Owner (tighten) | DM6-e1, DM6-v3 |
| CFG-LOCK-03 | Verdict override | what a planner needs to override a suggested verdict | `signoff.verdict_override` | `reason`, `reason_and_owner` | reason | reason | reason_and_owner | Owner (tighten) | §8, DM3-b2 |
| CFG-LOCK-04 | Done rule | what marks a slice `done` | `signoff.done_rule` | `suggested_on_plan` (the server's suggested ON PLAN on a posted report), `final_verdict` (a planner sets the final verdict), `final_verdict_owner` (an owner sets it) | suggested_on_plan | final_verdict | final_verdict_owner | Owner (tighten) | §9 `delivery_map_verdict`, DM3-b2, CFG-HEALTH-09 |
| CFG-LOCK-05 | Go before a slice starts | whether a person must press Go before `delivery_map_next_slice` serves a slice | `signoff.go` | `off`, `cutover_rollout_only`, `every_slice` | off | every_slice | every_slice, plus a change-ticket id on `cutover`/`rollout` slices (G2) | Owner (tighten) | §6, DM3-a2, §13h.8 |

### 5.4 Approvals and co-sign

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-APPROVAL-01 | Use-case approvers | who must approve a use-case version; `none` means a chosen use case can start a cornerstone or pilot once its CFG-UC-02 checks pass, with no review | `approval.use_case.approvers` | `none`, or a set of `decision_owner`, `eval_owner`, `security` | none | decision_owner + eval_owner | decision_owner + eval_owner + security | Owner (tighten) | §13o.4, §13k, DM6-v2 |
| CFG-APPROVAL-02 | One person, both roles | whether one person may fill two approver roles and decide once | `approval.use_case.same_person_both_roles` | yes / no | yes | yes | no | Owner (tighten) | §13o.4, DM6-v2 |
| CFG-APPROVAL-03 | Risk acceptance | who must accept a risk | `approval.risk_accept` | `owner_alone`, or a set of people | owner_alone (logged) | acceptor + named approver | acceptor + named approver + security | Owner (tighten) | §13h.6, §13k, DM6-e1 |
| CFG-APPROVAL-04 | Pilot go/no-go | who decides and co-signs | `approval.pilot_decision` | `decision_owner_alone`, or a set of people | decision_owner_alone | decision owner + acceptor + FDE | decision owner + acceptor + FDE + named approver | Owner (tighten) | §13i.4, §13k, DM6-f4 |
| CFG-APPROVAL-05 | Pilot amendment | who co-signs a metric or criteria change after start | `approval.pilot_amendment` | set | decision owner | decision owner + acceptor | decision owner + acceptor + named approver | Owner (tighten) | §13i.3 rule 3, DM6-f2 |
| CFG-APPROVAL-06 | Loosening a setting | who must agree to loosen any "Owner (tighten)" setting; loosening this setting itself needs the people its current value names | `approval.loosen_setting` | `owner_alone_logged`, `acceptor_and_approver`, `acceptor_approver_and_security` | owner_alone_logged | acceptor_and_approver (D19) | acceptor_approver_and_security | Owner (tighten) | 5.1, D19, DM1-f2 |
| CFG-APPROVAL-07 | Changes-requested list | how many items a "request changes" may list | `approval.changes_items` | whole-number range | 1–20 | 1–20 | 1–20 | Owner (tighten) | §13o.4, DM6-v2 |
| CFG-APPROVAL-08 | Long-pilot approval | who approves a pilot longer than the standard range (CFG-PILOT-03) | `approval.pilot_long` | set | acceptor | acceptor + named approver | acceptor + named approver + security | Owner (tighten) | §13i.3, DM6-f2 |
| CFG-APPROVAL-09 | Segregation of duties | whether the people who wrote or submitted a thing may also decide it (approve a use case, co-sign a cornerstone, accept a risk, press Go) | `approval.segregation` | `off` (allowed, logged), `submitter_excluded`, `authors_excluded` | off | authors_excluded (G7) | authors_excluded, and the acceptor can't be on the FDE side | Owner (tighten) | §13h.3 G7, §13h.6, §13i.4, §13o.4, DM6-e1, DM6-v2 |

### 5.5 Dates, SLAs and reminders

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-DATE-01 | Working-day calendar | how "working days" are counted | `dates.calendar` | `mon_fri_workspace_tz` or a named calendar | mon_fri_workspace_tz | mon_fri_workspace_tz | mon_fri_workspace_tz | Owner | every working-day SLA |
| CFG-DATE-02 | Use-case review SLA | when a decision is due after submit | `sla.use_case_review_wd` | working days 1–10 | 10 | 5 | 5 | Owner (tighten) | §13o.4, CFG-HEALTH-10, DM6-v2 |
| CFG-DATE-03 | Use-case review reminder | when "Needs you" reminds the approvers | `sla.use_case_reminder_wd` | working days, below CFG-DATE-02 | 7 | 3 | 2 | Owner | §13o.4, DM6-v4 |
| CFG-DATE-04 | Stakeholder touchpoints | days between touchpoints, by influence (≥ 4 / 3 / other) | `stakeholder.cadence_days` | 3 whole numbers | 14 / 30 / 60 | 7 / 14 / 30 | 7 / 7 / 14 | Owner (tighten) | §13k, DM6-c2 |
| CFG-DATE-05 | Touchpoint grace | a touchpoint is overdue at cadence plus this | `stakeholder.overdue_grace_days` | days 0–7 | 5 | 3 | 1 | Owner (tighten) | §13k, DM6-c2 |
| CFG-DATE-06 | Risk review cadence | days between reviews, by band (critical / high / medium / low) | `risk.review_days` | 4 whole numbers | 7 / 30 / 60 / 180 | 7 / 14 / 30 / 90 | 3 / 7 / 14 / 30 | Owner (tighten) | §13h.6, §13h.8, DM6-e2 |
| CFG-DATE-07 | Mitigation due dates | latest due date after a risk opens (critical / high) | `risk.mitigation_due_days` | 2 whole numbers | 14 / 60 | 7 / 30 | 3 / 14 | Owner (tighten) | §13h.6, DM6-e1 |
| CFG-DATE-08 | Post-go-live measure checks | the check schedule and the off-target rule | `outcome.measure_check` | first at the by-date; then every N days; stop after K on-target in a row or after M days; off target = missing the target by more than X% of the baseline-to-target gap | N 60, K 2, M 180, X 20% | N 30, K 3, M 180, X 10% | N 14, K 3, M 365, X 5% | Owner (tighten) | §13f.3, DM7-b1, DM7-b2 |

### 5.6 Use case definition template and definition of ready

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-UC-01 | Required definition steps | which of the 10 steps in §13o.2 must be filled | `use_case.required_steps` | subset of steps 1–10 | 1–5 and 8–10 (6 and 7 optional) | 1–10 | 1–10 | Owner (tighten) | §13o.2, DM6-u3 |
| CFG-UC-02 | Checks needed to submit | which UR checks must pass before submit | `use_case.ready_checks` | subset of UR-1 to UR-12 | UR-1–UR-4 and UR-8–UR-12 (UR-5–UR-7 shown as advice) | all 12 | all 12 | Owner (tighten) | §13o.3, §13o.4, DM6-u2, DM6-v1 |
| CFG-UC-03 | UR-1 Outcome | minimum linked outcomes and measures | `use_case.ur1` | ≥ n `OUT-`; ≥ m `MEAS-`, each with baseline (number, unit, as-of date, source) and numeric target; 0 unset fields | n 1, m 1 | n 1, m 1 | n 1, m 2 (one leading, one lagging) | Owner (tighten) | §13o.3 |
| CFG-UC-04 | UR-2 Speed Layer | box rating rule | `use_case.ur2` | ≥ 1 box; share of linked boxes rated (not `not_assessed`) with target ≥ current; minimum confidence | 100%; any | 100%; any | 100%; medium or high | Owner (tighten) | §13o.3, §13g |
| CFG-UC-05 | UR-3 Terrain | cited facts | `use_case.ur3` | ≥ n cited `TF-`; share verified and not stale (CFG-STALE-01) | n 1; 100% | n 1; 100% | n 2; 100% | Owner (tighten) | §13o.3 |
| CFG-UC-06 | UR-4 Delivery mode | mode and host contract | `use_case.ur4` | mode set; for `plug_in`, ≥ 1 `HC-` meeting CFG-MODE-02 and citing a verified `extension_point` fact within CFG-STALE-03 | as stated | as stated | as stated | Owner (tighten) | §13o.3, §13l |
| CFG-UC-07 | UR-5 Readiness | the scoped readiness run's maximum age, and the risk rule | `use_case.ur5` | days 1–30; risk rule = CFG-RISK-03 | 14 days | 7 days | 3 days | Owner (tighten) | §13o.3, DM6-u1 |
| CFG-UC-08 | UR-6 Access | which `ACC-` rows need an owner, lead time and need-by date, with 0 `blocked` | `use_case.ur6` | `critical_path` or `all` | critical_path | critical_path | all | Owner (tighten) | §13o.3 |
| CFG-UC-09 | UR-7 Governance | 0 required in-scope items `missing`, and the largest share `assumed` | `use_case.ur7_assumed_max` | percent 0–50 | 50% | 25% | 10% | Owner (tighten) | §13o.3 |
| CFG-UC-10 | UR-8 Stakeholders | roles that must be named | `use_case.ur8` | set | exactly 1 sponsor; exactly 1 decision owner with A; ≥ 1 user group; 0 A-holders `blocking` | Light, plus an `eval_owner` who is an `acceptor`, and every approver in CFG-APPROVAL-01 with a `member_ref` | Standard, plus a security stakeholder | Owner (tighten) | §13o.3, §13k |
| CFG-UC-11 | UR-9 Pilot shape | the shape must fit the pilot limits | `use_case.ur9` | type in CFG-PILOT-01; sizes within CFG-PILOT-02; weeks within CFG-PILOT-03 | as linked | as linked | as linked | follows the linked settings | §13o.3, §13i.3 |
| CFG-UC-12 | UR-10 Success metrics | the metric rule | `use_case.ur10` | = CFG-PILOT-06, each metric with a numeric baseline, target and floor | as linked | as linked | as linked | follows CFG-PILOT-06 | §13o.3 |
| CFG-UC-13 | UR-11 Acceptance criteria | how many lines, and their form | `use_case.ur11` | count range; each single-line, ≤ 200 chars, citing ≥ 1 `MEAS-` or pilot metric; 0 `TBD`, `TODO` or `?` | 1–10 | 1–10 | 1–10 | Owner (tighten) | §13o.3 |
| CFG-UC-14 | UR-12 Strategy | the highest risk score K that may be defined and piloted (V and F must be set; the Strategy decision is `chosen`) | `use_case.max_k` | 1–5 | 5 (a K 5 use case shows a warning) | 4 | 3 | Owner (tighten) | §13o.3, §13i.2 |
| CFG-UC-15 | Value, feasibility and priority | the V and F anchors, how K is read from the risk bands, and the priority formula | `use_case.scoring` | anchor text per level 1–5; formula `v_times_f` or `v_times_f_minus_k` | Standard's | **V** (share of the linked measure's baseline-to-target gap closed): 1 under 5%, 2 5% to under 15%, 3 15% to under 30%, 4 30% to under 50%, 5 50% or more. **F:** 5 data passes Q1, all access exists, ≤ 2 systems; 4 one of those missing but due in ≤ 2 weeks; 3 two missing, or 3–4 systems; 2 data fails Q1 or access lead time over 4 weeks; 1 no source of truth, or ≥ 5 systems. **K** = the highest open band among linked risks, by band order in CFG-RISK-02 (none 1 … top band 5). **Priority** = V × F | Standard's | Owner | §13i.2, DM6-f1 |

### 5.7 Cornerstone handoff checks and outcomes

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-HANDOFF-01 | Handoff check severities | for each §4.2 check, `refuse`, `warn` or `off`; the integrity checks in FIX-21 always refuse | `handoff.required_checks` | per check 1–14 | FIX-21 refuse; every other check warns | all 14 refuse | all 14 refuse | Owner (tighten) | §4.2, §13m, DM2-b2, DM6-v3 |
| CFG-HANDOFF-02 | Outcomes and measures | the outcome record's counts | `outcome.rules` | outcomes per cornerstone; lagging per outcome; leading per cornerstone (or per outcome); A per outcome | 1–5; ≥ 1 lagging; leading optional; exactly 1 A | 1–5; ≥ 1 lagging; ≥ 1 leading per cornerstone; exactly 1 A | 1–5; ≥ 1 lagging; ≥ 1 leading per outcome; exactly 1 A | Owner (tighten) | §4.2 check 10, §13f.2, DM2-o1 |
| CFG-HANDOFF-03 | First-outcome form | required inputs on the kickoff Outcome card | `outcome.first_inputs` | whole number | 6 | 6 | 6 | Owner | §13f.4, DM5-c1 |

### 5.8 Batching standard checks and prompt lint severities

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-BATCH-01 | Slices per batch | the range, and its severity (CS-S5) | `batching.slices_per_batch` | range; `warn` or `block` | 1–6, warn | 2–4, warn | 2–4, block | Owner (tighten) | §13n, DM2-c4 |
| CFG-BATCH-02 | Files per slice | warn above this (CS-S3) | `batching.max_files_warn` | whole number | 15 | 10 | 8 | Owner (tighten) | §13n, DM2-c4 |
| CFG-BATCH-03 | Primary tests per slice | the required count (CS-T2) | `batching.primary_tests` | whole number | 1 | 1 | 1 | Owner | §13n |
| CFG-BATCH-04 | Prompt length | target lines, warn lines and its severity (CS-P4); the hard cap is PF-01 | `prompt.lines` | target; warn; `warn` or `block` | 60; 120; warn | 40; 80; warn | 40; 80; block | Owner (tighten) | §13n, DM3-a1, DM3-a4 |
| CFG-BATCH-05 | Confirm-first facts | how many facts a prompt confirms first (CS-P6) | `prompt.confirm_first` | range | 1–4 | 2–4 | 2–4 | Owner (tighten) | §13n, DM3-a4 |
| CFG-BATCH-06 | Prompts per slice | the most prompt versions per slice | `prompt.max_versions` | whole number | 5 | 3 | 2 | Owner (tighten) | §13n |
| CFG-BATCH-07 | Rule severities | for each `CS-` rule, `block`, `warn`, `checklist` or `off`; only CS-P10 always blocks (FIX-18); CS-P1 and CS-P7 are proposed fixed (PF-04, PF-05) and block in every preset until Brian decides | `batching.severity` | per rule | CS-P1, CS-P7 and CS-P10 block; every other rule warns | the lists in §13n | Standard, plus CS-S5 and CS-P5 (order) block | Owner (tighten) | §13n, DM2-c4, DM3-a4 |
| CFG-BATCH-08 | Verbatim-line names and extras | the `{approver}` and `{planner}` names in VL-4 and VL-6, plus any extra lines | `prompt.vl_names`, `prompt.extra_lines` | names; extra single-line rules | the workspace's | the workspace's (Brian's: Brian and Blueprint, plus the "Skip baseline_guide…" line) | the workspace's | Owner | §13n, DM3-a4 |
| CFG-BATCH-09 | Git policy | branch policy per plan (CS-G1) | `plan.git_policy` | `no_branches`, `chunk_branch` | no_branches | no_branches | no_branches | Owner, per plan | §3, §8, §13n |

**Alias (v0.13.9, D42 (d)):** CFG-BATCH-01 to CFG-BATCH-09 were CFG-CHUNK-01 to CFG-CHUNK-09 before v0.13.9; the old IDs are aliases for the same settings.

### 5.9 Delivery modes and host limits

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-MODE-01 | Host registration files | named host-repo files a `plug_in` plan may edit | `mode.host_files_max` | whole number 0–10 | 5 | 2 | 1 | Owner (tighten) | §4.2 check 13, §13l, DM2-m2 |
| CFG-MODE-02 | Host-contract fields | what every `HC-` item must hold | `mode.hc_required` | set | host version min and max; ≥ 1 scope with a level; a peak rate; an owner after handoff | same | same, plus a `docs_ref` | Owner (tighten) | §13l.2, DM2-m1 |
| CFG-MODE-03 | Rate-limit headroom (Q9) | planned peak as a share of the documented limit | `mode.rate_headroom_pct` | percent 10–90 | 85% | 70% | 50% | Owner (tighten) | §13h.3, DM6-d4 |
| CFG-MODE-04 | Host-version re-check (Q8) | how recently the host version must be verified before pilot start and before Go on a `cutover` or `rollout` slice | `mode.host_version_verify_days` | days 1–90 | 60 | 30 | 7 | Owner (tighten) | §13h.3, DM6-d4 |
| CFG-MODE-05 | Unknown rate limits | whether `unknown` is allowed | `mode.unknown_rate_limit` | `with_reason`, `refused` | with_reason | with_reason | refused | Owner (tighten) | §13l.1, §13h.3 |
| CFG-MODE-06 | Configuration done-check (v0.13) | how a `configure_only` slice proves the applied change matches the plan | `mode.config_verify_by` | `read_back`, `export_diff`, `both` | read_back | export_diff | both | Owner (tighten) | §13p.6, DM6-w4 |
| CFG-MODE-07 | Prior configuration export (v0.13) | whether a `configure_only` slice must record a prior export (its rollback) before applying | `mode.config_prior_export` | `required`, `warn` | warn | required | required | Owner (tighten) | §13p.6, DM6-w4 |

### 5.10 Risk scales, bands and gates

A workspace sets its scales, bands and band labels. The Standard values are Brian's D18 scale (5 × 5, L × I), so workspaces on the same scale compare; Light can use a simpler scale.

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-RISK-01 | Likelihood and impact scales | the L and I anchors | `risk.scales` | `standard_5x5`, `simple_3x3`, `custom` (one line per level) | simple_3x3 (L and I: 1 low, 2 medium, 3 high, in words) | standard_5x5 (D18). **L:** 1 under 5%; 2 5% to under 20%; 3 20% to under 50%; 4 50% to under 80%; 5 80% or more, or already happening. **I** (share of the threatened outcome's baseline-to-target gap): 1 under 5%, no user notices; 2 5% to under 15% or ≤ 1 week delay; 3 15% to under 35%, ≤ 1 month delay or one measure check missed; 4 35% to under 70%, > 1 month delay or a likely audit finding; 5 70% or more, the outcome can't be met, code, secrets or data cross a wall, a cross-tenant leak, or regulator action. Score = L × I | standard_5x5 | Owner (tighten) | §13h.5, §13g.5, DM6-d1 |
| CFG-RISK-02 | Bands and band labels | the score range and label of each band, in order (the last band is the top band) | `risk.bands` | ordered list of `{label, min, max}` covering every score | low 1–2, medium 3–4, high 6–9 | **low 1–4, medium 5–9, high 10–16, critical 20–25** (D18) | low 1–3, medium 4–8, high 9–14, critical 15–25 | Owner (tighten) | §13h.5, §13h.8, CFG-UC-15, DM6-d1 |
| CFG-RISK-05 | Accepting a top-band residual risk | whether a risk whose residual score is still in the top band may be accepted | `risk.accept_top_band` | `allowed_logged`, `never` | allowed_logged | never | never | Owner (tighten) | §13h.6, DM6-e1 |
| CFG-RISK-03 | Sign and Go risk gate | which open risks block cornerstone Sign, Go on `cutover` or `rollout` slices, and use-case submit (UR-5) | `risk.gate` | `off`, `no_open_critical`, `no_critical_no_unowned_high`, `no_critical_no_high` ("critical" = the top band) | off | no_critical_no_unowned_high (a high needs an owner and a due date) | no_critical_no_high | Owner (tighten) | §4.2 check 11, §13h.8, §13o.3, DM6-e1 |
| CFG-RISK-04 | Access start gate | which `ACC-` rows must be `granted` before a slice starts | `risk.access_gate` | `off`, `critical_path`, `all_needed`, `all_needed_not_expiring` | off | all_needed | all_needed_not_expiring (no row expires within 7 days) | Owner (tighten) | §13h.8, DM6-e1 |
| CFG-RISK-08 | Suggested scores for governance-map gaps | the L and I suggested for a `missing` or `assumed` entry | `risk.gov_gap_suggest` | L and I, 1–5 each | missing L 3 I 3; assumed L 2 I 3 | same | missing L 4 I 3; assumed L 3 I 3 | Owner | §13j |

### 5.11 Readiness checks

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-READY-01 | Terrain "ready to cite" | required sections, each with ≥ 1 verified fact or "n/a" with a reason | `terrain.ready_sections` | set of the 8 required sections in §13b.2 | 8 of 8 | 8 of 8 | 8 of 8 | Owner (tighten) | §13b.2, DM2-t2 |
| CFG-READY-02 | Q1 Data quality and trust | the latest quality check's failed rows and age; owner and source of truth known | `ready.q1` | percent; days | ≤ 5%; ≤ 60 days | ≤ 1%; ≤ 30 days | ≤ 0.5%; ≤ 14 days | Owner (tighten) | §13h.3, DM6-d2 |
| CFG-READY-03 | Q2 Terrain health | required sections, stale cited facts, largest share `proposed` or `stale` | `ready.q2` | sections; count; percent | 8 of 8; 0; ≤ 25% | 8 of 8; 0; ≤ 10% | 8 of 8; 0; ≤ 5% | Owner (tighten) | §13h.3 |
| CFG-READY-04 | Q3 Tests | line coverage per in-scope repo; named tests per `AC-` | `ready.q3` | percent; whole number | ≥ 40%; ≥ 1 | ≥ 60%; ≥ 1 | ≥ 80%; ≥ 1 | Owner (tighten) | §13h.3 |
| CFG-READY-05 | Q4 Observability | logs, metrics and alerts per in-scope production system | `ready.q4` | n of 3; alerts | 2 of 3 | 3 of 3, ≥ 1 alert | 3 of 3, ≥ 1 alert | Owner (tighten) | §13h.3 |
| CFG-READY-06 | Q5 Docs | share of in-scope systems with an owner and a runbook fact | `ready.q5_pct` | percent | 80% | 100% | 100% | Owner (tighten) | §13h.3 |
| CFG-READY-07 | Q6 Release hygiene | deploys through a pipeline, and rollback last tested | `ready.q6_rollback_days` | days | ≤ 180 | ≤ 90 | ≤ 30 | Owner (tighten) | §13h.3 |
| CFG-READY-08 | Q7 Data standards and catalogue | share of in-scope data classes with a standard and a catalogue entry | `ready.q7_pct` | percent | 80% | 100% | 100% | Owner (tighten) | §13h.3, §13g.5 |
| CFG-READY-10 | Relevance R1–R7 | trace and drift rules | `ready.relevance` | R1 share of REQ/AC tracing to an OUT; R2 outcomes without a REQ; R3 slices tracing to a REQ or AC and the largest `enabler` share; R4 stages moving each lagging measure; R5–R7 counts | R1 100%; R2 0; R3 100%, enabler ≤ 30%; R4 ≥ 1; R5–R7 0 | enabler ≤ 20%, otherwise as Light | enabler ≤ 10%, otherwise as Light | Owner (tighten) | §13h.3, DM2-o2 |
| CFG-READY-11 | Access A1–A8 | access hygiene | `ready.access` | A1 share of rows with owner and lead time; A2 requested ≥ lead time before need-by; A3–A8 counts | A1 100%; A2 yes; A3–A8 0 | same | same | Owner (tighten) | §13h.3, §13h.4 |
| CFG-READY-12 | Governance G1–G11 and G13 | each item `met`, `gap` or `n/a` with a reason; pass = 0 required items in `gap`; G7 same-person cases; G13 items before go-live | `ready.governance` | counts | 0 gaps; G7 0; G13 3 of 3 | same | same | Owner (tighten) | §13h.3, DM6-d4 |
| CFG-READY-13 | G12 Security | sourced security controls known per in-scope system, and the security assessment's age | `ready.g12` | n of 4; days | 4 of 4; ≤ 730 days | 4 of 4; ≤ 365 days | 4 of 4; ≤ 180 days | Owner (tighten) | §13h.3, §13g.5 |
| CFG-READY-14 | Governance map coverage | required domains with ≥ 1 `known` entry, and the largest `assumed` share | `governance.coverage` | domains; percent | security, data, architecture, sdlc, third_party (+ model_risk when a model is in scope); ≤ 50% | same domains; ≤ 25% | same, plus privacy and change; ≤ 10% | Owner (tighten) | §13j, §13h.3 G10 |

### 5.12 Pilots

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-PILOT-01 | Pilot types | allowed types | `pilot.types` | subset of `task`, `project`, `program` | task, project, program | task, project | task, project (`program` forbidden) | Owner (tighten) | §13i.3, DM6-f2 |
| CFG-PILOT-02 | Pilot size | users / teams / systems / data classes, and primary use cases per pilot | `pilot.size_max` | 5 whole numbers | 100 / 5 / 8 / 5; 1–3 use cases | 50 / 3 / 5 / 3; exactly 1 | 25 / 2 / 3 / 2; exactly 1 | Owner (tighten) | §13i.3, DM6-f2, DM6-v3 |
| CFG-PILOT-03 | Pilot duration | default; standard range; longer range with CFG-APPROVAL-08; the ceiling | `pilot.weeks` | weeks 1–52 | 6; 2–8; 9–26; 26 | 6; 4–8; 9–12; 12 (D23) | 6; 4–8; 9–10; 10 | Owner (tighten) | §13i.3, DM6-f2 |
| CFG-PILOT-04 | Checkpoint cadence | the most days between checkpoints | `pilot.checkpoint_days` | days | 21 | 14 | 7 | Owner (tighten) | §13i.3, CFG-HEALTH-04 |
| CFG-PILOT-05 | Running pilots | the most pilots running at once | `pilot.max_running` | whole number | 5 | 3 | 2 | Owner (tighten) | §13i.3 |
| CFG-PILOT-06 | Success metrics | count, must-haves and required kinds; each with baseline, target, floor, method, where and owner, linked to a `MEAS-`, set before start | `pilot.metrics` | count range; minimums | 1–5; ≥ 1 must-have; ≥ 1 data-trust | 2–5; ≥ 2 must-have (including the data-trust one); ≥ 1 quality or accuracy; ≥ 1 data-trust | 3–5; ≥ 2 must-have; ≥ 1 quality or accuracy; ≥ 1 data-trust | Owner (tighten) | §13i.3, §13i.4, CFG-UC-12 |
| CFG-PILOT-07 | Go/no-go timing and iteration | red after the end date plus N days with no decision; iterations allowed and their length; total cap | `pilot.decision` | days; count; weeks | N 3; 1 × ≤ 4 weeks; total ≤ 12 | N 1; 1 × ≤ 4 weeks; total ≤ 12 | N 1; 1 × ≤ 2 weeks; total ≤ 10 | Owner (tighten) | §13i.4, DM6-f4 |
| CFG-PILOT-08 | Go recommendation: feedback | the share of cadence periods that must meet the feedback minimum | `pilot.go_feedback_pct` | percent | 50% | 75% | 90% | Owner (tighten) | §13i.4 |
| CFG-PILOT-09 | Feedback cadence | default and longest days between collections | `pilot.feedback_days` | days | 14 / 14 | 7 / 14 | 7 / 7 | Owner (tighten) | §13i.5, DM6-f3 |
| CFG-PILOT-10 | Minimum responses | per period, the greater of N or X% of pilot users (all users if fewer than N) | `pilot.min_responses` | N; percent | 3 or 20% | 5 or 30% | 10 or 50% | Owner (tighten) | §13i.5, DM6-f3 |
| CFG-PILOT-11 | Triage window | working days to triage each feedback item | `pilot.triage_wd` | working days | 10 | 5 | 3 | Owner (tighten) | §13i.5, DM6-f3 |
| CFG-PILOT-12 | Closed loop before decision | share of actionable items closed (change recorded, users told) before go/no-go | `pilot.closed_pct` | percent | 60% | 80% | 95% | Owner (tighten) | §13i.5 |

### 5.13 Value-stream health colors

AADM computes every color on the server and shows the rule that set it (PF-06). How colors roll up is CFG-HEALTH-02. The **Standard** column holds the full rule. Light and Regulated list only the numbers that differ, in the same order.

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-HEALTH-01 | Strategy | the phase's colors | `health.strategy` | days; counts; percent | red at 21 days; amber 1–3 past date | **Green:** ≥ 1 complete outcome signed, 0 assumptions past date, the latest lagging check on target or not yet due. **Amber:** outcomes drafted but unsigned, 1–2 assumptions past date, or a measure off target by ≤ 10% of its gap. **Red:** no complete outcome 14 days after kickoff, ≥ 3 assumptions past date, or a lagging measure > 10% off target 2 checks in a row | red at 7 days; red at ≥ 2 past date; 5% | Owner (tighten) | §13e, DM6-g1 |
| CFG-HEALTH-02 | Roll-up rule | how phase and capability colors roll up into Plan health and the workspace chip | `health.rollup` | `worst_of`, `worst_of_required` (only the phases and capabilities the workspace uses), `off` (no roll-up chip) | worst_of_required | worst_of | worst_of | Owner | §13e, §13m, DM6-g1, DM6-g4 |
| CFG-HEALTH-03 | Readiness | the phase's colors | `health.readiness` | percents | green ≥ 80%; red < 60% | **Green:** 0 open critical, 0 high without owner and due date, 0 critical-path access blocked or past need-by, ≥ 90% of checks passing. **Amber:** 75% to under 90% passing, or ≥ 1 open high that has an owner. **Red:** any open critical, any high without owner or due date, any critical-path access blocked or past need-by, or < 75% passing | green ≥ 95%; red < 85% | Owner (tighten) | §13e, DM6-g1 |
| CFG-HEALTH-04 | Adopt | the phase's colors | `health.adopt` | working days; days; counts | DRIFT open > 5 working days; gate-blocked > 10 days | **Green:** 0 DRIFT verdicts open > 2 working days, 0 slices gate-blocked > 5 days, 0 parity mismatches on any cutover, every running pilot inside its dates. **Amber:** 1–2 DRIFT verdicts open, a slice gate-blocked 3–5 days, or a pilot checkpoint missed. **Red:** ≥ 3 DRIFT verdicts open, a slice gate-blocked > 5 days, any parity mismatch on a cutover, or a pilot past its end date without a go/no-go decision | DRIFT open > 1 working day; gate-blocked > 3 days; red at ≥ 2 DRIFT | Owner (tighten) | §13e, DM6-g1 |
| CFG-HEALTH-05 | Governance | the phase's colors | `health.governance` | percents; counts | assumed ≤ 25% green, > 50% red; overdue reviews > 5 red | **Green:** 0 required governance items missing, ≤ 10% assumed, 0 overdue risk reviews, acceptor named, 0 segregation-of-duties violations. **Amber:** 10% to 25% assumed, 1–3 overdue reviews, or a decision owner's touchpoint overdue (CFG-DATE-04). **Red:** any required item missing, > 25% assumed, > 3 overdue reviews, no acceptor, any segregation-of-duties violation, or an A-role stakeholder marked `blocking` | assumed ≤ 5% green, > 10% red; overdue reviews > 1 red | Owner (tighten) | §13e, §13k, DM6-g1 |
| CFG-HEALTH-06 | Plan: Cornerstone | the capability's colors | `health.cornerstone` | days; counts | red at 30 days; amendment > 14 days | **Green:** the latest version is signed, every required handoff check passes (CFG-HANDOFF-01; check 14 passes when `n/a`), and 0 `DEC-` are past due. **Amber:** a draft with 1–2 failing checks, or an amendment in draft for ≤ 7 days. **Red:** no signed version 21 days after kickoff, ≥ 3 failing checks, or an amendment in draft for > 7 days | red at 14 days; amendment > 5 days | Owner (tighten) | §13m, DM6-g4 |
| CFG-HEALTH-07 | Plan: Batch and slice | the capability's colors | `health.batch_slice` | days; counts; percents | batches outside range ≤ 25% green; purple > 14 days red | **Green:** a saved map with 0 blocking `CS-` findings, 0 uncovered REQs, ≤ 10% of batches outside the CFG-BATCH-01 range, and 0 purple slices older than 7 days. **Amber:** 1–3 uncovered REQs, 11% to 25% of batches outside the range, or a purple slice ≤ 7 days old. **Red:** no saved map 7 days after signing, > 3 uncovered REQs, > 25% of batches outside the range, or a purple slice > 7 days old | purple > 3 days red; no map 5 days after signing | Owner (tighten) | §13m, DM6-g4 |
| CFG-HEALTH-08 | Plan: Prompts | the capability's colors | `health.prompts` | slices; days; working days | `commit_read` green ≤ 30 days, red > 60 | Look-ahead = the next 3 not-started slices in build order (all, if fewer remain). **Green:** each has a `ready` prompt, each `commit_read` is ≤ 14 days old, and served prompts have 0 warnings. **Amber:** 1 look-ahead slice has no `ready` prompt, a `commit_read` is 15–30 days old, or a served prompt has ≥ 1 warning. **Red:** ≥ 2 look-ahead slices have no `ready` prompt, a `commit_read` is > 30 days old, or a slice with Go has waited > 2 working days for a prompt | `commit_read` green ≤ 7 days, red > 14 | Owner (tighten) | §13m, DM6-g4 |
| CFG-HEALTH-09 | Plan: Delivery map | the capability's colors | `health.delivery_map` | minutes; working days | render green ≤ 30 minutes behind, red > 120 | **Green:** the render matches the latest `state_revision` within QB-01 and ≤ 10 minutes after a change; "You are here" is set; 0 slices `done` outside the CFG-LOCK-04 rule; 0 replan triggers unprocessed > 1 working day. **Amber:** the render is 11–60 minutes behind, or a replan trigger has been unprocessed 1–3 working days. **Red:** a render failed or is > 60 minutes behind, any slice is `done` outside the CFG-LOCK-04 rule, or a replan trigger has been unprocessed > 3 working days | replan unprocessed > 1 working day red | Owner (tighten) | §13m, DM6-g4 |
| CFG-HEALTH-10 | Plan: Use case | the capability's colors | `health.use_case` | working days; days | review amber after 7 working days; unapproved red after 30 days | **Green:** every `chosen` use case with a cornerstone or pilot cites an approved, not superseded version; 0 reviews older than CFG-DATE-03; 0 changes-requested items open > 2 working days; 0 changed pinned references unresolved ≥ 1 working day; 0 chosen use cases unapproved > 10 days after being chosen. **Amber:** a review older than CFG-DATE-03 but within CFG-DATE-02, changes requested open 3–5 working days, changed references unresolved 1–5 working days, or a chosen use case unapproved 11–21 days after being chosen. **Red:** a review past CFG-DATE-02, changes requested open > 5 working days, changed references unresolved > 5 working days, a chosen use case unapproved > 21 days after being chosen, or any cornerstone or running pilot citing a superseded or unapproved version | unapproved red after 14 days | Owner (tighten) | §13m, §13o, DM6-g4 |

### 5.14 Speed Layer rating scale

The 30-box canvas and the rating scale are the framework (PF-03, D20, D21). Which boxes a workspace uses is CFG-SL-01.

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-SL-01 | Boxes in use | which of the 30 canvas boxes the workspace rates and shows | `speed_layer.boxes` | `all_30`, `chosen` (the owner picks), `use_case_linked` | use_case_linked | all_30 | all_30 | Owner | §13g, DM6-s1, DM6-s2 |
| CFG-SL-02 | Evidence for a rating | facts needed for any rating other than `not_assessed`, and links needed for a future rating | `speed_layer.evidence` | whole numbers | ≥ 1 `TF-`; future needs ≥ 1 `OUT-` or `UC-` | same | ≥ 2 `TF-`; future needs ≥ 1 `OUT-` or `UC-` | Owner (tighten) | §13g.2, DM6-s1 |
| CFG-SL-03 | Confidence levels | what counts as high, medium and low | `speed_layer.confidence` | rules | **high:** ≥ 2 verified, non-stale facts and owner-confirmed; **medium:** 1 verified fact or the owner's statement; **low:** FDE judgment only | same | same | Owner (tighten) | §13g.2, §13g.4 |
| CFG-SL-04 | Gap to risk | the gap that becomes a Readiness gap (S1), and the suggested likelihood | `speed_layer.gap` | levels; L 1–5 | ≥ 1 level; L 3 for 1 level, L 4 for 2 | same | same | Owner | §13g.5, DM6-s1 |
| CFG-SL-05 | Boxes rated before pilot start | which boxes must be rated before a pilot starts | `speed_layer.pilot_boxes` | `use_case_boxes`, `zone_boxes` | use_case_boxes | use_case_boxes | zone_boxes (every box in the zones the use case touches) | Owner (tighten) | §13g, §13i.2 |
| CFG-SL-06 | M26 overlays | whether the 2026 overlays show | `speed_layer.m26_overlays` | on / off | off | off | off | Owner | §13g, D20 |

### 5.15 Stale-data windows

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-STALE-01 | Terrain fact freshness | days after the last verification before a fact turns `stale` | `stale.terrain_days` | days, 7–365 per section | 180 | 90 | 60 | Owner (tighten) | §4.2 check 8, §13b.4, DM2-t2 |
| CFG-STALE-02 | Identity, access and compliance facts | the same window for those sections | `stale.identity_compliance_days` | days, 7–365 | 60 | 30 | 14 | Owner (tighten) | §13b.4, DM2-t2 |
| CFG-STALE-03 | Extension-point facts | the same window for `extension_point` facts | `stale.extension_point_days` | days, 7–90 | 60 | 30 | 14 | Owner (tighten) | §13l.1, DMT-b4 |
| CFG-STALE-04 | Governance entry confirmation | days unconfirmed before an entry drops to `assumed` | `stale.governance_days` | days | 365 | 180 | 90 | Owner (tighten) | §13j, DM6-c1 |
| CFG-STALE-05 | Platform configuration facts (v0.13) | days before a `platform_*` fact turns `stale` | `stale.platform_config_days` | days, 1–90 | 30 | 14 | 7 | Owner (tighten) | §13p.6, DMT-d1 |

### 5.16 Retention

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-RET-01 | Archive inactive plans | days with no activity before a plan becomes read-only | `retention.archive_days` | days | 90 | 180 (D7) | 365 | Owner | §10, DM7-a2 |
| CFG-RET-02 | Hard delete after close | days after the workspace closes or the engagement ends (an export is taken first, FIX-24) | `retention.delete_days` | days | 30 | 30 (D7) | 90 | Owner | §10, §11, DM7-a2 |
| CFG-RET-03 | Non-finished renders kept | per plan; finished renders stay with the plan | `retention.renders_kept` | whole number | 20 | 20 | 50 | Owner | §10, DM4-a2 |

### 5.17 Notifications

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-NOTIFY-01 | Channel | how people are told | `notify.channel` | `in_app` (AADM sends no email in v1) | in_app | in_app | in_app | Fixed in v1 | §2, §7 |
| CFG-NOTIFY-02 | What counts in "Needs you" | the items listed | `notify.needs_you` | set of sign, go, verdict, risk reviews due, access past need-by, unowned risks, use-case reviews, overdue touchpoints, measures past their check date | all except overdue touchpoints | all | all | Owner | §7, §13e, §13h.9, §13o.6 |
| CFG-NOTIFY-03 | Due-date heads-up | days before a due date (reviews, need-by, decision dates) that an item appears | `notify.lead_days` | days 0–14 | 1 | 3 | 5 | Owner | §13h.9, §13i |
| CFG-NOTIFY-04 | Drive upload of finished maps | whether the planner uploads finished renders to Drive (D6) | `notify.drive_upload` | on / off | on | on | off | Owner | §3, §13a.1, D6 |

### 5.18 Technical settings (operator, not customer)

These are security and runtime settings for whoever runs the containers: Brian for AADM Cloud, or the customer's platform team in mode (c). They are **not** customer governance policies (§13j), not workspace settings, and not subject to D19 or CFG-APPROVAL-06. There are no presets. The operator sets values in the environment or deploy config, and no bot sets or reads them. Env names are UNCHECKED until the slice that adds each one reads the repo.

| ID | Setting | Controls | Key (env or config) | Allowed values | Default | Who can change | Used in |
|---|---|---|---|---|---|---|---|
| CFG-TECH-01 | M2M token lifetime | how long the core → `aadm-backend` token lives | M2M lifetime setting (name set in DM0-a3) | 30–300 s; never above 300 s | 300 s | Operator | §13d, DM0-a3, DM0-b2 |
| CFG-TECH-02 | Backend hop timeout | the core → backend call timeout | hop timeout setting | 1–30 s | 30 s | Operator | §13d, DM0-b2 |
| CFG-TECH-03 | Backend URL | forwarding on (set); unset, core serves stateless tools only and every save tool returns `storage_unavailable` (the rollback, D30) | `AADM_BACKEND_URL` (decided 2:40 PM ET) | URL or unset | unset until DM0-b3 | Operator | §13d, DM0-b2, DM0-b3, DM1-e3 |
| CFG-TECH-04 | Start mode | which entry point the one `aadm-mcp` image runs | `AADM_START_MODE` (decided 2:40 PM ET) | `core`, `backend` | `core` | Operator | §13d, DM0-b1, DM8-b1 |
| CFG-TECH-05 | M2M audience | the token audience `aadm-backend` accepts | audience setting | the string `aadm-backend` | `aadm-backend` | Operator | §13d, DM0-a3 |
| CFG-TECH-06 | Credential cache | how long a verified credential is cached; it is also the revocation lag | `POSITIVE_CACHE_MS` (`src/mcp-auth.ts:22`) | 0–120 s | 120 s | Operator | §10, FIX-10 |
| CFG-TECH-07 | Run-store cache TTL | the optional cache's life (never the plan of record) | run-store TTL (`src/run-store.ts:224`) | 0–3,600 s | 3,600 s | Operator | §12b, §13 |
| CFG-TECH-08 | Signed download URLs | life of render and export URLs | URL expiry setting | 1–15 minutes | 15 minutes | Operator | §9, §13a.1 |
| CFG-TECH-09 | Outage switch | when a planner switches to its local mirror, and how far the mirror may lag | planner-side config | minutes; writes | 15 minutes of failed auth or calls; ≤ 1 write behind | Operator (the planner's host) | §11 |
| CFG-TECH-10 | Invite accept rate limit | failed accepts per IP before 429 | rate-limit config | count per window; block time | 10 per 15 minutes; 429 for 15 minutes | Operator | §10, DM6-a2 |
| CFG-TECH-11 | Customer-storage credential life | federated credential lifetime (modes b, c) | adapter config | 5–60 minutes | 60 minutes | Operator | §13a.4, DM8-a2 |
| CFG-TECH-12 | Data-key cache | how long customer-managed data keys are cached; a revoked key stops reads within this | key cache config | 1–15 minutes | 15 minutes | Operator | §13a.5, DM8-a3 |
| CFG-TECH-13 | License check (mode c) | check interval and offline grace | license config | hours; days | every 24 hours; 30 days grace | Operator | DM8-b3 |
| CFG-TECH-14 | Egress allowlist (mode c) | outbound hosts allowed by default | egress config | host list | ≤ 3 hosts: license, update registry, the customer's IdP | Operator | §13a.5, DM8-b3 |
| CFG-TECH-15 | Ports | container ports | port config | numbers | core 3000 (public); FDE 3100 (private network only) | Operator | §13d |
| CFG-TECH-16 | Telemetry send interval | how often counts are sent | telemetry config | minutes | at most once an hour | Operator | §13a.5, DM8-a3 |
| CFG-TECH-17 | Entitlement caches | core's TTL for its Clerk Billing pre-check (Redis or memory), and the backend's Clerk fallback when its webhook-fed table misses (D-C) | entitlement config | seconds | 60 s each | Operator | §8, §13d, D-C, DM6-c3 |
| CFG-TECH-18 | Idempotency window | how long an `idempotency_key` replays its stored result (API-08) | idempotency window setting (name set in DM2-a2) | 1–72 hours | 24 hours (D44 (6)) | Operator | §10, DM2-a2 |
| CFG-TECH-19 | Backup frequency | how often the backend database is backed up | the host's backup setting or an operator job | hourly to daily | daily (D44 (6)) | Operator (Brian for AADM Cloud; the customer in mode (c)) | DM7-c2, OPS-07 |
| CFG-TECH-20 | Backup retention | how long each backup is kept | the host's retention setting | 7–90 days | 30 days (D44 (6)); the Supabase plan's own retention is UNCHECKED | Operator | DM7-c2, OPS-07 |
| CFG-TECH-21 | Restore drill | when a backup restore is tested; an untested backup doesn't count | runbook schedule | before C7, then every 1–6 months | before C7, then quarterly (D44 (6)) | Operator | DM7-c2, OPS-07 |
| CFG-TECH-22 | `/mcp` CORS allowlist | which browser origins get CORS headers on `/mcp` (XO-01) | allowlist setting (name set in DM0-d3) | origin list | empty in prod (no CORS headers on `/mcp`); localhost origins in dev | Operator | DM0-d3 |
| CFG-TECH-23 | Disabled tools | tools hidden from `tools/list` and refused (OPS-04) | disabled-tools setting (name set in DM7-c1) | tool names | empty | Operator | DM7-c1 |
| CFG-TECH-24 | Go freeze | stops Go and `delivery_map_next_slice`; reads still work (OPS-04) | freeze setting (name set in DM7-c1) | on / off | off | Operator | DM7-c1 |
| CFG-TECH-25 | Environment | `dev`, `qa` or `prod`, reported in `/health` (ENV-05) | environment setting (name set in DM0-d2 and DM5-d1) | `dev`, `qa`, `prod`; required | none: startup fails when unset (DM0-d2, DM5-d1) | Operator | DM0-b4, DM0-d2, DM5-b4, DM5-d1 |
| CFG-TECH-26 | Local open mode | lets core run without `CLERK_SECRET_KEY`, for local dev only (ENV-02) | open-mode setting (name set in DM0-d2) | on / off; refused when CFG-TECH-25 is `prod` | off | Operator | DM0-d2 |

### 5.19 Fixed, not configurable, and why

A rule is fixed only if it is **security, tenancy, data protection, integrity, or "aadm-core saves nothing"** (D30, D31). Everything else is a setting above, or is proposed in 5.20. Brian: "not a hard-coded governance platform".

| ID | What is fixed | Value | Why (kind) |
|---|---|---|---|
| FIX-01 | Customer source code never reaches AADM | 0 code bodies accepted, in every mode | Brian's hard rule (G7, §13a) |
| FIX-02 | Secrets are never stored | key-shaped strings rejected (`aadm_`, `ak_`, `sk_`, `-----BEGIN`, `AKIA`…, `ghp_`, `xox[bp]-`, JWT-shaped); 0 `.env` values | security |
| FIX-03 | People-only actions stay people-only | when a workspace uses a human step (Sign, Go, approve, request changes, reject, accept a risk, loosen a setting), only a signed-in person in a web session can take it; agent credentials get 403 on those routes 100% of the time. Which steps exist is set by CFG-LOCK-01, CFG-LOCK-05 and the CFG-APPROVAL rows | security: a token must never act as a person |
| FIX-04 | A locked version is immutable | once a cornerstone or use-case version locks (per CFG-LOCK-01 or CFG-APPROVAL-01), its row can't be updated, and its stored SHA-256 equals its body; any change is a new version | integrity |
| FIX-06 | Tenant isolation | 0 cross-workspace rows; one credential binds to one workspace and role | §10; THR-12 |
| FIX-07 | What may cross the wall | evidence strings are single-line and ≤ 200 chars (paths ≤ 300, `label` ≤ 120); ≤ 2,000 items and ≤ 512 KB per call; ≤ 100 values per list; unknown keys refused; no code fences or code shapes in any field; stakeholders hold 0 contact fields | data protection: keeps code, secrets and personal data out |
| FIX-08 | Invite tokens | 32 random bytes (256 bits), stored only as SHA-256, single use | security |
| FIX-09 | Owners and membership reads | every workspace keeps ≥ 1 owner; membership and role are read uncached (0 s lag) on every plans-API request | avoid lock-out and stale rights |
| FIX-10 | Credential revocation lag | ≤ 2 minutes (CFG-TECH-06 can only shorten it) | security bound |
| FIX-11 | Customer secrets and telemetry | 0 long-lived customer secrets; telemetry ≤ 12 integer counters per workspace per day, 0 free-text fields | data stays with the customer |
| FIX-12 | No model calls on the AADM server **(amended in v0.16, D45 (1), D48): no model calls in `aadm-core` or `aadm-backend`; the agent worker `aadm-agent` makes them with each workspace's own key** | 0 LLM SDKs in core and backend; build guard (DM1-c3) scoped to them; F1-a4 | §13a.3, §A6 |
| FIX-18 | No secrets in prompts | CS-P10 always blocks: a prompt with a key-shaped string or a `.env` value is saved as `draft` and never served | security |
| FIX-21 | Handoff integrity checks | the cornerstone version exists and is locked (check 1, as CFG-LOCK-01 defines locked); its hash matches its body (check 2); every cited record exists in the same workspace (the existence part of checks 8, 13 and 14) | integrity |
| FIX-24 | Export before delete | every hard delete takes an export first; export and delete work in every mode | D7 |
| FIX-25 | Who can reach the backend (v0.16, D50: Slack events reach the backend only through core's relay) | `aadm-backend` has 0 public routes; only `aadm-core` (with a Clerk M2M token carrying the verified principal) and `aadm-web` (server-side, with the signed-in user's Clerk session) reach it; people-only routes accept only a user session | security (D30) |
| FIX-26 | Data residency changes | a region change is export then import only | §13a |
| FIX-27 | aadm-core saves nothing | core mode opens 0 database connections and writes 0 files; no `PlanStore`, `BlobStore` or database driver is reachable from its entry point; it keeps only TTL cache entries in Redis or memory (MCP session registry, run-store, entitlement cache); every save goes to `aadm-backend` | Brian: "the AADM MCP is touted as 'we don't save anything'. we want to keep it that way in the AADM MCP core" (D30) |
| FIX-28 | Firm roles grant nothing inside a customer workspace | inside a customer workspace only its own `workspace_member` rows count; a firm role alone reads and writes 0 content rows (v0.13) | tenancy (FIX-06 stays true) |
| FIX-29 | The firm reads only the rollup | firm pages and tools read customer workspaces only through `firm_rollup`, at each link's level; no other cross-workspace query exists; an unconsented or revoked link returns 0 rows on the next read (v0.13) | tenancy and data protection |
| FIX-30 | Playbooks carry no customer data | a playbook version is saved only when its strip check finds 0 customer identifiers or values; a failing version is refused, never saved with a warning (v0.13) | data protection and integrity |
| FIX-31 | Platform configuration crosses as names and shapes only | `platform_*` facts hold no values, secrets, data rows or member lists; the same allowlist and filters as FIX-07 (v0.13) | data protection (FIX-01, FIX-02) |
| FIX-32 | MCP shows tools based on the user's subscription | `tools/list` on mcp.aadm.io returns exactly the tools the caller's plan features allow: Free, the free tools only; Code, the Code tools; Field, the Field tools (including the 8 moved FDE tools); Code + Field and an active trial, both; the `shared` planning tools (D38, D40, FIX-34) for Code, Field, Code + Field and active trials only, never Free. The per-tool plan tag is the single source (FIX-34). A call to a tool not listed for the caller is refused server-side (`entitlement_required`), so hiding a tool is never the only guard, and `aadm-backend` re-checks every save. Upgrades, downgrades and trial ends show within the entitlement cache TTL (CFG-TECH-17; 60 s per D-C) (v0.13.1, D36) | Brian's hard rule, Oct 25, 2026, 3:21 PM ET: "MCP must show tools based on user subscription." |
| FIX-33 | One set of judgment tools (v0.13.4, D38) | every judgment a save or host tool stores (handoff checks, `CS-` plan and prompt findings, slice sizing, suggested verdicts, trace orphans, readiness gaps, risk scores, use-case ready results, phase health, Speed Layer gaps, strip checks) comes from a stateless `aadm-core` judge, called through the judgment registry (DM1-e4), and is stored with `judged_by {tool, tool_version, commit}`; `aadm-backend` holds no judgment logic of its own. Test: a parity test that each saved judgment equals the core tool's output for the same input, and an import-graph check that no backend-mode module defines or copies judgment logic (DM3-b4, DM6-g6) | Brian, Oct 25, 2026, 6:15 PM ET: "make sure that field tools also use prd_outline, delivery_map, slice_issues, interrogate_plan, journey_map and predone_review… the field tools use it but save it and we can make the tools better as needed (and deploy for 'all users' via the core mcp)" |
| FIX-34 | Field tools sit behind the Field privilege; every tool declares its plan tag (v0.13.4, D39) | each registered tool declares exactly one plan tag, `code`, `field` or `shared` (plus a `free` flag from the §20 split list; `free` is always false on a `shared` tool, D40); the tag is the single source for `tools/list` filtering and the server-side refusal. Every `field` tool (the 8 FDE tools, every save and host tool for Field data, `config_plan`/`config_diff`/`config_verify`, the Terrain and Firm-layer Field tools, and every future FDE tool) is not listed and returns `entitlement_required` for Code-only and Free sessions. (v0.13.5, D40) The 15 `shared` planning tools (`prd_outline`, `delivery_map`, `slice_issues`, `interrogate_plan`, `journey_map` and `predone_review`; `replan_check`, `grill_questions`, `pressure_test`, `user_flow`, `ux_surface_pass`, `cross_surface_check`, `journey_trace`, `journey_attest` and `gap_score`) are listed for `mcp`, `fde`, `mcp_fde` and active trials only; for Free they are not listed and return `entitlement_required`. A tool with no tag, or a `shared` tool with `free: true`, fails the build (DM1-e5); proof in DM6-p4 | Brian, Oct 25, 2026, 6:17 PM ET: "also make sure that any future tools --- for fde--- we ship in the core and persist as needed for field users. also , we will need to make sure the field tools are behind the field priviledge, and not usable by the aadm code team who doesnt have a field sub" |

### 5.20 Fixed by Brian's decision (Oct 25, 2026, 2:40 PM ET)

These pass none of the five tests cleanly, but Brian confirmed them as **fixed** on Oct 25, 2026 at 2:40 PM ET. Each shows the value every preset uses.

| ID | Rule | Value today | Why it might be fixed |
|---|---|---|---|
| PF-01 | Tool and plan size caps | prompt hard cap 16,000 chars; report ≤ 64,000 chars; plan ≤ 20 stages, ≤ 30 batches per stage, ≤ 600 slices | they are the existing tools' input caps and keep one tenant from slowing the shared service |
| PF-02 | Lengths of human-entered text | human Terrain text ≤ 2,000 chars; outcome fields ≤ 300 chars; constraints and assumptions ≤ 10 items each; risk title ≤ 120, description ≤ 500, control ≤ 200; summaries and reasons for choice ≤ 200; decision and rejection reasons ≤ 300 | short fields keep pasted documents out of plan records |
| PF-03 | The Speed Layer canvas and rating scale | the 30 Figure 17 boxes (D20); ratings `data_aware`, `data_governed`, `data_led`, `not_assessed` (D21); 0 unsourced checklist cells pre-filled. Which boxes a workspace uses is CFG-SL-01 | it is the framework itself; changing it breaks the book's method |
| PF-04 | CS-P1: every prompt records the commit it read | `commit_read` required on every prompt | the PR #1374 failure class: prompts written from memory |
| PF-05 | CS-P7: the verbatim lines VL-1 to VL-6 | the 6 lines appear byte-for-byte (names per CFG-BATCH-08) | they are the coder's safety rules (no mid-column typecheck, no config nudging, stop rules) |
| PF-06 | Colors and checks are computed on the server | the UI shows the server's result and the rule that set it; it never computes its own (`aadm://doctrine/guidance-feedback-seam`) | one source of truth for every color and check |

### 5.21 AADM build quality bars (not customer-facing)

These are engineering bars for **building AADM itself**. They are not customer governance and are not workspace settings.

| ID | Bar | Value |
|---|---|---|
| QB-01 | Performance budgets (p95) | render of 500 slices ≤ 10 s, part ≤ 4,400 px wide, split above 5,000 px tall; live map ≤ 2.0 s, drawer ≤ 500 ms; API write ≤ 300 ms, suggested verdict ≤ 2 s; 600-slice export ≤ 60 s and ≤ 50 MB; `terrain_get` ≤ 500 ms for 5,000 facts; customer adapter write ≤ 500 ms; each transpose view ≤ 2.0 s for 500 systems and 5,000 facts; register ≤ 1.0 s at 200 risks; `readiness_assess` ≤ 3 s for 500 facts and 200 risks, a trigger marks risks within 60 s, re-runs add 0 duplicates; `delivery_map_save` rules ≤ 2 s for 600 slices; prompt lint ≤ 200 ms; use-case ready check ≤ 500 ms for 200 references; `refs_changed` within 60 s |
| QB-02 | Proof bars | cutover parity 0 mismatches; adapter contract suite 100%; portability suite 100% on 2 Postgres hosts; migrations with 0 Supabase-only objects; delete confirmed by a read-back of 0 rows |
| QB-03 | One tool list, one cheap hop | `tools/list` is 100% the same through the front door for a given plan (AADM Field tools are listed only for `fde`, `mcp_fde` and active trials, the Code tools only for `mcp`, `mcp_fde` and active trials, and the 15 `shared` planning tools (`prd_outline`, `delivery_map`, `slice_issues`, `interrogate_plan`, `journey_map` and `predone_review`; `replan_check`, `grill_questions`, `pressure_test`, `user_flow`, `ux_surface_pass`, `cross_surface_check`, `journey_trace`, `journey_attest` and `gap_score`) for `mcp`, `fde`, `mcp_fde` and active trials only, so Field-only users keep them and Free gets none; D33, D36, D38, D40, FIX-32, FIX-34); the core → backend hop adds ≤ 50 ms at p95 |


### 5.22 Firm layer (v0.13, D34)

Rows marked *workspace* live in the customer workspace's `workspace_policy`; the rest live in the firm's `firm_policy` (5.1). Light, Standard and Regulated are Blueprint's examples; a firm's or customer's own policy overrides them.

| ID | Setting | Controls | Policy key | Type and allowed values | Light | Standard | Regulated | Who can change | Used in |
|---|---|---|---|---|---|---|---|---|---|
| CFG-FIRM-01 | Rollup level (*workspace*) | what a linked firm may see of this workspace | `firm.rollup_level` | `none`, `status_counts`, `status_counts_titles`, `content_opt_in` | status_counts_titles | status_counts | status_counts; `content_opt_in` not allowed | Customer consent | §13p.1, DMF-a2 |
| CFG-FIRM-02 | Who consents to a firm link (*workspace*) | who may link, change the level or revoke | `firm.consent_by` | `owner_alone_logged`, `acceptor`, `acceptor_and_security` | owner_alone_logged | acceptor | acceptor_and_security | Owner (tighten) | §13p.1, DMF-a2 |
| CFG-FIRM-03 | Customer sees the firm's view (*workspace*) | whether the customer can open exactly what the firm sees | `firm.customer_can_view_rollup` | `on`, `off` | on | on | on | Customer consent | §13p.1, DMF-a2 |
| CFG-FIRM-04 | Content kinds opted in (*workspace*) | which named content kinds join the rollup at `content_opt_in` | `firm.rollup_content_kinds` | set of `use_case_titles`, `risk_titles`, `outcome_titles`, `terrain_section_status`, `prompt_titles`; never fact fields, prompt bodies or reports | use_case_titles | none | none | Customer consent | §13p.1, DMF-a2 |
| CFG-FIRM-05 | Playbook promotion approval | who approves a pattern into the library | `firm.playbook.approval` | `owner_alone_logged`, `playbook_owner`, `playbook_owner_and_reviewer` | owner_alone_logged | playbook_owner (not the author) | playbook_owner_and_reviewer (2 people, neither the author) | Firm owner (tighten) | §13p.3, DMF-c2 |
| CFG-FIRM-06 | Source-customer notice | whether the source customer is told or asked before a stripped pattern is promoted | `firm.playbook.source_consent` | `not_required`, `notify`, `required` | not_required | notify | required | Firm owner (tighten); a workspace can require it for itself | §13p.3, DMF-c2 |
| CFG-FIRM-07 | Playbook item kinds | which kinds a playbook may hold | `firm.playbook.kinds` | set of `use_case_skeleton`, `cornerstone_sections`, `batch_slice_templates`, `prompt_templates`, `terrain_section_templates`, `risk_checklist`, `readiness_checklist`, `config_patterns` | all 8 | all 8 | all 8 | Firm owner | §13p.3, DMF-c1 |
| CFG-FIRM-08 | People-metric visibility | who sees per-FDE metrics | `firm.people.visibility` | `off`, `aggregate_only`, `self_only`, `self_and_leads` | off | self_only | aggregate_only | Firm owner (tighten) | §13p.4, DMF-d3 |
| CFG-FIRM-09 | Quality metrics in use | which metrics are computed | `firm.people.metrics` | set of `on_plan_rate`, `rework_rate`, `readiness_pass_rate`, `cycle_time` | on_plan_rate, cycle_time | all 4 | all 4 | Firm owner | §13p.4, DMF-d2 |
| CFG-FIRM-10 | Minimum sample | slices needed before a metric shows | `firm.people.min_sample` | whole number 1–200 | 5 | 20 | 30 | Firm owner (tighten) | §13p.4, DMF-d2 |
| CFG-FIRM-11 | Comparison mode | how metrics are compared | `firm.people.comparison` | `off`, `bands`, `targets`, `ranked`; no preset uses `ranked` | off | bands | bands | Firm owner | §13p.4, DMF-d2 |
| CFG-FIRM-12 | Quality bands | green, amber and red cutoffs per metric | `firm.people.bands` | per metric, percent or days | none (no colors) | ON PLAN green ≥ 85%, amber 70–84%, red < 70%; rework green ≤ 10%; readiness pass green ≥ 90% | ON PLAN green ≥ 90%, amber 80–89%, red < 80% | Firm owner | §13p.4, DMF-d2 |
| CFG-FIRM-13 | Capacity per FDE | default hours per week | `firm.capacity_hours_week` | whole number 1–60 | 40 | 40 | 40 | Firm owner | §13p.4, DMF-d1 |
| CFG-FIRM-14 | Utilization warning | allocation that shows a warning | `firm.utilization_warn_pct` | `off` or percent 50–150 | off | 90% | 85% | Firm owner | §13p.4, DMF-d1 |
| CFG-FIRM-15 | White-label fields | which brand fields a firm may set | `firm.brand.fields` | set of `display_name`, `logo`, `colors`; `custom_domain` is later (§20) | display_name, logo | display_name, logo, colors | display_name, logo, colors | Firm owner | §13p.5, DMF-e1 |
| CFG-FIRM-16 | Brand shown to customers | AADM Field brand, firm brand with a "powered by" line, or firm brand only | `firm.brand.mode` | `aadm_field`, `firm_with_powered_by`, `firm_only` | firm_with_powered_by | firm_with_powered_by | firm_with_powered_by | Firm owner; `firm_only` needs Brian (commercial) | §13p.5, DMF-e2 |
| CFG-FIRM-17 | Firm roles in use | which firm roles members can hold | `firm.roles_enabled` | set of `firm_owner`, `firm_admin`, `engagement_lead`, `fde`, `firm_viewer` | firm_owner, fde | all 5 | all 5 | Firm owner | §13p.1, DMF-a1 |
| CFG-FIRM-18 | Start from a playbook | whether a new engagement must start from one | `firm.playbook.start_rule` | `optional`, `suggested`, `required` | optional | suggested | suggested | Firm owner | §13p.3, DMF-c3 |
| CFG-FIRM-19 | Firm preset | which preset's values apply to the firm | `firm.preset` | `light`, `standard`, `regulated` | small-firm default | default | chosen at creation | Firm owner at creation | 5.1, DMF-a1 |

## 6. Daily workflow it must fit

0. **(v0.9, FDE workspaces)** The FDE lead defines the chosen use case from the FDE records and submits it. The customer decision owner and `eval_owner` approve it on aadm.io (§13o). Only then does step 1 open a cornerstone from it.
1. **Brian** asks for a feature. The planner opens a cornerstone draft (C1–C5) and posts it. Brian reads it on aadm.io and signs.
2. **Planner** reads Brian's local dev, writes the delivery map (`delivery_map` to compute the order, then `delivery_map_save` to store it, checked against `aadm://doctrine/batching-standard`, §13n) and runs the pressure tests. It saves one prompt per slice with `delivery_map_prompt_save`. The map renders automatically.
3. **Brian** opens the live map, checks the next card and presses **Go**. Nothing gets served without go.
4. **Coder** calls `delivery_map_next_slice` and gets exactly that prompt, plus the plan and commit context. It works on dev with one commit and no push, as the prompt says.
5. **Coder** posts its report with `delivery_map_report`. The server stores it and returns a *suggested* verdict with reasons (§8).
6. **Planner** reads the report, records ON PLAN or DRIFT with `delivery_map_verdict`, updates status, and writes the next prompt or a fix slice.
7. **Brian** sees the card change color and the "You are here" marker move. He presses go on the next one, or on the column check (typecheck) at the end of a column.
8. Finished renders are uploaded to Google Drive by the planner (v1). The local mirror updates after every write.

Brian still runs git, deploys and prod smoke tests himself. AADM never does.

## 7. UX (designed before build)

All screens live in the existing member area, `aadm.io/member`, which is protected by `src/lib/routes.ts` and `src/middleware.ts`. A new top tab, **Plans**, is added to `src/components/MemberNavTabs.astro`. Astro owns the chrome, and Clerk widgets are not used for these screens (`docs/CLERK-AUTH.md`, "Member chrome architecture").

1. **Workspace switcher** (header). Lists the workspaces where the signed-in Clerk user has a `workspace_member` row: personal first, then each customer workspace, with the active one shown clearly by name and color. Switching reloads every view. The active workspace is a UI choice only; it never changes what an agent credential can reach. A **New customer workspace** action sits at the bottom of the list. **(v0.13.8, D42)** A signed-in user with no membership sees a "No workspace yet" state with **Create workspace** (their personal workspace) and a note that an invite link adds them to someone else's; nothing is created for them.
1a. **Members and invites** (per workspace, owner only to change). Lists members with role, the pending invites with their expiry, and actions: create invite (role, optional email, expiry), copy link, revoke invite, change role, remove member. The last owner can't be removed or demoted.
1b. **Accept invite page** (`/member/invite/<token>`). Signed out: the page shows only "Sign in to accept" (the route is already under `/member(.*)`, `src/lib/routes.ts:8`, and unsigned requests render the sync shell rather than redirect, `src/middleware.ts:50-58`). Signed in: it shows the workspace name, the role and the expiry, with **Accept** and **Decline**. Expired, revoked, used or wrong-email invites show one plain reason and no workspace details.
2. **Plans list.** Each plan's name, linked cornerstone version, delivery mode, slice counts by status, last activity, and a "Needs you" badge (what counts: CFG-NOTIFY-02; channel CFG-NOTIFY-01; due-date heads-up CFG-NOTIFY-03). **(v0.8)** Opening a plan shows the Plan capabilities as tabs: **Cornerstone**, **Batches and slices**, **Prompts** and **Map**. **(v0.9)** In an FDE workspace a **Use case** tab comes first, so the order is **Use case**, **Cornerstone**, **Batches and slices**, **Prompts**, **Map** (§13o.6; DM6-u3). Each tab label shows its gate status (ready checks passed out of 12 and the approval state, failing handoff checks, blocking `CS-` findings, draft prompts, slices waiting for a verdict) and its health color (§13m; DM5-b3, DM6-g4).
3. **Cornerstone view.** Sections with IDs, the open decisions table, the `interrogate_plan` result, version history with a diff, the delivery mode and, for `plug_in`, the **Host contract** panel (§13l.4), and a **Sign** button (human session only; disabled while any handoff check in §4.2 fails, each failing check listed).
4. **Live map.** Stage columns, batch headers, slice cards with ID tag, plain-English name, status color and owner tag (BRIAN, NEEDS AADM). It also shows the column-check box per column, the "MAP END" marker, the legend, "You are here" and (v0.8) the delivery-mode chip. Filters cover status and stage. Rendered from the same SVG as the PNG export.
5. **Card detail drawer** (click a card). Shows:
   - Goal, done-check, inputs and outputs, files, rollback and do-not-change
   - Requirement IDs
   - The prompt, each version with a diff
   - Reports in time order, each with its suggested and final verdict and reasons
   - The **Go** button
   - Comment box
6. **History and drift view.** A timeline of plan events (saved, go, report, verdict, replan, amendment) and a list of DRIFT verdicts with reasons and linked lessons. It also offers "compare map at time A vs B".
7. **Share dialog** (FDE). Creates or revokes a read-only link with an expiry, and picks cornerstone, map or both, with reports hidden by default.
8. **Export button.** Downloads a full workspace or plan export (§11).
9. **Terrain view** (per workspace). The profile's sections (§13b.2: 1–12, 13–15 from §13g.4, and 16 Extension points from §13l.1), each fact with its `TF-` ID, source, last-verified date and a stale flag; the gap list; the UDALI map of the stack; and a **Re-verify** action. Facts are read-only in v1 except status (verify, dispute) and human-entered interview facts.
10. **Data plane settings** (owner only; Stage 8). Mode, adapter, residency region, customer key reference, egress allowlist. Set when the workspace is created; a change runs export then import.
11. **FDE workspace home (v0.7).** The value-stream loop header (Strategy, Plan, Readiness, Adopt, Governance, each with health and open items, §13e) leads to: outcomes and use cases (Strategy), the Speed Layer view (§13g), the five Plan capabilities (Plan, §13m, §13o), the **Readiness and risk** view merged with Terrain's gap list (§13h.9), the live map and pilot cards (Adopt, §13i), and the governance map and stakeholders (Governance, §13j, §13k). Slice cards carry risk badges and access locks. There is no separate risk tab.

12. **Use case tab and approval screen (v0.9, FDE).** The guided definition (§13o.2) as a stepper of pickers over existing records, the 12 ready checks beside it, and, once submitted, the approval screen: version, diff from the last approved version, pinned references, scoped readiness, who must say yes, SLA days left, and Approve, Request changes and Reject. Human web session only (§13o.6; DM6-u3, DM6-v4).

13. **Firm screens (v0.13, AADM Field, §13p).** Each is designed before it is built: a `user_flow` intent interview and a `ux_surface_pass` are saved with the slice before page code, and its `pressure_test` required checks are written and pass.
    - **Portfolio:** a firm switcher, filters and one card per linked engagement (stage, phase colors, risks by band, pilots, readiness, map progress); "not shared" where a link's level stops.
    - **Playbook library:** versions, what each holds, the strip-check result, who approved it, and which engagements used it.
    - **People:** staffing board, utilization against capacity, and quality per CFG-FIRM-08 visibility; "not enough data" under the CFG-FIRM-10 sample.
    - **Firm settings and brand:** `firm_policy` rows (like the Settings page, DM5-a3) and the brand fields with a live preview.
    - **Customer side:** in a linked workspace, a "What your firm sees" panel (CFG-FIRM-03) with the link's level and a Revoke button.
14. **Terrain, Platform configuration section (v0.13).** Object types, links, actions, pipelines, permission and integration names, with ages and stale flags; the configuration gap view (current against `PC-` targets).
15. **The AADM Field page (v0.13, D33; aadm.io/field, confirmed by Brian, D36).** One page on the public site, linked from the existing nav, for enterprises and consultancies; the rest of aadm.io stays AADM Code. Its job: explain AADM Field, carry the promise line word for word, and carry the sign-up and plan CTAs (prices per D36; a number appears only when Brian supplies it). Producer writes the copy; this PRD names only the page and its job (§13q.1, DM5-a4).

Empty, loading and error states are needed on every screen. The sign-in failure state says "AADM can't verify you right now. Your planner keeps a local copy," not a blank page.

## 8. Data model

Every table carries `workspace_id`. Every child row also carries `plan_id`. History is append-only. **(v0.14, D43, IDN-01, ARCH-19)** Every first-class table has an internal `id`; human keys such as `slice_id`, `batch_id`, `TF-<n>`, `RISK-<n>` and `UC-<n>` are unique labels inside their scope, never identity, and DM1-c1's data inventory lists each table's immutable fields. **(v0.14, D43, IDN-02, IDN-03)** A person is an internal `actor_id` (table `actor`); the Clerk or OIDC `(issuer, subject)` is a mapped reference held only in `actor`. Every member, entitlement, preference, approval and event table keys people by `actor_id`, and every `actor`, `*_by` and `consent_actor` column below holds an `actor_id`. The request actor (who is calling now) and the effective workspace scope are resolved per call by DM2-a1 and never stored on the session. (v0.13) The firm tables below carry `firm_id` instead; they hold no customer content, and they reach customer workspaces only through `firm_workspace_link` and the `firm_rollup` view (FIX-28, FIX-29).

| Entity | Key fields |
|---|---|
| actor (v0.14, D43) | actor_id (internal), user_issuer (Clerk's issuer in modes (a) and (b); the customer's OIDC issuer in mode (c)), user_subject (the Clerk `user_…` id, text), created_at; unique (user_issuer, user_subject). The only table that holds the external identity; created on first verified sign-in (an identity row, not a workspace, so IDN-05 holds) (DM1-a1) |
| workspace | id, name, kind (`personal` or `customer`), created_by_actor_id, retention_policy, status (`active`, `closed`), closed_at. At most one `personal` workspace per actor (unique on creator + kind=personal), made only when the user asks (IDN-05). No Clerk Organization id. |
| workspace_member | workspace_id, actor_id (v0.14, D43; the issuer and subject live in `actor`, so mode (c) still needs no migration); role (`owner`, `planner`, `coder`, `viewer`, `acceptor`), added_by, added_at; unique (workspace_id, actor_id); last_opened_at (v0.13.3, nullable; set only by a person's web-session open, DM6-a5) |
| workspace_invite | id, workspace_id, role (never `owner`), token_sha256 (the raw token is never stored), invited_email (nullable), created_by, created_at, expires_at, accepted_by_actor_id, accepted_at, revoked_at |
| agent_credential_binding | workspace_id, credential fingerprint (SHA-256, never the secret), role, created_by |
| user_pref (v0.13.3, D37) | actor_id (unique; v0.14, D43), landing_product (`field`, `code` or null), setup_card_dismissed (boolean), updated_at. Per person, not workspace content, so it carries no `workspace_id` (like the firm tables); people-only routes; lives in `aadm-backend` (D30) (DM6-a4) |
| cornerstone | id, workspace_id, title, current_version |
| cornerstone_version | cornerstone_id, version, body (JSON plus markdown), content_sha256, status (`draft`, `signed`, `superseded`), signed_by[], signed_at, interrogate_result, grounding_commits{}, **delivery_mode** (`code_in_source`, `plug_in`; required, v0.8), plug_in_kind (nullable: `configure_only`) |
| cornerstone_item | cornerstone_version, item_id (`REQ-*`, `AC-*`, `INV-*`, `THR-*`, `DEC-*`, `UX-*`, `UDALI-T*`), kind, text, value and unit (for THR), owner and default and due (for DEC) |
| plan | id, workspace_id, cornerstone_id, cornerstone_version, cornerstone_sha256, name, state_revision, git_policy (`no_branches` default; `chunk_branch` per `aadm://doctrine/chunk-branch`; v0.14: `chunk_branch` and that doctrine are live names kept in their delivery-map sense until a later rename slice, §20), **delivery_mode** (equals the cornerstone's), plug_in_kind, host_repo (nullable), host_registration_files[] (CFG-MODE-01), standard_version (v0.8) |
| stage | plan_id, stage_key (e.g. `1`, `0b`), name (named by its result), order, column_check_cmd |
| batch | plan_id, stage_key, batch_id (e.g. `F1-k`), name, why, done_check, stop_point |
| slice | plan_id, batch_id, slice_id (e.g. `F1-k2`), title, does, inputs, outputs, files[], tests[], done_check, rollback, keep (do not change), deps[], req_ids[], owner_tag, size (S1–S5 verdict), status (`not`, `prog`, `done`, `unc`), go_at, go_by, go_prompt_version, go_prompt_sha256 (v0.14, D43, ARCH-14: Go binds to the exact prompt version and hash it approved) |
| prompt | slice_id, version, body_md, repo, commit_read (required, CS-P1), line_count, created_by, status (`draft`, `ready`; v0.8), lint_findings[] (rule, severity, detail), standard_version |
| report | slice_id, prompt_version, body_md, commit_sha, files_changed[], tests_run[], posted_by, posted_at |
| verdict | report_id, suggested (`ON_PLAN`, `DRIFT`), reasons[], final (`ON_PLAN`, `DRIFT`), set_by, set_at |
| map_render | plan_id, state_revision, format (svg or png), part (1..n), sha256, storage_key, finished (bool), drive_file_id, drive_sent_by, drive_sent_at: **reserved for a later version, not in v1** (v0.15, D44 (1); AUTH-54; supersedes v0.14 D43 P15's person-pressed "Send to Drive"). v1 migrations don't create these columns, and the backend makes no Drive call. Blueprint uploads finished maps (D6, §3, §6 item 8, CFG-NOTIFY-04) |
| plan_event | plan_id, seq, type, actor, payload_digest, at (the append-only history; every version view is rebuilt from it) |
| terrain_profile | id, workspace_id, name (the platform or stack), status, created_by (cap per CFG-WS-11) |
| terrain_fact | fact_id (`TF-<n>`), profile_id, section (one of the 12 in §13b.2), kind (allowlist kind, §13a.2), fields (allowlist-shaped JSON), source_kind (`repo_crawl`, `import`, `interview`, `manual`), source_ref (commit SHA, file content hash or interview id), last_verified_at, status (`proposed`, `verified`, `stale`, `disputed`) |
| terrain_fact_event | fact_id, seq, type (`created`, `verified`, `changed`, `disputed`, `stale`), actor, at (append-only) |
| workspace_data_plane | workspace_id, mode (`cloud`, `byo_storage`, `self_hosted`), adapter, residency_region, cmk_key_ref (a reference only, never key material), egress_allowlist[], telemetry (`counts`) — Stage 8 |
| cornerstone_item (v0.7 kinds) | adds `OUT-*`, `MEAS-*`, `SH-*` (outcome record, §13f.2) and `SL-T*` (Speed Layer future-state items, §13g.2) |
| cornerstone_item (v0.8 kind) | adds `HC-*` host-contract items (§13l.2): calls[], host_version_min, host_version_max, scope_names[] with level, peak_calls_per_min, owner_after_handoff (`SH-`), cited `extension_point` `TF-` facts |
| entitlement (v0.7.1, D-B/D-C) | actor_id (v0.14, D43; was user_id), feature, source (`clerk_billing`, `contract`, `license`), expires_at; lives in `aadm-backend` only (D30); fed by Clerk billing webhooks relayed through core; the backend re-checks it on every call with a cached Clerk fallback; core pre-checks from Clerk with a TTL cache and never reads this table (CFG-TECH-17). **Per user, never per workspace (v0.14, D43: "Field unlocks by each user's own plan")**: every call is checked against the calling actor's own features; in a shared customer workspace a member whose own plan lacks `fde_tools` gets `entitlement_required` on Field tools and screens even when other members have it. "FDE workspace" or "`fde_tools` workspace" elsewhere in this PRD names a `customer` workspace (its kind), not a workspace-level entitlement |
| outcome_measure_check | measure_id, value, checked_by, at, on_target (append-only; DM7-b1) |
| risk, risk_event | §13h.6 fields; events append-only with actor and time |
| access_item, access_event | §13h.4 fields; events append-only |
| readiness_check_result | workspace_id, check_id (`Q1`…`S1`), pass, value, at |
| governance_item, governance_event | §13j fields |
| stakeholder | §13k fields (no contact details) |
| speed_layer_rating | §13g.2 fields, one row per box per workspace |
| use_case, pilot, pilot_amendment, pilot_feedback, pilot_decision | §13i fields |
| use_case (v0.9 fields, §13o) | one row per `(uc_id, version)`; **version**, parent_version, **status** (`draft`, `ready`, `in_review`, `approved`, `changes_requested`, `rejected`, `superseded`), refs[] `{id, kind, source_revision, item_sha256}` (`OUT-`, `MEAS-`, `SLR-`, `TF-`, `HC-`, `RISK-`, `ACC-`, `GOV-`, `SH-` with role), pilot_shape (type, users, teams, systems, data classes, weeks, metrics), acceptance_criteria[] (CFG-UC-13), **definition_ready_results** `[{check, pass, value, threshold, ref_ids}]` (UR-1 to UR-12, THR-59), submitted_by, submitted_at, submitted_sha256, sla_due_at, **content_sha256** (set at approval, equals submitted_sha256), **approvals[]** (read from `use_case_approval`), refs_changed (bool, list); rows in `in_review` or `approved` can't be updated |
| use_case_approval (v0.9) | uc_id, version, role (the CFG-APPROVAL-01 roles; CFG-APPROVAL-02 says whether one person may hold two), decision (`approve`, `changes_requested`, `reject`), reason (FIX-07; required for reject), items[] (CFG-APPROVAL-07, naming a `UR-` check or a step; required for changes requested), actor (workspace member), session_kind (`web` only), at. Append-only |
| workspace_policy (v0.11, D29) | workspace_id, preset (`light`, `standard`, `regulated`), overrides `{policy_key: value}` (keys and types from `aadm://doctrine/workspace-policy-presets`), revision; values resolve per §5.1; written only through the web settings routes (DM1-f2) |
| workspace_policy_event (v0.11) | workspace_id, seq, policy_key, old_value, new_value, actor, co_signers[], reason, at. Append-only |
| workspace_event (v0.14, D43, ARCH-18) | workspace_id, seq, type (`workspace_created`, `workspace_closed`, `member_added`, `member_removed`, `role_changed`, `invite_created`, `invite_accepted`, `invite_revoked`, `credential_bound`, `credential_revoked`), actor (actor_id), subject_actor_id (nullable), old_value, new_value, reason (nullable), at. Append-only; written in the same transaction as the change it records (DM2-a1, DM6-a2, DM6-a3, DM1-a2) |
| workspace_deletion_tombstone (v0.15, D44 (5); DATA-03, DATA-04, AUD-01; name UNCHECKED) | workspace_id, deleted_by (`actor_id` or `retention_job`), deleted_at, export_sha256, row_counts (JSON: table name → count), release, request_id. One row per hard-deleted workspace. It sits outside the workspace tables and outside RLS, holds no name, email, content or evidence value, and only the DATA-03 privileged retention role can insert it. Nothing updates or deletes it. |
| firm (v0.13) | id, name, preset, status (`active`, `closed`), created_by (actor_id, v0.14), created_at. Our own table, like D4 |
| firm_member (v0.13) | firm_id, actor_id (v0.14, D43), firm_role (CFG-FIRM-17), status, added_by, added_at |
| firm_policy, firm_policy_event (v0.13) | the same shape as `workspace_policy` and `workspace_policy_event`, keyed by firm_id (5.22) |
| firm_workspace_link (v0.13) | firm_id, workspace_id, status (`proposed`, `active`, `revoked`), rollup_level, content_kinds[], consent_actor, consent_co_signers[], consent_at, revoked_by, revoked_at. Every change is an event |
| firm_rollup (v0.13, a server view, not a table) | one row per active link: the customer-approved label, stage, phase colors with rule ids, counts (risks by band, pilots by state, readiness passed and failed, slices by state), map progress, last activity date; plus only the opted-in kinds (CFG-FIRM-04). No other column |
| playbook, playbook_version (v0.13) | playbook: id, firm_id, name, owner, status. Version: playbook_id, version, parent_version, items (template kinds per CFG-FIRM-07), content_sha256, strip_check_result, source_link_id, proposed_by, approved_by[], approved_at. Approved versions are immutable |
| playbook_use (v0.13) | playbook_id, version, firm_id, workspace_id, applied_by, applied_at, draft_ids[] |
| firm_assignment (v0.13) | firm_id, actor_id (v0.14), link_id, engagement_role, allocation_pct, start_on, end_on |
| firm_capacity (v0.13) | firm_id, actor_id (v0.14), hours_per_week (CFG-FIRM-13 default), unavailable ranges |
| firm_brand (v0.13) | firm_id, display_name, logo_blob_ref (BlobStore), colors (primary, accent), brand_mode (CFG-FIRM-16), custom_domain (null; later) |
| config_change (v0.13, on `slice`) | platform, pc_ids[], planned_change_sha256, prior_export_sha256, verify_by (CFG-MODE-06), verify_result. Names and shapes only (FIX-31) |

`slice` also gains `terrain_fact_ids[]`, and in v0.7 `access_ids[]` and `risk_ids[]`; `stage` gains `outcome_ids[]`. In v0.8, `slice` gains `repo` (the plugin repo for `plug_in`), and each `files[]` entry becomes `{path, tag: REUSE | ADAPT | NEW, reason}` (CS-R1). `use_case` gains a required `delivery_mode`. In v0.9, `cornerstone_version` gains `uc_id`, `uc_version` and `uc_content_sha256` (handoff check 14); `pilot` gains `uc_version` and `uc_content_sha256`; `stakeholder` gains `member_ref` (the workspace member who may decide for that `SH-` row; no contact details). `terrain_fact` gains section 16 and kind `extension_point`. `verdict` gains `set_by = import` for imported done slices (DM3-b3).

The slice fields mirror today's `S()` helper in `src/forge_rebuild_plan_data.py:15-19` and the statuses mirror `N, U, D, P` at `:4`, so Blueprint's existing plans import 1:1. The statuses `not`, `prog`, `done` and `unc` match the color map at `src/map_forge_rebuild.py:10`.

**Suggested verdict (deterministic, server side).**
- DRIFT if:
  - `files_changed` falls outside the slice `files[]` (the same rule as `replan_check`'s `declared_scope_files`)
  - there is more than one commit
  - the tests run are not in `tests[]`
  - the report shows a typecheck or `npm run go` run inside a slice
  - `predone_review` was not `approve`
  - `repo_evidence_binder` ATTESTATION lines are missing
  - (v0.8) in a `plug_in` plan, `files_changed` touches the host repo outside a named registration or config file
- Otherwise ON PLAN.

The planner records the final verdict. It can override the suggestion, but an override requires what CFG-LOCK-03 sets (a reason in every preset). The suggestion is shown as a recommendation, never as a decision, per `aadm://doctrine/guidance-feedback-seam` (SEAM-13).

## 9. New MCP tools (on mcp.aadm.io)

The naming follows the server's snake_case `noun_verb` style and groups under the existing `delivery_map` family. **Each tool stores what an existing stateless tool computes. None duplicates one (§16).** (v0.13.4, D38, FIX-33) A save or host tool gets every judgment by calling the stateless core judge through the judgment registry (DM1-e4) and stores the output with `judged_by {tool, tool_version, commit, policy_revision, standard_version}` (v0.14, D43, ARCH-17: the workspace policy revision and the AADM Standard version the judgment used); it never computes order, findings or verdicts itself. The write tools use the existing `AADM_RUN_STATE_MUTATION_ANNOTATIONS` (`src/tools.ts:4606-4610`). Every write takes `expected_revision` and `idempotency_key`, the same contract as `src/run-store.ts` (`RunStoreWriteOptions`, `revision_conflict`, `idempotency_conflict`).

| Tool | Inputs | Outputs |
|---|---|---|
| `cornerstone_save` | workspace, cornerstone_id?, body (BIS sections plus items, including `HC-` items for `plug_in`), delivery_mode (required, v0.8), plug_in_kind?, expected_revision, idempotency_key | cornerstone_id, version (draft), handoff_checks[] (pass or fail per §4.2), interrogate summary |
| `cornerstone_get` | cornerstone_id, version? , diff_from? | body, items, status, signatures, content_sha256, diff |
| `delivery_map_save` | cornerstone_id plus version (must be signed), the plan as a `delivery_map`-shaped JSON (stages, batches, slices with the §8 fields; until DM0-c3 lands the live `delivery_map` output also carries the legacy `chunks`/`chunk_id` keys, which save maps to `batches`/`batch_id`), delivery_mode, host_repo?, host_registration_files[]?, expected_revision, idempotency_key | plan_id, state_revision, findings `{rule (CS- ID), severity, slice_id?, detail}` as returned by the core `interrogate_plan` (`plan_kind: delivery_map`) judge with `judged_by` (D38; save never computes or reorders the order `delivery_map` returned), from `aadm://doctrine/batching-standard` (cycles, unset thresholds, stray docs, deletions without rollback, uncovered requirements, sizing, column checks, git policy, `plug_in` rules; §13n), standard_version, render job id. Any blocking finding refuses the save |
| `delivery_map_get` | plan_id, slice_id?, at_revision? | plan or slice with prompt, report and verdict history; "you are here" |
| `delivery_map_prompt_save` | plan_id, slice_id, body_md, commit_read (required; refused without it, CS-P1), expected_revision, idempotency_key (v0.14) | prompt version, line_count, status (`ready`, or `draft` when any blocking lint finding), lint findings by `CS-` rule ID (sections, title, confirm-first, verbatim lines VL-1 to VL-6, one slice, no secrets, no typecheck or go in tests, over the CFG-BATCH-04 line count, over the PF-01 cap; §13n) |
| `delivery_map_next_slice` | plan_id | The one slice that has go (or, when CFG-LOCK-05 is `off`, the next slice in build order) and no report: prompt, slice card, plan and cornerstone refs. Otherwise `nothing_approved` with a one-line reason. (v0.14, D43, ARCH-14) It serves exactly the prompt version Go recorded (`go_prompt_version`, `go_prompt_sha256`); if the current prompt differs, it returns `conflict` (sub-code `prompt_changed_after_go`) and serves nothing until Go is pressed again. |
| `delivery_map_report` | plan_id, slice_id, prompt_version, body_md, commit_sha, files_changed[], tests_run[], predone_verdict, evidence lines, expected_revision, idempotency_key (v0.14) | report_id, suggested verdict, reasons |
| `delivery_map_verdict` | report_id, final, reason (required if it overrides), new slice status, expected_revision, idempotency_key (v0.14) | verdict_id, plan state_revision |
| `delivery_map_render` | plan_id, parts? (auto-split), finished? | SVG and PNG URLs (signed; expiry per CFG-TECH-08), sha256 per part |
| `delivery_map_export` | workspace or plan_id, format (`zip`) | Signed download URL (expiry per CFG-TECH-08), manifest with sha256 per file |

| `terrain_fact_save` | workspace, profile_id, facts[] in the **evidence allowlist schema** (§13a.2), source (kind plus commit SHA or content hash), expected_revision, idempotency_key | fact IDs, created/changed/unchanged counts, rejected items with field and reason (`evidence_rejected`) |
| `terrain_get` | workspace, profile_id, section?, fact_ids? | facts with source and age, stale flags, the gap list (§13b.4), the UDALI placement summary |
| `speed_layer_assess` (v0.7, `aadm-backend`) | workspace, box ratings and checklist entries, expected_revision, idempotency_key (v0.14) | ratings, S1 gaps |
| `readiness_assess` (v0.7, `aadm-backend`) | workspace, scope (all or the checks a trigger touched) | per-type counts, gaps, proposed risks (idempotent by gap) |
| `risk_save`, `risk_get`, `access_save` (v0.7, `aadm-backend`) | §13h.4 and §13h.6 fields, expected_revision, idempotency_key | rows, computed score and band, gate status |
| `governance_save`/`get`, `stakeholder_save`, `use_case_save`/`list`, `pilot_save` (v0.7, `aadm-backend`) | §13i, §13j and §13k fields; `use_case_save` requires `delivery_mode` (v0.8) | rows, refusals naming the limit |

| `use_case_save` (v0.9, extended) | workspace, uc_id?, the §13o.2 step references by ID, pilot_shape, acceptance_criteria[], new_version? (required to change an approved UC), expected_revision, idempotency_key | uc_id, version, status (`draft` or `ready`), **definition_ready_results[]** (UR-1 to UR-12 with value and threshold), refusals (`ref_not_found`, `ref_kind_mismatch`, `version_frozen`) |
| `use_case_get` (v0.9) | uc_id, version?, diff_from? | the version with its references, ready results, approvals, SLA and a diff by reference ID |
| `use_case_submit` (v0.9) | uc_id, version, expected_revision, idempotency_key | submitted_sha256, approvers (the CFG-APPROVAL-01 roles, by `SH-`), sla_due_at (CFG-DATE-02); refused while any CFG-UC-02 check fails, with the failing checks named |
| `workspace_policy_get` (v0.11) | workspace_id, keys[]? | each key's effective value, preset value, override (if any), revision and "who can change" rule (§5). Read only: there is **no** MCP tool to change a setting |
| `portfolio_get` (v0.13, `aadm-backend`, `firm_layer`) | firm_id, filters? | one row per linked engagement from `firm_rollup` only; `not_shared` for fields above a link's level |
| `playbook_propose` (v0.13, `aadm-backend`) | firm_id, source workspace, item kinds, expected_revision, idempotency_key | a draft version with its strip-check result; `customer_data_found` names each field that failed (FIX-30). Approval is a web-only human step |
| `playbook_get` / `playbook_apply` (v0.13, `aadm-backend`) | playbook_id, version; for apply: workspace_id, idempotency_key | the version; for apply, the draft ids created and a `playbook_use` row |
| `config_plan` (v0.13, `aadm-core`, stateless) | `PC-` items, current `platform_*` facts | an ordered change set (names and shapes), suggested slices with done-checks and rollback; saves nothing |
| `config_diff` (v0.13, `aadm-core`, stateless) | two shape-only exports reduced on the host | the diff as names and shapes; values are refused (FIX-31) |
| `config_verify` (v0.13, `aadm-core`, stateless) | the planned change set, the applied diff | `match` or the list of differences; the coder saves it with `delivery_map_report` |
| `readiness_assess` (v0.9 scope) | adds scope `{use_case: UC-n}` | the same output, limited to that use case's facts, systems, boxes, `HC-` items and pilot shape |

All v0.7 FDE tools need `fde_tools` (D16), accept only allowlisted fields (§13a.2) and run in `aadm-backend`, which writes through its plans API (D30). Every save tool in this section runs in the backend; core forwards it. **(v0.13.4, D38, D39)** "Runs in `aadm-backend`" means the save and read path only: every computation these tools return (scores, bands, gaps, checks, ready results, health, strip checks) is a stateless `aadm-core` judge reached through the judgment registry, tagged `field` (FIX-34) and stored with `judged_by` (with `policy_revision` and `standard_version`, v0.14); the backend loads the data, calls the judge and saves the result.

**v0.9.** There is **no tool to approve, request changes on, or reject a use case**. Those are web-only human actions, like Sign and Go (§13o.4). The use-case tools group under the Use case capability (§13m).

**v0.8.**
- `terrain_fact_save` accepts kind `extension_point` (§13l.1).
- The tools group into the Plan capabilities as in §13m: (v0.9, first) Use case (`use_case_save`/`get`/`submit`), Cornerstone (`cornerstone_save`/`get`), Batch and slice (`delivery_map_save`), Prompts (`delivery_map_prompt_save`) and Delivery map (`delivery_map_get`, `delivery_map_render`).
- `delivery_map_report` and `delivery_map_verdict` belong to Adopt.

`terrain_fact_save` never accepts a file body, source text or a snippet; imports and crawls are derived on the host first (§13b.3).

**Tools are shown by subscription (D33, D36, FIX-32).** `aadm-core` lists the AADM Field tools, including the 8 existing FDE tools from DM6-p3 on, in `tools/list` only for sessions whose plan carries `fde_tools` (Field, Code + Field, an active trial), and the Code tools only for sessions with `mcp_access` (Code, Code + Field, an active trial); Free sees the free tools. (v0.13.4, v0.13.5) The 15 `shared` planning tools (`prd_outline`, `delivery_map`, `slice_issues`, `interrogate_plan`, `journey_map` and `predone_review`; `replan_check`, `grill_questions`, `pressure_test`, `user_flow`, `ux_surface_pass`, `cross_surface_check`, `journey_trace`, `journey_attest` and `gap_score`) are listed for Code, Field, Code + Field and active trials, and never for Free (D38, D40); each tool's plan tag is the single source for this filtering (FIX-34). A call to a tool not listed for the caller returns `entitlement_required`. They stay stateless in core and save through `aadm-backend` (D30). The tool names above marked v0.13 are proposed; their 0-hit check is UNCHECKED (§20).

There is deliberately no tool to sign a cornerstone or press go. Those are web-only human actions, and `agent_op_contract_check` records that rule for each write tool.

## 10. Auth, tenancy and retention

**Today (read):**
- `src/mcp-auth.ts` accepts three credentials:
  - `aadm_` dashboard tokens, SHA-256 matched against Clerk user `privateMetadata.mcpTokens` (`:440-450`)
  - Clerk `ak_` API keys (`:138`)
  - Clerk OAuth tokens when `CLERK_OAUTH_CLIENT_ID` matches (`:10`, `:157`)
- The principal is per **user**. `owner_namespace = clerk-<sha256(subject)[0:32]>` (`:466-480`), and it scopes the run store (`src/index.ts:352-353`, `src/run-store.ts:918-954`).
- Verified credentials are cached (`POSITIVE_CACHE_MS = 120_000`, `:22`; now CFG-TECH-06).
- There is **no workspace or org concept** in either repo.

**New:**
- **Workspace = tenant, in our own tables (D4, changed Oct 25, 9:52 AM ET: Clerk Organizations are off).** Clerk stays the identity provider only: it proves *who* the user is (Clerk user id). *Which* workspaces they belong to, and their role in each, live in `workspace_member`. No Clerk Organization API, claim or widget is used. **(v0.14, D43, IDN-02)** The verified `(issuer, subject)` maps to one internal `actor_id` through the `actor` table; every membership, entitlement, approval and event row uses `actor_id`. A Clerk API key whose subject is not a `user_` id is refused (DM2-a4).
- **Data invariants (v0.14, D43).** ADR 005 (`docs/adr/005-plans-api-data-invariants.md` in aadm-mcp; TEN-01 to TEN-04, CQRS-01 to CQRS-04, TX-01 to TX-05) binds every plans-API slice; DM1-a3 builds its guard tests. **Proposed ADR 005 TEN-01 amendment (text only; Blueprint does not edit the repo; a later doc slice or DM0-a3 lands it):** "TEN-01. Every query runs in `withWorkspaceTx(workspaceId, actorId, fn)`, which does `set_config('app.workspace_id', ..., true)` and `set_config('app.actor_id', ..., true)` for that transaction only; both error when unset. `actorId` is the internal `actor_id` mapped from the verified credential's `(issuer, subject)` (IDN-02); the Clerk user id is never a policy input. Repositories never import the raw db or pool." Proposed TEN-02 wording (P14): "User and workspace come only from the verified credential: a Clerk session verified by `aadm-backend` itself on the web path, or an `aadm_` token, `ak_` key or OAuth token verified by `aadm-core` and passed to the backend over M2M. Request fields may narrow, never widen; a workspace token's bound workspace wins." ADR 005's open TI-05 question stays open (§20).
- **No implicit default workspace (v0.13.8, D42; was "Personal workspace bootstrap"; invariant IDN-05).** Nothing is created on a user's first request. **(v0.14, D43: "No workspace is a normal empty state")** A signed-in user with no `workspace_member` row gets a normal 200 response with an empty membership list, and the UI shows the "No workspace yet" state with Create workspace and join-by-invite. This is not an error and not a ninth result code; Blueprint default BD-c (`no_workspace` as a result) is dropped. Creating one is an explicit, people-only plans-API call that makes the `personal` workspace and an `owner` membership in one transaction; it takes an `idempotency_key`, and the unique constraint (§8) refuses a second personal workspace, so a replay creates nothing.
- **Result codes (v0.13.8, D42 (a); the full list is TEN-07 in `ref/aadm-invariants-adapted.md`).** Not signed in: `unauthenticated`. Unknown workspace, or no membership in it: `not_found`, never revealing that it exists. A member whose role forbids the action: `forbidden`. A plan lacking the feature, or a tool not tagged for the plan: `entitlement_required`. Backend down: `storage_unavailable`. Stale revision: `conflict`. A rejected payload (secret-shaped or not allowlisted): `rejected`. A result that can't be known: `indeterminate`. The UI shows each one differently. **(v0.13.9, Blueprint default BD-b in D42, pending Brian)** These are code families: the existing specific codes stay as sub-codes, `revision_conflict` under `conflict` (DM2-a2) and `evidence_rejected` under `rejected` (DM2-t1 and others). **(v0.14, D43)** New sub-code `api_version_unsupported` under `rejected`: a caller outside the N-1 contract window (§13d). Other sub-codes added in v0.14: `idempotency_conflict` and `prompt_changed_after_go` under `conflict`. One shared module holds every family and sub-code for core and backend (DM2-a3); core's sign-in refusal says `unauthenticated` (today it says `unauthorized`, `src/mcp-auth.ts:422-423` at `78d93b8`). **(v0.15, D44 (2); RES-01 to RES-04; AUTH-15, AUTH-38)** There are **10 families**: the 8 above plus `rate_limited` and `internal_error`. `rate_limited` is retryable and carries `retry_after`; in the Blueprint default it was a sub-code of `rejected`. `internal_error` is a bug in AADM: it isn't retryable and is never shown as an outage. The sub-codes are:
  - under `rejected`: `invalid_input`, `policy_rejected`, `evidence_rejected`, `api_version_unsupported` and (v0.16.1, F1-a4) `model_key_missing`;
  - under `conflict`: `revision_conflict`, `idempotency_conflict`, `prompt_changed_after_go` and `invalid_transition`;
  - under `storage_unavailable`: `dependency_unavailable`;
  - under `forbidden`: `capability_denied` (D44 (3)) and `operator_disabled` (DM7-c1).

  Every refusal body has `code`, `sub_code`, `retryable`, `request_id` and a message for people (RES-04). Clients decide from the first three fields, never from the message. A timeout or lost reply after a write was sent stays `indeterminate` (RUN-03).
- **Roles.** `owner` (manage members, invites, sign, go), `planner` (draft and save cornerstones and plans, write prompts; no sign, no go), `coder` (`delivery_map_next_slice` and `delivery_map_report` only), `viewer` (read only), `acceptor` (read only, plus co-sign of cornerstone versions in that workspace, D8). Sign and Go also need a human web session (§4.2), whatever the role. **(v0.9)** `owner` or `planner` on the FDE side submits a use case; a use-case decision needs the signed-in member linked (`member_ref`) to the decision owner's or the `eval_owner`'s `SH-` row, plus a human web session, and, when CFG-APPROVAL-09 is on, the submitter can't decide (§13o.4). Which roles a workspace uses is CFG-WS-02, and its preset is CFG-WS-01 (§5).
- **Capabilities and side-effect class (v0.15, D44 (3); CAP-01 to CAP-03, AUTHZ-01, AUTHZ-02; AUTH-44, AUTH-54).**
  - Every MCP tool and plans-API route declares one capability from the closed list of 9: `tool.run`, `source.read`, `source.write`, `artifact.read`, `artifact.write`, `report.write`, `approval.request`, `approval.resolve` and `run.control`.
  - Each also declares one side-effect class: `read`, `write`, `external` (it calls an outside system) or `irreversible` (a later write can't undo it, such as a hard delete). A tool with no class counts as `irreversible` and fails the build (DM1-e5).
  - One table in code maps each role and credential kind to its capabilities (CAP-02, DM2-a1). The effective set is the intersection of role, credential kind and plan tag.
  - A call outside the effective set is refused with `forbidden` / `capability_denied`, naming the capability. `approval.resolve` needs a human web session (CAP-03).
- **Invites (our own flow).** An owner creates an invite with a role and an optional email. aadm.io makes a 32-byte random token, stores only its SHA-256, and shows the link once. The invite is single-use (FIX-08) and expires (CFG-WS-03). Acceptance needs a signed-in Clerk user; if the invite names an email, one of that user's *verified* Clerk emails must match (case-insensitive). Accepting inserts one `workspace_member` row and stamps the invite used, in one transaction. A user who is already a member keeps their current role and the invite is marked used. Revoke is immediate. The token never appears in logs or analytics (path redacted). Failed accepts are rate-limited (CFG-TECH-10).
- **Member removal and role change.** Removing a member, or lowering their role, revokes their `agent_credential_binding` rows for that workspace in the same transaction. A workspace always keeps an owner (FIX-09).
- **Database wall (defense in depth; the primary wall is app-layer scoping by `workspace_id` through the ports, §13c, so a database without RLS still isolates).** The backend plans API (D30; D15 placed it in core) talks to Postgres (Supabase first) as a dedicated role `aadm_app` (not `service_role`, so RLS applies) and sets `app.actor_id` (v0.14, D43; was `app.clerk_user_id`) and `app.workspace_id` per transaction with `set_config(..., true)`. Every workspace-scoped table has RLS **and FORCE RLS** (v0.14, ADR 005 TEN-03); policies allow a row only when `workspace_id` matches the setting *and* a `workspace_member` row exists for that actor. We do not use Supabase Auth or the Clerk–Supabase JWT integration in v1, so `anon` and `authenticated` get **no** grants on these tables. Each new public table (`workspace`, `workspace_member`, `workspace_invite`, `agent_credential_binding` and the plan tables) gets an explicit `GRANT` to `aadm_app` only (required from Oct 30, 2026).
- **Every credential binds to exactly one workspace and role.** A customer-coder token can never read another workspace. Switching workspace in the UI never widens a token.
- **Every query filters by `workspace_id`, with the RLS wall above as a second wall.** `tenant_isolation_check` runs on the catalog facts before DM1 closes.
- **Share links:** opaque, random, view-only, with an expiry (CFG-WS-05). Revoking takes effect at once because links are not cached.
- **Retention (D7, decided):**
  - Active plans are kept while the workspace is active.
  - An inactive plan is archived (read-only) after CFG-RET-01.
  - A workspace's data is hard-deleted CFG-RET-02 after the workspace is closed or the engagement ends; an export is taken first and stays downloadable until then (FIX-24).
  - **(v0.15, D44 (5); DATA-03, DATA-04, AUD-01, AUD-02; AUTH-29)** The hard delete also removes the workspace's audit and event rows (`plan_event`, `workspace_event`, `workspace_policy_event` and the rest). They are inside the export taken first. The retention job deletes them as the DATA-03 privileged role, the only role with DELETE on event tables; `aadm_app` still has none (AUD-02). In the same transaction it writes one content-free `workspace_deletion_tombstone` row (§8) outside the workspace tables, with `workspace_id`, the deleting actor, the time, the export's SHA-256 and the row count per table.
  - Non-finished renders kept per plan: CFG-RET-03. Finished renders are kept with the plan.
  - Reports are kept with the plan. Whether share links include them is CFG-WS-06.
- **Never stored:** secrets, `.env` values or keys. A report containing a string that looks like a key (`aadm_`, `ak_`, `sk_`, `-----BEGIN`) is rejected with a "redact and resend" error.

## 11. Fallback and export

- **Why:** on Oct 24 a Clerk token rejection kept the AADM connector down for hours. AADM sign-in is now a single point of failure.
- **Local mirror.** After every successful write, the planner keeps a local JSON plus markdown copy (Blueprint: `/workspace/blueprint/aadm-mirror/<workspace>/<plan>/`) at the returned `state_revision`.
- **Outage mode.** If AADM can't be reached or auth fails for longer than CFG-TECH-09 allows, the planner works from the mirror and queues writes. When AADM is back, it replays them with `expected_revision`. A conflict stops the replay and asks Brian.
- **Export format.** A zip containing:
  - `manifest.json` (sha256 per file)
  - `cornerstone/vN.md` and `.json`
  - `plan.json`, in the shape `delivery_map_save` accepts, so an export re-imports losslessly
  - `prompts/`, `reports/`, `verdicts.json`, `renders/`, `events.jsonl`
- **Parity.** An export re-imported into an empty workspace must match by count and hash per entity, checked with `cutover_parity_check`.
- **FDE transfer package.** The export plus a filled `fde-outcome-contract.md` (named acceptors, exit criteria, transfer package location).

## 12. Numeric thresholds (all set)

**(v0.11)** Every value now lives in **§5 User Configurations and Settings**. Each `THR-` id stays as a stable name and maps to the settings that hold its values. No `THR-` row is dropped or renumbered.

| ID | Threshold | Values in (§5) |
|---|---|---|
| THR-1 | Prompt length | CFG-BATCH-04, PF-01 |
| THR-2 | Report size | PF-01 |
| THR-3 | Plan size and batch sizing | PF-01, CFG-BATCH-01 |
| THR-4 | Render speed and part size | QB-01 |
| THR-5 | Live map speed | QB-01 |
| THR-6 | Write and verdict speed | QB-01 |
| THR-7 | Share links | CFG-WS-05, CFG-WS-06 |
| THR-8 | Signed URLs | CFG-TECH-08 |
| THR-9 | Credential revocation | FIX-10, CFG-TECH-06 |
| THR-10 | Outage switch and mirror | CFG-TECH-09 |
| THR-11 | Export size and speed | QB-01 |
| THR-12 | Isolation | FIX-06 |
| THR-13 | Retention | CFG-RET-01, CFG-RET-02, CFG-RET-03 |
| THR-14 | Invites | CFG-WS-03, FIX-08 |
| THR-15 | Invite, member and workspace caps | CFG-WS-04, CFG-WS-07, CFG-WS-08 |
| THR-16 | Invite accept rate limit | CFG-TECH-10 |
| THR-17 | Owners and membership reads | FIX-09 |
| THR-18 | Evidence allowlist | FIX-07 |
| THR-19 | Human-entered Terrain text | FIX-07 |
| THR-20 | Terrain freshness | CFG-STALE-01, CFG-STALE-02 |
| THR-21 | Terrain caps and speed | CFG-WS-11, QB-01 |
| THR-22 | Terrain ready to cite | CFG-READY-01 |
| THR-23 | Storage adapters | QB-02, QB-01 |
| THR-24 | Customer-storage credentials | CFG-TECH-11, FIX-11 |
| THR-25 | Telemetry | FIX-11, CFG-TECH-16 |
| THR-26 | License (mode c) | CFG-TECH-13 |
| THR-27 | Egress allowlist (mode c) | CFG-TECH-14 |
| THR-28 | Customer-managed keys | CFG-TECH-12 |
| THR-29 | Residency | CFG-WS-09, FIX-26 |
| THR-30 | Export and delete in every mode | FIX-24, QB-02 |
| THR-31 | UDALI transpose views | QB-01, CFG-WS-12, CFG-STALE-01 |
| THR-32 | Containers and the FDE hop | CFG-TECH-01 to CFG-TECH-05, CFG-TECH-15, FIX-25, FIX-27, QB-03 |
| THR-33 | Database portability | QB-02 |
| THR-34 | Risk scoring and bands | CFG-RISK-01, CFG-RISK-02 |
| THR-35 | Risk review cadence and mitigation due dates | CFG-DATE-06, CFG-DATE-07 |
| THR-36 | Risk and access gates; risk acceptance | CFG-RISK-03, CFG-RISK-04, CFG-APPROVAL-03, CFG-RISK-05 |
| THR-37 | Register limits | PF-02, CFG-WS-12, QB-01 |
| THR-38 | Outcomes and measures | CFG-HANDOFF-02, CFG-HANDOFF-03, FIX-07 |
| THR-39 | Post-go-live measure checks | CFG-DATE-08 |
| THR-40 | Quality gaps Q1–Q9 | CFG-READY-02 to CFG-READY-08, CFG-MODE-03, CFG-MODE-04, CFG-MODE-05 |
| THR-41 | Relevance gaps R1–R7 | CFG-READY-10 |
| THR-42 | Access gaps A1–A8 | CFG-READY-11 |
| THR-43 | Governance gaps G1–G13 | CFG-READY-12, CFG-READY-13 |
| THR-44 | Readiness assessment speed and triggers | QB-01 |
| THR-45 | Phase health | CFG-HEALTH-01, CFG-HEALTH-03, CFG-HEALTH-04, CFG-HEALTH-05, CFG-HEALTH-02 (Plan rolls up THR-53 to THR-56 and THR-61), PF-06 |
| THR-46 | Governance map | CFG-READY-14, CFG-STALE-04, CFG-WS-12 |
| THR-47 | Stakeholders | CFG-DATE-04, CFG-DATE-05, CFG-WS-12, FIX-07 |
| THR-48 | Use-case scores | CFG-UC-15, CFG-UC-14, CFG-WS-12 |
| THR-49 | Pilot limits | CFG-PILOT-01 to CFG-PILOT-05, CFG-APPROVAL-08 |
| THR-50 | Pilot metrics and go/no-go | CFG-PILOT-06, CFG-PILOT-07, CFG-PILOT-08 |
| THR-51 | Pilot feedback | CFG-PILOT-09 to CFG-PILOT-12, FIX-07 |
| THR-52 | Speed Layer | PF-03, CFG-SL-01 to CFG-SL-05 |
| THR-53 | Cornerstone health | CFG-HEALTH-06 |
| THR-54 | Batch and slice health | CFG-HEALTH-07 |
| THR-55 | Prompts health | CFG-HEALTH-08 |
| THR-56 | Delivery map health | CFG-HEALTH-09 |
| THR-57 | Delivery modes | CFG-MODE-01, CFG-MODE-02, CFG-STALE-03 |
| THR-58 | Batching standard limits | CFG-BATCH-01 to CFG-BATCH-08, FIX-18, PF-04, PF-05, PF-01, QB-01 |
| THR-59 | Use-case definition of ready | CFG-UC-02 to CFG-UC-15, QB-01 |
| THR-60 | Use-case approval | CFG-APPROVAL-01, CFG-APPROVAL-02, CFG-APPROVAL-07, CFG-DATE-02, CFG-DATE-03, CFG-WS-12, FIX-03, FIX-04, CFG-APPROVAL-09 |
| THR-61 | Use case health | CFG-HEALTH-10 |

## 12b. Current stack (as built)

**(v0.14 refresh, D43)** At Oct 25, 2026 ~8:15 PM ET both repos are pushed: aadm-mcp `dev` is at **`78d93b8`** (INV-MCP: `docs/ARCHITECTURE_INVARIANTS.md`, the `AGENTS.md` and `ENGINEERING_RULES.md` pointers, the ADR 005 owner note; code unchanged since `76860bd`) and aadm-website `dev` at **`dba0c8e`** (INV-WEB-2), read on GitHub and on Brian's Mac. Since the read below, the website added `src/pages/field/main.astro` (an empty signed-in Field page) and `src/lib/field-area.ts`; `src/pages/health.ts` (9 lines) returns only `{status, service}`; `/health` in aadm-mcp has no release or API version (`src/index.ts:639-654`).

**(v0.15, D44)** INV2 has landed on `dev`, not pushed (coder reports, Oct 25, 2026, ~9:00 PM ET). In aadm-mcp, **`2b1b364`** (INV2-MCP) adds 80 tagged Day 0 and Day 1 rules to `docs/ARCHITECTURE_INVARIANTS.md` (164 lines). In aadm-website, **`9ad68e2`** (INV2-WEB) adds the 24 website rules to `docs/INVARIANTS.md` (55 lines). Both are docs only, so the code is unchanged. Blueprint's verdict on both is ON PLAN (DM0-i3, DM0-i4). The INV2 gap check (`ref/inv2-gap-check.md`) lists where today's code breaks the new rules. Core runs open when `CLERK_SECRET_KEY` is unset (`src/mcp-auth.ts:247-290`). Startup checks only `PORT` (`src/index.ts:240-252`). CORS echoes any `Origin` on `/mcp` (`:153-164`, `:194-221`). Logs are plain text with no `request_id` (`src/process-logger.ts:33`). Neither repo has `.github/workflows`, and the website reads settings with no schema (`src/middleware.ts:25-31`).

Read on Brian's Mac, read-only, Oct 25, 2026 ~10:35 AM ET: **aadm-mcp `7d02c5e658`** (`dev`, clean, 0 ahead / 0 behind `origin/dev`) and **aadm-website `23fd957312`** (`dev`, clean). Only key and env **names** are listed here, never values.

**aadm-mcp (mcp.aadm.io)**
- **Runtime:** Node `>=22` (`package.json:8-10`); image `node:22-bookworm-slim`, two-stage build, runs `node dist/index.js` as `USER node`, `EXPOSE 3000` (`Dockerfile:2`, `:15`, `:27-31`).
- **Web framework: none. It is not Express.** The server is plain `node:http` (`src/index.ts:6` import; `http.createServer` at `:604`; `server.listen` at `:978`). The `express` strings in `src/` are crosswalk and router vocabulary, not an import (no `import … from "express"` anywhere in `src/`; no `express` dependency).
- **MCP:** `@modelcontextprotocol/sdk` ^1.29.0 (`package.json:30`), **Streamable HTTP** transport (`src/index.ts:9`, created at `:356`), no SSE transport. Routes: MCP path (default `/mcp`, `:46`, env `MCP_HTTP_PATH`), `/health` (`:56`), `/health/auth` (`:58`), `/.well-known/oauth-protected-resource` (`:63`).
- **Tools:** 68 `server.registerTool(` calls, all in **one file and one process**: `registerTools` in `src/tools.ts:4660`, called from `src/mcp-server-factory.ts:44`.
- **Redis (only when `REDIS_URL` is set):** two uses. (1) the cross-pod MCP **session registry** (`src/session-registry.ts`; boot log at `src/index.ts:931`); (2) the optional **run-store** cache (`src/run-store.ts`, 1 h TTL, env `RUN_STORE_TTL_MS`). Otherwise both are in memory.
- **Hosting:** Railway, config-as-code `railway.toml` (builder `DOCKERFILE`, healthcheck `/health`, timeout 300 s); its header says to keep **1 replica** because Streamable HTTP sessions are in memory per replica (`railway.toml:6-14`).
- **Env names:** `PORT`, `HOST`, `MCP_HTTP_PATH`, `MCP_POD_ID`, `MCP_MAX_SESSIONS`, `MCP_EXPOSE_LIBRARY`, `MCP_CLIENT_LOG`, `LOG_LEVEL`, `REDIS_URL`, `RUN_STORE_TTL_MS`, `CLERK_SECRET_KEY`, `CLERK_OAUTH_CLIENT_ID`, `MCP_AUTHORIZATION_SERVER_URL`.

**aadm-website (aadm.io)**
- **Astro** ^6.2.1, `output: "server"`, adapter **`@astrojs/node` ^10.0.6, `mode: "standalone"`** (`package.json:23`, `:26`; `astro.config.mjs:102-103`); `@clerk/astro` ^3.1.0 (`package.json:24`); Tailwind ^4.2.4; Node `>=22.12.0` (`package.json:6-8`).
- **Hosting:** Railway, `railway.toml` (builder `DOCKERFILE`, healthcheck `/health`); image `node:22-alpine`, `EXPOSE 8080`, `node ./dist/server/entry.mjs` (`Dockerfile:11`, `:63`, `:70`); a `docker-compose.yml` exists for local runs.
- **Server endpoints (2):** `src/pages/health.ts` and `src/pages/visuals/coding-shift.svg.ts`. Everything else is pages; the member area is `src/pages/member/`.

**Clerk sign-in, end to end**
- **Domains:** Account Portal at **accounts.aadm.io** (sign-in and sign-up, `src/lib/clerk-portal-urls.ts:15-16`), Frontend API at **clerk.aadm.io** (`:22`). aadm.io runs as a Clerk **satellite** (`astro.config.mjs:54`, `:116-117`). Which domain is the primary instance: UNCHECKED.
- **Web user:** visits `aadm.io/member` → middleware (`src/middleware.ts`) → signs in on accounts.aadm.io → the satellite syncs the session back. Unsigned requests render the sync shell rather than redirect (`src/middleware.ts:50-58`).
- **MCP clients:** `authorizeMcpIfConfigured` (`src/mcp-auth.ts:497`) accepts three kinds:
  1. **`aadm_` dashboard token** (full header value, ≥ 24 chars, `:136`): SHA-256 matched against Clerk user `privateMetadata.mcpTokens` (`:437-441`, hash at `:575`). **Where issued:** "operator-issued; no mint UI in aadm-website" (`:5`), so today they are written into Clerk metadata by an operator.
  2. **`ak_` Clerk API key** (`:138`): `clerk.apiKeys.verify()` (`:602`).
  3. **OAuth access token** (`Bearer`): `clerk.idPOAuthAccessToken.verify()` (`:525`) when `CLERK_OAUTH_CLIENT_ID` is set (`:157`, may list several ids, `:162`); discovery via `MCP_AUTHORIZATION_SERVER_URL` (`:216`).
  - Positive results are cached 2 minutes (`POSITIVE_CACHE_MS`, `:22`). With no `CLERK_SECRET_KEY` the server runs `open` (local/dev only, `:247`). The principal is `mcpPrincipalForClerkSubject` (`:474`).
- **Website env names (Clerk):** `PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `PUBLIC_CLERK_IS_SATELLITE`, `PUBLIC_CLERK_DOMAIN`, `PUBLIC_CLERK_PROXY_URL`, `CLERK_PROXY_URL`, `PUBLIC_CLERK_SIGN_IN_URL`, `PUBLIC_CLERK_SIGN_UP_URL`, `PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`, `PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`, `PUBLIC_CLERK_AUTHORIZED_PARTIES`, `CLERK_OAUTH_CLIENT_ID`.

**Database: none today.** Neither repo has a database dependency (aadm-mcp runtime dependencies are exactly `@clerk/backend`, `@modelcontextprotocol/sdk`, `ioredis` and `zod`, `package.json:28-33`; aadm-website has no `pg`, Drizzle, Prisma, Kysely or Supabase package). Redis is the only data service, and it is optional.

## 13. Storage and rendering, grounded in the repos

**What exists:**
- **aadm-mcp** says "Single process, no database, no external API calls from the server" (`AGENTS.md:122`). Its only state is the optional `run-store`, which is Redis when `REDIS_URL` is set and otherwise in-memory (`src/run-store.ts:1-16`). It defaults to a 1 h TTL (`:224`), is labeled `RUN_STORE_AUTHORITY = "optional_cache"` (`:26`) and has slots `flow`, `delivery_map`, `contract` and `artifacts` (`:37-42`).
- **aadm-website** is Astro 6 SSR (`@astrojs/node` standalone) with `@clerk/astro` and Tailwind (`package.json`, `astro.config.mjs`). It runs as one Railway deploy (`docs/CLERK-AUTH.md` rule 6) and has **no database and no API routes**. Its only server endpoints are `src/pages/health.ts` and `src/pages/visuals/coding-shift.svg.ts`. Its existing server-side SVG pattern is `src/lib/coding-shift-svg.ts`.
- **Rendering precedent in aadm-mcp:** `src/repo-map-renderer.ts` outputs offline HTML with no external assets, plus Mermaid, behind `src/render-contract.ts`.

**Proposal:**
- **Storage (D1, decided; reconciled in v0.6).** Postgres with Supabase as the **first host only**, owned by the plans API in `aadm-backend` through the `PlanStore` and `BlobStore` ports (§13c); renders behind `BlobStore`. `aadm-core` saves nothing (D30, FIX-27). On Supabase, every new public table gets RLS and explicit GRANTs as defense in depth. The run-store stays a cache and is never the plan of record.
- **Where the tools live (D2, decided; refined by D15 in v0.6 and D30 in v0.12).** aadm-mcp hosts the tools; the plans API, storage and every save tool run in `aadm-backend`, and `aadm-core` keeps the stateless tools and saves nothing (§13d). The front door forwards the caller's verified principal and workspace. That keeps one MCP URL for customers. It breaks the "no external API calls" line in `AGENTS.md:122` and `:241`, so it needs an ADR in `docs/adr/` (the next number after `003`) before any code.
- **Rendering.** A TypeScript SVG renderer ports the layout of `src/map_forge_rebuild.py` (column and card sizing, color map at `:10`, tag colors at `:11`) and follows the no-external-assets rule from `repo-map-renderer.ts`. The same SVG feeds the live map and the PNG. The PNG is rasterized with resvg (D5, decided; a new dependency). Snapshot tests compare it with a Forge golden export.

## 13a. Customer-controlled data and models (v0.5)

**Hard rule (Brian, Oct 25, 10:00 AM ET): customer source code never leaves the customer's core systems, in every mode, including AADM Cloud** (FIX-01; secrets are never stored, FIX-02). This is how AADM already works: the host's own coder reads code locally, and the server checks and renders the evidence it is handed (`repo_feature_map`: "Guide the user's connected coder to inspect a feature, then check and render its supplied implementation path ... with no client filesystem access", `src/tools.ts:838`; non-goal "AADM never scans repos", `AGENTS.md:241`).

**Honest caveat.** Today every MCP tool call sends its pasted text through mcp.aadm.io, even though `aadm-core` stores nothing (D30; only TTL caches such as the optional run-store, `src/run-store.ts:224`, whose TTL is CFG-TECH-07). In modes (a) and (b) that stays true. That is why the evidence allowlist (§13a.2) exists: whatever a caller pastes, only allowlisted derived fields are accepted. Only mode (c) removes the transit.

### 13a.1 Data inventory

| Data | Class | Travels through MCP payload (mcp.aadm.io) | Plans API (`aadm-backend`, D30) | Stored in | Drive |
|---|---|---|---|---|---|
| Source code, snippets, file bodies | Customer code | **Never** (rejected by §13a.2) | Never | Never in AADM; stays in the customer's repos | Never |
| Secrets, `.env` values, keys | Secret | Never (secret filter) | Never | Never | Never |
| Repo facts / Terrain facts (names, paths with lines, routes, tables, deps, config key *names*, UDALI placements, commit, hashes) | Derived evidence | Yes, allowlist-shaped only | Yes | Plan store (mode a: Supabase; b: customer store; c: customer cloud) | No |
| Cornerstone text | Customer content | Yes (`cornerstone_save`) | Yes | Plan store | No |
| Plans (stages, batches, slices) | Customer content | Yes | Yes | Plan store | No |
| Prompts | Customer content (may name paths; never code bodies) | Yes | Yes | Plan store | No |
| Coder reports | Customer content (files changed, tests run, evidence lines; key-shaped strings rejected, §10) | Yes | Yes | Plan store | No |
| Verdicts | Customer content | Yes | Yes | Plan store | No |
| Map images | Customer content | No (rendered server-side from stored data) | Yes (signed URLs, THR-8) | Blob store | Only if the planner uploads (D6; Blueprint for Brian). Customers can turn it off |
| Audit history (`plan_event`, `terrain_fact_event`) | Customer content | No | Yes | Plan store | No |
| Accounts, membership, invites, credential fingerprints | Account | Token only | Yes | aadm.io (all modes except c, where identity is the customer's IdP) | No |
| Usage metering | Operational counts | No | Yes | aadm.io control plane, counts only (THR-25) | No |

A doc copy of this table ships as `docs/data-inventory.md` in aadm-website, and every table carries a `data_class` label (DM1-c1).

### 13a.2 Evidence allowlist schema (what may cross)

One strict schema in aadm-mcp (Zod `.strict()`), shared by `terrain_fact_save` and the Terrain fields of `delivery_map_report`. The server rejects any payload that fails it with `evidence_rejected`, naming the field and reason. **There is no free-text field for code to hide in.**

| Kind | Allowed fields (all single-line) |
|---|---|
| `system`, `service` | name, label, owner_role |
| `file_ref` | repo-relative path, line_start, line_end, content_sha256 |
| `route` | method, path pattern, handler file_ref |
| `enum` | name, values[] (identifiers; count per FIX-07) |
| `schema_table` | schema, table, column names[] and types (no defaults, no data) |
| `dependency` | package name, version, ecosystem |
| `config_key` | key **name** only, file_ref. There is no value field |
| `udali_placement` | target (file_ref or system), UDALI layer `L1`–`L22`, band (U, D, A, L, I), assessment verdict |
| `api_operation` | operationId, method, path, request and response schema *names* |
| `environment` | name (dev, qa, prod …), deploy path step names |
| `crosswalk_term` | the customer's term (label), UDALI layer `L1`–`L22`, band, AADM citation id (as `vocabulary_crosswalk` returns) |
| `outcome`, `measure`, `stakeholder`, `risk`, `access_item`, `governance_item`, `quality_signal`, `data_trust`, `observability_signal`, `experience_surface`, `speed_layer_rating`, `use_case`, `pilot`, `pilot_feedback` (v0.7), `extension_point` and `host_contract` (v0.8, §13l; scope names only) | the fields in §13f–§13k: short single-line text (lengths in FIX-07), numbers, dates, enums and IDs. No email, phone, credential, code, data row or transcript |
| `platform_object_type`, `platform_link_type`, `platform_action`, `platform_pipeline`, `platform_permission`, `platform_integration`, `platform_environment` (v0.13, §13p.6) | names and shapes only: name, label, system, property or parameter names and types, from and to type names, cardinality, connector kind and direction, role and scope names, environment and promotion-step names. No values, defaults, data rows, secrets or member lists (FIX-31) |
| every item | source: commit SHA (40 or 64 hex) or content SHA-256; repo id |

Rules (THR-18; lengths and counts in FIX-07): no line breaks, identifiers match `^[A-Za-z0-9_.:/@{}\[\]<>*+-]+$` (labels allow letters, digits, spaces and `.,()/&'-`), unknown keys refused. Every string also passes the secret filter (`aadm_`, `ak_`, `sk_`, `-----BEGIN`, `AKIA` plus 16 characters, `ghp_`, `xox[bp]-`, JWT-shaped `eyJ…`) and a code filter (backticks, ` ``` ` fences, `;` or `{` followed by more code, `=>`, `function`, `def `, `SELECT … FROM`).

**Test ideas (DM2-t1 done-check).** Each must be refused with `evidence_rejected` and the field named:
1. a `label` holding a ```` ```ts ```` code block;
2. a `config_key` item with an extra `value` field;
3. a `name` containing `sk_live_` plus 24 characters;
4. a `path` with an embedded newline and a second line of code;
5. an unknown key `snippet`;
6. a name one character over the FIX-07 limit.
A valid crawl payload at the FIX-07 item limit is accepted, and the stored row holds no field outside the schema.

### 13a.3 Models

- **Checked:** aadm-mcp has no LLM dependency. Its runtime dependencies are `@clerk/backend`, `@modelcontextprotocol/sdk`, `ioredis` and `zod` (`package.json`). Its tool descriptions say so directly: `interrogate_plan` runs "without repo scan or LLM on the server"; `vocabulary_crosswalk` is a "Deterministic dictionary lookup, never LLM inference" (`src/tools.ts:850`). GitHub code search of aadm-website for `openai`, `anthropic` and `completions` returns 0 hits. The server's outbound calls today are Clerk (token checks) and Redis (when set).
- **Planned:** nothing in this PRD calls a model (FIX-12). The suggested verdict (§8), handoff checks, freshness and gap lists are deterministic.
- **All model reasoning happens in the customer's own planner and coder** (Cursor, Claude Code, Codex, with their own keys).
- **If a future feature needs a server-side model:** it goes through a per-workspace provider config (OpenAI-compatible endpoint, Azure OpenAI, Bedrock, Vertex, or a local model), with **no default fallback to an AADM-owned model**. No such feature is planned. A build guard fails if an LLM SDK appears in either repo without that config (DM1-c3).

### 13a.4 Three deployment modes, one set of contracts

Each workspace's mode is CFG-WS-10 (§5).

| Mode | Where plan data lives | Who sees tool payloads | Identity | aadm.io keeps |
|---|---|---|---|---|
| **(a) AADM Cloud** (default, D1) | Supabase Postgres + Storage | mcp.aadm.io (in transit, allowlisted) | Clerk | everything in §13a.1 except code and secrets |
| **(b) Bring your own storage** | The customer's store through an adapter: Postgres they host; S3, Azure Blob or GCS for images; or a repo-backed adapter writing plan files under `.aadm/` in their repo | mcp.aadm.io (in transit, allowlisted) | Clerk | account, license and metering counts only |
| **(c) Self-hosted data plane** | The customer's cloud: the `aadm-mcp` image in `core` and `backend` modes (the plans API and storage in the backend) + the Plans and Terrain UI (D10) | Nobody outside the customer | The customer's IdP over OIDC | control plane only: license and updates |

**The seam.** `PlanStore` (plans, cornerstones, Terrain, events) and `BlobStore` (renders, exports), with the Supabase implementation first and an in-memory one for tests. One adapter contract suite every adapter must pass (THR-23). No Supabase import outside the Supabase adapter. Built in Stage 1 (DM1-c2) so Supabase never leaks into the contracts. Customer adapters come in Stage 8; the first is D9.

**Credentials for customer storage** are federated and short-lived (AWS role assumption, Azure workload identity federation, GCP workload identity federation; THR-24). AADM stores no long-lived customer secrets.

### 13a.5 Supporting controls

- **Customer-managed keys** for modes (b) and (c): a key reference (never key material); data-key cache per CFG-TECH-12.
- **Data residency** per workspace (CFG-WS-09, FIX-26).
- **Egress allowlist** per workspace; the mode (c) default is CFG-TECH-14.
- **Telemetry** is metering counts only (FIX-11, CFG-TECH-16).
- **Export and delete** work in every mode (THR-30), through the adapter.

## 13b. Terrain: a profile of the stack you deploy onto (v0.5)

**Name:** Terrain (§17 naming check: 0 hits; D12). **What it is:** a per-workspace, sourced and dated profile of "the platforms or technology they are forward deploying". It is the grounding source Cornerstone (step C2) and Delivery maps (slice `terrain_fact_ids[]`) cite by `TF-` ID. Research basis: `research-fde-stack-context.md` (Palantir Deltas and Echos, OpenAI and Anthropic FDE roles, bank FDE programs, US bank controls).

### 13b.1 Personas

- **External FDE at a customer** (§2 item 5): builds a Terrain profile in the customer's workspace in week 1 and hands it over in the transfer package.
- **Internal enterprise FDE team on its own stack** (§2 item 6): keeps a long-lived profile of its own platforms, in mode (b) or (c).

### 13b.2 Profile sections (8 required for "ready to cite", THR-22)

1. Overview (outcome, scope, the real problem) — **required**
2. Systems and services — **required**
3. Data sources — **required**
4. APIs and contracts
5. Identity and access — **required**
6. Environments (dev, QA, prod) and deploy path — **required**
7. Approved models and storage (links to §13a: which providers, which stores, which mode) — **required**
8. Compliance and controls (each rule cited with its source, for example SR 11-7 or the 2023 interagency third-party guidance for a US bank; only rules the customer names) — **required**
9. Engineering rules and change process
10. Owners and contacts by role (seeded from `plan_delivery` `engagement_kind: fde`) — **required**
11. Known constraints and gotchas (a constraint can become an `INV-*` via `invariant_register`)
12. Glossary (customer terms ↔ AADM terms, via `vocabulary_crosswalk`)
13–15. Experience, Observability and Quality (v0.7, §13g.4; optional)
16. Extension points (v0.8, §13l.1): APIs, webhooks, event bus, plugin SDKs and MCP hosts, with versions, scope names and rate limits. Required only for a `plug_in` cornerstone (handoff check 13)
17. Platform configuration (v0.13, §13p.6): data object types, links, actions or functions, pipelines, permissions model, integrations and environment layout, as names and shapes only (FIX-31). Required only for a `configure_only` cornerstone

### 13b.3 Ways to fill it (all inside the customer boundary)

- **Crawl.** The customer's coder runs `repo_architecture_map` and `repo_feature_map` locally with AADM's collection guidance. The derived output (systems, file refs with lines, routes, tables, deps, config key names, the UDALI map and 22-layer assessment, commit) is saved with `terrain_fact_save`. In mode (c), a crawler job in the self-hosted plane runs the same guidance. Cloud inventories are read-only exports run by the customer (resource types and names only).
- **Import.** OpenAPI specs, Terraform (`terraform show -json` run locally), CMDB exports, architecture diagrams, READMEs and internal docs are parsed **on the host**; only allowlisted fields cross. The server never receives a file body.
- **Define.** A guided interview (D11: extend `audit_interview` with a `terrain` bank) for things code can't show: owners, controls, approved models, change process. Human-entered text follows THR-19.
- **Build out.** `terrain_get` returns a gap list (empty required sections, sections with only `proposed` facts) and stale flags (THR-20).

### 13b.4 Facts, sources and freshness

Every fact carries `source_kind`, `source_ref` (commit SHA, content hash or interview id) and `last_verified_at`. Facts arrive `proposed` and become `verified` when a member with `owner` or `planner` role accepts them, or when a re-crawl at a new commit finds them unchanged. After its CFG-STALE-01 or CFG-STALE-02 window a fact turns `stale` and can't satisfy handoff check 8. This is Blueprint's "repo-grounded, note the commit, mark UNCHECKED" rule as a product feature.

### 13b.5 UDALI in Terrain

The crawl's UDALI architecture map and the 22-layer assessment are stored as `udali_placement` facts (layer, band, target, verdict, commit, verified date). The Terrain view draws them with the existing renderer contract (`src/render-contract.ts`). They follow the deployment mode like every other fact.

### 13b.6 The UDALI transpose: three views of one Terrain map (D13, decided Oct 25, 10:23 AM ET)

**What was searched first (v0.5):** `transpose` and `transposition` had 0 hits in aadm-mcp (`302e28fa68`), aadm-website (`958dc13367`) and aadm-standard (`9a16239f23`), and 0 in `src/tools.ts`. So the definition is Brian's, recorded here; it is not an existing AADM term.

**Brian's definition:** the transpose is **all three views of one Terrain map**. Each view reads the same stored `udali_placement` and `crosswalk_term` facts; none stores a copy.
1. **Vocabulary crosswalk.** The customer's stack terms mapped to UDALI layers. EXTEND `vocabulary_crosswalk` (`src/tools.ts:5302`, a deterministic dictionary lookup, `:850`) with an optional caller-supplied per-workspace dictionary built from the profile's `crosswalk_term` facts. Unmapped terms are listed as gaps.
2. **Systems × UDALI-band matrix.** Rows: Terrain systems and services. Columns: bands U, D, A, L, I. Cells: placement counts and assessment verdicts from `udali_placement` facts (from `repo_architecture_map` and the `repo_feature_map` 22-layer assessment).
3. **Current-vs-target gap view.** Current = the stored placements. Target = the `UDALI-T*` items of the latest **signed** cornerstone version. Each (system, layer) is `match`, `missing`, `misplaced` or `extra`.

**How the cycle is avoided (chosen: both guards).** Data flows one way per version: Terrain facts → cornerstone version N cites them and declares `UDALI-T*` targets → the gap view reads both. (1) **Before any cornerstone version is signed, the gap view shows current state only** and says so. (2) A gap never edits a cornerstone: turning a gap into a requirement is an amendment (v N+1, §4.3), which needs a new signature. In the build order, DMT-c3 (Stage T) already comes after the signing slice DM2-b3 (Stage 2), so no slice waits on a later one.

## 13c. Database portability (hard requirement, Brian, Oct 25, 10:27 AM ET)

**Supabase is the first host only (D1, reconciled).** Brian must be able to swap the database.
- **Ports.** All access goes through `PlanStore` and `BlobStore` (DM1-c2), with a repository layer underneath. Domain code never imports a Supabase client or SDK, or a driver (lint, DM1-c2). The first `PlanStore` implementation is plain PostgreSQL through a standard driver; Supabase is just where that Postgres runs.
- **Migrations.** Plain, portable PostgreSQL SQL files (`db/migrations/NNNN_name.sql`), applied in order by a small tool-agnostic runner that records `schema_migrations(version, sha256, applied_at)`. The files run unchanged with `psql -f`, so any runner (Flyway, dbmate, Sqitch) could replace ours. Neither AADM repo has a database or migration tool today (§12b), so there is nothing to reuse; the runner is NEW (DM1-c4).
- **Tenancy in the app layer first.** Every query is scoped by `workspace_id` through the port, so a database without RLS still isolates tenants. Postgres RLS (with FORCE RLS) and the `aadm_app` grants (§10) are **defense in depth only**. **(v0.14, D43)** The repository layer follows ADR 005: every operation is a query or a command with one owning service and one repository module; query repositories only read; transport handlers call services, never repositories; the owning service opens the transaction and passes it in; a write commits before any query-shaped response is read (CQRS-01 to CQRS-04, TX-01 to TX-05). DM1-a3 fails the build on a violation.
- **No Supabase-only features on the critical path:** no Supabase Auth, Realtime, Edge Functions or PostgREST. Storage sits behind `BlobStore` (S3-compatible first; whether Supabase Storage's S3 endpoint covers our calls is UNCHECKED, DM1-c2). Migrations are linted for Supabase-only objects (THR-33).
- **Target platforms, tested:** any PostgreSQL ≥ 15: Supabase, Railway Postgres, AWS RDS/Aurora, Azure Database for PostgreSQL, Google Cloud SQL, self-hosted. A **non-Postgres adapter** (for example SQL Server or Oracle for bank customers) is a later option behind the same ports (D14).
- **Portability contract test (DM1-e1).** The same contract suite runs against 2 Postgres hosts: Supabase and a plain Postgres container. Both must pass 100%.
- **Migrate-between-hosts runbook check (DM7-a4).** Export from host A, import into host B, then `cutover_parity_check`: **0 mismatches** by count and hash per entity, Brian's no-soak cutover rule.

## 13d. Containers: core saves nothing, the backend writes (hard requirement, Brian, Oct 25, 10:27 AM ET; D30)

**Today (§12b):** all 68 tools, including the 8 FDE tools, are registered in one file and one process (`src/tools.ts:4660`). Each FDE tool already has its own handler module, imported into `tools.ts`: `tenant-isolation-check.ts` (`:464`), `cutover-parity-check.ts` (`:144`), `invariant-register.ts` (`:228`), `lessons-register.ts` (`:249`), `agent-op-contract-check.ts` (`:67`), `projection-budget.ts` (`:323`), `fanout-guide.ts` (`:192`), `run-state-control.ts` (`:391`). Registrations: `run_state_control` `:5373`, `lessons_register` `:7774`, `fanout_guide` `:7881`, `tenant_isolation_check` `:9027`, `cutover_parity_check` `:9105`, `invariant_register` `:9165`, `projection_budget` `:9210`, `agent_op_contract_check` `:9255`. So the split moves registrations, not logic.

**D30 (Brian, Oct 25, 2026): `aadm-core` saves nothing; the backend writes.** Brian: "I am nervous about aadm core writing the db.. really aadm FDE should write. the AADM MCP is touted as 'we don't save anything'. we want to keep it that way in the AADM MCP core. the FDE can write." This replaces ADR 004's split, where core owned the plans API and the database (D15). ADR 004 gets an addendum in DM0-a3.

**Target: one `aadm-mcp` image started in two modes (`core` and `backend`), plus the website from its own repo.** The same build runs as two containers; a start-mode setting picks which entry point runs (CFG-TECH-04; DM0-b1).
1. **`aadm-core`** (the `aadm-mcp` image in core mode; the public MCP front door): MCP transport and auth (`mcp-auth.ts`), every stateless tool, the plan-feature pre-check and `tools/list` filtering by subscription (FIX-32), and forwarding. It **saves nothing** (FIX-27): no database connection, no `PlanStore` or `BlobStore`, no file writes. Its only state is TTL cache in Redis or memory: the MCP session registry, the run-store and the entitlement cache.
2. **`aadm-backend`** (the same image in backend mode; private network only, FIX-25): the **plans API**; the `PlanStore` and `BlobStore` ports with **Postgres** and **file storage** (renders and exports); **every save tool** (cornerstone, plan, prompt, report, verdict, Terrain, settings and the FDE records); the 8 FDE tools; Terrain crawl and ingest and the transpose views; the **Clerk billing webhooks** and the **`entitlement` table**; the people-only web routes (Sign, Go, approve, settings); and the **retention** jobs (DM7-a2).
3. **`aadm-web`** (unchanged): the aadm.io Astro site, built from the **separate `aadm-website` repo** into its own image.

**Container name (decided Oct 25, 2026, 2:40 PM ET).** Rename `aadm-fde` to **`aadm-backend`**. The container now stores every plan, including personal-workspace plans that have nothing to do with FDE work, and runs billing and retention, so "FDE" would mislead. A repo search finds 0 hits for `aadm-backend`; "aadm-fde" already appears as a skill-name prefix (`aadm-fde-engagement-review`, `docs/recommended-aadm-mcp-skills.md:134`). DM0-b1's slice text still says `aadm-fde` because done or frozen slices aren't edited; the DM0-a3 addendum records the rename, and DM0-b1 uses the new name when its prompt is refreshed.

**Routing decision: the website calls the backend directly.** `aadm-web` calls the `aadm-backend` plans API server-side over the private network, with the signed-in user's Clerk session; the backend verifies that session itself. MCP calls go through `aadm-core`, which verifies the caller and forwards to the backend with a **Clerk M2M token** (audience `aadm-backend`, CFG-TECH-01 lifetime) carrying the verified principal and workspace. Going through core was rejected: it would put core on every web write path for no gain. Two consequences:
- **People-only routes accept only a user session.** An M2M token from core gets 403 there, so "agents never sign, Go or approve" (FIX-03) is enforced by the route, not by a flag.
- **One write path.** Both callers end at the same plans API, and only the backend talks to Postgres and file storage.

**Entitlement in core.** Core never reads the database, so it checks the caller's plan features (`fde_tools`, D16; `mcp_access`; FIX-32) from Clerk Billing through the Clerk Backend API, with a short TTL cache in Redis (memory if `REDIS_URL` is unset; CFG-TECH-17). This check only fails early. The **backend re-checks every call** against its webhook-fed `entitlement` table, with the same Clerk fallback (D-C); the backend is the source of truth. Clerk billing webhooks reach the backend through one stateless relay in core: `POST /webhooks/clerk` is passed through raw, with its signature headers, to the backend's private webhook route. The backend verifies the signature and writes the row. Core holds no webhook secret and stores nothing.

**Rollback (new).** The old rollback, "unset `FDE_SERVICE_URL` and run the FDE tools in core", would make core write, so it is gone. Now:
- With the backend URL setting unset (`AADM_BACKEND_URL`, CFG-TECH-03), core serves every stateless tool, including the 8 FDE tools, which store nothing, in process. Every save tool returns `storage_unavailable` with a pointer to the planner's local mirror and export (§11). Core never falls back to writing.
- A bad backend release is rolled back by redeploying the previous backend image. Migrations are forward-only, and each slice ships its own down step (DM1-c4).
- **Contract window (v0.13.8, D42 (c)).** The website and the backend each support the previous API version (N-1), so either can be rolled back one release without breaking the other. Each service shows its API version in `/health` (DM0-b1 for the backend; DM5-b4 for the website, which also tests itself against the current and the previous backend API version, v0.13.9). **(v0.14, D43, DEPLOY-01)** The same window covers the core → backend hop: core and backend are separate services from one image and are deployed and rolled back separately, so core sends its API version on every forwarded call and the backend accepts N and N-1 and refuses N-2 with `rejected` / `api_version_unsupported`. Core's `/health` shows its release (image tag and start mode) and API version (DM0-b4). Each service's release identity is its image tag plus its start mode.
- **CI gate and startup checks (v0.15, D44 (4), (7); TST-01, DEPLOY-01, OPS-05, ENV-01, ENV-02; AUTH-43).**
  - Each repo runs CI on every pull request and every push to `dev`: build, scoped tests, a secret scan and a dependency audit (DM0-e1, DM0-e2).
  - A red run blocks the deploy. Railway's wait-for-CI setting is on for the `dev` services: aadm-mcp core (and `aadm-backend` once DM0-b3 creates it) and aadm-website. A push to `dev` deploys only after its CI run is green. Brian owns Railway, so turning the setting on is his own step.
  - Bypassing the gate by hand counts as a failure (AUTH-43).
  - Each start mode checks its settings at boot and exits with a named reason when one is bad. In production, core never runs open (DM0-d2, CFG-TECH-25, CFG-TECH-26).
  - Each service still deploys and rolls back on its own (DEPLOY-01). A release that needs a new setting set on Railway first, such as the environment setting before DM0-d2 or DM5-d1, is marked coordinated in its slice (OPS-05).

**Technical settings (operator-configured; not workspace policy).** The M2M token lifetime (CFG-TECH-01), the hop timeout (CFG-TECH-02), the backend URL (CFG-TECH-03), the start mode (CFG-TECH-04), the M2M audience (CFG-TECH-05) and the ports (CFG-TECH-15) are listed, with their defaults and limits, in §5.18. They are security and runtime settings for whoever runs the containers (Brian for AADM Cloud; the customer's platform team in mode (c)), not customer governance policies (§13j), not workspace settings, and not subject to D19 loosening. The operator sets the values; no bot sets or reads them. Database, storage and webhook-signing settings are set **on the backend only**; core has none.

**Shared pieces.** Core reads `REDIS_URL` for its caches. The backend reads `REDIS_URL` for `run_state_control`'s run-store, plus its database and storage settings. Ports: CFG-TECH-15.

**One brand, access by plan (D33, Brian, Oct 25, 2026, 2:53 PM ET: "go one brand").** AADM Field is sold inside aadm.io, not as a second site or stack: one Clerk instance (accounts.aadm.io), one MCP URL (mcp.aadm.io, `aadm-core`), one `aadm-backend`, and the member area in `aadm-web`. Plans decide access: Free (the open AADM Standard plus a trial), Code (`mcp`; agentic coding, self-serve, per coder), Field (`fde`; per engagement or team, invoiced) and Code + Field (`mcp_fde`; the bundle, 15% less than both added together). AADM Field is a separate plan at the AADM Code price and excludes the Code tools (D36). The one AADM Field page on the public site is aadm.io/field (confirmed, D36; §7 item 15, §13q.1). Brian: "aadm mcp agentic coding doesn't have database. and nothing is persist. With aadm fde we will need a database to run the app, and it will have own mcp connections as well." So:
- AADM Field MCP tools, including the 8 FDE tools (D36), are served by `aadm-core` and listed only for plans with `fde_tools` (§9, FIX-32); they stay stateless in core and save through `aadm-backend`. D30 and FIX-27 are unchanged.
- **Same URL, tools by subscription (confirmed by Brian, D36).** ADR 004 keeps "one MCP URL", so AADM Field tools appear on mcp.aadm.io for Field plans; there is no separate path.

### How AADM Field relates to AADM Field MCP calls (v0.13; Brian, Oct 25, 2026, 3:06 PM ET)

AADM Field is one product reached two ways: people use the **Field web app** in the aadm.io member area, and AI coders use the **same MCP endpoint as AADM Code** (mcp.aadm.io), where Field tools are listed only for Field plans. Both end at one place to save: `aadm-backend`, the AADM Field services.
1. **Field web app → `aadm-backend`.** A signed-in person's browser loads the Field screens from `aadm-web`, which calls the backend's plans API server-side, directly, with that person's Clerk session. The backend checks the plan and the person's role, then writes. People-only steps (Sign, Go, approve, consent) take this path only (FIX-03).
2. **Field MCP call → `aadm-core` → `aadm-backend`.** The FDE's or customer's AI coder calls mcp.aadm.io. The heavy reading (repo crawl, platform configuration export) happens in that coder, inside the customer's walls; only allowlisted details and configuration names cross. `aadm-core` pre-checks the plan (cached Clerk read), runs any stateless work (checks, `config_diff`, `config_verify`), and forwards each save to `aadm-backend` with a Clerk M2M token carrying the verified user. The backend re-checks the plan and writes.
3. **Code-only MCP call → `aadm-core` only.** An AADM Code call is answered in core and never reaches the backend; nothing is saved (FIX-27, DM6-p4).
4. **Clerk Billing webhooks → core relay → `aadm-backend`.** Core passes the event through unchanged and holds no secret; the backend verifies the signature and writes the `entitlement` table.

| Path | Caller | Entry point | Auth | Who checks the plan | Who writes |
|---|---|---|---|---|---|
| 1 | a person in a browser | `aadm-web` (aadm.io member area), then the backend plans API | the person's Clerk session | `aadm-web` hides screens by feature; `aadm-backend` re-checks on every call | `aadm-backend` |
| 2 | the FDE's or customer's AI coder | mcp.aadm.io (`aadm-core`) | Clerk OAuth token, `ak_` key or `aadm_` dashboard token (v0.14); core → backend by Clerk M2M token | `aadm-core` pre-checks (cached); `aadm-backend` re-checks | `aadm-backend` |
| 3 | a coder on a Code plan | mcp.aadm.io (`aadm-core`) | Clerk OAuth token, `ak_` key or `aadm_` dashboard token (v0.14) | `aadm-core` | nobody (nothing is saved) |
| 4 | Clerk Billing | `aadm-core` webhook relay | Clerk's webhook signature, verified by the backend | not applicable | `aadm-backend` (`entitlement` table) |

**Self-hosted mode (c).** The customer runs the one `aadm-mcp` image in both modes (`core` and `backend`), the `aadm-web` image built from `aadm-website`, and their own Postgres and file storage, which only the backend reaches. Routing, the M2M token and the ports are identical; only the identity provider (OIDC) and the license host differ (Stage 8).

## 13e. FDE value stream: the frame for every FDE workspace (v0.7; Brian, Oct 25, 2026, 10:51 AM ET)

**What it is.** FDE work runs as five phases: **Strategy → Plan → Readiness → Adopt → Governance**. They form a **loop, not a sequence**. All five are live at once in every FDE workspace. Any new fact, risk, access change, missed measure or lesson can send work back to any phase. The workspace home shows the five phases, with a health color and open items for each.

**Not to be confused with the delivery map.** The delivery-map stages in §18 (Stage 0 to 8) are the build plan for *AADM itself*. The value stream is the *customer engagement's* status inside one FDE workspace. A customer's own delivery maps live in the Plan and Adopt phases.

**Deconflict.** "Value stream", and the phase words in that order, have 0 hits in aadm-mcp `src/` and `resources/` and in aadm-standard. The AADM lanes Navigator (delivery), Investigator (defect) and Sentinel (assurance) are *tool routing* for a coder (glossary `:121`), not engagement phases. **NEW**, and it reuses every piece below without copying it.

| Phase | What lives here (no duplicates) | Entry signals | Outputs | AADM tools that serve it | Loop-back triggers (→ phase) | Health (THR-45; values in §5) |
|---|---|---|---|---|---|---|
| **Strategy** | Outcome clarification (§13f); Speed Layer current and future state (§13g); use-case **candidate discovery and prioritization** (the V × F grid, §13i.2), ending in one `chosen` use case. Definition and approval move to Plan in v0.9 (§13o) | New workspace; a sponsor change; a measure miss; a pilot "stop" or "iterate" | Signed `OUT-`/`MEAS-` items; a prioritized use-case list with `chosen` candidates handed to Plan | `prd_outline`, `prism_frame`, `grill_questions` (outcome bank), `plan_delivery` (`engagement_kind: fde`), `speed_layer_assess` (new, §13g) | An off-target lagging measure (→ Strategy, re-check the outcome); a use case rejected in Readiness or at approval (→ Strategy, §13o.5) | CFG-HEALTH-01 (§5) |
| **Plan** | **Five capabilities (v0.8 and v0.9, §13m), in order:** **Use case definition and approval** (v0.9, §13o: a chosen use case built from the FDE records by ID, ready by THR-59, approved and frozen); **Cornerstone** (§4.1); **Batch and slice** (stages, batches and slices under the batching standard, §13n, with `delivery_mode` applied, §13l); **Prompts** (one repo-grounded prompt per slice); **Delivery map** (the live map, "You are here", render, replan). Plus pilot charters (§13i.3) | A use case `chosen` in Strategy; outcomes signed; a pilot picked; an amendment | An approved, frozen use-case version; a signed cornerstone version with its `delivery_mode`; saved map with 0 blocking `CS-` findings; `ready` prompts; the live map; pilot charter | Use case: `use_case_save`/`get`/`submit`, `readiness_assess` (use-case scope), `grill_questions` (`aadm://doctrine/use-case-definition`), `user_flow`, `gap_score`. Cornerstone: `cornerstone_save`/`get`, `interrogate_plan`, `invariant_register`, `grill_questions`. Batch and slice: `delivery_map`, `delivery_map_save`, `slice_issues`. Prompts: `delivery_map_prompt_save` plus its lint. Delivery map: `delivery_map_get`, `delivery_map_render`, `replan_check` | A new or changed `TF-` fact cited by a REQ (→ Plan amendment via `replan_check`); a relevance gap R1–R7 (→ Strategy or Plan); a stale `commit_read` (→ Prompts); a host version outside an `HC-` range (→ Readiness Q8); changes requested on a use case (→ Plan, the Use case tab); a use case rejected (→ Strategy); a use case v N+1 approved (→ Plan replan, §4.3) | **Plan rolls up five capabilities** (CFG-HEALTH-02; Standard: the worst of five): Use case CFG-HEALTH-10, Cornerstone CFG-HEALTH-06, Batch and slice CFG-HEALTH-07, Prompts CFG-HEALTH-08, Delivery map CFG-HEALTH-09 (§5). Each sub-chip names the rule that set it |
| **Readiness** | The Readiness and risk view (§13h): four gap types, the access matrix; Terrain (§13b) | Draft cornerstone exists; any §13h.8 trigger | Gaps and scored risks; a granted access set | `readiness_assess`, `terrain_get`, `gap_score`, `assurance_run`, `agent_authority_recon`, `tenant_isolation_check` | A critical risk or blocked access (→ Plan: re-scope, or → Strategy: change the use case) | CFG-HEALTH-03 (§5) |
| **Adopt** | Slices, prompts, verdicts, cutover and rollout, pilots running (§13i), measure checks after go-live (§13f.3 rule 5) | Go on a slice; a pilot start; go-live | Reports and verdicts; pilot results; measure checks | `delivery_map_next_slice`, `delivery_map_report`/`verdict` (ON PLAN and DRIFT verdicts stay here in v0.8, §13m), `predone_review`, `cutover_parity_check`, `run_state_control` | A DRIFT verdict (→ Plan); a measure miss (→ Strategy); new feedback (→ Plan or Strategy via triage); an access change (→ Readiness) | CFG-HEALTH-04 (§5) |
| **Governance** | The risk register (§13h); the D8 co-sign; audit (`plan_event`); `lessons_register`; the governance, standards and best practices map (§13j); stakeholder management (§13k) | Any sign, accept, go/no-go or policy change; a review falling due | Decisions with co-signs; accepted risks; lessons; the governance map | `fde_engagement_recon`, `fetch_auth`, `doctrine_index`, `lessons_register`, `grill_questions` (readiness bank), `audit_interview` (`readiness` bank) | A missing or assumed governance item (→ Readiness gap G10); a lesson matching current work (→ Plan); a blocking stakeholder (→ Strategy) | CFG-HEALTH-05 (§5) |

**(v0.13.7, D41) In plain words:** a phase's **health** is its open items and drift, by the CFG-HEALTH rules; **Readiness** is the customer's organizational and data readiness to adopt (the four gap types of §13h.3), never infrastructure; AADM shows no server, region or uptime status anywhere. On the Field home each engagement shows its **delivery status** under Plan (On plan, Drifting, Blocked; DM6-g1), not the worst-of color. **Workspace health rolls up the five phases per CFG-HEALTH-02 (Standard: the worst of the five).** Every color shows the rule that set it (for example "Readiness red: ACC-4 blocked, need-by Nov 2"), and AADM computes it; the UI never guesses (`aadm://doctrine/guidance-feedback-seam`).

**UX: one workspace home.** The header is the loop: five phase chips in a ring order, each with its color and open-item count. Clicking a phase opens its list of open items, with links into the place each item lives:
- Readiness → the Readiness and risk view;
- Governance → the governance map and the Stakeholders page;
- Strategy → outcomes and use cases;
- Plan → the five capability tabs: Use case, Cornerstone, Batches and slices, Prompts, Map (§13m, §13o);
- Adopt → the live map and pilot cards.

Below the header: the pilot cards (§13i.5), then "Needs you". The weekly rhythm is to clear the reds, then the ambers. Gates are CFG-RISK-03 and CFG-RISK-04 plus the pilot gates (CFG-PILOT-01 to CFG-PILOT-07), all in §5.

## 13f. Outcome clarification (v0.7; Brian, Oct 25, 2026, 10:43 AM ET)

**What it is.** The first step of every Cornerstone (step C0 in §4.1), done before contracts and data. The FDE and the customer agree what "done" means for the people it is for, how they will know, and who decides. Everything after this traces back to it: requirements, acceptance criteria, risks, map stages and the post-go-live checks.

### 13f.1 What already exists (deconflict, read at aadm-mcp `d8af2e4f7c` and aadm-standard `9a16239f23` on Brian's Mac, Oct 25, ~10:45 AM ET)

| Existing piece | What it already captures | Verdict |
|---|---|---|
| BIS `## Outcome` (`resources/templates/bis-template.md:39-43`) | One recipient-framed paragraph: the end state that counts as success; validated with `grill_questions` | **EXTEND**: it becomes the outcome's *desired end state* field; we add problem, impact, horizon and measures |
| BIS `## Success criteria` (`bis-template.md:78-85`) | Observable, testable criteria that every test must trace to | **EXTEND** into *measures* with baseline, target, method, where, by-date and leading/lagging |
| BIS Acceptance Gate 1 (`bis-template.md:120-122`) | The core four (Outcome, Scope, User roles, Success criteria) must be unambiguous | **REUSE**: the outcome sign rule (§13f.3) is part of handoff check 3 |
| FDE outcome contract (`resources/templates/fde-outcome-contract.md:18-40`) | Problem, "what working means", who accepts; named acceptors: sponsor, eval_owner, operator, internal_successor, security | **EXTEND**: those 5 roles seed the stakeholder list; we add affected users, risk/compliance, the FDE, and a RACI letter per person |
| `fde_engagement_recon` (`src/fde-engagement-recon.ts:167-169`) | Checks a transfer package for engagement contract, acceptor map and gate register | **REUSE** at handover (DM6-b2); it reads the same acceptor map |
| `prd_outline` user stories (`src/prd-outline-builder.ts:30`) | "As {role}, I need to {action}, so that {outcome}" | **REUSE** in C1 Capture; stories cite an `OUT-` ID; not a measure |
| `user_flow` intent interview (`src/user-flow-interview.ts:89-105`: `q_user_goal`, `q_cold_start_pain`) | One screen's user goal and pain | **REUSE** per flow; engagement outcomes sit above it |
| `grill_questions` (`src/tools.ts:9336`) | Accepts `templates` URIs, but returns the generic 5-question bank for the URI's kind (tried with `aadm://templates/fde-outcome-contract`, Oct 25: all 5 questions were about template sections, none about baselines or targets) | **EXTEND**: a per-URI bank for a new `aadm://doctrine/outcome-clarification` (DM2-o3) |
| `audit_interview` (`:6143`), `map_feature` (`:5976`), `journey_map` (`:4949`) | Sentinel scoping; stack-area hints; a user-journey map | No overlap. `journey_map` may link an affected user's journey to an outcome; nothing else is reused |
| "stakeholder", "success metric", "KPI", "baseline", "target value", "RACI" in aadm-mcp `src/` | 1 hit, `src/reader-orientation.ts:415` ("No stakeholder sign-off…"), which is wording, not a model | **NEW**: stakeholder roles and structured measures |
| This PRD: §4.1 C1 "stakeholder notes", §4.2 check 3, §15 success measures | Notes, a presence check, and this feature's own measures | **EXTEND**: C0 now comes first; check 3 is made specific by checks 9 and 10 |

Names: "Outcome clarification", `OUT-`, `MEAS-` and `SH-` have 0 hits in aadm-mcp and aadm-standard, and none clashes with Navigator, Sentinel, Pathfinder, PRISM, SEAM, UDALI, SIGL, Survey, Atlas or Charter.

### 13f.2 The outcome record (stored as cornerstone items, so it is frozen and signed with the version)

| Field | What goes in | Limit |
|---|---|---|
| `OUT-<n>` desired end state | What is true for the user or customer when this is done, in their words ("Branch staff open a new account in one visit") | FIX-07; outcome count per CFG-HANDOFF-02 |
| problem today | What hurts now, one sentence | FIX-07 |
| impact | Business value and who benefits, with a number where possible (hours saved, cost, revenue, risk reduced) and the beneficiary group | value as number + unit, or "not quantifiable" with a reason |
| stakeholders `SH-<n>` | One row per person or group: role (sponsor, decision owner, affected users, operator, risk/compliance, FDE, plus the outcome contract's internal_successor and security), name or group, and RACI letter (R, A, C or I) | exactly 1 **A** per outcome, and the A is the decision owner = the workspace's `acceptor` (D8) |
| measures `MEAS-<n>` | name; type `leading` or `lagging`; baseline (number, unit, as-of date, source); target (number, unit); how it is measured; where (the system or report, as an allowlisted name); by when (date); who checks | no field may be unset; lagging and leading minimums per CFG-HANDOFF-02 |
| constraints and non-goals | What must not change and what is out | FIX-07 |
| assumptions to validate | Each with how and by when it will be checked | FIX-07; each becomes a gap if past its date (§13g.3, relevance) |
| time horizon | Start date, go-live date and the date the lagging target must be met | 3 dates, in order |
| sign-off | The customer's acceptor signs the cornerstone version that holds the outcomes (D8) | part of C6 |

Outcomes are **allowlisted data only**: the same single-line rules and secret and code filters as §13a.2. They are free text with tight limits (new allowlist kinds `outcome`, `measure`, `stakeholder`). Stakeholder names are stored only as the customer typed them. A code fence or key-shaped string is refused.

### 13f.3 Trace rules

1. Every `REQ-*` and `AC-*` lists the `OUT-` IDs it serves (handoff check 9).
2. A cornerstone can't be signed unless at least one outcome has a complete baseline, a target and a decision owner, and every outcome meets CFG-HANDOFF-02 (handoff check 10).
3. Every risk names the `OUT-` it threatens. Its impact score is anchored on that outcome's measures (§13g.5).
4. Every delivery-map stage lists the `OUT-` IDs it moves (`stage.outcome_ids[]`). Its name states that result, e.g. "Branch staff can open an account in one visit". `delivery_map_save` refuses a stage with no outcome, except stages tagged `enabler`, whose largest share of slices is CFG-READY-10.
5. After go-live, each measure is checked against its target by the named checker, on the schedule in CFG-DATE-08. An off-target result returns a `lessons_register` candidate for the host and marks the linked risks for review (DM7-b).

### 13f.4 Where it sits in the FDE's day (UX first)

- **Kickoff with the sponsor** (the first meeting): the FDE opens the new cornerstone, and the **Outcome** card is the first thing on it. It is a short guided form: end state, problem, one lagging measure with baseline, target and date, and the decision owner. Those are the required first-outcome inputs (CFG-HANDOFF-03), about 5 minutes. Everything else can be filled later, before sign-off.
- **Challenge prompts** appear beside the form, from `grill_questions` on `aadm://doctrine/outcome-clarification`, e.g. "What number tells you this worked, and what is it today?" and "Who can say no to go-live?". The FDE asks them live; AADM does not score answers.
- **Always visible:** the outcomes sit at the top of the Cornerstone view and in the live map's header as one line per outcome with its target and the latest measure value. Each map stage shows the `OUT-` tags it moves.
- **Weekly:** "Needs you" counts measures whose check date has passed.

## 13g. Speed Layer current and future state (FDE) (v0.7; Brian, Oct 25, 2026, 10:48 and 10:57 AM ET)

**What it is.** In each FDE workspace, the FDE rates the customer's **current state** and the **future state** they need on Brian's **Speed Layer Design Canvas** (*The AI Lead*, Figure 17, "Speed Layer Design Canvas", B 14319, ch. 24, p.450; image `sources/speed-layer-canvas.png`). The gap between the two ratings feeds Readiness (§13h) and the risk register. Brian's framing (10:48 AM ET): AI gets things wrong because the data is wrong. The book says the same: "'garbage in, garbage out' … Strong data governance and quality are nonnegotiables" (B 14341–14345, p.451).

**Source of everything below:** `/workspace/blueprint/aadm/speed-layer-framework.md` (cited as **SLF §n**), which quotes the book (**B** line), its figure deck (**D** slide) and the 2026 deck (**M26** page). **Box names and definitions are used exactly as sourced, and nothing is added.** Anything Blueprint proposes is marked PROPOSED.

**Decided by Brian, Oct 25, 2026, 11:00 AM ET (D20–D22):**
- **(a) Canvas, decided:** the canonical canvas is the book's **Figure 17 with its 30 boxes** (SLF §2). The 2026 Performance Mesh views are optional overlays a workspace can switch on (BGAI, M26 p3; AGAI, M26 p4; AI governance view, M26 p6; SLF §2d). (D20.)
- **(b) Rating scale, decided:** each box is rated for current and future state on Brian's three-level scale from the Digital Strategy Diagnostic: **Data-aware / Data-governed / Data-led** (B 2832–3080, pp.80–85; anchors e.g. B 2837–2844; SLF §3), plus **not assessed**. The sources give this scale for the organization, not per box (SLF §9 item 4). Applying it per box is Brian's decision, not a sourced rule (D21.)
- **(c) Frame, decided:** Brian's five-phase FDE loop (§13e) is the workspace frame. The book's stages (**Discover, Design, Develop, Deploy | Drive, Deliver**; Figure 15, D s47; B 13226–13244, p.415; SLF §3) are the Speed Layer *build method* inside **Plan** and **Adopt**. **Adapt** loops back to Discover, as "Adapt closes the loop — results re-enter Discover as new findings" (M26 p7). The five-phase loop itself is not in the sources (SLF §7, §10 item 5). (D22.)

### 13g.1 The 30 boxes (SLF §2a–2c; exact names)

| Zone | Boxes (ID · name) | Cite |
|---|---|---|
| Top row: governance (8) | T1 Data Governance · T2 Data Processes & KPIs · T3 Data Standards · T4 Data Catalogue · T5 Data Service Management · T6 Security Risk Management · T7 Enterprise Architecture · T8 Architecture Governance | B 13485–13517, B 14624–14647 (pp.424, 459) |
| Middle band: architecture (13) | M1 Data Producers · M2 Enterprise Outcomes · M3 Orchestration · M4 Discovery · M5 INGEST · M6 STORE & ENRICH · M7 PUBLISH · M8 EXPERIENCE · M9 ENGINE · M10 Sources · M11 GUIDANCE · M12 Integrations · M13 Data Consumers | B 14486–14739 (pp.455–462); D s49 |
| Bottom row: infrastructure and DevOps (9) | L1 DEVOPS Practices · L2 Development · L3 Optimization · L4 Deployment · L5 Automation · L6 Observability · L7 Security · L8 Infrastructure Management · L9 Cloud Governance | B 13521–13563, B 14648–14676 (pp.425–426, 459–461) |

Each box's "what it captures" text is the quoted definition in SLF §2, and the view shows it verbatim with its cite.
- **Not defined in the sources:** M4 Discovery, M10 Sources and M12 Integrations (SLF §9 items 1–2). These show "Definition not in sources (FDE to define with customer)".
- **Naming conflicts (SLF §9 item 6; D24, decided 11:08 AM ET: Figure 17's names):** the figure spells "Data Catalogue" and the text "Data Catalog"; Figures 15 and 16 say "Navigation" where Figure 17 says "GUIDANCE". The canvas name is used until Brian picks.

### 13g.2 What a rating holds (`SLR-<box>`, per workspace, allowlisted)

| Field | Values |
|---|---|
| box | T1…L9 |
| current rating, future rating | `data_aware`, `data_governed`, `data_led`, `not_assessed` (D21) |
| evidence | `TF-` facts, as CFG-SL-02 requires for any rating other than `not_assessed` |
| source and verified date | where the rating came from (`interview`, `terrain`, `document` name) and the date |
| confidence | `high`, `medium` or `low`, by the rules in CFG-SL-03 |
| aspects checklist | one entry per aspect (§13g.3): `met`, `gap` or `not_assessed`, plus a short note (FIX-07) |
| links | `OUT-`, `UC-`, `REQ-` it supports; future-state ratings need the links in CFG-SL-02 |

Future-state ratings become cornerstone items (`SL-T<box>`) that trace to an `OUT-`, like any requirement (§13f.3).

### 13g.3 The assessment checklist per box ("Aspects by box", SLF §6)

The 8 aspects are Data, Governance, Security, Infrastructure, Quality, Enterprise architecture, Customer tech stack, and Other (people, process, adoption) (SLF §6).
- **Sourced cells:** where SLF §6 marks a cell **S:**, the checklist shows that quote and its cite as the prompt. For example, T1 × Data shows "quality, availability, and integrity are the building blocks" (B 13486); L6 × Quality shows "Monitoring, logging, and tracing" (B 13548–49).
- **Unsourced cells:** a cell marked "—" (151 of 240, SLF §9 item 10) shows **"FDE to define with customer"** and is never pre-filled.
- **Tech stack column:** cells marked "— (method M26 p5 only)" show the sourced method ("a product appears in every box it serves", M26 p5) and let the FDE plot the customer's products onto that box from Terrain.

### 13g.4 Terrain coverage for the canvas (EXTEND Terrain §13b.2)

SLF §6 maps each box's aspects to the 12 Terrain sections (PROPOSED by the extraction). It finds that **M8 EXPERIENCE** and **L6 Observability** have no Terrain feed, and that **Quality** (tests, monitoring, data-quality checks) has no section. Partial gaps: T2 KPIs, T3 Data Standards, M3 Orchestration, M4 Discovery, M11 GUIDANCE, M13 Data Consumers, L3 Optimization (SLF §6).
- **EXTEND Terrain with 3 optional sections (13–15):**
  - **13 Experience:** analytics and visualization surfaces and the user groups that use them; allowlist kind `experience_surface` (name, tool label, user group).
  - **14 Observability:** monitoring, logging, tracing and alerts per system; allowlist kind `observability_signal` (system, `logs`/`metrics`/`traces`/`alerts`, tool name).
  - **15 Quality:** tests, data-quality checks, KPIs and performance baselines; kinds `quality_signal` and `data_trust` (§13h.10).
- **Scope:** they are optional, so THR-22's "8 required" is unchanged, but Speed Layer boxes M8, L6, T2 and L3 can't reach `high` confidence without them. The remaining partial gaps (T3, M3, M4, M11, M13) are recorded here as **gaps, not new sections**. Their ratings carry `medium` or `low` confidence until a fact exists (slice DMT-b3).

### 13g.5 From gap to risk

- **Gap check S1 (CFG-SL-04):** for each box, a gap between the current and future rating at or above CFG-SL-04 becomes a Readiness gap. Its type follows the zone:
  - top row → **Governance**;
  - bottom row → **Quality**;
  - middle band → **Quality**, plus **Relevance** when the box links to an `OUT-` measure.
- **Suggested score:** the likelihood per gap size is in CFG-SL-04. Impact is anchored on the linked outcome (§13h.5).
- **Unrated boxes:** a box marked `not_assessed` but linked to a `chosen` use case is also a gap.
- **Data trust and security boxes get their own checks** in §13h.3:
  - **Q1 data quality and trust** reads T1 Data Governance.
  - **Q7 data standards and catalogue** covers T3 and T4. For the in-scope data classes (CFG-READY-08), a format and lexicon standard is recorded ("uniform data formats, structures, and lexicons", B 14628–14630) and a catalogue entry exists ("trust in the data assets", B 14632).
  - **G12 security** covers T6 and L7. For each in-scope system the sourced checklist "Implement RBAC … encryption protocols for data at rest and in transit … regular security audits … a data breach response plan" (B 14838–14841) is `known`, and the security risk assessment is recent enough (CFG-READY-13).
- **Allowlist:** ratings and checklist entries are allowlisted metadata only (§13a.2). The allowlist rule is unchanged.

### 13g.6 UX

- **Placement:** the Speed Layer view sits in the **Strategy** phase (§13e), next to Terrain. It is the canvas laid out as in Figure 17, with each box showing its current → future rating as two small chips and a confidence dot.
- **Gaps:** gap boxes are outlined. Clicking a box opens its definition (verbatim, cited), the aspects checklist, its evidence facts and "Raise risk".
- **Kickoff speed:** at kickoff the FDE rates only the boxes linked to the chosen use case (usually 4–8), in about 10 minutes. The rest stay `not_assessed` until needed.
- **Overlays:** an optional toggle shows the M26 overlays (D20; CFG-SL-06).

## 13h. Risk assessment and mitigation (FDE) (v0.7; Brian, Oct 25, 2026, 10:43 and 10:46 AM ET)

**What it is, in plain words.** Each FDE workspace keeps one living **risk register**. Before work starts, a **readiness assessment** looks for four kinds of gap: quality, relevance, access and governance. Every gap it finds becomes a risk, scored on **likelihood × impact** and given a **mitigation**: an owner, a due date, and the AADM tool or control that proves it worked. The register covers risks to the customer, to the engagement and to AADM. It is proactive: most risks should be found at kickoff, not after something breaks. Gates stop sign-off, cutover and individual slices while serious risks are unowned.

### 13h.1 What already exists (deconflict, read on Brian's Mac at aadm-mcp `d8af2e4f7c`, aadm-standard `9a16239f23`, Oct 25, ~10:45 AM ET; plus the AADM MCP tool list)

Grep for `risk`, `likelihood`, `impact`, `severity`, `mitigation`, `residual`, `risk_register`: `likelihood`, `risk_register`, `inherent` and `risk_score` have **0 hits** in aadm-mcp `src/`, `docs/`, `resources/` and `AGENTS.md`, and aadm-standard has no likelihood scale or risk matrix. Nothing in AADM scores likelihood × impact or stores risks today.

| Existing piece (file:line) | What it does | Verdict |
|---|---|---|
| aadm-standard `templates/prd-lite.md:61-63`, `templates/bis-lite.md:62-64` | A two-column table: Risk / Mitigation (bis-lite adds owner) | **REUSE** as the lite view: the register exports to this shape; aadm-standard is not changed |
| aadm-standard `docs/compliance-checklist.md:42`, `:54`, `:119` | Checklist items: known risks and mitigations captured; cross-layer risks; high-risk actions mapped to human approval | **REUSE**: the register satisfies item :42; G1 uses :119 |
| aadm-standard `standards/human-in-the-loop.md:52`, `:56` | Inventory high-risk actions; verify rollback or mitigation before irreversible steps | **REUSE** as the basis of the agent-run-actions class and the cutover gate |
| aadm-standard `docs/sentinel-audit-programs.md:80` | A **residual risk register** section in a Sentinel audit deliverable (latent seams, deferred proof) | **EXTEND**: Sentinel residual items import as register rows (class `deferred_proof`); the Sentinel doc keeps its own section |
| aadm-mcp `src/journey-trace.ts:714-764`, `src/chain-user-lines.ts:69-71` | Attestation status `ready_with_residual` with `residual_risk[]` strings | **REUSE**: each string can be raised as a risk in one click (prefilled, linked to the slice) |
| `src/sentinel-attestation.ts:172`, `:238` | "residual risk lands on latent seams"; accepted risk or follow-up | **REUSE** as an import source |
| `src/fde-engagement-recon.ts:137`, `:171` | `residual_dependency_window` in the FDE verdict | **REUSE**: feeds the key-person and handoff class |
| `src/agent-authority-recon.ts:77`, `src/assurance-run.ts:547` | Findings classed `confirmed_defect` or `unverified_risk`, with a severity | **REUSE** as evidence; severity names are not mapped onto L × I (different meaning) |
| `src/delivery-map.ts:129`, `:459` | `risk_flags` on a feature's data model | **REUSE**: shown on slice cards next to the risk badge; a flag is a hint, not a risk |
| `src/prism-frame.ts:374-388` | A `risks[]` list of drift patterns | **REUSE** as suggestion text |
| `src/doctrine/rules-schema.ts:82` | `severity: blocking | warning` for doctrine rules | No clash; different meaning |
| Tools `invariant_register`, `lessons_register`, `run_state_control`, `tenant_isolation_check`, `cutover_parity_check`, `agent_op_contract_check`, `projection_budget`, `fanout_guide` | The 8 FDE tools; each stores nothing | **REUSE as mitigation evidence** (§13h.7); none is duplicated |
| Tools `gap_score`, `assurance_run`, `audit_interview`, `audit_outline`, `audit_run`, `grill_questions`, `interrogate_plan`, `replan_check` | Phase gap register per feature or surface; Sentinel routing and interviews; challenge questions; plan lint; continue-or-stop | **REUSE** as assessment evidence; **EXTEND** `audit_interview` with a `readiness` bank and `grill_questions` with a per-URI bank (DM6-d3) |
| `pressure_test` | A layered pressure scaffold for one frontend surface | **REUSE** on the Readiness and risk view (DM6-e3); it is not a risk tool |
| `resources/auth/AUTH-53-Agent-Scope-Authority.md`, AUTH-14 (approval), AUTH-29 (audit log), AUTH-31 (decision logging), AUTH-43 (release gate), AUTH-52 (AI change qualification) | Control texts | **REUSE** as governance and access checks via `fetch_auth` and `grill_questions` |
| "access matrix", "access request", "segregation of duties" | 0 hits in all three repos | **NEW**: the access matrix (§13h.4) |
| This PRD §14 (Risks) | Risks to building this feature | Unchanged: §14 stays the build's own list; the register is for FDE engagements |

**Names.** "Risk assessment and mitigation", "Readiness and risk", `RISK-`, `ACC-`, `risk_save`, `risk_get`, `readiness_assess`, `access_save` have 0 hits in aadm-mcp and aadm-standard, and none clashes with Navigator, Sentinel, Pathfinder, PRISM, SEAM, UDALI, SIGL, Survey, Atlas or Charter. "Register" follows the existing `invariant_register` and `lessons_register` style.

### 13h.2 Flow

1. **Kickoff:** outcome clarification (§13f), then Terrain grounding (§13b), then the **readiness assessment** (`readiness_assess`). The assessment runs on the cornerstone *draft*, before sign-off.
2. **Every failing check becomes a gap, and every gap becomes a risk** with status `open`. The rule fills in a suggested class, likelihood and impact. The FDE confirms the score and sets the mitigation type, owner, due date, evidence tool and the expected residual score.
3. **Sign-off:** the cornerstone sign gate checks the register (THR-36).
4. **During delivery:** reassess on every trigger in §13h.8. Slice, cutover and access gates hold (THR-36).
5. **After go-live:** measure checks (§13f.3 rule 5) feed off-target results back as risk reviews.

There is no build-order cycle. Relevance checks run in two phases: before sign-off they use cornerstone items only (REQ/AC → OUT). After the map is saved they also use slices (slice → REQ → OUT). The sign gate uses only the first phase.

### 13h.3 The four gap types

Every pass rule's numbers are in §5 (CFG-READY-02 to CFG-READY-14, CFG-MODE-03 to CFG-MODE-05). Tightening and loosening follow §5.1 (D19).

| Gap type | What it checks | Inputs | Checks (ID: pass rule) | Output | Evidence tools |
|---|---|---|---|---|---|
| **Quality** | Whether the data and systems we build on are good enough to trust | Terrain facts (`quality_signal`, `data_trust`, `observability_signal`, `experience_surface` and the existing kinds), Speed Layer ratings (§13g), outcomes, `audit_interview` `readiness` answers | **Q1 data quality and trust** (Speed Layer T1 Data Governance): every data class the outcomes depend on has an owner, a known source of truth and a recent passing quality check (CFG-READY-02). **Q2 Terrain:** required sections filled, cited facts fresh, few `proposed` or `stale` facts (CFG-READY-03). **Q3 tests:** coverage from each in-scope repo's own CI, and named automated tests per `AC-` before its slice is done (CFG-READY-04). **Q4 observability:** logs, metrics and alerts per in-scope production system (CFG-READY-05). **Q5 docs:** owner and runbook facts (CFG-READY-06). **Q6 release hygiene:** a pipeline, and a recently tested rollback (CFG-READY-07). **Q7 data standards and catalogue** (Speed Layer T3, T4): a recorded format and lexicon standard and a catalogue entry per in-scope data class (CFG-READY-08). **S1 Speed Layer:** bottom-row and middle-band boxes whose future rating is above the current (CFG-SL-04). **(v0.8, `plug_in` only) Q8 host version drift:** every extension point the plugin uses has a current host `version` inside its `HC-` range, verified within CFG-MODE-04 before pilot start and before Go on a `cutover` or `rollout` slice. **Q9 rate limits:** each `HC-` call's planned peak stays within the CFG-MODE-03 headroom; `unknown` limits follow CFG-MODE-05 | Gaps `Q1`–`Q9` and `S1` per system, each with the failing number | `terrain_get` freshness (REUSE); host-run `repo_feature_map` and `repo_architecture_map` (REUSE); `gap_score` feature roll-up (REUSE); `assurance_run` and Sentinel for observability and test proof (REUSE); `invariant_register` "missing red proof" (REUSE); allowlist kinds `quality_signal` and `data_trust` (EXTEND §13a.2) |
| **Relevance** | Whether the planned work actually moves the outcome measures | Outcomes and measures, cornerstone items, the saved map, Terrain change events | **R1:** every `REQ-`/`AC-` traces to an `OUT-`. **R2:** no outcome lacks a requirement. **R3 (after map):** slices trace to a REQ or AC, with a cap on `enabler` slices. **R4:** each lagging measure is moved by a stage. **R5:** no requirement cites a `TF-` fact that changed after the version was drafted. **R6:** no requirement matches a scope-out or non-goal item. **R7:** no assumption is past its check date. Pass rules: CFG-READY-10 | Gaps `R1`–`R7`, each naming the orphan item | DM2-o2 trace checker (NEW); `delivery_map` coverage (REUSE); `interrogate_plan` (REUSE); `replan_check` on drift (REUSE); `gap_score` (REUSE) |
| **Access** | Whether the FDE and the coder can reach what the work needs, with least privilege | The access matrix (§13h.4), slices' `access_ids[]`, `audit_interview` `readiness` answers | **A1:** every row has an owner and a lead time. **A2:** every row a slice needs is `requested` at least its lead time before the need-by date. **A3:** no row above the needed level (read < write < admin). **A4:** no `admin` row without a named approver. **A5:** no shared accounts. **A6:** no credential values (refused by the schema). **A7:** no critical-path row `blocked`. **(v0.8, `plug_in` only) A8 scope creep:** no scope requested or granted beyond the `HC-` scopes needed, and none at a higher level. Pass rules: CFG-READY-11 | Gaps `A1`–`A8`. A missing critical-path row becomes a risk whose due date is the need-by date | `agent_authority_recon` and AUTH-53 for the coder agent's scope (REUSE); `agent_op_contract_check` (REUSE); `tenant_isolation_check` for data-class separation (REUSE); access matrix (NEW) |
| **Governance** | Whether the customer's rules for approvals, models, vendors and data are met before AADM-planned work changes anything | Governance map (§13j), stakeholder map (§13k), Speed Layer top-row ratings, governance answers (`audit_interview` `readiness`, `grill_questions` on `aadm://doctrine/readiness-and-risk`), outcomes' stakeholders, workspace settings (§13a), Terrain | **G1 approvals:** a named approver for each change type (AUTH-14, checklist :119). **G2 change control:** the customer's change process is named, and every `cutover`/`rollout` slice records a change-ticket reference (id only). **G3 model risk:** if the work builds or changes a model, the model has an inventory entry, a validation owner who is not its developer, and a monitoring plan (aligned with SR 11-7's development, implementation, use, validation and governance areas, see research notes). **G4 third parties:** every vendor in scope, AADM included, has a due-diligence status and an oversight owner (2023 interagency third-party guidance). **G5 residency:** no data class stored outside the region the policy allows (CFG-WS-09). **G6 audit trail and data trust:** `plan_event` is on (always) and the customer's audit-log location is known (AUTH-29); the data owner has confirmed Q1's sources of truth. **G7 segregation of duties:** CFG-APPROVAL-09. **G8 co-sign:** the acceptor is named and co-signs (CFG-LOCK-01, D8). **G9 policy owners:** every applicable policy has a named owner. **G10 governance map:** the map meets CFG-READY-14, and each `missing` or `assumed` entry is its own gap. **G11 approvers:** every gate has a stakeholder with A (§13k). **G12 security** (Speed Layer T6, L7): for each in-scope system, RBAC, encryption at rest and in transit, regular security audits and a breach response plan are `known` (B 14838–14841), and the security risk assessment is recent (CFG-READY-13). **(v0.8, `plug_in` only) G13 plugin ownership after handoff:** a customer owner after handoff (`SH-` with A), a named upgrade owner and an unregister runbook fact, all before go-live and before the transfer package (DM6-b2). **S1 Speed Layer:** top-row boxes whose future rating is above the current. Pass rules: CFG-READY-12, CFG-READY-13 | Gaps `G1`–`G13` and `S1`; each item is `met`, `gap` or `n/a` with a reason | `fde_engagement_recon` acceptor map (REUSE); `fetch_auth` + `grill_questions` on AUTH-14/29/31/43/52 (REUSE); aadm-standard compliance checklist and HITL standard (REUSE); `audit_interview` `readiness` bank (EXTEND) |

### 13h.4 Access matrix (`ACC-<n>`, allowlisted metadata only)

| Field | Values |
|---|---|
| target | system or environment name (allowlisted `system`/`environment`), plus data class (§13a.1) |
| account kind | `named_user`, `service_account`, `break_glass` (a shared account is refused, A5) |
| who | the role that needs it (`fde`, `coder_agent`, `operator`), and the member's workspace id; never a username or credential |
| level needed / level granted | `read`, `write`, `admin` |
| approvals | the approver's stakeholder `SH-` id, plus a ticket reference (id only) |
| owner | who grants it (customer stakeholder `SH-` id) |
| lead time | days (number) |
| need-by | date; derived from the earliest slice that lists it in `access_ids[]` |
| status | `needed`, `requested`, `granted`, `blocked`, `revoked`, with the date of each change (append-only events) |
| expires | date or `none`; a granted row past expiry counts as not granted |

The allowlist rejects any field shaped like a credential, key, password or connection string (the §13a.2 secret filter). AADM never holds a credential value.

### 13h.5 Scoring

**Scales and bands:** CFG-RISK-01 and CFG-RISK-02 (§5) hold the likelihood anchors (within the engagement's time horizon), the impact anchors (on the threatened outcome's measures, §13f.3 rule 3), the score (**inherent = L × I**) and the bands. Workspaces on the Standard scale (D18) compare with each other. The **residual score** is the expected L × I after the mitigation, banded the same way.

### 13h.6 The risk record (`RISK-<n>`)

- **What:** title and description, both single-line allowlisted text (lengths in FIX-07); class (§13h.7); threatened `OUT-` (required); the gap it came from (`Q1`…`G9`, or `manual`).
- **Sources:** ≥ 1 of `TF-` facts, `INV-` invariants, `REQ-`/`AC-` items, slice IDs, `ACC-` rows (required).
- **Score:** L, I, inherent score and band (computed); residual L, I, score and band.
- **Mitigation:** type `avoid`, `reduce`, `transfer` or `accept`; owner (a workspace member or `SH-`); due date; the control in words (FIX-07); the evidence tool (one of the tools in §13h.7, or `manual_control`); the evidence reference (the host-pasted result's SHA-256 and time, never its body).
- **Status:** `open`, `mitigating`, `accepted`, `closed`.
  - `accepted` needs the people in CFG-APPROVAL-03 (two different people when CFG-APPROVAL-09 is on), linked to the D8 co-sign; it records them and the date. Whether a residual top-band risk may be accepted is CFG-RISK-05 (Standard: never).
  - `closed` needs evidence logged after the mitigation's start, or an `avoid` decision.
- **Review:** next review date set by band (CFG-DATE-06); mitigation due dates follow CFG-DATE-07.

### 13h.7 Classes and their default evidence

| Class | Example | Default evidence (REUSE) |
|---|---|---|
| `code_or_secret_exposure` | a payload or report carries code or a key across the wall | the §13a.2 allowlist refusal tests; `agent_op_contract_check` |
| `tenant_leakage` | one customer's facts visible in another workspace | `tenant_isolation_check` |
| `wrong_or_stale_terrain` | a cited fact is out of date or wrong; data not trustworthy (Q1, Q2) | `terrain_get` freshness; re-verify events |
| `unsafe_cutover` | a migration or switch loses or changes data | `cutover_parity_check` (0 mismatches) |
| `agent_run_actions` | an agent takes an irreversible step without a person | `run_state_control`, `agent_op_contract_check`, HITL standard |
| `scope_or_acceptance_drift` | work drifts from the signed outcomes | `replan_check`, `invariant_register`, DRIFT verdicts |
| `model_risk_and_third_party` | model or vendor oversight missing (G3, G4) | governance checks G3 and G4; `fde_engagement_recon` |
| `key_person_or_handoff` | one person holds knowledge; no successor | `fde_engagement_recon` `residual_dependency_window`; `lessons_register` |
| `access` | critical-path access not granted in time (A1–A7) | the access matrix events |
| `deferred_proof` | Sentinel residual items | `assurance_run` / Sentinel attestation |
| `host_contract` (v0.8) | a `plug_in` breaks on a host upgrade, hits a rate limit, holds more scopes than it needs, or has no owner after handoff (Q8, Q9, A8, G13) | the Q8, Q9, A8 and G13 checks; `extension_point` fact freshness; an unregister test (the slice rollback) |

`projection_budget` and `fanout_guide` are available as evidence for performance and fan-out risks. Nothing in this list re-implements those tools: the register stores only a reference to their result.

### 13h.8 Gates and reassessment

**Gates (THR-36):**
1. A cornerstone can't be signed while the risk gate CFG-RISK-03 fails.
2. A slice tagged `cutover` or `rollout` can't get Go under the same rule.
3. **No slice starts while the access gate CFG-RISK-04 fails.** `delivery_map_next_slice` returns `nothing_approved` with the row named.
4. Every gate refusal names the risk or access row, and the gate is shown on the Sign and Go buttons.

**Reassess on these triggers (THR-44).** Each re-runs only the affected checks, idempotently, keyed by gap: re-running never duplicates a risk.
- a new or changed Terrain fact;
- a new cornerstone version (amendment);
- a `cutover` or `rollout` slice reaching Go;
- an access row changing status or expiring;
- the review cadence by band (CFG-DATE-06);
- an off-target post-go-live measure check (§13f.3 rule 5).

### 13h.9 Where it shows up (UX first; not a separate tab)

- **One "Readiness and risk" view** in each FDE workspace, next to Terrain. **It merges with Terrain's gap list** rather than duplicating it: Terrain's empty-section and stale-fact gaps *are* the Q2 row, and DMT-c3's UDALI `missing` targets are listed under Quality with a link to the transpose view. It shows the four gap types side by side (counts and the top failing check), and the register below, sorted by band and then due date.
- **Kickoff:** after the Outcome card, the FDE runs the assessment from the same page and works down the gap list with the sponsor (about 20 minutes for a typical workspace). Governance and access questions come from the `readiness` interview bank.
- **Weekly rhythm:** "Needs you" counts overdue reviews, access rows past need-by, and risks with no owner. One weekly pass clears them.
- **Cornerstone sign-off:** a Risks panel next to the handoff checks lists anything that blocks signing.
- **Map slice cards:** a small badge with the highest open band of linked risks (for example "R high"), plus a lock when access is missing. Cards with no linked risk show nothing.
- **Verdict drawer** (a recommendation surface per `aadm://doctrine/guidance-feedback-seam`: AADM computes the suggestion, and the UI only shows it): a report's verdict lists the linked risks and offers "log evidence" when the report carries a matching tool result (for example `cutover_parity_check` with 0 mismatches).

### 13h.10 Data, entitlement and the allowlist

- **Tables, behind `PlanStore`, migrated by DM1-c4:**
  - `risk` and `risk_event` (append-only audit of every change, with actor and time);
  - `access_item` and `access_event` (append-only);
  - `readiness_check_result` (workspace, check ID, pass or fail, value, at).

  Every row carries `workspace_id`, scoped in the app layer, with RLS as defense in depth (§13c). Exports include all of them.
- **Allowlist:** new kinds `risk`, `access_item`, `quality_signal` and `data_trust` join §13a.2. They hold short single-line text, numbers, dates and IDs only, never code, data rows or secrets.
- **Entitlement:** the register, the assessment and the Readiness and risk view need the **`fde_tools`** feature in the calling user's own plan (v0.14, D43: "Field unlocks by each user's own plan"; per user, as in §8 `entitlement`, never per workspace). Without it the tools return `entitlement_required` and the view is hidden for that user, even in a workspace where other members have it. The outcome record (§13f) is not gated: every cornerstone has it. How `fde_tools` is granted is pending DM0-a3 (D16). UNCHECKED: `fde_tools` has 0 hits in aadm-mcp or aadm-website today.
- **Where it runs:** `risk_save`, `risk_get`, `access_save` and `readiness_assess` run in `aadm-backend` (§13d), which writes through its plans API (D30).

## 13i. Use cases and pilots (FDE) (v0.7; Brian, Oct 25, 2026, 10:53 AM ET)

**What it is.** FDE work moves forward through small, well-defined **pilots**: either **task-based** (one task or workflow for a defined user group) or **project-based** (one bounded deliverable). **Not a full program** unless the workspace allows it (CFG-PILOT-01; Standard and Regulated never do). Each pilot is picked from a list of **use cases** and run against a short charter. It ends in a recorded **go/no-go** decision. Users' feedback is looped back into the work.

It spans the value stream (§13e):
- **Strategy:** find and rank use cases, and choose one.
- **Plan:** define and approve the chosen use case (v0.9, §13o), then design the pilot charter.
- **Readiness:** the pilot's gaps, risks and access.
- **Adopt:** run it.
- **Governance:** go/no-go, co-sign and lessons.

Loop-backs: "iterate" goes back to Plan, "stop" back to Strategy, and feedback goes wherever triage sends it.

### 13i.1 What already exists (deconflict)

| Existing piece | What it does | Verdict |
|---|---|---|
| aadm-mcp `src/ai-automation-profile.ts:11-20` `AUTOMATION_USE_CASES` (e.g. `cross_cutting_authority`, `evaluate_ai_work`, `enforce_agent_contracts`) | Categories for AADM's own AI-automation profile | No overlap (a fixed enum of AADM capabilities, not customer use cases); not reused, and the name `use_case` is kept apart by using `UC-` IDs |
| "pilot", "go/no-go", "no-go" in aadm-mcp `src/`, `resources/` and aadm-standard | 0 hits | **NEW**: pilot charter and go/no-go |
| `fde-outcome-contract.md` "Stop conditions" and `fde_engagement_recon` `engagement_posture` (`decidable`, `proceed`, `hold`, `stop`) (`src/fde-engagement-recon.ts:171`) | Engagement-level stop conditions and posture | **REUSE** the idea: a pilot "stop" maps to posture `stop`; the pilot record is new and per pilot |
| `user_flow` intent interview (`q_user_goal`, `q_cold_start_pain`) | One screen's goal and pain | **REUSE** to describe the pilot's task for a user group |
| `grill_questions` | Kind-based question banks | **EXTEND**: per-URI bank `aadm://doctrine/pilot-charter` (DM6-f2) |
| `lessons_register` | Host-owned lessons | **REUSE**: each go/no-go returns lesson candidates |
| **Cognistry "first workflow"** (reference only, not coupled; `digico-cognistry` at `be6780c9da`: `shared/contracts/first-workflow/first-workflow-charter.v1.ts:30-40`) | A 9-field charter for one workflow: workflow and scope, desired outcome, owner and participants, current work, sources, example of good work, AI task and human review, limits and approval, measurement and proof; each field `unknown`, `draft`, `confirmed` or `blocked`; plus a picked-task gate (`client/src/components/first-workflow/PickedTaskLine.tsx`) | **Reference only**: it confirms the shape "pick one task, then charter it, with a per-field status". AADM's charter is its own schema; no code, contract or name is shared |

### 13i.2 Use case record (`UC-<n>`)

| Field | What goes in | Limit |
|---|---|---|
| problem | What hurts today for these users | FIX-07 |
| users and task | The user group (stakeholder `SH-` or a named group) and the one task or workflow | FIX-07 |
| outcome link | `OUT-` and the `MEAS-` it should move | required |
| Speed Layer boxes | The canvas box or boxes it touches (§13g.1, e.g. `M8` EXPERIENCE, `T1` Data Governance) | box IDs; rated before a pilot on this use case starts, per CFG-SL-05 |
| data and systems | `TF-` facts for the systems and data classes involved | required (CFG-UC-05) |
| value score V (1–5) | Share of the linked measure's baseline-to-target gap this use case could close; anchors in CFG-UC-15 | required |
| feasibility score F (1–5) | Data trust (Q1), access and system count; anchors in CFG-UC-15 | required |
| risk score K (1–5) | Highest open band among its linked risks (CFG-UC-15) | computed |
| priority | **V × F**, shown with K as a color. K above CFG-UC-14 can't be piloted | computed |
| delivery mode (v0.8) | `code_in_source` or `plug_in` (configure-only is a `plug_in` sub-kind, §13l) | required |
| decision | `candidate`, `chosen` or `rejected`, with the reason (FIX-07), who and when | reason required for chosen and rejected. (v0.9) `chosen` hands the use case to Plan for definition and approval (§13o); Strategy never approves. A rejection at approval sets this to `rejected` with the approver's reason |

**Prioritization view:** a simple value × feasibility grid (5 × 5). Each use case is a dot colored by K, and a list sorted by priority beside it. Choosing one opens its **Use case tab** in Plan (v0.9, §13o.2); the pilot builder opens only once a version is approved.

### 13i.3 Pilot charter (`PIL-<n>`); every field is required before start

| Field | What goes in | Rule |
|---|---|---|
| type | `task` (one task or workflow for one defined user group) or `project` (one bounded deliverable). `program` only where CFG-PILOT-01 allows it | CFG-PILOT-01 |
| use case | exactly 1 primary `UC-` **version that is approved and not superseded** (v0.9, §13o.5; was: status `chosen`); the pilot records `uc_version` and `uc_content_sha256`, inherits its `delivery_mode`, and its scope must fit inside the use case's pilot shape | CFG-PILOT-02, CFG-UC-11 |
| scope | in scope, out of scope (lists, FIX-07); users (count and group); systems (`TF-` links); data classes (§13a.1, allowlisted) | CFG-PILOT-02 |
| duration | start date, end date, checkpoints (dates) | CFG-PILOT-03, CFG-PILOT-04 |
| success metrics | metrics, each with a baseline (number, unit, as-of), a numeric target, how and where measured, a measure owner (`SH-`) and the `MEAS-` it links to; the count and required kinds (**quality or accuracy**, **data-trust**, for example "share of records matching the source of truth") are in CFG-PILOT-06 | CFG-PILOT-06 |
| go/no-go | criteria set **before start** (§13i.4), a decision owner (an outcome stakeholder with A, or the acceptor), a decision date no later than the end date | CFG-PILOT-07, CFG-APPROVAL-04 |
| feedback loop | who gives feedback, channel, cadence, minimum responses, triage rule, closed-loop record (§13i.5) | CFG-PILOT-09 to CFG-PILOT-12 |
| risks and access | the pilot's `RISK-` entries and its `ACC-` set (§13h) | CFG-RISK-03, CFG-RISK-04 |
| status | `draft`, `ready`, `running`, `decided`, with an append-only amendment log | — |

**Rules:**
1. A pilot can't start (status `running`) unless every field is filled and every `ACC-` row in its set is `granted`.
2. A scope over any CFG-PILOT-02 or CFG-PILOT-03 limit is **refused with "split this pilot"**, naming the limit and its setting ID. A type outside CFG-PILOT-01 is refused (Standard and Regulated: never `program`).
3. Once running, the metrics and go/no-go criteria can't change without a **logged amendment**: who, when, why, the old and new values, co-signed by the people in CFG-APPROVAL-05 (D8).
4. A go/no-go decision is required by the end date. An overdue decision turns the pilot **red** and Adopt red (CFG-PILOT-07, CFG-HEALTH-04).
5. Every decision returns `lessons_register` candidates for the host. AADM stores the decision, not lesson text.
6. Concurrent running pilots per workspace: CFG-PILOT-05.
7. **(v0.8) `plug_in` is often the best pilot shape.** A plugin, adapter or configure-only change can be switched off without touching the host, so "stop" costs an unregister. The builder suggests it when the use case's systems expose an extension point in Terrain (section 16). A `plug_in` pilot also needs Q8, Q9, A8 and G13 to pass before start.

### 13i.4 Go/No-Go

- Each success metric gets two numbers, set **before start**: its **target** (go) and its **floor** (stop). Each metric is marked must-have or nice-to-have; the must-have minimum is in CFG-PILOT-06.
- AADM computes a **recommendation** at the decision date:
  - **Go / scale:** every must-have is at or above its target, the data-trust metric is at or above target, there are 0 open critical risks and 0 high risks without an owner, and the feedback minimum was met in the share of cadence periods set by CFG-PILOT-08.
  - **Iterate:** no must-have is below its floor, and at least one is between floor and target. Iterations, their length and the total cap follow CFG-PILOT-07; no pilot ever runs over the CFG-PILOT-03 ceiling.
  - **Stop:** any must-have is below its floor, the data-trust metric is below its floor, or a critical risk became an incident.
- **The decision owner decides.** They may override the recommendation only with a written reason (FIX-07). The decision is recorded with the metric values used, and is co-signed by the acceptor (D8) and the FDE, who must be different people when CFG-APPROVAL-09 is on. The full list of who signs is CFG-APPROVAL-04.
- **Go / scale** opens a follow-on use case or pilot (each scale step is its own pilot within CFG-PILOT-02). Scaling into a program is allowed only where CFG-PILOT-01 allows `program`. **Iterate** returns to Plan. **Stop** returns to Strategy with the reason.

### 13i.5 User feedback loop

| Part | Design |
|---|---|
| who | the pilot's user group (as counts and an `SH-` group, no personal contact details) plus the measure owners |
| channel | `in_tool`, `survey`, `interview`, `chat` or `meeting`. AADM stores a short allowlisted summary (FIX-07), never transcripts or personal data |
| cadence | CFG-PILOT-09 |
| minimum responses | per cadence period, CFG-PILOT-10 |
| triage | within the CFG-PILOT-11 window each item becomes a `slice` change, a `risk`, a use-case change (`UC-` new version), or `no_action` with a reason |
| closed loop | each actioned item records what changed (the slice, risk or `UC-` version ID) and the date the users were told. The closed share needed before the go/no-go is CFG-PILOT-12 |

**UX.** The use-case and pilot builder is a short guided form of about 5 minutes for a first draft, in three steps:
1. Pick an **approved** use-case version (v0.9); the charter pre-fills from its pilot shape and metrics.
2. Choose task or project, and set the users, systems and dates. Over-limit choices are refused inline, with "split this".
3. Set the must-have metrics (CFG-PILOT-06) with targets and floors, plus the decision owner and date.

The other fields can be added before start. Prompts come from `grill_questions` on `aadm://doctrine/pilot-charter`, e.g. "Which one task will these users do differently?", "What number makes you stop?" and "Where does the data-trust number come from?". The **pilot card** on the workspace home shows:
- days left;
- each must-have metric's latest value against its target and floor;
- the feedback count against the minimum for this period;
- the go/no-go date.

The card's color follows THR-45.

## 13j. Governance, standards and best practices map (FDE) (v0.7; Brian, Oct 25, 2026, 10:51 AM ET)

**What it is.** For each FDE workspace, the FDE records which of the customer's governance bodies, policies, standards and best practices apply, who owns them, and what they constrain. Missing or assumed items become governance gaps (check **G10**, §13h.3), which feed the risk register.

**Deconflict:**

| Existing piece | What it does | Verdict |
|---|---|---|
| aadm-standard `GOVERNANCE.md:1` (the "Governance Charter") | Governs the AADM standard itself | **REUSE** as the source of the default baseline; not renamed, and our map is not called "Charter" |
| aadm-standard `standards/` (35 files, e.g. `human-in-the-loop.md`, `ai-coder-hard-stops.md`, `architecture-before-code.md`, `evidence-model.md`), `docs/compliance-checklist.md` | AADM's own best practices and checklist | **REUSE** as the **default best-practices baseline**, preloaded into every map as `aadm_baseline` entries |
| `doctrine_index` | Lists every governance, AUTH, doctrine, pattern and template URI | **REUSE** to preload the baseline with its URIs |
| `fetch_auth` (AUTH-00 to AUTH-55; 58 files in `resources/auth/`) | Control texts | **REUSE**: a customer policy can be mapped to an AUTH id |
| `standard_brief` | Routing snapshot and capability catalog | No overlap |
| A per-customer register of policies and governance bodies | none (0 hits for "access matrix", "segregation of duties", "policy owner" in all three repos) | **NEW** |

**Entry (`GOV-<n>`), allowlisted metadata only:**

| Field | Values |
|---|---|
| kind | `governance_body`, `policy`, `standard`, `best_practice` |
| domain | `security`, `data`, `architecture`, `sdlc`, `model_risk`, `third_party`, `privacy`, `change`, `other` |
| name | the customer's document or body name as they call it (FIX-07), plus a version or date |
| source | document name and optional reference id only. **No content** beyond one short "constrains" line (FIX-07) |
| owner | `SH-` id (§13k) |
| status | `known` (seen and confirmed by the owner), `assumed` (believed to apply, not confirmed), `missing` (needed, not found) |
| applies to | value-stream phases[], and the `REQ-`, slice or `PIL-` IDs it constrains |
| maps to | optional AADM baseline item (aadm-standard path or `aadm://` URI, AUTH id) |
| last confirmed | date |

**Rules (THR-46; values in §5):**
- The required domains and the largest `assumed` share are CFG-READY-14.
- An entry not confirmed within CFG-STALE-04 drops to `assumed`.
- Each `missing` or `assumed` entry is a G10 gap, with the suggested score in CFG-RISK-08.

## 13k. Stakeholder management (FDE) (v0.7; Brian, Oct 25, 2026, 10:51 AM ET)

**What it is.** The outcome stakeholders (§13f.2) grow into a living **stakeholder map** for the workspace, so the FDE knows who must say yes before each gate and keeps them engaged. Cornerstone `SH-` items point to map entries, and the RACI is snapshotted when a version is signed.

**Deconflict.** The FDE outcome contract's named acceptors (sponsor, eval_owner, operator, internal_successor, security; `fde-outcome-contract.md:30-40`) seed the map (**EXTEND**). "Stakeholder map", "sentiment" and "influence" (as a stakeholder field) have 0 hits in the repos; the influence hits are AUTH-47 agent-memory wording. **NEW**.

| Field | Values |
|---|---|
| who | name or group **as typed**, and role (sponsor, decision owner, acceptor, affected users, operator, risk/compliance, security, internal successor, FDE, vendor). **No email, phone or other contact details** (the allowlist refuses email- and phone-shaped strings) |
| side | `customer`, `fde`, `aadm`, `vendor` |
| influence, interest | 1–5 each (1 none, 3 moderate, 5 decisive or very high) |
| RACI per phase | one letter for each of Strategy, Plan, Readiness, Adopt, Governance |
| decisions owned | `DEC-` IDs, gates (Sign, cutover Go, risk accept, go/no-go) |
| governance owned | `GOV-` IDs |
| risks accepted | `RISK-` IDs (from accept events) |
| cadence | days between touchpoints, by influence (CFG-DATE-04) |
| last touchpoint | date and channel (`meeting`, `email`, `chat`, `call`); no content |
| sentiment | `supportive`, `neutral`, `concerned`, `blocking`, with a blocker line (FIX-07) |

**Who must say yes (computed per gate):**

| Gate | Who must say yes |
|---|---|
| Sign | CFG-LOCK-01 (the owner and the acceptor in every preset) |
| Cutover or rollout Go | the operator with A in Adopt, plus the change approver (G2) |
| Risk accept | CFG-APPROVAL-03 (different people when CFG-APPROVAL-09 is on) |
| Pilot go/no-go | CFG-APPROVAL-04 |
| Use case approval (v0.9) | CFG-APPROVAL-01 and CFG-APPROVAL-02; never the submitter when CFG-APPROVAL-09 is on (§13o.4) |
| A governance item | its owner |

Each gate's button lists those people, with their sentiment and last touchpoint.

**Rules (THR-47):**
- A touchpoint is overdue at its cadence plus CFG-DATE-05.
- An overdue decision owner or acceptor turns Governance amber.
- Any person marked `blocking` who holds A for a gate turns that phase red until resolved.
- Every gate has a person with A, or check G11 fails.
## 13l. Delivery modes: code in source or plug-in (v0.8; Brian, Oct 25, 2026, 11:25 AM ET)

**What it is.** Every use case (`UC-`) and every cornerstone version carries a required **`delivery_mode`**, and the delivery map inherits it.
- **`code_in_source`**: the work changes the customer's repo (or our own). This is today's path. Every existing plan is in this mode.
- **`plug_in`**: the work builds a plugin, MCP server or adapter **beside** the host system. It uses only the host's existing extension points: APIs, webhooks, events, plugin slots and MCP hosts. The host repo is read-only, except an optional small registration or config change that is named in the slice.
- **Configure-only** work (settings, flags, workflow config, no new code, delivered as a reviewed change set) is the lightest form of `plug_in`. It is a sub-kind (`plug_in_kind = configure_only`), not a third mode.

**Deconflict (read on Brian's Mac at aadm-mcp `d8af2e4f7c` and aadm-standard `9a16239f23`, Oct 25, ~11:35 AM ET).** `delivery_mode`, `plug_in`, `code_in_source`, `extension_point`, `host_contract` and `HC-<n>` have 0 hits in aadm-mcp `src/`, `resources/`, `docs/` and `AGENTS.md`, and 0 in aadm-standard. "Extension points" appears once, as a design question in `src/coding-principles.ts:124` ("What are the extension points versus what is fixed contract — who may change each?"). **REUSE** it as a Cornerstone C3 prompt; there is no clash. "plugins" in `src/repo-map-analysis.ts:667` means the host's stack-inspection plugins, a different meaning. So the mode is **NEW**, and it reuses the pieces named below.

| Area | `code_in_source` | `plug_in` |
|---|---|---|
| Repo the slices edit | the product repo | the plugin's own repo; the host repo is in every slice's `keep[]` |
| Host repo changes | normal | none, except the named registration or config files allowed by CFG-MODE-01, each edited only by the slice that names it |
| Cornerstone | the existing sections | adds **host-contract items** `HC-<n>` (§13l.2) |
| Terrain | the existing sections | needs section 16, **Extension points** (§13l.1), verified and not stale |
| Rollback | revert the commit | **disable or unregister** the plugin (configure-only: revert the reviewed change set) |
| Readiness checks | Q1–Q7, R1–R7, A1–A7, G1–G12, S1 | adds **Q8 host version drift, Q9 rate limits, A8 scope creep, G13 plugin ownership after handoff** (§13h.3) |
| Pilot shape | any | **often the best pilot shape**: it can be switched off without touching the host, so a "stop" decision is cheap (§13i.3) |

### 13l.1 Terrain: Extension points (profile section 16; allowlisted metadata only)

A new optional profile section. It does not change THR-22's 8 required sections, but a `plug_in` cornerstone needs it (handoff check 13). Each fact has allowlist kind **`extension_point`** (§13a.2), with these fields:
- `point_kind`: `api`, `webhook`, `event_bus`, `plugin_sdk`, `mcp_host` or `config_surface`;
- `name`, and `system` (the `TF-` system it belongs to);
- `version` (the host's current version string) and `supported_versions` (a range, when the host documents one);
- `auth_scope_names[]`: scope **names only**. Tokens, keys and secrets are refused by the §13a.2 secret filter;
- `rate_limit`: a number and unit (for example 600 per minute), or `unknown` with a reason;
- `docs_ref`: a URL or doc ID, never a doc body.

It is filled the three usual ways (§13b.3):
- host-side import of OpenAPI specs (operations and security scheme names), webhook catalogs and plugin manifests (DMT-a2's guides, extended in DMT-b4);
- extension-point questions in the `terrain` interview bank;
- a manual fact.

`extension_point` facts turn stale after CFG-STALE-03, because host versions move.

### 13l.2 Cornerstone: host-contract requirements (`HC-<n>`)

For `plug_in`, Define (C3) adds one `HC-` item per host extension point the plugin uses:
- **Calls made:** the operations, events or hooks used (names only), each citing an `extension_point` `TF-` fact.
- **Supported host version range:** the minimum and maximum host versions the plugin is built and tested against.
- **Scopes needed:** the auth scope names and their level (`read`, `write`, `admin`). These must match the `ACC-` rows (§13h.4).
- **Planned peak call rate:** calls per minute, checked against the fact's `rate_limit` (Q9).
- **Owner after handoff:** the customer stakeholder (`SH-`) who owns the plugin, its upgrades and its unregister runbook (G13).

Every `HC-` item cites at least 1 `OUT-`, like any requirement (§13f.3).

### 13l.3 Slices

- A `plug_in` slice works in the plugin's own repo. Its `repo` is the plugin repo, and the host repo appears in every slice's `keep[]` (do not change).
- The only host-repo files a `plug_in` slice may edit are **named** registration or config files listed in `plan.host_registration_files[]` (CFG-MODE-01). Only the slice that names a file may edit it.
- Rollback is **disable or unregister**. A `plug_in` slice whose rollback is anything else fails CS-M2 (§13n).
- The suggested verdict (§8) gets one more DRIFT reason: a `plug_in` report whose `files_changed` touches the host repo outside a named file.

### 13l.4 Where it shows up (UX)

- **Use-case and new-cornerstone forms:** both ask one question first: "Change their code, or plug in beside it?". The answer is one of the two modes, with configure-only as a sub-option. The form explains `plug_in` in one line and marks it "often the best pilot".
- **Cornerstone view:** for `plug_in`, a **Host contract** panel shows each `HC-` item with its version range, scopes and rate check.
- **Live map:**
  - the header shows a mode chip (`code in source` or `plug-in`);
  - `plug_in` slice cards show the plugin repo;
  - a card that edits a named registration file carries a small "host file" tag.
- **Terrain view:** a new Extension points section, showing versions, scope names and rate limits.

## 13m. Plan, split into five capabilities (v0.8, Brian, Oct 25, 2026, 11:26 AM ET; fifth added in v0.9, 12:25 PM ET)

**Why.** The Plan phase (§13e) did too much in one row. Requirements, batching, prompt writing and the live map are different jobs, with different gates and different ways to fail. Plan is now **five capabilities** (four in v0.8, plus **Use case definition and approval** in v0.9, placed first), in this order, and each has its own tools, gate and health rule. **ON PLAN and DRIFT verdicts stay under Adopt** (§13e), because they judge a coder's report: that is delivery, not planning.

| Capability | What it does | Tools | Gate (a refusal, not a warning) | Health |
|---|---|---|---|---|
| **Use case definition and approval** (v0.9, FDE workspaces) | Builds the chosen use case from the FDE capability records by ID (§13o.2), checks the definition of ready, and gets the customer's approval and co-sign on a frozen version | `use_case_save`/`get`/`submit`, `readiness_assess` (use-case scope), `grill_questions` (use-case bank), `user_flow`, `gap_score`; approval is web-only | No submit while a CFG-UC-02 check fails; no decision by the submitter, and no decision through an agent credential (THR-60); no FDE cornerstone or pilot without an approved version (check 14, §13o.5) | THR-61 |
| **Cornerstone** | Outcome-first requirements: steps C0–C7 (§4.1), ending in a signed, frozen version. The version carries its `delivery_mode` and, for `plug_in`, its `HC-` items | `cornerstone_save`/`get`, `interrogate_plan` (`prd`), `grill_questions`, `prd_outline`, `invariant_register` | Handoff checks 1–14 (§4.2) | THR-53 |
| **Batch and slice** | Stages, batches and slices under the batching standard (§13n), with `delivery_mode` applied to every slice (§13l.3) | `delivery_map` (computes), `delivery_map_save`, `slice_issues`, `interrogate_plan` (`delivery_map`) | No save with a dependency cycle or an unset threshold (CS-D1, CS-D2), or with any other blocking CS- plan rule | THR-54 |
| **Prompts** | One repo-grounded prompt per slice, citing the commit read, with confirm-first facts, about 40 lines, the verbatim rule lines and stop-and-report | `delivery_map_prompt_save` plus its lint | No prompt without `commit_read` (CS-P1). A prompt with a blocking lint finding is saved as `draft`, and `delivery_map_next_slice` never serves it | THR-55 |
| **Delivery map** | The live colored map, "You are here", the render, and replan on change (§4.3) | `delivery_map_get`, `delivery_map_render` | Nothing turns green without a verdict: a slice becomes `done` only by the CFG-LOCK-04 rule (Standard: a final ON PLAN verdict, DM3-b3) | THR-56 |

**Plan health rolls up the five capabilities per CFG-HEALTH-02** (Standard: the worst of the five; THR-45, amended in v0.8, v0.9 and v0.12). Each sub-chip shows the rule that set it. AADM computes the colors; the UI never does (`aadm://doctrine/guidance-feedback-seam`).

**Data flows one way:** (FDE) approved use case → signed cornerstone → saved map → one prompt per slice → live map. A change goes back through an amendment (§4.3) or a replan. Nothing is edited in place upstream.

**No build-order cycle.** Run order and build order differ for the Use case capability. It runs first in an engagement, but it is built last of the five, because it reads every FDE record. Build order:
1. Cornerstone: DM2-b, DM2-m1.
2. Batch and slice: DM2-c, DM2-m2.
3. Prompts: DM3-a.
4. Delivery map: DM3-b3, DM4, DM5-b.
5. Use case: DM6-f1 (Strategy record), then DM6-u and DM6-v (v0.9). DM6-v3 adds handoff check 14 to the already-built `cornerstone_save`, for `fde_tools` workspaces only, so nothing earlier needs it.

The health function (DM6-g4) reads all five, and it comes last.

**UX.**
- The Plans tab (§7 item 2) opens a plan as tabs, in order: (FDE) **Use case**, then **Cornerstone**, **Batches and slices**, **Prompts** and **Map**. Each tab label shows its gate status and health color.
- On the workspace home, the Plan chip expands into the same five sub-chips (four in a personal workspace) (DM5-b3, DM6-u3, DM6-g4).

## 13n. The batching standard, published as an AADM standard (v0.8; Brian, Oct 25, 2026, 11:26 AM ET)

**What.** The rules Blueprint plans by become an AADM standard that anyone can read and that the tools enforce.
- **Name (v0.13.9, D42 (d)):** this is the **batching standard**; a batch is the ordered group of slices inside a stage, and "chunk" means only a document chunk. Its planned file and URI names are `batching-standard` (v0.14, D43: aadm-standard `standards/batching-standard.md`, aadm-mcp `resources/doctrine/batching-standard.md`, `aadm://doctrine/batching-standard`, loader `src/batching-standard.ts`); nothing is built yet, so no rename slice is needed. The draft was rewritten in batch terms (`aadm-batching-standard-draft.md`; the old `aadm-chunking-standard-draft.md` is kept as `.bak`).
- **Source:** Blueprint's `CHUNKING_STANDARD.md`, plus the generic rules in `BLUEPRINT_CANONICAL_RULES.md`.
- **Stripped out:**
  - personal names and dates;
  - one customer repo's decision-log and freeze-guard lessons;
  - local machine paths;
  - bot-to-bot handoff details;
  - one editor's design skill;
  - package.json line numbers;
  - workflow-only lines (for example "skip baseline_guide").
- **Draft:** `/workspace/blueprint/aadm/aadm-batching-standard-draft.md`. Part 1 is the prose standard; Part 2 is the copy the tools read.

**Home.** Read on Brian's Mac, read-only, Oct 25, ~11:35 AM ET: aadm-mcp `d8af2e4f7c` on `dev`, clean; aadm-standard `9a16239f23` on `main`, clean. AADM already keeps a standard in two places, and this follows the same pattern:
- **aadm-standard `standards/batching-standard.md`** (DM0-c1). This is the prose standard. It gets a row in `standards/README.md`, like `reuse-before-build.md` (`:73`) and `guidance-feedback-seam.md` (`:80`).
- **aadm-mcp `resources/doctrine/batching-standard.md`**, served as **`aadm://doctrine/batching-standard`** (DM0-c2). This is the copy the tools read.
  - **Shape:** the same as `resources/doctrine/slice-sizing.md`: an H1, the URI line, `## Limits` as `key: value` lines, the rules, then `## Copy`.
  - **Registration:** an entry in `src/registry.ts` (like `aadm://doctrine/slice-sizing` at `:269-270` and `aadm://doctrine/chunk-branch` at `:273-274`) and one in `src/resources.ts` (like `:145-154`).
  - **Loader:** a small module modeled on `src/slice-sizing.ts`, which reads its doctrine file (`:15`) and throws on a missing key (`:82`).

**Deconflict.**

| Existing piece | What it does | Verdict |
|---|---|---|
| `aadm://doctrine/slice-sizing` (`resources/doctrine/slice-sizing.md`, 51 lines; `src/slice-sizing.ts`; `slice_issues`) | Size bands S1–S5 for one slice, from reported files, layers, contract change and test targets | **REUSE**: CS-S4 cites it for bands. The standard does not restate its limits |
| `aadm://doctrine/process-sizing` (51 lines) | How much process a reported task needs | **REUSE**: CS-S4's short-or-full test points to it |
| `aadm://doctrine/chunk-branch` (26 lines; `chunk_branch_check`, `src/tools.ts:8608`) | One open branch per batch; slices as commits; merge after approve plus `journey_attest` | **Kept, not replaced.** It is a different git policy. CS-G1 makes `git_policy = no_branches` the default and points `chunk_branch` plans to that doctrine. One plan never mixes the two. Our own plans stay `no_branches` (§3) |
| aadm-standard `standards/reuse-before-build.md` | Stdlib → native → declared dependency → custom → new dependency | **REUSE**: CS-R1's reuse inventory cites it |
| `interrogate_plan` plan_kind `delivery_map` scanners (DM2-c1) | Cycles, `TBD`s, stray docs, deletions without rollback | **REUSE**: these scanners are CS-D1, CS-D2 and CS-D4. DM2-c4 maps them to the rule IDs instead of duplicating them |
| "batching standard", `batching-standard` (v0.14, D43; was `chunking-standard`, 0 hits at v0.8) | 0-hit search for `batching-standard` UNCHECKED (no repo read in v0.14; DM0-c1 and DM0-c2 confirm first) | **NEW** name, no clash expected |

**Rule IDs.** The full text is in the draft. The IDs are stable once published.
- **Plan rules, checked by `delivery_map_save`** (DM2-c4; the mode rules by DM2-m2):
  - Blocking: CS-H1, CS-H2, CS-R1, CS-D1, CS-D2, CS-D3, CS-D4, CS-T1, CS-T2, CS-T3, CS-G1, CS-M1, CS-M2 (13).
  - (These lists are the Standard preset; any rule but CS-P10 can be set to block, warn or off, CFG-BATCH-07.)
  - Warnings: CS-S2, CS-S3, CS-S5, CS-S6. Their limits and severities are settings: CS-S3 files (CFG-BATCH-02), CS-S5 slices per batch (CFG-BATCH-01), CS-T2 primary tests (CFG-BATCH-03), prompt versions (CFG-BATCH-06), git policy CS-G1 (CFG-BATCH-09), severities (CFG-BATCH-07).
- **Prompt rules, checked by the `delivery_map_prompt_save` lint** (DM3-a4):
  - Blocking: CS-P1 (`commit_read`), CS-P4 (over the PF-01 hard cap), CS-P5 (missing section, or a title without the app and slice ID), CS-P6 (confirm-first has a merge-base line and the CFG-BATCH-05 fact count), CS-P7 (verbatim lines VL-1 to VL-6), CS-P8 (one slice), CS-P10 (no secrets), CS-T1 (no typecheck or go command in the tests section).
  - Warnings: CS-P4 (over the CFG-BATCH-04 line count), CS-P5 (sections out of order). Which rules block or warn is CFG-BATCH-07; the rules in FIX-18 always block.
- **Human-judged rules**, shown as a checklist and never auto-passed: CS-S1 (one visible behaviour), CS-P2 (whole-repo search done), CS-P3 (only facts read; unread facts marked unchecked), CS-P9 (review and evidence steps named), CS-G2 and CS-G3.
- **Verbatim lines** are generic. VL-4 says "stop and ask {approver}", and VL-6 says "send {planner} a chunk request". Each workspace fills in the two names (Brian's workspace: Brian and Blueprint), so today's prompts can comply without changing their meaning. A workspace may add lines (Brian's adds the "Skip baseline_guide…" line). It may not drop or reword VL-1 to VL-6.
- **Limits** (THR-58) live in the doctrine's `## Limits`. Changing a number is a doctrine edit plus its selftest, not a code change.
- **Versioning.** The doctrine has `standard_version: 1`. A plan and a prompt record the version they were checked against. A new version never re-fails a saved plan until that plan is saved again.

## 13o. Use case definition and approval (v0.9; Brian, Oct 25, 2026, 12:25 PM ET)

**What it is.** Brian: "as part of the plan we need to be able to build use cases with the FDE capabilities. add it to the PRD (Use case definition and approval)" (D28). Plan gains a fifth capability, placed **first**: **Use case definition and approval**.
- **Strategy** still finds and ranks candidates on the V × F grid (§13i.2) and marks one `chosen`.
- **Plan** then defines that chosen use case fully, from the records the other FDE capabilities already hold. It checks it against a numeric **definition of ready** (THR-59), and the customer approves it.
- Only an **approved, frozen** use-case version can start a Cornerstone or a pilot.

**Scope.** Workspaces with `fde_tools` (D16, D17). Personal workspaces have no use cases: there the Use case tab is hidden and handoff check 14 reads `n/a`.

### 13o.1 What already exists (deconflict)

| Existing piece | What it does | Verdict |
|---|---|---|
| §13i.2 `UC-` record (problem, users and task, outcome link, Speed Layer boxes, `TF-` facts, V/F/K, priority, `delivery_mode`, decision) and DM6-f1 (`use_case` table, `use_case_save`/`list`) | The Strategy record: candidate, chosen or rejected. No definition steps, no approval, no versions, no co-sign | **EXTEND**: the same table gains versions, references, ready results and approvals (DM6-u1, DM6-v1). The Strategy fields and V × F logic are unchanged |
| Cornerstone sign and freeze (§4.1 C6–C7; DM1-b1, DM2-b3) | SHA-256 freeze, immutable signed rows, a web-only human action, the D8 co-sign | **REUSE the pattern**: the same freeze, immutability and web-only rule, applied to use-case versions |
| `readiness_assess` (DM6-d2) | Q, R, A, G and S checks over the whole workspace | **EXTEND**: a scope `{use_case: UC-n}` (DM6-u1) |
| `grill_questions` per-URI banks (DM2-o3, DM6-d3, DM6-f2) | Deterministic question banks by doctrine URI | **EXTEND**: a new bank `aadm://doctrine/use-case-definition` (DM6-u1) |
| `user_flow` intent interview (`q_user_goal`, `q_cold_start_pain`) | One screen's goal and pain | **REUSE** for step 1, users and task |
| `gap_score` | Feature roll-up of gaps | **REUSE**: failing ready checks feed it as gaps |
| `replan_check` and §4.3 | Purple slices on a changed requirement | **REUSE** when a use case v N+1 is approved (DM7-a1) |
| "Who must say yes" per gate (§13k) | Gate approver lists | **EXTEND**: a new gate, use case approval |
| `plan_event` | Append-only audit | **REUSE** for every use-case event |
| DM6-g3 pilot builder, step 1 "pick a use case" | Quick pilot draft | **EXTEND**: it lists only approved versions. The guided definition is its own screen (DM6-u3), because DM6-g3 already holds the pilot builder and pilot cards |

**Names.** A GitHub code search of `bwl8772` repos (Oct 25, ~12:35 PM ET) for `use_case_submit`, `use_case_approval` and `use-case-definition` found 0 hits. "definition of ready" has 1 hit, in an unrelated repo (Spira-Pro-AI), and none in aadm-mcp, aadm-website or aadm-standard. **UNCHECKED:** a local grep of aadm-mcp `src/tools.ts`, which is above GitHub's index size, and of the `UR-` prefix.

### 13o.2 Build the use case from the FDE capabilities (guided definition)

Which steps are required is CFG-UC-01 (§5). Each step **pulls from an existing capability record by ID**. Nothing is typed twice. A reference is stored as `{id, kind, source_revision, item_sha256}`, so the approved version pins exactly what it pointed at. A field takes only an ID of the right kind from the same workspace: `ref_not_found` and `ref_kind_mismatch` refuse anything else. Free text is allowed only for the problem, the acceptance criteria and reasons, all allowlisted and single-line (§13a.2).

| Step | Pulls from (by ID) | Capability | What the step adds | Tool | Tag |
|---|---|---|---|---|---|
| 1 Problem, users and task | the Strategy `UC-` fields; the `SH-` user group | §13i.2, §13k | the one task, in the users' words | `user_flow` intent interview | REUSE |
| 2 Outcome and measures | `OUT-`, `MEAS-` | §13f | which measures this use case moves | `grill_questions` (outcome bank, DM2-o3) | REUSE |
| 3 Speed Layer boxes | `SLR-<box>`, current and target rating | §13g | which boxes; the ratings are read, not typed | `speed_layer_assess` | REUSE |
| 4 Terrain systems and data | `TF-` systems and data classes; for `plug_in`, `extension_point` facts | §13b, §13l.1 | which facts are in scope | `terrain_get` | REUSE |
| 5 Delivery mode and host contract | `delivery_mode`, `plug_in_kind`; `HC-` items | §13l, §13l.2 | the mode; for `plug_in`, `HC-` items are drafted here and carried into the Cornerstone by ID | `use_case_save` | EXTEND |
| 6 Readiness for this scope | gaps, `RISK-`, `ACC-` | §13h | the assessment run on only this use case's facts, systems, boxes, `HC-` items and pilot shape | `readiness_assess` scope `{use_case: UC-n}`, `gap_score` | EXTEND |
| 7 Governance | `GOV-` items whose `applies to` includes this use case | §13j | which items apply; `missing` and `assumed` ones show here | `governance_get` | REUSE |
| 8 Stakeholders and roles | `SH-` | §13k | sponsor, decision owner (A), users, approvers (decision owner and `eval_owner`, each with a `member_ref`), FDE lead (submitter) | `stakeholder_save` | REUSE |
| 9 Pilot shape | type `task` or `project`; users, teams, systems, data classes, weeks; 2–5 success metrics linked to `MEAS-` | §13i.3 | the box any later `PIL-` charter must fit inside; THR-49 and THR-50 limits are applied inline | `grill_questions` (`aadm://doctrine/pilot-charter`) | REUSE |
| 10 Acceptance criteria | plain-language lines, each citing a `MEAS-` or a pilot metric | new | "Done means …" in the customer's words | `grill_questions` (`aadm://doctrine/use-case-definition`) | NEW bank |

If a needed record doesn't exist yet, the step links to the record's home (for example the Speed Layer view or the Readiness and risk view) and comes back. It never offers an inline copy.

### 13o.3 Definition of ready (THR-59)

A use-case version can be submitted only when the checks required by CFG-UC-02 pass. `use_case_save` computes them on the server and returns each as `{check, pass, value, threshold, ref_ids}`. The UI never computes them (`aadm://doctrine/guidance-feedback-seam`). Status moves between `draft` and `ready` on its own as checks pass or fail.

| Check | Passes when |
|---|---|
| UR-1 Outcome | linked `OUT-` and `MEAS-` items with a full baseline and a numeric target, per CFG-UC-03 |
| UR-2 Speed Layer | linked boxes rated, with a target at or above the current rating, per CFG-UC-04 |
| UR-3 Terrain | cited `TF-` facts that are `verified` and not stale, per CFG-UC-05 |
| UR-4 Delivery mode | `delivery_mode` set; for `plug_in`, host-contract items as CFG-UC-06 requires |
| UR-5 Readiness | a use-case-scoped `readiness_assess` newer than the last edit and within CFG-UC-07's age; the risk gate CFG-RISK-03 passes |
| UR-6 Access | the `ACC-` rows named by CFG-UC-08 have an owner, a lead time and a need-by date; none `blocked` |
| UR-7 Governance | no required in-scope `GOV-` item `missing`; the `assumed` share within CFG-UC-09 |
| UR-8 Stakeholders | the roles named in CFG-UC-10, with every approver (CFG-APPROVAL-01) linked by `member_ref` |
| UR-9 Pilot shape | fits CFG-UC-11 (type, size and weeks from CFG-PILOT-01 to CFG-PILOT-03) |
| UR-10 Success metrics | CFG-UC-12 (the CFG-PILOT-06 rule, each metric with a numeric baseline, target and floor) |
| UR-11 Acceptance criteria | single-line items citing a `MEAS-` or pilot metric, with no `TBD`, `TODO` or `?`; count and length per CFG-UC-13 |
| UR-12 Strategy | V and F set; K within CFG-UC-14; the Strategy decision is `chosen` |

### 13o.4 Versions and approval

**States:** `draft` → `ready` (automatic when the CFG-UC-02 checks pass) → `in_review` (submit) → `approved` | `changes_requested` | `rejected`. An `approved` version becomes `superseded` when a newer version is approved.

| Rule | Design |
|---|---|
| Who submits | the FDE lead (`owner` or `planner` on the FDE side), with `use_case_submit` (FIX-03: never an agent alone deciding). The submitted body's SHA-256 is stored, and the version can't be edited while `in_review` |
| Who approves | the roles in **CFG-APPROVAL-01** (in Standard: the customer **decision owner** (A, §13k) approves and the **`eval_owner`** co-signs, as D8). Whether one person may hold two roles and decide once is CFG-APPROVAL-02; every role is recorded |
| Segregation of duties | per CFG-APPROVAL-09 (Standard: the submitter and every author of the version can't decide) |
| Where | **web only**, in a human session. There is no MCP tool to approve, request changes or reject, matching §9's rule for Sign and Go. An agent credential gets 403 |
| Review SLA | a decision within CFG-DATE-02 (working days per CFG-DATE-01) after submit; a "Needs you" reminder at CFG-DATE-03; overdue turns Use case health red (CFG-HEALTH-10) |
| Changes requested | lists items (count per CFG-APPROVAL-07), each naming a `UR-` check or a step. The other role's approve is voided. The version returns to `draft` for edits, and the items show as a to-do |
| Rejected | needs one reason (FIX-07). The version is closed, and the Strategy decision becomes `rejected` with that reason |
| Freeze | on approval, `content_sha256` = the submitted hash, and the database refuses any update to the row (like DM1-b1; FIX-04). Any change after that is **v N+1**, which needs a new approval |
| Pinned references | if a referenced record changes after approval (its item hash differs, for example a fact goes stale or a risk band rises), the version shows `refs_changed` with the list. The decision owner confirms "still valid" on the web with a reason, or the FDE opens v N+1. THR-61 ages it |
| Audit | every event goes to `plan_event`: `uc_saved`, `uc_ready`, `uc_submitted`, `uc_approved`, `uc_cosigned`, `uc_changes_requested`, `uc_rejected`, `uc_superseded`, `uc_refs_changed`, `uc_still_valid` |

### 13o.5 Gates and loop-backs

1. **Cornerstone.** In an FDE workspace, `cornerstone_save` refuses a new cornerstone without an approved use-case version (`uc_not_approved`). The version records `uc_id`, `uc_version` and `uc_content_sha256` (handoff check 14, §4.2), and C0 is pre-filled from the use case's `OUT-`, `MEAS-`, `SH-` and `HC-` references by ID.
2. **Pilot.** A pilot can't start unless its primary use-case version is approved and not superseded. Its scope must fit inside the use case's pilot shape (§13i.3).
3. **New version.** Approving v N+1 supersedes v N and runs the §4.3 replan. Cornerstone versions citing v N show "amendment needed", and slices tracing to changed references turn purple. A running pilot on v N gets a checkpoint flag and keeps running on v N until its decision owner amends it under §13i.3 rule 3.
4. **Loop-backs:** changes requested → Plan (the Use case tab); rejected → Strategy (re-rank, or choose again, which opens v N+1).
5. Approval doesn't replace the CFG-RISK-03 and CFG-RISK-04 gates at Sign and Go. They still run.

### 13o.6 Where it shows up (UX)

- **Plan tabs** (FDE workspace): **Use case**, Cornerstone, Batches and slices, Prompts, Map. The Use case tab label shows the checks passed against those CFG-UC-02 requires, the state and the SLA days left.
- **The guided definition** (DM6-u3): a stepper with the 10 steps of §13o.2. Each step is a picker over existing records, showing their status and staleness. The ready checks sit beside it, as returned by the API.
- **The approval screen** (DM6-v4) shows:
  - the version, and a diff from the last approved version by reference ID;
  - the ready checks and the pinned references, with links;
  - the scoped readiness summary;
  - who must say yes, with sentiment and last touchpoint (§13k), and the SLA days left;
  - **Approve**, **Request changes** (an item list) and **Reject** (a reason).

  The submitter sees the buttons disabled, with the reason "You submitted this version; someone else must decide."
- **Workspace home:** the Plan chip's first sub-chip is Use case. "Needs you" lists reviews waiting on the signed-in approver.
- **Pilot builder** (DM6-g3): step 1 lists only approved, not superseded versions.

## 13p. The Firm layer (v1) and the configuration focus (v0.13; D33, D34; Brian, Oct 25, 2026, 2:53 and 2:56 PM ET)

**Why.** Brian: "yes firm layer in v1, update the roadmap to include Portfolio view... Reuse across engagements... People (staffing, utilization, comparing quality across 100 FDEs)... White-label... Platform fit. Ontology setup on a platform like Palantir's is configuration, not code... Terrain... would also need to hold platform configuration facts. And the speed layer has info on enterprise architecture so it should work still there and beef up the 'configuration' focus on AADM FDE-MCP". **Design buyer (a scenario, not a named customer):** a firm with 100 FDEs that sells forward-deployed engineering and sets up the configuration layer of a customer's core data platform (Palantir's is one example; this PRD states no Palantir product facts). Today nothing in the PRD spans a firm's engagements ("portfolio" and "playbook library" have 0 hits in this PRD before v0.13), because FIX-06 seals every customer workspace. The Firm layer is a separate layer above workspaces, designed so FIX-06 stays true.

**Where it runs.** Every Firm-layer save runs in `aadm-backend` (D30); `aadm-core` keeps saving nothing (FIX-27). Firm screens live in the aadm.io member area (`aadm-web`, D33), behind the proposed Clerk feature `firm_layer`, part of AADM Field (name proposed, 0-hit check UNCHECKED). Which plans carry it is open for Brian (§20).

### 13p.1 The firm model and tenancy

- **Firm.** A `firm` is an organization above customer workspaces: one firm, many engagement workspaces, many FDEs. It uses our own tables, like D4 (Clerk Organizations stay off).
- **Firm roles** (CFG-FIRM-17): `firm_owner`, `firm_admin`, `engagement_lead`, `fde`, `firm_viewer`. A user may belong to several firms.
- **FDEs on many engagements.** An FDE works in a customer workspace only through that workspace's own `workspace_member` row (DM1-a1). **A firm role grants nothing inside a customer workspace** (FIX-28).
- **The link.** A customer workspace joins a firm through a `firm_workspace_link`. The customer consents first, through the people CFG-FIRM-02 names, in a human web session (FIX-03). The link carries the rollup level the workspace's policy allows (CFG-FIRM-01, CFG-FIRM-04). The customer can see exactly what the firm sees (CFG-FIRM-03) and can revoke the link at any time.
- **What the firm sees.** The firm reads customer workspaces **only through one server view, `firm_rollup`**, limited to the fields of each link's level (FIX-29). The default level is metadata only: the customer-approved workspace label, stage, phase health colors and counts (open risks by band, pilots by state, readiness checks passed and failed, slices by state, map progress) and the last activity date, per policy (for example Standard = `status_counts`). Customer facts, Terrain fact fields, prompts, reports and verdict text never appear unless the customer's policy opts a named kind in (CFG-FIRM-04; for example Standard = none). A revoked link returns 0 rows on the next read.
- **Deployment modes.** For a workspace in mode (b) or (c), the rollup holds only what the aadm.io control plane already keeps (counts, §13a.4). Anything more is a later item (§20).

### 13p.2 Portfolio view

One page per firm, across every linked engagement: stage, phase health, risks by band, pilots by state, readiness, and delivery-map progress, each with the rule that set its color (PF-06). It filters by stage, health color, engagement lead, playbook version used and risk band. A field above a link's level shows "not shared" and is never fetched. It reads `portfolio_get` (§9), which reads `firm_rollup` only.

### 13p.3 Reuse: the playbook library

- **What a playbook holds.** A proven engagement pattern, as templates only: use case definition skeleton (§13o.2 steps), Cornerstone sections, batch and slice templates, prompt templates, Terrain section templates, risk and readiness checklists, and configuration patterns (`PC-` items, 13p.6). Which kinds a firm uses is CFG-FIRM-07.
- **Promotion.** An FDE or agent proposes a pattern from an engagement with `playbook_propose`. The server runs the **strip check**: 0 customer identifiers or values may remain (the source workspace's names and labels, system and service names, crosswalk terms, stakeholder names, `TF-` fact names and any value field). A version that fails is refused, never saved with a warning (FIX-30). A person approves the promotion per policy (CFG-FIRM-05; for example Standard = one named playbook owner who is not the author), and the source customer is told or asked per CFG-FIRM-06.
- **Versions.** Each approved version is immutable, hashed and numbered (like FIX-04). A change is a new version.
- **Starting from a playbook.** `playbook_apply` creates **drafts** in a customer workspace; each draft needs that customer's own facts before any check can pass. Whether a new engagement must start from one is CFG-FIRM-18.
- **Tracking.** Every use is a `playbook_use` row, so the library shows which engagements used which version and how they went (through the rollup only).

### 13p.4 People: staffing, utilization and quality

- **Staffing.** `firm_assignment` rows record who is on which engagement, in which engagement role, at what allocation, from when to when.
- **Utilization and capacity.** Allocation against each FDE's capacity (CFG-FIRM-13), with a warning per policy (CFG-FIRM-14; for example Light = off).
- **Quality across FDEs.** Per FDE and per playbook version: slice ON PLAN rate, rework rate (slices with more than one report before ON PLAN), readiness pass rate and cycle time (Go to ON PLAN). They are computed on the server from rollup counts only (PF-06). Which metrics are in use is CFG-FIRM-09; a metric shows only above the minimum sample (CFG-FIRM-10); colors use the policy's bands (CFG-FIRM-12); comparison is CFG-FIRM-11.
- **No hard-coded ranking.** No preset ranks people. Individual views are a policy setting (CFG-FIRM-08; for example Light = off, Standard = each FDE sees their own).

### 13p.5 White-label

A firm can brand its engagement workspaces: the name shown to its customers, a logo and colors (CFG-FIRM-15), shown in the workspace shell, share links, the transfer package cover and the map render header, with a "powered by" line per CFG-FIRM-16. It is the same image and the same backend, configured per firm; branding never changes who can see data or where it is stored. A **custom domain is a later item** (UNCHECKED: Clerk satellite domains on Brian's plan, TLS and routing). AADM ships no theme that imitates another company's product.

### 13p.6 Platform fit: configuration is first-class

**Why.** Setting up a data platform's configuration layer is configuration, not code. D25's `plug_in` mode with the `configure_only` sub-kind already covers the delivery; v0.13 gives it its own facts, targets, tools and done-check.

- **Terrain holds platform configuration facts** (new profile section 17, optional; required for a `configure_only` cornerstone). These are generic, for any platform: data object types and their property names and types, link types between them, actions or functions (names, parameter names and types), pipelines (names and input and output names), the permissions model (role and scope names, never member lists), integrations (connector kind and direction) and environment layout (names and promotion steps). **Names and shapes only, never values, secrets or customer data rows** (FIX-31), under the same allowlist rule (§13a.2, FIX-07). They turn stale per CFG-STALE-05. No feature is named "Ontology" (§17).
- **How they are filled, inside the customer's walls.** The customer's coder or FDE exports the platform's configuration locally (the platform's own export or API, run by the customer) and reduces it on the host to names and shapes with AADM's collection guidance. Only allowlisted fields cross (§13b.3).
- **Speed Layer tie-in.** The enterprise-architecture boxes (T7 Enterprise Architecture, T8 Architecture Governance) and the "Enterprise architecture" aspect (§13g) take their **current** configuration state from Terrain's platform-configuration and system facts, cited by `TF-` ID, and show the **target** state from the cornerstone's configuration items.
- **Configuration targets in Cornerstone.** For `configure_only`, Define (C3) adds `PC-<n>` items: the object types, links, actions, pipelines, permission scopes and integrations the work must leave in place, each citing at least 1 `OUT-` (§13f.3). A configuration gap view compares current (Terrain) with target (`PC-`): `match`, `missing`, `changed` or `extra`, with the same one-way guards as the UDALI gap view (§13b.6).
- **Configuration slices.** A `configure_only` slice carries a `config_change`: the platform, the planned change set (names and shapes, the `PC-` items it applies) and its hash, and the hash of the **prior configuration export** taken before applying (the export itself stays with the customer).
  - *Done-check:* the applied change, read back or re-exported per CFG-MODE-06, matches the planned change set; only then can the suggested verdict be ON PLAN.
  - *Rollback:* re-apply the prior export (required per CFG-MODE-07; for example Standard = required).
  - *Must not change:* everything outside the change set.
- **Configuration tools (stateless, in `aadm-core`, listed only for AADM Field plans (D33); proposed names, 0-hit check UNCHECKED):** `config_plan` (from `PC-` targets and current facts, an ordered change set and suggested slices with done-checks and rollback), `config_diff` (two shape-only exports in, the diff out) and `config_verify` (planned change set against the applied diff). They save nothing; results are saved through `aadm-backend` with the existing report and Terrain tools (D30).

## 13q. AADM Field: site page, plans, web app, MCP, database and services (v0.13; D33, D35; Brian, Oct 25, 2026, 3:04 PM ET; v0.13.1, D36, 3:20 and 3:21 PM ET)

Brian: "current AADM MCP supports AADM CODE... and most of the marketing site is aadm code. So for AADM Field, we need sep page (1 page) and we need to create the product in clerk? and we need to allow users to get CODE AND OR FIELD and we need users to have the webapp and also mcp for field (the PRD). make sure the prd covers aadm field mcp (share aadm code mcp) and aadm field database and services etc".

### 13q.1 The marketing site

Today's aadm.io stays AADM Code. AADM Field gets **one separate page** (§7 item 15; path aadm.io/field, confirmed by Brian, D36), linked from the existing nav. Producer writes the copy. The page's job: explain AADM Field to enterprises and consultancies, show the promise line word for word, and carry the sign-up and plan CTAs. Prices follow D36 (AADM Field costs the same as AADM Code; Code + Field is 15% less than both added together); the page shows a number only when Brian supplies it. It is designed before it is built (DM5-a4).

### 13q.2 Plans: Code and/or Field

Brian (D36, 3:20 PM ET): "Same pricing as AADM code. Just replicate as a 2nd product. Bundle is 15% less for both." "Field plan is sep from code.  Have to subscribe to both to get both." "Trial includes both code and field." AADM Field is a **separate subscription** that does **not** include the Code tools; a user can hold Code, Field or both. Checks are by **feature**, never by plan key (D-A): core pre-checks from Clerk with a TTL cache, and the backend re-checks every call (D-C, D30).

| Plan label (key) | Features | Price (D36) | Site | Web app (aadm.io member area) | MCP tool list (mcp.aadm.io, FIX-32) |
|---|---|---|---|---|---|
| Free (`free`) | the open AADM Standard and the free tools (which tools are free is open, §20) | none | all public pages | account and plan | the free tools only; none of the 15 `shared` planning tools (D40) |
| Trial (new users; length Brian sets in Clerk, DM6-p1) | the Code and the Field features while it runs | none | all public pages | both member areas | the Code tools, the Field tools and the 15 `shared` planning tools; at trial end, the Free list (no `shared` tool) within CFG-TECH-17 |
| Code (`mcp`) | `mcp_access`, `plan_tools` | the AADM Code price (number UNCHECKED here) | all public pages; the Field page offers Field as a second subscription | the Code member area: personal workspace, Cornerstone, delivery maps, prompts, the map, Settings, account, API keys, plan | the Code tools plus the 15 `shared` planning tools (D40); no Field tool (the 8 FDE tools are no longer listed after DM6-p3; hard cutover, no grace period, D36 item 8) |
| Field (`fde`) | `fde_tools`, `terrain`, `customer_workspaces`; `firm_layer` and `white_label` where Brian chooses (open, §20) | the same as the AADM Code price | all public pages; Code pages offer Code as a second subscription | the Field screens (13q.3), plus account, API keys and plan | the Field tools (13q.4), including the 8 moved FDE tools, plus the 15 `shared` planning tools (`prd_outline`, `delivery_map`, `slice_issues`, `interrogate_plan`, `journey_map` and `predone_review`, plus the 9 D40 added; D38, D40); no Code-only tool |
| Code + Field (`mcp_fde`) | every feature of Code and Field | 15% less than the Code and Field prices added together | all public pages | both | both |

- **Prices:** this PRD holds no dollar amount. Field's price equals Code's, and the bundle equals (Code price + Field price) × 0.85. Brian reads the actual Code price from Clerk Billing or Stripe in DM6-p1 (UNCHECKED here).
- **Tool lists by subscription (FIX-32, FIX-34):** each tool's plan tag (`code`, `field` or `shared`, plus the `free` flag; DM1-e5), read by DM6-p2, says who sees it; `shared` covers 15 planning tools (D38, D40), which Code, Field-only, Code + Field and trial users keep and Free users never get; every `shared` tool has `free: false`. Core filters `tools/list` from it and refuses calls to unlisted tools; the backend re-checks every save. A Field-only user's `tools/list` shows the Field tools and no Code-only tool; a Code-only user sees no Field tool. The full split list is open (§20).
- **Sign-up:** the Field page's CTA starts Clerk sign-up for the Field plan, with the trial covering both products. A Code user adds Field as a second subscription (or moves to Code + Field) from the plan page, and a Field user adds Code the same way. Enterprise invoicing stays as D-B.
- **Upgrade or second subscription:** new screens and tools appear within the CFG-TECH-17 cache.
- **Downgrade, cancel or trial end:** only the lost product's screens and tools disappear, on the next request and in the tool list within CFG-TECH-17; the workspace's data stays and stays exportable (§11); nothing is deleted except by the retention rules (CFG-RET-01, CFG-RET-02).
- **Clerk Billing and Stripe setup** is Brian's hand-run step (DM6-p1): the Field product at the Code price, the bundle at 15% less, the trial covering both. The PRD holds no secrets or prices; Brian sets every value, and bots change no billing or money settings.

### 13q.3 The AADM Field web app

The signed-in screens at aadm.io, shown only to plans with `fde_tools`: customer workspaces, the firm portfolio, Terrain, Strategy, the Speed Layer, use cases (definition and approval), Cornerstone and maps for FDE work, Readiness and risk, pilots, governance policy settings and stakeholders, playbooks, staffing and white-label. Code-only users see their Code member area. They are the same `aadm-web` container with no business logic and no data of its own; it calls `aadm-backend` server-side with the user's Clerk session (§13d). The gate is DM6-p2.

**After sign-in (v0.13.3, D37; v0.13.7, D41).** The Field home is aadm.io/field/main, its own page with account settings in the user menu: "Continue" (the next plan step), "Waiting on you" and "Waiting on the customer" across every engagement (D37's "Needs you", split), each engagement's place in its plan, next plan work and delivery status (DM6-g1), the engagement list with "No engagement yet" and one "Start an engagement" button, and a one-time "Connect your AI coder" card. Landing follows §13q.2's plans: Field and Code + Field → /field/main; Code → /member/api-keys; Free → pick-a-plan page; trial → the chooser until a choice is saved, then that product; a converted trial follows its paid plan. An explicit deep link wins. Code-only and Free users at /field/main see an offer, never an error. Screens, states, calls and strings: `/workspace/blueprint/aadm/ux-field-post-login.md` v0.2. Slices: DM5-a5, DM6-h, DM6-i, on DM6-a4, DM6-a5 and DM6-g5.

### 13q.4 The AADM Field MCP

It **shares the AADM Code MCP endpoint**: mcp.aadm.io, `aadm-core`, one URL (ADR 004; confirmed by Brian, D36; no separate path). Field tools, including the 8 existing FDE tools (moved behind `fde_tools` in DM6-p3, D36) and the configuration tools (`config_plan`, `config_diff`, `config_verify`), are listed and callable only for Field plans and active trials (FIX-32), are stateless in core, and save through `aadm-backend` (D30, FIX-27). For Code-only users, AADM Code's behavior doesn't change, but the 8 FDE tools are no longer listed (DM6-p4).

**When the plan changes mid-session.** Core sees a feature change (upgrade, downgrade, trial end) at its next entitlement cache read, within CFG-TECH-17 (60 s). It then sends that session the MCP `notifications/tools/list_changed` notification, so the client re-fetches `tools/list`. A client that ignores the notification sees the new list on its next `tools/list` call or reconnect; meanwhile every call is still checked server-side, so a tool that is gone is refused. UNCHECKED: whether the MCP SDK (`@modelcontextprotocol/sdk ^1.29.0`) supports per-session `tools/list` filtering and a per-session `list_changed` notification; DM6-p3 confirms both against the repo in its confirm-first facts.

### 13q.5 The AADM Field database and services

All of it runs in `aadm-backend` (D30). `aadm-core` has no database (FIX-27).

| Part | What it holds or does | Slices |
|---|---|---|
| Postgres schema | every Field table: workspaces and members, Terrain, outcomes, Speed Layer, governance, stakeholders, risk and access, readiness, use cases and approvals, pilots, `workspace_policy`, the entitlement table, and the firm layer (`firm`, `firm_member`, `firm_policy`, `firm_workspace_link`, `playbook`, `playbook_version`, `playbook_use`, `firm_assignment`, `firm_capacity`, `firm_brand`) | DM1-a1, DM1-d1, DM1-f1, DM6-c1, DM6-c2, DM6-c3, DM6-d1, DM6-f1, DM6-v1, DMF-a1, DMF-a2, DMF-c1, DMF-d1, DMF-e1 |
| File storage | renders, exports and firm logos, behind `BlobStore` | DM1-c2, DM4-a2, DMF-e1 |
| Plans API | the one write path for the web app and MCP | DM2-a1, DM2-a2 |
| Terrain crawl, ingest and transpose | facts, platform configuration, the three views | DMT-a1, DMT-a2, DMT-c1, DMT-c2, DMT-c3, DMT-d1, DMT-d2 |
| Readiness, risk and pilots | the assessment, register, gates and pilot records | DM6-d1, DM6-d2, DM6-e1, DM6-f2, DM6-f4 |
| Firm services | the portfolio rollup, playbooks, staffing metrics, white-label config | DMF-a2, DMF-b1, DMF-c1, DMF-c3, DMF-d2, DMF-e1 |
| Retention | archive and delete jobs | DM7-a2 |
| Billing webhooks and entitlement | the relay in core, verification and rows in the backend | DM6-c3, DM6-p2 |

**Migrations run on dev and QA only, never prod, from any agent or slice.** A prod migration is Brian's hand-run step, done only by the written runbook `docs/runbooks/prod-migration.md` (v0.14, D43, ARCH-23; written in DM1-c4: backup, the exact command, the parity check, the down step, and where the run is logged). Migrations are plain portable SQL with a down step (DM1-c4).

## 14. Risks

1. **Sign-in single point of failure.** Mitigated by §11. It still needs the Clerk OAuth app fix from Oct 24 to be fully closed (UNCHECKED: root cause).
2. **Posture change.** aadm-mcp becomes a stateful client. This needs an ADR plus updates to `AGENTS.md` and the directory copy. Its read-only annotations must stay accurate.
3. **Cross-tenant leak of repo facts.** Covered by RLS, one workspace per token, `tenant_isolation_check` and THR-12.
4. **Secret capture in reports.** Covered by the reject filter in §10 and no `.env` content. Residual risk: secrets in unusual shapes.
5. **Name confusion.** The stateless `delivery_map` tool versus the stored *Delivery maps* feature (§17).
6. **Blueprint cutover.** Importing 442 Forge slices could drift from the Python source. DM7-c runs a parity check and keeps Python authoritative until parity is green.
7. **Railway.** Deploys were paused after the env-var breach. Brian sets every new env var himself, and no bot touches keys.
8. **Scope creep into a project-management tool.** Held off by the non-goals in §3.
9. **(v0.8) A plugin outlives its owner or breaks on a host upgrade.** Mitigated by Q8, Q9, A8 and G13 (§13h.3) and the `extension_point` freshness window (CFG-STALE-03).
10. **(v0.8) The published standard drifts from how Blueprint actually works.** Blueprint's own prompts are linted by the same doctrine (DM3-a4), so a drift shows up as a finding.
11. **(v0.9) Approval becomes a bottleneck.** Mitigated by the review SLA and reminder (CFG-DATE-02, CFG-DATE-03), the approvers named and checked in UR-8 before submit, and the "Needs you" list.
12. **(v0.9) An approval goes stale or becomes a rubber stamp.** Mitigated by pinned reference hashes and `refs_changed` (§13o.4), the CFG-UC-02 ready checks before submit, and segregation of duties where CFG-APPROVAL-09 is on.
13. **Firm rollup leaks customer data** (v0.13). Mitigated by FIX-28, FIX-29, the consent gate (CFG-FIRM-02) and DMF-a3's leak suite (0 cross-customer content rows).
14. **People metrics misused** (v0.13). Mitigated by off-by-default individual views in Light (CFG-FIRM-08), minimum samples (CFG-FIRM-10) and no preset ranking (CFG-FIRM-11).
15. **Playbooks carry a customer's details to the next customer** (v0.13). Mitigated by the strip check (FIX-30) and approval (CFG-FIRM-05).
16. **(v0.13.5, D40) Breaking change for current Free users.** On aadm-mcp `main` at `302e28fa68` (merge of PR #111, Oct 24, 2026, 9:57 PM ET; read-only on GitHub, Oct 25, ~6:35 PM ET), `authorizeMcpIfConfigured` (`src/mcp-auth.ts`) checks only that the `aadm_` token, `ak_` key or OAuth token is valid (no plan or feature check, with `CLERK_OAUTH_CLIENT_ID=*` allowed since `f11066ee98`), and `createMcpServer` (`src/mcp-server-factory.ts`) calls `registerTools` for every session: all 15 `shared` planning tools are registered (67 `registerTool("…"` names matched in `src/tools.ts`). So a signed-in user with no paid plan can call them today. DM6-p3 removes them for Free. **Accepted as a hard cutover (v0.13.6, D40a, Brian, Oct 25, 2026, 6:38 PM ET: "Hard cutover on the DM6-p3 commit, same as the FDE tools"):** current Free users lose the 15 tools on the DM6-p3 commit, with the 8 FDE tools, and no grace period. By default the same applies to every other non-free tool Free can call today (FIX-32's "Free, the free tools only"); that follows from D40a and is not a separate decision. Residual risk: Free users relying on these tools lose them without notice in the product; any user-facing notice is outside this PRD's slices. Whether production runs exactly `main` and has OAuth or self-serve sign-up switched on is UNCHECKED (deployment, not repo).

## 15. Success measures

- Copy and paste per slice goes from about 4 manual pastes to **0** (prompt pulled, report posted).
- **100%** of slices in an active plan have a linked prompt, report and final verdict.
- New `.bak` files in Blueprint go from 622 today to **0**, because history lives in `plan_event`.
- Report to recorded verdict takes at most **5 minutes** median. A map refresh takes at most **10 s** (THR-4).
- **0** cross-workspace rows (THR-12). **0** cornerstone-unsigned plans.
- **(v0.9)** **100%** of FDE cornerstones and pilots cite an approved, not superseded use-case version. Median submit to decision is **within CFG-DATE-02**. **0** use-case fields retyped where a capability record exists (all by ID).
- After DM7-c, Blueprint runs the Forge F1 plan from AADM for 2 weeks with no fallback needed, or with the fallback working cleanly when it is.

## 16. Overlap with existing AADM features

Read at aadm-mcp `302e28fa68` and aadm-website `958dc13367`, which have the same code as Brian's local dev `7d02c5e658` and `23fd957312`. The registered tools are in `src/tools.ts` (66 `registerTool` calls; all judgment tools use `AADM_READ_ONLY_TOOL_ANNOTATIONS`, `:4604`). Pages are under `src/pages/`. **No DB tables exist in either repo.**

| Capability | Existing piece (path) | Verdict |
|---|---|---|
| PRD scaffold for a cornerstone | `prd_outline` (`src/tools.ts:9320`, `src/prd-outline-builder.ts`), `resources/templates/prd-template.md` | **REUSE** as is (C1) |
| Cornerstone document shape | BIS template `resources/templates/bis-template.md`; standard `aadm-standard/docs/build-intent-specification.md`, `templates/bis-lite.md` | **EXTEND**: the cornerstone is a stored BIS plus technical sections (contracts, data, INV, THR, tenancy, UX, DEC) with item IDs. The template gains those optional sections (DM2-b1). |
| FDE cornerstone fields | `resources/templates/fde-outcome-contract.md`, `plan_delivery` `engagement_kind: fde`, `resources/doctrine/fde-engagement.md` | **REUSE**: embed named acceptors and exit criteria in FDE cornerstones; the `eval_owner` co-signs |
| Cornerstone lint and challenge | `interrogate_plan` (`src/interrogate-plan.ts`), `grill_questions`, `gap_score` (`src/gap-score.ts`) | **REUSE** in C4 and handoff check 6 |
| Unset-threshold, stray-doc and deletion lint | `interrogate_plan` scanners (exact scanner list UNCHECKED) | **EXTEND** `interrogate_plan`: add plan_kind `delivery_map` scanners for `TBD` thresholds, docs not tied to a slice, and deletions without rollback (DM2-c1) |
| Invariants, user flow and UX | `invariant_register`, `user_flow` (`:6929`), `ux_surface_pass`, `signal_stack_outline`, `prism_frame` | **REUSE** in C1 and C3 |
| Repo grounding | `repo_feature_map` (`:4721`), `repo_architecture_map` (`:4703`), `survey_context_brief` | **REUSE**: host-provided evidence; the commit is recorded on the cornerstone |
| Compute slices, build order and contract spine | `delivery_map` (`:8363`, `src/delivery-map.ts`): batches (the live schema still says `chunks`/`chunk_id`, `src/delivery-map.ts:79`, `:114`, `:322` at `78d93b8`; DM0-c3 adds `batches`/`batch_id`, v0.14), slices, `blocking_deps`, `build_order` | **REUSE** to compute; its output JSON is the input shape of `delivery_map_save` |
| Per-slice acceptance checklist and sizing | `slice_issues` (`:8320`), `src/slice-sizing.ts`, `src/process-sizing.ts` | **REUSE** on save for the S1–S5 verdict |
| Handoff and role framing | `plan_delivery` (`:7183`) | **REUSE** in C1; not a store |
| Short-lived plan state | `run-store` (`src/run-store.ts`), `run_state_control` (`src/run-state-control.ts`), `delivery_map` with `persist_run` | **REUSE** the revision and idempotency contract only. It is not the plan store: it is labeled `optional_cache` with a 1 h TTL. |
| Authoritative plan, cornerstone, prompt, report and verdict store | none | **NEW**: nothing in either repo persists. `AGENTS.md:122` says no database. |
| FDE value stream, outcomes, Speed Layer, risk assessment, pilots, governance map, stakeholders (v0.7) | see the deconflict tables in §13e, §13f.1, §13g, §13h.1, §13i.1, §13j and §13k | REUSE and EXTEND as listed there; NEW only for the stored registers |
| Replan on requirement change and drift | `replan_check` (`:7832`, `src/replan-check.ts`): `CONTINUE`, `STOP_AND_REPLAN`, `ASK_HUMAN` from events and scope files | **REUSE**: called on amendment (§4.3) and inside the suggested verdict |
| Report check | `predone_review` (`:7931`), `repo_evidence_binder` | **REUSE**: its verdict and attestation lines are inputs to the suggested verdict |
| ON PLAN or DRIFT verdict record | none (`predone_review` checks the coder's own diff, not plan conformance) | **NEW** `delivery_map_report` and `delivery_map_verdict` store a plan-scope comparison and a human verdict. (v0.13.4, D38) The comparison itself is a new stateless core judge (proposed `delivery_map_conformance`, tag `shared`, name 0-hit check UNCHECKED) that reads `predone_review`'s output; the report tool only stores it |
| Next approved prompt for a coder | none | **NEW** `delivery_map_next_slice` (needs the stored go state) |
| Map image | `repo-map-renderer.ts` and `render-contract.ts` (repo maps, Mermaid and HTML); website `src/lib/coding-shift-svg.ts` | **EXTEND** the render-contract pattern with a delivery-map SVG renderer (DM4-a1); PNG rasterize is new (DM4-a2) |
| User journey framing | `journey_map`, `journey_trace`, `journey_attest` (Pathfinder, assurance lane) | **REUSE** for the release check of UX slices. Not a planning map; we avoid the word "journey" in UI names (§17) |
| Long-run checkpoints and subagent split | `orchestrator_anchor`, `fanout_guide` | **REUSE** in the coder loop |
| One branch per batch | `chunk_branch_check` (`:8608`) | **Not used**: conflicts with the no-branches rule; plan `git_policy = no_branches` |
| Member area, tabs and auth gate | `src/pages/member/[...rest].astro`, `MemberShell.astro`, `MemberPageGate.astro`, `MemberNavTabs.astro`, `src/lib/routes.ts` (`/member(.*)` protected), `src/middleware.ts` | **EXTEND**: add the Plans tab and its pages (DM5-a1) |
| Dashboard, project or session pages | none on aadm.io (only API keys, OAuth, Profile and Security tabs) | **NEW**: plans list, cornerstone, live map, history |
| Tokens and credentials | `mcp-auth.ts` (aadm_, ak_, OAuth); member `api-keys` and `mcp-oauth` tabs; aadm_ token *issuing* is not in aadm-website at this commit (UNCHECKED where issued) | **EXTEND**: bind each credential to one workspace and a role taken from that user's `workspace_member` row (DM1-a2, DM2-a1). Pages unchanged except a workspace picker on key creation (DM6-a1). |
| Workspace and tenant model | per-user `owner_namespace` only (`mcp-auth.ts:466-480`) | **NEW**: our own `workspace`, `workspace_member` and `workspace_invite` tables with roles (D4 changed: Clerk Organizations are off). Clerk stays identity only. |
| Lessons from DRIFT | `lessons_register` (host-owned, stores nothing) | **REUSE**: Delivery maps is the host store |
| Terrain: crawl of the customer's repos | `repo_architecture_map`, `repo_feature_map` (`src/tools.ts:4703`, `:4721`; the coder inspects locally, the server checks and renders supplied evidence, "no client filesystem access", `:838`) | **REUSE** exactly: the host runs them inside the customer boundary; their derived output is saved as Terrain facts (DMT-a1) |
| Terrain: UDALI map and 22-layer assessment | `repo_feature_map` 22-layer assessment; `repo_architecture_map` UDALI map | **REUSE**: stored as `udali_placement` facts with commit and verified date |
| Terrain: customer vocabulary to AADM terms | `vocabulary_crosswalk` (`src/tools.ts:5302`; "Deterministic dictionary lookup, never LLM inference", `:850`) | **REUSE** for the glossary section; **EXTEND** for the transpose crosswalk view (D13, DMT-c1) |
| Terrain: UDALI transpose (D13) | crosswalk: `vocabulary_crosswalk` (`src/tools.ts:5302`); matrix and gap: `repo_architecture_map` / `repo_feature_map` output stored as facts; the word "transpose" itself: 0 hits (§13b.6) | **EXTEND** `vocabulary_crosswalk` with a per-workspace dictionary (DMT-c1); **NEW** read-only matrix and gap views over stored facts (DMT-c2, DMT-c3) |
| Terrain: guided interview | `audit_interview` ("Scope audit — guided Q&A", `src/tools.ts:6143`, answers ≤ 60 keys) | **EXTEND** with a `terrain` question bank (D11 default) |
| Terrain: owners and acceptors | `plan_delivery` `engagement_kind: fde`, `fde-outcome-contract.md` | **REUSE**: seeds the Owners section |
| Terrain: constraints | `invariant_register` | **REUSE**: a constraint fact can become an `INV-*` |
| Terrain: stored, sourced, dated stack profile | none | **NEW** (`terrain_fact_save`, `terrain_get`) |
| Storage seam and deployment modes | `run-store.ts` has Redis or memory behind one interface (precedent only) | **NEW** `PlanStore` and `BlobStore` interfaces (DM1-c2) |
| Delivery modes and host contracts (v0.8) | none (0 hits; §13l); `coding_principles` asks about extension points (`src/coding-principles.ts:124`) | **NEW** fields and checks; **REUSE** the question in C3 |
| Use case definition and approval (v0.9) | §13i.2 `UC-` record, DM6-f1, the cornerstone freeze and sign pattern, `readiness_assess`, `grill_questions`, `user_flow`, `gap_score`, `replan_check` (§13o.1) | **EXTEND** the `use_case` record and `readiness_assess`; **REUSE** the freeze, sign and replan patterns; **NEW** `use_case_submit`, `use_case_get`, `use_case_approval` and the use-case bank |
| Batching rules as a standard (v0.8) | `aadm://doctrine/slice-sizing`, `process-sizing`, `chunk-branch`; aadm-standard `reuse-before-build.md` | **REUSE** as cited in §13n; **NEW** `aadm://doctrine/batching-standard` |
| Model calls | none: aadm-mcp dependencies are `@clerk/backend`, `@modelcontextprotocol/sdk`, `ioredis`, `zod`; no LLM SDK (§13a.3) | **Keep it that way** (guard in DM1-c3) |

Result: the proposed tools add storage and human gates only. Every computation they need is an existing tool, called as is. The one exception is the planned `interrogate_plan` scanner extension. (v0.13.4, D38, D39) New judgment logic (the `CS-` plan and prompt rules, the conformance check, and the FDE checks) is added to `aadm-core` as stateless judges, never to a save tool or the backend. Every verdict drawer, health chip and lint result shows AADM's computed recommendation and the rule behind it, and the UI never recomputes it (`aadm://doctrine/guidance-feedback-seam`).

## 16a. Adding a tool (v0.13.4, D38, D39)

Every new or changed tool passes all five before its slice can be ON PLAN:
1. **Logic in core.** Its judgment or computation is stateless code in `aadm-core`, served on mcp.aadm.io. A backend-only tool is refused at review.
2. **Persist only as needed.** If Field users need the result kept, an `aadm-backend` save tool stores the core output with `judged_by {tool, tool_version, commit}`. The backend adds no judgment (FIX-33).
3. **One plan tag.** It declares `code`, `field` or `shared` (and the `free` flag) where it's registered; an untagged tool fails the build (DM1-e5, FIX-34). Every FDE tool is `field`.
4. **No fork.** It doesn't copy or vary an existing judge; it calls it (D38). A Field-only need is met by what is saved and shown, or by a new `field` judge in core.
5. **Proved.** The parity test (FIX-33) and the tag matrix (DM6-p4) include it.

## 17. Naming check

**Decision:** Brian chose **Cornerstone** plus **Delivery maps** (Oct 25, 2026, 9:44 AM ET).

**Searched:**
- GitHub code search, default branches, across aadm-mcp, aadm-website and aadm-standard. Terms: `charter`, `cornerstone`, `"delivery map"`, `plan_delivery`, `keystone`, `groundwork`, `bedrock`, `accord`.
- A local grep of aadm-mcp `src/tools.ts`, because at 401 KB it is above GitHub's code-search size limit.
- On Oct 25, a local `grep -ril` on Brian's Mac across all three repos, excluding `node_modules`, `.git`, `dist` and `.astro`.

**Results:**
- **Cornerstone:** **0 hits** in tracked files in all three repos, on GitHub and on local dev. The only local match is a password-strength wordlist inside an untracked Playwright Chrome profile (`aadm-website/playwright/demos/.auth/chrome-profile/…/english_wikipedia.txt`), which is not product code or copy.
- **Charter (not chosen):** a soft conflict. aadm-standard uses it for the **Governance Charter**:
  - `GOVERNANCE.md:1` title
  - glossary entry at `docs/glossary.md:195`
  - `README.md:116, 127, 172`
  - also `docs/README.md` and `standards/README.md`
- **Groundwork:** 0 hits, but not chosen.
- **Other names ruled out:**
  - Keystone: 1 hit, `src/pages/case-studies.astro`
  - Bedrock: 1 hit, `aadm-standard/docs/ai-coder-playbook.md`
  - Accord: 4 hits in aadm-mcp
  - Blueprint: the bot's own name
  - Brief: clashes with `standard_brief` and `survey_context_brief`
  - Intake: clashes with `audit-outline-intake.ts`
- **Cornerstone and BIS:** a signed cornerstone *is* a stored, signed BIS (`aadm-standard/docs/build-intent-specification.md`; glossary `BIS-lite` at `:67`). Product copy says "Cornerstone (your signed BIS)", so the standard's term keeps its meaning.
- **Delivery:**
  - `delivery` is one of the three lanes, alongside defect and assurance (glossary `:121`, "Navigator, Investigator, and Sentinel (delivery lanes)"; `route_lane`).
  - The `delivery_map` tool already exists, titled "Delivery map — FE+BE slices" (`src/mcp-tool-titles.ts:23`). There is also a run-store slot `delivery_map` (`src/run-store.ts:39`).
  - "delivery map" has 10 code-search hits in aadm-mcp and aadm-standard.
  - `plan_delivery` has 11 hits on aadm-website marketing pages and in aadm-standard vignettes.
  - Fit: **Delivery maps** sits under the delivery (Navigator) lane as the stored form of what `delivery_map` computes. The `delivery_map_*` tools make that explicit, and the existing `delivery_map` tool title stays unchanged.
- **Avoid "journey" in names:** `journey_map`, `journey_trace` and `journey_attest` are Pathfinder (assurance lane). The image is called a "delivery map".

**Terrain (v0.5 capability name), searched Oct 25, ~10:05 AM ET** with GitHub code search (default branches: aadm-mcp `302e28fa68`, aadm-website `958dc13367`, aadm-standard `9a16239f23`, each with 0 files changed vs Brian's local dev) plus a local grep of aadm-mcp `src/tools.ts` (above the search size limit):
- **Terrain: 0 hits** in all three repos and in `tools.ts`. **Recommended** (D12). It fits Cornerstone and Pathfinder without reusing either.
- **Landscape: 0 hits**, but generic.
- **Atlas: taken.** 8 files in aadm-mcp (the `repo_architecture_map` HTML output is "a standalone offline atlas", `src/tools.ts:830`; also `src/repo-map-renderer.ts`, `src/repo-map-analysis-renderer.ts`, `docs/repo-map-tool.md`, `README.md`), 1 in aadm-website (`src/pages/case-studies.astro`) and 2 in aadm-standard (`examples/mcp-real-world-vignettes-*.md`).
- Avoided by instruction: Survey (taken), Ontology (Palantir's term), Platform and Stack (SIGL and stack params).

**v0.13 names (not searched in the repos this round; no repo or Mac access):**
- **AADM Code and AADM Field (D35).** Name check done Oct 25, 2026 (Commander): AADM Code low risk, AADM Field low to medium. Brian decided Oct 25, 3:21 PM ET that no legal or trademark search is needed. "Field" sits close to Brian's **Field Notes** content brand on drbrianlambert.com: a known, accepted overlap. **Rule: never use "AADM Field Notes".**
- **"field" inside this PRD:** every other use means a data field (JSON columns, schema fields, form fields, `9-field charter`). A PRD grep found no feature, table or tool named with "field", so nothing is ambiguous. New text says "AADM Field" in full, never "Field" alone for the product, except the plan labels Field and Code + Field.
- **Firm, portfolio, playbook, `firm_*`, `playbook_*`, `portfolio_get`, `config_plan`, `config_diff`, `config_verify`, `PC-<n>`, `platform_*`, `firm_layer`, `white_label`: UNCHECKED** (0-hit repo search still to run). Known nearby hit: aadm-standard `docs/ai-coder-playbook.md` (above) uses "playbook" for a doc, not a feature; check it before locking "playbook library".
- No feature is named "Ontology"; Terrain section 17 is "Platform configuration".

**v0.7 names, searched Oct 25, ~10:45–10:55 AM ET on Brian's Mac** (aadm-mcp `d8af2e4f7c`, aadm-standard `9a16239f23`): "value stream", "Outcome clarification", "Readiness and risk", `risk_register`, `RISK-`, `ACC-`, `GOV-`, `UC-`, `PIL-`, `SLR-`, `readiness_assess`, `speed_layer_assess`, `pilot` and "go/no-go" have 0 hits. None clashes with Navigator, Sentinel, Pathfinder, PRISM, SEAM, UDALI, SIGL, Survey, Atlas or Charter. `use_case` exists only as a field of AADM's own `AUTOMATION_USE_CASES` (`src/ai-automation-profile.ts:11-33`), so customer use cases use `UC-` IDs and the `use_case` table name is scoped to the FDE schema.
**v0.9 names, searched Oct 25, ~12:35 PM ET** with GitHub code search over `bwl8772` repos (not on Brian's Mac): `use_case_submit`, `use_case_approval` and `use-case-definition` have **0 hits**; "definition of ready" has 1 hit, in the unrelated Spira-Pro-AI repo. **UNCHECKED:** a local grep of aadm-mcp `src/tools.ts` (above the index size) and of the `UR-` check prefix; the next prompt's REPO-FIRST GATE covers it.
**v0.8 names, searched Oct 25, ~11:35 AM ET on Brian's Mac** (aadm-mcp `d8af2e4f7c`, aadm-standard `9a16239f23`, `git grep -i` over `src`, `resources`, `docs` and `AGENTS.md`): `delivery_mode`, `plug_in`, `code_in_source`, `extension_point`, `host_contract`, `HC-<n>`, "chunking standard" and `batching-standard` have **0 hits**. "Extension points" has 1 hit, a design question in `src/coding-principles.ts:124`; no clash. "Plugin" appears in `src/repo-map-analysis.ts` and `src/render-contract.ts` with a different meaning (stack inspection plugins; test-wrapper plugins); no clash, because the product term is `plug_in` and "plug-in" in copy.

## 18. Delivery map v0.19 (for building this feature)

Rules: work on dev with no branches, one commit per slice and no push. Slices run scoped tests only.
- Column end: aadm-website `npm run typecheck` (`astro check`) and aadm-mcp `npm run build` (`tsc`).
- Map end: aadm-mcp `npm run go` and aadm-website `npm run check`.

**v0.16 order (D45, D47).** The Field core comes first: Stage 0 (kept), then **F1** the backend store and the 12 verbs, **F2** Blueprint's roadmap in Field (the first major feature), **F3** requirements gathering, **F4** Slack, **F5** the web shell with full editing, **F6** safe to depend on. The FDE extras follow as later stages (F7, T, 6A, 6B, 6C, 8): they stay in the plan as plumbing or later work, **never the Field UX purpose** (D45 (5), D47). Tags: kept slices keep their `DM` IDs; new slices use `F<n>-x<k>`. Each slice has a *done-check*. Each Field-core slice cites the user stories it delivers (§A2.2). The only hard deletes are the retention jobs (DM7-a2), with an export first.

**v0.19 change to the order (D55, Brian, Oct 29, 2026).** One docs batch, DM0-j (2 slices), closes Stage 0 after DM0-a3, so the v0.19 rules of §A17 are in both repos before F1-a1 builds the store. Rule R7 binds every slice. No other slice moves.

**v0.18 change to the order (D54, Brian, Oct 29, 2026).** Stage V is cut to the loop (20 slices; 21 to the demo with DM0-a3): DM0-b4 and DM0-d move to a new batch F4-g at the start of F4 (DM0-d dissolves into it), and F1-b1 to H-a. `batch` runs the order check. Rule R6 binds every slice.

**v0.17 order (D53, Brian, Oct 29, 2026).** The Field core is re-sequenced to the thin vertical: Stage 0 (the done work and DM0-a3), **V** the loop end to end on Blueprint's own roadmap (25 slices; the demo), **F3** requirements, **F4** Slack (kept thin), **H** the hardening the demo did not need (18 slices, moved from 0, F1 and F2, none deleted), **F5** the web shell's browse views, map, evidence and co-sign, **F6** safe to depend on. Then the later stages: **F8** full web editing, invites, billing and landing (moved out of F5; D45 (3) stands), F7, T, 6A, 6B, 6C, 8. One new slice, `F2-b0` (`batch`, the verb no v0.16 slice built). Batches F1-b and F2-e dissolved; V-a, H-a and H-b added. Slice IDs are labels: a kept ID's stage letter no longer says where it runs. The six principles of §A16 are read into every slice. §A15 has the table.

**R6, the Field test (v0.18, D54; binds every slice, read before R1 to R5).** Field helps a person who has a fuzzy idea and a pile of half-right plans get to the next right commit. Every Field-core slice must help a person decide what to do next or get it done. A slice that only proves something to someone else (an auditor, a dashboard, a parity record) goes to Stage H or later. The order is clarity, focus and precision, then speed (one agent, then fleets), then proof, then compliance tracking last (§A16 principles 1 and 7). Field is not a compliance app and not a backend dashboard: no screen leads with evidence, attestation, health colors or counts, and no user is asked to produce a document like this PRD. (v0.19) FLD-01 to FLD-04 in §A17 are this rule as invariants in both repos.

**R7 Trace (v0.19, D55; §A17; binds every slice).** Every slice that writes a row gives it a server-made UUID (IDN-06), records the `request_id` and `idempotency_key` of the call that made it (ART-02), and logs one JSON line per call and per hop with the OBS-01 fields (OBS-05); the backend mints `request_id` in F1-a3, so Stage V is traceable from its first write. No slice adds a table of user actions (AUD-03), a measure that is stored rather than derived (OBS-04), or a customer-facing dashboard (FLD-04). Operator observability is plumbing; what a person sees is the answer and, with it, how long the step took.

**v0.16.1 Field-core rules (R1 to R5; they bind Stages 0 to F6 and are read into every kept slice; v0.17: Stages 0, V, F3, F4, H, F5 and F6).**
- **R1 Names.** The verbs are the `field_*` tools of §A4. Where a kept slice or §9 says `delivery_map_next_slice`, `delivery_map_report`, `delivery_map_save`, `delivery_map_prompt_save`, `delivery_map_render` or `cornerstone_save`, read the §A4 verb that absorbed it (`field_next_slice`, `field_submit_report`, `batch`, `write prompt`, `render map`, `iterate`). No slice builds a second name.
- **R2 Settings before F7.** `workspace_policy` and the presets (DM1-f1, F7-s) land after the Field core. Until then every Field-core slice reads the **Standard** preset values as constants from the doctrine text (DM1-f1's own rollback), `judged_by.policy_revision` is the fixed sentinel `preset:standard`, and CFG-LOCK-03 is `reason`. A done-check that says "for each preset" or "Light and Regulated" runs on Standard alone in the Field core and again per preset when DM1-f1 lands (DM1-e4, DM6-g6, DM7-a2).
- **R3 Tables.** F1-a1's `artifact`, `artifact_version` and `artifact_link` replace the §8 content tables (`cornerstone*`, `plan`, `stage`, `batch`, `slice`, `prompt`, `report`, `verdict`, `plan_event` and the rest that hold the 14 nouns). These §8 tables stay as named: `actor`, `workspace`, `workspace_member`, `workspace_invite`, `agent_credential_binding`, `user_pref`, `entitlement`, `workspace_event`, `workspace_deletion_tombstone`, `schema_migrations`.
- **R4 Fixtures.** The acceptance fixtures live in aadm-website: this PRD at `docs/PRD-aadm-delivery-maps.md` and the prompt library at `docs/prompts/` (17 files). `/workspace/blueprint/...` paths name Blueprint's originals and are not read by any slice. The WinBench fixture (F2-a3) needs a repo path before that slice starts (§20).
- **R5 Challenge tools.** `pressure_test` is a per-surface test scaffold (its input is `component_name` and `surface_kind`), so `challenge` (F3-b1) runs `interrogate_plan` on the requirements text (`plan_kind: contract` or `prd`; `contract` runs the full normative scanners and the Steve and Charles text is contract-shaped, so F3-b4 confirms which gives the 6-row result, §20) and `grill_questions` on each doctrine URI those findings cite; `pressure_test` stays for web surfaces (DM5-a4, F5). The relationship rows use `cross_surface_check` with `contract_fields` (producer = the owning contract, consumers = the contracts it feeds).


**Stage 0: The ground rules are written down and checked** (Brian + aadm-mcp + aadm-website + aadm-standard)
- Batch `DM0-a` **The last open fact is confirmed and the ADR is written** (DM0-a3 added in v0.7, before DM0-b1)
  - `DM0-a1` ✅ **DONE (Brian, Oct 25, 2026, 9:52 AM ET).** Brian answered: Clerk Organizations are off for aadm.io; use our own workspace table. D4 updated in §19. (Owner BRIAN; no prompt.)
  - `DM0-a2` ✅ **DONE (commit `d8af2e4` on aadm-mcp dev, Oct 25, 2026).** ADR 004 `docs/adr/004-mcp-may-call-aadm-plans-api.md` records the private plans API behind portable ports, the container split, the allowlist rule, the three modes, no LLM dependency and D4; `AGENTS.md:122` and `:241` updated. D15 is decided (A).
  - `DM0-a3` ✅ **DONE (aadm-mcp `4b475d5` on `dev`, not pushed; Oct 29, 2026; `predone_review` approve; one confirm-first fact was stale and harmless: `AADM_BACKEND_URL` already appeared in `docs/ARCHITECTURE_INVARIANTS.md` from INV2, with the same name).** **(new in v0.7; widened in v0.12 for D30)** ADR 004 addendum, a named doc slice in aadm-mcp. It records: **D30**, `aadm-core` saves nothing and `aadm-backend` owns the plans API, Postgres, file storage, every save tool, the billing webhooks, the `entitlement` table and retention (this supersedes ADR 004's "`aadm-fde` stores nothing; persistence behind `aadm-core`'s plans API" and D15's placement); the container rename to `aadm-backend` and start modes `core` and `backend`; the website calling the backend directly with the user's session; (v0.14, D43, P14) the ADR 005 TEN-01 and TEN-02 amendments as worded in §10 (the `actor_id` setting; the web path where the backend verifies the Clerk session itself; all three MCP credential kinds); the new rollback (backend URL unset → stateless tools only, saves return `storage_unavailable`; never write in core); `fde_tools` as a Clerk Billing feature (D16), pre-checked in core from Clerk with a TTL cache and re-checked in the backend from its table (D-A to D-E); and the Clerk M2M token (audience `aadm-backend`, CFG-TECH-01) instead of a self-signed JWT. **(v0.16.1)** The addendum also records the third start mode `aadm-agent` (D45 (1), D48): private network, one model key per workspace set by Brian, saves nothing; core and backend make no model calls. The AGENTS.md sentence is at :124 at aadm-mcp dev `b626e4b` (Oct 29, 2026; it was :122 at `d8af2e4`), and `aadm-backend` already appears in `docs/ARCHITECTURE_INVARIANTS.md`, `docs/ENGINEERING_RULES.md` and ADR 005, so the prompt's confirm-first reads the current tree. Prompt: `docs/prompts/prompt-DM0-a3.md` (v0.16.1 rewrite; the Oct 25 draft was written against `d8af2e4` and PRD v0.13). *In:* ADR 004 (unchanged since `d8af2e4`), ADR 005 at `78d93b8`, D16, D30, D45 (1). *Out:* the ADR 004 addendum, the ADR 005 TEN-01 and TEN-02 amendments (§10 wording) and AGENTS.md:124 (v0.16.1: three files, all docs). *Done:* the ADR names core's no-save rule, the backend's duties, the entitlement checks, the M2M token's audience and lifetime (THR-32), the routing and the rollback; AGENTS.md:124 no longer says core gains a plans API; the addendum names three start modes. *Rollback:* revert the doc commit. *Keep:* src/, package.json, ADRs 001–003.
- Batch `DM0-i` **The architecture rules are written into both repos** (new in v0.15, D44, to record work already done; docs only; done after DM0-a2)
  - `DM0-i1` ✅ **DONE (INV-MCP, aadm-mcp `78d93b8`, pushed).** `docs/ARCHITECTURE_INVARIANTS.md` (52 lines, 40 rules: BACK-01, DEPLOY-01, CONTRACT-01, MODEL-01, ARCH-01 to ARCH-25 and the IDN, TEN and AUTHZ rules), plus the `AGENTS.md` and `docs/ENGINEERING_RULES.md` pointers and the ADR 005 owner note.
  - `DM0-i2` ✅ **DONE (INV-WEB, aadm-website `dba0c8e`, pushed).** `docs/INVARIANTS.md` (26 lines, 19 bullets): the rules that bind the website.
  - `DM0-i3` ✅ **DONE (INV2-MCP, aadm-mcp `2b1b364` on `dev`, not pushed; ON PLAN, Oct 25, 2026, ~9:00 PM ET).** Adds 80 tagged Day 0 and Day 1 rules to `docs/ARCHITECTURE_INVARIANTS.md` in sections CAP, CTX, API, RES, ENV, XO, DATA, SRC, ART, EVD, APR, RUN, JDG, INT, EVT, AUD, OBS, PRIV, OPS and TST. The file now has 164 lines, 120 bullets and 19 headings. All three confirm-first facts matched, all five scoped tests passed, and `predone_review` approved with nothing to fix. RES-03, CAP-01, DATA-04, AUD-02, API-08, OPS-07 and ENV-02 predate D44 and need the §20 follow-up edit.
  - `DM0-i4` ✅ **DONE (INV2-WEB, aadm-website `9ad68e2` on `dev`, not pushed; ON PLAN, Oct 25, 2026, ~9:00 PM ET).** Adds the 24 website rules, with the same IDs, to `docs/INVARIANTS.md`. The file now has 55 lines, 43 bullets and 4 headings. All three confirm-first facts matched, all five scoped tests passed, and `predone_review` approved with nothing to fix. Its TEN-07 line still lists 8 families (§20 follow-up).
- Batch `DM0-j` **The scope lock and the trace rules are written into both repos** (new in v0.19, D55; docs only; after DM0-a3 and before DM0-b1, so F1-a1 and F1-a3 build against the rules; §A17 is the wording)
  - `DM0-j1` ✅ **DONE (INV4-MCP, aadm-mcp `67e7a8c` on `dev`, not pushed; Oct 29, 2026; every CONFIRM FIRST fact matched, every TESTS count matched (177 lines, 131 bullets, 20 headings, 90 and 31 tagged, numstat `14 1`), `predone_review` approve).** **(new in v0.19, D55; INV4-MCP; stories all (foundation))** Adds the 11 rules of §A17 to aadm-mcp `docs/ARCHITECTURE_INVARIANTS.md` (IDN-06 in Identity; CTX-06, ART-02, AUD-03 and OBS-03 to OBS-05 in their Day 0 sections; a new "Field scope" section with FLD-01 to FLD-04) and retags OBS-01 `[both]`. Repo aadm-mcp, docs only. Prompt: aadm-website `docs/prompts/INV4-MCP.md` (rule R4; its CONFIRM FIRST reads the file at `b626e4b`, 164 lines). *In:* DM0-i3 (the file as INV3-MCP left it). *Out:* the file at 177 lines, 131 bullets, 20 headings. *Done:* the prompt's TESTS hold (177 lines, 131 bullets, 20 headings, 90 tagged rules, 31 tagged website or both; `git diff --numstat` is `14 1`), and `predone_review` approves. *Tests:* the prompt's `rg` counts. *Rollback:* revert the commit. *Keep:* every other line of the file.
  - `DM0-j2` ✅ **DONE (INV4-WEB, aadm-website working tree, Oct 29, 2026; written with v0.19 and not yet committed at this writing).** Adds IDN-06, ART-02, OBS-01, OBS-04 and FLD-01 to FLD-04 to `docs/INVARIANTS.md` with the same IDs, worded for the website (65 lines, 51 bullets, 5 headings, 31 tagged website or both). Checked by those counts and by the §21 v0.19 rows.
- `C0` column check (aadm-mcp `npm run build`; aadm-website `npm run typecheck`). (v0.17: Stage 0 now ends after DM0-a3; v0.19: after DM0-j1; the rest of its v0.16 batches are in Stage V and Stage H.)

**Stage V: The loop runs end to end on Blueprint's own roadmap (the thin vertical; v0.17, D53; cut to the loop in v0.18, D54)** (aadm-backend · aadm-core (MCP) · aadm-agent · Postgres (Supabase first))
  Stage V is the loop and what it stands on, nothing else (rule R6). After DM0-a3: the backend and its forwarding (DM0-b1 to DM0-b3; DM0-b3 is Brian's Railway step), the storage ports and the batching standard (V-a), the store, members, envelope and agent worker (F1-a), the judgment registry and the imports (F2-a), `batch` with the order check, `write prompt` and required evidence (F2-b), `go`, `field_next_slice` and `submit report` (F2-c), and `judge` and `render map` (F2-d). v0.18 moved the guard (DM0-b4, DM0-d1 to DM0-d3) to F4-g, before the public Slack relay, and the tenancy suite (F1-b1) to H-a: a one-person demo on one workspace needs neither. **The demo at CV is this PRD's own fifth revision, replayed** (Oct 29, 2026): import §18 at v0.16.1; tell `batch` to pull the loop forward (the moves of D53); Field shows the order findings those moves cause, as the order script did; fix them; `render map`; `write prompt` for the next slice; `go` with the person's own Clerk session through the command API (no Slack or web shell yet; FIX-03 holds); `field_next_slice` from a coder credential; `submit report` with the INV3 fixture; `judge`; confirm; and the map shows You are here moved. Success is time: that revision took a full working session by hand, and the demo does it in minutes. Stage V slices keep their v0.16 IDs; the ID's letter is a label, not a stage.
- Batch `DM0-b` **The backend runs as two containers, core and backend** (new in v0.6; renamed in v0.12, D30; v0.17: first in Stage V, and DM0-b1 and DM0-b2 are rewritten with their prompts once DM0-a3 lands, §20; v0.18: DM0-b4 moved to F4-g)
  - `DM0-b1` ✅ **DONE (aadm-mcp `30c5f7c` on `dev`, not pushed; Oct 29, 2026; 8 of 8 scoped tests, `test:mcp-http` green in core mode, backend mode booted locally and refused an untokened call; `predone_review` blocked once on two swallowed errors, now logged as JSON lines with `request_id` and the error class only, then approve).** **(rewritten in v0.19 after DM0-a3 landed, per the addendum, ADR 004 §2: the 8 FDE tools stay stateless in core and do not move; prompt `docs/prompts/prompt-DM0-b1.md`, read at aadm-mcp `67e7a8c`)** The `backend` start mode (`AADM_START_MODE=backend`) of the same image, `aadm-backend`: a private server with `GET /health` and the forwarding seam `POST /internal/verbs/<name>`, guarded by a Clerk M2M token, with an empty verb registry that F1-a3 fills; every response carries a UUID `request_id` in `x-request-id` (rule R7, CTX-01). A 4-line dispatch at the top of `main()` in `src/index.ts`; unset or `core` runs today's server unchanged. *Done:* no token or a rejected token gets 401; an unregistered verb gets 404; a registered test verb gets 200 and receives the response's `request_id`; a non-JSON body is `rejected`, a thrown verb `internal_error` with no stack; `test:mcp-http` still passes in core mode. *Tests:* `test:backend-service`, `test:mcp-http`, biome. *Rollback:* revert; nothing calls the backend yet.
  - `DM0-b2` ← **You are here.** **(rewritten in v0.19 after DM0-b1, per the DM0-a3 addendum §3 and §6: the 8 FDE tools stay in core and no save tool or Field verb exists yet, so this slice builds only core's forwarding client; prompt `docs/prompts/prompt-DM0-b2.md`, read at aadm-mcp `30c5f7c`)** NEW `src/backend-client.ts`: `forwardVerb(name, input, ctx)` posts to the backend's `/internal/verbs/<name>` (DM0-b1) with a Clerk M2M token (lifetime ≤ 300 s, CFG-TECH-01, cached and re-minted with under 30 s left), `x-request-id` and the actor and workspace; it never throws and maps every failure to a result code; with the backend URL unset (CFG-TECH-03) it returns `storage_unavailable` / `backend_not_configured` with no call; one JSON log line per forward with `request_id`, verb, status and `latency_ms`, never the token or the body. No MCP tool uses it until F1-a3. ASK, Brian: the Clerk machine for core and its `CLERK_MACHINE_SECRET_KEY`, before DM0-b3. *Done:* tested against DM0-b1's handler: echo round-trip carrying the `request_id`; one mint per token lifetime; wrong token is `backend_auth_failed`; `not_found` passes through; a hung or closed backend is `dependency_unavailable` within the timeout; logs hold no token or input; `tools/list` still 68 tools. *Tests:* `test:backend-client`, `test:backend-service`, biome. *Rollback:* revert; nothing calls it. (v0.13 wording replaced: the QB-01 hop budget, THR-32, is measured at F1-a3, when a real verb forwards.)
  - `DM0-b3` Railway: a second service, `aadm-backend`, from the same image, on the private network only, with its own healthcheck. The database, storage and webhook-signing settings are set on this service only; core gets none (D30). (Owner BRIAN: he sets every env var and service; no prompt.) *Done:* `aadm-backend` has 0 public routes and `/health` is green; the core service has no database setting. *Rollback:* delete the service and unset the backend URL.
- Batch `V-a` **The storage ports and the batching standard exist** (new in v0.17, D53: DM1-c2 and DM0-c2, pulled forward because F1-a1 saves through `PlanStore` and F2-b0 and F2-b1 lint against the standard)
  - `DM1-c2` `PlanStore` and `BlobStore` ports with a repository layer, a plain-Postgres implementation (standard driver; Supabase is only the host), an S3-compatible blob implementation, an in-memory implementation, and the shared adapter contract suite. *Done:* all pass 100% of the suite (THR-23), and a lint finds 0 Supabase, driver or SDK imports in domain code.
  - `DM0-c2` aadm-mcp `resources/doctrine/batching-standard.md` (Part 2: Limits, Plan rules, Prompt rules, Verbatim lines, Copy), served as `aadm://doctrine/batching-standard`. It needs an entry in `src/registry.ts` (like `:273-274`) and in `src/resources.ts` (like `:150-154`), a loader `src/batching-standard.ts` modeled on `src/slice-sizing.ts`, and a selftest. *In:* Part 2 of `docs/aadm-batching-standard-draft.md` in aadm-website (v0.17: this slice runs in Stage V before DM0-c1 publishes Part 1 in Stage H; the two parts are kept in step by DM0-c1's done-check), the slice-sizing pattern. *Out:* the resource and a typed standard (limits, rules with severity, VL lines). *Done:* reading the URI returns the file; the loader parses 12 limits, 17 plan-rule lines, 9 prompt-rule lines and 6 VL lines; removing one limit key makes the selftest fail with that key named; the other doctrine selftests are unchanged. *Rollback:* remove the 4 additions (nothing calls the loader yet). *Keep:* `slice-sizing.md`, `process-sizing.md`, `chunk-branch.md` and `chunk_branch_check`.
- Batch `F1-a` **The 14 nouns and 12 verbs exist, and the agent worker thinks** (new in v0.16, D45)
  - `F1-a1` **(new in v0.16, D45; stories all (foundation))** **The artifact store.** Repo aadm-mcp (backend mode, `aadm-backend`). Tables `artifact` (internal `id`, `workspace_id`, `kind` = one of the 14 nouns in §A3, human label), `artifact_version` (artifact id, version, parent_version, body JSON, `content_sha256`, `author_actor_id` or agent id, `client` (`slack`, `web`, `mcp`), `source_ref`, `created_at`) and `artifact_link` (from, to, link kind), through plain SQL files under `db/migrations/` run by the smallest runner that records `schema_migrations(version, sha256, applied_at)` (v0.17: DM1-c4's migration lint and the prod-migration runbook land later, in Stage H, on top of these files) and through `PlanStore` (DM1-c2, Stage V). Versions are append-only; Runs, Evidence and Decisions are write-once; Requirements, Prompts and Roadmaps freeze at the version a Decision points to (§A3). Absorbs DM1-b1 to DM1-b3 (cornerstone, plan, prompt, report, verdict and event tables). **(v0.18, D54, fleet foundation; §A16 principle 1)** The store is built for many agents from day one, so fleets need no migration later: every `artifact_version` records its author as an `actor_id` that may be a person or an agent credential (one per agent, never shared), Runs and Evidence are append-only children of one Slice (many per slice, from many agents), and a nullable `claimed_by` and `lease_until` for the Slice exist but nothing sets them until the fleet batch (§20). They live outside the versioned body, as nullable columns on the `artifact` row (or a small claim table keyed by artifact id; which one is §20 UNCHECKED), because a claim that changes every few minutes can never be a version; so adding the lease later is a column default, not a migration of versions. **(v0.19, D55; IDN-06, ART-02, AUD-03, rule R7)** Every `artifact` and `artifact_version` id is a UUID that Postgres generates as the column default (`uuidv7()` on Postgres 18 or later, else `gen_random_uuid()`; Brian, Oct 29, 2026), never one the application supplies, and the version row also carries `request_id`, the `idempotency_key` of the call that made it (nullable) and `release` (nullable until DM0-b4 fills it, F4-g), so one action is traceable from the client's key to its rows with no second table. *Done:* every write is version N+1; an UPDATE or DELETE on `artifact_version` fails; a Decision on vN plus an edit gives vN+1 with no Decision; the hash matches the body. (v0.18) Two agent actors appending Runs to one slice keep both, in order, with their own authors. (v0.19) A version row joins to the log line of the call that made it by `request_id`, and a client-supplied id is refused. *Tests:* scoped store tests. *Rollback:* down migration. *Keep:* the DM1-c ports.
  - `F1-a2` **(new in v0.16, D45; stories all (foundation); C1, C2)** **Minimal workspace and members.** Repo aadm-mcp (backend mode, `aadm-backend`). `actor`, `workspace`, `workspace_member` (§8; `actor_id`, D43), our own tables (D4), FORCE RLS and app-layer checks, the credential binding (one credential, one workspace and role), and the explicit create-workspace route with the no-workspace state (D42). Absorbs DM1-a1 to DM1-a3 and DM6-a1. *Done:* user B reads 0 of A's rows with RLS on and with RLS off; no workspace is a 200 empty state; a coder credential can't call `sign off` or `go`. *Tests:* scoped tenancy tests. *Rollback:* down migration.
  - `F1-a3` **(new in v0.16, D45; stories all (foundation))** **The command API.** Repo aadm-mcp (backend mode, `aadm-backend`) for the verbs; core registers each as an MCP tool that forwards with the Clerk M2M token (D30). One envelope (§A7): `verb`, `workspace_id`, actor, `client`, `source_ref`, `target {kind, id, expected_version}`, `input`, `idempotency_key`, `request_id`, `api_version`; reply `result`, `saved[]`, `next_step`, `needs_decision`. `expected_version` and the 24-hour idempotency window (CFG-TECH-18). Each verb declares its capability and side-effect class (D44 (3)); `sign off` and `go` are people-only routes with no MCP tool (FIX-03). Absorbs DM2-a1, DM2-a2. **(v0.18, D54, fleet foundation; §A16 principle 1)** The envelope already carries everything a fleet needs: `actor` names the agent credential, `idempotency_key` makes a retried call from any agent land once, and `target` may name a Slice or a Batch, so a later batch-wide Go or claim is a new verb on the same envelope, not a contract change (§A4 open set). **(v0.19, D55; CTX-01, IDN-06, ART-02, OBS-01, OBS-05, rule R7)** The backend mints the UUID `request_id` here, in Stage V, returns it in `x-request-id` and in the reply, and writes one JSON log line per verb call with the OBS-01 fields (`ts`, `level`, `service`, `release`, `request_id`, verb, `workspace_id`, `actor_id`, target kind and id, `latency_ms`, result `code`); the reply's `saved[]` lists the UUIDs of the versions the call wrote. DM0-d1 (F4-g) later moves core's own handler and the process logger onto the same context and keeps an inbound id as `client_request_id`. *Done:* a stale `expected_version` returns `conflict`/`revision_conflict`; a replayed key returns the stored reply; an agent credential gets `forbidden` on `sign off` and `go`; (v0.19) one verb call's `request_id` appears in its reply header, its log line and every version row it saved, and the log line holds no body, key or token (PRIV-01). *Tests:* scoped contract tests. *Rollback:* revert; tools unlisted.
  - `F1-a4` **(new in v0.16, D45; stories 1, 2, 4, 6, 7)** **The agent worker** (D45 (1), FIX-12 amended, D48). Repo aadm-mcp, a third start mode `aadm-agent` from the same image, on the private network only. It runs the model calls behind `iterate`, `challenge` (drafting fixes), `batch`, `write prompt` and `judge` (drafting the next prompt); the backend sends it the verb's input and saves what comes back, and the worker saves nothing. Each workspace has its own model key, a secret Brian sets (never shown, never logged, FIX-02); the provider sits behind a port (D48). Every call stores what the agent was asked and what it answered on the version it produced. **(v0.19, D55; CTX-06)** The backend to worker hop carries `request_id`, `workspace_id`, `actor_id`, the verb and `release`; the worker answers with the same `request_id`, and the stored ask-and-answer records it. *Done:* a scoped test proves core and `aadm-backend` make 0 model calls; a workspace with no key gets `rejected`/`model_key_missing`; a key-shaped string never appears in a log line or artifact body; (v0.19) the stored ask-and-answer carries the `request_id` of the verb call that triggered it. *Tests:* scoped, with the model stubbed. *Rollback:* revert; the verbs fall back to people-written versions.
- Batch `F2-a` **Every judgment comes from core, and Blueprint's roadmap and prompts come in** (v0.17: DM1-e4 moved in; F2-a3 moved to H-a) (new in v0.16, D45)
  - `DM1-e4` **(new in v0.13.4, D38)** Judgment registry: one module in the shared `aadm-mcp` image that calls a stateless core tool's own handler by tool name (the same module and commit mcp.aadm.io serves) and wraps the output as `judged_by {tool, tool_version, commit}`; backend-mode code reaches judges only through it. *In:* DM0-b2 (v0.17: DM1-e3 now lands later, in Stage H, and extends its import-graph check to this module then). *Out:* the registry and the `judged_by` envelope type, which only the registry can build. (v0.14, D43, ARCH-17) The envelope is `judged_by {tool, tool_version, commit, policy_revision, standard_version}`. *Done:* for fixture inputs to `prd_outline`, `delivery_map`, `slice_issues`, `interrogate_plan`, `journey_map` and `predone_review`, the registry's output is byte-identical to the same MCP tool call; an unknown tool name is refused; `tool_version` and `commit` are filled from the build, never typed by hand; `policy_revision` and `standard_version` are filled from the resolved workspace policy and the loaded standard, and a judgment without them can't be built. *Tests:* scoped registry tests. *Rollback:* remove the module (nothing calls it until F2-b0, v0.17). (v0.16.1, rule R2) Until DM1-f1 lands, `policy_revision` is the sentinel `preset:standard`. *Keep:* every tool's schema and output.
  - `F2-a1` **(new in v0.16, D45; stories 5, 8)** **Import a delivery map** (`plan roadmap` with `from: file`). Repo aadm-mcp (backend mode, `aadm-backend`). Reads a PRD §18 delivery map (markdown) and Blueprint's Python plan shape (`S()`/`B()`), and saves Roadmap, Stage, Batch and Slice versions with done-checks, owners and status; skips and counts unreadable rows (RC-POISON-01). First fixture: this PRD at aadm-website `docs/PRD-aadm-delivery-maps.md` (rule R4), §18 at v0.19 (14 stages, 55 batches, 160 slices, 7 done, You are here on DM0-a3; the counts are pinned at the commit that lands v0.18 and re-pinned on each PRD revision). **(v0.17, D53, §A16)** The reader is one of several: the markdown §18 reader first, then a JSON plan shape that Blueprint emits for the same map, and later the files other planners write (GitHub Spec Kit, Kiro, Claude Code plan mode); every reader lands in the same Roadmap, Stage, Batch and Slice versions, and the first two are proved here on this PRD (equal counts from markdown and from JSON). Absorbs DM2-c2 (save and get), DM7-a3 (Blueprint import). *Done:* the import equals the §18 counts above, every slice keeps its done-check, and the 6 done slices stay done. *Tests:* scoped import tests on the fixture. *Rollback:* delete the imported workspace (export first).
  - `F2-a2` **(new in v0.16, D45; stories 6)** **Import the prompt library.** Repo aadm-mcp (backend mode, `aadm-backend`). Imports aadm-website `docs/prompts/` (17 files, rule R4: Blueprint's 13 prompts, `prompt-DM0-a2/a3/b1.md` and `D-FIELD-MAIN-2.md`), the verbatim lines VL-1 to VL-6 plus the batch-request line, and the batching standard from `aadm://doctrine/batching-standard` (DM0-c2; its draft is `docs/aadm-batching-standard-draft.md` in the same repo). Each prompt attaches to its slice by ID; unmatched prompts are listed, not dropped. *Done:* every imported prompt is a Prompt version on its slice or on the unmatched list; each verbatim line exists once and is inserted by name. *Tests:* scoped. *Rollback:* revert.
- Batch `F2-b` **The agent batches the roadmap, and every slice gets one linted prompt that names its evidence** (v0.17, D53: F2-b0 added) (new in v0.16, D45)
  - `F2-b0` **(new in v0.17, D53; stories 5, 8)** **`batch`.** Repo aadm-mcp (backend mode, `aadm-backend`) plus the agent worker (F1-a4). The verb of §A4 row 6, in both halves. **Edit:** on an existing Roadmap version, a person's or the agent's instruction (move, split, merge, add or edit a stage, batch or slice with its done-check, files, tests, rollback and keep) gives Roadmap vN+1. **Propose:** from a Requirements version as `target`, or from requirements text passed in `input` (the fixture is §A11 of this PRD, saved as Requirements v1 by the slice's own test), the agent worker proposes stages named by result, batches of 2 to 4 slices and slices of one commit each with a done-check, saved as a `draft` Roadmap version; F3-b3 later passes a signed version into this same verb. Both halves run the core judges `delivery_map`, `slice_issues` and the order check (v0.18, D54: every slice or batch that now names a slice running later or no longer existing, and every batch outside 2 to 4 slices; the rules of aadm-website `docs/scripts/order_check.py`, built in core as a stateless judge so the backend holds no copy, D38; its tool name is UNCHECKED) through the registry (DM1-e4) under `aadm://doctrine/batching-standard` (DM0-c2); the findings are saved on the version with `judged_by`, a blocking finding keeps it `draft`, and no batching logic lives in backend-mode code (D38). *In:* F1-a3 (the envelope), F1-a4, DM1-e4, DM0-c2, F2-a1 (the imported Roadmap). *Out:* the verb, its findings and the `draft` and `ready` states. *Done:* a move instruction on the imported Blueprint roadmap gives vN+1 with the moved slice in its new batch and every other slice unchanged; the §A11 text proposes at least 2 batches, every batch has 2 to 4 slices and every slice has a done-check; a seeded 5-slice batch is a blocking finding and the version stays `draft`; the saved findings equal `delivery_map` plus `slice_issues` on the same input byte for byte; (v0.18) moving DM0-c2 after F2-b1 on the imported roadmap shows one order finding naming both slices, and the reply's `next_step` says which move fixes it. *Tests:* scoped, with the model stubbed. *Rollback:* revert; `plan roadmap` still imports.
  - `F2-b1` **(new in v0.16, D45; stories 6)** **`write prompt`.** Repo aadm-mcp (backend mode, `aadm-backend`). Writes one prompt per slice from the library, grounded on a named commit, with the repo rules, the do-not-change (keep) items, 2 to 4 confirm-first facts and the evidence the coder must return; the lint is the stateless core judge (D38) over the batching standard's prompt rules (about 40 lines, `commit_read`, 2 to 4 confirm-first facts, every verbatim line, no secrets, "Do not push"). Absorbs DM3-a1 and DM3-a4. *Done:* a blocking finding keeps it `draft`; a clean one is `ready`; each version is kept with a diff. *Tests:* scoped. *Rollback:* revert.
  - `F2-b2` **(new in v0.16, D45; stories 6, 7)** **Required evidence per prompt.** Repo aadm-mcp (backend mode, `aadm-backend`). A Prompt version carries `required_evidence[]` (commit SHA, files changed, named tests with counts, `predone_review` disposition, named AADM tool receipts); templates in the library prefill it. *Done:* a prompt with no required evidence fails lint; the judge (F2-d1) reads the list. *Tests:* scoped. *Rollback:* revert.
- Batch `F2-c` **A person says go; the coder pulls and reports back** (new in v0.16, D45)
  - `F2-c1` **(new in v0.16, D45; stories 6)** **`go`.** Repo aadm-mcp (backend mode, `aadm-backend`) route plus the shell and Slack callers. A Go Decision records who, when, the exact words or button, and `(prompt id, version, sha256)` (D43 ARCH-14); human session only (FIX-03). Absorbs DM3-a2. **(v0.18, D54, fleet foundation; §A16 principle 1)** The Go Decision is stored per prompt version and may be recorded for every ready slice of one Batch in one Decision act by a person; v1 offers one slice per Go, and the batch form is the fleet batch's to switch on. *Done:* an agent credential gets `forbidden`; editing the prompt after Go leaves the slice without Go. *Tests:* scoped. *Rollback:* revert.
  - `F2-c2` **(new in v0.16, D45; stories 6)** **`field_next_slice`** for coders on mcp.aadm.io. Repo aadm-mcp (backend mode, `aadm-backend`) plus the core tool. Absorbs DM3-a3. **(v0.18, D54, fleet foundation; §A16 principle 1)** `field_next_slice` takes the caller's agent credential and returns one slice; with one agent that is the Go-bound slice, and the reply already carries `slice_id`, `prompt_version` and `sha256` so a fleet orchestrator can track which agent holds which slice without a new field. *Done:* returns nothing without Go, exactly the Go-bound prompt version with Go, nothing for a `needs replan` slice; plan tag per FIX-34. (v0.17, §A16) One Go releases one prompt to one coder; a lease on the slice for several coders or agents at once is a §20 candidate, not built here. *Tests:* scoped. *Rollback:* unlist the tool.
  - `F2-c3` **(new in v0.16, D45; stories 7)** **`submit report`.** Repo aadm-mcp (backend mode, `aadm-backend`). Accepts a coder report from MCP (`field_submit_report`) or a Slack or web paste; saves a Run and extracts Evidence (commit, files changed, tests run with counts, `predone_review` disposition, tool receipts); secrets refused: this slice builds the reject filter on reports, and F1-b1 (Stage H, v0.18) proves it on every verb. *Done:* the INV2-MCP and INV3 reports in the fixture each give the expected Evidence rows; a report with no commit is saved with a `missing: commit` note. *Tests:* scoped. *Rollback:* revert.
- Batch `F2-d` **Reports are judged and the map draws** (v0.17: F2-e1 and F1-b1 moved in; F2-d2 and DM6-g6 moved to H-b; v0.18: F1-b1 moved to H-a) (new in v0.16, D45)
  - `F2-d1` **(new in v0.16, D45; stories 7)** **`judge`.** Repo aadm-mcp (backend mode, `aadm-backend`). The stateless core judge (D38) compares the Run's Evidence with the slice and the prompt's required evidence (§8 suggested-verdict rules; the drawer and the Slack reply follow `aadm://doctrine/guidance-feedback-seam`) and suggests ON PLAN or DRIFT with reasons and, for DRIFT, a numbered fix list, plus the next prompt or a fix slice; a person confirms with a Decision (CFG-LOCK-03 for an override; `reason` until F7, rule R2). (v0.16.1) The verdict, reasons and fix list are the core judge's deterministic output; the next prompt is drafted by the agent worker (F1-a4) through `write prompt` and saved as a `draft` Prompt version, never as part of the verdict. Absorbs DM3-b1 to DM3-b4 and DM6-g1 (delivery status). (v0.18, D54, rule R6) The verdict reads as an answer, not an audit: first what worked and what didn't, in one line each, then the next prompt or the fix list; ON PLAN or DRIFT is its label and the Evidence rows are one click down. (v0.17, §A16) The Verdict stores `judged_by.policy_revision`, so a later re-judge of the same stored Run under a newer policy is a new Verdict version, never an overwrite (§20 candidate). **(v0.18, D54, fleet foundation; §A16 principle 1)** Each Verdict judges one Run; several Runs on one slice from several agents each get their own Verdict, and a person's confirm names the Run it accepts. *Done:* each seeded DRIFT rule fires; nothing turns green without a confirmed ON PLAN; the saved verdict suggestion equals the core judge's output byte for byte, and the drafted next prompt is a separate `draft` Prompt version. (v0.19, D55; ART-02, OBS-04, FLD-02) The Verdict and its confirming Decision each carry their own UUID and the `request_id` of the call that wrote them, and the reply's `saved[]` names both; the measures shown with the answer (time from Go to this verdict; this prompt template's DRIFT rate so far) are read from version timestamps, never stored, and sit after the answer, not before it. *Tests:* scoped. *Rollback:* revert.
  - `F2-e1` **(new in v0.16, D45; stories 8, C2)** **`render map`.** Repo aadm-mcp (backend mode, `aadm-backend`). Renders the Map (J1 visual language: stage columns named by result, cards titled by result with the ID as a small tag, green/amber/gray/purple, legend, You are here) as SVG and PNG into `BlobStore`. Absorbs DM4-a1, DM4-a2. *Done:* render equals the roadmap version; a 175-slice map renders within THR-4. *Tests:* scoped. *Rollback:* revert.
- `CV` column check (typecheck both repos), then the Stage V demo above, recorded as a Run and a Verdict in the demo workspace and as a §21 row.

**Stage F3: Ideas become signed requirements** (aadm-backend · agent worker)
- Batch `F3-a` **An idea becomes a vision and requirements, round by round** (new in v0.16, D45)
  - `F3-a1` **(new in v0.16, D45; stories 1, 2)** **`capture idea` and `iterate`.** Repo aadm-mcp (backend mode, `aadm-backend`) plus the agent worker (F3, D45 (1)). Saves the Idea, then each round as a Vision or Requirements version N+1 with the agent's prompt and answer; a person's direct edit is the same verb with a person as author. *Done:* five rounds give five versions with diffs; a direct edit and an agent draft both pass `expected_version`. *Tests:* scoped (model calls stubbed). *Rollback:* revert.
  - `F3-a2` **(new in v0.16, D45; stories 2)** **Vision and Requirements shapes.** Repo aadm-mcp (backend mode, `aadm-backend`). The Vision (outcome, users, measures, open questions; absorbs DM2-o1 to DM2-o3 and DM5-c) and the Requirements (BIS core four, REQ/AC/INV/THR items, fixtures, known gaps; absorbs DM2-b1, DM2-b2 and handoff checks 3, 4, 9, 10). *Done:* a REQ with no outcome warns; a `TBD` threshold blocks sign-off. *Tests:* scoped. *Rollback:* revert.
- Batch `F3-b` **Requirements are challenged, signed and handed to the roadmap** (new in v0.16, D45)
  - `F3-b1` **(new in v0.16, D45; stories 3, 4)** **`challenge`.** Repo aadm-mcp (backend mode, `aadm-backend`). Builds the relationship rows against the workspace's other Requirements (owns, feeds, must approve, cannot do) with `cross_surface_check` (`contract_fields`: producer = the owning contract, consumers = the contracts it feeds; rule R5), flags any second owner of the same data (two contracts that both write one field) as a blocking row, and runs `interrogate_plan` (`plan_kind: contract` or `prd`, confirmed by F3-b4) on the requirements text and `grill_questions` on each doctrine URI those findings cite (v0.16.1, rule R5; `pressure_test` takes no requirements text); each finding becomes a fix (version N+1) or a gate (owner, test, removal condition and date) on that version; both are write-once attachments on that version (D51); a fix is version N+1. *Done:* the Steve and Charles fixture gives the 6-row table, 0 blocking and the one two-writers gate; a seeded second owner is flagged. *Tests:* scoped. *Rollback:* revert.
  - `F3-b2` **(new in v0.16, D45; stories C1)** **`sign off`.** Repo aadm-mcp (backend mode, `aadm-backend`) route (human session only). A Decision on `(requirements id, version, sha256)`; in a customer workspace the customer member co-signs in their own words, as a second Decision on the same version and hash (story C1; CFG-LOCK-01, D8); the FDE use-case approval folds into this sign-off (D46). Absorbs DM2-b3, DM6-v1, DM6-v2. *Done:* a customer co-sign is stored with the customer's exact words; sign-off refused while a blocking finding is open; an agent credential gets `forbidden`. *Tests:* scoped. *Rollback:* revert.
  - `F3-b3` **(new in v0.16, D45; stories 5, 8)** **Handoff.** Repo aadm-mcp (backend mode, `aadm-backend`). `plan roadmap` from a signed version: finds the workspace's maintained Roadmap and proposes placement into existing stages, or creates one; handoff checks 1, 2 and 6 refuse (FIX-21); the version is recorded on the Roadmap. Absorbs DM6-v3. *Done:* an unsigned version is refused; a second requirements set lands in the same roadmap. *Tests:* scoped. *Rollback:* revert.
  - `F3-b4` **(new in v0.16, D45; stories 1, 2, 3, 4, 5; was F3-c1, moved into F3-b in v0.16.1 so no batch has 1 slice)** **Acceptance fixture: the Steve and Charles contract proves the loop.** Repo aadm-mcp (backend mode, `aadm-backend`). Replays Brian's Oct 26 session (seller buyer understanding; altitude EXECUTIVE, MANAGER, IC; Steve and Charles at Harsco) through the verbs: idea, vision, requirements with 5 gaps, 6 relationship rows, interrogation with 1 gate, placement into the maintained CR plan. *Done:* every step saved and versioned; the final roadmap version cites the signed requirements. *Tests:* scoped. *Rollback:* revert.
- `CF3` column check (typecheck both repos).

**Stage F4: Field runs in Slack (v0.17, D53: Slack stays thin; the 8 Slack slices of F4-a to F4-c are the cap; v0.18: F4-g is the core guard that lands before the public relay, not a Slack slice)** (Brian's Slack · aadm-core relay · aadm-backend)
- Batch `F4-g` **Core never runs open before Slack reaches it** (new in v0.18, D54: DM0-b4 and batch DM0-d moved out of Stage V, which is now the loop alone; they land here, before the public Slack relay of F4-a2, so core is guarded the day a public route reaches it; v0.15's DM0-d header: every request can be traced, every setting is checked, and core never runs open)
  - `DM0-b4` **(new in v0.14, D43; ARCH-21, DEPLOY-01)** Core reports its release and API version, and the core → backend hop has a contract window. Repo aadm-mcp. Files: ADAPT `src/index.ts` (the `/health` handler, `:631-656` at `78d93b8`), NEW `src/release-info.ts`, NEW scoped `/health` and hop tests. In both start modes, `/health` adds `release` (image tag and start mode) and `api_version`; core sends its API version on every forwarded call; the backend accepts N and N-1 and refuses N-2 with `rejected` / `api_version_unsupported`. *In:* DM0-b1, DM0-b2, §13d contract window. *Out:* the extended `/health` JSON and the hop version check. *Done:* `/health` in core mode and in backend mode returns `release` and `api_version` and no env value or secret; a core fixture at N-1 calling a backend at N succeeds; an N-2 fixture gets `rejected` / `api_version_unsupported`; the existing `/health` fields are unchanged. *Tests:* scoped `/health` tests and one hop fixture test. *Rollback:* revert the commit; `/health` keeps its old fields and the hop sends no version. **(v0.15, D44; ENV-05, OPS-01)** `/health` also shows `environment` in both start modes. It reads the CFG-TECH-25 setting and reports `unset` until DM0-d2 makes the setting required. The done-check adds that `/health` reports the environment and no other env value. *Keep (must not change):* the existing `/health` and `/health/auth` fields, the Railway healthcheck path, `tools/list`.
  - `DM0-d1` **(new in v0.15; CTX-01, CTX-03, CTX-04, OBS-01, PRIV-01; v0.19, D55: OBS-03, OBS-05, CTX-06)** Request IDs, JSON logs and metrics. Repo aadm-mcp.
    - *Files:* ADAPT `src/process-logger.ts` (plain-text `[ts] [CAT] msg` lines, `:33` at `78d93b8`); ADAPT the request handler in `src/index.ts` (`http.createServer`, `:604`); NEW `src/request-context.ts` (name UNCHECKED); NEW scoped tests.
    - Every request gets a server-made `request_id`, returned in `x-request-id`. An inbound `x-request-id` is kept only as `client_request_id`. The core → backend call carries the `request_id` (DM0-b2 forwards from Stage V).
    - Every log line becomes one JSON object with `ts`, `level`, `service`, `release`, `request_id`, route or tool, `workspace_id`, `actor_id`, `latency_ms` and the result `code`. (v0.19, D55) F1-a3 already mints the backend's `request_id` and logs each verb call in Stage V; this slice moves core's own request handler and `process-logger` onto the same context, writes one line per hop with its own `latency_ms` (OBS-05), and keeps per-verb counters, a latency histogram and a count per result family on an operator-only `GET /metrics` route (OBS-03; new, none exists today), never on a customer screen (FLD-04).
    - *In:* DM0-b4 (`release`). *Out:* the request context and the JSON logger.
    - *Done:* two requests get different `request_id`s in their headers and log lines; an inbound `x-request-id` never replaces the server's; secret-shaped strings fed through the logger (`aadm_`, `ak_`, `sk_`, `-----BEGIN`, a `Bearer` header, an env value) never appear in its output; `tools/list` is unchanged; (v0.19) after 10 scripted verb calls `GET /metrics` shows 10 for that verb, and the two hops of one call share one `request_id` in the log.
    - *Tests:* scoped logger and request-context tests. *Rollback:* revert the commit; logs go back to plain text.
    - *Keep (must not change):* MCP session IDs (`src/index.ts:357`), `decision_trace.correlation_id` (`src/decision-trace.ts:264`), every tool's output.
  - `DM0-d2` **(new in v0.15, D44 (7); ENV-01, ENV-02, ENV-03, ENV-05, IDN-04; AUTH-41, SEAM-14; the boot half of v0.14's DM2-a4)** Startup settings are checked, and core never runs open in production. Repo aadm-mcp.
    - *Files:* NEW `src/settings.ts` (name UNCHECKED; one schema per start mode); ADAPT the boot path in `src/index.ts` (today it checks only `PORT`, `:240-252` at `78d93b8`); ADAPT `verifyClerkConfiguration` in `src/mcp-auth.ts` (`:247-290`); NEW scoped boot tests.
    - Each start mode validates its settings against one schema at boot. A missing or malformed required value makes it exit non-zero with the setting named. The environment (CFG-TECH-25) is required.
    - With CFG-TECH-25 set to `prod` and `CLERK_SECRET_KEY` unset, core exits with that reason. Open mode runs only in dev with CFG-TECH-26 on. No secret has a default in code.
    - Refusal bodies stay as they are today (`unauthorized`) until DM2-a3 (Stage H), so this slice doesn't wait on the result codes.
    - **Coordinated (OPS-05). ASK, Brian's own step:** set the environment setting to `prod` on the Railway core service, and later on `aadm-backend`, before this commit deploys. Otherwise production boot fails by design.
    - *In:* DM0-b1 (backend start mode), DM0-b4. *Out:* the settings schema and the boot guard.
    - *Done:* a prod boot without the Clerk secret exits non-zero naming `CLERK_SECRET_KEY`; a dev boot with CFG-TECH-26 on runs open as today; CFG-TECH-26 on with CFG-TECH-25 set to `prod` exits non-zero; a missing CFG-TECH-25 exits non-zero naming it; a malformed `PORT` still fails as today; no secret has a default in `src/settings.ts`; `/health` reports the environment.
    - *Tests:* scoped boot tests, one per case. *Rollback:* revert the commit; boot checks only `PORT` again, and Brian keeps `CLERK_SECRET_KEY` set in prod.
    - *Keep (must not change):* the three credential kinds, the 2-minute positive cache, the Railway healthcheck path, today's refusal bodies.
  - `DM0-d3` **(new in v0.15; XO-01, XO-02, XO-05)** CORS on `/mcp` only for named origins. Repo aadm-mcp.
    - *Files:* ADAPT the CORS helper in `src/index.ts` (it echoes any `Origin`, otherwise `*`, `:153-164`, and is applied to `/mcp` with GET, POST and DELETE at `:194-221`, at `78d93b8`); ADAPT `src/settings.ts` (CFG-TECH-22); NEW scoped CORS tests.
    - In production, `/mcp` sends CORS headers only for origins on CFG-TECH-22. It never echoes an arbitrary `Origin` and never sends `*`. `/.well-known/*` and `/health` may still send `*`, without credentials. Responses that carry account data send `Cache-Control: no-store`.
    - **ASK:** Brian confirms the allowlist. Whether any browser-based MCP client calls mcp.aadm.io today is UNCHECKED; the slice lists the origins seen in Railway logs first.
    - *In:* DM0-d2. *Out:* the allowlist check.
    - *Done:* an allowlisted origin gets its own origin back; an unlisted origin gets no `Access-Control-Allow-Origin`; no `/mcp` response sends `*`; `/.well-known/oauth-protected-resource` still answers a browser preflight; a bearer-token call with no `Origin` (every MCP client the gap check found) works as before.
    - *Tests:* scoped CORS tests. *Rollback:* revert the commit.
    - *Keep:* bearer-only auth, `/health`, `/health/auth`, the OAuth metadata route.
- Batch `F4-a` **The Slack app is installed, verified and bound** (new in v0.16, D45)
  - `F4-a1` **(new in v0.16, D45; stories 1, 7)** **Slack app, install and OAuth** (D45 (2): Brian's own Slack in v1). Repo aadm-mcp (backend mode, `aadm-backend`) plus core. App manifest (scopes for channels, chat, commands, files), the OAuth redirect, the bot token held as a secret. **ASK, Brian's own step:** create the app and set the secrets; no bot sets or reads them. *Done:* install completes; the token is never logged. *Tests:* scoped. *Rollback:* uninstall the app.
  - `F4-a2` **(new in v0.16, D45; stories 1, 7)** **Events and interactivity relay.** Repo aadm-mcp (core relays, the backend acts; FIX-25 amended, D50). Verifies Slack's signature and timestamp, uses the Slack event id as `idempotency_key`, acknowledges within Slack's 3-second limit before any work (a 200 to Slack, then the relay), and the backend posts the result to the thread as its own message (v0.16.1). *Done:* a forged signature gets 401; one retry gives 1 version (RC-CONC-01). *Tests:* scoped. *Rollback:* unset the relay URL.
  - `F4-a3` **(new in v0.16, D45; stories 1, C1)** **Channel binding and user linking.** Repo aadm-mcp (backend mode, `aadm-backend`). `/field bind <workspace>` (owner only; one channel per workspace) and a one-time link that maps a Slack user to an AADM `actor_id`. *Done:* a second bind is refused; an unlinked user's "sign v3" is not a Decision. *Tests:* scoped. *Rollback:* unbind.
- Batch `F4-b` **The loop runs in threads, and only people decide** (new in v0.16, D45)
  - `F4-b1` **(new in v0.16, D45; stories 1, 7)** **Thread mapping** (§A6). Repo aadm-mcp (backend mode, `aadm-backend`). Saves `source_ref` (channel, thread ts) on the Idea, Roadmap and Slice. *Done:* replies route to the right artifact; a thread maps to one artifact. *Tests:* scoped. *Rollback:* revert.
  - `F4-b2` **(new in v0.16, D45; stories 1, 2, 4)** **Iterate and challenge in Slack.** Repo aadm-mcp (backend mode, `aadm-backend`) plus the agent worker. Thread replies call `iterate`; "check it" calls `challenge`; answers post the version summary and a shell diff link (RC-GUIDANCE-01: same next step as the shell). *Done:* three replies give three versions; the posted next step equals the API's. *Tests:* scoped. *Rollback:* revert.
  - `F4-b3` **(new in v0.16, D45; stories 6, 7, C1)** **Decisions from Slack** (D49 phrases). Repo aadm-mcp (backend mode, `aadm-backend`). Typed "sign vN", "go", "on plan", "drift", or the buttons, from a linked member with the role; stores the text as written; a later edit or delete of the Slack message doesn't change it. *Done:* a bot user's "go" is ignored; an edited message shows as edited, Decision unchanged. *Tests:* scoped. *Rollback:* revert.
- Batch `F4-c` **Reports come in and maps and prompts go out** (new in v0.16, D45)
  - `F4-c1` **(new in v0.16, D45; stories 7)** **Reports in Slack.** Repo aadm-mcp (backend mode, `aadm-backend`). A reply in a slice thread calls `submit report` then `judge`; the reply carries the suggested verdict, reasons and the next prompt as one code block. *Done:* the INV3 fixture report gives ON PLAN with its reasons. *Tests:* scoped. *Rollback:* revert.
  - `F4-c2` **(new in v0.16, D45; stories 6, 8)** **Posting back.** Repo aadm-mcp (backend mode, `aadm-backend`). On `map.rendered` and a ready Prompt, posts the PNG (file upload) and the prompt with a Go button. *Done:* one post per event (no duplicates on retry). *Tests:* scoped. *Rollback:* revert.
- `CF4` column check (typecheck both repos).

**Stage H: Hardened before anyone else depends on it (v0.17, D53)** (aadm-mcp · aadm-backend · aadm-standard)
  The Stage 0, F1 and F2 slices the demo did not need: the published standard and `delivery_map`'s rename, CI, the data inventory, the model guard, the migration lint, portability, core-saves-nothing proved, plan tags, the result-code module, export, the WinBench fixture, replan and the two parity tests. It runs after F4 (Slack) and before F5 (the web shell), because DM5-d2 and DM7-c1 read DM2-a3. Nothing here is deleted or narrowed; only moved.
- Batch `DM0-c` **The batching standard is an AADM standard** (new in v0.8; §13n; v0.17: DM0-c2 moved to Stage V and reads the draft; DM0-c1 publishes Part 1 here and DM0-c3 follows)
  - `DM0-c1` aadm-standard `standards/batching-standard.md` (Part 1 of `aadm-batching-standard-draft.md`), plus its row in `standards/README.md` next to `reuse-before-build.md` (`:73`). A named doc slice in aadm-standard. *In:* the draft's Part 1, §13n. *Out:* the published standard with rule IDs CS-H1 to CS-M2 and VL-1 to VL-6. *Done:* every rule ID listed in §13n appears exactly once as a heading or bullet; a grep for personal names, local paths and bot names finds 0 hits; the README row links the file. *Rollback:* revert the doc commit. *Keep:* every other standard and `GOVERNANCE.md`.
  - `DM0-c3` **(new in v0.14, D43; ARCH-20, ARCH-21, D42 (d))** The `delivery_map` tool says batch and stays compatible one version back. Repo aadm-mcp. Files: ADAPT `src/delivery-map.ts` (`:79`, `:114`, `:322` at `78d93b8`), ADAPT the `delivery_map` registration in `src/tools.ts`, ADAPT its tests. The input accepts `batches`/`batch_id` and still accepts `chunks`/`chunk_id`; the output emits both for one release (N-1), after which a later slice removes `chunks`. *In:* DM0-c2 (the batching standard loader), the existing `delivery_map` tests. *Out:* the dual-key schema and output. *Done:* a fixture with `chunks` and the same fixture with `batches` return byte-identical build order and contract spine; the output carries both `batches` and `chunks` with equal content; the tool's other fields are unchanged. *Tests:* scoped `delivery_map` tests. *Rollback:* revert the commit; the tool says `chunks` only, as today. *Keep (must not change):* the build-order algorithm, `chunk_branch_check`, `aadm://doctrine/chunk-branch`, every other tool's schema.
- Batch `DM0-e` **Every change is checked before it deploys** (new in v0.15, D44 (4); v0.17: in Stage H, after the demo; v0.16 said after DM0-d and before C0; TST-01, DEPLOY-01; AUTH-43)
  - `DM0-e1` **(new in v0.15)** aadm-mcp CI. Repo aadm-mcp.
    - *Files:* NEW `.github/workflows/ci.yml` (there is no `.github/workflows` at `78d93b8`).
    - The workflow runs on every pull request and every push to `dev`: `npm ci`, `npm run build`, the scoped test scripts that exist (names from `package.json`, UNCHECKED), a secret scan (tool UNCHECKED) and `npm audit --audit-level=high`. CI runs the build; the coder still runs scoped tests only, per the slice rules.
    - **ASK, Brian's own step (no prompt):** after he pushes, turn on Railway's wait-for-CI for the aadm-mcp `dev` core service, and for `aadm-backend` once DM0-b3 creates it. Then confirm that a red run holds the deploy.
    - *In:* DM0-d1 to DM0-d3 (F4-g, v0.18), so CI runs their tests; CI is in Stage H, so every Stage V, F3 and F4 slice runs its scoped tests by hand until then. *Out:* the workflow.
    - *Done (coder, local):* the workflow file passes a YAML and workflow lint; each listed command passes locally in order; a seeded fake key in a scratch file (not committed) is caught by the chosen secret scanner.
    - *Done (Brian, after his push and the Railway step):* the run on `dev` is green in under 10 minutes; a red run leaves the previous deploy live.
    - *Rollback:* delete the workflow; Brian turns wait-for-CI off.
    - *Keep:* `npm run go`, the column checks, `railway.toml`.
  - `DM0-e2` **(new in v0.15)** aadm-website CI. Repo aadm-website.
    - *Files:* NEW `.github/workflows/ci.yml`.
    - The workflow runs on every pull request and every push to `dev`: `npm ci`, `npm run build`, scoped tests (`test:clerk-smoke` and `test:member-tabs`, named in F5-a1 (was DM5-a5); whether they run headless in CI is UNCHECKED), a secret scan and `npm audit --audit-level=high`.
    - **ASK, Brian's own step (no prompt):** turn on Railway's wait-for-CI for the aadm-website `dev` service.
    - *In:* DM0-e1 (same scanner and audit level). *Out:* the workflow.
    - *Done:* the same local and post-push checks as DM0-e1.
    - *Rollback:* delete the workflow; Brian turns wait-for-CI off.
    - *Keep:* `astro.config.mjs`, `package.json` scripts, `railway.toml`.
- Batch `DM1-c` **The storage seam keeps Supabase out of the contracts** (new in v0.5; runs first in Stage 1 from v0.6, so every table is built through the ports; v0.17: DM1-c2, the ports, moved to Stage V, and the inventory, model guard and migration lint land here in Stage H)
  - `DM1-c1` Named doc slice: `docs/data-inventory.md` (§13a.1) plus a `data_class` label on every table, and (v0.14, D43, IDN-01) an "immutable fields" column per first-class table. *Done:* a test fails if any table lacks a `data_class`, and the inventory lists the internal `id` and the immutable fields of every first-class table.
  - `DM1-c3` Model guard: a check fails the build if an LLM SDK appears in either repo's dependencies or the plans API calls a host outside its allowlist. *Done:* adding `openai` to `package.json` in a scratch test fails the check.
  - `DM1-c4` Portable SQL migrations: `db/migrations/NNNN_name.sql` plus a small runner recording `schema_migrations(version, sha256, applied_at)`, a migration lint, and (v0.14, D43, ARCH-23) the prod-migration runbook `docs/runbooks/prod-migration.md` (§13q.5). *Done:* the runbook names the backup, the command, the parity check, the down step and the log location; an empty Postgres container migrates to head twice with the second run a no-op; a migration using `auth.`, `storage.`, `realtime.` or another Supabase-only object fails the lint (THR-33).
- Batch `DM1-e` **Any Postgres works, and only the backend touches it** (new in v0.6; v0.12 adds DM1-e3; v0.17: DM1-e4, the judgment registry, moved to Stage V)
  - `DM1-e1` Portability contract: the same contract suite runs against Supabase and a plain Postgres container. *Done:* both pass 100% (THR-33).
  - `DM1-e2` App-layer tenancy holds without RLS: the isolation suite runs on a Postgres with RLS disabled. *Done:* 0 cross-workspace rows (THR-12).
  - `DM1-e3` **(new in v0.12, D30)** Core saves nothing, proved: a build check fails if `PlanStore`, `BlobStore`, a Postgres driver or a storage SDK is reachable from the core-mode entry point, and a test boots core mode with no database or storage settings. *In:* DM1-c2, DM0-b2. *Out:* the import-graph check and the boot test. *Done:* importing `PlanStore` from a core-mode module fails the check; core boots and serves stateless tools with no database setting; every save tool returns `storage_unavailable` when the backend URL is unset; a run of 100 mixed calls leaves 0 rows, 0 files and only TTL cache keys written by core. *Tests:* the scoped import-graph check and one boot test with an in-memory Redis stand-in. *Rollback:* remove the check (the code paths are unchanged). *Keep:* the DM0-b2 forwarding and DM1-c2 ports.
  - `DM1-e5` **(new in v0.13.4, D39)** Every tool declares its plan tag: `code`, `field` or `shared` (plus a `free` flag), where it is registered; a build check fails on any untagged tool or unknown tag. Initial tags: the 8 FDE tools `field`; the 15 planning tools (`prd_outline`, `delivery_map`, `slice_issues`, `interrogate_plan`, `journey_map` and `predone_review`; `replan_check`, `grill_questions`, `pressure_test`, `user_flow`, `ux_surface_pass`, `cross_surface_check`, `journey_trace`, `journey_attest` and `gap_score`) `shared`, each with `free: false` (D40); the rest per the §20 split list (Blueprint-proposed until Brian confirms). Filtering stays off until DM6-p3, so today's tool list is unchanged. *In:* DM1-e4. *Out:* the tag field and the build check. *Done:* removing one tool's tag fails the build naming that tool; setting `free: true` on a `shared` tool fails the build naming that tool (D40); `tools/list` for every session is byte-identical to before this slice. **(v0.15, D44 (3); CAP-01, CAP-02; AUTH-44, AUTH-54)** Each tool also declares one capability from the closed list of 9 (§10) and one side-effect class (`read`, `write`, `external` or `irreversible`). A tool with no class counts as `irreversible` and fails the build with the tool named; an unknown capability also fails it. Every stateless tool is `tool.run` / `read`. Plans-API routes declare the same two fields in their contract entries (API-01) as F1-a3 (was DM2-a1) adds them. Both fields stay internal, outside the MCP schema. *Done (added):* removing one tool's capability or side-effect class fails the build naming that tool; an unknown capability string fails it; `tools/list` stays byte-identical. *Tests:* the build check and a `tools/list` snapshot. *Rollback:* make the check a warning. *Keep:* every tool's name, schema and annotations.
- Batch `F1-r` **Every refusal has one result code, and org keys are bound safely** (v0.16.1: DM6-g6 moved to F2-d) (new in v0.16, D45)
  - `DM2-a3` **(new in v0.14, D43; TEN-07, CONTRACT-01, ARCH-25)** One result-code contract for core and backend. Repo aadm-mcp. Files: NEW `src/result-codes.ts`, ADAPT `src/mcp-auth.ts` (refusal bodies at `:422-423`, `:531`, `:546`, `:582`, `:608`, `:624` at `78d93b8`), ADAPT scoped tests. The module holds **the 10 result families** (v0.15, D44 (2): the 8 TEN-07 families plus `rate_limited` and `internal_error`) and their sub-codes, as listed in §10. **(v0.15; RES-01 to RES-04, TST-04)** Every refusal body carries `code`, `sub_code`, `retryable` (set per sub-code in the module), `request_id` (from DM0-d1) and a message for people. `rate_limited` adds `retry_after`. The module exports the response schemas for each `api_version`, and the contract tests use them (TST-04, F5-a3 (was DM5-b4)). Core's sign-in refusal becomes `error: "unauthenticated"`, keeps status 401 and the `WWW-Authenticate` header, and carries `legacy_error: "unauthorized"` for one release (N-1). *In:* DM0-d1 (`request_id`), F1-a3 (was DM2-a1, DM2-a2), §10 result codes. *Out:* the shared module, the per-version schema export and the changed refusal bodies. *Done:* every refusal core returns uses a family from the module; a search finds 0 `"unauthorized"` error literals outside the legacy alias; one contract test per family passes, for all 10 (v0.15); every refusal carries `retryable` and `request_id`; status codes and headers are unchanged; (pressure_test RC-06, RC-02) a shape-drift fixture with an unknown family or sub-code fails the contract test loudly, and an empty or partial refusal body is never sent; (v0.15, RC-06) the fixtures include one `rate_limited` body (retryable, with `retry_after`) and one `internal_error` body (not retryable), and a client stub that branches on the message text fails them; the exported schema for the current `api_version` matches the bodies sent. *Tests:* scoped auth and contract tests. *Rollback:* revert the commit; refusals say `unauthorized` again. *Keep (must not change):* HTTP status codes, the `WWW-Authenticate` header, the three credential kinds, the 2-minute positive cache.
  - `DM2-a4` **(new in v0.14, D43; IDN-04, IDN-02, D4; narrowed in v0.15, D44 (7): the boot guard moved to DM0-d2)** Org-owned API keys are refused. Repo aadm-mcp. Files: ADAPT `src/mcp-auth.ts` (the `ak_` path, `:596-620` at `78d93b8`) and its scoped tests. An `ak_` key whose subject is not a `user_` id is refused with `unauthenticated`, because Clerk Organizations are off (D4). *In:* DM0-d2 (the boot guard and settings), DM2-a3 (result codes). *Out:* the subject check. *Done:* an org-subject API key fixture gets 401 `unauthenticated` with `retryable: false` and a `request_id`; a user-subject key still works; DM0-d2's boot tests still pass. *Tests:* scoped auth tests. *Rollback:* revert the commit; org-subject keys are accepted as today. *Keep (must not change):* the three credential kinds, `/health/auth`'s report shape, the 2-minute positive cache, DM0-d2's boot guard.
- Batch `H-a` **Nothing crosses workspaces, a workspace can leave whole, and the second fixture comes in** (new in v0.17, D53: F1-b2 and F2-a3; v0.18, D54: F1-b1 moved in from Stage V, because the demo has one person and one workspace)
  - `F1-b2` **(new in v0.16, D45; stories all (foundation))** **Workspace export and import** (the fallback, §11). Repo aadm-mcp (backend mode, `aadm-backend`). One file with every artifact version, link and Decision; import into an empty workspace. Absorbs DM2-c3. *Done:* round trip equal by `cutover_parity_check`; export carries no secret. *Tests:* scoped. *Rollback:* revert.
  - `F2-a3` **(new in v0.16, D45; stories 5, 6, 8)** **Second fixture.** Repo aadm-mcp (backend mode, `aadm-backend`). Imports the WinBench fixture (Blueprint's `/workspace/blueprint/winbench/`; **ASK Blueprint for a repo copy before this slice starts, §20**: 67 prompts, 16 map PNGs as Map versions, `VISION_LOCKED_2026-10-13.md` as a Vision, the column plans as a Roadmap). The Forge plan (442 slices) stays a later stress fixture. *Done:* counts equal the source files; a parity report lists anything skipped. *Tests:* scoped. *Rollback:* delete the fixture workspace.
  - `F1-b1` **(new in v0.16, D45; stories all (foundation))** **Tenancy and secrets suite.** Repo aadm-mcp (backend mode, `aadm-backend`). The isolation suite over every verb (two workspaces, two members, one shared FDE), and the FIX-02/FIX-18 reject filter on every artifact body, Slack paste and report. *Done:* 0 cross-workspace rows over all 12 verbs; each seeded key shape is refused with `rejected`/`evidence_rejected` and never logged. *Tests:* scoped. *Rollback:* revert.
- Batch `H-b` **The roadmap replans itself, and every judgment and map matches core** (new in v0.17, D53: F2-d2 needs the F3-b2 sign-off, so it sits here after F3; DM6-g6 and F2-e2 are parity tests)
  - `F2-d2` **(new in v0.16, D45; stories 8)** **`replan`.** Repo aadm-mcp (backend mode, `aadm-backend`). On a sign-off Decision on Requirements vN+1, runs `replan_check` with the item diff and the linked slices' files, and saves the result on the Roadmap (§4.3). Absorbs DM7-a1. *Done:* changing one requirement flags exactly its slices; `field_next_slice` serves none of them. *Tests:* scoped. *Rollback:* revert.
  - `DM6-g6` **(new in v0.13.4, D38, D39; FIX-33; moved from F1-r to F2-d and narrowed in v0.16.1; to H-b in v0.17, after the demo)** Field judgments equal the core judges' output. *In:* DM1-e4, F2-b1 (prompt lint), F2-d1 (verdict), F2-d2 (`replan_check`), and the `batch` verb's batching-standard findings (F2-b0, DM0-c2). *Out:* a parity test and the import-graph check extended to every `field`-tagged judge. *Done:* for seeded workspaces, every judgment the backend stores (prompt-lint findings, batching-standard findings, suggested verdicts and replan results) equals the core judge's output for the same input, with `judged_by` set (`policy_revision` = `preset:standard`, rule R2); no backend-mode module defines that logic. The later-stage judgments (Speed Layer gaps, risk scores and bands, readiness gaps, use-case ready results, phase health) and the per-preset run are added to this test by DM6-s1, DM6-d1, DM6-d2 and DM1-f1 when they land. *Tests:* the parity test and the check. *Rollback:* none needed (tests only). *Keep:* each judge's output shape.
  - `F2-e2` **(new in v0.16, D45; stories 8)** **Map parity.** Repo aadm-mcp (backend mode, `aadm-backend`). Compares the F2-e1 render for the PRD fixture with the repo map `docs/aadm-delivery-maps-map.png` at the commit that lands v0.17 (rendered by `docs/scripts/render_delivery_map.py`, the J1 reference), by structure, not pixels (v0.17, §A16): the same stages, batches and cards in the same order, the same status per card and the same You are here. *Done:* 0 differences in cards, statuses, order or marker; a pixel diff is not run. *Tests:* scoped. *Rollback:* revert.
- `CH` column check (typecheck both repos).

**Stage F5: The web shell browses the same workspace: map, evidence and co-sign (v0.17, D53: editing moved to F8)** (aadm-website (aadm-web) · aadm-backend)
- Batch `DM5-d` **The website's settings and errors are checked in code** (new in v0.15, D44; runs first in Stage F5, before the first page calls the backend, so every F5 and F8 page uses it; letter after DM5-c, as with DM1-c)
  - `DM5-d1` **(new in v0.15; ENV-03, ENV-05, ENV-06, XO-04, XO-05)** The website's settings schema. Repo aadm-website.
    - *Files:* ADAPT `astro.config.mjs` (adds `env.schema`; there is none at `dba0c8e`); ADAPT `src/middleware.ts` (it reads `import.meta.env` ad hoc, `:25-31`); ADAPT `src/pages/health.ts`; NEW scoped tests.
    - Every setting is declared once. Only `PUBLIC_*` values reach the client: the Clerk publishable key, public URLs and the release. The backend URL and every secret are server-only. The environment (CFG-TECH-25) is required, and no secret has a default.
    - Pages and endpoints with account or workspace data send `Cache-Control: no-store`. `security.checkOrigin` stays on, and no route sends CORS headers.
    - **Coordinated (OPS-05). ASK, Brian's own step:** set the environment setting on the aadm-website Railway service before this commit deploys.
    - *In:* DM0-e2 (CI), the current `src/middleware.ts`. *Out:* the schema, plus `environment` in `/health`.
    - *Done:* a missing required server setting fails the build or startup with the setting named; the client bundle contains no non-`PUBLIC_` setting name or value; `/health` reports the environment and stays 200; member pages send `no-store`; no response has `Access-Control-Allow-Origin`.
    - *Tests:* scoped config and header tests. *Rollback:* revert the commit.
    - *Keep:* the other `astro.config.mjs` settings, the Clerk integration, `/health`'s path and 200 status, `docs/INVARIANTS.md`.
  - `DM5-d2` **(new in v0.15; CTX-05, RES-04, RES-05, RUN-03, OPS-08, OPS-09, PRIV-02)** Website request IDs and error reporting. Repo aadm-website.
    - *Files:* NEW `src/lib/backend-client.ts` (name UNCHECKED; the website's one server-side caller of the plans API); NEW `src/pages/api/client-errors.ts` (name UNCHECKED); NEW error-state component; NEW scoped tests.
    - Every backend call sends `request_id`, `api_version` and `release`, and has a timeout. Every response is parsed with a schema. A malformed body or an unknown code shows a visible error with the backend's `request_id`, never an empty state. The client decides from `code`, `sub_code` and `retryable` only.
    - Each of the 10 families has its own screen state. `rate_limited` shows when to retry. `internal_error` shows the `request_id` and never says "try again later". `indeterminate` shows "outcome unknown, checking".
    - Browser errors are posted to the website's server log with the release and `request_id`, and carry no token, invite path, email or workspace name.
    - *In:* DM2-a3 (the 10 families and their schemas), DM5-d1. *Out:* the client, the error states and the error-report route.
    - *Done:* a fixture refusal for each of the 10 families shows its own state with the `request_id`; a malformed body shows the error state, not an empty list; a read timeout shows the unavailable state; a write timeout shows `indeterminate`, never done or retryable; a browser error report containing an invite path and an email reaches the log with both redacted.
    - *Tests:* scoped client and error-report tests. *Rollback:* revert the commit.
    - *Keep:* the member pages and their redirects, `/health`.
- Batch `F5-a` **Workspaces open into two areas you can browse** (new in v0.16, D45)
  - `F5-a1` **(new in v0.16, D45; stories C2)** **Shell navigation** (§A10). Repo aadm-website (`aadm-web`, the web shell). /field/main lists workspaces ("No workspace yet" state); a workspace opens with two areas. No business logic: every value comes from the backend. Absorbs DM5-a1, DM5-a5, DM6-h5 to DM6-h7, DM6-i1, DM6-i2, DM6-g5 (waiting on you). *Design first:* `user_flow` with a "what the person has after this" sentence per move, and `ux_surface_pass`. *Done:* each area opens from the list; counts equal the API's. *Tests:* scoped. *Rollback:* revert.
  - `F5-a2` **(new in v0.16, D45; stories 2, 3, 4)** **Requirements area views.** Repo aadm-website (`aadm-web`, the web shell). Ideas list; Idea, Vision and Requirements with version picker and diff; Relationships; Interrogation; Sign-off. Absorbs DM5-a2. *Done:* every saved version and attachment is reachable. *Tests:* scoped. *Rollback:* revert.
  - `F5-a3` **(new in v0.16, D45; stories 8, C2)** **Roadmap area views.** Repo aadm-website (`aadm-web`, the web shell). Map with You are here; card drawer (slice, done-check, prompt versions, runs, evidence, verdicts); history and compare; prompt library. A member with the viewer role (a customer executive, story C2) sees the map, You are here and slice status read-only. (v0.19, D55; OBS-04, FLD-02, FLD-04) The card drawer shows that slice's measures with the answer (time from Go to the confirmed verdict; the prompt template's DRIFT rate; the batch's slices done this week), read from a backend read model over version timestamps; there is no dashboard page, and the map still leads with You are here and the next prompt. Absorbs DM5-b1 to DM5-b4. *Done:* drawer within THR-5; comparing two roadmap versions shows the cards that moved; API version shown, N-1 compatible. *Tests:* scoped. *Rollback:* revert.
- `CF5` column check (typecheck both repos).

**Stage F6: Safe to depend on** (aadm-mcp · aadm-backend)
- Batch `DM7-c` **Operators can stop and recover the service** (new in v0.15, D44 (6); after F5 and before CF6 (v0.16.1; v0.16 said after DM7-b, a later stage); it switches `go` (F2-c1) and `field_next_slice` (F2-c2); OPS-02, OPS-04, OPS-06, OPS-07)
  - `DM7-c1` **(new in v0.15; OPS-02, OPS-04)** `/ready` and the operator switches. Repo aadm-mcp.
    - *Files:* ADAPT `src/index.ts` (routes); ADAPT `src/settings.ts` (CFG-TECH-23, CFG-TECH-24); ADAPT the `field_next_slice` handler (F2-c2; rule R1) and the Go route (F2-c1); ADAPT `src/result-codes.ts` (adds `operator_disabled` under `forbidden`); NEW scoped tests.
    - `/health` stays liveness only. A new `/ready` reports whether config is valid, the database is reachable (backend mode), migrations are at the expected version (backend mode) and Clerk is reachable. It holds no secret or env value.
    - CFG-TECH-23 hides the named tools from `tools/list` and refuses calls to them. CFG-TECH-24 stops Go and `field_next_slice`. Both refusals are `forbidden` / `operator_disabled`.
    - **ASK, Brian's own step:** point the Railway healthcheck at `/ready` once it is green.
    - *In:* DM0-d2, DM2-a3, F2-c1 and F2-c2 (were DM3-a2, DM3-a3), DM1-c4. *Out:* `/ready` and the two switches.
    - *Done:* `/ready` returns 503 naming the failing check when the database is down, and 200 when every check passes; `/health` stays 200 either way; a tool on CFG-TECH-23 is missing from `tools/list`, and a direct call gets `forbidden` / `operator_disabled`; with CFG-TECH-24 on, Go and `next_slice` are refused and every read still works; each switch needs only a setting change and a restart.
    - *Tests:* scoped route and switch tests. *Rollback:* revert the commit.
    - *Keep:* `/health`'s fields and path, the CFG-TECH-03 rollback.
  - `DM7-c2` **(new in v0.15, D44 (6); OPS-06, OPS-07)** Recovery runbooks and a backup restore drill. A named doc slice in aadm-mcp, plus Brian's drill.
    - *Files:* NEW pages in `docs/runbooks/`, next to `prod-migration.md` (DM1-c4): website rollback, backend rollback or forward fix, failed migration, secret rotation, stuck slice, failed outside write, and database restore. v1 has no AADM-side outside write (D44 (1)), so that page is a template. Each page names the trigger, the steps, the check and the log location.
    - Backups follow CFG-TECH-19 to CFG-TECH-21: daily, kept 30 days, and a restore drilled before C7, then quarterly.
    - **ASK, Brian's own step:** confirm that the Supabase plan's backup frequency and retention (UNCHECKED) meet CFG-TECH-19 and CFG-TECH-20, or add an operator backup job. Then run the first restore drill into a scratch database.
    - *In:* DM1-c4, the existing core tool `cutover_parity_check` (DM7-a4 reuses it in F6-r, after this batch), DM7-c1. *Out:* the runbooks and the drill record.
    - *Done:* each of the 7 runbooks exists with its 4 parts; the drill restores the latest backup into a scratch Postgres, and `cutover_parity_check` shows 0 mismatches by count and hash; the drill date and the next due date are recorded; the runbook marks an untested backup as not counting.
    - *Rollback:* revert the docs.
    - *Keep:* `prod-migration.md`.
- Batch `F6-r` **Old data is cleaned up safely and hosts can be switched** (new in v0.16, D45)
  - `DM7-a2` Retention jobs, run by `aadm-backend` (D30; SEAM-08: idempotent, retried, export taken before hard delete). (v0.14, D43, CQRS-04) Archive and delete go through each entity's command service, never a second writer; the worker claims items with the ADR 005 TEN-04 claim function and handles each in its own `withWorkspaceTx`. *Done:* on dev data with an injected clock, a plan archives at CFG-RET-01 and is deleted CFG-RET-02 after close, for each preset (Standard alone until DM1-f1 lands, rule R2). **(v0.15, D44 (5); DATA-03, DATA-04, AUD-01, AUD-02; AUTH-29)** A workspace hard delete also removes its audit and event rows, after the export that holds them. The job runs as the DATA-03 privileged role, the only role with DELETE on event tables. In the same transaction it writes one `workspace_deletion_tombstone` row (§8). *Done (added):* after a hard delete, 0 rows with that `workspace_id` remain in any workspace table, the event tables included; the export taken first holds the event rows, and its SHA-256 equals the tombstone's; the tombstone holds no name, email, content or evidence value; `aadm_app` still can't UPDATE or DELETE an event row; a rerun is a no-op (SEAM-08).
  - `DM7-a4` **(new in v0.6)** Migrate-between-hosts runbook check: export from Supabase, import into a plain Postgres, run `cutover_parity_check`. *Done:* 0 mismatches by count and hash per entity (THR-33), with no soak period.
- `CF6` column check (typecheck both repos. Mode (a) ships here).

**Stage F8: The web shell edits everything, and people buy, invite and land (later; v0.17, D53)** (aadm-website (aadm-web) · aadm-backend)
  D45 (3), full editing on the web, stands; D53 moves it after F6 with invites, billing, preferences and the post-sign-in landing, so the Field core ships the map, the evidence view and co-sign first (§A16). The slices and batches are unchanged from v0.16.1.
- Batch `F5-b` **Everything can be edited on the web, through the same verbs** (new in v0.16, D45; v0.17, D53: moved to Stage F8, after F6)
  - `F5-b1` **(new in v0.16, D45; stories 2)** **Full editing: requirements** (D45 (3)). Repo aadm-website (`aadm-web`, the web shell). Inline edit of Idea, Vision and Requirements items, fixtures and gaps; save calls `iterate` with a person as author and `expected_version`; a conflict shows both versions. No logic in the shell. *Done:* the same edit from Slack and from the web gives identical version bodies; a stale save shows `conflict`. *Tests:* scoped. *Rollback:* revert.
  - `F5-b2` **(new in v0.16, D45; stories 5)** **Full editing: roadmap.** Repo aadm-website (`aadm-web`, the web shell). Add, move, split, merge and edit stages, batches and slices (done-check, files, tests, rollback, keep); save calls `batch` with a person as author; the batching-standard findings from the core judge are shown, never computed in the shell. *Done:* an edit gives Roadmap vN+1; a dependency cycle is refused by the backend. *Tests:* scoped. *Rollback:* revert.
  - `F5-b3` **(new in v0.16, D45; stories 6)** **Full editing: prompts.** Repo aadm-website (`aadm-web`, the web shell). Edit a slice's prompt, its required evidence, and library templates and verbatim lines; save calls `write prompt`; lint shown from the backend. *Done:* editing a Go'd prompt clears Go; a blocking lint keeps it draft. *Tests:* scoped. *Rollback:* revert.
  - `F5-b4` **(new in v0.16, D45; stories all (one voice))** **Shell parity and guard.** Repo aadm-website (`aadm-web`, the web shell). A static guard forbids status, verdict, color or lint logic in the shell (RC-AUTH-01), and a parity test runs the same edits through Slack, web and MCP. *Done:* 0 guard hits; identical versions from all three clients. *Tests:* scoped. *Rollback:* revert.
- Batch `F5-s` **People can be invited to a workspace, each user's plan is known, and last opened is remembered** (v0.16.1: DM6-c3 and DM6-a5 moved here) (new in v0.16, D45; v0.17: Stage F8)
  - `DM6-a2` Our own invite flow: the `workspace_invite` table (RLS and an explicit grant to `aadm_app`), create, copy and revoke, and the accept page for a signed-in Clerk user, which assigns the role. *Done:* an accepted `coder` invitee can call only `next_slice` and `report`, in that workspace only; an expired (THR-14), revoked, reused or wrong-email invite is refused; the raw token is in no table or log; the 11th failed try gets 429 (THR-16); and (v0.14) create, accept and revoke each write one `workspace_event` row in the same transaction.
  - `DM6-a3` **(new in v0.5)** Members page: change role and remove a member. *Done:* removal revokes that member's credential bindings for the workspace in the same transaction, and removing or demoting the last owner is refused (THR-17); (v0.14) each removal, role change and revoked binding writes one `workspace_event` row in the same transaction.
  - `DM6-c3` **(new in v0.12, D30)** The `fde_tools` check, the billing webhooks and the entitlement table, in the backend. **(v0.16.1)** Builds the `fde_tools` check (D16; D43: against the calling user's own plan, never the workspace), which v0.16 placed in DM6-c1 (6A), and moves from F5-l to F5-s so DM6-p can read it. Core relays `POST /webhooks/clerk` raw, with its signature headers, to the backend's private webhook route; the backend verifies the signature and upserts `entitlement` (keyed by `actor_id`, per user, v0.14) through the entitlement command service, the one write path for that fact (v0.14, D43, ARCH-07, CQRS-04), never by a direct repository call. Core's `fde_tools` pre-check reads Clerk Billing with a TTL cache (CFG-TECH-17) and never reads the table. *In:* DM0-b2, DM1-c4, F1-a2 (`actor`). *Out:* the relay, the webhook route and `entitlement` rows. *Done:* a signed test event adds a row and a replay changes nothing; a bad signature is refused by the backend; core's relay holds no secret and writes nothing; a user whose plan lapses loses `fde_tools` in the backend at once and in core within the CFG-TECH-17 TTL. *Tests:* scoped webhook-route tests (signature, replay, lapse) and a relay test. *Rollback:* remove the route; the backend falls back to reading Clerk directly (D-C). *Keep:* the `fde_tools` check result shape (read by DM6-c1 later).
  - `DM6-a5` **(new in v0.13.3, D37)** Per-member `last_opened_at` on `workspace_member` (§8): an additive nullable column through DM1-c4; the backend sets it when a person opens a workspace in a web session (F5-a1's switch or open); the workspace list returns the caller's own value and can sort by it. *In:* F1-a2 (was DM6-a1), DM1-c4. (Moved from F7-p to F5-s in v0.16.1.) *Out:* the column and the sorted list. *Done:* open B then A → the sorted list puts A first; one member's open changes only their own row; an agent credential call changes 0 rows; no member sees another member's value. *Tests:* scoped backend tests. *Rollback:* migration down; the list falls back to name order. *Keep:* the unique key, roles, RLS and grants. *Unblocks:* F5-a1 (was DM6-i1) (UXF-09).
- Batch `DM6-p` **AADM Field is a product you can buy and use** (new in v0.13, D33, D35; after F5-s, because it reuses DM6-c3's `fde_tools` check and webhook-fed table (v0.16.1; v0.16 said after DM6-c, a later stage); §13q; v0.17: Stage F8)
  - `DM6-p1` Clerk Billing and Stripe setup for AADM Field (D36). (Owner BRIAN: a configure-only step he runs in the Clerk dashboard and Stripe; no prompt; no secrets or prices in the PRD; bots change no billing or money settings.) Plans with customer-facing labels Free, Code, Field and Code + Field on the unchanged keys `free`, `mcp`, `fde`, `mcp_fde`. AADM Field is a separate product, replicated from AADM Code at the same price as AADM Code (the number is UNCHECKED here; Brian reads it in this step). Code + Field is priced 15% less than the Code and Field prices added together. The trial covers both Code and Field (length set by Brian). Features: `mcp_access` and `plan_tools` on `mcp` and `mcp_fde`; `fde_tools`, `terrain` and `customer_workspaces` on `fde` and `mcp_fde`; the trial grants both sets; the proposed `firm_layer` and `white_label` where Brian chooses (open, §20). Enterprise invoicing stays as D-B. *In:* D-A to D-E, D33, D36. *Out:* the products, plans, prices, trial and features in Clerk Billing and Stripe. *Done:* Brian reports the plan and feature keys exactly as listed, that Field's price equals Code's, that the bundle is 85% of their sum, and that a trial user holds both feature sets (values he sets himself). *Rollback:* archive the new plans and features in Clerk and the new prices in Stripe. *Keep:* existing users' plans.
  - `DM6-p2` Code and/or Field entitlements as separate subscriptions (D36): a pure matrix from features to what each plan sees on the site, in the web app and in the MCP tool list (§13q.2), plus the tool map, read from each tool's plan tag (`code`, `field`, `shared`, plus `free`; DM1-e5, FIX-34) rather than kept as a second list, used by core (pre-check) and the backend (re-check); sign-up, adding the second product, downgrade and trial-end paths. *In:* DM6-p1, DM6-c3 (the check and the table; v0.16.1). *Out:* the matrix, the tool map and the member-area nav gate. *Done:* 6 seeded users (Free, trial, expired trial, Code, Field, Code + Field) see exactly their row in all three places; a Field-only user gets no Code-only screen or tool and a Code-only user no Field screen or tool; the seeded Free user's tool row holds none of the 15 `shared` planning tools, and the trial, Code, Field and Code + Field rows hold all 15 (D40); code reads features, never plan keys (D-A); cancelling one of two subscriptions hides only that product's screens and tools on the next request and keeps the workspace's data, read-only, per §11 export; an upgrade or trial end shows within the CFG-TECH-17 cache. *Tests:* scoped matrix and gate tests. *Rollback:* the gate falls back to `fde_tools` alone. *Keep:* the Code member area.
  - `DM6-p3` MCP tools by subscription on the shared endpoint (D36, FIX-32): `aadm-core` filters `tools/list` from the per-tool plan tags (DM1-e5, FIX-34) through DM6-p2's map: the Field tools, **including the 8 existing FDE tools, which move behind `fde_tools` in this slice** (`invariant_register`, `lessons_register`, `run_state_control`, `tenant_isolation_check`, `cutover_parity_check`, `agent_op_contract_check`, `projection_budget`, `fanout_guide`), only for sessions with `fde_tools`; the Code tools only for sessions with `mcp_access`; the free tools for Free. A call to an unlisted tool returns `entitlement_required`; Field tools stay stateless in core and save through `aadm-backend`, which re-checks. On a feature change core sends that session `notifications/tools/list_changed` (§13q.4). **Breaking change:** today every plan sees the 8 FDE tools; after this slice Code-only and Free users no longer see or call them. **Hard cutover (D36 item 8, v0.13.2):** existing Code-only and Free users lose the 8 FDE tools on this commit; no grace period, no legacy access, no dual listing. **(v0.13.5, D40) Second breaking change:** today Free users can list and call the 15 `shared` planning tools (no plan check at aadm-mcp `main` at `302e28fa68` (merge of PR #111, Oct 24, 2026, 9:57 PM ET; read-only on GitHub, Oct 25, ~6:35 PM ET)); this slice removes them for Free. **Hard cutover (D40a, Brian, Oct 25, 2026, 6:38 PM ET: "Hard cutover on the DM6-p3 commit, same as the FDE tools"):** the 15 `shared` planning tools leave Free on this commit, the same commit as the 8 FDE tools; no grace period, no legacy access, no dual listing. The other tools FIX-32 removes from Free leave on this commit too (default that follows from D40a, not a separate decision). *Confirm first:* from the repo, whether the MCP SDK (`^1.29.0`) supports per-session `tools/list` filtering and a per-session `list_changed` notification (UNCHECKED). *In:* DM6-p2, DM0-b2, DM1-e3. *Out:* the filtered list, the call guard and the list-changed signal. *Done:* a Field session lists the Field tools, including the 8 FDE tools, and no Code-only tool; a Code-only session lists no Field tool; on this commit a Free session lists none of the 15 `shared` planning tools and gets `entitlement_required` calling any of them, with no grace window (D40, D40a); a hidden tool called by name gets `entitlement_required`; after an upgrade the new list shows within CFG-TECH-17 and `list_changed` is sent; DM1-e3's no-save check still passes; hard cutover: on this commit an existing Code-only or Free session lists none of the 8 FDE tools and gets `entitlement_required` calling any of them, with no grace window, legacy flag or dual listing. *Tests:* scoped list and call tests per plan. *Rollback:* the filter falls back to the `fde_tools` check alone (DM6-p2's fallback), with the list and the call guard still matched (FIX-32); reverting the commit re-opens the 8 FDE tools to every plan and needs Brian's say-so. *Keep:* tool schemas.
  - `DM6-p4` Tool lists by subscription, proved; AADM Code otherwise unchanged (D36, FIX-32). *In:* DM6-p3, the pre-v0.13 `tools/list` snapshot, DM6-p2's tool map. *Out:* a snapshot and plan-matrix test. *Done:* for 6 seeded sessions: **Code-only** `tools/list` equals the pre-v0.13 snapshot minus exactly the tools the map marks Field-only (at least the 8 FDE tools), every remaining tool byte for byte (names, schemas, annotations), and lists no Field tool; a Code-only user who could call the 8 FDE tools before the cutover commit loses them on that commit, with no grace window (D36 item 8, hard cutover); **Field-only** lists the Field tools, including the 8 FDE tools, and the 6 `shared` judgment tools (`prd_outline`, `delivery_map`, `slice_issues`, `interrogate_plan`, `journey_map` and `predone_review`; D38), and no Code-only tool; (v0.13.4, FIX-34) for a seeded **Code-only** and a seeded **Free** user, every tool tagged `field` is absent from `tools/list` and returns `entitlement_required` when called by name, and every `shared` tool is listed for Code, Field and Code + Field; **Code + Field** lists both; **Free** lists only the free tools and (v0.13.5, D40) none of the 15 `shared` planning tools, each of which returns `entitlement_required` when the seeded Free user calls it by name; the trial lists all 15; a **trial** user lists both; an **expired trial** lists the Free set within CFG-TECH-17. Expected lists come from the tool map, not literals in the test. For each session, every unlisted tool called by name returns `entitlement_required`; a run of 100 Code tool calls writes 0 rows and 0 files and only TTL cache keys (FIX-27). *Tests:* the snapshot, plan-matrix and no-save tests. *Rollback:* none needed (a test only). *Keep:* every Code tool's schema.
- Batch `F5-l` **Preferences are remembered, and Field users sign in and land in the right place** (v0.16.1: DM6-a4 moved here, DM6-c3 moved to F5-s) (new in v0.16, D45; v0.17: Stage F8)
  - `DM6-a4` **(new in v0.13.3, D37)** User preferences in `aadm-backend` (moved from F7-p to F5-l in v0.16.1, because DM6-h2 and DM6-h9 store a preference): the `user_pref` table (§8) through DM1-c4 migrations and `PlanStore`, plus people-only plans API routes to read and set the signed-in user's `landing_product` and `setup_card_dismissed` (web session only, FIX-25). *In:* DM1-c4, the backend's Clerk session check (§13d). *Out:* the table and 2 routes. *Done:* user A sets `landing_product = field` and reads it back; user B reads 0 of A's rows; a value outside the enum is refused; an agent credential (`ak_` key or M2M token) gets 403 on both routes; core still opens 0 database connections (FIX-27). *Tests:* scoped backend route tests. *Rollback:* migration down (new table; the chooser then shows on every trial sign-in). *Keep:* `workspace_member`, the entitlement table and every existing route. *Unblocks:* DM6-h2 (UXF-03), DM6-h9 (UXF-11).
  - `DM6-h1` **(new in v0.13.3, D37; UXF-02)** Sign-in lands you by plan: the DM6-p2 matrix read in the post-sign-in hop (only the bare-/member fallback changes). *Design first:* the confirmed `user_flow` (Oct 25, ~6:15 PM ET) and `ux_surface_pass` saved in `/workspace/blueprint/aadm/ux-field-post-login.md` v0.2. *In:* DM6-p2, F5-a1 (was DM5-a5). *Out:* the landing rule. *Done:* the 6 seeded users (Free, trial, expired trial, Code, Field, Code + Field) land per D37, with trial on the chooser (stub until DM6-h2); a deep link still wins; Clerk's trial-end field name is confirmed. *Tests:* scoped tests plus the walk spec. *Rollback:* remove the hop; the fallback returns to /member/api-keys. *Keep:* /member/bearer → /member/api-keys.
  - `DM6-h2` **(new in v0.13.3, D37; UXF-03)** Trial users pick where to start, and it sticks: the chooser "What do you want to do first?" with 2 equal cards, "Start with Field" and "Start with Code", no default. *Design first:* the confirmed `user_flow` (Oct 25, ~6:15 PM ET) and `ux_surface_pass` saved in `/workspace/blueprint/aadm/ux-field-post-login.md` v0.2. *In:* DM6-h1, DM6-a4 (now in F5-l). *Out:* the chooser page (path confirmed here; proposed /member/start). *Done:* choosing Field opens /field/main and the next trial sign-in skips the chooser (same for Code); a converted user never sees it; a failed save shows it again next time. *Tests:* scoped tests plus the walk spec. *Rollback:* remove the page; trial users land on /field/main. *Keep:* DM6-h1's other rows.
  - `DM6-h3` **(new in v0.13.3, D37; UXF-04)** Free users get a pick-a-plan page: the member-area plan page (path confirmed here; proposed /member/plan) listing Code, Field and Code + Field by their D35 labels. *Design first:* the confirmed `user_flow` (Oct 25, ~6:15 PM ET) and `ux_surface_pass` saved in `/workspace/blueprint/aadm/ux-field-post-login.md` v0.2. *In:* DM6-p1, DM6-h1. *Out:* the page. *Done:* Free and expired-trial users land on it; every price comes from Clerk Billing; 0 hardcoded amounts; how plans render is confirmed. *Tests:* scoped tests plus the walk spec. *Rollback:* remove the page; Free lands on /member/api-keys. *Keep:* the public pages.
- Batch `F5-x` **Code-only users see an offer; trials and the AI coder card work** (new in v0.16, D45; v0.17: Stage F8)
  - `DM5-a4` **(new in v0.13, D33)** The AADM Field page on aadm.io (§7 item 15; one page; path aadm.io/field, confirmed by Brian, D36), linked from the existing nav. The rest of aadm.io stays AADM Code. Producer writes the copy; this slice builds the page's job only: explain AADM Field, show the promise line word for word, and carry the sign-up and plan CTAs (prices per D36: Field the same as Code, Code + Field 15% less; numbers only from Brian). *Design first:* `user_flow` and `ux_surface_pass` saved before page code. *In:* Producer's copy, the plan labels (D35). *Out:* the page and the nav link. *Done:* the page renders the promise line byte for byte; the CTAs open sign-up or the plan picker; no price number appears unless Brian supplies it; its `pressure_test` required checks pass. *Tests:* scoped page tests. *Rollback:* remove the page and the link. *Keep:* every AADM Code page.
  - `DM6-h4` **(new in v0.13.3, D37; UXF-05)** Code-only and Free see an offer, not an error, at /field/main: the in-place offer "Add AADM Field" (Code) and "See plans" (Free). *Design first:* the confirmed `user_flow` (Oct 25, ~6:15 PM ET) and `ux_surface_pass` saved in `/workspace/blueprint/aadm/ux-field-post-login.md` v0.2. *In:* DM6-p2, F5-a1 (was DM5-a5), DM6-h3, DM5-a4. *Out:* the offer panel. *Done:* both return 200 with 0 workspace data in the HTML; Field plans never see either; the offer target is confirmed. *Tests:* scoped tests plus the walk spec. *Rollback:* show the F5-a1 shell. *Keep:* /field (DM5-a4).
  - `DM6-h8` **(new in v0.13.3, D37; UXF-10)** Trial badge and plan changes show within the cache window: the "Trial: {n} days left" badge and the lost-access panel ("Your workspaces are kept and can be exported." (§A10 noun; v0.16.1)). *Design first:* the confirmed `user_flow` (Oct 25, ~6:15 PM ET) and `ux_surface_pass` saved in `/workspace/blueprint/aadm/ux-field-post-login.md` v0.2. *In:* DM6-h2, DM6-h4, F5-a1 (was DM6-h6). *Out:* the badge and panel. *Done:* an injected trial end, downgrade or upgrade shows the new state on the next load after CFG-TECH-17; 0 workspace rows are deleted; conversion stops the chooser. *Tests:* scoped tests plus the walk spec. *Rollback:* hide the badge. *Keep:* the entitlement cache.
  - `DM6-h9` **(new in v0.13.3, D37; UXF-11)** A one-time "Connect your AI coder" card: the card linking to /member/mcp-oauth, with Dismiss stored in `user_pref`. *Design first:* the confirmed `user_flow` (Oct 25, ~6:15 PM ET) and `ux_surface_pass` saved in `/workspace/blueprint/aadm/ux-field-post-login.md` v0.2. *In:* F5-a1 (was DM6-h6), DM6-p3, DM6-a4 (now in F5-l). *Out:* the card. *Done:* Dismiss holds on the next sign-in; Code-only users never see it at /field/main. *Tests:* scoped tests plus the walk spec. *Rollback:* remove the card. *Keep:* /member/mcp-oauth.
- `CF8` column check (typecheck both repos).

**Stage F7: Workspaces have settings, preferences and handover (later; plumbing)** (aadm-backend · aadm-website)
- Batch `F7-s` **Workspace settings have one home** (new in v0.16, D45)
  - `DM1-f1` `workspace_policy` and append-only `workspace_policy_event` tables behind `PlanStore`, the presets doctrine `aadm://doctrine/workspace-policy-presets` (Light, Standard, Regulated; every policy key with its type and allowed values) and a typed resolver: effective value = override, else preset. *In:* DM1-c4 migrations, F1-a2 (was DM1-a1) workspaces. *Out:* the tables, the doctrine resource, `resolvePolicy(workspace_id, key)` and the read tool `workspace_policy_get`. *Done:* every CFG ID with a policy key in §5 resolves to its Standard value on a new customer workspace and to its Light value on a personal one; an unknown key or an out-of-range value is refused with `policy_invalid`; each saved row records its revision; a lint finds no hard-coded setting value in the checker modules that read these keys (checked from F2-b1 (was DM2-c4) on). *Tests:* scoped repository tests for both tables, a doctrine-load test, and a table-driven resolver test with one case per policy key. *Rollback:* migration down; callers fall back to the Standard constants shipped in the doctrine. *Keep:* F1-a2's workspace and member tables.
  - `DM1-f2` Change rules: an owner may tighten any "Owner (tighten)" setting; loosening one needs the people in CFG-APPROVAL-06 (D19) in a human web session; "Operator" and "Fixed" items can't be changed through the workspace; an agent credential can read but never write; every change writes a `workspace_policy_event` and a `plan_event`. *In:* DM1-f1, F1-a2 (was DM1-a1) roles. *Out:* the plans API settings routes (web session only) and the events. *Done:* with seeded members, an owner tightening CFG-DATE-02 succeeds at once; the same owner loosening it alone is refused (`approval_required`) and succeeds once the acceptor and a different approver co-sign; a planner, a coder and an agent credential get 403 on every write route; changing a Fixed or Operator item is refused (`not_configurable`); a cornerstone saved before a change keeps its recorded revision. *Tests:* scoped route tests (tighten, loosen with and without co-signers, 403 for agents and non-owners, Fixed and Operator refusals, revision recorded). *Rollback:* remove the write routes; settings stay at their preset values. *Keep:* DM1-f1's resolver output.
  - `DM5-a3` **(new in v0.11)** The workspace **Settings** page in the member area: one section per area of §5, each row showing the CFG ID, the setting, the preset value, any override, who changed it and when, and its "who can change" rule; loosening opens the co-sign flow (DM1-f2); Operator and Fixed items show read-only with their reason. *In:* DM1-f2, F5-a1 (was DM5-a1), F1-a3 (was DM2-a1). *Out:* the Settings page. *Done:* each value on screen equals `workspace_policy_get`'s; a viewer sees the page read-only; an owner's tighten saves and shows in the history; a loosen shows "needs co-sign" until both co-signers act; its `pressure_test` required checks (RC-01–08, plus RC-AUTH-01 role and workspace, RC-GUIDANCE-01 server-computed colors, RC-ETAG-01, RC-KEY-01) are written and pass. *Tests:* the page's scoped `pressure_test` checks and one Playwright flow (tighten, then loosen with co-sign). *Rollback:* hide the page; the API still works. *Keep:* F5-a1 (was DM5-a1)'s Plans tab and list.
- Batch `DM6-b` **Sharing and handover**
  - `DM6-b1` Read-only share links. *Done:* view-only, reports hidden by default, expiry and instant revoke (THR-7).
  - `DM6-b2` Engagement transfer package. *Done:* the export carries a filled `fde-outcome-contract.md`, and `assurance_run` with `engagement_kind: fde` accepts the shape.
- `CF7` column check (typecheck both repos).

**Stage T: The stack is known: Terrain (later)** (aadm-backend · host coder)
- Batch `DM1-d` **Terrain facts have a home** (new in v0.5)
  - `DM1-d1` `terrain_profile` and `terrain_fact` tables behind `PlanStore`, with RLS and explicit grants to `aadm_app`. *Done:* user B reads 0 of user A's facts; a profile over the CFG-WS-11 cap is refused.
  - `DM1-d2` `terrain_fact_event`, append-only, and `slice.terrain_fact_ids[]`. *Done:* events can't be edited; a slice can cite only facts in its own workspace.
- Batch `DM2-t` **Terrain facts can be saved and cited** (new in v0.5; runs before DM2-b)
  - `DM2-t1` MCP tools `terrain_fact_save` (evidence allowlist schema, §13a.2) and `terrain_get`. *Done:* the 6 refusal tests in §13a.2 each return `evidence_rejected` with the field named, and a valid payload at the FIX-07 item limit saves with no field outside the schema.
  - `DM2-t2` Freshness and gaps in `terrain_get`, deterministic. *Done:* with an injected clock, a fact one day past CFG-STALE-01 and an identity fact one day past CFG-STALE-02 both show stale, and the gap list names each empty required section (THR-22).
- Batch `DMT-a` **The crawl stays inside the customer's walls**
  - `DMT-a1` Repo crawl to Terrain: AADM collection guidance for the host coder, which runs `repo_architecture_map` and `repo_feature_map` locally and saves the derived output, including the UDALI map and 22-layer assessment, as facts with the commit. *Done:* a re-crawl at a new commit re-verifies unchanged facts and flags changed ones; the stored payload has 0 fields outside the allowlist.
  - `DMT-a2` Host-side import guides for OpenAPI, Terraform JSON, CMDB CSV and docs. *Done:* a 10 MB OpenAPI file is parsed on the host into route and operation facts, and the server log shows no file body received.
- Batch `DMT-b` **Interview, gaps and freshness**
  - `DMT-b1` Guided Terrain interview (D11 default: extend `audit_interview` with a `terrain` bank). *Done:* answers become `proposed` facts in the right sections; a code fence in an answer is refused (THR-19).
  - `DMT-b2` Terrain view in the member area: sections, sources, ages, stale flags, gap list, UDALI map, Re-verify. *Done:* a stale fact shows its age and can be re-verified; the gap count equals `terrain_get`'s.
  - `DMT-b3` **(new in v0.7)** Terrain sections 13 Experience, 14 Observability and 15 Quality (optional), with allowlist kinds `experience_surface`, `observability_signal`, `quality_signal` and `data_trust` (§13g.4). *In:* §13a.2 schema, DMT-b1 interview. *Out:* facts in the new sections. *Done:* a dashboard, an alert and a data-quality check each save as facts in the right section; a field holding a query or code is refused; THR-22 still counts only the 8 required sections. *Rollback:* hide the 3 sections (facts stay readable). *Keep:* sections 1–12 and the existing kinds.
  - `DMT-b4` **(new in v0.8)** Terrain section 16, Extension points (§13l.1):
    - the section in `terrain_get` and in the Terrain view;
    - `extension_point` facts with version, scope names and rate limit, and the CFG-STALE-03 freshness default;
    - host-side import of OpenAPI security schemes, webhook catalogs and plugin manifests (extending DMT-a2's guides);
    - extension-point questions in the `terrain` interview bank.

    *In:* the DM2-m1 kind, DMT-a2, DMT-b1. *Out:* section 16 facts, and a gap entry for `plug_in` workspaces. *Done:* an OpenAPI file with 2 security schemes imports as scope names only (0 token values); an extension-point fact one day past CFG-STALE-03 shows stale; a `plug_in` workspace with an empty section 16 lists it as a gap, and a `code_in_source` one doesn't; THR-22 still counts only the 8 required sections. *Rollback:* hide section 16 (facts stay readable). *Keep:* sections 1–15.
- Batch `DMT-c` **The UDALI transpose: three views of one Terrain map** (v0.6; replaces the purple placeholder DMT-a3, which is retired. A new batch instead of DMT-a3..a5 keeps DMT-a within the 2–4 slice rule, S5)
  - `DMT-c1` Crosswalk view: `crosswalk_term` facts, plus `vocabulary_crosswalk` extended with an optional per-workspace dictionary. *Done:* a customer term returns its UDALI layer with its `TF-` source; an unmapped term is listed as a gap; calls without the dictionary return exactly what they return today.
  - `DMT-c2` Systems × UDALI-band matrix over stored `udali_placement` facts. *Done:* each cell count equals `terrain_get`'s count for that system and band; a stale fact shows "unverified" and counts 0 (THR-31).
  - `DMT-c3` Current-vs-target gap view: target from the latest signed cornerstone's `UDALI-T*` items. *Done:* with no signed version it shows "current state only"; after signing a version with 1 target that has no placement, exactly 1 `missing` gap shows; the view has no write path to a cornerstone.
- Batch `DMT-d` **Terrain holds platform configuration** (new in v0.13, D34; after DMT-c; §13p.6)
  - `DMT-d1` The `platform_*` allowlist kinds (§13a.2) and Terrain section 17, saved through `terrain_fact_save`, stale per CFG-STALE-05. *In:* DM2-t1's schema, §13p.6. *Out:* the kinds and section. *Done:* 6 refusal tests each return `evidence_rejected` with the field named (a property value, a data row, a secret-shaped parameter default, a member email in a permission, a code body in a function, an unknown key); a valid shape-only payload is accepted and stored with no field outside the schema (FIX-31). *Tests:* scoped schema tests. *Rollback:* remove the kinds; other facts are untouched. *Keep:* the existing allowlist kinds and their tests.
  - `DMT-d2` Host-side configuration guide: AADM collection guidance for the customer's coder or FDE to export a platform's configuration locally and reduce it on the host to names and shapes. Generic, with no platform-specific product facts. *In:* DMT-a2's import guides, DMT-d1. *Out:* the guide and a `terrain` interview block for what exports can't show. *Done:* a seeded export that holds values is reduced on the host; the server log shows 0 values received; a re-run on the same export hash re-verifies facts without duplicates. *Tests:* scoped guide tests with a seeded export. *Rollback:* remove the guide. *Keep:* DMT-a2's guides.
  - `DMT-d3` Terrain view, Platform configuration section (§7 item 14). *Design first:* a `user_flow` intent interview and a `ux_surface_pass` saved with the slice before page code. *In:* DMT-b2's view, DMT-d1. *Out:* the section. *Done:* counts equal `terrain_get`'s; a stale fact shows its age; its `pressure_test` required checks (RC-01–08, plus RC-AUTH-01 role and workspace, RC-GUIDANCE-01 server-computed colors) are written and pass. *Rollback:* hide the section. *Keep:* the other Terrain sections.
- `CT` column check (typecheck both repos).

**Stage 6A: FDEs know each customer's modes, rules, people and configuration (later)** (aadm-backend · aadm-website)
- Batch `DM2-m` **Every plan says how it lands: in the code or plugged in beside it** (new in v0.8; after DM2-c, because it extends `cornerstone_save` and `delivery_map_save`; §13l)
  - `DM2-m1` Delivery mode and host contract in Cornerstone:
    - `cornerstone_version.delivery_mode` (required) and `plug_in_kind`;
    - item kind `HC-` (§13l.2);
    - allowlist kind `extension_point` (§13l.1), so `HC-` items can cite hand-entered facts from day one;
    - handoff checks 12 and 13 in `cornerstone_save`.

    *In:* F3-a2 (was DM2-b2), the §13a.2 schema. *Out:* the new fields and checks. *Done:* a draft without `delivery_mode` fails check 12; a `plug_in` draft whose `HC-` has no version range, or cites no `extension_point` fact, fails check 13 with the field named; an `extension_point` fact with a token-shaped scope is refused (`evidence_rejected`); signed rows read as `code_in_source` with their `content_sha256` unchanged. *Rollback:* migration down. *Keep:* handoff checks 1–11.
  - `DM2-m2` `delivery_map_save` applies the mode. It refuses:
    - a save with no mode, or a mode different from the cornerstone's (CS-H2);
    - for `plug_in`, a slice file in the host repo other than the named `host_registration_files[]` (CFG-MODE-01), or a slice whose `keep[]` lacks the host repo (CS-M1);
    - for `plug_in`, a rollback that is not disable or unregister (CS-M2).

    *In:* DM2-m1, F2-b1 (was DM2-c4). *Out:* findings with rule IDs. *Done:* each of 4 seeded faults gives one blocking finding with its rule ID; a clean `plug_in` sample with one named registration file saves; a `code_in_source` plan saves exactly as before. *Rollback:* stop enforcing the 3 mode rules (they stay in the doctrine). *Keep:* F2-b1 (was DM2-c4)'s other rules.
- Batch `DM6-c` **Governance and stakeholders are mapped** (new in v0.7; v0.16.1: the `fde_tools` entitlement check now lives in DM6-c3 (F5-s) and is reused here)
  - `DM6-c1` Governance, standards and best practices map: `governance_item` and `governance_event` tables, `governance_save`/`get` in `aadm-backend`, the AADM baseline preloaded from `doctrine_index` and aadm-standard `standards/`, and reads the `fde_tools` check from DM6-c3 (v0.16.1; it was built here in v0.16). *In:* §13j. *Out:* `GOV-` entries. *Done:* a new workspace lists the baseline with URIs; a content paragraph over the FIX-07 limit or a code fence is refused; an entry unconfirmed past CFG-STALE-04 shows `assumed` (injected clock); no `fde_tools` gives `entitlement_required`; (pressure_test RC-KEY-01) user A on Code + Field and user B on Code in the same workspace: A gets the Field tools, B gets `entitlement_required`, and core's cached plan pre-check is keyed by the user, so A's cached plan never unlocks B. *Rollback:* migration down. *Keep:* `doctrine_index` and `fetch_auth` outputs.
  - `DM6-c2` Stakeholder map: a `stakeholder` table (RACI per phase, influence, interest, cadence, last touchpoint, sentiment) and "who must say yes" per gate (§13k). *In:* outcome `SH-` items (F3-a2 (was DM2-o1)). *Out:* stakeholder rows and gate approver lists. *Done:* Sign lists the CFG-LOCK-01 signers; an email- or phone-shaped value is refused; a touchpoint one day past its CFG-DATE-04 cadence plus CFG-DATE-05 shows overdue (injected clock). *Rollback:* migration down; outcome `SH-` items keep working. *Keep:* the frozen cornerstone items.
- Batch `DM6-s` **The Speed Layer canvas shows where the customer is and is going** (new in v0.7; runs after DM6-c and before DM6-d, so its gaps feed the assessment)
  - `DM6-s1` `speed_layer_assess` in `aadm-backend`: the 30 Figure 17 boxes seeded from `speed-layer-framework.md` (names and cited definitions verbatim), ratings per box (D21), evidence, confidence, and the aspects checklist with sourced prompts and "FDE to define with customer" for the rest. *In:* SLF §2 and §7, Terrain facts. *Out:* `SLR-` rows and S1 gaps. *Done:* exactly 30 boxes with their cites; 0 unsourced cells pre-filled; a non-`not_assessed` rating with no `TF-` fact is refused; a 2-level gap gives 1 S1 gap with suggested L 4. *Rollback:* migration down. *Keep:* the framework file (read, never edited by code).
  - `DM6-s2` Speed Layer view in Strategy: the canvas laid out as Figure 17 with current → future chips, confidence, gap outlines, and the M26 overlay toggle (D20). *In:* DM6-s1. *Out:* the view. *Done:* gap boxes equal S1's count; clicking a box shows its verbatim definition and cite; its `pressure_test` required checks (RC-01–08, plus RC-AUTH-01 role and workspace, RC-GUIDANCE-01 server-computed colors, RC-ETAG-01, RC-KEY-01) are written and pass. *Rollback:* hide the view. *Keep:* the Terrain view.
- Batch `DM6-w` **Configuration work is planned, applied and verified** (new in v0.13, D34; after DM6-s and DM6-p, because it reads the Speed Layer and the plan gate; §13p.6)
  - `DM6-w1` Speed Layer tie-in: the T7 and T8 boxes and the "Enterprise architecture" aspect take current state from Terrain platform-configuration and system facts by `TF-` ID. *In:* DM6-s1, DMT-d1. *Out:* the linked evidence. *Done:* a T7 rating cites at least one `platform_*` or system fact, or stays `not_assessed`; changing a cited fact marks the rating for review. *Tests:* scoped tests. *Rollback:* unlink; ratings keep their own evidence. *Keep:* PF-03's canvas and scale.
  - `DM6-w2` Configuration targets: `PC-` items in Cornerstone (C3) for `configure_only`, and the configuration gap view (current against target: `match`, `missing`, `changed`, `extra`) with the one-way guards of §13b.6. *In:* DM2-m1, DMT-c3, DMT-d1. *Out:* `PC-` items and the view. *Done:* with no locked version the view shows current only; 1 target with no fact gives exactly 1 `missing`; the view has no write path to a cornerstone; a `PC-` item with no `OUT-` fails check 9. *Tests:* scoped checker tests. *Rollback:* hide the view; `PC-` items stay as plain items. *Keep:* the UDALI gap view.
  - `DM6-w3` `config_plan` and `config_diff`, stateless in `aadm-core`, listed for Field plans only. *In:* DM6-w2, DM6-p3, DM1-e3. *Out:* the 2 tools. *Done:* the same input gives the same output hash 3 times; a value field is refused (FIX-31); DM1-e3's no-save check passes; a Code-only session can't list them. *Tests:* scoped tool tests. *Rollback:* unregister both. *Keep:* every other tool's schema.
  - `DM6-w4` Configuration slices: `config_change` on `slice`, `config_verify` (stateless), and the done and rollback rules (CFG-MODE-06, CFG-MODE-07); the suggested verdict is ON PLAN only on `match`; a `configure_only` slice without a prior-export hash fails CS-M2 per CFG-BATCH-07. *In:* DM6-w3, F2-b1 (was DM2-c4), the report and verdict tools. *Out:* the field, the tool and the rules. *Done:* a seeded applied diff that matches gives `match`; one extra change gives DRIFT with the item named; Rollback names the prior export hash. *Tests:* scoped tests. *Rollback:* remove the field; `configure_only` slices fall back to CS-M2's change-set revert. *Keep:* `code_in_source` and other `plug_in` rules.
- `C6A` column check (typecheck both repos).

**Stage 6B: Readiness, risk, pilots and measures are tracked (later)** (aadm-backend · aadm-website)
- Batch `DM6-d` **Readiness is assessed before work starts** (new in v0.7; needs Stage T facts, DM2-o outcomes and DM6-a workspaces, all earlier)
  - `DM6-d1` Register and access tables (`risk`, `risk_event`, `access_item`, `access_event`, `readiness_check_result`) through DM1-c4 migrations and `PlanStore`, plus `risk_save`, `risk_get` and `access_save` in `aadm-backend`, behind `fde_tools`. *In:* §13h.4–§13h.6. *Out:* stored rows and computed scores. *Done:* L × I and the band match THR-34 for all 25 pairs; user B reads 0 of A's risks; a credential-shaped access field and a code fence are refused; a workspace without `fde_tools` gets `entitlement_required`. *Rollback:* migration down (tables are new; nothing else reads them). *Keep:* existing tables and the 8 FDE tools' behaviour.
  - `DM6-d2` `readiness_assess`: runs the checks Q1–Q7, R1–R7, A1–A7, G1–G12 and S1 on stored data and turns each failure into a gap and a proposed risk, keyed by gap so re-runs never duplicate. *In:* Terrain facts, outcomes, Speed Layer ratings (DM6-s1), governance map and stakeholders (DM6-c), cornerstone draft, access matrix, governance answers. *Out:* per-type counts, gaps and proposed risks. *Done:* a seeded workspace yields exactly its 7 known gaps; a second run adds 0 risks; a run at the CFG-WS-12 register caps stays within its QB-01 budget (THR-44). *Rollback:* remove the tool; the register still works by hand. *Keep:* `gap_score`, `terrain_get` and `assurance_run` outputs unchanged (they are read, not changed).
  - `DM6-d3` Interview banks: `audit_interview` gains a `readiness` bank (governance G1–G9 and access questions) and `grill_questions` gets `aadm://doctrine/readiness-and-risk`. *In:* §13h.3. *Out:* questions whose answers save as governance items or `ACC-` rows. *Done:* every G check has ≥ 1 question; answers containing a key shape are refused; other banks are unchanged (snapshot). *Rollback:* remove the bank. *Keep:* the D11 `terrain` bank.
  - `DM6-d4` **(new in v0.8)** `plug_in` readiness checks in `readiness_assess`: Q8 host version drift, Q9 rate limits, A8 scope creep and G13 plugin ownership after handoff (§13h.3, THR-40/42/43), plus risk class `host_contract` (§13h.7). They run only when the workspace has a `plug_in` cornerstone or use case. *In:* `HC-` items (DM2-m1), `extension_point` facts (DMT-b4), `ACC-` rows (DM6-d1), stakeholders (DM6-c2). *Out:* gaps and proposed risks, keyed by gap. *Done:* a seeded `plug_in` workspace yields exactly the 4 gaps Q8, Q9, A8 and G13, with 4 proposed risks. The seed has a host version above its `HC-` range; a planned peak above the CFG-MODE-03 headroom; one granted scope missing from the `HC-`; and no owner after handoff. A re-run adds 0 risks, and a `code_in_source` workspace yields none of the 4. *Rollback:* remove the 4 checks. *Keep:* the Q1–Q7, R1–R7, A1–A7, G1–G12 and S1 results (snapshot).
- Batch `DM6-e` **Risks are owned, gated and reassessed** (new in v0.7)
  - `DM6-e1` Gates: cornerstone Sign, Go on `cutover`/`rollout` slices, and slice start on access (§13h.8; CFG-RISK-03, CFG-RISK-04); `accepted` needs the people in CFG-APPROVAL-03. *In:* register, access rows, `slice.access_ids[]`. *Out:* refusals naming the risk or row. *Done:* an open critical blocks Sign; an open high with no owner blocks Go on a cutover slice; a slice whose `ACC-` row is `requested` returns `nothing_approved` from `next_slice`; one person can't both author and approve an acceptance; a residual-critical risk can't be accepted. *Rollback:* a per-workspace gate switch, allowed per CFG-LOCK-02, logged in `plan_event`. *Keep:* the existing §4.2 checks and the Go rules from F2-c1 (was DM3-a2).
  - `DM6-e2` Mitigation evidence and reassessment: link each risk to its evidence tool (§13h.7); a pasted tool result logs its SHA-256 and time; triggers mark risks for review (THR-35, THR-44). *In:* reports, Terrain events, cornerstone versions, access events. *Out:* `review_due` flags and evidence entries. *Done:* a report carrying `cutover_parity_check` with 0 mismatches offers "log evidence" on its linked risk; a changed cited `TF-` fact marks its risks for review within the QB-01 budget; a high risk not reviewed within its CFG-DATE-06 cadence shows overdue (injected clock). *Rollback:* turn off triggers; the cadence check still runs. *Keep:* the FDE tools themselves (results are referenced, never re-implemented).
  - `DM6-e3` The **Readiness and risk** view: four gap panels plus the register, merged with Terrain's gap list; the Risks panel on Sign; risk badges and access locks on slice cards; risk lines in the verdict drawer. *In:* DM6-d1/d2 data, DMT-b2 Terrain view. *Out:* one view, no new tab. *Done:* gap counts equal `readiness_assess`; Terrain's stale-fact count appears once (as Q2), not twice; a card's badge shows its highest open band; its `pressure_test` required checks (RC-01–08, plus RC-AUTH-01 role and workspace, RC-GUIDANCE-01 server-computed colors, RC-ETAG-01, RC-KEY-01) are written and pass. *Rollback:* hide the view behind `fde_tools`. *Keep:* the Terrain view's layout and the DMT-c views.
- Batch `DM6-f` **Pilots are small, measured and decided** (new in v0.7; needs outcomes, Speed Layer boxes, risks and access, all earlier)
  - `DM6-f1` Use cases: `use_case` table and `use_case_save`/`list` with V, F, K, priority and (v0.8) the required `delivery_mode` (§13i.2, §13l, THR-48, THR-57). *In:* `OUT-`/`MEAS-`, `TF-`, Speed Layer box IDs, the register. *Out:* `UC-` rows and the prioritization order. *Done:* priority = V × F for a seeded list; a use case without `delivery_mode` is refused; a use case with K above CFG-UC-14 can't be chosen (Standard: K 5); choosing or rejecting without a reason is refused. *Rollback:* migration down. *Keep:* `AUTOMATION_USE_CASES` in `ai-automation-profile.ts` (unrelated, unchanged).
  - `DM6-f2` Pilot charter and start gate: `pilot` and `pilot_amendment` tables, `pilot_save`, the pilot limits (CFG-PILOT-01 to CFG-PILOT-05), the `aadm://doctrine/pilot-charter` grill bank, and the frozen-metrics rule. *In:* `UC-`, `ACC-` set, `RISK-` entries. *Out:* `PIL-` rows and refusals. *Done:* with the Standard preset, a pilot with 2 primary use cases, one team over CFG-PILOT-02, or a week over the CFG-PILOT-03 ceiling is refused with "split this pilot", naming the setting ID; `program` is refused under Standard and accepted under Light (CFG-PILOT-01); start is refused while any `ACC-` row is not `granted` or any charter field is empty; changing a target after start without an amendment is refused. *Rollback:* migration down. *Keep:* the CFG-RISK-03 and CFG-RISK-04 gates. (v0.9: F3-b3 (was DM6-v3) tightens the start gate from a `chosen` use case to an approved, not superseded version.)
  - `DM6-f3` Feedback loop: `pilot_feedback` (channel, short summary per FIX-07, triage result, changed ref, told-back date) and the minimum-response and triage-age checks (CFG-PILOT-10, CFG-PILOT-11). *In:* `PIL-`. *Out:* per-period counts and the closed-loop list. *Done:* with the Standard preset, a period one response below the CFG-PILOT-10 minimum shows "below minimum" with the number; an item untriaged one working day past CFG-PILOT-11 shows overdue; a transcript-length body is refused. *Rollback:* migration down. *Keep:* slice, risk and `UC-` records (triage links to them, never edits them).
  - `DM6-f4` Go/No-Go: the recommendation per §13i.4, the decision record with the values used, the co-sign by the CFG-APPROVAL-04 people (different people when CFG-APPROVAL-09 is on), overdue-red, and lesson candidates for `lessons_register`. *In:* pilot metrics, feedback, the register. *Out:* the decision and lesson candidate JSON. *Done:* seeded results give go, iterate and stop exactly as the rules say; an override without a reason is refused; at end date + 1 day with no decision the pilot is red (THR-50); a second iteration is refused. *Rollback:* remove the decision route; pilots stay readable. *Keep:* `lessons_register`'s contract.
- Batch `DM7-b` **Outcomes are checked after go-live** (new in v0.7)
  - `DM7-b1` Measure checks: an append-only `outcome_measure_check` (measure, value, checked_by, at, on_target) and a schedule from each measure's by-date (CFG-DATE-08), done by the named checker (default: the decision owner records, the FDE prepares). *In:* `MEAS-` items. *Out:* check rows and due dates. *Done:* with an injected clock, a check falls due on the by-date and then on the CFG-DATE-08 interval; it stops at the CFG-DATE-08 limits. *Rollback:* migration down. *Keep:* the frozen cornerstone (checks are separate rows).
  - `DM7-b2` Off-target feedback: an off-target result returns a `lessons_register` candidate for the host and marks the linked risks for review. *In:* DM7-b1 rows, the register. *Out:* lesson candidate JSON and `review_due` flags. *Done:* a result missing the target by more than 10% of the baseline-to-target gap gives 1 lesson candidate and flags exactly the risks that name that outcome; AADM stores no lesson text (`lessons_register` stays host-owned). *Rollback:* remove the hook. *Keep:* `lessons_register`'s contract.
- `C6B` column check (typecheck both repos).

**Stage 6C: Firms run many engagements: the Firm layer (later)** (aadm-backend · aadm-website)
- Batch `DMF-a` **A firm sits above its customer workspaces, and customers stay sealed**
  - `DMF-a1` `firm`, `firm_member`, `firm_policy` and `firm_policy_event` through DM1-c4 migrations and `PlanStore`, the firm roles (CFG-FIRM-17), the firm presets (CFG-FIRM-19) and the proposed `firm_layer` feature check. *In:* DM1-c4, DM1-f1, DM6-p2. *Out:* tables and resolver. *Done:* a firm resolves its preset like a workspace; a `firm_owner` with no `workspace_member` row reads 0 content rows of a customer workspace (FIX-28). *Tests:* scoped table and resolver tests. *Rollback:* migration down. *Keep:* `workspace_member` and its tests.
  - `DMF-a2` Consent and the rollup: `firm_workspace_link` with a people-only consent route (CFG-FIRM-02), levels (CFG-FIRM-01, CFG-FIRM-04), revoke, the `firm_rollup` view and the customer's "What your firm sees" panel (CFG-FIRM-03). *In:* DMF-a1, F2-d1 (was DM6-g1). *Out:* the link, the view and the panel. *Done:* an agent credential gets 403 on consent; without consent the view has 0 rows; at `status_counts` only the §8 columns exist; a revoke returns 0 rows on the next read; the view's `pressure_test` read-model checks RC-KEY-01 (cache key carries firm and link), RC-ETAG-01 (no stale 304 after a revoke) and RC-POISON-01 (one bad row can't break the list) pass. *Tests:* scoped route and view tests. *Rollback:* drop the view; links stay `proposed`. *Keep:* FIX-06.
  - `DMF-a3` Tenancy proof: `tenant_isolation_check` plus a seeded leak suite of 3 customers across 2 firms, with one FDE in both. *In:* DMF-a2. *Out:* the suite. *Done:* 0 cross-customer content rows through every firm route and tool; a level change narrows fields at once; a user in 2 firms sees only each firm's links. *Tests:* the suite. *Rollback:* none (tests only). *Keep:* DM1-e2's isolation suite.
- Batch `DMF-b` **The portfolio shows every engagement at a glance**
  - `DMF-b1` `portfolio_get` in `aadm-backend`, through `firm_rollup` only, with filters. *In:* DMF-a2. *Out:* the tool and route. *Done:* counts equal the per-workspace APIs for shared fields; a filter on a field above a link's level returns `not_shared`; its QB-01 budget holds at 100 links. *Tests:* scoped tests. *Rollback:* unregister. *Keep:* `firm_rollup`.
  - `DMF-b2` Portfolio page (§7 item 13). *Design first:* `user_flow` and `ux_surface_pass` saved before page code. *In:* DMF-b1. *Out:* the page. *Done:* each card's numbers equal the API's; "not shared" shows where a level stops; its `pressure_test` required checks (RC-01–06 and RC-08, plus RC-RQ-01, RC-ETAG-01, RC-AUTH-01 firm role, RC-KEY-01 cache key per firm and link, RC-EB-01, RC-A11Y-01, RC-CONC-01, RC-GUIDANCE-01 server-computed colors) are written and pass. *Rollback:* hide the page. *Keep:* the workspace home.
- Batch `DMF-c` **Proven patterns become firm playbooks**
  - `DMF-c1` `playbook` and `playbook_version`, `playbook_propose`, the strip check (FIX-30) and versioning. *In:* DMF-a2, the template kinds (CFG-FIRM-07). *Out:* draft versions. *Done:* a pattern holding one customer system name is refused with the field named; a stripped version saves with its hash; an approved version can't be edited. *Tests:* scoped strip-check tests with seeded customer names. *Rollback:* migration down. *Keep:* the source workspace's records.
  - `DMF-c2` Promotion approval as a people-only web route (CFG-FIRM-05, CFG-FIRM-06) and the playbook library page (§7 item 13). *Design first:* `user_flow` and `ux_surface_pass`. *In:* DMF-c1. *Out:* the route and page. *Done:* the author can't approve under Standard; an agent gets 403; the library shows each version's strip result and approvers; `pressure_test` required checks pass. *Rollback:* hide the page; drafts stay drafts. *Keep:* FIX-03.
  - `DMF-c3` `playbook_apply` and `playbook_use`: start an engagement from a playbook version as drafts that need the customer's own facts (CFG-FIRM-18). *In:* DMF-c2, F3-a2 (was DM6-u1), F3-a2 (was DM2-b2), F2-a1 (was DM2-c2). *Out:* drafts and usage rows. *Done:* every applied draft fails its readiness checks until customer facts are cited; usage per version shows in the library. *Tests:* scoped tests. *Rollback:* delete the drafts (they hold no customer facts). *Keep:* existing use cases and cornerstones.
- Batch `DMF-d` **Staffing, capacity and quality across FDEs**
  - `DMF-d1` `firm_assignment` and `firm_capacity`, and a pure utilization function (CFG-FIRM-13, CFG-FIRM-14). *In:* DMF-a2. *Out:* rows and the function. *Done:* 6 seeded cases give the expected allocation and warning; an assignment to an unlinked workspace is refused. *Tests:* scoped tests. *Rollback:* migration down. *Keep:* `workspace_member`.
  - `DMF-d2` Quality metrics, a pure function from rollup counts only: ON PLAN rate, rework, readiness pass rate and cycle time, per FDE and per playbook version (CFG-FIRM-09 to CFG-FIRM-12). *In:* DMF-d1, F2-d1 (was DM6-g1), the verdict tables. *Out:* metrics with the rule that set each color. *Done:* below the minimum sample it returns "not enough data"; 12 seeded cases give the expected values; with CFG-FIRM-08 `off` no per-person value exists (`not_enabled`); no output is ordered by rank unless CFG-FIRM-11 is `ranked`. *Tests:* scoped tests. *Rollback:* remove the function. *Keep:* F2-d1 (was DM6-g1)'s health rules.
  - `DMF-d3` People page (§7 item 13). *Design first:* `user_flow` and `ux_surface_pass`. *In:* DMF-d2. *Out:* the staffing board, utilization and quality views. *Done:* visibility follows CFG-FIRM-08 for each firm role; `pressure_test` required checks pass. *Rollback:* hide the page. *Keep:* the portfolio.
- Batch `DMF-e` **A firm can brand its engagement workspaces**
  - `DMF-e1` `firm_brand` (display name, logo through `BlobStore`, colors; CFG-FIRM-15) shown in linked workspaces' shell and share links, plus the brand settings page. *Design first:* `user_flow` and `ux_surface_pass`. *In:* DMF-a2, DM1-c2. *Out:* the row and the shell. *Done:* a linked workspace shows the firm brand and an unlinked one doesn't; a low-contrast color pair is refused; branding changes no access rule. *Tests:* scoped tests. *Rollback:* clear the brand; the default shell returns. *Keep:* the access rules.
  - `DMF-e2` Brand on exports and renders: the transfer package cover and the map render header per CFG-FIRM-16. A custom domain is not built (later, §20). *In:* DMF-e1, DM6-b2, F2-e1 (was DM4-a2). *Out:* branded outputs. *Done:* the export and render show the brand; the hashes of the data inside are unchanged. *Tests:* scoped render and export tests. *Rollback:* render without the brand. *Keep:* the export contract.
- `C6C` column check (typecheck both repos).

**Stage 8: Customers keep their data (later)** (customer cloud · aadm-mcp)
- Batch `DM8-a` **Bring your own storage (mode b)**
  - `DM8-a1` Per-workspace data-plane settings (`workspace_data_plane`), owner only; a mode change runs export then import. *Done:* a non-owner can't change it; a mode change round-trips with parity.
  - `DM8-a2` The first customer adapter (D9) with federated, short-lived credentials. *Done:* it passes 100% of the contract suite (THR-23); the credential lives no longer than CFG-TECH-11 and none is stored (FIX-11).
  - `DM8-a3` Control-plane split, customer-managed keys and counts-only telemetry. *Done:* an aadm.io database dump for a mode-(b) workspace has 0 content rows; a revoked key blocks reads within CFG-TECH-12; telemetry has 0 free-text fields (THR-25).
  - `DM8-a4` Export and delete through the adapter. *Done:* THR-30 holds, with a read-back of 0 rows after delete.
- Batch `DM8-b` **Self-hosted data plane (mode c)**
  - `DM8-b1` The same `aadm-mcp` image in the customer's cloud, started in both modes: `aadm-core` (front door; saves nothing) and `aadm-backend` (plans API, storage, save tools, FDE tools, Terrain crawl and transpose), plus the `aadm-web` image from `aadm-website` per D10, configured by environment, routing as in §13d. *Done:* it boots and serves tools with 0 calls to `*.aadm.io` except the license host.
  - `DM8-b2` Sign-in through the customer's IdP over OIDC, using `user_issuer` + `user_subject`, mapped to an `actor_id` (v0.14, D43). *Done:* a test OIDC issuer signs in and Clerk is never called.
  - `DM8-b3` License check, update channel and egress allowlist. *Done:* offline up to the CFG-TECH-13 grace still works and the next day warns; the allowlist matches CFG-TECH-14.
  - `DM8-b4` Mode (c) proof, plus an in-plane Terrain crawler job. *Done:* an egress capture shows 0 tool-payload bytes to mcp.aadm.io, and export and delete pass THR-30.
- `C8` column check (typecheck + MAP END: aadm-mcp `npm run go`, aadm-website `npm run check`).


**Where the 57 removed v0.15 slices went (D45, D46).** Each one's done-check is carried by the slice named here; none is lost.

| v0.15 slice | Now in | How |
|---|---|---|
| DM1-a1 | F1-a2 | folded by the reframe (D45) |
| DM1-a2 | F1-a2 | folded by the reframe (D45) |
| DM1-a3 | F1-a2 | folded by the reframe (D45) |
| DM1-b1 | F1-a1 | folded by the reframe (D45) |
| DM1-b2 | F1-a1 | folded by the reframe (D45) |
| DM1-b3 | F1-a1 | folded by the reframe (D45) |
| DM2-a1 | F1-a3 | folded by the reframe (D45) |
| DM2-a2 | F1-a3 | folded by the reframe (D45) |
| DM2-b1 | F3-a2 | folded by the reframe (D45) |
| DM2-b2 | F3-a2 | folded by the reframe (D45) |
| DM2-b3 | F3-b2 | folded by the reframe (D45) |
| DM2-c1 | F2-a1 | folded by the reframe (D45) |
| DM2-c2 | F2-a1 | folded by the reframe (D45) |
| DM2-c3 | F1-b2 | folded by the reframe (D45) |
| DM2-c4 | F2-b1 | folded by the reframe (D45) |
| DM2-o1 | F3-a2 | folded by the reframe (D45) |
| DM2-o2 | F3-a2 | folded by the reframe (D45) |
| DM2-o3 | F3-a2 | folded by the reframe (D45) |
| DM3-a1 | F2-b1 | folded by the reframe (D45) |
| DM3-a2 | F2-c1 | folded by the reframe (D45) |
| DM3-a3 | F2-c2 | folded by the reframe (D45) |
| DM3-a4 | F2-b1 | folded by the reframe (D45) |
| DM3-b1 | F2-d1 | folded by the reframe (D45) |
| DM3-b2 | F2-d1 | folded by the reframe (D45) |
| DM3-b3 | F2-d1 | folded by the reframe (D45) |
| DM3-b4 | F2-d1 | folded by the reframe (D45) |
| DM4-a1 | F2-e1 | folded by the reframe (D45) |
| DM4-a2 | F2-e1 | folded by the reframe (D45) |
| DM5-a1 | F5-a1 | folded by the reframe (D45) |
| DM5-a2 | F5-a2 | folded by the reframe (D45) |
| DM5-a5 | F5-a1 | folded by the reframe (D45) |
| DM5-b1 | F5-a3 | folded by the reframe (D45) |
| DM5-b2 | F5-a3 | folded by the reframe (D45) |
| DM5-b3 | F5-a3 | folded by the reframe (D45) |
| DM5-b4 | F5-a3 | folded by the reframe (D45) |
| DM5-c1 | F3-a2 | folded by the reframe (D45) |
| DM5-c2 | F3-a2 | folded by the reframe (D45) |
| DM6-a1 | F1-a2 | folded by the reframe (D45) |
| DM6-g1 | F2-d1 | folded by the reframe (D45) |
| DM6-g5 | F5-a1 | folded by the reframe (D45) |
| DM6-h5 | F5-a1 | folded by the reframe (D45) |
| DM6-h6 | F5-a1 | folded by the reframe (D45) |
| DM6-h7 | F5-a1 | folded by the reframe (D45) |
| DM6-i1 | F5-a1 | folded by the reframe (D45) |
| DM6-i2 | F5-a1 | folded by the reframe (D45) |
| DM7-a1 | F2-d2 | folded by the reframe (D45) |
| DM7-a3 | F2-a1 | folded by the reframe (D45) |
| DM6-g2 | F5-a1 | folded: use-case approval becomes requirements sign-off; health colors become delivery status and You are here (D46, Blueprint default pending Brian) |
| DM6-g3 | F5-a3 | folded: use-case approval becomes requirements sign-off; health colors become delivery status and You are here (D46, Blueprint default pending Brian) |
| DM6-g4 | F2-d1 | folded: use-case approval becomes requirements sign-off; health colors become delivery status and You are here (D46, Blueprint default pending Brian) |
| DM6-u1 | F3-a2 | folded: use-case approval becomes requirements sign-off; health colors become delivery status and You are here (D46, Blueprint default pending Brian) |
| DM6-u2 | F3-a2 | folded: use-case approval becomes requirements sign-off; health colors become delivery status and You are here (D46, Blueprint default pending Brian) |
| DM6-u3 | F5-b1 | folded: use-case approval becomes requirements sign-off; health colors become delivery status and You are here (D46, Blueprint default pending Brian) |
| DM6-v1 | F3-b2 | folded: use-case approval becomes requirements sign-off; health colors become delivery status and You are here (D46, Blueprint default pending Brian) |
| DM6-v2 | F3-b2 | folded: use-case approval becomes requirements sign-off; health colors become delivery status and You are here (D46, Blueprint default pending Brian) |
| DM6-v3 | F3-b3 | folded: use-case approval becomes requirements sign-off; health colors become delivery status and You are here (D46, Blueprint default pending Brian) |
| DM6-v4 | F5-a2 | folded: use-case approval becomes requirements sign-off; health colors become delivery status and You are here (D46, Blueprint default pending Brian) |

Count (v0.19): **14 stages** (0, V, F3, F4, H, F5, F6, F8, F7, T, 6A, 6B, 6C, 8, in that order), **55 batches** (v0.19: DM0-j added; v0.18: F4-g added and DM0-d dissolved into it), **160 slices**, 14 column checks (C0, CV, CF3, CF4, CH, CF5, CF6, CF8, CF7, CT, C6A, C6B, C6C, C8; C8 adds MAP END). Field core (0, V, F3, F4, H, F5, F6): 7 stages, 27 batches, 75 slices (0: 9; V: 20, the demo; F3: 6; F4: 12; H: 19; F5: 5; F6: 4). Later stages (F8, F7, T, 6A, 6B, 6C, 8): 7 stages, 28 batches, 85 slices (v0.18 corrects v0.17's 75 and 83, which were miscounted; F8's 20 slices moved out of F5; v0.16.1: F3-c and F7-p dissolved; DM6-a4 and DM6-a5 moved into F5, now F8). **v0.16 vs v0.15:** +39 new slices (F1-a 4, F1-b 2, F2 12, F3 6, F4 8, F5-a 3, F5-b 4), 47 folded by the reframe and 10 folded by D46 (57 out), 0 deleted outright, 118 kept with their IDs. Prompts: 148 slice prompts (160 slices, less the 10 done and the 2 Brian hand-run steps DM0-b3 and DM6-p1) plus 14 column-check prompts, for **162**. Done: **10 of 160** (DM0-a1 to DM0-a3, DM0-i1 to DM0-i4, DM0-j1, DM0-j2, DM0-b1). You are here: **DM0-b2**. One batch is over the 4-slice limit, as in v0.15: DM1-e (5), listed in §20.

## 19. Decisions (D1–D45 and D52 to D55 decided by Brian; D46–D51 are Blueprint defaults pending Brian (v0.16); v0.7.1 closed the rest at 11:08 AM ET; v0.8 added D25–D27, decided 11:25–11:26 AM ET; v0.9 added D28 at 12:25 PM ET. First set decided by Brian, Oct 25, 2026, 9:44 AM ET: "take ALL the defaults D1-D8", with Cornerstone as the name; D4 changed at 9:52 AM ET)

| ID | Decision | Decided |
|---|---|---|
| D1 | Where plans are stored | **Supabase Postgres + Supabase Storage, as the first host only** (reconciled in v0.6 with §13c: ports, portable SQL, app-layer tenancy; RLS and explicit GRANTs on Supabase as defense in depth, required from Oct 30, 2026). |
| D2 | Where the MCP tools live | **aadm-mcp hosts the tools** (one MCP URL). v0.6: the plans API location is D15; FDE tools run in their own container (§13d). The ADR comes first (DM0-a2). |
| D3 | Names | **Cornerstone** (ends in a *signed cornerstone*) + **Delivery maps** |
| D4 | Tenant model | **CHANGED Oct 25, 2026, 9:52 AM ET (Brian, answering DM0-a1): our own workspace tables.** Reason: Clerk Organizations are off for aadm.io. `workspace`, `workspace_member` and `workspace_invite` keyed to the Clerk user id, with RLS and explicit grants; personal workspace by default (v0.13.8, D42: no longer created automatically; the user creates it or joins by invite); our own invite flow (§10). *Was (9:44 AM): Clerk Organizations = customer workspaces.* |
| D5 | Map image | **SVG, rendered to PNG with resvg** (WASM, no browser) |
| D6 | Drive upload of finished maps | **Blueprint uploads finished maps to Drive in v1.** No AADM-side Google integration in v1. Per workspace: CFG-NOTIFY-04. **(v0.15, D44 (1))** Reaffirmed: v0.14's backend "Send to Drive" is removed from v1, and the `map_render` Drive columns are reserved for later |
| D7 | Retention | **Archive after a period with no activity, then hard delete a set time after the workspace closes or the engagement ends** (export taken first). The values are the Standard preset of CFG-RET-01 and CFG-RET-02. **(v0.15, D44 (5))** A workspace's audit and event rows are deleted with it, after the export that holds them; one content-free tombstone row stays (§8, §10, DM7-a2) |
| D8 | FDE sign-off | **The customer's named acceptor (`eval_owner`) co-signs** each FDE cornerstone version (since v0.12 the Standard preset of CFG-LOCK-01; Light can need no signers, D31) |

**Decisions added in v0.5, all decided by Brian on Oct 25, 2026, 10:23 AM ET** (D9–D12: defaults stand, no objection; D13: his definition):

| ID | Decision | Options | Decided |
|---|---|---|---|
| D9 | First bring-your-own-storage adapter | A) Postgres they host + S3-compatible blobs; B) repo-backed `.aadm/` files in their repo; C) Azure Blob or GCS + Postgres | **A** (10:23 AM ET): same SQL schema as Supabase, least new code; B second |
| D10 | Does mode (c) include the Plans and Terrain web UI inside the customer's cloud? | A) Yes, the container serves the UI; B) No, the UI stays on aadm.io behind a customer-side proxy | **A** (10:23 AM ET): otherwise plan data would flow back through aadm.io |
| D11 | Terrain interview | A) Extend `audit_interview` with a `terrain` bank; B) a new `terrain_interview` tool; C) no tool, a static checklist resource | **A** (10:23 AM ET): reuse, no duplicate tool |
| D12 | Capability name | A) Terrain; B) Landscape; (Atlas is taken) | **A Terrain** (10:23 AM ET; 0 hits) |
| D14 | Non-Postgres database adapter | A) Postgres family only in v1; a non-Postgres adapter later behind the same ports, SQL Server first if a bank customer needs it; B) build SQL Server in Stage 8; C) build Oracle in Stage 8 | **A — decided by Brian, Oct 25, 2026, 11:08 AM ET**: no customer has asked yet, and the ports keep it possible |
| D15 | Where the plans API runs | A) In the backend's core container (aadm-mcp repo), which owns the database ports and migrations; aadm.io's UI calls it server-side; B) In aadm-website | **A — decided: ADR 004 committed at `d8af2e4` (DM0-a2), confirmed Oct 25, 2026. Superseded by D30 (v0.12): the plans API and the database move to `aadm-backend`; core saves nothing** |
| D13 | What "UDALI transpose" means (not found in any repo) | A) A crosswalk: the customer's own stack terms and components mapped onto UDALI layers L1–L22, extending `vocabulary_crosswalk` with a per-workspace dictionary; B) A placement matrix: each customer system or service × UDALI band (U, D, A, L, I), showing where each obligation sits, built from `repo_architecture_map` output; C) A target-state transpose: today's customer stack laid against the AADM reference stack, with the gaps becoming Cornerstone requirements | **All three, as views of one Terrain map** (Brian, 10:23 AM ET). §13b.6; slices DMT-c1–c3 |
| D16 | How the `fde_tools` feature is granted | A) A Clerk Billing plan feature `fde_tools`, checked server-side on every FDE tool call and page; B) A per-workspace flag set by Brian; C) Both: B for pilots, A once paid plans launch | **A — decided by Brian, Oct 25, 2026, 11:08 AM ET**: the ADR addendum in DM0-a3 records it. UNCHECKED: `fde_tools` has 0 hits in either repo today |
| D17 | Which workspaces get the risk register | A) Customer workspaces with `fde_tools` only; B) Every workspace, including personal | **A — decided by Brian, Oct 25, 2026, 11:08 AM ET**: outcomes are in every cornerstone, the register is an FDE feature |
| D18 | Risk bands | A) Brian's 5 × 5 bands (now the Standard preset of CFG-RISK-01 and CFG-RISK-02, D31); B) A 4 × 4 matrix | **A — decided by Brian, Oct 25, 2026, 11:08 AM ET** |
| D19 | Loosening a readiness threshold for one workspace | A) Allowed only with the people in CFG-APPROVAL-06, logged; B) Never | **A — decided by Brian, Oct 25, 2026, 11:08 AM ET**: stricter is always allowed. Since v0.12 the acceptor-plus-approver co-sign is the Standard preset of CFG-APPROVAL-06; Light lets the owner change settings alone, always logged (D31) |
| D20 | Speed Layer canvas | A) The book's Figure 17, 30 boxes, with the M26 views as optional overlays; B) The M26 2026 Performance Mesh as canonical | **A — decided by Brian, Oct 25, 2026, 11:00 AM ET** |
| D21 | Speed Layer rating scale | A) Data-aware / Data-governed / Data-led plus not assessed, per box; B) The 5-level Data-Aware … Data-Led from Figure 2 (D s50) | **A — decided by Brian, Oct 25, 2026, 11:00 AM ET** |
| D22 | How the book's stages fit the loop | A) The five-phase loop is the frame; Discover … Deliver is the Speed Layer build method inside Plan and Adopt; Adapt loops to Discover; B) The book's stages are the frame | **A — decided by Brian, Oct 25, 2026, 11:00 AM ET** |
| D23 | Pilot duration defaults | A) A default, a standard range, a longer range with approval, and a hard ceiling (now the Standard preset of CFG-PILOT-03, D31); B) A fixed length | **A — decided by Brian, Oct 25, 2026, 11:08 AM ET**, matching Brian's own words on pilot length (values in CFG-PILOT-03) |
| D24 | Speed Layer naming conflicts (SLF §9 item 6) | A) Use Figure 17's names ("Data Catalogue", "GUIDANCE"); B) Use the book text's ("Data Catalog", "Guidance System") | **A — decided by Brian, Oct 25, 2026, 11:08 AM ET**: the canvas is canonical (D20) |
| D-A | Plan packaging (Clerk) | Plans `free`, `mcp`, `fde`, and the `mcp_fde` bundle (customer-facing labels Free, Code, Field, Code + Field since D35; since D36 Field is a separate plan without the Code tools and `mcp_fde` is the bundle at 15% less; proposed v0.13 features `firm_layer`, `white_label`); code checks **features** (`mcp_access`, `plan_tools`, `fde_tools`, `terrain`, `customer_workspaces`), never plan slugs | **Decided by Brian, Oct 25, 2026, 11:08 AM ET** (`clerk-fit-check.md`) |
| D-B | Company and enterprise billing | Per-user Clerk plans; enterprise contracts invoiced in Stripe and recorded as `entitlement` rows (`source = contract`, with expiry); Clerk Organizations stay off | **Decided, 11:08 AM ET** |
| D-C | Entitlement source | A webhook-fed `entitlement(user_id, feature, source, expires_at)` table, falling back to Clerk's billing API with a short cache (CFG-TECH-17). Since D30 the table and the webhooks live in `aadm-backend`, which re-checks every call; core pre-checks from Clerk with a TTL cache and never reads the table (DM6-c3) | **Decided, 11:08 AM ET; placement updated by D30** |
| D-D | OAuth client admission | An explicit OAuth client list; `CLERK_OAUTH_CLIENT_ID=*` is removed | **Decided, 11:08 AM ET**. Brian sets the env value; no bot touches it |
| D25 | Delivery modes | Every `UC-` and cornerstone carries `delivery_mode`: `code_in_source` or `plug_in`; configure-only is a `plug_in` sub-kind, not a third mode | **Decided by Brian, Oct 25, 2026, 11:25 AM ET** (§13l) |
| D26 | Shape of the Plan phase | Four capabilities: Cornerstone, Batch and slice, Prompts, Delivery map, each with its own gate and health; Plan health = the worst; ON PLAN/DRIFT stays under Adopt | **Decided by Brian, Oct 25, 2026, 11:26 AM ET** (§13m). Brian asked at the same time whether #6 was doing too much and should be split into 3; the decision is 4 |
| D27 | Batching standard | Published as an AADM standard and enforced by `delivery_map_save` and the prompt lint | **Decided by Brian, Oct 25, 2026, 11:26 AM ET** (§13n). Home chosen by Blueprint from the existing two-place pattern (aadm-standard prose + aadm-mcp doctrine); Brian can override |
| D28 | Use case definition and approval | Plan gains a fifth capability, first in Plan: a chosen use case is built from the FDE capability records by ID, passes the definition of ready (UR-1 to UR-12; CFG-UC-02 to CFG-UC-14), and is approved by the CFG-APPROVAL-01 roles, in Standard the customer decision owner with the `eval_owner` co-sign (web only, segregation of duties, review SLA CFG-DATE-02, frozen by SHA-256). Only an approved version starts an FDE Cornerstone (check 14) or a pilot | **Decided by Brian, Oct 25, 2026, 12:25 PM ET** ("as part of the plan we need to be able to build use cases with the FDE capabilities. add it to the PRD (Use case definition and approval)"). The details are Blueprint's defaults, which Brian can override: the ready checks (CFG-UC-02), the review SLA (CFG-DATE-02), FDE workspaces only, one person may hold both approver roles, and a separate DM6-u3 screen instead of growing DM6-g3 (§13o) |
| D29 | Settings in one place, configurable by design | Every configurable value lives in one section (§5 User Configurations and Settings) as a `CFG-` row with a policy key, preset values (Light, Standard, Regulated) and who can change it; other sections cite IDs only; operator settings are listed apart (`CFG-TECH-`); items that never move are listed with their reason (`FIX-`); THR IDs stay as names mapped to CFG IDs | **The single section is decided by Brian, Oct 25, 2026, 12:43 PM ET** ("Pull out settings and configurations required into its own section of PRD"). The preset model, the `workspace_policy` table and the Light and Regulated values are Blueprint's design, to be confirmed by Brian; Standard equals every earlier decision |
| D30 | Where saving happens: `aadm-core` saves nothing | `aadm-core` keeps MCP transport, auth, stateless tools and TTL caches only. `aadm-backend` (renamed from `aadm-fde`, decided Oct 25, 2026, 2:40 PM ET) owns the plans API, Postgres, file storage, every save tool, the 8 FDE tools, Terrain, the billing webhooks, the `entitlement` table and retention. Routing: `aadm-web` calls the backend directly with the user's session; MCP goes through core, which forwards with a Clerk M2M token. Entitlement: core pre-checks Clerk with a TTL cache; the backend's table is the source of truth. Rollback: backend URL unset → stateless tools only, saves return `storage_unavailable`; core never writes (§13d; FIX-25, FIX-27; DM0-a3, DM0-b2, DM1-e3, DM6-c3) | **The rule is decided by Brian, Oct 25, 2026** ([pt1314u]: "the AADM MCP is touted as 'we don't save anything'. we want to keep it that way in the AADM MCP core. the FDE can write"). Supersedes D15's placement. The routing, entitlement, rollback and rename are Blueprint's recommendations, to be confirmed by Brian |
| D31 | Governance is configurable, not hard-coded | Only security, tenancy, data protection, integrity and "core saves nothing" are fixed (`FIX-`, §5.19). Everything else, including sign-off, segregation of duties, risk scales and bands, pilot limits, host-file ceilings, roll-up and loosening, is a `CFG-` setting with presets; Light allows the full no-sign-off path (§5.1). Rules Blueprint thinks should be fixed but aren't in those five kinds are listed as proposed fixed (`PF-`, §5.20) and act as settings until Brian confirms; AADM's own build bars are `QB-` (§5.21). D8, D18, D19 and D23 are now Standard preset values | **Decided by Brian, Oct 25, 2026** (relayed in the 1:02 PM ET brief: "some won't sign off ANYTHING"; "not a hard-coded governance platform"). The Light and Regulated values and the PF list are Blueprint's, to be confirmed |
| D32 | v0.12 recommendations locked | Brian, Oct 25, 2026, 2:40 PM ET: "Yes to all three: aadm-backend, the routing and the PF-01 to PF-06 list." The rename to `aadm-backend`; the names `AADM_START_MODE`, `AADM_BACKEND_URL`, `AADM_M2M_TOKEN_TTL_SECONDS`; routing (web direct to backend, MCP through core with a Clerk M2M token), entitlement (core pre-check, backend re-check) and rollback (`storage_unavailable`); PF-01 to PF-06 fixed; the Light and Regulated example values accepted | **Decided, 2:40 PM ET** |
| D33 | One brand: AADM Field is sold inside aadm.io | One Clerk login (accounts.aadm.io), one MCP URL (mcp.aadm.io, `aadm-core`), one `aadm-backend`, access by plan: Free (`free`; the open AADM Standard plus a trial), Code (`mcp`; self-serve, per coder), Field (`fde`; per engagement or team, invoiced), Code + Field (`mcp_fde`; enterprise bundle, invoiced). One AADM Field page on aadm.io; no new domain. AADM Field MCP tools are served by core, listed only for `fde_tools`, stateless there, and save through the backend (D30 unchanged). Prices, the page path and the MCP URL are set by D36 (§13d, §13q) | **Decided by Brian, Oct 25, 2026, 2:53 PM ET** ("go one brand", accepting Commander's recommendation). Same URL with tools by subscription confirmed by Brian, 3:20 PM ET (D36) |
| D34 | The Firm layer in v1 | A firm above customer workspaces with firm roles; a consent-based rollup that defaults to metadata and counts; the portfolio view; a playbook library with a strip check; staffing, utilization and quality across FDEs, by policy; white-label (custom domain later); platform configuration as first-class work in Terrain, Cornerstone, slices and tools, tied to the Speed Layer's enterprise-architecture view (§13p; Stage 6C, DMT-d, DM6-w) | **Decided by Brian, Oct 25, 2026, 2:56 PM ET** ([pt1327u]: "yes firm layer in v1, update the roadmap to include Portfolio view"). The table, tool and setting names and the preset values are Blueprint's, to be confirmed |
| D35 | Product names | **AADM Code** (the coding MCP product; saves nothing) and **AADM Field** (for FDE teams and firms), on **the AADM Standard**. Customer-facing plan labels: Free, Code, Field, Code + Field; internal keys unchanged. "FDE" stays the role and practice term. Promise: "AADM Code saves nothing; AADM Field keeps your engagement workspace, and your source code never leaves you." Never "AADM Field Notes": Field Notes stays Brian's drbrianlambert.com content brand | **Decided by Brian, Oct 25, 2026, 3:02 PM ET** ("go Field"; replaces the 3:01 PM working name). Name check done Oct 25, 2026 (Commander): AADM Code low risk, AADM Field low to medium. Brian decided Oct 25, 3:21 PM ET that no legal or trademark search is needed. |
| D36 | AADM Field plans, page, MCP URL, prices, trial and tools by subscription | (1) The AADM Field page is aadm.io/field. (2) AADM Field uses the same MCP URL, mcp.aadm.io; there is no mcp.aadm.io/fde path. (3) AADM Field is a **separate plan** from AADM Code, replicated as a second product at the same price as AADM Code; the Field plan does **not** include the Code tools, and a user subscribes to both to get both. (4) Code + Field (`mcp_fde`) is priced 15% less than the Code and Field prices added together. (5) The trial includes both Code and Field. (6) Stripe and Clerk Billing are updated to match; that is Brian's own hand-run step in DM6-p1, with no coder prompt, and bots change no billing or money settings. (7) No dollar amount is invented: the Field price is "the same as the AADM Code price", and that number is UNCHECKED here (Brian reads it from Clerk or Stripe in DM6-p1). (8) The existing 8 FDE tools move behind the AADM Field plan as Field features (`fde_tools`), in DM6-p3; Code-only users no longer see them, a breaking change for their current users. **Hard cutover (Brian, Oct 25, 2026, 3:49 PM ET, v0.13.2):** existing Code-only and Free users lose the 8 FDE tools immediately when DM6-p3 lands; no grace period, no legacy access, no dual listing. (9) MCP shows tools by subscription: new FIX-32. (10) No legal or trademark search is needed (D35 note updated) (§13q, §13d, §9; DM6-p1 to DM6-p4) | **Decided by Brian, Oct 25, 2026, 3:20 PM ET** ("AADM.io/field is correct. Yes same mcp url. Same pricing as AADM code. Just replicate as a 2nd product.  Bundle is 15% less for both. Need to update strip.e." [Stripe]; "Field plan is sep from code.  Have to subscribe to both to get both"; "Trial includes both code and field.") **and 3:21 PM ET** (relayed: yes, move the existing 8 FDE tools behind the AADM Field plan; "MCP must show tools based on user subscription."; "No need for legal or patent searches.") **and 3:49 PM ET** (item 8, existing users: "They lose them right away. Field and code spot hard cutover.") |
| D37 | AADM Field post-login design | (1) The signed-in Field app is aadm.io/field/main; aadm.io/field stays the public page (DM5-a4). (2) Field and Code + Field land on /field/main; Code-only on /member/api-keys (unchanged). (3) Trial users get a "What do you want to do first?" chooser (Start with Field / Start with Code); the choice is remembered in `user_pref` and later sign-ins land on that product; the chooser is skipped once the trial converts. (4) Free users land on a pick-a-plan page in the member area (path UNCHECKED; proposed /member/plan). (5) "Needs you" spans all engagements in v1 (DM6-g5). (6) A Code-only user at /field/main sees an in-place "Add AADM Field" offer. (7) Adding the 3 backend pieces (DM6-a4, DM6-a5, DM6-g5) to this PRD. Design: `/workspace/blueprint/aadm/ux-field-post-login.md` v0.2 (§13q.3; DM5-a5, DM6-h, DM6-i) | **Decided by Brian, Oct 25, 2026, 5:43 PM ET** ("/field/main") **and 5:59 PM ET** (answers to the 5 design questions; for trial he chose the chooser, not Blueprint's recommended product-of-origin landing) **and 6:06 PM ET** (approved adding the 3 backend pieces as v0.13.3) |
| D38 | One set of judgment tools | Field's save and host tools (`cornerstone_save`, `delivery_map_save`, `delivery_map_prompt_save`, `delivery_map_report`, the drift and conformance checks, `delivery_map_render`, the Terrain and FDE flows and every other save or host tool) **call** the stateless core tools (`prd_outline`, `delivery_map`, `slice_issues`, `interrogate_plan`, `journey_map` and `predone_review`, and every other stateless judge this PRD cites) for every judgment. They never re-implement or fork that logic in `aadm-backend`. They store the tool's output with its tool name, tool version and commit, so a saved plan shows which version judged it. Improvements are made once in `aadm-core` and deploy to every user of that tool, Code and Field, through mcp.aadm.io. Field-only behavior lives in what is saved and shown, not in a forked judgment. The 6 tools stay listed for Field-only (`fde`) users as `shared` tools; this refines D36 item 3 ("the Field plan does not include the Code tools"): these 6 are shared, not Code-only. FIX-33; DM1-e4, DM3-b4, DM6-g6 | **Decided by Brian, Oct 25, 2026, 6:15 PM ET** ("make sure that field tools also use prd_outline, delivery_map, slice_issues, interrogate_plan, journey_map and predone_review. They save nothing, so the coder or I have to hold the plan between calls, which is what I do for you now. and the field tools use it but save it and we can make the tools better as needed (and deploy for 'all users' via the core mcp)") |
| D39 | Core first; Field tools behind the Field privilege | (1) Every future FDE tool ships its logic in `aadm-core` (stateless, deployed through mcp.aadm.io) and persists through `aadm-backend` only as needed for Field users; no tool is built backend-only (§16a). (2) Every Field tool (the 8 FDE tools, every save and host tool for Field data, `config_plan`/`config_diff`/`config_verify`, the Terrain and Firm-layer Field tools, and every future FDE tool) is gated by `fde_tools`: not listed in `tools/list` and refused server-side with `entitlement_required` for Code-only (`mcp`) and Free users (FIX-32, DM6-p3). (3) Every tool declares one plan tag, `code`, `field` or `shared`; the tag is the single source for `tools/list` filtering, and a tool without one fails the build. The 6 judgment tools (D38) are `shared` and listed for Code, Field and Code + Field. FIX-34; DM1-e5, DM6-p4 | **Decided by Brian, Oct 25, 2026, 6:17 PM ET** ("also make sure that any future tools --- for fde--- we ship in the core and persist as needed for field users. also , we will need to make sure the field tools are behind the field priviledge, and not usable by the aadm code team who doesnt have a field sub") |
| D40 | Shared planning tools: which ones, and paid plans only | (1) `replan_check`, `grill_questions`, `pressure_test`, `user_flow`, `ux_surface_pass`, `cross_surface_check`, `journey_trace`, `journey_attest` and `gap_score` are tagged `shared`, the same as `prd_outline`, `delivery_map`, `slice_issues`, `interrogate_plan`, `journey_map` and `predone_review` (D38): 15 `shared` tools. (2) Every `shared` tool has `free: false`: listed for `mcp`, `fde`, `mcp_fde` and active trials only; Free users get none and are refused with `entitlement_required`. Breaking for current Free users, who can call all 15 today (§14 risk 16); hard cutover on the DM6-p3 commit (D40a, 6:38 PM ET). FIX-32, FIX-34, QB-03; DM1-e5, DM6-p2, DM6-p3, DM6-p4 | **Decided by Brian, Oct 25, 2026, 6:29 PM ET** ("Tag those other planning checks shared"; "Shared planning tools are paid plans only") |
| D40a | Free cutover for the shared tools | The 15 `shared` planning tools leave Free on the DM6-p3 commit, in the same commit as the 8 FDE tools (D36 item 8): hard cutover, no grace period, no legacy access, no dual listing. Default that follows from this answer, not a new decision: the other tools FIX-32 removes from Free leave on that same commit. DM6-p3, §14 risk 16 | **Decided by Brian, Oct 25, 2026, 6:38 PM ET** ("Hard cutover on the DM6-p3 commit, same as the FDE tools") |
| D41 | The Field home is built around plan work | (1) The Field home and the workspace home are where the FDE does the plan work: one click starts or continues Cornerstone requirements, the delivery map, batching, slicing, per-slice prompts and judging coder reports (ON PLAN or DRIFT). (2) Each engagement shows its place in its plan, its next plan work and its delivery status (On plan, Drifting, Blocked), judged only against the delivery map and its verdicts; the journey and delivery status live under the Plan phase (§13e, §13m), not a second model. (3) Health = a phase's open items and drift; Readiness = the customer's organizational and data readiness to adopt (§13h.3); no server health, regions or uptime anywhere. (4) D37's "Needs you" splits into Waiting on you and Waiting on the customer. (5) The Field home is its own page; account settings live in the user menu. D37's other calls are unchanged. DM6-g1, DM6-g2, DM6-g5, DM6-h5, DM6-i1, DM6-i2 | **Decided by Brian, Oct 25, 2026**: 6:40 PM ET ("do forward deployed engineers even do these things?? monitor infrastructure???"), 6:42 PM ET ("Yes, redo the Field home design around delivery and write a new mock prompt"), 6:45 PM ET ("read the prd.. we also need to work on plan, chunking, and slicing etc") |
| D42 | AADM invariant calls | (a) Refusal result codes: `not_found` for an unknown workspace or one where the caller has no membership (never revealing it exists); `forbidden` for a member whose role forbids the action; `entitlement_required` for a plan lacking the feature or a tool not tagged for the plan. The full list (§10; TEN-07 in `ref/aadm-invariants-adapted.md`) also has `unauthenticated`, `storage_unavailable`, `conflict`, `rejected` and `indeterminate`. (b) Drop the personal workspace bootstrap: a signed-in user with no membership gets an explicit no-workspace state and creates or joins a workspace; no implicit default workspace (IDN-05). (c) Contract window: the website and the backend support the previous API version (N-1), and the API version is shown in `/health`. (d) (v0.13.9) "Chunk" means a document chunk only; the ordered group of slices inside a delivery-map stage is a **batch** (CFG-CHUNK-nn became CFG-BATCH-nn; letter IDs unchanged; "Passage" dropped). **Blueprint defaults, pending Brian (not his decisions):** BD-a DM2-a1's explicit, people-only create-workspace route, which follows from (b); BD-b TEN-07 names code families, so the existing specific codes `revision_conflict` and `evidence_rejected` stay as sub-codes under `conflict` and `rejected`; BD-c `no_workspace` as the no-membership result name, still UNCHECKED. §5.8, §10, §13d, §13n; DM0-b1, DM2-a1, DM5-a1, DM5-b4 | **Decided by Brian, Oct 25, 2026, 7:54 PM ET** ("Result codes: not_found for non-members, forbidden for role, entitlement_required for plan"; "Drop the personal workspace bootstrap"; "Contract window: N-1 API version, shown in /health"); **(d) decided 7:55 and 7:58 PM ET** ("document chunk must be called chunk.. if you need to slices and rename chunk associated with slicess then you can do that"; "batch is fine"). BD-a to BD-c are Blueprint's |
| D43 | Architecture-invariant reconciliation | (1) Apply the 17 reconciliation fixes (P1–P17, `ref/architecture-invariant-reconciliation.md`) and add 5 slices: DM0-b4, DM0-c3, DM1-a3, DM2-a3, DM2-a4. (2) An internal `actor_id` (table `actor`) identifies a person; the Clerk or OIDC `(issuer, subject)` is a mapped reference held only in `actor`; every member, entitlement, preference, approval and event table keys by `actor_id`; ADR 005 TEN-01 amendment proposed as text in §10 (IDN-02). (3) Field unlocks by each user's own plan: `entitlement` is per actor, and a member whose plan lacks `fde_tools` gets `entitlement_required` in any workspace (§8, §13h.10; overrides Blueprint's owner-plan default). (4) The planned standard is the batching standard: `standards/batching-standard.md`, `resources/doctrine/batching-standard.md`, `aadm://doctrine/batching-standard`, `src/batching-standard.ts`; draft `aadm-batching-standard-draft.md`. (5) No workspace is a normal empty state (200, empty membership list); no ninth result code; BD-c dropped; new sub-code `api_version_unsupported` under `rejected`. ADR 005 TI-05 stays open (§20). §8, §9, §10, §13c, §13d, §13h.10, §13n, §18 | **Decided by Brian, Oct 25, 2026, 8:19 PM ET** ("Apply the 17 PRD fixes and add the 5 slices"; "Add an internal actor ID"; "Field unlocks by each user's own plan"; "Rename the standard to batching-standard"; "No workspace is a normal empty state") |
| D44 | The seven INV2 calls (Day 0 and Day 1 invariants) | (1) Drive: AADM makes no Drive call in v1; v0.14's backend "Send to Drive" is removed and the `map_render` Drive columns are reserved; D6, §3, §6 item 8 and CFG-NOTIFY-04 stand; supersedes D43 P15 (AUTH-54). (2) `rate_limited` and `internal_error` become their own families, making 10; `invalid_input` and `policy_rejected` stay under `rejected`, `invalid_transition` under `conflict` and `dependency_unavailable` under `storage_unavailable`; this closes BD-b (AUTH-15, AUTH-38; RES-01 to RES-04). (3) Every tool and route declares a capability from the closed list of 9 and a side-effect class (`read`, `write`, `external`, `irreversible`); a tool with no class counts as `irreversible` and fails the build; calls outside the capabilities get `forbidden` / `capability_denied` (AUTH-44, AUTH-54; CAP-01 to CAP-03). (4) A red CI run blocks Railway deploys from `dev` (Railway wait-for-CI, Brian's step); new batch DM0-e (AUTH-43; TST-01). (5) Audit and event rows go with a hard-deleted workspace, inside the export taken first; one content-free tombstone (`workspace_id`, actor, time, export SHA-256, row counts), written by the DATA-03 role, stays (AUTH-29; DATA-03, DATA-04, AUD-01, AUD-02). (6) Idempotency window 24 hours; backups daily, kept 30 days; a restore drill before C7, then quarterly (CFG-TECH-18 to -21; AUTH-25; API-08, OPS-07); the Supabase plan's own retention is UNCHECKED. (7) The open-server startup guard moves to Stage 0 (DM0-d2); the `ak_` org-subject refusal stays in DM2-a4 (AUTH-41, SEAM-14; ENV-01, ENV-02). Also added from the INV2 gap check: DM0-d1, DM0-d3, DM0-e2, DM5-d1, DM5-d2, DM7-c1 and DM7-c2, plus DM0-i (INV and INV2, done, ON PLAN at aadm-mcp `78d93b8` and `2b1b364`, aadm-website `dba0c8e` and `9ad68e2`). §5.18, §8, §10, §12b, §13d, §18, §20 | **Decided by Brian, Oct 25, 2026, 9:07 PM ET** ("Take all 7 recommendations and write v0.15") |
| D45 | The Field reframe (v0.16) | Field turns ambiguous ideas into a vision, signed requirements and an executable roadmap (Part A). It is not a compliance or observability UX. (1) The agent runs in a separate agent worker, with a model key per workspace; this amends FIX-12 (F1-a4). (2) Brian's own Slack in v1; customer Slack later. (3) The web app has full editing in v1, through the same verbs (F5-b1 to F5-b4); the §3 non-goal is withdrawn. (4) D44 is kept as is. (5) The 67 FDE-extra slices stay in the plan as plumbing or later stages, never the Field UX purpose. (6) A "Who uses Field: the FDE's hats" section is added (D52) | **Decided, Brian, Oct 26, 2026, 6:38 PM ET** |
| D46 | Where the 10 v0.15 use-case-approval and health-color slices go | DM6-u1 to DM6-u3 and DM6-v1 to DM6-v4 fold into requirements sign-off and the Requirements area (F3-a2, F3-b2, F3-b3, F5-a2, F5-b1); DM6-g2 to DM6-g4 fold into delivery status, You are here and the shell (F2-d1, F5-a1, F5-a3). Each one's done-check is carried by the slice named in the §18 table | **Blueprint default, pending Brian** |
| D47 | Order of the later stages | After F6: F7 (settings, preferences, handover), then T, 6A, 6B, 6C and 8, in their v0.15 order. They are plumbing or later work and never change the core UX | **Blueprint default, pending Brian** |
| D48 | The agent worker's model provider | The provider sits behind a port in `aadm-agent`. Brian sets each workspace's key himself, as a secret, and the key is never shown or logged. The first provider is Brian's choice, made when he sets the first key | **Blueprint default, pending Brian** |
| D49 | Which Slack words count as a Decision | Sign-off: "sign vN" or the Sign button. Co-sign: "co-sign vN" or the button. Go: "go" or the Go button, in the slice thread. Verdict: "on plan" or "drift". Only from a linked member with the right role; bots, apps and the agent never count; the words are stored as written, and a later Slack edit is shown as an edit and changes nothing | **Blueprint default, pending Brian** |
| D50 | Where Slack's events land | On `aadm-core`, which verifies the signature and timestamp, de-duplicates by event id and forwards to `aadm-backend` with the M2M token, saving nothing. FIX-25 stands: the backend has no public route | **Blueprint default, pending Brian** |
| D51 | Challenge results and versions | Relationship rows and `interrogate_plan` and `grill_questions` results are write-once attachments on one Requirements version. They don't create a version; only an edit to the requirements does | **Blueprint default, pending Brian** |
| D52 | Who uses Field, and the acceptance tests | One main user, the FDE, wearing six hats that are steps in the loop (Product owner, Architect, Lead, Planner, Builder, Owner), not roles, screens or permission levels. Eight FDE stories and two customer stories (C1 co-sign; C2 an executive views the map); customers wear no other hats. The ten stories are the acceptance tests for the Field core, each tied to its F-stage slices (§A2) | **Decided, Brian, Oct 26, 2026, 6:41 PM ET** |
| D53 | The thin vertical, `batch`, and the six principles (v0.17) | The Field core is re-sequenced so the §A5 loop runs end to end on Blueprint's own roadmap first (Stage V, 25 slices, the demo at CV), then requirements (F3) and Slack (F4), then the hardening the demo did not need (Stage H), then the web shell's browse views (F5) and F6. Full web editing, invites, billing and landing move to a later Stage F8 (D45 (3) stands, later). One new slice, F2-b0 (`batch`). The six principles of §A16 bind every slice: concurrency, planners as input, thin surfaces, replayable judges, an open verb set and a replaceable transport. Nothing is deleted; 18 slices move to H and 20 to F8 (v0.18 corrects "18") | **Decided, Brian, Oct 29, 2026** ("yes agreed" to the five-year read, then "accommodate the thinking you shared into the documentation and plans") |
| D54 | Figure it out, then get it done (v0.18) | Rule R6 binds every slice: a Field-core slice helps a person decide what to do next or get it done, and proof for others goes to Stage H or later; Field is not a compliance app or a backend dashboard. Stage V is cut to the loop (20 slices; DM0-b4 and DM0-d to F4-g, F1-b1 to H-a). `batch` runs the order check. The verdict is worded as an answer. §A16 principle 7 withdraws the attestation framing and fixes the order (clarity, focus and precision; speed; proof; compliance tracking last); principle 1 makes fleets of agents the end state, with a fleet batch after F6. Old change notes move to a history file | **Decided, Brian, Oct 29, 2026** ("yes" to the v0.18 list) |
| D55 | Scope lock and trace rules as invariants (v0.19) | Eleven rules join `docs/ARCHITECTURE_INVARIANTS.md` (aadm-mcp) and their website mirror (§A17): every internal ID is a server-made UUID (IDN-06); every `artifact_version` carries `request_id`, `idempotency_key` and `release`, and replies return the version UUIDs in `saved[]` (ART-02); the agent-worker hop carries the context (CTX-06); user work has no audit table beyond versions and `workspace_event` (AUD-03); JSON logs on every service including the website (OBS-01 both), metrics per verb on an operator endpoint (OBS-03), Field's measures derived from versions and shown only inside an answer (OBS-04), one log line per hop on one `request_id` (OBS-05); and the Field scope rules FLD-01 to FLD-04 (R6 as invariants: proof appends and never leads, compliance view last, observability is plumbing). Rule R7 binds them; batch DM0-j writes them; F1-a3 mints `request_id` in Stage V | **Decided, Brian, Oct 29, 2026** ("lets lock those in to avoid scope creep or compliance 'ooops'"; "i want UUIDs for all user actions recorded as well as correct observability") |
| D-E | Self-hosted identity | The customer's OIDC directly, plus a signed license; Clerk is not in that path | **Decided, 11:08 AM ET** (matches DM8-b2, DM8-b3) |

## 20. Local-dev check, corrections and UNCHECKED

**Local dev check (Oct 25, ~10:00 AM ET, read-only on Brian's Mac):**
- **aadm-mcp:** `7d02c5e658` on `dev`, clean.
- **aadm-website:** `23fd957312` on `dev`, clean. The empty untracked folders `src/pages/account` and `src/pages/user` contain no files and have no effect.
- **aadm-standard:** `9a16239f23` on `main`, clean.

All three match GitHub code exactly (details are in the header table). The cited facts are confirmed on local dev:
- the AGENTS.md "no database" line
- run-store authority, slots and TTL
- the run-store owner scoping in `index.ts`
- the mcp-auth credential kinds, principal and 2-minute cache
- the tool annotation constants (`tools.ts:4604`, `:4606`)
- the 10 cited `registerTool` lines (unchanged)
- `bis-template.md`, `fde-outcome-contract.md`, `prd-template.md`, `render-contract.ts`, `repo-map-renderer.ts` and `run-state-control.ts` all present
- ADRs 001–003 present, so the next is 004
- the website on Astro 6 / `@clerk/astro` / `@astrojs/node`, with Playwright as a devDependency
- `/member(.*)` protected at `src/lib/routes.ts:8`
- `MemberNavTabs.astro` with api-keys, mcp-oauth, account and security tabs
- `health.ts` and `visuals/coding-shift.svg.ts` as the only `.ts` endpoints

**New code facts in v0.5 (checked on GitHub at aadm-website `dev` `23fd957312`, read-only):**
- `src/middleware.ts:50-58`: an unsigned request to a private route is *not* redirected; it sets `satelliteSyncPending` and renders the sync shell (to avoid the sign-in bounce loop). So `/member/invite/<token>` must check `userId` itself.
- `src/middleware.ts:62-68`: only the exact paths `/member` and `/member/bearer` redirect to API keys, so `/member/invite/<token>` is not redirected.
- `src/components/MemberPageGate.astro:9-19`: the existing gate pattern reads `Astro.locals.auth().userId` and renders nothing private when it is absent. The accept page reuses it.

**Facts corrected in v0.4.** Each was a line-number offset only; no content changed.

| Cite | v0.3 | v0.4 |
|---|---|---|
| aadm-mcp `AGENTS.md` | `:124`, `:243` | `:122`, `:241` |
| `src/mcp-auth.ts` | OAuth `:12`, `:159`; ak_ `:140`; cache `:24`; tokens `:440-455`; principal `:468-482` | `:10`, `:157`; `:138`; `:22`; `:440-450`; `:466-480` |
| `src/run-store.ts` | TTL `:226`; authority `:28`; slots `:39-44`; `delivery_map` slot `:41`; scoping `:920-956` | `:224`; `:26`; `:37-42`; `:39`; `:918-954` |
| `src/index.ts` | `:354-355` | `:352-353` |
| `src/mcp-tool-titles.ts` | `:25` | `:23` |
| aadm-standard | `GOVERNANCE.md:3`; glossary `:197`, `:69`, `:123`; README `:118, 129, 174` | `:1`; `:195`, `:67`, `:121`; `:116, 127, 172` |

**Still UNCHECKED:**
- ~~Whether Clerk Organizations are enabled (DM0-a1)~~: answered by Brian, 9:52 AM ET: off.
- Whether Brian's Supabase project lets us create a custom Postgres login role (`aadm_app`) for the backend plans API, and whether its connection string is set on Railway on the backend service only (D30). The fallback is the Supabase-supported Clerk third-party JWT on `authenticated`, which would change DM1-a1's grants. Checked in DM1-a1.
- ~~What "UDALI transpose" means (D13)~~: defined by Brian, 10:23 AM ET (§13b.6).
- Which domain is Clerk's primary instance for the aadm.io satellite (§12b).
- Whether Supabase Storage's S3-compatible endpoint covers every `BlobStore` call (DM1-c2).
- Whether Railway private networking between `aadm-core` and `aadm-backend` meets THR-32 (DM0-b3).
- Whether the 1-replica rule (`railway.toml:6-7`) also applies to `aadm-backend` (it holds no MCP sessions, so probably not).
- Whether `vocabulary_crosswalk`'s input schema can take an optional dictionary without breaking its selftest and the LLM tool-schema compatibility check (DMT-c1 checks this).
- Where mcp.aadm.io is hosted and in which region, and the Supabase project's region (sets THR-29 for mode a).
- Whether every cloud a customer might use supports federated, short-lived access for Postgres they host (AWS RDS IAM auth, Azure Entra auth, GCP Cloud SQL IAM). DM8-a2.
- Whether resvg and the renderer run inside the mode-(c) container without extra native dependencies. DM8-b1.
- The secret and code filters in §13a.2 are pattern-based; a determined user could still encode code as many identifiers. The caps (THR-18) limit, but do not prove, this.
- Research items marked secondary in `research-fde-stack-context.md` (AIP Bootcamp day-by-day plan; Palantir S-1 quote); no Bank of America FDE source found (used only as a design scenario).
- Whether invite links reaching a signed-out user survive the accounts.aadm.io sign-in round trip back to `/member/invite/<token>` (satellite `redirect_url` handling). Checked in DM6-a2.
- Whether aadm.io request logging (Railway, Astro) records full paths; if it does, the invite path must be redacted (DM6-a2).
- Where `aadm_` dashboard tokens are issued for AADM. They are verified in `mcp-auth.ts:440-450`, but no issuing UI exists in aadm-website. Similar token code exists in digico-cognistry and WinBench; whether either issues AADM tokens is unchecked.
- The exact `interrogate_plan` scanner list (does it already catch cycles or TBDs?) and whether `delivery_map` reports dependency cycles.
- The root cause of the Oct 24 Clerk token rejection.
- PR #1374 lesson details, carried from Blueprint's notes and not re-read.
- Railway env-var state for aadm.io, which only Brian sets.
- Whether Clerk M2M tokens can be issued with audience `aadm-backend` and the CFG-TECH-01 lifetime, and the env names they need (DM0-a3; Brian sets any values).
- **(v0.10)** The name of the start-mode setting that picks core or FDE mode in the one `aadm-mcp` image, and of the operator setting for the M2M lifetime. Both are set in DM0-b1 and DM0-a3 from the repo read; Brian sets any values.
- How `fde_tools` is represented in Clerk (Billing plan feature or otherwise) (D16, DM0-a3); 0 hits in either repo today.
- **(v0.13)** These items are open or unchecked:
  - **For Brian (still open after D36):** which plans carry the proposed `firm_layer` and `white_label` features; whether `firm_only` branding (CFG-FIRM-16) is offered; the firm preset values (CFG-FIRM-19 and the rest of §5.22); **the full tool split**: which tools count as Code tools, Field tools and free tools (DM6-p2's tool map needs it). (v0.13.4–v0.13.5) The tools on both lists are settled: 15 `shared` (D38, D40), none free. Still open: the `code`/`field` tag and `free` flag for every remaining tool.
  - ~~**(v0.13.5) For Brian:** hard cutover with DM6-p3 or a grace period for Free's loss of the 15 `shared` tools?~~ **Closed by D40a** (Brian, Oct 25, 2026, 6:38 PM ET: "Hard cutover on the DM6-p3 commit, same as the FDE tools"): hard cutover on the DM6-p3 commit, no grace period. By default (following from the same answer, not a new decision) this also covers the other tools FIX-32 removes from Free.
  - ~~**(v0.13.8) For Brian:** what to call a document "chunk" (proposed: "Passage").~~ **Closed by D42 (d)** (Brian, Oct 25, 2026, 7:55 and 7:58 PM ET): "chunk" is the document noun and "batch" is the delivery-map noun; "Passage" is dropped.
  - ~~**(v0.13.8)** The name of the explicit no-workspace result (`no_workspace`, Blueprint default BD-c in D42, pending Brian) is UNCHECKED.~~ **Closed by D43 (5)** (Brian, Oct 25, 2026, 8:19 PM ET: "No workspace is a normal empty state"): a 200 with an empty membership list; no ninth code; BD-c dropped. The people-only create-workspace route is Blueprint default BD-a, still pending Brian.
  - **(v0.14) For Brian (open):** ADR 005's TI-05 question: a policy may read only the expected tenant setting (TI-05), but a membership check must also read the caller's identity (`app.actor_id` after D43). Does that second read trip TI-05, or should TI-05 be read to permit it? Needed before `tenant_isolation_check` runs on the real schema (DM1-a1, DM1-a3).
  - **(v0.14) For Brian (open):** BD-a (people-only create-workspace route) and BD-b (TEN-07 names families; specific codes are sub-codes) are still Blueprint defaults; v0.14 builds on BD-b in DM2-a3. **(v0.15)** BD-b is closed by D44 (2), now with 10 families; BD-a is still a Blueprint default.
  - **(v0.14)** The ADR 005 TEN-01 and TEN-02 amendments (§10) are text only; no repo was touched. DM0-a3 (or a doc slice Brian picks) lands them.
  - **(v0.14) UNCHECKED:** the names `scripts/adr005-guard-check.mjs` (DM1-a3), `src/release-info.ts` (DM0-b4) and the open-mode operator setting (DM2-a4); a 0-hit search for `batching-standard`, `actor_id`, `workspace_event`, `api_version_unsupported` and `prompt_changed_after_go`. Each slice confirms from its repo read.
  - **(v0.15) For Brian (ASKs, his own steps; none blocks writing prompts):**
    - (a) Turn on Railway's wait-for-CI for the aadm-mcp and aadm-website `dev` services once DM0-e1 and DM0-e2 land, and for `aadm-backend` once DM0-b3 creates it.
    - (b) Set the environment setting (CFG-TECH-25) on each Railway service before DM0-d2 and DM5-d1 deploy. Otherwise production boot fails, by design.
    - (c) Check how often the Supabase plan backs up and how long it keeps backups (UNCHECKED) against CFG-TECH-19 and CFG-TECH-20, and run the first restore drill (DM7-c2).
    - (d) Confirm the `/mcp` CORS allowlist (CFG-TECH-22, DM0-d3).
    - (e) Point the Railway healthcheck at `/ready` once it is green (DM7-c1).
    - (f) Push INV2-MCP `2b1b364` and INV2-WEB `9ad68e2`.
  - **(v0.15) Repo doc follow-up (one docs edit per repo; not yet a prompt).** The INV2 rules at `2b1b364` and `9ad68e2` were written with Blueprint's earlier defaults. These rules need updating to match D44:
    - RES-03: rate limit and internal failure are their own families, making 10.
    - TEN-07, in both repos: list the 10 families.
    - CAP-01: add the side-effect class, the unclassified-is-irreversible build rule and `capability_denied`.
    - DATA-04 and AUD-02: audit rows go with the workspace, the DATA-03 role deletes them, and the tombstone stays.
    - API-08 and OPS-07: add the values (24 hours; daily, 30 days, a quarterly drill).
    - ENV-02: cite DM0-d2 instead of DM2-a4.
  - **(v0.15) UNCHECKED:**
    - New names: `src/request-context.ts`, `src/settings.ts`, the env names for CFG-TECH-18 and CFG-TECH-22 to CFG-TECH-26, `workspace_deletion_tombstone`, `operator_disabled`, `src/lib/backend-client.ts` and `src/pages/api/client-errors.ts`.
    - Which secret scanner to use, and whether the aadm-website page tests run headless in CI.
    - Whether any browser-based MCP client calls mcp.aadm.io today (DM0-d3).

    Each slice confirms these from its own repo read. This version read no repo; its code facts come from the INV2 gap check at `78d93b8` and `dba0c8e`.
  - **(v0.15) Pre-existing:** five batches from earlier versions hold more than 4 slices, outside the 2-to-4 range (CFG-BATCH-01, a warning under the Standard preset): DM1-e (5, since v0.13.4), DM5-a (5), DM6-a (5), DM6-g (6) and DM6-h (9, since v0.13.3). v0.15 adds no slice to any of them; it only edits DM1-e5. Splitting them would mean renaming slice IDs, so the split is left for Brian to decide.
  - ~~**(v0.13.8)** The PRD's existing code names `revision_conflict` (DM2-a2) and `evidence_rejected` (DM2-t1 and others) differ from TEN-07's `conflict` and `rejected`.~~ **Closed in v0.13.9 by Blueprint default BD-b (D42, pending Brian):** TEN-07 names families; `revision_conflict` is a sub-code of `conflict` and `evidence_rejected` a sub-code of `rejected` (§10). Nothing is renamed.
  - ~~**(v0.13.8)** No slice yet adds the API version to the website's `/health` (`src/pages/health.ts`) or checks N-1 compatibility between releases.~~ **Closed in v0.13.9 by DM5-b4.** `src/pages/health.ts` and its current output are UNCHECKED (named in §12b at `23fd957312`; Brian's local aadm-website is at `dba0c8e`, not re-read).
  - **(v0.13.9; updated in v0.14, D43) Names with "chunk" in a delivery-map sense.** Still live and unchanged: the tool `chunk_branch_check`, the doctrine `aadm://doctrine/chunk-branch` (`resources/doctrine/chunk-branch.md`) and the git-policy value `chunk_branch`; they need a later rename slice if Brian wants them renamed. The `chunks`/`chunk_id` keys in the live `delivery_map` tool (confirmed at `78d93b8`, `src/delivery-map.ts:79`, `:114`, `:322`) get `batches`/`batch_id` beside them in DM0-c3, and a later slice drops `chunks`. **Renamed by D43 (4):** the planned standard is `batching-standard` everywhere (aadm-standard `standards/batching-standard.md`, aadm-mcp `resources/doctrine/batching-standard.md`, `aadm://doctrine/batching-standard`, `src/batching-standard.ts`); the Blueprint draft is now `aadm/aadm-batching-standard-draft.md` (the old `aadm-chunking-standard-draft.md` is kept as `.bak`). Blueprint's own `CHUNKING_STANDARD.md` and `CHUNKING_STRATEGY.md` keep their names. **Open for Brian:** the VL-6 verbatim line ("send {planner} a chunk request") and its paraphrase in the standard's Report section stay word for word until Brian rewords them.
  - **(v0.13.9)** A 0-hit repo search for the new names (`batch`, `batching`, `batch_id`, `CFG-BATCH`) has not been run; this version did not read any repo.
  - The AADM Code price is UNCHECKED in this PRD; Brian reads it from Clerk Billing or Stripe in DM6-p1 (D36).
  - **(v0.13.1) Resolved by D36** (Brian, Oct 25, 2026, 3:20 and 3:21 PM ET): the AADM Field page path (aadm.io/field), the MCP URL (same, mcp.aadm.io), pricing (Field the same as Code; Code + Field 15% less), the trial (covers both), whether Field includes the Code tools (no; subscribe to both), whether the 8 FDE tools move behind Field (yes, DM6-p3), and the trademark search (not needed).
  - **(v0.13.2) Resolved by D36 item 8** (Brian, Oct 25, 2026, 3:49 PM ET: "They lose them right away. Field and code spot hard cutover."): existing Code-only and Free users of the 8 FDE tools lose them immediately when DM6-p3 lands; hard cutover, no grace period, no legacy access, no dual listing.
  - A 0-hit repo search for the v0.13 names (§17).
  - Whether the MCP SDK (`@modelcontextprotocol/sdk ^1.29.0`) lets `aadm-core` filter `tools/list` per session after sign-in and send a per-session `notifications/tools/list_changed`, and whether clients re-fetch the list when they get it (FIX-32; DM6-p3 confirm-first facts).
  - Clerk Billing: whether features can be attached per plan as listed, and whether satellite or custom domains are on Brian's Clerk plan (needed only for a later white-label custom domain).
  - What the firm rollup can show for workspaces in modes (b) and (c), where aadm.io holds counts only (§13p.1).
  - The Light, Standard and Regulated values in 5.22 are Blueprint's examples.
- **(v0.12)** These items are unchecked:
  - Whether `aadm-web` (aadm-website has its own `railway.toml`) runs in the same Railway project and private network as `aadm-backend`, so it can call the backend directly (§13d). If not, it calls through core's relay, and FIX-25 still holds.
  - **(v0.12.1)** Decided: the names `AADM_START_MODE`, `AADM_BACKEND_URL` and `AADM_M2M_TOKEN_TTL_SECONDS` and the rename to `aadm-backend` (D30, D32).
  - Whether a raw relay through core keeps Clerk's webhook signature valid at the backend (body bytes and signature headers unchanged) (DM6-c3).
  - Whether core-mode tools today touch the file system for anything besides temp files (DM1-e3's check will show).
  - `prompt-DM0-b1.md` and DM0-b1 still say `aadm-fde`; refresh the prompt after DM0-a3 lands.
  - **(v0.12.1)** Decided: PF-01 to PF-06 are fixed (D32).
- **(v0.11)** The Light and Regulated preset values in §5 are Blueprint's examples, accepted by Brian on Oct 25, 2026 at 2:40 PM ET (D32); a customer's own policy overrides them; Standard equals every earlier PRD value.
- **(v0.11)** `workspace_policy`, `workspace_policy_event`, `workspace_policy_get`, `aadm://doctrine/workspace-policy-presets` and the policy key names are new names, not yet searched for collisions in aadm-mcp or aadm-website at a pinned commit (DM1-f1 confirm-first).
- **(v0.11)** The env or config names for the operator settings CFG-TECH-01, CFG-TECH-02, CFG-TECH-04, CFG-TECH-08 to CFG-TECH-14, CFG-TECH-16 and CFG-TECH-17 are set from the repo read; Brian sets any values.
- Whether `grill_questions` can take a per-URI bank without changing the kind-based banks' selftest snapshots (DM2-o3, DM6-d3, DM6-f2).
- Whether `audit_interview` can take a second bank (`readiness`) alongside D11's `terrain` bank (DM6-d3).
- Whether customers' CI can report line coverage in a form the host can save as a `quality_signal` (Q3).
- The contents of aadm-mcp `docs/multi-tool-governance-schema.md` (it matched "risk" but was not read).
- Speed Layer sources not yet read (SLF §0): "Session-4-Architecting-an-AI-Speed-Layer" and the two "Speed Layer ML and AI Requirements" docs.
- **(v0.8)** These items are unchecked:
  - Whether aadm-standard takes commits directly on `main` (it has no `dev` branch at `9a16239f23`), and what its contribution rules (`CONTRIBUTING.md`, `GOVERNANCE.md`) need for a new standard (DM0-c1).
  - Whether a selftest counts the registry or resource entries, so that adding `aadm://doctrine/batching-standard` changes an expected count (`scripts/doctrine-validation-selftest.mjs` was not read; DM0-c2).
  - How `resources/list` exposes a new doctrine URI when `resolveMcpExposeLibrary()` is false (minimal library browsing, `src/mcp-server-factory.ts`) (DM0-c2).
  - Whether `delivery_map`'s output JSON can carry per-file REUSE/ADAPT/NEW tags without a schema change, or whether `delivery_map_save` adds them (CS-R1; DM2-c4).
  - Whether host OpenAPI and plugin manifests reliably state supported versions and rate limits; many don't, hence `unknown` with a reason (Q9; DMT-b4).
  - **(v0.9)** These items are unchecked:
    - A local grep of aadm-mcp `src/tools.ts` for `use_case_submit`, `use_case_get`, `use_case_approval`, `use-case-definition` and the `UR-` prefix (GitHub search covers the other files; DM6-u1's REPO-FIRST GATE).
    - Whether `readiness_assess` can take a use-case scope without changing its whole-workspace output (DM6-u1 snapshots it).
    - Whether `grill_questions` can hold a fourth per-URI bank (after DM2-o3, DM6-d3 and DM6-f2) without a selftest snapshot change for other URIs (DM6-u1).
    - How "working days" are counted for the THR-60 SLA (the customer's calendar or Mon–Fri in the workspace time zone). The default is Mon–Fri in the workspace time zone, with no holiday calendar in v1.
    - Whether one person holding both the decision-owner and `eval_owner` roles meets each customer's own approval policy. Some customers will want 2 people; that is a stricter per-workspace setting (D19 allows stricter).
  - Whether Blueprint's existing prompts pass CS-P7. They paraphrase the chunk-request line (VL-6) instead of quoting it, so new prompts should carry VL-6 verbatim once DM3-a4 lands. Prompts already handed out are not edited.

**v0.13.3 UNCHECKED (D37; each names the slice that confirms it):** the aadm-website page-test runner (DM5-a5); Clerk's trial-end field name (DM6-h1); the chooser path, proposed /member/start (DM6-h2); the plan page path, proposed /member/plan, and how Clerk plans and prices render (DM6-h3); the offer's target (DM6-h4); the create fields (DM6-h7); the workspace home path, proposed /field/w/{id} (DM6-i1); the backend route names (DM6-a1, DM6-a4, DM6-g5); the Code price (DM6-p1, Brian).

**v0.13.4 UNCHECKED (D38, D39):** whether each judge's handler can be called by name in-process from backend mode without its MCP transport (DM1-e4); the build source for `tool_version` and `commit` (DM1-e4); the tags for the other existing tools, which stay part of the open split list (DM1-e5, §20); ~~whether Free also gets the `shared` tools~~ and ~~whether the other cited judges are `shared`~~ (**closed by D40, Brian, Oct 25, 2026, 6:29 PM ET**: all 9 `shared`, none free); the name `delivery_map_conformance` (0-hit check, DM3-b1).


**v0.16 UNCHECKED (D45 to D52; each names the slice that confirms it):** the third start mode `aadm-agent` in the same image and its private-network reach (F1-a4); a Slack relay route on core next to the Clerk webhook relay (F4-a2, D50); the Slack app scopes for threads, files and buttons (F4-a1, F4-c2); ~~whether `pressure_test` accepts a requirements version as its surface input (F3-b1)~~ (**closed in v0.16.1**: the live schema takes `component_name` and `surface_kind` only, so `challenge` runs `interrogate_plan` and `grill_questions`, rule R5); the WinBench prompt and plan counts (67 prompts, 16 maps) at import time (F2-a3); the `field_*` tool and the `artifact`, `artifact_version` and `artifact_link` table names, which are Blueprint's (F1-a1, F1-a3). The ten §A2.2 stories have not been run; they are the acceptance tests once F2 to F5 exist.

**v0.16.1 UNCHECKED (each names the slice that confirms it):** a repo path for the WinBench fixture (F2-a3; rule R4); which `interrogate_plan` `plan_kind` (`contract`, the full normative scanners, or `prd`, the generic ones) plus `grill_questions` gives F3-b1 the 6-row Steve and Charles result (F3-b4); the `preset:standard` sentinel's exact form (DM1-e4, rule R2); the Slack 3-second acknowledge path on core (F4-a2); the DM0-b1 and DM0-b2 bodies, which still carry the v0.13 wording (`aadm-fde`, the 8 FDE tools forwarding) and are rewritten with their prompts after DM0-a3 (rule R1, D38); the later-stage "after" lines that still name a later batch (DM6-s after DM6-d; DMT-b4 reads DM2-m1 in 6A) are left for the later-stage pass, since none binds the Field core. A later tracker client (Linear, Jira; §A6): a `F7-t` batch of 2 or 3 slices (binding, render-to-issues, status write-back) once F2 to F4 exist; its exact placement and the tracker APIs are UNCHECKED.

**v0.17 UNCHECKED and candidates (D53, §A16; each names where it would land):** a lease per slice (`claimed_by`, `lease_until`, reusing the ADR 005 TEN-04 claim function) and Verdicts that accept concurrent Evidence on one slice, for several agents on one Roadmap (candidate for F6 or F7; until then F2-c2 releases one prompt per Go); a re-judge verb that runs `judge` on a stored Run under a newer `policy_revision` and saves a new Verdict version (candidate for H-b or F6; needs the registry's `policy_revision` to be settable per call, UNCHECKED); the JSON plan shape Blueprint emits for F2-a1 and the Spec Kit, Kiro and plan-mode file shapes (F2-a1 names the first two; the rest are later readers); the demo's curl path for the people-only routes with a Clerk session (CV; whether the backend verifies a session token on those routes before F5-a1 is UNCHECKED, DM0-a3's ADR 005 TEN-01 wording covers it); the 3 Stage V slices Brian may move to H (DM0-d1, DM0-d3, DM0-b4; done in v0.18, to F4-g); the derived card titles in `docs/aadm-delivery-maps-map.png` (Blueprint's hand-written titles exist only in its v0.16 PNG; F2-e1 may take a `title` field per slice later).

**v0.18 UNCHECKED (D54):** the fleet batch (§A16 principle 1): a slice lease (`claimed_by`, `lease_until`, the ADR 005 TEN-04 claim function), one Go releasing a ready batch to many coder credentials, `field_next_slice` serving each agent a different slice, and the map showing which agent holds which slice. It follows F6, as 2 to 4 slices, once one agent runs the loop daily; its slices and IDs are not written yet. Then a compliance view reads the appended proof, last of all; where the lease lives (F1-a1: nullable columns on `artifact`, or a claim table; either way outside `artifact_version`); the order check's tool name and home in core (F2-b0; today it is `docs/scripts/order_check.py`); the time the fifth-revision replay takes at CV (no target is set until it is measured once); whether Part B should shrink further into a reference file (only the change notes moved in v0.18, because slices cite §5, §8, §10, §12 and §13 by number).

**v0.19 UNCHECKED (D55; each names the slice that confirms it):** which Postgres version Supabase runs for us, so whether the column default is `uuidv7()` (18 or later) or `gen_random_uuid()` (F1-a1; Brian decided Postgres generates the UUIDs, Oct 29, 2026); whether anything scrapes `GET /metrics` or the operator reads it by hand at first (DM0-d1; Brian let Blueprint name it, Oct 29, 2026); `release` on version rows before DM0-b4 lands (nullable in Stage V, filled from F4-g on) (F1-a1); which read model serves OBS-04 (one backend route read by F2-d1's verdict reply, F4-c's Slack reply and F5-a3's drawer) and the exact clocks (Idea v1 to the sign-off Decision; the Go Decision to the confirming Decision) (F2-d1); whether the compliance view of FLD-03 is one slice or a batch after the fleet batch (neither is written yet); whether INV4-MCP's line numbers still hold when it runs (its CONFIRM FIRST stops if `b626e4b` has moved on in that file).

## 21. AADM tools run on this draft, and pressure-test fixes

| Tool | Key finding | What changed |
|---|---|---|
| `prd_outline` | Placed the work in the Logician band (L15) and flagged AUTH-04 (version authority), AUTH-16 (tenancy) and AUTH-21 (DTO boundary). Its slice scaffold was generic. | Added immutable signed versions (AUTH-04), the workspace isolation rules (AUTH-16) and typed tool inputs (AUTH-21). |
| `fetch_auth` (AUTH-04, AUTH-16, AUTH-21) | Read the control text. | Tenancy rules in §10. |
| `delivery_map` (on the first cut) | 23 slices and 6 contract fields with no coverage gaps. Vertical bands DATA, APP and UI; horizontal SEAM-08 (durable jobs) and SEAM-13 (guidance feedback). Its computed order put the authorization role ahead of everything. | Role enforcement moved into DM2-a1. The render and retention jobs are now idempotent (SEAM-08). |
| `interrogate_plan` (`implementation_plan`, `pre_s1`) | 0 blocking, 0 warnings, 1 info: cite `aadm://doctrine/guidance-feedback-seam` for the verdict drawer. Gate: PROCEED. | The seam is now cited in §8 and DM3-b1. |
| `interrogate_plan` on v0.5 (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25 ~10:05 AM ET | The full text (≈90k characters) is over the 64,000-character input cap, so it ran in 2 parts: header + §1–§13b, and header + §14–§21. Both: valid, 0 blocking, 0 warnings, 0 findings, gate PROCEED. (Part 1 first returned an HTTP 400 and passed on an identical retry.) A D4-only pass earlier in v0.5 (full text, 59,863 characters) was also 0/0/0. | none needed |
| `interrogate_plan` on v0.6, same settings, Oct 25 ~10:30 AM ET | 2 parts again (header + §1–§13b, 53,285 chars; header + §14–§21, 43,710 chars). Both: valid, 0 blocking, 0 warnings, 0 findings, gate PROCEED. | none needed |
| `interrogate_plan` on final v0.6 (with §12b, §13c, §13d), Oct 25 ~10:40 AM ET | 2 parts (header + §1–§13b, 59,420 chars; header + §13c–§21, 53,617 chars). Both: valid, 0 blocking, 0 warnings, 0 findings, gate PROCEED. | none needed |
| v0.7 deconflict (Oct 25, ~10:45–10:58 AM ET, read-only) | AADM MCP tools matched by risk, pressure, interrogate, invariant, lessons, grill, replan, audit, gap, doctrine, standard; `grill_questions` on `aadm://templates/fde-outcome-contract` returned only the generic templates bank. Mac greps on aadm-mcp `d8af2e4f7c`, aadm-standard `9a16239f23`, digico-cognistry `be6780c9da` (reference only) | Verdict tables in §13e–§13k; per-URI grill banks are EXTEND |
| `pressure_test` on the two main v0.7 surfaces (Oct 25, ~11:10 AM ET) | It is a per-surface test scaffold, not a plan linter. FDE workspace home (`page`, Astro, tenant-scoped, server-authoritative): 18 checks (15 required, 3 conditional). Readiness and risk view (`read_model`): 18 checks (17 required, 1 conditional). Both include RC-AUTH-01, RC-GUIDANCE-01, RC-ETAG-01, RC-KEY-01, RC-POISON-01 and RC-CONC-01. | Fixed 5 done-checks (DM5-c1, DM6-s2, DM6-e3, DM6-g2, DM6-g3) that wrongly said "`pressure_test` has 0 blocking rows"; they now require the named checks to be written and pass |
| `interrogate_plan` on v0.7 (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25 ~11:08 AM ET | ≈198k chars, so 5 parts, each with the header: §1–§12b 52,627; §13–§13g 48,607; §13h–§13k 40,382; §14–§18 52,193; §19–§21 23,126. All valid, 0 blocking, 0 warnings, PROCEED. Part 3 first gave 1 info (`DOCTRINE_SILENT_ON_SEAM`). | Cited `aadm://doctrine/guidance-feedback-seam` on the verdict drawer (§13h.9); the re-run gave 0 findings |
| v0.8 deconflict (Oct 25, ~11:30–11:40 AM ET, read-only on Brian's Mac: aadm-mcp `d8af2e4f7c` dev, aadm-standard `9a16239f23` main) | Delivery-mode and chunking-standard names have 0 hits. Existing doctrine `slice-sizing`, `process-sizing` and `chunk-branch` overlap in part. The doctrine layout is `resources/doctrine/<name>.md` + `src/registry.ts` + `src/resources.ts` + a loader like `src/slice-sizing.ts`; prose standards live in aadm-standard `standards/` | §13l and §13n deconflict tables; `chunk-branch` is kept as the alternative git policy (CS-G1) |
| `interrogate_plan` on v0.8 (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25 ~11:38 AM ET | ≈241k chars, so 7 parts, each with the header: §1–§12b 61,614; §13–§13g 51,001; §13h–§13k 43,352; §13l–§13n 19,812; §14–§17 21,518; §18 50,442; §19–§21 30,006. **All valid, blocking_count 0, warning_count 0, PROCEED.** Part 5 first gave 1 info (`DOCTRINE_SILENT_ON_SEAM`) | Cited `aadm://doctrine/guidance-feedback-seam` in §16; the re-run gave 0 findings |
| v0.9 deconflict (Oct 25, ~12:30–12:40 PM ET) | Read §4, §7–§10, §12, §13e–§13n and §18–§19 of this PRD; GitHub code search of `bwl8772` repos for the new names (0 hits in AADM repos). Brian's Mac was **not** read for v0.9 | §13o.1 deconflict table; the Mac grep is UNCHECKED (§20) |
| `interrogate_plan` on v0.9 (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25 ~12:45 PM ET | ≈284k chars, so 6 parts, each with the header: §1–§11 50,055; §12–§13e 58,943; §13f–§13k 61,947; §13l–§17 51,945; §18 61,533; §19–§21 35,478. **All valid, blocking_count 0, warning_count 0, 0 findings, PROCEED** | none needed |
| `interrogate_plan` on v0.10 (same settings), Oct 25 ~12:45 PM ET | ≈289k chars, 6 parts: §1–§11 50,886; §12–§13e 61,851; §13f–§13k 62,778; §13l–§17 52,776; §18 62,485; §19–§21 37,165. **All valid, blocking_count 0, warning_count 0, 0 findings, PROCEED** | none needed |
| `interrogate_plan` on v0.11 (same settings), Oct 25 ~1:15 PM ET | ≈328k chars, 6 parts (each with the title, status and v0.11 note): §1–§5.18 59,039; §5.19–§13b 61,671; §13c–§13i 62,466; §13j–§18 Stage 1 62,614; §18 Stage 2 to §19 59,352; §20–§21 22,839. First pass: all valid, 0 blocking, 0 warnings; part 1 had 1 info (`DOCTRINE_SILENT_ON_SEAM`). Fixed by citing `aadm://doctrine/guidance-feedback-seam` in §5.1; part 1 re-run: 0 findings. **All PROCEED** | §5.1 seam citation |
| `interrogate_plan` on v0.12 (same settings: `implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25 ~1:20 PM ET | ≈346k chars, 6 parts split at headings or batch lines, never inside a table: 59,820; 59,896; 60,414; 63,095; 59,998; 42,984. Every part: valid, 0 blocking, 0 warnings. Also run: order check (112 slices, 38 batches, 0 back-references; every batch 2–4 slices); literal check on lines changed in v0.12 outside §5 (0 hits); § references (all PRD references resolve; SLF §0 and §2a–2c are the Speed Layer source, not this PRD); IDs (167 defined CFG/FIX/PF/QB rows, 0 dangling, 0 uncited) | No change needed |
| `interrogate_plan` on v0.13 (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25, 2026 | ≈404k chars, 7 parts split outside tables: 62,355; 59,855; 59,883; 59,970; 59,958; 59,949; 42,333. Re-run ~3:13 PM ET after the late DMF and §13d edits: 7 parts (59,871; 59,823; 59,699; 59,899; 59,096; 59,727; 47,786). Every part both times: valid, 0 blocking, 0 warnings. Also: order check 137 slices, 46 batches, 0 back-references, every batch 2–4; IDs 193 defined, 0 dangling, 0 uncited; § references resolve (SLF §0, §2a–2c are the Speed Layer source) | No change needed |
| `pressure_test` on 2 new v0.13 surfaces, Oct 25 ~3:16 PM ET | FirmPortfolioPage (`page`, Astro, tenant-scoped, server-authoritative, cached): 18 checks, 15 required (RC-01–06, RC-08, RC-RQ-01, RC-ETAG-01, RC-AUTH-01, RC-KEY-01, RC-EB-01, RC-A11Y-01, RC-CONC-01, RC-GUIDANCE-01). `firm_rollup` (`read_model`): 18 checks, 14 required, including RC-POISON-01 and RC-KEY-01 | DMF-b2's done-check now lists the required checks; DMF-a2 adds RC-KEY-01, RC-ETAG-01 and RC-POISON-01 for the view |
| `interrogate_plan` on v0.13.1 changed parts (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25, 2026 ~3:35 PM ET | One part, 36,674 chars: title, header, checklist, status and change notes; §3 excerpt; FIX-27, FIX-32, QB-03, CFG-TECH-17; §7 item 15; §9 gating; §13d (core, entitlement, one brand, the four paths); all of §13q; DM5-a4, batch DM6-p and the §18 count; D16, D-A, D-C, D30, D33, D35, D36; the §20 v0.13 block. Valid, 0 blocking, 0 warnings, PROCEED, 1 info (`DOCTRINE_SILENT_ON_SEAM`: the excerpt lacked the seam citation the full PRD carries in §5.1, PF-06, §13h.9 and §16). Re-run with the PF-06 row included (36,974 chars): valid, 0 blocking, 0 warnings, 0 findings, PROCEED. Also: grep for `mcp_fde`, `fde_tools`, "Code + Field", "includes the Code", "pricing TBD", "Brian to confirm", `mcp.aadm.io/fde`, attorney and USPTO; every hit outside the v0.13 change note and the D36 and resolved-item text is consistent with D36. Slices 137, prompts 145 (unchanged); IDs 194 defined (FIX-32 new) | DM6-p4's old "tools/list equals the pre-v0.13 snapshot" check contradicted moving the 8 FDE tools; rewritten to "snapshot minus the Field-only tools" plus a 6-session plan matrix. DM6-p3's old rollback ("list every tool for every plan") broke FIX-32; it now falls back to the `fde_tools` check with the list and the call guard matched |
| `interrogate_plan` on v0.13.2 changed parts (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25, 2026 ~3:55 PM ET | One part, 17,197 chars: title, status and the v0.13.2 and v0.13.1 change notes; FIX-27, FIX-28, FIX-32 and PF-06 rows; all of §13q.2; batch DM6-p (DM6-p1 to DM6-p4) and the §18 count; the D36 row; the §20 still-open and resolved items. Valid, 0 blocking, 0 warnings, 0 findings, PROCEED. Also: grep for "Brian's answer", "access is open", "keep access" and "whose access"; the only hit is the v0.13.2 change note recording the dropped prerequisite. Slices 137, prompts 145 (unchanged) | None needed. D36 item 8 (hard cutover) closes the existing-users item; DM6-p3's rollback is unchanged and still needs Brian's say-so to re-open the 8 FDE tools to every plan |
| `interrogate_plan` on v0.13.3 changed parts (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25, 2026 ~6:25 PM ET | One part, 20,668 chars: title, header, checklist, status, the v0.13.3 change, the §8 rows, §13q.3's post-login paragraph, the §18 rules, the 15 new slices and 2 batch lines, the count line, D37 and the v0.13.3 UNCHECKED list. Valid, 0 blocking, 0 warnings, 0 findings; gate PROCEED. Also run on the design file (`ux-field-post-login.md` v0.2): `user_flow` confirmed READY_FOR_UX_IMPLEMENTATION; `cross_surface_check` ok after declaring the chooser's inputs; `slice_issues` 12 slices in band (S3–S4); `pressure_test` FieldHomePage 18 checks, 16 required; `interrogate_plan` 0 findings. Blueprint's own pass: a script over the §18 order finds 0 back-references for the 15 new slices; the only thresholds read are THR-15, CFG-TECH-17, CFG-NOTIFY-02, CFG-WS-12 and QB-01, all existing, read from policy; nothing deleted. | DM6-h6's list first drafted a health column that reads DM6-g1 (Stage 6B), a back-reference; health moved to DM6-i1 (Stage 6B) before the run |
| `interrogate_plan` on v0.13.4 changed parts (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25, 2026 ~6:45 PM ET | One part, 31,729 chars: title, status, the v0.13.4 change, FIX-32 to FIX-34, QB-03, the edited §9, §13q.2 and §16 lines, §16a, the 4 new and 9 edited slices, the count line, D36, D38, D39 and the v0.13.4 UNCHECKED list. Valid, 0 blocking, 0 warnings, 0 findings; gate PROCEED (deterministic lint only, not semantic approval). Contradictions found and fixed by hand before the run: (a) `delivery_map_save`/DM2-c4 ran the `CS-` plan rules inside the save, now core `interrogate_plan` scanners called through the registry; (b) `delivery_map_prompt_save`/DM3-a1/DM3-a4 ran prompt lint inside the save, now a core judge; (c) DM3-b1 and §16 put a new plan-scope comparison inside `delivery_map_report`, now a core judge (`delivery_map_conformance`, proposed); (d) §9 said the FDE tools "run in `aadm-backend`", which left scores, gaps, readiness, ready results, phase health and strip checks as backend logic, now `field`-tagged core judges stored with `judged_by`; (e) QB-03, FIX-32, §13q.2 and DM6-p4 hid the 6 judgment tools from Field-only users, now `shared`; (f) DM6-p2 kept a second tool-to-feature list, now read from the per-tool tag; (g) the §16 result line claimed no new computation, now says new logic goes to core. D36 item 3 is refined by D38, not reversed |
| `interrogate_plan` on v0.13.5 changed parts (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25, 2026 ~6:40 PM ET | One part, 22,631 chars: title, status, the v0.13.5 change, FIX-32, FIX-34, QB-03, the §9 paragraph, the five §13q.2 plan rows and tool-list bullet, §14 risk 16, D36, D39, D40, DM1-e5, DM6-p2, DM6-p3, DM6-p4 and the two §20 items. Valid, 0 blocking, 0 warnings, 0 findings; gate PROCEED (deterministic lint only). Repo evidence read-only on GitHub: aadm-mcp `main` `302e28fa68` (`src/mcp-auth.ts`, `src/mcp-server-factory.ts`, `src/index.ts`, `src/tools.ts`): no plan or feature check; all 15 `shared` tools registered for every session, so Free can call them today (§14 risk 16). Cutover left open for Brian; DM6-p3 waits on it |
| `interrogate_plan` on v0.13.6 changed parts (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25, 2026 ~6:45 PM ET | One part, 10,378 chars: title, status, the v0.13.6 and v0.13.5 change notes, §14 risk 16, D40, D40a, DM6-p3 and the closed §20 item. Valid, 0 blocking, 0 warnings, 0 findings; gate PROCEED (deterministic lint only). Map unchanged: no card title or done-when line changed |
| `interrogate_plan` on v0.13.7 changed parts (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25, 2026 ~7:15 PM ET | One part, 16,341 chars: title, status, the v0.13.7 change, the §13e and §13q.3 notes, batches DM6-g and DM6-i, DM6-g1, DM6-g2, DM6-g4 (context), DM6-g5, DM6-h5, DM6-i1, DM6-i2, D37 and D41. Valid, 0 blocking, 0 warnings, 0 findings; gate PROCEED (deterministic lint only). Design checks in `ux-field-post-login.md` v0.3 §8: `ux_surface_pass` READY_FOR_CHAIN; `user_flow` READY_FOR_UX_IMPLEMENTATION (confirmed, 0 blockers); `cross_surface_check` ok, 0 findings. Order script: 156 slices, 48 batches, 0 back-references |
| `interrogate_plan` on v0.13.8 changed parts (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25, 2026 ~8:00 PM ET | One part, 14,561 chars: title, status, the v0.13.8 change, §2 persona 4, §7 item 1, the §10 workspace and result-code bullets, the §13d contract window, DM0-b1, DM2-a1, DM5-a1, D4, D42, the v0.13.8 §20 items and the §21 order-check line. Valid, 0 blocking, 0 warnings, 1 info (no `guidance-feedback-seam` cite in this excerpt; that seam is cited in DM6-g1, outside the excerpt); gate PROCEED (deterministic lint only). Map unchanged: no card title changed |
| `interrogate_plan` on v0.13.9 changed parts (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25, 2026 ~8:25 PM ET | One part, 23,703 chars: title, status, the v0.13.9 and v0.13.8 change notes, all of §5.8 (CFG-BATCH-01 to -09 and the alias line), the §10 workspace and result-code bullets, the §13d contract window, the §13n name note, all of Stage 5 (with DM5-b4), the count line, D42 and the v0.13.8 and v0.13.9 §20 items. Valid, 0 blocking, 0 warnings, 1 info (no `guidance-feedback-seam` cite in this excerpt; it is cited in §8, DM3-b1 and DM6-g1, outside the excerpt); gate PROCEED (deterministic lint only, not semantic approval). Order script: 157 slices, 48 batches, 0 back-references; DM5-b is 4 slices (in the 2–4 range). Rename: 202 delivery-map uses of chunk became batch; the UNCHANGED names are listed in §20. Map re-rendered (same renderer, VISUAL-LINT J1) and checked by eye: batch tags, DM5-b4, DM2-a1 card, footer | DM2-a1 map card fixed (it still showed the dropped bootstrap) |
| `interrogate_plan` on v0.14 changed parts (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25, 2026 ~8:55 PM ET | One part, 49,827 chars: every line added or changed since v0.13.9 (title, status, v0.14 change note, D43 row, §8 actor, workspace_event and per-user entitlement rows, §9 judged_by and idempotency changes, §10 empty state, sub-codes and ADR 005 bullet, §13c, §13d, §13h.10, §13q.5, the 5 new and 18 edited slices, §20). Result: valid, 0 blocking, 0 warnings, 1 info (DOCTRINE_SILENT_ON_SEAM: cite aadm://doctrine/guidance-feedback-seam where guidance drawer UX is described; advisory, not new in v0.14). Gate: ADVISORY_REVIEW, human gate PROCEED; bind repo recon before S1. |
| `pressure_test` on two v0.14 surfaces, Oct 25, 2026 ~8:57 PM ET | (1) the workspace list and result-code contract (DM2-a1, DM2-a3; `contract`): 18 checks, required RC-02, RC-06, RC-RQ-01, RC-AUTH-01, RC-KEY-01, RC-EB-01, RC-GUIDANCE-01. (2) Field tools gated by the calling user's own plan (DM6-c1; `read_model`): 18 checks, adds RC-CONC-01, RC-ETAG-01, RC-POISON-01 as required. Fixes applied: DM2-a3 *Done* adds a shape-drift fixture and a no-empty-body check (RC-06, RC-02); DM6-c1 *Done* adds a two-user test and a per-user cache key for core's plan pre-check (RC-KEY-01). The rest are owned by the existing DM2-a1, DM2-a2 and web slices or are n/a for a server contract. |
| `grill_questions`, `pressure_test`, `interrogate_plan` and `replan_check` on the seven INV2 calls (`ref/inv2-decisions-aadm-input.md`), Oct 25, 2026 ~9:05 PM ET | AADM's rules pointed to an answer on 6 of the 7 calls: AUTH-54 (Drive), AUTH-15 and AUTH-38 (families), AUTH-44 and AUTH-54 (capability), AUTH-43 (CI gate), AUTH-29 (audit rows) and AUTH-41 with SEAM-14 (open-server guard). On the numbers (AUTH-25) it gave none, so Blueprint set defaults. `replan_check` returned STOP_AND_REPLAN (ASSUMPTION_INVALIDATED; SCOPE_ADDED: +4 batches, +9 slices). | Brian took all 7 (D44), and v0.15 is the replan. |
| `interrogate_plan` on v0.15 changed parts (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 25, 2026 ~9:18 PM ET | One part, 51,234 characters: every line added or changed since v0.14. Valid, with 0 blocking findings, 0 warnings and 1 info (DOCTRINE_SILENT_ON_SEAM: cite `aadm://doctrine/guidance-feedback-seam`). Gate: PROCEED; posture ADVISORY_REVIEW. | The info is already met in the full PRD: §8 and DM3-b1 cite the seam, but the excerpt didn't include them. Nothing to fix. |
| `replan_check` on v0.15 changed parts, Oct 25, 2026 ~9:19 PM ET | CONTINUE, with no reasons: "Nothing here says the plan has gone sideways. Continue." | This clears the earlier STOP_AND_REPLAN. Code slices can be prompted again, starting at DM0-a3. |
| `replan_check` on v0.16 Part A, Oct 26, 2026, ~6:46 PM ET (events: `scope_added` for D45 and D52; `assumption_invalidated` for FIX-12 and the web-editing non-goal) | `STOP_AND_REPLAN` (ASSUMPTION_INVALIDATED, SCOPE_ADDED), next tool `interrogate_plan`. This is expected: the events are the reason for v0.16 | The plan was revised into v0.16 (Part A, the new §18) and interrogated |
| `interrogate_plan` on v0.16 (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), ~6:46 PM ET, in 5 parts (the text is over the 64,000-character cap): Part A (38,800 chars); §18 Stages 0 to F2 (43,394); §18 F3 to F6 (38,771); §18 later stages and the fold table (47,347); §19 decisions (`prd`, 36,753) | All 5: valid, 0 blocking, 0 warnings, gate PROCEED. Each had 1 info, DOCTRINE_SILENT_ON_SEAM (cite `aadm://doctrine/guidance-feedback-seam` for the verdict drawer). 0 decision IDs extracted, because D-IDs aren't in the `DEC-` form | The seam is now cited in §A9 and F2-d1. Re-run on Part A and on Stages 0 to F2: 0 findings |
| `replan_check` on the revised v0.16, ~6:48 PM ET (no new events) | `CONTINUE`: "Nothing here says the plan has gone sideways. Continue." | none needed |
| Order script over §18 of v0.16, Oct 29, 2026 (the check every earlier version ran and v0.16 lacked; `order_check.py`: stage, batch and slice order, every ID in *In:*, *Absorbs* and the body, the fold table, batch sizes) | 157 slices, 55 batches, 6 done, 57 folded; **61 reference hits**: 35 in the Field core, of which 19 are real defects, references to a later or folded slice (DM6-g6's five inputs in 6A/6B or folded; DM6-p2 and DM6-c3 reading DM6-c1 in 6A; DM6-h2 and DM6-h9 reading DM6-a4 in F7; DM7-c1 reading DM3-a2/a3; DM7-c2 reading DM7-a4 after it; DM1-e4, DM1-e5, DM2-a3, DM0-e2, DM6-h1, h4, h8, h9 reading folded IDs) and 16 are forward mentions the slice already states; 20 later-stage *In:* or body references to folded IDs; 6 batch headers saying "after" a later batch; and, counted separately, F3-c with 1 slice and DM1-e with 5 | v0.16.1: DM6-g6 → F2-d (narrowed), F3-c1 → F3-b4, the `fde_tools` check → DM6-c3 → F5-s, DM6-a4 → F5-l, DM6-a5 → F5-s, DM5-a4 first in F5-x, every other folded ID repointed in place as `F<n>-x<k> (was DM…)`, rules R1 to R5. Re-run: 157 slices, **53 batches**, 6 done, 0 unexplained Field-core references (34 forward mentions accepted, each one stated in its slice as "until X lands", "was X" or "moved"); 2 later-stage items left and listed in §20 (DMT-b4 → DM2-m1; DM6-s after DM6-d) |
| `interrogate_plan` on the v0.16.1 changed parts (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 29, 2026 | One part, ≈38,800 chars: title, status, the v0.16.1 change note, §A15, the §10 sub-code line, the §18 rules R1 to R5, the 31 edited or moved slices and batch lines, the §18 count line, the §20 v0.16 and v0.16.1 UNCHECKED lists. **Valid, 0 blocking, 0 warnings, 0 findings; gate PROCEED** (deterministic lint only, not semantic approval). Extracted: AUTH-29, SEAM-08, `aadm://doctrine/batching-standard`, `aadm://doctrine/guidance-feedback-seam`. Tool fit read from the live schemas in the same session: `pressure_test` {component_name, surface_kind, flags}; `cross_surface_check` {contract_fields[producer_surface, consumer_surfaces], execution_bindings}; `grill_questions` {doctrine_uri}; `interrogate_plan` {plan_text ≤ 64,000, plan_kind contract/prd/implementation_plan} | None needed |
| `replan_check` on v0.16.1, Oct 29, 2026 (events: `assumption_invalidated` for `pressure_test` as a requirements linter; `assumption_invalidated` for the `/workspace/blueprint/...` fixture paths) | `STOP_AND_REPLAN` (ASSUMPTION_INVALIDATED), next tool `interrogate_plan`. Expected: the events are the reason for v0.16.1 | Rules R5 and R4 record them; the plan was interrogated (row above) |
| `replan_check` on the revised v0.16.1 (no new events; declared scope `docs/PRD-aadm-delivery-maps.md`, `docs/prompts/`) | `CONTINUE`: "Nothing here says the plan has gone sideways. Continue." | none needed. Next prompt: `docs/prompts/prompt-DM0-a3.md` (v0.16.1 rewrite) |
| Order script over §18 of v0.17, Oct 29, 2026 (`docs/scripts/order_check.py`, now in the repo with the v0.17 accepted list) | 158 slices, 54 batches, 6 done, 57 folded, 0 batch-size violations. 57 reference hits: 55 are stated forward mentions (the moved-in and moved-out notes on batch headers; DM0-c2 reading the draft before DM0-c1; F1-a1's minimal runner before DM1-c4; DM1-e4 before DM1-e3 and F2-b0; F2-b0 naming F3-b3; F2-c3 naming F1-b1), and the residue is the same 2 later-stage lines as v0.16.1 (DMT-b4 reads DM2-m1; DM6-s after DM6-d). | 0 unexplained Field-core references after the reflow to Stages V and H. The JSON sidecar `docs/aadm-delivery-maps-map.json` (from `docs/scripts/render_delivery_map.py`) gives the same counts and You are here on DM0-a3. |
| `interrogate_plan` on the v0.17 changed parts (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 29, 2026 | One part, ≈37,600 chars: status, the v0.17 change note, the §A4 and §A7 additions, §A15 and §A16, the §18 header and order note, all of Stage V (headers, batch lines, F2-b0 in full, the other slices' first lines and every edited line), Stage H, the F8 header and batch lines, the count line, D53 and the §20 v0.17 list. Valid, 0 blocking, 0 warnings, 1 info (DOCTRINE_SILENT_ON_SEAM, the same info v0.15 drew: cite `aadm://doctrine/guidance-feedback-seam` where a drawer is described; F2-d1 already does, outside the excerpt). Human gate: PROCEED. | Nothing to change. |
| `replan_check` on v0.17, Oct 29, 2026 (events: `assumption_invalidated` for the breadth-first v0.16 order; `scope_added` for F2-b0, Stage F8 and §A16; declared scope the PRD, the two scripts, the PNG and its JSON) | `STOP_AND_REPLAN` (ASSUMPTION_INVALIDATED, SCOPE_ADDED), next tool `interrogate_plan`. Expected: the events are the reason for v0.17, and the interrogation above is the revised plan's. | Re-run on the revised plan with no new events: `CONTINUE`, "Nothing here says the plan has gone sideways." Code slices can be prompted again, starting at DM0-a3. |
| Order script over §18 of v0.18, Oct 29, 2026 | 158 slices, 54 batches, 6 done, 0 batch-size violations; 57 accepted stated forward mentions (v0.18 adds F2-b0's order-check example, DM0-b's and F4-g's move notes, H-a naming F1-b1); residue the same 2 later-stage lines. | 0 unexplained Field-core references after Stage V was cut to the loop and F4-g added. |
| `interrogate_plan` on the v0.18 changed parts (`implementation_plan`, `pre_s1`, `workflow_id: delivery`), Oct 29, 2026 | One part, ≈24,600 chars: the v0.18 change note, §A16 principles 1 and 7, rule R6, the Stage V header and DM0-b, F4-g in full, the five fleet-foundation slices (F1-a1, F1-a3, F2-c1, F2-c2, F2-d1) and F2-b0, D54 and the §20 v0.18 list. Valid, 0 blocking, 0 warnings, 1 info (DOCTRINE_SILENT_ON_SEAM, as before). PROCEED. | Nothing to change. |
| `replan_check` on v0.18, Oct 29, 2026 (events: `assumption_invalidated` for the attestation framing and the guard slices in Stage V; `scope_added` for the fleet foundation, F4-g and the history file) | `STOP_AND_REPLAN`, expected: the events are v0.18's reason. Re-run on the revised plan with no new events: `CONTINUE`. | Code slices can be prompted again, starting at DM0-a3. |
| Order script over §18 of v0.19, Oct 29, 2026 | 160 slices, 55 batches, 7 done, 0 batch-size violations; 62 accepted stated forward mentions (v0.19 adds F1-a1's nullable `release` until DM0-b4, F1-a3 naming DM0-d1, and DM0-j's header naming DM0-b1, F1-a1 and F1-a3); residue the same 2 later-stage lines. | 0 unexplained Field-core references after DM0-j and the R7 clauses. |
| Invariant recon, Oct 29, 2026 (aadm-mcp `docs/ARCHITECTURE_INVARIANTS.md` at `b626e4b`, 164 lines, 120 rules; aadm-website `docs/INVARIANTS.md`, 55 lines, 43 rules) | Request IDs, event rows, JSON logs, release and secret-free logs were covered; UUIDs, version-row trace fields, the Stage V ordering of `request_id`, the agent-worker hop, metrics and Field's measures were not. | §A17, rule R7, DM0-j, and the v0.19 clauses in F1-a1, F1-a3, F1-a4, F2-d1, DM0-d1 and F5-a3. |

**My own pressure test:**
- **Circular prerequisites (fixed):**
  - Next-slice needed a go button that only existed in stage 5, so a minimal Go button moved to DM3-a2.
  - Plan save needed a signed cornerstone, so a minimal Sign page moved to DM2-b3.
  - The export needed renders that didn't exist yet, so DM2-c3 exports data only and DM4-a2 adds renders.
- **Stray docs (fixed):**
  - The BIS template extension now has its slice (DM2-b1).
  - The ADR is named (DM0-a2).
  - The `interrogate_plan` extension has its slice (DM2-c1).
- **Unset thresholds:** none. There are 61 numeric THR rows (THR-1 to THR-61: THR-14 to THR-30 added in v0.5, THR-31 to THR-33 in v0.6, THR-34 to THR-52 in v0.7, THR-53 to THR-58 in v0.8, THR-59 to THR-61 in v0.9), and the only `TBD` text is inside the rules that forbid it or name the scanner that finds it.
- **v0.5 circular-prerequisite check (D4 rework):**
  - ~~The personal workspace is bootstrapped in DM2-a1~~ **(v0.13.8, D42)** No workspace is bootstrapped; DM2-a1's explicit create-workspace route makes the personal workspace, so no slice before stage 6 needs invites or customer workspaces. Its screen state lands in DM5-a1; before stage 5, tests use that route or seeded rows.
  - DM2-b3's FDE co-sign needs an `acceptor` member, who arrives by invite only in DM6-a2. Not a cycle: DM2-b3 tests co-sign with seeded member rows, and no real customer workspace exists before DM6-a1.
  - DM6-a2's `coder` invitee relies on role enforcement from DM2-a1 and the `next_slice`/`report` tools from DM3; both come earlier. DM6-a3 relies on DM1-a2 bindings and DM6-a2 members; both come earlier. No new cycles.
- **v0.5 circular-prerequisite check (data, models, Terrain):**
  - DM1-c (seam) needs DM1-b tables; DM1-d (Terrain tables) sits behind the DM1-c seam. Both before C1.
  - DM2-t needs DM2-a auth and DM1-d tables, and runs before DM2-b, so DM2-b2 can enforce handoff check 8.
  - Stage T needs DM2-t (tools) and DM5-a1 (member-area Plans shell). Nothing before Stage T needs crawl or import, because DM2-t1 accepts hand-entered allowlisted facts.
  - DM7-a1's Terrain replan needs `slice.terrain_fact_ids[]` (DM1-d2) and real facts (Stage T); both come earlier.
  - Stage 8 needs the DM1-c seam, DM1-a1's issuer/subject key and the export (DM2-c3, DM4-a2). All earlier. No cycles.
  - v0.6 containers and portability: DM0-b needs nothing new (existing handler modules); Terrain (DM2-t, Stage T) and the transpose (DMT-c) are built into `aadm-fde` after DM0-b; Terrain writes go to the core plans API (DM2-a) earlier in order. DM1-c (ports, runner) now runs before DM1-a, so every table is built through the ports; DM1-e needs DM1-a..d; DM7-a4 needs export/import (DM2-c3). No cycles.
  - v0.6 (D13): the gap view (DMT-c3) needs a signed cornerstone's `UDALI-T*` targets while the cornerstone cites Terrain. Resolved with both guards in §13b.6: current-only until a version is signed, and gaps reach a cornerstone only by amendment. Build order already puts DM2-b3 (sign) before Stage T. No cycle; nothing is purple.
  - v0.7 (FDE workspace): build order is DM2-o (outcomes) → DM2-b (cornerstone tools call the DM2-o2 checker) → Stage T (DMT-b3 adds Terrain sections 13–15) → DM5-c (outcome UI) → Stage 6A: DM6-a workspaces → DM6-b sharing → DM6-c governance and stakeholders (first `fde_tools` check) → DM6-s Speed Layer → Stage 6B: DM6-d readiness assessment (reads all of these) → DM6-e gates and reassessment (needs the register from DM6-d1) → DM6-f use cases and pilots (need outcomes, Speed Layer boxes, risks and access) → DM6-g value-stream home (reads everything) → DM7-b measure checks (feed risk reviews from DM6-e2). Each step reads only earlier ones.
  - v0.11 (settings, D29): DM1-f1 needs only DM1-c4 and DM1-a1, so every later checker (DM2-c4, DM3-a4, DM6-d2, DM6-u2 and the rest) reads its values from the resolver; DM1-f2 follows DM1-f1; the Settings page DM5-a3 needs DM1-f2, DM5-a1 and DM2-a1. 0 back-references.
  - v0.12 (D30, D31): DM1-e3 needs DM1-c2 (the ports it guards) and DM0-b2 (forwarding and `storage_unavailable`), both earlier; DM6-c3 needs DM6-c1, DM0-b2 and DM1-c4, all earlier. Every save slice from DM2 on runs in `aadm-backend` with no new dependency. The order check finds 0 back-references across 112 slices.
  - v0.13 (D33–D35): DM5-a4 needs only Producer's copy; DMT-d1 needs DM2-t1; DMT-d3 needs DMT-b2; DM6-p1 (Brian) comes first in DM6-p and DM6-p2 to DM6-p4 follow it, all after DM6-c; DM6-w needs DM6-s1, DMT-d and DM6-p3, all earlier; Stage 6C needs Stage 6B's health, risk, pilot and verdict data. The order check finds 0 back-references across 137 slices.
  - v0.13.3 (D37): DM5-a5 needs only existing member-area code; DM6-a4 needs DM1-c4; DM6-a5 needs DM6-a1; DM6-h1 to DM6-h9 need DM6-p1 to DM6-p3, DM6-a1, DM6-a4, DM6-a5, DM5-a5 and earlier DM6-h slices, all earlier; DM6-g5 needs DM6-g1 and DM6-g2; DM6-i1 and DM6-i2 need DM6-g1, DM6-g2, DM6-g5, DM6-a5 and DM6-h6, all earlier. 0 back-references (script over the §18 order).
  - v0.13.4 (D38, D39): DM1-e4 needs DM0-b2 and DM1-e3; DM1-e5 needs DM1-e4; DM3-b4 needs DM1-e4, DM2-b2, DM2-c2, DM2-c4, DM3-a1, DM3-a4 and DM3-b1; DM6-g6 needs DM1-e4, DM6-s1, DM6-d1, DM6-d2, DM6-u2 and DM6-g1, all earlier. The edited Stage 2, 3 and 6A slices use DM1-e4 and DM1-e5 from Stage 1. 0 back-references (script over the §18 order).
  - Runtime loop vs build order: the value stream loops at run time (a measure miss reopens Strategy), but each loop-back is a status flag or review mark on already-built tables. No slice needs a later slice to exist.
  - Sign vs readiness: the sign gate (DM6-e1) extends DM2-b3's Sign page. Relevance uses only cornerstone items before sign-off and slices after the map exists (§13h.2), so the sign gate never needs a map.
  - Pilot vs access: a pilot's start gate reads `ACC-` rows (DM6-d1), which exist before DM6-f2.
  - **v0.8 order check** (also run as a script over the §18 order; 0 back-references):
    - DM0-c1 → DM0-c2 (Stage 0);
    - → DM2-c4 (needs DM0-c2, DM2-c1, DM2-c2);
    - → DM2-m1 (needs DM2-b2) → DM2-m2 (needs DM2-m1, DM2-c4);
    - → DM3-a4 (needs DM0-c2, DM3-a1, DM3-a3);
    - → DM3-b1, which gains the host-file DRIFT reason (needs DM2-m2) → DM3-b3 (needs DM3-b2);
    - → DM5-b3 (needs DM2-m, DM3-a4, DM3-b3, DM5-b1);
    - → DMT-b4 (needs DM2-m1, DMT-a2, DMT-b1);
    - → DM6-d4 (needs DM6-d2, DMT-b4, DM6-c2, DM2-m1) → DM6-f1 (gains `delivery_mode`; needs DM2-m1);
    - → DM6-g4 (needs DM6-g1 and DM5-b3; it colors DM5-b3's tabs, which show gate state on their own until then);
    - → DM7-a3 (its import writes `set_by = import` verdicts, needs DM3-b3).

    Each step reads only earlier ones. No cycles, and DM0-a3 and DM0-b1 are unchanged.
  - **v0.9 order check** (also run as a script over the §18 order):
    - DM6-f1 → DM6-f2 … DM6-f4 → DM6-u1 (needs DM6-f1, DM2-o1, DM2-o3, DM2-t1, DM2-m1, DM6-s1, DM6-c1, DM6-c2, DM6-d1, DM6-d2) → DM6-u2 (needs DM6-u1) → DM6-u3 (needs DM6-u1, DM6-u2, DM5-b3, DM6-s2, DM6-e3);
    - → DM6-v1 (needs DM6-u2, DM1-c4, DM1-b1) → DM6-v2 (needs DM6-v1, DM6-c2, DM2-a1, DM2-b3) → DM6-v3 (needs DM6-v2, DM2-b2, DM2-m1, DM6-f2) → DM6-v4 (needs DM6-v1, DM6-v2, DM6-u3);
    - → DM6-g3 (now also needs DM6-v1–v3) → DM6-g4 (now also needs DM6-u3, DM6-v2) → DM7-a1 (now also reads approved use-case versions from DM6-v2).
    - Run order vs build order: Use case runs first in an engagement but is built last of the five Plan capabilities. Check 14 is added to `cornerstone_save` by DM6-v3 and applies only to `fde_tools` workspaces, so DM2-b2 and every cornerstone before DM6-v3 need nothing from it.

    Each step reads only earlier ones. No cycles, and DM0-a3, DM0-b1 and the done slices DM0-a1 and DM0-a2 are unchanged.
- **Deletions:** no existing code is deleted. Retention hard-delete takes an export first.

