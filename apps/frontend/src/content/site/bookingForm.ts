export interface BookingFormContent {
  heading: string;
  intro: string;
  tourLabel: string;
  dateLabel: string;
  choosePlaceholder: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  participantsLabel: string;
  participantsHint: string;
  addressLabel: string;
  addressPlaceholder: string;
  arrivalLabel: string;
  arrivalFlight: string;
  arrivalCar: string;
  rentBikeLabel: string;
  yes: string;
  no: string;
  messageLabel: string;
  messageOptional: string;
  messagePlaceholder: string;
  requiredNote: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  notEnoughSpots: string;
}

export const bookingForm: Record<"de" | "en", BookingFormContent> = {
  de: {
    heading: "Jetzt zur Tour anmelden",
    intro: "Wählen Sie Ihre Tour und Ihren Wunschtermin. Wir melden uns mit allen weiteren Details.",
    tourLabel: "Tour",
    dateLabel: "Termin",
    choosePlaceholder: "Bitte wählen…",
    nameLabel: "Vorname und Nachname",
    namePlaceholder: "Max Mustermann",
    emailLabel: "E-Mail",
    emailPlaceholder: "max@beispiel.de",
    phoneLabel: "Telefonnummer",
    phonePlaceholder: "+49 123 456 789",
    participantsLabel: "Anzahl Personen",
    participantsHint: "(min. 2)",
    addressLabel: "Adresse",
    addressPlaceholder: "Straße, Hausnummer, PLZ und Ort",
    arrivalLabel: "Wie reisen Sie an?",
    arrivalFlight: "Flugzeug",
    arrivalCar: "Auto",
    rentBikeLabel: "Möchten Sie ein Fahrrad mieten?",
    yes: "Ja",
    no: "Nein",
    messageLabel: "Nachricht",
    messageOptional: "(optional)",
    messagePlaceholder: "Haben Sie Fragen oder besondere Wünsche?",
    requiredNote: "Pflichtfelder",
    submit: "Anmeldung abschicken",
    submitting: "Wird gesendet…",
    success: "Vielen Dank! Ihre Anmeldung wurde erfolgreich gesendet. Wir melden uns per E-Mail mit allen Details.",
    error: "Fehler beim Senden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.",
    notEnoughSpots:
      "Für diesen Termin sind nicht genügend Plätze für Ihre Gruppengröße frei. Bitte wählen Sie einen anderen Termin oder kontaktieren Sie uns.",
  },
  en: {
    heading: "Book your tour now",
    intro: "Choose your tour and preferred date. We'll get back to you with all the details.",
    tourLabel: "Tour",
    dateLabel: "Date",
    choosePlaceholder: "Please choose…",
    nameLabel: "First and last name",
    namePlaceholder: "John Smith",
    emailLabel: "Email",
    emailPlaceholder: "john@example.com",
    phoneLabel: "Phone number",
    phonePlaceholder: "+44 20 1234 5678",
    participantsLabel: "Number of people",
    participantsHint: "(min. 2)",
    addressLabel: "Address",
    addressPlaceholder: "Street, number, postcode and city",
    arrivalLabel: "How are you arriving?",
    arrivalFlight: "Flight",
    arrivalCar: "Car",
    rentBikeLabel: "Would you like to rent a motorcycle?",
    yes: "Yes",
    no: "No",
    messageLabel: "Message",
    messageOptional: "(optional)",
    messagePlaceholder: "Any questions or special requests?",
    requiredNote: "Required fields",
    submit: "Submit booking",
    submitting: "Sending…",
    success: "Thank you! Your booking request was sent successfully. We'll email you with all the details.",
    error: "Something went wrong. Please try again or contact us directly.",
    notEnoughSpots:
      "There aren't enough places left on this date for your group size. Please choose another date or contact us.",
  },
};
