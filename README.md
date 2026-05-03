# AADM website

Standalone **static** marketing homepage for **AADM** (Agentic Authority Delivery Model).

**Product split**

| Track | What | Where |
|--------|------|--------|
| **Standard** | Published openly—definitions, templates, governance narrative | Public repo (e.g. **`aadm-standard`** on GitHub) — **View the Standard** |
| **MCP** | Private **MCP access**; implementation stays proprietary | **Service:** Streamable HTTP on your MCP host (e.g. `https://mcp.example.com/mcp`). **Docs:** often on your main site (e.g. `https://example.com/mcp`) — **Get MCP Access** points at docs; quick reference on this page uses the MCP URL for health, discovery JSON, and `curl`. |

This repo is only the marketing shell. It does not ship MCP server source or the normative standard files.

## Stack

- [Astro](https://astro.build/) 6 — `output: 'static'`
- [Tailwind CSS](https://tailwindcss.com/) v4 via `@tailwindcss/vite`

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Configure outbound links

Copy `.env.example` to `.env` and set. **Do not put a space after `=`** — a leading space becomes part of the URL.

| Variable | Purpose |
|----------|---------|
| `PUBLIC_STANDARD_REPO_URL` | **View the Standard** — public repo or site for the standard (e.g. `aadm-standard` on GitHub). |
| `PUBLIC_MCP_REPO_URL` | **MCP host** — e.g. `https://mcp.aadm.io`. Same origin is used for **`GET /health`** and **`GET /`** discovery JSON ([example](https://mcp.aadm.io/)). The endpoint is the origin itself—do **not** append `/mcp`. |
| `PUBLIC_MCP_QUICKSTART_URL` | **Get MCP Access** in the header (and related links) — should point at this repo’s **`/mcp`** sales page (e.g. `https://aadm.io/mcp`), separate from the MCP API host (`PUBLIC_MCP_REPO_URL`). |
| `PUBLIC_MCP_CUSTOMER_DOCS_URL` (optional) | Second documentation base (e.g. gated Notion). If unset and `PUBLIC_MCP_QUICKSTART_URL` is set, the page still links to that docs URL. |
| `PUBLIC_CLERK_SIGN_IN_URL` / `PUBLIC_CLERK_SIGN_UP_URL` | Marketing header **Sign in** / **Sign up** → Clerk Account Portal (e.g. `https://accounts…/sign-in`). |
| `PUBLIC_CLERK_USER_PROFILE_URL` (optional) | When a session is detected, the primary auth control becomes **Account** and links here (default `https://accounts.aadm.io/user`). |
| `PUBLIC_CLERK_SIGN_OUT_URL` (optional) | Override the Account Portal **sign-out** path/origin if yours differs; **`redirect_url` is always set to `https://aadm.io/`** after logout. |
| `PUBLIC_CLERK_PUBLISHABLE_KEY` (optional) | If set, the site loads Clerk browser JS: signed-out users see **Sign in**; signed-in users see **Account** (profile URL above) and **Sign out** is shown. Use the same publishable key as your Clerk app; add `aadm.io` to allowed origins in Clerk. |
| `PUBLIC_CLERK_SATELLITE_DOMAIN` (optional) | Hostname for Clerk **satellite** setup (e.g. `aadm.io`) so the marketing domain can receive session sync. Omit unless you use satellite domains. |

Astro only exposes variables prefixed with `PUBLIC_` to the client.

### MCP quick reference on the homepage

The **MCP access — quick reference** block uses **`PUBLIC_MCP_REPO_URL`** for protocol facts (Streamable HTTP, `Accept` headers, `/health`, service-root discovery JSON, minimal `initialize` curl). It uses **`PUBLIC_MCP_QUICKSTART_URL`** for the **MCP documentation** button and the **Get MCP Access** header/hero CTA—typically your marketing site path (e.g. `/mcp` on `aadm.io`), not the MCP API hostname.

## Build

```bash
npm run build
```

Output: `dist/`. Preview locally with `npm run preview`.

## Docker (Railway or any host)

Multi-stage **`Dockerfile`**: builds Astro, then runs a tiny Node server that serves `dist/` and answers **`GET /health`** with JSON `{"status":"ok","service":"aadm-website"}`.

```bash
docker build -t aadm-website \
  --build-arg PUBLIC_STANDARD_REPO_URL="https://github.com/your-org/aadm-standard" \
  --build-arg PUBLIC_MCP_REPO_URL="https://mcp.aadm.io" \
  --build-arg PUBLIC_MCP_QUICKSTART_URL="https://aadm.io/mcp" \
  --build-arg PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..." \
  .
docker run --rm -p 8080:8080 -e PORT=8080 aadm-website
# Visit http://localhost:8080/health
```

**Railway:** New service → deploy from this repo → set **Root Directory** if needed → **Dockerfile** builder. Add the same **`PUBLIC_*`** names as in `.env` under **Variables** so the Astro build can embed correct links (Railway forwards them as build args when names match `ARG` lines in the Dockerfile).

Listen address: **`0.0.0.0`**; port from **`PORT`** (Railway sets this automatically).

### Health checks: `aadm.io` vs `aadm.io/health` vs MCP

| What you probe | Typical URL | Notes |
|----------------|---------------|--------|
| **This marketing site** (this repo, Docker) | **`https://aadm.io/health`** | Dedicated JSON endpoint from `scripts/docker-serve.mjs`. Use this for Railway / load balancer health checks on the **site** service. |
| **Site root** | `https://aadm.io/` | Returns **HTML** (homepage). You *can* probe `/` for “something is up,” but checks are clearer with **`/health`** (small JSON, no layout/CDN ambiguity). |
| **MCP service** (separate deploy, e.g. `mcp.aadm.io`) | **`https://mcp.aadm.io/health`** | Different process: liveness for the **MCP server**, not the marketing site. Discovery JSON is usually **`GET /`** on that same MCP host ([example](https://mcp.aadm.io/)). |

So: **`aadm.io/health`** for the static site on Railway; **`mcp…/health`** for the MCP product. They are not interchangeable.

## Publish this repo

```bash
cd /Users/brianlambert/github/aadm-website
git remote add origin https://github.com/YOUR_ORG/aadm-website.git
git push -u origin main
```

Replace `YOUR_ORG` and repo name as needed.

## License

Add a license file if this site should carry one; it does not ship AADM normative content beyond short marketing copy.
