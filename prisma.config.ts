import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 removed the `directUrl` concept entirely (from both
// schema.prisma and this config's `datasource` option) — there is now only
// ONE connection string the CLI (`migrate`, `db pull`, etc.) ever uses:
// `datasource.url` here.
//
// That must be DIRECT_URL (Supabase's session-mode pooler, port 5432), NOT
// DATABASE_URL (the transaction-mode pooler, port 6543): transaction-mode
// PgBouncer doesn't support the extended query protocol Prisma's
// migrate/introspection engine needs, which is what made `db pull` hang
// indefinitely instead of failing with a clear error.
//
// The running app's own queries are entirely unaffected by this file — they
// go through the separate @prisma/adapter-pg driver adapter in
// `src/lib/prisma.ts`, which is given the pooled DATABASE_URL directly and
// is exactly what should keep using the pooler for normal query traffic.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
