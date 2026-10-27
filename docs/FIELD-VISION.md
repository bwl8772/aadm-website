# AADM Field — product vision

Status: working vision for UX and contracts. Not a ship claim.
Companions: `docs/FIELD-CONTRACTS.md` · `docs/FIELD-NAV-DESIGN.md` · aadm-mcp `aadm://doctrine/fde-engagement` and `aadm://templates/fde-outcome-contract`.
Mocks (gitignored): `.tmp/field-home-mock.html` (My Field) · `.tmp/field-engagement-mock.html` (Workbench) · `.tmp/field-review-mock.html` (Artifact Studio mode).

AADM Field is the system of record for the decisions, evidence, customer commitments, artifacts, and delivery plans that turn an ambiguous business problem into an adopted AI solution.

**Field owns the engagement state, not the conversation interface.** Engineers may advance the same engagement from Field, Claude, or Slack. Those clients must not create three competing versions of the plan.

It is not a compliance console, an uptime dashboard, a PSA, a CRM, an engineering IDE, a chat archive, or a monitoring platform.

## 1. Why this product exists

Forward-deployed engineering combines consulting discovery, technical solution delivery, customer collaboration, and business-outcome ownership. Success is whether the customer and engineer can move from a committed business outcome to an accepted, usable solution without losing the plan, evidence, decisions, or accountability along the way.

**UX principle:** one click from priority to execution. One shared engagement record. Multiple specialist agents. Multiple external clients. No duplicate work.

**Product principle**

- **My Field** tells the engineer where to act.
- **Engagement Workbench** is where they act with the right specialist.
- **Artifact Studio** (a workbench mode, not a third app) is where a deliverable is reviewed, approved, and published.
- The delivery map and artifact versions record what changed because they acted.

## 2. Architecture: clients on one record

```
AADM Field          Claude                 Slack
Skinny web client   Connected client       Workflow client
        \                |                    /
         \               |                   /
          AADM API + MCP tools
          Common actions, permissions, engagement context
                         |
          Canonical engagement system
          Requirements · Decisions · Tasks · Versions
          Artifacts · Evidence · Approvals · Events
```

Chat history is **not** the canonical database. The portable state is the engagement record, artifact versions, activity, and decisions. Native conversation threads do not have to sync across platforms.

**Open in Claude** and **Share in Slack** must carry the same `engagement_id`, permissions, and artifact references. They must never silently create a second source of truth.

Customer sign-off, requirement changes, and publishing customer-facing deliverables are permissioned, explicit approval writes (CAP-03, ARCH-13, ARCH-14). An agent saying the work is complete does not publish.

The MCP remains a read-only standard-context overlay. Field (and later aadm-backend) is the host that stores the record. FDE is a role inside a governed engagement, not a fourth AADM persona.

## 3. Three models that must not be collapsed

| Model | Question | Shape | Where |
|---|---|---|---|
| **Engagement stages** | May we proceed, or must we stop and transfer? | Decidability → Contract → Fenced build → Calibration → Transfer | MCP `aadm://doctrine/fde-engagement` |
| **Concurrent lenses** | What is true right now, on five dimensions? | Strategy, Plan, Readiness, Adopt, Governance | Context bar on the workbench |
| **Delivery journey** | Where is the active slice? | Use case → Cornerstone → Handoff → Batches → prompts → Delivery → Report check | Workbench + delivery-plan artifact |

Do not label a lens "Current Phase." Do not treat the delivery journey as the engagement lifecycle. Do not replace Navigator / Investigator / Sentinel stage tuples.

## 4. Canonical terms

| Term | Meaning | Not |
|---|---|---|
| **Workspace** | Tenant boundary (INVARIANTS TEN-06, ARCH-01) | A customer engagement |
| **Customer** | The account being served | The workspace |
| **Engagement** | One bounded customer effort. Owns artifacts and decisions | A phase, a slice, or the tenant |
| **Specialist agent** | An engagement-aware responsibility (Discovery, Cornerstone, Evidence, …) | A separate app or a required extra model deploy |
| **Work canvas** | Chat + structured questions + draft previews + decisions | The source of truth |
| **Artifact** | Versioned deliverable: draft → review → approved → signed → published | A chat transcript |
| **Artifact Studio** | Workbench mode that expands one artifact to a full canvas | A third application route |
| **Lens** | One of five concurrent dimensions | A sequential phase |
| **Stage** | One of five MCP engagement stages | A lens or a delivery step |

UI copy says **engagement**. Auth and Clerk membership keep saying **workspace**.

## 5. Two screens, one studio mode

Eliminate the engagement Overview as a mandatory stop. Its situational awareness lives in a compact **context bar** (and an optional Engagement Brief panel) on the workbench.

| Surface | Route | Job |
|---|---|---|
| **My Field** | `/field/main` | Priorities across every engagement |
| **Engagement Workbench** | `/field/main/e/{engagementId}` | Agents + canvas + artifacts |
| **Artifact Studio** | same route, `?artifact={id}` | Expanded review/edit of one artifact |

### Screen 1 — My Field

Answers: what's next, what's waiting on me, what's waiting on the customer, where should I focus.

Keep from the original dashboard: Continue, Waiting on you, Waiting on the customer, Engagements, outcome/baseline/target, critical path, drift reason, next milestone. Drop infrastructure metrics and decorative analytics.

Take from Habot-style task boards: clean action rows, named owners, filters (me / customer / all), due or waiting-since, one quick action per row. Do not add generic “total tasks” administration.

Hierarchy:

