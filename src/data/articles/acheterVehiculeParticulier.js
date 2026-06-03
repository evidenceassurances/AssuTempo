const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline:
      "Assurer un véhicule acheté chez un particulier : comment rouler dès le premier trajet",
    description:
      "Vous venez d'acheter une voiture chez un particulier ? Roulez assuré dès le premier trajet, attestation immédiate, sans attendre la carte grise.",
    author: { '@type': 'Organization', name: 'Evidence Assurances' },
    publisher: {
      '@type': 'Organization',
      name: 'AssuTempo',
      logo: { '@type': 'ImageObject', url: 'https://assutempo.fr/logo.png' },
    },
    mainEntityOfPage:
      'https://assutempo.fr/articles/assurer-vehicule-achete-chez-particulier',
    dateModified: '2026-06-02',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://assutempo.fr' },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://assutempo.fr/articles' },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Assurer un véhicule acheté chez un particulier',
        item: 'https://assutempo.fr/articles/assurer-vehicule-achete-chez-particulier',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Peut-on rouler immédiatement après avoir acheté une voiture à un particulier ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, à condition d\'être assuré au minimum en responsabilité civile dès la prise de possession du véhicule.',
        },
      },
      {
        '@type': 'Question',
        name: "L'assurance du vendeur me couvre-t-elle ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Ne comptez pas dessus : le contrat du vendeur est en principe suspendu à la vente. Vous devez avoir votre propre assurance avant de rouler.",
        },
      },
      {
        '@type': 'Question',
        name: "Peut-on assurer une voiture dont la carte grise n'est pas encore à mon nom ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui, avec le certificat de cession et l'ancienne carte grise barrée. Vous avez 30 jours pour faire la carte grise à votre nom.",
        },
      },
      {
        '@type': 'Question',
        name: "Combien de temps faut-il s'assurer ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'De 1 à 90 jours selon le besoin : ramener le véhicule, attendre le contrat annuel, ou usage ponctuel.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quels documents pour souscrire ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Permis valide, ancienne carte grise barrée ou certificat de cession, pièce d'identité, moyen de paiement.",
        },
      },
      {
        '@type': 'Question',
        name: "Que risque-t-on à rouler sans assurance après l'achat ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "C'est un délit, avec une amende de 500 € à 3 750 €. En cas d'accident, le FGAO indemnise les victimes puis se retourne contre vous.",
        },
      },
    ],
  },
];

