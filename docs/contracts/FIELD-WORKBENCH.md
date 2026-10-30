# AADM Field Contract: Engagement Workbench

Oct 30, 2026 · Brian Lambert

Companions: [`FIELD-MY-FIELD.md`](FIELD-MY-FIELD.md) · [`../FIELD-VISION.md`](../FIELD-VISION.md) · [`../FIELD-CONTRACTS.md`](../FIELD-CONTRACTS.md) · [`../INVARIANTS.md`](../INVARIANTS.md) · [`../ENGINEERING_RULES.md`](../ENGINEERING_RULES.md)

## 1. Purpose, route and rules

The Engagement Workbench is where an engineer works one engagement with specialist agents. The backend owns the engagement record and every decision; the frontend renders what it is sent and returns intents.

| | |
|---|---|
| **Route** | `/field/main/e/{engagementId}`, optionally with `agent` (selected specialist) and `panel` (`artifacts` or `land`) |
| **Regions** | Context bar; left: agents; center: work canvas; right: Artifacts or Lay of the land |
| **Exits** | Opening an artifact goes to Studio on the same engagement; My Field via the breadcrumb |

**Backend owns**

- The engagement record: requirements, decisions, tasks, artifacts, versions, evidence, approvals and events.
- Every value in the context bar and every lens state.
- Which agents exist, how they are grouped and each agent's status line.
- The canvas stream: what was said, what the agent did, and every draft.
- Which drafts can be saved, which questions can be sent, which decisions can be recorded, and by whom.
- Every inventory, its status, its owner agent and what can be done with it.
- The links for Open in Claude and Share in Slack, carrying the same engagement identity, permissions and artifact references.

**Frontend may hold only presentation state:** the text being typed, files chosen before upload, scroll position, hover and focus, and which panel tab is showing. It never creates an artifact, version, decision or inventory row by itself; it asks, and shows the server's answer.

**One record, many clients.** Work done here, in Claude through the AADM tools, or in Slack writes the same engagement record. Chat history is not the record. Saved artifacts, decisions and inventories are.

**Agents share context.** Every agent receives the same authorized engagement context. No agent keeps its own version of the truth, and switching agents never requires re-explaining the customer problem.

## 2. Read: the workbench view

One read returns the frame of the page; the canvas stream is read separately because it changes as the engineer works.

**Request.** `GET /api/v1/engagements/{engagementId}/workbench`, with optional `agent` and `panel`. The server confirms the engineer may see this engagement and returns 404 if not, without saying whether it exists.

### Response: `WorkbenchView`

| Field | Meaning |
|---|---|
| `schema_version`, `generated_at` | Contract version and build time |
| `engagement` | Id, customer label, engagement label |
| `breadcrumbs` | Ordered label and link pairs |
| `client_links` | Open in Claude and Share in Slack, each as an action carrying this engagement's identity |
| `context_bar` | Ordered facts: outcome, delivery position, next milestone, waiting on, blockers. Each has label, value and optional tone |
| `lenses` | All five lenses: id, label, state, tone, and a link to their detail |
| `agent_groups` | Ordered groups, each with `group_id`, a label and ordered agents |
| `canvas` | The selected agent and the stream to read (see next section) |
| `panels` | The two right-panel tabs with labels and counts, and which is selected |
| `artifacts` | Ordered artifact rows, plus the visibility filters the server allows |
| `land` | Ordered inventory cards and the actions available for inventories |
| `uploads` | Accepted file types and size limit for this engagement |

### Agent

| Field | Meaning |
|---|---|
| `agent_id`, `label` | e.g. Business Discovery |
| `description` | One line shown at the top of the canvas when selected |
| `status_text`, `status_tone` | e.g. "v1.2 awaiting approval" (warning) |
| `selected` | Whether this agent is open in the canvas |
| `open` | An action that selects this agent |

### Artifact row

| Field | Meaning |
|---|---|
| `artifact_id`, `title` | Stable id and display title |
| `type_label` | e.g. Coder prompt, Architecture diagram, Jira tickets |
| `version_label` | e.g. v0.2, or a count for a collection such as Jira tickets |
| `state` | One of `draft`, `review`, `approved`, `signed`, `published`, with label and tone |
| `visibility` | `internal` or `customer_visible`, with label |
| `owner_label`, `author_agent_label` | Who owns it and which agent drafted it |
| `open` | An action that opens it in Studio |

