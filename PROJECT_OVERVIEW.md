# Aaravya Hospital — Project Handoff / Context Doc

> Purpose: onboard a new developer or a fresh AI agent onto this codebase fast.
> This file summarizes **what exists today** (verified against the actual code,
> not just the original plan) and where the gaps are. For narrative history and
> the original feature brief, see `README.md` — that file tracks build steps
> chronologically; this file is the current-state snapshot.
>
> Last verified: 2026-09-14, against commit `5a49aff`.

## 1. What this is

A single Next.js 16 app for Aaravya Hospital (proctology/general surgery clinic,
Ahmedabad) that replaces a static HTML site with a database-backed public site
+ an admin CMS. Public site: doctors, conditions, procedures, FAQs, testimonials,
gallery, blog, contact/cost pages, a unified booking system, an anonymous
video-consultation funnel, and a rule-based symptom checker + chat widget.
Everything is server-rendered straight from Postgres via Prisma — no headless
CMS, no separate backend.

Full narrative build log (what was done in what order, and why) lives in
`README.md`. Read this file first for orientation, then `README.md` for detail
on a specific feature's history.

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.3.5 (App Router, RSC, TypeScript) — **note: `middleware.ts` is renamed to `src/proxy.ts` in this version; `export { auth as proxy }` is the convention here, not `export { auth as middleware }`** |
| React | 19.2.8 |
| Styling | Tailwind CSS v4 (CSS-first, no `tailwind.config.js` — see `src/app/globals.css`) + shadcn/ui (Radix-based) + Framer Motion |
| Database | PostgreSQL (local: Docker Compose, port 5433 host / 5432 in-container) |
| ORM | Prisma 7, `@prisma/adapter-pg` driver adapter, client generated to `src/generated/prisma` (gitignored — run `npx prisma generate` after install) |
| Auth | Supabase Auth (email/password), `@supabase/ssr` cookie-based sessions, gate lives in `src/lib/supabase/middleware.ts` (called from `src/proxy.ts`) matching `/admin/:path*`, checked via `supabase.auth.getClaims()` |
| Forms | react-hook-form + Zod on the **public-facing** forms (booking, anonymous request); admin CRUD forms use **plain `<form action={serverAction}>` + FormData parsing**, not react-hook-form — see §5 |
| Rich text | Tiptap (`@tiptap/react`, `starter-kit`) — installed but confirm current usage before assuming it's wired into a specific field |
| Email | Nodemailer → MailHog in dev (`src/lib/mailer.ts`) |
| Container | Docker Compose: `app` (Next dev server, hot-reload via bind mount), `db` (postgres:16-alpine), `mailhog` |

Read `node_modules/next/dist/docs/` before writing Next.js code that touches
routing, caching, or server actions — this Next.js version has real breaking
changes from what most training data assumes (per `AGENTS.md` at repo root).

## 3. Data model

Full source of truth: `prisma/schema.prisma`. Models: `Doctor`, `Condition`,
`Procedure`, `LocationLandingPage` (SEO city/keyword variants of a Condition),
`Faq`, `Testimonial`, `MediaItem` (gallery, one model + `category` enum),
`Appointment` (unified booking **and** anonymous requests via `isAnonymous`
flag — there is no separate anonymous-request table), `SymptomCheckSession`,
`BlogPost`, `CostEstimatorRule`, `Location`, `SiteSetting` (key/value store).
There is no `AdminUser` model — admin accounts live entirely in Supabase Auth,
outside Prisma's schema.

Seed data lives in `prisma/seed-data/*.json` (real content extracted from the
old static site) and is loaded by `prisma/seed.ts`. Admin login is provisioned
separately: `npx tsx scripts/create-admin-user.ts <email> <password>` creates a
real admin user via the Supabase Auth Admin API (requires
`SUPABASE_SERVICE_ROLE_KEY`).

## 4. Route map

```
src/app/
├── (site)/                 # public site — all server components, data via src/lib/queries.ts
│   ├── page.tsx                       home
│   ├── about/, doctors/, doctors/[slug]/, conditions/, conditions/[slug]/,
│   │   treatments/[slug]/, faqs/, gallery/, testimonials/, blog/, contact/,
│   │   cost/, privacy/
│   ├── book/                          unified booking form (react-hook-form + Zod + server action)
│   ├── anonymous-consultation/, anonymous-consultation/[category]/   consult funnel
│   └── symptom-checker/               4-question rule-based triage
├── admin/
│   ├── login/                         Credentials login
│   └── (dashboard)/                   auth-gated via src/proxy.ts
│       ├── page.tsx                   dashboard home
│       ├── appointments/              leads inbox, status updates
│       └── doctors/, conditions/, procedures/, faqs/, testimonials/,
│           blog/, cost-rules/, locations/, settings/    full CRUD, each with
│           list page.tsx + [id]/page.tsx + new/page.tsx + actions.ts + *-form.tsx
└── api/auth/[...nextauth]/route.ts
```

Every admin resource folder follows the **same shape**: `page.tsx` (list),
`new/page.tsx`, `[id]/page.tsx` (edit), `actions.ts` (server actions:
`create*`/`update*`/`delete*`, each does a Prisma call + `revalidatePath` for
both the admin list and the affected public route + `redirect`), and a
`*-form.tsx` client component. **Copy this pattern for any new admin
resource** — see `src/app/admin/(dashboard)/doctors/` as the reference
implementation.

