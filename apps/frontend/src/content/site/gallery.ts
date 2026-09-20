export interface GalleryContent {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  intro: string;
  empty: string;
  altPrefix: string;
}

export const gallery: Record<"de" | "en", GalleryContent> = {
  de: {
    metaTitle: "Galerie: Enduro Touren in Bosnien | Enduro Drift Bosnien",
    metaDescription:
      "Fotos von unseren geführten Enduro-Touren in Bosnien: Trails, Berglandschaften und Motorräder rund um Gornji Vakuf-Uskoplje.",
    heading: "Galerie",
    intro: "Impressionen von unseren Enduro-Touren in Bosnien.",
    empty: "Aktuell sind keine Bilder verfügbar.",
    altPrefix: "Enduro-Tour Bosnien - Foto",
  },
  en: {
    metaTitle: "Gallery: Enduro Tours in Bosnia | Enduro Drift Bosnien",
    metaDescription:
      "Photos from our guided enduro tours in Bosnia: trails, mountain landscapes and motorcycles around Gornji Vakuf-Uskoplje.",
    heading: "Gallery",
    intro: "Impressions from our enduro tours in Bosnia.",
    empty: "No images are currently available.",
    altPrefix: "Enduro tour Bosnia - photo",
  },
};
