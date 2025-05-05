import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWTPayload } from "./utils/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = (await cookies()).get("auth-token")?.value;
  const payload = await verifyJWTPayload(token);

  if (!payload) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/dashboard",
};
