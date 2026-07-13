# Guichet de Nuit : le compteur de 30 minutes

Ce document explique comment fonctionne la promesse « devis en 30 minutes, sinon
la majoration de nuit est offerte », et quoi faire si ça casse.

Il est écrit pour être lu sans connaissances techniques.

---

## 1. Le problème qu'on a résolu

La page `/guichet-de-nuit` affiche un compteur de 30 minutes après le dépôt d'une
demande. Si le guichet met plus de 30 minutes à répondre, le client ne paie pas
la majoration de nuit.

Avant, ce compteur tournait **dans le navigateur du client**. Deux problèmes :

1. **La triche était triviale.** Il suffisait de reculer l'horloge de son
   téléphone pour que le compteur affiche un dépassement, et donc réclamer un
   tarif préférentiel non mérité. Une décision qui coûte de l'argent ne peut pas
   dépendre d'une horloge que le client contrôle.

2. **Safari mentait.** Sur iPhone, quand un onglet passe en arrière-plan, Safari
   gèle ses minuteurs. Le compteur s'arrêtait, puis repartait faussé au retour.
   C'est ce qui provoquait l'erreur « un problème est survenu à plusieurs
   reprises ».

Maintenant, **c'est le serveur qui tient l'heure**. Le compteur reste affiché
(c'est un bon argument commercial), mais il n'est plus qu'un habillage : il se
resynchronise sur le serveur et **il ne décide de rien**.

---

## 2. Comment ça marche, en trois phrases

1. Le client dépose sa demande. Le serveur note l'heure de dépôt dans une base
   Redis (Upstash) et rend un `sessionId`.
2. Le compteur affiché redemande l'heure au serveur à chaque fois que le client
   revient sur l'onglet. Même un téléphone à l'heure de Tokyo affiche le bon
   temps restant.
3. Quand tu émets le contrat, tu appelles `/api/guichet/finalize`. **C'est là, et
   nulle part ailleurs, que le tarif se décide** : le serveur calcule lui-même le
   temps écoulé et tranche.

Le client n'envoie jamais de durée. Aucune durée reçue de l'extérieur n'est lue.

---

## 3. Ce que tu dois faire (une seule fois)

### Poser le jeton secret du guichet

`/api/guichet/finalize` est la porte qui décide de l'argent. Elle doit être
fermée au public : sans protection, n'importe quel client pourrait attendre 31
minutes puis déclencher lui-même la clôture pour s'offrir le tarif préférentiel.

Elle est donc protégée par un mot de passe (un « jeton »). **Tant que tu ne l'as
pas posé, la clôture refuse de fonctionner** (elle répond 503). C'est volontaire :
en cas de doute, on bloque plutôt que d'ouvrir.

Colle ces commandes dans ton terminal, à la racine du projet :

```bash
# 1. Génère un jeton au hasard
node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"

# 2. Pose-le sur Vercel, en remplaçant LE_JETON par ce qui vient de s'afficher.
#    La CLI n'accepte pas la saisie interactive : le --value et le --yes sont
#    obligatoires.
vercel env add GUICHET_ADMIN_TOKEN production --value 'LE_JETON' --yes
vercel env add GUICHET_ADMIN_TOKEN preview    --value 'LE_JETON' --yes
```

Garde ce jeton dans ton gestionnaire de mots de passe. Il ne doit jamais se
retrouver dans le code, ni dans un mail, ni sur la page.

Pour le changer plus tard (s'il a traîné dans un historique de terminal, par
exemple), rejoue simplement les deux mêmes commandes avec un nouveau jeton, puis
redéploie : l'ancien cesse aussitôt de fonctionner.

---

## 3 bis. Autoriser ton navigateur (une fois par mois)

L'automatisation qui prépare les contrats la nuit pilote **Chrome sur ta
machine**. Le bac à sable qui l'exécute ne peut ni lire ton jeton, ni joindre
assutempo.fr : l'appel de clôture doit donc partir de la **page**.

Poser le jeton dans le JavaScript ou dans le `localStorage` du site reviendrait à
déposer, sur les pages que visitent tes clients, la clé qui décide de tes tarifs.
Une seule faille suffirait à la voler.

À la place, tu autorises ton navigateur **une fois**. Ouvre un onglet sur
`https://assutempo.fr`, puis la console (Cmd + Option + J), et colle :

```js
await fetch('/api/guichet/admin-login', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ token: 'TON_JETON' }),
}).then((r) => r.json());
```

Le serveur pose alors un cookie valable 30 jours. Ce cookie :

- **n'est pas ton jeton** : c'est un identifiant aléatoire, révocable, sans
  aucune valeur ailleurs ;
- est **HttpOnly** : le JavaScript de la page ne peut pas le lire, donc aucune
  injection de script ne peut le voler ;
- est **SameSite=Strict** : aucun site tiers ne peut s'en servir à ton insu ;
- ne part que vers `/api/guichet`, jamais vers le reste du site.

À partir de là, l'automatisation clôture les dossiers depuis Chrome **sans aucun
secret nulle part**. À refaire une fois par mois, ou si tu changes de navigateur.

---

## 4. Clore un dossier (le geste quotidien)

Quand tu envoies le contrat au client, clos le dossier. Tu as la référence
(`GN-...`) dans le mail reçu au guichet.

```bash
curl -X POST https://assutempo.fr/api/guichet/finalize \
  -H "Authorization: Bearer TON_JETON" \
  -H "Content-Type: application/json" \
  -d '{"reference":"GN-20260713-2312-K7QP","signatureUrl":"https://lien-de-signature"}'
```

Le serveur répond par exemple :

```json
{
  "reference": "GN-20260713-2312-K7QP",
  "elapsedMinutes": 42,
  "seuilMinutes": 30,
  "tarifPreferentiel": true,
  "ouvertLe": "13/07/2026 23:12:04",
  "decideLe": "13/07/2026 23:54:31"
}
```

`tarifPreferentiel: true` veut dire : le guichet a mis plus de 30 minutes, la
majoration de nuit saute. Le client le voit apparaître sur sa page dans les
20 secondes, avec son lien de signature.

`signatureUrl` est facultatif. Sans lui, le client voit quand même « votre
contrat est prêt ».

Appeler deux fois la même clôture ne change rien : la décision prise la première
fois est renvoyée telle quelle (`"rejoue": true`).

---

## 5. Les variables utilisées

| Variable | D'où elle vient | À quoi elle sert |
|---|---|---|
| `KV_REST_API_URL` | Intégration Upstash (automatique) | Adresse de la base Redis |
| `KV_REST_API_TOKEN` | Intégration Upstash (automatique) | Mot de passe de la base |
| `GUICHET_ADMIN_TOKEN` | **À poser toi-même** (section 3) | Protège la clôture |

`KV_URL`, `REDIS_URL` et `KV_REST_API_READ_ONLY_TOKEN` sont créées par Upstash
mais ne servent pas ici.

**À savoir :** les variables posées par Upstash sont marquées « sensibles » par
Vercel. Elles ne sont donc **jamais relisibles** : `vercel env pull` les ramène
vides. Ce n'est pas un bug. Pour développer en local, va les chercher dans le
tableau de bord Vercel (Storage, puis ta base, puis l'onglet des identifiants) et
colle-les à la main dans `.env.local`.

---

## 6. Comment tester que ça marche

### Une fois déployé (le vrai test)

Ouvre `/guichet-de-nuit` sur ton iPhone et dépose une demande de test. Puis :

1. **Le compteur démarre.** Il affiche 29:5x.
2. **Le test Safari.** Passe sur une autre application pendant 5 bonnes minutes,
   puis reviens sur Safari. Le compteur doit avoir **avancé de 5 minutes**, pas
   être resté figé. C'est exactement ce qui cassait avant.
3. **Le test de la triche.** Recule l'horloge de ton iPhone d'une heure
   (Réglages, Général, Date et heure). Recharge la page : le compteur affiche
   toujours la bonne valeur, parce qu'il la tient du serveur.
4. **La clôture.** Lance la commande `curl` de la section 4 avec ta référence. La
   page du client doit basculer sur « votre contrat est prêt » en 20 secondes.

### Vérifier que la base répond

```bash
curl -X POST https://assutempo.fr/api/guichet/start \
  -H "Content-Type: application/json" \
  -d '{"reference":"GN-20260713-2312-TEST"}'
```

Une réponse avec un `sessionId` : tout va bien. Une réponse
`redis_not_configured` : les variables Upstash manquent sur cet environnement.

---

## 7. Si ça casse

**Le compteur ne démarre plus / reste bloqué**
Ce n'est pas grave, et surtout : **la demande du client est quand même partie
chez toi**. Le formulaire n'a jamais besoin de la base pour fonctionner, c'était
un choix délibéré. Une panne de Redis dégrade le compteur, jamais ton chiffre
d'affaires. Le compteur retombe alors sur un décompte local, purement décoratif.

**`/finalize` répond 503 `admin_token_missing`**
Le jeton n'est pas posé. Voir la section 3.

**`/finalize` répond 401**
Mauvais jeton, ou en-tête `Authorization` absent.

**`/finalize` répond 404 `session_introuvable`**
La veille a expiré (au-delà de 7 jours sans clôture, le serveur oublie la
session). Le dossier existe toujours dans ta boîte mail, mais le serveur n'a plus
de point de départ : il refuse de deviner. Tranche le tarif à la main.

Ce délai est volontairement long : un dossier déposé à 2 h du matin doit pouvoir
être clos à ton réveil, ou plusieurs jours plus tard si l'automatisation a
planté. Un filet de sécurité qui expire pendant que tu dors ne sert à rien.

**N'importe quel endpoint répond 503 `redis_not_configured`**
Les variables Upstash ne sont pas sur cet environnement. Vérifie dans Vercel,
Settings, Environment Variables, et redéploie.

---

## 8. Une limite à connaître

Le serveur enregistre l'heure de dépôt au moment où le navigateur du client
confirme l'envoi. Quelqu'un de déterminé, à l'aise avec les outils de
développement, pourrait ouvrir une session, attendre 40 minutes, puis déposer sa
demande, et se retrouver crédité d'un temps d'attente qu'il n'a pas subi.

C'est une attaque à faible gain (une vingtaine d'euros), à fort effort, et
**détectable** : la réponse de `/finalize` te donne `ouvertLe` (heure d'ouverture
de la veille). Si elle est très antérieure à l'heure du mail que tu as reçu au
guichet, c'est louche.

La correction définitive serait de faire passer le formulaire par notre propre
serveur au lieu d'envoyer directement à Web3Forms. C'est faisable, mais ça
suppose de compresser les photos côté navigateur (Vercel limite le corps d'une
requête à 4,5 Mo, et les photos actuelles peuvent monter à 10 Mo). À décider plus
tard si le besoin se confirme.

Le problème que tu avais signalé, lui, est entièrement réglé : l'horloge du
client n'a plus aucune influence sur la décision.

---

## 9. Où est le code

| Fichier | Rôle |
|---|---|
| `src/server/guichet-store.js` | Parle à Redis, calcule le temps écoulé, décide du tarif |
| `src/server/http.js` | Contrôle d'origine et réponses JSON |
| `api/guichet/start.js` | Ouvre la veille (heure du serveur) |
| `api/guichet/status.js` | Renvoie le temps restant, recalculé côté serveur |
| `api/guichet/finalize.js` | Clôt le dossier et tranche le tarif. Protégé par jeton |
| `src/pages/GuichetDeNuit.jsx` | Le compteur affiché, resynchronisé sur le serveur |

Aucune dépendance npm n'a été ajoutée : Upstash est appelé en HTTP direct, comme
`api/chat.js` appelle l'API Anthropic.
