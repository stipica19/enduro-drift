// Kratki pregled tura na homepageu. Namjerno bez punih kartica s cijenama i uslugama — to je
// sadržaj stranice /touren, a ista sekcija na obje stranice ih je tjerala da se bore za iste upite.
// Naziv, nivo, dani i "ab" cijena dolaze iz getTour() (tourPricing.ts + tourDetails.ts).

interface Link {
  label: string;
  href: string;
}

export interface TourTeaserContent {
  badge: string;
  heading: string;
  headingAccent: string;
  subheading: string;
  allToursCta: Link;
  bookCta: Link;
}

export const tourTeaser: Record<"de" | "en", TourTeaserContent> = {
  de: {
    badge: "Unsere Touren",
    heading: "Wähle dein",
    headingAccent: "Abenteuer",
    subheading:
      "Vom ersten Tag im Gelände bis zur Hard-Enduro-Woche: Jede Tour ist geführt, Route und Tempo passen wir deinem Fahrkönnen an.",
    allToursCta: { label: "Alle Touren & Preise vergleichen", href: "/de/touren/" },
    bookCta: { label: "Tour anfragen", href: "/de/anmeldung/" },
  },
  en: {
    badge: "Our tours",
    heading: "Choose Your",
    headingAccent: "Adventure",
    subheading:
      "From your first day off-road to the Hard Enduro Week: every tour is guided, and we adapt the route and pace to your riding skills.",
    allToursCta: { label: "Compare all tours & prices", href: "/en/tours/" },
    bookCta: { label: "Request a tour", href: "/en/booking/" },
  },
};
