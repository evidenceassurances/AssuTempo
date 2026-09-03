import { FileText, Car, Truck, Globe } from 'lucide-react';

/* Clusters thematiques du maillage articles (chantier maillage interne du
   1er aout 2026). Chaque cluster porte ses membres (articles ET pages, pour
   irriguer aussi /roulez-legal-apres-achat et /barometre-immatriculations,
   qui ne recevaient encore aucun lien entrant) et un lien "money" unique
   vers la page de conversion la plus pertinente pour l'intention du cluster.

   `slug` : membre article (route /articles/:slug, deja dans articlesData).
   `to` + `titre` + `Icon` : membre page (hors /articles). */
export const CLUSTERS = {
  'carte-grise': {
    members: [
      'carte-grise-ants-bloquee',
      /* proche-decede : cluster double (voir DUAL_CLUSTER_SLUGS), place tot
         dans les deux tableaux pour recevoir des liens entrants reciproques
         malgre le plafond de 4 lies affiches par page (slice(0,4)). */
      'assurance-temporaire-vehicule-proche-decede',
      'combien-de-temps-carte-grise',
      'changement-titulaire-carte-grise',
      'carte-grise-urgence-cpi-immediat',
      'rouler-sans-carte-grise-a-son-nom',
      'assurance-temporaire-rouler-en-attendant-carte-grise',
      'assurer-voiture-sans-carte-grise',
    ],
    money: { to: '/carte-grise', label: 'Faire ma carte grise en ligne' },
  },
  urgence: {
    members: [
      'combien-de-jours-assurance-sortir-fourriere',
      'voiture-immobilisee-defaut-assurance',
      'controle-sans-assurance-risques-amende',
      'assurance-temporaire-attestation-immediate',
      'assurance-auto-temporaire-immediate-en-ligne',
      'assurance-auto-temporaire-nuit-dimanche',
    ],
    money: { to: '/guichet-de-nuit', label: 'Le Guichet de Nuit, 21h à 9h et dimanche' },
  },
  'achat-vente': {
    members: [
      'assurance-trajet-retour-achat-voiture',
      'assurance-temporaire-vehicule-proche-decede',
      'assurer-vehicule-achete-chez-particulier',
      'assurance-temporaire-essai-vehicule-avant-achat',
      { to: '/roulez-legal-apres-achat', titre: 'Roulez légal après un achat de voiture', Icon: Car },
      { to: '/barometre-immatriculations', titre: "Baromètre des immatriculations en France", Icon: FileText },
    ],
    money: { to: '/tarification', label: 'Obtenir mon devis' },
  },
  profils: {
    members: [
      'assurance-auto-temporaire-jeune-conducteur',
      'assurance-temporaire-malus',
      'assurance-temporaire-resilie-par-assureur',
      'assurance-auto-temporaire-1-mois',
      'assurance-auto-temporaire-1-jour',
      'prix-assurance-auto-temporaire',
    ],
    money: { to: '/tarification', label: 'Obtenir mon devis' },
  },
  'utilitaire-pro': {
    members: [
      'assurance-temporaire-utilitaire-demenagement',
      'assurance-temporaire-pret-de-vehicule',
      'assurance-temporaire-convoyage-professionnel',
      { to: '/assurance-temporaire-utilitaire', titre: 'Assurance temporaire pour véhicule utilitaire', Icon: Truck },
    ],
    money: { to: '/tarification', label: 'Obtenir mon devis' },
  },
  international: {
    members: [
      'assurance-temporaire-vehicule-etranger-france',
      'assurance-auto-etranger-france',
      { to: '/assurance-internationale', titre: 'Assurance pour rouler hors Europe', Icon: Globe },
      { to: '/carte', titre: 'Les 34 pays couverts en Europe', Icon: Globe },
    ],
    money: { to: '/tarification', label: 'Obtenir mon devis' },
  },
};

/* Article a double appartenance (carte grise + achat/vente), cas particulier
   signale dans la mission : la voiture d'un proche decede se transmet aux
   heritiers (succession) mais touche aussi bien les demarches de carte grise
   que la revente du vehicule. */
const DUAL_CLUSTER_SLUGS = { 'assurance-temporaire-vehicule-proche-decede': ['carte-grise', 'achat-vente'] };

/* Reciprocite exigee par la mission : /guichet-de-nuit linke deja ces 3
   guides (fourriere, trajet retour, controle sans assurance) en avant, ils
   doivent linker le Guichet de Nuit en retour. Les 2 premiers sont deja
   dans le cluster "urgence" (money = /guichet-de-nuit) ; seul le troisieme,
   qui vit dans le cluster "achat-vente" (money = /tarification), a besoin
   d'un lien money dedie. */
const MONEY_OVERRIDE = {
  'assurance-trajet-retour-achat-voiture': { to: '/guichet-de-nuit', label: 'Le Guichet de Nuit, 21h à 9h et dimanche' },
};

/* Cluster par slug d'article, deduit de CLUSTERS (source unique : jamais une
   liste a maintenir en double). */
const CLUSTER_BY_SLUG = {};
for (const [key, { members }] of Object.entries(CLUSTERS)) {
  for (const m of members) {
    if (typeof m === 'string') CLUSTER_BY_SLUG[m] = CLUSTER_BY_SLUG[m] || key;
  }
}

function memberToRelated(member, articlesBySlug) {
  if (typeof member === 'string') {
    const a = articlesBySlug[member];
    return a ? { slug: a.slug, titre: a.titre, categorie: a.categorie, icone: a.icone, hasPage: a.hasPage, to: `/articles/${a.slug}` } : null;
  }
  return { slug: member.to, titre: member.titre, categorie: 'Page', icone: member.Icon, hasPage: true, to: member.to };
}

/* Retourne { related, money } pour un article donne : 3-4 membres du meme
   cluster (l'article courant exclu), plus le lien money du cluster.
   Article a double cluster (proche-decede) : 2 membres pris dans chacun. */
export function getClusterFor(slug, articles) {
  const articlesBySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));
  const dual = DUAL_CLUSTER_SLUGS[slug];

  if (dual) {
    const picked = dual.flatMap((key) => (
      CLUSTERS[key].members.filter((m) => m !== slug).slice(0, 2)
    ));
    return {
      related: picked.map((m) => memberToRelated(m, articlesBySlug)).filter(Boolean),
      money: CLUSTERS[dual[0]].money,
    };
  }

  const clusterKey = CLUSTER_BY_SLUG[slug];
  if (!clusterKey) return { related: [], money: null };
  const cluster = CLUSTERS[clusterKey];
  const related = cluster.members
    .filter((m) => m !== slug)
    .slice(0, 4)
    .map((m) => memberToRelated(m, articlesBySlug))
    .filter(Boolean);
  return { related, money: MONEY_OVERRIDE[slug] || cluster.money };
}
