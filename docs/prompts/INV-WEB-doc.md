# Invariants for aadm-website

Source: Brian's invariants (Oct 25, 2026). The full set, with the same IDs, is `docs/ARCHITECTURE_INVARIANTS.md` in aadm-mcp; this file keeps only the rules that bind the website. Not decided yet, so not here: shared result codes and the contract-window version.

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
- ARCH-20 Use the backend's names for things; "chunk" means a delivery-map chunk.
- ARCH-21 Website and backend releases stay compatible across an explicitly supported contract window.
- ARCH-23 Production state is never repaired through undocumented ad hoc changes.
- ARCH-24 External side effects happen only in backend services, never from the website.
- ARCH-25 Every failure screen is distinguishable from empty, unavailable, unauthorized, indeterminate or rejected.
- IDN-03 Clerk account, profile, workspace membership, session and current workspace are separate concepts in code.
- TEN-06 Workspace scope is validated on the server; the website's own checks are convenience only.
- AUTHZ-04 Button visibility is not authorization.
