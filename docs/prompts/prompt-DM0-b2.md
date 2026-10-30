**APP: AADM (aadm-mcp)**
AADM DM0-b2: core's forwarding client to `aadm-backend`: `forwardVerb(name, input, ctx)` posts to `POST /internal/verbs/<name>` with a short-lived Clerk M2M token and the `request_id`; with the backend URL unset it returns `storage_unavailable`; no MCP tool uses it until F1-a3, and `tools/list` is unchanged
Repo aadm-mcp · read at local dev `30c5f7c` (Oct 29, 2026; clean; DM0-b1 is `30c5f7c`) · work on dev, NO branches · Stage V of the AADM Field plan (PRD v0.19, aadm-website `docs/PRD-aadm-delivery-maps.md` §18, rules R1 to R7) · the PRD's older DM0-b2 text ("every save tool and the 8 FDE tools forward") is replaced: the DM0-a3 addendum keeps the 8 FDE tools stateless in core, and no save tool or Field verb exists yet
BEFORE YOU START: Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it.

GOAL
ADR 004's addendum §3 says MCP calls go to core, which forwards to the backend with a Clerk M2M token (lifetime ≤ 300 s) carrying the verified principal, and §6 says that with the backend URL unset every save path returns `storage_unavailable` and core never writes. DM0-b1 built the backend's side of that seam. This slice builds core's side as a library module and proves it against DM0-b1's handler. Nothing calls it yet: F1-a3 registers the `field_*` tools on top of it. No tool, route or behaviour of core changes.

SCOPE (3 files)
- NEW `src/backend-client.ts`. It must:
  - Export `createBackendClient({ backendUrl, mintToken, timeoutMs, fetchImpl })`, every option injectable for tests. Defaults: `backendUrl` from `AADM_BACKEND_URL`; `timeoutMs` 10000; `fetchImpl` the global `fetch`; `mintToken` calls `createClerkClient({ secretKey: CLERK_SECRET_KEY }).m2m.createToken({ secondsUntilExpiration })` with `secondsUntilExpiration` from `AADM_M2M_TOKEN_TTL_SECONDS`, default 300 and capped at 300 (CFG-TECH-01), and passes `machineSecretKey` from `CLERK_MACHINE_SECRET_KEY` when that is set (see ASK).
  - Cache the minted token in memory and mint a new one when less than 30 s of its lifetime remain. Never log it.
  - Export `forwardVerb(name, input, ctx: { request_id: string; actor_id?: string; workspace_id?: string })` on the client. It returns `{ ok: true, status, body }` or `{ ok: false, code, sub_code?, retryable, request_id }` and never throws:
    - Backend URL unset or blank: `{ ok: false, code: "storage_unavailable", sub_code: "backend_not_configured", retryable: false }`, with no network call and no token minted.
    - Otherwise POST `${backendUrl}/internal/verbs/${encodeURIComponent(name)}` with `Authorization: Bearer <token>`, `content-type: application/json`, `x-request-id: <ctx.request_id>` and a JSON body `{ input, actor_id, workspace_id }`.
    - A 2xx returns `ok: true` with the parsed body. A body with a `code` field on a non-2xx is passed through, including `request_id`. A 401 from the backend is `{ code: "storage_unavailable", sub_code: "backend_auth_failed", retryable: false }`, since the user's own credential was already accepted by core.
    - A timeout (AbortController) or a refused connection is `{ code: "storage_unavailable", sub_code: "dependency_unavailable", retryable: true }`. A failed token mint is `{ code: "storage_unavailable", sub_code: "backend_auth_failed", retryable: false }`.
    - Each forwarded call writes one JSON line to stdout with `ts`, `level`, `service: "aadm-core"`, `event: "forward"`, `request_id`, `verb`, `status` or `code`, and `latency_ms` (OBS-01, OBS-05), and never the token, the input or the body (PRIV-01).
- NEW `tests/backend-client/backend-client.test.ts`. It starts DM0-b1's `createBackendRequestHandler` on `127.0.0.1:0` with a fake verifier that accepts only the token the test's fake `mintToken` returns, and a test-registered `echo` verb. It must check:
  - URL unset: `storage_unavailable` / `backend_not_configured`, and `mintToken` was not called.
  - A forwarded `echo` returns `ok: true` with the input, and the backend saw `x-request-id` equal to `ctx.request_id` as an inbound header (the backend still makes its own `request_id`; the test records the inbound header in the verb by reading it through a small test-only wrapper around the handler).
  - Two calls within the token lifetime mint once; a token with under 30 s left is re-minted.
  - A wrong token gives `backend_auth_failed`; an unregistered verb passes `not_found` through with the backend's `request_id`.
  - A backend that never answers gives `dependency_unavailable` within `timeoutMs` (use 200 ms in the test); a closed port gives `dependency_unavailable`.
  - A failing `mintToken` gives `backend_auth_failed`.
  - The captured stdout lines hold no token string and no input value.
