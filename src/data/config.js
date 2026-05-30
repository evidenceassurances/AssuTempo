export const siteConfig = {
  palette: {
    background: '#0A0A0A',
    surface: '#111111',
    surfaceAlt: '#1A1A1A',
    gold: '#C9A84C',
    goldLight: '#E8C97A',
    goldSoft: '#F5E6C8',
    text: '#F5F5F5',
    textSub: '#A0A0A0',
    accent: '#00E5B9',
    separator: 'rgba(201,168,76,0.2)',
  },
  navLinks: [
    { label: 'Tarification', href: '/tarification' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Articles', href: '/#articles' },
    { label: 'Qui sommes-nous', href: '/qui-sommes-nous' },
  ],
  hero: {
    badge: 'ASSURANCE TEMPORAIRE • EN LIGNE',
    title: 'Votre assurance temporaire en 2 clics',
    subtitle: "De 1 à 60 jours • Sans relevé d'information • Attestation immédiate",
    primaryCta: { label: 'Voir nos tarifs', href: '/tarification' },
    secondaryCta: { label: 'En savoir plus', href: '/qui-sommes-nous' },
    trust: [
      { label: 'Certifié sans surprise', icon: '✓' },
      { label: 'Assistance Europe', icon: '🌍' },
      { label: '5 min chrono', icon: '⚡' },
    ],
  },
  vehicleRows: [
    ['Automobile', 'Quad', 'Buggy', 'Utilitaire', 'Camping-car', 'Caravane'],
    ['Poids-lourd', 'Bus', 'Autocar', 'Tracteur agricole', 'Remorque', 'Semi-remorque'],
  ],
  stats: [
    { label: '+10 ANS D\'EXPÉRIENCE', value: 10, suffix: '+' },
    { label: '<5 MIN DE SOUSCRIPTION', value: 5, prefix: '<' },
    { label: '34 PAYS COUVERTS', value: 34 },
    { label: '1→60 JOURS', value: 60, prefix: '1→' },
  ],
  benefits: [
    {
      icon: '🎯',
      title: 'Certifié sans surprise',
      description: "Prix fixe, à l'euro près. Aucun frais caché, aucune mauvaise surprise.",
    },
    {
      icon: '🌍',
      title: 'Assistance Europe',
      description: 'Couverts en cas de panne ou accident dans 34 pays européens dès le premier jour.',
    },
    {
      icon: '⚡',
      title: 'Illico Presto',
      description: 'Souscription en moins de 5 minutes. Attestation disponible immédiatement après paiement.',
    },
  ],
  globe: {
    title: 'Circulez en toute liberté',
    subtitle: '34 pays européens couverts',
    countries: [
      '🇦🇹 Autriche', '🇧🇪 Belgique', '🇧🇬 Bulgarie', '🇨🇾 Chypre', '🇨🇿 République tchèque', '🇩🇪 Allemagne', '🇩🇰 Danemark', '🇪🇸 Espagne', '🇪🇪 Estonie', '🇫🇷 France', '🇫🇮 Finlande', '🇬🇷 Grèce', '🇭🇺 Hongrie', '🇭🇷 Croatie', '🇮🇹 Italie', '🇮🇪 Irlande', '🇮🇸 Islande', '🇱🇺 Luxembourg', '🇱🇹 Lituanie', '🇱🇻 Lettonie', '🇲🇹 Malte', '🇳🇴 Norvège', '🇳🇱 Pays-Bas', '🇵🇹 Portugal', '🇵🇱 Pologne', '🇷🇴 Roumanie', '🇸🇪 Suède', '🇸🇰 Slovaquie', '🇸🇮 Slovénie', '🇨🇭 Suisse', '🇦🇩 Andorre', '🇧🇦 Bosnie-Herzégovine', '🇲🇪 Monténégro', '🇬🇧 Royaume-Uni',
    ],
  },
  why: [
    'Vous venez d’acquérir un véhicule et souhaitez l’assurer immédiatement',
    'Démarche de carte grise à effectuer rapidement',
    'Permis ou véhicule d’origine étrangère',
    'Véhicule qui circule peu dans l’année',
    'Véhicule en transit en France ou à l’étranger',
    'Export de véhicule',
  ],
  contact: {
    title: 'Besoin d’assistance ?',
    phone: '09 74 19 78 20',
    schedule: ['Lundi–Vendredi : 9h00 – 21h00', 'Samedi : 9h00 – 20h00'],
    cta: { label: 'Souscrire maintenant', href: '/tarification' },
    note: 'Portail accessible 24h/24 – 7j/7',
  },
  faq: [
    {
      question: 'Qu\'est-ce qu\'une assurance temporaire ?',
      answer: 'Une assurance auto temporaire est une assurance de courte durée de moins de 90 jours avec possibilité de renouvellement. Validité immédiate à 15 minutes près.',
    },
    {
      question: 'Pourquoi souscrire une assurance temporaire ?',
      answer: 'Véhicule prêté non assuré, achat pour revente rapide, démarche carte grise, import étranger, permis étranger.',
    },
    {
      question: 'Puis-je souscrire ?',
      answer: 'Oui si particulier ou professionnel, 20 ans minimum, permis de plus de 2 ans. Non si : plus de 2 sinistres matériels responsables sur 36 mois, résiliation pour sinistre sur 5 ans, condamnation pénale au code de la route.',
    },
    {
      question: 'Que contient ma couverture ?',
      answer: 'Responsabilité civile, défense recours suite à accident, assistance dépannage en cas de panne ou accident.',
    },
    {
      question: 'Suis-je couvert contre le vol ?',
      answer: 'Non, uniquement la RC + défense recours + assistance.',
    },
    {
      question: 'Suis-je couvert contre le bris de glace ?',
      answer: 'Non.',
    },
    {
      question: 'Conditions de l\'assistance ?',
      answer: 'Panne ET accident pour véhicules <3T5 de moins de 10 ans. Accident UNIQUEMENT pour véhicules <3T5 de plus de 10 ans.',
    },
    {
      question: 'Documents nécessaires ?',
      answer: 'Permis de conduire, carte grise, carte bancaire. Aucun relevé d\'information exigé.',
    },
    {
      question: 'Puis-je souscrire si j\'ai moins de 20 ans ou permis < 2 ans ?',
      answer: 'Non, 20 ans minimum et permis de plus de 2 ans obligatoires.',
    },
    {
      question: 'Puis-je prêter mon véhicule ?',
      answer: 'Non, conducteur exclusif pendant toute la durée du contrat.',
    },
    {
      question: 'Puis-je me rétracter ?',
      answer: 'Non, les contrats RC véhicule ne sont pas éligibles au droit de rétractation.',
    },
    {
      question: 'Moyens de paiement ?',
      answer: 'Carte bancaire uniquement. Aucune information bancaire conservée sur le site.',
    },
    {
      question: 'Quand reçois-je ma carte verte ?',
      answer: 'Immédiatement après paiement, en téléchargement direct.',
    },
    {
      question: 'Puissance maximale acceptée ?',
      answer: 'Aucune limite, mais au-delà de 25 CV une étude personnalisée peut être nécessaire sous 24h.',
    },
    {
      question: 'Durée maximale ?',
      answer: 'De 1 à 60 jours, au jour près.',
    },
    {
      question: 'Puis-je payer en plusieurs fois ?',
      answer: 'Non, paiement intégral uniquement.',
    },
    {
      question: 'Dans quels pays puis-je circuler ?',
      answer: '34 pays européens indiqués sur la carte verte : Autriche, Belgique, Bulgarie, Chypre, République tchèque, Allemagne, Danemark, Espagne, Estonie, France, Finlande, Grèce, Hongrie, Croatie, Italie, Irlande, Islande, Luxembourg, Lituanie, Lettonie, Malte, Norvège, Pays-Bas, Portugal, Pologne, Roumanie, Suède, Slovaquie, Slovénie, Suisse, Andorre, Bosnie-Herzégovine, Monténégro, Royaume-Uni.',
    },
  ],
  about: {
    title: 'Evidence Assurances',
    description: 'Plus de 10 ans d’expérience au service des conducteurs exigeants et des professionnels. Nous associons expérience, transparence et performance digitale.',
    stats: [
      { value: '10+', label: 'ans d’expérience' },
      { value: '24h', label: 'réponse max' },
      { value: '34', label: 'pays couverts' },
    ],
    values: [
      { title: 'Efficace', description: 'Processus fluide, réactive et sans complexité.' },
      { title: 'Disponible', description: 'Accompagnement client premium du lundi au samedi.' },
      { title: 'Engagé RSE', description: 'Parité, égalité salariale et réduction de notre empreinte.', },
    ],
    rse: [
      'Parité et égalité des salaires',
      'Réduction de pollution numérique',
      'Solutions durables et engagement responsable',
    ],
  },
  footer: {
    links: [
      { label: 'Tarification', href: '/tarification' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Qui sommes-nous', href: '/qui-sommes-nous' },
      { label: 'CGU', href: '#' },
    ],
    contact: { phone: '09 74 19 78 20', hours: 'Lun-Ven 9h-21h | Sam 9h-20h' },
  },
};
