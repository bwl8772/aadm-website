**APP: AADM (aadm-mcp)** · Slice DM0-j1 (INV4-MCP): the scope lock and the trace rules are written into `docs/ARCHITECTURE_INVARIANTS.md` (PRD v0.19, D55)
Repo: ~/github/aadm-mcp on `dev`. Read by Blueprint at b626e4b (clean; Oct 29, 2026). Docs only, no code.

GOAL: Brian's D55 (Oct 29, 2026, PRD v0.19 §A17) locks two things into the invariants so no later slice undoes them: (1) the Field scope rule R6 (Field helps a person decide what to do next or get it done; proof appends and never leads; compliance tracking last; no dashboard for its own sake), and (2) observability built in from the first slice (every ID a server-made UUID, every `artifact_version` traceable to the `request_id` and `idempotency_key` of the call that made it, one JSON log line per call and per hop, per-verb metrics on an operator endpoint, Field's own measures derived from versions, no second audit table). Add 11 rules and retag OBS-01 in place. The website mirror (INV4-WEB, aadm-website `docs/INVARIANTS.md`) is already written with the same IDs; the PRD §A17 holds this wording.

SCOPE
- ADAPT `docs/ARCHITECTURE_INVARIANTS.md` only, 8 edits (7 inserts and 1 replace), applied bottom to top so the line numbers hold. Each line must be inserted or replaced exactly as written under EDITS, byte for byte. Change nothing else.

DO NOT CHANGE: any other line of that doc, `AGENTS.md`, `docs/ENGINEERING_RULES.md`, any ADR, `resources/doctrine/*`, any code, tests or `package.json`. Create no other docs.

CONFIRM FIRST (stop and report if any one differs)
1. `git branch --show-current` prints `dev`, and `git log -1 --oneline` shows b626e4b (or a later commit that does not touch `docs/ARCHITECTURE_INVARIANTS.md`; report its hash).
2. `wc -l docs/ARCHITECTURE_INVARIANTS.md` prints 164, and `git status --short docs/ARCHITECTURE_INVARIANTS.md` prints nothing.
3. `sed -n '43p;68p;114p;141p;142p;143p;164p' docs/ARCHITECTURE_INVARIANTS.md` prints, in order, the lines starting `- IDN-05`, `- CTX-05`, `- ART-01`, `- AUD-02`, `- OBS-01 [mcp]`, `- OBS-02`, `- TST-06`.
4. `rg -c 'UUID|FLD-0|OBS-03|D55' docs/ARCHITECTURE_INVARIANTS.md` prints nothing (0 matches).

