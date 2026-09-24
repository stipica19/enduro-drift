import { z } from "zod";

// Za gornje granice vidi komentar u booking.ts. recaptchaToken je Googleov token (može biti
// nekoliko kilobajta), zato ima puno veću granicu od ostalih polja.
export const contactBodySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  message: z.string().min(1).max(2000),
  lang: z.enum(["de", "en"]).optional().default("de"),
  honeypot: z.string().max(100).optional(),
  recaptchaToken: z.string().max(5000).optional(),
});

export type ContactInput = z.infer<typeof contactBodySchema>;
