# AssuTempo - Référence projet

> Document de contexte pour le site assutempo.fr. À placer à la racine du projet (CLAUDE.md) pour que Claude Code dispose du contexte à chaque session.
> Dernière mise à jour : 11 juin 2026.

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
- Hero "Cadran Tempo" : anneaux concentriques, graduations, comète orbitale (CSS / GPU pur)
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
- **Build** : toujours `npm run build` (jamais `npm run dev` en arrière-plan) — le script enchaîne Vite build puis `prerender.mjs` (prérendu statique). `git push` après chaque session pour déclencher le redéploiement Vercel.
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
