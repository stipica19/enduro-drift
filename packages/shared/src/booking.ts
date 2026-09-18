import { z } from "zod";

export const createBookingSchema = z.object({
  tourId: z.string(),
  tourDateId: z.string(),
  bookingType: z.enum(["join", "private"]),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().optional(),
    country: z.string().optional(),
  }),
  participants: z.number().int().min(3),
  arrivalMethod: z.string().optional(),
  rentBike: z.boolean().optional(),
  message: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
