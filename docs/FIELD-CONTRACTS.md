# AADM Field — engagement contracts

Status: working contract for UX mocks and the later Field backend.
Vision: `docs/FIELD-VISION.md`.
Website invariants: `docs/INVARIANTS.md` (BACK-01, ARCH-15, CAP-03, ARCH-13, ARCH-14).
MCP overlay: `aadm://doctrine/fde-engagement`, `aadm://templates/fde-outcome-contract`.

The website never invents domain truth. Pages render these records. They do not infer phase, health, or progress from missing fields or timestamps.

This file does not add MCP recon artifacts. The five host artifacts on `sentinel_audit_slice_fde_engagement` stay: engagement contract, acceptor map, gate register, transfer package, verdict.

## 1. Identity and tenancy

| Record | Id | Notes |
|---|---|---|
| Workspace | tenant id from the Clerk session | Auth boundary. Never taken from the URL alone (ARCH-01). |
| Customer | `customer_id` | One workspace can serve many customers. |
| Engagement | `engagement_id` | One customer can have many engagements. UI noun is **engagement**. |
| Cornerstone version | `cornerstone_id` + `version` | Signed requirements set. |
| Slice | `slice_id` | One prompt, one report, one review decision. |
| Artifact | `artifact_id` + `version` | Versioned deliverable. Chat is not this record. |
| Specialist | `agent_id` | Responsibility on the engagement, not a tenant. |

`workspace` stays the INVARIANTS tenant word. Field screens say `engagement`.

## 2. Outcome (P0)

Stored on the engagement. Filled from `aadm://templates/fde-outcome-contract`.

| Field | Type | Rule |
|---|---|---|
| `problem` | text | One sentence |
| `outcome` | text | Measurable result a named acceptor will sign |
| `baseline` | text + optional number + unit | Current performance before the build. Empty → lens Strategy is `needs_action`, gate `baseline_capture` stays open |
| `target` | text + optional number + unit | Committed target. Empty → same as missing baseline |
| `value_demonstrable` | `yes` / `no` / `unverified` | `yes` only when baseline, target, and named eval_owner exist and an evidence artifact is attached. Never inferred from a demo |
| `stop_conditions` | text[] | Named reasons the engagement ends without a build |
| `next_milestone` | `{ kind, label, due, owner }` | `kind`: `workshop` / `sign_off` / `pilot_decision` / `customer_demo` / `other` |

My Field and the workbench context bar render these four together: outcome, baseline, target, `value_demonstrable`. They do not render a percentage of outcome. There is no Overview route.

## 3. Concurrent lenses (P0)

Not a sequential phase. Not the MCP engagement stages.

```
lens_id: strategy | plan | readiness | adopt | governance
status:  on_track | in_progress | needs_action | needs_decision | blocked | not_started
evidence: artifact_id[] | none
blocking_action_id: action_id | none
```

| Lens | Question the status answers |
|---|---|
| `strategy` | Valuable business problem, with baseline and target? |
| `plan` | Delivery scoped, sequenced, owned? |
| `readiness` | Customer adoption readiness: data, people, process, support — not infra ops |
| `adopt` | Users changing how they work? |
| `governance` | Controls, decisions, named acceptors, artifact visibility? |

Home may show five compact statuses. It must not show a single "Current Phase" or "Phase" column that picks one lens.

## 4. Actions and critical path (P0)

An **action** is a concrete next step the home can rank.

| Field | Rule |
|---|---|
| `action_id` | Stable id |
| `engagement_id` | Required |
| `kind` | `review_report` / `rework` / `change_plan` / `customer_decision` / `sign_off` / `write_prompt` / `milestone` / `other` |
| `agent_id` | Specialist to open on the workbench |
| `artifact_id` | Artifact to load, or none |
| `owner_kind` | `engineer` / `customer` |
| `owner_name` | Named person. Unassigned is shown as unassigned, never hidden |
| `urgency` | `blocks_others` / `late` / `due_soon` / `normal` |
| `customer_impact` | `high` / `medium` / `low` / `unscored` |
| `waiting_since` | Instant from the backend. UI shows elapsed time; it does not compute "late" itself (ARCH-15) |
| `blocks` | Other `action_id`s or slice ids |
| `rank_reason` | One sentence the UI can print: why this is above the next item |

**Critical path** is the action with `urgency = blocks_others` that the backend marks `on_critical_path: true`. At most one per engagement. Home surfaces it above Continue when any exists across the portfolio.

Rank order: `blocks_others`, then `late`, then `customer_impact`, then due date. Date is never the only sort.

Opening an action is one navigation: `/field/main/e/{engagementId}?agent={agent_id}&artifact={artifact_id}&action={action_id}`. The workbench must not bounce through an overview.

## 5. Customer commitments (P0)

| Field | Rule |
|---|---|
| `commitment_id` | Stable id |
| `statement` | What was promised |
| `customer_owner` | Named person |
| `engineer_owner` | Accountable engineer |
| `state` | `open` / `signed` / `superseded` / `waiting` |
| `waiting_since` | Backend instant |
| `visibility` | `internal` / `customer` |

A commitment waiting on the customer appears in Home → Customer commitments with owner and time waiting.

## 6. Drift (P0)

| Field | Rule |
|---|---|
| `drift_id` | Stable id |
| `slice_id` | Required |
| `against` | Cornerstone requirement id + version |
| `summary` | What diverged |
| `why` | Why the report does not satisfy the signed requirement |
| `decision_needed` | `accept_with_note` / `rework` / `change_plan` / `unresolved` |
| `state` | `potential` / `confirmed` / `resolved` |

