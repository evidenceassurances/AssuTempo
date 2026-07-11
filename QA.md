# QA : fondations GEO/SEO (10 juillet 2026)

Verification complete du lot "GEO foundations" avant push. Build de reference : `npm run build` du 10 juillet 2026, propre (0 erreur), 56 routes + 404 prerendues.

## 1. Couverture prerender

- 57/57 fichiers HTML generes (56 routes publiques + dist/404.html), routeur et prerender alignes.
- Echantillons verifies dans dist/ (HTML brut, avant tout JS) : accueil, /faq, /tarification, /carte-grise, article essai : contenu complet + JSON-LD presents.

## 2. JSON-LD

Validation programmatique de CHAQUE bloc des 57 pages : **151 blocs, 0 JSON invalide**.

| Type | Blocs | Ou |
|---|---|---|
| Organization + InsuranceAgency | 57 | toutes pages (template), avec identifier ORIAS 20005719, sameAs verifies, logo |
| WebSite | 57 | toutes pages (publisher -> #organization) |
| FAQPage | 17 | home (7 Q/A), /faq (14 Q/A), /tarification, /carte-grise, /articles, 12 articles |
| BreadcrumbList | 16 | /faq (nouveau), /tarification, /carte-grise, /articles, 12 articles |
| Article | 12 | tous avec datePublished (dates git reelles) + dateModified + publisher.logo repare |
| HowTo | 7 | articles (existant) |
| Service | 2 | /tarification (serviceType "Assurance auto temporaire 1 à 90 jours", areaServed FR+Europe), /carte-grise (Certimat) ; provider par @id |
| WebPage / ItemList | 37 / 3 | pages pays et listes (existant) |

- Regle "contenu visible uniquement" respectee : les FAQPage sont generees depuis les MEMES tableaux de donnees que les accordeons affiches (source unique faqHome.js / faqs / FAQ).
- sameAs : uniquement des URL verifiees en session (HTTP 200 + titre correspondant a EA AGENCY / Evidence Assurances, SIREN 884641523). Pappers exclu (403), orias.fr exclu (pas de lien profond stable).
- `https://assutempo.fr/logo.png` existe desormais (copie 180x180 de l'apple-touch-icon) : les 12 references publisher.logo des articles ne sont plus cassees.

## 3. Typographie et dependances

- `rg` sur U+2014/U+2013 : **0 tiret cadratin, 0 demi-cadratin** dans src/, public/, scripts/, index.html, .github/ (les 2 demi-cadratins preexistants de CGV.jsx:495 ont ete corriges).
- `git diff package.json package-lock.json` : vide. **Aucune dependance ajoutee.**

## 4. Tailles avant / apres

| Mesure | Avant | Apres | Delta |
|---|---|---|---|
| Total JS | 38 chunks, 335,8 KB gz | 37 chunks, 335,7 KB gz | -0,1 KB |
| Chunk principal (index) | 19,3 KB gz | 20,2 KB gz | +0,9 KB (donnees FAQ + schema FAQPage de la Home) |
| HTML accueil | 20,8 KB gz | 21,9 KB gz | +1,1 KB (entite enrichie + FAQPage 7 Q/A) |
| HTML /faq | ~9,6 KB gz | 10,8 KB gz | +1,2 KB (FAQPage 14 Q/A + breadcrumb) |
| HTML article capsule | ~14,5 KB gz | 15,0 KB gz | +0,5 KB (AnswerCapsule) |

Aucun impact perceptible : le JS critique reste sous les seuils de la session du 3 juillet, aucune modification des chemins de rendu.

## 5. Sitemap

- 56 URLs (inchange), **lastmod reels** par route : derniere date git des fichiers sources (page + donnees), fichier modifie non commite = date du jour. Distribution constatee : 2026-07-03 (2), 2026-07-05 (36), 2026-07-07 (1), 2026-07-10 (17). Fini le lastmod unique fige.
- Fallback si git indisponible : date stable 2026-06-23 (jamais de crash de build).

## 6. robots.txt

- Deploye avec sections Allow explicites : GPTBot, OAI-SearchBot, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, Bingbot, CCBot, Amazonbot, Applebot-Extended + User-agent: * et Sitemap conserves.

## 7. IndexNow

- Cle `333c3e14ba12a91b5b09cf6eaa5315ac` : fichier present dans public/ ET dans dist/ (servi a la racine).
- `scripts/indexnow.mjs` : Node natif, lit public/sitemap.xml, POST api.indexnow.org (56 URL). Teste en local : lecture sitemap OK (le ping reel est fait apres le deploiement, reponse collee dans RECAP.md).
- `.github/workflows/indexnow.yml` : ping automatique a chaque push sur main.

## 8. Verification navigateur (vite preview sur dist/, moteur Chromium)

- Routes chargees en acces direct : `/`, `/faq`, `/tarification`, `/carte-grise`, `/articles/assurance-temporaire-essai-vehicule-avant-achat`, `/articles/assurer-vehicule-achete-chez-particulier`.
- **Console : 0 erreur, 0 warning sur toutes les routes** (pas de #418 : la parite SSR/client est preservee, les nouveaux schemas passent par le pattern Helmet existant, la capsule est statique et identique des deux cotes).
- AnswerCapsule verifiee visuellement (capture) : label or, reponse, 3 chips de faits (Art. L211-1 / Avril 2024 / 1 mois), pied "Faits vérifiés · mis à jour le 10 juillet 2026". Affichee sans animation : lisible des le premier paint (regle du 8 juillet).
- /tarification : iframe JL Assure intacte, Service mis a jour visible dans le DOM. /carte-grise : iframe Certimat intacte (cadre vide en preview locale = CSP partenaire, comportement documente).
- Zones interdites intactes : header/footer, tunnel JL Assure, iframe Certimat, formulaires B2B/international non touches (seule la couche head/meta de Pricing et CarteGrise a change).

## Verdict

Lot conforme : build propre, 0 JSON-LD invalide, 0 tiret interdit, 0 dependance, 0 erreur console, budgets tenus. Pret pour push production.

---

# QA : mission GEO 2 articles (11 juillet 2026)

Deux nouveaux articles ajoutes selon le pattern existant : `assurance-auto-temporaire-immediate-en-ligne` (requete cible « assurance auto temporaire immediate en ligne ») et `carte-grise-urgence-cpi-immediat` (requete cible « carte grise en urgence certificat provisoire immediat »).

## Controles effectues

- **Tirets interdits (U+2013 / U+2014)** : `rg` sur les 2 fichiers de donnees, les 2 pages, `articlesData.js` et les fichiers modifies (`controleSansAssurance.js`, `carteGrise.js`, `App.jsx`, `AppShell.jsx`, `entry-server.jsx`, `prerender.mjs`) -> aucun resultat.
- **Accents / UTF-8** : relecture manuelle, apostrophes typographiques et accents corrects.
- **Expressions bannies** ("dans un monde ou", "il est important de noter", "de nos jours", "n'hesitez pas", "en resume", "force est de constater") : recherche insensible a la casse sur les 2 fichiers de donnees -> aucun resultat.
- **Aucune nouvelle dependance npm** : `package.json` et `package-lock.json` non modifies.
- **Answer Capsule** : presente en tete des deux articles (reponse directe + 3 faits dates/sources), rendue statiquement. Verifiee dans le HTML prerendu (`grep "La reponse en bref"` -> 1 occurrence par page).
- **FAQ** : 4 questions autoportantes par article, avec JSON-LD `FAQPage` correspondant (`grep "Questions frequentes"` -> 1 occurrence par page).
- **Maillage croise obligatoire** : article 1 -> `/carte-grise` (present) ; article 2 -> `/tarification` (present). Maillage complementaire : article 1 -> `/articles/combien-de-jours-assurance-sortir-fourriere`, `/articles` ; article 2 -> `/articles/assurer-vehicule-achete-chez-particulier`, `/articles/assurance-temporaire-rouler-en-attendant-carte-grise`.
- **Liens entrants (Phase 4)** : ajout d'un `relatedLink` dans `controle-sans-assurance-risques-amende` vers l'article 1, et dans `assurance-temporaire-rouler-en-attendant-carte-grise` vers l'article 2. Verifies presents dans le HTML prerendu des pages sources.
- **Title / meta description** : article 1, title 44 caracteres, description 140. Article 2, title 52 caracteres, description 143. Sous les limites (60 / 155).
- **JSON-LD** : `Article` + `BreadcrumbList` + `HowTo` + `FAQPage` par article, via le meme mecanisme (`jsonLd()` de `src/lib/seo.js`).
- **Contenu statique dans le DOM prerendu** : verifie par `grep` direct dans `dist/articles/<slug>/index.html` (title, meta description, Answer Capsule, FAQ, liens de maillage tous presents avant hydratation).
- **Longueur** : environ 1200 mots par article (corps editorial, hors elements d'interface repetes).
- **Sitemap** : 58 URLs (56 + 2 nouvelles), lastmod du jour, prerender confirme les 58 fichiers HTML generes.

## Verification factuelle YMYL (sources)

- Fin de la carte verte au 1er avril 2024, controle a la plaque via le FVA : service-public.fr.
- Delai d'alimentation du FVA par l'assureur : 72 heures (Code des assurances, controle de l'obligation d'assurance).
- Depuis le 13 fevrier 2026 (arrete du 30 janvier 2026), un conducteur peut verifier lui-meme si son vehicule figure au FVA : legifrance.gouv.fr.
- Defaut d'assurance : delit, amende jusqu'a 3 750 euros, peines complementaires (suspension permis, confiscation) : service-public.fr.
- Certificat provisoire d'immatriculation (CPI) : validite 1 mois, circulation en France uniquement : ants.gouv.fr / service-public.fr.
- Delai legal pour immatriculer un vehicule d'occasion a son nom : 1 mois calendaire a partir du certificat de cession : service-public.fr.
- Amende pour carte grise non faite : forfaitaire 135 euros, jusqu'a 750 euros devant un tribunal : service-public.fr.

## Adaptations par rapport a la mission d'origine

Quatre pages citees dans les instructions n'existent pas dans le depot : `/assurance-auto-temporaire-1-jour`, `/liste-des-situations-necessitant-une-assurance-temporaire`, `/faire-sa-carte-grise`, `/le-certificat-provisoire-dimmatriculation-plaques-ww`. Le maillage a ete redirige vers les pages/articles reels les plus proches (detail dans la description de la Pull Request).

## Build

- `npm ci --legacy-peer-deps` puis `npm run build` : build propre (Vite + prerendu des 58 routes, sitemap 58 URLs).
- Portique qualite (`node scripts/quality-gate.mjs`) : vert.
- Lint (`npm run lint` / `eslint`) : non execute dans cette session, les commandes `npm run lint` et `npx eslint` ont ete bloquees par la sandbox (necessitent une approbation non disponible en execution automatique). Le Gate CI (`.github/workflows/gate.yml`) execute son propre `npm run build`.

## Verdict

Lot conforme : build propre, 0 tiret interdit, 0 expression banni, 0 dependance, maillage croise et liens entrants en place, sitemap a jour. Pret pour Pull Request et controle du Gate automatique.