### Inventory card (lay of the land)

| Field | Meaning |
|---|---|
| `inventory_id`, `type` | e.g. `tech_stack`, `people`, `processes`, `data_sources`, `integrations`, `ai_tools`, `risks` |
| `label`, `description` | e.g. "People" and "Teams, roles, skills, sponsor, owners, named acceptors" |
| `status` | Label and tone, e.g. "3 awaiting access" (warning), "Not started" (neutral) |
| `detail_label` | Optional size, e.g. "28 systems" |
| `agent_label` | Which agent builds it |
| `primary` | Build, Continue or Open, as an action |

The list of inventory types is the server's. The page shows whatever types the server returns, in its order, so new inventory types need no frontend change.

## 3. Read: the canvas stream

The canvas is an ordered stream of typed entries for one agent on one engagement; the page renders each entry by its type and never decides what an entry means.

**Request.** `GET /api/v1/engagements/{engagementId}/agents/{agentId}/stream`, newest page first, with a `cursor` for older entries.

**Response: `Stream`.** `agent_id`; `entries` in order; `next_cursor` (empty on the oldest page); `run` (the running `run_id` and its cancel action, or empty when nothing is running); and `composer`: the `canvas.send` action for this agent, the placeholder text and the note under the box. The page renders the composer from this, so an agent that may not be messaged simply gets a disabled send action with its reason.

Every entry has: `entry_id`, `type`, `created_at_label` (server-formatted), `author` (the engineer, an agent, or the system), and the fields for its type below.

| Entry type | Fields | Shown as |
|---|---|---|
| `message` | Text, attachments (label and link) | A chat message from the engineer or the agent |
| `upload` | File label, where it was saved (e.g. engagement evidence) | A system line confirming the upload |
| `thinking` | A short summary written for the engineer | A muted block; never raw model reasoning |
| `tool_call` | Tool label, plain-language target, status (`running`, `done`, `failed`), failure reason | A compact line in a tool-call group |
| `draft` | Draft id, title, summary, sections (each a heading and items), and actions | A structured draft card that is not yet a saved version |
| `question` | Question text, who should answer, and actions such as Ask customer | An unresolved question card |
| `decision_request` | Decision text, options with labels, and actions | A decision card |
| `saved` | Artifact title, version label and link | A system line: "Saved Discovery brief v0.3" |
| `error` | Title and detail from the server | An inline error line |

**Rules**

- A draft is never a record. It becomes one only when the engineer runs a save action the draft offers and the server confirms it with a `saved` entry.
- An agent saying work is done changes nothing. Only server-confirmed entries change the record.
- Tool calls show what was read or written in plain terms, such as "Requirement C-04 from signed Cornerstone v1". Credentials, raw prompts and restricted source text never appear in the stream.
- An entry type the page does not recognize is shown as a plain line with its server-supplied label, not hidden and not guessed at.

## 4. Commands, uploads and live updates

The page sends intents to one command endpoint; long agent work runs on the server and streams back as entries.

**Command rules**

- Every command goes to `POST /api/v1/commands` with the command name, target, inputs, an idempotency key generated once per click, and the version the click was based on where one applies.
- The server checks identity, permission, engagement membership and freshness, then either returns the result or a typed error.
- The client sends only commands offered by an action in the view or the stream.

### Commands on this page

