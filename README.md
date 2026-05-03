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

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
|----------|---------|
| `PUBLIC_STANDARD_REPO_URL` | Public standard repository (GitHub or docs root) |
| `PUBLIC_MCP_REPO_URL` | MCP server / distribution repository |
| `PUBLIC_MCP_QUICKSTART_URL` | MCP quickstart or integration doc |

Astro only exposes variables prefixed with `PUBLIC_` to the client.

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
