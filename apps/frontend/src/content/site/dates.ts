export interface DatesContent {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  intro: string;
}

export const dates: Record<"de" | "en", DatesContent> = {
  de: {
    metaTitle: "Enduro Termine Bosnien | Enduro Drift Bosnien",
    metaDescription:
      "Aktuelle Termine für Enduro-Touren in Bosnien: Wählen Sie Ihre Tour und Ihren Wunschtermin und reservieren Sie rechtzeitig - die Plätze sind begrenzt.",
    heading: "Termine",
    intro:
      "Planen Sie Ihr nächstes Offroad-Abenteuer! Sichern Sie sich Ihren Platz für eine unvergessliche Enduro-Tour durch Bosnien. Wählen Sie einen verfügbaren Termin und reservieren Sie rechtzeitig - die Plätze sind begrenzt.",
  },
  en: {
    metaTitle: "Enduro Tour Dates Bosnia | Enduro Drift Bosnien",
    metaDescription:
      "Current dates for enduro tours in Bosnia: choose your tour and preferred date and book early - places are limited.",
    heading: "Dates",
    intro:
      "Plan your next off-road adventure! Secure your spot for an unforgettable enduro tour through Bosnia. Choose an available date and book early - places are limited.",
  },
};
