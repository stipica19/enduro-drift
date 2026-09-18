import type { FastifyPluginAsync } from "fastify";

const galleryRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/api/gallery", async () => {
    const images = await fastify.mongo.db
      .collection("gallery")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return images.map((img) => ({
      url: img.url,
      publicId: img.publicId ?? null,
    }));
  });
};

export default galleryRoutes;
