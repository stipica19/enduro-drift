export interface GalleryContent {
  heading: string;
  intro: string;
  empty: string;
  altPrefix: string;
}

export const gallery: Record<"de" | "en", GalleryContent> = {
  de: {
    heading: "Galerie",
    intro: "Impressionen von unseren Enduro-Touren in Bosnien.",
    empty: "Aktuell sind keine Bilder verfügbar.",
    altPrefix: "Enduro-Tour Bosnien - Foto",
  },
  en: {
    heading: "Gallery",
    intro: "Impressions from our enduro tours in Bosnia.",
    empty: "No images are currently available.",
    altPrefix: "Enduro tour Bosnia - photo",
  },
};
