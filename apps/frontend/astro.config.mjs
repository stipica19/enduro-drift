import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { blogTranslations } from "./src/content/blogTranslations.mjs";

// www je kanonski host (stari sajt rangira na www) — isto u src/lib/site.ts i robots.txt.
const siteUrl = "https://www.endurodriftbosnien.com";

// @astrojs/sitemap's built-in `i18n` option only pairs pages that share the
// EXACT same slug across locales (e.g. /de/blog <-> /en/blog). This project
// deliberately uses translated slugs (e.g. /de/anmeldung <-> /en/booking) per
// CLAUDE.md, so those pairs need to be listed here explicitly and stitched
// together in `serialize` below — otherwise those pages get no hreflang
// entries at all in sitemap.xml (the in-page <link rel="alternate"> tags in
// Layout.astro are unaffected either way, but this closes the sitemap gap).
// Blog objave dolaze iz blogTranslations.mjs, istog izvora koji koriste i blog stranice
// za in-page hreflang, pa sitemap i HTML ne mogu razilaziti.
const translatedSlugPairs = {
  "/de": "/en",
  "/de/anmeldung": "/en/booking",
  "/de/ausruestung": "/en/equipment",
  "/de/blog": "/en/blog",
  "/de/galerie": "/en/gallery",
  "/de/gastebuch": "/en/guestbook",
  "/de/kontakt": "/en/contact",
  "/de/motorrader": "/en/motorcycles",
  "/de/privacy": "/en/privacy",
  "/de/reisefuhrer": "/en/guide",
  "/de/termine": "/en/dates",
  "/de/touren": "/en/tours",
  ...Object.fromEntries(
    Object.entries(blogTranslations).map(([de, en]) => [`/de/blog/${de}`, `/en/blog/${en}`]),
  ),
};

const dePathByEnPath = Object.fromEntries(
  Object.entries(translatedSlugPairs).map(([de, en]) => [en, de]),
);

function stripTrailingSlash(pathname) {
  return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export default defineConfig({
  site: siteUrl,
  integrations: [
    react(),
    sitemap({
      // Vrijednosti su hreflang kodovi i moraju biti identične onima u Layout.astro ("de", "en"),
      // inače sitemap i HTML govore Googleu različite stvari.
      i18n: {
        defaultLocale: "de",
        locales: {
          de: "de",
          en: "en",
        },
      },
      filter: (page) => !page.includes("/admin"),
      serialize(item) {
        const path = stripTrailingSlash(new URL(item.url).pathname);
        const dePath = translatedSlugPairs[path] ? path : (dePathByEnPath[path] ?? null);
        const enPath = dePath ? translatedSlugPairs[dePath] : null;

        if (dePath && enPath) {
          item.links = [
            { lang: "de", url: `${siteUrl}${dePath}/` },
            { lang: "en", url: `${siteUrl}${enPath}/` },
            { lang: "x-default", url: `${siteUrl}${dePath}/` },
          ];
        }

        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
