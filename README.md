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

   To reseed a single dataset without touching the rest, use the targeted
   commands `yarn seed:glossary` or `yarn seed:cartography` (see the scripts
   table below).

5. **Run the dev server**

   ```bash
   yarn dev
   ```

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Payload admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Useful scripts

| Command                  | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `yarn dev`               | Start Next.js in dev mode (Turbopack)                  |
| `yarn build`             | Production build                                       |
| `yarn start`             | Run the production build                               |
| `yarn typecheck`         | TypeScript check                                       |
| `yarn check`             | Biome lint/format check                                |
| `yarn check:write`       | Biome lint/format with autofix                         |
| `yarn seed:dev`          | Drop the DB and reseed everything (development)        |
| `yarn seed:prod`         | Seed everything without dropping (production)          |
| `yarn seed:glossary`     | Reseed only the glossary (deletes & recreates entries) |
| `yarn seed:cartography`  | Reseed only the cartography (upsert by slug)           |

## Code quality

A pre-commit hook (husky + lint-staged) runs `biome check --write` on staged files. It is installed automatically via the `prepare` script on `yarn install`.

## End-to-end tests

The Cypress suite (`cypress/e2e`) drives the back office, the rich text editor and the public site against a production build, like the CI. It seeds and rewrites content, so point it at a dedicated database, never at your development data:

```bash
PGPASSWORD=password createdb -h localhost -p 5434 -U user e2e
export POSTGRESQL_ADDON_URI=postgres://user:password@localhost:5434/e2e
export ALBERT_API_URL=http://127.0.0.1:4010 ALBERT_API_KEY=e2e-mock
node cypress/mocks/albert.mjs &
yarn seed:dev
yarn build && yarn start   # then, from a second terminal:
yarn cypress:run
```

`cypress/mocks/albert.mjs` answers the Albert calls (embeddings, rerank, chat) with deterministic results, so publishing a practical guide generates its simplified version without the real API. The specs log in as the seeded admin and create their own documents through the Payload REST API, so they can be replayed on the same database.

`cypress/e2e/chatbot-llm.cy.ts` is the only spec that needs the real Albert API: it is skipped unless `CYPRESS_LLM_TESTS_ENABLED=true` and the server runs with real credentials.
