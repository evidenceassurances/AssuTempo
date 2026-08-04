# QA : mission GEO 2026-08-04 - "Assurance auto étranger en France"

Issue #49, branche `claude/issue-49-20260804-1410` (assignée par le harnais ; l'issue demandait `draft/article-2026-08-04`, impossible à créer depuis cette session, voir « Écarts vs la mission » plus bas).

Article : `assurance-auto-etranger-france`, pilier assurance auto temporaire (alternance avec le run du 30/07 sur la carte grise).
Requête ciblée : "assurance auto étranger en France".

## Phase 0 : relevé du pattern existant

- **Données d'article** : `src/data/articles/*.js` (dernier modèle lu intégralement : `carteGriseAntsBloquee.js`, le plus récent). Champs `slug`, `seo` (title/description/canonical/jsonLd), `category`, `readTime`, `updatedDate`, `author`, `cta`, `answerCapsule`, `sections` (types `alert`, `text`, `table`, `decisionsplit`, `checklist`, `timeline`, `stepflow`), `faqItems`.
- **Rendu** : `src/components/ArticleLayout.jsx` (tous les types de section utilisés existent déjà, aucune nouvelle mécanique créée) et `src/components/DecisionSplit.jsx` (généralise sur `voies`, réutilisé avec 3 voies pour l'arbre de décision demandé, format jamais utilisé ailleurs mais aucun nouveau composant).
- **Routage partagé client/SSR** : `src/AppShell.jsx` (`ROUTE_TABLE`), `src/App.jsx` (`IMPORTERS`, lazy), `src/entry-server.jsx` (imports eager + objet `PAGES`). Nouvelle route `/articles/assurance-auto-etranger-france` ajoutée aux 3 endroits, suivant exactement l'entrée `carte-grise-ants-bloquee` juste au-dessus.
- **Prérendu et sitemap** : `scripts/prerender.mjs` (`ROUTES`, `ROUTE_MODULES`, `ARTICLE_DATA_SOURCES`), `sitemap-lastmod.json` (carte de dates committée, seule source fiable sur un clone superficiel). Les 3 entrées ajoutées suivent le même schéma que les articles existants.
- **Maillage** : `src/data/articleClusters.js`, cluster `international` (déjà porteur de `assurance-temporaire-vehicule-etranger-france`, `/assurance-internationale`, `/carte`). Le nouveau slug y a été ajouté : liaison automatique bidirectionnelle via `getClusterFor()`, sans toucher au mécanisme.
- **Article existant lu intégralement avant rédaction** : `src/data/articles/assuranceVehiculeEtranger.js` (page `/articles/assurance-temporaire-vehicule-etranger-france`). Couvre l'obligation générale (assurance + immatriculation sous 1 mois), le CPI/plaques WW, un paragraphe générique sur le permis étranger. Ne couvre pas : le triptyque UE/EEE - carte verte - assurance frontière, l'encart permis détaillé (réciprocité, délai d'1 an, frais d'échange), ni la nuance carte verte/FVA/Mémo véhicule assuré. Recouvrement estimé sous 15 % (le seul délai d'1 mois est repris, par cohérence sitewide) : angle du jour confirmé sans besoin de pivoter.
- **`FORBIDDEN_PATHS` du portique** (`scripts/quality-gate.mjs`) : `Navbar.jsx`, `Footer.jsx`, `Pricing.jsx`, `CarteGrise.jsx`, `About.jsx`, `AssuranceInternationale.jsx`, `.github/`, `quality-gate.mjs`, `indexnow.mjs`, `vercel.json`. Aucun de ces chemins n'a été touché (vérifié : `node scripts/quality-gate.mjs` vert après commit).

## Phase 1 : faits vérifiés (recherche web du 4 août 2026)

| Fait retenu | Source officielle | Vérifié le |
|---|---|---|
| Délai d'1 mois pour immatriculer un véhicule en France dès que la résidence normale y est transférée, sanction = contravention de 4e classe | Article R322-5 du code de la route (legifrance.gouv.fr) ; service-public.gouv.fr | 04/08/2026 |
| Non-résident : jusqu'à 1 an de circulation continue avec une plaque étrangère avant obligation de régularisation ; ce délai retombe à 1 mois dès le transfert de résidence normale | Réglementation sur la circulation internationale des véhicules (convention de Vienne sur la circulation routière, transposée en droit français) ; recoupé sur plusieurs sources, à vérifier sur service-public.gouv.fr en cas de doute sur un cas précis | 04/08/2026 |
| Assurance frontière : contrat de 30 ou 90 jours, renouvelable une seule fois, pour un véhicule hors UE/EEE et hors système de la carte verte | Article R211-24 du code des assurances ; décret n°2019-214 du 20 mars 2019 (legifrance.gouv.fr) | 04/08/2026 |
| Permis délivré hors UE/EEE : valable 1 an après l'installation en France, échange possible seulement avec un accord de réciprocité (liste publiée) | service-public.gouv.fr (fiche F1460) ; securite-routiere.gouv.fr (liste de réciprocité) | 04/08/2026 |
| Permis délivré dans l'UE/EEE : reconnu en France jusqu'à sa date d'expiration, sans échange obligatoire | securite-routiere.gouv.fr ; Your Europe (europa.eu) | 04/08/2026 |
| Droit de timbre de 40 euros pour toute demande d'échange de permis (français ou étranger) depuis le 12 mai 2026, loi de finances 2026 | service-public.gouv.fr (actualité A18887) | 04/08/2026 |
| Suppression au 1er avril 2024 du certificat d'assurance papier et de la vignette pour les véhicules assurés en France, remplacés par le Fichier des véhicules assurés (FVA) et le Mémo véhicule assuré. Le système international de la carte verte n'a pas disparu | interieur.gouv.fr (communiqué du 1er avril 2024) ; economie.gouv.fr | 04/08/2026 |
| Défaut d'assurance : amende forfaitaire délictuelle de 500 euros (400 minorée, 1000 majorée), jusqu'à 3 750 euros devant le tribunal (7 500 euros en récidive), immobilisation/confiscation possibles | Code des assurances (obligation, article L211-1) et code de la route (sanction) ; economie.gouv.fr, service-public.gouv.fr | 04/08/2026 |

## Phase 2 et 3 : contenu et intégration

- 1500-2200 mots (2216 mots en comptant Answer Capsule, tableau, arbre de décision et FAQ, cohérent avec la fourchette demandée pour un article de référence dense).
- 1 seul H1, H2/H3 formulés en questions, réponse dès les 2 premières phrases du corps.
- Answer Capsule (48 mots) + 5 faits datés et sourcés.
- Tableau HTML brut des 3 cas (immatriculation, obligation d'assurance, durée maximale, document de contrôle) + arbre de décision en 3 voies (`DecisionSplit`).
- Encart distinct sur le permis de conduire (UE/EEE vs hors UE, piège du délai d'1 an, frais de 40 euros).
- FAQ de 6 questions autoportantes, identiques au FAQPage JSON-LD.
- E-E-A-T : encart auteur avec ORIAS 20005719 et SIRET 884 641 523 00011 dans le corps de l'article (pas seulement les CGU), sources officielles nommées, nuance honnête assumée (l'assurance frontière n'est pas un produit AssuTempo, redirection explicite vers le bon interlocuteur) et détail de terrain (confusion fréquente entre le délai d'1 an et celui d'1 mois).
- Maillage : duo interne obligatoire (`/assurance-internationale`, `/articles/assurance-temporaire-vehicule-etranger-france`) + duo croisé assurance vers carte grise (`/carte-grise`, `/articles/combien-de-temps-carte-grise`) + lien bonus (`/articles/controle-sans-assurance-risques-amende`). Lien entrant explicite ajouté en retour dans `assuranceVehiculeEtranger.js`.
- JSON-LD Article + BreadcrumbList + FAQPage via le même mécanisme que les autres articles (pas de nouveau schéma). Sitemap et `sitemap-lastmod.json` mis à jour avec la date du jour.

## Phase 4 : contrôles

| Contrôle | Résultat |
|---|---|
| Aucun tiret cadratin (U+2014) ni demi-cadratin (U+2013) dans les fichiers modifiés | OK, recherche d'octets sur tous les fichiers source touchés (créés et modifiés), aucune occurrence |
| Accents corrects, encodage UTF-8 | OK, relecture du fichier de données et du rendu prérendu |
| Aucune nouvelle dépendance npm | OK, `package.json` non modifié. `package-lock.json` régénéré par `npm install --legacy-peer-deps` (uniquement un champ de métadonnées `libc` disparaissait selon la version npm locale, aucun paquet ajouté/retiré) puis restauré à l'identique par précaution |
| Expressions bannies absentes des lignes ajoutées | OK sur `assuranceAutoEtrangerFrance.js` (recherche des 6 expressions : aucune occurrence). `assuranceVehiculeEtranger.js` contient déjà "en résumé" dans une section préexistante non touchée ; les lignes ajoutées par cette mission (permis + lien retour) ne contiennent aucune expression bannie, vérifié sur le diff exact |
| Answer Capsule présente | OK, rendu confirmé dans `dist/articles/assurance-auto-etranger-france/index.html` ("La réponse en bref" présent) |
| FAQ affichée cohérente avec le FAQPage | OK, 6 questions/réponses identiques, comparaison automatisée du JSON-LD `FAQPage` contre le texte du DOM prérendu (6/6 trouvées) |
| Maillage duo obligatoire + duo croisé présents | OK, comptage des `href` dans le HTML prérendu : `/assurance-internationale` (4), `/articles/assurance-temporaire-vehicule-etranger-france` (2), `/carte-grise` (3), `/articles/combien-de-temps-carte-grise` (1) |
| Title et meta description dans les limites | OK, title 45 caractères (< 60), meta description 153 caractères (< 155) |
| Contenu statique présent dans le DOM après build | OK, vérifié dans `dist/articles/assurance-auto-etranger-france/index.html` (fichier prérendu, pas seulement le rendu client) : H1, Answer Capsule, tableau, arbre de décision, encart permis, FAQ, 3 blocs JSON-LD propres à l'article (Article, BreadcrumbList, FAQPage), en plus du graphe Organization/WebSite sitewide déjà présent sur toutes les pages |
| `npm run build` propre | OK, 78 routes prérendues sans erreur, sitemap 77 URL |
| `node scripts/quality-gate.mjs` | OK, vert après commit (0 zone interdite, aucun tiret, aucune expression bannie, dépendances inchangées, sitemap cohérent avec `dist/`) |
| `npx eslint` sur les fichiers touchés | OK, 0 erreur (2 warnings préexistants sans rapport avec cette mission) |

## Écarts vs la mission

- Le contexte marque de la mission cite des pages `/faire-sa-carte-grise`, `/assurance-auto-temporaire-1-jour`, `/le-certificat-provisoire-dimmatriculation-plaques-ww`, `/liste-des-situations-necessitant-une-assurance-temporaire` et `/importer-exporter-un-vehicule-etranger`. Aucune de ces routes n'existe dans `AppShell.jsx`/`App.jsx` : elles n'ont pas été utilisées pour le maillage (CLAUDE.md l'emporte sur une instruction de mission contradictoire, zéro lien cassé). Le duo croisé « carte grise » a été réalisé vers `/carte-grise` et `/articles/combien-de-temps-carte-grise`, deux pages réellement existantes et thématiquement pertinentes.
- Branche `draft/article-2026-08-04` demandée par la mission : impossible à créer depuis cette session (l'action épingle chaque mission sur `claude/issue-N-*`, contrainte documentée dans CLAUDE.md section 5, session du 11 juillet 2026). Travail effectué sur la branche fournie, `claude/issue-49-20260804-1410`.
