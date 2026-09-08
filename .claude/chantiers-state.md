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

## Chantier 3: Pages locales 94 : PAS COMMENCÉ

Aucune page de proximité (Alfortville, Créteil, Maisons-Alfort, Vitry, Ivry, Charenton…)
n'existe. Seules 3 pages villes existent (`VilleLocale.jsx` : Paris, Lyon, Marseille, routes
`/assurance-temporaire-carte-grise-{paris,lyon,marseille}`), aucune n'est dans le 94.
**Prochain chantier à prendre.**

## Chantier 4: Maillage interne : pas audité spécifiquement dans ce run

## Chantier 5: Hub FAQ : `/faq` existe déjà (page dédiée + FAQPage), pas audité pour un hub
structuré supplémentaire dans ce run.

---
**Prochain run : chantier 3 (pages locales 94).**
