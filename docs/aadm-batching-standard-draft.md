# AADM batching standard — draft for publication (PRD v0.14 §13n; was the chunking standard)


> **v0.14 rename (Brian, Oct 25, 2026, 8:19 PM ET, D43: "Rename the standard to batching-standard").** Rewritten in batch terms from `aadm-chunking-standard-draft.md` (kept as `.bak`). A **batch** is the ordered group of slices in a stage; "chunk" means only a document chunk (D42 (d)). Unchanged on purpose: the live doctrine `aadm://doctrine/chunk-branch` and the git-policy value `chunk_branch` (built names; a later rename slice), and the VL-6 verbatim line and its paraphrase in "Report", which keep "chunk request" word for word until Brian rewords them (PRD §20).

Draft by Blueprint, Oct 25, 2026, ~11:35 AM ET. Source: Blueprint's `CHUNKING_STANDARD.md` and the generic rules in `BLUEPRINT_CANONICAL_RULES.md`. Removed: personal names and dates, one customer repo's decision-log and freeze-guard lessons, local machine paths, bot-to-bot handoff details, one editor's design skill, package.json line numbers, and workflow-only lines (for example "skip baseline_guide"). The content lands in two places, following the existing pattern (aadm-standard `standards/<name>.md` is the prose standard; aadm-mcp `resources/doctrine/<name>.md` is the copy that tools read, like `slice-sizing.md`):
- Part 1 → aadm-standard `standards/batching-standard.md` (DM0-c1)
- Part 2 → aadm-mcp `resources/doctrine/batching-standard.md`, URI `aadm://doctrine/batching-standard` (DM0-c2)

---

## PART 1 — aadm-standard `standards/batching-standard.md`

# Batching standard

How an AI-assisted delivery plan is cut into stages, batches, slices and prompts so that every unit can be checked by a person and by a tool. Rule IDs (`CS-…`) are stable. `delivery_map_save` checks the plan rules; the prompt lint in `delivery_map_prompt_save` checks the prompt rules.

## 1. Hierarchy (CS-H1, CS-H2)
- **CS-H1.** A plan is stages → batches → slices → prompts. A **stage** is a map column and is named by its result ("Plans can be stored safely"), not by its activity. A **batch** is a planning group of related slices. A **slice** is one visible behaviour, built end to end. A **prompt** is the exact text one coder session receives for one slice.
- **CS-H2.** Every plan declares its `delivery_mode`: `code_in_source` (changes the product repo) or `plug_in` (builds beside a host system through its existing extension points; the host repo is read-only except named registration or config files). Configure-only work is a kind of `plug_in`.

## 2. Reuse first (CS-R1)
Every plan starts with a reuse inventory: the existing contracts, services, tools and renderers that apply, each with a path and marked REUSE, ADAPT or NEW. Slices are written only after it. Anything NEW carries a one-line reason why nothing existing fits.

## 3. Sizing (CS-S1 … CS-S6)
- **CS-S1 One visible behaviour.** A user can see and use the change end to end. A layer-only change is not a slice.
- **CS-S2 Complexity, not file count alone.** Weigh new logic, layers crossed, specs, a migration plus UI, and open design questions. More than about 10 files is one signal to split.
- **CS-S3 One primary test target.** One primary spec proves the behaviour; regression specs may also run.
- **CS-S4 Process level.** Short = fewer than 4 steps in one layer, with no contract, auth, money, personal-data or architecture change. Anything else is full. A full slice still meets CS-S1 to CS-S3. Bands follow `aadm://doctrine/slice-sizing` (S1 too small … S5 too big).
- **CS-S5 A batch holds 2 to 4 slices.**
- **CS-S6 Split when** the goal needs "and", more than one primary spec, a migration plus UI in one slice, more than one defect with different fixes, or the pre-done review flags scope creep. **Merge when** a slice has no visible change of its own.
- Verdicts: SIZE OK, TOO BIG (split into …), TOO SMALL (merge into …), N/A (docs, retired or human work).

