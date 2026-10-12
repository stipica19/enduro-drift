# DEPLOY.md

Uputa za deploy Enduro Drift Bosnien sajta na VPS.

> **Staging domena:** ovaj deploy ide na `dev.endurodriftbosnien.com`, staging kopiju
> sajta (zamijenila je raniju testnu `dev.skin-glow.beauty`), ne na finalnu
> `www.endurodriftbosnien.com`. Zato su nginx/certbot koraci, `.env` primjeri i GitHub
> secreti u ovom fajlu podešeni za `dev.endurodriftbosnien.com`.
> Kanonski URL-ovi, hreflang i JSON-LD **unutar same aplikacije** (Layout.astro,
> astro.config.mjs) su hardkodirani na `https://www.endurodriftbosnien.com` — to je
> finalna SEO domena i namjerno se ne mijenja zbog staging deploya. Host je **`www`** jer
> stari sajt rangira na njemu (apex `endurodriftbosnien.com` mu radi 301 na `www`).
> Kad dođe vrijeme za pravi produkcijski deploy, zamijeni `dev.endurodriftbosnien.com` sa
> `www.endurodriftbosnien.com` na mjestima označenim ispod i prati sekciju
> _Produkcija: endurodriftbosnien.com_ u koraku 4.

**Arhitektura:** nginx na hostu radi TLS i rutiranje. Frontend i backend su Docker
kontejneri vezani na `127.0.0.1` — nedostupni direktno s interneta, samo preko nginxa.

```
Internet
   │
   ▼
nginx na hostu (80/443, Let's Encrypt)
   ├─ /api/*  →  127.0.0.1:${BACKEND_HOST_PORT}   backend kontejner   (Fastify)
   └─ /*      →  127.0.0.1:${FRONTEND_HOST_PORT}  frontend kontejner  (nginx + statički Astro)
                                          │
                              MongoDB Atlas (vanjski)
```

> **Portovi su podesivi (`BACKEND_HOST_PORT`/`FRONTEND_HOST_PORT` u `.env`,
> default `3095`/`8095`).** Uobičajeni `3001`/`8080` se namjerno ne koriste jer ih na
> staging VPS-u već zauzima druga aplikacija. Provjeri prije prvog deploya da su
> odabrani portovi slobodni (naredba ne smije ništa ispisati):
> ```bash
> sudo ss -tlnp | grep -E ':(3095|8095)\b'
> ```
> Ako je nešto zauzeto, promijeni odgovarajuću vrijednost u `.env` (npr.
> `BACKEND_HOST_PORT=3096`) i koristi taj broj u nginx `proxy_pass` (korak 4)
> — mora se poklapati na oba mjesta. Interni port backend kontejnera (`PORT=3001`)
> se **ne** mijenja — on živi u mreži kontejnera i ne sudara se s hostom.

**Astro je statički (SSG), bez SSR-a.** Važna posljedica: stranice `/de/anmeldung`,
`/de/termine`, `/de/galerie` i `/de/gastebuch` povlače podatke iz API-ja **tokom
builda**, ne pri svakom zahtjevu. Zato CI mora dignuti backend prije nego gradi
frontend — bez toga `fetch` baca i build pada. Druga posljedica: kad se promijene
podaci u bazi (npr. novi termin), sajt ih **neće** prikazati dok se frontend ne
rebuilda. Za to postoji ručno pokretanje deploya (vidi _Osvježavanje sadržaja_).

---

## 1. Priprema servera

**Što radimo:** instaliramo Docker (pokreće aplikaciju), nginx (TLS + rutiranje) i
certbot (certifikati), pa kreiramo mapu u kojoj će živjeti `compose.yml` i `.env`.

**Zašto:** nginx i certbot na hostu, a ne u Dockeru, jer tako sam želiš upravljati
konfiguracijom u `/etc/nginx/sites-available`.

