import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.email().max(254),
  // Gornja granica je zaštita od ogromnog tijela zahtjeva, ne pravilo za lozinku.
  password: z.string().min(1).max(200),
});

export type LoginInput = z.infer<typeof loginBodySchema>;
