// Slugovi detalj-stranica tura (/de/touren/<de>/ ↔ /en/tours/<en>/). Jedini izvor istine: čitaju ga
// [slug].astro stranice, TourCard linkovi i sitemap (astro.config.mjs), zato je .mjs a ne .ts.
// Ključ je id kartice u src/content/site/tourPricing.ts.
export const tourSlugs = {
  einsteiger: { de: "einsteiger-tour", en: "beginner-tour" },
  bestseller: { de: "bestseller-tour", en: "bestseller-tour" },
  hardEnduro: { de: "hard-enduro-woche", en: "hard-enduro-week" },
};
