export const siteConfig = {
  navLinks: [
    { label: 'Tarification', href: '/tarification' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Carte', href: '/carte' },
    { label: 'Qui sommes-nous ?', href: '/qui-sommes-nous' },
  ],
  hero: {
    badge: 'ASSURANCE TEMPORAIRE EN LIGNE',
    title: 'Votre assurance temporaire en 2 clics',
    subtitle: "De 1 à 90 jours • Sans relevé d'information • Attestation immédiate",
    primaryCta: { label: 'Voir nos tarifs', href: '/tarification' },
    secondaryCta: { label: 'En savoir plus', href: '/qui-sommes-nous' },
    trust: [
      { label: 'Certifié sans surprise', icon: 'Check' },
      { label: '34 pays', icon: 'Globe' },
      { label: 'Attestation immédiate', icon: 'Zap' },
    ],
  },
  stats: [
    { label: "ANS D'EXPÉRIENCE", value: 6, suffix: '' },
    { label: 'MIN DE SOUSCRIPTION', value: 5, prefix: '<' },
    { label: 'PAYS COUVERTS', value: 34 },
    { label: 'JOURS', value: 60, prefix: '1→' },
  ],
  benefits: [
    {
      icon: 'Target',
      title: 'Certifié sans surprise',
      description: "Prix fixe à l'euro près. Pas de petite ligne, pas de frais cachés.",
    },
    {
      icon: 'Globe',
      title: 'Assistance Europe',
      description: 'Couverture dans 34 pays européens dès le premier jour du contrat.',
    },
    {
      icon: 'Zap',
      title: 'Illico Presto',
      description: 'Souscription en moins de 5 minutes. Attestation disponible immédiatement.',
    },
  ],
  whyItems: [
    'Vous venez d’acquérir un véhicule et souhaitez l’assurer immédiatement',
    'Démarche de carte grise à effectuer rapidement',
    'Permis ou véhicule étranger',
    'Véhicule qui circule peu dans l’année',
    'Véhicule en transit en France ou à l’étranger',
    'Export de véhicule',
  ],
  contact: {
    title: 'Besoin d’assistance ?',
    phone: '09 74 19 78 20',
    hours: ['Lundi - Vendredi : 9h00 - 21h00', 'Samedi : 9h00 - 20h00'],
    cta: { label: 'Souscrire maintenant', href: '/tarification' },
    note: 'Portail accessible 24h/24 - 7j/7',
  },
  pricingPlans: [
    {
      name: 'Éclair',
      price: '39€',
      description: 'Assurance temporaire ultra-rapide pour moins de 7 jours.',
      features: ['Attestation immédiate', 'Assistance Europe', 'Sans relevé d’information'],
    },
    {
      name: 'Zen',
      price: '59€',
      description: 'Couverture flexible de 1 à 30 jours, idéale pour carte grise.',
      features: ['Prix clair', 'Support dédié', 'Paiement sécurisé'],
    },
    {
      name: 'Pro',
      price: '79€',
      description: 'Formule 90 jours avec assistance étendue et suivi personnalisé.',
      features: ['Accompagnement 24/7', 'Sans surprise', 'Renouvelable'],
    },
  ],
  faqItems: [
    {
      question: 'Qu’est-ce qu’une assurance temporaire ?',
      answer: "Une assurance auto temporaire est une couverture de courte durée, de 1 à 90 jours, avec validité immédiate et sans relevé d’information.",
    },
    {
      question: 'Pourquoi souscrire une assurance temporaire ?',
      answer: 'Pour l’achat, l’export, la carte grise, le véhicule étranger ou un besoin ponctuel sans engagement long terme.',
    },
    {
      question: 'Puis-je souscrire ?',
      answer: 'Oui, si vous avez 20 ans ou plus et un permis depuis au moins 2 ans. Certaines restrictions s’appliquent si vous avez des sinistres ou résiliations récentes.',
    },
    {
      question: 'Que contient ma couverture ?',
      answer: 'Responsabilité civile, défense recours et assistance dépannage en France et en Europe selon les conditions du contrat.',
    },
    {
      question: 'Suis-je couvert contre le vol ?',
      answer: 'Non, la couverture temporaire concerne la responsabilité civile, la défense recours et l’assistance.',
    },
    {
      question: 'Suis-je couvert contre le bris de glace ?',
      answer: 'Non, cette protection n’est pas incluse dans la formule temporaire standard.',
    },
    {
      question: 'Documents nécessaires ?',
      answer: 'Permis de conduire, carte grise du véhicule et carte bancaire pour le paiement en ligne.',
    },
    {
      question: 'Puis-je me rétracter ?',
      answer: 'Non, les contrats d’assurance temporaire ne sont pas soumis au droit de rétractation une fois le contrat activé.',
    },
  ],
};

export const navLinks = siteConfig.navLinks;
export const faqItems = siteConfig.faqItems;
export const pricingPlans = siteConfig.pricingPlans;

/* Pages en marque blanche JL Assure.
   Sur ces pages, le parcours de souscription est gere par les equipes de JL
   Assure pour le compte du cabinet : elles ne doivent afficher AUCUNE
   coordonnee exterieure au parcours (telephone du cabinet, WhatsApp, autre
   canal). Le client n'a qu'un seul interlocuteur, joignable via le numero
   dedie affiche a l'interieur du tunnel. Demande ecrite de JL Assure du
   14 septembre 2026, applicable au plus tard le 1er octobre 2026.

   Toute nouvelle page qui integre l'iframe JL Assure doit etre ajoutee ici.
   La contrainte ne vise PAS l'iframe Certimat de /carte-grise, qui releve
   d'un autre partenaire. */
export const ROUTES_MARQUE_BLANCHE = ['/tarification'];

export const estRouteMarqueBlanche = (pathname = '') => {
  const p = String(pathname).toLowerCase().split('?')[0].replace(/\/+$/, '') || '/';
  return ROUTES_MARQUE_BLANCHE.includes(p);
};

/* Formulation de remplacement des coordonnees sur ces pages : on ne perd pas
   l'effet rassurant du telephone, on le deplace la ou il doit etre. */
export const CONTACT_TUNNEL = {
  titre: 'Un conseiller vous accompagne',
  texte: "Votre numéro dédié s'affiche directement dans le tunnel de souscription, avec l'équipe qui suit votre dossier de bout en bout.",
  note: 'Un seul interlocuteur, du devis à votre attestation.',
};
