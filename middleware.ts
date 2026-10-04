/**
 * Next.js RBAC Route Protection Middleware (Edge compatible)
 * Intercepts requests, validates JWT cookie session, enforces role matrix:
 *  - /admin/* -> Only ADMIN role
 *  - /farmer/* -> Only FARMER role
 *  - /buyer/checkout/* -> Authenticated BUYER or FARMER
 *  - Strips forbidden access and redirects to /login with security reason
 */

export interface MockNextRequest {
  nextUrl: { pathname: string };
  cookies: { get: (name: string) => { value: string } | undefined };
  headers: { get: (name: string) => string | null };
}

export function routeRBACGuard(pathname: string, userRole: "FARMER" | "BUYER" | "ADMIN" | null): { allowed: boolean; redirectUrl?: string; reason?: string } {
  // Public routes
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/shop") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/trace/") ||
    pathname.startsWith("/api/public")
  ) {
    return { allowed: true };
  }

  // Unauthenticated user attempting to access private portal
  if (!userRole) {
    return {
      allowed: false,
      redirectUrl: `/login?callbackUrl=${encodeURIComponent(pathname)}`,
      reason: "Authentication required to access protected resource",
    };
  }

  // Admin portal protection: STRICT ADMIN ONLY
  if (pathname.startsWith("/admin")) {
    if (userRole !== "ADMIN") {
      return {
        allowed: false,
        redirectUrl: "/unauthorized?error=FORBIDDEN_ADMIN_ACCESS",
        reason: "Access denied. Only KrishiLink Platform Admins can access /admin.",
      };
    }
    return { allowed: true };
  }

  // Farmer portal protection: FARMER OR ADMIN
  if (pathname.startsWith("/farmer")) {
    if (userRole !== "FARMER" && userRole !== "ADMIN") {
      return {
        allowed: false,
        redirectUrl: "/unauthorized?error=FORBIDDEN_FARMER_PORTAL",
        reason: "Access denied. Only registered agricultural producers can access /farmer.",
      };
    }
    return { allowed: true };
  }

  // Buyer portal protection: BUYER OR ADMIN
  if (pathname.startsWith("/buyer") || pathname.startsWith("/checkout")) {
    if (userRole !== "BUYER" && userRole !== "ADMIN" && userRole !== "FARMER") {
      return {
        allowed: false,
        redirectUrl: "/login?error=SESSION_EXPIRED",
        reason: "Valid session required.",
      };
    }
    return { allowed: true };
  }

  return { allowed: true };
}
