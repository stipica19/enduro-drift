# Priručnik učenja — Enduro Drift Bosnien

Ovo je dnevnik/priručnik onoga što smo do sad izgradili kroz ovaj projekat, i **zašto** je svaki dio napravljen na taj način. Cilj mu je da ti (ili budući ti, ili Claude u novoj sesiji) možeš pregledati šta je gotovo, koji koncept stoji iza čega, i gdje smo stali.

Puna arhitektonska pravila su u `CLAUDE.md` (checked into repo) — ovaj fajl je "kako smo stigli dovde", ne zamjena za njega.

---

## 1. Monorepo temelji

**Šta:** `git init`, root `package.json` (`private: true`, samo metapodaci, bez zavisnosti), `pnpm-workspace.yaml` (`packages: [apps/*, packages/*]`), `.gitignore`.

**Zašto:** pnpm workspaces omogućava da `apps/frontend` i `apps/backend` (i kasnije `packages/shared`) žive u jednom repou, dijele `node_modules` (linkovano, ne duplirano), i da se komande targetiraju pojedinačno preko `--filter <ime-paketa>`. Root `package.json` mora postojati da bi pnpm prepoznao workspace, ali sam po sebi nema zavisnosti — svaki paket ima svoje.

**Gotcha:** pnpm mora parsirati **sve** `package.json` fajlove u workspace putanjama prije nego primijeni bilo koji `--filter` — ako je i jedan od njih prazan/nevaljan JSON (npr. `apps/frontend/package.json` u jednom trenutku), puca cijela komanda i za druge pakete.

---

## 2. Backend — Fastify "hello world"

**Fajlovi:** `apps/backend/package.json`, `tsconfig.json`, `src/app.ts`, `src/server.ts`.

**Koncept — `app.ts` vs `server.ts`:** `app.ts` izvozi `buildApp()` koja pravi i konfiguriše Fastify instancu (registruje plugine/rute) ali je **ne pokreće**. `server.ts` je entry point koji tu instancu pokrene (`.listen()`). Razdvajanje omogućava da se instanca kasnije testira direktno (import `buildApp()`, pogađaj rute) bez da se stvarno otvara port.

**Prva ruta:** `GET /api/health` → `{ status: "ok" }`.

**Gotcha:** pnpm (v10+) po defaultu blokira `postinstall` skripte zavisnosti (npr. `esbuild`, koji `tsx` koristi ispod haube) — treba `pnpm approve-builds` da ih eksplicitno odobriš. Sigurnosna mjera protiv supply-chain napada, ne bug.

**Test:** `pnpm --filter backend dev` + `curl http://localhost:3001/api/health`.

---

## 3. Frontend — Astro "hello world" spojen na backend

**Fajlovi:** `apps/frontend/package.json` (scripts: dev/build/preview), `astro.config.mjs`, `tsconfig.json` (extends `astro/tsconfigs/strict`), `src/pages/de/index.astro`.

**Koncept — frontmatter vs template:** Svaki `.astro` fajl ima dva dijela: frontmatter (između `---`), koji se izvršava **na serveru** (Node), nikad ne stiže u browser; i template (HTML + `{izrazi}`) ispod. Po defaultu Astro šalje **nula JS** klijentu.

**Zašto fetch na backend radi bez CORS-a:** Poziv `fetch("http://localhost:3001/api/health")` u frontmatteru se izvršava server-to-server (Astro dev server → Fastify dev server), nikad iz browsera — CORS postaje relevantan tek kad browser sam šalje zahtjev (npr. kasnije, booking forma).

**Gotcha:** Astro 7 je uklonio "legacy" content collections lokaciju (`src/content/config.ts`) — sad mora biti `src/content.config.ts` sa definisanim `loader`-om. Pošto još ne koristimo content collections, prazan legacy fajl je obrisan; pravimo ga ispravno kad stignemo do blog/tours kolekcija.

