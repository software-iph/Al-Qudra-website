# Thmanyah Sans (ALQUDRA identity font, Arabic)

The Arabic text on the website uses Thmanyah Sans (English uses Almarai). It is loaded with
`next/font/local` in `src/app/[lang]/layout.tsx` from the four files below.

**The font files are not in this repository.** The thmanyah licence does not allow uploading them
to any platform (GitHub included), so they are git-ignored. Copy them in yourself:

1. Download the family from thmanyah's official site (https://thmanyah.com) with a company email.
2. From the package, copy these four files from `thmanyahsans/woff2/` into this folder:
   - `thmanyahsans-Regular.woff2`
   - `thmanyahsans-Medium.woff2`
   - `thmanyahsans-Bold.woff2`
   - `thmanyahsans-Black.woff2`
3. Do not rename or modify them.

**The site will not build without them** (`npm run build` / `npm run dev` stop with a "font file
not found" error). Do this once on every machine that builds the site: each developer's computer
and the VPS (`/opt/alqudra/src/web/src/fonts/thmanyah/`). Ignored files survive `git pull`, so the
VPS only needs it once; `deploy/update.sh` checks for them before building.

Licence notes (thmanyah Font License, 2026):
- Websites may embed the font only "as part of a compiled, packaged, or obfuscated product".
  That is why the files live here, not in `public/`: Next.js builds them into hashed assets
  instead of serving them under a plain download path.
- Do not put these files in `public/`, offer them for download, upload them anywhere, modify or rename them.
- Ask thmanyah (ask@thmanyah.com) if you need anything the licence does not cover.
