# AADM website

Astro SSR marketing site at **`https://aadm.io`**. Sign-in is Clerk Account Portal at **`https://accounts.aadm.io`** (CNAME — **keep it**). Member credentials live at **`https://aadm.io/member`**.

> **Auth policy:** [`docs/CLERK-AUTH.md`](docs/CLERK-AUTH.md) — read before changing login, links, or credentials copy.

---

## Auth split (hybrid)

| Host | Served by | Purpose |
|------|-----------|---------|
| **`accounts.aadm.io`** | **Clerk** (Account Portal CNAME) | Sign-in and sign-up only |
| **`aadm.io/member`** | **This Astro app** | Protected embedded UserProfile — API keys, MCP OAuth client ID |
| **`aadm.io`** | **This Astro app** | Marketing + MCP setup (no credential values) |
| **`mcp.aadm.io`** | **aadm-mcp** | MCP service |

**Do not** repoint `accounts.aadm.io` away from Clerk. **Do not** add `<SignIn>` / `<SignUp>` on marketing pages (middleware redirects legacy auth paths to Clerk).

Public **`aadm.io/mcp`** explains setup and links to **`/member`** for credentials after sign-in.

---

## Develop

```bash
npm install && npm run dev
```

http://localhost:4321/mcp · http://localhost:4321/member · http://localhost:4321/health

---

## Configure

See [`docs/CLERK-AUTH.md`](docs/CLERK-AUTH.md) and `.env.example`.

| Variable | Purpose |
|----------|---------|
| `CLERK_SECRET_KEY` / `PUBLIC_CLERK_PUBLISHABLE_KEY` | `@clerk/astro` — protects `/member` |
| `PUBLIC_CLERK_SIGN_IN_URL` / `PUBLIC_CLERK_SIGN_UP_URL` | `accounts.aadm.io` |
| `CLERK_OAUTH_CLIENT_ID` | Member MCP OAuth tab only |
| `PUBLIC_CLERK_AUTHORIZED_PARTIES` | `https://aadm.io`, `https://www.aadm.io` |

---

## Deploy

**Railway:** one service, custom domain **`aadm.io` only**. `accounts.aadm.io` stays on Clerk DNS.

```bash
npm run build && npm run typecheck
BASE_URL=https://aadm.io npm run test:clerk-smoke
```
