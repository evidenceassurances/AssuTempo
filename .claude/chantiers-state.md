# État des chantiers structurels AssuTempo

> Tenu par le pilote automatique (missions @claude). Un chantier par run,
> dans l'ordre du prompt. Mis à jour à chaque run.

## Chantier 1: Défense de marque : en grande partie déjà fait, incrément posé le 7 septembre 2026

Constat au démarrage de ce run (vérifié en ligne, pas seulement dans le code) :
- `/avis-et-garanties` existe déjà en prod depuis le 12 août 2026 (PR #41) : identité légale
  complète (Evidence Assurances, ORIAS 20005719, SIRET), tableau de 6 sociétés homonymes
  avec leur propre ORIAS, FAQ dédiée, JSON-LD FAQPage + BreadcrumbList, AnswerCapsule GEO.
- `/conditions-generales` (CGV.jsx) porte déjà une identité de courtier très lisible
  (raison sociale, SIRET, ORIAS en Article 1).
- Le doublon `/quisommesnous` vers `/qui-sommes-nous` est déjà traité (301, vercel.json).

Ce qui restait faible, corrigé dans ce run :
- Le prompt de mission nommait `assurance-tempo.eu` parmi les homonymes à couvrir : absent de
  la page. Vérifié en ligne (WebSearch + WebFetch de ses mentions légales le 7 septembre 2026) :
  `assurance-tempo.eu` et `tempo-assurance.com` (déjà listé) sont le MEME éditeur, MCJ Courtage,
  ORIAS 26008651, Abeilhan (34). Les deux domaines ont été regroupés dans une seule carte
  (pas un 7e homonyme distinct, pour ne pas fausser le compte de sociétés). ORIAS de MCJ Courtage
  ajouté (absent avant). Dates de vérification et libellés mis à jour dans
  `src/pages/AvisEtGaranties.jsx` (CAPSULE, HOMONYMES, section D).
- `/avis-et-garanties` n'était liée que depuis `/faq` et un article : aucun lien depuis la Home.
  Ajout d'une tuile "Vérifier l'identité d'AssuTempo" dans le hub `GuidesEtDemarches.jsx`
  (section Home sous le pli) et d'une question dédiée dans `src/data/faqHome.js` (FAQ Home,
  visible + JSON-LD FAQPage de `Home.jsx`, source unique donc les deux se mettent à jour
  ensemble).
- `About.jsx`, `Navbar.jsx`, `Footer.jsx` sont des zones interdites (formulaire B2B / header /
  footer globaux) : impossible d'y ajouter de lien depuis une mission automatique. Le footer
  ne lie ni `/avis-et-garanties` ni de comparatif : à faire par Ayoub en session locale si
  souhaité.

Reste dans ce chantier (pour un prochain passage, ou décision Ayoub) :
- Pas de lien vers `/avis-et-garanties` depuis le footer global (zone interdite).
- Revoir la veille homonymes tous les 1-2 mois (nouveaux sites au nom proche possibles).
- Pas de tableau comparatif fonctionnalités/offre chiffré vs les 6 homonymes (risque YMYL de
  sourcing sur des offres tierces non vérifiables en continu ; le choix a été de comparer
  l'identité légale, vérifiable et stable, plutôt que l'offre commerciale, changeante).

## Chantier 2: Réparation de l'héritage : déjà fait, vérifié en ligne le 7 septembre 2026

