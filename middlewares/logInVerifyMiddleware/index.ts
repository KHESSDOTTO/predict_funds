import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function LogInVerifyMiddleware(req: NextRequest) {
  const tokenCookie = req.cookies.get("loggedInUser");
  const loginUrl = new URL("/login", req.url);

  // If token doesn't exist, redirect to login
  if (!tokenCookie) {
    console.log("No auth token found");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
