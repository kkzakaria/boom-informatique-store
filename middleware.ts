import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN"
        }

        // Protect dashboard routes (require authentication)
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }

        // Allow access to auth pages when not authenticated
        if (req.nextUrl.pathname.startsWith("/auth")) {
          return true
        }

        // Allow access to public routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
}