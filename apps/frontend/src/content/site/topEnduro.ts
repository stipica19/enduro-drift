export interface TopEnduroContent {
  heading: string;
  subheading: string;
  intro: string;
  highlights: string[];
  pricesCta: { label: string; href: string };
  bookCta: { label: string; href: string };
}

export const topEnduro: Record<"de" | "en", TopEnduroContent> = {
  de: {
    heading: "TOP ENDURO URLAUB",
    subheading: "Zentralbosnien · geführte Touren · kleine Gruppen · top Bewertungen",
    intro:
      "Wenn Sie dem Stress des Alltags entfliehen möchten oder einen erstklassigen Enduro-Urlaub für Körper und Seele suchen, sind Sie bei Enduro Drift Bosnien genau richtig.",
    highlights: [
      "Standort: Gornji Vakuf (ca. 2,5 Std. von Sarajevo)",
      "Berge bis 2.100 m & abwechslungsreiche Trails",
      "Für Anfänger bis Profi - Route angepasst an dein Level",
      "Deutsch- & englischsprachige Guides",
    ],
    pricesCta: { label: "Preise ansehen", href: "/de/touren" },
    bookCta: { label: "Tour anfragen", href: "/de/anmeldung" },
  },
  en: {
    heading: "TOP ENDURO HOLIDAY",
    subheading: "Central Bosnia · guided tours · small groups · top reviews",
    intro:
      "If you want to escape the stress of everyday life, or you're looking for a first-class enduro holiday for body and soul, you've come to the right place with Enduro Drift Bosnia.",
    highlights: [
      "Location: Gornji Vakuf (approx. 2.5 hrs from Sarajevo)",
      "Mountains up to 2,100 m & varied trails",
      "For beginners to pros - routes matched to your level",
      "German- & English-speaking guides",
    ],
    pricesCta: { label: "View prices", href: "/en/tours" },
    bookCta: { label: "Request a tour", href: "/en/booking" },
  },
};
