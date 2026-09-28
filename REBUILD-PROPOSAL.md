# Aaravya Hospital — Rebuild Proposal (v2)

> Prepared: 2026-09-15
> Purpose: advisory document on the proposed Supabase migration + full
> visual redesign, plus a step-by-step plan and a ready-to-use prompt for
> kicking off the rebuild in a fresh AI session. Nothing in the current
> repo has been changed as a result of this document — it's a proposal only.

---

## 1. Is switching to Supabase a good idea?

**Verdict: yes — but "remove everything database/backend" is the wrong
framing.** The right move is to stop *self-hosting* the backend, not to
throw out the parts that already work well.

| Piece | Keep or replace? | Reasoning |
|---|---|---|
| **Postgres** | Move hosting to Supabase | Currently self-hosted in Docker. Supabase is managed Postgres — free tier, backups, pooling built in. Removes the "who hosts the DB in prod" question the original project left open. |
| **Prisma (ORM/schema/migrations)** | **Keep** | Prisma works fine against a Supabase connection string (pooler URL for the app, direct URL for migrations — a standard, documented pattern). The existing schema is genuinely well-designed — it came from a real audit of the legacy static site's content. Rewriting it in raw SQL/PostgREST buys nothing and throws away a battle-tested schema. |
| **Storage** | **Adopt Supabase Storage — the real win here** | The current admin panel has **no image upload at all** — image fields are plain text URL inputs, so staff would have to hand-paste a URL. Since the client wants to upload doctor photos, gallery images, and testimonial media directly from the admin panel, this is a genuine gap today, and Supabase Storage (buckets + signed uploads + CDN) is the standard fix. |
| **Auth** | **Replace Auth.js Credentials with Supabase Auth** | Current setup hand-rolls an admin-users table + bcrypt + Auth.js. Supabase Auth gives password reset, multiple staff logins, and session handling for free, removing code you'd otherwise maintain. Not mandatory, but worth standardizing on one auth system while rebuilding anyway. |

**Bottom line:** Next.js + Prisma + Supabase-hosted Postgres + Supabase
Storage/Auth + Vercel is a common, low-maintenance production pattern for
exactly this kind of site. No red flags. The recommended tech stack table
from the brief is good as-is — just note internally that Prisma stays as
the data-access layer on top of Supabase's Postgres, with `supabase-js`
used specifically for Storage and Auth.

---

## 2. Is the full redesign + animation push a good idea?

**Verdict: yes, good instinct — with one caveat.** The current site is
functionally complete but visually plain (utilitarian Tailwind/shadcn, no
motion). Wanting a more polished, animated experience is reasonable, and:

- `framer-motion` is **already a dependency** in the old project — it was
  installed but never actually used for page-level animation. This is
  additive work, not a new library decision.
- **No Figma/spec is a real risk for a multi-page redesign done blind.** An
  agent redesigning ~25 pages in one uninterrupted pass with no visual
  reference tends to drift — inconsistent spacing, competing motion styles,
  accessibility misses (`prefers-reduced-motion`), and can quietly tank
  Core Web Vitals (LCP/CLS) if animation is applied carelessly to
  above-the-fold content. SEO/CWV was a stated priority in the original
  build — don't regress it.

**Recommendation:** establish a design system first — tokens, a motion-
preset library, and one or two fully polished "hero" pages (Home + one
Condition page) — and get sign-off on that before rolling it out to every
other page. Baked into the step-by-step plan and the prompt below.

---

## 3. New repo or new branch?

**Recommendation: fresh repo, not a branch.**

- The existing repo's `main` has `.env` committed in its history. Values
  are dev-only today, but that history persists on `main` forever unless
  it's rewritten (`git filter-repo` / BFG) — itself a risky, disruptive
  operation.
- Only 3 commits exist total — there's no meaningful history to preserve.
- This is the ground-floor moment of the project — a new repo lets good
  hygiene start from commit #1 (proper `.gitignore`, no secrets ever
  committed) instead of retrofitting it.
- **Keep the old folder around locally as reference-only** — you'll want to
  pull from `prisma/schema.prisma`, `prisma/seed-data/*.json` (already-
  extracted legacy content), and `src/lib/schema.ts` (JSON-LD generation
  approach). Don't delete it, just don't build new work on top of its git
  history.

---

## 4. Step-by-step plan

**Phase 0 — Decide & set up**
1. Create the new GitHub repo, new Supabase project, new Vercel project.
2. Lock a design direction: gather 2–3 reference hospital/clinic sites for
   *feel* (motion, spacing, tone) — far more useful to an agent than "make
   it more attractive."
3. Decide the doctor public/private field split concretely (e.g. bio,
   qualifications, photo = public; internal notes, direct contact = staff-
   only) — the current schema has no such split, it needs a new field.

**Phase 1 — Foundation**
4. Scaffold Next.js (App Router) + TypeScript + Tailwind v4 + shadcn/ui.
5. Port `prisma/schema.prisma` over, adding: image fields as Supabase
   Storage paths/URLs, a public/private split on `Doctor`, an
   `isPublished`/ordering field per category for header nav.
6. Point Prisma at Supabase Postgres (pooler URL + direct URL). Run
   migrations.

**Phase 2 — Content migration**
7. Reuse `prisma/seed-data/*.json` (already extracted from the old static
   HTML) as the seed source — don't re-extract from HTML by hand.
8. Seed Supabase.

**Phase 3 — Supabase Auth + Storage**
9. Wire Supabase Auth for `/admin` login (replaces Auth.js).
10. Create Storage buckets (doctors, conditions, gallery, testimonials) and
    build a real upload component (file picker → signed upload → store the
    path).

