# QA : article "Dossier carte grise bloqué sur l'ANTS" (30 juillet 2026)

Mission GEO du 30 juillet 2026 (issue #38), branche `claude/issue-38-20260730-1347`. Un seul article, pilier carte grise.

## Slug créé

- `/articles/carte-grise-ants-bloquee` (requête cible : « dossier carte grise ANTS bloqué » ; longue traîne : « ANTS ne répond pas carte grise que faire », « immatriculation bloquée combien de temps », « carte grise refusée par l'ANTS », « professionnel habilité carte grise ANTS », « dossier carte grise en attente de validation trop longtemps »)

## Phase 0 : pattern existant

Reproduit à l'identique, aucun nouveau système :
- Données : `src/data/articles/carteGriseAntsBloquee.js` (sections `alert`, `table`, `text`, `timeline`, `decisionsplit`, `checklist`, `faqItems`, `answerCapsule`, `jsonLd`), sur le modèle de `src/data/articles/delaiCarteGrise.js` et `changementTitulaireCarteGrise.js`.
- Page : `src/pages/articles/CarteGriseAntsBloquee.jsx`, wrapper `ArticleLayout` identique aux 24 autres pages d'articles.
- Route ajoutée dans les 4 listes partagées client/SSR/prerender (aucune divergence, build vert) : `ROUTE_TABLE` de `src/AppShell.jsx`, `IMPORTERS` de `src/App.jsx` (lazy client), imports eager + `PAGES` de `src/entry-server.jsx`, `ROUTES` + `ARTICLE_DATA_SOURCES` + `ROUTE_MODULES` de `scripts/prerender.mjs`.
- Entrée ajoutée dans `src/data/articlesData.js` (page `/articles`, Centre de réponses), icône `Lock` (lucide-react), accent or `#C9A84C`, catégorie `Carte grise`.
- Entrée ajoutée dans `public/llms.txt` en fin de section articles.
- JSON-LD Article + BreadcrumbList + FAQPage injectés via le mécanisme existant (`<Helmet>` + helper `jsonLd()` de `src/lib/seo.js`, appelé depuis `ArticleLayout.jsx`), aucune nouvelle logique.
- Sitemap : `lastmod` généré automatiquement par `scripts/prerender.mjs` à partir de la date git réelle des fichiers sources de la route (aucune date en dur), daté du jour du build.

## Phase 1 : vérification factuelle YMYL

Chiffres et procédures vérifiés par recherche web datée du 30 juillet 2026, sources officielles :

| Fait | Valeur retenue | Source |
|---|---|---|
| Délai légal pour immatriculer après achat | 1 mois calendaire, à compter de la date du certificat de cession (article R322-5 du code de la route) | Cohérent avec le contenu déjà publié et vérifié sur le site (articles `combien-de-temps-carte-grise`, `changement-titulaire-carte-grise`) |
| Amende pour défaut de carte grise à jour | 135 € forfaitaire (90 € minorée, 375 € majorée), jusqu'à 750 € devant le tribunal, plafond des contraventions de 4e classe (article 131-13 du code pénal) | Recherche web du 30/07/2026, concordante sur plusieurs sources ; à vérifier sur service-public.gouv.fr, formulation de prudence ajoutée dans l'article |
| Recours en cas de refus de la demande | Recours gracieux via le téléservice ANTS (FranceConnect / France Identité), puis appel auprès de la Délégation à la sécurité routière du ministère de l'Intérieur si le recours n'aboutit pas | service-public.gouv.fr, fiche F31529 (récupérée par WebFetch le 30/07/2026) |
| Recours en cas d'absence de réponse | Saisine du médiateur des cartes grises après une réclamation écrite restée sans réponse | service-public.gouv.fr (confirmé par recherche web croisée) |
| Accès direct au SIV des professionnels habilités | Les professionnels de l'automobile habilités par le Ministère de l'Intérieur ont un accès direct au système d'immatriculation des véhicules (SIV), y compris lors d'un incident sur le portail ANTS grand public | Cohérent avec le cadre déjà établi et validé le 13 juillet 2026 (section 5 de CLAUDE.md : Certimat est un intermédiaire technologique, jamais habilité lui-même) |
| Aucun numéro d'habilitation au nom de Certimat | Repris tel quel, aucune nouvelle affirmation sur Certimat | Règle permanente CLAUDE.md, section 8 |

Aucun chiffre non vérifié n'a été utilisé. Les délais de traitement variables (pas de moyenne nationale garantie) sont explicitement présentés comme indicatifs, avec invitation à vérifier sur service-public.gouv.fr à deux reprises dans l'article (note de tableau + section recours).

## Contrôles automatisés

- **Tirets interdits (U+2014, U+2013)** : recherche `[–—]` sur `src/data/articles/carteGriseAntsBloquee.js` → 0 occurrence.
- **Expressions bannies** ("dans un monde où", "il est important de noter", "de nos jours", "n'hésitez pas", "en résumé", "force est de constater") : recherche insensible à la casse sur le fichier → 0 occurrence.
- **Accents / encodage** : fichier UTF-8, relu visuellement, aucun caractère mal encodé.
- **Aucune dépendance npm ajoutée** : `package.json` non modifié (les icônes `Lock`, `Clock`, `UserCheck` viennent de `lucide-react`, déjà une dépendance existante et déjà utilisées ailleurs dans le repo).
- **Contenu statique dans le DOM** : vérifié sur `dist/articles/carte-grise-ants-bloquee/index.html` généré par le prérendu, le HTML statique contient bien le H1, l'Answer Capsule, le tableau, la FAQ et les 3 blocs JSON-LD (`Article`, `BreadcrumbList`, `FAQPage`) sans exécution JS, comme les 24 autres articles.
- **Title / meta description** : title 52 caractères (< 60), meta description 153 caractères (< 155), mesurés par script Node.

## Answer Capsule, FAQ, maillage

- Answer Capsule : réponse directe (moins de 50 mots) + 4 faits datés et sourcés, composant `AnswerCapsule.jsx` réutilisé sans modification.
- FAQ : 6 questions autoportantes, chacune vérifiée pour avoir du sens hors contexte (aucune ne dépend d'un renvoi implicite au corps de l'article).
- Maillage sortant (4 liens, ancres naturelles) :
  - `/carte-grise` (page pilier service, CTA milieu d'article + CTA final + barre CTA mobile sticky)
  - `/articles/combien-de-temps-carte-grise` (délais réels du CPI et de la carte grise définitive)
  - `/articles/changement-titulaire-carte-grise` (guide étape par étape, cause fréquente de blocage)
  - `/articles/assurance-temporaire-rouler-en-attendant-carte-grise` (**duo croisé assurance/carte grise obligatoire** : rouler en attendant que le dossier se débloque)
- Maillage entrant : lien ajouté depuis `src/data/articles/delaiCarteGrise.js` (section "Pourquoi la démarche directe auprès de l'ANTS prend-elle souvent plus de temps ?") vers le nouvel article.
- Les pages `/faire-sa-carte-grise`, `/assurance-auto-temporaire-1-jour`, `/le-certificat-provisoire-dimmatriculation-plaques-ww`, `/liste-des-situations-necessitant-une-assurance-temporaire` et `/importer-exporter-un-vehicule-etranger` citées dans le brief de mission n'existent pas dans le code (vérifié par recherche exhaustive) : elles n'ont pas été utilisées, conformément à la consigne de ne référencer que des slugs réels.

## Build

- `npm run build` : vert, 0 erreur. 73 routes prérendues (72 dans le sitemap, `/urgence` exclu par design). `dist/articles/carte-grise-ants-bloquee/index.html` généré, JSON-LD et modulepreload de page présents.
- `npm run lint` : 1 erreur préexistante sur `main`, dans `api/guichet/finalize.js` (`no-useless-assignment`), sans rapport avec cette mission et hors des fichiers modifiés par cette PR. 16 warnings `react-hooks/set-state-in-effect` déjà connus et documentés comme intentionnels (session du 5-6 juillet 2026).
- `package-lock.json` : dérive de métadonnées npm (champ `libc`) générée par `npm install` en environnement de build, annulée (`git checkout`) pour ne conserver aucune modification hors du périmètre de la mission.

## Zones interdites : non touchées

Header, footer, `src/pages/Pricing.jsx`, `src/pages/CarteGrise.jsx` (iframe Certimat), `src/pages/About.jsx`, `src/pages/AssuranceInternationale.jsx`, `.github/`, `scripts/quality-gate.mjs`, `scripts/indexnow.mjs`, `vercel.json` : aucun de ces fichiers n'apparaît dans le diff de cette branche.

## Livrables et chemins

| Livrable | Chemin |
|---|---|
| Données article | `src/data/articles/carteGriseAntsBloquee.js` |
| Page | `src/pages/articles/CarteGriseAntsBloquee.jsx` |
| Route (table partagée client/SSR) | `src/AppShell.jsx` (`ROUTE_TABLE`) |
| Import lazy client | `src/App.jsx` (`IMPORTERS`) |
| Import eager SSR | `src/entry-server.jsx` |
| Prérendu + sitemap | `scripts/prerender.mjs` (`ROUTES`, `ARTICLE_DATA_SOURCES`, `ROUTE_MODULES`) |
| Centre de réponses (`/articles`) | `src/data/articlesData.js` |
| Entrée GEO | `public/llms.txt` |
| Lien croisé entrant | `src/data/articles/delaiCarteGrise.js` |
