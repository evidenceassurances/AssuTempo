const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Assurance auto la nuit ou le dimanche : la solution qui existe vraiment',
    description:
      "Besoin d'assurer une voiture la nuit ou un dimanche ? Le tunnel en ligne classique ferme à 21h, mais le Guichet de Nuit AssuTempo prend le relais.",
    author: { '@type': 'Organization', name: 'Evidence Assurances' },
    publisher: {
      '@type': 'Organization',
      name: 'AssuTempo',
      logo: { '@type': 'ImageObject', url: 'https://assutempo.fr/logo.png' },
    },
    mainEntityOfPage:
      'https://assutempo.fr/articles/assurance-auto-temporaire-nuit-dimanche',
    datePublished: '2026-09-01',
    dateModified: '2026-09-01',
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
        name: 'Assurance auto la nuit ou le dimanche',
        item: 'https://assutempo.fr/articles/assurance-auto-temporaire-nuit-dimanche',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Se faire assurer la nuit ou un dimanche via le Guichet de Nuit',
    totalTime: 'PT30M',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Déposez votre demande',
        text: 'Le formulaire du Guichet de Nuit prend 3 minutes, depuis un téléphone. Aucun paiement à cette étape.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Joignez vos 3 photos',
        text: 'Permis recto et verso, carte grise : les photos partent directement dans le formulaire.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Signez et payez',
        text: "Le devis part sous 30 minutes, avec le lien de signature électronique. L'attestation arrive par email dès le paiement.",
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Peut-on vraiment souscrire une assurance auto à 3h du matin ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui. En dehors du tunnel en ligne classique, le Guichet de Nuit AssuTempo prépare les contrats de 21h à 9h du lundi au samedi, et sans interruption le dimanche : devis sous 30 minutes, attestation par email dès le paiement.",
        },
      },
      {
        '@type': 'Question',
        name: 'Pourquoi la souscription en ligne classique ferme-t-elle après 21h ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Le tunnel de souscription automatisé suit des horaires de bureau, 9h à 21h en semaine et 9h à 20h le samedi. Passé ces horaires, plus aucun contrat ne peut y être émis, d'où l'existence d'un circuit de nuit distinct.",
        },
      },
      {
        '@type': 'Question',
        name: 'Que risque-t-on en cas de contrôle sans assurance en pleine nuit ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Le même risque qu'en plein jour : le défaut d'assurance est un délit (article L324-2 du code de la route), passible d'une amende de 500 € à 3 750 €, avec immobilisation possible du véhicule sur-le-champ.",
        },
      },
      {
        '@type': 'Question',
        name: 'Combien de temps faut-il pour recevoir son attestation la nuit ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Le devis part dans les 30 minutes suivant le dépôt d'une demande complète, photos comprises. L'attestation officielle, elle, arrive par email dès que le paiement est validé.",
        },
      },
      {
        '@type': 'Question',
        name: 'Le Guichet de Nuit fonctionne-t-il le dimanche et les jours fériés ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui, la permanence tourne toute la journée du dimanche et selon le même régime les jours fériés, justement les journées où le tunnel de souscription classique reste fermé.",
        },
      },
      {
        '@type': 'Question',
        name: 'Faut-il un relevé d\'information pour souscrire la nuit ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Non. Aucun relevé d'information n'est exigé, ni la nuit ni le jour. Le formulaire demande simplement si vous avez déjà été résilié ou eu un retrait de permis, pour établir un devis juste avant tout paiement.",
        },
      },
    ],
  },
];

