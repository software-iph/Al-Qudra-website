# Production image for the Alqudra website + dashboard (Next.js standalone).
#
# The app is built on a PC first (no heavy build on the shared VPS):
#   npm ci && npm run build
# then this image only copies the finished server:
#   docker build -t alqudra-web .
#
# Runtime: node server.js on port 3000. On start it applies database migrations
# and adds missing first-run content (see src/instrumentation.ts).
FROM node:22-alpine

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

WORKDIR /app
RUN addgroup -S app && adduser -S app -G app

COPY --chown=app:app .next/standalone ./
COPY --chown=app:app .next/static ./.next/static
COPY --chown=app:app public ./public
COPY --chown=app:app drizzle ./drizzle

# Windows-built image tools are not used (the site does not use next/image); uploads go to a volume.
RUN rm -rf node_modules/@img node_modules/sharp uploads \
    && mkdir -p uploads && chown app:app uploads

USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s CMD wget -qO- http://127.0.0.1:3000/en >/dev/null || exit 1
CMD ["node", "server.js"]
