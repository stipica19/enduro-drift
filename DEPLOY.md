# DEPLOY.md

Uputa za deploy Enduro Drift Bosnien sajta na VPS.

> **Test domena:** ovaj deploy ide na `dev.skin-glow.beauty` (testna domena u tvom
> vlasništvu), ne na finalnu `endurodriftbosnien.com`. Zato su nginx/certbot koraci,
> `.env` primjeri i GitHub secreti u ovom fajlu podešeni za `dev.skin-glow.beauty`.
> Kanonski URL-ovi, hreflang i JSON-LD **unutar same aplikacije** (Layout.astro,
> astro.config.mjs) i dalje su hardkodirani na `endurodriftbosnien.com` — to je ranije
> potvrđena finalna SEO domena i namjerno se ne mijenja zbog test-deploya. Kad dođe
> vrijeme za pravi produkcijski deploy, samo zamijeni `dev.skin-glow.beauty` sa
> `endurodriftbosnien.com` na mjestima označenim ispod.

**Arhitektura:** nginx na hostu radi TLS i rutiranje. Frontend i backend su Docker
kontejneri vezani na `127.0.0.1` — nedostupni direktno s interneta, samo preko nginxa.

```
Internet
   │
   ▼
nginx na hostu (80/443, Let's Encrypt)
   ├─ /api/*  →  127.0.0.1:3001   backend kontejner   (Fastify)
   └─ /*      →  127.0.0.1:8080   frontend kontejner  (nginx + statički Astro)
                                          │
                              MongoDB Atlas (vanjski)
```

**Astro je statički (SSG), bez SSR-a.** Važna posljedica: stranice `/de/anmeldung`,
`/de/termine`, `/de/galerie` i `/de/gastebuch` povlače podatke iz API-ja **tokom
builda**, ne pri svakom zahtjevu. Zato CI mora dignuti backend prije nego gradi
frontend — bez toga `fetch` baca i build pada. Druga posljedica: kad se promijene
podaci u bazi (npr. novi termin), sajt ih **neće** prikazati dok se frontend ne
rebuilda. Za to postoji ručno pokretanje deploya (vidi *Osvježavanje sadržaja*).

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

**Zašto:** portovi 3001 i 8080 se **ne otvaraju** — kontejneri su vezani na
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

Kod registrara domene postavi:

| Tip | Ime   | Vrijednost       |
| --- | ----- | ---------------- |
| A   | `dev` | `TVOJ_SERVER_IP` |

(Ako `skin-glow.beauty` upravlja DNS-om kod istog registrara, `dev` je subdomain
zapis. Ako je `dev.skin-glow.beauty` zasebno delegirana zona, koristi `@` umjesto
`dev`.)

Provjera (čekaj da se propagira, može potrajati do nekoliko sati):

```bash
dig +short dev.skin-glow.beauty
```

Oba moraju vratiti IP servera. **Ne nastavljaj na korak 5 dok ovo ne prođe.**

---

## 4. nginx konfiguracija

**Što radimo:** pišemo server blok koji `/api/*` šalje backendu, a sve ostalo
frontendu.

**Zašto:** frontend i backend su na istoj domeni, pa browser nema CORS problema i
sesijski cookie za admin radi bez `SameSite` komplikacija.

```bash
sudo nano /etc/nginx/sites-available/enduro
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name dev.skin-glow.beauty;

    # certbot će ovaj blok prepisati i dodati TLS + redirect na 443
    client_max_body_size 2m;

    # Fastify API
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        # Backend čita request.ip za reCAPTCHA provjeru — bez ovoga vidi samo IP nginxa
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Statički Astro sajt
    location / {
        proxy_pass http://127.0.0.1:8080;
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

### HTTPS

**Što radimo:** certbot izdaje certifikat i sam prepisuje nginx konfiguraciju.

```bash
sudo certbot --nginx -d dev.skin-glow.beauty
```

Obnova je automatska (systemd timer). Provjera da obnova radi:

```bash
sudo certbot renew --dry-run
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

| Secret                 | Vrijednost / kako dobiti                                            |
| ---------------------- | ------------------------------------------------------------------- |
| `MONGODB_URI`          | Atlas connection string                                             |
| `MONGODB_DB_NAME`      | `endurodrift`                                                       |
| `PUBLIC_API_URL`       | `https://dev.skin-glow.beauty` (ugrađuje se u klijentski JS)        |
| `RECAPTCHA_SITE_KEY`   | reCAPTCHA v3 site key (javan, ali ide kao secret radi jednostavnosti)|
| `VPS_HOST`             | IP servera                                                          |
| `VPS_USER`             | `deploy`                                                            |
| `VPS_SSH_KEY`          | **privatni** SSH ključ (cijeli sadržaj, vidi ispod)                 |
| `VPS_PATH`             | `/home/deploy/apps/enduro-drift-bosnien`                                                       |

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
GHCR_OWNER=tvoj-github-username
IMAGE_TAG=latest

