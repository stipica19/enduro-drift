import type { FastifyBaseLogger, FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { ObjectId } from "mongodb";
import { createBookingSchema } from "shared";
import { env } from "../config/env.js";
import { calculateStay } from "../services/bookingService.js";
import {
  buildBookingConfirmationEmail,
  buildBookingNotificationEmail,
} from "../services/bookingEmails.js";
import { fromWithName } from "../services/emailUtils.js";
import { getResend } from "../services/resend.js";
import { verifyRecaptcha } from "../services/recaptcha.js";

interface EmailPayload {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
}

// Mail je dodatak, ne uslov: prijava je već spremljena, pa greška pri slanju
// samo ide u log i ne ruši zahtjev (gost bi inače vidio grešku za prijavu koja postoji).
async function sendEmail(log: FastifyBaseLogger, payload: EmailPayload) {
  try {
    const { error } = await getResend().emails.send(payload);
    if (error) log.error({ err: error, to: payload.to }, "Slanje maila nije uspjelo");
  } catch (err) {
    log.error({ err, to: payload.to }, "Slanje maila nije uspjelo");
  }
}

const bookingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/api/bookings",
    { schema: { body: createBookingSchema } },
    async (request, reply) => {
      // honeypot i recaptchaToken su samo provjera — ne idu u bazu, zato ostatak ide odvojeno.
      const { honeypot, recaptchaToken, ...bookingInput } = request.body;
      const { tourId, tourDateId, customer, participants, arrivalMethod, message, lang } =
        bookingInput;

      // Honeypot: botovi popune skriveno polje koje ljudi ne vide — tiho "uspjeh", bez
      // zauzimanja mjesta na terminu, upisa u bazu i slanja emaila.
      if (honeypot) {
        reply.code(201);
        return { id: "" };
      }

      const recaptcha = await verifyRecaptcha(recaptchaToken, request.ip);
      if (!recaptcha.ok) {
        return reply
          .code(400)
          .send({ error: "reCAPTCHA-Überprüfung fehlgeschlagen.", code: "RECAPTCHA_FAILED" });
      }

      if (!ObjectId.isValid(tourDateId)) {
        return reply.code(400).send({ error: "Ungültiger Termin.", code: "INVALID_TOUR_DATE" });
      }

      const tourDates = fastify.mongo.db.collection("tourDates");
      const tourDate = await tourDates.findOne({ _id: new ObjectId(tourDateId) });

      if (!tourDate) {
        return reply.code(404).send({ error: "Termin nicht gefunden.", code: "TOUR_DATE_NOT_FOUND" });
      }

      const stay = calculateStay(tourId, new Date(tourDate.startDate));

      if (!stay) {
        return reply.code(400).send({ error: "Ungültige Tour-Art.", code: "INVALID_TOUR_TYPE" });
      }

      // Rezervacija mjesta jednom atomarnom operacijom (provjera + povećanje bookedCount),
      // da dvije istovremene prijave ne mogu zajedno preći kapacitet termina.
      const reserved = await tourDates.updateOne(
        {
          _id: tourDate._id,
          $expr: {
            $lte: [{ $add: [{ $ifNull: ["$bookedCount", 0] }, participants] }, "$capacity"],
          },
        },
        { $inc: { bookedCount: participants } },
      );

      if (reserved.modifiedCount === 0) {
        return reply
          .code(400)
          .send({ error: "Nicht genügend Plätze verfügbar.", code: "NOT_ENOUGH_SPOTS" });
      }

      const booking = {
        ...bookingInput,
        tourType: tourId,
        tourNumber: tourDate.number ?? null,
        checkInDate: stay.checkInDate,
        checkOutDate: stay.checkOutDate,
        status: "pending",
        internalNotes: "",
        createdAt: new Date(),
      };

      let insertedId: ObjectId;
      try {
        const result = await fastify.mongo.db.collection("bookings").insertOne(booking);
        insertedId = result.insertedId;
      } catch (err) {
        // Prijava nije spremljena — vrati rezervirana mjesta
        await tourDates.updateOne({ _id: tourDate._id }, { $inc: { bookedCount: -participants } });
        throw err;
      }

      const emailData = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        participants,
        tourNumber: tourDate.number ?? null,
        tourType: tourId,
        checkInDate: stay.checkInDate,
        checkOutDate: stay.checkOutDate,
        nights: stay.nights,
        arrivalMethod,
        rentBike: bookingInput.rentBike ?? false,
        message,
        lang,
      };

      // Jedan za drugim (ne paralelno): Resend besplatni plan ima limit od 2 zahtjeva u sekundi
      const notification = buildBookingNotificationEmail(emailData);
      await sendEmail(request.log, {
        from: fromWithName(customer.name, env.contactEmailFrom),
        to: env.contactEmailTo,
        replyTo: customer.email,
        subject: notification.subject,
        html: notification.html,
      });

      const confirmation = buildBookingConfirmationEmail(emailData);
      await sendEmail(request.log, {
        from: fromWithName("Enduro Drift Support", env.contactEmailFrom),
        to: customer.email,
        subject: confirmation.subject,
        html: confirmation.html,
      });

      reply.code(201);
      return { id: insertedId.toString() };
    },
  );
};

export default bookingRoutes;
