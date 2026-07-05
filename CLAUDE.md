# AssuTempo - Référence projet

> Document de contexte pour le site assutempo.fr. À placer à la racine du projet (CLAUDE.md) pour que Claude Code dispose du contexte à chaque session.
> Dernière mise à jour : 2 juillet 2026.

---

## 1. Le projet en bref

AssuTempo (assutempo.fr) est un site premium d'assurance auto temporaire (1 à 90 jours, 34 pays européens, attestation en 5 minutes).

- **Rôle** : apporteur d'affaires sous Evidence Assurances. Underwriting assuré par JL Assure.
- **Modèle** : génération de leads / souscription en ligne, rémunération par contrat apporté.
- **Mission d'Ayoub** : acquisition de trafic, stratégie de contenu, qualité du site. Pas de background technique : modèle architecte / exécutant (stratégie et contenu d'un côté, Claude Code pour l'exécution technique de l'autre).
- **Statut** : projet de revenu complémentaire, lancé en 2023, mené en parallèle d'un CDI.

### Distinction de marque (important)
assutempo.fr (Evidence Assurances) est totalement distinct de assutempo.com (ASSUPASS ONLINE / 3GOATS, ORIAS 18005774). Aucune contamination de contenu entre les deux. Le .com est le concurrent direct à dépasser sur Google.

---

## 2. Économie du projet

- Rémunération par contrat : **7 € de frais fixes restitués + une commission variable d'environ 25 % de la prime**.
- Revenu moyen constaté : **environ 21 € par contrat** (bordereau octobre : 7 contrats, 146 €).
- Leviers de croissance prioritaires : volume via SEO (cluster urgence) et surtout réseau B2B partenaires.
- Profil client à forte valeur : les "renouvelleurs en série" (résiliés / malussés sans accès à un contrat annuel), qui enchaînent les temporaires.

### Objectifs de volume (à ~21 €/contrat)
- 1 000 €/mois = 48 contrats
- 3 000 €/mois = 143 contrats
- 5 000 €/mois = 240 contrats

---

## 3. Stack technique

- **Framework** : React + Vite + React Router
- **Style** : Tailwind CSS
- **Animation** : Framer Motion (LazyMotion pour alléger le bundle)
- **Icônes** : Lucide React + set custom `VehicleIcons.jsx` (14 SVG véhicules relief)
- **Déploiement** : Vercel (intégration GitHub, dépôt `evidenceassurances/AssuTempo`)
- **Domaine** : IONOS (DNS)
- **Analytics** : GA4 (`G-W8M4ZGXZE1`), bannière de consentement RGPD. Plausible à l'étude (cookieless).
- **Formulaires** : Web3Forms (honeypot anti-spam)

### Design system
- Fond : `#0A0A0A`
- Or : `#C9A84C`
- Or clair : `#E8C97A`
- Préfixe CSS `atd-` pour les composants TempoDial (évite les conflits Tailwind)

### Contact affiché
09 74 19 78 20, Lun-Ven 9h-21h, Sam 9h-20h.

---

## 4. État du site (réalisé)

### Pages et structure
- 34 pages pays pour la carte interactive (`/carte/[slug]`), contenu rédigé et intégré
- Système de cartes pays à 4 catégories codées couleur : Obligatoire (corail), Péage & coûts (bleu acier), Sur la route (vert sauge), Bon à savoir (or), avec révélations Framer Motion en cascade
- FAQ, Tarification, Articles, Carte, International, Qui sommes-nous, Partenaires

### Animations existantes
- Hero scrollytelling "Cadran Assutempo" (en prod depuis le 2 juillet 2026) : zone 280vh, cadran épinglé, deux actes au scroll (bloc hero puis module "Devis express" : curseur 1-90 jours, odomètre, date de fin, CTA qui pré-remplit la durée du tunnel via `?duree=N`). Composants `HeroScrollytelling.jsx` + `CadranAssutempo.jsx` ; détails en section 5 et dans SCROLLY-PLAN.md / SCROLLY-QA.md
- Le TempoDial d'origine (anneaux concentriques, comète orbitale, CSS / GPU pur) reste utilisé tel quel sur `/assurance-internationale` (`TempoDial.jsx`, intact)
- Marquee véhicules
- Compteur d'attestations `CompteurAttestations.jsx` (incrément déterministe quotidien, sans backend)

