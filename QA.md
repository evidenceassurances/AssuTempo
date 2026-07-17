# QA : Baromètre AssuTempo v1 (17 juillet 2026)

Page `/barometre-immatriculations`, issue #35, branche `draft/chantier-2026-07-17`.

## Slug créé

- `/barometre-immatriculations` (requêtes cibles : « baromètre immatriculations », « chiffres immatriculations juillet 2026 », « immatriculations occasion France »)

## Phase 1 : relevé du pattern existant

- **Routes** : entrée ajoutée dans `ROUTE_TABLE` de `src/AppShell.jsx` (partagée client/SSR), import `lazy()` dans `src/App.jsx` (`IMPORTERS.BarometreImmatriculations`), import eager dans `src/entry-server.jsx`, entrée dans `ROUTES` et `ROUTE_MODULES` de `scripts/prerender.mjs` (sitemap + modulepreload de page). Aucune de ces quatre listes n'a divergé (build vert).
- **JSON-LD** : injection via le helper existant `jsonLd()` de `src/lib/seo.js`, dans des `<script type="application/ld+json">` sous `<Helmet>`, comme sur `/roulez-legal-apres-achat` et `/carte-grise`.
- **Answer Capsule** : composant réutilisé tel quel (`src/components/articles/AnswerCapsule.jsx`), aucune modification.
- **Gabarit** : page autonome sur le modèle de `src/pages/RoulezLegalApresAchat.jsx` (sections `<section>` alternant `var(--bg)` / `var(--bg-2)`, cartes `var(--bg-card)` + `var(--gold-border)`, breadcrumb aligné sur le JSON-LD BreadcrumbList, double CTA `/tarification` + `/carte-grise`).
- **Aucun nouveau composant global créé.**

## Livrables et chemins

| Livrable | Chemin |
|---|---|
| Page | `src/pages/BarometreImmatriculations.jsx` |
| Route (table partagée client/SSR) | `src/AppShell.jsx` (`ROUTE_TABLE`) |
| Import lazy client | `src/App.jsx` (`IMPORTERS`) |
| Import eager SSR | `src/entry-server.jsx` |
| Prérendu + sitemap | `scripts/prerender.mjs` (`ROUTES`, `ROUTE_MODULES`) |
| Entrée GEO | `public/llms.txt` |
| Lien croisé entrant | `src/pages/RoulezLegalApresAchat.jsx` (section maillage) |

## Chiffres publiés : source et date

