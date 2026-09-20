export interface BookingContent {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  headingAccent: string;
  steps: string[];
  sectionHeading: string;
  dateOptionPrefix: string;
  locale: string;
}

export const booking: Record<"de" | "en", BookingContent> = {
  de: {
    metaTitle: "Enduro Tour Bosnien buchen | Enduro Drift Bosnien",
    metaDescription:
      "Melde dich für deine Enduro-Tour in Bosnien und Herzegowina an. Wähle deine Tour und deinen Wunschtermin und sende uns deine Reservierungsanfrage.",
    heading: "Enduro Tour Bosnien —",
    headingAccent: "Buche jetzt!",
    steps: [
      "Füllen Sie das untenstehende Reservierungsformular aus und senden Sie es an uns.",
      "Wir senden Ihnen eine E-Mail mit allen Details und bestätigen die Verfügbarkeit, damit Sie mit der Buchung Ihrer Flüge beginnen können.",
      "Sobald der Flugplan fertig ist, senden Sie ihn uns zur endgültigen Bestätigung.",
      "Innerhalb weniger Stunden senden wir Ihnen eine Rechnung für die Anzahlung von 100 Euro (über PayPal oder unser Bankkonto), der Rest des Tourpreises ist bei Ihrer Ankunft in Bosnien und Herzegowina zu zahlen.",
      "Nach Erhalt der Anzahlung senden wir Ihnen eine Buchungsbestätigung.",
    ],
    sectionHeading: "Anmeldung",
    dateOptionPrefix: "Termin",
    locale: "de-DE",
  },
  en: {
    metaTitle: "Book an Enduro Tour in Bosnia | Enduro Drift Bosnien",
    metaDescription:
      "Book your enduro tour in Bosnia and Herzegovina. Choose your tour and preferred date and send us your booking request.",
    heading: "Enduro Tour Bosnia —",
    headingAccent: "Book now!",
    steps: [
      "Fill out the booking form below and send it to us.",
      "We'll send you an email with all the details and confirm availability, so you can start booking your flights.",
      "Once your flight plan is set, send it to us for final confirmation.",
      "Within a few hours we'll send you an invoice for the €100 deposit (via PayPal or bank transfer), with the rest of the tour price due on your arrival in Bosnia and Herzegovina.",
      "Once we receive the deposit, we'll send you a booking confirmation.",
    ],
    sectionHeading: "Booking",
    dateOptionPrefix: "Date",
    locale: "en-GB",
  },
};
