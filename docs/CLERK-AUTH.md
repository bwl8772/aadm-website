# Clerk authentication — canonical policy

**Read this before touching sign-in, sign-up, account, MCP credentials, or auth links.**

## Non‑negotiable rules

1. **The entire login and account area is managed by Clerk** on **`https://accounts.aadm.io`** — Clerk **hosted Account Portal** (DNS CNAME to Clerk). Sign-in, sign-up, profile, security, and API keys are **Clerk UI on Clerk’s servers**. AADM does not hand-roll auth, does not host login pages, and does **not** remove or replace the Clerk CNAME.

2. **There is exactly one login area:** **`https://accounts.aadm.io`**
   - Sign in: `https://accounts.aadm.io/sign-in`
   - Sign up: `https://accounts.aadm.io/sign-up`
   - Account: `https://accounts.aadm.io/user` (Profile, Security, **API keys**)

3. **`https://aadm.io` is marketing and MCP setup docs only** — `/`, `/mcp`, `/health`, etc.  
   **Do not** add login, sign-up, or account/profile pages on `aadm.io`.  
   Middleware redirects `/sign-in`, `/sign-up`, `/user`, `/account/*` on `aadm.io` → `accounts.aadm.io`.

4. **Do not create a new app.** One Astro deploy on Railway for **`aadm.io` only**. No Next.js accounts app, no second Railway service, no `/dashboard/*`. **`accounts.aadm.io` is not served by this Astro app** — it is Clerk’s hosted Account Portal.

5. **Clerk hosted Account Portal cannot add custom sidebar tabs** ([Clerk docs](https://clerk.com/docs/guides/account-portal/overview)). There is **no MCP OAuth tab** on `accounts.aadm.io/user`. That is a Clerk platform limit, not something we fix by repointing DNS.

6. **OAuth Client ID (`client_id`) is a public identifier** (Clerk: not a secret). It is shown on the **MCP setup guide** at **`https://aadm.io/mcp#connect-oauth`** — this is **setup documentation**, not a login area. Subscribers get **API keys** from Clerk at `accounts.aadm.io/user`; they get **`client_id`** from the `/mcp` setup section.

---

## What lives where

| Host | Who serves it | Purpose |
|------|----------------|---------|
| **`accounts.aadm.io`** | **Clerk** (CNAME — keep it) | **Only** login / account / API keys |
| **`aadm.io`** | **This Astro app** (Railway) | Marketing + MCP setup (incl. public OAuth `client_id` copy) |
| **`mcp.aadm.io`** | **aadm-mcp** repo | MCP JSON-RPC; verifies Clerk tokens |

---

## Subscriber credentials

| Need | Where |
|------|--------|
| Sign in / sign up | `accounts.aadm.io` (Clerk) |
| API key (`ak_…`) for Cursor / curl | `accounts.aadm.io/user` → **API keys** (Clerk) |
| OAuth Client ID for Claude | `aadm.io/mcp#connect-oauth` (setup docs — public `client_id` copy) |
| MCP server URL | `mcp.aadm.io/mcp` |

Operator: set **`CLERK_OAUTH_CLIENT_ID`** on the **Astro** Railway service (and MCP server) so the `/mcp` page can render the copy card.

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
| `src/lib/clerk-portal-urls.ts` | Auth links → **`accounts.aadm.io/*` only** |
| `src/lib/clerk-auth-policy.ts` | Redirect auth paths on `aadm.io` → `accounts.aadm.io` |
| `src/middleware.ts` | Enforces marketing-host redirect |
| `src/pages/mcp.astro` | OAuth **Client ID copy card** (`#connect-oauth`) — setup, not login |
| `src/components/SiteHeader.astro` | Sign-in/up → Clerk; signed-in → `accounts.aadm.io/user` |

**Do not add** `src/pages/sign-in.astro`, `/user`, or embedded `<UserProfile>` as a production accounts surface — Clerk already hosts that on `accounts.aadm.io`.

---

## Forbidden (agents and maintainers)

- ❌ Remove Clerk CNAME or repoint `accounts.aadm.io` to Railway “to add custom tabs”  
- ❌ New accounts app / Next.js / `/dashboard/*`  
- ❌ Login or account UI on **`aadm.io`** (redirect to Clerk instead)  
- ❌ Claim OAuth Client ID lives on `accounts.aadm.io/user` (Clerk hosted portal cannot show it)  
- ❌ Split “login on accounts, credentials on aadm.io/account” — API keys = Clerk only; `client_id` = public on `/mcp` setup  

---

## References

- [Clerk Account Portal overview](https://clerk.com/docs/guides/account-portal/overview)  
- [Clerk API keys](https://clerk.com/docs/guides/development/machine-auth/api-keys)  
- [AADM MCP integration](../aadm-mcp/docs/INTEGRATION.md) (cross-repo)  
