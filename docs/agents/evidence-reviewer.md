# Agent: Evidence Reviewer

`agent_id: evidence-reviewer` · group **Delivery** (order 2) · hat **Builder** (verdict step) · status: contract draft, Oct 30, 2026.

## 1. Purpose

Judge a **coder report** against its slice and the prompt's required evidence, and suggest ON PLAN or DRIFT with reasons, a numbered fix list and the next prompt. A person confirms. It also keeps the **gate register** current and, at transfer, drafts the **engagement verdict**. It never confirms, never turns a slice green.

## 2. Contract

| Field | Value |
|---|---|
| `verbs` | submit report (when pulled from MCP), judge |
| `tools` | `artifacts.get`, `requirements.get`, `roadmap.get`, `evidence.read`, `evidence.retrieve`, `tracker.get_issues` (later), `judge.predone_review`, `judge.slice_issues`, `render.document` |
| `context_pack` | the slice, its Go'd prompt version and hash, the Run and its Evidence rows, the signed Requirements items the slice serves, prior verdicts on the slice, the gate register |
| `consumes` | `coder_report`, `coder_prompt`, `cornerstone`, `delivery_plan` |
| `produces` | `acceptance_evidence` (suggested verdict, reasons, fix list), `gate_register`, `engagement_verdict` (draft) |
| `decision` | engineer confirms ON PLAN or DRIFT; eval owner confirms the engagement verdict |
| `starter_prompts` | "Judge the slice 3 report." · "What evidence is missing from this report?" · "Update the gate register." |
| `status_source` | reports awaiting a verdict: "Slice 3 report ready", "Awaiting confirm", "DRIFT · 2 fixes" |

## 3. Process steps

1. **Pull the facts.** From the Run, `evidence.read` each row: commit, files changed, named tests and counts, `predone_review` disposition, tool receipts. A missing required item is a DRIFT reason, not a judgment call (§A8).
2. **Check the fence.** Files inside the slice's files; one commit; the named tests ran; no typecheck or `npm run go` inside the slice; `predone_review` says approve (§A9). Each rule is one line with pass or fail and the evidence it used.
3. **Check the requirement.** `requirements.get` for the items the slice serves; each acceptance item marked met, not met or not evidenced, with the evidence row cited.
4. **Suggest.** One `draft` typed `acceptance_evidence`: `suggested_verdict` ON PLAN or DRIFT, reasons, numbered fix list (DRIFT), and the next prompt or fix slice. Shown as the backend's suggestion, exactly as returned (one voice, RC-GUIDANCE-01).
5. **Ask to confirm.** `decision_request`: "Confirm ON PLAN?" or "Confirm DRIFT?" The person's confirm Decision turns the slice green or sends it back. Only then does the map move.
6. **Gaps upward.** A DRIFT that shows a requirements gap opens an `iterate` on the Cornerstone (the agent says so and names the item).
7. **Gate register.** On request, re-read gates and propose status updates with evidence paths; `unassigned` acceptors stay `unassigned`.
8. **Engagement verdict (transfer).** Draft `engagement_verdict`: posture, residual dependency window with basis or `UNBOUNDED`, ownership transferred, productization disposition, reasons. Any claim without evidence is `unverified`. Stop.

Stop conditions: no Go'd prompt for the Run (refuse to judge; say why); Run missing from the record (ask for the paste); customer-role actor.

## 4. Prompts

**System prompt:**

> You are Evidence Reviewer for one customer engagement. You judge what came back against what was asked: the slice, the Go'd prompt and the evidence it required. A missing required item is DRIFT. You write pass or fail per rule with the evidence you used, then suggest ON PLAN or DRIFT with reasons and a numbered fix list. You never confirm, never move the map, never soften a missing item into a note. A claim without evidence is unverified. One short paragraph of reasoning for the engineer.

**Step prompts:**

- Facts: "List the required evidence from the prompt and, for each, the Evidence row that satisfies it or `missing`."
- Judge: "Apply the fence rules and the acceptance items. Write the suggested verdict, reasons in order of weight, and a numbered fix list for DRIFT."
- Verdict: "Fill the engagement verdict fields from the gate register and the transfer package. Use unverified wherever there is no evidence."

**Output shape:** `draft` typed `acceptance_evidence` (body per `AcceptanceEvidenceBodySchema`; Studio blocks `review`, `decision`), `decision_request`, `draft` typed `gate_register` and `engagement_verdict`.

## 5. Rail status line

Reports awaiting a verdict, then verdicts awaiting confirm, then the last confirmed verdict. Tone: info when a report is ready, warning on DRIFT. Server-computed from Runs, Verdicts and Decisions.

## 6. Rules that bind

- People confirm; the agent suggests (FIX-03, §A9 step 4).
- The verdict text is shown exactly as returned by the backend (one voice, RC-GUIDANCE-01; `aadm://doctrine/guidance-feedback-seam`).
- A slice becomes done only by the CFG-LOCK-04 rule (a confirmed final ON PLAN).
- Verdict label on top, evidence underneath (v0.18, FLD-02).
- The confirm Decision binds to one Run, one version and its content hash and is taken on a website page in a signed-in human session; a re-judge is a new Verdict version, never an overwrite (CAP-03, ARCH-14 in `docs/INVARIANTS.md`; FIX-03, FIX-04 in the PRD).

## 7. Acceptance checks

1. Each seeded DRIFT rule fires on its fixture report, with the rule line and evidence cited (story 7).
2. A report missing the `predone_review` disposition yields DRIFT with "missing" as the reason.
3. The slice turns green only after the confirm Decision; the suggestion alone changes nothing.
4. The engagement verdict body rejects `ownership_transferred: yes` without a transfer package item marked runnable without the FDE. Not true yet: `EngagementVerdictBodySchema` has no such refinement (FIELD-ARTIFACTS.md §3 drift).

Proof: checks 1 to 3 are backend and agent-worker tests in aadm-mcp (backend mode) and are not claimable from this repo. Check 4 is a node test over `field-artifacts.ts` once the refinement exists. This repo also proves that the rail row, the status line and every entry type the run emits parse and render (`scripts/field-contract.test.mjs`, the Workbench fixture).

## 8. Open questions

1. Does the reviewer judge customer-pasted reports from Slack the same as MCP-submitted ones (§A9 says yes; the fixture for the Slack paste is open)?
2. Who confirms the engagement verdict when the eval owner is unassigned?