| Command | Inputs | What the server does | Returns |
|---|---|---|---|
| `canvas.send` | Agent, message text, upload ids | Starts an agent run with the engagement's authorized context | A run id; entries arrive on the run's event stream |
| `canvas.cancel` | Run id | Stops the run; work already saved stays saved | Updated stream |
| `draft.save` | Draft id, artifact id if updating, expected version | Creates a new artifact version from the draft, linked to its sources and run | A `saved` entry and the updated artifact row |
| `draft.discard` | Draft id | Marks the draft discarded; nothing is written to the record | Updated stream |
| `question.send` | Question id, recipient | Records the open question and sends it to the named customer contact | Updated question card and My Field invalidated |
| `decision.record` | Decision id, chosen option, note | Writes a decision to the engagement record with who decided and when | A system entry and refreshed context bar |
| `inventory.build` | Inventory type | Selects the inventory's agent and starts a run to build or extend it | Run id; the agent opens in the canvas |
| `inventory.import` | Inventory type, upload id | Parses the file into inventory rows for the engineer to review as a draft | A draft entry; nothing is saved until confirmed |
| `client.open_in_claude` | None | Issues a link that carries this engagement's identity and permissions | The link to open |
| `client.share_in_slack` | Channel, artifact id | Posts a reference to the same record, never a copy | Confirmation with the posted link |

### Uploads

- Files go to `POST /api/v1/engagements/{engagementId}/uploads` and return an upload id, a label and where the file was saved.
- Every upload is saved to the engagement's evidence before any agent sees it.
- The server enforces type, size, classification and malware checks, and rejects with a reason.
- An upload is internal by default. Making it customer-visible is a separate, permissioned action.

### Live updates

- `GET /api/v1/runs/{runId}/events` streams new canvas entries for a running agent, in order, each one a complete entry.
- `GET /api/v1/engagements/{engagementId}/events` sends `view.invalidated` with a reason when the record changes from any client. The page then re-reads the workbench view.
- If the connection drops, the page re-reads the view and the stream from its last entry id. It never replays commands.

## 5. States, errors and acceptance checks

Each region loads and fails on its own, so a slow stream never blanks the context bar or the panels.

| State | Trigger | Page shows |
|---|---|---|
| Loading | First read in flight | Region skeletons; no placeholder numbers |
| Agent running | A run is active | Entries appearing in order, a running marker and a Stop control |
| Empty canvas | No entries for this agent yet | The agent's description and server-supplied starter prompts |
| Empty inventory | Inventory not started | The card's "Not started" status and its Build action |
| Stale | 409 on a command | Re-reads the view and stream, then shows the result |
| Forbidden | No access to the engagement | 404-style page with a link back to My Field |
| Partly unavailable | One region fails | That region shows the server error and a retry; the rest stays usable |

Errors use the same problem format as every Field page: `code`, `title`, `detail`, `retryable`, optional `field`.

| HTTP | Code | When |
|---|---|---|
| 401 | `UNAUTHENTICATED` | Session missing or expired |
| 403 | `FORBIDDEN` | Not allowed to take this action on this engagement |
| 404 | `NOT_FOUND` | Engagement, agent, draft or inventory hidden or gone |
| 409 | `STALE_VERSION` | Artifact or view changed since the click |
| 409 | `RUN_IN_PROGRESS` | A second run started on the same agent while one is active |
| 413, 415 | `UPLOAD_REJECTED` | File too large, wrong type, or failed checks |
| 422 | `INVALID_COMMAND` | Command not offered for this target or inputs invalid |
| 503 | `AGENT_UNAVAILABLE` | Model or agent service down; no fabricated output is shown |

### Acceptance checks

- [ ] The page renders from recorded view and stream responses with no other data source.
- [ ] Context bar values, lens states and inventory statuses match the server exactly; none are computed in the browser.
- [ ] Switching agents keeps the engagement context; the new agent never asks for the problem again.
- [ ] A draft is not in the artifact list until the server returns a `saved` entry.
- [ ] Saving the same draft twice with one idempotency key creates one version.
- [ ] An upload appears as engagement evidence before any agent references it.
- [ ] Inventory types render in the server's order, and an unknown type still renders.
- [ ] Work saved through Claude or Slack appears here after `view.invalidated`.
- [ ] Open in Claude and Share in Slack carry the same engagement identity and never create a second record.
- [ ] When the agent service is down, the canvas shows the server error and no invented reply.

## 6. Open questions

1. Can two engineers run the same agent on one engagement at the same time, or is a run exclusive?
2. Should inventory imports always land as drafts, or can a trusted connector write rows directly?
3. Which customer contacts can receive questions sent from the canvas?

## 7. PRD binding

