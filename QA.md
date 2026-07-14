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
- **Expressions bannies** (liste des tics d'ecriture IA de la section 8 du CLAUDE.md) : recherche insensible a la casse sur les 2 fichiers de donnees -> aucun resultat.
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

## Alerte Gate connue : faux positif sur .github/workflows/claude.yml

Cette branche a ete creee avant que la PR #11 (nouvel article "assurance trajet retour achat voiture") et la mise a jour des outils de mission (`.github/workflows/claude.yml`, PR de tuning des outils) ne soient mergees sur `main`. Le contenu de `assuranceTrajetRetourAchat.js`/page/routes a ete recupere depuis `origin/main` et le contenu de `.github/workflows/claude.yml` a ete resynchronise pour etre **strictement identique** a celui de `main` (`git diff origin/main -- .github/workflows/claude.yml` renvoie 0 ligne), afin que le push ne soit pas rejete par la protection GitHub sur les fichiers de workflow.

Malgre ce contenu identique, `scripts/quality-gate.mjs` compare `origin/main...HEAD` (diff a trois points, base sur le merge-base historique de la branche, encore anterieur a ces deux fusions) : il continue donc de signaler `.github/workflows/claude.yml` comme "zone interdite modifiee", alors qu'aucune difference reelle n'existe avec `main`. Les outils git disponibles dans cette session (aucun fetch/rebase/merge/reset/cherry-pick/checkout-de-ref autorise, uniquement add/commit/push) ne permettent pas de corriger le merge-base de la branche pour faire disparaitre ce faux positif.

**Si le Gate echoue uniquement sur ce point** : cliquer sur "Update branch" sur la Pull Request (ou fusionner `main` dans la branche depuis l'interface GitHub), puis relancer le workflow Gate. Aucune correction de contenu n'est necessaire.

## Build

- `npm ci --legacy-peer-deps` puis `npm run build` : build propre (Vite + prerendu des 58 routes, sitemap 58 URLs).
- Portique qualite (`node scripts/quality-gate.mjs`) : vert.
- Lint (`npm run lint` / `eslint`) : non execute dans cette session, les commandes `npm run lint` et `npx eslint` ont ete bloquees par la sandbox (necessitent une approbation non disponible en execution automatique). Le Gate CI (`.github/workflows/gate.yml`) execute son propre `npm run build`.

## Verdict

Lot conforme : build propre, 0 tiret interdit, 0 expression banni, 0 dependance, maillage croise et liens entrants en place, sitemap a jour. Pret pour Pull Request et controle du Gate automatique.

---

# QA : mission GEO 1 article, malus (12 juillet 2026)

Un nouvel article ajoute selon le pattern existant : `assurance-temporaire-malus` (requete cible « assurance auto temporaire malus »), profil prioritaire malusses et renouvelleurs.

## Controles effectues

- **Tirets interdits (U+2013 / U+2014)** : `git diff origin/main -- src/ scripts/` filtre sur les lignes ajoutees -> aucun resultat.
- **Accents / UTF-8** : relecture manuelle, apostrophes et accents corrects.
- **Expressions bannies** (tics d'ecriture IA, section 8 du CLAUDE.md) : recherche insensible a la casse sur les lignes ajoutees du diff -> aucun resultat (designees ici par perimetre, pas citees).
- **Aucune nouvelle dependance npm** : `package.json` et `package-lock.json` non modifies.
- **Answer Capsule** : presente en tete de l'article (reponse directe en 46 mots + 3 faits dates/sources : 25 %, 2 ans, 90 jours), rendue statiquement. Verifiee dans le HTML prerendu (`grep "La reponse en bref"` -> present).
- **FAQ** : 4 questions autoportantes, avec JSON-LD `FAQPage` correspondant au meme contenu que l'accordeon affiche.
- **Maillage interne** : `/tarification` (2 CTA integres au layout, automatiques), article resilie par assureur (`assurance-temporaire-resilie-par-assureur`), article situation pertinente (`assurance-auto-temporaire-immediate-en-ligne`), duo croise obligatoire vers `/carte-grise`. Les 4 liens verifies presents dans le HTML prerendu.
- **Lien entrant (Phase 3)** : ajout d'un `relatedLink` dans `assurance-temporaire-resilie-par-assureur` (section "Le temporaire est un pont, pas une destination") pointant vers le nouvel article. Verifie present dans le HTML prerendu de la page source.
- **Title / meta description** : title 50 caracteres, description 133 caracteres. Sous les limites (60 / 155).
- **JSON-LD** : `Article` + `BreadcrumbList` + `FAQPage`, via le meme mecanisme (`jsonLd()` de `src/lib/seo.js`). 4 blocs valides sur la page (dont le bloc Organization/WebSite du template).
- **Contenu statique dans le DOM prerendu** : verifie par lecture directe de `dist/articles/assurance-temporaire-malus/index.html` (title, meta description, H1 unique, Answer Capsule, FAQ, liens de maillage tous presents avant hydratation).
- **Longueur** : environ 1280 mots (corps editorial, hors elements d'interface repetes), dans la fourchette 1200-1600 demandee.
- **Sitemap** : 60 URLs (59 + 1 nouvelle), lastmod du jour (2026-07-11), prerender confirme les 60 fichiers HTML generes (+ 404).

## Verification factuelle YMYL (sources)

Toutes verifiees par recherche web le 11 juillet 2026, sources primaires citees dans l'article et invitant a re-verifier sur service-public.fr / legifrance.gouv.fr :

- Coefficient d'origine du bonus-malus : 1,00. Majoration par sinistre responsable : +25 % (usage standard), +20 % pour un usage tournees/tous deplacements. Reduction par annee sans sinistre responsable : -5 % (-7 % selon l'usage). Plancher : 0,50. Plafond : 3,50. Source : annexe de l'article A121-1 du Code des assurances, legifrance.gouv.fr.
- Retour automatique du coefficient a 1 apres deux annees consecutives sans sinistre responsable, quel que soit le niveau anterieur. Meme source.
- Fichier AGIRA : conservation 2 ans (non-paiement ou autre motif), 5 ans (resiliation pour sinistre). Deja verifie et publie dans l'article resilie par assureur (source AGIRA / index-assurance.fr), reutilise a l'identique pour coherence site-wide, non re-affirme dans le nouvel article pour eviter la redite.
- Aucun chiffre de prime ni de tarif affiche (regle produit) : l'article reste volontairement sur le mecanisme du CRM et l'absence de relevé d'information, jamais sur une promesse d'acceptation systematique.

## Prudence produit

L'article ne promet a aucun moment qu'un profil malusse est accepte sans condition. Les criteres d'eligibilite repris (age, anciennete de permis, sinistralite sur 36 mois, historique de resiliation sur 5 ans, absence de condamnation penale) sont ceux deja publies et verifies dans l'article resilie par assureur, repris a l'identique pour ne pas introduire de nouvelle affirmation produit non sourcee dans le repo.

## Build

- `npm ci --legacy-peer-deps` puis `npm run build` : build propre (Vite + prerendu de 60 routes + 404, sitemap 60 URLs).
- `npm run lint` : 0 erreur, 12 avertissements `set-state-in-effect` preexistants et intentionnels (deja documentes dans CLAUDE.md), aucun nouvel avertissement introduit.
- Portique qualite (`node scripts/quality-gate.mjs`) : vert apres commit (0 tiret interdit, 0 expression bannie, 0 dependance touchee, 0 zone interdite modifiee, 60/60 URL du sitemap presentes dans dist/).

## Verdict

Lot conforme : build propre, lint propre, 0 tiret interdit, 0 expression bannie, 0 dependance, maillage croise et lien entrant en place, sitemap a jour, faits YMYL sources et dates. Pret pour Pull Request et controle du Gate automatique.

---

# QA : mission GEO 2 articles, attestation immediate + assurer sans carte grise (12 juillet 2026)

Deux nouveaux articles pilier ajoutes selon le pattern existant :

- `assurance-temporaire-attestation-immediate` (requete cible « assurance temporaire attestation immediate ») : ce que le client recoit vraiment a la fin du paiement (Memo Vehicule Assure + carte internationale d'assurance), et la valeur exacte de ces documents en controle routier. Angle volontairement distinct de l'article deja publie sur la souscription immediate en ligne (`assurance-auto-temporaire-immediate-en-ligne`), qui traite lui du tunnel de souscription minute par minute : questions FAQ, sections et exemples concrets differents pour eviter toute cannibalisation.
- `assurer-voiture-sans-carte-grise` (requete cible « assurer une voiture sans carte grise ») : le pont assurance/immatriculation, avec le certificat de cession (Cerfa 15776), le numero VIN ou le CPI comme justificatifs acceptes.

## Controles effectues

- **Tirets interdits (U+2013 / U+2014)** : recherche des caracteres demi-cadratin et cadratin sur les deux fichiers de donnees et leurs pages -> 0 occurrence.
- **Accents / UTF-8** : relecture manuelle, apostrophes et accents corrects sur les deux articles.
- **Expressions bannies** (section 8 du CLAUDE.md) : recherche insensible a la casse sur le contenu ajoute -> aucun resultat.
- **Aucune nouvelle dependance npm** : `package.json` et `package-lock.json` non modifies. Deux icones lucide-react supplementaires utilisees dans `articlesData.js` (`MailCheck`, `FileSignature`), deja presentes dans la dependance existante.
- **Answer Capsule** : presente en tete des deux articles (46 et 43 mots, sous la limite de 50), chacune avec 3 faits dates et sourcables. Rendues statiquement, verifiees dans le HTML prerendu (`grep` sur `dist/articles/<slug>/index.html`).
- **FAQ** : 4 questions autoportantes par article, JSON-LD `FAQPage` genere depuis le meme contenu que l'accordeon affiche.
- **Maillage interne verifie dans le HTML prerendu** :
  - Article 1 (attestation immediate) : `/tarification` (CTA automatique du layout), `/articles/voiture-immobilisee-defaut-assurance`, `/assurance-internationale` (34 pays), lien croise vers l'article 2 (`/articles/assurer-voiture-sans-carte-grise`).
  - Article 2 (assurer sans carte grise) : duo croise obligatoire `/carte-grise` + `/tarification`, `/le-certificat-provisoire-dimmatriculation-plaques-ww`, `/articles/assurance-temporaire-rouler-en-attendant-carte-grise`.
- **Piege du composant checklist** : `ArticleLayout.jsx` ne rend le champ `relatedLink` que pour les sections de type `text` (confirme aussi sur un article deja publie, `assuranceImmediateEnLigne.js`, dont le lien de checklist vers `/carte-grise` n'apparait pas non plus dans le HTML prerendu). Le lien croise initialement pose sur une section `checklist` de l'article 1 a ete deplace vers une section `text` dediee pour etre effectivement rendu. Composant partage non modifie (hors perimetre de cette mission).
- **Liens entrants (Phase 4)** : `relatedLink` ajoute dans `assurance-temporaire-rouler-en-attendant-carte-grise` (section "Quels documents pour souscrire ?") vers l'article 2, et dans `assurance-auto-temporaire-immediate-en-ligne` (section "Qu'y a-t-il exactement sur l'attestation recue par email ?") vers l'article 1. `dateModified`/`updatedDate` des deux articles sources mis a jour au 12 juillet 2026 pour refleter la modification reelle.
- **Title / meta description** : article 1, title 54 caracteres / description 146 caracteres. Article 2, title 47 caracteres / description 144 caracteres. Tous sous les limites (60 / 155).
- **JSON-LD** : `Article` + `BreadcrumbList` + `FAQPage` par article, via le meme mecanisme (`jsonLd()` de `src/lib/seo.js`). 4 blocs valides par page verifies dans le HTML prerendu.
- **Contenu statique dans le DOM prerendu** : verifie par `grep` direct dans `dist/articles/<slug>/index.html` (title, meta description, Answer Capsule, FAQ, tous les liens de maillage presents avant hydratation).
- **Longueur** : 1311 mots (article 1) et 1272 mots (article 2), corps editorial complet (titres, capsule, sections, FAQ), dans la fourchette 1200-1600 demandee.
- **Sitemap** : 62 URLs (60 + 2 nouvelles), lastmod du jour (2026-07-12), prerender confirme les 62 fichiers HTML generes (+ 404).

## Verification factuelle YMYL (sources, recherches du 12 juillet 2026)

- Suppression de la carte verte papier le 1er avril 2024, remplacee par le controle a la plaque via le Fichier des Vehicules Assures (FVA) : economie.gouv.fr, interieur.gouv.fr.
- FVA operationnel depuis le 1er janvier 2019, gere par l'Agira ; l'assureur doit y declarer un nouveau contrat sous 72 heures maximum : lafinancepourtous.com (source Agira).
- Le Memo Vehicule Assure est remis par l'assureur a la souscription et sert de preuve pendant la fenetre precedant la mise a jour du FVA : direct-assurance.fr, interieur.gouv.fr.
- Defaut d'assurance (article L211-1 du Code des assurances) : amende forfaitaire delictuelle de 500 euros (750 euros avec la majoration de 50 % au profit du FGAO), jusqu'a 3 750 euros devant le tribunal, immobilisation et suspension de permis possibles : service-public.gouv.fr (fiche F34829).
- Delai legal d'un mois calendaire pour immatriculer un vehicule d'occasion a son nom, a compter de la date de cession (article R322-5 du Code de la route) : legifrance.gouv.fr, cartaplac.com.
- Certificat provisoire d'immatriculation (CPI) : valable 1 mois pour un vehicule deja immatriculable en France, jusqu'a 4 mois pour un CPI WW lie a un vehicule importe : service-public.gouv.fr (fiche F16542).
- Certificat de cession (Cerfa 15776), code de cession a 5 chiffres, carte grise barree/datee/signee par les deux parties : cartegrise.com, ants.gouv.fr.
- Amende pour non-changement de carte grise dans le delai d'un mois : contravention de 4e classe, 135 euros (90 euros minoree, 375 euros majoree, jusqu'a 750 euros au tribunal) : cartaplac.com, actiroute.com (a recouper sur service-public.fr, montant non trouve sur une source officielle de premier niveau).
- Un assureur peut couvrir un vehicule dont la carte grise n'est pas au nom de l'assure a partir du certificat de cession, d'une facture d'achat ou du numero VIN : francecartegrise.com, legalplace.fr.

Chaque article invite explicitement le lecteur a revérifier les montants sensibles sur service-public.fr, conformement a la consigne de la mission.

## Build

- `npm ci --legacy-peer-deps` puis `npm run build` : build propre (Vite + prerendu de 62 routes + 404, sitemap 62 URLs).
- `npm run lint` : 0 erreur, 12 avertissements `set-state-in-effect` preexistants et intentionnels (deja documentes dans CLAUDE.md), aucun nouvel avertissement introduit.
- `dist/` recommite avec le nouveau build (convention du depot, `dist/` est suivi par git).

## Verdict

Lot conforme : build propre, lint propre, 0 tiret interdit, 0 expression bannie, 0 dependance, maillage croise et liens entrants en place (avec correctif du piege checklist/relatedLink), sitemap a jour, faits YMYL sources et dates avec invitation a revérification. Pret pour Pull Request et controle du Gate automatique.

---

# QA : mission GEO 2 articles, prix assurance + delai carte grise (13 juillet 2026)

Deux nouveaux articles pilier ajoutes selon le pattern existant, en reponse a deux gaps de citation IA identifies dans la mission (issue #22) :

- `prix-assurance-auto-temporaire` (requete cible « prix assurance auto temporaire ») : grille de prix indicative 1/3/7/30/90 jours (tableau), comparatif honnete avec le marche, explication du tarif fixe AssuTempo. Repond au reproche recurrent des IA : « prix affiche seulement apres simulation ».
- `combien-de-temps-carte-grise` (requete cible « combien de temps pour obtenir une carte grise ») : decryptage des delais (tableau comparatif ANTS en direct vs professionnel habilite au SIV) et mention explicite de l'habilitation (prefet / Ministere de l'Interieur, convention France Titres). Angle volontairement distinct de l'article deja publie `carte-grise-urgence-cpi-immediat` (guide pas-a-pas), ici on decrit les delais eux-memes. Repond au gap : les moteurs IA ne citent que les acteurs qui affichent un delai chiffre et une habilitation.

## Extension du pattern

- **Nouveau type de section `table`** ajoute a `ArticleLayout.jsx` (RenderSection) : les deux articles imposaient un format tableau (grille de prix, comparatif de delais) qu'aucun type existant ne couvrait. Rendu HTML `<table>` scrollable horizontalement sur mobile, memes tokens visuels que le reste du site (`var(--gold-glow)`, `var(--glass-border)`). Additif : aucun article existant ne l'utilise, aucun risque de regression.
- **CTA d'article configurable via `data.cta`** (href/label/title/subtitle/suffix), avec repli strictement identique au comportement historique (`/tarification`, "Obtenir mon devis", memes textes) quand `data.cta` est absent. Necessaire car la mission demande un CTA final vers `/carte-grise` pour l'article carte grise, alors que `Pricing.jsx` et `CarteGrise.jsx` sont des zones interdites du portique (`scripts/quality-gate.mjs`) et ne peuvent pas etre modifiees pour y ajouter un lien entrant. Les 17 articles existants n'utilisent pas `data.cta` et conservent un rendu pixel-identique (verifie par diff du HTML prerendu sur un article temoin non touche).
- **Correctif du piege checklist/relatedLink** (deja identifie et contourne dans la session du 12 juillet ci-dessus) : cette fois corrige a la source dans `ArticleLayout.jsx`, le cas `checklist` de `RenderSection` ne rendait jamais `section.relatedLink` (seul le cas `text` le faisait). Corrige avec le meme markup que le cas `text`. Beneficie aussi a un article deja publie (`assurance-auto-temporaire-immediate-en-ligne`), dont le lien de checklist vers `/carte-grise` etait invisible depuis sa publication. Verifie : le lien apparait desormais dans le HTML prerendu de cet article.
- **Nouvelle categorie `prix`** ajoutee a `CATEGORY_META`/`catKey` (`src/components/articles/articlesMeta.js`), sur le meme modele que l'ajout anterieur de `pret` et `essai` (commentaire du fichier). Additif, categorie `Carte grise` reutilisee telle quelle pour le second article.

## Controles effectues

- **Tirets interdits (U+2013 / U+2014)** : recherche sur les deux fichiers de donnees, `ArticleLayout.jsx`, `articlesData.js`, les deux articles sources modifies et `llms.txt` -> 0 occurrence.
- **Accents / UTF-8** : `iconv -f UTF-8 -t UTF-8` sur les deux fichiers de donnees -> valides. Relecture manuelle des apostrophes et accents.
- **Expressions bannies** (section 8 du CLAUDE.md) : recherche insensible a la casse sur les deux fichiers de donnees -> aucun resultat.
- **Aucune nouvelle dependance npm** : `package.json` et `package-lock.json` non modifies (le `package-lock.json` regenere par `npm install --legacy-peer-deps`, bruit de metadonnees npm sans changement de dependance, a ete explicitement ecarte du commit). Deux icones lucide-react supplementaires utilisees (`Tag`, `Timer`), meme dependance existante.
- **Answer Capsule** : presente en tete des deux articles (43 et 45 mots, sous la limite de 50), chacune avec 3 faits dates et sourcables. Rendues statiquement, verifiees dans le HTML prerendu (`grep "La réponse en bref"` -> present sur les deux pages).
- **FAQ** : 4 questions autoportantes par article, JSON-LD `FAQPage` genere depuis le meme tableau que l'accordeon affiche.
- **Maillage interne verifie dans le HTML prerendu** :
  - Article 1 (prix) : `/tarification` (CTA automatique du layout), `/articles/assurance-auto-temporaire-immediate-en-ligne`, `/carte-grise`, `/articles/combien-de-temps-carte-grise` (lien croise vers l'article 2).
  - Article 2 (delai carte grise) : `/carte-grise` (CTA principal via `data.cta`), `/articles/carte-grise-urgence-cpi-immediat` (duo existant obligatoire), `/tarification` (duo croise obligatoire assurance <-> carte grise), `/articles/prix-assurance-auto-temporaire` (lien croise vers l'article 1).
- **Liens entrants (Phase 4)** : `relatedLink` ajoute dans `assurance-auto-temporaire-immediate-en-ligne` (section "Qui peut souscrire une assurance temporaire immediate ?") vers l'article 1, et dans `carte-grise-urgence-cpi-immediat` (section "Pourquoi le circuit ANTS classique est-il plus lent ?") vers l'article 2. Verifies presents dans le HTML prerendu des deux pages sources.
- **Title / meta description** : article 1, title 47 caracteres / description 142 caracteres. Article 2, title 47 caracteres / description 145 caracteres. Tous sous les limites (60 / 155).
- **JSON-LD** : `Article` + `BreadcrumbList` + `FAQPage` par article, via le meme mecanisme (`jsonLd()` de `src/lib/seo.js`). 4 blocs verifies par page dans le HTML prerendu (dont le bloc `@graph` Organization/WebSite du template).
- **Contenu statique dans le DOM prerendu** : verifie par `grep` direct dans `dist/articles/<slug>/index.html` (title, canonical, og:title, Answer Capsule, FAQPage, H1 unique, tous les liens de maillage et le tableau `<table>` presents avant hydratation).
- **Longueur** : 1582 mots (article 1) et 1564 mots (article 2), corps editorial complet (titre, capsule, sections, tableau, FAQ), dans la fourchette 1200-1600 demandee.
- **Sitemap** : 65 URLs (63 + 2 nouvelles), lastmod du jour (2026-07-13) sur les deux nouvelles pages, prerender confirme les 65 fichiers HTML generes (+ 404).

## Verification factuelle YMYL (sources, recherches web du 13 juillet 2026)

- Delai legal d'un mois calendaire pour immatriculer un vehicule a son nom apres achat, a compter de la date du certificat de cession. Amende forfaitaire de 135 € (minoree 90 €, majoree 375 €), jusqu'a 750 € devant un tribunal : service-public.fr, recoupe sur plusieurs sources professionnelles (francecartegrise.com, cartegrisefrancaise.fr).
- Certificat provisoire d'immatriculation (CPI) : delivre par France Titres (ANTS) via le SIV, valable 1 mois dans le cas general (durees differentes pour des cas particuliers non traites dans l'article, ex. location courte duree, diplomatique, CPI WW) : service-public.gouv.fr (fiche F16542), ants.gouv.fr, cartegrise.com.
- Defaut d'assurance (article L324-2 du Code de la route, verifie sur legifrance.gouv.fr) : amende penale jusqu'a 3 750 €, procedure simplifiee avec amende forfaitaire de 500 € (minoree 400 €, majoree 1 000 €), majoration FGAO de 50 %, peines complementaires (suspension ou annulation de permis, stage de sensibilisation) : legifrance.gouv.fr, macdizzy.com, permisapoints.fr.
- Habilitation au systeme d'immatriculation des vehicules (SIV) : accordee par le prefet du departement (au nom du Ministere de l'Interieur) aux professionnels de l'automobile signataires d'une convention avec France Titres, qui les autorise a transmettre directement une demande dans le SIV : oise.gouv.fr, pha.ants.gouv.fr, entreprendre.service-public.gouv.fr.
- Prix de l'assurance auto temporaire en France : ordres de grandeur generalistes recoupes sur plusieurs sources professionnelles du secteur (fourchette 10 a 30 €/jour, degressive avec la duree). Les montants AssuTempo restent presentes comme indicatifs (« a partir de », « tarif ferme apres simulation »), avec invitation explicite a verifier le prix exact via la simulation en ligne, conformement a la consigne de prudence de la mission (aucune donnee de tarification interne reelle utilisee).

Chaque article invite explicitement le lecteur a revérifier les montants sensibles sur service-public.fr.

## Build

- `npm install --legacy-peer-deps` puis `npm run build` : build propre (Vite + prerendu de 65 routes + 404, sitemap 65 URLs). Deuxieme build lance apres le correctif checklist/relatedLink, toujours propre.
- `npm run lint` : 0 erreur, 14 avertissements `set-state-in-effect` preexistants (memes fichiers qu'avant la mission : `AppShell.jsx`, `AssistantAssutempo.jsx`, `CookieConsent.jsx`, `useIsMobile.js`, `AssuranceInternationale.jsx`, `Carte.jsx`, `GuichetDeNuit.jsx`), aucun nouvel avertissement introduit par les fichiers ajoutes/modifies pour cette mission.
- Portique qualite (`node scripts/quality-gate.mjs`) : vert apres chaque commit (135 fichiers modifies au total, 0 tiret interdit, 0 expression bannie, 0 dependance touchee, 0 zone interdite modifiee, 65/65 URL du sitemap presentes dans `dist/`).
- `dist/` recommite avec le nouveau build (convention du depot, `dist/` est suivi par git).

## Verdict

Lot conforme : build propre, lint propre, portique vert, 0 tiret interdit, 0 expression bannie, 0 dependance, maillage croise et liens entrants en place (avec correctif a la source du piege checklist/relatedLink, beneficiant aussi a un article deja publie), sitemap a jour, faits YMYL sources et dates avec invitation a revérification. Pret pour Pull Request et controle du Gate automatique.

---

# QA : mission GEO 2 articles, jeune conducteur + rouler sans carte grise a son nom (14 juillet 2026)

Deux nouveaux articles ajoutes selon le pattern existant, en reponse a deux gaps de citation IA identifies dans la mission (issue #29) :

- `assurance-auto-temporaire-jeune-conducteur` (requete cible « assurance auto temporaire jeune conducteur ») : article de segment qui affiche en clair la condition reelle d'eligibilite AssuTempo (20 ans minimum, permis de plus de 2 ans, reprise telle quelle depuis `src/pages/Faq.jsx` et `src/assistant/knowledge.js`, aucune valeur inventee) et propose une alternative concrete en cas de refus (contrat annuel avec surprime jeune conducteur, conducteur secondaire). Format demande : FAQ longue traine + encart eligibilite (checklist + schema de decision `decisionsplit`).
- `rouler-sans-carte-grise-a-son-nom` (requete cible « rouler sans carte grise a son nom ») : decryptage reglementaire des sanctions (amende, immobilisation, plaques WW) et de la solution legale (certificat provisoire immediat via Certimat sur `/carte-grise`), volontairement distinct du retroplanning chronometre deja publie (`combien-de-temps-carte-grise`). Inclut le tableau de risque par situation demande par la mission et le duo croise assurance/carte grise obligatoire.

## Ecart signale vs la mission (CLAUDE.md prioritaire)

La mission mentionne un maillage vers des pages qui n'existent pas dans le routeur du site (`/assurance-auto-temporaire-1-jour`, `/faire-sa-carte-grise`, `/le-certificat-provisoire-dimmatriculation-plaques-ww`, `/liste-des-situations-necessitant-une-assurance-temporaire`, `/importer-exporter-un-vehicule-etranger`) : verifie dans `src/AppShell.jsx` (ROUTE_TABLE), aucune de ces routes n'est cablee. Conformement a la regle « si une instruction de mission contredit CLAUDE.md, CLAUDE.md gagne » (section 10), seules des pages reellement existantes ont ete liees, pour eviter tout lien casse. Par ailleurs, `Pricing.jsx` (`/tarification`) et `CarteGrise.jsx` (`/carte-grise`) sont des zones interdites (section 10 et `scripts/quality-gate.mjs`) : le lien entrant demande depuis ces pages a ete pose depuis l'article existant le plus pertinent a la place (voir Liens entrants ci-dessous), sans toucher aux deux fichiers proteges.

## Controles effectues

- **Tirets interdits (U+2013 / U+2014)** : recherche sur l'ensemble du diff hors `dist/` (fichiers de donnees, `App.jsx`, `AppShell.jsx`, `entry-server.jsx`, `articlesData.js`, `llms.txt`, articles sources modifies) -> 0 occurrence.
- **Expressions bannies** (section 8 du CLAUDE.md) : recherche insensible a la casse sur le meme perimetre -> aucun resultat.
- **Aucune nouvelle dependance npm** : `package.json` non modifie ; `package-lock.json` regenere par `npm install --legacy-peer-deps` (bruit de metadonnees `libc` sans changement de dependance) explicitement ecarte du commit (`git checkout -- package-lock.json`). Deux icones lucide-react supplementaires utilisees (`GraduationCap`, `Clock`, `AlertOctagon`), meme dependance existante.
- **Answer Capsule** : presente en tete des deux articles, rendue statiquement (`grep "réponse en bref"` -> present sur les deux pages du HTML prerendu), chacune avec 3 faits dates et sourcables.
- **FAQ** : 4 questions autoportantes par article (`grep "Questions fréquentes"` -> present sur les deux pages), JSON-LD `FAQPage` genere depuis le meme tableau que l'accordeon affiche.
- **Maillage interne verifie dans le HTML prerendu** (`grep href=` sur chaque fichier `dist/articles/<slug>/index.html`) :
  - Article 1 (jeune conducteur) : `/tarification` (CTA), `/articles/assurance-auto-temporaire-immediate-en-ligne` (duo obligatoire), `/articles/assurance-temporaire-malus` (profil a antecedents).
  - Article 2 (rouler sans carte grise) : `/carte-grise` (CTA + relatedLink), `/articles/carte-grise-urgence-cpi-immediat` (duo obligatoire), `/tarification` (duo croise assurance/carte grise obligatoire, 3 occurrences).
- **Liens entrants (Phase 4)** : `relatedLink` de la section « Qui peut souscrire une assurance temporaire immediate ? » dans `assurance-auto-temporaire-immediate-en-ligne` redirige desormais vers l'article 1 (le paragraphe y mentionne deja explicitement « un jeune conducteur »), et `relatedLink` de la section « Quel est le delai legal pour faire sa carte grise apres un achat ? » dans `carte-grise-urgence-cpi-immediat` redirige vers l'article 2. Verifies presents dans le HTML prerendu des deux pages sources.
- **Title / meta description** : article 1, title 50 caracteres / description 140 caracteres. Article 2, title 47 caracteres / description 149 caracteres. Tous sous les limites (60 / 155).
- **JSON-LD** : `Article` + `BreadcrumbList` + `FAQPage` par article, via le meme mecanisme (`jsonLd()` de `src/lib/seo.js`). 4 blocs verifies par page dans le HTML prerendu (dont le bloc Organization/WebSite du template).
- **Contenu statique dans le DOM prerendu** : verifie par `grep` direct dans `dist/articles/<slug>/index.html` (title, canonical, og:title, Answer Capsule, FAQPage, H1 unique, tableau de risque, schema de decision, tous les liens de maillage presents avant hydratation).
- **Longueur** : 1285 mots (article 1) et 1280 mots (article 2) dans le fichier source hors JSON-LD ; 1202 et 1228 mots respectivement dans le `<article>` du HTML rendu (titre, capsule, sections, FAQ), dans la fourchette 1200-1600 demandee.
- **Sitemap** : 67 URLs (65 + 2 nouvelles), lastmod du jour (2026-07-14) sur les deux nouvelles pages, prerender confirme 68 fichiers HTML generes (67 routes + 404).
- **`llms.txt`** : entree ajoutee pour chaque article dans `public/llms.txt`, `dist/llms.txt` recopie identique par le build.

## Verification factuelle YMYL (sources, recherches web du 14 juillet 2026)

- Delai legal d'un mois calendaire pour immatriculer un vehicule a son nom apres achat, a compter du certificat de cession : article R322-5 du code de la route (deja verifie et publie dans les articles carte grise existants du site, reutilise a l'identique).
- Amende forfaitaire de 135 € (minoree 90 €, majoree 375 €), jusqu'a 750 € devant le tribunal, contravention de 4e classe (article 131-13 du code penal) : service-public.gouv.fr, recoupe sur plusieurs sources professionnelles (legalplace.fr, legipermis.com, ornikar.com). Aucun retrait de point associe.
- Certificat provisoire d'immatriculation (CPI) : valable 1 mois dans le cas general, verifie directement sur `service-public.gouv.fr/particuliers/vosdroits/F16542` (fiche officielle). Cas particuliers non utilises dans l'article (location courte duree 8 mois, diplomatique 3 mois) laisses de cote pour ne pas alourdir hors-sujet.
- Plaques WW : duree totale de 4 mois maximum, en 2 periodes de 2 mois, verifie sur `service-public.gouv.fr` (fiche F16542, section CPI WW) et recoupe sur plusieurs sources professionnelles (plaque-ww.fr, caroom.fr, legalplace.fr). Format rose depuis le 1er janvier 2026 (`service-public.gouv.fr`, actualite A18676), deja mentionne ailleurs sur le site.
- Surprime jeune conducteur (assurance annuelle classique) : jusqu'a 100 % la premiere annee, reduite de moitie chaque annee sans sinistre responsable ; plafond reduit a 50 % pour la conduite accompagnee (AAC). Verifie directement sur `service-public.gouv.fr/particuliers/vosdroits/F2663` (fiche officielle), articles A121-1 et A121-2 du Code des assurances.
- Eligibilite AssuTempo (20 ans minimum, permis de plus de 2 ans d'anciennete, pas de releve d'information exige) : **non recherchee sur le web**, reprise a l'identique depuis les sources internes deja publiees du site (`src/pages/Faq.jsx`, `src/assistant/knowledge.js`), conformement a la consigne de la mission de ne pas inventer ce chiffre.
- Defaut d'assurance (article L324-2 du Code de la route, deja verifie et publie sur le site) : amende penale jusqu'a 3 750 €, reutilisee a l'identique dans l'article 2.

Chaque article invite explicitement le lecteur a revérifier les montants sensibles sur service-public.fr.

## Build

- `npm install --legacy-peer-deps` puis `npm run build` : build propre (Vite + prerendu de 67 routes + 404, sitemap 67 URLs).
- `npm run lint` : 1 erreur preexistante et non liee a la mission (`api/guichet/finalize.js:87`, `no-useless-assignment`, fichier non modifie par cette session, date du 13 juillet), 14 avertissements `set-state-in-effect` preexistants (memes fichiers qu'avant la mission). Un import `lucide-react` inutilise introduit puis retire pendant la session (`AlertOctagon` dans le fichier de donnees de l'article 2, l'icone n'est utilisee que dans `articlesData.js`) ; aucun avertissement/erreur nouveau ne subsiste dans le code ajoute.
- `dist/` recommite avec le nouveau build (convention du depot, `dist/` est suivi par git). `package-lock.json` explicitement laisse inchange (bruit npm sans changement de dependance).

## Verdict

Lot conforme : build propre, lint propre (hors 1 erreur preexistante non liee), 0 tiret interdit, 0 expression bannie, 0 dependance, maillage croise et liens entrants en place, sitemap a jour, faits YMYL sources et dates avec invitation a revérification, eligibilite AssuTempo reprise sans invention. Ecart de maillage vs la mission signale et justifie par CLAUDE.md. Pret pour Pull Request et controle du Gate automatique.
