**APP: AADM (aadm-mcp)** · Slice INV3-MCP: invariants brought in line with D44 (10 result families, capabilities, audit delete, settings values)
Repo: ~/github/aadm-mcp on `dev`. Read by Blueprint at 2b1b364 (pushed; `origin/dev` equal), Oct 25, 2026, ~9:25 PM ET. Docs only, no code.

GOAL: Brian's D44 (Oct 25, 2026, 9:07 PM ET, PRD v0.15) changed seven calls that INV2-MCP wrote with Blueprint's earlier defaults. Replace 9 lines of `docs/ARCHITECTURE_INVARIANTS.md` in place (TEN-07, CAP-01, API-08, RES-03, RES-04, ENV-02, DATA-04, AUD-02, OPS-07) so the doc says: 10 result families (`rate_limited` and `internal_error` are their own), a side-effect class and `capability_denied`, audit rows deleted with the workspace plus a tombstone, 24-hour idempotency, daily backups kept 30 days with a quarterly drill, and the open-server guard in DM0-d2. Same IDs, same tags, same line count. No new lines, no new docs.

SCOPE
- ADAPT `docs/ARCHITECTURE_INVARIANTS.md` only: replace each of the 9 lines listed under EDITS. Each OLD line must match the file byte for byte at that line number; write its NEW line in its place. Change nothing else (CAP-03 stays as it is).

DO NOT CHANGE: any other line of that doc, `AGENTS.md`, `docs/ENGINEERING_RULES.md`, any ADR, `resources/doctrine/*`, any code, tests or `package.json`. Create no other docs.

CONFIRM FIRST (stop and report if any one differs)
1. `git branch --show-current` prints `dev`, and `git log -1 --oneline` shows 2b1b364 (or a later commit that does not touch `docs/ARCHITECTURE_INVARIANTS.md`; report its hash).
2. `wc -l docs/ARCHITECTURE_INVARIANTS.md` prints 164, and `git status --short docs/ARCHITECTURE_INVARIANTS.md` prints nothing.
3. For each EDITS entry, `sed -n '<N>p' docs/ARCHITECTURE_INVARIANTS.md` prints exactly its OLD line (lines 49, 59, 78, 83, 84, 89, 106, 141, 154).
4. `rg -c 'D44' docs/ARCHITECTURE_INVARIANTS.md` prints nothing (0 matches).

AADM: run `predone_review` on the diff before you commit. Fix only what it flags in this file, and keep the rule IDs, tags, line numbers and counts.

TESTS (scoped)
- `wc -l docs/ARCHITECTURE_INVARIANTS.md` prints 164; `rg -c '^- ' docs/ARCHITECTURE_INVARIANTS.md` prints 120; `rg -c '^## ' docs/ARCHITECTURE_INVARIANTS.md` prints 19.
- `rg -c '^- [A-Z]+-[0-9]{2} \[(mcp|website|both)\]' docs/ARCHITECTURE_INVARIANTS.md` prints 80, and the same with `(website|both)` prints 24.
- `rg -c 'D44' docs/ARCHITECTURE_INVARIANTS.md` prints 9; `rate_limited` prints 3; `internal_error` 2; `capability_denied` 2; `tombstone` 2; `10 families` 3; `24 hours` 1; `DM0-d2` 1; `DM2-a4` 1.
- `rg -c 'rejected` / `rate_limited' docs/ARCHITECTURE_INVARIANTS.md` prints nothing (0), and `rg -c 'or `internal_error`' docs/ARCHITECTURE_INVARIANTS.md` prints nothing (0).
- `git diff --numstat` prints exactly `9	9	docs/ARCHITECTURE_INVARIANTS.md`.

