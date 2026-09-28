# Automation Run Report

Unattended run, 25 Sept 2026, on branch `redeveloping-aaravya`. Covers the rest of Part 4 (admin QA) and Client Changes Round 1. Everything marked *verified* was checked against a local **production build** (`next build` standalone), not just the dev server. The public pages are statically prerendered in production, so only a production build shows whether an admin edit actually reaches visitors.

## Deployment status: live and verified

| | |
|---|---|
| **Now live** | `dpl_G3JAgsDYdD28oJp3JkHwnnfS4Tma` (`aaravya-ajqt54tr3-shubham-mandankas-projects.vercel.app`), Round 2 + soft-404 fix, commit `007aefe`, aliased to **https://aaravya.vercel.app** |
| **Previous production** | `dpl_4wHMP277vMLMtVSwZgWkbvKazuG7` (`aaravya-gvt2uga7y-…`, Round 2 without the soft-404 fix). Before that: `dpl_CHbCh1JnfqtJP6c3e6Zddvd99UES` (Round 1). |
| **Branch** | `redeveloping-aaravya` on **github.com/shubhmandanka/Aaravya** (the authoritative repo; ownership was transferred from KavishEvil/Aaravya). |
| **Rollback, if ever needed** | `vercel rollback dpl_4wHMP277vMLMtVSwZgWkbvKazuG7`. No schema changes since, so it runs against the current database. |

**How it was deployed.**
- A preview deploy came first, checked page by page via `vercel curl`, then `vercel --prod`.
- Both used `--build-env NEXT_PUBLIC_SITE_URL=https://aaravya.vercel.app`, because `.env` has `localhost` there, and that value feeds the sitemap, structured data and PDF.
- A new `.vercelignore` stops the CLI from uploading `aaravya_backup.dump` (a local DB backup that may contain patient data).

