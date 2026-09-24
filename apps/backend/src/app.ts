import Fastify from "fastify";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
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
  // Bez tajne @fastify/cookie ne može potpisivati cookie, pa svaka admin prijava završi
  // sa 500 ("signer.sign is not a function"). Bolje je odmah pasti pri startu s jasnom
  // porukom nego imati server koji radi, a admin se ne može prijaviti.
  if (env.nodeEnv === "production" && !env.sessionSecret) {
    throw new Error(
      "SESSION_SECRET nije postavljen u .env — admin prijava ne može raditi. " +
        "Generiši ga s: openssl rand -base64 32",
    );
  }

  const app = Fastify({
    logger: true,
    // Fastify po defaultu prima 1 MB. Najveći legitiman zahtjev ovdje je kontakt forma s
    // reCAPTCHA tokenom (nekoliko KB), pa ogroman body odbijamo prije parsiranja i validacije.
    bodyLimit: 64 * 1024,
    // Backend je iza nginxa na hostu (vidi DEPLOY.md), pa bi bez ovoga svaki zahtjev imao
    // request.ip = 127.0.0.1: ograničenje prijava bi vrijedilo za sve zajedno, a reCAPTCHA bi
    // dobijala pogrešan remoteip. Vjerujemo X-Forwarded-For samo s loopbacka, tj. od tog nginxa.
    trustProxy: "127.0.0.1",
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(cors,{
    origin:env.frontendOrigin,
    credentials:true
  })

  // global: false — ograničenje se uključuje po ruti (za sada samo admin prijava, vidi
  // routes/admin/auth.ts). Brojači su u memoriji procesa; dovoljno je dok je jedan kontejner,
  // a restart ih resetira. Za više instanci trebao bi zajednički store (Redis).
  app.register(rateLimit, { global: false });

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
