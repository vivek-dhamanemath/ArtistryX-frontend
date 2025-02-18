import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token"); // Get token from cookies

  if (!token && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/artist/:path*"], // Protect these routes
};
