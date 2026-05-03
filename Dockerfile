# Production image for Railway (or any Docker host). Serves static Astro `dist/` + GET /health.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY --from=build /app/dist ./dist
COPY scripts/docker-serve.mjs ./serve.mjs
EXPOSE 8080
USER node
CMD ["node", "serve.mjs"]