**Live checks passed (on https://aaravya.vercel.app).**
- All 17 public pages return 200 with the correct heading: `/`, `/conditions`, `/conditions/fissure`, `/treatments`, a procedure page, `/doctors`, a doctor page, `/blog`, `/testimonials`, `/gallery`, `/cost`, `/book`, `/faqs`, `/contact`, `/about`, `/anonymous-consultation`, `/symptom-checker`.
- The homepage condition photos load, the new nav links are present, and the estimator's 2-step flow gives the correct band and disclaimer.
- The booking handoff shows the estimate and disclaimer; `/cost/price-list.pdf` is served; the sitemap uses the real domain.
- `/admin` now redirects to the site's own `/admin/login` (the new Supabase form); the old NextAuth route returns 404.

## Needs my input

Items I couldn't or shouldn't resolve alone. Everything else is done.

1. **Sign in to the admin again.** A QA helper of mine submitted the sidebar "Sign Out" form by mistake, which ended the admin session. I don't enter passwords on your behalf, so the rest of the admin QA ran on an isolated QA copy with the auth check stubbed (see *How admin QA ran*). No data was affected. Once you're signed in, one quick real-login smoke test on the live site (edit something, check it on the public page) would close the loop.
2. **Production secrets live in an uploaded `.env` file, not in Vercel.** The Vercel project has **no environment variables**. Both the old and new deployments got their database and Supabase configuration because the CLI uploads the project's `.env`, which includes the Supabase service-role key. I kept that mechanism, since I don't enter secrets into dashboards. Recommended:
   - add the variables under Vercel → Project → Settings → Environment Variables (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, SMTP settings);
   - set `NEXT_PUBLIC_SITE_URL=https://aaravya.vercel.app` (or the real domain);
   - then add `.env*` to `.vercelignore`.
   Until then, **every future deploy must pass** `--build-env NEXT_PUBLIC_SITE_URL=https://aaravya.vercel.app`, or the sitemap and structured data will point to `localhost`.
3. **Booking emails don't send on the live site.** `.env` has `SMTP_HOST=localhost` (a local mail catcher). Bookings still save and appear in the admin inbox, but neither the coordinator notification nor the patient confirmation email is delivered. This needs real SMTP credentials.
4. **Review two Cost Estimator wording decisions** (details under *Cost Estimator overhaul*): the disclaimer text I wrote, and whether the tariff figures (30% OT charge, ₹8,000 laser surcharge, ₹3,000/₹5,000 anaesthesia) should be public.
5. ~~Review the PDF layout once.~~ No longer applicable: the PDF price list was removed in Round 2 at the client's request.
6. **Post-deploy clean-up, now safe that the old build is gone.** I didn't do these unattended because they're destructive:
   - drop the empty legacy `CostEstimatorRule` table;
   - delete the unused `phone`/`whatsapp`/`email` rows in `SiteSetting`.
7. **Content the client needs to supply.** These tables are intentionally empty:
   - Testimonials (written quotes), so the "What Our Patients Say" section stays hidden until then;
   - Health Library articles;
   - procedure images (the Surgical Techniques cards use condition photos meanwhile);
   - Location opening hours and Google Business link, which are stored but not shown anywhere yet (say if they should be).
8. **Optional:** fix the Docker dev file-watching staleness (see *Development-environment notes*).

---

## Part 4: Admin Panel QA

### How admin QA ran

- **Commits 1–4** (FAQs, Cost Rules, Locations + Site Settings, Appointments) were verified earlier on a production build with a real admin session.
- **Remaining six resources:** once the session ended, I copied the working tree to a throwaway folder outside the repo and stubbed `requireAdmin()` and the proxy there, gated on a `QA_AUTH_STUB=1` env var set only on that container. Then I ran a production build of the copy against the real Supabase database and storage.
- The stub never touched the repo, git, or any deploy: `grep QA_AUTH_STUB src` in the repo returns 0 matches.

### Resource results

| Resource | Result | Issues found and fixed |
|---|---|---|
| FAQs | ✅ Pass | Homepage FAQs and FAQs linked to a condition never refreshed in production (only `/faqs` was revalidated). No server-side validation. |
| Cost Rules | ✅ Pass *(later replaced by the new Cost Estimator)* | No min ≤ max check; `/cost` showed raw enum values (`CASHLESS`) in random order. |
| Locations | ✅ Pass | Several locations could be "primary" at once; the map embed URL (rendered as an iframe) wasn't validated; the primary location could be deleted, blanking the footer. |
| Site Settings | ✅ Pass | GTM/GA4 IDs were interpolated raw into inline scripts; a blank field stored `""`, which rendered empty `tel:`/`wa.me` links; 9 pages hardcoded the phone number. |
| Appointments | ✅ Pass | **Security:** booking emails put patient-supplied text into HTML unescaped, so the hospital's own mail server could be made to send phishing links to any address typed into the form. The inbox never showed the requested date/time/notes. Unvalidated dates and time slots were accepted. |
| Doctors | ✅ Pass | See the cross-cutting fixes below. |
| Conditions | ✅ Pass | **Deleting any real condition always failed** with a raw database error: all 21 have procedures (`ON DELETE RESTRICT`). Now it explains what's blocking the delete. |
| Procedures | ✅ Pass | Delete failed with a raw error when a cost rule referenced the procedure. Now it explains. Cost range and PDF URL validated. |
| Testimonials | ✅ Pass | YouTube ID and 1–5 rating were never validated. |
| Blog | ✅ Pass | None beyond the cross-cutting fixes. |
| Gallery | ✅ Pass | The "photo items need an image" error was invisible in production. |

**Checked per resource on the production build**, as scoped:
- one create → replace → delete cycle with a real image, including storage cleanup;
- site-wide propagation (e.g. a new doctor or condition appears in the nav on `/faqs`, `/gallery` and `/about`, not just its own page);
- visible error messages;
- deletion guards;
- duplicate-slug saves leaving no orphaned files.

All tables were returned to their baseline and all buckets were left empty afterwards.

### Cross-cutting fixes

- **Stale public site in production.** Every admin edit now calls `revalidatePublicSite()` (`revalidatePath("/", "layout")`). The header and footer on every page read conditions, doctors, the primary location and settings, so per-path lists kept missing pages. I first proved the bug on an unmodified production build.
- **Invisible errors.** Next.js hides thrown server-action messages in production, and the admin error screen never showed them anyway. Admins only ever saw "This page couldn't load". Actions now return `{ error }` for expected failures (validation, bad image, duplicate slug, blocked delete, already deleted), and `AdminForm` shows it inline without wiping what the admin typed.
- **Orphaned or broken images on a failed save.** The upload helper deleted the old image *before* the database write. So a failed edit (e.g. a duplicate slug) left the record pointing at a deleted image, and a failed create orphaned the new upload. `saveWithImage()` now deletes the old file only after the write succeeds, and removes the new one if the write fails. Both cases were verified on the production build.
- **Defence in depth.** Every admin action re-checks the Supabase session itself (`requireAdmin()`). A probe on the production build showed actions were already unreachable without a session (Next binds each action to the pages that use it, and the proxy gates `/admin`), but Next recommends checking inside the action.

### Decision: contact details have one source of truth

**Problem.** Phone, WhatsApp and email were stored twice, in Site Settings and on the primary Location. The header, footer and call buttons read Settings; `/contact` read the Location. Editing one silently left the site showing two different numbers.

**Decision.** The **primary Location** is now the single source of truth for phone, WhatsApp and email. **Site Settings** keeps only genuinely site-wide values: Instagram/Facebook links and the GA4/GTM IDs.

**Why.**
- These details belong to a physical location. If a second branch is ever added, it brings its own contact details; site-wide settings can't express that.
- The Location already has validated fields for all three.
- It's the smaller change: one admin screen to maintain instead of two that must be kept in sync.

**What changed.**
- `getContactDetails()` reads the primary Location, falling back to the original numbers if a field is blank.
- The phone/WhatsApp/email fields were removed from Site Settings, which now links to the Location for them.
- The Location form explains exactly where its fields appear.
- The old `phone`/`whatsapp`/`email` `SiteSetting` rows are no longer read but were left in place, because the old live build still reads them. They can be deleted after the new deploy.

**Verified.** Changing the Location phone on the production build updated the header, footer, `/contact`, `/cost` and the symptom-checker emergency button. Then it was restored.

---

## Client Changes Round 1

### Cost Estimator overhaul

**Built.**
- **Data model** (additive migration `20260925140000_add_cost_estimator`):
  - `CostCategory` (step 1), optionally linked to a condition so booking pre-selects it;
  - `CostTreatment` (step 2) with patient-friendly name, medical name, effectiveness, cost level, discomfort and recovery;
  - a `CostBand` enum, so a price can only be one of the four standardised ₹5,000 bands (₹29,999–₹34,999, ₹34,999–₹39,999, ₹39,999–₹44,999, ₹44,999–₹49,999) or "Consultation" / "After consultation". The ranges live only in `src/lib/cost-bands.ts`.
- **Seed data:** all 7 categories and 21 treatments, transcribed exactly from the client's docx (`src/content/cost-estimator.ts`). The seeding script `scripts/seed-cost-estimator.ts` is create-only, so it's safe to re-run against the live database and never overwrites admin edits.
- **`/cost`:**
  - the 2-step selector: category → treatment cards in the docx's card format → "Estimated Treatment Cost: ₹XX,XXX–₹XX,XXX* depending on procedure complexity";
  - "Book This Treatment", which pre-selects the condition and pre-fills the booking notes;
  - a full price-list table, the band legend and the brief's estimator note.
- **Admin:** `/admin/cost-estimator` replaces the old Cost Rules screens. Categories and treatments have full CRUD, with the band chosen from a dropdown of the standard bands only. There's a delete guard for categories that still have treatments, and a case-insensitive duplicate-name check.
- **Wording:** "Estimated Treatment Cost" is used everywhere a price appears. "Package"/"guaranteed" appear only in the negation "not a guaranteed package price".
- **Disclaimer:** shown visibly next to every displayed cost: estimator result, cards (asterisk), full list, PDF, booking banner, procedure pages.

**Verified on a production build.**
- All 21 treatments and bands match the docx.
- The 2-step flow and the booking handoff work.
- Editing a band updated `/cost` *and* the PDF.
- Create → public → delete of a test treatment.
- The category delete guard and the duplicate-name guard.
- Data restored to exactly the docx values afterwards.

**Decisions made on my own:**
- *Disclaimer text.* The brief asked for a "may be additionally applicable" disclaimer but didn't give exact words, so I wrote: "Estimated Treatment Cost only, not a guaranteed package price. OT charges, laser surcharge, anaesthesia, room/nursing, investigations and other applicable services may be additionally applicable. The final estimate is confirmed after clinical evaluation." Every item in it comes from the brief's own note.
- *Tariff figures shown publicly.* The brief's "Important Estimator Note" figures (30% OT charge, ₹8,000 laser surcharge, ₹3,000/₹5,000 anaesthesia) are shown under "What else may be applicable", reworded for patients but with unchanged numbers. If the client considers these internal, delete that paragraph in `src/content/cost-estimator.ts`.
- *Booking links for categories.* "Ksharsutra Wing" has no linked condition (it spans several). "Other Anal / Rectal Conditions" links to *Ano-Rectal Diseases*. The other five link to their obvious condition.
- *The descriptors* (effectiveness, discomfort, recovery) are shown as the brief gives them. The brief itself notes they're proposed website labels, not tariff figures.
- *The old `CostEstimatorRule` table* (0 rows) is left in place, because the old live build still queries it. It can be dropped in a follow-up migration once the new deployment is confirmed.

### Static PDF price list (removed in Round 2)

- **Where:** `/cost/price-list.pdf`, with download buttons in the `/cost` hero and above the full price list.
- **How:** generated from the same database rows as the page, using `pdf-lib`. It's `force-static`, so it's prerendered at build time and regenerated after any admin edit. It never goes stale, and that was verified (the edited band appeared in the PDF).
- **Font:** embedded Inter (SIL OFL 1.1, licence in `src/assets/fonts/OFL.txt`), because the standard PDF fonts have no ₹ glyph. The font files are traced into the standalone and Vercel output via `outputFileTracingIncludes`.
- **Verified by text extraction:** 2 pages, all 21 rows, ₹ rendering correctly. A visual check wasn't possible, because the browser pane downloads PDFs instead of displaying them. **Please open the PDF once to review the layout.**

### Navigation: Health Library and Surgical Techniques

- **Health Library** → the existing `/blog`, added to the desktop and mobile nav.
- **Surgical Techniques → a regrouped Procedures view at `/treatments`** (my call, as delegated). `/treatments` had no index page (it returned 404), so the 21 existing procedure pages could only be reached from inside condition pages. The new page lists every procedure, grouped by specialty, and links to its detail page.
  - I chose this over a new standalone page because it reuses real, already-reviewed content and invents no clinical copy.
  - Where a procedure has no image of its own (none do yet), its card shows the condition's photo.
  - Added to the sitemap.
- **Layout fix found in testing.** With 8 links, the desktop bar overflowed at 1024px: the Book button was pushed off-screen and a horizontal scrollbar appeared. The full bar now starts at 1280px (`xl`). Between 1024 and 1279px the menu button is shown, with the Book button still visible. Verified at 375, 1024 and 1280px.

### Disease / condition photos

- **Nothing was missing.** I checked all 21 conditions: every one has a real image in `public/legacy-assets/img/treatment/` (the files carried over from the original site). None needed a placeholder.
- The gap was that photos appeared only on each condition's own page. They're now also shown on the homepage condition cards, the `/conditions` listing, and the new Surgical Techniques cards.

### Development-environment notes (not bugs in the app)

- **Docker file-watch staleness.** This caused the recurring "stale module" problems since Part 2. Next's own docs say Docker Desktop on Windows "can delay or fail to propagate filesystem events" from a Windows-hosted bind mount. The fixes are environment choices: run `npm run dev` on the host, keep the project inside WSL 2, or use Docker Desktop synchronized file shares. Restarting the container is a workaround.
- **Corrupted `.next/dev/types/routes.d.ts`.** The dev server sometimes leaves this file corrupted, even on a fresh volume. Delete `.next/dev/types/{routes.d.ts,validator.ts}` and run `npx next typegen && npx tsc --noEmit`, the check Next 16 recommends. No volume reset is needed.

---

## Client Changes Round 2

25 Sept 2026. Four items, each verified on a local production build before deploying.

### 1. Fixed doctor order

- **Schema:** new `Doctor.sortOrder` (`Int`, default 0, indexed), added by the additive migration `20260926100000_add_doctor_sort_order`. The migration also backfills the order: Dr. Deep Prajapati = 1, Dr. Dipti Prajapati = 2, and any other doctors 3, 4, … by creation date. The seed sets the same values.
- **One ordering everywhere:** `DOCTOR_ORDER` in `src/lib/queries.ts` sorts by `sortOrder`, then `createdAt`. It's used by:
  - the public pages: homepage, `/doctors`, `/about`, booking form;
  - the admin: the doctors list, which gains an "Order" column, and every doctor dropdown (blog, conditions, procedures, testimonials).
- **Admin:** a new "Display order (optional)" field on the doctor form. If left blank for a new doctor, it's set to highest + 1, so the doctor is appended. Editing keeps the current position unless the field is changed. Values must be whole numbers, 0 or more.
- **Verified:**
  - The homepage and `/doctors` show Deep, then Dipti.
  - A temporary doctor created via the admin with the order left blank got order 3 and appeared third on both pages.
  - Changing it to 0 moved it first on both.
  - It was then deleted via the admin. It had no photo, so there was nothing to clean up in Storage. The DB is back to exactly Deep = 1 and Dipti = 2.

### 2. PDF price list removed

- **What was removed:**
  - the route `src/app/(site)/cost/price-list.pdf/route.ts`;
  - the embedded Inter fonts (`src/assets/fonts/`);
  - the `pdf-lib` and `@pdf-lib/fontkit` dependencies;
  - the `outputFileTracingIncludes` entry in `next.config.ts`;
  - both download buttons on `/cost`.
- **Nothing else to delete:** there were no PDF files in `public/` or in any Storage bucket. (The PDF was generated at build time, never stored.)
- **Verified:**
  - `/cost/price-list.pdf` now returns 404.
  - `/cost` has no PDF references.
  - The estimator (2-step flow), the 21-row price list, the bands table and the disclaimer are unchanged.
- **Unrelated, kept:** procedures still have their own optional `downloadablePdfUrl` field.

### 3. Footer location QR code

- **Target (confirmed by you):** Google Maps directions to the primary Location's address, `https://www.google.com/maps/dir/?api=1&destination=<address>`. It's built from the Location record, so an address change in the admin updates the QR code automatically.
- **How it's made:**
  - generated server-side with the `qrcode` library (`src/lib/location-qr.ts`), as inline SVG, while the static layout renders;
  - no third-party service, no client JavaScript;
  - forest-green modules on white (a phone camera needs the contrast, so it isn't inverted for the dark footer);
  - error-correction level L, which keeps the ~190-character URL at 49 modules; an on-screen code never gets physically damaged, so L is enough;
  - shown under "Get in Touch" at 112px, with the caption "Scan for directions / Opens Google Maps";
  - the tile is also a link, for desktop visitors.
- **Verified:**
  - The rendered SVG decodes (jsQR) to exactly the footer link.
  - Opening that link in a browser resolves Google Maps to the **Aaravya Hospital** business listing, with routes.
- **Optional improvement:** the destination is the address text, and Google matches it to the listing. For a pin that can never mis-resolve, send me the listing's Place ID and I'll add `destination_place_id`.

### 4. Dr. Deep Prajapati's new photo

- **Uploaded** through the same `saveWithImage()` path the admin's "Update Doctor" uses (validation, resize to WebP, EXIF stripped, Storage upload, then removal of the previous Storage file after the DB write). This ran via the new reusable script `scripts/replace-doctor-photo.ts`, because the browser pane can't attach local files to an upload field.
- **New file:** `doctors/6402454a-fa12-4712-a048-b1998c0e877b.webp` (1024×1536, 60 KB). It's now the only file in the `doctors` bucket.
- **The old photo wasn't in Storage.** It was the static file carried over from the legacy site (`assets/img/team/dr-deep.png`), so there was no Storage object to delete. The static file stays in `public/legacy-assets/`, because the seed data still references it.
- **Framing:** the new photo is portrait, and the doctor photo slots are square or round. Every doctor photo therefore now anchors to the top (`object-top`), so the head is never cropped. This affects six places:
  - the homepage cards;
  - `/doctors`;
  - the doctor profile page;
  - `/about`;
  - the reviewer avatars on condition pages and blog articles.
  Dr. Dipti's photo is unaffected.
- **Verified:**
  - The new photo renders, well framed, on the homepage, `/doctors`, `/doctors/dr-deep-prajapati` and `/about`.
  - None of those pages reference the old file any more.
  - The Physician JSON-LD `image` is the absolute Supabase URL.

### Soft 404s fixed (follow-up, before the custom domain)

- **The problem:** a missing doctor, condition, blog, procedure or anonymous-consultation page returned HTTP **200** (with the 404 page and a `noindex` tag) instead of a real 404.
  - The cause: `src/app/(site)/loading.tsx` and each listing's `loading.tsx` wrapped the detail routes in a Suspense boundary. The response started streaming before the page could call `notFound()`, and once streaming has started the status can't change (see Next's `loading.md`, *Status Codes*).
- **The fix:** check that the record exists before anything streams, while keeping every loading skeleton.
  - The homepage and each listing page (with its `loading.tsx`) moved into a route group: `(site)/(home)/`, `blog/(index)/`, `conditions/(index)/`, `doctors/(index)/`, `treatments/(index)/`, `anonymous-consultation/(index)/`. URLs are unchanged, and the listing skeletons now wrap only their own page.
  - Each detail route has a new `[slug]/layout.tsx` (`[category]` for anonymous consultation) that calls `notFound()` if the record doesn't exist. It sits above that route's own `loading.tsx`.
  - It uses the same `cache()`'d lookup as the page, so there's no extra database query. It runs only when a page is built or revalidated, never on each request.
- **Rejected alternatives:**
  - *Checking in the proxy:* a database hit on every request, which undoes static serving.
  - *`dynamicParams = false`:* a doctor, condition or procedure added in the admin would 404 until the next redeploy.
- **Verified on a production build:**
  - Missing slugs on all five detail routes return **404**, with the site header, footer and `noindex`. Unknown top-level paths return a 404 as before.
  - All 67 existing public pages and all 64 sitemap URLs return 200.
  - The build route table is unchanged: listings static, detail pages prerendered, and existing pages still served from cache (`x-nextjs-cache: HIT`).
  - **Admin lifecycle:** a slug requested before it existed returned 404, and that 404 was cached. After creating a doctor with that slug in the admin, it returned 200 and appeared on `/doctors`. After deleting the doctor, it returned 404 again.
  - Client-side navigation (no full reload) works across the moved routes: home, doctor page, condition page, blog listing, and back home.

### Round 2 deployment

- **Process:** the same as before. A preview (`aaravya-fy5r4myx8-…`) was checked first, then promoted with `vercel deploy --prod`, using `--build-env NEXT_PUBLIC_SITE_URL=https://aaravya.vercel.app`.
- **Live checks passed (on https://aaravya.vercel.app):**
  - All 17 public pages, `/admin/login` and `/sitemap.xml` return 200.
  - `/cost/price-list.pdf` returns 404; `/cost` has 21 price rows and no PDF links.
  - The homepage and `/doctors` show Deep, then Dipti.
  - The new photo appears on the homepage, `/doctors` and his profile, and in the JSON-LD `image`, with no references to the old file.
  - The footer QR code decodes to the Google Maps directions link.
- **Not touched:** no domain or DNS work was done.
- **Soft-404 fix deployment:**
  - Verified on a preview (`aaravya-pxm8rqfzl-…`), then deployed to production with `vercel deploy --prod` (same `--build-env`).
  - **Live checks passed:**
    - missing slugs on all five detail routes return 404, with the site chrome and `noindex`;
    - unknown paths and `/cost/price-list.pdf` return 404;
    - all 64 sitemap URLs, `/book`, `/admin/login` and `robots.txt` return 200;
    - doctor order is unchanged (Deep, then Dipti).
