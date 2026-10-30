# AADM Field Contract: Agent Tools and Agent Definitions

Status: working contract, no code yet (Brian, Oct 30, 2026: "write that up and contracts first, do not code").
Companions: `docs/contracts/FIELD-ARTIFACTS.md` (what agents produce), `docs/contracts/FIELD-WORKBENCH.md` §3 (the canvas stream the tools write into), `docs/agents/*.md` (one definition per agent), PRD §A6 (the agent worker), §A4 (the verbs), §A8 (prompt library).

## 1. Purpose and rules

Agents are built **bottom up**: a small register of tools, then agent definitions that name which tools each agent may call and which artifacts it may draft, then the Workbench's left rail, which is nothing more than those definitions grouped and ordered by the server.

Rules that bind every tool and every agent:

- **Tools run in the agent worker, never in the browser** (ARCH-24, ARCH-04). The website never holds a model key, a search key, a scrape key or a render service credential. It sends `canvas.send`; the backend hands the run to the worker; the worker calls tools; the backend saves what comes back.
- **A tool call is a stream entry.** Every call writes a `tool_call` entry on the agent's stream with exactly the fields `KnownEntrySchema` already carries: `tool_label`, `target_label` (plain words), `status` (`running`, `done`, `failed`) and `failure_reason` (FIELD-WORKBENCH.md §3; `src/components/field/field-types.ts`). A failure that ends the run also writes an `error` entry (`title`, `detail`, `request_id`). Nothing a tool did is invisible, and nothing is shown as raw prompt, raw reasoning or credentials.
- **A tool result is Evidence or nothing.** A tool may return text the agent uses in a draft; it never writes a version by itself. What becomes record is an **Evidence** row with `kind`, `value` and `source` (PRD §A3), saved by the verb that ran the agent, or a draft the person saves.
- **No tool makes a Decision.** Approve, sign, go and confirm are people-only (FIX-03). A tool that "approves" is a bug.
- **Provenance travels.** Every chunk, search hit, scraped page and rendered file carries its source (url, upload id, artifact id and version, retrieved-at) through every later step. A retrieval result without a source is discarded, not shown.
- **Budgets are server-side.** Each tool has a per-run and per-engagement budget (calls, bytes, seconds, cost) set in backend config. The client sees `BUDGET_EXCEEDED`, never a counter it keeps itself.
- **Access control is applied at ingest, not only at query.** A document is chunked and embedded under the engagement it was uploaded to; retrieval is scoped by engagement and the caller's access (TEN-06, ARCH-01). An engagement moving workspaces keeps its own index.
- **One voice.** What an agent suggests (a draft, a verdict, a next step) is shown exactly as the backend returned it; the website never rewrites, softens or summarises it (RC-GUIDANCE-01; `aadm://doctrine/guidance-feedback-seam`).
- **A Decision is taken on a website page in a signed-in human session,** bound to one version and its content hash; a new version voids it (CAP-03 and ARCH-14 in `docs/INVARIANTS.md`). An agent, a tool or an M2M credential is refused with `HUMAN_SESSION_REQUIRED` (FIELD-STUDIO.md §4).

Where the rule ids live: `ARCH-*`, `BACK-*`, `TEN-*`, `IDN-*`, `RES-*`, `FLD-01 to FLD-04` are `docs/ENGINEERING_RULES.md`; `CAP-03`, `ARCH-14`, `ART-02`, `FLD-02` are `docs/INVARIANTS.md`; `FIX-*`, `CFG-*`, `RC-*` and `D` numbers are the PRD.

**Scope.** In this repo: the zod schemas for what a run emits (`tool_call`, `error` and the other entry types, already in `field-types.ts`), a schema and fixture for an agent definition, the rail built from definitions, and the contract test that ties `docs/agents/*.md` to the fixture. Out of this repo: the tools themselves, budgets, the index, the worker and every provider key (aadm-mcp backend mode and the agent worker). Replan trigger: a PRD decision on open question 1 (what a definition is) or on §A4, §A6 or §A7 changes this contract and the agent docs before any code.

