import { escapeHtml } from "./emailUtils.js";

const siteUrl = "https://endurodriftbosnien.com";

export function buildNotificationEmail(params: { name: string; email: string; message: string }) {
  const name = escapeHtml(params.name);
  const email = escapeHtml(params.email);
  const message = escapeHtml(params.message);

  return {
    subject: `Neue Kontaktanfrage von ${params.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Neue Nachricht über das Kontaktformular</h2>
        <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Absender:</strong> ${name} &lt;${email}&gt;</p>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; font-size: 15px;"><strong>Nachricht:</strong></p>
          <p style="font-style: italic; color: #333;">"${message}"</p>
        </div>
      </div>
    `,
  };
}

const autoReplyText = {
  de: {
    subject: "Vielen Dank, dass Sie uns kontaktiert haben!",
    heading: (name: string) => `Vielen Dank, dass Sie uns kontaktiert haben, ${name}!`,
    body: "Ihre Nachricht wurde erhalten und unser Team wird sich bald bei Ihnen melden.",
    yourMessage: "Ihre Nachricht:",
    furtherQuestions: "Wenn Sie weitere Fragen haben, können Sie uns gerne kontaktieren unter",
    cta: "Besuchen Sie unsere Website",
    signOff: "Mit freundlichen Grüßen,",
  },
  en: {
    subject: "Thank you for contacting us!",
    heading: (name: string) => `Thank you for contacting us, ${name}!`,
    body: "We've received your message and our team will get back to you shortly.",
    yourMessage: "Your message:",
    furtherQuestions: "If you have any further questions, feel free to reach us at",
    cta: "Visit our website",
    signOff: "Best regards,",
  },
};

export function buildAutoReplyEmail(params: {
  name: string;
  message: string;
  lang: "de" | "en";
}) {
  const t = autoReplyText[params.lang];
  const name = escapeHtml(params.name);
  const message = escapeHtml(params.message);
  const sitePath = params.lang === "de" ? "/de" : "/en";

  return {
    subject: t.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">${t.heading(name)}</h2>
        <p style="font-size: 16px; color: #555;">${t.body}</p>

        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; font-size: 15px;"><strong>${t.yourMessage}</strong></p>
          <p style="font-style: italic; color: #333;">"${message}"</p>
        </div>

        <p style="font-size: 16px; color: #555; margin-top: 20px;">
          ${t.furtherQuestions}
          <a href="mailto:endurodriftbosnien@gmail.com" style="color: #007bff; text-decoration: none;">endurodriftbosnien@gmail.com</a>
        </p>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${siteUrl}${sitePath}"
             style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            ${t.cta}
          </a>
        </div>

        <p style="text-align: center; font-size: 14px; color: #777; margin-top: 20px;">
          ${t.signOff}<br>
          <strong>Enduro Drift Bosnien Team</strong>
        </p>
      </div>
    `,
  };
}
