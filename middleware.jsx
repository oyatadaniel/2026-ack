import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Token is valid here (withAuth already verified it)
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Protect all routes starting with /dashboard
        if (pathname.startsWith("/dashboard")) {
          // No token OR expired token → deny access
          // withAuth/JWT decode handles expiry automatically:
          // an expired token returns `null` here.
          if (!token) return false;

          // Double-check expiry (in case of a custom exp claim)
          const exp = token.exp;
          if (exp && Date.now() >= exp * 1000) {
            return false; // expired
          }

          return true;
        }

        // Allow everything else
        return true;
      },
    },
    pages: {
      signIn: "/authentication/signin", // redirect unauthenticated/expired users here
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