```bash
# Prijava na server
ssh root@TVOJ_SERVER_IP

# Sistemska ažuriranja
apt update && apt upgrade -y

# Docker (oficijelna skripta)
curl -fsSL https://get.docker.com | sh

# nginx + certbot
apt install -y nginx certbot python3-certbot-nginx

# Neroot korisnik za deploy (ne radimo sve kao root)
adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy

# Mapa za deploy fajlove
mkdir -p /home/deploy/apps/enduro-drift-bosnien
chown deploy:deploy /home/deploy/apps/enduro-drift-bosnien
```

Provjera da Docker radi:

```bash
docker run --rm hello-world
```

---

## 2. Firewall i portovi

**Što radimo:** propuštamo samo SSH, HTTP i HTTPS.

**Zašto:** portovi 3095 i 8095 se **ne otvaraju** — kontejneri su vezani na
`127.0.0.1`, pa im pristupa samo nginx s istog servera. Port 80 mora ostati otvoren
i nakon dobijanja certifikata jer certbot preko njega radi obnovu.

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

---

## 3. DNS

**Što radimo:** usmjeravamo domenu na IP servera.

**Zašto:** certbot izdaje certifikat samo ako domena stvarno pokazuje na ovaj server.

U DNS zoni domene `endurodriftbosnien.com` (kod onoga ko trenutno upravlja njenim DNS-om)
dodaj:

| Tip | Ime   | Vrijednost       |
| --- | ----- | ---------------- |
| A   | `dev` | `TVOJ_SERVER_IP` |

> **Ne diraj zapise `@` i `www`** (ni `MX`/`TXT`) — na njima radi produkcija i email.
> Za staging se dodaje samo `dev`.

Provjera (čekaj da se propagira, može potrajati do nekoliko sati):

```bash
dig +short dev.endurodriftbosnien.com
```

Mora vratiti IP servera. **Ne nastavljaj na certbot (korak 4, _HTTPS_) dok ovo ne prođe.**

---

## 4. nginx konfiguracija

**Što radimo:** pišemo server blok koji `/api/*` šalje backendu, a sve ostalo
frontendu.

**Zašto:** frontend i backend su na istoj domeni, pa browser nema CORS problema i
sesijski cookie za admin radi bez `SameSite` komplikacija.

> Brojevi portova ispod (`3095`, `8095`) su **default** vrijednosti. Ako si ih
> morao promijeniti u `.env` zbog sudara s drugom aplikacijom na istom VPS-u,
> ovdje upiši te ISTE brojeve — `proxy_pass` mora pogoditi tačan host port.

```bash
sudo nano /etc/nginx/sites-available/enduro
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name dev.endurodriftbosnien.com;

    # certbot će ovaj blok prepisati i dodati TLS + redirect na 443
    client_max_body_size 2m;

    # SAMO staging — vidi "Staging: zabrani Googleu indeksiranje" ispod
    add_header X-Robots-Tag "noindex, nofollow" always;

    # Fastify API — port mora biti isti kao BACKEND_HOST_PORT u .env
    location /api/ {
        proxy_pass http://127.0.0.1:3095;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        # Backend čita request.ip za reCAPTCHA provjeru — bez ovoga vidi samo IP nginxa
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Statički Astro sajt — port mora biti isti kao FRONTEND_HOST_PORT u .env
    location / {
        proxy_pass http://127.0.0.1:8095;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktivacija:

```bash
sudo ln -s /etc/nginx/sites-available/enduro /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default   # ukloni default "Welcome to nginx"
sudo nginx -t                                  # provjeri sintaksu PRIJE reloada
sudo systemctl reload nginx
```

### Staging: zabrani Googleu indeksiranje

`dev.endurodriftbosnien.com` je javno dostupna kopija sajta na subdomeni prave domene.
Stranice imaju `canonical` na `www.endurodriftbosnien.com`, pa ih Google u pravilu neće
indeksirati kao zasebne, ali to nije zajamčeno — a duplikat na istoj domeni direktno se takmiči
s produkcijom. Zato staging `server` blok gore ima:

```nginx
    add_header X-Robots-Tag "noindex, nofollow" always;
