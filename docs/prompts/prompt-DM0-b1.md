**APP: AADM (aadm-mcp)**
AADM DM0-b1: a private `aadm-fde` entry point in the same image serves only the 8 FDE tools over `POST /internal/tools/<name>` and `GET /health`, and refuses any call without a valid Clerk M2M token
Repo aadm-mcp · read at local dev d8af2e4f7c (Oct 25, 2026, ~11:30 AM ET; clean; 1 ahead / 0 behind origin/dev; DM0-a3 NOT yet landed) · work on dev, NO branches · Stage 0 of the AADM Terrain, Cornerstone and Delivery maps plan (PRD v0.7.1)
RUN ONLY AFTER DM0-a3 LANDS (the ADR 004 addendum: fde_tools / D16, plans D-A to D-E, Clerk M2M token). If `git log --oneline -15` shows no DM0-a3 commit, stop and report.
BEFORE YOU START: Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it.

GOAL
ADR 004 splits the backend into `aadm-core` and a private `aadm-fde`. This slice adds the FDE side only: a second entry point nothing calls yet. Each of the 8 FDE tools must return byte-identical JSON through the internal route and in process, and a call without a token must get 401. No front-door forwarding (DM0-b2), no Railway service (DM0-b3, Brian's step).

SCOPE (3 files)
- NEW src/fde-service.ts. The repo search found no existing internal route, second entry point, `FDE_SERVICE_URL` or M2M code in src/, scripts/, tests/, Dockerfile, railway.toml or package.json, so this file is new. It must:
  - REUSE `createMcpServer({ runStoreOwner })` (src/mcp-server-factory.ts:21) with `Client` and `InMemoryTransport.createLinkedPair()` from `@modelcontextprotocol/sdk`, the pattern in scripts/repo-map-analysis-selftest.mjs:514-518. The tools.ts registrations and FDE handler modules are used unchanged, so the output is identical by construction.
  - Export `FDE_TOOL_NAMES`, which lists exactly tenant_isolation_check, cutover_parity_check, invariant_register, lessons_register, agent_op_contract_check, projection_budget, fanout_guide and run_state_control (registered at tools.ts :9027, :9105, :9165, :7774, :9255, :9210, :7881 and :5373).
  - Export `createFdeRequestHandler({ verifyM2MToken })`, built on node:http like src/index.ts:604. It must handle these cases:
    - `GET /health` returns `{ ok: true }`.
    - `POST /internal/tools/<name>`: a missing or invalid `Authorization: Bearer` gets 401; a name not in `FDE_TOOL_NAMES` gets 404; otherwise it reads the body `{ owner_namespace, arguments }`, calls the tool, and returns the CallToolResult as JSON with status 200.
    - Every other path gets 404.
    - Copy the `writeJson` shape from src/index.ts:138-146; do not import from index.ts.
  - Its default verifier is `createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).m2m.verify({ token })` (@clerk/backend 3.4.4, M2MTokenApi.verify). It also checks the caller and audience fields that the DM0-a3 addendum names.
  - When run directly, it listens on `PORT`, defaulting to 3100 (PRD §12d).
- NEW tests/fde-service/fde-service.test.ts uses an injected fake verifier and starts no network or Clerk calls. It must check four things:
  - For one fixture input per tool, the 8 route responses deep-equal and byte-equal (`JSON.stringify`) a direct in-memory `callTool`.
  - A missing token or a token rejected by the verifier gets 401.
  - A non-FDE tool such as `repo_feature_map` gets 404.
  - `/health` returns 200.
  - Copy the fixture inputs from the existing tool selftests in scripts/ (for example tenant-isolation-check-selftest.mjs, run-state-control-selftest.mjs and cutover-parity-check-selftest.mjs).
- ADAPT package.json scripts, 1 line: add `"test:fde-service": "tsx tests/fde-service/fde-service.test.ts"`.

DO NOT CHANGE
src/index.ts, src/tools.ts, src/mcp-server-factory.ts, src/mcp-auth.ts, the 8 FDE handler modules, Dockerfile (CMD stays `node dist/index.js`; the aadm-fde start command is Brian's in DM0-b3), railway.toml, scripts/run-package-selftests.mjs, ADRs and dependencies. Add no new env NAMES beyond the ones the DM0-a3 addendum lists. Never read, print or set .env, secrets, keys or Railway variables; Brian sets them all.

CONFIRM FIRST (LIGHTER: run merge-base, then check the facts; stop only if a fact differs)
- `git merge-base --is-ancestor d8af2e4f7c HEAD` exits 0, and a DM0-a3 commit is in `git log`. The addendum names the M2M audience or caller check and its env NAMES (unchecked at d8af2e4, because DM0-a3 hadn't landed).
- src/mcp-server-factory.ts:21 is `export function createMcpServer(options?: {` taking `runStoreOwner`, and src/index.ts:352 passes `principal.owner_namespace` to it.
- node_modules/@clerk/backend/dist/api/endpoints/M2MTokenApi.d.ts:84 is `verify(params: VerifyM2MTokenParams): Promise<M2MToken>;`.
- `grep -rn "/internal/" src scripts tests` returns nothing (no existing route to reuse).

TESTS
Run `npx tsx tests/fde-service/fde-service.test.ts` (or `npm run test:fde-service`) once it passes. Also run `npx biome check src/fde-service.ts tests/fde-service/fde-service.test.ts package.json`. Do not build: here `npm run build` is `tsc`, so it belongs to the C0 column check.

RULES AND AADM — REQUIRED (report each)
- Read AGENTS.md and ADR 004, including the DM0-a3 addendum, and list the rules that apply (file and section).
- Scoped tests only; typecheck at column end, go at map end. MUST NOT run any typecheck (check:types:touched, npm run check, tsc, tsgo) or npm run go in this slice.
- If the dev server shows a stale or cached error, stop and ask Brian; never edit config files or nudge containers to force a reload.
- Skip baseline_guide; use no defect or triage tools. Do not call suggest_aadm_tools.
- AADM: run predone_review on your diff, then fix and re-run until it approves. Paste the verdict. After each AADM call, report the tool, its key finding and what you changed.
- If any AADM tool says do not edit or halt, stop and report; do not continue.
- If AADM or a repo rule conflicts with this prompt, stop and report it. If this becomes more than one behaviour, don't commit; send Blueprint a chunk request. Never use chunk_branch_check.

GIT
Make one commit on dev, by pathspec, with no branches.
- Run `git add -N src/fde-service.ts tests/fde-service/fde-service.test.ts`. If .git/index.lock exists, wait for it to clear.
- Then `git add src/fde-service.ts tests/fde-service/fde-service.test.ts package.json` and `git commit` with those same 3 paths.
- git add only the named files; never stage .tmp/, walk scripts or session files
- Never use -A or `.`. Never stash, reset, restore or amend. No push.
- Commit message: "DM0-b1: aadm-fde entry point — 8 FDE tools behind POST /internal/tools/<name> with Clerk M2M auth; byte-parity test"

STOP AND REPORT (at the slice boundary)
Stop at once if a confirm-first fact differs or one of your named files changes under you. Otherwise, report:
- the confirm-first output;
- the DM0-a3 commit and the env NAMES the addendum lists;
- the test and biome output;
- the predone_review verdict;
- the commit hash, `git show --stat` (3 files) and `git status --short`.
Then stop. Next is DM0-b2; DM0-b3 (Railway) is Brian's.
