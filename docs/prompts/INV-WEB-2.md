**APP: AADM (aadm-website)** · Slice INV-WEB-2: Brian's Oct 25 calls added to the website invariants
Repo: ~/github/aadm-website on `dev`. Read by Blueprint at 3b07bf7. Docs only, no code.

GOAL: Update `docs/INVARIANTS.md` with Brian's 7:54 PM and 7:55 PM ET calls: the result codes, the N-1 contract window, and "chunk" meaning a document chunk.

SCOPE: ADAPT `docs/INVARIANTS.md` only. Make exactly these four edits:
1. Line 3: replace the sentence starting "Not decided yet" with: Brian's calls of Oct 25, 2026 are included: result codes (TEN-07) and the N-1 contract window (ARCH-21).
2. Line 18: replace the whole line with: - ARCH-20 Use the backend's names for things. "Chunk" means a document chunk; a group of slices in a delivery map is a "batch".
3. Line 19: replace the whole line with: - ARCH-21 Website and backend releases stay compatible across an explicit contract window: the backend serves the current and the previous API version (N-1), and the website reads the API version from the backend's `/health`.
4. Right after the TEN-06 line, add: - TEN-07 Show each backend result differently: `unauthenticated` (sign in), `not_found` (no such workspace for you; never hint it exists), `forbidden` (your role can't do this), `entitlement_required` (your plan doesn't include this; show the upgrade path), `storage_unavailable` (try again later), `conflict` (someone changed it; reload), `rejected` (input refused), `indeterminate` (outcome unknown; check before retrying).

DO NOT CHANGE: any other line in `docs/INVARIANTS.md`, `AGENTS.md`, or anything under `src/`. Create no other docs.

CONFIRM FIRST (stop and report if any one differs)
1. `git branch --show-current` prints `dev`, and `git log -1 --oneline` shows 3b07bf7.
2. Line 18 of `docs/INVARIANTS.md` starts with "- ARCH-20", line 19 starts with "- ARCH-21", and line 3 contains "Not decided yet".

AADM: run `predone_review` on the diff before you commit. Fix only what it flags in this file.

TESTS (scoped)
- `rg -c '^- ARCH-' docs/INVARIANTS.md` still prints 12.
- `rg -n 'delivery-map chunk|Not decided yet' docs/INVARIANTS.md` prints nothing.
- `rg -n 'TEN-07|N-1' docs/INVARIANTS.md` shows the new lines.
- `git diff --stat` lists only `docs/INVARIANTS.md`.

Scoped tests only; typecheck at column end, go at map end. MUST NOT run any typecheck (check:types:touched, npm run check, tsc, tsgo) or npm run go in this slice.
If any AADM tool says do not edit or halt, stop and report; do not continue.
git add only the named files; never stage .tmp/, walk scripts or session files
If the dev server shows a stale or cached error, stop and ask Brian; never edit config files or nudge containers to force a reload.
Skip baseline_guide; use no defect or triage tools. Do not call suggest_aadm_tools.
Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it.

GIT: stay on `dev`, with no branch, stash, reset, restore or amend. Run `git add docs/INVARIANTS.md` and then `git commit -m "INV-WEB-2: result codes, N-1 window, chunk naming"`. Do not push.

STOP AND REPORT: the commit hash, the four test outputs, and the predone_review result.
