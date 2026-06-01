# AGENTS.md

## ⛔ Clerk auth — read `docs/CLERK-AUTH.md` first

| Rule | Detail |
|------|--------|
| **Clerk owns login** | **`accounts.aadm.io`** = Clerk **hosted Account Portal** (CNAME to Clerk). **Do not remove or repoint the CNAME.** |
| **One login area** | Sign-in, sign-up, profile, API keys, **your OAuth Client ID** → **`accounts.aadm.io` only** |
| **aadm.io** | Marketing + MCP setup (`/mcp`). **No credential values on public pages.** Middleware redirects auth paths → Clerk. |
| **Public `/mcp` copy** | Say **“your client ID”** and link to **`accounts.aadm.io`** — never paste the actual Client ID on the public page. |

**Forbidden:** repointing `accounts.aadm.io` to Railway; publishing `client_id` values on public pages; login UI on `aadm.io`.

Auth links: `src/lib/clerk-portal-urls.ts` → always `accounts.aadm.io/*`.

## Commands

`npm run dev` · `npm run build`
