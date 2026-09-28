import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Verifies the admin's session on every request under the proxy's matcher
 * and redirects logged-out visitors to /admin/login (and logged-in
 * visitors away from /admin/login). Deliberately uses `getClaims()` rather
 * than `getSession()` or `getUser()`: it verifies the JWT's signature
 * locally and transparently refreshes an expired token, which is Supabase's
 * currently-recommended way to gate routes in middleware — `getSession()`
 * just reads the cookie without verifying it (forgeable), and `getUser()`
 * is meant for fetching user data, not for the security check itself.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = !!data?.claims;
  const isOnLogin = request.nextUrl.pathname === "/admin/login";

  if (!isLoggedIn && !isOnLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && isOnLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}
