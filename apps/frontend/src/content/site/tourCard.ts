export interface TourCardLabels {
  ownBike: string;
  rentalBike: string;
  included: string;
  additionalCosts: string;
  excluded: string;
  arrival: string;
  departure: string;
  cta: string;
  /** Link na detalj-stranicu; {name} = kratki naziv ture (tourDetails.ts). */
  details: string;
}

export const tourCardLabels: Record<"de" | "en", TourCardLabels> = {
  de: {
    ownBike: "Mit eigenem Motorrad",
    rentalBike: "Mit unserem Motorrad",
    included: "Inbegriffen",
    additionalCosts: "Zusätzliche Kosten",
    excluded: "Nicht inbegriffen",
    arrival: "Anreise",
    departure: "Abreise",
    cta: "Buche jetzt!",
    details: "Mehr zur {name}",
  },
  en: {
    ownBike: "With your own motorcycle",
    rentalBike: "With our motorcycle",
    included: "Included",
    additionalCosts: "Additional costs",
    excluded: "Not included",
    arrival: "Arrival",
    departure: "Departure",
    cta: "Book now!",
    details: "More about the {name}",
  },
};
