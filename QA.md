# QA : page pilier « Roulez légal après achat » (14 juillet 2026)

## Phase 0 : relevé du pattern existant

- **Routes** : table unique `ROUTE_TABLE` dans `src/AppShell.jsx`, partagée entre le client (`src/App.jsx`, imports `lazy()`) et le SSR (`src/entry-server.jsx`, imports eager). `scripts/prerender.mjs` porte sa propre liste `ROUTES` (source du sitemap) et sa carte `ROUTE_MODULES` (route -> fichier source, sert au calcul du `lastmod` git et au `modulepreload`).
- **Pages standalone de référence** (`/tarification` = `src/pages/Pricing.jsx`, `/carte-grise` = `src/pages/CarteGrise.jsx`) : `Helmet` (react-helmet-async) pour title/meta/OG, JSON-LD injecté via `<script type="application/ld+json">{jsonLd(schema)}</script>` (helper d'échappement dans `src/lib/seo.js`), motion via `m.*` de framer-motion (LazyMotion déjà actif au niveau racine) + variants `fadeUp`/`stagger` de `src/animations.js` + hook `useScrollReveal`. CTA en `Link` React Router avec les classes `.btn-gold` / `.btn-glass` du design system.
- **Pages articles** (`src/components/ArticleLayout.jsx` + data dans `src/data/articles/*.js`) : montrent le pattern `AnswerCapsule` (réponse en bref) et `AccordionItem` pour la FAQ, avec un tableau unique servant à la fois à l'accordéon affiché et au JSON-LD FAQPage (jamais deux sources).
- **AnswerCapsule** : `src/components/articles/AnswerCapsule.jsx`, déjà utilisé sur `/carte-grise` (hors zone `/articles`) : composant réutilisé tel quel, aucune nouvelle dépendance ni nouveau composant de tête.
- **Slugs des articles « duo » (assurance + carte grise)** repérés pour le maillage :
  - `/articles/assurer-vehicule-achete-chez-particulier`
  - `/articles/assurance-temporaire-rouler-en-attendant-carte-grise`
  - `/articles/rouler-sans-carte-grise-a-son-nom`
  - `/articles/combien-de-temps-carte-grise`
  - `/articles/carte-grise-urgence-cpi-immediat`
- **Organization/WebSite JSON-LD** déjà global dans `index.html` (graphe `@id: https://assutempo.fr/#organization`), présent sur toutes les pages via le template : non dupliqué sur la nouvelle page.
- **Zone interdite identifiée** : `src/pages/CarteGrise.jsx` et `src/pages/Pricing.jsx` figurent dans `FORBIDDEN_PATHS` de `scripts/quality-gate.mjs` (portique Gate). Aucun de ces deux fichiers n'a été modifié ; seuls des `Link` vers `/carte-grise` et `/tarification` ont été ajoutés depuis la nouvelle page.

## Livrables et chemins

| Livrable | Chemin |
|---|---|
| Page pilier | `src/pages/RoulezLegalApresAchat.jsx` |
| Route ajoutée (table partagée client/SSR) | `src/AppShell.jsx` (`ROUTE_TABLE`) |
| Import lazy client | `src/App.jsx` (`IMPORTERS.RoulezLegalApresAchat`) |
| Import eager SSR | `src/entry-server.jsx` |
| Prérendu + sitemap | `scripts/prerender.mjs` (`ROUTES`, `ROUTE_MODULES`) |
| Entrée GEO | `public/llms.txt` |

## Slug créé

`/roulez-legal-apres-achat`

## JSON-LD ajoutés (sur la nouvelle page uniquement)

- `BreadcrumbList` : Accueil -> Roulez légal après achat (2 niveaux, cohérent avec le fil d'Ariane affiché).
- `FAQPage` : 6 questions/réponses, générées depuis le MÊME tableau `FAQ` que l'accordéon affiché (aucun contenu invisible). Vérifié dans `dist/roulez-legal-apres-achat/index.html` après build : 6 questions présentes, texte identique au DOM visible.
- Le JSON-LD `Organization`/`InsuranceAgency`/`WebSite` global (template `index.html`) reste inchangé et n'est pas dupliqué.

## Chiffres légaux utilisés (et sources datées)

Chiffres transmis dans la mission (vérifiés le 14/07/2026, service-public.gouv.fr fiches F1050 et F16542), identiques à ceux déjà vérifiés et utilisés dans le reste du site le 13-14 juillet 2026 (`src/pages/CarteGrise.jsx`, `src/data/articles/rouleSansCarteGriseNom.js`, `src/data/articles/delaiCarteGrise.js`) :

- Délai d'immatriculation : **1 mois** à compter de la date de cession (article R322-5 du code de la route).
- Sanction en cas de retard : contravention de 4e classe, amende forfaitaire **135 €** (minorée 90 €, majorée 375 €), jusqu'à **750 €** devant le tribunal (article 131-13 du code pénal), immobilisation possible.
- CPI d'un véhicule d'occasion : circulation **1 mois**, en France uniquement.
- Plaques et CPI WW (import ou véhicule neuf sans titre définitif) : validité **4 mois** au total (2 périodes de 2 mois), à ne pas confondre avec le CPI d'occasion d'un mois.

Aucun chiffre n'a été réinventé ni recoupé différemment : les valeurs de la mission correspondent à celles déjà en production, aucune nouvelle recherche web n'était nécessaire.

## Checklist des interdictions (toutes respectées)

- [x] Header et footer globaux non modifiés (`src/components/Navbar.jsx`, `src/components/Footer.jsx` non touchés, `Footer` seulement importé et rendu comme sur toutes les pages).
- [x] Tunnel JL Assure non touché (`src/pages/Pricing.jsx` non modifié).
- [x] Aucune iframe Certimat sur la nouvelle page (`src/pages/CarteGrise.jsx` non modifié) ; les CTA pointent vers `/carte-grise` et `/tarification` via `Link`, rien d'autre.
- [x] Aucun formulaire B2B ou international ajouté ou modifié.
- [x] Aucune nouvelle dépendance npm : `package.json` non modifié, `package-lock.json` non commité (régénéré localement par `npm install --legacy-peer-deps` pour préparer l'environnement de build, diff annulé avant commit).

## Autres vérifications

- Aucun tiret cadratin (U+2014) ni demi-cadratin (U+2013) dans les fichiers modifiés (contrôle programmatique).
- Aucune expression bannie détectée (contrôle programmatique sur les 6 tournures interdites).
- `npm run build` propre : 69 routes + `dist/404.html` prérendues, `/roulez-legal-apres-achat` inclus, sitemap regénéré (68 URLs).
- `npm run lint` : aucune erreur ni avertissement nouveau sur les fichiers modifiés (`src/pages/RoulezLegalApresAchat.jsx` 0 problème ; l'unique erreur ESLint du dépôt, dans `api/guichet/finalize.js`, est préexistante sur `main`, hors périmètre de cette mission).
- Title `Rouler légal après achat voiture | AssuTempo` (44 caractères) et meta description (135 caractères) sous les seuils demandés (60 / 155).
- Date de mise à jour visible dans le DOM (bloc AnswerCapsule + ligne date sous le H1).
