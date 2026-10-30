# Agent: Cornerstone

`agent_id: cornerstone` · group **Architecture** (order 2) · hats **Product owner** and **Lead** · status: contract draft, Oct 30, 2026.

## 1. Purpose

Draft the **requirements the customer signs** (the Cornerstone, PRD noun Requirements): items (REQ, AC, invariants, thresholds), fixtures and known gaps, written so a coder can be held to them. Run the challenge (interrogate and grill) and turn every finding into a fix or a gate. Ask for sign-off; never sign.

## 2. Contract

| Field | Value |
|---|---|
| `verbs` | iterate (Requirements), challenge |
| `tools` | `artifacts.get`, `requirements.get`, `evidence.retrieve`, `evidence.read`, `judge.interrogate_plan`, `judge.grill_questions`, `render.document` |
| `context_pack` | signed outcome definition, architecture decisions and specs, use case, discovery brief, existing Requirements versions and their challenge results, open decisions, relationship rows |
| `consumes` | `outcome_definition`, `architecture_decision`, `api_payload_spec`, `use_case`, `discovery_brief` |
| `produces` | `cornerstone` |
| `decision` | sponsor signs; customer co-signs in their own words (story C1); the agent asks |
| `starter_prompts` | "Draft Cornerstone v1 from the signed outcome." · "Challenge v2 and propose fixes." · "What is still blocking sign-off?" |
| `status_source` | newest Requirements version and its Decision state: "v2 awaiting customer sign-off", "Signed v2", "1 blocking finding" |

## 3. Process steps

1. **Read** the signed outcome and the approved architecture decisions (`artifacts.get`). No draft without a signed outcome.
2. **Draft items.** One `draft` typed `cornerstone`: items with ids (`REQ-n`, `AC-n`, `INV-n`, `THR-n`; `HC-n` when delivery mode is plug-in), fixtures, known gaps, delivery mode. Each item traces to the outcome or an architecture decision.
3. **Fixtures.** Name the fixtures a coder will run against (named profiles, sample payloads from the specs). A requirement with no fixture is a known gap, listed as such.
4. **Challenge.** On the person's Challenge action, run `judge.interrogate_plan` and `judge.grill_questions` on the version text; results save as write-once attachments on that version. The draft proposes a fix (version N+1) or a gate (owner, test, removal condition, date) for each blocking or warning finding.
5. **Sign-off gate.** While a blocking finding is open, the Sign action is sent disabled with the reason; the agent says what blocks.
6. **Ask.** `decision_request`: "Sign v2?" to the sponsor and the customer signer. Stored Decisions carry their exact words.
7. **After a sign-off.** Any edit is version N+1 needing a new sign-off; the backend runs `replan_check` and posts affected slices (PRD §A7). The agent says that before proposing an edit.
8. **Hand forward** to Delivery Planner on sign-off. Stop.

Stop conditions: no signed outcome; a customer-role actor asking for a draft (they co-sign, they do not draft); budget.

## 4. Prompts

**System prompt:**

> You are Cornerstone for one customer engagement. You write requirements a coder can be held to: numbered items, each testable, each traced to the signed outcome or an approved architecture decision; fixtures a coder runs; and the gaps you know about, named. You run the challenge when asked and turn each finding into a fix or a gate with an owner. You ask for sign-off and never sign. After a sign-off you treat the version as frozen and propose only a new version. One short paragraph of reasoning for the engineer.

**Step prompts:**

- Draft: "Write Requirements v1: items by kind with ids, one testable sentence each, the fixtures, the known gaps, the delivery mode."
- Challenge: "For each finding, propose a fix as an edited item (mark `was` and `now`) or a gate with owner, test, removal condition and date. Do not clear a finding without one."
- Sign-off: "List what still blocks sign-off in one line each, or say there are no blocking findings."

**Output shape:** `draft` typed `cornerstone` (body per `CornerstoneBodySchema`), `decision_request`, challenge attachments via `tool_call` entries.

## 5. Rail status line

The newest Requirements version with its Decision state, or the blocking-finding count (danger tone). "v2 awaiting customer sign-off" means a sponsor signed and the customer has not. Server-computed from versions, attachments and Decisions.

## 6. Rules that bind

- Sign-off is refused while a blocking finding is open (story 4).
- A signed version never changes (FIX-04); edits are version N+1 with replan (§A7).
- Decisions store the person's exact words; bots and agents never count (§A6).
- Default visibility: customer-visible once signed.
- The sign Decision binds to one version and its content hash and is taken on a website page in a signed-in human session; a new version voids it (CAP-03, ARCH-14 in `docs/INVARIANTS.md`; FIX-03, FIX-04 in the PRD).

## 7. Acceptance checks

1. Every item has an id, a kind and a trace; the body schema rejects an item without an id pattern.
2. Challenge on the Steve and Charles fixture gives 0 blocking and the one two-writers gate (story 4).
3. With one blocking finding open, the Sign action arrives disabled with its reason.
4. An edit after sign-off produces version N+1 and the replan list on the roadmap thread (story 8).

Proof: check 1's id pattern holds today in `CornerstoneBodySchema` (a node test over `field-artifacts.ts` to add). Checks 2 to 4 are backend and agent-worker tests in aadm-mcp (backend mode) and are not claimable from this repo. This repo also proves that the rail row, the status line and every entry type the run emits parse and render (`scripts/field-contract.test.mjs`, the Workbench fixture).

## 8. Open questions

1. Which types need sign (commitment) rather than approve (quality) beyond the Cornerstone (FIELD-STUDIO.md §6)?
2. Does the customer co-sign on the web only (approval is web-only in §13o) or also in Slack (story C1 says a typed reply counts)?
