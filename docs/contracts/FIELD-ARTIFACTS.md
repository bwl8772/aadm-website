# AADM Field Contract: FDE Artifact Register

Status: working contract and progress register. Oct 30, 2026.
Code: `src/components/field/field-artifacts.ts` (zod body per type, one register entry per type). The contract test (`scripts/field-contract.test.mjs`) must fail when this table and that file list different types; that assertion is not written yet (§3).
Where the rule ids live: `ARCH-*`, `BACK-*`, `RES-*`, `FLD-01 to FLD-04` are `docs/ENGINEERING_RULES.md`; `CAP-03`, `ARCH-14`, `ART-02`, `FLD-02` are `docs/INVARIANTS.md`; `FIX-*`, `CFG-*` and `D` numbers are the PRD.
Companions: `docs/contracts/FIELD-STUDIO.md` (how a version is shown), `docs/contracts/FIELD-AGENT-TOOLS.md` (who produces it and with what), `docs/agents/*.md` (one per agent).

## 1. Purpose and rules

An **FDE artifact** is one versioned record a forward-deployed engineer produces, has produced for them by a specialist agent, or has a named person sign. This register is the single list of those types. Every artifact a Field screen shows, an agent drafts or a verb saves has a `type` from this list; the Studio's `create_types` is a filtered copy of it.

Rules that bind every type (from the PRD §A3 and `docs/ENGINEERING_RULES.md`):

- **Versions, never edits.** Every save is version N+1 with author, client, source link, parent and content hash. "Approved", "signed" and "published" are Decisions that point at one version and hash, never a flag on a row (FIX-04, ARCH-14). A Decision is taken on a website page in a signed-in human session (CAP-03); a new version voids it, and the website reads every version id from the reply's `saved[]` (ART-02).
- **People-only Decisions.** The `decision` column names what freezes a version (`approve`, `sign`, `go`, `confirm`). An agent drafts; a person decides (FIX-03).
- **The body is the record; blocks are the picture.** The zod `body` in `field-artifacts.ts` is what a verb writes and a check reads. The Studio shows a version as `blocks` (FIELD-STUDIO.md §3); `blocks_require` lists the block kinds a rendered version of that type must carry. The website renders both; it derives neither (ARCH-05).
- **Visibility is explicit.** `default_visibility` is the server's starting value. Nothing becomes customer-visible by being attached to an engagement (FIELD-CONTRACTS.md §9).
- **One voice.** A draft, a suggested verdict or a next step attached to a version is shown as the backend returned it; the website never rewrites it (RC-GUIDANCE-01; `aadm://doctrine/guidance-feedback-seam`).
- **Unknown types render, never crash.** A `type` not in this list still shows its `type_label` and blocks; the register lookup is optional for display and required for writes (RES-05).

## 2. The register

Stages are the doctrine's five (`aadm://doctrine/fde-engagement`): decidability → contract → fenced build → calibration → transfer. Lens is the concurrent lens the artifact mostly serves (FIELD-CONTRACTS.md §3).

| Type id | Label | Source | PRD noun | Stage | Lens | Producer agent | Acceptor | Decision | Default visibility |
|---|---|---|---|---|---|---|---|---|---|
| `engagement_contract` | Engagement contract | doctrine | Vision + Engagement | contract | strategy | outcome-architect | eval_owner | sign | customer |
| `acceptor_map` | Acceptor map | doctrine | (none) | contract | governance | business-discovery | sponsor | sign | customer |
| `gate_register` | Gate register | doctrine | (none) | decidability, kept live | governance | evidence-reviewer | (none) | (none) | internal |
| `transfer_package` | Transfer package | doctrine | (none) | transfer | adopt | adoption-lead | internal_successor | sign | customer |
| `engagement_verdict` | Engagement verdict | doctrine | (none) | transfer | governance | evidence-reviewer | eval_owner | confirm | customer |
| `use_case` | Use case | PRD §13o | Idea → Vision (`UC-n`) | decidability | strategy | business-discovery | sponsor (+ eval_owner co-sign) | sign | customer |
| `discovery_brief` | Discovery brief | contracts §9 | Idea | decidability | strategy | business-discovery | engineer | approve | internal |
| `technical_assessment` | Technical assessment | contracts §9 | (none; Terrain later) | decidability | readiness | technical-discovery | engineer | approve | internal |
| `outcome_definition` | Outcome definition | contracts §2 | Vision | contract | strategy | outcome-architect | eval_owner | sign | customer |
| `architecture_decision` | Architecture decision | contracts §9 | (none) | contract | plan | solution-architect | engineer | approve | internal |
| `cornerstone` | Cornerstone (requirements) | contracts §9 | Requirements | contract | plan | cornerstone | sponsor (+ customer co-sign, C1) | sign | customer |
| `delivery_plan` | Delivery plan | contracts §9 | Roadmap, Stages, Batches, Slices | fenced build | plan | delivery-planner | engineer | approve | internal |
| `coder_prompt` | Coder prompt | PRD | Prompt | fenced build | plan | delivery-planner | engineer | go | internal |
| `coder_report` | Coder report | PRD | Run | fenced build | plan | (coder, through MCP or paste) | (none) | (none) | internal |
| `acceptance_evidence` | Acceptance evidence | contracts §9 | Evidence + Verdict | calibration | plan | evidence-reviewer | eval_owner | confirm | internal until published |
| `adoption_package` | Adoption package | contracts §9 | (none) | transfer | adopt | adoption-lead | operator | approve | customer |
| `map` | Delivery map | PRD | Map | fenced build | plan | (render map verb) | (none) | (none) | internal |
| `speed_layer_canvas` | Speed Layer canvas | mock | (none) | decidability | strategy | business-discovery | engineer | approve | internal |
| `api_payload_spec` | API payload spec | mock | Requirements (attachment) | contract | plan | solution-architect | engineer | approve | internal |
| `jira_tickets` | Jira tickets | mock | (none; trackers are a later client) | fenced build | plan | delivery-planner | (none) | (none) | internal |

