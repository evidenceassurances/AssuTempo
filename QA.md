# QA : pages locales Paris, Lyon, Marseille (chantier structurel 04, 1er août 2026)

Issue #43, branche `claude/issue-43-20260731-2224` (assignée par le harnais ; l'issue demandait `draft/chantier-2026-08-01`, impossible à créer depuis cette session, voir section « Écarts vs l'issue » dans la description de la PR).

## Phase 0 : relevé du pattern existant

- **Routes partagées client/SSR** : `src/AppShell.jsx` (`ROUTE_TABLE`, tableau `[chemin, nomComposant]`), `src/App.jsx` (`IMPORTERS`, lazy côté client), `src/entry-server.jsx` (imports eager + objet `PAGES`). Les 3 nouvelles routes pointent vers **un seul composant partagé**, `VilleLocale`, résolu par `useLocation().pathname` (comme `/carte/:pays` résout son pays par paramètre, ici par chemin littéral puisque les 3 slugs sont fixes).
- **Prérendu** : `scripts/prerender.mjs`, tableau `ROUTES` (source unique du sitemap), `ROUTE_MODULES` (module à précharger par route), `sitemapSourcesFor()` (fichiers sources pour le calcul du `lastmod` réel par date git). Ajout d'un `VILLE_LOCALE_ROUTES` (Set) pour faire suivre `src/data/villesLocales.js` comme source des 3 routes (le composant seul ne suffirait pas à dater le contenu réel).
- **Modèles de référence lus intégralement** : `src/pages/RoulezLegalApresAchat.jsx` et `src/pages/BarometreImmatriculations.jsx`. Composants réutilisés à l'identique : `AnswerCapsule` (`src/components/articles/AnswerCapsule.jsx`), `AccordionItem` (`src/components/ui/AccordionItem.jsx`), `jsonLd()` (`src/lib/seo.js`), variants `fadeUp`/`stagger` (`src/animations.js`). Le bloc « bandeau de 3 faits » reprend la mise en page `RuleRow` du Baromètre (figure saillante + titre + texte + référence), réimplémenté localement dans `VilleLocale.jsx` (`BandeauRow`) car non exporté par la page d'origine.
- **`/carte`** : logique géographique existante mais à l'échelle des 34 pays européens couverts par le produit (carte interactive, cartes pays). Aucune notion de ville française : pas de rattachement pertinent, les 3 pages locales restent autonomes, reliées par le maillage texte plutôt que par la carte.
- **`FORBIDDEN_PATHS` du portique** (`scripts/quality-gate.mjs`) : `Navbar.jsx`, `Footer.jsx`, `Pricing.jsx`, `CarteGrise.jsx`, `About.jsx`, `AssuranceInternationale.jsx`, `.github/`, `quality-gate.mjs`, `indexnow.mjs`, `vercel.json`. Aucun de ces chemins n'a été touché (vérifié ci-dessous).

## Phase 1 : faits locaux retenus (recherche web du 31 juillet / 1er août 2026)

### Paris

| Fait retenu | Source | Vérifié le |
|---|---|---|
| La mainlevée se demande directement au guichet de la (pré)fourrière, sans passage par un commissariat (particularité parisienne) | paris.fr, page « Fourrières » | 31/07/2026 |
| Préfourrière Charléty, Parc Charléty-Thomire, rue Thomire, 75013 Paris | paris.fr, page « Fourrières » | 31/07/2026 |
| Justificatifs au guichet : pièce d'identité/permis conforme à la catégorie du véhicule, certificat d'immatriculation, attestation d'assurance (FVA) | paris.fr + masecurite.interieur.gouv.fr (démarche en ligne FranceConnect) | 31/07/2026 |
| Métropole du Grand Paris : période pédagogique ZFE (zéro sanction) reconduite du 1er janvier au 31 décembre 2026 pour Crit'Air 3, 4, 5 et non classés, annonce du 22 décembre 2025 | metropolegrandparis.fr, communiqués officiels | 31/07/2026 |
| Périmètre ZFE : Paris + 77 communes dans le périmètre de l'A86 | recherche croisée (source secondaire, non recopiée telle quelle dans le contenu publié pour rester prudente) | 31/07/2026 |
| Fermeture des guichets carte grise en préfecture depuis 2017, démarche ANTS ou professionnel habilité SIV | service-public.gouv.fr (national, applicable à Paris) | 31/07/2026 |

