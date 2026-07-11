# AssuTempo - Référence projet

> Document de contexte pour le site assutempo.fr. À placer à la racine du projet (CLAUDE.md) pour que Claude Code dispose du contexte à chaque session.
> Dernière mise à jour : 11 juillet 2026.

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
- **Vraie page 404** (`src/pages/NotFound.jsx`, "Cette route ne mène nulle part", CTA devis/accueil/carte, noindex, 1,4 KB gzip) : route catch-all `*` dans ROUTE_TABLE (câblée dans App.jsx ET entry-server.jsx, parité hydratation), prérendue en `dist/404.html` HORS sitemap par `buildPageHtml()` dans prerender.mjs.
- **Page carte grise réorganisée : iframe Certimat visible dès l'entrée.** Nouvel ordre : hero compact (140/40 de padding, CTA "Démarrer ma demande" supprimé car devenu inutile, event GA4 `clic_carte_grise` retiré avec lui, `carte_grise_view` au load de l'iframe conservé), module Certimat en 2e section (haut du cadre à 584px desktop / 738px mobile : premier écran partout), puis Comment ça marche, bande de confiance, FAQ, cross-sell. Iframe et grille 3 colonnes inchangées (`partner=1153`, resize postMessage, rails sticky).
- **Rewrite catch-all de vercel.json RETIRÉ** : toutes les routes ont leur HTML physique, une URL inconnue tombe sur `dist/404.html` avec un vrai statut 404 (fin du soft-404). **Ne JAMAIS remettre de rewrite vers index.html** : il retransformerait chaque 404 en 200. Slug pays inconnu (`/carte/xyz`) : 404 côté serveur, puis le client retombe en douceur sur la Carte générique (comportement vérifié, 0 erreur). Vérifié en prod : 200 sur les vraies pages, 404 + page stylée sur les inconnues, sitemap 56 URLs intact.

### Session du 8 juillet 2026 : refonte du compteur de jours (odomètre à ressort), en prod
Le compteur du module Devis express passe des transitions CSS retargetées (saccades, roue des unités en marche arrière aux dizaines, Intl par événement) à une chaîne framer-motion : `useMotionValue` + `useTransform` + `useSpring` (stiffness 110, damping 20), un seul point de mutation `renderCounter` abonné au ressort, zéro re-render. Le scroll remonte le compteur de 1 vers la valeur choisie (fenêtre p 0,30-0,55, cible quantifiée au jour entier), le curseur retarget le même ressort ; arc, aiguille, graduations, halo doré (vélocité du ressort), date et curseur dérivent du même signal. `applyVisual`/`zeroed` supprimés du cadran (`setDaysLive` en continu, `engage()` pour la pause de rotation). Écart assumé : pas de `useScroll` framer, la rampe est posée par la boucle rAF unique existante (règle du 3 juillet). **La valeur AFFICHÉE fait foi partout : tunnel et GA4 reçoivent `shownDayRef`, plus jamais la sélection brute.** Revue adversariale multi-agents (2 confirmés + 4 réels corrigés : resync au blur, cache de date purgé par jour, parking entre chiffres, retour arrière du pouce post-drag, pluriel "1 jour", aria init), QA Playwright dédiée **51/51**, +0,6 KB gzip, lint baseline. Détails dans SCROLLY-QA.md.

### Session du 8 juillet 2026 (suite) : hero lisible dès le premier paint, en prod
Constat : hero vide plusieurs secondes sur mobile (seul le cadran visible). L'audit a écarté le JS (prouvé JS bloqué : la chorégraphie d'entrée est en CSS pur et joue sans bundle). La cause : les états `from` des animations d'entrée masquaient TOUT le texte au premier paint (H1 clippé translateY(110%), reste à opacity 0), avec 1,3 s de révélation après un premier paint déjà tardif sur téléphone lent. Correctif : **plus jamais d'état from invisible sur du contenu critique** : opacity 0,6 minimum, déplacements légers, durées 0,4 s max, délais 0,15 s max, masque overflow du H1 retiré. Vérifié JS bloqué : tout lisible à 120 ms, 100 % à 300 ms ; banc compteur 51/51 re-passé. Détails dans SCROLLY-QA.md.

