**APP: AADM (aadm-mcp)** · Slice INV2-MCP: Day 0 and Day 1 invariants added to aadm-mcp's invariants doc
Repo: ~/github/aadm-mcp on `dev`. Read by Blueprint at 78d93b8. Docs only, no code.

GOAL: Add Brian's Day 0 and Day 1 rules (his strawman §12 to §72, Oct 25, 2026, 8:43 PM ET) to the one canonical invariants doc as 80 tagged rules in 15 new sections (CAP, CTX, API, RES, ENV, XO, DATA, SRC, ART, EVD, APR, RUN, JDG, INT, EVT, AUD, OBS, PRIV, OPS, TST), so later slices cite these IDs. Each rule is tagged [mcp], [website] or [both]. No new doc files.

SCOPE
- ADAPT `docs/ARCHITECTURE_INVARIANTS.md` only: after its last line (line 52, "- AUTHZ-03 ..."), add one blank line, then paste the DOC TEXT at the end of this prompt exactly (from "## Day 0 and Day 1 additions" to the last line). Keep lines 1 to 52 as they are.

DO NOT CHANGE: lines 1 to 52 of that doc, `AGENTS.md`, `docs/ENGINEERING_RULES.md`, any ADR, `resources/doctrine/*`, any code, tests or `package.json`. Create no other docs (no DECISION_LOG, API_CONTRACT or other strawman §63 files).

CONFIRM FIRST (stop and report if any one differs)
1. `git branch --show-current` prints `dev`, and `git log -1 --oneline` shows 78d93b8 (or a later commit that does not touch `docs/ARCHITECTURE_INVARIANTS.md`).
2. `wc -l docs/ARCHITECTURE_INVARIANTS.md` prints 52, and line 52 starts with "- AUTHZ-03".
3. `rg -c '^- ' docs/ARCHITECTURE_INVARIANTS.md` prints 40, and `rg -n '^- (CAP|CTX|API|RES|ENV|XO|DATA|SRC|ART|EVD|APR|RUN|JDG|INT|EVT|AUD|OBS|PRIV|OPS|TST)-' docs/ARCHITECTURE_INVARIANTS.md` prints nothing.

AADM: run `predone_review` on the diff before you commit. Fix only what it flags in this file, and keep the rule IDs, tags and counts.

TESTS (scoped)
- `rg -c '^- [A-Z]+-[0-9]{2} \[(mcp|website|both)\]' docs/ARCHITECTURE_INVARIANTS.md` prints 80.
- `rg -c '^- [A-Z]+-[0-9]{2} \[(website|both)\]' docs/ARCHITECTURE_INVARIANTS.md` prints 24.
- `rg -c '^- ' docs/ARCHITECTURE_INVARIANTS.md` prints 120, `rg -c '^## ' docs/ARCHITECTURE_INVARIANTS.md` prints 19, and `rg -c '^- ARCH-' docs/ARCHITECTURE_INVARIANTS.md` still prints 24.
- `wc -l docs/ARCHITECTURE_INVARIANTS.md` prints 164.
- `git diff --stat` lists only `docs/ARCHITECTURE_INVARIANTS.md`.

Scoped tests only; typecheck at column end, go at map end. MUST NOT run any typecheck (check:types:touched, npm run check, tsc, tsgo) or npm run go in this slice.
If any AADM tool says do not edit or halt, stop and report; do not continue.
git add only the named files; never stage .tmp/, walk scripts or session files
If the dev server shows a stale or cached error, stop and ask Brian; never edit config files or nudge containers to force a reload.
Skip baseline_guide; use no defect or triage tools. Do not call suggest_aadm_tools.
Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it.

GIT: stay on `dev`, with no branch, stash, reset, restore or amend. Run `git add docs/ARCHITECTURE_INVARIANTS.md` and then `git commit -m "INV2-MCP: Day 0 and Day 1 invariant sections (CAP to TST)"`. Do not push.

STOP AND REPORT: the commit hash, the five test outputs, the predone_review result, and any confirm-first fact that differed.

DOC TEXT for docs/ARCHITECTURE_INVARIANTS.md (append after line 52):

