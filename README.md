# AADM website

Astro SSR marketing site at **`https://aadm.io`**. Subscriber login is **100% Clerk** at **`https://accounts.aadm.io`** (Clerk Account Portal CNAME — **keep it**).

> **Auth policy:** [`docs/CLERK-AUTH.md`](docs/CLERK-AUTH.md) — read before changing login, links, or credentials copy.

---

## Clerk manages login (one place — keep the CNAME)

| Host | Served by | Purpose |
|------|-----------|---------|
| **`accounts.aadm.io`** | **Clerk** (Account Portal CNAME) | Sign-in, sign-up, profile, **API keys** — **only** login area |
| **`aadm.io`** | **This Astro app** | Marketing + MCP setup docs |
| **`mcp.aadm.io`** | **aadm-mcp** | MCP service |

**Do not** repoint `accounts.aadm.io` away from Clerk. **Do not** add login pages on `aadm.io` (middleware redirects auth paths to Clerk).

Clerk’s hosted portal **cannot** add a custom “MCP OAuth” tab. The OAuth **`client_id`** is a **public** setup value — copy card on **`https://aadm.io/mcp#connect-oauth`**. API keys (`ak_…`) come from **`accounts.aadm.io/user`** only.

---

## Develop

```bash
npm install && npm run dev
```

http://localhost:4321/mcp · http://localhost:4321/health

---

## Configure

See [`docs/CLERK-AUTH.md`](docs/CLERK-AUTH.md) and `.env.example`.

| Variable | Purpose |
|----------|---------|
| `CLERK_SECRET_KEY` / `PUBLIC_CLERK_PUBLISHABLE_KEY` | `@clerk/astro` on marketing site |
| `CLERK_OAUTH_CLIENT_ID` | Renders OAuth copy card on `/mcp` |
| `PUBLIC_CLERK_*_URL` | Default `accounts.aadm.io/*` for auth links |

---

## Deploy

**Railway:** one service, custom domain **`aadm.io` only**. `accounts.aadm.io` stays on Clerk DNS.