```

> **UPOZORENJE — ovo NE smije završiti u produkcijskom bloku.** Header govori Googleu da
> ne indeksira ništa na toj domeni. Na `www.endurodriftbosnien.com` bi uklonio cijeli sajt iz
> pretrage, uključujući blogove. Pri produkcijskom deployu pravi se **novi** `server` blok
> za `www.endurodriftbosnien.com` (ne kopira se ovaj), a ovaj header ostaje samo uz staging.
> Provjera na produkciji: `curl -sI https://www.endurodriftbosnien.com/de/ | grep -i x-robots`
> **ne smije** ništa ispisati. Na stagingu **mora** ispisati `x-robots-tag: noindex, nofollow`.

### HTTPS

**Što radimo:** certbot izdaje certifikat i sam prepisuje nginx konfiguraciju.

```bash
sudo certbot --nginx -d dev.endurodriftbosnien.com
```

Obnova je automatska (systemd timer). Provjera da obnova radi:

```bash
sudo certbot renew --dry-run
```

### Produkcija: endurodriftbosnien.com

**Što radimo:** za pravi deploy pravimo **novi** nginx server blok (ne kopira se staging blok
zbog `X-Robots-Tag`) u kojem je `www.endurodriftbosnien.com` glavni host, a apex
`endurodriftbosnien.com` samo preusmjerava na njega.

**Zašto:** stari sajt rangira na `www` (provjereno: `endurodriftbosnien.com` → 301 →
`www.endurodriftbosnien.com`, `www` vraća 200). Kanonski URL-ovi, hreflang, sitemap i JSON-LD u
aplikaciji su zato na `www`. Da apex servira sajt bez redirecta, imali bismo dva hosta s istim
sadržajem, a da je `www` bez redirecta, sav postojeći ranking bi morao migrirati.

DNS: `A` zapis za `@` **i** za `www` na IP servera.

```nginx
# Apex → www (samo redirect)
server {
    listen 80;
    listen [::]:80;
    server_name endurodriftbosnien.com;
    return 301 https://www.endurodriftbosnien.com$request_uri;
}

# Glavni host — isti location blokovi kao u staging bloku gore (/api/ i /),
# BEZ add_header X-Robots-Tag.
server {
    listen 80;
    listen [::]:80;
    server_name www.endurodriftbosnien.com;
    client_max_body_size 2m;

    location /api/ { ... }
    location /     { ... }
}
```

```bash
sudo certbot --nginx -d www.endurodriftbosnien.com -d endurodriftbosnien.com
```

Vrijednosti koje se **moraju** promijeniti na `www` (inače CORS/cookie ili booking forma padaju):

| Gdje                  | Ključ                | Vrijednost                              |
| --------------------- | -------------------- | --------------------------------------- |
| `.env` na VPS-u       | `FRONTEND_ORIGIN`    | `https://www.endurodriftbosnien.com`    |
| GitHub Secret         | `PUBLIC_API_URL`     | `https://www.endurodriftbosnien.com`    |

`PUBLIC_API_URL` mora biti isti host s kojeg se servira stranica: da pokazuje na apex, POST iz
forme bi dobio 301 na `www` i booking bi prestao raditi.

Provjera nakon deploya:

```bash
curl -sI http://endurodriftbosnien.com/de/  | grep -iE '^(HTTP|location)'   # 301 → https://www...
curl -sI https://endurodriftbosnien.com/de/ | grep -iE '^(HTTP|location)'   # 301 → https://www.endurodriftbosnien.com/de/
curl -sI https://www.endurodriftbosnien.com/de/ | grep -iE '^(HTTP|x-robots)' # 200, BEZ x-robots-tag
```

---

## 5. MongoDB Atlas — pristup

**Što radimo:** dopuštamo pristup bazi sa servera i sa GitHub Actions runnera.

