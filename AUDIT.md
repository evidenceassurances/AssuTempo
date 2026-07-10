# AUDIT GEO/SEO AssuTempo (10 juillet 2026)

Audit technique complet avant pose des fondations GEO (Generative Engine Optimization).
Methode : build reel (`npm run build`), scan programmatique des 57 HTML de `dist/`, curl sur le site en production, verification des identifiants legaux via l'API officielle recherche-entreprises.api.gouv.fr.

---

## 1. Inventaire des routes et couverture prerender

**57 fichiers HTML prerendus** : 56 routes publiques + `dist/404.html` (hors sitemap, statut 404 reel via Vercel).
Router (`ROUTE_TABLE` dans AppShell.jsx) et prerender (`ROUTES` dans scripts/prerender.mjs) sont alignes a 100 % : aucune route du router absente du build, aucun HTML orphelin.

Resultats du scan des 57 pages :

| Critere | Resultat |
|---|---|
| Prerendu | 57/57 (100 %) |
| Title unique | 57/57, aucun doublon |
| Meta description unique | 57/57, aucun doublon |
| Canonical | 56/56 routes publiques (absent de 404.html : normal, page noindex) |
| H1 unique | Exactement 1 H1 par page, 57/57 |
| JSON-LD present | 57/57 (Organization + WebSite minimum, via le template) |
| FAQ visible dans le HTML brut | Home (7 Q/A), /faq (14 Q/A), /tarification (FAQ), /carte-grise (FAQ), 12 articles (FAQ chacun) |

Detail JSON-LD par type de page :

| Page | Types JSON-LD presents | Manque |
|---|---|---|
| Toutes (template) | Organization, WebSite | InsuranceAgency, identifier ORIAS, sameAs, logo |
| / (Home) | Organization, WebSite seulement | **FAQPage (7 Q/A visibles non balisees)** |
| /faq | Organization, WebSite seulement | **FAQPage (14 Q/A visibles non balisees)** |
| /tarification | + BreadcrumbList, Service, FAQPage | provider non lie a #organization |
| /carte-grise | + BreadcrumbList, Service, FAQPage | provider non lie a #organization |
| 12 articles | + Article, BreadcrumbList, FAQPage (+HowTo sur 7) | **datePublished absent (12/12)**, **logo publisher casse** |
| /carte + 34 pays | + WebPage (ItemList sur /carte) | rien de requis |
| /articles | + FAQPage, BreadcrumbList, ItemList | rien |

### Constats classes

- **CRITIQUE (GEO)** : `/faq` (la page la plus citable du site, 14 Q/A) et la Home (7 Q/A) n'ont **aucun schema FAQPage**. Les moteurs generatifs s'appuient massivement sur ce balisage pour extraire des reponses.
- **CRITIQUE** : les 12 articles referencent `https://assutempo.fr/logo.png` dans `publisher.logo`, **fichier inexistant** (404). Reference cassee dans chaque schema Article.
- **IMPORTANT** : `datePublished` absent des 12 schemas Article (seul `dateModified` est present). La fraicheur datee est un signal GEO majeur.
- **IMPORTANT** : l'Organization du template n'est pas typee InsuranceAgency, sans identifiant ORIAS, sans sameAs, sans logo : entite faiblement etablie pour les knowledge graphs.
- **MINEUR** : `provider` des deux Service est une Organization inline au lieu d'une reference `@id` vers l'entite du template.

## 2. Sitemap

- 56 URLs, generees depuis ROUTES (source unique) : **complet** (tous les articles, toutes les pages pays).
- **IMPORTANT** : `<lastmod>` fige a `2026-06-23` pour les 56 URLs (constante `SITEMAP_LASTMOD`). Un lastmod identique partout n'apporte aucun signal de fraicheur et finit ignore par les crawlers.

## 3. robots.txt

Contenu actuel (identique local et production) :
```
User-agent: *
Allow: /
Sitemap: https://assutempo.fr/sitemap.xml
```
- **IMPORTANT (GEO)** : aucune section explicite pour les crawlers IA (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Amazonbot, Applebot-Extended). `Allow: /` implicite les couvre, mais les sections explicites sont le signal d'accueil recommande et evitent toute ambiguite d'interpretation.
- Point positif : `public/llms.txt` existe deja (4,2 KB).

## 4. IndexNow

- **IMPORTANT** : totalement absent. Pas de cle dans `public/`, pas de script de ping, pas de workflow. L'index Bing (celui de ChatGPT) decouvre le site au rythme du crawl classique : des semaines au lieu de minutes.

## 5. Performance (mesuree sur le build du 10 juillet)

