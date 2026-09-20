import { siteUrl } from "@/lib/site";

// Samo činjenice potvrđene na sajtu (kontakt stranica: koordinate i Google Maps link; homepage: jezici
// vodiča i opis). Namjerno bez priceRange/openingHours/areaServed — nisu potvrđeni od vlasnika.
const description = {
  de: "Geführte Enduro-Touren in Bosnien und Herzegowina für Einsteiger und erfahrene Fahrer - legale Routen, kleine Gruppen, persönliche Betreuung.",
  en: "Guided enduro tours in Bosnia and Herzegovina for beginners and experienced riders - legal routes, small groups, personal support.",
};

export function organizationSchema(lang: "de" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    // Isti @id na DE i EN homepageu, da Google ovo vidi kao jedan entitet, a ne dva.
    "@id": `${siteUrl}/#business`,
    name: "Enduro Drift Bosnien",
    description: description[lang],
    image: `${siteUrl}/logo.png`,
    logo: `${siteUrl}/logo.png`,
    url: `${siteUrl}/${lang}/`,
    telephone: "+38763136095",
    email: "endurodriftbosnien@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Silvija Strahimira Kranjčevića",
      addressLocality: "Gornji Vakuf-Uskoplje",
      postalCode: "70280",
      addressCountry: "BA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.9377169,
      longitude: 17.5766972,
    },
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
