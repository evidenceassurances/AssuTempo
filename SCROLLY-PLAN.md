# SCROLLY-PLAN : hero scrollytelling "Cadran Assutempo"

## Architecture cible
- `HeroScrollytelling.jsx` (nouveau) : zone 280vh > étage sticky 100svh (repli 100vh). Contient le bloc hero actuel (badge, H1, sous-titre, CTAs, confiance : JSX repris de Hero.jsx, monté en permanence), le module Devis express, l'indice scroll, le fondu bas. Un seul listener scroll passive + rAF ; p dérivé de getBoundingClientRect/offsetHeight ; tout recalculé depuis p à chaque frame (idempotent : scroll rapide, reload à mi-page, bfcache).
- `CadranAssutempo.jsx` (nouveau) : base visuelle = classes atd de TempoDial.css (réutilisées, scopées `.atc`) + couche SVG générée post-hydratation (arc de remplissage, aiguille-point, 90 graduations allumables, chiffres gravés, sillage). Machine à états idle > interacting > memory > idle dans un rAF unique (rotation comète 75s, contre-rotation 180s, respiration).
- `Hero.jsx` remplacé par HeroScrollytelling dans Home.jsx. TempoDial.jsx/css intacts (encore utilisés par AssuranceInternationale).

## Réutilisé vs remplacé
- Réutilisé : esthétique atd (bloom, anneaux, comète, masques), halo-gold, hero-vignette, EASE_PREMIUM, entrance framer du bloc hero, trackEvent.
- Remplacé : rotation CSS de la comète (17s) par pilotage rAF à 75s sur la Home uniquement (handoff sans saut : angle initial lu depuis la matrice CSS). Ticks CSS re-calés de 5° à 4° (90 graduations = 1 par jour) pour alignement exact avec la couche SVG allumée.

## Transmission au tunnel
- CTA > navigate('/tarification?duree=N'). Pricing.jsx lit `duree` (entier 1..90 validé) et l'ajoute à l'URL de l'iframe JL Assure : mécanisme de pré-remplissage natif du tunnel, vérifié (l'input caché pref_duree est rendu côté serveur avec la valeur du paramètre GET). Aucune autre modification du tunnel.

## Stratégies imposées
- Point 3 (iOS Safari) : hauteur étage 100vh puis 100svh ; progression via getBoundingClientRect + offsetHeight, jamais vh ; recalcul sur resize et orientation.
- Point 7 (LCP) : H1 dans le HTML prérendu, jamais démonté ; toute init (SVG, listeners, rAF) en useEffect ; état initial = acte 1 pur, rendu statiquement.
- Point 8 (budget 9 KB gzip) : 2 composants + 1 CSS, zéro bibliothèque ; delta mesuré sur la somme gzip des chunks de vite build avant/après.
- Point 11 (flou) : aucun feGaussianBlur ; lueurs via box-shadow, drop-shadow CSS et dégradés déjà en place.

## Écarts assumés
- `main` de Home passe de overflow:hidden à overflow-x:clip (un ancêtre overflow:hidden casse position:sticky).
- Graduations majeures toutes les 10 (spec inline) et chiffres gravés 15/30/45/60/75/90 (finition 2) : les deux cohabitent.
- Retour en haut (p2 <= 0.02) : reset visuel du cadran ; la valeur du slider est conservée (re-matérialisation animée à la redescente).
- Date de fin inclusive : jour J + (N-1) jours ("1 jour" = couvert aujourd'hui seulement).

## Ordre des finitions (1 commit chacune, après le comportement de base commité)
7 (zoom au scroll) > 1 (contre-rotation) > 2 (chiffres gravés) > 6 (odomètre) > 3 (éclat d'allumage) > 4 (sillage) > 5 (respiration) > bonus vibrate > règle de Chanel (retrait de la finition la moins convaincante, justifié dans SCROLLY-QA.md).
