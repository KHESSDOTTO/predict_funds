import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LogInVerifyMiddleware } from "./middlewares/logInVerifyMiddleware";

// Import middlewares from different files and combine them in the main middleware file

export function middleware(req: NextRequest) {
  // Get URL of the request
  const { pathname } = req.nextUrl;

  // Start: Log In Middleware
  const isLoggedInPage = pathname.startsWith("/loggedin");

  if (isLoggedInPage) {
    return LogInVerifyMiddleware(req);
  }
  // End: Log In Middleware

  console.log("finished verification");
  return NextResponse.next();
}

export const config = {
  matcher: ["/loggedin/:path*"],
};
