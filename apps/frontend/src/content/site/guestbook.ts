export interface GuestbookContent {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  intro: string;
  empty: string;
  locale: string;
}

export const guestbook: Record<"de" | "en", GuestbookContent> = {
  de: {
    metaTitle: "Gästebuch | Enduro Drift Bosnien",
    metaDescription:
      "Was unsere Gäste über ihre Enduro-Tour in Bosnien und Herzegowina sagen — echte Erfahrungsberichte aus dem Gästebuch.",
    heading: "Gästebuch",
    intro:
      "Echte Worte von Gästen, die mit uns unterwegs waren. Keine Sternebewertungen - nur ehrliche Erfahrungsberichte.",
    empty: "Aktuell sind noch keine Einträge vorhanden.",
    locale: "de-DE",
  },
  en: {
    metaTitle: "Guestbook | Enduro Drift Bosnien",
    metaDescription:
      "What our guests say about their enduro tour in Bosnia and Herzegovina — real stories from the guestbook.",
    heading: "Guestbook",
    intro:
      "Real words from guests who rode with us. No star ratings - just honest stories.",
    empty: "No entries are available yet.",
    locale: "en-GB",
  },
};