**Build order** (each step joins on the one before):

1. Artifact register (FIELD-ARTIFACTS.md): the type ids every definition's `consumes` and `produces` point at.
2. Tool register (§2) and tool contracts (§3): ids, failure codes, entry fields.
3. Agent definition schema (§4) and one fixture per `docs/agents/*.md`; the contract test asserts tools ⊆ §2, produces ⊆ register, verbs exclude `sign off`, `go` and confirm.
4. Rail from definitions: `agent_groups` in the Workbench fixture is generated from the definitions fixture, not written by hand.
5. Worker and tools (other repo), behind `AGENT_UNAVAILABLE` until they exist.

## 2. Tool register

| Tool id | Does | Input (plain) | Output | Writes | Budget unit |
|---|---|---|---|---|---|
| `evidence.ingest` | Takes an upload, a pasted text or a URL and makes it a stored Evidence file with parsed text and layout | source (upload id, text, or url), engagement, declared kind | evidence id, pages or sections, parse report | Evidence (kind `file`), parse report | bytes, pages |
| `evidence.chunk` | Splits one ingested document into structure-aware chunks (headings, lists, tables kept whole), each with a context line naming the document and section | evidence id, strategy (`structure`, `fixed`), target size | chunk ids with offsets and context lines | chunk rows (write-once) | chunks |
| `evidence.embed` | Vectorises chunks under a named embedding model version | chunk ids or evidence id | index receipt: model version, count | index rows keyed by model version | vectors |
| `evidence.retrieve` | Finds the chunks most relevant to a question inside the engagement's index, with the lexical pass alongside the vector pass | question, filters (artifact types, evidence kinds, date), top k | chunks with score, source, context line | nothing | queries |
| `web.search` | Searches the public web for a question and returns titles, urls and snippets | query, limits (domains, recency), top k | hits with url, title, snippet, fetched-at | Evidence (kind `web_search`) only when the agent cites a hit | queries |
| `web.scrape` | Fetches one public page or document and returns its text and links | url, format (`markdown`, `text`) | text, title, links, fetched-at, content hash | Evidence (kind `web_page`) via `evidence.ingest` | pages |
| `render.image` | Draws one image (diagram or figure) from a declarative source: Mermaid, a node-and-edge list, or SVG | source, notation, size | file id, image href, source hash | render file; a `diagram` block when saved into an artifact | renders |
| `render.document` | Produces one document file (PDF, DOCX or Markdown) from one artifact version's blocks | artifact id, version, format, template | file id, href, content hash | render file; a share option on the version | renders |
| `render.slides` | Produces one slide deck (PPTX or PDF) from a slide spec built from one or more artifact versions | spec (slides of blocks), template, format | file id, href, content hash | render file; a share option | renders |
| `artifacts.get` | Reads one artifact version (body and blocks) the caller may see | artifact id, version | the version | nothing | reads |
| `requirements.get` | Reads items from a signed Cornerstone version by id | artifact id, version, item ids | items with text and status | nothing | reads |
| `evidence.read` | Reads one Evidence row or file text | evidence id | the row and its text | nothing | reads |
| `inventory.read` | Reads one lay-of-the-land inventory | inventory id | the inventory | nothing | reads |
| `roadmap.get` | Reads the maintained Roadmap version with stages, batches and slices | roadmap id, version | the version | nothing | reads |
| `tracker.get_issues` | Reads issues from Jira or Linear by key (later client, PRD §A6) | keys | issues with status | nothing | reads |
| `judge.*` | The AADM stateless judges: `interrogate_plan`, `grill_questions`, `delivery_map`, `slice_issues`, `predone_review`, `replan_check` | per tool | findings | challenge results (write-once attachments, D51) | calls |

Write-side verbs (`iterate`, `batch`, `write prompt`, `judge`, …) are **not** tools. An agent proposes a draft; the verb that ran it saves version N+1 when a person saves, or when the verb's rules allow an agent save (PRD §A4). Tools read and compute; verbs write.

## 3. Tool contracts

