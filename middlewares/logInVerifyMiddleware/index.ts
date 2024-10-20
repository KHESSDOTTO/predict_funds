import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function LogInVerifyMiddleware(req: NextRequest) {
  const token = req.cookies.get("loggedInUser");

  // If token doesn't exist, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Continue to requested page if token is valid
  return NextResponse.next();
}