Scoped tests only; typecheck at column end, go at map end. MUST NOT run any typecheck (check:types:touched, npm run check, tsc, tsgo) or npm run go in this slice.
If any AADM tool says do not edit or halt, stop and report; do not continue.
git add only the named files; never stage .tmp/, walk scripts or session files
If the dev server shows a stale or cached error, stop and ask Brian; never edit config files or nudge containers to force a reload.
Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it.
If this slice turns out more complex than one behavior (judge it on new logic, layers crossed, specs needed, migration + UI, a second defect, or a design question; file count over ~10 is only one signal), stop, don't commit, and send Blueprint a batch request.
Skip baseline_guide; use no defect or triage tools. Do not call suggest_aadm_tools.

GIT: stay on `dev`, with no branch, stash, reset, restore or amend. Run `git add docs/ARCHITECTURE_INVARIANTS.md` and then `git commit -m "INV3-MCP: align invariants with D44 (10 result families, capabilities, audit delete, settings values)"`. Do not push.

STOP AND REPORT: the commit hash, every test output above, the predone_review result, and any confirm-first fact that differed (with the line number and the text you found).

EDITS for docs/ARCHITECTURE_INVARIANTS.md (replace in place; 9 lines; OLD read READ-ONLY on Brian's Mac at 2b1b364):

Line 49
OLD: - TEN-07 Result codes: `unauthenticated` (no valid credential); `not_found` (unknown workspace, or the caller is not a member; never reveal it exists); `forbidden` (a member whose role does not allow the action); `entitlement_required` (the plan lacks the feature or the tool's plan tag); `storage_unavailable` (backend down); `conflict` (stale revision); `rejected` (payload refused); `indeterminate` (outcome unknown).
NEW: - TEN-07 Result codes, in 10 families (D44 (2)): `unauthenticated` (no valid credential); `not_found` (unknown workspace, or the caller is not a member; never reveal it exists); `forbidden` (a member whose role or capabilities do not allow the action); `entitlement_required` (the plan lacks the feature or the tool's plan tag); `storage_unavailable` (backend or a dependency down); `conflict` (stale revision); `rejected` (payload refused); `indeterminate` (outcome unknown); `rate_limited` (too many requests; retryable after `retry_after`); `internal_error` (a bug in AADM; not retryable, never shown as an outage). Specific codes are sub-codes under a family (RES-03).

Line 59
OLD: - CAP-01 [mcp] Every MCP tool and plans-API route declares one capability next to its plan tag (DM1-e5), from this closed list: `tool.run` (stateless; saves nothing), `source.read`, `source.write` (Terrain facts), `artifact.read`, `artifact.write` (use case, cornerstone, map, batch, slice, prompt), `report.write`, `approval.request`, `approval.resolve`, `run.control`. A build check fails on a missing or unknown capability.
NEW: - CAP-01 [mcp] Every MCP tool and plans-API route declares one capability next to its plan tag (DM1-e5), from this closed list: `tool.run` (stateless; saves nothing), `source.read`, `source.write` (Terrain facts), `artifact.read`, `artifact.write` (use case, cornerstone, map, batch, slice, prompt), `report.write`, `approval.request`, `approval.resolve`, `run.control`. Each also declares one side-effect class: `read`, `write`, `external` (calls an outside system) or `irreversible` (a later write can't undo it). A build check fails on a missing or unknown capability, and a tool with no side-effect class counts as `irreversible` and fails the build. A call outside the caller's capabilities is refused with `forbidden` / `capability_denied`, naming the capability (D44 (3)).

Line 78
OLD: - API-08 [mcp] Idempotency (ARCH-08): a key is scoped to workspace, actor and tool; the same key with the same request hash replays the stored result; the same key with a different hash returns `conflict` / `idempotency_conflict`; keys are kept for the idempotency window setting.
NEW: - API-08 [mcp] Idempotency (ARCH-08): a key is scoped to workspace, actor and tool; the same key with the same request hash replays the stored result; the same key with a different hash returns `conflict` / `idempotency_conflict`; keys are kept for the idempotency window setting, 24 hours by default (CFG-TECH-18, D44 (6)).

Line 83
OLD: - RES-03 [mcp] Strawman error kinds map to families: validation is `rejected` / `invalid_input`; policy is `rejected` / `policy_rejected`; rate limit is `rejected` / `rate_limited` with `retry_after`; a timeout or lost reply after a write was sent is `indeterminate`; a dependency outage or internal failure before any write is `storage_unavailable` / `dependency_unavailable` or `internal_error`.
NEW: - RES-03 [mcp] Strawman error kinds map to the 10 families (D44 (2)): validation is `rejected` / `invalid_input`; policy is `rejected` / `policy_rejected`; rate limit is its own family, `rate_limited`, retryable, with `retry_after`; an internal failure in AADM is its own family, `internal_error`, not retryable; a dependency outage before any write is `storage_unavailable` / `dependency_unavailable`; a timeout or lost reply after a write was sent is `indeterminate`; an illegal state change is `conflict` / `invalid_transition`; a call outside the caller's capabilities is `forbidden` / `capability_denied`.

Line 84
OLD: - RES-04 [both] Every refusal body has `code`, `sub_code`, `retryable` (true or false), `request_id` and a message for people; clients decide from `code`, `sub_code` and `retryable`, never from the message text.
NEW: - RES-04 [both] Every refusal body has `code`, `sub_code`, `retryable` (true or false), `request_id` and a message for people, and `rate_limited` adds `retry_after`; clients decide from `code`, `sub_code` and `retryable`, never from the message text, and show each of the 10 families differently (D44 (2)).

Line 89
OLD: - ENV-02 [mcp] In production, core refuses to start when `CLERK_SECRET_KEY` is unset; auth mode `open` exists only in local dev (IDN-04, DM2-a4).
NEW: - ENV-02 [mcp] In production, core refuses to start when `CLERK_SECRET_KEY` is unset and exits with a named reason; auth mode `open` exists only in local dev (IDN-04, DM0-d2, D44 (7)). The `ak_` org-subject refusal stays in DM2-a4.

Line 106
OLD: - DATA-04 [mcp] Lifecycle (D7): a plan is active, then archived read-only after CFG-RET-01; a closed workspace is exported, then hard-deleted after CFG-RET-02 (FIX-24). Hard delete removes every row and blob with that `workspace_id`, including renders, judgments and evidence references.
NEW: - DATA-04 [mcp] Lifecycle (D7): a plan is active, then archived read-only after CFG-RET-01; a closed workspace is exported, then hard-deleted after CFG-RET-02 (FIX-24). Hard delete removes every row and blob with that `workspace_id`, including renders, judgments, evidence references and the workspace's audit and event rows, which are inside the export taken first (D44 (5)). The retention job runs as the DATA-03 role and, in the same transaction, writes one content-free tombstone row outside the workspace tables: `workspace_id`, the deleting actor, the time, the export's SHA-256 and the row count per table.

Line 141
OLD: - AUD-02 [mcp] Event and audit tables are append-only: `aadm_app` has no UPDATE or DELETE grant on them (DM1-b3).
NEW: - AUD-02 [mcp] Event and audit tables are append-only: `aadm_app` has no UPDATE or DELETE grant on them (DM1-b3). The only delete is a workspace hard delete by the DATA-03 retention role, after the export (DATA-04, D44 (5)); the deletion tombstone is insert-only.

Line 154
OLD: - OPS-07 [mcp] The operator owns backups (Brian for AADM Cloud, the customer in mode c, §5.18); backup frequency and retention are operator settings; a restore is tested before the C7 column check, and an untested backup does not count.
NEW: - OPS-07 [mcp] The operator owns backups (Brian for AADM Cloud, the customer in mode c, §5.18); backup frequency and retention are operator settings, daily and 30 days by default (CFG-TECH-19, CFG-TECH-20, D44 (6)); a restore is tested before the C7 column check and then quarterly (CFG-TECH-21), and an untested backup does not count.