EDITS (apply from the bottom of the file upward)
E1. After line 164 (`- TST-06 ...`), append a blank line and then these 5 lines:
## Field scope (PRD v0.19, D55; rule R6 of the delivery map)
- FLD-01 [both] Every Field-core slice (PRD §18 Stages 0, V, F3, F4, H, F5 and F6) passes rule R6: it helps a person decide what to do next or get it done. A slice that only proves something to someone else (an auditor, a dashboard, a parity record) lands in Stage H or later, and no slice is pulled earlier than its place in the order clarity, speed, proof, compliance tracking.
- FLD-02 [both] Proof appends and never leads: Evidence, Verdicts and Decisions are written as the work runs and sit one click below the answer; no customer screen, Slack reply or MCP reply leads with evidence, attestation, health colors or counts.
- FLD-03 [both] Compliance tracking, attestation and audit views are the last batch of the plan, after the fleet batch; they are read models over existing Evidence, Verdict, Decision and `workspace_event` rows and add no table, no verb and no required user step.
- FLD-04 [both] Operator observability (`/health`, `/ready`, OBS-01 to OBS-05) is plumbing: it never becomes a customer screen, and no slice adds a dashboard for its own sake.
E2. After line 143 (`- OBS-02 ...`), insert these 3 lines:
- OBS-03 [mcp] Each service keeps, per verb or route, a request count, a latency histogram and a count per result family, labelled by `client`, credential kind and `release`, and serves them from one operator-only `GET /metrics` route per service (Prometheus text format; on core it needs an operator credential, and on the backend and the agent worker it is on the private network only; none exists today), never from a customer screen.
- OBS-04 [both] Field's own measures (time from Idea to signed Requirements, from Go to a confirmed Verdict, DRIFT rate per prompt template, replans per sign-off, slices done per workspace per week) are read models derived from version `created_at` and Decision rows: never a second write or a new table. They reach a person only inside an answer ("what to do next", PRD rule R6), and they feed the tuning of the prompt library.
- OBS-05 [mcp] `request_id` is the trace key: every hop (client to core, core to backend, backend to the agent worker, backend to a judge through the registry, and every outbound call under INT-01) writes its own log line with the same `request_id` and its own `latency_ms`, so a slow or failed verb is attributed to one hop without a tracing product.
E3. Replace line 142 (OLD, byte for byte):
- OBS-01 [mcp] Every log line is one JSON object with `ts`, `level`, `service`, `release`, `request_id`, route or tool, `workspace_id`, `actor_id`, `latency_ms` and the result `code`.
with NEW:
- OBS-01 [both] Every log line (core, backend, the agent worker and the website's server routes) is one JSON object with `ts`, `level`, `service`, `release`, `request_id`, route or tool, `workspace_id`, `actor_id`, `latency_ms` and the result `code`.
E4. After line 141 (`- AUD-02 ...`), insert:
- AUD-03 [mcp] Field's user work has no separate audit or action table (PRD §A3, rule R3): Sign, Go, confirm and every edit are `artifact_version` rows (Decisions among them); membership, role, invite, credential, entitlement, retention and privileged writes are `workspace_event` rows. AUD-01 is met by those two tables and the log; nothing adds a third store of user actions.
E5. After line 114 (`- ART-01 ...`), insert:
- ART-02 [both] Every `artifact_version` row (the record of one person's or agent's action, PRD §A3) carries its own UUID, `author_actor_id`, `client` (`slack`, `web` or `mcp`), `request_id`, the `idempotency_key` of the call that produced it (null for a server-made version such as a render), `release` and `created_at`. The reply's `saved[]` lists the version UUIDs, and clients use them for every later reference and `expected_version`. One action is traceable end to end, from the client's `idempotency_key` to the server's `request_id` to the version rows it produced and the log line that recorded it, with no second write.
E6. After line 68 (`- CTX-05 ...`), insert:
- CTX-06 [mcp] The backend to agent-worker hop carries `request_id`, `workspace_id`, `actor_id`, the verb and `release`; the worker answers with the same `request_id`, and the version that stores what the agent was asked and what it answered records it (F1-a4). A judge call through the registry (DM1-e4) carries the same `request_id`.
E7. After line 43 (`- IDN-05 ...`), insert (untagged, like IDN-01 to IDN-05; the website mirrors it by ID):
- IDN-06 Every internal ID (`actor_id`, `workspace_id`, `artifact.id`, `artifact_version.id`, `event_id`, `request_id`, and the ID of every Decision, Run, Evidence row and Verdict) is a UUID that Postgres generates as the column default (`uuidv7()` on Postgres 18 or later, else `gen_random_uuid()`; Brian, Oct 29, 2026); application code and clients never supply one, and no sequence, slug, filename or display name stands in for one (IDN-01, ARCH-19). `request_id`, which exists before any row, is the one exception: the server mints it with the same UUID shape and it is stored on every row the call writes.

AADM: run `predone_review` on the diff before you commit. Fix only what it flags in this file, and keep the rule IDs, tags and counts.

TESTS (scoped)
- `wc -l docs/ARCHITECTURE_INVARIANTS.md` prints 177; `rg -c '^- ' docs/ARCHITECTURE_INVARIANTS.md` prints 131; `rg -c '^## ' docs/ARCHITECTURE_INVARIANTS.md` prints 20.
- `rg -c '^- [A-Z]+-[0-9]{2} \[(mcp|website|both)\]' docs/ARCHITECTURE_INVARIANTS.md` prints 90, and the same with `(website|both)` prints 31.
- `rg -c 'UUID' docs/ARCHITECTURE_INVARIANTS.md` prints 2; `D55` 1; `v0.19` 1; `FLD-0` 4; `OBS-0` 6; `request_id` 15; `saved\[\]` 1.
- `rg -n '^- OBS-01' docs/ARCHITECTURE_INVARIANTS.md` prints line 146 and it contains `[both]`; `rg -c 'OBS-01 \[mcp\]'` prints nothing (0).
- `rg -n '^- IDN-06|^- CTX-06|^- ART-02|^- AUD-03|^- OBS-03|^- OBS-04|^- OBS-05|^## Field scope|^- FLD-0[1-4]' docs/ARCHITECTURE_INVARIANTS.md` prints lines 44, 70, 117, 145, 148, 149, 150, 173, 174, 175, 176, 177.
- `git diff --numstat` prints exactly `14	1	docs/ARCHITECTURE_INVARIANTS.md`.

COMMIT (one commit, named files only): `INV4-MCP: scope lock and trace rules (IDN-06, CTX-06, ART-02, AUD-03, OBS-01 both, OBS-03 to OBS-05, FLD-01 to FLD-04)`.

REPORT BACK (the Evidence the PRD's DM0-j1 done-check reads): the commit SHA, the `git diff --numstat` line, each TESTS line with its printed value, and the `predone_review` disposition with its findings.

Scoped tests only; typecheck at column end, go at map end. MUST NOT run any typecheck (check:types:touched, npm run check, tsc, tsgo) or npm run go in this slice.
If any AADM tool says do not edit or halt, stop and report; do not continue.
git add only the named files; never stage .tmp/, walk scripts or session files
If the dev server shows a stale or cached error, stop and ask Brian; never edit config files or nudge containers to force a reload.
Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it.
Do not push.
