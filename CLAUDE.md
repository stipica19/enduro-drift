# CLAUDE.md

Ovaj fajl se automatski učitava na početku svake Claude Code sesije u ovom repou. Puna specifikacija (sitemap, SEO strategija, booking UX, migracija) je u `docs/SPECIFIKACIJA.md` — pročitaj je prije bilo kakve veće strukturne izmjene. Ovaj fajl je "brzi vodič", ne duplicira sve iz specifikacije.

## Projekat

**Enduro Drift Bosnien** — redizajn postojeće web stranice za biznis koji nudi vođene Enduro motociklističke ture u Bosni i Hercegovini (Gornji Vakuf-Uskoplje). Stari sajt: endurodriftbosnien.com.

**Primarni cilj:** SEO-prioritetna javna stranica koja privlači posjetioce preko Googlea (DE/AT/CH tržište prvo, EN paralelno) i konvertuje ih u booking upite. Admin dio je namjerno minimalan.

## Tech stack (finalna odluka — ne mijenjati bez razloga)

- **Frontend:** Astro (static-first, islands samo za interaktivne dijelove — booking forma, admin login, admin lista)
- **Backend:** Fastify (Node.js API, TypeScript)
- **Baza:** MongoDB, native driver — **NE Mongoose**
- **Package manager:** pnpm (workspaces) — **NIKAD npm ili yarn**
- **Deployment:** Docker + docker-compose na jednom VPS-u (Hetzner/DigitalOcean), GitHub Actions CI/CD

## Struktura repozitorija

```
apps/frontend   → Astro: javna stranica (SSG) + admin UI (client-side islands)
apps/backend    → Fastify API: booking submit, admin auth, admin bookings CRUD
```

Monorepo, pnpm workspaces. **Docker build context za OBA servisa je root repoa**, ne `apps/frontend`/`apps/backend` pojedinačno — pnpm treba vidjeti `pnpm-workspace.yaml` i `pnpm-lock.yaml` da `--filter` radi. Vidi `apps/*/Dockerfile` i `.github/workflows/deploy.yml`.

## Komande

```bash
pnpm install                          # instalira sve workspace pakete
pnpm --filter frontend dev            # Astro dev server
pnpm --filter backend dev             # Fastify dev mode
pnpm --filter frontend build
pnpm --filter backend build
docker compose -f docker-compose.dev.yml up   # lokalni full-stack dev
```

## KRITIČNA arhitekturna pravila — ne mijenjaj bez izričitog dogovora s vlasnikom

1. **Booking ostaje ručni tok.** Gost šalje upit preko forme → status `pending` u MongoDB → vlasnik ručno kontaktira i potvrđuje email-om (100€ depozit). **Ne graditi** automatsku potvrdu rezervacije, live kalendar dostupnosti sa self-checkout, ili plaćanje online.
2. **Samo jedan admin korisnik.** Nema sistema rola/permisija. Jedan login, jedna sesija (httpOnly + secure cookie, ne JWT u localStorage).
3. **Ture se NE uređuju kroz admin UI.** Cijene/termini/paketi idu kroz developera (direktan MongoDB upis ili seed skripta), ne kroz CRUD formu u adminu. `tours` kolekcija postoji radi konzistentnosti i buduće proširivosti — ne graditi self-service editor sada.
4. **Admin obim = login + lista prijava.** Bez punog dashboarda, filtera, statistike u prvoj verziji — samo ono što je eksplicitno traženo.
5. **Ne dodavati nepotrebne biblioteke.** Bez UI frameworka (shadcn/MUI/Bootstrap), bez teških animacijskih biblioteka, bez state-management biblioteka koje nisu neophodne. Astro šalje minimalan JS po defaultu — ne narušavati to nepotrebnim client-side kodom.
6. **`/admin/*` rute su `noindex`** i zaštićene isključivo u Fastify-u (svaki `/api/admin/*` endpoint provjerava sesiju na serveru) — Astro `/admin` stranica sama po sebi NIJE zaštita, samo UI.
7. **Ne mijenjati tech stack.** Astro + Fastify je finalna odluka nakon poređenja sa Next.js-om — ne predlagati Next.js/Nuxt/SvelteKit itd.

## SEO — prioritet #1, ne kompromitovati radi brzine implementacije

