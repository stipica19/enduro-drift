export interface WhyChooseUsFeature {
  title: string;
  text: string;
}

export interface WhyChooseUsContent {
  heading: string;
  headingAccent: string;
  subheading: string;
  features: WhyChooseUsFeature[];
}

export const whyChooseUs: Record<"de" | "en", WhyChooseUsContent> = {
  de: {
    heading: "Warum uns",
    headingAccent: "wählen?",
    subheading: "Enduro Drift ist das führende Unternehmen für Enduro-Touren in Bosnien und Herzegowina",
    features: [
      {
        title: "Premium Motorräder",
        text: "Neueste BETA-Modelle 2023 - BETA 300 RR und BETA 300 XTRAINER,  bereit für jede Herausforderung",
      },
      {
        title: "Einzigartige Lage",
        text: "Gornji Vakuf-Uskoplje, umgeben von Bergen bis zu 2100 m Höhe mit über 3000 km² Gelände",
      },
      {
        title: "Komplett-Paket",
        text: "Kostenlose Ausrüstung, Unterkunft, professionelle Guides und volle Unterstützung während der gesamten Tour",
      },
      {
        title: "Bewährte Qualität",
        text: "203 zufriedene Gäste, 5-Sterne-Bewertung und jahrelange Erfahrung in der Tourenorganisation",
      },
      {
        title: "Unberührte Natur",
        text: "Prokoško-See, Vranica-Gebirge, Ramsko-See und viele weitere Naturschönheiten",
      },
      {
        title: "Für alle Erfahrungsstufen",
        text: "Von Anfängern bis zu erfahrenen Fahrern - wir passen die Touren Ihrem Wissens- und Erfahrungsniveau an",
      },
    ],
  },
  en: {
    heading: "Why choose",
    headingAccent: "us?",
    subheading: "Enduro Drift is the leading enduro tour operator in Bosnia and Herzegovina",
    features: [
      {
        title: "Premium Motorcycles",
        text: "Latest 2023 BETA models - BETA 300 RR and BETA 300 XTRAINER, ready for any challenge",
      },
      {
        title: "Unique Location",
        text: "Gornji Vakuf-Uskoplje, surrounded by mountains up to 2,100 m with over 3,000 km² of terrain",
      },
      {
        title: "All-Inclusive Package",
        text: "Free gear, accommodation, professional guides and full support throughout the tour",
      },
      {
        title: "Proven Quality",
        text: "203 happy guests, a 5-star rating and years of experience organizing tours",
      },
      {
        title: "Untouched Nature",
        text: "Prokoško Lake, the Vranica mountains, Ramsko Lake and many more natural wonders",
      },
      {
        title: "For All Experience Levels",
        text: "From beginners to experienced riders - we match the tour to your skill and experience level",
      },
    ],
  },
};
