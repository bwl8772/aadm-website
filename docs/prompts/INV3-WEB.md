**APP: AADM (aadm-website)** · Slice INV3-WEB: website invariants brought in line with D44 (10 result families)
Repo: ~/github/aadm-website on `dev`. Read by Blueprint at 9ad68e2 (pushed; `origin/dev` equal), Oct 25, 2026, ~9:25 PM ET. Docs only, no code.

GOAL: Brian's D44 (Oct 25, 2026, 9:07 PM ET, PRD v0.15) made `rate_limited` and `internal_error` their own result families (10 in all) and added `forbidden` / `capability_denied`. Replace 2 lines of `docs/INVARIANTS.md` in place (TEN-07 and RES-04) so the website shows each of the 10 families differently, with the same IDs and wording as aadm-mcp INV3-MCP. Same line count. No new lines, no new docs.

SCOPE
- ADAPT `docs/INVARIANTS.md` only: replace the 2 lines listed under EDITS. Each OLD line must match the file byte for byte at that line number; write its NEW line in its place. Change nothing else. CAP-03 (line 32), RES-05 (line 37) and RUN-03 (line 38) already fit D44 and stay as they are.

DO NOT CHANGE: any other line of `docs/INVARIANTS.md`, `AGENTS.md`, `astro.config.mjs`, `package.json`, or anything under `src/`. Create no other docs.

CONFIRM FIRST (stop and report if any one differs)
1. `git branch --show-current` prints `dev`, and `git log -1 --oneline` shows 9ad68e2 (or a later commit that does not touch `docs/INVARIANTS.md`; report its hash).
2. `wc -l docs/INVARIANTS.md` prints 55, and `git status --short docs/INVARIANTS.md` prints nothing.
3. `sed -n '25p' docs/INVARIANTS.md` and `sed -n '36p' docs/INVARIANTS.md` print exactly the two OLD lines below.
4. `rg -c 'rate_limited' docs/INVARIANTS.md` prints nothing (0 matches).

AADM: run `predone_review` on the diff before you commit. Fix only what it flags in this file, and keep the rule IDs, tags, line numbers and counts.

TESTS (scoped)
- `wc -l docs/INVARIANTS.md` prints 55; `rg -c '^- ' docs/INVARIANTS.md` prints 43; `rg -c '^## ' docs/INVARIANTS.md` prints 4.
- `rg -c '^- [A-Z]+-[0-9]{2} \[(website|both)\]' docs/INVARIANTS.md` prints 24, and `rg -c '^- ARCH-' docs/INVARIANTS.md` still prints 12.
- `rg -c 'D44' docs/INVARIANTS.md` prints 2; `rate_limited` prints 2; `internal_error` 1; `capability_denied` 1; `retry_after` 1; `10 families` 2.
- `git diff --numstat` prints exactly `2	2	docs/INVARIANTS.md`.

Scoped tests only; typecheck at column end, go at map end. MUST NOT run any typecheck (check:types:touched, npm run check, tsc, tsgo) or npm run go in this slice.
If any AADM tool says do not edit or halt, stop and report; do not continue.
git add only the named files; never stage .tmp/, walk scripts or session files
If the dev server shows a stale or cached error, stop and ask Brian; never edit config files or nudge containers to force a reload.
Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it.
If this slice turns out more complex than one behavior (judge it on new logic, layers crossed, specs needed, migration + UI, a second defect, or a design question; file count over ~10 is only one signal), stop, don't commit, and send Blueprint a batch request.
Skip baseline_guide; use no defect or triage tools. Do not call suggest_aadm_tools.

GIT: stay on `dev`, with no branch, stash, reset, restore or amend. Run `git add docs/INVARIANTS.md` and then `git commit -m "INV3-WEB: align website invariants with D44 (10 result families)"`. Do not push.

STOP AND REPORT: the commit hash, every test output above, the predone_review result, and any confirm-first fact that differed (with the line number and the text you found).

EDITS for docs/INVARIANTS.md (replace in place; 2 lines; OLD read READ-ONLY on Brian's Mac at 9ad68e2):

Line 25
OLD: - TEN-07 Show each backend result differently: `unauthenticated` (sign in), `not_found` (no such workspace for you; never hint it exists), `forbidden` (your role can't do this), `entitlement_required` (your plan doesn't include this; show the upgrade path), `storage_unavailable` (try again later), `conflict` (someone changed it; reload), `rejected` (input refused), `indeterminate` (outcome unknown; check before retrying).
NEW: - TEN-07 Show each backend result differently, for all 10 families (D44 (2)): `unauthenticated` (sign in), `not_found` (no such workspace for you; never hint it exists), `forbidden` (your role can't do this), `entitlement_required` (your plan doesn't include this; show the upgrade path), `storage_unavailable` (try again later), `conflict` (someone changed it; reload), `rejected` (input refused), `indeterminate` (outcome unknown; check before retrying), `rate_limited` (too many requests; show when to try again), `internal_error` (something broke on our side; show the `request_id`, never "try again later").

Line 36
OLD: - RES-04 [both] The website decides from the refusal body's `code`, `sub_code` and `retryable`, never from the message text, and shows the `request_id`.
NEW: - RES-04 [both] The website decides from the refusal body's `code`, `sub_code` and `retryable` (plus `retry_after` for `rate_limited`), never from the message text, and shows the `request_id`; each of the 10 families has its own state, and `forbidden` / `capability_denied` names what the role can't do (D44 (2), (3)).
