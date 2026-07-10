# RECAP : fondations GEO/SEO (session du 10 juillet 2026)

Lot livre en production (commit `5017c86` + correctif shallow-clone, deploiement Vercel verifie en live).

## Fait dans cette session

1. **Entite sitewide** : Organization + InsuranceAgency dans le HTML statique des 57 pages, avec identifier ORIAS 20005719, telephone, email, logo (`/logo.png` cree, 180x180) et sameAs verifies (societe.com + annuaire-entreprises.data.gouv.fr, fiche EA AGENCY / Evidence Assurances, SIREN 884641523). Le WebSite pointe vers l'entite (publisher).
2. **FAQPage** : ajoutee sur l'accueil (7 Q/A) et /faq (14 Q/A), generee depuis les memes donnees que les accordeons affiches. Le site sert desormais 17 FAQPage (avec /tarification, /carte-grise, /articles et les 12 articles deja equipes).
3. **Schemas Article repares** : datePublished reel ajoute aux 12 articles (dates git de premiere publication), publisher.logo ne pointe plus vers un fichier inexistant.
4. **Service** : /tarification (serviceType "Assurance auto temporaire 1 à 90 jours", areaServed FR + Europe) et /carte-grise (serviceType mentionnant le partenaire Certimat), provider relie a l'entite par @id. Iframes et logique intactes.
5. **Sitemap a lastmod reels** : chaque route porte la date git de derniere modification de ses fichiers sources (page + donnees). Verifie en live : les dates varient par page. Note constatee apres deploiement : le clone Vercel est shallow et refuse le `git fetch --unshallow` (fallback silencieux prevu) ; les pages non modifiees recemment portent la date frontiere du clone (ecart constate : 1 jour, 2026-07-06 au lieu de 2026-07-05), les pages fraiches sont exactes. Sans consequence : le signal de fraicheur reste correct.
6. **robots.txt enrichi** : 10 sections explicites pour les bots IA (GPTBot, OAI-SearchBot, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, Bingbot, CCBot, Amazonbot, Applebot-Extended). Verifie en live.
7. **IndexNow operationnel** : cle servie en live (`/333c3e14ba12a91b5b09cf6eaa5315ac.txt`), script `scripts/indexnow.mjs` (Node natif, zero dependance), workflow GitHub Actions a chaque push sur main. **Premier ping manuel effectue apres le deploiement : `HTTP 200 OK`, 56 URL soumises et acceptees.**
8. **AnswerCapsule** : composant "La reponse en bref" (reponse directe, 3 faits a ancres verifiables, date de mise a jour), integre en tete des 3 articles strategiques achat/carte grise (achat chez un particulier, rouler en attendant la carte grise, essai avant achat). Statique, lisible des le premier paint.
9. **Hygiene** : 2 demi-cadratins preexistants corriges (CGV), zero tiret interdit introduit, zero dependance npm ajoutee.

Performance et redirections : auditees, deja en place (voir AUDIT.md), aucune action necessaire. QA complete dans QA.md (151 blocs JSON-LD valides, 0 erreur console, budgets tenus).

## Reste a faire (decision ou hors perimetre de cette session)

- **og:image** : aucune page n'a de visuel de partage 1200x630. Necessite la creation d'un visuel de marque (decision Ayoub, deja note dans AUDIT-REPORT.md du 6 juillet).
- **Fonts auto-hebergees avec preload** : optimisation marginale possible, mais exigerait de sortir de Google Fonts (telechargement des woff2 dans le repo). Le chargement actuel est deja non bloquant : faible priorite.
- **Etendre l'AnswerCapsule** aux 9 autres articles au fil des prochaines sessions de contenu (le composant accepte un simple champ `answerCapsule` dans les donnees d'article).
- Aucun point n'a necessite de dependance npm : rien en attente de ce cote.

## Actions manuelles pour Ayoub (2, rien d'autre)

1. **Creer un compte Bing Webmaster Tools** (bing.com/webmasters) : choisir "Importer depuis Google Search Console", 2 clics, puis verifier que le sitemap `https://assutempo.fr/sitemap.xml` est bien liste. C'est l'index qu'utilise ChatGPT ; IndexNow y accelerera chaque publication.
2. **Verifier dans Google Search Console** que la couverture d'indexation ne montre pas d'erreurs dans les prochains jours (les lastmod frais vont declencher un re-crawl).
