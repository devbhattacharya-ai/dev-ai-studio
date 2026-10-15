"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ownerToken,
  passwordMatches,
  sessionCookie,
  STUDIO_COOKIE,
  studioConfigured,
} from "@/lib/studio-gate";

export async function unlockStudio(_prev: { error: string } | null, formData: FormData) {
  if (!studioConfigured()) return { error: "Studio access is not configured yet." };
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) return { error: "That password is not right." };
  const jar = await cookies();
  jar.set(STUDIO_COOKIE, ownerToken(), sessionCookie());
  redirect("/studio");
}

export async function lockStudio() {
  const jar = await cookies();
  jar.set(STUDIO_COOKIE, "", sessionCookie(0));
  redirect("/studio");
}