Mock labels that map onto a register type, so the fixtures stop inventing types: "Tech stack inventory" → `technical_assessment`; "Recommendation" and "Architecture diagram" → `architecture_decision`; "Process doc" → `adoption_package`; "Acceptance evidence" → `acceptance_evidence`.

Not artifacts: the lay-of-the-land **inventories** (tech stack, people, processes, AI tools, data sources, integrations, risks) are a separate record with no PRD noun yet (FIELD-WORKBENCH.md §7). They feed `technical_assessment` and `discovery_brief` and are not versioned artifacts in this register.

## 3. Progress

One row per type. A column is ticked only when the thing exists in the repo named; a tick is not a ship claim.

| Type id | Zod body | Fixture | Studio render | Writes through | Backend |
|---|---|---|---|---|---|
| `engagement_contract` | typed | no | no | iterate (Vision) + engagement fields | no |
| `acceptor_map` | typed | no | no | (no verb yet) | no |
| `gate_register` | typed | no | no | (no verb yet) | no |
| `transfer_package` | typed | no | no | (no verb yet) | no |
| `engagement_verdict` | typed | no | no | (no verb yet; confirm Decision) | no |
| `use_case` | typed | no | no | use case save and submit (§13o) | no |
| `discovery_brief` | blocks | rail row + canvas draft | draft card only | iterate | no |
| `technical_assessment` | blocks | rail row ("Tech stack inventory") | no | (no verb yet) | no |
| `outcome_definition` | typed | map node only | no | iterate (Vision) | no |
| `architecture_decision` | blocks | rail rows | no | challenge (relationship rows) | no |
| `cornerstone` | typed | rail status only | no | iterate, challenge, sign off | no |
| `delivery_plan` | typed | no | no | plan roadmap, batch | no |
| `coder_prompt` | typed | full version (Studio built, stream, map) | yes, all three views | write prompt, go | no |
| `coder_report` | typed | map node only | no | submit report | no |
| `acceptance_evidence` | typed | rail rows | no | judge + confirm | no |
| `adoption_package` | blocks | rail row ("Process doc") | no | (no verb yet) | no |
| `map` | typed | no | no | render map | no |
| `speed_layer_canvas` | blocks | rail row | no | (no verb yet) | no |
| `api_payload_spec` | blocks | rail rows | no | (no verb yet) | no |
| `jira_tickets` | blocks | rail row + output row | no | (tracker client, later) | no |

Known drift to fix in code (not done, by instruction: contracts first):

- `fixtures/studio.fixture.ts` uses `type: "prompt"` and `create_types` ids `prompt`, `requirements`, `roadmap`, `evidence`. They must become `coder_prompt`, `cornerstone`, `delivery_plan`, `acceptance_evidence`.
- The contract test does not yet assert that every fixture artifact `type` is in the register, or that this table and `FDE_ARTIFACTS` list the same ids.
- `OutcomeDefinitionBodySchema` and `EngagementContractBodySchema` accept `value_demonstrable: "yes"` with `eval_owner` unassigned; the doctrine says that is never `yes`. A refinement is needed (the Outcome Architect's check 4 depends on it).
- `EngagementVerdictBodySchema` accepts `ownership_transferred: "yes"` with no transfer package item `runnable_without_fde: "yes"`. A refinement is needed (the Evidence Reviewer's check 4 depends on it).

### Acceptance checks

1. `FDE_ARTIFACTS` and the §2 table list the same type ids, in any order. Proof: `scripts/field-contract.test.mjs` (to add).
2. Every artifact `type` in `src/components/field/fixtures/*.fixture.ts` is in the register. Proof: the same test (to add); fails today on `prompt`.
3. `parseArtifactBody` rejects a `cornerstone` item whose id does not match `REQ|AC|INV|THR|C|HC-n`, a `use_case` without `UC-n`, and, once refined, the two bodies above. Proof: a node test over `field-artifacts.ts` (to add); the id patterns hold today.
4. The Studio renders a version whose `type` is not in the register with its `type_label` and blocks and no error. Proof: the Studio fixture's unknown-kind block and the Studio contract test (exists).

Replan trigger: a PRD decision on open question 1 or 4 adds or removes a row here, which fails check 1 until the table, `FDE_ARTIFACTS` and the fixtures agree again.

## 4. Open questions

1. Which of the doctrine's five recon artifacts become PRD nouns, and which stay host records on the Engagement? (`acceptor_map`, `gate_register`, `transfer_package`, `engagement_verdict` have no noun.)
2. Is `engagement_contract` one artifact or a read model over Vision + Engagement fields + acceptor map? The doctrine treats it as one paste-back document.
3. Who signs `transfer_package` when `internal_successor` is `unassigned`? The doctrine says the gate stays open; the register needs the Field behaviour (block transfer, or sign with a named gap).
4. Do `speed_layer_canvas`, `api_payload_spec` and `jira_tickets` get nouns, or stay blocks-only attachments on Requirements and Roadmap?
