# AADM website

Marketing site for **AADM** (Agentic Authority Delivery Model). Astro **SSR** with the official **`@clerk/astro`** SDK for sign-in / sign-up / sign-out.

**Product split**

| Track | What | Where |
|--------|------|--------|
| **Standard** | Published openly—definitions, templates, governance narrative | Public repo (e.g. **`aadm-standard`** on GitHub) — **View the Standard** |
| **MCP** | Private **MCP access**; implementation stays proprietary | **Service (agents):** Streamable HTTP at **`https://mcp.aadm.io`**. **Marketing (humans):** **`https://aadm.io/mcp`** — this repo also serves `/mcp` when you deploy this Astro app. |

This repo is only the marketing shell. It does not ship MCP server source or the normative standard files.

## Stack

- [Astro](https://astro.build/) 6 — `output: 'server'`, `@astrojs/node` standalone adapter
- [`@clerk/astro`](https://clerk.com/docs/astro/getting-started/quickstart) — Clerk middleware + components (no hand-rolled JS)
- [Tailwind CSS](https://tailwindcss.com/) v4 via `@tailwindcss/vite`

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). Health check: [http://localhost:4321/health](http://localhost:4321/health).

## Configure

Copy `.env.example` to `.env`. **Do not put a space after `=`**.

| Variable | Purpose |
|----------|---------|
| `PUBLIC_STANDARD_REPO_URL` | **View the Standard** — public repo or site for the standard. |
| `PUBLIC_MCP_REPO_URL` | **MCP service** — Streamable HTTP origin only. Default **`https://mcp.aadm.io`**. Do **not** append `/mcp`; this is not the marketing site. |
| `PUBLIC_MCP_QUICKSTART_URL` (optional) | **MCP marketing** page URL. Default **`https://aadm.io/mcp`**. Override for local preview (e.g. `http://localhost:4321/mcp`). |
| `PUBLIC_MCP_CUSTOMER_DOCS_URL` (optional) | Second documentation base (e.g. gated Notion). |
| `PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (build + runtime). |
| `CLERK_SECRET_KEY` | Clerk secret (runtime, server-only). Required for `clerkMiddleware()`. |
| `PUBLIC_CLERK_AUTHORIZED_PARTIES` (optional) | Comma-separated origins for Clerk’s `authorizedParties` (e.g. `http://localhost:4321,https://aadm.io`). Use when Clerk otherwise redirects browsers to the Dashboard application URL. Wired in `astro.config.mjs`. |

Astro only exposes `PUBLIC_*` variables to the client. `CLERK_SECRET_KEY` stays on the server.

### Routes (Astro)

There is no manual “route order” file: URLs come from `src/pages/` only — `index.astro` → `/`, `mcp.astro` → `/mcp` (**marketing** for this deploy), `health.ts` → `/health`. The live MCP **service** for clients is always **`https://mcp.aadm.io`** (`PUBLIC_MCP_REPO_URL`). Private URL prefixes for Clerk live in `src/lib/routes.ts` and are consumed by `src/middleware.ts`.

### Auth: how it works now

- `src/middleware.ts` runs `clerkMiddleware` with **opt-in** private routes (`/account(.*)` by default); `/`, `/mcp`, and `/health` stay public.
- `SiteHeader` uses `<Show when="signed-out">` / `<Show when="signed-in">` plus `<SignInButton>`, `<SignUpButton>`, `<UserButton afterSignOutUrl="/">` from `@clerk/astro/components` (same pattern as the [Clerk Astro quickstart](https://clerk.com/docs/astro/getting-started/quickstart)).
- The MCP page CTAs (`Get access`, `Sign in`) are also `<SignUpButton>` / `<SignInButton>`.
- No more inline `<script>` for Clerk JS, no manual `redirect_url` query plumbing.

Set the Clerk Account Portal hosts in the Clerk Dashboard (`accounts.<your-domain>.com`); the SDK redirects there automatically.

## Build

```bash
npm run build
```

Output: `dist/` (Astro Node SSR). Preview with `npm run preview`.

## Docker (Railway or any host)

Multi-stage `Dockerfile`: builds Astro SSR, then runs `node ./dist/server/entry.mjs`. **`@astrojs/node`** listens on **`HOST`** (default `0.0.0.0` in the image) and **`PORT`** (Railway sets `PORT` at runtime; local default `8080`).

```bash
docker build -t aadm-website \
  --build-arg PUBLIC_STANDARD_REPO_URL="https://github.com/your-org/aadm-standard" \
  --build-arg PUBLIC_MCP_REPO_URL="https://mcp.aadm.io" \
  --build-arg PUBLIC_MCP_QUICKSTART_URL="https://aadm.io/mcp" \
  --build-arg PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..." \
  .
docker run --rm -p 8080:8080 \
  -e CLERK_SECRET_KEY="sk_live_..." \
  -e PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..." \
  -e PORT=8080 \
  aadm-website
# Visit http://localhost:8080/health
```

### Railway

1. **New service** → deploy from this GitHub repo (root directory = repo root).
2. Railway picks up **`Dockerfile`** and **`railway.toml`** (`builder = "DOCKERFILE"`, deploy health check on **`/health`**).
3. **Variables** (runtime): `CLERK_SECRET_KEY`, `PUBLIC_CLERK_PUBLISHABLE_KEY`, and the same `PUBLIC_*` marketing URLs you use locally. Railway injects **`PORT`**; do not set it manually unless you know you need a fixed port.
4. **Build arguments** (optional): In the service **Settings → Build → Docker Build Args**, add the same names as the `ARG` lines in the Dockerfile (`PUBLIC_STANDARD_REPO_URL`, `PUBLIC_MCP_REPO_URL`, etc.) so Astro embeds public URLs at build time. If you omit them, defaults in `site-urls.ts` apply where coded.

Health check for the load balancer: **`/health`** (JSON `{"status":"ok","service":"aadm-website"}`).

### Health checks

| What you probe | URL | Notes |
|----------------|-----|-------|
| This site | `https://aadm.io/health` | Astro endpoint returning `{"status":"ok","service":"aadm-website"}`. Use for Railway/LB health checks. |
| MCP service | `https://mcp.aadm.io/health` | Separate deploy. |

## Publish

```bash
git remote add origin https://github.com/YOUR_ORG/aadm-website.git
git push -u origin main
```

## License

Add a license file if this site should carry one; it does not ship AADM normative content beyond short marketing copy.
