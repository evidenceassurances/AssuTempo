# Assistant Assutempo (« Tempo »)

Assistant conversationnel premium + tour guide, ajoute de facon **isolee et reversible**.
Tout le code vit dans `src/assistant/` et la fonction serverless `api/chat.js`.

## Comment ca marche

1. **Widget** (`AssistantAssutempo.jsx`) : un lanceur flottant en bas a droite ouvre
   un panneau de chat. L'identite visuelle « Le Concierge Tempo » (sigil horloger
   avec particule en orbite, verre espresso, accent or, caractere serif) est definie
   dans `styles.js`, entierement encapsulee sous le prefixe `.atp-`.
2. **Reponses** : le widget poste l'historique sur **`/api/chat`** (URL relative).
   Le proxy serverless ajoute le prompt systeme **cote serveur** et appelle l'API
   Anthropic. La cle ne touche jamais le client.
3. **Tour guide** (`tourSteps.js`) : sur demande (« M'aider a souscrire » ou apres une
   reponse), l'assistant propose 3 parcours (Assurance temporaire / Carte grise /
   Assurance voyage) et surligne pas a pas les vraies cibles du site jusqu'au bord
   de l'iframe de souscription.

## Montage / demontage

- **Monte** par une seule ligne dans `src/AppShell.jsx` :
  `import AssistantAssutempo from './assistant/AssistantAssutempo';` puis
  `<AssistantAssutempo />` juste avant la fermeture du conteneur racine.
- **Pour le retirer** : supprimer cette ligne (l'import + la balise) et le dossier
  `src/assistant/` (et `api/chat.js` si l'endpoint n'est plus utilise). Optionnellement,
  retirer les attributs `data-assistant-target="..."` (voir plus bas) : ils sont
  non visuels et sans effet, les laisser ne casse rien.

Le composant rend `null` au prerendu et au premier rendu client (garde `mounted`),
puis se monte via `createPortal` dans `document.body` : **pas de risque d'erreur
d'hydratation #418**, le shell reste identique client/SSR.

## Configurer la cle API (Vercel)

1. Vercel -> le projet AssuTempo -> **Settings -> Environment Variables**.
2. Ajouter `ANTHROPIC_API_KEY` (valeur = votre cle Anthropic), pour Production
   (et Preview si besoin).
3. **Redeployer**. En local, copier `.env.example` vers `.env.local` et y mettre la cle
   (`.env.local` est gitignore).

Sans cle, `/api/chat` repond proprement (500 cote serveur) et le widget affiche un
message courtois avec proposition d'accompagnement guide : il ne plante jamais.

## Changer le modele / le prompt / les etapes

- **Modele** : `api/chat.js`, constante `MODEL`. Premium = `claude-sonnet-4-6`.
  Pour reduire le cout : `claude-haiku-4-5`.
- **Prompt systeme** : `api/chat.js`, constante `SYSTEM_PROMPT` (fixe cote serveur,
  jamais accepte depuis le client).
- **Domaines autorises** : `api/chat.js`, constante `ALLOWED_ORIGINS`.
- **Etapes du tour** : `tourSteps.js` (tableau `TOUR_FLOWS`, facile a editer).
- **Styles** : `styles.js` (variables CSS en tete de `.atp-root`).

## Securite / anti-abus (api/chat.js)

- POST uniquement (405 sinon) ; controle d'`Origin`/`Referer` (allowlist) ; limiteur
  de debit best-effort par IP en memoire. **Pour un vrai rate-limiting persistant,
  passer a Vercel KV / Upstash Redis** (la memoire n'est pas partagee entre instances).
- `messages` valide (roles `user`/`assistant`, contenu chaine), 16 derniers messages,
  4000 caracteres max par message, `max_tokens` = 1024.
- Le contenu des conversations n'est jamais journalise (minimisation RGPD).

## Cibles du tour (`data-assistant-target`)

Attributs non visuels poses sur des elements existants pour ancrer le tour :

| Attribut                          | Fichier                  | Element                          |
| --------------------------------- | ------------------------ | -------------------------------- |
| `data-assistant-target="devis"`            | `src/components/Navbar.jsx` | Bouton « Obtenir mon devis » |
| `data-assistant-target="tarif-iframe"`     | `src/pages/Pricing.jsx`     | Conteneur de l'iframe de tarification |
| `data-assistant-target="carte-grise-iframe"` | `src/pages/CarteGrise.jsx` | Conteneur de l'iframe Certimat |

Si une cible est absente (autre page, DOM modifie), l'etape se degrade proprement
(tooltip centre), sans jamais bloquer l'interface. Le tour s'arrete **au bord** des
iframes tierces (jlassure, Certimat) : leur contenu est cross-origin, jamais accede.

## Coexistence avec un widget de chat tiers

Aucun widget tiers (tawk.to, etc.) n'est present a ce jour. Si un widget est ajoute
plus tard en bas a droite, ajuster la position du lanceur dans `styles.js`
(`.atp-root { right / bottom }`) pour eviter tout chevauchement.
