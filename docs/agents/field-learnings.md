# Agent: Field Learnings

`agent_id: field-learnings` · group **Adoption and learning** (order 2) · hat **Owner** · status: contract draft, Oct 30, 2026.

## 1. Purpose

Log reusable patterns from one engagement for the platform team and the firm layer: what generalised, what stayed local, which prompts and gates worked, which DRIFT rules fired. It reads the record; it writes learnings. Consent-based and metadata-first (PRD §13p firm rollup): no customer data leaves the engagement without an explicit share.

## 2. Contract

| Field | Value |
|---|---|
| `verbs` | iterate (learning entries; proposed, no verb yet) |
| `tools` | `artifacts.get`, `roadmap.get`, `evidence.read`, `evidence.retrieve`, `render.document` |
| `context_pack` | confirmed verdicts and their reasons, challenge results, prompt versions and lint results, gate register, transfer package, engagement verdict |
| `consumes` | `acceptance_evidence`, `coder_prompt`, `cornerstone`, `gate_register`, `transfer_package`, `engagement_verdict` |
| `produces` | learning entries (no artifact type yet; proposed `field_learning`) and productization notes into `transfer_package` |
| `decision` | engineer approves a learning before it leaves the engagement; sharing to the firm is an explicit share |
| `starter_prompts` | "What should the platform team learn from slice 3?" · "Which prompts produced ON PLAN first time?" · "Draft the productization note." |
| `status_source` | learnings proposed and not yet approved: "1 pattern to log" |

## 3. Process steps

1. **Read** verdicts, challenge results, prompt lint results and the gate register for the engagement.
2. **Find patterns.** A pattern is a repeated cause: a DRIFT reason that fired twice, a lint finding that recurred, a gate that stayed open past its date, a prompt template that passed first time. Each cites the versions it was seen in.
3. **Draft a learning** per pattern: what happened, where (versions), what to change (a template line, a verbatim line, a check), who owns the change. Proposed as `draft` entries.
4. **Productization note.** For the transfer package: what generalises and what is local, from the engagement verdict's disposition.
5. **Ask.** Approve per learning; share to the firm as a separate explicit action. Metadata only unless the share says otherwise. Stop.

Stop conditions: no confirmed verdict (nothing to learn yet; say so); customer-role actor; any attempt to include customer data in a firm share (strip, say so).

## 4. Prompts

**System prompt:**

> You are Field Learnings for one customer engagement. You read what the record shows happened and write what the platform should change: templates, verbatim lines, checks, gates. Every learning cites the versions where it was seen. You never include customer data, names or restricted text in a learning that leaves the engagement. You propose; the engineer approves and chooses what is shared. One short paragraph of reasoning for the engineer.

**Step prompts:**

- Patterns: "List patterns seen at least twice in this engagement's verdicts, lint results and gates, each with the versions."
- Learning: "For pattern <n>, write: what happened, what to change, who owns it, how we would know it worked."

**Output shape:** `draft` entries (heading, list blocks); approve and share actions sent by the server.

## 5. Rail status line

Count of proposed learnings awaiting approval. Server-computed.

## 6. Rules that bind

- Firm rollup is consent-based and metadata-only (PRD §13p, D34).
- Learnings are versions like everything else; a share is an explicit write.
- Nothing here is a health or quality dashboard (FLD-01 to FLD-04); it is a list of proposed changes with owners, and proof sits one click below each (FLD-02).
- The approve Decision binds to one version and its content hash and is taken on a website page in a signed-in human session (CAP-03, ARCH-14 in `docs/INVARIANTS.md`; FIX-03 in the PRD). A share to the firm is a consequential external write and needs its own explicit authorisation in the UI and on the backend (ARCH-13).

## 7. Acceptance checks

1. A learning that quotes customer data fails the share pre-check and the stream says what was stripped.
2. Every learning cites at least one version id that exists in the engagement.
3. Approving a learning does not share it; sharing is a second, explicit action.

Proof: checks 1 to 3 are backend and agent-worker tests in aadm-mcp (backend mode) and are not claimable from this repo. This repo proves only that the rail row, the status line and every entry type the run emits parse and render (`scripts/field-contract.test.mjs`, the Workbench fixture), and that this definition's tools and verbs are in the registers (FIELD-AGENT-TOOLS.md §7, to add); `field_learning` has no register row yet, so `produces` cannot be checked.

## 8. Open questions

1. Is `field_learning` a new artifact type, a prompt-library change request, or a firm-layer record (§13p)?
2. Does this agent run on a schedule (after each confirmed verdict) or only on request?
