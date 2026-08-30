import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { getBankBySlug } from "@/lib/banks";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { bank, password } = body;

  if (!bank || !password) {
    return NextResponse.json(
      { error: "Missing bank or password" },
      { status: 400 }
    );
  }

  const bankConfig = getBankBySlug(bank);
  if (!bankConfig) {
    return NextResponse.json({ error: "Unknown bank" }, { status: 404 });
  }

  const expectedPassword = process.env.GLOBAL_PASSWORD || "1234";

  if (password !== expectedPassword) {
    return NextResponse.json(
      { error: "Invalid access code" },
      { status: 401 }
    );
  }

  const token = await createToken(bank);

  const response = NextResponse.json({ success: true });
  response.cookies.set(`teaser_${bank}`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