**Test:** dva terminala (`pnpm --filter backend dev` + `pnpm --filter frontend dev`), otvoriti `http://localhost:4321/de`.

---

## 4. MongoDB Atlas konekcija

**Odluka:** Atlas (managed), ne self-hosted Docker servis — riješava otvorenu stavku iz `CLAUDE.md`.

**Fajlovi:** `.env` / `.env.example` (`PORT`, `MONGODB_URI`, `MONGODB_DB_NAME`), `src/config/env.ts` (učitava `.env` preko `dotenv/config`), `src/plugins/mongo.ts`.

**Koncept — Fastify plugin encapsulation:** Fastify po defaultu izoluje pluginove — decorator koji plugin doda (`fastify.mongo`) nije vidljiv van njega, osim ako se plugin wrap-uje sa `fastify-plugin` (`fp(...)`). Ovo je namjerna izolacija koju "probijamo" kad želimo da nešto (konekcija na bazu) bude dostupno svim rutama.

**Koncept — TS module augmentation:** `declare module "fastify" { interface FastifyInstance { mongo: {...} } }` — govori TypeScript-u da `FastifyInstance` od sada ima `.mongo` polje; bez ovoga strict mode bi javljao grešku svugdje gdje se `fastify.mongo` koristi.

**Zašto native MongoDB driver, ne Mongoose:** Fastify već radi validaciju request body-ja preko JSON Schema/Zod na granici rute — dupla validacija (i na ruti i u Mongoose šemi) je suvišna. Model podataka (`tours`, `bookings`...) je fiksan i ne mijenja se kroz self-service editor, pa Mongoose-ova glavna prednost (fleksibilna, često mijenjana šema) ovdje ne igra ulogu. Native driver + sopstveni TS tipovi su direktniji, manje magije, manje overhead-a.

**Test:** log `"MongoDB connected"` pri startu backend servera.

---

## 5. Booking ruta — `POST /api/bookings`

**Prva verzija:** ručni JSON Schema (`schemas/booking.ts`) + ručno pisan TS interfejs, `fastify.post<{ Body: CreateBookingBody }>(...)`.

**Koncept — Fastify automatska validacija:** Fastify koristi AJV ispod haube — kad rutu registruješ sa `schema.body`, dolazni request se automatski provjeri; ako ne odgovara šemi, Fastify sam vrati `400`, bez ručnih `if` provjera. `additionalProperties: false` odbija svako polje koje nije eksplicitno definisano.

**Refaktor na Zod** (vidi sekciju 7) — ruta danas uvozi `createBookingSchema` iz `packages/shared`, ne iz lokalnog `schemas/booking.ts` (taj fajl je zastario/prazan).

**Server postavlja `status: "pending"` i `internalNotes: ""`** — gost ih nikad ne šalje sam, u skladu sa CLAUDE.md pravilom da booking flow ostaje ručan (vlasnik potvrđuje emailom).

---

## 6. Uvid u staru bazu (migracijski kontekst)

Vlasnik je pokazao stvarne dokumente iz stare (Mongoose) baze. Ključni nalazi (detaljno u memory fajlu `legacy-db-schema`):

- Stara `tours` kolekcija spaja "tip ture" i "konkretan termin" u jedan dokument (svaki termin = novi `tours` dokument sa svojim `checkIn_date`/`checkOut_date`). Novi model ih razdvaja: `tours` (definicija ture) + `tourDates` (konkretni termini sa kapacitetom) — stvarno poboljšanje, ne kopiramo staru strukturu.
- `tour_number` u starim booking dokumentima je ObjectId referenca na `tours._id`, ali se zove isto kao `tours.tour_number` (string) — zbunjujuće. Novi model koristi čisto `tourId`.
- Bug: `rentaBike` (typo) → ispravljeno u `rentBike`.
- Stari sistem nema `status` niti `bookingType` (join/private) polja — potpuno nove stvari koje uvodimo.
- **Odluka (vlasnik):** i `join` i `private` booking uvijek biraju datum iz fiksne `tourDates` kolekcije (vlasnik definiše termine) — nema slobodnog/custom izbora datuma kao u starom sistemu. `tourDateId` je obavezan za oba tipa.

