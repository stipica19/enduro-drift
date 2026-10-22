import type { FaqItem } from "@/content/site/faq";

// Tekst pregledne stranice tura (/de/touren/, /en/tours/) mimo kartica iz tourPricing.ts. Ova stranica
// pokriva upite o cijeni i poređenju tura; homepage ima samo kratki pregled (tourTeaser.ts).
// Brojke se ne pišu ovdje: getToursPage() u src/lib/tours.ts popunjava
// {fromPrice} — najniža cijena s vlastitim motorom,
// {prices} / {levels} — `priceItem` / `levelItem` za svaku turu (s {name}, {level} i poljima kartice),
// {additionalCosts}, {excluded} — liste iz tourPricing.ts.

export interface ToursPageContent {
  metaTitle: string;
  metaDescription: string;
  comparison: {
    heading: string;
    headingAccent: string;
    intro: string;
    caption: string;
    tour: string;
    level: string;
    terrain: string;
  };
  faqHeading: string;
  faqHeadingAccent: string;
  priceItem: string;
  levelItem: string;
  faq: FaqItem[];
}

export const toursPage: Record<"de" | "en", ToursPageContent> = {
  de: {
    metaTitle: "Enduro Touren Bosnien: Preise & Vergleich | Enduro Drift",
    metaDescription:
      "Alle geführten Enduro-Touren in Bosnien im Vergleich: Fahrtage, Übernachtungen, Leistungen und Preise ab {fromPrice} € – für Einsteiger bis erfahrene Fahrer.",
    comparison: {
      heading: "Touren",
      headingAccent: "im Vergleich",
      intro:
        "Alle Touren auf einen Blick – Details zu Strecke, Ablauf und Motorrädern findest du auf der jeweiligen Tourseite.",
      caption: "Vergleich der Enduro-Touren: Niveau, Gelände, Dauer und Preise",
      tour: "Tour",
      level: "Niveau",
      terrain: "Gelände",
    },
    faqHeading: "Fragen zu",
    faqHeadingAccent: "Preisen & Leistungen",
    priceItem:
      "{name} ({ridingDays} Fahrtage): {ownBikePrice} € mit eigenem Motorrad, {rentalBikePrice} € mit unserem Motorrad",
    levelItem: "{name} – {level}",
    faq: [
      {
        question: "Was kostet eine Enduro-Tour in Bosnien?",
        answer:
          "Unsere geführten Enduro-Touren kosten je nach Länge und Motorrad: {prices}. Inklusive sind jeweils Guide, Übernachtungen mit Frühstück und die komplette Schutzausrüstung.",
      },
      {
        question: "Welche Kosten kommen zum Tourpreis dazu?",
        answer: "Zusätzliche Kosten: {additionalCosts}. Nicht inbegriffen: {excluded}.",
      },
      {
        question: "Wie und wann bezahle ich die Tour?",
        answer:
          "Nach deiner Anfrage melden wir uns persönlich und senden dir eine Rechnung über 100 € Anzahlung (PayPal oder Banküberweisung). Nach Eingang der Anzahlung erhältst du die Buchungsbestätigung, den Rest zahlst du bei Ankunft in Bosnien und Herzegowina.",
      },
      {
        question: "Welche Tour passt zu meinem Fahrkönnen?",
        answer:
          "{levels}. Route und Tempo passen wir an dein Fahrkönnen an. Wenn du unsicher bist, berät dich unser Team gern vor der Buchung.",
      },
    ],
  },
  en: {
    metaTitle: "Enduro Tours in Bosnia: Prices & Comparison | Enduro Drift",
    metaDescription:
      "All our guided enduro tours in Bosnia compared: riding days, nights, what's included and prices from €{fromPrice} – for beginners through experienced riders.",
    comparison: {
      heading: "Our tours",
      headingAccent: "compared",
      intro:
        "All tours at a glance – you'll find details on the route, schedule and motorcycles on each tour page.",
      caption: "Comparison of our enduro tours: level, terrain, duration and prices",
      tour: "Tour",
      level: "Level",
      terrain: "Terrain",
    },
    faqHeading: "Questions about",
    faqHeadingAccent: "prices & what's included",
    priceItem:
      "{name} ({ridingDays} riding days): €{ownBikePrice} with your own motorcycle, €{rentalBikePrice} with our motorcycle",
    levelItem: "{name} – {level}",
    faq: [
      {
        question: "How much does an enduro tour in Bosnia cost?",
        answer:
          "Our guided enduro tours cost, depending on length and motorcycle: {prices}. Every tour includes a guide, nights with breakfast and full protective gear.",
      },
      {
        question: "What costs come on top of the tour price?",
        answer: "Additional costs: {additionalCosts}. Not included: {excluded}.",
      },
      {
        question: "How and when do I pay for the tour?",
        answer:
          "After your request we'll get back to you personally and send you an invoice for the €100 deposit (PayPal or bank transfer). Once we receive the deposit you'll get your booking confirmation; the rest is paid on arrival in Bosnia and Herzegovina.",
      },
      {
        question: "Which tour suits my riding level?",
        answer:
          "{levels}. We adapt the route and pace to your riding skills. If you're unsure, our team is happy to advise you before booking.",
      },
    ],
  },
};
