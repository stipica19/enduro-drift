export interface TourCtaContent {
  heading: string;
  text: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}

export const tourCta: Record<"de" | "en", TourCtaContent> = {
  de: {
    heading: "Bereit für dein Enduro-Abenteuer in Bosnien?",
    text: "Entdecke unsere geführten Enduro-Touren oder frage direkt deinen Wunschtermin an - wir melden uns persönlich bei dir.",
    primary: { label: "Touren & Preise ansehen", href: "/de/touren/" },
    secondary: { label: "Tour anfragen", href: "/de/anmeldung/" },
  },
  en: {
    heading: "Ready for your enduro adventure in Bosnia?",
    text: "Discover our guided enduro tours or request your preferred date directly - we'll get back to you personally.",
    primary: { label: "View tours & prices", href: "/en/tours/" },
    secondary: { label: "Request a tour", href: "/en/booking/" },
  },
};
