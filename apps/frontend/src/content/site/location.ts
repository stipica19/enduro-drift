export interface LocationContent {
  heading: string;
  headingAccent: string;
  intro: string;
  highlights: string[];
  pinLabel: string;
  elevationLabel: string;
  distances: { city: string; km: number }[];
}

export const location: Record<"de" | "en", LocationContent> = {
  de: {
    heading: "Unsere",
    headingAccent: "Lage",
    intro:
      "Gornji Vakuf-Uskoplje liegt im zentralen Teil von Bosnien und Herzegowina, nur 2,5 Stunden Fahrt von Sarajevo entfernt. Umgeben von Bergen bis zu 2100 m Höhe.",
    highlights: [
      "2,5 Stunden von Sarajevo entfernt",
      "3000+ km² Gelände zum Erkunden",
      "Berge bis zu 2100 m hoch",
      "Unberührte Natur und frische Luft",
    ],
    pinLabel: "Gornji Vakuf-Uskoplje",
    elevationLabel: "2100 m",
    distances: [
      { city: "Ljubljana", km: 450 },
      { city: "Wien", km: 720 },
      { city: "Salzburg", km: 750 },
      { city: "München", km: 905 },
      { city: "Zürich", km: 1170 },
    ],
  },
  en: {
    heading: "Our",
    headingAccent: "Location",
    intro:
      "Gornji Vakuf-Uskoplje is located in central Bosnia and Herzegovina, just a 2.5-hour drive from Sarajevo. Surrounded by mountains up to 2,100 m high.",
    highlights: [
      "2.5 hours from Sarajevo",
      "3,000+ km² of terrain to explore",
      "Mountains up to 2,100 m high",
      "Untouched nature and fresh air",
    ],
    pinLabel: "Gornji Vakuf-Uskoplje",
    elevationLabel: "2,100 m",
    distances: [
      { city: "Ljubljana", km: 450 },
      { city: "Vienna", km: 720 },
      { city: "Salzburg", km: 750 },
      { city: "Munich", km: 905 },
      { city: "Zurich", km: 1170 },
    ],
  },
};