---

## 7. Zod + `packages/shared`

**Zašto:** Ručno pisanje JSON Schema (runtime validacija) i TS interfejsa (compile-time tip) za isti oblik podataka je dupliranje. Zod rješava to — jedna definicija, tip se izvede automatski (`z.infer<typeof schema>`).

**Novi workspace paket:** `packages/shared` — `package.json` sa `"main"`/`"types"` koji pokazuju direktno na `src/index.ts` (bez build koraka; `tsx` i Astro/Vite transpajlu TS izvor u letu kroz workspace link). Dodaje se kao zavisnost preko `"shared": "workspace:*"` u `package.json` backenda i frontenda — `workspace:*` govori pnpm-u "koristi lokalni paket iz ovog repoa, ne registry".

**Sadržaj:** `packages/shared/src/booking.ts` — `createBookingSchema` (Zod) + `CreateBookingInput` tip.

**Koncept — Fastify type provider:** `fastify-type-provider-zod` + `.withTypeProvider<ZodTypeProvider>()` na Fastify instanci + `setValidatorCompiler`/`setSerializerCompiler` — Fastify sad razumije Zod šeme direktno (konvertuje ih u AJV ispod haube), i `request.body` je automatski tipiziran iz šeme, bez ručnog generic-a (`fastify.post<{Body: X}>`).

**Trade-off koji smo prihvatili:** nova mala biblioteka (Zod) + novi workspace paket koji `CLAUDE.md` trenutno ne navodi u strukturi repoa — vrijedi ažurirati taj dokument kad se dođe do finalizacije strukture.

---

## 8. Admin auth (gotovo — backend)

**Zašto skripta, ne registracija:** CLAUDE.md pravilo #2 — samo jedan admin korisnik, nema self-service registracije. Admin korisnik se pravi **skriptom**, isti duh kao pravilo #3 (ture se upisuju direktno u bazu, ne kroz UI).

**Heširanje lozinke:** `apps/backend/src/services/authService.ts` — `hashPassword` / `verifyPassword`, iza kojih stoji `bcryptjs` (`bcrypt.hash(password, 12)` / `bcrypt.compare(...)`). Cost factor `12` = koliko puta se interno ponavlja heširanje; veći broj = sporije = otpornije na brute-force.

**Zašto je bitno da su ove funkcije "iza" jednog imena:** `scripts/seedAdmin.ts` (i login ruta) pozivaju `hashPassword`/`verifyPassword` po imenu — ne znaju niti mari im da li je ispod scrypt ili bcrypt. Zamjena implementacije nije zahtijevala nikakvu promjenu u skripti.

**Seed skripta:** `apps/backend/scripts/seedAdmin.ts` — čita `ADMIN_EMAIL`/`ADMIN_PASSWORD` iz `.env`, hešira lozinku, upiše/ažurira (`upsert: true`) dokument u `adminUsers` kolekciji. Pokreće se ručno: `pnpm --filter backend exec tsx scripts/seedAdmin.ts`.

**Sesija — potpisan cookie, bez session store-a:** `@fastify/cookie` (čist JS, bez native dependencyja) potpisuje vrijednost cookie-ja HMAC-om (`secret` iz `SESSION_SECRET`). Nema server-side session store (Redis/Mongo) — za jednog admin korisnika je nepotrebna komplikacija.

