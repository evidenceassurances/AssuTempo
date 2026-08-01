/* Clusters thematiques du maillage interne des articles.
   Pour chaque slug :
   - related : 3 articles du meme cluster, affiches en cartes "A lire aussi".
     Le graphe est equilibre a la main pour que chaque article recoive au
     moins 3 liens entrants (cartes + pages money + Home).
   - liens : liens complementaires en pillules "Pour aller plus loin",
     le lien money du cluster d'abord (/tarification, /guichet-de-nuit ou
     /carte-grise), puis les pages piliers pertinentes.
   Regle : jamais deux liens vers la meme cible dans un meme bloc. */

const MONEY = {
  tarification: { href: '/tarification', label: 'Devis assurance temporaire immédiat' },
  guichet: { href: '/guichet-de-nuit', label: 'Le Guichet de Nuit : assuré de 21h à 9h et le dimanche' },
  carteGrise: { href: '/carte-grise', label: 'Faire sa carte grise en ligne' },
};

const PAGES = {
  utilitaire: { href: '/assurance-temporaire-vehicule-utilitaire', label: 'Assurance temporaire utilitaire : camion, fourgon, remorque' },
  roulezLegal: { href: '/roulez-legal-apres-achat', label: "Rouler légal après l'achat : le rétroplanning J0 à J+30" },
  barometre: { href: '/barometre-immatriculations', label: 'Baromètre AssuTempo des immatriculations' },
  international: { href: '/assurance-internationale', label: "Assurance au-delà de l'Europe, sur demande" },
  carte: { href: '/carte', label: 'Les 34 pays couverts par votre attestation' },
  allemagne: { href: '/carte/allemagne', label: 'Assurance temporaire en Allemagne' },
  paris: { href: '/assurance-temporaire-carte-grise-paris', label: 'Fourrière et démarches à Paris' },
  lyon: { href: '/assurance-temporaire-carte-grise-lyon', label: 'Fourrière et démarches à Lyon' },
  marseille: { href: '/assurance-temporaire-carte-grise-marseille', label: 'Fourrière et démarches à Marseille' },
  procheDecede: { href: '/articles/assurance-temporaire-vehicule-proche-decede', label: "Assurer la voiture d'un proche décédé" },
};

