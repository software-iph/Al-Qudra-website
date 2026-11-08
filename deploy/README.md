# Alqudra - deployment to the company VPS

**Status: prepared, NOT deployed.** Nothing on the VPS has been changed.

The new site is one **Next.js** app (`alqudra/web`) that serves both the public website
(`/ar`, `/en`) and the dashboard (`/admin`), with **PostgreSQL** for content. It replaces the
old React frontend + PHP/Laravel backend (those folders are kept only for reference).

The VPS (`102.203.203.160`) hosts other live sites (trass, farqadan, meraas, gheras, enmaa, iph).
Everything below only creates new `alqudra-*` containers in `/opt/alqudra`. Never restart Nginx
Proxy Manager, the Docker daemon, or any other site's containers.

| Container     | Image                           | Purpose                                | Network         |
|---------------|---------------------------------|----------------------------------------|-----------------|
| `alqudra-web` | built from the prebuilt app     | Website + dashboard (Node, port 3000)  | proxy, internal |
| `alqudra-db`  | postgres:18-alpine              | Database                               | internal        |

No container publishes a host port. Uploaded photos/videos live in the `alqudra_uploads` volume.

## 1. Build on a PC (not on the server)

```bash
cd alqudra/web
npm ci
npm run build
```

This produces `.next/standalone` (the server), `.next/static`, plus `public/` and `drizzle/`.

## 2. Copy to the VPS

```
/opt/alqudra/
  docker-compose.yml        <- deploy/docker-compose.yml
  .env                      <- from deploy/env.production.example (chmod 600)
  web/
    Dockerfile              <- web/Dockerfile
    .dockerignore           <- web/.dockerignore
    .next/standalone/  .next/static/  public/  drizzle/
```

## 3. Configure `.env`

Fill `DB_PASSWORD` and `SESSION_SECRET` with long random values (`openssl rand -hex 32`),
and set `ADMIN_EMAIL` / `ADMIN_PASSWORD` for the first dashboard user (a real mailbox and a
strong password - not the local test login).

## 4. Start

```bash
cd /opt/alqudra
docker compose build alqudra-web      # only copies files, no compiling
docker compose up -d
docker compose logs -f alqudra-web    # look for "Created the first dashboard user"
```

On start the app applies database migrations and loads the first-run content (texts from the
identity file, photos, services, gallery). Restarting never overwrites dashboard edits.
After the first user exists, blank `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.

## 5. Nginx Proxy Manager (port 81)

Add one proxy host: `alqudra-ec.com` and `www.alqudra-ec.com` -> `http://alqudra-web:3000`,
with *Websockets support* on, and in *Advanced*:

```
client_max_body_size 120m;
```

(otherwise video uploads in the dashboard fail). The dashboard login cookie is HTTPS-only in
production, so test the dashboard after SSL is issued (step 7).

## 6. DNS (cPanel at libyanspider -> Zone Editor for `alqudra-ec.com`)

- `A  @    -> 102.203.203.160` (now 102.213.180.4, the cPanel redirect)
- `A  www  -> 102.203.203.160` (now 178.18.242.177, the old server)
- `api` is no longer needed (the dashboard is at `www.alqudra-ec.com/admin`); it can stay
  pointing to the old server until that is retired.
- **Do not touch the MX records** (`mx1-mx4.secure.ly`) - company email depends on them.

## 7. SSL + checks

Request Let's Encrypt certificates in Nginx Proxy Manager for both hosts, with *Force SSL*. Then:

- `https://www.alqudra-ec.com` -> redirects to `/ar` or `/en` by browser language
- `https://www.alqudra-ec.com/admin` -> dashboard login
- Send a test message from the Contact page; it appears under Dashboard -> Messages.

## Day-to-day

- Content: **https://www.alqudra-ec.com/admin** - no deploy needed.
- Code change: rebuild on a PC (step 1), copy `web/`, then
  `docker compose build alqudra-web && docker compose up -d alqudra-web`.
- Backup: `docker compose exec alqudra-db pg_dump -U alqudra alqudra > alqudra-$(date +%F).sql`
  plus the `alqudra_uploads` volume.

## Local development

```bash
cd alqudra/web
npm install
npm run dev        # http://localhost:3000 (needs .env.local with DATABASE_URL, SESSION_SECRET)
```

Schema changes: edit `src/lib/db/schema.ts`, then `npx drizzle-kit generate` to add a migration.