## 4. Order and completeness (CS-D1 … CS-D4)
- **CS-D1** No dependency cycles: every slice depends only on earlier slices.
- **CS-D2** No unset thresholds: every threshold has a number and a unit; 0 `TBD`, `TODO` or `?`.
- **CS-D3** Every slice has a done-check, inputs, outputs, files, tests, a rollback and a keep (do-not-change) list.
- **CS-D4** No deletion without a rollback; no document without a slice that writes it.

## 5. Tests, typecheck and the full gate (CS-T1 … CS-T3)
- **CS-T1** A slice runs its named scoped tests only, one at a time. No typecheck of any kind and no full gate inside a slice.
- **CS-T2** The full typecheck runs once at the end of each map column, as its own short column-check prompt. It fixes nothing; a failure gets its own fix slice before the next column.
- **CS-T3** The full gate (the repo's "go" command) runs once at the end of the map, folded into the last column check: typecheck first; if it fails, stop without running the gate.
- Plans state "N slices, M prompts". A run of repetitive batch slices may share one prompt template, one commit per batch.

## 6. Git (CS-G1 … CS-G3)
- **CS-G1** Plan `git_policy = no_branches` (default): all work on the integration branch (for example `dev`); never create, switch, merge or delete a branch; no worktrees, PRs, cherry-picks or resets in prompts. A batch is a planning group only. Teams that use one branch per batch set `git_policy = chunk_branch` and follow `aadm://doctrine/chunk-branch` instead; the two are never mixed in one plan.
- **CS-G2** One commit per slice, staged by explicit path. No push, amend or stash.
- **CS-G3** Prompts never ask the coder for names, owners or dates.

## 7. Prompts (CS-P1 … CS-P10)
- **CS-P1 Repo first.** No prompt is written until the planner has read the real code for that slice at a noted commit (`commit_read`), from the team's local integration branch where it can be ahead of the remote. A plan or map is not a prompt: each prompt needs a fresh repo pass.
- **CS-P2 Whole-repo search.** The repo pass searches the whole repo (source, scripts, CI, tests, docs, deploy config) for anything that already does the job; hits are recorded with path:line and the slice reuses or adapts them.
- **CS-P3 Only facts read.** Every repo fact in a prompt (file, line, route, script, table, count, string) was read at `commit_read`. Anything not read is marked "unchecked" and the coder is told to check it.
- **CS-P4 Short.** Target about 40 lines; warn over 80; hard cap 16,000 characters.
- **CS-P5 Fixed order.** (1) title line naming the app, slice ID and result, repo, commit read and git policy; (2) goal, 2–3 lines; (3) scope: exact files, each REUSE, ADAPT or NEW; (4) do not change; (5) confirm first; (6) tests: exact scoped commands; (7) the required rule lines, verbatim; (8) git; (9) stop and report.
- **CS-P6 Confirm first, lighter.** Run `git merge-base --is-ancestor <commit_read> HEAD`, then check only the 2–4 facts that would break the slice if wrong. Stop only if a fact differs, never just because HEAD moved on.
- **CS-P7 Verbatim lines.** The required rule lines in the doctrine copy (`VL-1` … `VL-6`) appear byte-for-byte, with only the workspace's `{approver}` and `{planner}` names filled in. A workspace may add lines; it may not drop or reword these.
- **CS-P8 One slice per prompt.** A code slice and a proof walk are never in the same prompt. Up to 3 prompts per slice, one commit each, sent one at a time; more means split the slice.
- **CS-P9 Guidance before coding, proof after.** The prompt names the review and evidence steps (pre-done review until approve; evidence lines for each test run).
- **CS-P10 No secrets.** A prompt never contains a key, token, password or connection string; it may name an environment variable, never its value.

## 8. plug_in delivery (CS-M1, CS-M2)
- **CS-M1** In a `plug_in` plan, every slice works in the plugin's own repo; the host repo is in every slice's do-not-change list, except the named registration or config files.
- **CS-M2** A `plug_in` slice's rollback is disable or unregister.

## 9. Stop and report
Every prompt ends at the slice boundary with a short report: the confirm-first output, the test output, the review verdict, the commit hash and the status. If the slice turns out to be more than one behaviour, the coder stops, does not commit, and sends the planner a chunk request.

---

## PART 2 — aadm-mcp `resources/doctrine/batching-standard.md`

# Batching standard

`aadm://doctrine/batching-standard`

Machine-readable copy of the AADM batching standard (aadm-standard `standards/batching-standard.md`). `delivery_map_save` reads the Plan rules and Limits; `delivery_map_prompt_save` reads the Prompt rules, Limits and the verbatim lines. This server does not read the repo; it checks what the planner saves.

## Limits

standard_version: 1
slices_per_batch_min: 2
slices_per_batch_max: 4
files_per_slice_warn: 10
primary_tests_per_slice: 1
prompt_lines_target: 40
prompt_lines_warn: 80
prompt_chars_max: 16000
confirm_first_facts_min: 2
confirm_first_facts_max: 4
prompts_per_slice_max: 3
plug_in_registration_files_max: 2

## Plan rules

CS-H1 blocking: every slice belongs to one batch and every batch to one stage; every stage has a column check.
CS-H2 blocking: plan delivery_mode is code_in_source or plug_in and equals the cornerstone version's.
CS-R1 blocking: every slice file is tagged REUSE, ADAPT or NEW; NEW has a reason of at most 200 chars.
CS-S5 warning: a batch outside slices_per_batch_min..slices_per_batch_max.
CS-S2 warning: a slice over files_per_slice_warn files.
CS-S3 warning: a slice without exactly primary_tests_per_slice primary test.
CS-S6 warning: a slice goal containing " and ", or a slice with both a migration file and a UI file.
CS-D1 blocking: a dependency cycle or a dependency on a later slice.
CS-D2 blocking: a threshold without a number and unit, or TBD, TODO or ? in a threshold.
CS-D3 blocking: a slice missing done_check, inputs, outputs, files, tests, rollback or keep.
CS-D4 blocking: a deletion without a rollback, or a doc not written by any slice.
CS-T1 blocking: a slice test command that is a typecheck or the full gate.
CS-T2 blocking: a stage without exactly one column check at its end.
CS-T3 blocking: zero or more than one MAP END, or MAP END not on the last column check.
CS-G1 blocking: git_policy no_branches with a branch name on any batch or slice.
CS-M1 blocking: in a plug_in plan, a slice file in the host repo that is not a named registration or config file, or a slice whose keep list lacks the host repo.
CS-M2 blocking: in a plug_in plan, a slice rollback that is not disable or unregister.

## Prompt rules

CS-P1 blocking: commit_read missing or not a 7–40 character hex SHA.
CS-P4 warning: line_count over prompt_lines_warn. CS-P4 blocking: over prompt_chars_max.
CS-P5 blocking: a missing section (title, goal, scope, do not change, confirm first, tests, rules, git, stop and report). CS-P5 warning: sections out of order.
CS-P5 blocking: the title line does not name the app and the slice ID.
CS-P6 blocking: confirm first lacks a merge-base line, or has fewer than confirm_first_facts_min or more than confirm_first_facts_max facts.
CS-P7 blocking: any VL line missing or not byte-identical after the workspace's {approver} and {planner} names are filled in.
CS-P8 blocking: a prompt naming more than one slice ID as its own.
CS-P10 blocking: a key-, token-, password- or connection-string-shaped value (the evidence allowlist secret filter).
CS-T1 blocking: a typecheck or full-gate command in the tests section.

## Verbatim lines

VL-1: Scoped tests only; typecheck at column end, go at map end. MUST NOT run any typecheck (check:types:touched, npm run check, tsc, tsgo) or npm run go in this slice.
VL-2: If any AADM tool says do not edit or halt, stop and report; do not continue.
VL-3: git add only the named files; never stage .tmp/, walk scripts or session files
VL-4: If the dev server shows a stale or cached error, stop and ask {approver}; never edit config files or nudge containers to force a reload.
VL-5: Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it.
VL-6: If this slice turns out more complex than one behaviour (judge it on new logic, layers crossed, specs needed, migration + UI, a second defect, or a design question; file count over ~10 is only one signal), stop, don't commit, and send {planner} a chunk request.

## Copy

finding_blocking: {rule} — {detail}. Fix before saving.
finding_warning: {rule} — {detail}.
host_ok: The plan meets the batching standard.
host_fail: Fix the named CS- findings, then save again.
