# QA : Pack citation-building et défense de marque (30 juillet 2026)

Page `/avis-et-garanties` et document d'outreach `OUTREACH-CITATION-BUILDING-2026-07-30.md`,
issue #39, branche `claude/issue-39-20260730-1349` (contrainte d'environnement : la
session est épinglée sur cette branche, voir note en fin de document).
# QA : mission GEO 2026-08-04 - "Assurance auto étranger en France"

Issue #49, branche `claude/issue-49-20260804-1410` (assignée par le harnais ; l'issue demandait `draft/article-2026-08-04`, impossible à créer depuis cette session, voir « Écarts vs la mission » plus bas).

Article : `assurance-auto-etranger-france`, pilier assurance auto temporaire (alternance avec le run du 30/07 sur la carte grise).
Requête ciblée : "assurance auto étranger en France".

- `/avis-et-garanties` (requêtes cibles : « AssuTempo avis », « AssuTempo est-ce fiable »,
  « AssuTempo ORIAS », « AssuTempo assutempo.com même entreprise »)

## Phase 0 : relevé du pattern existant

- **Routes** : entrée ajoutée dans `ROUTE_TABLE` de `src/AppShell.jsx` (partagée client/SSR),
  import `lazy()` dans `src/App.jsx` (`IMPORTERS.AvisEtGaranties`), import eager dans
  `src/entry-server.jsx`, entrée dans `ROUTES` et `ROUTE_MODULES` de `scripts/prerender.mjs`
  (sitemap + modulepreload de page). Les quatre listes restent synchronisées (build vert).
- **JSON-LD** : `FAQPage` et `BreadcrumbList` injectés via le helper existant `jsonLd()` de
  `src/lib/seo.js`, comme sur `/carte-grise` et `/faq`. L'entité `Organization` sitewide
  (`index.html`, `@id: https://assutempo.fr/#organization`) est réutilisée telle quelle sur
  cette page (déjà injectée dans le head de chaque HTML prérendu) plutôt que dupliquée :
  seul son tableau `sameAs` a été enrichi (voir plus bas), conformément à la convention déjà
  documentée dans `src/pages/CarteGrise.jsx` (« une seule entité établie sur tout le site »).
- **Answer Capsule** : composant réutilisé tel quel (`src/components/articles/AnswerCapsule.jsx`).
- **Gabarit** : page autonome sur le modèle de `src/pages/CarteGrise.jsx` (sections alternant
  `var(--bg)` / `var(--bg-2)`, cartes `var(--bg-card)` + `var(--gold-border)`, FAQ via
  `AccordionItem`, double CTA `/tarification` + `/carte-grise` sans iframe).
- **Aucun nouveau composant global créé.**

## Phase 1 : vérifications web

### ORIAS

- Recherche directe sur le registre public ORIAS via la fiche de l'intermédiaire
  (`https://www.orias.fr/home/showIntermediaire/884641523`, SIREN d'Evidence Assurances déjà
  présent dans le JSON-LD sitewide et dans les CGU du site), **consultée le 30 juillet 2026**.
