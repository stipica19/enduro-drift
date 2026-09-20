// Kanonski host je www: stari sajt rangira na www.endurodriftbosnien.com (apex mu radi 301 na www),
// pa novi sajt mora zadržati isti host, inače se sav postojeći ranking seli na novi host.
// Apex → www 301 se radi u host nginxu (vidi DEPLOY.md), ne ovdje.
// astro.config.mjs ima vlastitu kopiju jer config ne uvozi TS — držati ih usklađenima.
export const siteUrl = "https://www.endurodriftbosnien.com";
