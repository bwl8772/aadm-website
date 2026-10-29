**APP: AADM (aadm-mcp)**
AADM DM0-a2: ADR 004 records the new backend posture (a private plans API behind portable database ports, FDE tools in their own container, no source code crossing), and AGENTS.md says so
Repo aadm-mcp · read at local dev 7d02c5e658 (Oct 25, 2026, ~10:35 AM ET; clean; 0 ahead / 0 behind origin/dev) · work on dev, NO branches · docs-only slice: no code, no package.json, no Dockerfile · Stage 0 of the AADM Terrain, Cornerstone and Delivery maps plan (PRD v0.6)
BEFORE YOU START: Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it.

GOAL
Brian decided (Oct 25, 2026) that AADM will store cornerstones, plans and Terrain facts behind a private plans API, and split the backend into two containers. That breaks "single process, no database, no external API calls". So an ADR comes before any code: write ADR 004 and update the 2 AGENTS.md lines. Nothing is implemented yet.

SCOPE (2 files)
- NEW docs/adr/004-mcp-may-call-aadm-plans-api.md. No existing ADR covers this. Match ADR 003's format: H1 `# ADR 004 — <title>`, then **Status:** Accepted — not yet implemented, **Date:** 2026-10-25, **Context:**, then ## Problem, ## Decision, ## Constraints, ## Consequences. Cover:
  1. Decision (D2, D15 default A): one MCP URL. The front door (`aadm-core`) keeps MCP transport, auth and every non-FDE tool, and gains a private plans API that owns the database. Every other tool stays stateless.
  2. Containers: the 8 FDE tools (tenant_isolation_check, cutover_parity_check, invariant_register, lessons_register, agent_op_contract_check, projection_budget, fanout_guide, run_state_control) plus Terrain crawl/ingest and the transpose views run in `aadm-fde`. It is built from the same image, private network only, and stores nothing. The front door forwards FDE calls over internal HTTP with a service token (≤ 300 s, audience `aadm-fde`). `tools/list` is unchanged, and leaving `FDE_SERVICE_URL` unset keeps them in process (the rollback).
  3. Storage (D1, reconciled): Supabase Postgres is the first host only. All access goes through PlanStore/BlobStore ports. Migrations are plain portable SQL. Tenancy is scoped by workspace_id in the app layer, with RLS and grants as defense in depth. No Supabase Auth, Realtime, Edge Functions or PostgREST on the critical path. Any PostgreSQL ≥ 15 is tested; non-Postgres comes later behind the same ports (D14).
  4. Tenancy (D4): our own workspace, workspace_member and workspace_invite tables, keyed to the Clerk user (issuer + subject); Clerk Organizations are not used.
  5. Allowlist rule: customer source code, snippets and secrets never cross. Only allowlisted derived evidence crosses (names, paths with lines, routes, tables, dependencies, config key NAMES, UDALI placements, commit and hashes). The schema is strict: single-line strings ≤ 200 chars, secret and code filters, and failures are rejected.
  6. Three modes: (a) AADM Cloud; (b) bring your own storage via the ports; (c) self-hosted: the same two images in the customer's cloud with OIDC sign-in. In (a) and (b), pasted payloads still pass through mcp.aadm.io.
  7. No LLM dependency: runtime dependencies stay `@clerk/backend`, `@modelcontextprotocol/sdk`, `ioredis` and `zod`. Any future server-side model needs a per-workspace provider config with no fallback to an AADM model.
  8. Consequences: new write tools carry non-read-only annotations; AADM still never scans the consumer repo; the planner keeps a local mirror and export in case sign-in fails; a second Railway service (Brian sets it up).
- ADAPT AGENTS.md, 2 lines only:
  - Line 122: keep its first sentence. Change "Single process, no database, no external API calls from the server." to say that today it is a single process with no database, and that per ADR 004 (accepted, not yet implemented) the backend becomes `aadm-core` (with a private plans API behind database ports) plus a private `aadm-fde` container, and every other tool stays stateless. Link the ADR path.
  - Line 241 (Boundaries): keep the text, then add one sentence: per ADR 004, stored plans, cornerstones and Terrain facts live behind the plans API, and source code still never reaches AADM.

DO NOT CHANGE
src/, scripts/, package.json, Dockerfile, railway.toml, resources/, ADRs 001–003, docs/integration-roadmap.md (its ADR list at :129 is Brian's call; just report it) and any other AGENTS.md line. No .env reads or prints.

CONFIRM FIRST (LIGHTER: run merge-base, then check the facts; stop only if a fact differs)
- `git merge-base --is-ancestor 7d02c5e658 HEAD` exits 0. `ls docs/adr` shows exactly 001-debug-defect-compact-projection.md, 002-host-integration-profile.md and 003-agent-skills-integration.md, and no 004.
- AGENTS.md:122 ends "Single process, no database, no external API calls from the server." AGENTS.md:241 starts "**Boundaries (unchanged):** AADM does not scan the consumer repo".
- docs/adr/003-agent-skills-integration.md:1-4 is the H1 plus the Status and Date lines. package.json:28-33 lists exactly the 4 dependencies above.
- src/tools.ts:4660 is `export function registerTools(`, and all 8 FDE tools are registered in that file (for example `"tenant_isolation_check",` at :9027 and `"run_state_control",` at :5373).

TESTS
There is no markdown lint for docs/adr or AGENTS.md at this commit (biome does not check .md, and no script reads AGENTS.md), so there is no test to run. Check the index instead: `ls docs/adr` shows 004; `grep -n "ADR 004" AGENTS.md` shows the 2 edited lines; `git diff --stat` shows only your 2 files.

RULES AND AADM — REQUIRED (report each)
- Read AGENTS.md and ADRs 001–003 first, and list the rules that apply (file + section). Follow the repo's engineering rules.
- Scoped tests only; typecheck at column end, go at map end. MUST NOT run any typecheck (check:types:touched, npm run check, tsc, tsgo) or npm run go in this slice.
- If the dev server shows a stale or cached error, stop and ask Brian; never edit config files or nudge containers to force a reload.
- Skip baseline_guide; use no defect or triage tools. Do not call suggest_aadm_tools.
- AADM: run predone_review on your diff; fix and re-run until approve, then paste the verdict and findings. After each AADM call, report the tool, its key finding in one line, and what you changed because of it.
- If any AADM tool says do not edit or halt, stop and report; do not continue.
- If AADM or a repo rule conflicts with this prompt, stop and report it. If this turns out to be more than one behaviour, stop, don't commit, and send Blueprint a chunk request.

GIT
One commit on dev, by pathspec. Run `git add -N docs/adr/004-mcp-may-call-aadm-plans-api.md`; if .git/index.lock exists, wait for it to clear. Then `git add docs/adr/004-mcp-may-call-aadm-plans-api.md AGENTS.md` and `git commit` with those same 2 paths. git add only the named files; never stage .tmp/, walk scripts or session files. Never use -A or ., and never stash, reset, restore or amend. No push. Message: "DM0-a2: ADR 004 — private plans API behind portable DB ports, FDE container split, allowlist rule; AGENTS.md lines 122 and 241"

STOP AND REPORT
Stop at once if a confirm-first fact differs or one of your named files changes under you. Otherwise report: the confirm-first tails · the ADR's section headings and line count · the before and after of AGENTS.md:122 and :241 · the index-check output · the predone_review verdict · the commit hash and `git show --stat` (2 files) · `git status --short` · whether docs/integration-roadmap.md:129 should list ADR 004 (Brian decides). Next: DM0-b1.
