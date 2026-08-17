# Clerk authentication — canonical policy

**Read this before touching sign-in, sign-up, account, MCP credentials, or auth links.**

## Non‑negotiable rules

1. **Sign-in and sign-up are Clerk Account Portal** on **`https://accounts.aadm.io`** (DNS CNAME to Clerk). Do **not** remove or repoint the CNAME.

2. **Member area (credentials UI) is on `aadm.io/member`** — protected route with embedded Clerk `<UserProfile>` + custom **MCP OAuth** tab. API keys and OAuth Client ID live here, not on public `/mcp`.

3. **There is exactly one login flow:** **`https://accounts.aadm.io/sign-in`** and **`/sign-up`**. After auth, subscribers use **`https://aadm.io/member`**.

4. **`https://aadm.io` marketing** — `/`, `/mcp`, `/health`, etc. Public setup copy only; no credential values on `/mcp`.

5. Middleware redirects `/sign-in`, `/sign-up`, `/user`, `/account/*` on `aadm.io` → `accounts.aadm.io`. **`/member` is protected** on `aadm.io` (not redirected).

6. **One Astro deploy** on Railway for `aadm.io`. No second app. **`accounts.aadm.io` is not served by Astro.**

---

## What lives where

| Host | Who serves it | Purpose |
|------|----------------|---------|
| **`accounts.aadm.io`** | **Clerk** (CNAME — keep it) | Sign-in, sign-up only |
| **`aadm.io/member`** | **Astro + embedded UserProfile** | API keys, profile, **MCP OAuth client ID** |
| **`aadm.io`** | **Astro** | Marketing + MCP setup (no secrets) |
| **`mcp.aadm.io`** | **aadm-mcp** | MCP JSON-RPC |

---

## Subscriber credentials

| Need | Where |
|------|--------|
| Sign in / sign up | `accounts.aadm.io` |
| API key (`ak_…`) | `aadm.io/member` → **API keys** tab (per-user; created in Clerk) |
| OAuth Client ID (all members) | `aadm.io/member/mcp-oauth` → **Connectors OAuth** tab — one shared `CLERK_OAUTH_CLIENT_ID` |
| MCP server URL | Public on `aadm.io/mcp` |

---

## `@clerk/astro` configuration (operators)

| Variable | Purpose |
|----------|---------|
| `PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Session + protected `/member` |
| `PUBLIC_CLERK_SIGN_IN_URL` | `https://accounts.aadm.io/sign-in` |
| `PUBLIC_CLERK_SIGN_UP_URL` | `https://accounts.aadm.io/sign-up` |
| `PUBLIC_CLERK_AUTHORIZED_PARTIES` | `https://aadm.io`, `https://www.aadm.io` |
| `PUBLIC_CLERK_IS_SATELLITE` | `true` (optional — auto-detected when sign-in host ≠ `aadm.io`) |
| `PUBLIC_CLERK_DOMAIN` | **`aadm.io`** (satellite app host — default when satellite and no path proxy) |
| `PUBLIC_CLERK_PROXY_URL` | **Leave unset** for DNS FAPI. Only set for a **path** proxy (e.g. `https://aadm.io/__clerk`). **Do not** set to bare `https://clerk.aadm.io` — clerk-js builds `//v1/client/sync` → host `v1` |
| `CLERK_OAUTH_CLIENT_ID` | Member MCP OAuth tab only (runtime `process.env` on Railway) |
| Member area path | Fixed at `/member` — must match `src/pages/member/` |

Credential sign-in links use `redirect_url=https://aadm.io/member` with `__clerk_synced=false` for satellite handshake.

**Clerk Dashboard:** Account Portal on `accounts.aadm.io` · **Domains → Satellites → `aadm.io`** with FAPI / proxy URL **`https://clerk.aadm.io`** (Dashboard DNS verification — not the Astro `proxyUrl` option) · CNAME `clerk.aadm.io` → Clerk Frontend API (gray cloud) · API keys enabled · OAuth app for MCP.

**Broken URL `https://v1/client/sync`:** caused by passing bare-origin `proxyUrl` into clerk-js. Fix: use `domain: aadm.io` + Astro middleware 302 of `/v1/*` → `https://clerk.aadm.io/v1/*`.

---

## Implementation

| File | Purpose |
|------|---------|
| `src/pages/member/index.astro` + `src/pages/member/[...rest].astro` | Embedded `<UserProfile>` + MCP OAuth tab (via `MemberPageGate`) |
| `src/components/MemberSatelliteSyncPage.astro` | Sync-only shell during satellite handshake (no credentials) |
| `src/lib/routes.ts` | `/member(.*)` protected |
| `src/lib/clerk-portal-urls.ts` | Portal + member URLs |
| `src/middleware.ts` | `clerkMiddleware` + auth path redirects |
| `src/components/SiteHeader.astro` | **Member** → `/member` |

---

## Redirect loop (`accounts.aadm.io` ↔ `aadm.io/member`)

Sign-in on **accounts.aadm.io** and the app on **aadm.io** are different domains. Without **satellite** setup, the session never reaches `aadm.io` and you get an infinite loop:

1. `accounts.aadm.io/sign-in` → user signs in  
2. Redirect to `aadm.io/member` → no session on `aadm.io`  
3. Middleware sends user back to sign-in → repeat  

**Fix (all required):**

1. **Clerk Dashboard → Domains → Satellites → `aadm.io`** — FAPI / proxy URL **`https://clerk.aadm.io`** (status **Verified**)  
2. **DNS `clerk.aadm.io`** — CNAME → `frontend-api.clerk.services` (**gray cloud** / DNS-only)  
3. **DNS `accounts.aadm.io`** — CNAME → `accounts.clerk.services` (**gray cloud**)  
4. **Railway** — `PUBLIC_CLERK_IS_SATELLITE=true`, **`PUBLIC_CLERK_DOMAIN=aadm.io`**, **unset** `PUBLIC_CLERK_PROXY_URL` (or leave it as bare `https://clerk.aadm.io` only as a FAPI-origin hint — the app ignores bare origins for clerk-js `proxyUrl`) · rebuild  
5. **Astro middleware** — 302 `/v1/*` → `https://clerk.aadm.io/v1/*` (satellite sync); sets `satelliteSyncPending` when `__clerk_synced=false` and renders **sync-only shell** until handshake completes. Without the sync guard, SSR loops: accounts → `/member` → sign-in → accounts → …

**Cloudflare (your current DNS is correct):** `accounts` and `clerk` gray-clouded; `aadm.io` proxied to Railway is fine. Zone-level **Bot Fight** can still interfere — add a skip rule for `accounts.aadm.io` if challenges persist.

---

## Forbidden

- ❌ Repoint `accounts.aadm.io` CNAME to Railway  
- ❌ `<SignIn>` / `<SignUp>` on `aadm.io`  
- ❌ OAuth client ID values on public `/mcp`  
- ❌ Product links to `accounts.aadm.io/user` (use `/member`)  

---

## References

- [Clerk UserProfile (Astro)](https://clerk.com/docs/astro/reference/components/user/user-profile)  
- [Custom pages (Astro)](https://clerk.com/docs/astro/guides/customizing-clerk/adding-items/user-profile)  
- [Account Portal overview](https://clerk.com/docs/guides/account-portal/overview)  
