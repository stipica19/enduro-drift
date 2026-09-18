import { Resend } from "resend";
import { env } from "../config/env.js";

// Lazy: Resend baca ako je ključ prazan. Kad se instancira na top-levelu, nedostajuća
// RESEND_API_KEY ruši CIJELI server pri startu (i lokalno i u CI-ju), a ne samo rute
// koje šalju mail.
let client: Resend | null = null;

export function getResend() {
  if (!client) {
    client = new Resend(env.resendApiKey);
  }
  return client;
}
