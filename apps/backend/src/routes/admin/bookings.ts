import type { FastifyPluginAsync } from "fastify";

const adminBookingsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/api/admin/bookings",
    { preHandler: fastify.requireAdmin },
    async () => {
      return fastify.mongo.db
        .collection("bookings")
        .find()
        .sort({ createdAt: -1 })
        .toArray();
    }
  );
};

export default adminBookingsRoutes;
