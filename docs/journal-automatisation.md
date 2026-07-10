# Journal de l'automatisation AssuTempo

Ce document explique en langage simple comment une mission confiée à Claude
finit déployée sur assutempo.fr, sans intervention manuelle sur GitHub.

## 1. Le déclencheur : une issue GitHub

Tout part d'une issue GitHub (ou d'un commentaire) contenant le mot clé
`@claude`, suivi de la description de la mission. Ce mot clé est surveillé
par un workflow GitHub Actions qui réagit à deux événements : l'ouverture
d'une issue et l'ajout d'un commentaire.

## 2. La mission dans GitHub Actions

Le workflow démarre une session Claude Code dans un environnement GitHub
Actions isolé. Cette session lit l'issue, applique les règles du fichier
CLAUDE.md à la racine du dépôt, puis effectue le travail demandé : écriture
de contenu, correctifs techniques, ou création de nouveaux fichiers.

## 3. Une Pull Request depuis une branche draft/

Quand la mission modifie des fichiers, le travail est poussé sur une
branche dont le nom commence par `draft/`. Ce préfixe a un rôle précis : il
signale au reste du pipeline qu'il s'agit d'une proposition automatisée,
candidate à un merge automatique. Une Pull Request est ensuite ouverte vers
`main` depuis cette branche.

## 4. Le workflow Gate qui contrôle

Chaque Pull Request vers `main` déclenche le workflow Gate. Ce contrôle
enchaîne un build complet du site (Vite puis prérendu) et une série de
vérifications automatiques : absence de tirets cadratins interdits, absence
d'expressions bannies, zones du site protégées non touchées, dépendances
npm non modifiées, et présence de toutes les pages attendues dans le
résultat du build. Si un seul de ces contrôles échoue, le pipeline s'arrête
là.

## 5. Le merge automatique

Si le workflow Gate est vert, et si la Pull Request vient bien d'une
branche `draft/` ouverte par un compte automatisé, un second job merge la
Pull Request en squash et supprime la branche. Un label `hold` posé sur la
Pull Request bloque ce merge automatique, ce qui laisse toujours la main à
un humain en cas de doute.

## 6. Le déploiement Vercel

Vercel est branché directement sur le dépôt GitHub. Dès que `main` reçoit
un nouveau commit, que ce soit via le merge automatique ou un commit direct,
Vercel reconstruit et redéploie le site sans étape supplémentaire.

## 7. Le ping IndexNow

Une fois le merge automatique effectué, le pipeline notifie aussi les
moteurs de recherche compatibles IndexNow (Bing en tête, ce qui alimente
aussi l'index utilisé par ChatGPT) que du contenu a changé. Cette
notification part directement depuis le job de merge, car un commit créé
par le jeton d'Actions ne redéclenche pas les autres workflows du dépôt.

## Vue d'ensemble

Une issue avec `@claude` devient une session GitHub Actions, qui devient une
Pull Request `draft/`, contrôlée par le workflow Gate, mergée
automatiquement si tout est vert, déployée par Vercel, puis signalée aux
moteurs de recherche par IndexNow. Chaque étape peut être observée dans
l'onglet Actions du dépôt.
