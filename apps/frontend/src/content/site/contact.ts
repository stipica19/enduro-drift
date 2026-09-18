export interface ContactContent {
  heading: string;
  intro: string;
  formHeading: string;
  directHeading: string;
  followUs: string;
  address: string;
}

export const contact: Record<"de" | "en", ContactContent> = {
  de: {
    heading: "Kontakt",
    intro: "Haben Sie Fragen zu unseren Touren? Schreiben Sie uns - wir melden uns so schnell wie möglich.",
    formHeading: "Schreiben Sie uns",
    directHeading: "Direkt erreichbar",
    followUs: "Folge uns",
    address: "Silvija Strahimira Kranjčevića, 70280 Gornji Vakuf-Uskoplje, Bosna i Hercegovina",
  },
  en: {
    heading: "Contact",
    intro: "Have questions about our tours? Send us a message - we'll get back to you as soon as possible.",
    formHeading: "Send us a message",
    directHeading: "Get in touch directly",
    followUs: "Follow us",
    address: "Silvija Strahimira Kranjčevića, 70280 Gornji Vakuf-Uskoplje, Bosnia and Herzegovina",
  },
};
