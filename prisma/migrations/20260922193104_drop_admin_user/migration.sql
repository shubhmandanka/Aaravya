-- Admin authentication has moved to Supabase Auth (see src/lib/supabase/),
-- which manages its own users entirely outside Prisma's schema/migrations.
-- The AdminUser model (and its AdminRole enum) is no longer referenced
-- anywhere in the application, so we drop them here rather than leaving a
-- dead table + enum behind.
DROP TABLE "AdminUser";
DROP TYPE "AdminRole";
