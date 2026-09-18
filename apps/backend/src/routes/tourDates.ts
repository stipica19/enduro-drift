import type { FastifyPluginAsync } from "fastify";

const tourDatesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/api/tour-dates", async () => {
    const tourDates = await fastify.mongo.db
        .collection("tourDates")
        .find({ endDate: { $gte: new Date() } })
        .sort({ startDate: 1 })
        .toArray();


    return tourDates.map((td) => ({
      _id: td._id.toString(),
      number: td.number,
      season: td.season,
      startDate: td.startDate,
      endDate: td.endDate,
      available: td.capacity > td.bookedCount,
    }));
  });
};

export default tourDatesRoutes;
