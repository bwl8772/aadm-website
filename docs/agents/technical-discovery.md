# Agent: Technical Discovery

`agent_id: technical-discovery` · group **Discovery** (order 2) · hat **Architect** · status: contract draft, Oct 30, 2026.

## 1. Purpose

Establish what the customer runs today: systems, versions, owners, hosting, integrations and data sources, with the questions still open. Produces the **technical assessment** and fills the lay-of-the-land inventories that Solution Architect and Cornerstone build on. It assesses readiness to adopt; it is not infrastructure monitoring (FLD-01 to FLD-04).

## 2. Contract

| Field | Value |
|---|---|
| `verbs` | iterate (technical assessment drafts), challenge (relationship rows against existing contracts) |
| `tools` | `evidence.ingest`, `evidence.chunk`, `evidence.embed`, `evidence.retrieve`, `inventory.read`, `artifacts.get`, `web.search` (5 per run, vendor docs only), `web.scrape` (3 per run), `render.image` (stack diagram), `render.document` |
| `context_pack` | discovery brief, inventories (tech stack, integrations, data sources, AI tools), existing technical assessment versions, open questions, uploads in this run |
| `consumes` | uploads (stack exports, architecture docs, API docs), `discovery_brief` |
| `produces` | `technical_assessment`; inventory build proposals (tech stack, integrations, data sources); `architecture_decision` inputs (current-state diagram) |
| `decision` | engineer approves `technical_assessment` |
| `starter_prompts` | "Build the tech stack inventory from this export." · "What integrations will the intake change touch?" · "Draw the current-state diagram." |
| `status_source` | open technical questions count, else newest `technical_assessment` state: "2 open questions", "Assessment v0.1 draft" |

## 3. Process steps

1. **Receive and ingest** uploads (spreadsheets become one table per sheet). `message` entry listing what was read.
2. **Read inventories** with `inventory.read`; read the brief with `artifacts.get`.
3. **Extract facts.** `evidence.retrieve` per inventory question (what system, version, owner, hosting, data it holds, who integrates with it). Each fact cites a chunk. A fact with no source is marked `unverified`, never guessed (doctrine: a claim without evidence is unverified).
4. **Vendor facts from the web** only for public product documentation (end-of-life dates, API limits); each hit ingested as Evidence.
5. **Draft the assessment** as a `draft` entry: Systems (table), Integrations, Data sources, Risks and unknowns, Questions for the customer (with role). Propose inventory rows as separate `draft` entries typed by inventory so the person can save each.
6. **Diagram.** `render.image` from a node-and-edge list of the current state; the draft links the render. The image is a render file until saved into the assessment as a `diagram` block.
7. **Relationships.** When a Cornerstone draft exists, run `challenge` to produce relationship rows (owns, feeds, must approve, cannot do) and flag any second owner of the same data (PRD story 3).
8. **Save is the person's.** Approve is offered, never performed. Hand forward to Solution Architect with the open unknowns listed. Stop.

Stop conditions: no export and no inventory (ask for one, stop); customer-role actor; budget.

## 4. Prompts

**System prompt:**

> You are Technical Discovery for one customer engagement. You record what the customer runs today from the sources you were given, one fact per row, each with its source. Anything you cannot source is `unverified`. You do not recommend a target architecture; you describe the current one and name the unknowns. You do not assess uptime, health or infrastructure operations. You draft; a person approves. One short paragraph of reasoning for the engineer, no more. No credentials, raw prompts or restricted text.

**Step prompts:**

- Inventory: "From the sources, list each system as a row: name, version, owner, hosting, data held, integrates with, source. Mark missing cells `unverified`."
- Assessment: "Write the technical assessment with the five sections. Risks and unknowns must each name what evidence would resolve them."
- Diagram: "Produce a node-and-edge list of the current state: one node per system, one edge per integration with its direction and data."

**Output shape:** `draft` entries (assessment; one per inventory); `tool_call` entries; a render href in the draft.

## 5. Rail status line

Open technical questions (from the assessment's Questions section) when any; else the newest assessment version state. Tone: warning when questions block the Cornerstone, neutral otherwise. Server-computed.

## 6. Rules that bind

- Readiness means customer adoption readiness, never infrastructure ops (FIELD-CONTRACTS.md §3; FLD-01 to FLD-04).
- Inventories are not artifacts; their save path is `inventory.build` (no verb yet, FIELD-WORKBENCH.md §7).
- What the agent proposes (assessment, inventory rows, unknowns) is shown exactly as the backend returned it (one voice, RC-GUIDANCE-01; `aadm://doctrine/guidance-feedback-seam`).
- Relationship rows are write-once attachments on the Requirements version (D51).
- The approve Decision binds to one version and its content hash and is taken on a website page in a signed-in human session; a new version voids it (CAP-03, ARCH-14 in `docs/INVARIANTS.md`; FIX-03, FIX-04 in the PRD).

## 7. Acceptance checks

1. A spreadsheet upload with two sheets yields two tables in the Evidence and inventory rows that cite the sheet and row.
2. Every `unverified` cell in the draft has no source; every sourced cell has one.
3. `challenge` on a seeded second owner of one field flags it as blocking (PRD story 3).
4. The diagram render is hash-stable for the same node-and-edge list.

Proof: checks 1 to 4 are agent-worker tests in aadm-mcp (backend mode) and are not claimable from this repo. This repo proves only that the rail row, the status line and every entry type the run emits parse and render (`scripts/field-contract.test.mjs`, the Workbench fixture), and that this definition's tools, verbs and `produces` are in the registers (FIELD-AGENT-TOOLS.md §7, to add).

## 8. Open questions

1. Does Terrain (PRD §13, later stage) replace the inventories, or feed them?
2. Who owns inventory rows the customer corrects: a new inventory version, or an Evidence row?
