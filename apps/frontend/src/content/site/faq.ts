export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  heading: string;
  headingAccent: string;
  items: FaqItem[];
}

export const faq: Record<"de" | "en", FaqContent> = {
  de: {
    heading: "Häufige",
    headingAccent: "Fragen",
    items: [
      {
        question: "Sind Enduro-Touren in Bosnien auch für Anfänger geeignet?",
        answer:
          "Ja, in Bosnien gibt es Enduro-Touren für Einsteiger mit grundlegender Motorraderfahrung. Entscheidend ist, dass der Schwierigkeitsgrad zu deinem Fahrkönnen passt: Einfache Schotterstrecken stellen andere Anforderungen als technische Hard-Enduro-Passagen. Sicheres Anfahren, Bremsen und Schalten solltest du bereits beherrschen. Kläre vor der Buchung, welche Tour zu deiner Erfahrung und Kondition passt.",
      },
      {
        question: "Brauche ich ein eigenes Motorrad für eine Enduro-Tour in Bosnien?",
        answer:
          "Ein eigenes Motorrad ist nicht bei jedem Angebot erforderlich. Enduro-Touren in Bosnien werden sowohl mit dem eigenen Bike als auch mit Leihmotorrad angeboten. Prüfe vor der Buchung, welche Motorräder verfügbar sind und ob Schutzausrüstung, Kraftstoff und mögliche Zusatzkosten im Mietpreis enthalten sind. Mit einem eigenen Motorrad solltest du vorab die technischen Anforderungen für die gewählte Tour klären.",
      },
      // Pitanje o cijeni je na /touren (toursPage.ts) sa stvarnim cijenama — ne vraćati ga ovdje.
    ],
  },
  en: {
    heading: "Frequently Asked",
    headingAccent: "Questions",
    items: [
      {
        question: "Are enduro tours in Bosnia suitable for beginners too?",
        answer:
          "Yes, Bosnia offers enduro tours for beginners with basic motorcycle experience. What matters most is that the difficulty level matches your riding ability: easy gravel tracks demand different skills than technical hard-enduro sections. You should already be confident with starting off, braking, and shifting gears. Before booking, clarify which tour matches your experience and fitness level.",
      },
      {
        question: "Do I need my own motorcycle for an enduro tour in Bosnia?",
        answer:
          "No, your own motorcycle isn't required for every tour. Enduro tours in Bosnia are offered both with your own bike and with a rental motorcycle. Before booking, check which motorcycles are available and whether protective gear, fuel, and any additional costs are included in the rental price. If you bring your own motorcycle, clarify the technical requirements for the chosen tour in advance.",
      },
      // Pitanje o cijeni je na /tours (toursPage.ts) sa stvarnim cijenama — ne vraćati ga ovdje.
    ],
  },
};
