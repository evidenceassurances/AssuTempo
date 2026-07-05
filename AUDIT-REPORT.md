# Audit technique AssuTempo - 5 juillet 2026

Audit complet du site sur cinq axes : liens internes, attributs alt des images, balises meta (manquantes ou dupliquées), erreurs de console, imports inutilisés. Méthode : analyse statique des sources (ESLint + scans dédiés), audit du HTML prérendu des 56 pages du build, balayage Playwright (Chrome) des 56 routes servies localement avec capture console, exceptions et requêtes réseau. Le tunnel de tarification (iframe JL Assure, page Pricing) n'a pas été touché, conformément à la consigne.

---

## 1. Ce qui est sain (vérifié, aucune correction nécessaire)

- **Liens internes : 0 lien cassé.** Tous les `href` internes du HTML prérendu des 56 pages pointent vers une route existante. Les liens dynamiques (`/articles/${slug}`, `/carte/${slug}`) correspondent tous aux slugs des données. Les chemins de navigation de l'assistant (`/tarification`, `/carte-grise`) sont valides.
- **Images : 100 % des `<img>` ont un attribut `alt`** (sources et HTML rendu).
- **Titles et meta descriptions : exactement 1 par page, aucun doublon** entre les 56 pages, aucune duplication entre le template global et les balises hissées par le prérendu.
- **Canonicals : présents et corrects sur les 56 pages** (URL absolue conforme à la route).
- **Sitemap : 56 URLs, en correspondance exacte avec les routes prérendues.**
- **Console : 0 erreur JS, 0 exception, 0 requête interne échouée** sur les 56 routes (balayage Playwright, bruit GA externe filtré).

## 2. Corrections appliquées

### Balises meta manquantes (Open Graph / Twitter)
37 pages n'avaient aucune balise `og:title` / `og:description` / `og:url` / `twitter:card` alors que le reste du site en a (le prérendu les hisse dans le `<head>`, les scrapers sociaux ne lisent que ça) :

- `src/pages/Carte.jsx` : ajout des balises OG dynamiques (title, description, url calculés par pays). Couvre `/carte` et les 34 pages pays.
- `src/pages/Cookies.jsx` : ajout des balises OG statiques.
- `src/pages/CGV.jsx` : ajout des balises OG statiques.

Vérifié après rebuild : les 56 pages ont désormais chacune exactement 1 og:title, og:description, og:url et twitter:card.

### Imports et variables inutilisés
- `src/pages/Cookies.jsx` : imports `AnimatePresence` (framer-motion) et `ChevronDown` (lucide) supprimés.
- `src/pages/Articles.jsx` : import `stagger` (articlesMeta) supprimé.
- `src/pages/Carte.jsx` : variante morte `cardVariant` et hook `useReducedMotion` inutilisé dans `CountryPanel` supprimés.
- `src/components/ArticleLayout.jsx` : arguments `index` inutilisés retirés de `TimelineStep` et `RenderSection`.
- `src/components/CookieConsent.jsx` : deux `catch (e)` avec paramètre inutilisé passés en `catch` nu commenté.
- `src/components/HeroScrollytelling.jsx` : directive `eslint-disable` devenue inutile supprimée (ligne morte, aucun code touché).

### Config ESLint durcie
`eslint.config.mjs` importait `@eslint/js` sans jamais appliquer `js.configs.recommended` : `no-unused-vars` et `no-undef` étaient inactifs, c'est pour ça que les imports morts passaient inaperçus. Le ruleset recommandé est maintenant appliqué, avec globals Node pour les fichiers CommonJS (`api/chat.js`, `src/assistant/knowledge.js`). Résultat : **0 erreur**, 12 warnings restants (tous `react-hooks/set-state-in-effect`, patterns de synchronisation initiale intentionnels et documentés dans la config, volontairement en warn).

### Vérification post-corrections
- Lint : 0 erreur.
- `npm run build` : succès, 56 pages prérendues, sitemap régénéré.
- Re-balayage Playwright des 56 routes : 0 erreur console, 0 exception.
- Tunnel de tarification : aucun fichier de logique touché (l'ajout dans Carte/Cookies/CGV est purement des `<meta>` dans Helmet ; Pricing.jsx n'a pas été modifié).

## 3. Nécessite une décision humaine

1. **Aucune page n'a d'`og:image`.** Les partages WhatsApp / LinkedIn / Facebook sortent sans visuel. Il faut créer une image de partage (1200x630, charte or sur fond #0A0A0A), la déposer dans `public/`, puis l'ajouter au template global et aux Helmet. Blocage : l'asset n'existe pas, c'est un choix visuel.
2. **Pas de page 404 : soft-404 site-wide.** Une URL inexistante (ex. `/route-inexistante-xyz`) renvoie HTTP 200 avec une page vide : le routeur n'a pas de route `path="*"` et `vercel.json` réécrit tout vers `index.html`. Pour Google c'est un soft-404 (mauvais signal si des liens erronés circulent). Correctif propre : une page NotFound (contenu et design à définir) + idéalement un vrai statut 404 côté Vercel. Décision de contenu et de design.
3. **12 warnings `react-hooks/set-state-in-effect`** (CookieConsent, useIsMobile, AssuranceInternationale, Carte) : patterns de synchronisation initiale volontaires. Les refactorer serait un chantier de comportement, pas un nettoyage. À laisser tels quels sauf besoin.
4. Pour rappel (déjà connu, hors code) : la propriété GA UA morte `UA-264084182-1` reste à débrancher dans l'admin GA (Admin > Flux > Balises de site connectées).