## 5. Conventions worth knowing before touching code

- **Public forms** (booking, anonymous request): react-hook-form + Zod
  resolver, validation schemas in `src/lib/validations/`.
- **Admin forms**: plain HTML `<form action={serverAction}>` posting
  `FormData` directly to a `"use server"` action — no client-side validation
  library. Helper parsers (`linesToArray`, `toIntOrNull`, `toStringOrNull`)
  are re-declared per `actions.ts` file rather than shared — if you touch more
  than one of these files, consider extracting them to `src/lib`, but don't
  do it speculatively.
- Shared admin form UI chrome (`AdminFormShell`, `Field`, `ADMIN_INPUT_CLASS`)
  lives in `src/components/admin/form.tsx`.
- All read queries for the public site go through `src/lib/queries.ts` —
  prefer adding to/reusing that file over inlining new `prisma.*` calls in
  page components.
- JSON-LD/structured-data generators are in `src/lib/schema.ts`, generated
  directly from the same DB fields the page renders (deliberate — keeps
  structured data from drifting from visible content; preserve this when
  editing condition/doctor/procedure pages).
- `src/generated/prisma/` is gitignored and regenerated by `postinstall`
  (`prisma generate`) — never hand-edit it, and it's now excluded from
  ESLint (`eslint.config.mjs`) since it's third-party generated code.

## 6. Build status (verified 2026-09-14)

- `npx tsc --noEmit` — **clean.**
- `npx eslint .` — **clean** (one unused-var warning in
  `symptom-checker.tsx` for a `pain` state variable that's tracked but only
  passed through as a function arg — harmless, left as-is).
- Fixed during this review: a real `tsc` error in `admin-sidebar.tsx` (nav
  item union type didn't have `exact` on every member — now guarded with
  `"exact" in item`), and ESLint was linting the generated Prisma client
  (~350 errors) because `src/generated/**` wasn't in `eslint.config.mjs`'s
  ignore list — added.
- Not yet verified in this pass: `next build` (production build), and no
  automated test suite exists in the repo at all — manual/browser
  verification only, per the README's checklist.

## 7. Known issues / things to raise with the previous developer or client

- `.env` is git-ignored (`.env*` in `.gitignore`) and was scrubbed from git
  history after an earlier commit had included it — the tracked file is
  `.env.example` (placeholder values only). Real Supabase/DB/SMTP credentials
  live only in the untracked `.env` on each machine that runs this project.
- Admin accounts are provisioned directly in Supabase Auth (see "Data model"
  above) — there is no seeded credential to rotate. Before any real deploy,
  confirm every account in the Supabase project's Auth users list is one you
  actually intend to keep.
- No automated tests (unit or e2e) exist — all verification so far has been
  manual browser testing per the README checklist. If ownership is
  transferring, decide early whether to add a test harness.
- The README flags real unresolved content questions inherited from the old
  site: a postal-code vs. map-pin mismatch, two different Maps embed
  strings, and doctor fields (registration number, years of experience,
  consultation hours) that were never collected from the client — these are
  data/content gaps, not code bugs.
- Step 9 in the README ("full local QA pass") is marked incomplete — that's
  the actual next task, not new features, unless the client has changed
  priorities.

## 8. Running locally

The database is Supabase Postgres now, not a local container — `DATABASE_URL`
(transaction-mode pooler, port 6543) and `DIRECT_URL` (session-mode pooler,
port 5432) in `.env` point at the Supabase project. Real production data
lives there; it was migrated from the old local Docker Postgres via
`pg_dump`/`pg_restore` and its row counts have been verified to match,
table by table.

Docker is still used for two things: running the app itself (`app`
service — this also keeps native deps like `sharp` building against the
right platform inside the container, not your host), and MailHog for local
email testing. The `db` service (local Postgres) is no longer read by the
app at all — it's kept in `docker-compose.yml` purely as a convenient
Postgres-client toolbox (`psql`/`pg_restore` are preinstalled in that image)
for one-off admin operations against Supabase; it still starts with
`docker compose up` by default, but you can `docker compose stop db` if you
don't need it running.

```bash
docker compose up
docker compose exec app npx prisma migrate deploy   # only needed after a new migration is added
```
App: `http://localhost:3000` · Admin: `http://localhost:3000/admin` ·
MailHog UI: `http://localhost:8026` (compose maps host `8026`→container
`8025`; README's `8025` reference is stale).

`prisma db seed` is no longer part of normal setup — Supabase already holds
real data, not seed data. Only run it against a project you explicitly want
to reset to sample data.

Admin login has no seeded credential — provision it once per environment:

```bash
docker compose exec app npx tsx scripts/create-admin-user.ts you@example.com "a-real-password"
```

This calls the Supabase Auth Admin API (`SUPABASE_SERVICE_ROLE_KEY`, already in
`.env`) to create the user directly, `email_confirm: true` so there's no
verification-email step to wire up. Run it again with a different email to add
more admin users; there's no `/admin` self-registration flow.

## 9. Suggested first tasks for a new agent/developer

1. Run the verification checklist in `README.md` §10 end-to-end (Step 9,
   currently unchecked).
2. Decide on the `.env`-in-git question (§7) before any deploy work.
3. Everything else is additive from here — Phase 2 items (LLM chat, embedded
   video consult, live Google Reviews, multilingual toggle) are documented
   in `README.md` §8 and untouched so far.
