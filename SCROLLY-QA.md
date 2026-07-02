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
