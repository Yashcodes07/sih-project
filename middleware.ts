import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Allow access to reports page for all authenticated users
    if (req.nextUrl.pathname === "/reports") {
      return;
    }
    
    // Restrict map and dashboard to officers only
    if (
      req.nextUrl.pathname.startsWith("/map") || 
      req.nextUrl.pathname.startsWith("/dashboard")
    ) {
      const token = req.nextauth.token;
      if (token?.role !== "officer") {
        return Response.redirect(new URL("/reports", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/map/:path*", "/dashboard/:path*", "/reports/:path*"]
};
