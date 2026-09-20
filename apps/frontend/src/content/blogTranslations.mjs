// DE slug → EN slug za blog objave koje su prijevod jedna druge. Jedini izvor istine za hreflang:
// čitaju ga i blog stranice (src/lib/blog.ts) i sitemap (astro.config.mjs), zato je .mjs a ne .ts.
//
// EN slugovi su namjerno ostali njemački (npr. "enduro-urlaub-balkan"): ti URL-ovi već postoje i
// indeksirani su na starom sajtu, pa ih ne mijenjamo (CLAUDE.md: zadržati URL-ove koji rangiraju).
// Nova objava koja nije u ovoj mapi dobija canonical, ali ne i hreflang.
export const blogTranslations = {
  "enduro-ausruestung-bosnien": "enduro-ausruestung-bosnien",
  "enduro-tour-bosnien-2026-saisonstart": "enduro-tour-bosnia-2026-season-launch",
  "enduro-tour-bosnien-2027-saisonstart": "enduro-tour-bosnia-2027-season-open",
  "enduro-urlaub-balkan": "enduro-urlaub-balkan",
  "oida-style-youtuber-besuch-enduro-drift": "enduro-abenteuer-vranica-berg",
  "top-5-grunde-enduro-bosnien": "top-5-grunde-enduro-bosnien",
};