**Zašto:** GitHub runneri imaju promjenjive IP adrese, a CI se spaja na bazu jer
frontend build povlači podatke iz API-ja. Ako Atlas blokira runnera, build pada.

U Atlas konzoli → **Network Access**:

- dodaj IP VPS-a,
- za CI: `0.0.0.0/0` (pristup odasvud). Zaštita tada ostaje na jakoj lozimci iz
  `MONGODB_URI`. Ako ti je to preširoko, alternativa je self-hosted runner sa
  fiksnim IP-om.

---

## 6. GitHub Secrets

**Što radimo:** upisujemo tajne koje workflow koristi.

**Zašto:** ništa od ovoga ne smije biti u gitu. `GITHUB_TOKEN` se ne dodaje ručno —
GitHub ga sam daje.

**Settings → Secrets and variables → Actions → New repository secret**

| Secret               | Vrijednost / kako dobiti                                              |
| -------------------- | --------------------------------------------------------------------- |
| `MONGODB_URI`        | Atlas connection string                                               |
| `MONGODB_DB_NAME`    | `endurodrift`                                                         |
| `PUBLIC_API_URL`     | `https://dev.endurodriftbosnien.com` (ugrađuje se u klijentski JS)    |
| `RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key (javan, ali ide kao secret radi jednostavnosti) |
| `VPS_HOST`           | IP servera                                                            |
| `VPS_USER`           | `deploy`                                                              |
| `VPS_SSH_KEY`        | **privatni** SSH ključ (cijeli sadržaj, vidi ispod)                   |
| `VPS_PATH`           | `/home/deploy/apps/enduro-drift-bosnien`                              |

SSH ključ za deploy (generiši lokalno, ne na serveru):

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/enduro_deploy -N ""

# javni dio ide na server
ssh-copy-id -i ~/.ssh/enduro_deploy.pub deploy@TVOJ_SERVER_IP

# privatni dio ide u GitHub secret VPS_SSH_KEY
cat ~/.ssh/enduro_deploy
```

Provjeri da ključ radi prije prvog deploya:

```bash
ssh -i ~/.ssh/enduro_deploy deploy@TVOJ_SERVER_IP "docker ps"
```

---

## 7. Prvi deploy

### 7.1 Fajlovi na server

**Što radimo:** stavljamo `compose.yml` i `.env` u `/home/deploy/apps/enduro-drift-bosnien`.

**Zašto:** workflow na serveru samo pokreće `docker compose pull && up -d` — ne
kopira kod. `.env` sa tajnama živi **samo na serveru** i nikad u gitu.

```bash
ssh deploy@TVOJ_SERVER_IP
cd /home/deploy/apps/enduro-drift-bosnien

# compose.yml iz repoa (zamijeni OWNER/REPO i granu ako treba)
curl -fsSLO https://raw.githubusercontent.com/OWNER/REPO/main/compose.yml

nano .env
```

Sadržaj `.env` na serveru — popuni po `.env.example` iz repoa:

```env
GHCR_OWNER=stipica19
IMAGE_TAG=latest

# Host portovi — moraju se poklapati s proxy_pass u nginxu (korak 4).
# 3001/8080 na ovom VPS-u koristi druga aplikacija.
FRONTEND_HOST_PORT=8095
BACKEND_HOST_PORT=3095

# Interni port u kontejneru — ostaje 3001
PORT=3001
NODE_ENV=production
FRONTEND_ORIGIN=https://dev.endurodriftbosnien.com

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=endurodrift
OLD_MONGODB_DB_NAME=

# OBAVEZNO: bez njega admin prijava ne radi (backend u produkciji odbija startati).
# Generiši na serveru s "openssl rand -base64 32" i zalijepi rezultat ovdje.
# Komentar NE piši u istom redu kao vrijednost.
SESSION_SECRET=
RESEND_API_KEY=
CONTACT_EMAIL_TO=endurodriftbosnien@gmail.com
CONTACT_EMAIL_FROM=onboarding@resend.dev
RECAPTCHA_SECRET_KEY=
```

