import { sliderAlts } from "@/content/site/sliderAlts";

export interface SliderImage {
  src: ImageMetadata;
  alt: string;
}

/**
 * Pretvara rezultat `import.meta.glob(..., { eager: true })` u slike sa alt tekstom.
 * Ključ u sliderAlts je "mapa/ime-fajla" (npr. "unterkunft/hotel1"); slika bez unosa dobija prazan alt.
 */
export function toSliderImages(
  modules: Record<string, { default: ImageMetadata }>,
  lang: "de" | "en",
): SliderImage[] {
  return Object.entries(modules).map(([path, mod]) => {
    const key = path.split("/").slice(-2).join("/").replace(/\.\w+$/, "");
    return { src: mod.default, alt: sliderAlts[key]?.[lang] ?? "" };
  });
}
