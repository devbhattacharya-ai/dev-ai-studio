import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const STUDIO_COOKIE = "studio_session";

export function studioConfigured() {
  return Boolean(process.env.STUDIO_PASSWORD && process.env.STUDIO_SECRET);
}

export function ownerToken() {
  return createHmac("sha256", process.env.STUDIO_SECRET ?? "")
    .update("devai-studio-owner")
    .digest("hex");
}

export function passwordMatches(input: string) {
  const expected = process.env.STUDIO_PASSWORD ?? "";
  if (!expected || !input) return false;
  const given = createHash("sha256").update(input).digest();
  const want = createHash("sha256").update(expected).digest();
  return timingSafeEqual(given, want);
}

export async function studioUnlocked() {
  if (!studioConfigured()) return false;
  const jar = await cookies();
  const value = jar.get(STUDIO_COOKIE)?.value ?? "";
  const expected = ownerToken();
  const given = Buffer.from(value);
  const want = Buffer.from(expected);
  if (given.length !== want.length) return false;
  return timingSafeEqual(given, want);
}

export function sessionCookie(maxAge = 60 * 60 * 24 * 400) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/studio",
    maxAge,
  };
}
