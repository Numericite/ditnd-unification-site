# Plan de redirections & checklist SEO — migration maisondelautisme.gouv.fr

Migration de l'ancien site WordPress vers ce projet (Next.js + Payload), **même domaine**.
Objectif : zéro perte de référencement et de backlinks. Inventaire source :
`maisondelautisme_contenus_structures.xlsx` (74 pages publiées, ~1100 médias).

## Architecture retenue

Pas de proxy nginx (contrairement à jdma-proxy) : les redirections vivent dans l'application.

| Niveau | Mécanisme | Contenu |
|---|---|---|
| 1 — Exact | Collection Payload (`@payloadcms/plugin-redirects`) lue par le middleware Next (cache mémoire + TTL) | Une entrée par ancienne URL ayant une page équivalente. **Réponse 301.** |
| 2 — Sections | Règles statiques dans le middleware | `/fiches-pratiques-autisme/*` → `/fiches-pratiques` · `/accueil-se-former-tnd/*` → `/formations` · `/accueil/*` → `/a-propos`. **301.** Pas de fallback pour `/evenements-maison-de-l-autisme/*` (section actus abandonnée). |
| 3 — Reste | Page 404 enrichie (recherche + liens vers les sections) | Tout le reste, y compris les anciennes pages événements. |

Règles de fond :
- **301 uniquement** (jamais 302/307, jamais de redirection JavaScript).
- Clés `from` stockées **sans** domaine, slash final ni query string (hook `beforeValidate` de normalisation). Le matching ignore la query string mais la **transfère** vers la cible.
- Cible `to` = **référence au document** Payload (pas une URL en dur) pour les pages internes : survit aux renommages de slug.
- Hook de validation : refuse `from == to`, signale les chaînes de redirections.
- Le hop 308 natif de Next sur le slash final (`/page/` → `/page`) est accepté (chaîne à 2 sauts, sans impact SEO).
- **Ne jamais supprimer une redirection remplie après le lancement** — les backlinks n'expirent pas.

## Workflow équipe contenu

1. Script de seed : crée les 74 entrées avec `from` rempli et `to` vide (inertes tant que vides — le niveau 2 les couvre entre-temps).
2. L'équipe remplit les `to` dans l'admin Payload au fil de la création des contenus. Un `to` vide = travail restant (filtrable dans l'admin).
3. Prise d'effet sans déploiement (TTL du cache middleware).

## Médias hérités (`/app/uploads/*`)

Les 1 098 fichiers (dont 214 PDF directement backlinkés : cerfas, guides MDPH, brochures CRA…)
sont archivés dans `legacy-uploads/` (621 Mo, manifeste : `legacy-uploads/manifest.csv`).
Les URLs d'origine sont **préservées à l'identique** — aucune redirection à saisir.

- Téléchargement (rejouable) : `scripts-migration/download_legacy_uploads.py`
- ✅ Uploadés sur S3 sous le préfixe `legacy/` (séparé des médias Payload, à la racine du bucket),
  via `scripts-migration/upload_legacy_to_s3.sh` (variables `S3_*` de l'app)
- ✅ Bucket policy : lecture publique anonyme limitée à `legacy/*` (le reste du bucket reste privé) — vérifié
- Reste à faire : rewrite `/app/uploads/:path*` → `https://ditnd-unification.s3.eu-west-3.amazonaws.com/legacy/app/uploads/:path*`
  (next.config ou middleware) — le préfixe `legacy/` reste invisible dans les URLs publiques.

---

## Checklist

### Avant le lancement

- [x] `@payloadcms/plugin-redirects` configuré (`src/payload/plugins/redirects.ts`) — cibles optionnelles (todo seedés), champ `legacyTitle`, groupe admin « Autre »
- [x] Hook `beforeValidate` de normalisation du champ `from` (strip domaine / slash final / query) + anti-boucle
- [x] Middleware (`src/middleware.ts`) : lookup exact (carte servie par `/api/redirects-map`, cache 60 s) → fallbacks sections → pass-through — testé en dev le 10/06/2026 (301 exact, query transférée, fallbacks, 404 événements)
- [x] Script de seed (`yarn seed:redirects`, source : `src/payload/seed/data/legacy-urls.csv`, 69 entrées — exclut la racine et les 4 chemins identiques sur le nouveau site). Idempotent : à rejouer en prod au moment de la migration.
- [ ] L'équipe contenu a rempli les `to` pour toutes les pages ayant un équivalent
- [ ] Page 404 enrichie (recherche + liens sections)
- [x] Upload `legacy-uploads/` vers S3 (préfixe `legacy/`) + bucket policy publique sur `legacy/*` (fait le 10/06/2026)
- [x] Rewrite `/app/uploads/:path*` vers le bucket (next.config.js) — testé en dev
- [x] `sitemap.xml` dynamique généré depuis Payload (`src/pages/sitemap.xml.ts` : fiches publiées, formations, parcours persona×condition, pages statiques)
- [x] `robots.txt` dynamique (`src/pages/robots.txt.ts`) : sitemap référencé, `Disallow: /admin /api /draft` ; `Disallow: /` intégral si `NEXT_PUBLIC_NOINDEX=true`
- [ ] **`NEXT_PUBLIC_NOINDEX` absent ou ≠ `true` en production** (variable critique : à `true`, la migration entière est désindexée — à vérifier dans la config Clever Cloud de prod)
- [ ] Accès Google Search Console vérifié pour le domaine (validation DNS de préférence — survit au changement de plateforme). *(en cours : vérification côté webmaster)*
- [x] Script de smoke-test : `BASE_URL=https://… python3 scripts-migration/smoke_test_redirects.py` (teste les 74 anciennes URLs : 301 → 200, signale les 302/307 et les 404) — à exécuter sur la préprod puis en prod le jour J

### Jour J

- [ ] Bascule DNS / domaine vers la nouvelle app Clever Cloud
- [ ] Smoke-test des 74 anciennes URLs en prod (301, une seule redirection applicative, cible 200)
- [ ] Tester : slash final (`/fiches-pratiques-autisme/etudier-autisme/`), query string transférée, un PDF `/app/uploads/...`
- [ ] Vérifier l'absence de l'en-tête `X-Robots-Tag: noindex` en prod
- [ ] Soumettre `sitemap.xml` dans Search Console (déclenche le re-crawl massif)
- [ ] Vérifier la 404 enrichie sur une URL inconnue

### Après le lancement (4 à 12 semaines)

- [ ] Hebdo : rapport « Couverture / Pages » de Search Console — les anciennes URLs doivent passer en « Page avec redirection »
- [ ] Hebdo : 404 crawlées par Google → ajouter les redirections manquantes dans Payload
- [ ] Surveiller les positions sur les requêtes principales (fiches pratiques surtout : 38 des 74 pages)
- [ ] Ne pas toucher aux cibles des 301 sans raison forte (stabilité = confiance Google)
- [ ] À J+90 : revue finale, décider du sort des URLs jamais mappées (laisser en 404 ou 410)
