# AGENTS.md

## ⛔ Authentication — read `docs/CLERK-AUTH.md` first

| Rule | Detail |
|------|--------|
| **Login area** | **`accounts.aadm.io`** CNAME — sign-in/sign-up only |
| **Member area** | **`aadm.io/member`** — protected, embedded `<UserProfile>`, MCP OAuth tab |
| **aadm.io marketing** | Public `/mcp` — no credential values |
| **CNAME** | Do not repoint `accounts.aadm.io` |
| **Satellite** | **Off** — `aadm.io` is the Clerk **primary** domain; Account Portal shares cookies |

Auth links: `src/lib/clerk-portal-urls.ts` · Member page: `src/pages/member/[[...rest]].astro`

## Commands

`npm run dev` · `npm run build` · `npm run test:clerk-smoke`