## Day 0 and Day 1 additions (Brian's strawman §12 to §72, Oct 25, 2026, 8:43 PM ET)
Each rule is tagged with the repo it binds: [mcp] (core and backend modes), [website], or [both]. Rules already above are cited by ID, not restated. Decision log: material decisions are the ADRs in `docs/adr/` (001 to 005) plus the PRD's D-numbers; there is no separate decision-log file.

## Capabilities
Strawman mapping: `ticket.draft` is `artifact.write` on a prompt; `ticket.publish` is Go (`approval.resolve`); `run.retry` and `run.cancel` are `run.control`; `integration.*` has no tool in v1.
- CAP-01 [mcp] Every MCP tool and plans-API route declares one capability next to its plan tag (DM1-e5), from this closed list: `tool.run` (stateless; saves nothing), `source.read`, `source.write` (Terrain facts), `artifact.read`, `artifact.write` (use case, cornerstone, map, batch, slice, prompt), `report.write`, `approval.request`, `approval.resolve`, `run.control`. A build check fails on a missing or unknown capability.
- CAP-02 [mcp] One table in code maps each role and each credential kind to its capabilities, and the effective set is their intersection with the plan tag (AUTHZ-01, AUTHZ-02). `coder` holds only `tool.run`, `artifact.read` and `report.write`; `viewer` holds only read capabilities; `acceptor` adds `approval.resolve` for co-sign only.
- CAP-03 [both] `approval.resolve` (Sign, Go, approve, reject, request changes, loosen a setting, accept a risk) needs a human web session; agent, `aadm_`, `ak_`, OAuth and M2M credentials never hold it (FIX-03, ARCH-16).

## Request context
- CTX-01 [mcp] Core and backend give every request a server-made `request_id` and return it in the `x-request-id` response header; an inbound `x-request-id` is kept only as `client_request_id`.
- CTX-02 [mcp] The request context is built once at the server boundary from the verified credential: `request_id`, `actor_id`, credential kind, `workspace_id`, role, plan tags, capabilities, `api_version` and `release`. No context field comes from the request body (TEN-02, TEN-05).
- CTX-03 [mcp] The context is passed explicitly to services, repositories (`withWorkspaceTx`), outbound calls, judgments, event rows and log lines; no module re-derives the actor or the workspace.
- CTX-04 [mcp] The core to backend M2M hop carries `request_id` and `api_version`, and the backend logs the same `request_id`.
- CTX-05 [website] The website's server code sends a `request_id` on every backend call and shows the backend's `request_id` on every error screen.

## API boundary and versioning
- API-01 [mcp] Every plans-API route and MCP tool has one contract entry: purpose, auth (public, user session, M2M or people-only), request schema, response schema, result codes, idempotency, pagination and `api_version`. A test fails for a registered route or tool without an entry.
- API-02 [both] Responses are purpose-built read models: no response returns a raw table row, and no client depends on column names.
- API-03 [mcp] A list response pages with an opaque cursor and a maximum page size; no response returns an unbounded list.
- API-04 [mcp] Public routes are named in one list (today `/health`, `/health/auth` and `/.well-known/*` on core); `aadm-backend` has none (FIX-25).
- API-05 [mcp] `api_version` is one integer. A breaking change (a removed or renamed field, a changed meaning, a new required input) raises it; adding an optional field does not, and every client ignores unknown fields.
- API-06 [both] Every caller sends its `api_version`; the backend serves N and N-1 and refuses older callers with `rejected` / `api_version_unsupported` (ARCH-21). The website's release config names the backend `api_version` it needs.
- API-07 [mcp] A public MCP tool's schema changes additively; a renamed key is served under both names for one release, as DM0-c3 does for `chunks`.
- API-08 [mcp] Idempotency (ARCH-08): a key is scoped to workspace, actor and tool; the same key with the same request hash replays the stored result; the same key with a different hash returns `conflict` / `idempotency_conflict`; keys are kept for the idempotency window setting.

