export interface AccommodationContent {
  heading: string;
  intro: string;
}

export const accommodation: Record<"de" | "en", AccommodationContent> = {
  de: {
    heading: "Unterkunft",
    intro:
      "Das Motel Saraj bietet in seiner wunderschönen Umgebung die günstigsten Unterkunftspreise im Gebiet von Gornji Vakuf. Aufgrund seiner Lage ist das Motel Saraj der ideale Ort für Wanderungen, Winteraufenthalte und Erholung in der Natur am Berg Vranica.",
  },
  en: {
    heading: "Accommodation",
    intro:
      "Set in beautiful surroundings, Motel Saraj offers the most affordable accommodation rates in the Gornji Vakuf area. Thanks to its location, Motel Saraj is the ideal base for hiking, winter stays and relaxing in nature on Mount Vranica.",
  },
};