**Écarté faute de source suffisamment solide** : le chiffre de « 250 000 véhicules mis en fourrière par an » (un véhicule toutes les 2 minutes) trouvé sur des sites de presse automobile, daté 2014 et non recoupé sur une source officielle récente. Non utilisé dans le contenu publié ; remplacé par une description qualitative (densité du stationnement payant, plusieurs préfourrières intra muros).

### Lyon

| Fait retenu | Source | Vérifié le |
|---|---|---|
| Fourrière municipale : 38 rue Pierre Sémard, 69007 Lyon (7e arrondissement) | mairie7.lyon.fr, page « Fourrière automobile municipale » | 31/07/2026 |
| Horaires : lundi-samedi 7h-20h, dimanche et jours fériés 8h-12h | mairie7.lyon.fr | 31/07/2026 |
| ZFE du Grand Lyon : interdiction Crit'Air 3, 4, 5 et non classés en vigueur depuis le 1er janvier 2025 ; amendes 68 € (véhicules légers) / 135 € (poids lourds) | zfe.grandlyon.com (métropole de Lyon, officiel) | 31/07/2026 |
| Verbalisation effective des Crit'Air 3 démarrée le 1er juillet 2026 | Sources professionnelles convergentes (media.roole.fr, permisapoints.fr, selectra.info) ; non trouvé texte exact avec cette date sur zfe.grandlyon.com au moment de la vérification (page tronquée côté 2026) : **confiance moyenne, à recontrôler si possible sur zfe.grandlyon.com directement** | 31/07/2026 |
| Relief : collines de Fourvière et de la Croix-Rousse séparant la presqu'île, tunnel de Fourvière et tunnel de la Croix-Rousse comme axes de franchissement | grandlyon.com (actualité « En coulisses : l'autre visage du tunnel de Fourvière »), archives-lyon.fr (tunnel de la Croix-Rousse) | 31/07/2026 |
| Mainlevée délivrée par les forces de l'ordre à l'origine de l'enlèvement (police nationale, municipale ou gendarmerie) | service-public.gouv.fr, procédure nationale de mise en fourrière (règle générale, aucune adresse de commissariat lyonnais précise n'a été affirmée faute de confirmation officielle) | 31/07/2026 |

**Écarté faute de source officielle** : le chiffre de trafic quotidien du tunnel de Fourvière (environ 103 000 passages/jour, trouvé via un résumé de recherche) n'a pas été confirmé sur bison-fute.gouv.fr (page consultée directement : aucun chiffre de trafic présent). Non utilisé ; le contenu reste qualitatif sur ce point.

### Marseille

