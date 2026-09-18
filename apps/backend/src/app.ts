import Fastify from "fastify";
import cookie from "@fastify/cookie";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./config/env.js";
import mongoPlugin from "./plugins/mongo.js";
import adminAuthPlugin from "./plugins/adminAuth.js";
import bookingRoutes from "./routes/bookings.js";
import contactRoutes from "./routes/contact.js";
import tourDatesRoutes from "./routes/tourDates.js";
import toursRoutes from "./routes/tours.js";
import galleryRoutes from "./routes/gallery.js";
import reviewsRoutes from "./routes/reviews.js";
import adminAuthRoutes from "./routes/admin/auth.js";
import adminBookingsRoutes from "./routes/admin/bookings.js";
import cors from "@fastify/cors";


export function buildApp() {
  const app = Fastify({
    logger: true,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(cors,{
    origin:env.frontendOrigin,
    credentials:true
  })

  app.register(cookie, { secret: env.sessionSecret });
  app.register(mongoPlugin);
  app.register(adminAuthPlugin);
  app.register(bookingRoutes);
  app.register(contactRoutes);
  app.register(tourDatesRoutes);
  app.register(toursRoutes);
  app.register(galleryRoutes);
  app.register(reviewsRoutes);
  app.register(adminAuthRoutes);
  app.register(adminBookingsRoutes);

  app.get("/api/health", async () => {
    return { status: "ok" };
  });

  return app;
}