export const ARTICLE_CLUSTERS = {
  /* ── Cluster carte grise ─────────────────────────────────────────────── */
  'carte-grise-ants-bloquee': {
    related: ['combien-de-temps-carte-grise', 'changement-titulaire-carte-grise', 'carte-grise-urgence-cpi-immediat'],
    liens: [MONEY.carteGrise],
  },
  'combien-de-temps-carte-grise': {
    related: ['carte-grise-ants-bloquee', 'carte-grise-urgence-cpi-immediat', 'changement-titulaire-carte-grise'],
    liens: [MONEY.carteGrise],
  },
  'changement-titulaire-carte-grise': {
    related: ['combien-de-temps-carte-grise', 'rouler-sans-carte-grise-a-son-nom', 'assurer-voiture-sans-carte-grise'],
    liens: [MONEY.carteGrise, PAGES.procheDecede],
  },
  'carte-grise-urgence-cpi-immediat': {
    related: ['combien-de-temps-carte-grise', 'rouler-sans-carte-grise-a-son-nom', 'assurance-temporaire-rouler-en-attendant-carte-grise'],
    liens: [MONEY.carteGrise],
  },
  'rouler-sans-carte-grise-a-son-nom': {
    related: ['changement-titulaire-carte-grise', 'carte-grise-urgence-cpi-immediat', 'assurer-voiture-sans-carte-grise'],
    liens: [MONEY.carteGrise, PAGES.roulezLegal],
  },
  'assurance-temporaire-rouler-en-attendant-carte-grise': {
    related: ['carte-grise-urgence-cpi-immediat', 'assurer-voiture-sans-carte-grise', 'combien-de-temps-carte-grise'],
    liens: [MONEY.carteGrise],
  },
  'assurer-voiture-sans-carte-grise': {
    related: ['assurance-temporaire-rouler-en-attendant-carte-grise', 'changement-titulaire-carte-grise', 'rouler-sans-carte-grise-a-son-nom'],
    liens: [MONEY.carteGrise, PAGES.procheDecede],
  },

  /* ── Cluster urgence / fourriere ─────────────────────────────────────── */
  'combien-de-jours-assurance-sortir-fourriere': {
    related: ['voiture-immobilisee-defaut-assurance', 'controle-sans-assurance-risques-amende', 'assurance-auto-temporaire-immediate-en-ligne'],
    liens: [MONEY.guichet, PAGES.paris, PAGES.lyon, PAGES.marseille],
  },
  'voiture-immobilisee-defaut-assurance': {
    related: ['combien-de-jours-assurance-sortir-fourriere', 'controle-sans-assurance-risques-amende', 'assurance-temporaire-attestation-immediate'],
    liens: [MONEY.guichet],
  },
  'controle-sans-assurance-risques-amende': {
    related: ['voiture-immobilisee-defaut-assurance', 'assurance-temporaire-attestation-immediate', 'assurance-auto-temporaire-immediate-en-ligne'],
    liens: [MONEY.guichet],
  },
  'assurance-temporaire-attestation-immediate': {
    related: ['assurance-auto-temporaire-immediate-en-ligne', 'controle-sans-assurance-risques-amende', 'combien-de-jours-assurance-sortir-fourriere'],
    liens: [MONEY.guichet],
  },
  'assurance-auto-temporaire-immediate-en-ligne': {
    related: ['assurance-temporaire-attestation-immediate', 'combien-de-jours-assurance-sortir-fourriere', 'voiture-immobilisee-defaut-assurance'],
    liens: [MONEY.guichet],
  },

  /* ── Cluster achat / vente ───────────────────────────────────────────── */
  'assurance-trajet-retour-achat-voiture': {
    related: ['assurer-vehicule-achete-chez-particulier', 'assurance-temporaire-essai-vehicule-avant-achat', 'assurance-temporaire-rouler-en-attendant-carte-grise'],
    liens: [MONEY.tarification, PAGES.roulezLegal, MONEY.guichet],
  },
  'assurer-vehicule-achete-chez-particulier': {
    related: ['assurance-trajet-retour-achat-voiture', 'assurance-temporaire-essai-vehicule-avant-achat', 'assurer-voiture-sans-carte-grise'],
    liens: [MONEY.tarification, PAGES.roulezLegal, PAGES.barometre],
  },
  'assurance-temporaire-essai-vehicule-avant-achat': {
    related: ['assurance-trajet-retour-achat-voiture', 'assurer-vehicule-achete-chez-particulier', 'assurance-temporaire-pret-de-vehicule'],
    liens: [MONEY.tarification, PAGES.roulezLegal],
  },

  /* ── Cluster profils (jeune, malus, resilie, durees, prix) ───────────── */
  'assurance-auto-temporaire-jeune-conducteur': {
    related: ['assurance-temporaire-malus', 'assurance-temporaire-resilie-par-assureur', 'assurance-auto-temporaire-1-mois'],
    liens: [MONEY.tarification],
  },
  'assurance-temporaire-malus': {
    related: ['assurance-temporaire-resilie-par-assureur', 'assurance-auto-temporaire-jeune-conducteur', 'prix-assurance-auto-temporaire'],
    liens: [MONEY.tarification],
  },
  'assurance-temporaire-resilie-par-assureur': {
    related: ['assurance-temporaire-malus', 'assurance-auto-temporaire-jeune-conducteur', 'assurance-auto-temporaire-1-mois'],
    liens: [MONEY.tarification, MONEY.guichet],
  },
  'assurance-auto-temporaire-1-mois': {
    related: ['prix-assurance-auto-temporaire', 'assurance-auto-temporaire-jeune-conducteur', 'assurance-temporaire-malus'],
    liens: [MONEY.tarification],
  },
  'prix-assurance-auto-temporaire': {
    related: ['assurance-auto-temporaire-1-mois', 'assurance-temporaire-malus', 'assurance-auto-temporaire-jeune-conducteur'],
    liens: [MONEY.tarification, PAGES.barometre],
  },

  /* ── Cluster utilitaire / pro ────────────────────────────────────────── */
  'assurance-temporaire-utilitaire-demenagement': {
    related: ['assurance-temporaire-pret-de-vehicule', 'assurance-temporaire-convoyage-professionnel', 'assurance-trajet-retour-achat-voiture'],
    liens: [MONEY.tarification, PAGES.utilitaire],
  },
  'assurance-temporaire-pret-de-vehicule': {
    related: ['assurance-temporaire-utilitaire-demenagement', 'assurance-temporaire-convoyage-professionnel', 'assurance-temporaire-essai-vehicule-avant-achat'],
    liens: [MONEY.tarification, PAGES.utilitaire],
  },
  'assurance-temporaire-convoyage-professionnel': {
    related: ['assurance-temporaire-pret-de-vehicule', 'assurance-temporaire-utilitaire-demenagement', 'assurance-temporaire-vehicule-etranger-france'],
    liens: [MONEY.tarification, PAGES.utilitaire, PAGES.international],
  },

  /* ── Cluster international ───────────────────────────────────────────── */
  'assurance-temporaire-vehicule-etranger-france': {
    related: ['assurance-temporaire-convoyage-professionnel', 'assurer-voiture-sans-carte-grise', 'assurance-trajet-retour-achat-voiture'],
    liens: [MONEY.tarification, PAGES.international, PAGES.carte, PAGES.allemagne],
  },

  /* ── Succession : pont carte grise + achat/vente ─────────────────────── */
  'assurance-temporaire-vehicule-proche-decede': {
    related: ['changement-titulaire-carte-grise', 'assurer-voiture-sans-carte-grise', 'assurer-vehicule-achete-chez-particulier'],
    liens: [MONEY.carteGrise],
  },
};
