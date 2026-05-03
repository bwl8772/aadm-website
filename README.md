# AADM website

Standalone **static** marketing homepage for **AADM** (Agentic Authority Delivery Model). This repo is intentionally separate from **`aadm-standard`** (human-readable standard) and **`aadm-mcp`** (MCP server implementation).

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
| `PUBLIC_STANDARD_REPO_URL` | **View the Standard** — e.g. GitHub root for `aadm-standard` |
| `PUBLIC_MCP_REPO_URL` | **MCP HTTP URL** for Streamable HTTP (usually ends in `/mcp`). Drives `/health` and `/` links and the initialize `curl` on the homepage. |
| `PUBLIC_MCP_QUICKSTART_URL` | **Get MCP Access** — deploy landing or operator portal (e.g. your public MCP site root). |
| `PUBLIC_MCP_GITHUB_URL` (optional) | `aadm-mcp` source on GitHub; homepage adds links to `docs/INTEGRATION.md` and `resources/agents/mcp-setup.md`. |

Astro only exposes variables prefixed with `PUBLIC_` to the client.

### MCP quickstart copy (from `aadm-mcp`)

The on-page **MCP access — quick reference** section summarizes the same ideas as the open **`aadm-mcp`** README / `AGENTS.md`: Streamable HTTP `POST` to `/mcp` with the right `Accept` header, **`GET /health`** for probes, **`GET /`** for discovery JSON, and a minimal **`initialize`** curl. For orchestrators and long sessions, follow **`docs/INTEGRATION.md`** in the MCP repository.

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