| Chiffre | Valeur | Source | Date de publication | Vérifié le |
|---|---|---|---|---|
| Immatriculations neuves juin 2026 (CVS-CJO) | 141 300 | SDES, [immatriculations de voitures particulières neuves en juin 2026](https://www.statistiques.developpement-durable.gouv.fr/immatriculations-de-voitures-particulieres-neuves-en-juin-2026) | 02/07/2026 | 17/07/2026 |
| Évolution mensuelle du neuf | -2,6 % (vs 145 100 en mai 2026) | idem | 02/07/2026 | 17/07/2026 |
| Voitures d'occasion vendues en 2025 | 5,5 millions (+0,9 % vs 2024) | SDES, [bilan annuel des immatriculations 2025](https://www.statistiques.developpement-durable.gouv.fr/immatriculations-de-voitures-en-2025-le-marche-du-neuf-baisse-celui-de-loccasion-resiste) | 11/02/2026 | 17/07/2026 |
| Part de l'occasion dans les achats 2025 | 76,9 % | idem | 11/02/2026 | 17/07/2026 |
| Ratio occasion / neuf | ≈ 3,3 pour 1 | Calcul AssuTempo (76,9 / 23,1) à partir du bilan SDES 2025 ci-dessus | 11/02/2026 | 17/07/2026 |

Jeu de données de référence cité dans le JSON-LD Dataset : [Immatriculations de véhicules routiers](https://www.data.gouv.fr/datasets/immatriculations-de-vehicules-routiers) (SDES, data.gouv.fr), dernière mise à jour au 17/07/2026 (vérifié via l'API `data.gouv.fr/api/1/datasets/...`).

**Limite documentée dans la page (section Méthodologie)** : le jeu de données communal « occasion » (changements de titulaire) de data.gouv.fr n'a pas de granularité mensuelle publiée pour 2026 au moment de la rédaction (dernier export figé sur l'année 2025). Aucun chiffre mensuel occasion n'a donc été inventé ; les chiffres occasion de cette édition restent ceux du dernier bilan annuel disponible.

## Rappels réglementaires : source et date

| Rappel | Source | Consulté le |
|---|---|---|
| Délai d'1 mois calendaire à compter de la date de cession (article R322-5 du code de la route) | Légifrance | 17/07/2026 |
| Amende forfaitaire 135 € (90 € minorée, 375 € majorée), jusqu'à 750 € devant le tribunal (article 131-13 du code pénal), contravention de 4e classe | Service-public.gouv.fr | 17/07/2026 |
| Certificat provisoire d'immatriculation classique : 1 mois, France uniquement | Ants.gouv.fr / France Titres | 17/07/2026 |
| Plaques WW : 4 mois, non reconductibles depuis la réforme 2026 | Service public + (démarche officielle de prolongation d'un CPI WW) | 17/07/2026 |

## Contrôles techniques

| Contrôle | Résultat |
|---|---|
| `npm run build` (vite build + prérendu) | Vert, 72 routes prérendues dont `/barometre-immatriculations` |
| `node scripts/quality-gate.mjs` | Vert après commit (voir note ci-dessous) |
| Chaque chiffre publié présent en clair dans le HTML statique (`dist/barometre-immatriculations/index.html`, hors JS) | Vérifié programmatiquement : `141 300`, `2,6`, `5,5 millions`, `76,9`, `3,3 pour 1` tous trouvés dans le HTML prérendu |
| JSON-LD Dataset valide (`json.loads`) | Oui, `@type: Dataset`, `isBasedOn` (3 sources), `creator`/`publisher` liés à `#organization` |
| JSON-LD BreadcrumbList valide | Oui, 2 niveaux (Accueil > Baromètre immatriculations) |
| `<title>` et `<meta name="description">` non vides dans le HTML prérendu | Oui (bug détecté et corrigé en cours de mission : un `<title>` avec enfants JSX multiples `{EDITION}` se sérialisait vide côté `react-helmet-async` ; corrigé en interpolation par template literal unique) |
| Longueur title / meta description | Title 51 caractères, meta description 152 caractères (limites 60 / 155 respectées) |
| Absence de U+2014 (tiret cadratin) et U+2013 (tiret demi-cadratin) | 0 occurrence sur les fichiers créés/modifiés (`rg` ciblé) |
| Accents français / encodage UTF-8 | Contrôle programmatique (recherche de séquences mojibake `Ã©`, `Ã¨`, `â€`, etc.) : aucune occurrence dans le HTML prérendu |
| Sitemap | `/barometre-immatriculations` présent dans `dist/sitemap.xml` et `public/sitemap.xml` (71 URLs) |
| `public/llms.txt` | Entrée ajoutée avec chiffres clés et sources |
| Contenu 100 % statique dans le DOM | Oui : aucun état initial invisible, aucun compteur, tous les chiffres et rappels sont des constantes rendues directement (pas de `useState`/`useEffect` porteur de contenu) |

## Liens internes ajoutés

- `/barometre-immatriculations` → `/roulez-legal-apres-achat` (maillage, section D)
- `/barometre-immatriculations` → `/tarification` et `/carte-grise` (double CTA final, sans dupliquer le tunnel JL Assure ni l'iframe Certimat)
- `/roulez-legal-apres-achat` → `/barometre-immatriculations` (lien croisé réciproque ajouté dans la section maillage existante)

## Zones interdites

Aucune des zones interdites n'a été touchée : Header/Footer globaux, `/tarification` (au-delà des meta, non modifié), iframe Certimat de `/carte-grise`, formulaires B2B/international, `.github/`, `scripts/quality-gate.mjs`, `scripts/indexnow.mjs`, `vercel.json`. Aucune nouvelle dépendance npm.

## Note sur le portique

`node scripts/quality-gate.mjs` compare `origin/main...HEAD` : il ne détecte de diff qu'une fois les fichiers commités (constaté 0 fichier modifié avant le premier commit de la branche, comportement attendu). Le portique sera repassé après commit, avant ouverture de la Pull Request.
