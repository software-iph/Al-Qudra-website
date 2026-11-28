# Al-Qudra Engineering Consultancy - website + dashboard

- `web/` - Next.js app: public site (`/ar`, `/en`) and content dashboard (`/admin`), PostgreSQL via Drizzle.
- `deploy/` - Docker Compose setup and deployment guide for the company VPS (see `deploy/README.md`).

Local development: `cd web && npm install && npm run dev` (needs `web/.env.local` with `DATABASE_URL` and `SESSION_SECRET`).

## 2026 redesign (branch `redesign/brand-hero-2026`)

Follows the ALQUDRA Brand Guidelines v1.0 (Basalt · Limestone · Patina · Surveyor Amber, IBM Plex Sans / Plex Sans Arabic / Plex Mono) and the IPH Website Standards, Requirements Guide and Scorecard.

- **Home hero:** a scroll story around a 3D model of Golden Square (`web/public/hero/golden-square.glb`, Draco-compressed; decoder served locally from `web/public/draco/`). The headline is server-rendered HTML; three.js loads after first paint. A still image (dashboard → Images & videos → Hero still image) shows while it loads, without WebGL, and for reduced-motion visitors. All texts: dashboard → Texts → *Home page* and *Home: 3D hero story* (wrap words in `*stars*` to colour them).
- **Pages:** Home (short: 3D hero; a navy "profile" chapter that carries on from the hero with the company statement, a captioned figure photo and the three figures as a data sheet; the original 3D coverflow of team photos; contact). After the hero every chapter shares one index-rail grid (`web/src/components/site/Chapter.tsx`), About (story, what we do / services as scroll chapters with a pinned photo panel, how we work, video, mission & vision, numbers, Q³, values, strengths, goals, where we work), Careers, Gallery, Contact, Privacy policy, 404. Every page after its header uses the same numbered index-rail grid (`Chapter.tsx`: `ChapterGrid`, `ChapterIndex`, `RailLabel`, `SpecList`, `Figure`, `DataSheet`). About runs as seven chapters: story and facts, services, how we work and the film, mission and vision with the figures, the Q³ methodology and values, why ALQUDRA and strategic goals, where we work with IPH and the closing quote. Unknown addresses under /en or /ar show the branded 404 inside the site layout (`[lang]/[...rest]`). `/services` redirects to `/about#services`. There is no Projects page: ALQUDRA's projects are confidential.
- **Identity:** Navy #132D41 / Charcoal #2D2D2D base with a Patina accent; fonts Almarai (English) and Thmanyah Sans (Arabic, bundled with `next/font/local` from `web/src/fonts/thmanyah`). **The font files are not in GitHub** (the thmanyah licence forbids uploading them): copy the four woff2 files into that folder on every machine that builds the site, including the VPS, before building. Steps in `web/src/fonts/thmanyah/README.md`. Mission and vision use the identity wording.
- **IPH items added:** footer "A member of IPH Group" with the official IPH logo linking to iph-ly.com, legal name + automatic year, privacy policy page and consent checkboxes (checked on the server), job department and deadline (jobs close by themselves after the deadline), application status (new / reviewed / shortlisted / rejected), message status (new / replied), CVs limited to 5 MB, login lockout after 5 wrong attempts (15 minutes), automatic logout after 60 idle minutes (12 hours maximum), `sitemap.xml`, `robots.txt`, health check at `/api/health`.
- **Motion:** a navy loading curtain with the ALQUDRA symbol on first load and on every page change (`RouteCurtain`), navy sections whose content glides into place while the background stays still (`Sheet`), numbers that count up on a self-drawing rail. Scroll animations replay each time a section comes back into view. Visitors who ask for reduced motion get none of the movement.
- **Page header photos:** About, Careers, Gallery and Contact start with a plain navy placeholder (`web/public/images/placeholders/page-header.svg`). Replace each one from dashboard → Images & videos.
- **Database:** migration `web/drizzle/0003_redesign.sql` adds the new columns and, only where the old default text was never edited, replaces the hero headline with one that says what the company does. `0004_identity_texts.sql` does the same for the mission and vision, using the wording from the brand guideline.

### To confirm before launch (content, not code)
- Legal company name exactly as in the commercial register (Texts → Footer → Copyright line).
- Year founded (Texts → About page → Key facts, line "Founded:").
- The headline numbers (1,000+ projects, 200+ clients, 100+ engineers) confirmed by management.
- Privacy policy text and the Arabic copy reviewed by management / a native Arabic reader.
- Real social media links (Settings), only for active accounts.
