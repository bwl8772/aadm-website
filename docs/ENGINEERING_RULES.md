# Engineering rules — aadm-website

Local rules for this repository. The website renders. It does not invent domain truth. Pass or fail stays in this repo's tests and CI.

Canonical IDs: [INVARIANTS.md](INVARIANTS.md). Auth host policy: [CLERK-AUTH.md](CLERK-AUTH.md). Smell ids from an external catalog map to the headings below.

## Backend is authoritative

BACK-01. Actor identity, tenant, membership, authorization, workflow, domain state, side effects, approvals, and result codes come from `aadm-backend` (and Clerk for session). The website may render, request, cache, or disable. It never invents success, a workspace, or a version.

## No domain logic in the shell

ARCH-05. Astro pages, server endpoints, and the Field React island hold no domain business logic. They call the backend and render parsed replies. The shell may map a backend enum to a theme token. It never derives the enum (status, lateness, health, progress, alert) from other fields.

## One backend door

ARCH-24, CTX-05, API-06, OPS-08, XO-04. The browser never calls `aadm-backend`. React calls same-origin Astro server endpoints; only they call the backend. Every backend call carries `request_id`, `api_version`, and the release ID, and has a timeout. Forms cap payload size. External side effects happen only in the backend.

## Deploy apart

DEPLOY-01, ARCH-21, OPS-05. Website and backend each have their own build, config, health, release ID, and rollback. The backend serves API N and N-1; the website reads `api_version` from `/health`. A release that needs both at once is marked coordinated in its slice.

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

## Schemas are the types

RES-05, CONTRACT-01, API-02. Field read models are zod schemas in `src/components/field/field-types.ts`; TypeScript types are `z.infer` of them. A page parses its model on the server before React renders it. A failed parse is a visible error, never an empty state or "not found".

## Example data is strippable

Example data lives only in `src/components/field/fixtures/*.fixture.ts` (default export). Only `src/lib/field-fixtures.ts` loads it, by glob, when `PUBLIC_FIELD_FIXTURES=1`; pages call `fieldFixture(name)` and parse the result. No other file imports a fixture. Components take data through props and hold no example values. Deleting `fixtures/` needs no code change and leaves a passing build with empty states.

## Components and theme

Field UI is built from shared components (`AccountMenu`, `home/Pill`, per-screen parts under `home/` and `workbench/`); a screen composes them and adds no one-off copies. Color comes only from tokens in `src/styles/theme.css` — no raw hex — and every screen works in light and dark. `npm run test:theme-contrast` guards light-theme contrast.

## Field is not a dashboard

FLD-01 to FLD-04, OBS-04. Field helps a person decide the next move or get it done. Proof sits one click below the answer. No compliance, uptime, or health dashboard as a customer screen. UI noun is **engagement**; auth noun stays **workspace**.

## Tests name the failure

`npm run test:clerk-smoke` must fail if unsigned `/member` leaks credentials or skips the Account Portal. `npm run test:field-home` must fail if unsigned `/field/main` shows Field content or marketing chrome, or if signed-in Field is missing the Field header.

Hand-off checks use `scripts/lib/auth-gate.mjs` only: one HTTP request, accepts a 302 to the Account Portal or the sync shell, and asserts `redirect_url` returns to the same path. Screen checks use `[data-field-screen]` markers, never heading copy. `npm run test:smoke-guard` fails on the old patterns.
