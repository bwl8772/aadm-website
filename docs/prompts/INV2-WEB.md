**APP: AADM (aadm-website)** · Slice INV2-WEB: Day 0 and Day 1 invariants added to the website invariants
Repo: ~/github/aadm-website on `dev`. Read by Blueprint at dba0c8e. Docs only, no code.

GOAL: Add the 24 Day 0 and Day 1 rules that bind the website (Brian's strawman §12 to §72, Oct 25, 2026, 8:43 PM ET), with the same IDs and tags as aadm-mcp's `docs/ARCHITECTURE_INVARIANTS.md`, worded for the website. No new doc files.

SCOPE
- ADAPT `docs/INVARIANTS.md` only: after its last line (line 26, "- AUTHZ-04 Button visibility is not authorization."), add one blank line, then paste the DOC TEXT at the end of this prompt exactly (from "## Day 0 and Day 1 additions" to the last line). Keep lines 1 to 26 as they are.

DO NOT CHANGE: lines 1 to 26 of `docs/INVARIANTS.md`, `AGENTS.md`, `astro.config.mjs`, `package.json`, or anything under `src/`. Create no other docs.

CONFIRM FIRST (stop and report if any one differs)
1. `git branch --show-current` prints `dev`, and `git log -1 --oneline` shows dba0c8e (or a later commit that does not touch `docs/INVARIANTS.md`).
2. `wc -l docs/INVARIANTS.md` prints 26, and line 26 is "- AUTHZ-04 Button visibility is not authorization."
3. `rg -c '^- ' docs/INVARIANTS.md` prints 19, and `rg -n '^- [A-Z]+-[0-9]{2} \[' docs/INVARIANTS.md` prints nothing.

AADM: run `predone_review` on the diff before you commit. Fix only what it flags in this file, and keep the rule IDs, tags and counts.

TESTS (scoped)
- `rg -c '^- [A-Z]+-[0-9]{2} \[(website|both)\]' docs/INVARIANTS.md` prints 24.
- `rg -c '^- ' docs/INVARIANTS.md` prints 43, and `rg -c '^## ' docs/INVARIANTS.md` prints 4.
- `rg -c '^- ARCH-' docs/INVARIANTS.md` still prints 12.
- `wc -l docs/INVARIANTS.md` prints 55.
- `git diff --stat` lists only `docs/INVARIANTS.md`.

Scoped tests only; typecheck at column end, go at map end. MUST NOT run any typecheck (check:types:touched, npm run check, tsc, tsgo) or npm run go in this slice.
If any AADM tool says do not edit or halt, stop and report; do not continue.
git add only the named files; never stage .tmp/, walk scripts or session files
If the dev server shows a stale or cached error, stop and ask Brian; never edit config files or nudge containers to force a reload.
Skip baseline_guide; use no defect or triage tools. Do not call suggest_aadm_tools.
Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it.

GIT: stay on `dev`, with no branch, stash, reset, restore or amend. Run `git add docs/INVARIANTS.md` and then `git commit -m "INV2-WEB: Day 0 and Day 1 website invariant sections"`. Do not push.

STOP AND REPORT: the commit hash, the five test outputs, the predone_review result, and any confirm-first fact that differed.

DOC TEXT for docs/INVARIANTS.md (append after line 26):

## Day 0 and Day 1 additions (Brian's strawman §12 to §72, Oct 25, 2026, 8:43 PM ET)
Only the rules tagged [website] or [both] in aadm-mcp's `docs/ARCHITECTURE_INVARIANTS.md` are here, with the same IDs, worded for the website. Rules above are cited by ID, not restated.

## Website rules
- CAP-03 [both] Sign, Go, approve, reject, request changes, loosen a setting and accept a risk happen only on website pages in a signed-in human session; the website never offers them to an agent credential (FIX-03).
- CTX-05 [website] Server code sends a `request_id` on every backend call and shows the backend's `request_id` on every error screen.
- API-02 [both] Pages render the backend's read models; no page or component depends on database column names.
- API-06 [both] The website sends its `api_version` on every backend call, and its release config names the backend `api_version` it needs; an older backend gets the `rejected` / `api_version_unsupported` screen (ARCH-21).
- RES-04 [both] The website decides from the refusal body's `code`, `sub_code` and `retryable`, never from the message text, and shows the `request_id`.
- RES-05 [website] Every backend response is parsed with a schema; a malformed response or an unknown code shows a visible error with the `request_id`, never an empty state or stale data.
- RUN-03 [both] `indeterminate` is shown as "outcome unknown, checking" until the backend settles it; it is never shown as done, failed, empty or retryable.
- APR-03 [website] Review screens (Sign, Go, use-case decision, verdict override) show the exact stored version and hash, what changed since the last approved version, what pressing the button allows, and which outside system it touches. They never show raw logs.
- SRC-04 [both] The website has no customer file upload in v1.
- ENV-03 [both] No secret has a default or fallback value in code; an unset optional setting turns its feature off, and `/health` says so.
- ENV-05 [both] The website reads its environment (`dev`, `qa` or `prod`) from one explicit setting and reports it in `/health`; production never depends on a missing variable or a local `.env` file.
- ENV-06 [website] Only `PUBLIC_*` values reach the browser bundle (Clerk publishable key, public URLs, release); the backend URL and every secret are server-only and declared in one schema.
- XO-04 [website] The website is same-origin only: no CORS headers on its routes, Astro's origin check (`security.checkOrigin`) stays on, and the Clerk session cookie is the only browser credential.
- XO-05 [both] Pages and endpoints that carry workspace or account data send `Cache-Control: no-store`.
- PRIV-01 [both] Logs and analytics never hold tokens, keys, env values, invite tokens, prompt or report bodies, or evidence field values.
- PRIV-02 [website] Analytics and browser error reports carry no token, invite path, email or workspace name.
- OPS-01 [both] Each deploy has an immutable release ID (image tag or commit SHA), shown in `/health` and sent on every backend call.
- OPS-03 [website] `/health` shows the release, that runtime config is present, and the backend `api_version` it reached (DM5-b4).
- OPS-05 [both] A website release that needs a backend release at the same time is marked coordinated in its slice; otherwise the website deploys and rolls back alone.
- OPS-08 [both] Every server call to the backend has a timeout, and forms cap payload size before sending.
- OPS-09 [website] Browser errors are reported to the website's server log with the release and `request_id`, under PRIV-02.
- TST-01 [both] CI runs on every pull request and every push to `dev`: build, scoped tests, a secret scan and a dependency audit. A red run blocks deploy.
- TST-04 [both] Contract tests run the website against the backend's N and N-1 response schemas (DM5-b4).
- TST-05 [both] A deploy smoke test calls the website's `/health` and makes one signed-in read through the website to the backend.
