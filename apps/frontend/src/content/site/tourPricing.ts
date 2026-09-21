export type TourId = "einsteiger" | "bestseller" | "hardEnduro";

export interface TourPricingCard {
  /** Ključ za slug (src/content/tourSlugs.mjs) i tekst detalj-stranice (tourDetails.ts). */
  id: TourId;
  title: string;
  badge?: string;
  // Opisuje trenutnu (privremenu) sliku — mijenjati zajedno sa slikom u src/lib/tours.ts (tourImages).
  imageAlt: string;
  ownBikePrice: number;
  rentalBikePrice: number;
  // Brojke za detalj-stranicu i FAQ — držati usklađeno s tekstom u `included`.
  ridingDays: number;
  nights: number;
  included: string[];
  arrival: string;
  departure: string;
  ctaHref: string;
}

export interface TourPricingContent {
  badge: string;
  heading: string;
  headingAccent: string;
  // H1 kad se sekcija koristi kao glavni sadržaj stranice /touren (na homepageu ostaje H2 gore)
  pageHeading: string;
  pageHeadingAccent: string;
  subheading: string;
  additionalCosts: string[];
  excluded: string[];
  cards: TourPricingCard[];
  hardEnduro: { title: string; text: string };
  mediumEnduro: { title: string; text: string };
  helpText: string;
  helpCta: { label: string; href: string };
}

export const tourPricing: Record<"de" | "en", TourPricingContent> = {
  de: {
    badge: "Vorgeschlagene Enduro Bosnien Touren",
    heading: "Wählen Sie Ihr",
    headingAccent: "Abenteuer",
    pageHeading: "Enduro Touren in Bosnien",
    pageHeadingAccent: "Preise & Leistungen",
    subheading:
      "Von anfängerfreundlichen Routen bis hin zu extremen Herausforderungen - finden Sie die perfekte Tour für Ihr Niveau.",
    additionalCosts: [
      "Mittagessen: 15 € pro Tag",
      "Einzelzimmer: 15 € pro Tag",
      "Transport vom Flughafen und zurück: 70 €",
    ],
    excluded: ["Abendessen in der Stadt", "Vignette: 25 €/Monat (eigenes Motorrad)"],
    cards: [
      {
        id: "einsteiger",
        title: "Ideal für Einsteiger & Genussfahrer",
        ownBikePrice: 490,
        rentalBikePrice: 790,
        ridingDays: 3,
        nights: 4,
        included: ["3 Tage geführtes Endurofahren", "4 Übernachtungen, Frühstück, Guide"],
        arrival: "Samstag",
        departure: "Mittwoch",
        imageAlt: "Routenkarte der Einsteiger-Tour: Rundstrecke bei Gornji Vakuf-Uskoplje und dem Prokoško-See",
        ctaHref: "/de/anmeldung/?tour=Tour%201",
      },
      {
        id: "bestseller",
        title: "Unser Bestseller - perfekt für Fortgeschrittene",
        badge: "Beliebt",
        ownBikePrice: 590,
        rentalBikePrice: 890,
        ridingDays: 4,
        nights: 5,
        included: ["4 Tage geführtes Endurofahren", "5 Übernachtungen, Frühstück, Guide"],
        arrival: "Samstag",
        departure: "Donnerstag",
        imageAlt: "Routenkarte der Fortgeschrittenen-Tour rund um Gornji Vakuf-Uskoplje",
        ctaHref: "/de/anmeldung/?tour=Tour%202",
      },
      {
        id: "hardEnduro",
        title: "Maximale Herausforderung für erfahrene Fahrer",
        ownBikePrice: 790,
        rentalBikePrice: 1190,
        ridingDays: 5,
        nights: 7,
        included: ["5 Tage geführtes Endurofahren", "7 Übernachtungen, Frühstück, Guide"],
        arrival: "Samstag",
        departure: "Samstag",
        imageAlt: "Enduro-Fahrer mit ihren Motorrädern über einem türkisfarbenen Bergsee",
        ctaHref: "/de/anmeldung/?tour=Tour%203",
      },
    ],
    hardEnduro: {
      title: "Hard Enduro",
      text: "Herausforderndes Gelände, technische Trails und steile Anstiege - 30-40 km pro Tag",
    },
    mediumEnduro: {
      title: "Medium Enduro",
      text: "Längere, landschaftlich reizvolle Strecken mit gemischtem Schwierigkeitsgrad - 80-100 km pro Tag",
    },
    helpText: "Nicht sicher, welche Tour für Sie geeignet ist?",
    helpCta: { label: "Kontaktieren Sie uns für Beratung", href: "/de/kontakt/" },
  },
  en: {
    badge: "Suggested Enduro Bosnia Tours",
    heading: "Choose Your",
    headingAccent: "Adventure",
    pageHeading: "Enduro Tours in Bosnia",
    pageHeadingAccent: "Prices & What's Included",
    subheading:
      "From beginner-friendly routes to extreme challenges - find the perfect tour for your level.",
    additionalCosts: [
      "Lunch: €15 per day",
      "Single room: €15 per day",
      "Airport transfer (return): €70",
    ],
    excluded: ["Dinner in town", "Road tax: €25/month (own motorcycle)"],
    cards: [
      {
        id: "einsteiger",
        title: "Ideal for Beginners & Leisure Riders",
        ownBikePrice: 490,
        rentalBikePrice: 790,
        ridingDays: 3,
        nights: 4,
        included: ["3 days guided enduro riding", "4 nights, breakfast, guide"],
        arrival: "Saturday",
        departure: "Wednesday",
        imageAlt: "Route map of the beginner tour: loop near Gornji Vakuf-Uskoplje and Lake Prokoško",
        ctaHref: "/en/booking/?tour=Tour%201",
      },
      {
        id: "bestseller",
        title: "Our Bestseller - Perfect for Intermediates",
        badge: "Popular",
        ownBikePrice: 590,
        rentalBikePrice: 890,
        ridingDays: 4,
        nights: 5,
        included: ["4 days guided enduro riding", "5 nights, breakfast, guide"],
        arrival: "Saturday",
        departure: "Thursday",
        imageAlt: "Route map of the intermediate tour around Gornji Vakuf-Uskoplje",
        ctaHref: "/en/booking/?tour=Tour%202",
      },
      {
        id: "hardEnduro",
        title: "Maximum Challenge for Experienced Riders",
        ownBikePrice: 790,
        rentalBikePrice: 1190,
        ridingDays: 5,
        nights: 7,
        included: ["5 days guided enduro riding", "7 nights, breakfast, guide"],
        arrival: "Saturday",
        departure: "Saturday",
        imageAlt: "Enduro riders with their motorcycles above a turquoise mountain lake",
        ctaHref: "/en/booking/?tour=Tour%203",
      },
    ],
    hardEnduro: {
      title: "Hard Enduro",
      text: "Challenging terrain, technical trails and steep climbs - 30-40 km per day",
    },
    mediumEnduro: {
      title: "Medium Enduro",
      text: "Longer, scenic mixed-difficulty routes - 80-100 km per day",
    },
    helpText: "Not sure which tour suits you?",
    helpCta: { label: "Contact us for advice", href: "/en/contact/" },
  },
};
