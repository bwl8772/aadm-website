# AADM website

Standalone **static** marketing homepage for **AADM** (Agentic Authority Delivery Model).

**Product split**

| Track | What | Where |
|--------|------|--------|
| **Standard** | Published openly—definitions, templates, governance narrative | Public repo (e.g. **`aadm-standard`** on GitHub) — **View the Standard** |
| **MCP** | Private **paid** access; implementation stays proprietary | **Railway-hosted** HTTP MCP for subscribers — **Get MCP Access** / portal URL |

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
| `PUBLIC_MCP_REPO_URL` | **MCP HTTP URL** for Streamable HTTP (usually ends in `/mcp`) — typically your **Railway** service URL in production. Drives `/health` and `/` links and the `initialize` curl on the homepage. |
| `PUBLIC_MCP_QUICKSTART_URL` | **Get MCP Access** — customer-facing portal or landing (often the same host as the MCP service or a marketing route in front of Railway). |
| `PUBLIC_MCP_CUSTOMER_DOCS_URL` (optional) | **Subscriber documentation** — private Notion, docs portal, or gated URL. If unset, the site states that implementation and full integration guides are proprietary and ship with the access package (no public GitHub links). |

Astro only exposes variables prefixed with `PUBLIC_` to the client.

### MCP quick reference on the homepage

The **MCP access — quick reference** block describes public protocol facts (Streamable HTTP, `Accept` headers, `/health`, minimal `initialize` curl). It does **not** link to a public MCP source repository. Deeper host integration material belongs in **`PUBLIC_MCP_CUSTOMER_DOCS_URL`** or in materials you deliver outside this static site.

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
