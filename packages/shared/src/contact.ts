import { z } from "zod";

export const contactBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  lang: z.enum(["de", "en"]).optional().default("de"),
  honeypot: z.string().optional(),
  recaptchaToken: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactBodySchema>;
