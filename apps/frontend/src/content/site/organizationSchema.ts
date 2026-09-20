const siteUrl = "https://endurodriftbosnien.com";

export function organizationSchema(lang: "de" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Enduro Drift Bosnien",
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
    sameAs: [
      "https://www.facebook.com/profile.php?id=100054829614691",
      "https://www.instagram.com/enduro_drift_bosnien/",
      "https://www.tiktok.com/@endurodriftbosnien",
      "https://www.youtube.com/@endurodriftbosnien536",
    ],
  };
}
