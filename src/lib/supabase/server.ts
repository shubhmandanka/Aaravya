import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase client for use in Server Components, Server Actions, and Route
 * Handlers. Reads/writes the auth session via Next.js's cookie store.
 *
 * `setAll` can throw when called from a Server Component (cookies are
 * read-only there mid-render) — that's fine, since `updateSession` in
 * `src/lib/supabase/middleware.ts` already refreshes the session on every
 * request before a Server Component ever renders, so we just swallow it
 * rather than crash the render.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — ignore; middleware handles
            // session refresh for us.
          }
        },
      },
    }
  );
}
