**APP: AADM (aadm-website)** · Slice INV-WEB: Frontend invariants written into aadm-website's rules
Repo: ~/github/aadm-website on `dev`. Read by Blueprint at 32bef5b. Docs only, no code.

GOAL: Give the website its own rules file with the invariants that bind the frontend, using the same IDs as aadm-mcp, and point AGENTS.md at it.

SCOPE
- NEW `docs/INVARIANTS.md`: paste the DOC TEXT block below exactly. No other wording.
- ADAPT `AGENTS.md`: right under its auth table (the one pointing to `docs/CLERK-AUTH.md`), add one line: "Frontend invariants (BACK-, ARCH-, IDN-, TEN-, AUTHZ- IDs): `docs/INVARIANTS.md`. Every page and endpoint obeys them."

DO NOT CHANGE: any code under `src/`, `docs/CLERK-AUTH.md`, the demo or Playwright docs, `.gitignore`, `astro.config.*`, `package.json`, or the other text in `AGENTS.md`. Create no other docs.

CONFIRM FIRST (stop and report if any one differs)
1. `git branch --show-current` prints `dev`, and `git log -1 --oneline` shows 32bef5b (or a later commit that touches neither file).
2. `AGENTS.md` has an auth table that references `docs/CLERK-AUTH.md`.
3. `docs/INVARIANTS.md` does not exist, and no other rules or invariants doc exists in `docs/` or `.cursor/rules/`.

AADM: run `predone_review` on the diff before you commit. Fix only what it flags in these two files.

TESTS (scoped)
- `rg -c '^- ARCH-' docs/INVARIANTS.md` prints 12.
- `rg -n 'docs/INVARIANTS.md' AGENTS.md` shows exactly one hit.
- `git diff --stat` lists only the two files.

Scoped tests only; typecheck at column end, go at map end. MUST NOT run any typecheck (check:types:touched, npm run check, tsc, tsgo) or npm run go in this slice.
If any AADM tool says do not edit or halt, stop and report; do not continue.
git add only the named files; never stage .tmp/, walk scripts or session files
If the dev server shows a stale or cached error, stop and ask Brian; never edit config files or nudge containers to force a reload.
Skip baseline_guide; use no defect or triage tools. Do not call suggest_aadm_tools.
Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it.

GIT: stay on `dev`, with no branch, stash, reset, restore or amend. Run `git add docs/INVARIANTS.md AGENTS.md` and then `git commit -m "INV-WEB: frontend invariants doc"`. Do not push.

STOP AND REPORT: the commit hash, the three test outputs, the predone_review result, and any confirm-first fact that differed.
