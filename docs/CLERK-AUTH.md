# Clerk authentication — canonical policy

**Read this before touching sign-in, sign-up, account, MCP credentials, or auth links.**

## Non‑negotiable rules

1. **The entire login and account area is managed by Clerk** on **`https://accounts.aadm.io`** — Clerk **hosted Account Portal** (DNS CNAME to Clerk). Sign-in, sign-up, profile, security, and API keys are **Clerk UI on Clerk’s servers**. AADM does not hand-roll auth, does not host login pages, and does **not** remove or replace the Clerk CNAME.

2. **There is exactly one login area:** **`https://accounts.aadm.io`**
   - Sign in: `https://accounts.aadm.io/sign-in`
   - Sign up: `https://accounts.aadm.io/sign-up`
   - Account: `https://accounts.aadm.io/user` (Profile, Security, **API keys**, **your OAuth Client ID**)

3. **`https://aadm.io` is marketing and MCP setup docs only** — `/`, `/mcp`, `/health`, etc.  
   **Do not** publish subscriber credentials (API keys, OAuth Client ID values) on public pages.  
   **Do not** add login, sign-up, or account/profile pages on `aadm.io`.  
   Middleware redirects `/sign-in`, `/sign-up`, `/user`, `/account/*` on `aadm.io` → `accounts.aadm.io`.

4. **Do not create a new app.** One Astro deploy on Railway for **`aadm.io` only**. No Next.js accounts app, no second Railway service, no `/dashboard/*`. **`accounts.aadm.io` is not served by this Astro app** — it is Clerk’s hosted Account Portal.

5. **Public `/mcp` copy** uses **“your client ID”** and sends subscribers to **`accounts.aadm.io`** (sign-in required). It does **not** display the actual Client ID value.

---

## What lives where

| Host | Who serves it | Purpose |
|------|----------------|---------|
| **`accounts.aadm.io`** | **Clerk** (CNAME — keep it) | Login, account, API keys, **your OAuth Client ID** |
| **`aadm.io`** | **This Astro app** (Railway) | Marketing + MCP setup instructions (no credential values) |
| **`mcp.aadm.io`** | **aadm-mcp** repo | MCP JSON-RPC; verifies Clerk tokens |

---

## Subscriber credentials

| Need | Where |
|------|--------|
| Sign in / sign up | `accounts.aadm.io` (Clerk) |
| API key (`ak_…`) for Cursor / curl | `accounts.aadm.io/user` → **API keys** |
| OAuth Client ID for Claude | `accounts.aadm.io/user` — **your client ID** (sign-in required) |
| MCP server URL | Public on `aadm.io/mcp` and `mcp.aadm.io/mcp` |

---

## `@clerk/astro` configuration (operators)

Set on **Railway** (and local `.env`):

| Variable | Purpose |
|----------|---------|
| `PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Session + `Show when="signed-in"` on marketing pages |
| `PUBLIC_CLERK_SIGN_IN_URL` | **`https://accounts.aadm.io/sign-in`** — wired into `clerk()` + `clerkMiddleware()` |
| `PUBLIC_CLERK_SIGN_UP_URL` | **`https://accounts.aadm.io/sign-up`** |
| `PUBLIC_CLERK_USER_PROFILE_URL` | **`https://accounts.aadm.io/user`** — Account / API keys links |
| `PUBLIC_CLERK_AUTHORIZED_PARTIES` | **`https://aadm.io`** (and `www` if used) — required for cross-origin session |

Marketing links append `redirect_url` back to the current `aadm.io` path after Account Portal sign-in ([Clerk direct links](https://clerk.com/docs/guides/account-portal/direct-links)).

**Clerk Dashboard:** Account Portal enabled · custom domain `accounts.aadm.io` · API keys enabled · OAuth app for MCP.

---

## DNS / Clerk Dashboard (operators)

- **`accounts.aadm.io`** → **Clerk Account Portal CNAME** (unchanged — do not point at Railway).
- **`aadm.io`** → Railway (this repo).
- Clerk Dashboard → **Account Portal** enabled; paths on `accounts.aadm.io`.
- Enable **API keys** in Clerk.
- `PUBLIC_CLERK_AUTHORIZED_PARTIES` includes `https://aadm.io` (and `https://accounts.aadm.io` if Clerk docs require it for redirects).

---

## Implementation in this repo

| File | Purpose |
|------|---------|
| `src/lib/clerk-portal-urls.ts` | Account Portal URLs + `redirect_url` + `getClerkIntegrationOptions()` |
| `astro.config.mjs` | `clerk({ signInUrl, signUpUrl, authorizedParties })` |
| `src/middleware.ts` | `clerkMiddleware(..., clerkOptions)` + marketing-host auth redirect |
| `src/pages/mcp.astro` | Public setup copy — **“your client ID”** → accounts (no value on page) |
| `src/components/SiteHeader.astro` | Sign-in/up → Clerk; signed-in → `accounts.aadm.io/user` |

**Do not add** embedded `<UserProfile>` on `aadm.io` or publish credential values on public pages.

---

## Forbidden (agents and maintainers)

- ❌ Remove Clerk CNAME or repoint `accounts.aadm.io` to Railway  
- ❌ New accounts app / Next.js / `/dashboard/*`  
- ❌ Login or account UI on **`aadm.io`** (redirect to Clerk instead)  
- ❌ Display OAuth Client ID **values** on public `aadm.io/mcp` (copy-only card without sign-in)  

---

## References

- [Clerk Account Portal overview](https://clerk.com/docs/guides/account-portal/overview)  
- [Clerk API keys](https://clerk.com/docs/guides/development/machine-auth/api-keys)  
- [AADM MCP integration](../aadm-mcp/docs/INTEGRATION.md) (cross-repo)  
