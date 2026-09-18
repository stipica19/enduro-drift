import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { Resend } from "resend";
import { contactBodySchema } from "shared";
import { env } from "../config/env.js";
import { buildNotificationEmail, buildAutoReplyEmail } from "../services/contactEmails.js";
import { verifyRecaptcha } from "../services/recaptcha.js";

// Lazy: Resend baca ako je ključ prazan. Kad se instancira na top-levelu, nedostajuća
// RESEND_API_KEY ruši CIJELI server pri startu (i lokalno i u CI-ju), a ne samo ovu rutu.
let resendClient: Resend | null = null;

function getResend() {
  if (!resendClient) {
    resendClient = new Resend(env.resendApiKey);
  }
  return resendClient;
}

const contactRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/api/contact",
    { schema: { body: contactBodySchema } },
    async (request, reply) => {
      const { name, email, message, lang, honeypot, recaptchaToken } = request.body;

      // Honeypot: botovi popune skriveno polje koje ljudi ne vide — tiho "uspjeh", bez slanja emaila
      if (honeypot) {
        return { success: true };
      }

      const recaptcha = await verifyRecaptcha(recaptchaToken, request.ip);
      if (!recaptcha.ok) {
        return reply.code(400).send({ error: "reCAPTCHA-Überprüfung fehlgeschlagen." });
      }

      const resend = getResend();
      const notification = buildNotificationEmail({ name, email, message });

      const { error } = await resend.emails.send({
        from: env.contactEmailFrom,
        to: env.contactEmailTo,
        replyTo: email,
        subject: notification.subject,
        html: notification.html,
      });

      if (error) {
        fastify.log.error(error);
        return reply.code(502).send({ error: "E-Mail konnte nicht gesendet werden." });
      }

      const autoReply = buildAutoReplyEmail({ name, message, lang });

      const { error: autoReplyError } = await resend.emails.send({
        from: env.contactEmailFrom,
        to: email,
        subject: autoReply.subject,
        html: autoReply.html,
      });

      if (autoReplyError) {
        // Ne blokiraj korisnika ako auto-reply ne uspije — glavna notifikacija je stigla,
        // upit nije izgubljen, samo logiraj radi vidljivosti.
        fastify.log.error(autoReplyError);
      }

      return { success: true };
    },
  );
};

export default contactRoutes;
