**APP: AADM (aadm-mcp)** · Slice INV-MCP: Architecture invariants written into aadm-mcp's rules
Repo: ~/github/aadm-mcp on `dev`. Read by Blueprint at 76860bd. Docs only, no code.

GOAL: Add one canonical invariants doc and point the repo's rules at it, so every later plans-API slice cites these IDs. Also correct ADR 005's stale owner line (D30).

SCOPE
- NEW `docs/ARCHITECTURE_INVARIANTS.md`: paste the DOC TEXT block below exactly. No other wording.
- ADAPT `docs/ENGINEERING_RULES.md`: under the "Tenancy and bypasses" heading, keep the existing text and add one line after it: "Backend mode (`aadm-backend`): see [ARCHITECTURE_INVARIANTS.md](ARCHITECTURE_INVARIANTS.md) TEN-05, TEN-06 and AUTHZ-01 to AUTHZ-03, and ADR 005."
- ADAPT `AGENTS.md`: next to its existing pointer to `docs/ENGINEERING_RULES.md`, add one line: "Architecture invariants (BACK-, ARCH-, IDN-, TEN-, AUTHZ- IDs): `docs/ARCHITECTURE_INVARIANTS.md`."
- ADAPT `docs/adr/005-plans-api-data-invariants.md` line 5: right after "owned by `aadm-core`," insert "since superseded by PRD D30 (`aadm-backend` owns the plans API and database; `aadm-core` saves nothing, FIX-27),". Change nothing else in the ADR.

DO NOT CHANGE: any code, tests, `resources/doctrine/*`, ADR 001 to 004, `package.json`, or the other text in the three ADAPT files. Create no other docs.

CONFIRM FIRST (stop and report if any one differs)
1. `git branch --show-current` prints `dev`, and `git log -1 --oneline` shows 76860bd (or a later commit that touches none of the four files).
2. `docs/ENGINEERING_RULES.md` has a "Tenancy and bypasses" heading whose text says n/a because the server has no application database.
3. `AGENTS.md` mentions `docs/ENGINEERING_RULES.md`. If it doesn't, stop and ask where the pointer goes.
4. ADR 005 line 5 contains "owned by `aadm-core`", and `docs/ARCHITECTURE_INVARIANTS.md` does not exist yet.

AADM: run `predone_review` on the diff before you commit. Fix only what it flags in these four files.

TESTS (scoped)
- `rg -c '^- ARCH-' docs/ARCHITECTURE_INVARIANTS.md` prints 24.
- `rg -n 'ARCHITECTURE_INVARIANTS' AGENTS.md docs/ENGINEERING_RULES.md` shows one hit in each file.
- `git diff --stat` lists only the four files.

Scoped tests only; typecheck at column end, go at map end. MUST NOT run any typecheck (check:types:touched, npm run check, tsc, tsgo) or npm run go in this slice.
If any AADM tool says do not edit or halt, stop and report; do not continue.
git add only the named files; never stage .tmp/, walk scripts or session files
If the dev server shows a stale or cached error, stop and ask Brian; never edit config files or nudge containers to force a reload.
Skip baseline_guide; use no defect or triage tools. Do not call suggest_aadm_tools.
Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it.

GIT: stay on `dev`, with no branch, stash, reset, restore or amend. Run `git add docs/ARCHITECTURE_INVARIANTS.md docs/ENGINEERING_RULES.md AGENTS.md docs/adr/005-plans-api-data-invariants.md` and then `git commit -m "INV-MCP: architecture invariants doc; ADR 005 owner per D30"`. Do not push.

STOP AND REPORT: the commit hash, the four test outputs, the predone_review result, and any confirm-first fact that differed.
