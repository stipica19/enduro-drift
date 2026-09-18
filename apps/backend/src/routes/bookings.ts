import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { ObjectId } from "mongodb";
import { createBookingSchema } from "shared";

const bookingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/api/bookings",
    { schema: { body: createBookingSchema } },
    async (request, reply) => {
      const tourDate = await fastify.mongo.db
        .collection("tourDates")
        .findOne({ _id: new ObjectId(request.body.tourDateId) });

      const booking = {
        ...request.body,
        tourNumber: tourDate?.number ?? null,
        status: "pending",
        internalNotes: "",
        createdAt: new Date(),
      };

      const result = await fastify.mongo.db.collection("bookings").insertOne(booking);

      reply.code(201);
      return { id: result.insertedId.toString() };
    },
  );
};

export default bookingRoutes;
