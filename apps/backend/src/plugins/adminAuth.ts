import fp from "fastify-plugin";
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    requireAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const adminAuthPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate("requireAdmin", async (request: FastifyRequest, reply: FastifyReply) => {
    const cookie = request.cookies.session;

    if (!cookie) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const { valid } = request.unsignCookie(cookie);

    if (!valid) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  });
};

export default fp(adminAuthPlugin);