export const articleData = {
  slug: 'assurer-vehicule-achete-chez-particulier',
  seo: {
    title: 'Assurer un véhicule acheté chez un particulier : rouler vite',
    description:
      "Vous venez d'acheter une voiture chez un particulier ? Roulez assuré dès le premier trajet, attestation immédiate, sans attendre la carte grise. Devis en ligne.",
    canonical: 'https://assutempo.fr/articles/assurer-vehicule-achete-chez-particulier',
    jsonLd,
  },
  category: 'Achat véhicule',
  readTime: '5 min',
  updatedDate: '2 juin 2026',
  author: 'Evidence Assurances',
  headline:
    "Assurer un véhicule acheté chez un particulier : comment rouler dès le premier trajet",
  immediateAnswer:
    "Vous venez d'acheter une voiture à un particulier et vous voulez la ramener tout de suite ? Bonne nouvelle : c'est possible, à une condition - être assuré dès que vous prenez le volant. Ne comptez pas sur l'assurance du vendeur, qui est suspendue à la vente. La solution la plus simple : souscrire une assurance temporaire en ligne et recevoir une attestation immédiate, valable même si la carte grise n'est pas encore à votre nom. On vous explique tout.",
  sections: [
    {
      type: 'text',
      heading: "Devez-vous être assuré dès l'achat ? Oui, immédiatement",
      paragraphs: [
        "La loi est claire : la responsabilité civile est obligatoire dès la prise de possession du véhicule (article L211-1 du Code des assurances). Autrement dit, dès que le vendeur vous remet les clés et que vous roulez, vous devez être assuré au minimum au tiers.",
        "Et attention : l'assurance du vendeur ne vous protège pas de façon fiable - son contrat est en principe suspendu à la vente. Rouler sans votre propre assurance, c'est un défaut d'assurance, un délit passible de 500 € à 3 750 € d'amende. En cas d'accident, le Fonds de garantie (FGAO) indemnise les victimes puis se retourne contre vous pour récupérer l'intégralité des sommes.",
      ],
      relatedLink: {
        text: "Contrôlé sans assurance : risques, amende et que faire",
        href: '/articles/controle-sans-assurance-risques-amende',
      },
    },
    {
      type: 'text',
      heading: "Pas encore de carte grise à votre nom ? Vous pouvez quand même rouler",
      paragraphs: [
        "Vous disposez de 30 jours après l'achat pour faire établir la carte grise à votre nom (certificat d'immatriculation, via l'ANTS). En attendant, vous pouvez circuler légalement à condition d'avoir : une attestation d'assurance valide, l'ancienne carte grise barrée avec la mention « vendu le » et la date, et le certificat de cession signé par le vendeur. L'assurance se souscrit sans attendre la nouvelle carte grise.",
      ],
    },
    {
      type: 'text',
      heading: "Pourquoi l'assurance temporaire est idéale après un achat",
      paragraphs: [
        "Elle est pensée pour ce moment précis : ramener le véhicule chez vous (surtout si vous l'avez acheté loin, un week-end ou un jour férié), le temps de finaliser et comparer un contrat annuel à tête reposée, ou couvrir un véhicule que vous n'utiliserez que ponctuellement. De 1 à 90 jours, attestation immédiate, sans engagement - vous ajustez au plus juste sans payer une année entière pour quelques jours.",
      ],
    },
    {
      type: 'checklist',
      heading: 'Les documents pour souscrire',
      items: [
        'Permis de conduire valide',
        "Ancienne carte grise barrée (ou certificat de cession)",
        "Pièce d'identité",
        'Moyen de paiement (carte bancaire)',
      ],
    },
    {
      type: 'timeline',
      heading: 'Comment ça marche',
      steps: [
        {
          num: 1,
          title: 'Faites votre devis en ligne',
          body: "Indiquez le type de véhicule et la durée souhaitée (de 1 à 90 jours).",
        },
        {
          num: 2,
          title: 'Souscrivez',
          body: "Paiement sécurisé par carte bancaire, sans engagement.",
        },
        {
          num: 3,
          title: 'Recevez votre attestation immédiatement',
          body: "Votre Mémo Véhicule Assuré et votre carte internationale d'assurance automobile disponibles par email, immédiatement après la souscription.",
        },
        {
          num: 4,
          title: 'Roulez assuré dès le premier trajet',
          body: "Finalisez ensuite votre carte grise auprès de l'ANTS sous 30 jours.",
        },
      ],
    },
    {
      type: 'text',
      heading: 'Qui peut souscrire ?',
      paragraphs: [
        "La grande majorité des acheteurs : conditions habituelles d'au moins 20 ans, permis depuis plus de 2 ans, profil sans antécédents lourds. Le devis affiche immédiatement votre éligibilité, et l'équipe répond au téléphone en cas de doute.",
      ],
    },
    {
      type: 'text',
      heading: 'En résumé',
      paragraphs: [
        "Acheter chez un particulier n'oblige pas à attendre pour rouler. Assurez-vous dès la prise de possession - une temporaire suffit, avec attestation immédiate - et vous prenez la route légalement le jour même, carte grise à régulariser sous 30 jours.",
      ],
    },
  ],
  faqItems: [
    {
      q: 'Peut-on rouler immédiatement après avoir acheté une voiture à un particulier ?',
      a: "Oui, à condition d'être assuré au minimum en responsabilité civile dès la prise de possession du véhicule.",
    },
    {
      q: "L'assurance du vendeur me couvre-t-elle ?",
      a: "Ne comptez pas dessus : le contrat du vendeur est en principe suspendu à la vente. Vous devez avoir votre propre assurance avant de rouler.",
    },
    {
      q: "Peut-on assurer une voiture dont la carte grise n'est pas encore à mon nom ?",
      a: "Oui, avec le certificat de cession et l'ancienne carte grise barrée. Vous avez 30 jours pour faire la carte grise à votre nom.",
    },
    {
      q: "Combien de temps faut-il s'assurer ?",
      a: 'De 1 à 90 jours selon le besoin : ramener le véhicule, attendre le contrat annuel, ou usage ponctuel.',
    },
    {
      q: 'Quels documents pour souscrire ?',
      a: "Permis valide, ancienne carte grise barrée ou certificat de cession, pièce d'identité, moyen de paiement.",
    },
    {
      q: "Que risque-t-on à rouler sans assurance après l'achat ?",
      a: "C'est un délit (amende de 500 € à 3 750 €). En cas d'accident, le FGAO indemnise les victimes puis se retourne contre vous.",
    },
  ],
};
