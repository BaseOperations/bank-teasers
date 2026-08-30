import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "baseops-teaser-default-secret-change-me"
);

export async function createToken(bankSlug: string): Promise<string> {
  return new SignJWT({ bank: bankSlug })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyToken(
  token: string
): Promise<{ bank: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { bank: string };
  } catch {
    return null;
  }
}