## Results and errors
- RES-01 [mcp] Every command and query returns an explicit result: `ok` (an empty query result is `ok` with an empty list and a count of 0, D43) or one TEN-07 family with a sub-code. A handler that throws or returns nothing maps to a family, never to `ok`.
- RES-02 [mcp] One module owns every family and sub-code (`src/result-codes.ts`, DM2-a3); an unknown or empty code fails the tests.
- RES-03 [mcp] Strawman error kinds map to families: validation is `rejected` / `invalid_input`; policy is `rejected` / `policy_rejected`; rate limit is `rejected` / `rate_limited` with `retry_after`; a timeout or lost reply after a write was sent is `indeterminate`; a dependency outage or internal failure before any write is `storage_unavailable` / `dependency_unavailable` or `internal_error`.
- RES-04 [both] Every refusal body has `code`, `sub_code`, `retryable` (true or false), `request_id` and a message for people; clients decide from `code`, `sub_code` and `retryable`, never from the message text.
- RES-05 [website] The website parses every backend response with a schema; a malformed response or an unknown code shows a visible error with the `request_id`, never an empty state or stale data.

## Environment and secrets
- ENV-01 [mcp] Each start mode validates its settings against one schema at startup and exits non-zero on a missing or malformed required value.
- ENV-02 [mcp] In production, core refuses to start when `CLERK_SECRET_KEY` is unset; auth mode `open` exists only in local dev (IDN-04, DM2-a4).
- ENV-03 [both] No secret has a default or fallback value in code; an unset optional setting turns its feature off, and `/health` says so.
- ENV-04 [mcp] Database, storage and webhook-signing secrets are set on `aadm-backend` only; core gets none (§13d, ARCH-04).
- ENV-05 [both] Each service reads its environment (`dev`, `qa` or `prod`) from one explicit setting and reports it in `/health`; production behavior never depends on a missing variable or a local `.env` file.
- ENV-06 [website] Only `PUBLIC_*` values reach the browser bundle (Clerk publishable key, public URLs, release); the backend URL and every secret are server-only and declared in one schema.

## Cross-origin and browser boundary
- XO-01 [mcp] In production, `/mcp` sends CORS headers only for origins on a named allowlist; it never echoes an arbitrary `Origin` and never sends `*`. Public metadata routes (`/.well-known/*`, `/health`) may send `*` without credentials.
- XO-02 [mcp] Credentials travel only in the `Authorization` header: never in a query string or a cookie, and never in a log.
- XO-03 [mcp] `aadm-backend` serves no browser and sends no CORS headers.
- XO-04 [website] The website is same-origin only: no CORS headers on its routes, Astro's origin check (`security.checkOrigin`) stays on, and the Clerk session cookie is the only browser credential.
- XO-05 [both] Responses that carry workspace or account data send `Cache-Control: no-store`.

## Data
- DATA-01 [mcp] Every status column is NOT NULL with a fixed value list the database enforces; null or an empty string never stands for a state.
- DATA-02 [mcp] Schema state rebuilds from `db/migrations` alone on an empty Postgres (ARCH-22). A destructive migration (drop, rename or narrowing a type) carries a reviewed marker, and the migration lint fails without it.
- DATA-03 [mcp] Privileged database access (the migration runner, retention jobs, the billing-webhook writer) uses its own role from those named entry points only, and every privileged write records an event row (ARCH-18, TEN-03).
- DATA-04 [mcp] Lifecycle (D7): a plan is active, then archived read-only after CFG-RET-01; a closed workspace is exported, then hard-deleted after CFG-RET-02 (FIX-24). Hard delete removes every row and blob with that `workspace_id`, including renders, judgments and evidence references.
- DATA-05 [mcp] Consequential writes check `expected_revision` and return `conflict` on a stale one: Sign, Go, verdicts, use-case decisions, setting changes, and member and role changes. Nothing is last-write-wins.

