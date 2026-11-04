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

1. Script de seed : crée les entrées avec leur cible (`from,to,legacyTitle`, cibles issues du tableau « Agenda refonte pages MDA.xlsx »). Une cible vide reste inerte, le niveau 2 la couvre entre-temps.
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
- ✅ Rewrite `/app/uploads/:path*` → `https://ditnd-unification.s3.eu-west-3.amazonaws.com/legacy/app/uploads/:path*`
  (`next.config.js`) — le préfixe `legacy/` reste invisible dans les URLs publiques.

---

## Checklist

### Avant le lancement

- [x] `@payloadcms/plugin-redirects` configuré (`src/payload/plugins/redirects.ts`) — cibles optionnelles (todo seedés), champ `legacyTitle`, groupe admin « Autre »
- [x] Hook `beforeValidate` de normalisation du champ `from` (strip domaine / slash final / query) + anti-boucle
- [x] Middleware (`src/middleware.ts`) : lookup exact (carte servie par `/api/redirects-map`, cache 60 s) → fallbacks sections → pass-through — testé en dev le 10/06/2026 (301 exact, query transférée, fallbacks, 404 événements)
- [x] Script de seed (`yarn seed:redirects`, source : `src/payload/seed/data/legacy-urls.csv`, 74 entrées dont 70 avec cible — exclut la racine et les 5 chemins identiques sur le nouveau site). Fiches, formations et pages CMS en référence au document, le reste en URL personnalisée. Idempotent : crée les absentes, complète les cibles vides, signale sans écraser les cibles divergentes (`REDIRECTS_OVERWRITE=true` pour forcer). À rejouer en prod au moment de la migration.
- [x] Migration de schéma `20260923_141759_add_redirects_and_newsletter` (`src/migrations/`) — le projet applique des migrations explicites, lancées à la main (`payload migrate`) : ni la CI ni Clever Cloud ne les déclenchent, et `push` est désactivé hors développement. Chaîne complète rejouée sur une base vide pour validation.
- [x] Définition des cibles avec l'équipe contenu (tableau « Agenda refonte pages MDA.xlsx », reporté dans le CSV)
- [x] Page 404 (`src/pages/[...slug].tsx` + `ErrorPage`) : statut 404 réel, lien accueil, renvoi vers le moteur de recherche de l'en-tête. Enrichissement possible plus tard (liens directs vers les sections).
- [x] Upload `legacy-uploads/` vers S3 (préfixe `legacy/`) + bucket policy publique sur `legacy/*` (fait le 10/06/2026)
- [x] Rewrite `/app/uploads/:path*` vers le bucket (next.config.js) — testé en dev
- [x] `sitemap.xml` dynamique généré depuis Payload (`src/pages/sitemap.xml.ts` : fiches publiées, formations, parcours persona×condition, pages statiques). Liste statique à maintenir à chaque ajout ou renommage de page.
- [x] `robots.txt` dynamique (`src/pages/robots.txt.ts`) : sitemap référencé, `Disallow: /admin /api /draft` ; `Disallow: /` intégral si `NEXT_PUBLIC_NOINDEX=true`
- [x] Sitemaps Yoast de l'ancien site (`/sitemap_index.xml`, `/page-sitemap.xml`, `/wp-sitemap.xml`) redirigés en 301 vers `/sitemap.xml` dans `next.config.js` : le middleware ignore les chemins contenant un point, une redirection saisie dans l'admin pour ces URLs serait sans effet.
- [x] Couverture du sitemap Yoast vérifiée : ses 74 URLs sont toutes dans le CSV ou servies au même chemin.
- [x] Cible de `/fiches-pratiques-autisme/communication-autisme` saisie dans l'admin (seule URL du sitemap Yoast sans cible dans le CSV)
- [ ] Script de smoke-test des anciennes URLs (301 puis 200, signale 302/307 et 404) : `scripts-migration/smoke_test_redirects.py` absent du dépôt, à retrouver ou réécrire

**Search Console**
- [ ] Demander au client la méthode de validation de la propriété. DNS TXT : s'assurer que la DNUM conserve l'enregistrement `google-site-verification` à la bascule. Fichier HTML, balise meta ou tag Analytics/GTM : à reprendre sur le nouveau site (fichier dans `public/` ou balise dans `SeoMeta`) avant la bascule, sinon le client perd l'accès.

**Variables d'environnement Clever Cloud** (les `NEXT_PUBLIC_*` sont figées au build : redéployer après modification)
- [ ] `NEXT_PUBLIC_SITE_URL=https://maisondelautisme.gouv.fr` (canonical, sitemap, robots.txt, aperçu admin)
- [ ] `NEXT_PUBLIC_NOINDEX` absent ou différent de `true` (à `true`, tout le site est désindexé)
- [ ] `BASIC_AUTH_DISABLED=true`
- [ ] `BREVO_DOI_REDIRECT_URL` sur le nouveau domaine
- [ ] SMTP et destinataires des formulaires (`SMTP_FROM_ADDRESS`, `CONTACT_PROS_CRA_RECIPIENT`, `CONTACT_PARTICULIERS_RECIPIENT`) sur les boîtes `@maisondelautisme.gouv.fr`
- [x] Matomo et clé Albert de production

**Services tiers**
- [ ] App OAuth GitHub (connexion admin) : URL de callback sur le nouveau domaine
- [ ] Matomo : ajouter `maisondelautisme.gouv.fr` aux URLs du site
- [ ] Brevo : expéditeur et domaine `@maisondelautisme.gouv.fr` validés

### Jour J

- [ ] `payload migrate` en prod, puis `yarn seed:redirects` (lire le rapport : aucune « cible introuvable »)
- [ ] Bascule DNS / domaine vers la nouvelle app Clever Cloud (certificat TLS du domaine actif)
- [ ] Smoke-test des anciennes URLs en prod (301, une seule redirection applicative, cible 200)
- [ ] Tester : slash final (`/fiches-pratiques-autisme/etudier-autisme/`), query string transférée, un PDF `/app/uploads/...`, `/sitemap_index.xml`
- [ ] Vérifier l'absence de l'en-tête `X-Robots-Tag: noindex` et de la basic auth en prod
- [ ] Vérifier canonical et `robots.txt` sur le nouveau domaine
- [ ] Connexion à `/admin`, envoi des deux formulaires de contact, inscription newsletter
- [ ] Search Console : propriété toujours validée, retirer l'ancien sitemap Yoast, soumettre `/sitemap.xml`
- [ ] Vérifier la page 404 sur une URL inconnue

### Après le lancement (4 à 12 semaines)

- [ ] Hebdo : rapport « Couverture / Pages » de Search Console — les anciennes URLs doivent passer en « Page avec redirection »
- [ ] Hebdo : 404 crawlées par Google → ajouter les redirections manquantes dans Payload
- [ ] Surveiller les positions sur les requêtes principales (fiches pratiques surtout : 38 des 74 pages)
- [ ] Ne pas toucher aux cibles des 301 sans raison forte (stabilité = confiance Google)
- [ ] À J+90 : revue finale, décider du sort des URLs jamais mappées (laisser en 404 ou 410)
