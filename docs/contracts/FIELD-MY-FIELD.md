# AADM Field Contract: My Field

Oct 30, 2026 · Brian Lambert

Companions: [`../FIELD-VISION.md`](../FIELD-VISION.md) · [`../FIELD-CONTRACTS.md`](../FIELD-CONTRACTS.md) · [`../INVARIANTS.md`](../INVARIANTS.md) · [`../ENGINEERING_RULES.md`](../ENGINEERING_RULES.md)

## 1. Purpose, route and rules

My Field tells one engineer where to act across every engagement they can see. The backend decides everything on the page; the frontend only renders it and sends intents back.

| | |
|---|---|
| **Route** | `/field/main` |
| **Answers** | What is most consequential now, what is waiting on me, what is waiting on the customer, where each engagement stands |
| **Never** | A portfolio dashboard, charts, infrastructure metrics, or a stop on the way to work |
| **Exits** | Every row and card leads straight to the workbench or Studio with the right specialist and artifact already selected |

**Backend owns**

- Which item is the single Continue item, and why.
- Which actions appear, their order, counts and filter membership.
- Every label, status and tone, including "waiting" durations and what a wait blocks.
- Which lenses appear on a card (only those needing attention).
- Every destination link and every allowed action, with the reason when an action is unavailable.

**Frontend may hold only presentation state:** hover, focus, an open menu, scroll position, and the selected filter while a request is in flight. It never sorts, filters, counts, ranks, computes a time, derives a status or builds a link. Changing the filter is a new read, not a local filter.

**Terms.** UI copy says *engagement*. A *workspace* is the tenant boundary and never appears as a label on this page.

## 2. Read: the My Field view

One read returns everything the page shows, already ordered and labelled; the page renders it as given.

**Request.** `GET /api/v1/field/home`, with an optional `filter` (one of the filter ids the server last returned) and `cursor` for the next page of actions. The signed-in session identifies the engineer; the client never sends a user, workspace or role.

### Response: `MyFieldView`

| Field | Meaning |
|---|---|
| `schema_version` | Contract version. The client refuses a major version it does not know |
| `generated_at` | When the server built this view |
| `viewer` | Display name and initials for the account button |
| `summary_label` | One line, e.g. "3 engagements · 9 open actions" |
| `continue` | The one most consequential item, or empty when nothing is pending (see below) |
| `filters` | Ordered list: `id`, `label`, `count`, `selected`. Count is the server's number |
| `actions` | Ordered page of action rows for the selected filter, plus `next_cursor` |
| `engagements` | Ordered engagement cards |
| `capture` | Whether Capture is available, accepted file types and size limit |
| `empty_state` | Heading and line to show when there are no actions or engagements |

### Continue item

| Field | Meaning |
|---|---|
| `title` | What to do, written for the engineer |
| `engagement_label` | Customer and engagement name |
| `specialist_label` | Which agent the work opens with |
| `badges` | Label and tone pairs, e.g. "Blocks batch 4" (warning) |
| `primary` | An action (see Action shape) |

### Action row

| Field | Meaning |
|---|---|
| `id` | Stable id of the work item |
| `title` | What to do |
| `blocks_label` | Optional: what this wait holds up, e.g. "Blocks data inventory and Slice 2" |
| `engagement_label`, `specialist_label`, `owner_label` | Display text; owner may be "You" or a named customer role |
| `waiting_label`, `waiting_tone` | e.g. "3 days", warning. Computed by the server |
| `cta` | One action (see Action shape) |

### Engagement card

| Field | Meaning |
|---|---|
| `engagement_id` | Stable id |
| `customer_label`, `engagement_label` | Display names |
| `status` | Optional label and tone, e.g. "Blocked" (danger) |
| `facts` | Ordered label and value pairs: outcome, delivery position, next milestone, waiting on |
| `land_label` | Lay-of-the-land coverage, e.g. "4 of 7 inventories" |
| `lenses` | Only the lenses needing attention: `id`, `label`, `state`, `tone` |
| `drift` | Optional reason text and tone |
| `open` | An action that opens the workbench for this engagement |

### Action shape (used everywhere on the page)

| Field | Meaning |
|---|---|
| `label` | Button or link text |
| `kind` | `navigate` (go to `href`) or `command` (send `command` with `target`) |
| `href` | Server-built destination, including engagement, specialist, artifact and view |
| `command`, `target` | The command name and the id it acts on |
| `enabled`, `disabled_reason` | Whether it can be used now, and why not |
| `emphasis` | `primary` or `secondary` |

