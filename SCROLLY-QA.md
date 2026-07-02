# SCROLLY-QA : hero scrollytelling "Cadran Assutempo"

## Build
- `npm run build` : exit 0. Seuls warnings : 3x "Unknown at rule @tailwind" (lightningcss), preexistants sur main (index.css:10-12), inchanges.
- Console navigateur : 0 erreur sur tout le parcours (desktop, mobile 375/430, reduced-motion). Deux TypeError potentiels (rAF et timer se presentant apres le detachement du DOM pendant une navigation) ont ete detectes par la QA puis corriges par gardes de refs (commit 383f0a5), re-verifies a zero.

## Lighthouse mobile (medianes de 3 runs, throttling simule, vite preview local, Chrome headless)
| Etat | Perf | FCP | LCP | CLS | TBT |
|---|---|---|---|---|---|
| Avant (main) | 72 | 2743 ms | 6615 ms | 0 | 36 ms |
| Apres (branche) | 73 | 2740 ms | 6552 ms | 0 | 40 ms |

- LCP inchange (delta -63 ms, dans le bruit inter-runs de ±80 ms). Element LCP = ligne du H1, present dans le HTML prerendu.
- CLS = 0 avant comme apres : dimensions du cadran et hauteur de zone reservees en CSS initial, module Devis express hors flux (absolute).

## Budget bundle (somme gzip des chunks JS+CSS de dist/assets)
- Avant : 335 897 B. Apres : 340 164 B. **Delta : +4 267 B = 4,17 KB gzip** (budget : 9 KB). Zero bibliotheque, zero police, zero image, zero requete reseau ajoutee ; SVG inline genere post-hydratation.

## FPS (cible >= 55)
- Chrome desktop 1440x900 : scroll de transition aller-retour **61 fps**, remplissage continu du curseur 1-90 **61 fps**, idle **61 fps**.
- Proxy telephone milieu de gamme (CPU throttling x4, 390x844) : idle **61**, scroll de transition **61**, remplissage **61 fps**.
- Aucune finition n'a du etre allegee : le travail par frame se limite a des ecritures transform/opacity.
- Flou (point 11) : aucun feGaussianBlur. Lueurs par degrade radial pre-floute (point d'aiguille), box-shadow (comete existante) et conic-gradients deja en place.

## Cas limites (Playwright + Chrome 149, 40/40 PASS)
- Scroll rapide haut/bas x10 : etat "cadran pur" exact au retour (fill 0, 0 graduation allumee, arc vide), acte 1 restaure.
- Rechargement a mi-scroll (p=0.66) : etat immediatement correct, derive de p (copy 0, module 0.97).
- Retour navigateur depuis le tunnel : etat coherent avec la position restauree, 0 erreur.
- Rotation d'ecran en plein acte 2 (375x812 vers 812x375) : p recalcule, module et bloc hero coherents.
- Machine a etats : arret de la rotation en ~600 ms (delta mesure 0.000 deg sur 600 ms), memoire 3 s, reprise douce (4,6 deg/s mesures), **l'arc reste rempli** (offset 108,7 pour 45 j).
- prefers-reduced-motion : comete figee, transitions instantanees (arc a 60 j : offset exact sans animation), module pilote a l'opacite seule, parcours complet fonctionnel, 0 erreur.
- Comete idle mesuree a 4,80 deg/s (1 tour / 75 s) ; handoff CSS vers rAF sans saut (lecture de la matrice de transformation).

## Tunnel
- CTA "Continuer mon devis · 2 min" route vers `/tarification?duree=N` ; l'iframe JL Assure recoit `&duree=N` (verifie en QA avec duree=30, et cote serveur : l'input cache `pref_duree` du formulaire est rendu avec la valeur).
- Diff du tunnel : **aucun**. Diff de `Pricing.jsx` limite a : constante IFRAME_SRC extraite (URL strictement identique), ref sur l'iframe, useEffect qui ajoute `&duree=N` (entier valide 1..90) apres hydratation. Etapes et champs inchanges : le pre-remplissage est le mecanisme natif du formulaire JL Assure.