## Sources, artifacts and evidence
- SRC-01 [mcp] A source is a reference, never a body: AADM stores no customer document text (FIX-01, FIX-07). A Terrain fact names its `source_kind` (`repo_crawl`, `import`, `interview`, `manual`) and `source_ref` (commit SHA, content SHA-256 or interview ID).
- SRC-02 [mcp] Every stored artifact records the source versions it used (`commit_read`, `grounding_commits`, `refs[].source_revision`, `item_sha256`), so its inputs can be named after they change.
- SRC-03 [mcp] The blob store holds only server-made renders and exports: the server picks the key under the workspace prefix, checks type (SVG, PNG or export JSON) and size, stores the SHA-256, and serves the file only through expiring signed URLs (CFG-TECH-08). No bucket is public.
- SRC-04 [both] No route accepts a customer file upload in v1; host-side imports are parsed on the host (DMT-a2), and only allowlisted facts cross (§13a.2).
- ART-01 [mcp] Every consequential artifact (cornerstone version, use case version, plan revision, prompt, report, verdict, judgment, render, export) has an ID, `workspace_id`, type, schema version, status, origin (slice, prompt version or plan revision), `created_at`, `content_sha256` and a producer (`actor_id` or `judged_by`).
- EVD-01 [mcp] An evidence locator is a `file_ref` (repo-relative path, line range, `content_sha256`) or an allowlisted item ID (`TF-`, `OUT-`, `SH-` and the other §13a.2 kinds).
- EVD-02 [mcp] Each judgment finding names its rule ID and the item IDs it read.

## Approvals and run state
- APR-01 [mcp] An approval record holds what it allows, the artifact ID, version and SHA-256, who asked, who decided (`actor_id`, web session), when, the decision (`approve`, `changes_requested` or `reject`) and the reason. It is append-only.
- APR-02 [mcp] An approval never carries over to a new version: a prompt changed after Go returns `conflict` / `prompt_changed_after_go`, and cornerstone v N+1 needs a new signature (ARCH-14).
- APR-03 [website] Review screens (Sign, Go, use-case decision, verdict override) show the exact stored version and hash, what changed since the last approved version, what pressing the button allows, and which outside system it touches. They never show raw logs.
- RUN-01 [mcp] Each status-bearing entity (slice, prompt, use case, cornerstone version, Terrain fact, render) has one transition table in its command service; any other transition returns `conflict` / `invalid_transition`.
- RUN-02 [mcp] A slice reaches `done` only through a final ON PLAN verdict (DM3-b3); the run-store cache is never the record of state (ARCH-09).
- RUN-03 [both] `indeterminate` stays indeterminate: it is never stored or shown as done, failed, empty or retryable until a read-back by `idempotency_key` settles it.

## Judgments (AADM's stand-in for AI execution)
- JDG-01 [mcp] AADM makes no model call (FIX-12); the DM1-c3 guard fails the build on an LLM SDK or an off-list host.
- JDG-02 [mcp] Every stored judgment comes from the judgment registry (DM1-e4) calling a core tool by name, and stores its input hashes, output schema version and `judged_by` (ARCH-17).
- JDG-03 [mcp] A judgment only suggests; the command service or a person decides the state change (suggested and final verdicts, DM3-b1, DM3-b2).
- JDG-04 [mcp] A stored coder prompt has a stable ID (`slice_id` plus version), SHA-256, author, `standard_version`, status and append-only history; each report names the prompt version it ran.
- JDG-05 [mcp] Every judge tool has a golden fixture set (known input, expected findings with rule IDs) that runs in the tests; a change in its output fails until the golden file changes in the same commit.

## Integrations and side effects
- INT-01 [mcp] Every outbound call (Clerk, Clerk Billing, the blob store, any later integration) goes through one client that sets a timeout, sends `request_id`, maps status to TEN-07 families, redacts secrets and caps logged body size.
- INT-02 [mcp] Outbound hosts are on a named allowlist (DM1-c3; CFG-TECH-14 in mode c).
- INT-03 [mcp] A consequential outside write runs in this order: validate, authorize (AUTHZ-03), resolve idempotency, store a pending row, call, store the external ID, mark done, write the event, return. On failure the row says `not_sent`, `sent` or `unknown`.

