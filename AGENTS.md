# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

**AADM marketing website — Astro 6 SSR + `@clerk/astro` only.**

- **Deployed app:** root Astro project (`src/`, `astro.config.mjs`, root `Dockerfile`, `railway.toml`).
- **Accounts:** Clerk Account Portal at `accounts.aadm.io` — sign-in, profile, API keys. No separate dashboard app in this repo.
- **No Next.js, no Stripe, no database** in this project.

### Architecture

| Host | Stack | Purpose |
|------|--------|---------|
| `aadm.io` | **This Astro app** | Marketing, `/mcp` setup guide, protected `/account/mcp` (OAuth Client ID) |
| `accounts.aadm.io` | **Clerk Account Portal** (Clerk-hosted) | `/sign-in`, `/sign-up`, `/user` (profile, API keys) — no custom OAuth Client ID UI |
| `mcp.aadm.io` | **Separate repo** (`aadm-mcp`) | MCP JSON-RPC service |

Subscriber auth links use full-page URLs to Clerk (`src/lib/clerk-portal-urls.ts`).

### Development commands

| Action | Command | Notes |
|--------|---------|-------|
| Install deps | `npm install` | Root `package.json` |
| Dev server | `npm run dev` | http://localhost:4321 with HMR |
| Build | `npm run build` | Outputs Astro SSR to `dist/` |
| Preview build | `npm run preview` | Serves `dist/` locally |

### Key routes (`src/pages/`)

| Path | Access | Notes |
|------|--------|-------|
| `/` | public | Marketing home |
| `/mcp` | public | MCP marketing + connection instructions |
| `/account/mcp` | **private** (`/account(.*)` in `src/lib/routes.ts`) | OAuth Client ID copy card — requires Clerk session |
| `/health` | public | Railway health check |

### Environment variables

Copy root **`.env.example`** → **`.env`**. Astro-only — no `NEXT_PUBLIC_*` vars.

Required for auth: `PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`.

For OAuth Client ID on `/account/mcp`: `CLERK_OAUTH_CLIENT_ID` (runtime, preferred) or `PUBLIC_MCP_OAUTH_CLIENT_ID` (build-time fallback).

`PUBLIC_CLERK_PUBLISHABLE_KEY` must be a valid Clerk key format. Placeholder `pk_live_...` fails middleware. For local dev without real credentials, use a test key like `pk_test_Y2xlcmsudGVzdC5sY2wuZGV2JA`.

### Auth implementation

- `src/middleware.ts` — `clerkMiddleware`, private routes from `src/lib/routes.ts`
- `src/components/SiteHeader.astro` — signed-out → Clerk sign-in/sign-up URLs; signed-in → `/account/mcp` + Account Portal `/user`

### Other notes

- **Node.js >= 22.12.0** (see `engines` in `package.json`).
- **No linter or test suite** in this repo.
- **No database** — Clerk is the only external dependency for this site.
- Default dev port: **4321**.
