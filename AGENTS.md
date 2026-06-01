# AGENTS.md

## ⛔ Clerk auth — read `docs/CLERK-AUTH.md` first

| Rule | Detail |
|------|--------|
| **Clerk owns login** | **`accounts.aadm.io`** = Clerk **hosted Account Portal** (CNAME to Clerk). **Do not remove or repoint the CNAME.** |
| **One login area** | Sign-in, sign-up, profile, API keys → **`accounts.aadm.io` only** |
| **aadm.io** | Marketing + MCP setup (`/mcp`). **No login/account pages.** Middleware redirects auth paths → Clerk. |
| **No new app** | One Astro deploy for `aadm.io`. No Next.js, no second Railway service for accounts. |
| **OAuth Client ID** | Public setup value on **`aadm.io/mcp#connect-oauth`** — Clerk hosted `/user` **cannot** add custom tabs |
| **API keys** | **`accounts.aadm.io/user`** → API keys (Clerk only) |

**Forbidden:** repointing `accounts.aadm.io` to Railway; embedded `<UserProfile>` as production accounts; `/dashboard/*`; login UI on `aadm.io`.

Auth links: `src/lib/clerk-portal-urls.ts` → always `accounts.aadm.io/*`.

## Commands

`npm run dev` · `npm run build`