**Fajlovi:**
- `plugins/adminAuth.ts` — `requireAdmin` decorator, `preHandler` funkcija koja provjerava potpisan cookie i vraća `401` ako nedostaje/nije validan.
- `routes/admin/auth.ts` — `POST /api/admin/auth/login` (provjeri email+lozinku preko `verifyPassword`, postavi cookie), `POST /api/admin/auth/logout` (obriše cookie).
- `routes/admin/bookings.ts` — `GET /api/admin/bookings`, zaštićena sa `{ preHandler: fastify.requireAdmin }`.
- `packages/shared/src/auth.ts` — `loginBodySchema` (Zod), dijeljena šema za login (koristiće je i frontend admin login forma).

**Test (curl):** bez cookie-ja → `401`; login → `Set-Cookie`; sa cookie-jem → `200` + lista; logout → cookie obrisan. Sve prošlo.

**Gotcha — `.env` lokacija:** `pnpm --filter backend <bilo šta>` postavlja working directory na `apps/backend/`, ne na root repoa. `dotenv/config` čita `.env` iz trenutnog working directory-ja, ne traži ga gore po stablu foldera. Zaključak: **svaki paket ima svoj `.env`** (`apps/backend/.env`, `apps/frontend/.env`) — root `.env` (ako postoji) backend/frontend skripte ne vide kad se pokreću preko `--filter`.

---

## 9. Admin login — prvi React island

**Fajlovi:** `apps/frontend/astro.config.mjs` (`@astrojs/react` integracija), `apps/backend/src/plugins` + `app.ts` (`@fastify/cors`), `apps/frontend/src/lib/apiClient.ts` (fetch helper), `apps/frontend/src/components/islands/AdminLogin.tsx`, `apps/frontend/src/pages/admin/login.astro`.

**Koncept — Astro islands:** Stranica je po defaultu statičan HTML (nula JS). `client:load` na komponenti znači "hidratiši ovu komponentu odmah u browseru" — samo ta komponenta dobije JS, ostatak stranice ostaje statičan.

**Koncept — CORS + cookie cross-origin:** Prvi put browser (frontend, port 4321) direktno zove backend (port 3001) — pravi cross-origin poziv iz JS-a (za razliku od dosadašnjih server-to-server fetch-eva u Astro frontmatteru). `@fastify/cors` sa `origin: env.frontendOrigin, credentials: true` na backendu + `credentials: "include"` na frontend fetch-u — oboje moraju biti podešeni da se `session` cookie pošalje/primi cross-origin. Wildcard origin (`"*"`) nije dozvoljen sa credentials — mora biti eksplicitan origin.

**Koncept — `PUBLIC_` prefiks:** Astro env varijable ubacuje u client-side JS bundle **samo** ako počinju sa `PUBLIC_` (npr. `PUBLIC_API_URL`) — sigurnosna mjera, sve ostalo ostaje server-only.

**`noindex`:** admin stranice imaju `<meta name="robots" content="noindex" />` (pravilo #6) — ali to je samo UI napomena za tražilice, **ne** zaštita. Prava zaštita je `requireAdmin` guard na backendu.

**Test:** login sa pogrešnom lozinkom → greška prikazana u formi; sa tačnom → cookie postavljen (vidljivo u DevTools → Application → Cookies), redirect na `/admin`.

---

## Šta je NAMJERNO izostavljeno (za sada)

- `address`, `nights` polja iz stare booking strukture — nisu prebačena u novu Zod šemu (nights se izvodi iz datuma termina, address nema jasnu svrhu za ovaj booking flow). Javiti ako ih ipak treba.
- Custom/slobodan izbor datuma za "private" bookinge — vlasnik je potvrdio da su datumi uvijek fiksni preko `tourDates`.
- `docs/SPECIFIKACIJA.md` — CLAUDE.md ga referencira, ali ne postoji u repou. Radimo bez njega za sada (CLAUDE.md ima dovoljno detalja).

---

## Kako pokrenuti sve za dev

```bash
# terminal 1 — backend
pnpm --filter backend dev

# terminal 2 — frontend
pnpm --filter frontend dev
```

MongoDB je Atlas (cloud), nema lokalnog kontejnera za bazu — konekcija ide preko `MONGODB_URI` u `.env`.
