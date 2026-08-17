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
| API key (`ak_…`) | `aadm.io/member` → **API keys** (Clerk) + bearer snippets above the profile card |
| OAuth Client ID (all members) | `aadm.io/member/mcp-oauth` → **Connectors OAuth** (`UserProfile.Page`, Clerk Astro custom page) |
| MCP server URL | Public on `aadm.io/mcp` |

---

## `@clerk/astro` configuration (operators)

| Variable | Purpose |
|----------|---------|
| `PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Session + protected `/member` |
| `PUBLIC_CLERK_SIGN_IN_URL` | `https://accounts.aadm.io/sign-in` |
| `PUBLIC_CLERK_SIGN_UP_URL` | `https://accounts.aadm.io/sign-up` |
| `PUBLIC_CLERK_AUTHORIZED_PARTIES` | `https://aadm.io`, `https://www.aadm.io` |
| `PUBLIC_CLERK_IS_SATELLITE` | **`false`** for this site. `accounts.aadm.io` is Account Portal on **primary** `aadm.io` (same registrable domain — shared cookies). Only set `true` for a truly separate satellite hostname. |
| `PUBLIC_CLERK_DOMAIN` | Only when satellite is actually enabled |
| `PUBLIC_CLERK_PROXY_URL` | **Leave unset** unless using a path FAPI proxy. **Do not** set to bare `https://clerk.aadm.io` |
| `CLERK_OAUTH_CLIENT_ID` | Member MCP OAuth tab only (runtime `process.env` on Railway) |
| Member area path | Fixed at `/member` — must match `src/pages/member/` |

Credential sign-in links use `redirect_url=https://aadm.io/member` (no `__clerk_synced` when satellite is off).

**Clerk Dashboard:** primary domain **`aadm.io`** · Account Portal on `accounts.aadm.io` · CNAME `clerk.aadm.io` → Frontend API (gray cloud) · API keys enabled · OAuth app for MCP. Do **not** mark `aadm.io` as a satellite of itself.

**Broken URL `https://v1/client/sync` / missing `link_domain`:** usually from enabling satellite mode on the primary domain. Keep `PUBLIC_CLERK_IS_SATELLITE=false`.

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

`accounts.aadm.io` and `aadm.io` share the **same** registrable domain. Clerk production cookies are scoped for that apex — you do **not** need satellite mode.

If you still see a loop:

1. **Railway** — `PUBLIC_CLERK_IS_SATELLITE=false` (or unset), unset `PUBLIC_CLERK_PROXY_URL` / `PUBLIC_CLERK_DOMAIN` · rebuild  
2. **DNS** — `accounts.aadm.io` and `clerk.aadm.io` CNAMEs verified (gray cloud)  
3. **Authorized parties** — include `https://aadm.io` and `https://www.aadm.io`  
4. Confirm Dashboard **Domains** lists `aadm.io` as **primary** (not a satellite)

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