| Fait retenu | Source | Vérifié le |
|---|---|---|
| Fourrière municipale : 58 boulevard Capitaine Gèze, 13014 Marseille (14e arrondissement) | marseille.fr, page « Fourrière municipale » | 31/07/2026 |
| Horaires : lundi-samedi 8h-19h, fermée le dimanche | marseille.fr | 31/07/2026 |
| Mainlevée : sur place auprès de la police municipale (lundi-vendredi jusqu'à 19h15, samedi 13h-19h15) ou dans un commissariat de police nationale, 24h/24 selon 3 secteurs de la ville, ou en ligne | marseille.fr | 31/07/2026 |
| Documents exigés : carte grise, permis, attestation d'assurance en cours de validité, mainlevée | marseille.fr | 31/07/2026 |
| ZFE Aix-Marseille-Provence : interdiction Crit'Air 4, 5 et non classés en vigueur depuis septembre 2023, amende 68 € | ampmetropole.fr (officiel, catégories confirmées ; date de 2023 recoupée avec des sources professionnelles concordantes) | 31/07/2026 |
| Tunnels du Vieux-Port et de Prado-Carénage accessibles à tous les Crit'Air | recherche croisée (source professionnelle spécialisée ZFE) | 31/07/2026 |
| Grand Port Maritime de Marseille : plateforme RoRo majeure (Corse, Afrique du Nord, Méditerranée), nouvelle ligne Marseille-Turquie ouverte en octobre 2025 pour l'import de véhicules depuis l'Asie | marseille-port.fr (autorité portuaire), portsetcorridors.com | 31/07/2026 |

**Écarté faute de pertinence directe** : le chiffre de 245 194 remorques (trailers) traitées en 2025 par le port (+7 %) concerne le trafic RoRo global, pas spécifiquement les véhicules particuliers : non repris pour éviter toute confusion de chiffre. Le contenu publié reste qualitatif sur le rôle du port.

### Carte grise, national (les 3 villes)

Fermeture des guichets de préfecture pour les certificats d'immatriculation depuis 2017 (réforme des préfectures), démarche par l'ANTS ou un professionnel habilité au SIV : confirmé sur service-public.gouv.fr, formulation reprise sans mention d'un numéro d'habilitation nominatif (cohérent avec la règle permanente de CLAUDE.md sur Certimat, sans lien avec ce chantier mais vérifiée pour ne pas la contredire).

## Phase 2 : chiffres nationaux utilisés

| Élément | Valeur | Source | Utilisé sur |
|---|---|---|---|
| Délai pour immatriculer après achat | 1 mois à compter de la cession | Code de la route, art. R322-5 | Les 3 pages |
| Retard d'immatriculation | 135 € forfaitaire (90 € minorée, 375 € majorée), jusqu'à 750 € au tribunal | Code de la route art. R322-5, code pénal art. 131-13 | Les 3 pages |
| Défaut d'assurance | Délit, amende forfaitaire délictuelle 500 € (400 € minorée, 1 000 € majorée), jusqu'à 3 750 € au tribunal | Code de la route, art. L324-2 | Paris (bandeau) |
| Certificat provisoire d'immatriculation (CPI) | 1 mois, France uniquement | service-public.gouv.fr, fiche F34300 | Lyon (bandeau) |
| Plaques WW | 4 mois depuis le 1er janvier 2026, sans reconduction tacite | Arrêté du 9 février 2009 art. 8, modifié par l'arrêté du 15 décembre 2025 | Marseille (carte grise) |

Aucun de ces chiffres n'a été modifié par rapport à la table fournie dans l'issue ; tous réutilisés tels quels.

## Phase 3 : mesure de similarité textuelle

**Méthode** : extraction programmatique (script Node ponctuel) de tout le texte propre à chaque ville dans `src/data/villesLocales.js` (eyebrow, H1, intro, capsule et ses 3 faits, bandeau de 3 faits, bloc « concrètement », bloc fourrière, bloc carte grise, FAQ complète, texte de maillage), à l'exclusion du header, du footer, des CTA (texte des boutons, identique par design) et du JSON-LD (généré, pas rédigé). Texte normalisé (minuscules, accents retirés, ponctuation supprimée), comparé par :
- **Indice de Jaccard sur les mots uniques** (intersection / union des vocabulaires)
- **Taux de recouvrement des bigrammes** (paires de mots consécutifs), plus proche de ce que mesurent les détecteurs de contenu dupliqué

**Résultat** :

| Paire | Jaccard (mots) | Recouvrement bigrammes |
|---|---|---|
| Paris / Lyon | 38,0 % | 32,8 % |
| Paris / Marseille | 36,2 % | 31,8 % |
| Lyon / Marseille | 38,3 % | 32,9 % |

Les 3 paires sont sous la barre des 40 % demandée, marge la plus faible à 1,7 point (Lyon/Marseille, indice de Jaccard). Le vocabulaire commun restant est presque entièrement composé de termes juridiques et procéduraux inévitables communs aux 3 villes (« article R322-5 », « certificat d'immatriculation », « professionnel habilité », « attestation d'assurance ») : aucun paragraphe entier n'est partagé, chaque bloc « concrètement », fourrière et carte grise a été rédigé séparément avec un sujet différent (guichet unique de mainlevée à Paris, relief et tunnels à Lyon, port et import à Marseille).

## Phase 3 (suite) : maillage

**Sortant, depuis chaque page locale** (vérifié : les 4 routes existent dans `ROUTES` de `scripts/prerender.mjs` et le build les prérend) :
- Les 3 pages renvoient vers `/roulez-legal-apres-achat` (page pilier, obligatoire).
- Paris : `/articles/voiture-immobilisee-defaut-assurance`, `/articles/controle-sans-assurance-risques-amende`, `/articles/combien-de-temps-carte-grise`.
- Lyon : `/articles/rouler-sans-carte-grise-a-son-nom`, `/articles/changement-titulaire-carte-grise`, `/articles/combien-de-jours-assurance-sortir-fourriere`.
- Marseille : `/articles/assurance-temporaire-vehicule-etranger-france`, `/articles/carte-grise-ants-bloquee`, `/articles/combien-de-jours-assurance-sortir-fourriere`.
- Double CTA (`/tarification`, `/carte-grise`) sur chaque page, en tête (bandeau) et en pied de page.

**Entrant** : `src/pages/RoulezLegalApresAchat.jsx` (page non protégée par le portique), section maillage, ajout d'une phrase « Des particularités locales à connaître » avec un lien vers chacune des 3 nouvelles pages. Cette page est déjà reliée depuis la Home et depuis le Baromètre : les 3 pages locales héritent donc d'un chemin d'accès interne dès la mise en ligne.

## Contrôles automatisés

- **Tirets interdits** : `grep -rnP "[\x{2013}\x{2014}]" src/data/villesLocales.js src/pages/VilleLocale.jsx` (0 résultat) et `git diff -- src public scripts | grep '^+' | grep -P "[\x{2013}\x{2014}]"` sur l'ensemble du diff (0 résultat, ce qui couvre aussi `RoulezLegalApresAchat.jsx`, `AppShell.jsx`, `App.jsx`, `entry-server.jsx`, `prerender.mjs`, `llms.txt`).
- **`npm run build`** : vert. **76 routes** prérendues (dont `/404` hors sitemap), sitemap généré avec **75 URLs**, les 3 nouvelles pages présentes avec `lastmod` du jour (contenu neuf, source `src/data/villesLocales.js` suivie).
- **Aucune dépendance ajoutée** : `package.json` non modifié ; `package-lock.json` restauré après un `npm install` local (modifications cosmétiques de métadonnées `libc` sans rapport avec ce chantier).
- **JSON-LD FAQPage = texte visible** : `VilleLocale.jsx` construit `JSONLD_FAQ` directement depuis le tableau `ville.faq` qui alimente aussi l'affichage (`AccordionItem`) : identité garantie par construction, pas de recopie manuelle.
- **Title / meta description** : title 54-59 caractères (< 60), description 118-125 caractères (< 155), vérifiés par script Node.
- **Longueur des textes GEO** : Answer Capsule 68-75 mots (cible 55-75), réponses FAQ toutes vérifiées entre 44 et 61 mots (cible 40-90) après un premier passage de rédaction qui comptait plusieurs réponses trop courtes (30-39 mots), corrigées et revérifiées par script.
- **Clés d'objet avec tiret** : aucune nouvelle clé de ce type introduite (les slugs de ville n'en contiennent pas : `paris`, `lyon`, `marseille`).

