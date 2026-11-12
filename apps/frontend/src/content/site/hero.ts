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
  imageAlt: string;
}

export const hero: Record<"de" | "en", HeroContent> = {
  de: {
    badge: "Saison 2027 · Jetzt Tour anfragen",
    badgeHref: "/de/anmeldung/",
    titleLine1: "Geführte",
    titleLine2: "Enduro Touren",
    titleAccent: "in Bosnien.",
    description:
      "Legal offroad fahren, ohne Verbotsschilder: geführte Enduro-Touren in den Bergen Bosniens, in kleinen Gruppen und passend zu deinem Fahrlevel. Ab 490 €.",
    primaryCta: { label: "Jetzt Tour anfragen", href: "/de/anmeldung/" },
    secondaryCta: { label: "Touren & Preise entdecken", href: "/de/touren/" },
    reviewsSingular: "Bewertung",
    reviewsPlural: "Bewertungen",
    imageAlt: "Enduro-Gruppe auf geführter Tour in den Bergen Bosniens",
    highlights: [
      "Für Einsteiger bis Hard Enduro",
      "Legale, ausgewiesene Routen",
      "Leihmotorräder von BETA & KTM",
    ],
  },
  en: {
    badge: "Season 2027 · Book your tour now",
    badgeHref: "/en/booking/",
    titleLine1: "Guided",
    titleLine2: "Enduro Tours",
    titleAccent: "in Bosnia.",
    description:
      "Ride off-road legally, with no restrictions: guided enduro tours in the mountains of Bosnia, in small groups and matched to your riding level. From €490.",
    primaryCta: { label: "Book your tour now", href: "/en/booking/" },
    secondaryCta: { label: "Explore tours & prices", href: "/en/tours/" },
    reviewsSingular: "review",
    reviewsPlural: "reviews",
    imageAlt: "Enduro group on a guided tour in the mountains of Bosnia",
    highlights: [
      "From beginners to hard enduro",
      "Legal, marked routes",
      "BETA & KTM rental bikes",
    ],
  },
};
