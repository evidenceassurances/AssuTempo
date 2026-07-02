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

## Ecarts assumes (complement du SCROLLY-PLAN)
- Libelle CTA avec point median ("· 2 min") au lieu du tiret long de la spec : regle projet "aucun em-dash".
- text-shadow du grand nombre retire apres controle visuel : il produisait un pave lumineux disgracieux sur mobile.