- **Unique meta title/description po stranici.** Stari sajt je imao identičan meta na SVIM stranicama (klasičan duplicate-meta bug) — ne ponavljati tu grešku ni na jednoj novoj stranici.
- Prioritet tržišta: **DE/AT/CH prva faza**, EN paralelno kao druga jača ruka.
- **Zadržati postojeće URL-ove** koji već rangiraju (lista ispod) — ne mijenjati ih bez izričitog redirect plana.
- Hreflang de↔en obavezan na svim ekvivalentnim stranicama.
- Structured data (JSON-LD): Organization/LocalBusiness na homepage, TouristTrip po turi, Article na blog postovima, BreadcrumbList — samo gdje sadržaj to realno opravdava, ne dodavati shemu "za svaki slučaj".
- Interno linkanje mora postojati u oba smjera: tour stranice ↔ blog ↔ team ↔ travel guide (`/de/reisefuhrer`).

## URL struktura (DE — EN prati identičnu logiku sa engleskim segmentima)

**Zadržano, URL se NE mijenja:**
`/de`, `/de/anmeldung`, `/de/galerie`, `/de/blog`, `/de/blog/[slug]`, `/de/kontakt`, `/de/termine`, `/de/gastebuch`, `/de/privacy`

**Repurposed (URL zadržan, sadržaj promijenjen):**
`/de/reisefuhrer` → postaje pravi travel-guide o Bosni (viza, sezona, kako doći). Bio vodiča (Mladen, Dario, Anel) je preseljen na `/de/team`, ne ostaje ovdje.

**Novo:**
`/de/touren`, `/de/touren/[slug]` (×3 postojeće ture dobijaju svoj URL), `/de/team`, `/de/motorrader`, `/de/ausruestung`

EN mirror: `/en/tours`, `/en/booking`, `/en/gallery`, `/en/contact`, `/en/dates`, `/en/guide`, `/en/team`, `/en/motorcycles`, `/en/equipment`, `/en/privacy`.

## Database model (MongoDB kolekcije — skraćeno, puna verzija u specifikaciji)

```
tours        → slug, lang, title, difficulty, pricing{ownBike,rentalBike}, included[], excluded[]...
tourDates    → tourId, season, startDate, endDate, capacity, bookedCount
bookings     → tourId, tourDateId, customer{...},
                participants, arrivalMethod, rentBike, status, internalNotes
blogPosts    → slug, lang, title, contentHtml, tags[], publishedAt
team         → name, role, bio, images[]
adminUsers   → email, passwordHash
reviews      → name, rating, text, source, date
```

## Poznati bugovi sa stare stranice — popraviti pri implementaciji, ne prenositi

- Prazne tabele termina na `/anmeldung` (2026/2027) — moraju vući stvarne podatke iz `tourDates`.
- Zaostali neprevedeni tekst "prevedi" na booking formi — ukloniti potpuno.
- Blog linkovi trenutno vode na `/de/contact` (ne postoji) umjesto `/de/kontakt` — svi interni linkovi moraju biti tačni.
- Social ikone na kontakt stranici su prazan `href="#"` — popuniti stvarnim linkovima.
- Galerija se ne renderuje server-side na starom sajtu (ostaje "Loading...") — nova verzija mora biti SSG/SSR, ne prazan loading state.
- Hero tvrdi "300+ Bewertungen" bez ijedne prikazane recenzije — `reviews` kolekcija mora se stvarno koristiti i prikazati na stranici.

## Design smjer

Tamna/zemljana paleta (ugljen/crna baza + rust-narandžasta ili blatno-zelena akcenat) — ne generička plava/tirkizna "adventure travel" paleta. Snažna, blago "condensed" tipografija za naslove, čitljiv sans-serif za tijelo teksta. Fotografija na prvom mjestu (autentična, ne stock). Suptilna animacija — izbjegavati "gaming" flash efekte. Logo postoji, ostatak brand kita je otvoren za predlog (vidi specifikaciju sekcija 6 za detalje).

## Deployment

Push na `main` → GitHub Actions builda oba Docker image-a (`ghcr.io/OWNER/enduro-frontend`, `ghcr.io/OWNER/enduro-backend`) → push na GitHub Container Registry → SSH na VPS → `docker compose pull && docker compose up -d`. Vidi `.github/workflows/deploy.yml` i `docker-compose.yml`.

MongoDB: Atlas (managed) ili self-hosted docker servis na istom VPS-u — odluka još otvorena, provjeri `.env` na VPS-u za `MONGODB_URI` prije pretpostavljanja.

## Šta NE raditi (česte greške koje treba izbjeći)

- Ne dodavati korisničke naloge za goste — samo admin ima login.
- Ne graditi merch/e-commerce ili event/takmičenje sistem — nije zatraženo, ne pretpostavljati buduće potrebe bez pitanja.
- Ne mijenjati package manager na npm/yarn ni "radi jednostavnosti".
- Ne birati drugi frontend framework mimo Astro.
- Ne izmišljati poslovne podatke (cijene, datume, brojeve) koji nisu potvrđeni — označiti kao `TODO` i pitati vlasnika, ne nagađati.
