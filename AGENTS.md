# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Static marketing homepage for AADM (Agentic Authority Delivery Model), built with Astro 6 + Tailwind CSS v4. Single-page site at `src/pages/index.astro`.

### Development commands

| Action | Command | Notes |
|--------|---------|-------|
| Install deps | `npm install` | Uses `package-lock.json` |
| Dev server | `npm run dev` | http://localhost:4321 with HMR |
| Build | `npm run build` | Outputs to `dist/` |
| Preview build | `npm run preview` | Serves `dist/` locally |

### Key notes

- **Node.js >= 22.12.0** is required (see `engines` in `package.json`).
- **No linter or test suite** is configured in this repo. There are no `lint`, `test`, or `check` scripts.
- **Environment variables**: Copy `.env.example` to `.env`. The `PUBLIC_CLERK_PUBLISHABLE_KEY` must be a validly-formatted Clerk key (base64-encoded frontend API ending with `$`); the placeholder `pk_live_...` from `.env.example` will cause every request to fail with "Publishable key not valid" because Clerk middleware runs on all routes. For local dev without real Clerk credentials, use a test-format key like `pk_test_Y2xlcmsudGVzdC5sY2wuZGV2JA` (decodes to `clerk.test.lcl.dev$`).
- **No database or backend services** are needed — this is a purely static/SSR site with Clerk as the only external dependency.
- The Astro dev server listens on port 4321 by default.