Les 6 URL héritées listées dans le prompt répondent toutes correctement en prod :
- `/faire-sa-carte-grise` : 301 vers `/carte-grise` (vercel.json)
- `/le-certificat-provisoire-dimmatriculation-plaques-ww` : 301 vers `/carte-grise` (vercel.json)
- `/assurance-temporaire-vehicule-utilitaire` : 301 vers `/assurance-temporaire-utilitaire` (vercel.json)
- `/assurance-auto-temporaire-1-jour` (URL nue, distincte de l'article `/articles/...`) : 301 vers `/tarification` (vercel.json)
- `/liste-des-situations-necessitant-une-assurance-temporaire` : redirection client-side (ROUTE_TABLE, page dans `src/pages/legacy/`)
- `/importer-exporter-un-vehicule-etranger` : redirection client-side (idem)

Vérifié aussi : `/quisommesnous` vers `/qui-sommes-nous` (301, vercel.json) ; `/sample-page`
donne 410 Gone via `api/gone.js` (testé en direct : HTTP 410 confirmé) ; sitemap propre (aucune
de ces URL n'y figure). Rien à faire ici pour l'instant.

## Chantier 3: Pages locales 94 : 6 villes livrées le 11 septembre 2026, vérifié en ligne
avant démarrage (les 6 rendaient 404, sitemap sans aucune ville du Val-de-Marne)

Ajout d'Alfortville, Créteil, Vitry-sur-Seine, Ivry-sur-Seine, Maisons-Alfort et
Charenton-le-Pont au pattern `VilleLocale.jsx` existant (Paris/Lyon/Marseille), toutes les
données dans `src/data/villesLocales.js`. Routes câblées dans `AppShell.jsx` (ROUTE_TABLE),
`scripts/prerender.mjs` (ROUTES, VILLE_LOCALE_ROUTES, ROUTE_MODULES : les 6 sont donc dans le
sitemap avec lastmod suivant villesLocales.js), lien entrant depuis la page pilier
`roulez-legal-apres-achat.jsx`, entrée GEO ajoutée dans `public/llms.txt`.

Faits vérifiés par recherche web le 11 septembre 2026 (6 agents dédiés, un par ville, sources
officielles uniquement : sites des mairies, val-de-marne.gouv.fr, metropolegrandparis.fr) :
- **Constat commun important, à retenir pour toute page locale de petite couronne future** :
  contrairement à Paris/Lyon/Marseille (qui ont chacune leur propre fourrière municipale bien
  documentée), AUCUNE des 6 communes du Val-de-Marne ne publie de fourrière municipale propre.
  Le gardiennage y est confié à des prestataires privés agréés PAR SECTEUR par la préfecture du
  Val-de-Marne (liste des fourriéristes par secteur, publiée le 16/10/2023). Des annuaires SEO
  tiers non officiels (fourrieres.fr, alternativi.fr, mise-en-fourriere.fr...) affichent des
  adresses de fourrière pour ces villes : elles se sont révélées être des recopiages erronés
  (adresses de commissariats, de mairies, ou d'adresses divergentes d'un annuaire à l'autre).
  Décision prise : ne jamais publier ces adresses, formuler honnêtement le mécanisme réel
  (contact du commissariat/police municipale du lieu d'enlèvement) plutôt que fabriquer une
  fausse précision. C'est aussi devenu le point différenciant honnête de ces 6 pages.
- ZFE Métropole du Grand Paris : intégrale à Alfortville, Ivry-sur-Seine (depuis le 1er octobre
  2021) et Charenton-le-Pont (depuis juin 2021) ; partielle (secteur intra-A86 uniquement) à
  Créteil, Vitry-sur-Seine et Maisons-Alfort. Période pédagogique sans sanction reconduite pour
  toute l'année 2026 (annonce du 22 décembre 2025), cohérent avec la page Paris déjà en ligne.
- Carte grise : guichet préfecture fermé nationalement le 6 novembre 2017 (PPNG), préfecture du
  Val-de-Marne à Créteil (21-29 avenue du Général-de-Gaulle), qui maintient un point d'accueil
  numérique sur rendez-vous (sans délivrer de titre elle-même).
- Un fait local distinctif et sourcé par ville pour éviter le gabarit copié-collé : presqu'île
  Seine/Marne et Chinagora (Alfortville), lac artificiel + statut de préfecture (Créteil), zone
  industrielle des Ardoines (Vitry-sur-Seine), projet urbain Ivry Confluences 145 ha (Ivry-sur-
  Seine), École nationale vétérinaire d'Alfort + vote municipal anti-ZFE du 30/09/2024 (Maisons-
  Alfort), quartier Charenton-Bercy en réaménagement (Charenton-le-Pont).

Contrôles : `npm run lint` (0 erreur, 17 warnings set-state-in-effect préexistants, aucun sur
les fichiers touchés), `npm run build` propre (90 routes prérendues, sitemap 87 URLs contre 81
avant, aucun tiret interdit ni expression bannie dans les lignes ajoutées).

Reste pour un prochain passage : les 6 pages ne se lient pas entre elles (pas de maillage
ville-vers-ville, cohérent avec le choix déjà fait pour Paris/Lyon/Marseille) ; d'autres villes
du 94 restent possibles (Le Perreux-sur-Marne, Nogent-sur-Marne, Fontenay-sous-Bois...) si
Ayoub le souhaite ; adresse de fourrière à publier si Ayoub obtient une confirmation écrite
directe d'une mairie ou de la préfecture (aucune trouvée par recherche web à ce jour).

**Prochain run : chantier 4 (maillage interne), sauf si Ayoub demande de compléter le
chantier 3 avec d'autres communes du 94.**

## Chantier 4: Maillage interne : pas audité spécifiquement dans ce run

## Chantier 5: Hub FAQ : `/faq` existe déjà (page dédiée + FAQPage), pas audité pour un hub
structuré supplémentaire dans ce run.

---
