export interface ContactContent {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  intro: string;
  formHeading: string;
  directHeading: string;
  followUs: string;
  address: string;
}

export const contact: Record<"de" | "en", ContactContent> = {
  de: {
    metaTitle: "Kontakt & Tour-Anfrage | Enduro Drift Bosnien",
    metaDescription:
      "Fragen zu unseren Enduro-Touren in Bosnien? Schreiben Sie uns oder rufen Sie an - wir melden uns so schnell wie möglich.",
    heading: "Kontakt",
    intro: "Haben Sie Fragen zu unseren Touren? Schreiben Sie uns - wir melden uns so schnell wie möglich.",
    formHeading: "Schreiben Sie uns",
    directHeading: "Direkt erreichbar",
    followUs: "Folge uns",
    address: "Silvija Strahimira Kranjčevića, 70280 Gornji Vakuf-Uskoplje, Bosna i Hercegovina",
  },
  en: {
    metaTitle: "Contact & Tour Enquiry | Enduro Drift Bosnien",
    metaDescription:
      "Questions about our enduro tours in Bosnia? Write to us or give us a call - we'll get back to you as soon as possible.",
    heading: "Contact",
    intro: "Have questions about our tours? Send us a message - we'll get back to you as soon as possible.",
    formHeading: "Send us a message",
    directHeading: "Get in touch directly",
    followUs: "Follow us",
    address: "Silvija Strahimira Kranjčevića, 70280 Gornji Vakuf-Uskoplje, Bosnia and Herzegovina",
  },
};