PORT=3001
NODE_ENV=production
FRONTEND_ORIGIN=https://dev.skin-glow.beauty

MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=endurodrift
OLD_MONGODB_DB_NAME=

SESSION_SECRET=          # generiši: openssl rand -base64 32
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

Ako su paketi privatni, server im mora imati pristup:

```bash
# na serveru, s GitHub Personal Access Tokenom koji ima read:packages
echo TVOJ_PAT | docker login ghcr.io -u TVOJ_GITHUB_USERNAME --password-stdin
```

Alternativa: u GitHubu **Packages → enduro-frontend → Package settings → Change
visibility → Public**, pa login nije potreban.

### 7.3 Pokretanje

```bash
cd /home/deploy/apps/enduro-drift-bosnien
docker compose pull
docker compose up -d
docker compose ps        # oba servisa moraju biti "Up", backend "healthy"
```

Provjera slojeva, od unutra prema van:

```bash
curl -fsS http://127.0.0.1:3001/api/health     # backend direktno
curl -fsS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/de/   # frontend direktno
curl -fsS https://dev.skin-glow.beauty/api/health                      # kroz nginx + TLS
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

Zašto SHA tagovi, a ne samo `latest`: `latest` ne govori *koja* je verzija gore i ne
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

| Simptom                              | Gdje gledati                                  |
| ------------------------------------ | --------------------------------------------- |
| 502 Bad Gateway                      | kontejner je pao → `docker compose logs`      |
| Sajt radi, `/api/*` ne               | nginx `location /api/` blok                   |
| Greška pri slanju maila              | `docker compose logs backend` (Resend)        |
| Certifikat istekao                   | `sudo certbot renew`                          |
| Stari podaci na stranicama           | treba rebuild frontenda (statički sajt)       |

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

**`docker compose pull` → `denied` / `unauthorized`**
Paketi su privatni, a server nije prijavljen → `docker login ghcr.io` (korak 7.2).

**Workflow pada na "Cekaj da backend odgovori"**
Backend se nije podigao u CI-ju. Najčešće Atlas blokira runnerov IP (korak 5) ili je
`MONGODB_URI` secret pogrešan. U logu workflowa ispisuju se i logovi kontejnera.

**Kontakt forma vraća grešku**
`RESEND_API_KEY` fali ili domena nije verifikovana u Resendu. Dok domena nije
verifikovana, `CONTACT_EMAIL_FROM` mora ostati `onboarding@resend.dev`.

**reCAPTCHA odbija svaki zahtjev**
`RECAPTCHA_SECRET_KEY` (server) i `RECAPTCHA_SITE_KEY` (build) moraju biti iz **istog**
reCAPTCHA para. Ako je secret prazan, provjera se preskače — forma radi, ali bez zaštite.

**Promijenio sam podatke u bazi, sajt prikazuje stare**
Očekivano kod statičkog sajta → **Run workflow** za rebuild.

**Sve rute osim naslovnice vraćaju 404**
Frontend image nije dobro izgrađen ili `try_files` ne radi. Provjera direktno u
kontejneru: `curl -o /dev/null -w "%{http_code}" http://127.0.0.1:8080/de/kontakt/`.

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
  --build-arg PUBLIC_API_URL=https://dev.skin-glow.beauty \
  -t enduro-frontend:local .

docker run -d --name enduro-fe-local -p 127.0.0.1:8080:80 enduro-frontend:local
curl -fsS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/de/

# čišćenje
docker rm -f enduro-be-local enduro-fe-local
```

---

## Prilog: varijable i gdje žive

Razdvojene su jer se koriste u različitim trenucima i na različitim mjestima.

| Varijabla                   | Kada djeluje            | Gdje se postavlja                  |
| --------------------------- | ----------------------- | ---------------------------------- |
| `API_INTERNAL_URL`          | tokom `astro build`     | build-arg u CI-ju                  |
| `PUBLIC_API_URL`            | u browseru posjetitelja | build-arg (ugradi se u JS)         |
| `PUBLIC_RECAPTCHA_SITE_KEY` | u browseru posjetitelja | build-arg (ugradi se u JS)         |
| `RECAPTCHA_SECRET_KEY`      | runtime backenda        | `.env` na serveru                  |
| `MONGODB_URI`               | runtime backenda + CI   | `.env` na serveru + GitHub secret  |
| `IMAGE_TAG`                 | pri `docker compose up` | `.env` na serveru (mijenja CI)     |

Ključno: `PUBLIC_*` varijable se **ugrađuju u statički build**, pa njihova promjena
zahtijeva rebuild — restart kontejnera nije dovoljan. Varijable bez `PUBLIC_`
prefiksa čita backend pri pokretanju, pa je za njih dovoljan
`docker compose up -d`.
