import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "baseops-teaser-default-secret-change-me"
);

const bankSlugs = new Set([
  "bmo", "citizens-bank", "columbia-bank", "fifth-third", "first-citizens",
  "chase", "keybank", "pnc", "pinnacle", "regions", "td-bank", "truist",
  "us-bank", "wells-fargo", "woodforest",
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /[bank]/view routes
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 2 || segments[1] !== "view") return NextResponse.next();

  const bankSlug = segments[0];
  if (!bankSlugs.has(bankSlug)) return NextResponse.next();

  const token = request.cookies.get(`teaser_${bankSlug}`)?.value;
  if (!token) {
    return NextResponse.redirect(new URL(`/${bankSlug}`, request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.bank !== bankSlug) {
      return NextResponse.redirect(new URL(`/${bankSlug}`, request.url));
    }
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL(`/${bankSlug}`, request.url));
    response.cookies.delete(`teaser_${bankSlug}`);
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|teasers).*)"],
};
