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
| API key (`ak_…`) | `aadm.io/member` → **API keys** tab |
| OAuth Client ID | `aadm.io/member/mcp-oauth` |
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
| `PUBLIC_CLERK_DOMAIN` | `aadm.io` (satellite app domain) |
| `PUBLIC_CLERK_PROXY_URL` | Optional — `https://clerk.aadm.io` if TLS/proxy breaks handshake |
| `CLERK_OAUTH_CLIENT_ID` | Member MCP OAuth tab only |
| `PUBLIC_MEMBER_AREA_PATH` | Optional; default `/member` |

Credential sign-in links use `redirect_url=https://aadm.io/member` with `__clerk_synced=false` for satellite handshake.

**Clerk Dashboard:** Account Portal on `accounts.aadm.io` · **add `aadm.io` as satellite domain** (Domains → Satellites) · add CNAME `clerk.aadm.io` → Clerk Frontend API · API keys enabled · OAuth app for MCP.

---

## Implementation

| File | Purpose |
|------|---------|
| `src/pages/member/[[...rest]].astro` | Embedded `<UserProfile>` + MCP OAuth tab |
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

1. **Clerk Dashboard → Domains → Satellites** — add `aadm.io`  
2. **DNS** — CNAME `clerk.aadm.io` → Clerk Frontend API (DNS-only / gray cloud)  
3. **Railway** — set `PUBLIC_CLERK_IS_SATELLITE=true`, `PUBLIC_CLERK_DOMAIN=aadm.io`, rebuild  
4. **accounts.aadm.io** — DNS-only CNAME to Clerk (not Cloudflare orange-cloud proxy)

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
