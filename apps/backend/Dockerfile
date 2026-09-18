# Build context je ROOT repoa (ne apps/backend) — pnpm mora vidjeti pnpm-workspace.yaml
# i pnpm-lock.yaml da bi --filter i workspace zavisnost "shared" radili.
# Build:  docker build -f apps/backend/Dockerfile .

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app


# --- Build stage: instalira SVE zavisnosti (uklj. dev) i kompajlira TypeScript ---
FROM base AS build

# Prvo samo manifesti → Docker cache za install ostaje validan dok se ne promijene
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/backend/package.json apps/backend/

# --ignore-scripts: "prepare" u shared paketu radi tsc, a izvorni kod još nije kopiran
RUN pnpm install --frozen-lockfile --filter backend... --ignore-scripts

COPY packages/shared packages/shared
COPY apps/backend apps/backend

# shared se konzumira kao kompajlirani dist/, pa mora ići prvi
RUN pnpm --filter shared build && pnpm --filter backend build


# --- Runtime stage: samo produkcijske zavisnosti + gotovi build artefakti ---
FROM base AS runtime
ENV NODE_ENV=production

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/backend/package.json apps/backend/

RUN pnpm install --frozen-lockfile --filter backend... --prod --ignore-scripts

COPY --from=build /app/packages/shared/dist packages/shared/dist
COPY --from=build /app/apps/backend/dist apps/backend/dist

# Node radi kao neprivilegovan korisnik (slika node:alpine već ima korisnika "node")
USER node

EXPOSE 3001
CMD ["node", "apps/backend/dist/server.js"]
