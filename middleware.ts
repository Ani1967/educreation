import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const ROLE_HOME: Record<string, string> = {
  student: "/dashboard/student",
  parent:  "/dashboard/parent",
  mentor:  "/dashboard/mentor",
  admin:   "/dashboard/admin",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Public routes — always allow
  const publicPaths = ["/", "/login", "/signup", "/api/auth", "/api/bookings"];
  if (publicPaths.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // Not logged in → redirect to login
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = session.user?.role as string;

  // Logged-in user hitting /dashboard → redirect to their home
  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(ROLE_HOME[role] || "/login", req.url));
  }

  // Role-gate: /dashboard/admin only for admin, etc.
  if (pathname.startsWith("/dashboard/admin")  && role !== "admin")   return NextResponse.redirect(new URL(ROLE_HOME[role] || "/login", req.url));
  if (pathname.startsWith("/dashboard/mentor") && role !== "mentor" && role !== "admin") return NextResponse.redirect(new URL(ROLE_HOME[role] || "/login", req.url));
  if (pathname.startsWith("/dashboard/parent") && role !== "parent"  && role !== "admin") return NextResponse.redirect(new URL(ROLE_HOME[role] || "/login", req.url));
  if (pathname.startsWith("/dashboard/student") && role !== "student" && role !== "admin") return NextResponse.redirect(new URL(ROLE_HOME[role] || "/login", req.url));

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
