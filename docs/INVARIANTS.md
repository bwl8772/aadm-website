# Invariants for aadm-website

Source: Brian's invariants (Oct 25, 2026). The full set, with the same IDs, is `docs/ARCHITECTURE_INVARIANTS.md` in aadm-mcp; this file keeps only the rules that bind the website. Brian's calls of Oct 25, 2026 are included: result codes (TEN-07) and the N-1 contract window (ARCH-21).

## Principles
- **BACK-01.** The backend is authoritative for actor identity, tenant context, membership, authorization, workflow and domain state, side effects, approvals, audit, idempotency and result semantics. The website may render, request, cache, optimistically display or disable controls. It never invents domain truth.
- **DEPLOY-01.** The website and the backend deploy separately, each with its own build, config, health, release identity and rollback. Nothing assumes they ship together.
- **CONTRACT-01.** Build screens and API clients against a defined contract (identity, tenant, API, error and result, approval, run state), not against guessed response shapes.

## Rules
- ARCH-01 The client never establishes tenant authority: no workspace or user ID from the URL, form or local storage is trusted by itself; the server derives it from the Clerk session.
- ARCH-04 No privileged backend credential (M2M secret, service key, Clerk secret key) reaches the browser bundle.
- ARCH-05 Astro pages and server endpoints hold no domain business logic; they call the backend.
- ARCH-08 Retried submits are idempotent; send the key or revision the backend asks for.
- ARCH-13 Consequential external writes need explicit user authorization in the UI and on the backend.
- ARCH-14 An approval screen shows and sends the exact version or hash being approved.
- ARCH-15 The UI renders backend state; it never infers state from missing data or timestamps.
- ARCH-20 Use the backend's names for things. "Chunk" means a document chunk; a group of slices in a delivery map is a "batch".
- ARCH-21 Website and backend releases stay compatible across an explicit contract window: the backend serves the current and the previous API version (N-1), and the website reads the API version from the backend's `/health`.
- ARCH-23 Production state is never repaired through undocumented ad hoc changes.
- ARCH-24 External side effects happen only in backend services, never from the website.
- ARCH-25 Every failure screen is distinguishable from empty, unavailable, unauthorized, indeterminate or rejected.
- IDN-03 Clerk account, profile, workspace membership, session and current workspace are separate concepts in code.
- TEN-06 Workspace scope is validated on the server; the website's own checks are convenience only.
- TEN-07 Show each backend result differently: `unauthenticated` (sign in), `not_found` (no such workspace for you; never hint it exists), `forbidden` (your role can't do this), `entitlement_required` (your plan doesn't include this; show the upgrade path), `storage_unavailable` (try again later), `conflict` (someone changed it; reload), `rejected` (input refused), `indeterminate` (outcome unknown; check before retrying).
- AUTHZ-04 Button visibility is not authorization.
