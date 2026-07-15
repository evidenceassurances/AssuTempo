# QA : mission GEO 2 articles (15 juillet 2026)

Articles « Assurance temporaire 1 semaine ou 1 mois » et « Changement de titulaire carte grise », issue #33, branche `draft/articles-2026-07-15`.

## Phase 0 : relevé du pattern existant

- **Routes** : table unique `ROUTE_TABLE` dans `src/AppShell.jsx`, partagée entre le client (`src/App.jsx`, imports `lazy()`) et le SSR (`src/entry-server.jsx`, imports eager). `scripts/prerender.mjs` porte sa propre liste `ROUTES` (source du sitemap), sa carte `ARTICLE_DATA_SOURCES` (route -> fichier de contenu, sert au calcul du `lastmod` git) et sa carte `ROUTE_MODULES` (route -> fichier page, sert au `modulepreload`).
- **Pattern article** : `src/components/ArticleLayout.jsx` (habillage générique) + données dans `src/data/articles/<slug>.js` (export `articleData` : `seo`, `category`, `headline`, `cta`, `answerCapsule`, `sections[]`, `faqItems[]`) + page fine dans `src/pages/articles/<Nom>.jsx` qui ne fait qu'importer les données et rendre `<ArticleLayout data={articleData} />`. `AnswerCapsule` et le tableau `FAQ` alimentent à la fois l'affichage et le JSON-LD FAQPage (jamais deux sources).
- **Hub `/articles`** : `src/data/articlesData.js`, catégories dérivées dynamiquement (`catKey`) dans `src/pages/Articles.jsx` : aucune modification de la page nécessaire pour ajouter une entrée.
- **Zones interdites identifiées** (`FORBIDDEN_PATHS` de `scripts/quality-gate.mjs`) : `src/pages/Pricing.jsx` (`/tarification`) et `src/pages/CarteGrise.jsx` (`/carte-grise`) ne doivent jamais être modifiées par une PR automatique, meta comprises. Aucun des deux fichiers n'a été touché.

## Livrables et chemins

| Livrable | Chemin |
|---|---|
| Données article 1 | `src/data/articles/assuranceTemporaire1Mois.js` |
| Page article 1 | `src/pages/articles/AssuranceTemporaire1Mois.jsx` |
| Données article 2 | `src/data/articles/changementTitulaireCarteGrise.js` |
| Page article 2 | `src/pages/articles/ChangementTitulaireCarteGrise.jsx` |
| Routes ajoutées (table partagée client/SSR) | `src/AppShell.jsx` (`ROUTE_TABLE`) |
| Import lazy client | `src/App.jsx` (`IMPORTERS`) |
| Import eager SSR | `src/entry-server.jsx` |
| Prérendu + sitemap | `scripts/prerender.mjs` (`ROUTES`, `ARTICLE_DATA_SOURCES`, `ROUTE_MODULES`) |
| Hub `/articles` | `src/data/articlesData.js` |
| Entrées GEO | `public/llms.txt` |
| Liens entrants obligatoires | `src/data/articles/prixAssuranceAutoTemporaire.js`, `src/data/articles/delaiCarteGrise.js` |

## Slugs créés

- `/articles/assurance-auto-temporaire-1-mois` (requête cible : « assurance auto temporaire 1 mois »)
- `/articles/changement-titulaire-carte-grise` (requête cible : « changement de titulaire carte grise »)

## Contenu

