import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const proxy = async (request: NextRequest) => {
  const protectedPaths = ["/profile", "/admin", "/favorites", "/cart"];
  const isPathProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (isPathProtected) {
    try {
      const sessionCookie =
        request.cookies.get("better-auth.session_token") ||
        request.cookies.get("session");

      if (!sessionCookie)
        return NextResponse.redirect(new URL("/", request.url));
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*"],
};
