# Clerk authentication — canonical policy

**Read this before touching sign-in, sign-up, account, MCP credentials, or auth links.**

## Non‑negotiable rules

1. **Sign-in and sign-up are Clerk Account Portal** on **`https://accounts.aadm.io`** (DNS CNAME to Clerk). Do **not** remove or repoint the CNAME.

2. **Member area (credentials UI) is on `aadm.io/member`** — protected route. **Astro owns the top tabs**; Clerk widgets supply API keys / profile / security content only. OAuth Client ID is **Astro SSR** (never a Clerk custom page). Credentials live here, not on public `/mcp`.

3. **There is exactly one login flow:** **`https://accounts.aadm.io/sign-in`** and **`/sign-up`**. After auth, subscribers use **`https://aadm.io/member`** (redirects to `/member/api-keys`).

4. **`https://aadm.io` marketing** — `/`, `/mcp`, `/health`, etc. Public setup copy only; no credential values on `/mcp`.

5. Middleware redirects `/sign-in`, `/sign-up`, `/user`, `/account/*` on `aadm.io` → `accounts.aadm.io`. **`/member` is protected** on `aadm.io` (not redirected to Account Portal).

6. **One Astro deploy** on Railway for `aadm.io`. No second app. **`accounts.aadm.io` is not served by Astro.**

---

## What lives where

| Host | Who serves it | Purpose |
|------|----------------|---------|
| **`accounts.aadm.io`** | **Clerk** (CNAME — keep it) | Sign-in, sign-up only |
| **`aadm.io/member`** | **Astro tabs + Clerk widgets** | API keys, Connectors OAuth (Astro), Profile, Security |
| **`aadm.io/field/main`** | **Astro gate + React Field app** (same deploy, same cookies) | Signed-in Field UI — not public `/field`; member area stays Astro |
| **`aadm.io`** | **Astro** | Marketing + MCP setup (no secrets) |
| **`mcp.aadm.io`** | **aadm-mcp** | MCP JSON-RPC |

---

## Subscriber credentials

| Need | Where |
|------|--------|
| Sign in / sign up | `accounts.aadm.io` |
| API key (`ak_…`) | `aadm.io/member/api-keys` — Astro bearer guide + Clerk `<APIKeys />` |
| OAuth Client ID (all members) | `aadm.io/member/mcp-oauth` — **Astro-only** panel (no `UserProfile.Page` / Link / portal) |
| Profile / Security | `aadm.io/member/account` · `/member/security` — Clerk `<UserProfile>` with **sidenav hidden** |
| MCP server URL | Public on `aadm.io/mcp` |

### Member chrome architecture (do not regress)

- **Astro** [`MemberNavTabs.astro`](../src/components/MemberNavTabs.astro) — horizontal top tabs on **all** viewports (scrollable on small screens).
- **Clerk** mounts only as full-width content under the active tab (`MEMBER_CLERK_CONTENT_ONLY_APPEARANCE` hides Clerk navbar).
- **Hard bans** (blank split-pane regressions):
  - ❌ `UserProfile.Page` custom content
  - ❌ `UserProfile.Link` for OAuth
  - ❌ `innerHTML` / portal / `MutationObserver` into `.cl-pageScrollBox`
  - ❌ Relying on Clerk’s left sidenav for member navigation

---

## `@clerk/astro` configuration (operators)

