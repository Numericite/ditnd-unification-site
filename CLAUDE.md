## Agent skills


### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.


### Code comments

Comment only when a reader genuinely cannot infer the fact from the code, types, and names — almost always an external reality the code consumes but cannot reveal (a Payload or Next.js quirk, a third-party API's behaviour such as Albert's, a browser or Cypress oddity, the exact shape of seeded or legacy data). If a competent reader could work it out with a little thought, delete it. One line preferred, two max. Never restate types, signatures, or what the next line does; never narrate structure; never define domain terms (those live in docs); never explain an internal choice the code already shows. Never cite ADRs or docs — discoverability flows docs→code.

Language: prose in English; keep French domain terms and admin labels verbatim (Guide pratique, Parcours, Carrousel de cartes, CRA).
Banners: no section banners or ruler lines (// -----); a long Payload collection config is navigated through its field names and tabs.
JSDoc: only when it states a contract a reader cannot infer; delete signature echoes and type restatements.
Dead code: delete commented-out code; keep TODO/FIXME.
Out of scope (never touched): tooling directives (biome-ignore, @ts-expect-error), generated-file headers, and generated files (`src/payload/payload-types.ts`, `src/app/(payload)/admin/importMap.js`, `src/migrations/`).


### Testing

There are no unit tests. Verification is `yarn check` (Biome), `yarn typecheck`, `yarn build`, then end-to-end tests with Cypress, which is what CI runs on every PR (`.github/workflows/ci.yml`).

Cypress specs live in `cypress/e2e/*.cy.ts` and run against a built app on `http://localhost:3000` with a seeded database (`yarn seed:dev` drops and reseeds it). Locally: start Postgres and Maildev (`docker compose up -d`), the Albert mock (`node cypress/mocks/albert.mjs`), then `yarn build && yarn start` and `yarn cypress:run` (or `yarn cypress:open`). `chatbot-llm.cy.ts` needs the real Albert API and is excluded in CI.

Shared helpers are in `cypress/support/` (`commands.ts`, `payload.ts`, `lexical.ts`): `cy.visit` is overridden to pre-accept the DSFR consent banner, and `cy.waitForHydration()` waits for React to hydrate a public page (it keys off the main navigation, so not the admin) before interacting with client components. Reuse these rather than re-implementing them in a spec.

Select elements the way a user perceives them: role, accessible name, `aria-label`, form `name` attributes, or a stable data attribute already used by the component (e.g. `data-carousel`). The repo has no `data-testid` convention; don't introduce one. Changing an `aria-label`, a field `name` or such an attribute that a spec relies on breaks tests, so grep `cypress/` before renaming. An assertion is never shaped to match observed behaviour: if the app diverges from what the feature should do, report it rather than adjusting the test.
