# QA : Pack citation-building et défense de marque (30 juillet 2026)

Page `/avis-et-garanties` et document d'outreach `OUTREACH-CITATION-BUILDING-2026-07-30.md`,
issue #39, branche `claude/issue-39-20260730-1349` (contrainte d'environnement : la
session est épinglée sur cette branche, voir note en fin de document).

## Slug créé

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
