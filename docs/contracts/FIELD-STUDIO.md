# AADM Field Contract: Artifact Studio

Oct 30, 2026 · Brian Lambert

Companions: [`FIELD-MY-FIELD.md`](FIELD-MY-FIELD.md) · [`FIELD-WORKBENCH.md`](FIELD-WORKBENCH.md) · [`../FIELD-VISION.md`](../FIELD-VISION.md) · [`../INVARIANTS.md`](../INVARIANTS.md) · [`../ENGINEERING_RULES.md`](../ENGINEERING_RULES.md)

## 1. Purpose, route and rules

Artifact Studio is where an engineer creates, reviews and shares the work products of an engagement. The backend owns every artifact, version, link and approval; the frontend renders what it is sent.

| | |
|---|---|
| **Route** | `/field/main/e/{engagementId}?artifact={artifactId}&view={stream\|built\|map}`; a mode of the workbench, not a separate app |
| **Regions** | Left: collections; center: Stream, Built or Map; right: Outputs |
| **Creates** | Tech stack inventories, Speed Layer canvases, technical architectures, API payload specs, technology choices, recommendations, user story reviews, Jira tickets, coder prompts, process docs, acceptance evidence. The server's list of artifact types decides what can be created |
| **Exits** | Back to the workbench at the same place; My Field via the breadcrumb |

**Backend owns**

- Every artifact, its versions, content, state, visibility, owner, acceptor and stored hash.
- The collections rail: sections, collections, their order, names, pins and the items in each, per engineer.
- What each artifact links to (built from) and what it leads to (produces).
- Every share option, including whether it needs approval.
- Which actions the engineer may take on this artifact, given their role, the artifact's state and its risk.

**Frontend may hold only presentation state:** which sections and collections are expanded, which center view is showing, whether the share menu is open, scroll position, and text typed but not sent. Expanded and collapsed state may be remembered in the browser; nothing else is.

**Approval rule.** Approve, sign and publish run only in a signed-in human session, as an explicit write the server records against the exact stored version. An agent marking work complete never approves or publishes anything.

## 2. Read: `StudioView`

One read builds the whole screen: `GET /api/v1/engagements/{engagementId}/studio`, with optional `artifact` (the open artifact) and `view` (`stream`, `built` or `map`). If no artifact is given, the server picks the one to open and says so in `open_artifact_id`. The client renders the response as sent: it never sorts, filters, counts or relabels.

### `StudioView`

| Field | Type | Meaning |
|---|---|---|
| `engagement` | id, name, customer | Header and breadcrumb |
| `generated_at` | timestamp | Base for every command; a newer one replaces this view |
| `schema_version`, `breadcrumbs` | text, label and link pairs | As in the other screens |
| `state` | one of the §5 screen states | The server says which applies; the client never infers it |
| `open_artifact_id` | id or empty | The artifact in the center; empty shows the empty state |
| `context_label` | text | Beside the view tabs: agent and artifact in plain words |
| `stream`, `built`, `map` | Stream, Built version, Map, each or empty | The center regions; each is its own read, so one failing leaves the others usable |
| `empty_state` | heading and line, or empty | Shown when `open_artifact_id` is empty |
| `uploads` | accepted types and size limit | For the Stream view's composer |
| `views` | list of view tabs | Stream, Built, Map; each with `id`, `label`, `enabled`, `disabled_reason`, `count` |
| `active_view` | `stream`, `built` or `map` | Server default when the URL does not say |
| `rail` | Rail | Left column |
| `outputs` | list of Output rows | Right column |
| `header_actions` | list of Action | Buttons beside the artifact title: Share, Send for review, Approve and others, already filtered by role and state |

### Rail

| Field | Type | Meaning |
|---|---|---|
| `pinned` | list of Collection refs | Shown above the sections, in server order |
| `sections` | list of Section | Discover, Design, Build, Adopt and any the engineer added |
| `can_edit_layout` | boolean | Shows the edit control for sections and collections |
| `create_types` | list of id, label | Artifact types this engineer may create here |

**Section:** `id`, `label`, `order`, `editable`, `removable`, `default_expanded`, `collections` (list of Collection).

**Collection:** `id`, `label`, `count`, `pinned`, `editable`, `default_expanded`, `items` (list of Rail item), `add_action` (Action or empty).

**Rail item:** `id`, `title`, `type_label`, `state`, `state_label`, `tone`, `is_open` (this is the artifact in the center), `href`.

### Output row

