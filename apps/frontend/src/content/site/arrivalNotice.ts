export interface ArrivalNoticeContent {
  title: string;
  intro: string;
  items: string[];
}

export const arrivalNotice: Record<"de" | "en", ArrivalNoticeContent> = {
  de: {
    title: "Hinweis zu An- und Abreise",
    intro:
      "Die Anreise ist immer samstags - die erste Übernachtung ist die Nacht von Samstag auf Sonntag. Der Abreisetag richtet sich nach der gewählten Tour-Art:",
    items: [
      "Tour 1 - 4 Übernachtungen: Abreise am Mittwoch",
      "Tour 2 - 5 Übernachtungen: Abreise am Donnerstag",
      "Tour 3 - 7 Übernachtungen: Abreise am Samstag",
    ],
  },
  en: {
    title: "Note on Arrival & Departure",
    intro:
      "Arrival is always on Saturdays - the first night is Saturday to Sunday. The departure day depends on the tour you choose:",
    items: [
      "Tour 1 - 4 nights: departure on Wednesday",
      "Tour 2 - 5 nights: departure on Thursday",
      "Tour 3 - 7 nights: departure on Saturday",
    ],
  },
};
