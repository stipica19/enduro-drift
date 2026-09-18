import { env } from "../config/env.js";

interface VerifyResult {
  ok: boolean;
  skipped: boolean;
}

export async function verifyRecaptcha(token: string | undefined, ip: string): Promise<VerifyResult> {
  if (!env.recaptchaSecretKey) {
    // Nije konfigurisano (npr. lokalni dev bez ključeva) — ne blokiraj slanje, samo preskoči provjeru.
    return { ok: true, skipped: true };
  }

  if (!token) {
    return { ok: false, skipped: false };
  }

  const params = new URLSearchParams();
  params.append("secret", env.recaptchaSecretKey);
  params.append("response", token);
  if (ip) params.append("remoteip", ip);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const json = (await res.json()) as { success: boolean; score?: number };
  const ok = json.success && (typeof json.score !== "number" || json.score >= 0.5);

  return { ok, skipped: false };
}