## Checklist des interdictions

- [x] Header et footer globaux non modifiés (`Navbar.jsx`, `Footer.jsx` absents du diff)
- [x] `/tarification` non modifié (tunnel JL Assure intact, `Pricing.jsx` absent du diff)
- [x] Iframe Certimat de `/carte-grise` non touchée (`CarteGrise.jsx` absent du diff)
- [x] Aucun formulaire B2B ni international modifié (`About.jsx`, `AssuranceInternationale.jsx` absents du diff)
- [x] Aucune nouvelle dépendance npm (`package.json` inchangé)
- [x] Exactement 3 villes créées, aucune quatrième
- [x] `npm run dev` jamais utilisé, seul `npm run build`
- [x] Aucun fichier des `FORBIDDEN_PATHS` du portique modifié (`.github/`, `quality-gate.mjs`, `indexnow.mjs`, `vercel.json` absents du diff)

## Fichiers créés / modifiés

**Créés** : `src/data/villesLocales.js`, `src/pages/VilleLocale.jsx`.
**Modifiés** : `src/AppShell.jsx`, `src/App.jsx`, `src/entry-server.jsx`, `scripts/prerender.mjs`, `public/llms.txt`, `src/pages/RoulezLegalApresAchat.jsx` (maillage entrant), `QA.md` (ce fichier), `dist/**` et `public/sitemap.xml` (artefacts de build, commités par convention du dépôt).
