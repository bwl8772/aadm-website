**APP: AADM (aadm-mcp)**
AADM DM0-b1: the `backend` start mode of the same image (`aadm-backend`) boots, serves `GET /health`, and accepts `POST /internal/verbs/<name>` only with a valid Clerk M2M token; the verb registry is empty until F1-a3, and core mode is unchanged
Repo aadm-mcp · read at local dev `67e7a8c` (Oct 29, 2026; clean; DM0-a3 is `4b475d5`, INV4-MCP is `67e7a8c`) · work on dev, NO branches · Stage V of the AADM Field plan (PRD v0.19, aadm-website `docs/PRD-aadm-delivery-maps.md` §18, rules R1 to R7) · this prompt replaces the Oct 25 draft, which built an `aadm-fde` container for the 8 FDE tools; the DM0-a3 addendum (ADR 004 §2) keeps those tools stateless in core, so they do not move
BEFORE YOU START: Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it.

GOAL
ADR 004's addendum (DM0-a3) says one image has three start modes chosen by `AADM_START_MODE`: `core` (today's server, saves nothing), `backend` (`aadm-backend`, private, owns the plans API and the Field verbs) and `agent` (later, F1-a4). This slice adds the `backend` mode and nothing behind it: a private HTTP server that boots, answers `GET /health`, and exposes the forwarding seam DM0-b2 will call, `POST /internal/verbs/<name>`, guarded by a Clerk M2M token (addendum §3). No verb exists yet: F1-a3 registers them. With `AADM_START_MODE` unset or `core`, the server behaves exactly as today. No database, no forwarding from core (DM0-b2), no Railway service (DM0-b3, Brian's step).

SCOPE (4 files)
- NEW `src/backend-service.ts`. It must:
  - Export `createBackendRequestHandler({ verifyM2MToken, verbs })`, built on `node:http` like `src/index.ts:604`. `verbs` is a `Map<string, (input: unknown, ctx: { request_id: string; caller: string }) => Promise<unknown>>`; the default is an empty map.
  - Mint a UUID `request_id` per request with `crypto.randomUUID()` (node built-in; PRD rule R7 and CTX-01: this is the one ID the server, not Postgres, makes) and return it in the `x-request-id` header on every response. An inbound `x-request-id` is never used as the `request_id`.
  - Handle these cases:
    - `GET /health` returns 200 `{ ok: true, mode: "backend" }` with no env value and no secret.
    - `POST /internal/verbs/<name>`: a missing or invalid `Authorization: Bearer` gets 401 `{ code: "unauthenticated", request_id }`; a name not in `verbs` gets 404 `{ code: "not_found", request_id }`; otherwise it parses the JSON body, calls the verb with the `request_id` and the verified caller, and returns 200 with the verb's result. A body that is not JSON gets 400 `{ code: "rejected", sub_code: "invalid_input", request_id }`. A thrown verb gets 500 `{ code: "internal_error", request_id }` with no stack in the body.
    - Every other path or method gets 404 `{ code: "not_found", request_id }`.
  - Copy the `writeJson` shape from `src/index.ts:138-146`; do not import from `index.ts`.
  - Its default verifier is `createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).m2m.verify({ token })` (`@clerk/backend`, `M2MTokenApi.verify`, `.d.ts:84`). The caller is the verified token's machine id. If `CLERK_SECRET_KEY` is unset, every internal call gets 401; there is no open mode in this file.
  - Export `startBackend()`, which listens on `PORT` (the same parse as `src/index.ts:241`) and logs one line at start naming the mode, never an env value.
- ADAPT `src/index.ts`, at most 4 lines at the top of `main()` (`:583`): when `process.env.AADM_START_MODE === "backend"`, `await` a dynamic `import("./backend-service.js")`, call `startBackend()` and return. Any other value, including unset, runs today's code unchanged. Change nothing else in `index.ts`.
- NEW `tests/backend-service/backend-service.test.ts`, using an injected fake verifier and starting no Clerk call. It must check:
  - `GET /health` is 200 with `mode: "backend"` and an `x-request-id` header that parses as a UUID.
  - Two requests get two different `request_id`s; an inbound `x-request-id: abc` is not echoed as the `request_id`.
  - `POST /internal/verbs/ping` with no token, and with a token the fake verifier rejects, gets 401.
  - With a valid token, an unregistered verb gets 404, and a test-registered `ping` verb gets 200 with its result and receives the same `request_id` that is in the response header.
  - A non-JSON body gets 400 `rejected`, and a verb that throws gets 500 `internal_error` with no stack text in the body.
  - Unknown paths get 404.
- ADAPT `package.json` scripts, 1 line: add `"test:backend-service": "tsx tests/backend-service/backend-service.test.ts"`.

DO NOT CHANGE
`src/tools.ts`, `src/mcp-server-factory.ts`, `src/mcp-auth.ts`, the 8 FDE handler modules (they stay in core, addendum §2), any other line of `src/index.ts`, `Dockerfile` (CMD stays `node dist/index.js`; the mode comes from the env, and Brian sets it in DM0-b3), `railway.toml`, `scripts/run-package-selftests.mjs`, ADRs, `docs/`, and dependencies. Add no env NAME beyond `AADM_START_MODE`, which the addendum lists. Never read, print or set `.env`, secrets, keys or Railway variables; Brian sets them all.

CONFIRM FIRST (LIGHTER: run merge-base, then check the facts; stop only if a fact differs)
- `git merge-base --is-ancestor 67e7a8c HEAD` exits 0; `git log --oneline -3` shows `4b475d5` (DM0-a3) and `67e7a8c` (INV4-MCP); `grep -n "AADM_START_MODE" docs/adr/004-mcp-may-call-aadm-plans-api.md` shows the addendum's §2 and §7.
- `src/index.ts:138` starts `function writeJson(`; `:241` reads `process.env.PORT`; `:583` is `async function main(): Promise<void> {`; `:604` creates the server with `http.createServer`.
- `node_modules/@clerk/backend/dist/api/endpoints/M2MTokenApi.d.ts:84` is `verify(params: VerifyM2MTokenParams): Promise<M2MToken>;`.
- `grep -rn "/internal/\|AADM_START_MODE" src scripts tests` returns nothing.
- `Dockerfile` has `CMD ["node", "dist/index.js"]`.

TESTS
Run `npm run test:backend-service` until it passes, then `npm run test:mcp-http` once to show core mode is unchanged with `AADM_START_MODE` unset. Run `npx biome check src/backend-service.ts tests/backend-service/backend-service.test.ts src/index.ts package.json`. Do not build: here `npm run build` is `tsc`, so it belongs to the CV column check.

RULES AND AADM — REQUIRED (report each)
- Read AGENTS.md, ADR 004 with its addendum, ADR 005 and `docs/ARCHITECTURE_INVARIANTS.md` (especially CTX-01, IDN-06, OBS-01, PRIV-01, FLD-04), and list the rules that apply (file and section).
- Scoped tests only; typecheck at column end, go at map end. MUST NOT run any typecheck (check:types:touched, npm run check, tsc, tsgo) or npm run go in this slice.
- If the dev server shows a stale or cached error, stop and ask Brian; never edit config files or nudge containers to force a reload.
- Skip baseline_guide; use no defect or triage tools. Do not call suggest_aadm_tools.
- AADM: run predone_review on your diff, then fix and re-run until it approves. Paste the verdict. After each AADM call, report the tool, its key finding and what you changed.
- If any AADM tool says do not edit or halt, stop and report; do not continue.
- If AADM or a repo rule conflicts with this prompt, stop and report it. If this becomes more than one behaviour, don't commit; send a batch request.

GIT
Make one commit on dev, by pathspec, with no branches.
- Run `git add -N src/backend-service.ts tests/backend-service/backend-service.test.ts`. If .git/index.lock exists, wait for it to clear.
- Then `git add src/backend-service.ts tests/backend-service/backend-service.test.ts src/index.ts package.json` and `git commit` with those same 4 paths.
- git add only the named files; never stage .tmp/, walk scripts or session files
- Never use -A or `.`. Never stash, reset, restore or amend. No push.
- Commit message: "DM0-b1: backend start mode — private /health and M2M-guarded POST /internal/verbs/<name>, UUID request_id; core unchanged"

STOP AND REPORT (at the slice boundary)
Stop at once if a confirm-first fact differs or one of your named files changes under you. Otherwise, report:
- the confirm-first output;
- the 4-line `index.ts` diff;
- the test, `test:mcp-http` and biome output;
- the predone_review verdict;
- the commit hash, `git show --stat` (4 files) and `git status --short`.
Then stop. Next is DM0-b2 (core forwards to the backend); DM0-b3 (Railway) is Brian's.