**Phase 4 — Admin panel**
11. Rebuild CRUD for every resource with real image upload, category-aware
    treatment management (new treatments/categories reflect in the header
    nav automatically), FAQ/gallery/testimonial management, doctor
    public/private fields.

**Phase 5 — Public site redesign**
12. Design system pass first (tokens, motion presets) on Home + one
    Condition page → get sign-off.
13. Roll the approved system out to every remaining page.

**Phase 6 — SEO/GEO + analytics**
14. Port the JSON-LD approach, Metadata API, sitemap/robots, GA4 + Search
    Console.

**Phase 7 — Forms**
15. Booking, anonymous consultation, contact — Supabase writes + email
    (Resend or SMTP) notifications.

**Phase 8 — QA + deploy**
16. Accessibility + performance pass (reduced-motion, Core Web Vitals),
    then deploy to Vercel, connect the existing domain.

---

## 5. Ready-to-use prompt for a fresh AI session

Fill in the two bracketed spots (old-repo path, doctor public/private field
list) before sending this.

```
I'm rebuilding a hospital website (Aaravya Hospital, a proctology/general
surgery clinic) from the ground up in a brand-new repository. There is a
previous, mostly-complete implementation I'm treating as reference material
only — do not build on top of its git history, but you should read from it.

## Reference material (read, don't copy blindly)
- Previous implementation: [path to old repo, e.g. ../Aaravya-old]
  - `prisma/schema.prisma` — a solid, already-audited data model. Use it as
    the starting point, not something to redesign from scratch.
  - `prisma/seed-data/*.json` — real content already extracted from the
    original static HTML site. Reuse this rather than re-extracting.
  - `src/lib/schema.ts` — JSON-LD/structured-data generation approach, worth
    preserving (it derives structured data straight from DB fields so it
    can't drift from visible content).
  - `PROJECT_OVERVIEW.md` — a handoff doc describing what that build covered
    and its known gaps (no image upload in the admin panel, no doctor
    public/private field split, admin auth is hand-rolled).
- Original static site (if available): [path] — source of truth for legacy
  page copy where the seed JSON doesn't already cover it.

## What's changing vs. the old implementation
1. **Backend/hosting**: move to Supabase (managed Postgres, Storage, Auth)
   instead of self-hosted Docker Postgres + Auth.js. Keep Prisma as the ORM/
   migration tool on top of Supabase's Postgres (pooler URL for the app,
   direct URL for migrations) — do not hand-write raw SQL/PostgREST calls
   for things Prisma already does well. Use `supabase-js` specifically for
   Storage (image uploads) and Auth (admin login).
2. **Image uploads**: the old admin panel had text-only URL fields for
   images — there was no real upload capability. Build real upload
   (Supabase Storage buckets, one per content type: doctors, conditions/
   treatments, gallery, testimonials) with signed uploads from the admin UI.
3. **Doctor public/private split**: add a real field-level split — public
   fields (name, photo, qualifications, bio, specializations) render on the
   public site; private/internal fields (e.g. internal notes, direct
   contact) are admin-only. [Fill in your exact field list here before
   handing this prompt over.]
4. **Dynamic category-aware navigation**: treatments/conditions are grouped
   by category in the data model already (see the old `ConditionCategory`
   enum and `getConditionsGroupedByCategory` query) — the header nav should
   be generated from this live data, so a new treatment or category added
   in the admin panel appears in the header without a code change.
5. **Visual redesign with real motion**: `framer-motion` should be used for
   real this time — scroll reveals, hover/tap micro-interactions, page-level
   transitions. Respect `prefers-reduced-motion`. Do not let animation hurt
   LCP/CLS — this site cares about SEO and Core Web Vitals.

## How I want you to work — staged, not one giant blind pass
Do NOT attempt to build the entire site in one uninterrupted pass. Work in
checkpoints and stop for my review at each one:

1. **Plan first.** Propose the updated Prisma schema (diffed against the old
   one), the Supabase project structure (buckets, auth setup), and folder
   structure. Get my sign-off before writing code.
2. **Foundation.** Next.js + TS + Tailwind v4 + shadcn/ui scaffold, Prisma
   schema + migrations against Supabase, seed script reusing the old seed
   JSON. Verify locally end-to-end (migrate, seed, dev server up, a page
   rendering real data) before moving on.
3. **Design system pass — ONE page first.** Build a home page and one
   condition detail page to full visual/animation polish. Stop and show me
   before touching any other page. This is the template every other page
   will follow — get it right once, not wrong 25 times.
4. **Admin panel core**: Supabase Auth login, then CRUD + real image upload
   for one resource (Doctors) end-to-end as the reference pattern. Stop and
   show me before replicating it to every other resource.
5. **Roll out** the approved design system and admin CRUD pattern to every
   remaining public page and admin resource (conditions, procedures, FAQs,
   testimonials, gallery, blog, cost estimator, locations, settings).
6. **Forms**: booking, anonymous consultation, contact — Supabase writes +
   email notifications.
7. **SEO/GEO**: Metadata API, JSON-LD per page type, sitemap.xml, robots.txt,
   GA4 + Search Console verification.
8. **QA pass**: accessibility (including reduced-motion), performance
   (Core Web Vitals), full route sweep, before I deploy to Vercel.

At the end of each stage, give me a short summary of what's done and
explicitly ask before starting the next stage.

## Constraints
- Public site content is Indian-hospital-appropriate, plain-language, not
  overly clinical — follow the tone already established in the old seed
  content.
- Keep the "structured data can't drift from visible content" principle:
  generate JSON-LD from the same DB fields the page renders.
- No secrets ever committed to git. `.env.example` only, real `.env` stays
  gitignored from commit #1.
- Deployment target is Vercel with an existing domain — keep that in mind
  for any framework-specific choices.

Start with step 1: propose the schema/project plan and wait for my sign-off.
```
