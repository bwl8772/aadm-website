# Astro SSR — aadm.io marketing only. Login = Clerk CNAME on accounts.aadm.io (see docs/CLERK-AUTH.md).
# Runtime (Railway Variables — not build args):
#   CLERK_SECRET_KEY              required for clerkMiddleware + /member
#   CLERK_OAUTH_CLIENT_ID         member MCP OAuth tab (not public /mcp)
#   PUBLIC_CLERK_PUBLISHABLE_KEY  re-set at runtime if you change keys without rebuilding
# Build-time (Docker build args or Railway Build Args):
#   PUBLIC_* above — baked into the Astro SSR bundle; defaults in src/lib/site-urls.ts if omitted
#
# https://docs.railway.app/deploy/dockerfiles
# https://docs.railway.app/deploy/healthchecks
FROM node:22-alpine AS build
WORKDIR /app

ARG PUBLIC_STANDARD_REPO_URL=""
ARG PUBLIC_MCP_REPO_URL=""
ARG PUBLIC_MCP_QUICKSTART_URL=""
ARG PUBLIC_MCP_CUSTOMER_DOCS_URL=""
ARG PUBLIC_CLERK_PUBLISHABLE_KEY=""
ARG PUBLIC_CLERK_AUTHORIZED_PARTIES=""

ENV PUBLIC_STANDARD_REPO_URL=$PUBLIC_STANDARD_REPO_URL \
	PUBLIC_MCP_REPO_URL=$PUBLIC_MCP_REPO_URL \
	PUBLIC_MCP_QUICKSTART_URL=$PUBLIC_MCP_QUICKSTART_URL \
	PUBLIC_MCP_CUSTOMER_DOCS_URL=$PUBLIC_MCP_CUSTOMER_DOCS_URL \
	PUBLIC_CLERK_PUBLISHABLE_KEY=$PUBLIC_CLERK_PUBLISHABLE_KEY \
	PUBLIC_CLERK_AUTHORIZED_PARTIES=$PUBLIC_CLERK_AUTHORIZED_PARTIES

COPY package.json package-lock.json ./
# Railway rejects arbitrary BuildKit cache `id=` values (requires cacheKey/service prefix).
# Rely on Docker layer cache for `npm ci` instead.
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Bind all interfaces; @astrojs/node reads HOST and PORT from the environment.
ENV HOST=0.0.0.0
# Local default when PORT is unset (Railway overwrites PORT per deploy).
ENV PORT=8080

COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json

EXPOSE 8080

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
	CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8080)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "./dist/server/entry.mjs"]
