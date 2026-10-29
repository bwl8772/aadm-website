# Invariants for aadm-website

Source: Brian's invariants (Oct 25, 2026). The full set, with the same IDs, is `docs/ARCHITECTURE_INVARIANTS.md` in aadm-mcp; this file keeps only the rules that bind the website. Brian's calls of Oct 25, 2026 are included: result codes (TEN-07) and the N-1 contract window (ARCH-21). v0.19 of the PRD (D55, Oct 29, 2026; INV4-WEB) adds the UUID rule (IDN-06), the traceable version row (ART-02), JSON logs on the website's routes (OBS-01), the Field measures (OBS-04) and the Field scope rules (FLD-01 to FLD-04).

## Principles
- **BACK-01.** The backend is authoritative for actor identity, tenant context, membership, authorization, workflow and domain state, side effects, approvals, audit, idempotency and result semantics. The website may render, request, cache, optimistically display or disable controls. It never invents domain truth.
- **DEPLOY-01.** The website and the backend deploy separately, each with its own build, config, health, release identity and rollback. Nothing assumes they ship together.
- **CONTRACT-01.** Build screens and API clients against a defined contract (identity, tenant, API, error and result, approval, run state), not against guessed response shapes.

## Rules
- ARCH-01 The client never establishes tenant authority: no workspace or user ID from the URL, form or local storage is trusted by itself; the server derives it from the Clerk session.
- ARCH-04 No privileged backend credential (M2M secret, service key, Clerk secret key) reaches the browser bundle.
- ARCH-05 Astro pages and server endpoints hold no domain business logic; they call the backend.
- ARCH-08 Retried submits are idempotent; send the key or revision the backend asks for.
- ARCH-13 Consequential external writes need explicit user authorization in the UI and on the backend.
- ARCH-14 An approval screen shows and sends the exact version or hash being approved.
- ARCH-15 The UI renders backend state; it never infers state from missing data or timestamps.
- ARCH-20 Use the backend's names for things. "Chunk" means a document chunk; a group of slices in a delivery map is a "batch".
- ARCH-21 Website and backend releases stay compatible across an explicit contract window: the backend serves the current and the previous API version (N-1), and the website reads the API version from the backend's `/health`.
- ARCH-23 Production state is never repaired through undocumented ad hoc changes.
- ARCH-24 External side effects happen only in backend services, never from the website.
- ARCH-25 Every failure screen is distinguishable from empty, unavailable, unauthorized, indeterminate or rejected.
- IDN-03 Clerk account, profile, workspace membership, session and current workspace are separate concepts in code.
- IDN-06 Every ID the website handles (workspace, artifact, version, Decision, request) is a server-made UUID read from a backend reply; the website never makes one, never derives one from a URL slug or a display name, and never shows one as a name.
- TEN-06 Workspace scope is validated on the server; the website's own checks are convenience only.
- TEN-07 Show each backend result differently, for all 10 families (D44 (2)): `unauthenticated` (sign in), `not_found` (no such workspace for you; never hint it exists), `forbidden` (your role can't do this), `entitlement_required` (your plan doesn't include this; show the upgrade path), `storage_unavailable` (try again later), `conflict` (someone changed it; reload), `rejected` (input refused), `indeterminate` (outcome unknown; check before retrying), `rate_limited` (too many requests; show when to try again), `internal_error` (something broke on our side; show the `request_id`, never "try again later").
- AUTHZ-04 Button visibility is not authorization.

## Day 0 and Day 1 additions (Brian's strawman §12 to §72, Oct 25, 2026, 8:43 PM ET)
Only the rules tagged [website] or [both] in aadm-mcp's `docs/ARCHITECTURE_INVARIANTS.md` are here, with the same IDs, worded for the website. Rules above are cited by ID, not restated.

## Website rules
- CAP-03 [both] Sign, Go, approve, reject, request changes, loosen a setting and accept a risk happen only on website pages in a signed-in human session; the website never offers them to an agent credential (FIX-03).
- CTX-05 [website] Server code sends a `request_id` on every backend call and shows the backend's `request_id` on every error screen.
- API-02 [both] Pages render the backend's read models; no page or component depends on database column names.
- API-06 [both] The website sends its `api_version` on every backend call, and its release config names the backend `api_version` it needs; an older backend gets the `rejected` / `api_version_unsupported` screen (ARCH-21).
- RES-04 [both] The website decides from the refusal body's `code`, `sub_code` and `retryable` (plus `retry_after` for `rate_limited`), never from the message text, and shows the `request_id`; each of the 10 families has its own state, and `forbidden` / `capability_denied` names what the role can't do (D44 (2), (3)).
- RES-05 [website] Every backend response is parsed with a schema; a malformed response or an unknown code shows a visible error with the `request_id`, never an empty state or stale data.
- RUN-03 [both] `indeterminate` is shown as "outcome unknown, checking" until the backend settles it; it is never shown as done, failed, empty or retryable.
- APR-03 [website] Review screens (Sign, Go, use-case decision, verdict override) show the exact stored version and hash, what changed since the last approved version, what pressing the button allows, and which outside system it touches. They never show raw logs.
- ART-02 [both] After a write, the website reads the version UUIDs from the reply's `saved[]` and uses them for every later reference and `expected_version`; it never reconstructs an ID from page state.
- SRC-04 [both] The website has no customer file upload in v1.
- ENV-03 [both] No secret has a default or fallback value in code; an unset optional setting turns its feature off, and `/health` says so.
- ENV-05 [both] The website reads its environment (`dev`, `qa` or `prod`) from one explicit setting and reports it in `/health`; production never depends on a missing variable or a local `.env` file.
- ENV-06 [website] Only `PUBLIC_*` values reach the browser bundle (Clerk publishable key, public URLs, release); the backend URL and every secret are server-only and declared in one schema.
- XO-04 [website] The website is same-origin only: no CORS headers on its routes, Astro's origin check (`security.checkOrigin`) stays on, and the Clerk session cookie is the only browser credential.
- XO-05 [both] Pages and endpoints that carry workspace or account data send `Cache-Control: no-store`.
- OBS-01 [both] Every website server route writes one JSON log line with `ts`, `level`, `service`, `release`, `request_id`, route, `workspace_id`, `actor_id` (never an email), `latency_ms` and the result `code`, under PRIV-02.
- OBS-04 [both] Field's own measures (time from Idea to signed Requirements, from Go to a confirmed Verdict, DRIFT rate per prompt template) come from a backend read model and appear only inside an answer (a card drawer, a next step), never as a dashboard page (FLD-04).
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

## Field scope (PRD v0.19, D55; rule R6 of the delivery map, Oct 29, 2026)
- FLD-01 [both] Every Field-core slice (PRD §18 Stages 0, V, F3, F4, H, F5 and F6) passes rule R6: it helps a person decide what to do next or get it done. A slice that only proves something to someone else (an auditor, a dashboard, a parity record) lands in Stage H or later, and no slice is pulled earlier than its place in the order clarity, speed, proof, compliance tracking.
- FLD-02 [both] Proof appends and never leads: Evidence, Verdicts and Decisions are written as the work runs and sit one click below the answer; no customer screen, Slack reply or MCP reply leads with evidence, attestation, health colors or counts.
- FLD-03 [both] Compliance tracking, attestation and audit views are the last batch of the plan, after the fleet batch; they are read models over existing Evidence, Verdict, Decision and `workspace_event` rows and add no table, no verb and no required user step.
- FLD-04 [both] Operator observability (`/health`, `/ready`, OBS-01 to OBS-05) is plumbing: it never becomes a customer screen, and no slice adds a dashboard for its own sake.