- ADAPT `package.json` scripts, 1 line: add `"test:backend-client": "tsx tests/backend-client/backend-client.test.ts"`.

ASK (Brian's, not the coder's): Clerk's `m2m.createToken` may need a machine secret key rather than the instance secret key. This slice reads the NAME `CLERK_MACHINE_SECRET_KEY` (the one env name it adds beyond the addendum's list) and passes it only when set. Brian creates the Clerk machine for core and sets that value on the core service before DM0-b3; the coder never sets or reads its value.

DO NOT CHANGE
`src/index.ts`, `src/tools.ts`, `src/mcp-server-factory.ts`, `src/mcp-auth.ts`, `src/backend-service.ts`, the 8 FDE handler modules, `Dockerfile`, `railway.toml`, `scripts/`, ADRs, `docs/`, and dependencies. Register no MCP tool. Add no env NAME beyond `AADM_BACKEND_URL`, `AADM_M2M_TOKEN_TTL_SECONDS` (addendum §7) and `CLERK_MACHINE_SECRET_KEY` (ASK). Never read, print or set `.env`, secrets, keys or Railway variables.

CONFIRM FIRST (LIGHTER: run merge-base, then check the facts; stop only if a fact differs)
- `git merge-base --is-ancestor 30c5f7c HEAD` exits 0 and `git status --short` is empty.
- `src/backend-service.ts` exports `createBackendRequestHandler` and `VerbHandler`, and `npm run test:backend-service` prints `8 passed`.
- `node_modules/@clerk/backend/dist/api/endpoints/M2MTokenApi.d.ts` has `createToken(params?: CreateM2MTokenParams): Promise<M2MToken>;` (:82), and `CreateM2MTokenParams` has `machineSecretKey` and `secondsUntilExpiration`.
- `grep -rn "AADM_BACKEND_URL\|AADM_M2M_TOKEN_TTL_SECONDS\|CLERK_MACHINE_SECRET_KEY" src scripts tests` returns nothing.
- `grep -c "registerTool(" src/tools.ts` prints 68.

TESTS
Run `npm run test:backend-client` until it passes, `npm run test:backend-service` once (still 8 passed), and `grep -c "registerTool(" src/tools.ts` (still 68). Run `npx biome check src/backend-client.ts tests/backend-client/backend-client.test.ts package.json`. Do not build: `npm run build` is `tsc` and belongs to the CV column check.

RULES AND AADM — REQUIRED (report each)
- Read AGENTS.md, ADR 004 with its addendum (§3, §6, §7), ADR 005 and `docs/ARCHITECTURE_INVARIANTS.md` (CTX-01, CTX-04, INT-01, OBS-01, OBS-05, PRIV-01, RES-04), and list the rules that apply (file and section).
- Scoped tests only; typecheck at column end, go at map end. MUST NOT run any typecheck (check:types:touched, npm run check, tsc, tsgo) or npm run go in this slice.
- If the dev server shows a stale or cached error, stop and ask Brian; never edit config files or nudge containers to force a reload.
- Skip baseline_guide; use no defect or triage tools. Do not call suggest_aadm_tools.
- AADM: run predone_review on your diff, then fix and re-run until it approves. Report every caught error as a signal; each must log or map to a result code, never vanish. Paste the verdict. After each AADM call, report the tool, its key finding and what you changed.
- If any AADM tool says do not edit or halt, stop and report; do not continue.
- If AADM or a repo rule conflicts with this prompt, stop and report it. If this becomes more than one behaviour, don't commit; send a batch request.

GIT
Make one commit on dev, by pathspec, with no branches.
- Run `git add -N src/backend-client.ts tests/backend-client/backend-client.test.ts`. If .git/index.lock exists, wait for it to clear.
- Then `git add src/backend-client.ts tests/backend-client/backend-client.test.ts package.json` and `git commit` with those same 3 paths.
- git add only the named files; never stage .tmp/, walk scripts or session files
- Never use -A or `.`. Never stash, reset, restore or amend. No push.
- Commit message: "DM0-b2: core forwarding client — M2M-authed POST to aadm-backend /internal/verbs, request_id carried, storage_unavailable when unset; no tool uses it yet"

STOP AND REPORT (at the slice boundary)
Stop at once if a confirm-first fact differs or one of your named files changes under you. Otherwise, report:
- the confirm-first output;
- the test, `test:backend-service`, tool count and biome output;
- the predone_review verdict;
- the commit hash, `git show --stat` (3 files) and `git status --short`.
Then stop. Next is DM0-b3 (Railway, Brian's step), then V-a.
