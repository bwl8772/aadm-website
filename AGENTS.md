# AGENTS.md

## ⛔ Clerk auth — read `docs/CLERK-AUTH.md` first

| Rule | Detail |
|------|--------|
| **Clerk owns login** | **`accounts.aadm.io`** CNAME — sign-in/sign-up only |
| **Member area** | **`aadm.io/member`** — protected, embedded `<UserProfile>`, MCP OAuth tab |
| **aadm.io marketing** | Public `/mcp` — no credential values |
| **CNAME** | Do not repoint `accounts.aadm.io` |

Auth links: `src/lib/clerk-portal-urls.ts` · Member page: `src/pages/member/[[...rest]].astro`

## Commands

`npm run dev` · `npm run build` · `npm run test:clerk-smoke`
