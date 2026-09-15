import { RefreshCw, ShieldAlert } from 'lucide-react';

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline:
      "Résilié par votre assureur : quelles solutions, et quand l'assurance temporaire dépanne",
    description:
      "Selon le motif, une assurance auto temporaire vous remet en règle en 5 minutes, le temps de retrouver un contrat annuel.",
    author: { '@type': 'Organization', name: 'Evidence Assurances' },
    publisher: {
      '@type': 'Organization',
      name: 'AssuTempo',
      logo: { '@type': 'ImageObject', url: 'https://assutempo.fr/logo.png' },
    },
    mainEntityOfPage:
      'https://assutempo.fr/articles/assurance-temporaire-resilie-par-assureur',
    datePublished: '2026-06-23',
    dateModified: '2026-09-15',
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
        name: 'Résilié par votre assureur',
        item: 'https://assutempo.fr/articles/assurance-temporaire-resilie-par-assureur',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: "Peut-on assurer une voiture quand on a été résilié ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui, car la responsabilité civile reste obligatoire (article L211-1). Tout dépend du motif : un résilié pour impayé ou non-renouvellement trouve souvent une solution rapide, alors qu'une résiliation pour sinistres oriente plutôt vers un assureur spécialisé ou le Bureau central de tarification.",
        },
      },
      {
        '@type': 'Question',
        name: "L'assurance temporaire accepte-t-elle les conducteurs résiliés ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Pour une résiliation liée à un impayé ou à un non-renouvellement, c'est souvent possible. En revanche, une résiliation pour sinistre sur les 5 dernières années, plus de 2 sinistres responsables sur 36 mois ou une condamnation au code de la route ferment l'accès à l'assurance temporaire AssuTempo. L'éligibilité s'affiche au devis.",
        },
      },
      {
        '@type': 'Question',
        name: "Combien de temps reste-t-on inscrit au fichier AGIRA ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "En général 2 ans pour une résiliation pour non-paiement, à compter de la résiliation. Le délai peut atteindre 5 ans en cas de sinistres. Une fois la dette réglée et signalée par l'ancien assureur, le motif d'impayé peut être levé.",
        },
      },
      {
        '@type': 'Question',
        name: "Résilié pour non-paiement, que faire en priorité ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Régularisez la dette auprès de l'ancien assureur, puis assurez le véhicule sans attendre pour ne pas cumuler la résiliation avec un défaut d'assurance, qui aggrave fortement votre situation.",
        },
      },
      {
        '@type': 'Question',
        name: "Qu'est-ce que le Bureau central de tarification (BCT) ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Un organisme public qui peut contraindre un assureur à vous couvrir pour la responsabilité civile obligatoire, lorsque vous prouvez qu'au moins deux assureurs ont refusé. Il ne fournit que la garantie au tiers, pour un an.",
        },
      },
      {
        '@type': 'Question',
        name: "Que risque-t-on à rouler sans assurance après une résiliation ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "C'est un délit, puni d'une amende pouvant atteindre 3 750 €, avec des peines complémentaires possibles (suspension de permis, immobilisation, confiscation). Le véhicule peut être immobilisé sur-le-champ lors d'un contrôle.",
        },
      },
      {
        '@type': 'Question',
        name: "L'assurance temporaire est-elle une solution durable pour un résilié ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Non. C'est un pont : elle vous remet en règle immédiatement, le temps de retrouver un contrat annuel adapté à votre profil. Elle n'a pas vocation à remplacer une assurance à l'année sur le long terme.",
        },
      },
      {
        '@type': 'Question',
        name: "Comment obtenir son relevé d'information après une résiliation ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Il suffit d'une demande écrite ou orale à l'ancien assureur, qui doit le transmettre gratuitement sous 15 jours (article A121-1 du Code des assurances, service-public.gouv.fr). Le document détaille les sinistres des 5 dernières années et accélère l'étude d'un nouveau dossier.",
        },
      },
    ],
  },
];

