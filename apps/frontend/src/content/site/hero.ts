export interface HeroContent {
  badge: string;
  badgeHref: string;
  titleLine1: string;
  titleLine2: string;
  titleAccent: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  reviewsSingular: string;
  reviewsPlural: string;
  highlights: string[];
}

export const hero: Record<"de" | "en", HeroContent> = {
  de: {
    badge: "Saison 2027 · Jetzt Tour anfragen",
    badgeHref: "/de/anmeldung/",
    titleLine1: "Dein nächstes",
    titleLine2: "Abenteuer.",
    titleAccent: "Enduro in Bosnien.",
    description:
      "Raus aus dem Alltag. Rein in die Berge. Entdecke die Trails rund um Gornji Vakuf-Uskoplje auf einer geführten Enduro-Tour - passend zu deinem Fahrlevel.",
    primaryCta: { label: "Jetzt Tour anfragen", href: "/de/anmeldung/" },
    secondaryCta: { label: "Touren & Preise entdecken", href: "/de/touren/" },
    reviewsSingular: "Bewertung",
    reviewsPlural: "Bewertungen",
    highlights: [
      "Für Einsteiger & erfahrene Fahrer",
      "Legale, ausgewiesene Routen",
      "Ersatzmotorräder verfügbar",
    ],
  },
  en: {
    badge: "Season 2027 · Book your tour now",
    badgeHref: "/en/booking/",
    titleLine1: "Your next",
    titleLine2: "Adventure.",
    titleAccent: "Enduro in Bosnia.",
    description:
      "Escape the everyday. Head for the mountains. Discover the trails around Gornji Vakuf-Uskoplje on a guided enduro tour - matched to your riding level.",
    primaryCta: { label: "Book your tour now", href: "/en/booking/" },
    secondaryCta: { label: "Explore tours & prices", href: "/en/tours/" },
    reviewsSingular: "review",
    reviewsPlural: "reviews",
    highlights: [
      "For beginners & experienced riders",
      "Legal, marked routes",
      "Spare motorcycles available",
    ],
  },
};
