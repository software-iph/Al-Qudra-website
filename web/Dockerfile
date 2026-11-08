# Production image for the Alqudra website + dashboard (Next.js standalone).
# Built on the VPS from the GitHub code: deploy/update.sh (git pull + docker compose build).
#
# Runtime: node server.js on port 3000. On start it applies database migrations
# and adds missing first-run content (see src/instrumentation.ts).

# ---- 1. Build ----
FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# ---- 2. Run (only the finished server, no source or dev packages) ----
FROM node:22-alpine
LABEL project=alqudra
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

WORKDIR /app
RUN addgroup -S app && adduser -S app -G app

COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
COPY --from=build --chown=app:app /app/drizzle ./drizzle

# The site does not use next/image; uploads go to a volume.
RUN rm -rf node_modules/@img node_modules/sharp uploads .env* \
    && mkdir -p uploads && chown app:app uploads

USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s CMD wget -qO- http://127.0.0.1:3000/en >/dev/null || exit 1
CMD ["node", "server.js"]
