import { escapeHtml } from "./emailUtils.js";

const siteUrl = "https://endurodriftbosnien.com";
const CONTACT_EMAIL = "endurodriftbosnien@gmail.com";

export interface BookingEmailData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  participants: number;
  tourNumber: number | null;
  tourType: string;
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;
  arrivalMethod?: string;
  rentBike: boolean;
  message?: string;
  lang: "de" | "en";
}

function formatTourDate(date: Date, locale: string) {
  return date.toLocaleDateString(locale, {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

const cellStyle = "padding: 8px; border: 1px solid #ddd;";

function tableRow(label: string, value: string) {
  return `
    <tr>
      <td style="${cellStyle}"><strong>${label}:</strong></td>
      <td style="${cellStyle}">${value}</td>
    </tr>`;
}

// --- Mail vlasniku (hrvatski, kao na starom sajtu) ---

const adminArrivalMethods: Record<string, string> = {
  flugzeug: "Flugzeug",
  auto: "Auto",
};

export function buildBookingNotificationEmail(data: BookingEmailData) {
  const notEntered = "Nije uneseno";
  const arrival = data.arrivalMethod
    ? escapeHtml(adminArrivalMethods[data.arrivalMethod] ?? data.arrivalMethod)
    : notEntered;

  return {
    subject: `Nova prijava od ${data.name.replace(/[\r\n]+/g, " ").trim()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">

        <div style="background-color: #ff5733; padding: 15px; text-align: center; color: white; border-top-left-radius: 8px; border-top-right-radius: 8px;">
          <h2>🏍️ Nova prijava za Enduro Tour Bosnien! 🏁</h2>
        </div>

        <div style="padding: 20px;">
          <p style="font-size: 16px; color: #333;"><strong>📄 Podaci o prijavi:</strong></p>

          <table style="width: 100%; border-collapse: collapse;">
            ${tableRow("Ime i prezime", escapeHtml(data.name))}
            ${tableRow("Email", escapeHtml(data.email))}
            ${tableRow("Broj osoba", String(data.participants))}
            ${tableRow("Tour", `${data.tourNumber ?? "-"} (${escapeHtml(data.tourType)})`)}
            ${tableRow("Dolazak (1. noćenje)", formatTourDate(data.checkInDate, "de-DE"))}
            ${tableRow("Odlazak", formatTourDate(data.checkOutDate, "de-DE"))}
            ${tableRow("Broj noćenja", String(data.nights))}
            ${tableRow("Adresa", data.address ? escapeHtml(data.address) : notEntered)}
            ${tableRow("Telefon", data.phone ? escapeHtml(data.phone) : notEntered)}
            ${tableRow("Transport", arrival)}
            ${tableRow("Rent a Bike", data.rentBike ? "Da" : "Ne")}
          </table>

          <div style="margin-top: 15px; padding: 10px; background-color: #f8f8f8; border-radius: 5px;">
            <p><strong>📩 Poruka korisnika:</strong></p>
            <p style="font-style: italic; color: #555; white-space: pre-line;">${
              data.message ? escapeHtml(data.message) : "Nema dodatne poruke"
            }</p>
          </div>

          <p style="margin-top: 20px; font-size: 14px; color: #555;">
            📅 Datum prijave: <strong>${new Date().toLocaleDateString("de-DE")}</strong>
          </p>
        </div>

        <div style="background-color: #ff5733; text-align: center; padding: 10px; color: white; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
          <p style="margin: 0;">🚀 Enduro Drift Bosnien Team</p>
        </div>
      </div>
    `,
  };
}

// --- Mail gostu: "upit zaprimljen" (NE potvrda rezervacije — ona ostaje ručna) ---

const guestText = {
  de: {
    subject: "Ihre Anmeldung wurde erfolgreich empfangen!",
    greeting: (name: string) => `Hallo ${name},`,
    thanks: "Vielen Dank für Ihre Anmeldung! Ihre Anfrage wurde erfolgreich empfangen.",
    details: "Details Ihrer Anmeldung:",
    tour: "Tour",
    arrival: "Anreise (1. Übernachtung)",
    departure: "Abreise",
    nights: "Übernachtungen",
    people: "Anzahl Personen",
    transport: "Transport",
    rentBike: "Rent a Bike",
    yes: "Ja",
    no: "Nein",
    questions: "Bei Fragen kontaktieren Sie uns unter:",
    cta: "Besuchen Sie unsere Website",
    signOff: "Mit freundlichen Grüßen,",
    team: "Enduro Drift Team",
    arrivalMethods: { flugzeug: "Flugzeug", auto: "Auto" } as Record<string, string>,
    locale: "de-DE",
  },
  en: {
    subject: "Your booking request has been received!",
    greeting: (name: string) => `Hello ${name},`,
    thanks: "Thank you for your booking! Your request has been received successfully.",
    details: "Details of your booking:",
    tour: "Tour",
    arrival: "Arrival (1st night)",
    departure: "Departure",
    nights: "Nights",
    people: "Number of people",
    transport: "Transport",
    rentBike: "Rent a Bike",
    yes: "Yes",
    no: "No",
    questions: "If you have any questions, contact us at:",
    cta: "Visit our website",
    signOff: "Best regards,",
    team: "Enduro Drift Team",
    arrivalMethods: { flugzeug: "Flight", auto: "Car" } as Record<string, string>,
    locale: "en-GB",
  },
};

export function buildBookingConfirmationEmail(data: BookingEmailData) {
  const t = guestText[data.lang];
  const arrival = data.arrivalMethod
    ? escapeHtml(t.arrivalMethods[data.arrivalMethod] ?? data.arrivalMethod)
    : "-";

  return {
    subject: t.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; text-align: center;">
        <h2 style="color: #333;">${t.greeting(escapeHtml(data.name))}</h2>
        <p style="font-size: 16px; color: #555;">
          ${t.thanks}
        </p>

        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; font-size: 15px;"><strong>${t.details}</strong></p>
          <p style="font-style: italic; color: #333;">
            ${t.tour}: ${data.tourNumber ?? "-"} (${escapeHtml(data.tourType)})<br>
            ${t.arrival}: ${formatTourDate(data.checkInDate, t.locale)}<br>
            ${t.departure}: ${formatTourDate(data.checkOutDate, t.locale)}<br>
            ${t.nights}: ${data.nights}<br>
            ${t.people}: ${data.participants}<br>
            ${t.transport}: ${arrival}<br>
            ${t.rentBike}: ${data.rentBike ? t.yes : t.no}
          </p>
        </div>

        <p style="font-size: 16px; color: #555; margin-top: 20px;">
          ${t.questions}
          <a href="mailto:${CONTACT_EMAIL}" style="color: #007bff; text-decoration: none;">${CONTACT_EMAIL}</a>
        </p>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${siteUrl}/${data.lang}"
             style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            ${t.cta}
          </a>
        </div>

        <p style="text-align: center; font-size: 14px; color: #777; margin-top: 20px;">
          ${t.signOff} <br>
          <strong>${t.team}</strong>
        </p>
      </div>
    `,
  };
}
