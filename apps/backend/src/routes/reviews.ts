import type { FastifyPluginAsync } from "fastify";

const reviewsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/api/reviews", async () => {
    const reviews = await fastify.mongo.db
      .collection("reviews")
      .find({ isVisible: true })
      .sort({ date: -1 })
      .toArray();

    return reviews.map((r) => ({
      name: r.name,
      city: r.city ?? null,
      text: r.text,
      rating: r.rating ?? null,
      date: r.date,
    }));
  });
};

export default reviewsRoutes;
