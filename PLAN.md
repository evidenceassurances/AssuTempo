# PLAN GEO/SEO AssuTempo (10 juillet 2026)

Correctifs de la phase C, tries par impact GEO decroissant. Base : AUDIT.md du meme jour.

| Prio | Correctif | Impact GEO | Effort | Statut |
|---|---|---|---|---|
| 1 | **C1a : FAQPage sur /faq (14 Q/A) et Home (7 Q/A)** depuis les memes tableaux de donnees que le rendu (jamais de contenu invisible) | Tres fort : les Q/A balisees sont la matiere premiere des reponses generatives | Faible | A faire |
| 2 | **C1b : entite Organization -> ["Organization","InsuranceAgency"]** dans le template : identifier ORIAS 20005719 (PropertyValue), sameAs verifies (societe.com, annuaire-entreprises.data.gouv.fr), logo | Fort : entite etablie = citable et desambiguisee vs assutempo.com | Faible | A faire |
| 3 | **C1c : reparer publisher.logo des 12 articles** (public/logo.png cree depuis apple-touch-icon 180x180) + **datePublished reels** (premiere date git de chaque source) | Fort : schemas Article valides + fraicheur datee | Faible | A faire |
| 4 | **C2 : sitemap lastmod reels** par route via git log du fichier source (Node natif, fallback date fixe si historique indisponible) | Fort : signal de fraicheur credible, re-crawl plus rapide | Moyen | A faire |
| 5 | **C4 : IndexNow** : cle hex dans public/, scripts/indexnow.mjs (fetch natif), workflow GitHub Actions sur push main | Fort : indexation Bing (l'index de ChatGPT) en minutes | Moyen | A faire |
| 6 | **C3 : robots.txt enrichi** : sections Allow explicites pour les 10 bots IA demandes | Moyen : signal d'accueil explicite | Trivial | A faire |
| 7 | **C5 : AnswerCapsule** "La reponse en bref" (reponse <=50 mots + 3 faits dates + date de maj), integree aux 3 articles achat/carte grise | Moyen-fort : blocs reponse extractibles, upgrade du bloc "Reponse immediate" existant | Moyen | A faire |
| 8 | **C1d : Service** : serviceType alignes sur le prompt, areaServed FR+Europe, provider par reference @id | Faible-moyen | Trivial | A faire (couche head uniquement) |
| 9 | Demi-cadratins CGV.jsx:495 | Hygiene | Trivial | A faire |

## Deja en place (audite, aucune action en phase C)

- **C6 Performance** : code splitting par route (React.lazy + prefetch idle), fonts non bloquantes graisses 400-800, aucune image hero, CSS critique inline, modulepreload par page, main 19,3 KB gzip. Aucun monolithe : le budget "-20 % de JS initial" est sans objet (deja fait le 3 juillet : -70 %).
- **C7 Redirections** : https://www -> apex en UN saut 308 (equivalent permanent du 301). Le double saut ne concerne que http://www, gere au niveau plateforme Vercel, non configurable via vercel.json. Aucune action.
- **Soft-404** : vrai 404 serveur + page stylisee noindex (session du 5-6 juillet).
- **GA4** : tous les evenements proxy demandes existent (view_tarification, cta_devis_click, view_carte_grise, generate_lead, tel_click...).
- **FAQPage /tarification, /carte-grise, 12 articles** : deja presents et fideles au contenu visible.
- **Article + BreadcrumbList (+HowTo)** sur les 12 articles : deja presents (seuls datePublished et logo sont a corriger).
- **llms.txt** : deja publie.
- **Sitemap exhaustif** : les 56 routes y sont (seul lastmod est a corriger).

## Garde-fous d'execution

- JSON-LD : uniquement du contenu visible a l'ecran ; FAQ derriere accordeon = conforme (questions affichees, reponses au clic, pattern explicitement admis par les guidelines FAQ).
- Zero nouvelle dependance npm ; scripts Node natifs uniquement.
- Interdits intacts : header/footer globaux, iframe + logique JL Assure, iframe Certimat, formulaires B2B/international. Pricing.jsx et CarteGrise.jsx : couche Helmet/head UNIQUEMENT.
- Aucun U+2014/U+2013 introduit ; accents UTF-8 corrects dans tout texte visible.
- AnswerCapsule : texte statique dans le DOM, pas d'etat initial invisible (regle du 8 juillet : jamais d'opacity 0 sur du contenu critique).
- Les schemas passent par `jsonLd()` de src/lib/seo.js (echappement `<`).
