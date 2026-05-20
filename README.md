# Maison de l'autisme

Site national d'information sur l'autisme et les troubles du neurodéveloppement.

Stack : [Next.js](https://nextjs.org), [Payload CMS](https://payloadcms.com), [tRPC](https://trpc.io), PostgreSQL (pgvector).

## Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [Yarn](https://yarnpkg.com/) 1.22+
- [Docker](https://www.docker.com/) (for Postgres and a local SMTP server)

## Setup

1. **Install dependencies**

   ```bash
   yarn install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in the secrets (`PAYLOAD_SECRET`, `BETTER_AUTH_SECRET`, `OPENAI_API_KEY`, S3 credentials, etc.). The default `POSTGRESQL_ADDON_URI` and SMTP values match the provided `docker-compose.yml`.

   ### Generating `PAYLOAD_SECRET` and `BETTER_AUTH_SECRET`

   Both secrets are required and must be at least 32 characters. The app validates them at startup via `src/env.ts` (powered by `@t3-oss/env-nextjs`) and will fail to boot if either is missing or empty — this prevents silent fallback to insecure library defaults.

   Generate a strong value with:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   To temporarily bypass validation (e.g. in CI/Docker builds), set `SKIP_ENV_VALIDATION=1`.

3. **Start Postgres + Maildev**

   ```bash
   docker compose up -d
   ```

   - Postgres (pgvector) on port `5434`
   - Maildev SMTP on `1025`, web UI on [http://localhost:1080](http://localhost:1080)

4. **Seed the database** (first run, or when you want a fresh dataset)

   ```bash
   yarn seed:dev
   ```

   > ⚠ `seed:dev` drops and recreates the database (`PAYLOAD_DROP_DATABASE=true`).

5. **Run the dev server**

   ```bash
   yarn dev
   ```

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Payload admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Useful scripts

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `yarn dev`         | Start Next.js in dev mode (Turbopack)        |
| `yarn build`       | Production build                             |
| `yarn start`       | Run the production build                     |
| `yarn typecheck`   | TypeScript check                             |
| `yarn check`       | Biome lint/format check                      |
| `yarn check:write` | Biome lint/format with autofix               |
| `yarn seed:dev`    | Drop the DB and reseed (development)         |
| `yarn seed:prod`   | Seed without dropping (production)           |

## Code quality

A pre-commit hook (husky + lint-staged) runs `biome check --write` on staged files. It is installed automatically via the `prepare` script on `yarn install`.