### Session du 8 juillet 2026 (fin) : CSS critique inline, en prod
Constat d'Ayoub : page noire ~8 s avant tout affichage sur téléphone. Cause : la feuille `/assets/index-*.css` était la SEULE ressource bloquant le rendu ; sur un lien mobile dégradé (et sous Safari iOS où elle concurrence les ~150 KB de modulepreload), elle peut arriver plusieurs secondes après le HTML : écran noir tant qu'elle n'est pas là. Correctif : `prerender.mjs` inline la feuille en `<style>` dans chaque HTML prérendu (57 fichiers) : **plus aucune sous-ressource ne conditionne le premier paint**. Preuves : toutes sous-ressources retenues 8 s, hero peint à 204 ms ; FCP throttle 1020 ms → 364 ms ; Home 16 → 20,8 KB gzip ; banc compteur 51/51. **Règle : ne jamais réintroduire de `<link rel="stylesheet">` bloquant dans le template ; toute nouvelle CSS doit finir dans le bundle inliné ou en chargement asynchrone.**

### Session du 8 juillet 2026 (nuit) : écran noir iPhone résolu (orbes floutées), en prod
Malgré le CSS inline, encore ~7 s de noir sur iPhone. Cause : le HTML prérendu suppose desktop (snapshot SSR de BackgroundFX), donc tout mobile recevait 3 orbes de 500-700 px en `blur(110px)` ANIMÉES + halo CTA `blur(60px)` animé, la coupure mobile n'arrivant qu'à l'hydratation : pendant toute la fenêtre de chargement du JS, le GPU de l'iPhone rastérise ces surfaces en DPR3 à chaque frame, rendu figé. Correctif : filtres et animations déplacés des styles inline vers des classes CSS (`fx-orb-*`, `fx-halo-cta`, `fx-pt*`) coupées par la media query mobile existante, effective dès le premier paint sans JS. **Règle générale : tout effet coûteux (blur, animation, blend) d'un composant SSR doit être gaté en CSS media query, jamais par un flag JS post-hydratation : le HTML prérendu vit plusieurs secondes seul sur mobile.** Preuves WebKit : rendu non-noir 1578 → 853 ms et FCP 742 → 126 ms sur GPU de Mac (écart bien plus grand sur iPhone). Banc compteur 51/51. Détails dans SCROLLY-QA.md.

### Session du 10 juillet 2026 : fondations GEO/SEO, en prod
Audit complet (AUDIT.md) puis pose des fondations pour être cité par ChatGPT/Perplexity/Gemini/AI Overviews et indexé en heures (PLAN.md, QA.md, RECAP.md à la racine). Push direct sur main, vérifié en live.