## Events, audit, observability and privacy
- EVT-01 [mcp] Event types are a closed list per event table in one module, named noun then past-tense verb (as `workspace_event` does). Every event row has `event_id`, type, `at`, `workspace_id`, `actor_id`, `request_id`, entity type and ID, schema version and `release`.
- AUD-01 [mcp] Audit events cover Sign, Go, approvals, verdict overrides, setting loosening, member, role, invite and credential changes, privileged writes, retention deletes, exports and outside writes; each names the actor, credential kind, role, capability and entity version.
- AUD-02 [mcp] Event and audit tables are append-only: `aadm_app` has no UPDATE or DELETE grant on them (DM1-b3).
- OBS-01 [mcp] Every log line is one JSON object with `ts`, `level`, `service`, `release`, `request_id`, route or tool, `workspace_id`, `actor_id`, `latency_ms` and the result `code`.
- OBS-02 [mcp] Workflow log lines add `slice_id`, the transition, and each judgment's tool and outcome.
- PRIV-01 [both] Logs, traces, analytics and event rows never hold tokens, keys, env values, invite tokens, prompt or report bodies, or evidence field values; a test feeds secret-shaped strings through each logger and finds none.
- PRIV-02 [website] Analytics and browser error reports carry no token, invite path, email or workspace name.

## Operations
- OPS-01 [both] Each deploy has an immutable release ID (image tag or commit SHA), shown in `/health`, in every log line and event row, and sent by the website on every backend call (ARCH-21, DM0-b4, DM5-b4).
- OPS-02 [mcp] `/health` is liveness only and holds no secret or env value; a separate `/ready` reports config valid, database reachable, migrations at the expected version and Clerk reachable, and the platform routes traffic only when it passes.
- OPS-03 [website] The website's `/health` shows its release, that its runtime config is present, and the backend `api_version` it reached (DM5-b4).
- OPS-04 [mcp] Operator switches need a setting change and a restart, not a code change: unsetting `AADM_BACKEND_URL` stops all saves (CFG-TECH-03), a disabled-tools list hides named tools, and a freeze stops Go and `delivery_map_next_slice`.
- OPS-05 [both] A release that needs both services deployed together is marked coordinated in its slice; otherwise each service deploys and rolls back alone.
- OPS-06 [mcp] Recovery steps (website rollback, backend rollback or forward fix, failed migration, secret rotation, stuck slice, failed outside write, database restore) live in `docs/runbooks/` next to the prod-migration runbook (DM1-c4).
- OPS-07 [mcp] The operator owns backups (Brian for AADM Cloud, the customer in mode c, §5.18); backup frequency and retention are operator settings; a restore is tested before the C7 column check, and an untested backup does not count.
- OPS-08 [both] Every route and tool has a timeout and caps on payload size and item count; render, export and invite accept are rate-limited per actor (CFG-TECH-10). Unbounded work is a defect.
- OPS-09 [website] Browser errors are reported to the website's server log with the release and `request_id`, under PRIV-02.

## Tests
- TST-01 [both] CI runs on every pull request and every push to `dev`: build, scoped tests, a secret scan and a dependency audit. A red run blocks deploy.
- TST-02 [mcp] The isolation suite proves a member of workspace A gets `not_found` for B's IDs on every route and tool: by direct ID, by a hand-built call, by a widened M2M field, and with RLS off (DM1-e2, DM1-a3).
- TST-03 [mcp] One deterministic fixture set: workspaces A and B, an owner, a planner, a coder credential, a non-member, a signed cornerstone, a plan with one batch and one slice, a prompt, a report, a use-case approval and a render. It covers the happy path, refusal, cross-tenant access, a failed dependency, a duplicate request and a rejected approval.
- TST-04 [both] Contract tests: the backend publishes its response schemas per `api_version`, a breaking change without a version bump fails, and the website tests against the N and N-1 schemas (DM5-b4).
- TST-05 [both] A deploy smoke test calls `/health` on each service and makes one signed-in read through website to backend and through core to backend.
- TST-06 [mcp] Each Day 0 test exists before its stage's column check: config validation, missing app identity, isolation, `request_id` propagation, result mapping, idempotent replay, transition rules and migration apply.
