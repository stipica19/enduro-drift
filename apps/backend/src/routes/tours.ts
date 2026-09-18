import type { FastifyPluginAsync } from "fastify";

interface ToursQuery {
  lang?: string;
}

const toursRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: ToursQuery }>("/api/tours", async (request) => {
    const lang = request.query.lang || "de";

    const tours = await fastify.mongo.db.collection("tours").find({ lang }).toArray();

    return tours.map((t) => ({ id: t._id.toString(), title: t.title }));
  });
};

export default toursRoutes;
