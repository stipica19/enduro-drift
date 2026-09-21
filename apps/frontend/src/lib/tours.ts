import { tourSlugs } from "@/content/tourSlugs.mjs";
import { tourPricing } from "@/content/site/tourPricing";
import type { TourId, TourPricingCard } from "@/content/site/tourPricing";
import { tourDetailLabels, tourDetails } from "@/content/site/tourDetails";
import type { FaqItem } from "@/content/site/faq";

// TODO: zamijeni sa stvarnim fotografijama/mapama tura kad budu spremne
import mapBeginner from "@/assets/tours/tura1-map.webp";
import mapIntermediate from "@/assets/tours/tura2-map.webp";
import advancedPhoto from "@/assets/tours/tura22-map.webp";

export type Lang = "de" | "en";

const slugs: Record<TourId, Record<Lang, string>> = tourSlugs;

/** Slika ture (kartica i detalj-stranica) — alt tekst je `imageAlt` u tourPricing.ts. */
export const tourImages: Record<TourId, ImageMetadata> = {
  einsteiger: mapBeginner,
  bestseller: mapIntermediate,
  hardEnduro: advancedPhoto,
};

export const tourIds = Object.keys(slugs) as TourId[];

export const tourSlug = (lang: Lang, id: TourId) => slugs[id][lang];

export const toursIndexPath = (lang: Lang) => (lang === "de" ? "/de/touren/" : "/en/tours/");

export const tourPath = (lang: Lang, id: TourId) => `${toursIndexPath(lang)}${tourSlug(lang, id)}/`;

/** Zamjenjuje {ownBikePrice}, {ridingDays}, {departure} … podacima s kartice, da cijene i dani žive samo u tourPricing.ts. */
export function fillTourText(text: string, card: TourPricingCard) {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = card[key as keyof TourPricingCard];
    return typeof value === "string" || typeof value === "number" ? String(value) : match;
  });
}

/** Kartica + tekst detalj-stranice jedne ture, sa svim {placeholderima} popunjenim. */
export function getTour(lang: Lang, id: TourId) {
  const pricing = tourPricing[lang];
  const card = pricing.cards.find((c) => c.id === id);
  if (!card) throw new Error(`Tura "${id}" nema karticu u tourPricing.${lang}`);

  const raw = tourDetails[lang][id];
  const labels = tourDetailLabels[lang];
  const fill = (text: string) =>
    fillTourText(
      text
        .replaceAll("{name}", raw.name)
        .replaceAll("{included}", card.included.join(", "))
        .replaceAll("{additionalCosts}", pricing.additionalCosts.join(", "))
        .replaceAll("{excluded}", pricing.excluded.join(", ")),
      card,
    );
  const fillFaq = (item: FaqItem) => ({ question: fill(item.question), answer: fill(item.answer) });

  return {
    id,
    card,
    image: tourImages[id],
    path: tourPath(lang, id),
    detail: {
      ...raw,
      metaTitle: fill(raw.metaTitle),
      metaDescription: fill(raw.metaDescription),
      intro: fill(raw.intro),
      audience: raw.audience.map(fill),
      routeText: fill(raw.routeText),
      bikesText: fill(raw.bikesText),
      guidesText: fill(raw.guidesText),
    },
    schedule: labels.schedule.map((step) => ({ title: fill(step.title), text: fill(step.text) })),
    faq: [...raw.faq, ...labels.commonFaq].map(fillFaq),
    meta: fill(labels.otherTourMeta),
    ctaHeading: fill(labels.ctaHeading),
  };
}

export type Tour = ReturnType<typeof getTour>;
