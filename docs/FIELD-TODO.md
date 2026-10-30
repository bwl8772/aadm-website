# Field: loose ends and code smells

Oct 30, 2026. Working list for the Field web shell (`src/components/field/`, `src/pages/field/main/`). Delete each line when it is done.

## Loose ends

### Decisions and docs
- [ ] Commit the uncommitted docs: `PRD-aadm-delivery-maps.md` (v0.20), `contracts/FIELD-MY-FIELD.md`, `contracts/FIELD-WORKSPACE.md`, `contracts/FIELD-ARTIFACTS.md`, `contracts/FIELD-AGENT-TOOLS.md`, `agents/*.md`.
- [ ] The PRD copy on the Desktop is v0.16; the repo copy (v0.20) is current. Retire or refresh the Desktop copy.
- [ ] `FIELD-CONTRACTS.md` §11 read models (`getFieldHome` with `critical_path`, `waiting_on_you`, `customer_commitments`) no longer match `MyFieldView`. Update or mark superseded by `contracts/`.
- [ ] `FIELD-VISION.md` points at `.tmp/field-*-mock.html`; the real mock sources are the Desktop PNGs and zips. Fix the pointer.
- [ ] Migrations safe to re-run: add to F1-a1's done-check (one transaction per file, `IF NOT EXISTS`, refuse an edited file, run twice gives the same schema). None exist yet in either repo. `npm run check` already runs `scripts/migration-guard.mjs`, which fails a migration that bumps a version counter without a content guard; it also needs to run in aadm-mcp, where the migrations will live.
- [ ] PRD §20 v0.20 items: Clerk org ↔ workspace, model key per engagement or workspace, Slack channel for a multi-workspace engagement, restating TEN-06 and ARCH-01 in aadm-mcp.
- [ ] Open questions in `contracts/FIELD-ARTIFACTS.md` §4 (4), `contracts/FIELD-AGENT-TOOLS.md` §8 (5) and each `agents/*.md` §8 need Brian's answers; the first two decide whether agent definitions and the doctrine's recon artifacts become PRD nouns. Answered Oct 30, 2026: Terrain feeds the inventories (technical-discovery §8 q1).

### Contracts not yet in code
- [ ] States: Loading skeleton and Forbidden. The Unavailable text on My Field is still written by the client.
- [ ] Uploads and Capture: the same-origin uploads route that forwards to `POST /api/v1/engagements/{engagementId}/uploads`, then `capture.create`.

### Agents and artifacts (contracts written Oct 30, 2026; no code by instruction)
- [ ] `fixtures/studio.fixture.ts` uses `type: "prompt"` and `create_types` ids `prompt`, `requirements`, `roadmap`, `evidence`; they must become `coder_prompt`, `cornerstone`, `delivery_plan`, `acceptance_evidence` (`FIELD-ARTIFACTS.md` §3).
- [ ] Contract test: `FDE_ARTIFACTS` ids ⇔ the `FIELD-ARTIFACTS.md` §2 table; every fixture artifact `type` ∈ register; `parseArtifactBody` id-pattern rejections.
- [ ] Zod refinements: `value_demonstrable: "yes"` needs a named `eval_owner` (`OutcomeDefinitionBodySchema`, `EngagementContractBodySchema`); `ownership_transferred: "yes"` needs a transfer package item `runnable_without_fde: "yes"` (`EngagementVerdictBodySchema`).
- [ ] Agent definition schema (`FIELD-AGENT-TOOLS.md` §4) and one fixture per `docs/agents/*.md`; the contract test asserts tools ⊆ tool register, `produces` ⊆ artifact register, no `sign off`, `go` or confirm verb.
- [ ] Workbench `agent_groups` fixture generated from the definitions fixture, not written by hand.
- [ ] `field_learning` has no register row; decide (open question) before the Field Learnings definition can be checked.

### Verification
- [ ] A signed-in visual check of all three screens has never been done. Needs `MEMBER_SMOKE_STORAGE_STATE` for the smoke's signed-in half. The Oct 30 SSR render check (esbuild bundle, clerk stub) covered workspace, workbench and studio built/stream/map/empty, but not a live session.
- [ ] Review My Field against FLD-02: the summary counts, filter counts, "Blocked" pills and lens chips must sit below the action, never lead.

## Code smells

### Actions written in the client, not sent by the server
The contracts say the client shows only actions the server sent. Still hard-coded:
- [ ] `FieldHeader.tsx:65` Capture (gated by `captureAvailable`, but not an Action).

### Content written in the client
- [ ] `home/EngagementCard.tsx:50` "Lay of the land" label for `land_label`. Inventories are not in the PRD yet.

Fixed chrome (table column headings in `home/ActionsPanel.tsx`, "Agents", "Collections", "Pinned", "Connected", "Thinking", screen-reader labels) is fine.

### React keys from labels, not ids
Duplicate labels will collide and labels can change. Use server ids:
- [ ] `home/EngagementCard.tsx:43`, `home/ContinueCard.tsx:20`.
