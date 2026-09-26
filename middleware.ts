import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Route protection middleware powered by NextAuth.
 * Intercepts requests to protected path matches and redirects
 * unauthenticated visitors to the sign-in page with callback URL preservation.
 */
export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  },
);

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/settings/:path*", "/api/dashboard/:path*"],
};