| Field | Type | Meaning |
|---|---|---|
| `artifact_id` | id | |
| `title` | text | |
| `type_label` | text | Coder prompt, Architecture, Jira tickets, and so on |
| `state`, `state_label`, `tone` | enums, text | Draft, review, approved, signed, published |
| `version_label` | text | v1.2 |
| `visibility` | `internal` or `customer_visible` | |
| `destination_label` | text or empty | Where it went: Claude Code, Jira INT-142, Confluence |
| `updated_label` | text | Already relative: Today, 2 days |
| `href` | link | Opens it in the center |

**Stream view.** When `active_view` is `stream`, the center uses the Workbench canvas stream contract unchanged (same entries, same run events), scoped to the open artifact. Studio defines no second chat.

## 3. Read: Built, Map and Share

### Built

`GET /api/v1/artifacts/{artifactId}`, with optional `version` (default: current). Returns one stored version exactly as saved.

| Field | Type | Meaning |
|---|---|---|
| `artifact_id`, `version`, `version_label` | id, number, text | The exact version shown |
| `content_hash` | text | Hash of the stored content; shown in the footer and matched on approval |
| `type`, `type_label` | enum, text | Drives which blocks to expect |
| `title` | text | |
| `state`, `state_label`, `tone` | enums, text | |
| `visibility` | `internal` or `customer_visible` | |
| `owner`, `acceptor` | person or agent, person or empty | Who made it, who must accept it |
| `built_from` | list of id, label, href | What it rests on (evidence, decisions, other artifacts) |
| `versions` | list of version_label, saved_by, saved_label, state | History; selecting one re-reads with `version` |
| `blocks` | ordered list of Block | The content |
| `is_current` | boolean | False shows a "viewing an older version" bar and hides edit actions |

**Block.** Each has `id`, `kind` and kind-specific fields. The client draws each kind with its own component and never interprets the content.

| Kind | Fields |
|---|---|
| `heading` | level, text |
| `paragraph` | text with inline marks |
| `list` | ordered, items |
| `table` | columns, rows |
| `code_text` | language label, text (shown as text, never run) |
| `diagram` | notation (`mermaid`, `c4`, `image`), source or image link, alt text |
| `schema` | name, fields (name, type, required, description), example as text |
| `ticket_list` | tickets (key, title, status, link, acceptance criteria) |
| `canvas` | grid name (such as Speed Layer), cells (row, column, text) |
| `review` | items (target, verdict, comment) for user story and design reviews |
| `decision` | question, options, chosen, rationale, decided_by |
| unknown kind | The client shows the block's `fallback_text`; it never errors |

### Map

`GET /api/v1/artifacts/{artifactId}/map`. Shows the open artifact in the context of the engagement.

| Field | Meaning |
|---|---|
| `nodes` | `id`, `label`, `sublabel`, `role` (`input`, `self` or `output`), `kind` (`evidence`, `decision`, `artifact`, `ticket`, `agent`), `state`, `tone`, `href` |
| `edges` | `from`, `to`, relation label (built from, produces, decides, supersedes) |
| `layout_hint` | Columns by role: inputs left, self center, outputs right. The server orders nodes within each column |

### Share

Options arrive in the artifact read as `share_options`, already filtered for this engineer, artifact type and state. The client shows them in a menu, in server order.

| Field | Meaning |
|---|---|
| `id`, `label`, `hint` | For example: Copy text, Copy link, Download PDF, Download Word, Download Markdown, Send to Claude Code, Create in Jira, Publish to Confluence, Share in Slack |
| `kind` | `copy_text`, `copy_link`, `download`, `command` |
| `format` | `pdf`, `docx` or `md`, for download |
| `enabled`, `disabled_reason` | Disabled options show with their reason |
| `requires_approval` | True means the artifact must be approved first; when not yet approved, the option is disabled with that reason |
| `target_label` | Where it will go, shown to confirm |

Copy text and downloads come from `GET /api/v1/artifacts/{artifactId}/export` with `format` and `version`, so what leaves is the stored version, not the screen. Command options are sent as the commands in the next section.

## 4. Commands

Every change is a `POST` to `/api/v1/commands` with: command name, target, input, an idempotency key, and the base it was made against (`generated_at` for layout, `expected_version` for artifact content). The response says accepted or gives a problem; the client then re-reads. It never patches its own copy. The client shows only commands the server sent as an Action and enabled.

### Layout (per engineer, follows them across devices and clients)

| Command | Input | Effect |
|---|---|---|
| `section.create` | label, position | Adds a section |
| `section.rename` | section id, label | |
| `section.reorder` | section id, new position | |
| `section.remove` | section id, move collections to (section id) | Not allowed while it holds collections unless a destination is given |
| `collection.create` | section id, label | |
| `collection.rename` | collection id, label | |
| `collection.move` | collection id, section id, position | Also used to reorder |
| `collection.remove` | collection id, move items to (collection id) | Removes the grouping only; artifacts are never deleted |
| `collection.pin` / `collection.unpin` | collection id | Pinned list order is set by the server, newest pin last |
| `item.move` | artifact id, collection id | Files an artifact into another collection |

