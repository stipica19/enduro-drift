import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { loginBodySchema } from "shared";
import { verifyPassword } from "../../services/authService.js";
import { env } from "../../config/env.js";

const adminAuthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/api/admin/auth/login",
    { schema: { body: loginBodySchema } },
    async (request, reply) => {
      const { email, password } = request.body;

      const admin = await fastify.mongo.db.collection("adminUsers").findOne({ email });

      if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
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

  fastify.post("/api/admin/auth/logout", async (request, reply) => {
    reply.clearCookie("session", { path: "/" });
    return { success: true };
  });
};

export default adminAuthRoutes;
