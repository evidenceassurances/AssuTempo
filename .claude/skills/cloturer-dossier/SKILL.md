---
name: cloturer-dossier
description: Clôt un dossier du Guichet de Nuit une fois le contrat envoyé au client. Le serveur calcule le temps écoulé et décide si la majoration de nuit est offerte. À utiliser quand Ayoub dit "clos le dossier GN-...", "j'ai envoyé le contrat", "finalise GN-...", ou donne une référence GN- à traiter.
---

# Clore un dossier du Guichet de Nuit

Quand un contrat part chez le client, il faut clore son dossier. C'est le serveur
qui calcule le temps écoulé depuis le dépôt et qui décide, seul, si la majoration
de nuit est offerte (au-delà de 30 minutes).

## Ce dont tu as besoin

- La **référence** du dossier, au format `GN-20260713-2312-K7QP`. Elle est dans le
  mail reçu à `guichetassutempo@gmail.com`.
- Facultatif : le **lien de signature**, si tu l'as déjà. Sans lui, le client voit
  quand même « votre contrat est prêt ».

## Marche à suivre

1. Si l'utilisateur n'a pas donné de référence, demande-la. N'invente jamais une
   référence, et ne devine pas.

2. Vérifie que le jeton est présent dans l'environnement :

   ```bash
   [ -n "$GUICHET_ADMIN_TOKEN" ] && echo "jeton présent" || echo "JETON ABSENT"
   ```

   S'il est absent, arrête-toi et dis à Ayoub d'ajouter cette ligne à son
   `~/.zshrc` (le jeton se retrouve dans Vercel, Settings, Environment
   Variables) :

   ```
   export GUICHET_ADMIN_TOKEN="le-jeton"
   ```

   Puis d'ouvrir un nouveau terminal. **N'écris jamais le jeton en clair dans un
   fichier du dépôt** : `.claude/` est versionné et poussé sur GitHub.

3. Lance la clôture. Remplace `LA_REFERENCE`, et retire la ligne `signatureUrl`
   si Ayoub n'a pas fourni de lien :

   ```bash
   curl -s -X POST https://assutempo.fr/api/guichet/finalize \
     -H "Authorization: Bearer $GUICHET_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"reference":"LA_REFERENCE","signatureUrl":"LE_LIEN"}'
   ```

4. Traduis la réponse en français simple. Ne te contente pas de recracher le JSON.

## Comment lire la réponse

| Réponse | Ce que ça veut dire | Quoi dire à Ayoub |
|---|---|---|
| `tarifPreferentiel: false` | Le guichet a répondu en moins de 30 minutes | « Dossier clos, X minutes. Tarif de nuit normal, tu factures plein tarif. » |
| `tarifPreferentiel: true` | Le guichet a dépassé 30 minutes | « Dossier clos, X minutes. **La majoration de nuit saute**, elle est offerte au client. » |
| `rejoue: true` | Le dossier était déjà clos | « Ce dossier était déjà clos, la décision d'origine est conservée. » |
| `403` ou `401` | Mauvais jeton | Le jeton est faux ou périmé. Le revérifier dans Vercel. |
| `503 admin_token_missing` | Le jeton n'est pas posé sur Vercel | `vercel env add GUICHET_ADMIN_TOKEN production --value 'LE_JETON' --yes` |
| `404 session_introuvable` | La veille a expiré (plus de 2 h sans clôture) | Le serveur n'a plus de point de départ, il refuse de deviner. Le tarif doit être tranché à la main. |

Signale toujours `elapsedMinutes` (le temps réellement mis par le guichet) et
`ouvertLe` (l'heure d'ouverture de la veille). Si `ouvertLe` est très antérieur à
l'heure du mail reçu au guichet, c'est louche : quelqu'un a pu ouvrir une session
en avance pour gonfler son temps d'attente. Le dire à Ayoub.

## Ce qu'il ne faut jamais faire

- Ne jamais écrire le jeton dans un fichier du dépôt.
- Ne jamais envoyer une durée au serveur : c'est lui qui calcule, toujours. Toute
  durée transmise par le client est ignorée, et c'est exactement ce qui protège
  la décision de la fraude.
- Ne jamais clore un dossier sans référence explicite d'Ayoub.

Le détail complet du mécanisme est dans `GUICHET_DE_NUIT.md`.