| Contrôle | Article 1 | Article 2 |
|---|---|---|
| Nombre de mots (corps hors JSON-LD, calcul programmatique) | ≈ 1280 | ≈ 1300 |
| Un seul H1 | Oui | Oui |
| H2/H3 en questions | Oui | Oui |
| Réponse dans les 2 premières phrases | Oui (Answer Capsule) | Oui (Answer Capsule) |
| Answer Capsule (réponse ≤ 50 mots + 3 faits datés) | Oui, mise à jour 15 juillet 2026 | Oui, mise à jour 15 juillet 2026 |
| FAQ autoportante | 4 questions | 4 questions |
| Title (< 60 car.) | 53 caractères | 51 caractères |
| Meta description (< 155 car.) | 153 caractères | 150 caractères |
| Format imposé | Comparatif avec tableau (7 j vs 30 j, puis temporaire vs au kilomètre) | Guide pas à pas, 6 étapes numérotées (section `timeline`, pas d'empilement de puces) |
| CTA final | `/tarification` | `/carte-grise` |

## Maillage interne

- **Duo croisé assurance/carte grise obligatoire** : article 1 lie `/carte-grise` (section « Pourquoi choisir un mois ») et `/articles/combien-de-temps-carte-grise` (comparatif carte grise) ; article 2 lie `/tarification` explicitement (« assurer le véhicule dès la sortie du parking »).
- Article 1 lie aussi `/articles/prix-assurance-auto-temporaire` (ancre « grille de prix ») et `/articles/combien-de-jours-assurance-sortir-fourriere`.
- Article 2 lie aussi `/articles/carte-grise-urgence-cpi-immediat`, `/articles/assurance-temporaire-vehicule-etranger-france` et `/roulez-legal-apres-achat`.
- **Note sur les URL de la mission** : la mission cite plusieurs pages (`/assurance-auto-temporaire-1-jour`, `/liste-des-situations-necessitant-une-assurance-temporaire`, `/faire-sa-carte-grise`, `/importer-exporter-un-vehicule-etranger`) qui n'existent pas dans le routage actuel du site (`ROUTE_TABLE`, `src/AppShell.jsx`). Elles ont été remplacées par les pages réelles les plus proches sémantiquement (voir ci-dessus) plutôt que de créer des liens morts.
- **Lien entrant obligatoire** : la mission demande un lien depuis `/tarification` ou `/articles/prix-assurance-auto-temporaire` vers l'article 1, et depuis `/carte-grise` ou `/articles/combien-de-temps-carte-grise` vers l'article 2. `Pricing.jsx` et `CarteGrise.jsx` étant des zones interdites du portique, les liens entrants ont été ajoutés depuis les deux articles satellites autorisés par la mission : `src/data/articles/prixAssuranceAutoTemporaire.js` (nouveau `relatedLink` vers l'article 1) et `src/data/articles/delaiCarteGrise.js` (nouveau `relatedLink` vers l'article 2).

## Faits YMYL vérifiés (recherche web du 15 juillet 2026)

| Fait | Source | Article(s) |
|---|---|---|
| Délai d'1 mois calendaire pour immatriculer un véhicule d'occasion au nom du nouveau propriétaire, à compter de la date de cession | service-public.gouv.fr (fiche F1050), Légifrance (article R322-5 du code de la route) | 1 et 2 |
| Délai de 15 jours pour le vendeur pour déclarer la cession en ligne ; code de cession valable 15 jours | service-public.gouv.fr (fiche F1707), article R322-4 du code de la route | 2 |
| Amende forfaitaire 135 € (90 € minorée, 375 € majorée), jusqu'à 750 € devant le tribunal, contravention de 4e classe | service-public.gouv.fr, article 131-13 du code pénal | 1 et 2 |
| Certificat provisoire d'immatriculation (CPI) valable 1 mois dans le cas général d'un achat d'occasion | service-public.gouv.fr (fiche F16542) | 2 |
| Conditions d'éligibilité AssuTempo (20 ans minimum, permis de plus de 2 ans) | Contenu interne déjà publié et sourcé sur `/articles/assurance-auto-temporaire-jeune-conducteur` | 1 |

Les deux articles renvoient explicitement vers le cadre légal (articles de référence cités en toutes lettres) et n'affichent aucun chiffre non vérifié. Aucun prix ferme n'est inventé : l'article 1 réutilise exactement les fourchettes déjà publiées et vérifiées dans `prix-assurance-auto-temporaire`.

## Style et conformité CLAUDE.md

- Aucun tiret cadratin (—, U+2014) ni demi-cadratin (–, U+2013) dans les fichiers ajoutés/modifiés (`grep -P '[\x{2013}\x{2014}]'` sur les fichiers source, 0 occurrence).
- Aucune des 6 expressions bannies détectée dans le contenu ajouté.
- Certimat jamais qualifié d'habilité ni d'agréé : formulation verrouillée reprise telle quelle (intermédiaire technologique, professionnels habilités par le Ministère de l'Intérieur pour la saisie SIV, ou transmission à l'ANTS/France Titres).
- Style anti-détection IA appliqué : longueurs de phrases variées, nuances honnêtes assumées (ex. « un mois calendaire ne correspond pas toujours à 30 jours pile », « une assurance au kilomètre reste un contrat annuel, elle ne remplace pas une solution d'un mois »), aucun empilement mécanique de puces (tableaux et frise chronologique utilisés à la place).

## Build et portique qualité

- `npm install --legacy-peer-deps` (environnement de build vierge) puis `npm run build` : bundle client + SSR compilés, 71 routes prérendues dont les 2 nouvelles, sitemap régénéré (70 URLs, `/urgence` volontairement hors sitemap).
- Contenu statique vérifié dans le DOM prérendu (`dist/articles/.../index.html`, avant hydratation) : Answer Capsule, FAQ, JSON-LD Article/BreadcrumbList/FAQPage, liens de maillage duo, tous présents ; encodage UTF-8 propre (aucun caractère mal encodé), aucun tiret interdit.
- `npx eslint` sur l'ensemble des fichiers ajoutés/modifiés : 0 erreur (2 avertissements préexistants et non liés à cette PR : `AppShell.jsx` règle react-refresh, `scripts/prerender.mjs` ignoré par la config ESLint).
- `node scripts/quality-gate.mjs` (après commit, diff réel contre `origin/main`) : vert, 0 zone interdite touchée, `package.json` non modifié, sitemap cohérent avec `dist/`. Le workflow Gate GitHub rejoue ce même contrôle sur la PR.

## Checklist des interdictions (toutes respectées)

- [x] Header et footer globaux non modifiés.
- [x] Tunnel JL Assure de `/tarification` non touché (`src/pages/Pricing.jsx` intact).
- [x] Iframe Certimat de `/carte-grise` non touchée (`src/pages/CarteGrise.jsx` intact).
- [x] Aucun formulaire B2B ou international modifié.
- [x] Aucune nouvelle dépendance npm : `package.json` non modifié ; `package-lock.json` régénéré localement par `npm install` puis diff annulé avant commit (bruit de métadonnées `libc`, aucune dépendance ajoutée ou retirée).

## Suppression

Rien n'a été supprimé.
