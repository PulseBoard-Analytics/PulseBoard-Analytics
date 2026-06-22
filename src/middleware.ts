import NextAuth from "next-auth";
import { NextResponse } from "next/server";

// Lightweight auth config for Edge middleware — no Prisma, no bcrypt
const { auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token }) { return token; },
    session({ session }) { return session; },
  },
});

const PUBLIC_PATHS = ["/", "/auth/signin", "/auth/signup", "/auth/error", "/share"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (!req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/signin";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
