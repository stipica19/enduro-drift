import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const siteUrl = "https://endurodriftbosnien.com";

// @astrojs/sitemap's built-in `i18n` option only pairs pages that share the
// EXACT same slug across locales (e.g. /de/blog <-> /en/blog). This project
// deliberately uses translated slugs (e.g. /de/anmeldung <-> /en/booking) per
// CLAUDE.md, so those pairs need to be listed here explicitly and stitched
// together in `serialize` below — otherwise those pages get no hreflang
// entries at all in sitemap.xml (the in-page <link rel="alternate"> tags in
// Layout.astro are unaffected either way, but this closes the sitemap gap).
const translatedSlugPairs = {
  "/de": "/en",
  "/de/anmeldung": "/en/booking",
  "/de/ausruestung": "/en/equipment",
  "/de/galerie": "/en/gallery",
  "/de/gastebuch": "/en/guestbook",
  "/de/kontakt": "/en/contact",
  "/de/motorrader": "/en/motorcycles",
  "/de/reisefuhrer": "/en/guide",
  "/de/termine": "/en/dates",
  "/de/touren": "/en/tours",
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
      i18n: {
        defaultLocale: "de",
        locales: {
          de: "de-DE",
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
            { lang: "de-DE", url: `${siteUrl}${dePath}/` },
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