### Contenu et SEO
- Articles cornerstone SEO/GEO avec JSON-LD (Article, BreadcrumbList, FAQPage, HowTo)
- Cluster urgence prioritaire (défaut d'assurance, sortie de fourrière, etc.)
- `llms.txt` pour l'optimisation GEO
- CGU Article 5 conforme à l'article L.112-2-1, II, 3° du Code des assurances (pas de droit de renonciation, primes non remboursables)

---

## 5. Chantiers récents (juin 2026)

### Motion premium et performance (Prompt 1 déployé)
- Système de motion centralisé `src/lib/motion.js` : `EASE_PREMIUM = [0.22, 1, 0.36, 1]`, variants `fadeUp`, `fadeIn`, `scaleIn`, `staggerContainer`
- Migration LazyMotion (`m.*` au lieu de `motion.*`, mode strict) pour alléger le bundle
- Code splitting des routes (React.lazy + Suspense)
- Chorégraphie d'ouverture du hero (reveal du H1 ligne par ligne par masque)
- Header intelligent au scroll (fond translucide + blur au-delà de 24px)
- Accessibilité : `useReducedMotion` respecté

### Refonte SEO/GEO (Prompt 1)
- Titles et meta descriptions réécrits page par page, axés mot-clé + marque
- JSON-LD global Organization + WebSite dans index.html
- Correction meta description (de "1 à 60 jours" vers "1 à 90 jours")
- Objectif : dépasser assutempo.com sur la requête de marque

### En cours de correction
- Jambages tronqués du H1 (le "g" de "change" coupé par le masque overflow-hidden) : padding-bottom 0.15em + margin-bottom -0.15em sur les spans, line-height min 1.1
- Diagnostic animations qui ne se jouent pas (suspect : composant `motion.*` résiduel bloquant LazyMotion strict)

### Session du 18 juin 2026 (assistant Tempo + pages de conversion)
Travail livré et poussé sur `main` (Vercel redéployé). À reprendre demain à partir d'ici.

- **Gel mobile à l'ouverture de l'assistant corrigé (cause racine = fond de page, pas l'assistant).** Le panneau se monte en portail par-dessus la page, ce qui forçait Safari mobile à re-rasteriser des surfaces lourdes. Sur mobile (`matchMedia('(pointer: coarse), (max-width: 820px)')`) : `BackgroundFX.jsx` sans `filter: blur(110px)` (radial-gradients seuls, orbes statiques, particules statiques) et `Navbar.jsx` sans `backdrop-filter` (fond plus opaque). Desktop inchangé. Règle retenue : jamais de `filter: blur()` grand rayon ni `backdrop-filter` actifs sur mobile.
- **Page Tarification (`src/pages/Pricing.jsx`) habillée** : grille 3 colonnes autour de l'iframe (rail gauche = parcours pas à pas, rail droit = carte chat "Discuter avec Tempo" + téléphone), rails sticky, bandeau confiance, section GEO, FAQ, maillage interne. Responsive sous 1180px (empilement, iframe en premier). JSON-LD BreadcrumbList + Service + FAQPage. Iframe JL Assure inchangé, `data-assistant-target="tarif-iframe"` conservé, hauteur portée à 1450.
- **Page Carte grise (`src/pages/CarteGrise.jsx`) habillée de façon symétrique** : le module Certimat passe en grille 3 colonnes (rail gauche = checklist "Préparez votre demande", rail droit = chat + téléphone), rails sticky. Ajout JSON-LD BreadcrumbList + Service + FAQPage et balises Open Graph/Twitter. Iframe Certimat inchangé (`partner=1153`, `data-assistant-target`, lazy, allow payment, GA4, auto-resize postMessage, lien de secours).
- **Ouverture pilotée de l'assistant** : `AssistantAssutempo.jsx` écoute `window` pour `CustomEvent('assutempo:open-assistant')`. Les boutons "Discuter avec Tempo" des deux pages le déclenchent.
- **Indice "?" sur le launcher** (`src/assistant/AssistantAssutempo.jsx` + `src/assistant/styles.js`) : PATH SVG en stroke qui se trace façon serpent (`stroke-dashoffset`) en sortant du point doré (le point doré sert de point du "?"), flotte, puis se rétracte, en boucle. Première apparition après 5s, 100 % CSS, `pointer-events:none`, hors flux (aucun layout shift), `prefers-reduced-motion` géré. Classes `at-draw` / `at-bob` / `at-emit`.

À vérifier visuellement demain (déjà en prod) : largeur de l'iframe Tarification entre ~1000 et 1180px, rendu mobile des deux pages, et calibrage de l'indice "?" (taille via `width/height` du svg, épaisseur du trait, galbe du crochet via le `d`, hauteur de flottement). Pistes d'ajustement notées dans le dernier message de session.

> Workflow validé le 18 juin 2026 : commit + push automatiques après CHAQUE modification, sans demander.

### Session du 2 juillet 2026 (hero scrollytelling "Cadran Assutempo") : mergée en prod
Le hero de la Home est devenu un scrollytelling en deux actes, validé par Ayoub puis mergé sur `main` (fast-forward, 13 commits).

- **Architecture** : zone 280vh + étage sticky 100svh. `src/components/HeroScrollytelling.jsx` (orchestration : une seule progression p, un listener scroll passif + rAF, tout dérive de p) et `CadranAssutempo.jsx` (couche SVG post-hydratation sur l'esthétique atd existante : arc de remplissage, aiguille-point, 90 graduations allumables, chiffres gravés 15..90 ; machine à états idle > interacting > resuming dans un seul rAF). `Hero.jsx` supprimé (JSX porté dans HeroScrollytelling). `main` de Home en `overflow-x: clip` (un overflow hidden ancêtre casse position: sticky).
- **Acte 2 "Devis express"** : curseur 1..90 (défaut 7), odomètre, date de fin incluse (J + N-1), CTA vers `/tarification?duree=N` ; l'iframe JL Assure se pré-remplit nativement via le paramètre GET `duree` (input caché `pref_duree` rendu côté serveur, vérifié). Aucun prix affiché. Événements GA4 : `devis_express_view`, `cta_devis_click` avec `duree_jours`.
- **Finitions** : contre-rotation 180s, chiffres repères, éclat d'allumage, respiration idle, odomètre, micro-zoom scroll, vibration Android aux dizaines. Règle de Chanel appliquée : sillage d'aiguille retiré (doublait la tête de l'arc).
- **QA prouvée** (`SCROLLY-PLAN.md` + `SCROLLY-QA.md` à la racine) : +4,17 KB gzip / budget 9 KB, LCP stable, CLS 0, 61 fps y compris CPU x4, 40/40 Playwright, reduced-motion complet, TempoDial d'AssuranceInternationale intact (surcharges scopées `.atc`).
- **Pièges repo notés** : `dist/` est commité (un build non commité bloque `git checkout` ; assets orphelins untracked à nettoyer) ; `html { scroll-behavior: smooth }` impose `behavior: 'instant'` aux scrollTo programmatiques (tests) ; gardes de refs obligatoires dans rAF/timers (fenêtre détachement DOM / cleanup React).

### Session du 2 juillet 2026 (suite) : audit qualité + performance mobile, mergé en prod
- **Bug d'hydratation site-wide corrigé (React #418 sur les 11 routes lazy en accès direct, préexistant depuis juin)** : AnimatePresence désynchronisait l'arbre client pendant l'hydratation d'un chunk en suspens, chaque page se re-rendait entièrement côté client. Fix : AnimatePresence (initial=false) activée seulement après le premier montage (`AppShell.jsx`), transitions de navigation inchangées. Règle : jamais de mécanique de présence framer autour d'un lazy pendant l'hydratation.
- **Temps morts de navigation supprimés** : prefetch en idle de tous les chunks de routes (`App.jsx`, coupé si saveData/2G) : /faq en 142 ms après prefetch ; bandeaux CTA de la Home réparés (`window.open` remplacé par navigate : plus de nouvel onglet ni de rechargement complet).
- **LCP mobile 6,5 s → ~2,8 s (perf Lighthouse 73 → 90-93)** : chorégraphie d'entrée du hero en CSS pur (classes `scy-in-*`, ne dépend plus du JS), fonts Inter non bloquantes et réduites aux graisses 400-800, PageTransition sans opacity:0 au premier montage (le HTML prérendu est visible dès le premier paint sur toutes les pages).
- **Partage social réparé site-wide** : les balises og:/twitter: sont hissées dans le `<head>` du prérendu (`prerender.mjs`, même mécanisme que la description ; ne jamais y toucher aux scripts ld+json). Balises ajoutées aux 12 articles (`ArticleLayout.jsx`) et à la page internationale.
- **Durcissements** : contrôle d'origine exact sur `api/chat.js` (startsWith était contournable), compteur d'attestations déterministe au premier rendu (mismatch d'hydratation), JSON-LD échappé via `src/lib/seo.js` (helper `jsonLd()`, à utiliser pour tout nouveau schéma), 23 fichiers morts supprimés, Tailwind inerte retiré (les directives n'étaient jamais compilées ; le `bg-white` du body était un piège latent), barre de lecture des articles en scaleX GPU (`ScrollProgress`).
- Coût total du lot : +0,8 KB gzip. Vérifié : hydratation 12/12 routes propres, QA hero 40/40, transitions animées. Note : l'iframe Certimat refuse le framing hors assutempo.fr (CSP côté partenaire), donc invisible en preview locale/Vercel : normal.

### Session du 2 juillet 2026 (fin) : correctif lanceur chatbot mobile + header, mergé en prod
Correctif du widget "Besoin d'aide ?" qui débordait du bord GAUCHE sur mobile (bouton coupé, anneaux hors viewport, étiquette orpheline). Cause racine : sous 520px, `.atp-root` recevait `left`+`right` (bande pleine largeur pour l'ancien panneau), le bouton, enfant en flux, partait au bord gauche. Branche `fix/chat-launcher-mobile` validée par Ayoub sur preview puis fast-forward sur `main`.

- **Lanceur** : dock flex [étiquette | bouton] ancré bas-droite (`right: 16px`, `bottom: calc(16px + env(safe-area-inset-bottom))`, plus JAMAIS de `left` sur `.atp-root`). Bouton 56px fond `#141210`, anneau doré 1px, bulle dorée ; halo -8px et badge supprimés ; pulsation = liseré qui respire en opacité (3s) en `inset: 0` + `overflow: hidden` (rien ne sort du cercle).
- **Étiquette solidaire** : apparaît 1,5s après chargement, visible 5s, repli transform/opacity (origine côté bouton), retour uniquement après 30s d'inactivité sur la même page (timers JS, `introDoneRef` une fois par session, reset à la navigation).
- **Cohabitation** : sonde `elementsFromPoint` (rAF sur scroll/resize) sur `.btn-gold`/`.btn-glass` → dock à 40 % pendant un chevauchement (ignore nativement les CTA masqués / pointer-events none). Le slider du hero émet `CustomEvent('assutempo:instrument-drag', {detail:{dragging}})` → dock effacé pendant le drag, retour à l'arrêt.
- **Mobile** : panneau de chat en feuille `position: fixed` pleine largeur 92svh, coins arrondis en haut, fermeture X explicite (chevron conservé desktop), safe-area sur la mention légale. Logique conversationnelle (API, plafonds, transcript) inchangée.
- **Header mobile scrollé** : fond `#0A0A0A` plein (l'alpha 0.94 laissait transparaître les vignettes véhicules derrière le logo), hauteur inchangée, desktop translucide + blur conservé.
- QA Playwright dédiée **51/51** (375x812 et 390x844, horloge pilotée pour les 30 s, preuve du dim 40 % par CTA injecté, reduced-motion, desktop non régressé), captures contrôlées, **+915 B gzip**, console 0 erreur. Section complète dans SCROLLY-QA.md.

### Session du 3 juillet 2026 : affinage hero (fluidité, collisions, rythme), mergé en prod
Retour iPhone d'Ayoub : scroll saccadé, « 30/60 » traversant "JOURS DE COUVERTURE", aiguille masquant le « 90 », transition trop longue. Branche `polish/hero-fluidite`, profilage AVANT correction (exigé), validé sur preview puis fast-forward sur `main`.

- **Jank, coupable n°1 mesuré** : l'animation `gold-shift` du dégradé de « tout. » (H1) anime `background-position`, propriété NON compositable : 424 Paint/127 ms sur 3,2 s de scroll (2 repaints/frame, aussi au repos), re-rasterisant la couche texte en DPR3. Figée sur mobile (dégradé statique mi-course), conservée desktop. Paint : 424 → 1. **Règle : jamais d'animation background-* dans une couche transformée au scroll ; les shimmer texte sont interdits sur mobile.**
- **Coupable n°2** : 3 callbacks rAF/frame. Fusion : `CadranAssutempo` n'a plus de boucle propre, il expose `frame(ts)` appelé par la boucle unique du hero ; progression appliquée seulement si `scrollY` change, géométrie de zone en cache (0 gBCR/frame) ; sonde CTA du lanceur throttlée à 200 ms. Au passage : `visibilitychange` était défini mais jamais enregistré (corrigé).
- **Coupable n°3 (compositeur mobile)** : `grain-overlay` passe en blend `normal` sur mobile (surface `mix-blend-mode: overlay` plein écran re-mélangée à chaque frame) et traînée sans `blur(.5px)` (scopé `.atc` : TempoDial internationale intact, vérifié blur + 17 s). Desktop inchangé.
- **Collisions** : repères 30/60 retirés sur mobile (classes `atc-num-vNN`), letter-spacing du label `.24em → .14em` (air > 12 % du diamètre par côté), fondu de proximité : repère à < 14° de l'aiguille estompé à 0 en 200 ms, retour à l'éloignement, gated hors cadran pur (acte 1 : rien ne s'éteint). Zéro chevauchement vérifié à 1/15/45/60/90 j.
- **Rythme** : zone 280vh → 210vh ; sortie texte p 0 → 0,30 (transform ease-out, **opacité LINÉAIRE** : l'ease-out d'opacité vidait l'écran dès p≈0,15, c'était le temps mort) ; entrée module p 0,26 → 0,52 (fondu croisé) ; balayage par pas de 5 % : jamais le cadran seul.
- QA **40/40**, **+274 B gzip**, console 0 erreur partout ; profil avant/après en tableau dans SCROLLY-QA.md. Banc Mac non saturable (60,3 fps au 4x, 59,7 au 14x) : les preuves téléphone sont les compteurs par frame (Paint, recalc, JS), pas le fps du banc.

### Session du 3 juillet 2026 (suite) : audit chargement, mergé en prod
Constat "6 s sur iPhone". Causes mesurées : ~310 KB d'analytics au démarrage (dont propriété UA morte UA-264084182-1 chaînée côté admin GA, action Ayoub : la débrancher dans Admin > Flux > Balises de site connectées), main de 62,5 KB gzip dont la moitié indue (contenu des 34 pays importé par la Home + assistant), fenêtre de loader sur accès directs (chunk de page jamais préchargé). Corrections : **main 19,1 KB (-70 %)** via `countries-index.js` léger, assistant et sections Home sous le pli en chunks différés (PagesContext, eager SSR / lazy client, préchauffe), GA en stub dataLayer + script après load+idle (0 événement perdu), **modulepreload du chunk de page injecté par prerender.mjs (manifest Vite) sur les 56 pages**. QA 25/25 + 52/52 + 40/40, hydratation 12 routes propre. **Règle #418 n°2 : `transitionsReady` reste SYNC, jamais startTransition (reproduit : #418 sur toutes les routes lazy).** Rapport complet dans SCROLLY-QA.md. Workflow : depuis cette session, merge direct en prod après QA, sans attente de validation.

### Session des 5-6 juillet 2026 : audit technique + page 404, en prod
Audit complet (liens, alt, meta, console, imports) : rapport dans AUDIT-REPORT.md à la racine. Sain d'origine : 0 lien interne cassé, 100 % alt, titles/descriptions/canonicals uniques sur les 56 pages, 0 erreur console (balayage Playwright des 56 routes).

- **OG/Twitter complétées sur 37 pages** (`/carte` + 34 pays via Helmet dynamique dans Carte.jsx, `/cookies`, `/conditions-generales`) : og:title, og:description, og:url, twitter:card partout. Reste og:image : AUCUNE page n'en a, il faut créer un visuel 1200x630 (décision Ayoub).
- **ESLint réparé** : `eslint.config.mjs` importait `@eslint/js` sans appliquer `js.configs.recommended` (no-unused-vars inactif, d'où 9 imports/variables morts, supprimés). Ruleset appliqué + globals Node pour `api/` et `knowledge.js`. Lint : 0 erreur, 12 warnings set-state-in-effect intentionnels.
- **Vraie page 404** (`src/pages/NotFound.jsx`, "Cette page a expiré", CTA devis/accueil/carte, noindex, 1,4 KB gzip) : route catch-all `*` dans ROUTE_TABLE (câblée dans App.jsx ET entry-server.jsx, parité hydratation), prérendue en `dist/404.html` HORS sitemap par `buildPageHtml()` dans prerender.mjs.
- **Rewrite catch-all de vercel.json RETIRÉ** : toutes les routes ont leur HTML physique, une URL inconnue tombe sur `dist/404.html` avec un vrai statut 404 (fin du soft-404). **Ne JAMAIS remettre de rewrite vers index.html** : il retransformerait chaque 404 en 200. Slug pays inconnu (`/carte/xyz`) : 404 côté serveur, puis le client retombe en douceur sur la Carte générique (comportement vérifié, 0 erreur). Vérifié en prod : 200 sur les vraies pages, 404 + page stylée sur les inconnues, sitemap 56 URLs intact.

---

## 6. Plan SEO / backlinks

### Phase 1 (fondations)
- Lien partenaire contextuel en cours
- Lien ORIAS Evidence Assurances vers assutempo.fr
- Saturation de la SERP de marque : Google Business Profile, LinkedIn, Trustpilot, PagesJaunes, réseaux sociaux
- Citations société (Pappers, societe.com)

### Phase 2 (B2B, levier décisif)
- Kit partenaire (badge HTML "Partenaire officiel" + snippet + email type) à remettre à chaque pro signé
- Chaque garage / agence carte grise / centre de contrôle technique = un backlink local thématique

### Phase 3 (contenu et presse)
- Saison Maroc / Marhaba (mi-juin) : pitch page Maroc + article checklist traversée
- Plateformes journalistes (Rajaa.eu gratuit, ResponseSource payant)
- Articles invités (mandataires auto, plateformes carte grise, blogs expatriés)
- Sponsoring local

### Hygiène
- 2 à 4 liens / mois max
- Ancres : 70 % marque, 20 % URL nue, 10 % "assurance temporaire"
- Jamais de packs Fiverr, PBN ou annuaires spammy

---

## 7. TODO actifs

- Optimisation performance mobile (temps de chargement) : splitting JS, optimisation images, lazy loading, suppression double redirection www
- Articles de blog restants (plusieurs encore en "Bientôt disponible"), cadence cible 3-4/semaine
- Page partenaires B2B + extranet partenaire dédié
- Cellule de souscription automatisée hors horaires (dépend de l'accès API JL Assure)
- Demander à Evidence une grille de commissionnement écrite + bordereau mensuel détaillé
- Migration éventuelle vers Plausible (suppression bannière cookies)

### Sur l'horizon
- Cluster contenu par type de véhicule (camping-car, poids lourd, utilitaire, quad)
- Articles par durée et véhicules étrangers
- Prioriser le contenu sur les profils résiliés / malussés

---

## 8. Règles de travail (à respecter par Claude Code)

- **Aucun em-dash (U+2014) nulle part**, ni code ni contenu. Vérifier avec `rg`.
- **Contenu YMYL (assurance)** : vérifier les faits par recherche web avant d'écrire (amendes, articles de loi, règles de couverture). Ne jamais générer de mémoire.
- **Animations** : transform et opacity uniquement (GPU), jamais width/height/top/left/margin. Aucun layout shift.
- **Build** : toujours `npm run build` (jamais `npm run dev` en arrière-plan) : le script enchaîne Vite build puis `prerender.mjs` (prérendu statique). `git push` après chaque session pour déclencher le redéploiement Vercel.
- **npm install** : toujours passer `--legacy-peer-deps` (configuré dans `.npmrc`) sinon l'install échoue.
- **Clés d'objet JS avec tiret** : toujours entre guillemets (ex. `"republique-tcheque"`, `"bosnie-herzegovine"`).
- **Éviter les spécificités volatiles** dans le contenu pays (prix exacts, montants d'amendes, limites de zones) pour garder le contenu juste dans le temps.
- **Prompts ciblés** : préférer une tâche unique précise à un gros prompt multi-fonctions.
- **Style** : voix AssuTempo professionnelle, concise, ton "conseil d'ami", sans humour.

---

## 9. Différenciateurs vs concurrence

- Design nettement supérieur au .com (WordPress figé depuis 2018)
- Profondeur de contenu (34 pages pays, cluster urgence, données structurées)
- Cellule de souscription d'urgence 24/7 (automatisation hors horaires, à venir)
- Ancienneté du domaine depuis 2023
- Programme partenaires B2B avec extranet et commissions mensuelles
