export interface DatesContent {
  heading: string;
  intro: string;
}

export const dates: Record<"de" | "en", DatesContent> = {
  de: {
    heading: "Termine",
    intro:
      "Planen Sie Ihr nächstes Offroad-Abenteuer! Sichern Sie sich Ihren Platz für eine unvergessliche Enduro-Tour durch Bosnien. Wählen Sie einen verfügbaren Termin und reservieren Sie rechtzeitig - die Plätze sind begrenzt.",
  },
  en: {
    heading: "Dates",
    intro:
      "Plan your next off-road adventure! Secure your spot for an unforgettable enduro tour through Bosnia. Choose an available date and book early - places are limited.",
  },
};
