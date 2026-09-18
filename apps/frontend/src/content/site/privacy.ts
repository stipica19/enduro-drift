export interface PrivacySection {
  heading: string;
  paragraphs: string[];
}

export interface PrivacyContent {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  intro: string;
  sections: PrivacySection[];
}

// TODO: ovaj tekst je sastavljen isključivo od činjenica koje realno postoje u kodu
// (MongoDB Atlas, Resend, Google Maps embed, admin session cookie, kontakt podaci) —
// NIJE pravni savjet. Prije objave neka ga pregleda vlasnik/pravnik: nedostaju npr.
// rok čuvanja podataka i matični/registarski broj firme (obilježeno TODO ispod).
export const privacy: Record<"de" | "en", PrivacyContent> = {
  de: {
    metaTitle: "Datenschutzerklärung | Enduro Drift Bosnien",
    metaDescription:
      "Datenschutzerklärung von Enduro Drift Bosnien - welche Daten wir erheben, wie wir sie verarbeiten und welche Rechte Sie haben.",
    heading: "Datenschutzerklärung",
    intro:
      "Der Schutz Ihrer persönlichen Daten ist uns wichtig. Nachfolgend informieren wir Sie, welche Daten wir beim Besuch dieser Website und bei der Nutzung unserer Formulare erheben und wie wir damit umgehen.",
    sections: [
      {
        heading: "1. Verantwortlicher",
        paragraphs: [
          "Verantwortlich für die Datenverarbeitung auf dieser Website ist:",
          "Enduro Drift Bosnien\nSilvija Strahimira Kranjčevića\n70280 Gornji Vakuf-Uskoplje\nBosna i Hercegovina",
          "E-Mail: endurodriftbosnien@gmail.com\nTelefon: +387 63 136 095",
          "TODO: Firmenname/Rechtsform und Registernummer (falls vorhanden) mit dem Inhaber abstimmen.",
        ],
      },
      {
        heading: "2. Anmelde- und Kontaktformular",
        paragraphs: [
          "Wenn Sie unser Anmeldeformular nutzen, erheben wir die von Ihnen eingegebenen Daten: Name, E-Mail-Adresse, Telefonnummer, Adresse, Anzahl der Teilnehmer, Anreiseart, Wunsch nach Motorradmiete sowie Ihre Nachricht. Diese Daten nutzen wir ausschließlich, um Ihre Tour-Anfrage zu bearbeiten und mit Ihnen in Kontakt zu treten.",
          "Über das Kontaktformular erheben wir Name, E-Mail-Adresse und Ihre Nachricht, um Ihre Anfrage zu beantworten.",
          "Die Angabe dieser Daten erfolgt freiwillig, ist jedoch für die Bearbeitung Ihrer Anfrage erforderlich.",
        ],
      },
      {
        heading: "3. Hosting und Datenbank",
        paragraphs: [
          "Die über unsere Formulare übermittelten Daten speichern wir in einer Datenbank bei MongoDB Atlas (MongoDB, Inc.). MongoDB Atlas verarbeitet die Daten in unserem Auftrag als Auftragsverarbeiter.",
        ],
      },
      {
        heading: "4. Versand von E-Mails",
        paragraphs: [
          "Für den Versand von Bestätigungs- und Kontakt-E-Mails nutzen wir den E-Mail-Dienstleister Resend. Dabei werden die für den Versand notwendigen Daten (u. a. Ihre E-Mail-Adresse und der Nachrichteninhalt) an Resend übermittelt.",
        ],
      },
      {
        heading: "5. Google Maps",
        paragraphs: [
          "Auf unserer Kontaktseite binden wir eine Karte des Dienstes Google Maps (Google Ireland Limited) ein, um Ihnen die Anfahrt zu erleichtern. Beim Aufruf der Kontaktseite kann Google Daten, unter anderem Ihre IP-Adresse, erheben und verarbeiten. Informationen zum Umgang mit Nutzerdaten finden Sie in der Datenschutzerklärung von Google.",
        ],
      },
      {
        heading: "6. Cookies",
        paragraphs: [
          "Diese Website selbst setzt für Besucher keine Tracking- oder Analyse-Cookies ein. Ein technisch notwendiges Sitzungs-Cookie wird ausschließlich im internen Admin-Bereich beim Login gesetzt, nicht auf den öffentlichen Seiten.",
        ],
      },
      {
        heading: "7. Speicherdauer",
        paragraphs: [
          "TODO: Aufbewahrungsfrist für Anmeldungen/Kontaktanfragen mit dem Inhaber festlegen (z. B. Löschung nach Abschluss der Tour bzw. nach gesetzlicher Aufbewahrungspflicht).",
        ],
      },
      {
        heading: "8. Ihre Rechte",
        paragraphs: [
          "Sie haben jederzeit das Recht auf Auskunft über Ihre bei uns gespeicherten Daten sowie auf Berichtigung, Löschung oder Einschränkung der Verarbeitung dieser Daten. Zudem haben Sie ein Recht auf Datenübertragbarkeit und können der Verarbeitung Ihrer Daten widersprechen.",
          "Zur Ausübung dieser Rechte genügt eine formlose E-Mail an endurodriftbosnien@gmail.com. Ihnen steht zudem ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.",
        ],
      },
      {
        heading: "9. Änderungen dieser Datenschutzerklärung",
        paragraphs: [
          "Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte rechtliche Rahmenbedingungen oder Änderungen unserer Dienste anzupassen.",
        ],
      },
    ],
  },
  en: {
    metaTitle: "Privacy Policy | Enduro Drift Bosnien",
    metaDescription:
      "Privacy policy of Enduro Drift Bosnien - what data we collect, how we process it, and what rights you have.",
    heading: "Privacy Policy",
    intro:
      "Protecting your personal data matters to us. Below we explain what data we collect when you visit this website and use our forms, and how we handle it.",
    sections: [
      {
        heading: "1. Data Controller",
        paragraphs: [
          "The party responsible for data processing on this website is:",
          "Enduro Drift Bosnien\nSilvija Strahimira Kranjčevića\n70280 Gornji Vakuf-Uskoplje\nBosnia and Herzegovina",
          "Email: endurodriftbosnien@gmail.com\nPhone: +387 63 136 095",
          "TODO: confirm the legal company name/form and registration number (if any) with the owner.",
        ],
      },
      {
        heading: "2. Booking and Contact Forms",
        paragraphs: [
          "When you use our booking form, we collect the data you enter: name, email address, phone number, address, number of participants, arrival method, whether you'd like to rent a motorcycle, and your message. We use this data solely to process your tour request and get in touch with you.",
          "Through the contact form, we collect your name, email address, and message in order to respond to your inquiry.",
          "Providing this data is voluntary but necessary for us to process your request.",
        ],
      },
      {
        heading: "3. Hosting and Database",
        paragraphs: [
          "Data submitted through our forms is stored in a database hosted by MongoDB Atlas (MongoDB, Inc.). MongoDB Atlas processes this data on our behalf as a data processor.",
        ],
      },
      {
        heading: "4. Sending Emails",
        paragraphs: [
          "We use the email service Resend to send confirmation and contact emails. The data necessary for delivery (including your email address and message content) is transmitted to Resend for this purpose.",
        ],
      },
      {
        heading: "5. Google Maps",
        paragraphs: [
          "On our contact page we embed a map from Google Maps (Google Ireland Limited) to help you find us. When you open the contact page, Google may collect and process data, including your IP address. For details on how Google handles user data, please see Google's own privacy policy.",
        ],
      },
      {
        heading: "6. Cookies",
        paragraphs: [
          "This website itself does not set any tracking or analytics cookies for visitors. A technically necessary session cookie is only set in the internal admin area upon login, not on any public-facing page.",
        ],
      },
      {
        heading: "7. Data Retention",
        paragraphs: [
          "TODO: retention period for bookings/contact inquiries needs to be confirmed with the owner (e.g. deletion after the tour is completed, or per applicable statutory retention requirements).",
        ],
      },
      {
        heading: "8. Your Rights",
        paragraphs: [
          "You have the right at any time to request information about the data we hold about you, as well as to request correction, deletion, or restriction of processing. You also have the right to data portability and may object to the processing of your data.",
          "To exercise these rights, simply send an informal email to endurodriftbosnien@gmail.com. You also have the right to lodge a complaint with the competent supervisory authority.",
        ],
      },
      {
        heading: "9. Changes to This Privacy Policy",
        paragraphs: [
          "We reserve the right to update this privacy policy to reflect changes in legal requirements or in the services we offer.",
        ],
      },
    ],
  },
};