### Artifacts

| Command | Input | Rule |
|---|---|---|
| `artifact.create` | type, collection id, title, built_from (optional ids) | Starts as draft, internal |
| `artifact.save_version` | artifact id, expected_version, blocks, note | Creates a new version; never edits a stored one |
| `artifact.restore_version` | artifact id, version, expected_version | Saves an old version as a new current one |
| `artifact.set_visibility` | artifact id, visibility | Customer visible needs approval first |
| `artifact.submit_review` | artifact id, version, reviewer | Draft to review |
| `artifact.request_changes` | artifact id, version, comment | Review back to draft |
| `artifact.approve` | artifact id, version, content_hash | Human session only |
| `artifact.sign` | artifact id, version, content_hash | Human session only; for commitments such as the Cornerstone |
| `artifact.publish` | artifact id, version, content_hash, destination | Human session only; customer-facing destinations need an approved version |
| `artifact.share` | artifact id, version, share option id | Runs a command share option (Send to Claude Code, Create in Jira, Share in Slack). The receiving system gets a link to the stored version, never a second copy of record |

**Approval rules.** Approve, sign and publish are refused unless the request comes from a signed-in human session and the content hash matches the stored version (CAP-03, ARCH-13, ARCH-14). An agent can draft, save versions and submit for review. It cannot approve, sign or publish.

### Evidence and plan changes

| Command | Input | Rule |
|---|---|---|
| `evidence.accept_report` | artifact id, version | Human session only |
| `evidence.request_rework` | artifact id, version, reason | Returns the work to its owner |
| `evidence.change_plan` | artifact id, change summary | If it changes a signed commitment, the server opens a new Cornerstone sign-off and marks the old one superseded |

**Live updates.** The client listens on `/api/v1/engagements/{engagementId}/events`. A `view.invalidated` event naming the studio, an open artifact or the rail means re-read that part. Run events for the Stream view follow the Workbench contract.

## 5. States, errors and acceptance checks

**Screen states.** The server says which one applies. The client never infers it.

| State | Shown when | Client shows |
|---|---|---|
| `loading` | First read in flight | Skeleton of the three regions |
| `empty` | No artifacts in this engagement | Server-sent message and the create actions |
| `no_artifact_open` | Artifacts exist, none selected | Rail and Outputs; center invites a choice |
| `older_version` | `is_current` is false | Read-only bar with "Go to current" |
| `read_only` | Engineer lacks edit rights | Content without edit or approval actions |
| `offline` or `stale` | Event stream dropped or a 409 came back | Bar saying the view may be out of date, with Refresh |

Errors use the shared problem format: `code`, `title`, `detail`, `retryable`, optional `field`. The client shows title and detail as sent.

| Code | When | Client does |
|---|---|---|
| `STALE_VERSION` | `expected_version` or `generated_at` is behind | Re-read, keep the typed text, show what changed |
| `HASH_MISMATCH` | Approval hash does not match the stored version | Re-read; approval is not retried automatically |
| `HUMAN_SESSION_REQUIRED` | Approve, sign, publish or accept from a non-human session | Show the message; no retry |
| `APPROVAL_REQUIRED` | Publish or customer-visible share before approval | Show the message with a Send for review action, if sent |
| `NOT_PERMITTED` | Role does not allow it | Show the message |
| `SECTION_NOT_EMPTY` | Remove a section that still holds collections, with no destination | Ask where to move them |
| `DESTINATION_UNAVAILABLE` | Jira, Confluence, Slack or Claude Code not reachable | Show the message; retry if retryable |
| `EXPORT_FAILED` | Download or copy could not be produced | Show the message; retry if retryable |

### Acceptance checks

- [ ] The rail, Outputs and header actions match the server response exactly, including order, labels and counts.
- [ ] Built always shows the version label and content hash of the stored version on screen.
- [ ] Copy and downloads equal the export of the stored version, byte for byte, not the rendered page.
- [ ] An agent session can never approve, sign, publish or accept. Each attempt returns `HUMAN_SESSION_REQUIRED` and is logged.
- [ ] Approve and publish fail with `HASH_MISMATCH` if the content changed after it was opened.
- [ ] Saving never changes a stored version; it always adds one.
- [ ] Pins, section edits and collection edits made on desktop appear on phone, in Claude and in Slack after a re-read.
- [ ] Removing a collection never deletes an artifact.
- [ ] Sharing to Claude Code, Jira or Slack sends a link to the record; no second record of the artifact exists.
- [ ] An unknown block kind shows its fallback text and the rest of the artifact still renders.
- [ ] Changing a signed commitment opens a new Cornerstone sign-off.

