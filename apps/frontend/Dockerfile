# Build context je ROOT repoa (ne apps/frontend) — zbog pnpm workspacea.
# Build:  docker build -f apps/frontend/Dockerfile .
#
# VAŽNO: Astro je ovdje STATIČKI (SSG, bez SSR adaptera). Stranice poput
# /de/anmeldung, /de/termine, /de/galerie i /de/gastebuch povlače podatke iz API-ja
# TOKOM BUILDA, pa backend mora biti dostupan na API_INTERNAL_URL dok build traje —
# inače fetch baca i cijeli build pada.

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app


# --- Build stage: kompajlira statički sajt u dist/ ---
FROM base AS build

# Adresa backenda TOKOM builda (server-side fetch, npr. ime servisa na Docker mreži)
ARG API_INTERNAL_URL=http://backend:3001
# Adresa backenda iz BROWSERA — ugrađuje se u klijentski JS bundle
ARG PUBLIC_API_URL=https://www.endurodriftbosnien.com
ARG PUBLIC_RECAPTCHA_SITE_KEY=

ENV API_INTERNAL_URL=$API_INTERNAL_URL \
    PUBLIC_API_URL=$PUBLIC_API_URL \
    PUBLIC_RECAPTCHA_SITE_KEY=$PUBLIC_RECAPTCHA_SITE_KEY

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/frontend/package.json apps/frontend/

RUN pnpm install --frozen-lockfile --filter frontend... --ignore-scripts

COPY packages/shared packages/shared
COPY apps/frontend apps/frontend

# sharp treba native binarije — skripte su gore preskočene, pa ih ovdje odobravamo
RUN pnpm --filter frontend rebuild sharp || true
RUN pnpm --filter shared build && pnpm --filter frontend build


# --- Runtime stage: nginx koji servira gotovu statiku (bez Node-a) ---
FROM nginx:alpine AS runtime

COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80