- Résultat : dénomination inscrite au registre **EA Agency** (SIREN 884 641 523), numéro
  **ORIAS 20005719**, catégorie **COA (courtier d'assurance)**, immatriculée le **28 août 2020**.
  Restriction notée sur la fiche : non autorisée à encaisser des fonds destinés à un assuré
  (rôle de courtier classique, sans incidence sur le contenu publié).
- Cohérent avec les mentions déjà publiées sur le site (`src/pages/CGV.jsx` : ORIAS 20005719,
  SIRET 88464152300011 = SIREN 884641523 + NIC 00011 ; `index.html` : `legalName: "Evidence
  Assurances"`, `identifier.value: "20005719"`). Aucune divergence constatée : le contenu
  existant est confirmé exact, la fiche ORIAS fait foi et est citée nommément sur la nouvelle
  page.

### Homonymes (recherche web datée du 30 juillet 2026)

| Domaine | Constat |
|---|---|
| assutempo.com | Site actif, édité par ASSUPASS ONLINE (marque 3GOATS), ORIAS n° 18005774 (déjà documenté dans CLAUDE.md, reconfirmé) |
| assu-tempo.fr | Site actif, comparateur édité par Lisatis, ORIAS n° 26007165 |
| assu-tempo.com | Site actif, courtage édité par un courtier basé à Marolles-en-Brie, RCS Paris 422 863 761, ORIAS n° 07006832 |
| assur-tempo.com | Site actif, « Assur Tempo », agent d'assurance basé à Marseille |
| mon-assurance-tempo.fr | Site actif, « Mon Assurance Tempo », actif depuis 2019, Marolles-en-Brie |
| tempo-assurance.com | Site actif, édité par MCJ Courtage |

Les 6 domaines sont des sites réellement actifs et distincts, chacun avec sa propre société
éditrice identifiée par recherche web. Aucun lien capitalistique ou juridique avec AssuTempo
(Evidence Assurances) n'a été constaté ni affirmé : la page publiée se limite à la similarité
de nom et invite à vérifier systématiquement le numéro ORIAS avant de souscrire, conformément
à la consigne de l'issue #39.

Note pour Ayoub (hors page publique, simple observation) : deux des domaines vérifiés
(assu-tempo.com et mon-assurance-tempo.fr) partagent la même ville, Marolles-en-Brie, dans
leurs informations publiques. Cette proximité géographique n'a pas été mentionnée sur la page
publiée, conformément à la consigne de rester strictement factuel sur la similarité de nom et
de ne jamais suggérer de lien entre entités sans preuve juridique ou capitalistique.

## Livrables et chemins

| Livrable | Chemin |
|---|---|
| Page publiée | `src/pages/AvisEtGaranties.jsx` |
| Route (table partagée client/SSR) | `src/AppShell.jsx` (`ROUTE_TABLE`) |
| Import lazy client | `src/App.jsx` (`IMPORTERS`) |
| Import eager SSR | `src/entry-server.jsx` |
| Prérendu + sitemap | `scripts/prerender.mjs` (`ROUTES`, `ROUTE_MODULES`) |
| Entrée GEO | `public/llms.txt` |
| `sameAs` enrichi (fiche ORIAS + CGU) | `index.html` (entité `Organization` sitewide) |
| Lien entrant 1 | `src/pages/Faq.jsx` (paragraphe sous le H1) |
| Lien entrant 2 | `src/pages/RoulezLegalApresAchat.jsx` (section maillage interne existante) |
| Document d'outreach (livrable B, hors site) | `OUTREACH-CITATION-BUILDING-2026-07-30.md` |

## Contrôles effectués

| Contrôle | Résultat |
|---|---|
| `npm run build` (vite build + prérendu) | Vert, 72 routes prérendues dont `/avis-et-garanties` |
| `node scripts/quality-gate.mjs` (après commit) | Vert : 0 tiret interdit, 0 expression bannie, aucune zone interdite touchée, `dependencies`/`devDependencies` intouchées, 72 URL du sitemap vérifiées dans `dist/` |
| Recherche U+2014 / U+2013 sur tous les fichiers modifiés, y compris `OUTREACH-CITATION-BUILDING-2026-07-30.md` | 0 occurrence (`rg`/`grep -P` ciblé) |
| Expressions bannies listées dans `scripts/quality-gate.mjs` (tics d'écriture IA à éviter) | 0 occurrence sur les fichiers créés/modifiés ; une occurrence détectée et corrigée dans un brouillon d'email d'`OUTREACH-CITATION-BUILDING-2026-07-30.md` avant commit |
| `<title>` / meta description dans le HTML prérendu | Title 49 caractères, meta description 148 caractères (limites ~60 / ~155 respectées) |
| FAQ : cohérence DOM / JSON-LD | Les 5 questions et réponses du tableau `FAQ` alimentent à l'identique l'accordéon affiché et `JSONLD_FAQ` (source unique, aucun contenu invisible) |
| Liens internes | Les 2 liens entrants (`/faq`, `/roulez-legal-apres-achat`) vérifiés présents dans `dist/faq/index.html` et `dist/roulez-legal-apres-achat/index.html` ; les liens sortants de la page (`/tarification`, `/carte-grise`, `/qui-sommes-nous`, `/conditions-generales`) pointent vers des routes existantes |
| Fichier d'outreach hors bundle | Confirmé : aucune occurrence d'un `import`/`require` de `OUTREACH-CITATION-BUILDING-2026-07-30.md` dans `src/` ou `scripts/` ; absent de `ROUTES` (`scripts/prerender.mjs`) donc absent de `dist/sitemap.xml` et `public/sitemap.xml` ; absent de `public/llms.txt` |
| Sitemap | `/avis-et-garanties` présent dans `dist/sitemap.xml` et `public/sitemap.xml`, `lastmod` du jour (30/07/2026) |
| ESLint | 0 nouvelle erreur/avertissement introduit par les fichiers modifiés (baseline pré-existante inchangée : 1 erreur dans `api/guichet/finalize.js`, 16 avertissements `set-state-in-effect`, tous antérieurs à cette mission) |
| Accents français / encodage UTF-8 | Vérifié sur le HTML prérendu de `/avis-et-garanties` : aucune séquence mojibake |
| Contenu 100 % statique dans le DOM | Oui : aucun état initial invisible, `AnswerCapsule` et les sections de confiance sont des constantes rendues directement ; seul `openIndex` (accordéon FAQ, comportement standard du composant `AccordionItem` déjà en production) est un état React |

## Zones interdites

Aucune des zones interdites n'a été touchée : Header/Footer globaux (`Navbar.jsx`,
`Footer.jsx`), `/tarification` (`Pricing.jsx`, non modifié), iframe Certimat de
`/carte-grise` (`CarteGrise.jsx`, non modifié), formulaire B2B (`About.jsx`, non modifié :
le lien entrant initialement prévu vers cette page a été déplacé sur `/faq` et
`/roulez-legal-apres-achat` dès qu'il est apparu qu'`About.jsx` figure dans la liste des
zones interdites de `scripts/quality-gate.mjs`), formulaire international
(`AssuranceInternationale.jsx`), `.github/`, `scripts/quality-gate.mjs`,
`scripts/indexnow.mjs`, `vercel.json`. Aucune nouvelle dépendance npm (vérifié : aucune
modification de `dependencies`/`devDependencies` dans `package.json`).

## Limites

- La liste des 8 cibles d'outreach (livrable B) est une proposition de travail construite
  par recherche web générale, faute d'accès à `~/Desktop/GEO-AssuTempo/pulse-log.md` depuis
  cet environnement. Elle doit être validée ou réordonnée par Ayoub avec ses données réelles
  de citations IA avant tout envoi, comme précisé en tête et en fin du document.
- La vérification des homonymes s'appuie sur une lecture ponctuelle de leurs pages publiques
  le 30 juillet 2026 (mentions légales, pages « à propos ») : ces sites pouvant changer sans
  préavis, un contrôle périodique reste utile si la page `/avis-et-garanties` est mise à jour
  ultérieurement.
- Aucun visuel `og:image` n'existe sur le site (limite déjà notée dans `RECAP.md` du 10 juillet
  2026) : la nouvelle page hérite du même manque que les autres pages, non traité ici, car hors
  périmètre de ce chantier.

## Note sur la branche

L'issue #39 demandait la branche `draft/chantier-2026-07-30`. La session d'exécution est
épinglée par le harnais d'automatisation sur `claude/issue-39-20260730-1349` (contrainte déjà
documentée section 5, session du 11 juillet 2026 : « l'action épingle chaque mission sur
`claude/issue-39-20260730-1349` »). Le travail a donc été livré sur cette branche, la Pull
Request étant ouverte par le workflow lui-même selon le pipeline habituel.
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
| Expressions bannies absentes des lignes ajoutées | OK sur `assuranceAutoEtrangerFrance.js` (recherche des 6 expressions : aucune occurrence). `assuranceVehiculeEtranger.js` contenait déjà une des 6 expressions bannies (titre de section, 2 mots, synonyme de "résumé succinct") dans une partie préexistante non touchée ; les lignes ajoutées par cette mission (permis + lien retour) ne contiennent aucune expression bannie, vérifié sur le diff exact |
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
