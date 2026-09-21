import { siteUrl } from "@/lib/site";
import type { BlogPost, Lang } from "@/lib/blog";
import { getTour, tourIds } from "@/lib/tours";
import type { FaqItem } from "@/content/site/faq";
import { footer } from "@/content/site/footer";
import { nav } from "@/content/site/nav";
import { tourCardLabels } from "@/content/site/tourCard";
import type { TourId } from "@/content/site/tourPricing";

// Graditelji JSON-LD čvorova. Sve ide u jedan @graph koji ispisuje StructuredData.astro u Layoutu,
// pa čvorovi nemaju vlastiti @context. Podaci dolaze iz istih content fajlova kao i vidljivi sadržaj
// stranice — shema nikad ne smije tvrditi nešto što posjetitelj ne vidi.

export type SchemaNode = Record<string, unknown>;

const businessName = "Enduro Drift Bosnien";
const businessId = `${siteUrl}/#business`;
const logo = `${siteUrl}/logo.png`;

// schema.org nema TourOperator; TravelAgency je najbliži podtip LocalBusiness-a.
const businessType = "TravelAgency";

const businessDescription = {
  de: "Geführte Enduro-Touren in Bosnien und Herzegowina für Einsteiger und erfahrene Fahrer - legale Routen, kleine Gruppen, persönliche Betreuung.",
  en: "Guided enduro tours in Bosnia and Herzegovina for beginners and experienced riders - legal routes, small groups, personal support.",
};

/** Skraćena referenca na firmu (provider/author/publisher): isti @type i @id kao puni čvor na homepageu. */
function businessRef(lang: Lang): SchemaNode {
  return { "@type": businessType, "@id": businessId, name: businessName, url: `${siteUrl}/${lang}/`, logo };
}

// Samo činjenice potvrđene na sajtu (kontakt stranica: koordinate i Google Maps link; homepage: jezici
// vodiča i opis). Namjerno bez priceRange/openingHours/areaServed — nisu potvrđeni od vlasnika.
export function businessSchema(lang: Lang): SchemaNode {
  return {
    ...businessRef(lang),
    description: businessDescription[lang],
    image: logo,
    telephone: "+38763136095",
    email: "endurodriftbosnien@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Silvija Strahimira Kranjčevića",
      addressLocality: "Gornji Vakuf-Uskoplje",
      postalCode: "70280",
      addressCountry: "BA",
    },
    geo: { "@type": "GeoCoordinates", latitude: 43.9377169, longitude: 17.5766972 },
    hasMap: "https://www.google.com/maps/place/Enduro+Drift+Bosnien/@43.9377169,17.5766972",
    knowsLanguage: ["de", "en"],
    sameAs: [
      "https://www.facebook.com/profile.php?id=100054829614691",
      "https://www.instagram.com/enduro_drift_bosnien/",
      "https://www.tiktok.com/@endurodriftbosnien",
      "https://www.youtube.com/@endurodriftbosnien536",
    ],
  };
}

/** Početna → (međurazine) → trenutna stranica. Nazivi su labeli iz navigacije/footera. */
export function breadcrumbSchema(lang: Lang, path: string, currentName?: string): SchemaNode | undefined {
  const labels = new Map([...nav[lang], ...footer[lang].nav].map((link) => [link.href, link.label]));
  const segments = path.split("/").filter(Boolean);
  const crumbs = [{ name: labels.get(`/${lang}/`), path: `/${lang}/` }];

  for (let i = 2; i <= segments.length; i++) {
    const crumbPath = `/${segments.slice(0, i).join("/")}/`;
    const isCurrent = i === segments.length;
    crumbs.push({ name: (isCurrent && currentName) || labels.get(crumbPath), path: crumbPath });
  }

  // Bez naziva za neku razinu radije nikakav breadcrumb nego netačan.
  if (crumbs.length < 2 || crumbs.some((crumb) => !crumb.name)) return undefined;

  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };
}

/**
 * Jedna tura s cijenama tačno kako su prikazane na kartici. @id i url su detalj-stranice ture, pa
 * je to isti entitet i na /touren (pregled) i na /touren/<slug>/.
 */
export function touristTripSchema(lang: Lang, id: TourId): SchemaNode {
  const { card, detail, path } = getTour(lang, id);
  const labels = tourCardLabels[lang];
  const offer = (name: string, price: number) => ({
    "@type": "Offer",
    name,
    price,
    priceCurrency: "EUR",
    url: `${siteUrl}${card.ctaHref}`,
  });

  return {
    "@type": "TouristTrip",
    "@id": `${siteUrl}${path}#trip`,
    name: detail.name,
    description: detail.metaDescription,
    touristType: detail.level,
    url: `${siteUrl}${path}`,
    provider: businessRef(lang),
    offers: [offer(labels.ownBike, card.ownBikePrice), offer(labels.rentalBike, card.rentalBikePrice)],
  };
}

export const touristTripSchemas = (lang: Lang) => tourIds.map((id) => touristTripSchema(lang, id));

/** Mora ići samo na stranicu koja stvarno prikazuje ta pitanja (FaqSection). */
export function faqSchema(items: FaqItem[]): SchemaNode {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function blogPostingSchema(lang: Lang, post: BlogPost, postPath: string, image: string): SchemaNode {
  return {
    "@type": "BlogPosting",
    headline: post.data.title,
    description: post.data.description,
    inLanguage: lang,
    image,
    datePublished: post.data.date.toISOString(),
    ...(post.data.updated && { dateModified: post.data.updated.toISOString() }),
    author: businessRef(lang),
    publisher: businessRef(lang),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}${postPath}` },
  };
}
