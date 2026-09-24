import { z } from "zod";

// Gornje granice su zaštita od zloupotrebe (npr. poruka od milion znakova), ne poslovno pravilo —
// zato su namjerno velikodušne. Ista ograničenja imaju i polja u formi (BookingForm.tsx),
// pa gost granicu vidi u browseru umjesto da dobije grešku tek nakon slanja.
export const createBookingSchema = z.object({
  tourId: z.string().max(30),
  tourDateId: z.string().max(50),
  customer: z.object({
    name: z.string().min(1).max(100),
    email: z.email().max(254),
    phone: z.string().max(30).optional(),
    address: z.string().max(200).optional(),
    country: z.string().max(60).optional(),
  }),
  participants: z.number().int().min(1).max(20),
  arrivalMethod: z.string().max(50).optional(),
  rentBike: z.boolean().optional(),
  message: z.string().max(2000).optional(),
  lang: z.enum(["de", "en"]).optional().default("de"),
  // Zaštita od botova, isto kao na kontakt formi: skriveno polje koje ljudi ne popunjavaju
  // i reCAPTCHA v3 token. Prijava je "skuplja" od poruke — zauzima mjesto na terminu.
  honeypot: z.string().max(100).optional(),
  recaptchaToken: z.string().max(5000).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
