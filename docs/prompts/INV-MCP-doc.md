# Architecture invariants

Source: Brian's invariants (Oct 25, 2026), worded in AADM's own terms (PRD D4: the workspace is the tenant; D30: `aadm-core` saves nothing and `aadm-backend` owns the plans API and database). Tenant, CQRS and transaction rules live in [ADR 005](adr/005-plans-api-data-invariants.md); they are referenced here, not restated.
Scope: core mode saves nothing (FIX-27), so data, tenancy and authorization rules apply to backend mode. Brian's calls of Oct 25, 2026 (7:54 PM ET) are included: result codes (TEN-07), the N-1 contract window (ARCH-21), no default workspace (IDN-05), and "chunk" meaning a document chunk (ARCH-20).

## Principles
- **BACK-01.** The backend is authoritative for actor identity, tenant context, membership, authorization, workflow and domain state, external side effects, approvals, audit events, AI execution permissions, idempotency, integration policies and result semantics. Clients may render, request, cache, optimistically display or disable controls; they never invent domain truth. `aadm-core` verifies credentials and runs the plan pre-check; `aadm-backend` re-checks every call.
- **DEPLOY-01.** Client and backend are separable deployment units, each with its own build, pipeline, runtime config, health, release identity, compatibility rules and rollback. Nothing relies on atomic deploys. Core and backend share one image as two services with separate config and health; rollback is `AADM_BACKEND_URL` unset.
- **CONTRACT-01.** Define contracts (identity, tenant, API, error and result, artifact, evidence, approval, run state, event vocabulary, tool permission) before clients, repositories, services, agents or screens.
- **MODEL-01.** Output from an LLM or agent is external input: validate it, constrain it, map it into domain types, check it against permissions and allowed state transitions, and never let it decide authorization. AADM makes no model calls; this covers coder reports and agent tool calls entering AADM.

## Architecture invariants
- ARCH-01 The client never establishes tenant authority (ADR 005 TEN-02).
- ARCH-02 Every tenant-scoped object belongs to exactly one workspace. Firm-layer tables carry `firm_id` and reach workspaces only through the firm roll-up.
- ARCH-03 Tenant isolation is enforced by backend and database controls (TEN-01, TEN-03).
- ARCH-04 Privileged backend credentials never reach the client.
- ARCH-05 Routes and controllers contain no domain business logic (CQRS-03).
- ARCH-06 Data-access components contain no cross-domain business logic (CQRS-01, CQRS-02, TX-04).
- ARCH-07 Integrations do not mutate domain state on their own; webhooks write only through the backend's command path (CQRS-04).
- ARCH-08 Retryable writes are idempotent (`idempotency_key`, `expected_revision`).
- ARCH-09 Workflow and agent state is persisted.
- ARCH-10 Agent outputs become typed, durable artifacts.
- ARCH-11 Model output is always untrusted input (MODEL-01).
- ARCH-12 Consequential artifacts keep their provenance.
- ARCH-13 Consequential external writes need explicit authorization.
- ARCH-14 Human approvals bind to a specific artifact version or content hash.
- ARCH-16 AI systems never decide their own permissions.
- ARCH-17 Every stored judgment records `judged_by` (tool, tool version, commit) plus the policy revision and Standard version it used.
- ARCH-18 Privileged actions are auditable.
- ARCH-19 First-class domain objects have stable identifiers.
- ARCH-20 One vocabulary across database, API, workflow, agent and UI. "Chunk" means a document chunk; a group of slices in a delivery map is a "batch".
- ARCH-21 Client and backend releases stay compatible across an explicit contract window: the backend serves the current and the previous API version (N-1), and each service reports its API version and release in `/health`.
- ARCH-22 Schema changes use a controlled migration path.
- ARCH-23 Production state is never repaired through undocumented ad hoc changes.
- ARCH-24 External side effects happen only in backend services.
- ARCH-25 Every terminal failure is distinguishable from empty, unavailable, unauthorized, indeterminate or rejected.

## Identity
- IDN-01 Every first-class object has an internal ID, a scope (workspace or firm), external IDs as references only, version identity and a list of immutable fields. Never identity: filenames, URLs, issue keys, emails, usernames, storage paths, display names.
- IDN-02 A person has an internal `actor_id`; the Clerk or OIDC `(issuer, subject)` is a reference that maps to it.
- IDN-03 Auth account, business profile, workspace membership, session, request actor and effective workspace scope are separate concepts.
- IDN-04 A valid session without a valid app identity fails explicitly. Authentication alone never grants tenant data.
- IDN-05 No implicit default workspace: nothing is created on first sign-in; a user with no membership creates or joins a workspace.

## Tenancy and authorization
- TEN-01 to TEN-04: see ADR 005.
- TEN-05 Access is membership-based: per request the backend resolves actor, workspace, current membership and role at the server boundary, independent of any client.
- TEN-06 Workspace scope is validated at the server boundary.
- TEN-07 Result codes: `unauthenticated` (no valid credential); `not_found` (unknown workspace, or the caller is not a member; never reveal it exists); `forbidden` (a member whose role does not allow the action); `entitlement_required` (the plan lacks the feature or the tool's plan tag); `storage_unavailable` (backend down); `conflict` (stale revision); `rejected` (payload refused); `indeterminate` (outcome unknown).
- AUTHZ-01 Permission has four separate parts, all required: plan entitlement plus the tool's plan tag; workspace role; credential kind and agent capability; workflow gate.
- AUTHZ-02 The effective permission is the intersection of all of them.
- AUTHZ-03 Writes and external side effects are checked by backend policy right before they run; membership is read uncached.