```bash
chmod 600 .env    # da ga drugi korisnici na serveru ne mogu čitati
```

### 7.2 GHCR paketi

Prvi `docker compose pull` neće uspjeti dok image-i ne postoje. Zato prvo pusti
workflow (push na `main` ili **Actions → Build & Deploy → Run workflow**).

Ako su paketi privatni, workflow **sam** prijavljuje VPS na GHCR prije svakog
`pull`-a (vidi korak "Deploy preko SSH-a" u `.github/workflows/deploy.yml`) —
koristi isti automatski `GITHUB_TOKEN` kojim je runner pushao image-e, tako da
nema potrebe za ručno generisanim Personal Access Tokenom niti ručnim
`docker login` korakom na serveru. Radi se pri svakom deployu, pa je i
self-healing — ako VPS ikad izgubi sačuvanu prijavu (rebuild, obrišeš
`~/.docker/config.json`...), sljedeći deploy je sam vrati.

Jednostavnija alternativa, ako ti ni to ne treba: u GitHubu **Packages →
enduro-frontend → Package settings → Change visibility → Public** — tada
prijava nije potrebna nikome, ni CI-ju ni serveru.

### 7.3 Pokretanje

```bash
cd /home/deploy/apps/enduro-drift-bosnien
docker compose pull
docker compose up -d
docker compose ps        # oba servisa moraju biti "Up", backend "healthy"
```

Provjera slojeva, od unutra prema van:

```bash
curl -fsS http://127.0.0.1:3095/api/health     # backend direktno
curl -fsS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8095/de/   # frontend direktno
curl -fsS https://dev.endurodriftbosnien.com/api/health                      # kroz nginx + TLS
curl -sI https://dev.endurodriftbosnien.com/ | grep -iE "^(HTTP|location)"   # korijen → 301 na /de/
curl -sI https://dev.endurodriftbosnien.com/de/ | grep -i x-robots           # mora biti noindex, nofollow
```

### 7.4 Admin nalog

Admin se kreira skriptom (u adminu nema registracije):

```bash
# lokalno, s ispravnim .env u apps/backend
cd apps/backend
npx tsx scripts/seedAdmin.ts
```

---

## 8. Automatske nadogradnje

Svaki push na `main` pokreće workflow, koji:

1. gradi i pusha **backend** image (tagovi: `latest` i commit SHA),
2. digne **privremeni backend** kontejner i čeka `/api/health`,
3. gradi i pusha **frontend** image (`--network=host`, pa `astro build` može doći do
   tog backenda za build-time podatke),
4. ugasi privremeni backend,
5. SSH-om na server upiše `IMAGE_TAG=<SHA>` u `.env`, pa `docker compose pull && up -d`.

Zašto SHA tagovi, a ne samo `latest`: `latest` ne govori _koja_ je verzija gore i ne
može se vratiti nazad. Sa SHA tagom rollback je promjena jedne linije.

### Osvježavanje sadržaja bez promjene koda

Pošto je sajt statički, novi termini ili slike u bazi **neće** se pojaviti sami.
Nakon promjene podataka pokreni **Actions → Build & Deploy → Run workflow** — to
rebuilda frontend s novim podacima.

---

## 9. Logovi

**Što radimo:** gledamo gdje je nastao problem — u aplikaciji ili u nginxu.

```bash
cd /home/deploy/apps/enduro-drift-bosnien

docker compose logs -f                 # svi servisi
docker compose logs -f backend         # samo Fastify
docker compose logs --tail=100 backend # zadnjih 100 linija
docker compose ps                      # status i health

# nginx na hostu
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u nginx -f
```

Gruba podjela:

| Simptom                    | Gdje gledati                             |
| -------------------------- | ---------------------------------------- |
| 502 Bad Gateway            | kontejner je pao → `docker compose logs` |
| Sajt radi, `/api/*` ne     | nginx `location /api/` blok              |
| Greška pri slanju maila    | `docker compose logs backend` (Resend)   |
| Certifikat istekao         | `sudo certbot renew`                     |
| Stari podaci na stranicama | treba rebuild frontenda (statički sajt)  |