**Shared value lists.** Tone is one of `neutral`, `info`, `success`, `warning`, `danger`. Lens state is one of `on_track`, `in_progress`, `needs_action`, `needs_decision`, `blocked`, `not_started`; the server also sends the label to show, never a bare percentage.

## 3. Commands and live updates

The page sends intents; the server validates each one, decides the result, and returns the updated view or a typed error.

**Command rules**

- Every command goes to `POST /api/v1/commands` with: command name, target id, an idempotency key the client generates once per click, and the `generated_at` of the view the click came from.
- The server checks identity, permission and freshness. A stale view returns a conflict, and the client re-reads.
- The response is either a fresh `MyFieldView` or an error. The client never edits its copy of the view to guess the outcome.
- The client sends only commands named in an action the server returned. It never invents one.

### Commands on this page

| Command | Target | What the server does | Returns |
|---|---|---|---|
| `action.nudge` | Action row id | Sends the owner a reminder through their configured channel; records it on the engagement | Fresh view; row shows "Nudged today" |
| `action.snooze` | Action row id | Hides the row for the engineer until a time the server sets; does not change the underlying work | Fresh view |
| `capture.create` | None | Accepts a file or note, stores it as unfiled evidence, proposes an engagement and a specialist | A capture record with the proposal and a confirm action |
| `capture.file` | Capture id | Files the capture to the chosen engagement's evidence and offers it to the proposed specialist | Fresh view, plus a link to that engagement |

Navigation actions (Open, Review, Continue, Decide) are links, not commands. Opening a link never changes state.

**Capture uploads.** The file goes to `POST /api/v1/uploads` first and returns an upload id; `capture.create` references that id. The server enforces type and size limits from the `capture` block and rejects anything else with a reason.

### Live updates

- The page subscribes to `GET /api/v1/field/home/events` (server-sent events).
- The server sends only `view.invalidated`, with a reason such as "artifact approved" or "customer signed". It never sends partial data.
- On `view.invalidated` the client re-reads the view. If a command is in flight, it waits for that response first.
- Work done in Claude or Slack invalidates the view the same way, because all clients write the same engagement record.

## 4. States, errors and acceptance checks

Every state the page can be in has a defined source and display; the server supplies the words for each.

| State | Trigger | Page shows |
|---|---|---|
| Loading | First read in flight | Layout skeleton, no numbers or placeholder text |
| Ready | View returned | The view exactly as sent |
| Empty | No actions or engagements | The server's `empty_state` heading and line |
| Stale | Conflict on a command | Re-reads silently, then shows the fresh view |
| Forbidden | No access to Field | Server message and sign-out; no partial data |
| Unavailable | Server down or timeout | Last good view greyed with "Out of date" and a retry; no commands allowed |

**Errors.** Every error uses one problem format: `code`, `title`, `detail`, `retryable`, and an optional `field`. The client shows title and detail and never writes its own error text.

| HTTP | Code | When |
|---|---|---|
| 401 | `UNAUTHENTICATED` | Session missing or expired |
| 403 | `FORBIDDEN` | Not allowed to see or act on this item |
| 404 | `NOT_FOUND` | Item gone or hidden; no hint that it exists |
| 409 | `STALE_VIEW` | The view changed since the click |
| 413, 415 | `UPLOAD_REJECTED` | Capture file too large or wrong type |
| 422 | `INVALID_COMMAND` | Command not offered for this target |
| 429 | `RATE_LIMITED` | Too many requests |
| 503 | `UNAVAILABLE` | Backend cannot serve the view |

### Acceptance checks

- [ ] The page renders correctly from a recorded view with no other data source.
- [ ] Changing the filter issues a new read; nothing is filtered or counted in the browser.
- [ ] The Continue item, row order and every count match the server response exactly.
- [ ] Every link opens the workbench or Studio with the specialist and artifact the server named, never an overview.
- [ ] A disabled action shows the server's `disabled_reason` and cannot be sent.
- [ ] A repeated click with the same idempotency key produces one effect.
- [ ] A command on a stale view returns 409 and the page re-reads.
- [ ] Work completed in Claude or Slack appears here after `view.invalidated`, without a manual refresh.
- [ ] No customer-visible or internal item appears to a user the server did not authorize.

## 5. Open questions

1. Does snooze belong on My Field, or only in the workbench?
2. Which channel does a nudge use for customer owners: email, Slack, or the engagement's chosen channel?
3. Should Capture propose a specialist automatically, or only an engagement?