## 6. Open questions

1. Is the rail layout per engineer only, or can a team share a default layout per engagement?
2. Which artifact types need sign (commitment) rather than approve (quality)?
3. Do Jira tickets created from a `ticket_list` stay in sync both ways, or is Field the source and Jira a copy?
4. Who may restore an old version of an approved artifact, and does restoring reset it to draft?

## 7. PRD binding

How this screen maps to `docs/PRD-aadm-delivery-maps.md` (v0.19): the nouns of §A3, the verbs of §A4 and the envelope of §A7. Where this contract and the PRD disagree, the PRD wins until the PRD is changed.

### Hierarchy

A **Workspace** groups many **Engagements**; Studio opens one artifact inside one engagement. Engagement is a **proposed 15th noun** and needs a PRD decision.

### "Artifact" to nouns

An artifact in this contract is one versioned PRD noun opened full size. Artifact types that are not one of the 14 nouns are later stages.

| Artifact type | PRD noun |
|---|---|
| Vision, outcome definition | **Vision** |
| Requirements, Cornerstone, API payload spec, user story review | **Requirements** (items, fixtures, gaps; relationship rows and challenge results attached) |
| Delivery plan | **Roadmap**, with its **Stages**, **Batches** and **Slices** |
| Coder prompt | **Prompt** |
| Coder report | **Run**, with its **Evidence** |
| Acceptance evidence | **Evidence** and the **Verdict** |
| Map view | **Map** |
| Tech stack inventory, Speed Layer canvas, technical architecture, technology choice, recommendation, process doc | No noun yet. Later stage |

### Fields to the version rule

| This contract | PRD |
|---|---|
| `version`, `version_label`, `versions` | The noun's list of versions (§A3): body, parent, author, client, source link, hash, time |
| `content_hash` | The version's hash; a Decision points at `(kind, id, version, sha256)` |
| `state` approved, signed, published | Never a flag: shown from the **Decision** that points at this version |
| `is_current` | Whether this is the latest version |
| `built_from`, Map `nodes`, `edges` | The links in §A3 (Idea → Vision → Requirements → Roadmap → Slice → Prompt → Run → Evidence → Verdict) |
| `blocks` | The body of one version, as stored |

### Commands to verbs

Every command uses the §A7 envelope; the reply is `{result, saved[], next_step, needs_decision?}`.

| This contract | PRD verb |
|---|---|
| `artifact.save_version` | **iterate** (Vision, Requirements), **batch** (Roadmap), **write prompt** (Prompt): version N+1 with `expected_version` |
| `artifact.restore_version` | Same verb, saving the old body as version N+1 |
| `artifact.submit_review` | **challenge** (relationship rows, `interrogate_plan`, `grill_questions`) |
| `artifact.approve`, `artifact.sign` | **sign off** Decision: people only, hash must match |
| Go on a Prompt | **go** Decision: people only, bound to the prompt's hash |
| `evidence.accept_report`, `evidence.request_rework` | Verdict confirm Decision (ON PLAN or DRIFT) after **judge** |
| `evidence.change_plan` | A new Requirements version, signed off, which triggers **replan** |
| Map view refresh | **render map** |
| `artifact.publish`, `artifact.share` to Jira, Confluence | Trackers are a later fourth client (§A6). Later stage |
| Share to Slack, Open in Claude Code | Slack client (Stage F4) and MCP client (§A6) |
| `section.*`, `collection.*`, `item.move` | No verb yet. Presentation for one user; later stage |
| `artifact.set_visibility` | New verb; customer-visible only after sign-off |

The error table in §5 maps onto the D44 result families: `STALE_VERSION` is the `expected_version` conflict, `HASH_MISMATCH` and `HUMAN_SESSION_REQUIRED` are the people-only Decision rules.

### Rules from the PRD that bind this screen

- **A signed version never changes** (FIX-04). Saving always adds a version.
- **People-only Decisions** (FIX-03). Sign off, go and confirm are refused from an agent session.
- **ART-02.** Every version row has its own UUID, author, client, `request_id` and `idempotency_key`; `saved[]` returns them.
- **FLD-02.** Version, hash and evidence sit one click below the content, never ahead of it.

### Stage

The browse views, map, evidence view and co-sign are **F5**. Editing, layout and the share menu are **F8** or later. This screen is built ahead of that order on removable fixtures.

### Not in the PRD yet

Engagement as a noun, artifact types beyond the 14 nouns, collections and layout, publish to trackers, visibility as a verb.
