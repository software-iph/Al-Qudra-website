# Al-Qudra Engineering Consultancy - website + dashboard

- `web/` - Next.js app: public site (`/ar`, `/en`) and content dashboard (`/admin`), PostgreSQL via Drizzle.
- `deploy/` - Docker Compose setup and deployment guide for the company VPS (see `deploy/README.md`).

Local development: `cd web && npm install && npm run dev` (needs `web/.env.local` with `DATABASE_URL` and `SESSION_SECRET`).
