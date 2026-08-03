import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Route protection for /admin — first line of defense ONLY.
 * Real enforcement lives in requireStaff() (server) and RLS (database).
 *
 * Next.js 16: renamed from middleware.ts to proxy.ts (official convention);
 * runs on the Node.js runtime.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /design-lab is an isolated prototyping surface: it must never touch
  // Supabase and must not be wrapped in the production header/footer.
  // Tag the request so the root layout can render it standalone.
  if (pathname === "/design-lab" || pathname.startsWith("/design-lab/")) {
    const headers = new Headers(request.headers);
    headers.set("x-design-lab", "1");
    return NextResponse.next({ request: { headers } });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Public exceptions inside /admin
  const isException = pathname === "/admin/sign-in" || pathname === "/admin/not-configured";

  if (!url || !key) {
    // Supabase not configured: everything under /admin is unavailable.
    if (!isException) {
      return NextResponse.rewrite(new URL("/admin/not-configured", request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isException) {
    const signIn = new URL("/admin/sign-in", request.url);
    signIn.searchParams.set("next", pathname);
    return NextResponse.redirect(signIn);
  }
  if (user && pathname === "/admin/sign-in") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/design-lab/:path*", "/design-lab"],
};