Logovi kontejnera nisu vječni — ograniči ih da ne pojedu disk:

```bash
sudo nano /etc/docker/daemon.json
```

```json
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" }
}
```

```bash
sudo systemctl restart docker
```

---

## 10. Vraćanje na prethodnu verziju (rollback)

**Što radimo:** pokrećemo stariji image po SHA tagu.

**Zašto:** image-i su nepromjenjivi, pa je vraćanje samo promjena taga — bez
rebuilda i bez čekanja na CI.

Workflow pri svakom deployu zapiše prethodni tag u `.env.previous-tag`.

```bash
cd /home/deploy/apps/enduro-drift-bosnien

cat .env.previous-tag      # tag prije zadnjeg deploya
docker compose ps          # koji tag trenutno radi
```

Vraćanje:

```bash
nano .env                  # postavi IMAGE_TAG=<stari-sha>
docker compose pull
docker compose up -d
docker compose ps
```

Koje verzije uopšte postoje: **GitHub → Packages → enduro-backend / enduro-frontend**,
gdje su svi SHA tagovi.

Ako ni to ne pomogne, brzo gašenje sajta:

```bash
docker compose down        # nginx će vraćati 502
```

---

## 11. Česti problemi

**`Bind for 127.0.0.1:3095 failed: port is already allocated`**
Nešto drugo na VPS-u (najčešće druga aplikacija) već koristi taj port —
posebno vjerovatno na deljenom VPS-u sa više app-ova. Provjeri šta:
```bash
sudo ss -tlnp | grep 3095
docker ps -a --filter "publish=3095"
```
Popravka: u `.env` promijeni `BACKEND_HOST_PORT` (ili `FRONTEND_HOST_PORT` za
8095) na slobodan broj, ažuriraj `proxy_pass` u nginx configu (korak 4) na
ISTI broj, pa `sudo nginx -t && sudo systemctl reload nginx` i
`docker compose up -d`.

**502 Bad Gateway, a `docker compose ps` pokazuje da oba kontejnera rade**
`proxy_pass` u nginxu i `*_HOST_PORT` u `.env` se ne poklapaju — nginx tada šalje na port
na kojem sluša druga aplikacija ili ništa. Usporedi:
```bash
grep -E '^(FRONTEND|BACKEND)_HOST_PORT' .env
grep proxy_pass /etc/nginx/sites-available/enduro
docker compose ps --format '{{.Name}} {{.Ports}}'
```

**`docker compose pull` → `denied` / `unauthorized`**
Paketi su privatni i `docker login` korak u workflowu (7.2) nije uspio, ili paket
prvi put treba ručno povezati s repoom: GitHub → Package → **Package settings →
Manage Actions access** → dodaj repo s `Read` pristupom. Nakon toga sljedeći
deploy radi bez daljih koraka.

**Workflow pada na "Cekaj da backend odgovori"**
Backend se nije podigao u CI-ju. Najčešće Atlas blokira runnerov IP (korak 5) ili je
`MONGODB_URI` secret pogrešan. U logu workflowa ispisuju se i logovi kontejnera.

**Ne mogu se prijaviti u admin (`/admin/login`)**
Forma javlja razlog: "Pogrešan email ili lozinka" je pravi 401, a "Greška na serveru
(HTTP 500)" znači problem na backendu. Najčešći uzrok je prazan `SESSION_SECRET` u `.env`
na serveru (log: `signer.sign is not a function`). Backend s novijom verzijom u tom
slučaju uopće ne starta i u logu piše `SESSION_SECRET nije postavljen`.
```bash
docker compose logs --tail=30 backend | grep -iE "SESSION_SECRET|signer"
grep -c '^SESSION_SECRET=.\+' .env     # 1 = postavljen, 0 = prazan
```
Popravka: upiši vrijednost (`openssl rand -base64 32`) pa
`docker compose up -d --force-recreate backend` (obični restart ne učitava novi `.env`).
Email za prijavu mora biti onaj iz `ADMIN_EMAIL` kojim je pokrenut `seedAdmin.ts`.