How this screen maps to `docs/PRD-aadm-delivery-maps.md` (v0.19): the nouns of §A3, the verbs of §A4 and the envelope of §A7. Where this contract and the PRD disagree, the PRD wins until the PRD is changed.

### Hierarchy

A **Workspace** groups many **Engagements**; one engagement is one customer effort. The Workbench is one engagement. Engagement is a **proposed 15th noun** and needs a PRD decision; today §A3 calls one customer or project a Workspace. The breadcrumb becomes Workspace → Engagement once the Workspace overview screen exists.

### Regions to nouns

| This contract | PRD noun or source |
|---|---|
| `context_bar` outcome | **Vision** (outcome, users, measures) |
| `context_bar` delivery position, next milestone | **Roadmap** (You are here), **Stage**, **Batch** |
| `context_bar` blockers, waiting on | Open **Decisions** and slices that block others |
| `lenses` | Read models over Requirements, Roadmap, Decision and Verdict state. Not stored |
| `agent_groups` | The agents behind the verbs, one per hat (§A2): Product owner, Architect, Lead, Planner, Builder, Owner. Each specialist names the verbs it may call |
| Canvas `message`, `thinking`, `tool_call` | The saved round of an **iterate** (§A8: what the agent was asked and answered) |
| Canvas `draft` | The agent's proposed version N+1 of a noun. Not saved until the verb's write returns it in `saved[]` |
| Canvas `saved` | The §A7 reply's `saved[]` entry |
| Canvas `decision_request` | A **Decision** a person must make (sign off, go, confirm) |
| Canvas `question` | An open question on the **Vision** or **Requirements** version |
| `artifacts` | The engagement's versioned nouns: Vision, Requirements, Roadmap, Prompts, Runs, Evidence, Verdicts, Maps |
| `land` inventories | No noun yet. One output of Terrain work (§13b, stage T); Terrain is broader and feeds them (Brian, Oct 30, 2026). See "Not in the PRD yet" |
| Uploads | Evidence (kind `file`) or the body of an Idea; stored before any agent sees them |

### Commands to verbs

Every command uses the §A7 envelope (`verb`, `workspace_id`, `actor`, `client: "web"`, `source_ref`, `target {kind, id, expected_version}`, `input`, `idempotency_key`, `request_id`, `api_version`). The reply is `{result, saved[], next_step, needs_decision?}`.

| This contract | PRD verb |
|---|---|
| `canvas.send` | **iterate** (Vision, Requirements), **challenge**, **batch**, **write prompt** or **judge**, by the selected agent; the agent worker makes the model call (§A6) |
| `canvas.cancel` | New verb; stops a run, saves nothing new |
| `draft.save` | The write of the verb that made the draft: version N+1 with `expected_version` |
| `draft.discard` | New verb; nothing is written to the record |
| `question.send` | New verb; writes a `workspace_event` and notifies the contact |
| `decision.record` | **sign off**, **go** or verdict confirm: a person-only **Decision** on one version and hash |
| `inventory.build`, `inventory.import` | No verb yet. Later stage |
| `client.open_in_claude` | MCP client handoff (§A6); same workspace and engagement identity |
| `client.share_in_slack` | Slack client (§A6, Stage F4); posts a link to the record |

Events: `artifact.saved`, `decision.recorded`, `run.judged` and `map.rendered` (§A7) drive `view.invalidated`. The error table in §5 maps onto the D44 result families.

### Rules from the PRD that bind this screen

- **People-only Decisions.** An agent can iterate, challenge, batch, write prompts and suggest a verdict. It never signs off, says go or confirms.
- **Every write is version N+1** with `expected_version`. Nothing is edited in place.
- **CTX-06.** The agent worker hop carries `request_id`, and the saved round records it.
- **FLD-02.** The context bar and lens chips sit beside the work, not ahead of it.

### Stage

The agents and the loop arrive in **Stage V** (F1-a4 agent worker, F2-b to F2-d). The web shell browses in **F5** and edits in **F8**. This screen is built ahead of that order on removable fixtures.

### Not in the PRD yet

Engagement as a noun, lenses as a stored concept, lay-of-the-land inventories, `canvas.cancel`, `draft.discard`, `question.send`.
