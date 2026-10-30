# Agent: Delivery Planner

`agent_id: delivery-planner` · group **Delivery** (order 1) · hats **Planner** and **Builder** · status: contract draft, Oct 30, 2026.

## 1. Purpose

Place signed requirements into the one maintained **roadmap**, propose **batches and slices** under the batching standard, and write one **coder prompt** per slice, grounded on a named commit, with the evidence it must return. Never a fresh plan when one exists; never a prompt without a Go.

## 2. Contract

| Field | Value |
|---|---|
| `verbs` | plan roadmap, batch, write prompt, render map |
| `tools` | `artifacts.get`, `requirements.get`, `roadmap.get`, `evidence.retrieve`, `tracker.get_issues` (later), `judge.delivery_map`, `judge.slice_issues`, `judge.replan_check`, `render.image` (map), `render.document`, `render.slides` (plan review deck) |
| `context_pack` | signed Requirements version, the maintained Roadmap, prompt library (templates, verbatim lines, standards), repo rules and keep list, the slice in focus, last run and verdict |
| `consumes` | `cornerstone` (signed), `architecture_decision`, `api_payload_spec`, `acceptance_evidence` (verdicts) |
| `produces` | `delivery_plan`, `coder_prompt`, `map`, `jira_tickets` (projection, later client) |
| `decision` | engineer approves the plan; engineer says **go** on one prompt version and hash |
| `starter_prompts` | "Place Cornerstone v2 into the roadmap." · "Batch and slice stage 3." · "Write the coder prompt for slice 4." |
| `status_source` | next prompt without a Go, else the roadmap position: "Slice 4 prompt draft", "Batch 4 · 2 of 3 done" |

## 3. Process steps

1. **Find the roadmap.** `roadmap.get` for the workspace's maintained roadmap. Create one only when none exists (story 5).
2. **Place.** From the signed Requirements, propose the stage and batch the work goes into; a `draft` typed `delivery_plan` as Roadmap version N+1.
3. **Batch and slice.** Run `judge.delivery_map` and `judge.slice_issues` under the batching standard: batches of 2 to 4 slices, one commit per slice, a done-check on every slice, dependencies with no cycle, thresholds set. Findings that block (cycle, unset threshold) keep the draft unsaveable with the reason.
4. **Prompt.** For the next slice, `write prompt` from the library template: about 40 lines, the repo rules, the keep list, the commit read (`commit_read` is required), 2 to 4 confirm-first facts, every verbatim line by name, the required evidence, "Do not push". Lint at save; a blocking lint finding saves it as draft and `field_next_slice` never serves it.
5. **Ask for Go.** `decision_request`: "Go on prompt v2 (hash …)?" The Go binds that version and hash; an edit afterwards needs a new Go. The coder gets nothing without it.
6. **Map.** On request or after a save, `render map` through `render.image`; the Map version shows You are here.
7. **Replan.** When a new Requirements version is signed, `judge.replan_check` marks linked slices (not started → needs replan, in progress → stop, done stays done); the list is posted; the agent proposes the edits.
8. **Tickets (later client).** A Jira or Linear projection is one issue per slice keyed by slice id and version hash, rendered by the backend through the envelope with the tracker as client; status flows back only as Evidence.

Stop conditions: no signed Requirements (stop); a slice without a done-check (do not propose a prompt for it); lint blocking (draft stays draft, say why).

## 4. Prompts

**System prompt:**

> You are Delivery Planner for one customer engagement. You put signed work into the one roadmap that already exists, cut it into batches of two to four slices of one commit each with a done-check, and write one short, ready-to-run prompt per slice that names the commit it was grounded on and the evidence the coder must return. You never write code, push, merge or deploy. You never say go; a person does, on one exact version. One short paragraph of reasoning for the engineer.

**Step prompts:**

- Place: "Propose where this signed work goes in the maintained roadmap: stage, batch, why, and what it depends on."
- Batch: "Cut the stage into batches of 2 to 4 slices. Each slice: does, files, tests, done-check, rollback, keep, depends on, the requirement items it serves."
- Prompt: "Write the coder prompt for slice <id> from the slice template: context, task, constraints, acceptance quoted from the signed items, tickets, report back. Include the keep list and every verbatim line by name. End with the required evidence."

**Output shape:** `draft` typed `delivery_plan` (body per `DeliveryPlanBodySchema`), `draft` typed `coder_prompt` (body per `CoderPromptBodySchema`; Studio blocks: headings, lists, `ticket_list`, `code_text` report template), `decision_request` for Go, `tool_call` entries for judges and renders.

## 5. Rail status line

The next prompt awaiting Go, or the roadmap position (slices done in the current batch). Server-computed from the Roadmap version, Prompt versions and Decisions.

## 6. Rules that bind

- Batching standard (PRD §13n): 2 to 4 slices, done-check per slice, no save with a cycle or unset threshold.
- Prompt lint (§A8): about 40 lines, repo rules, keep list, commit read, confirm-first facts, verbatim lines, no secrets, "Do not push"; blocking keeps it draft.
- Go is a people-only Decision bound to version and hash; a prompt edit invalidates it (story 6).
- Nothing turns green without a verdict (§A4 note; CFG-LOCK-04).
- The approve and Go Decisions bind to one version and its content hash and are taken on a website page in a signed-in human session; a new version voids them (CAP-03, ARCH-14 in `docs/INVARIANTS.md`; FIX-03, FIX-04 in the PRD).

## 7. Acceptance checks

1. `plan roadmap` on signed Requirements with an existing roadmap saves Roadmap v(N+1) and creates no second roadmap.
2. A batch draft with a dependency cycle is unsaveable and names the cycle.
3. A prompt draft without `commit_read` or with a missing verbatim line stays draft with the lint finding shown.
4. After Go, editing the prompt removes the Go and asks for a new one; `field_next_slice` serves only the Go'd hash.
5. Signing Requirements v(N+1) marks the linked slices and posts the list (story 8).

Proof: checks 1 to 5 are backend and agent-worker tests in aadm-mcp (backend mode) and are not claimable from this repo. This repo proves only that the rail row, the status line, the coder prompt version (the one full Studio fixture) and every entry type the run emits parse and render (`scripts/field-contract.test.mjs`), and that this definition's tools, verbs and `produces` are in the registers (FIELD-AGENT-TOOLS.md §7, to add).

## 8. Open questions

1. Who holds the repo rules and keep list for a customer repo the FDE does not own: the prompt library, or the engagement?
2. Jira sync direction (FIELD-STUDIO.md §6 q3).
