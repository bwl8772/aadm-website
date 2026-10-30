# Agent: Business Discovery

`agent_id: business-discovery` · group **Discovery** (order 1) · hat **Product owner** · status: contract draft, Oct 30, 2026.
Register: `docs/contracts/FIELD-AGENT-TOOLS.md` §4. Artifacts: `docs/contracts/FIELD-ARTIFACTS.md`.

## 1. Purpose

Define the customer's workflow as it is today, surface the unresolved questions, and turn workshop notes and uploads into a **discovery brief** the engineer can stand behind. Nothing it writes is a commitment; it feeds the outcome definition and the use case.

## 2. Contract

| Field | Value |
|---|---|
| `verbs` | capture idea, iterate (Idea → Vision drafts) |
| `tools` | `evidence.ingest`, `evidence.chunk`, `evidence.embed`, `evidence.retrieve`, `inventory.read`, `artifacts.get`, `web.search` (budget: 5 queries per run), `web.scrape` (3 pages per run), `render.document` |
| `context_pack` | outcome (if any), existing discovery brief versions, inventories (people, processes), open questions, last 20 stream entries, uploads in this run |
| `consumes` | uploads (notes, transcripts, decks), `technical_assessment`, inventories |
| `produces` | `discovery_brief`, `use_case` (draft), `speed_layer_canvas`, `acceptor_map` (draft) |
| `decision` | engineer approves `discovery_brief`; sponsor signs `use_case` and `acceptor_map`; the agent asks, never answers |
| `starter_prompts` | "Turn these workshop notes into a discovery brief." · "List what we still need from the customer." · "Draft the use case from this brief." |
| `status_source` | newest `discovery_brief` version state and open-question count: "Drafting brief v0.3", "2 open questions", "Brief approved" |

## 3. Process steps

1. **Receive.** On `canvas.send`, the backend saves uploads as Evidence before the run starts (`evidence.ingest`). The agent lists what it received as a `message` entry; it never asks for a file it already has.
2. **Read the record.** `artifacts.get` for the latest brief and outcome; `inventory.read` for people and processes. Entry: `tool_call` per read, in plain words ("Discovery brief v0.2 draft").
3. **Index and retrieve.** `evidence.chunk` + `evidence.embed` on new uploads; `evidence.retrieve` for the questions the brief must answer (current workflow, volumes, pain, who decides). Every fact in the draft points at a chunk.
4. **Fill gaps from the web, sparingly.** `web.search` only for public facts about the customer's industry or tools; each cited hit is ingested. Never for facts about the customer that the customer should state.
5. **Draft.** One `draft` entry of type `discovery_brief` with the sections the contract sends: Confirmed findings (each with a source), Assumptions, Unresolved questions (each with who should answer), Decision needed. A `thinking` entry says what was weighed, in one paragraph written for the engineer.
6. **Questions out.** For each unresolved question with a named customer contact, offer a `question` entry with an Ask customer action; sending is a person's click (`question.send`).
7. **Save is the person's.** The draft's Save action runs `iterate`; the reply's `saved[]` becomes a `saved` entry. The agent never writes "saved".
8. **Hand forward.** When the brief is approved, suggest drafting the `use_case` and the `acceptor_map`, and name the Outcome Architect as the next agent. Stop.

Stop conditions: no uploads and no inventory to read (ask for one input and stop); a customer-role actor (refuse with `NOT_PERMITTED`); budget exceeded (say so and stop).

## 4. Prompts

**System prompt (stored in the prompt library, §A8):**

> You are Business Discovery for one customer engagement. You describe the customer's current workflow, name what is confirmed and what is assumed, and list the questions nobody has answered. You write for an engineer who will be held to what you write. Every confirmed finding cites a source you read in this run; anything else is an assumption. You never promise an outcome, a date or a price. You never decide; you draft and ask. You do not describe your own reasoning beyond one short paragraph for the engineer. You never include credentials, raw prompts or restricted source text.

**Step prompts:**

- Draft: "From the sources in context, write the discovery brief with the four sections. Mark each finding `[source: <context line>]`. Put anything without a source under Assumptions."
- Questions: "List up to five questions the customer must answer before an outcome can be defined. For each, name the role that should answer."
- Use case: "Using the approved brief, draft a use case (`UC-n`) with problem, acceptance criteria and pilot shape. Leave `outcome_ref` empty if no outcome definition exists."

**Output shape:** the `draft` entry's `sections[] {heading, items[]}` plus `actions` (Save, Edit, Discard), as in FIELD-WORKBENCH.md §3.

## 5. Rail status line

`status_text` comes from one read model: the newest `discovery_brief` version (`Drafting brief v0.3` while draft, `Brief in review`, `Brief approved`) or, when no brief exists, the count of open questions. `status_tone` follows the artifact state tone. The client prints it; it computes nothing (ARCH-05).

## 6. Rules that bind

- People-only Decisions (FIX-03): approve and sign are offered as actions, never performed.
- A draft is not a record until `saved[]` returns it (FIELD-WORKBENCH.md §3 rules).
- Customer-visible only by explicit share; a brief defaults to internal.
- Web facts are Evidence with `fetched_at`; the brief is checkable against what was read.
- Every Decision named here (approve, sign) binds to one version and its content hash and is taken on a website page in a signed-in human session; a new version voids it (CAP-03, ARCH-14 in `docs/INVARIANTS.md`; FIX-03, FIX-04 in the PRD).

## 7. Acceptance checks

1. A run with two uploads shows two `upload` entries, one `tool_call` per ingest and retrieve, and a draft whose every confirmed finding carries a source.
2. The Unresolved questions section lists a role for each question, and each has an Ask customer action.
3. The agent's run never produces a `saved` entry on its own; only the person's Save does.
4. Removing `web.search` from the definition makes a web lookup fail with `TOOL_NOT_ALLOWED` and the brief still drafts from uploads.

Proof: checks 1 to 4 are agent-worker tests in aadm-mcp (backend mode) and are not claimable from this repo. This repo proves only that the rail row, the status line and every entry type the run emits parse and render (`scripts/field-contract.test.mjs`, the Workbench fixture), and that this definition's tools, verbs and `produces` are in the registers (FIELD-AGENT-TOOLS.md §7, to add).

## 8. Open questions

1. Does the agent draft the `acceptor_map`, or does Outcome Architect, since the eval owner is named with the outcome?
2. Which customer contacts may receive questions (FIELD-WORKBENCH.md §6)?
