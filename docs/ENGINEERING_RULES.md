# Engineering rules — aadm-website

Local rules for this repository. The website renders. It does not invent domain truth. Pass or fail stays in this repo's tests and CI.

Canonical IDs: [INVARIANTS.md](INVARIANTS.md). Auth host policy: [CLERK-AUTH.md](CLERK-AUTH.md). Smell ids from an external catalog map to the headings below.

## Backend is authoritative

BACK-01. Actor identity, tenant, membership, authorization, workflow, domain state, side effects, approvals, and result codes come from `aadm-backend` (and Clerk for session). The website may render, request, cache, or disable. It never invents success, a workspace, or a version.

## No domain logic in the shell

ARCH-05. Astro pages, server endpoints, and the Field React island hold no domain business logic. They call the backend and render parsed replies. Status, verdict, color, and lint are never computed in the shell.

## Session, not the URL, is tenant authority

ARCH-01, TEN-06, IDN-03. No workspace or user ID from the URL, form, or local storage is trusted by itself. The server derives scope from the Clerk session. Button visibility is not authorization (AUTHZ-04).

## Secrets stay off the browser

ARCH-04, ENV-06. No Clerk secret, M2M token, or backend credential in the client bundle. Only `PUBLIC_*` reaches the browser. The Clerk session cookie is the only browser credential (XO-04).

## One login, one deploy

Sign-in and sign-up are Clerk Account Portal on `accounts.aadm.io`. Do not embed `<SignIn>` / `<SignUp>` on `aadm.io`. Do not repoint that CNAME. Satellite is off. Member credentials live at `/member`. Field is `/field/main` (Astro gate + React island, same origin, same cookies). Marketing has no credential values. See CLERK-AUTH.md.

## IDs come from the server

IDN-06, ART-02. Every workspace, artifact, version, Decision, and request ID is a server-made UUID from a backend reply. The website never mints one, never derives one from a slug or display name, and never shows one as a name. After a write, use `saved[]` for later refs and `expected_version`.

## Show each result family

ARCH-25, TEN-07, RES-04, RES-05. Empty, unavailable, unauthorized, indeterminate, and rejected are different screens. Branch on `code` / `sub_code` / `retryable`, not message text. Show `request_id` on errors. Parse every backend reply with a schema.

## Field is not a dashboard

FLD-01 to FLD-04, OBS-04. Field helps a person decide the next move or get it done. Proof sits one click below the answer. No compliance, uptime, or health dashboard as a customer screen. UI noun is **engagement**; auth noun stays **workspace**.

## Tests name the failure

`npm run test:clerk-smoke` must fail if unsigned `/member` leaks credentials or skips the Account Portal. `scripts/field-home-smoke.mjs` must fail if unsigned `/field/main` shows Field content or marketing chrome, or if signed-in Field is missing the Field header.
