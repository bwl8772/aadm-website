# AADM website

**Production stack: Astro 6 SSR + [`@clerk/astro`](https://clerk.com/docs/astro/getting-started/quickstart) only.**

This repo deploys **one** web application — the Astro marketing site at **`https://aadm.io`**. There is **no Next.js app** — subscriber accounts are handled by **Clerk Account Portal** (`accounts.aadm.io`).

**Product split**

| Track | What | Where |
|--------|------|--------|
| **Standard** | Published openly—definitions, templates, governance narrative | Public repo (e.g. **`aadm-standard`** on GitHub) — **View the Standard** |
| **MCP** | Private **MCP access**; implementation stays proprietary | **Service (agents):** Streamable HTTP at **`https://mcp.aadm.io`**. **Marketing (humans):** **`https://aadm.io/mcp`** — served by this Astro app. |

This repo is the marketing and subscriber-facing shell. It does not ship MCP server source or the normative standard files.

## Architecture (Astro + Clerk)

```
aadm.io (this repo — Astro SSR on Railway)
├── /                    public marketing
├── /mcp                 public MCP setup guide
├── /account/mcp         protected — copy OAuth Client ID (Clerk session required)
└── /health              deploy health check

accounts.aadm.io (Clerk Account Portal — hosted by Clerk, not this repo)
├── /sign-in             Clerk sign-in
├── /sign-up             Clerk sign-up
└── /user                  profile, security, API keys (ak_…)
                           — no custom OAuth Client ID tab here
```

| User need | Where |
|-----------|--------|
| Sign in / sign up | Clerk Account Portal — `accounts.aadm.io/sign-in` (links from site header) |
| MCP API key (`ak_…`) | Clerk Account Portal — `accounts.aadm.io/user` → API keys |
| OAuth Client ID (Claude Code, claude.ai Connectors) | **This Astro site** — `aadm.io/account/mcp` (after sign-in) |
| MCP JSON-RPC for agents | Separate deploy — `https://mcp.aadm.io/mcp` |

Auth on the Astro site uses **`clerkMiddleware`** plus full-page links to the Clerk Account Portal (`src/lib/clerk-portal-urls.ts`).

## Stack

- [Astro](https://astro.build/) 6 — `output: 'server'`, `@astrojs/node` standalone adapter
- [`@clerk/astro`](https://clerk.com/docs/astro/getting-started/quickstart) — Clerk middleware + `<Show when="signed-in">` / `signed-out` (no hand-rolled Clerk JS)
- [Tailwind CSS](https://tailwindcss.com/) v4 via `@tailwindcss/vite`

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). Health check: [http://localhost:4321/health](http://localhost:4321/health).

## Configure

Copy `.env.example` to `.env`. **Do not put a space after `=`.** All variables below are for the **Astro app only**.

| Variable | Purpose |
|----------|---------|
| `PUBLIC_STANDARD_REPO_URL` | **View the Standard** — public repo or site for the standard. |
| `PUBLIC_MCP_REPO_URL` | **MCP service** host origin (default **`https://mcp.aadm.io`**). Client configs use **`/mcp`** appended automatically on `/mcp` and `/account/mcp`. |
| `PUBLIC_MCP_QUICKSTART_URL` (optional) | **MCP marketing** page URL. Default **`https://aadm.io/mcp`**. Override for local preview (e.g. `http://localhost:4321/mcp`). |
| `PUBLIC_MCP_CUSTOMER_DOCS_URL` (optional) | Second documentation base (e.g. gated Notion). |
| `PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (build + runtime). |
| `CLERK_SECRET_KEY` | Clerk secret (runtime, server-only). Required for `clerkMiddleware()`. |
| `CLERK_OAUTH_CLIENT_ID` | Clerk OAuth app Client ID (same app as the MCP server). Shown on protected **`/account/mcp`** — not on public `/mcp`, not on Clerk-hosted `accounts.*/user`. |
| `PUBLIC_MCP_OAUTH_CLIENT_ID` (optional) | Build-time fallback if runtime `CLERK_OAUTH_CLIENT_ID` is unavailable. |
| `PUBLIC_CLERK_SIGN_IN_URL` / `PUBLIC_CLERK_SIGN_UP_URL` / `PUBLIC_CLERK_USER_PROFILE_URL` (optional) | Account Portal URLs (defaults: `accounts.aadm.io/*`). |
| `PUBLIC_CLERK_AUTHORIZED_PARTIES` (optional) | Comma-separated origins for Clerk’s `authorizedParties` (e.g. `http://localhost:4321,https://aadm.io`). Wired in `astro.config.mjs`. |

Astro only exposes `PUBLIC_*` variables to the client. `CLERK_SECRET_KEY` and `CLERK_OAUTH_CLIENT_ID` stay on the server.

### Routes (Astro only)

URLs come from `src/pages/`:

| Path | File | Access |
|------|------|--------|
| `/` | `index.astro` | public |
| `/mcp` | `mcp.astro` | public (MCP marketing + setup) |
| `/account/mcp` | `account/mcp.astro` | **private** — OAuth Client ID copy card |
| `/health` | `health.ts` | public |

Private prefixes are listed in `src/lib/routes.ts` and enforced by `src/middleware.ts` (`/account(.*)` by default).

The live MCP **service** for agents is always **`https://mcp.aadm.io`** — not served by this Astro app except as documentation links.

### Auth

- `src/middleware.ts` — `clerkMiddleware` with opt-in private routes; `/`, `/mcp`, and `/health` stay public.
- `SiteHeader` — `<Show when="signed-out">` links to Clerk sign-in/sign-up; `<Show when="signed-in">` links to **`/account/mcp`** (OAuth Client ID) and **`accounts.aadm.io/user`** (profile / API keys).
- Account Portal hostnames are configured in the **Clerk Dashboard** (`accounts.<your-domain>.com`).

## Build

```bash
npm run build
```

Output: `dist/` (Astro Node SSR). Preview with `npm run preview`.

## Docker (Railway or any host)

Multi-stage `Dockerfile` at repo root: builds **Astro SSR only**, runs `node ./dist/server/entry.mjs`. **`@astrojs/node`** listens on **`HOST`** (default `0.0.0.0`) and **`PORT`** (Railway sets `PORT` at runtime).

```bash
docker build -t aadm-website \
  --build-arg PUBLIC_STANDARD_REPO_URL="https://github.com/your-org/aadm-standard" \
  --build-arg PUBLIC_MCP_REPO_URL="https://mcp.aadm.io" \
  --build-arg PUBLIC_MCP_QUICKSTART_URL="https://aadm.io/mcp" \
  --build-arg PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..." \
  .
docker run --rm -p 8080:8080 \
  -e CLERK_SECRET_KEY="sk_live_..." \
  -e CLERK_OAUTH_CLIENT_ID="your_oauth_client_id" \
  -e PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..." \
  -e PORT=8080 \
  aadm-website
# Visit http://localhost:8080/health
```

### Railway

1. **New service** → deploy from this GitHub repo (root directory).
2. Railway picks up root **`Dockerfile`** and **`railway.toml`** (`builder = "DOCKERFILE"`, health check **`/health`**).
3. **Runtime variables:** `CLERK_SECRET_KEY`, `PUBLIC_CLERK_PUBLISHABLE_KEY`, **`CLERK_OAUTH_CLIENT_ID`**, and the same `PUBLIC_*` marketing URLs you use locally. Railway injects **`PORT`**.
4. **Docker build args** (optional): `PUBLIC_STANDARD_REPO_URL`, `PUBLIC_MCP_REPO_URL`, `PUBLIC_MCP_QUICKSTART_URL`, `PUBLIC_CLERK_PUBLISHABLE_KEY`, etc.

Health check: **`/health`** → `{"status":"ok","service":"aadm-website"}`.

| What you probe | URL |
|----------------|-----|
| This site (Astro) | `https://aadm.io/health` |
| MCP service (separate repo) | `https://mcp.aadm.io/health` |

## Publish

```bash
git remote add origin https://github.com/YOUR_ORG/aadm-website.git
git push -u origin main
```

## License

Add a license file if this site should carry one; it does not ship AADM normative content beyond short marketing copy.
