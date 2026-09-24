import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { loginBodySchema } from "shared";
import { burnPasswordTime, verifyPassword } from "../../services/authService.js";
import { env } from "../../config/env.js";

const adminAuthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/api/admin/auth/login",
    {
      schema: { body: loginBodySchema },
      // Zaštita od pogađanja lozinke: najviše 10 pokušaja po IP-u u 15 minuta, pa 429.
      // Broj je namjerno takav da vlasnik smije pogriješiti nekoliko puta, a napadaču
      // je beskoristan (uz bcrypt cost 12 svaki pokušaj ionako traje stotinjak milisekundi).
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "15 minutes",
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const admin = await fastify.mongo.db.collection("adminUsers").findOne({ email });

      // Za nepostojeći email trošimo isto vrijeme kao za postojeći — inače se po brzini
      // odgovora može pogoditi koji email uopšte postoji, pa napadač nagađa samo lozinku.
      const passwordOk = admin
        ? await verifyPassword(password, admin.passwordHash)
        : await burnPasswordTime(password);

      if (!admin || !passwordOk) {
        fastify.log.warn({ ip: request.ip, email }, "Neuspjela admin prijava");
        return reply.code(401).send({ error: "Invalid credentials" });
      }

      reply.setCookie("session", admin._id.toString(), {
        signed: true,
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return { success: true };
    }
  );

  fastify.post("/api/admin/auth/logout", async (_request, reply) => {
    reply.clearCookie("session", { path: "/" });
    return { success: true };
  });
};

export default adminAuthRoutes;