Each tool has one request and one reply shape, carried inside the agent worker's run, never over the public envelope. Failure codes use the shared problem format (`code`, `title`, `detail`, `retryable`).

### `evidence.ingest`

- **Accepts:** upload id (the browser posts the file to the website's same-origin uploads route, which forwards to backend `POST /api/v1/engagements/{engagementId}/uploads`, FIELD-WORKBENCH.md §5; ARCH-24), pasted text, or a URL that `web.scrape` fetched. Declared kind: `document`, `spreadsheet`, `image`, `transcript`, `web_page`, `other`.
- **Parses** with layout awareness: headings, paragraphs, lists, tables and figures are kept as units. A spreadsheet yields one table per sheet. An image yields its alt text and, when the worker has a vision model, a description marked as model output.
- **Returns** `evidence_id`, `pages`, `sections[] {heading, offset, length}`, `parse_report {warnings[], dropped[]}`.
- **Fails** with `PARSE_FAILED` (retryable false), `SOURCE_TOO_LARGE`, `SOURCE_FORBIDDEN` (a URL outside the engagement's allowed domains or a private address), `KIND_MISMATCH`.
- **Never** executes macros, scripts or links inside the document. Never fetches a URL found inside a document on its own.

### `evidence.chunk`

- **Strategy:** `structure` (default) splits on headings and keeps lists and tables whole; `fixed` splits at about 500 tokens with no overlap unless the backend config says otherwise. Each chunk carries a **context line**: document title, section path, page. Overlap and size are backend config, not agent choice.
- **Returns** `chunks[] {chunk_id, offset, length, context_line}`.
- **Idempotent** per `(evidence_id, strategy, config version)`: re-chunking the same input returns the same ids.

### `evidence.embed`

- **Model version is a first-class value.** Every index row stores it; `evidence.retrieve` only reads rows of the active model version. Changing the model re-embeds the engagement's corpus as a backend job; until it finishes, retrieval answers from the old version and says so in the stream.
- **Returns** `{model_version, embedded, skipped}`.
- **Fails** with `EMBED_VERSION_MISMATCH` when chunks were made under a different chunk config than the index expects.

### `evidence.retrieve`

- **Two passes, merged:** vector similarity and lexical match, merged by rank. The agent sees both scores.
- **Scope:** the engagement, filtered by the caller's access. Customer-role callers retrieve only from customer-visible artifacts and their own uploads.
- **Returns** `hits[] {chunk_id, evidence_id, artifact_ref?, score, context_line, text, source}`.
- **Never** returns a hit without `source`. Never returns more than the configured top k.

### `web.search`, `web.scrape`

- **Public only.** No cookies, no logins, no customer SSO. An authenticated source is an upload, not a scrape.
- **Allowed domains** are per engagement (backend config); a block list covers private networks and link shorteners. `SOURCE_FORBIDDEN` otherwise.
- **Every hit cited by the agent** becomes Evidence through `evidence.ingest` with `fetched_at` and `content_hash`, so the draft can be checked later against what was actually read.
- **Rate and recency** limits are backend config.

### `render.image`, `render.document`, `render.slides`

- **Deterministic input.** Renders come from stored blocks and a template, never from a free-text model call, so the same version renders the same file (hash-equal) every time.
- **Image:** Mermaid or a node-and-edge list → SVG and PNG. The Map view's `render map` verb uses this tool.
- **Document:** one artifact version → PDF, DOCX or Markdown. The share menu's "Download PDF" and "Copy text" read these files (FIELD-STUDIO.md §3 "Share"); they never serialise the screen.
- **Slides:** a slide spec `{slides[] {title, blocks[], notes?}}` built from one or more versions → PPTX or PDF. The spec is saved with the render so the deck is reproducible. A designed deck (image-per-slide) is out of scope; decks are native, editable shapes.
- **Returns** `{file_id, href, content_hash, bytes}`.
- **Fails** with `RENDER_FAILED` (retryable true when the renderer was unavailable, false when the input was invalid) and `TEMPLATE_UNKNOWN`.

### Reads and judges

`artifacts.get`, `requirements.get`, `evidence.read`, `inventory.read`, `roadmap.get`, `tracker.get_issues` return records the caller may see, filtered by engagement access. The judges call AADM MCP with a Clerk M2M token from the worker (PRD §13d); their results are saved as write-once attachments on the version they judged (D51).

## 4. Agent definitions (bottom up)

An **agent definition** is a versioned record on the workspace (proposed; see Open questions) that says what one specialist is, what it may call and what it may draft. The nine definitions live in `docs/agents/`, one file each, in this shape:

| Field | Meaning |
|---|---|
| `agent_id` | Stable id (`business-discovery`, …). Matches `agent_id` in the Workbench rail and the stream |
| `label`, `description` | Shown in the rail |
| `group_id`, `group_label`, `order` | The rail group and position; the server orders, the client draws |
| `hat` | The PRD §A2 hat the agent serves (product owner, architect, lead, planner, builder, owner) |
| `verbs` | The PRD §A4 verbs the agent may run (never `sign off`, `go`, confirm) |
| `tools` | Tool ids from §2 with a per-run budget each. A tool not listed is refused with `TOOL_NOT_ALLOWED` |
| `context_pack` | What the backend assembles for every run: outcome, approved artifacts, open decisions, relevant requirements, the last N stream entries, the selected artifact (FIELD-CONTRACTS.md §9b) |
| `consumes`, `produces` | Artifact type ids from FIELD-ARTIFACTS.md. An agent may draft only `produces` types |
| `decision` | Who freezes what it produces (from the artifact register), named so the agent asks and never answers |
| `starter_prompts` | Shown on an empty canvas |
| `status_source` | The read model that fills the rail's `status_text` and `status_tone` |
| `system_prompt_ref` | The prompt in its `docs/agents/<id>.md`, stored in the workspace prompt library (§A8) |
| `process` | The numbered steps in its doc, each naming its tools and what it writes |

Rules:

- **Definitions are data, not code paths.** Adding an agent is a new definition and a new doc; the worker runs any definition the same way.
- **The rail is the definitions.** `agent_groups` in `WorkbenchView` is built from definitions ordered by `group_id` and `order`, with `status_text` from `status_source`. The client never adds, hides or reorders an agent (BACK-01).
- **One shared context.** Every agent receives the same context pack shape; none keeps a private copy of the plan.
- **Tool use is visible.** Each tool call in a run is a `tool_call` entry; each cited source is Evidence.

## 5. Commands and events

| Command | Verb | Notes |
|---|---|---|
| `canvas.send` | iterate, challenge, batch, write prompt, judge (by the selected agent) | Unchanged. `input.text`, upload ids. The worker picks tools from the definition |
| `canvas.cancel` | as FIELD-WORKBENCH.md §5 | Stops the run; tool calls already made keep their entries. The stream's `run.cancel` action is this command |
| `agent.define`, `agent.update` | new, later | Save definition version N+1; people only; web-only in F8 |
| `evidence.reindex` | new, later | Backend job after an embedding model change |

No `tool.*` command exists on the envelope. Tools are called only inside a run.

Events: `run.started`, `run.tool_called`, `run.finished` fan into `view.invalidated` for the engagement; `evidence.ingested` likewise.

## 6. States and errors

A tool failure reaches the client in two shapes, both rendered as sent (ARCH-05, RES-05): the `tool_call` entry's `status: "failed"` with `failure_reason`, and, when the run stops, an `error` entry with `title`, `detail` and `request_id`. The codes below are the `failure_reason` and `error` sources; the HTTP codes are the Workbench's (FIELD-WORKBENCH.md §6).

| Code | When | Enforced by | Client shows |
|---|---|---|---|
| `TOOL_NOT_ALLOWED` | Definition does not list the tool | Worker, against the definition version | Failed `tool_call`; no retry |
| `BUDGET_EXCEEDED` | Per-run or per-engagement budget hit | Backend config, checked by the worker | Failed `tool_call` naming the budget; `error` entry "Ask again later" |
| `SOURCE_FORBIDDEN` | URL outside allowed domains or private | Worker allow and block lists from backend config | Failed `tool_call` |
| `PARSE_FAILED`, `RENDER_FAILED`, `EMBED_VERSION_MISMATCH` | As in §3 | The tool | Failed `tool_call`; `error` entry with `request_id` and Try again when retryable |
| `RUN_IN_PROGRESS` (409) | Second `canvas.send` while a run is active | Backend | The existing Workbench problem; the stream's `run.cancel` is offered |
| `AGENT_UNAVAILABLE` (503) | Worker or model not reachable | Backend | Composer `send` disabled with its reason; no fabricated output (existing Workbench code) |

## 7. Acceptance checks

1. A run that calls `web.search` shows one `tool_call` entry per call, and the draft cites only hits that exist as Evidence rows with `fetched_at`.
2. Two `render.document` calls on the same version and template return the same `content_hash`.
3. `evidence.retrieve` from a customer-role session returns no chunk from an internal artifact.
4. A definition without `render.slides` makes `render.slides` fail with `TOOL_NOT_ALLOWED`, and the entry appears in the stream.
5. Changing the embedding model leaves retrieval working on the old version until the reindex job finishes, and the stream says which version answered.
6. No agent definition lists `sign off`, `go` or a confirm Decision among its verbs; a definition that does is refused at save.
7. The Workbench rail equals the ordered definitions; removing a definition removes the agent from the rail with no client change.

Proof, by check: 1 to 6 are agent-worker and backend tests in aadm-mcp (backend mode) and cannot be claimed from this repo. Check 7, and the definition rules in §4 (tools ⊆ §2, `produces` ⊆ register, no `sign off`, `go` or confirm verb), are this repo's `scripts/field-contract.test.mjs` once the definitions fixture exists (build order step 3). Until then every check is open.

## 8. Open questions

1. Is an agent definition a 16th PRD noun, a workspace setting, or a prompt-library entry (§A8)? It is versioned either way.
2. Which embedding and vision models, and whose keys: the workspace model key (D45) or a Blueprint-held key for tools?
3. Is `web.search` a product feature customers pay for by call, and does Firecrawl (or another provider) sit behind `web.scrape`? Provider is backend config; the contract does not name one.
4. Slide templates: one Blueprint template, or per-workspace branding (the firm layer, §13p)?
5. Should `render.*` outputs be versions of the artifact (a Map is) or separate render files? Today: Map is a noun; document and slide renders are files linked from a share option.

## 9. Bindings

- **PRD:** §A3 (Evidence rows, write-once), §A4 (verbs, people-only Decisions), §A6 (agent worker, model key per workspace), §A7 (envelope; no `tool.*`), §A8 (prompt library holds the system prompts), §13d (worker → MCP with M2M token).
- **Engineering rules:** backend is authoritative (BACK-01); no domain logic in the shell (ARCH-05); one backend door, timeouts and `request_id` on every hop (ARCH-24, CTX-05); secrets off the browser (ARCH-04); tenant from session (TEN-06); each result family shown (RES-04, RES-05); Field is not a dashboard (FLD-01 to FLD-04): tool budgets and index status are stream lines and composer states, never a monitoring screen.
- **Invariants:** Decisions in a human web session (CAP-03); approval binds to version and hash (ARCH-14); version ids from `saved[]` (ART-02); proof one click below the answer (FLD-02).
- **Doctrine (`aadm://doctrine/fde-engagement`), checked by `interrogate_plan` on Oct 30, 2026 (0 blocking, 0 warnings):** the constraint that binds tightest is "a claim without evidence is unverified", carried here as "a tool result is Evidence or nothing" and "provenance travels"; what it forbids is an agent closing a gate, carried as "no tool makes a Decision"; the evidence that proves it is the Evidence row behind every cited source (check 1) and the absence of a Decision verb on any definition (check 6); responsibility sits with the worker for tool calls and with the backend for Decisions and budgets; the first failure if ignored is a draft that cites a page nobody can re-read.
