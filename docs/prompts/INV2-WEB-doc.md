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
