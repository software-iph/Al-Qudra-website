# Alqudra - deployment to the company VPS

**Status: live** at http://102.203.203.160:3008 (domain not connected yet).

The site is one **Next.js** app (`web/`) that serves both the public website (`/ar`, `/en`)
and the dashboard (`/admin`), with **PostgreSQL** for content.

The VPS (`102.203.203.160`) hosts other live sites. Everything here only uses the
`alqudra-*` containers in `/opt/alqudra`. Never restart Nginx Proxy Manager, the Docker daemon,
or any other site's containers.

| Container     | Image                     | Purpose                               | Network         |
|---------------|---------------------------|---------------------------------------|-----------------|
| `alqudra-web` | built on the VPS from git | Website + dashboard (Node, port 3000) | proxy, internal |
| `alqudra-db`  | postgres:18-alpine        | Database                              | internal        |

Uploaded photos/videos live in the `alqudra_uploads` volume, the database in `alqudra_db`.

## Updating the site (normal workflow)

1. Push your changes to `main` on GitHub.
2. On the VPS:

   ```bash
   sh /opt/alqudra/update.sh
   ```

   It pulls the code, builds a new image on the VPS, and restarts only `alqudra-web`
   (database and uploads are kept). If the build fails, the running site stays as it was.

Content (texts, photos, services, jobs) is edited in the dashboard - no update needed.

## First-time setup (already done)

```
/opt/alqudra/
  .env            <- from deploy/env.production.example (chmod 600)
  src/            <- git clone https://github.com/software-iph/Al-Qudra-website.git
  update.sh       <- symlink to src/deploy/update.sh
```

In `.env` fill `DB_PASSWORD` and `SESSION_SECRET` with long random values (`openssl rand -hex 32`)
and `ADMIN_EMAIL` / `ADMIN_PASSWORD` for the first dashboard user, then run `sh /opt/alqudra/update.sh`
and start the database too: `docker compose --project-directory /opt/alqudra -f /opt/alqudra/src/deploy/docker-compose.yml up -d`.
On first start the app creates the tables and the first-run content; restarts never overwrite
dashboard edits.

## Nginx Proxy Manager (port 81)

Add one proxy host: `alqudra-ec.com` and `www.alqudra-ec.com` -> `http://alqudra-web:3000`,
with *Websockets support* on, and in *Advanced*:

```
client_max_body_size 120m;
```

(otherwise video uploads in the dashboard fail). The dashboard login cookie is HTTPS-only in
production, so test the dashboard after SSL is issued (see SSL below).

## DNS (cPanel at libyanspider -> Zone Editor for `alqudra-ec.com`)

- `A  @    -> 102.203.203.160` (now 102.213.180.4, the cPanel redirect)
- `A  www  -> 102.203.203.160` (now 178.18.242.177, the old server)
- `api` is no longer needed (the dashboard is at `www.alqudra-ec.com/admin`); it can stay
  pointing to the old server until that is retired.
- **Do not touch the MX records** (`mx1-mx4.secure.ly`) - company email depends on them.

## Switching from the test port to the domain

After the proxy host works, set `SITE_URL=https://www.alqudra-ec.com` in `/opt/alqudra/.env`
(this also makes the login cookie HTTPS-only), remove the `ports:` lines from
`deploy/docker-compose.yml`, push, and run `sh /opt/alqudra/update.sh`.

## SSL + checks

Request Let's Encrypt certificates in Nginx Proxy Manager for both hosts, with *Force SSL*. Then:

- `https://www.alqudra-ec.com` -> redirects to `/ar` or `/en` by browser language
- `https://www.alqudra-ec.com/admin` -> dashboard login
- Send a test message from the Contact page; it appears under Dashboard -> Messages.

## Day-to-day

- Content: **https://www.alqudra-ec.com/admin** - no deploy needed.
- Code change: push to GitHub, then `sh /opt/alqudra/update.sh` on the VPS.
- Backup: `docker exec alqudra-db pg_dump -U alqudra alqudra > alqudra-$(date +%F).sql`
  plus the `alqudra_uploads` volume.

## Local development

```bash
cd alqudra/web
npm install
npm run dev        # http://localhost:3000 (needs .env.local with DATABASE_URL, SESSION_SECRET)
```

Schema changes: edit `src/lib/db/schema.ts`, then `npx drizzle-kit generate` to add a migration.
