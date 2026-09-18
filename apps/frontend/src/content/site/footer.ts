export interface FooterContent {
  nav: { href: string; label: string }[];
  partnersLabel: string;
  rights: string;
}

export const footer: Record<"de" | "en", FooterContent> = {
  de: {
    nav: [
      { href: "/de/touren", label: "Touren" },
      { href: "/de/motorrader", label: "Motorräder" },
      { href: "/de/ausruestung", label: "Ausrüstung" },
      { href: "/de/reisefuhrer", label: "Team" },
      { href: "/de/kontakt", label: "Kontakt" },
      { href: "/de/privacy", label: "Datenschutz" },
    ],
    partnersLabel: "Unsere Partner",
    rights: "Alle Rechte vorbehalten.",
  },
  en: {
    nav: [
      { href: "/en/tours", label: "Tours" },
      { href: "/en/motorcycles", label: "Motorcycles" },
      { href: "/en/equipment", label: "Equipment" },
      { href: "/en/guide", label: "Team" },
      { href: "/en/contact", label: "Contact" },
      { href: "/en/privacy", label: "Privacy" },
    ],
    partnersLabel: "Our Partners",
    rights: "All rights reserved.",
  },
};