**Kontakt forma vraća grešku**
`RESEND_API_KEY` fali ili domena nije verifikovana u Resendu. Dok domena nije
verifikovana, `CONTACT_EMAIL_FROM` mora ostati `onboarding@resend.dev`.

**reCAPTCHA odbija svaki zahtjev**
`RECAPTCHA_SECRET_KEY` (server) i `RECAPTCHA_SITE_KEY` (build) moraju biti iz **istog**
reCAPTCHA para. Ako je secret prazan, provjera se preskače — forma radi, ali bez zaštite.
Domena sajta mora biti i u listi domena tog ključa (reCAPTCHA admin konzola → Settings →
Domains). `endurodriftbosnien.com` pokriva i `www` i `dev` subdomenu; bez toga browser javlja
"Invalid domain for site key" i forma ne dobije token.

**Promijenio sam podatke u bazi, sajt prikazuje stare**
Očekivano kod statičkog sajta → **Run workflow** za rebuild.

**Sve rute osim naslovnice vraćaju 404**
Frontend image nije dobro izgrađen ili `try_files` ne radi. Provjera direktno u
kontejneru: `curl -o /dev/null -w "%{http_code}" http://127.0.0.1:8095/de/kontakt/`.

---

## 12. Ručni build lokalno (bez CI-ja)

Korisno za provjeru prije pusha. Backend mora raditi jer frontend build povlači
podatke iz njega.

```bash
# backend
docker build -f apps/backend/Dockerfile -t enduro-backend:local .

docker run -d --name enduro-be-local -p 127.0.0.1:3001:3001 \
  -e NODE_ENV=production -e PORT=3001 \
  -e MONGODB_URI='mongodb+srv://...' -e MONGODB_DB_NAME=endurodrift \
  -e SESSION_SECRET=local-test \
  enduro-backend:local

curl -fsS http://127.0.0.1:3001/api/health

# frontend (--network=host da build dođe do backenda)
docker build -f apps/frontend/Dockerfile --network=host \
  --build-arg API_INTERNAL_URL=http://127.0.0.1:3001 \
  --build-arg PUBLIC_API_URL=https://dev.endurodriftbosnien.com \
  -t enduro-frontend:local .

docker run -d --name enduro-fe-local -p 127.0.0.1:8080:80 enduro-frontend:local
curl -fsS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/de/

# čišćenje
docker rm -f enduro-be-local enduro-fe-local
```

---

## Prilog: varijable i gdje žive

Razdvojene su jer se koriste u različitim trenucima i na različitim mjestima.

| Varijabla                   | Kada djeluje            | Gdje se postavlja                 |
| --------------------------- | ----------------------- | --------------------------------- |
| `API_INTERNAL_URL`          | tokom `astro build`     | build-arg u CI-ju                 |
| `PUBLIC_API_URL`            | u browseru posjetitelja | build-arg (ugradi se u JS)        |
| `PUBLIC_RECAPTCHA_SITE_KEY` | u browseru posjetitelja | build-arg (ugradi se u JS)        |
| `RECAPTCHA_SECRET_KEY`      | runtime backenda        | `.env` na serveru                 |
| `MONGODB_URI`               | runtime backenda + CI   | `.env` na serveru + GitHub secret |
| `IMAGE_TAG`                 | pri `docker compose up` | `.env` na serveru (mijenja CI)    |

Ključno: `PUBLIC_*` varijable se **ugrađuju u statički build**, pa njihova promjena
zahtijeva rebuild — restart kontejnera nije dovoljan. Varijable bez `PUBLIC_`
prefiksa čita backend pri pokretanju, pa je za njih dovoljan
`docker compose up -d`.