1. Continue the most consequential work (one primary).
2. Triage other actions as ranked rows.
3. Review engagement status (counts, not percentages).

Clicking a row opens the workbench with the matching specialist selected and the related artifact loaded. Never park the engineer on an overview first.

### Screen 3 — Engagement Workbench

Enables: work with specialist agents, decide, generate and review artifacts, advance the engagement.

**Context bar** (always visible):

- Customer / engagement
- Outcome (baseline → target)
- Blocker count
- Delivery position (`3 of 5 slices`)
- Next milestone
- Waiting on
- Five lens chips (open detail; do not require another page)

**Three columns**

| Left — Agents | Center — Work canvas | Right — Artifacts |
|---|---|---|
| Persistent specialists. Same approved customer context. No private source of truth per agent. | Ask, review, decide, create. Chat plus structured questions, draft previews, evidence, approvals. | Versioned deliverables. Draft / review / approved / signed / published. Owner and history. |

A narrow artifact list is for finding. Opening an artifact enters Artifact Studio: large canvas, same agent still available, same engagement identity. Close the artifact and return to the canvas where the engineer left it.

### What Screen 2 becomes

Not a route. An **Engagement Brief** panel or tab inside the workbench: promised → planned → delivered → accepted → changed, named acceptors, lens detail. Useful. Never a gate.

## 6. Specialist agents

Responsibilities, not eight applications and not necessarily eight independently deployed models.

| Agent | Canvas work | Artifact it authors |
|---|---|---|
| Business Discovery | Workflow, unresolved questions, discovery brief | Discovery brief |
| Technical Discovery | Data, access, constraints | Technical assessment |
| Outcome Architect | Measurable outcome, baseline, target | Outcome definition |
| Solution Architect | Architecture trade-offs | Architecture decision |
| Cornerstone | Requirements validation | Signed Cornerstone |
| Delivery Planner | Batches and slices | Delivery plan |
| Evidence Reviewer | Coder-report checks vs signed requirements | Acceptance evidence |
| Adoption Lead | Customer readiness, transfer | Adoption package |

Switching agents does not require re-explaining the customer problem. Each agent receives authorized context: approved outcomes, requirements, outstanding decisions, relevant artifacts.

Example: the FDE opens Acme Health → Intake modernization, selects Business Discovery, and asks it to turn workshop notes into a brief. The agent proposes a structured draft. The engineer corrects it and **saves Discovery Brief v0.3**. That version appears on the right, linked to sources. Outcome Architect later uses the approved brief. The engineer keeps ownership of customer commitments and final approvals.

Conversation creates lasting engagement knowledge. It does not replace the record.

## 7. Distinguishing write: plan versus actual

Still the product's core delivery loop. Evidence Reviewer + Artifact Studio, not a fourth screen.

| Decision | Writes |
|---|---|
| **Accept report** | Evidence artifact; slice accepted; map advances; next action named |
| **Request rework** | Corrective action against the same requirement |
| **Change plan** | Controlled decision; new Cornerstone sign-off if a signed commitment changes |

One accept must not require six disconnected updates. The studio shows the exact stored version and hash (ARCH-14).

## 8. Five concurrent lenses

On the context bar, not as "Current Phase."

| Lens | Question |
|---|---|
| Strategy | Valuable business problem? |
| Plan | Delivery scoped and sequenced? |
| Readiness | **Customer adoption readiness** (data, people, process, support — not infra ops) |
| Adopt | Will users change how they work? |
| Governance | Controls, decisions, named acceptors, artifact visibility? |

States: `on_track` · `in_progress` · `needs_action` · `needs_decision` · `blocked` · `not_started`. Never a bare percentage.

## 9. Three rules

1. **Never navigate through an overview to perform work.** "Review coder report" on My Field opens the workbench with Evidence Reviewer selected, that report loaded, and C-04 available.
2. **Artifacts are the persistent work product — not chat threads.** Conversation drafts. The engineer explicitly saves, approves, or publishes. Authorized users see that version in any client.
3. **The engagement context follows the engineer** across agents and across Field, Claude, and Slack, subject to each client's integration.

## 10. Structure and visibility

```
Firm / portfolio
  Customer
    Engagement
      Specialist work (same context)
      Versioned artifacts
      Requirements, evidence, drift, decisions
      Customer commitments, pilots, adoption
```

Internal by default: coder reports, internal assessments, commercial notes. Customer-visible only when explicitly shared.

## 11. What we build first

| Route | Job |
|---|---|
| **My Field** | Prioritized work and customer dependencies |
| **Workbench** | Agents, canvas, artifact list, context bar, brief panel |
| **Studio mode** | Expand one artifact; accept / rework / change plan; approve; publish |

Sign-in and plan entitlement from `docs/FIELD-NAV-DESIGN.md` remain the entry into My Field.

Later: portfolio economics, staffing, expanded playbooks, white-label admin.

## 12. Binding to AADM contracts

| Field concept | Contract |
|---|---|
| Outcome, baseline, target, stop, named acceptors | `aadm://templates/fde-outcome-contract` |
| Stages, gates, transfer | `aadm://doctrine/fde-engagement` |
| Engagement record, agents, artifacts, clients | `docs/FIELD-CONTRACTS.md` |
| Website never invents domain truth | `docs/INVARIANTS.md` BACK-01, ARCH-15 |
| Sign / accept / publish only in a signed-in human session | CAP-03, ARCH-13, ARCH-14 |

Echoing MCP recon artifacts is not a ship claim. A happy-path demo does not mean ownership transferred. An agent-complete message is not a published artifact.
