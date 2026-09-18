export interface TourDatesTableContent {
  tourNumber: string;
  from: string;
  to: string;
  availability: string;
  available: string;
  unavailable: string;
  empty: string;
  reserveSuffix: string;
  locale: string;
}

export const tourDatesTable: Record<"de" | "en", TourDatesTableContent> = {
  de: {
    tourNumber: "Tournummer",
    from: "Von",
    to: "Bis",
    availability: "Verfügbarkeit",
    available: "Verfügbar",
    unavailable: "Nicht verfügbar",
    empty: "Aktuell sind keine Termine hinterlegt. Bitte kontaktieren Sie uns direkt.",
    reserveSuffix: "— Reservieren Sie Ihre Tour",
    locale: "de-DE",
  },
  en: {
    tourNumber: "Tour number",
    from: "From",
    to: "To",
    availability: "Availability",
    available: "Available",
    unavailable: "Not available",
    empty: "No dates are currently listed. Please contact us directly.",
    reserveSuffix: "— Reserve your tour now",
    locale: "en-GB",
  },
};