- **Entité sitewide** (index.html) : `["Organization","InsuranceAgency"]` + identifier ORIAS 20005719, logo `/logo.png` (créé : les 12 articles référençaient un logo INEXISTANT), sameAs vérifiés (societe.com + annuaire-entreprises, EA AGENCY SIREN 884641523 ; Pappers 403 et orias.fr sans lien profond : exclus).
- **FAQPage sur Home et /faq** (gap critique : les 2 pages les plus citables n'en avaient pas). Règle : le schéma FAQPage se génère depuis le MÊME tableau que l'accordéon affiché (`src/data/faqHome.js` partagé rendu/schéma pour la Home) ; jamais de contenu invisible.
- **datePublished** (dates git réelles) ajouté aux 12 articles ; Services /tarification et /carte-grise reliés à l'entité par `@id`, serviceType précisés.
- **Sitemap lastmod réels** : prerender.mjs calcule par route la dernière date git des fichiers sources (fichier non commité = aujourd'hui, fallback 2026-06-23). Constaté : le clone Vercel est shallow et l'unshallow y échoue (fallback silencieux) ; les pages anciennes portent la date frontière du clone (~1 jour d'écart), les pages modifiées sont exactes. Ne JAMAIS remettre de lastmod fixe.
- **robots.txt** : sections Allow explicites pour 10 bots IA (GPTBot, OAI-SearchBot, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, Bingbot, CCBot, Amazonbot, Applebot-Extended).
- **IndexNow** : clé `333c3e14ba12a91b5b09cf6eaa5315ac` dans public/, `scripts/indexnow.mjs` (Node natif), workflow GitHub à chaque push main. Premier ping : HTTP 200, 56 URL acceptées. Chaque publication est désormais signalée à Bing (l'index de ChatGPT) en minutes.
- **AnswerCapsule** (`src/components/articles/AnswerCapsule.jsx`) : bloc "La réponse en bref" (réponse de 50 mots max + 3 faits à chips ancrées + date de màj), 100 % statique (contenu critique : pas d'état initial invisible, règle du 8 juillet). Posé sur les 3 articles achat/carte grise via le champ `answerCapsule` des data ; à étendre aux autres articles.
- QA : 151 blocs JSON-LD valides sur 57 pages, 0 erreur console (6 routes vérifiées navigateur), 0 tiret interdit, 0 dépendance, JS total inchangé (335,7 KB gz). Audit : perf, redirections (www = 1 saut 308), soft-404 et GA4 déjà en place, rien touché.
- Actions manuelles restantes pour Ayoub : compte Bing Webmaster Tools (import GSC en 2 clics) + surveiller la couverture GSC. Décision en attente : visuel og:image 1200x630.

### Session du 11 juillet 2026 : pilote automatique GitHub (missions @claude), en prod
- App GitHub Claude installée via `/install-github-app` (PR #3 de l'installateur mergée), secret `CLAUDE_CODE_OAUTH_TOKEN` posé dans le repo (abonnement Claude, pas de clé API).
- `.github/workflows/claude.yml` remplacé par le workflow **Claude Mission** : déclencheurs `issues: opened` et `issue_comment: created` si le corps contient `@claude` ; permissions write (contents, pull-requests, issues) + id-token ; concurrency `claude-mission` sans cancel-in-progress ; timeout 45 min ; `anthropics/claude-code-action@v1` avec `--max-turns 40 --model claude-sonnet-5`.
- `claude-code-review.yml` (revue automatique de chaque PR, posé par l'installateur) conservé tel quel : il relira aussi les PR produites par les missions.
- Règles permanentes des exécutions automatiques ajoutées en section 10 (zones interdites, branches draft/PR, pattern article, YMYL, style, design articles).
- Test réel validé : issue #4 "Test pilote Claude" traitée en 12 s (commentaire correct, aucun fichier modifié). Le commentaire de réponse a re-déclenché le workflow qui s'est bien auto-ignoré (skipped, pas de @claude dans le corps) : pas de boucle possible.

### Session du 11 juillet 2026 (suite) : full-auto (Gate + auto-merge + IndexNow), en prod
Le pipeline éditorial est 100 % automatique : issue @claude > mission cloud > PR ouverte par le workflow > Gate > merge automatique > Vercel > ping IndexNow. Boutons d'urgence : label `hold` (bloque le merge), commentaire @claude (corrige), merge/revert manuel toujours possible.

- **Portique `scripts/quality-gate.mjs`** (Node natif, zéro dépendance) : sur le diff vs origin/main, échoue si tirets interdits ou expressions bannies dans les lignes ajoutées, dependencies/devDependencies touchées, zone interdite modifiée (Navbar, Footer, Pricing, CarteGrise, About, AssuranceInternationale, `.github/`, le portique, indexnow.mjs, vercel.json : liste en dur commentée dans le script), ou URL du sitemap sans page dans dist/. PR dependabot : périmètre `.github/workflows/` uniquement (env `GATE_AUTHOR`).
- **Gate (`.github/workflows/gate.yml`)** : entrées `pull_request` ET `workflow_dispatch(pr_number)` ; jobs contexte (résout PR, branche, auteur, label hold) > gate (npm ci + build + portique) > automerge (squash, suppression de branche, fermeture explicite de l'issue liée, puis rebuild + ping IndexNow dans le même job : un merge par token Actions ne déclenche pas les autres workflows).
- **Contraintes de l'action apprises en test réel** : l'action épingle chaque mission sur `claude/issue-N-*` (création de branche et ouverture de PR impossibles depuis la session) ; d'où le post-traitement de claude.yml : `gh pr create` + `gh workflow run gate.yml` (workflow_dispatch est la seule exception documentée à l'anti-boucle GitHub). `--allowedTools` s'AJOUTE aux outils de base ; missions dotées de WebSearch/WebFetch + npm/node ; **max-turns 200** (40 puis 100 = échecs constatés : une mission 2 articles avec vérifications web consomme 100 tours en 15 min ; le timeout 45 min reste le garde-fou). Concurrency par issue au NIVEAU JOB (au niveau workflow, chaque commentaire sans @claude éjectait les missions en attente de la file : vécu sur l'issue #6). Une PR créée par le token Actions a pour auteur **`app/github-actions`** dans l'API (pas `github-actions[bot]`) : la liste d'auteurs de l'automerge doit le contenir (vécu sur PR #11, automerge sauté).
- **Preuves en conditions réelles** : PR piégée #9 bloquée par le portique (expression bannie, fichier:ligne) ; PR #10 (journal) mergée automatiquement + IndexNow HTTP 200 (56 URL) ; PR dependabot #7 et #8 auto-mergées en autonomie complète (dependabot.yml : actions GitHub, weekly). Revue Claude sautée sur PR dependabot (GitHub ne leur transmet pas les secrets).
- **Soirée du 11 juillet : premières missions réelles au bout.** PR #11 (article test, issue #5) et PR #13 (mission GEO 2 articles, issue #12) mergées seules, IndexNow OK, articles en prod. Trois enseignements : (1) la vraie cause des échecs du matin était le plafond de tours (200 tours ont suffi) ; les outils explicites Bash + fichiers + git de claude.yml (47a1deb) restent en défense, mais la mission gagnante a tourné avec les outils de base ; (2) le job automerge doit avoir `issues: write`, sinon `gh issue close` échoue en silence (GraphQL: Resource not accessible, issues #5 et #12 restées ouvertes, corrigé en 62ff5df) ; (3) une mission ne doit JAMAIS « synchroniser avec main » en recopiant des fichiers : le diff trois-points du portique voit alors les fichiers de main comme modifiés par la branche (faux positif zone interdite sur claude.yml, Gate de 21h03 sur la PR #13) ; seul un vrai merge de `origin/main` réaligne le merge-base.

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

- **Aucun tiret cadratin (U+2014) ni demi-cadratin (U+2013) nulle part**, ni code ni contenu. Vérifier avec `rg`.
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

---

## 10. Pilote automatique GitHub (missions @claude)

Depuis le 11 juillet 2026, les missions s'exécutent seules dans GitHub Actions : une issue (ou un commentaire) contenant `@claude` déclenche `.github/workflows/claude.yml` (workflow "Claude Mission"). Les règles de la section 8 s'appliquent intégralement ; celles ci-dessous s'y ajoutent pour toute exécution automatique.

### Zones interdites (ne jamais modifier)
- Header et footer globaux.
- Page `/tarification` au-delà des balises meta : iframe et logique du tunnel JL Assure figées.
- Iframe Certimat de `/carte-grise`.
- Formulaires B2B (partenaires) et international.

### Branches, merge, dépendances
- En mission automatique, travaille sur la branche fournie par la session (`claude/issue-N-...`) : ne tente ni de créer une autre branche ni d'ouvrir la Pull Request, c'est le workflow qui ouvre la PR en fin de mission et le Gate (`.github/workflows/gate.yml` + `scripts/quality-gate.mjs`) qui la contrôle puis la merge automatiquement. Ne merge jamais toi-même. Le label `hold` sur une PR bloque l'auto-merge. Ayoub peut toujours merger, fermer ou reverter manuellement.
- Si une instruction de mission contredit CLAUDE.md, CLAUDE.md gagne, et le signaler dans la PR.
- Si `main` a avancé pendant la mission, ne JAMAIS « synchroniser » en recopiant des fichiers de main dans la branche : faire un vrai `git merge origin/main` (sinon le portique voit les fichiers de main comme modifiés par la PR : faux positif zone interdite).
- Correctifs techniques purs : commit direct sur `main` autorisé.
- Aucune nouvelle dépendance npm, jamais. Si indispensable : s'arrêter et l'expliquer dans la Pull Request.
- Chaque session se termine par `npm run build` (jamais `npm run dev`) ; corriger jusqu'à build propre.

### Pattern article (obligatoire pour tout nouvel article)
- Suivre exactement le pattern existant : structure de données, route, prerender, sitemap avec lastmod du jour.
- JSON-LD Article + FAQPage + BreadcrumbList (toujours via le helper `jsonLd()` de `src/lib/seo.js`).
- AnswerCapsule en tête : réponse directe de 50 mots max + 3 faits datés.
- H2/H3 formulés en vraies questions.
- Maillage interne vers 3 ou 4 pages, dont le duo croisé assurance / carte grise.
- Title < 60 caractères, meta description < 155, slug court.
- CTA final vers `/tarification` ou `/carte-grise`.

### YMYL et sources
- Vérifier tout chiffre légal par recherche web ; citer service-public.fr, legifrance.gouv.fr ou ants.gouv.fr ; dater les faits.

### Style anti-détection IA
- Varier fortement les longueurs de phrases et de paragraphes.
- Bannir : "dans un monde où", "il est important de noter", "de nos jours", "n'hésitez pas", "en résumé", "force est de constater".
- Pas de symétrie mécanique ni d'empilement de puces.
- 1 à 2 détails concrets crédibles et une nuance honnête par article.

### Design des articles
- Fond `#0A0A0A`, or `#C9A84C`.
- Aucun PNG/JPEG dans la zone articles : SVG inline, CSS, texte uniquement.
- Aucun prix affiché.
- Contenu 100 % statique dans le DOM ; animations en opacity/transform uniquement.