- **38 chunks JS, 335,8 KB gzip au total** ; code splitting par route deja en place (React.lazy + prefetch idle).
- Top chunks : react-vendor 69,3 KB / Carte 64,9 KB (carte interactive + contenu 34 pays, charge uniquement sur /carte) / framer 50,6 KB / index (main) 19,3 KB / assistant 14,7 KB (differe apres load+idle) / HomeSections 11,0 KB (differe).
- JS critique Home : main 19,3 KB (reduit de 70 % lors de la session du 3 juillet). **Pas de monolithe.**
- Fonts : Google Fonts en chargement non bloquant (media="print" swap), preconnect en place, graisses limitees 400-800. Pas de preload de fichier woff2 (necessiterait l'auto-hebergement : hors perimetre sans nouvelle dependance).
- Hero : aucune image (SVG + degrades CSS), CSS critique inline dans chaque HTML, modulepreload du chunk de page injecte au prerender.
- **Verdict : rien a corriger.** Les quick wins du prompt (splitting, preload fonts, lazy images) sont deja en place ou sans objet.

## 6. Redirections (curl -I en production)

| Test | Resultat |
|---|---|
| https://www.assutempo.fr/ | **308 -> https://assutempo.fr/ en UN saut** puis 200 |
| http://assutempo.fr/ | 308 -> https://assutempo.fr/ en un saut |
| http://www.assutempo.fr/ | 308 -> https://www.assutempo.fr/ puis 308 -> apex (2 sauts) |

- **Deja en place** : pas de double saut sur l'entree principale (https://www). Vercel emet des 308 (equivalent SEO du 301 : permanent, transmis a l'identique par Google et Bing).
- **MINEUR, non actionnable** : le double saut n'existe que sur http://www (entree marginale). La redirection http->https est faite au niveau plateforme Vercel AVANT toute regle vercel.json : impossible de la court-circuiter par configuration. Aucune action.

## 7. Soft-404

- `https://assutempo.fr/page-qui-nexiste-pas` renvoie un **vrai statut 404** avec la page stylisee (dist/404.html, noindex). **Deja en place** (corrige lors de la session des 5-6 juillet, rewrite catch-all retire de vercel.json).

## 8. GA4

Evenements cables (grep sur src/) : `view_tarification`, `view_carte_grise`, `carte_grise_view`, `cta_devis_click` (9 emplacements), `devis_express_view`, `generate_lead` (2), `tel_click`. Chargement en stub dataLayer + script apres load+idle, consentement respecte. **Deja en place, rien a faire.**

## 9. Divers releves au passage

- **MINEUR** : 2 demi-cadratins preexistants dans un texte visible de CGV.jsx ligne 495 (horaires ecrits avec le demi-cadratin au lieu du trait d'union) : contraire a la regle typographique du projet, corrige dans cette session.
- **MINEUR (hors perimetre, decision Ayoub)** : og:image absente des 57 pages (aucun visuel 1200x630 dans le repo). Deja note dans AUDIT-REPORT.md du 6 juillet.
- Identifiants legaux verifies pour le schema : Evidence Assurances = EA AGENCY, SIREN 884641523 (SIRET siege 88464152300011, celui affiche dans les CGU), active, creee le 1er juillet 2020 a Margny-les-Compiegne, NAF 66.22Z (source : recherche-entreprises.api.gouv.fr, 10 juillet 2026). ORIAS 20005719 affiche dans les CGU du site, coherent avec l'annee de creation.
- URLs sameAs verifiees (HTTP 200 + contenu correspondant) : fiche societe.com `https://www.societe.com/societe/ea-agency-884641523.html` et fiche officielle `https://annuaire-entreprises.data.gouv.fr/entreprise/884641523`. Pappers repond 403 (protection anti-bot, invérifiable) : **exclu**. orias.fr n'offre pas de lien profond stable vers une fiche : **exclu du sameAs**, le numero est porte par `identifier`.

## Synthese des priorites

| # | Constat | Gravite | Correctif |
|---|---|---|---|
| 1 | FAQPage absent de /faq et de la Home | CRITIQUE (GEO) | C1 |
| 2 | logo.png inexistant reference par 12 schemas Article | CRITIQUE | C1 |
| 3 | datePublished absent des 12 articles | IMPORTANT | C1 |
| 4 | Organization sans InsuranceAgency/ORIAS/sameAs/logo | IMPORTANT | C1 |
| 5 | lastmod du sitemap fige | IMPORTANT | C2 |
| 6 | robots.txt sans sections bots IA | IMPORTANT | C3 |
| 7 | IndexNow absent | IMPORTANT | C4 |
| 8 | Capsule de reponse datee absente des articles strategiques | IMPORTANT (GEO) | C5 |
| 9 | provider des Service non lie a #organization | MINEUR | C1 |
| 10 | Demi-cadratins CGV.jsx:495 | MINEUR | fix inline |
| - | Performance, redirections, soft-404, GA4, code splitting | Deja en place | aucun |
