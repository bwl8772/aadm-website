# AADM website

Standalone **static** marketing homepage for **AADM** (Agentic Authority Delivery Model). This repo is intentionally separate from the public **`aadm-standard`** narrative and from your **commercial MCP product** (implementation is private; you sell access).

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
| `PUBLIC_MCP_REPO_URL` | **MCP HTTP URL** for Streamable HTTP (usually ends in `/mcp`). Drives `/health` and `/` links and the `initialize` curl on the homepage. |
| `PUBLIC_MCP_QUICKSTART_URL` | **Get MCP Access** — your customer-facing MCP portal or landing (e.g. `mcp.aadm.io`). |
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