| Variable | Purpose |
|----------|---------|
| `PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Session + protected `/member`, `/field/main`. **Same instance** (both `_live_` or both `_test_`); `/health` 503s otherwise and the release is held. |
| `PUBLIC_CLERK_SIGN_IN_URL` | `https://accounts.aadm.io/sign-in` |
| `PUBLIC_CLERK_SIGN_UP_URL` | `https://accounts.aadm.io/sign-up` |
| `PUBLIC_CLERK_AUTHORIZED_PARTIES` | `https://aadm.io`, `https://www.aadm.io` |
| `PUBLIC_CLERK_IS_SATELLITE` | **`false`** for this site. `accounts.aadm.io` is Account Portal on **primary** `aadm.io` (same registrable domain — shared cookies). Only set `true` for a truly separate satellite hostname. |
| `PUBLIC_CLERK_DOMAIN` | Only when satellite is actually enabled |
| `PUBLIC_CLERK_PROXY_URL` | **Leave unset** unless using a path FAPI proxy. **Do not** set to bare `https://clerk.aadm.io` |
| `CLERK_OAUTH_CLIENT_ID` | Member MCP OAuth tab only (runtime `process.env` on Railway). Set to the Clerk OAuth app id (e.g. `Stpa0NmMlVg9hU2L`), **not** `*` — `*` is the MCP server's value and shows nothing here. Members normally never need this id: clients identify themselves to Clerk via CIMD and the member just signs in. |
| Member area path | Fixed at `/member` — must match `src/pages/member/` |

Credential sign-in links use `redirect_url=https://aadm.io/member` (no `__clerk_synced` when satellite is off).

**Clerk Dashboard:** primary domain **`aadm.io`** · Account Portal on `accounts.aadm.io` · CNAME `clerk.aadm.io` → Frontend API (gray cloud) · API keys enabled · OAuth app for MCP. Do **not** mark `aadm.io` as a satellite of itself.

**Broken URL `https://v1/client/sync` / missing `link_domain`:** usually from enabling satellite mode on the primary domain. Keep `PUBLIC_CLERK_IS_SATELLITE=false`.

---

## Implementation

| File | Purpose |
|------|---------|
| `src/pages/member/index.astro` + `src/pages/member/[...rest].astro` | Member shell via `MemberPageGate` |
| `src/components/MemberNavTabs.astro` | Top tablist (API keys · Connectors OAuth · Profile · Security) |
| `src/components/MemberUserProfilePage.astro` | Route switch: Astro OAuth / `<APIKeys />` / navbar-hidden `<UserProfile>` |
| `src/lib/member-clerk-appearance.ts` | Hide Clerk sidenav for content-only widgets |
| `src/components/SessionGatePage.astro` | Served instead of private content when the server cannot verify the browser's Clerk cookies: `recover` (clerk-js reconciles once) or `stop` (visible error + request id). No credentials. |
| `src/lib/routes.ts` | `/member(.*)` and `/field/main(.*)` protected |
| `src/lib/clerk-portal-urls.ts` | Portal + member URLs, `/logout` |
| `src/lib/clerk-auth-policy.ts` | `decideUnsigned` table (sign_in / recover / stop) + bounce cookie |
| `src/middleware.ts` | Private routes: unsigned → decision table; `Cache-Control: no-store`; one JSON log line per request; `/member` → `/member/api-keys` |
| `src/lib/clerk-health.ts` + `src/pages/health.ts` | Clerk key presence / instance parity / Backend-API probe; **503 blocks the Railway release** |
| `src/pages/logout.astro` | Same-origin sign-out: server revokes the session, then clerk-js clears the client |
| `src/components/field/SessionWatch.tsx` | Field island: leaves for sign-in when clerk-js reports no user under a server-rendered signed-in page |
| `src/components/SiteHeader.astro` | **Member** → `/member`; **Log out** → `/logout` |

---

## Handshake, recovery and loop stop

The hand-off is: `aadm.io` (Astro SSR) → `accounts.aadm.io` (Clerk Account Portal, Clerk-hosted) → back to `aadm.io/member` or `/field/main` (React islands). Both hosts share the apex cookie (`__session`, `__client_uat`), so **no satellite mode**. What each side does:

