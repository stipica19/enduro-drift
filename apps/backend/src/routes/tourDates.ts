import type { FastifyPluginAsync } from "fastify";
import { isTourDateAvailable } from "../services/bookingService.js";

const tourDatesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/api/tour-dates", async () => {
    // Termin nestaje čim tura krene — tura koja je u toku se više ne nudi, a onaj koji
    // kreće ove sedmice ostaje vidljiv do svog polaska.
    const tourDates = await fastify.mongo.db
        .collection("tourDates")
        .find({ startDate: { $gte: new Date() } })
        .sort({ startDate: 1 })
        .toArray();


    return tourDates.map((td) => ({
      _id: td._id.toString(),
      number: td.number,
      season: td.season,
      startDate: td.startDate,
      endDate: td.endDate,
      available: isTourDateAvailable(td.capacity, td.bookedCount),
    }));
  });
};

export default tourDatesRoutes;
