# AADM website

Standalone **static** marketing homepage for **AADM** (Agentic Authority Delivery Model).

**Product split**

| Track | What | Where |
|--------|------|--------|
| **Standard** | Published openly—definitions, templates, governance narrative | Public repo (e.g. **`aadm-standard`** on GitHub) — **View the Standard** |
| **MCP** | Private **paid** access; implementation stays proprietary | **Service:** Streamable HTTP on your MCP host (e.g. `https://mcp.example.com/mcp`). **Docs:** often on your main site (e.g. `https://example.com/mcp`) — **Get MCP Access** points at docs; quick reference on this page uses the MCP URL for health, discovery JSON, and `curl`. |

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
| `PUBLIC_MCP_REPO_URL` | **MCP HTTP URL** — must include the **`/mcp`** path for JSON-RPC (e.g. `https://mcp.aadm.io/mcp`). Same origin is used for **`GET /health`** and **`GET /`** discovery JSON ([example discovery payload](https://mcp.aadm.io/)). |
| `PUBLIC_MCP_QUICKSTART_URL` | **Get MCP Access** + in-page “MCP documentation” link — subscriber docs on your **marketing** domain (e.g. `https://aadm.io/mcp`), separate from the MCP API host. |
| `PUBLIC_MCP_CUSTOMER_DOCS_URL` (optional) | Second documentation base (e.g. gated Notion). If unset and `PUBLIC_MCP_QUICKSTART_URL` is set, the page still links to that docs URL. |

Astro only exposes variables prefixed with `PUBLIC_` to the client.

### MCP quick reference on the homepage

The **MCP access — quick reference** block uses **`PUBLIC_MCP_REPO_URL`** for protocol facts (Streamable HTTP, `Accept` headers, `/health`, service-root discovery JSON, minimal `initialize` curl). It uses **`PUBLIC_MCP_QUICKSTART_URL`** for the **MCP documentation** button and the **Get MCP Access** header/hero CTA—typically your marketing site path (e.g. `/mcp` on `aadm.io`), not the MCP API hostname.

## Build

```bash
npm run build
```

Output: `dist/`. Preview locally with `npm run preview`.

## Publish this repo

```bash
cd /Users/brianlambert/github/aadm-website
git remote add origin https://github.com/YOUR_ORG/aadm-website.git
git push -u origin main
```

Replace `YOUR_ORG` and repo name as needed.

## License

Add a license file if this site should carry one; it does not ship AADM normative content beyond short marketing copy.