| Request to a private route | Server (`src/middleware.ts`) | Browser |
|---|---|---|
| Valid session | Page, `Cache-Control: no-store`, log `ok` | Islands hydrate; `SessionWatch` leaves for sign-in if clerk-js later reports no user |
| Expired token (`__client_uat` newer than `__session`) | `clerkMiddleware` handshake: 307 to the Frontend API, back with a fresh cookie | transparent |
| No Clerk cookies | 302 to `accounts.aadm.io/sign-in?redirect_url=<this page>` | Portal, then back |
| Cookies the server cannot verify (wrong/missing `CLERK_SECRET_KEY`, bad signature, foreign `azp`, handshake gave up) | 200 `SessionGatePage` **recover**, cookie `aadm_auth_bounce=1` (60 s), log `auth_recover` | clerk-js loads once: user present → reload; none → Portal |
| Same, second time inside 60 s | 200 `SessionGatePage` **stop** with the request id, log `auth_unconfirmed` (error) | Visible error, "Sign in again" link. No script, no bounce |

Why the table exists: before Oct 2026 every unsigned reason became a Portal redirect. With cookies the server could not verify, the Portal still saw a live client and bounced straight back — a `aadm.io ↔ accounts.aadm.io` loop with no JS and no log line. That is what an invalid or missing `CLERK_SECRET_KEY` on Railway (Oct 24, 2026) looked like to users.

**Keys.** `/health` returns 503 (`clerk.ok=false`) when a key is missing, pk/sk are from different instances (`pk_live` with `sk_test`), or Clerk's Backend API rejects the secret key. Railway polls `/health` before cutover, so such a release never goes live. **Rotate pk and sk together**, redeploy, then check `/health` shows `secret_key_check: "valid"`.

**Reading the logs.** Each private-route request writes one JSON line: `request_id`, `route`, `code` (`ok` · `unauthenticated` · `auth_recover` · `auth_unconfirmed`), `clerk_reason` (Clerk's auth reason code), `actor_id` (user id, never an email), `latency_ms`, `release`. A user's stop page shows the same `request_id`.

**Sign-out** is a same-origin navigation to `/logout`: the server revokes the session (so the other host's copy dies too), then clerk-js clears the client and goes to the Portal. Plain links, so it works before clerk-js loads.

If you still see a loop after a deploy:

1. `https://aadm.io/health` → `clerk.ok` must be `true`; otherwise fix the Railway keys first  
2. **Railway** — `PUBLIC_CLERK_IS_SATELLITE=false` (or unset), unset `PUBLIC_CLERK_PROXY_URL` / `PUBLIC_CLERK_DOMAIN` · rebuild  
3. **DNS** — `accounts.aadm.io` and `clerk.aadm.io` CNAMEs verified (gray cloud)  
4. **Authorized parties** — include `https://aadm.io` and `https://www.aadm.io`  
5. Confirm Dashboard **Domains** lists `aadm.io` as **primary** (not a satellite)  
6. Find the user's `request_id` in the Railway logs and read `clerk_reason`

**Cloudflare (your current DNS is correct):** `accounts` and `clerk` gray-clouded; `aadm.io` proxied to Railway is fine. Zone-level **Bot Fight** can still interfere — add a skip rule for `accounts.aadm.io` if challenges persist.

**Astro.** `security.allowedDomains` (astro.config.mjs) lists `aadm.io`, `www.aadm.io`, `localhost`, so `Astro.url` is the public origin behind Railway + Cloudflare and `checkOrigin` rejects cross-site form posts.

---

## Forbidden

- ❌ Repoint `accounts.aadm.io` CNAME to Railway  
- ❌ `<SignIn>` / `<SignUp>` on `aadm.io`  
- ❌ OAuth client ID values on public `/mcp`  
- ❌ Product links to `accounts.aadm.io/user` (use `/member`)  
- ❌ Clerk `UserProfile.Page` / `Link` / portal hacks for Connectors OAuth  

---

## References

- [Clerk UserProfile (Astro)](https://clerk.com/docs/astro/reference/components/user/user-profile)  
- [Custom pages (Astro)](https://clerk.com/docs/astro/guides/customizing-clerk/adding-items/user-profile) — **do not** use for AADM OAuth; Astro owns that panel  
- [Account Portal overview](https://clerk.com/docs/guides/account-portal/overview)  