export const articleData = {
  slug: 'assurance-temporaire-resilie-par-assureur',
  seo: {
    title: "Résilié par son assureur : l'assurance temporaire",
    description:
      "Selon le motif, une assurance auto temporaire vous remet en règle en 5 minutes, le temps de retrouver un contrat annuel.",
    canonical:
      'https://assutempo.fr/articles/assurance-temporaire-resilie-par-assureur',
    jsonLd,
  },
  category: 'Résiliation',
  readTime: '6 min',
  updatedDate: '15 septembre 2026',
  author: 'Evidence Assurances',
  headline:
    "Résilié par votre assureur : quelles solutions, et quand l'assurance temporaire dépanne",
  answerCapsule: {
    answer:
      "La responsabilité civile reste obligatoire (article L211-1). Résilié pour impayé ou non-renouvellement, une assurance temporaire peut vous couvrir immédiatement ; résilié pour sinistre, la solution passe par un assureur spécialisé ou le Bureau central de tarification.",
    facts: [
      {
        anchor: "2 ans",
        text: "Durée habituelle de l'inscription au fichier AGIRA des résiliés après un non-paiement.",
      },
      {
        anchor: "Jusqu'à 5 ans",
        text: "Durée d'inscription possible après des sinistres responsables répétés.",
      },
      {
        anchor: "Le motif décide",
        text: "Résiliation pour impayé ou non-renouvellement : le temporaire dépanne. Pour sinistres : assureur spécialisé ou Bureau central de tarification.",
      },
    ],
    updated: "15 septembre 2026",
  },
  sections: [
    {
      type: 'text',
      heading: "Résilié ne veut pas dire « plus le droit de rouler »",
      paragraphs: [
        "Recevoir une lettre de résiliation de son assureur, c'est désagréable, mais ce n'est pas une interdiction de conduire. Une seule chose compte aux yeux de la loi : tout véhicule terrestre à moteur doit être couvert au minimum en responsabilité civile (article L211-1 du Code des assurances). Tant que le véhicule peut circuler, l'obligation tient, résilié ou non.",
        "Le vrai risque, c'est de laisser passer le temps sans rien faire. Cumuler une résiliation avec un défaut d'assurance, c'est ajouter un délit à une situation déjà compliquée. L'objectif est donc simple : se remettre en règle vite, puis chercher une solution durable.",
      ],
      relatedLink: {
        text: "Ce que l'on risque vraiment sans assurance",
        href: '/articles/controle-sans-assurance-risques-amende',
      },
    },
    {
      type: 'text',
      heading: "Tout dépend du motif de la résiliation",
      paragraphs: [
        "Les assureurs ne résilient pas tous pour la même raison, et c'est précisément ce motif qui détermine vos options. Trois cas reviennent le plus souvent : la résiliation pour non-paiement de la prime, la résiliation après des sinistres responsables répétés, et la résiliation pour fausse déclaration.",
        "Le non-paiement est le motif le plus fréquent, et souvent le moins lourd : un prélèvement rejeté, un changement de banque oublié, une mensualité passée à la trappe. Les résiliations pour sinistres ou pour fausse déclaration, elles, pèsent davantage sur votre profil et limitent fortement les solutions classiques.",
      ],
    },
    {
      type: 'alert',
      heading: 'Ce que chaque motif entraîne',
      items: [
        "Non-paiement : inscription au fichier AGIRA des résiliés, en général 2 ans",
        "Sinistres responsables répétés : inscription pouvant aller jusqu'à 5 ans",
        "Fausse déclaration : le motif le plus pénalisant pour se réassurer",
      ],
      note: "Le fichier AGIRA est consultable par les assureurs lors d'une nouvelle souscription. Une fois la dette d'impayé réglée et signalée par votre ancien assureur, le motif de non-paiement peut être levé.",
    },
    {
      type: 'timeline',
      heading: "Comment se déroule une résiliation pour non-paiement",
      steps: [
        {
          num: 1,
          title: 'Le retard de paiement',
          body: "Passé environ 10 jours après l'échéance, l'assureur peut enclencher la procédure prévue par l'article L113-3 du Code des assurances.",
        },
        {
          num: 2,
          title: 'La mise en demeure',
          body: "Vous recevez une mise en demeure par courrier. Elle ouvre un délai de 30 jours pour régulariser votre situation.",
        },
        {
          num: 3,
          title: 'La suspension des garanties',
          body: "Sans paiement, la garantie est suspendue : le véhicule n'est plus couvert, même si le contrat n'est pas encore résilié. Continuer à rouler à ce stade, c'est déjà un défaut d'assurance.",
        },
        {
          num: 4,
          title: 'La résiliation',
          body: "Une dizaine de jours après la suspension, soit environ 40 jours après la mise en demeure, l'assureur peut résilier définitivement et vous inscrire au fichier AGIRA.",
        },
      ],
    },
    {
      type: 'callout',
      title: 'Le réflexe à avoir tout de suite',
      icon: 'navigation',
      text: "Si votre véhicule peut circuler, ne le laissez pas rouler sans couverture en attendant de trouver un nouveau contrat. Une assurance temporaire vous remet en règle en quelques minutes, le temps de constituer votre dossier de réassurance au calme. Mieux vaut un pont assuré qu'un trou sans garantie.",
    },
    {
      type: 'decisionsplit',
      question: 'Quelle solution selon votre motif de résiliation ?',
      ariaLabel:
        "Schéma de décision : résiliation pour impayé ou non-renouvellement (l'assurance temporaire peut dépanner) contre résiliation pour sinistres ou fausse déclaration (assureur spécialisé ou Bureau central de tarification)",
      voies: [
        {
          icon: RefreshCw,
          titre: 'Résilié pour impayé ou non-renouvellement',
          verdict:
            "Une assurance temporaire peut souvent vous couvrir immédiatement, attestation par email, le temps de retrouver un contrat annuel. L'éligibilité se vérifie au devis en quelques clics.",
          statut: 'ok',
        },
        {
          icon: ShieldAlert,
          titre: 'Résilié pour sinistres, malus lourd ou fausse déclaration',
          verdict:
            "L'assurance temporaire ne pourra pas vous couvrir. Tournez-vous vers un assureur spécialisé résiliés et malussés, et en dernier recours vers le Bureau central de tarification, qui garantit l'accès à la responsabilité civile obligatoire.",
          statut: 'vigilance',
        },
      ],
    },
    {
      type: 'checklist',
      heading: "Qui peut souscrire une assurance temporaire AssuTempo",
      intro:
        "L'assurance temporaire ne s'adresse pas à tous les profils résiliés. Les conditions sont claires et affichées avant le paiement :",
      items: [
        "Être un particulier ou un professionnel, âgé d'au moins 20 ans",
        'Détenir un permis valide depuis plus de 2 ans',
        "Ne pas avoir plus de 2 sinistres matériels responsables sur les 36 derniers mois",
        "Ne pas avoir été résilié pour sinistre au cours des 5 dernières années",
        "Ne pas faire l'objet d'une condamnation pénale au code de la route",
      ],
      note: "Le devis affiche immédiatement votre éligibilité. En cas de doute sur votre situation, l'équipe répond au téléphone avant toute souscription.",
    },
    {
      type: 'text',
      heading: "Le relevé d'information : le document à réclamer sans attendre",
      paragraphs: [
        "Dès la résiliation notifiée, une démarche simple accélère tout le reste : demander à l'ancien assureur son relevé d'information. Une demande écrite ou même orale suffit, et l'assureur n'a pas le droit de la refuser ni de la facturer. Il dispose de 15 jours pour le transmettre (article A121-1 du Code des assurances, à vérifier sur service-public.gouv.fr).",
        "Ce document liste, sur les 5 dernières années, le nombre et la nature des sinistres, leur date et le niveau de responsabilité retenu pour chacun. C'est exactement ce que tout nouvel assureur va demander avant d'établir un devis : l'avoir en main dès le départ raccourcit le dossier, au lieu de le découvrir plus tard quand une compagnie le réclame.",
        "Un intérêt souvent oublié : le relevé permet aussi de vérifier que l'historique inscrit correspond bien à la réalité. Un sinistre classé à tort comme responsable, ou un accident sans tiers identifié mal codé, pèse directement sur le calcul du coefficient. Le repérer tôt permet de le contester auprès de l'assureur avant qu'il ne bloque une nouvelle souscription.",
      ],
    },
    {
      type: 'text',
      heading: "Le temporaire est un pont, pas une destination",
      paragraphs: [
        "Soyons honnêtes : enchaîner les assurances temporaires n'est pas une stratégie de long terme. Leur rôle est de vous garder en règle pendant la période sensible qui suit une résiliation, pas de remplacer un contrat à l'année. Profitez de ce répit pour comparer les assureurs spécialisés dans les profils résiliés.",
        "Si aucun assureur n'accepte de vous couvrir pour la responsabilité civile, vous pouvez saisir le Bureau central de tarification. La démarche suit un ordre précis : un assureur refuse ou reste silencieux 15 jours après votre demande de devis, vous pouvez alors le saisir par lettre recommandée avec les justificatifs du refus. Sa décision arrive sous un délai d'environ 2 mois (service-public.gouv.fr) et, si elle vous est favorable, désigne un assureur et fixe lui-même le tarif. La couverture imposée se limite à la responsabilité civile obligatoire, pour un an, mais elle vous remet durablement dans la légalité.",
      ],
      relatedLink: {
        text: 'Comprendre le coût réel du malus, chiffres à l\'appui',
        href: '/articles/assurance-temporaire-malus',
      },
    },
    {
      type: 'text',
      heading: "Ce qu'il faut retenir",
      paragraphs: [
        "Une résiliation n'est pas un mur. Identifiez d'abord le motif : pour un impayé ou un non-renouvellement, une assurance temporaire vous remet en règle tout de suite, attestation immédiate, le temps de retrouver un contrat annuel. Pour une résiliation liée à des sinistres ou à une fausse déclaration, visez un assureur spécialisé, puis le Bureau central de tarification. Dans tous les cas, réclamez votre relevé d'information dès la notification reçue, et ne roulez jamais sans couverture en attendant.",
      ],
      relatedLink: {
        text: "Voiture immobilisée pour défaut d'assurance : la récupérer",
        href: '/articles/voiture-immobilisee-defaut-assurance',
      },
    },
  ],
  faqItems: [
    {
      q: "Peut-on assurer une voiture quand on a été résilié ?",
      a: "Oui, la responsabilité civile reste obligatoire (L211-1). Tout dépend du motif : un impayé se règle souvent vite, une résiliation pour sinistres oriente vers un assureur spécialisé ou le BCT.",
    },
    {
      q: "L'assurance temporaire accepte-t-elle les résiliés ?",
      a: "Pour un impayé ou un non-renouvellement, souvent oui. Une résiliation pour sinistre sur 5 ans, plus de 2 sinistres responsables sur 36 mois ou une condamnation au code de la route ferment l'accès. L'éligibilité s'affiche au devis.",
    },
    {
      q: "Combien de temps reste-t-on fiché à l'AGIRA ?",
      a: "En général 2 ans pour un non-paiement, jusqu'à 5 ans en cas de sinistres. Le motif d'impayé peut être levé une fois la dette réglée et signalée par l'ancien assureur.",
    },
    {
      q: "Résilié pour non-paiement, par quoi commencer ?",
      a: "Régler la dette auprès de l'ancien assureur, puis s'assurer sans attendre pour ne pas cumuler résiliation et défaut d'assurance.",
    },
    {
      q: "Qu'est-ce que le Bureau central de tarification ?",
      a: "Un organisme public qui peut contraindre un assureur à vous couvrir en responsabilité civile quand au moins deux assureurs ont refusé. Couverture au tiers, valable un an.",
    },
    {
      q: "Que risque-t-on à rouler sans assurance après une résiliation ?",
      a: "C'est un délit : jusqu'à 3 750 € d'amende et des peines complémentaires possibles, avec immobilisation du véhicule lors d'un contrôle.",
    },
    {
      q: "Le temporaire est-il une solution durable pour un résilié ?",
      a: "Non, c'est un pont qui vous remet en règle le temps de retrouver un contrat annuel adapté à votre profil.",
    },
    {
      q: "Comment obtenir son relevé d'information après une résiliation ?",
      a: "Une demande écrite ou orale suffit : l'ancien assureur doit le transmettre gratuitement sous 15 jours (article A121-1 du Code des assurances). Il détaille les sinistres des 5 dernières années et accélère l'étude d'un nouveau dossier.",
    },
  ],
};