## Rendus verifies
- 375 px et 430 px (UA iPhone, touch) : 0 px de debordement horizontal, zone tactile du curseur 44 px, captures acte 1 / acte 2 controlees visuellement.
- Non-regression : le TempoDial de /assurance-internationale garde son animation 17 s (surcharges scopees .atc, page intacte).

## Regle de Chanel : finition retiree = sillage d'aiguille (finition 4)
L'arc qui se remplit est la star, et sa tete (aiguille-point lumineuse + eclats de graduations) constitue deja une trainee de lumiere. Le sillage doublait le meme evenement lumineux, au meme endroit, au meme instant : c'etait le seul raffinement qui concurrencait la hierarchie. Retrait chirurgical en commit dedie (24ea494 pose, retrait apres controle visuel), revert possible.

## Correctif mobile du 2 juillet (acte 2 en instrument) : verification 375 et 390 px
- **Cadran entier visible** : rect mesure [19, 166, 356, 504] dans 375x812 et [19, 175, 371, 527] dans 390x844 : aucun arc coupe, aucune lueur tronquee (masque de fondu retire en mode instrument). Diametre 90vw plafonne 420 px.
- **Composition instrument** : eyebrow + odometre + "Jours de couverture" centres DANS le cercle ; date, slider, CTA, reassurance en dessous ; CTA au-dessus du pli (bottom 653 < 812). Bloc centre optiquement, plus de grand vide sous le header.
- **Aucun texte a l'envers** : reperes 15/30/45/60/75/90 toujours horizontaux (position sur cercle interieur, aucune rotation), verifies lisibles sur captures 1 j, 45 j, 90 j.
- **Aiguille** : halo reduit de moitie sur mobile (scale .5, transform-box fill-box), trait affine ; la face centree ne chevauche jamais la ligne d'aiguille (l'aiguille vit pres du rail, r 28.6 a 34.6).
- **Slider stylé** : piste 5,5 px arrondie rgba(232,199,102,.15), remplissage degrade C9A84C vers E8C97A synchronise via --f (JS a chaque input), pouce 27 px a lisere clair et halo, zone tactile 44 px, styles webkit ET moz. Verifie rempli a 1, 45 et 90 jours (captures).
- **Odometre sans artefact** : encre centree par cellule (flex 1em) + police arrondie au pixel entier (les em fractionnaires de 22vw laissaient un lisere du chiffre voisin sur iOS). Passages 9 vers 10 et 89 vers 90 verifies : aucun residu, aucun saut de layout (recentrage en transform).
- **Convention de date confirmee** : fin = debut + (jours - 1). 1 jour le 2 juillet affiche "jusqu'au 2 juillet" (capture) ; le tunnel recoit la duree en jours (?duree=N), coherent.
- **Desktop inchange** : groupes .dx-face/.dx-controls en display:contents (rendu strictement identique), transform scale(1.03) conserve, verifie par capture 1440 px.
- Transition acte 1 vers acte 2 : le texte hero sort vers le haut, le cadran retrecit et se recentre en douceur (interpolation translate + scale liee a p2, geometrie mesuree sur .dx-face, invalidee au resize et a l'orientation).
- Note de mesure : suite 37/40 lors de ce passage, les 3 echecs etant les mesures FPS a 31 fps uniformes y compris page blanche temoin (plafond rAF de l'environnement au moment du test, machine throttlee) ; la veille, meme suite a 61 fps partout sous plafond 60. Aucune regression propre au code.

## Ecarts assumes (complement du SCROLLY-PLAN)
- Libelle CTA avec point median ("· 2 min") au lieu du tiret long de la spec : regle projet "aucun em-dash".
- text-shadow du grand nombre retire apres controle visuel : il produisait un pave lumineux disgracieux sur mobile.

## Correctif du 2 juillet (widget "Besoin d'aide ?" + header mobile) : verification 375 et 390 px
Branche fix/chat-launcher-mobile. QA Playwright dediee **51/51 PASS** (chromium, UA iPhone, tactile, captures 375x812 et 390x844 controlees visuellement). Budget : **+915 B gzip**. Console : 0 erreur sur les 6 contextes testes.

- **Lanceur entier en bas a droite** : bouton circulaire 56 px mesure a [303, 740, 359, 796] dans 375x812 et [318, 772, 374, 828] dans 390x844, soit un ancrage exact right 16 px / bottom 16 px (+ safe-area en usage reel) ; rien de coupe, aucun debordement horizontal (scrollWidth = largeur viewport). Cause racine corrigee : sous 520 px, le conteneur fixe du widget recevait left ET right (bande pleine largeur pour l'ancien panneau) et le bouton, enfant en flux, partait au bord GAUCHE avec son etiquette centree hors viewport. Le conteneur n'a plus jamais de left.
- **Pulsation contenue** : anneaux qui s'etendaient supprimes (halo -8 px et badge -3 px retires). Le lisere dore respire en opacite seule (cycle 3 s) sur un pseudo-element inset 0, et le bouton est en overflow hidden : verifie par styles calcules, rien ne sort des 56 px. Fond #141210, anneau rgba(232,199,102,.4), bulle doree centree.
- **Etiquette solidaire, jamais orpheline** : pastille "Besoin d'aide ?" dans le meme conteneur flex, a gauche du bouton (centres verticaux alignes a < 1 px, mesure), entierement dans le viewport. Chronologie verifiee : visible a 1,5 s, replie a 6,5 s (opacity 0 + visibility hidden mesures), repli en transform/opacity (origine a droite, vers le bouton). Horloge pilotee (page.clock) : retour apres exactement 30 s d'inactivite ; une activite a mi-parcours repousse le compteur (verifie) ; navigation et ouverture du panneau replient et remettent a zero.
- **Cohabitation avec les CTA** : pendant le drag reel du curseur du cadran (pointerdown + mouvement), le dock passe a opacity 0 en < 450 ms et revient a l'arret (verifie a 375 et 390, evenement assutempo:instrument-drag emis par le slider, pointer capture natif du range = pointerup garanti). Sonde de chevauchement (elementsFromPoint sur .btn-gold/.btn-glass, throttle rAF sur scroll/resize, ignore nativement les CTA masques ou pointer-events none) : preuve mecanisme par CTA injecte en bas a droite = dock a 0.4 puis retour a 1 apres retrait ; en usage reel a l'acte 2, le CTA devis ne chevauche pas le lanceur a 375/390 (geometrie mesuree), opacite 1 conforme.
- **Feuille de chat mobile** : tap = feuille position fixed pleine largeur (left 0 a right viewport), hauteur 747 px pour 812 (92svh exact), ancree en bas, coins superieurs arrondis, fermeture X explicite en haut (~90 px du haut, visible), fermeture verifiee ; mention legale ecartee de l'indicateur home (safe-area). Logique conversationnelle strictement inchangee (aucun diff API/messages). Desktop inchange : panneau flottant 380 px (mesure), chevron de reduction conserve.
- **Header opaque au scroll (mobile)** : sur la section vehicules, background calcule rgb(10, 10, 10) plein ; avant, rgba(10,10,10,.94) laissait transparaitre les vignettes AUTOCAR/PICK-UP derriere le logo. Hauteur inchangee (68 px), desktop conserve translucide + blur 12 (vrai masquage), capture de controle : les vignettes se coupent nettement au bord du header.
- **Reduced-motion** : pulsation coupee (animation none, lisere statique invisible), etiquette affichee et masquee sans animation (bascule 0,01 ms via la regle globale du site), meme calendrier, verifie par styles calcules.
- Lint : 0 erreur ; 2 warnings nouveaux react-hooks/set-state-in-effect, du meme type que les 3 preexistants sur main (pattern etabli du fichier assistant).

## Affinage du 3 juillet (fluidite, collisions, rythme) : profil avant/apres et verification
Branche polish/hero-fluidite. QA dediee **40/40 PASS** + re-profil complet. Budget : **+274 B gzip**. Console 0 erreur sur tous les contextes.

### Chasse au jank : profil AVANT (390x844 DPR3, CPU 4x, scroll de transition 3,2 s, trace CDP)
Constat prealable : le banc Mac ne sature pas (60,3 fps au 4x et encore 59,7 au 14x), la saccade iPhone ne s'y reproduit donc pas en fps. Les coupables ont ete identifies par les compteurs de travail par frame (ce qui sature un GPU/CPU de telephone) puis confirmes par neutralisation A/B une cause a la fois.

Les 3 coupables mesures :
1. **gold-shift, l'animation du degrade de "tout." dans le H1** (background-position, propriete NON compositable) : **424 evenements Paint / 127 ms** sur 3,2 s de scroll, soit 2 repaints par frame, qui invalidaient et re-rasterisaient en DPR3 toute la couche du bloc texte pendant sa translation. Preuve causale : gold-shift coupe seul, Paint tombe a 1. L'animation tournait aussi au repos (boucle infinie 6 s) : memes repaints par frame a l'arret, hero a l'ecran.
2. **Trois callbacks rAF par frame** : boucle scroll du hero + boucle de rotation du cadran + sonde CTA du lanceur (5 elementsFromPoint par frame). FunctionCall 541x/80 ms sur la fenetre, 2,5 appels JS par frame.
3. **Surfaces compositeur sur mobile** : grain-overlay plein viewport en mix-blend-mode overlay (re-melange avec toute la page a chaque frame de scroll) + filter blur(.5px) sur la trainee en rotation continue + double masque radial. Cout invisible sur le GPU d'un Mac, reel sur un GPU de telephone (retires sur mobile par principe, cf. spec).

Verifies au passage : **aucun feGaussianBlur** dans le SVG du cadran (lueurs = degrades radiaux pre-composes, conforme) ; **aucun layout force** pendant le scroll (Layout = 0 dans toutes les traces) ; aucun backdrop-filter dans l'etage sticky.

### Corrections et profil APRES (meme protocole)
- gold-shift **fige sur mobile** (degrade statique a mi-course, rendu dore identique) via media query pointer coarse / <=820px ; **conserve sur desktop** (61 fps prouves de longue date).
- **Fusion des boucles** : le cadran n'a plus de rAF propre, il expose frame(ts) appele par la boucle unique du hero ; la progression n'est appliquee que si scrollY a change, avec geometrie de zone en cache (zero getBoundingClientRect par frame) ; reprise sans saut apres pause (>0,5 s) ; reduced-motion : la boucle ne tourne pas a vide, re-armee par les evenements.
- **Sonde CTA du lanceur throttlee a 200 ms** avec rattrapage trainant en fin de geste (~5 sondes/s au lieu de 60 pendant un scroll).
- Mobile : **grain en blend normal** (texture conservee, surface de blend supprimee) et **trainee sans blur** (scope .atc : le TempoDial d'AssuranceInternationale garde son blur et sa rotation CSS 17 s, verifie).

| Metrique (scroll transition 3,2 s, CPU 4x) | Avant | Apres |
|---|---|---|
| Paint (main thread) | 424x / 127 ms | **1x / 1 ms** |
| Recalculs de style | 66-85 ms | 56 ms |
| JS (FunctionCall) | 541x / 80 ms | 522x / 72 ms |
| Layout force | 0 | 0 |
| FPS banc Mac 4x | 60,3 | 60,3 (>=55 : valide) |
| Repaints au repos (hero a l'ecran, 2,5 s) | ~2/frame (gold-shift en boucle) | **1 au total** |

Ecart assume (point 4 de la spec) : 6 couches promues statiquement (cadran, comete, anneau dashe, trainee, bloc texte, module) au lieu de 3-4 posees/retirees dynamiquement. Chacune est ecrite chaque frame (rotation continue) ou chaque frame de scroll ; un will-change togglable declencherait une re-rasterisation exactement au demarrage du geste, le pire moment. Census documente, aucune couche inutile.

### Collisions typographiques (375x812 et 390x844)
- **30 et 60 retires sur mobile** (classes atc-num-v30/v60, display none sous 768px) : plus rien ne traverse "JOURS DE COUVERTURE". Restent 15 - 45 - 75 - 90 sur les diagonales et l'axe vertical (verifie : caches=[30,60], visibles=[15,45,75,90]).
- **Letter-spacing du label reduit** (.24em -> .14em) : "JOURS DE COUVERTURE" mesure 177 px pour un plafond a 76 % du diametre de 257 px (375) / 267 px (390), soit un air > 12 % du diametre de chaque cote.
- **Fondu de proximite** (detail horloger) : tout repere a moins de 14 degres de l'aiguille (= tete de l'arc) s'estompe a opacite 0 en 200 ms et revient quand elle s'eloigne. Verifie aux 5 valeurs imposees : 1 j -> 90 estompe (aiguille a 4 deg de midi), 15 j -> 15, 45 j -> 45, 60 j -> rien a proximite (60 n'existe plus sur mobile, voisins a 60 deg), 90 j -> 90 estompe sous l'aiguille. Retour acte 1 (cadran pur) : aiguille masquee, tous les reperes reviennent.
- **Zero chevauchement** aux 5 valeurs : boites englobantes des reperes visibles et du point d'aiguille testees contre eyebrow, odometre, label et date : aucune intersection.

### Rythme (zone 210vh, fondu croise)
- Zone de scroll **280vh -> 210vh**. Nouvelle partition : sortie du texte sur p 0 -> 0,30 (mouvement ease-out conserve, **fondu lineaire** : l'ease-out sur l'opacite faisait disparaitre le texte des p~0,15 et ouvrait le temps mort constate) ; entree du module sur p 0,26 -> 0,52 (tuilage) ; module entierement en place mesure a **p = 0,50** ; le reste de la zone est une respiration courte.
- **Balayage par pas de 5 %** (21 pas, 0 -> 1) : a chaque pas, max(opacite texte, opacite module) >= 0,1 : l'ecran ne montre JAMAIS le cadran seul (releve complet conserve, fondu croise capture a p = 0,28).
- Seuils deriere p2 (pointer-events a 0,6, evenement GA devis_express_view) inchanges en semantique.

### Non-regressions
- Lanceur : 56 px bas-droite (16/16), dock efface pendant le drag du slider et de retour a l'arret, valeur slider + CTA intacts apres drag.
- TempoDial /assurance-internationale : blur(.5px) et rotation CSS 17 s intacts (surcharges scopees .atc uniquement).
- Desktop : gold-shift anime conserve, grain overlay conserve, partition de scroll identique a mobile (210vh).
- reduced-motion : module pilote a l'opacite seule, texte sorti, 0 erreur ; la boucle unique ne s'auto-planifie pas (re-armement par evenements).
- Bonus batterie : plus aucun repaint au repos sur le hero mobile (1 Paint en 2,5 s contre ~2/frame avant).

## Audit chargement du 3 juillet (constat "6 s sur iPhone") : mesures, causes, corrections
Branche perf/audit-chargement. QA **25/25** (audit) + non-regressions **52/52** (lanceur) et **40/40** (hero). Lint 0 erreur. Total dist : 345,6 KB gzip (+3 KB de decoupage, mais chemin critique en forte baisse).

### Mesures AVANT (Lighthouse mobile, 3 runs, medianes)
- Local (vite preview, build main) : Perf 93, FCP 2256 ms, LCP 2766 ms, TBT 67 ms. Le build etait sain et conforme a l'audit de juillet.
- **Production reelle : Perf 86 median avec forte variance (76 a 90), LCP 3193 ms median, pointe a 4866 ms** : c'est cette variance reseau/tiers qui rejoint le ressenti 6 s sur iPhone.
- Redirections : https://assutempo.fr direct = 0 redirection ; www = 1 saut (https) a 2 sauts (http), +0,25 a +0,37 s mesures sur bonne connexion (davantage en 4G).
- HTML prerendu : 16 KB brotli transfere (sain). Polices non bloquantes (sain).

### Causes identifiees (composition mesuree du chemin critique)
1. **Pile analytics de ~310 KB au demarrage** : gtag GA4 (165 KB) chargee au montage React, qui chaine une propriete **Universal Analytics MORTE** (UA-264084182-1, 123 KB, sunset 2023) + l'ancien analytics.js (21 KB). Le tout en concurrence de bande passante et de CPU avec l'hydratation.
2. **Chunk principal de 62,5 KB gzip dont la moitie n'avait rien a y faire** (attribution par sourcemap) : `countries-content.js` 83 KB source (TOUT le contenu redactionnel des 34 pages pays, importe par la section pays de la Home pour 3 champs) + l'assistant complet ~80 KB source (composant + styles + tour), monte dans le shell.
3. **Fenetre de loader sur les acces directs** (prexistant, verifie empiriquement sur /faq : chunk ralenti = HTML prerendu remplace par le loader plein ecran pendant tout le vol) : seuls les chunks partages etaient en modulepreload, jamais celui de la page.

### Corrections
- **Index pays leger** (`src/data/countries-index.js`) : la Home n'importe plus que slug/nom/drapeau ; le contenu complet reste dans le chunk lazy de la Carte.
- **Assistant en chunk differe** : monte apres load + requestIdleCallback (secours 4 s), parite SSR stricte (rien rendu des deux cotes a l'hydratation) ; une demande d'ouverture pendant la fenetre charge immediatement et ouvre au montage (drapeau `__assutempoOpenPending`, verifie).
- **Sections sous le pli de la Home en chunk differe** (pattern etabli des routes : eager cote serveur via entry-server, lazy cote client via la table de pages, exposee par `PagesContext`) : le hero s'hydrate seul au demarrage ; prerendu SEO strictement complet (verifie) ; import de prechauffe des l'evaluation du module + `transitionsReady` attend la resolution du chunk = **aucune fenetre de disparition mesurable (echantillonnage 100 ms x 15 : 0 manque)**.
- **GA differe sans perte** : stub dataLayer synchrone (le page_view initial et tous les evenements s'empilent), script gtag injecte apres load + idle (verifie : insertion a readyState complete, page_view present en queue, refus de consentement pose ga-disable avant l'arrivee).
- **modulepreload du chunk de page dans chaque HTML prerendu** (manifest Vite + injection par prerender.mjs, imports transitifs, zero doublon avec le template) : /faq precharge Faq + AccordionItem, la Home precharge HomeSections + Footer + countries-index, chaque page pays precharge le chunk Carte. La fenetre de loader des acces directs disparait.

### Mesures APRES
| Metrique | Avant | Apres |
|---|---|---|
| Chunk principal (gzip) | 62,5 KB | **19,1 KB (-70 %)** |
| JS critique execute au demarrage (gzip) | ~200 KB | **~158 KB** (vendor 71 + framer 51,7 + main 19,1 + icons 10,4 + css 4,9) |
| Analytics au demarrage | ~310 KB + ~150 ms JS | **0 (apres load + idle)** |
| Assistant au demarrage | dans le main | **15 KB apres idle** |
| Acces direct a une page lazy | loader plein ecran pendant le vol du chunk | **chunk precharge dans le HTML** |
| Hydratation au demarrage | Home entiere | **hero + shell seulement** |
| Lighthouse local (3 runs) | 90-93 | 89-93 (bruit machine ; TBT 60-106 ms stable) |

Le banc simule ne valorise pas les octets deplaces (LCP simule domine par HTML+CSS+animation d'entree) : les gains reels sont le reseau critique, l'execution avant interactivite et la variance prod (GA sorti du chemin). A re-mesurer sur assutempo.fr apres deploiement.

### Regle #418 supplementaire (apprise en QA, regression provoquee puis corrigee)
`transitionsReady` (bascule AnimatePresence post-montage) doit rester une mise a jour **SYNCHRONE** : passee en startTransition, la bascule devient interruptible et remodele l'arbre autour des Suspense de routes encore deshydrates -> React #418 sur TOUTES les routes lazy (reproduit 12/12, corrige, re-verifie 12/12 propres). Elle attend desormais en plus la resolution du chunk des sections Home avant de basculer (aucun impact : les transitions ne servent qu'aux navigations).

### Actions restantes cote Ayoub (hors code)
1. **Debrancher la propriete UA morte dans l'admin GA4** : Admin > Flux de donnees > flux web assutempo.fr > "Balises de site connectees" (ou "Connected Site Tags") > supprimer UA-264084182-1. Gain : -144 KB de reseau et une requete tierce en moins sur CHAQUE visite, cote serveur Google (aucun deploiement necessaire).
2. **www.assutempo.fr** : garder les liens et communications sur https://assutempo.fr (0 redirection). La chaine www coute 1 a 2 sauts ; verifier chez IONOS que www pointe en CNAME vers Vercel (redirection 308 en un saut, deja le cas en https).
