import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/admin/sign-in"]);
const isAdminPage = createRouteMatcher(["/admin(.*)"]);

// Optimistic redirect only; every admin Convex function re-checks the role.
export const proxy = convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const signedIn = await convexAuth.isAuthenticated();
  if (isSignInPage(request)) {
    if (signedIn) return nextjsMiddlewareRedirect(request, "/admin");
    return;
  }
  if (isAdminPage(request) && !signedIn) {
    return nextjsMiddlewareRedirect(request, "/admin/sign-in");
  }
});

export const config = {
  // Admin pages plus the Convex Auth API route; the public site skips the proxy.
  matcher: ["/admin/:path*", "/api/auth/:path*"],
};
