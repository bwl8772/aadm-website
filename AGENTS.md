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
- **Environment variables**: Copy `.env.example` to `.env` for outbound link configuration. The site renders without them but links will point to placeholder URLs.
- **No database or backend services** are needed — this is a purely static site.
- The Astro dev server listens on port 4321 by default.