export const articleData = {
  slug: 'assurance-auto-temporaire-nuit-dimanche',
  seo: {
    title: 'Assurance auto la nuit ou le dimanche : la solution',
    description:
      "Besoin d'assurer une voiture la nuit ou un dimanche ? Le tunnel classique ferme à 21h, le Guichet de Nuit AssuTempo prend le relais, devis sous 30 min.",
    canonical: 'https://assutempo.fr/articles/assurance-auto-temporaire-nuit-dimanche',
    jsonLd,
  },
  category: 'Urgence',
  readTime: '6 min',
  updatedDate: '1er septembre 2026',
  author: 'Evidence Assurances',
  headline: 'Assurance auto la nuit ou le dimanche : la solution qui existe vraiment',
  answerCapsule: {
    answer:
      "Oui, on peut assurer une voiture la nuit ou un dimanche. Le tunnel de souscription en ligne classique ferme à 21h en semaine et 20h le samedi. En dehors de ces horaires, et le dimanche sans interruption, le Guichet de Nuit AssuTempo prend le relais : devis sous 30 minutes, attestation par email dès le paiement.",
    facts: [
      {
        anchor: '21h à 9h',
        text: "Le tunnel de souscription classique ferme à 21h en semaine, 20h le samedi. Le Guichet de Nuit AssuTempo couvre ce créneau, et le dimanche en continu.",
      },
      {
        anchor: '30 minutes',
        text: "Délai maximal pour recevoir un devis après un dépôt de demande complet, photos comprises, au Guichet de Nuit. Passé ce délai, la majoration de nuit est offerte.",
      },
      {
        anchor: '500 € à 3 750 €',
        text: "Amende encourue pour défaut d'assurance (article L324-2 du code de la route), qu'il s'agisse d'un contrôle de jour ou de nuit.",
      },
    ],
    updated: '1er septembre 2026',
  },
  sections: [
    {
      type: 'text',
      heading: "Pourquoi est-il si difficile de s'assurer la nuit ou un dimanche ?",
      paragraphs: [
        "Aucune agence physique n'ouvre à 23h, et la plupart des compagnies traditionnelles suivent des horaires de bureau, y compris pour leurs parcours en ligne. Un devis peut parfois se remplir à toute heure, mais l'émission réelle du contrat, elle, reste souvent bloquée derrière une équipe qui a fermé pour la nuit.",
        "Chez AssuTempo, le tunnel de souscription classique (celui qui délivre un contrat en quelques clics, sans intervention humaine) suit lui aussi des horaires précis : 9h à 21h du lundi au vendredi, 9h à 20h le samedi. En dehors de ce créneau, et toute la journée du dimanche, il ne peut plus émettre de contrat seul.",
      ],
    },
    {
      type: 'text',
      heading: 'Existe-t-il une vraie solution pour être assuré en pleine nuit ?',
      paragraphs: [
        "Oui. C'est précisément le rôle du Guichet de Nuit, une permanence dédiée qui prépare les contrats d'assurance temporaire de 21h à 9h du lundi au samedi. Le principe est simple : vous déposez votre demande depuis votre téléphone (3 minutes suffisent), vous joignez trois photos (permis recto et verso, carte grise), et le devis vous revient dans les 30 minutes.",
        "Une fois le devis accepté, la signature se fait électroniquement, par un lien envoyé par email et SMS. L'attestation officielle (Mémo Véhicule Assuré et carte internationale d'assurance) arrive par email dès que le paiement est validé. Aucun rendez-vous, aucun appel obligatoire.",
      ],
      relatedLink: {
        text: 'Découvrir le Guichet de Nuit en détail',
        href: '/guichet-de-nuit',
      },
    },
    {
      type: 'text',
      heading: 'Et le dimanche ou un jour férié ?',
      paragraphs: [
        "Le dimanche pose un problème différent de la nuit : ce n'est pas une question d'horaire tardif, mais un jour entier où le tunnel classique reste fermé, du matin jusqu'au soir. Le Guichet de Nuit y répond de la même façon, avec une permanence qui tourne toute la journée, dimanche compris, et les jours fériés selon le même régime.",
        "C'est un cas fréquent après l'achat d'un véhicule : le vendeur remet les clés un samedi soir ou un dimanche après-midi, et le trajet retour doit être couvert dès le premier mètre, sans délai de grâce.",
      ],
      relatedLink: {
        text: "Achat de voiture un week-end : assurer le trajet retour",
        href: '/articles/assurance-trajet-retour-achat-voiture',
      },
    },
    {
      type: 'timeline',
      heading: 'Comment ça se passe, minute par minute',
      steps: [
        {
          num: 1,
          title: 'Vous déposez votre demande',
          body: 'Type de véhicule, durée souhaitée, coordonnées. Le formulaire se remplit en 3 minutes, sans paiement à cette étape.',
        },
        {
          num: 2,
          title: 'Vous joignez vos photos',
          body: "Permis de conduire recto et verso, carte grise : les photos partent directement depuis votre téléphone, dans le même formulaire.",
        },
        {
          num: 3,
          title: 'Vous recevez votre devis',
          body: "Le Guichet de Nuit répond sous 30 minutes après un dépôt complet. Le devis est sans engagement : rien n'est facturé si vous ne signez pas.",
        },
        {
          num: 4,
          title: "Vous signez et vous êtes couvert",
          body: "Signature électronique par lien reçu par email et SMS, puis paiement sécurisé. L'attestation arrive par email dès le paiement validé.",
        },
      ],
    },
    {
      type: 'text',
      heading: 'Que risque-t-on en cas de contrôle sans assurance en pleine nuit ?',
      paragraphs: [
        "Exactement le même risque qu'un contrôle en plein jour. Rouler sans assurance est un délit (article L324-2 du code de la route), sanctionné par une amende forfaitaire délictuelle de 500 €, minorée à 400 € si le paiement intervient sous 15 jours, majorée à 1 000 € au-delà de 45 jours. Devant le tribunal correctionnel, l'amende peut grimper jusqu'à 3 750 €, et jusqu'à 7 500 € en cas de récidive dans les 5 ans.",
        "Les forces de l'ordre peuvent aussi immobiliser le véhicule sur-le-champ, de nuit comme de jour, avec un départ possible en fourrière au bout de 48 heures sans régularisation. La seule différence, la nuit, c'est que la régularisation classique n'est plus accessible : c'est justement ce que le Guichet de Nuit vient combler.",
      ],
      relatedLink: {
        text: 'Le détail complet des sanctions pour défaut d\'assurance',
        href: '/articles/controle-sans-assurance-risques-amende',
      },
    },
    {
      type: 'text',
      heading: "Sortie de fourrière tôt le matin : le même principe",
      paragraphs: [
        "Une voiture immobilisée puis mise en fourrière pour défaut d'assurance se récupère souvent dès l'ouverture, parfois avant 8h. Sans attestation valide en poche à ce moment-là, impossible de la faire sortir. Préparer sa demande au Guichet de Nuit pendant la nuit permet d'arriver à l'ouverture avec l'attestation déjà en main, plutôt que d'attendre l'ouverture d'un tunnel classique à 9h.",
      ],
      relatedLink: {
        text: "Sortie de fourrière : combien de jours d'assurance souscrire",
        href: '/articles/combien-de-jours-assurance-sortir-fourriere',
      },
    },
    {
      type: 'checklist',
      heading: 'Quels documents préparer avant de déposer une demande de nuit',
      intro: 'Pour ne pas ralentir le traitement de votre dossier, réunissez avant de commencer :',
      items: [
        'Votre permis de conduire, recto et verso',
        "La carte grise du véhicule (si elle n'est pas encore en main, elle peut suivre par email de confirmation)",
        'Un téléphone pour recevoir le lien de signature par SMS',
        'Un moyen de paiement, à utiliser seulement une fois le devis accepté',
      ],
      note: "Aucun relevé d'information n'est demandé, seulement une déclaration sur d'éventuels antécédents (résiliation, retrait de permis).",
    },
    {
      type: 'text',
      heading: 'Combien coûte une assurance souscrite la nuit ou un dimanche ?',
      paragraphs: [
        "Le tarif de nuit est un tarif tout compris, affiché sur le devis avant tout paiement, sans surprise au moment de signer. La demande elle-même ne coûte rien : vous ne payez qu'après avoir accepté le devis. Et si le Guichet de Nuit met plus de 30 minutes à répondre une fois votre dossier complet déposé, la majoration de nuit est offerte.",
      ],
      relatedLink: {
        text: "La grille de prix complète de l'assurance temporaire",
        href: '/articles/prix-assurance-auto-temporaire',
      },
    },
    {
      type: 'text',
      heading: 'La marche à suivre selon l\'heure',
      paragraphs: [
        "Entre 9h et 21h en semaine (20h le samedi), le devis en ligne classique reste le chemin le plus rapide. En dehors de ces horaires, ou n'importe quand le dimanche, direction le Guichet de Nuit : formulaire, photos, devis sous 30 minutes, signature, attestation par email. La couverture démarre dès le paiement validé, quelle que soit l'heure sur l'horloge.",
      ],
    },
  ],
  faqItems: [
    {
      q: 'Peut-on vraiment souscrire une assurance auto à 3h du matin ?',
      a: "Oui. En dehors du tunnel en ligne classique, le Guichet de Nuit AssuTempo prépare les contrats de 21h à 9h du lundi au samedi, et sans interruption le dimanche : devis sous 30 minutes, attestation par email dès le paiement.",
    },
    {
      q: 'Pourquoi la souscription en ligne classique ferme-t-elle après 21h ?',
      a: "Le tunnel de souscription automatisé suit des horaires de bureau, 9h à 21h en semaine et 9h à 20h le samedi. Passé ces horaires, plus aucun contrat ne peut y être émis, d'où l'existence d'un circuit de nuit distinct.",
    },
    {
      q: 'Que risque-t-on en cas de contrôle sans assurance en pleine nuit ?',
      a: "Le même risque qu'en plein jour : le défaut d'assurance est un délit (article L324-2 du code de la route), passible d'une amende de 500 € à 3 750 €, avec immobilisation possible du véhicule sur-le-champ.",
    },
    {
      q: 'Combien de temps faut-il pour recevoir son attestation la nuit ?',
      a: "Le devis part dans les 30 minutes suivant le dépôt d'une demande complète, photos comprises. L'attestation officielle, elle, arrive par email dès que le paiement est validé.",
    },
    {
      q: 'Le Guichet de Nuit fonctionne-t-il le dimanche et les jours fériés ?',
      a: "Oui, la permanence tourne toute la journée du dimanche et selon le même régime les jours fériés, justement les journées où le tunnel de souscription classique reste fermé.",
    },
    {
      q: "Faut-il un relevé d'information pour souscrire la nuit ?",
      a: "Non. Aucun relevé d'information n'est exigé, ni la nuit ni le jour. Le formulaire demande simplement si vous avez déjà été résilié ou eu un retrait de permis, pour établir un devis juste avant tout paiement.",
    },
  ],
};