"On plan" / "Drifting" / "Blocked" on Home is a backend health enum. The UI must also show `why` and `decision_needed`. A yellow badge without those two fields is incomplete.

## 7. Plan-versus-actual review (distinguishing write)

Consequential write. Human session only (CAP-03). Screen shows the exact report version and hash (ARCH-14).

```
review_decision: accept_report | request_rework | change_plan
```

| Decision | Writes | Does not write |
|---|---|---|
| `accept_report` | Evidence artifact; slice → `accepted`; delivery map advances; next action computed | A new Cornerstone version |
| `request_rework` | New action `kind=rework` against the same requirement | Plan or Cornerstone change |
| `change_plan` | Decision record; if a signed commitment changes, Cornerstone version increments and needs re-sign | Silent overwrite of the previous version |

One accept must not require the engineer to update six records by hand.

## 8. Delivery progress (no bare percentages)

Allowed progress strings are counts the backend already computed:

- `slices_accepted` of `slices_total`
- `requirements_signed` of `requirements_total`
- `lenses_needing_action` (count only)

Forbidden unless a stored formula is named on the record: "60% complete", "12 of 20" drawn as a percentage bar with no count label, or a single Phase column.

Delivery confidence, when shown, is `high` / `medium` / `low` / `unscored` with a reason. It is not a score from this website.

## 9. Artifacts (persistent work product)

Chat threads are not stored as the record. Saving, approving, signing, or publishing writes an artifact version.

| Field | Rule |
|---|---|
| `artifact_id` | Stable across versions |
| `engagement_id` | Required |
| `type` | `discovery_brief` / `technical_assessment` / `outcome_definition` / `architecture_decision` / `cornerstone` / `delivery_plan` / `acceptance_evidence` / `adoption_package` / `other` |
| `version` | Integer, monotonic. v0.3 in the UI is `3` or a stored label; do not invent one in the page |
| `status` | `draft` / `review` / `approved` / `signed` / `published` / `superseded` |
| `owner` | Named person |
| `visibility` | `internal` / `customer` |
| `content_sha256` | Required before approve / sign / publish (ARCH-14) |
| `linked_requirement_ids` | Cornerstone ids this artifact supports |
| `evidence_ids` | Supporting artifacts |
| `authoring_agent_id` | Specialist that drafted it, or `human` |
| `source_client` | `field` / `claude` / `slack` / `other` |

| `visibility` | Default for |
|---|---|
| `internal` | Coder reports, internal assessments, commercial notes, drafts |
| `customer` | Signed Cornerstone, customer-facing decisions, published acceptance evidence |

Nothing becomes customer-visible because it was attached to an engagement. Share / publish is an explicit write. An agent-complete message is not `published`.

**Open in Claude** and **Share in Slack** send `engagement_id`, `artifact_id`, `version`, and the caller's permission set. They create no new engagement and no fork unless the human starts an explicit change-plan.

## 9b. Specialist agents

```
agent_id:
  business_discovery | technical_discovery | outcome_architect |
  solution_architect | cornerstone | delivery_planner |
  evidence_reviewer | adoption_lead
```

Each call receives the same authorized context pack: outcome, approved artifacts, open decisions, relevant requirements. Agents do not keep a private copy of the plan.

## 9c. Clients

| Client | Role |
|---|---|
| Field | Skinny web client. My Field + Workbench + Studio mode |
| Claude | Connected client via MCP tools that write the same artifact versions |
| Slack | Workflow client. Actions update the same records |

The backend is authoritative (BACK-01). Clients render. They do not reconcile chat histories.

## 10. Relationship context (P1)

| Role on the engagement | Maps to MCP acceptor when present |
|---|---|
| Sponsor | `sponsor` |
| Operational owner | `operator` |
| Technical contacts | host-owned list |
| Accountable engineer | Field-only; not an MCP acceptor |
| Eval owner | `eval_owner` |
| Internal successor | `internal_successor` |

Unassigned on sponsor, eval_owner, or internal_successor keeps MCP named acceptors open.

## 11. First-release read models

Until aadm-backend exists, fixture functions return these shapes tagged `source: "fixture"`. Pages render what they receive.

```
getFieldHome(userId) → {
  greeting,
  critical_path: action | null,   // includes why, agent_id, artifact_id
  continue: action,               // rank_reason, outcome, baseline, target, agent_id, artifact_id
  waiting_on_you: action[],
  customer_commitments: commitment[],
  engagements: engagement_row[]
}

getEngagementWorkbench(userId, engagementId, { agent_id?, artifact_id?, action_id? }) → {
  context_bar: { customer, engagement, outcome, baseline, target, value_demonstrable,
                 blockers, delivery_position, next_milestone, waiting_on, lenses },
  agent_id,                       // selected specialist
  canvas: { thread_preview, structured_prompts },
  artifacts: artifact_row[],      // list for the right rail
  brief: { promised, planned, delivered, accepted, changed }  // panel, not a route
}

getArtifact(userId, artifactId, version?) → artifact  // studio mode body

reviewCoderReport(userId, sliceId, decision, expected_revision, idempotency_key)
  → { slice: { id, status }, evidence_id?, next_action, source } | conflict | rejected

saveArtifact(...) / approveArtifact(...) / publishArtifact(...)
  → { artifact: { id, version, status, content_sha256 } } | conflict | forbidden | rejected
```

`reviewCoderReport` remains the first delivery write that advances slice, evidence, map, and next action together. `saveArtifact` is the first discovery write. Both are human-session consequential writes.

## 12. Out of v1

Portfolio economics, staffing, expanded playbooks, white-label admin, infrastructure operations, and inventing a productization score.
