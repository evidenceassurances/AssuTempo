import { Globe, ShieldCheck, AlertTriangle } from 'lucide-react';

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: "Assurance auto étranger en France : UE, carte verte ou frontière",
    description:
      "Véhicule étranger en France : UE, carte verte ou assurance frontière. Délais, permis étranger et sanctions, sources officielles vérifiées le 4 août 2026.",
    author: { '@type': 'Organization', name: 'Evidence Assurances' },
    publisher: {
      '@type': 'Organization',
      name: 'AssuTempo',
      logo: { '@type': 'ImageObject', url: 'https://assutempo.fr/logo.png' },
    },
    mainEntityOfPage: 'https://assutempo.fr/articles/assurance-auto-etranger-france',
    datePublished: '2026-08-04',
    dateModified: '2026-08-04',
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
        name: "Assurance auto étranger en France",
        item: 'https://assutempo.fr/articles/assurance-auto-etranger-france',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: "Peut-on assurer en France un véhicule immatriculé à l'étranger ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui. Un véhicule de l'UE ou de l'EEE circule avec son assurance d'origine, un véhicule d'un pays de la carte verte internationale avec la carte verte remise par son assureur, et un véhicule hors de ces deux ensembles doit souscrire une assurance frontière. Pour un résident qui doit encore régulariser l'immatriculation, une assurance temporaire de 1 à 90 jours couvre le véhicule à partir de la plaque étrangère ou du numéro de châssis.",
        },
      },
      {
        '@type': 'Question',
        name: 'Combien de temps peut-on rouler en France avec des plaques étrangères ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Jusqu'à un an sans interruption si la résidence normale du propriétaire reste hors de France. Dès que cette résidence bascule en France, le délai retombe à un mois pour immatriculer le véhicule (article R322-5 du code de la route), quel que soit le pays d'origine de la plaque.",
        },
      },
      {
        '@type': 'Question',
        name: "Qu'est-ce que l'assurance frontière et qui doit la souscrire ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "C'est un contrat obligatoire pour tout véhicule immatriculé hors UE/EEE et hors système de la carte verte internationale qui entre en France. Sa durée est de 30 ou 90 jours, renouvelable une seule fois (article R211-24 du code des assurances). Elle se souscrit auprès d'un assureur agréé ou du groupement dédié, pas dans une offre d'assurance temporaire classique.",
        },
      },
      {
        '@type': 'Question',
        name: 'Un permis de conduire étranger est-il valable pour rouler en France ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Un permis délivré dans l'UE ou l'EEE reste valable en France jusqu'à sa date d'expiration, sans échange obligatoire. Un permis délivré hors UE/EEE reste valable un an après l'installation en France, puis doit être échangé contre un permis français si un accord de réciprocité existe avec le pays de délivrance, moyennant un droit de timbre de 40 euros depuis le 12 mai 2026.",
        },
      },
      {
        '@type': 'Question',
        name: "La carte verte d'assurance a-t-elle disparu en France ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Non. Le système international de la carte verte existe toujours et reste la référence pour les véhicules de pays tiers. Ce qui a disparu le 1er avril 2024, c'est uniquement le certificat papier et la vignette pour les véhicules assurés en France, remplacés par le Fichier des véhicules assurés et le Mémo véhicule assuré.",
        },
      },
      {
        '@type': 'Question',
        name: 'Que risque-t-on en circulant sans assurance en France ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Une amende forfaitaire délictuelle de 500 euros, pouvant grimper jusqu'à 3 750 euros devant le tribunal, 7 500 euros en cas de récidive, avec immobilisation ou confiscation du véhicule possibles. Rouler sans assurance est un délit, pas une contravention.",
        },
      },
    ],
  },
];

export const articleData = {
  slug: 'assurance-auto-etranger-france',
  seo: {
    title: 'Assurance auto étranger en France : les 3 cas',
    description:
      "Véhicule étranger en France : UE, carte verte ou assurance frontière. Délais, permis étranger et sanctions, sources officielles vérifiées le 4 août 2026.",
    canonical: 'https://assutempo.fr/articles/assurance-auto-etranger-france',
    jsonLd,
  },
  category: 'International',
  readTime: '8 min',
  updatedDate: '4 août 2026',
  author: 'Evidence Assurances',
  headline: "Assurance auto étranger en France : UE, carte verte ou frontière",
  cta: {
    href: '/tarification',
    label: 'Assurer mon véhicule en 5 minutes',
    title: 'Assuré en 5 minutes, attestation immédiate.',
    subtitle: "Véhicule immatriculé à l'étranger accepté, à partir de la plaque ou du numéro de châssis.",
    suffix: 'Valable dans 34 pays européens.',
  },
  answerCapsule: {
    answer:
      "Un véhicule immatriculé à l'étranger relève de 3 régimes en France : UE/EEE (assurance d'origine), pays de la carte verte internationale (carte verte du pays d'origine), ou aucun des deux (assurance frontière, 30 à 90 jours). Résidence transférée en France : immatriculation sous 1 mois, permis hors UE sous 1 an.",
    facts: [
      {
        anchor: '1 mois',
        text: "Délai pour immatriculer en France un véhicule dès que la résidence normale y est transférée (article R322-5 du code de la route).",
      },
      {
        anchor: '1 an',
        text: "Délai pour échanger un permis délivré hors UE/EEE après l'installation en France, sous réserve d'un accord de réciprocité avec le pays d'origine (service-public.gouv.fr).",
      },
      {
        anchor: '30 ou 90 jours',
        text: "Durée d'une assurance frontière pour un véhicule hors UE/EEE et hors système de la carte verte, renouvelable une seule fois (article R211-24 du code des assurances).",
      },
      {
        anchor: '1er avril 2024',
        text: "Suppression en France du certificat d'assurance papier et de la vignette pour les véhicules assurés en France, remplacés par le Fichier des véhicules assurés et le Mémo véhicule assuré (ministère de l'Intérieur).",
      },
      {
        anchor: '40 €',
        text: "Droit de timbre exigé depuis le 12 mai 2026 pour toute demande d'échange de permis de conduire étranger contre un permis français (loi de finances 2026).",
      },
    ],
    updated: '4 août 2026',
  },
  sections: [
    {
      type: 'alert',
      heading: "L'essentiel",
      items: [
        "Trois régimes distincts selon le pays d'immatriculation du véhicule : Union européenne ou EEE, système de la carte verte internationale, ou aucun des deux, qui impose une assurance frontière.",
        "Résidence normale transférée en France : 1 mois pour immatriculer le véhicule (article R322-5 du code de la route), quel que soit le pays d'origine de la plaque.",
        "Permis de conduire hors UE/EEE : valable 1 an après l'installation en France, échangeable seulement si un accord de réciprocité existe avec le pays de délivrance.",
        "La carte verte n'a pas disparu : seuls le certificat papier et la vignette pour les véhicules assurés en France ont été supprimés le 1er avril 2024, remplacés par le Fichier des véhicules assurés.",
      ],
      note: "Délais et montants vérifiés au 4 août 2026. En cas de doute, la référence reste service-public.gouv.fr.",
    },
    {
      type: 'text',
      heading: "Peut-on rouler en France avec un véhicule immatriculé à l'étranger ?",
      paragraphs: [
        "Oui, à une condition : être assuré selon le régime qui correspond au pays d'immatriculation du véhicule. Trois cas existent, pas un seul, et c'est précisément ce que la plupart des pages sur le sujet aplatissent en une réponse unique.",
        "Un véhicule qui vient d'un pays de l'Union européenne ou de l'Espace économique européen circule avec l'assurance souscrite à l'origine. Un véhicule d'un pays tiers membre du système de la carte verte s'appuie sur cette même carte verte, délivrée par l'assureur étranger. Un véhicule hors de ces deux ensembles doit être couvert par une assurance frontière, un contrat spécifique à durée limitée.",
        "Deux obligations bien différentes se superposent ensuite : celle du véhicule, être assuré, dans les trois cas, et celle de la personne qui le conduit, dès qu'elle transfère sa résidence normale en France. C'est ce second point qui surprend le plus de monde, permis de conduire compris.",
      ],
    },
    {
      type: 'table',
      heading: "Quelles sont les règles selon le pays d'immatriculation du véhicule ?",
      intro:
        "Le tableau ci-dessous résume les trois cas pour le véhicule. Le sort du permis de conduire, différent, est traité plus bas dans un encart séparé.",
      columns: ['Immatriculation du véhicule', "Obligation d'assurance", 'Durée maximale de circulation', 'Document à présenter en contrôle'],
      rows: [
        [
          'Union européenne ou EEE',
          "Contrat souscrit dans le pays d'origine (garantie responsabilité civile harmonisée)",
          '1 an sans interruption pour un non-résident ; 1 mois pour immatriculer si la résidence normale passe en France',
          'Mémo véhicule assuré ou justificatif étranger équivalent, avec la carte grise du pays d\'origine',
        ],
        [
          'Pays du système de la carte verte, hors UE/EEE',
          "Carte verte remise par l'assureur d'origine",
          'Durée indiquée sur la carte verte ; 1 mois pour immatriculer si résidence transférée',
          'Carte verte physique ou électronique en cours de validité, avec la carte grise étrangère',
        ],
        [
          'Hors UE/EEE et hors système de la carte verte',
          'Assurance frontière obligatoire dès l\'entrée en France',
          '30 ou 90 jours, renouvelable une seule fois',
          "Attestation d'assurance frontière, avec la carte grise étrangère",
        ],
      ],
      note:
        "Le pays d'immatriculation du véhicule ne présume rien du permis de son conducteur : les deux régimes sont vérifiés séparément, voir l'encart plus bas.",
    },
    {
      type: 'decisionsplit',
      question: "Où est immatriculé le véhicule que vous conduisez en France ?",
      ariaLabel:
        "Arbre de décision en trois cas : véhicule immatriculé dans l'UE ou l'EEE, véhicule d'un pays du système de la carte verte, véhicule hors de ces deux ensembles nécessitant une assurance frontière",
      voies: [
        {
          statut: 'ok',
          icon: Globe,
          titre: "Immatriculé dans l'Union européenne ou l'EEE ?",
          verdict:
            "L'assurance souscrite dans le pays d'origine est reconnue en France, sans démarche. Si la résidence normale passe en France, 1 mois pour immatriculer.",
        },
        {
          statut: 'vigilance',
          icon: ShieldCheck,
          titre: 'Immatriculé dans un pays du système de la carte verte internationale ?',
          verdict:
            "La carte verte remise par l'assureur d'origine sert de justificatif, pour la durée qu'elle indique. Vérifiez sa date de validité avant de prendre la route.",
        },
        {
          statut: 'vigilance',
          icon: AlertTriangle,
          titre: 'Ni l\'un ni l\'autre ?',
          verdict:
            "Une assurance frontière est obligatoire dès l'entrée en France : contrat de 30 ou 90 jours, renouvelable une seule fois, souscrit auprès d'un assureur agréé.",
        },
      ],
    },
    {
      type: 'text',
      heading: "L'Union européenne et l'EEE : le cas le plus simple",
      paragraphs: [
        [
          "La grande majorité des véhicules étrangers croisés sur les routes françaises entrent dans ce premier cas. Une assurance responsabilité civile souscrite en ",
          { to: '/carte/allemagne', texte: 'Allemagne' },
          ', en ',
          { to: '/carte/espagne', texte: 'Espagne' },
          ', en ',
          { to: '/carte/belgique', texte: 'Belgique' },
          " ou dans tout autre État de l'UE ou de l'EEE couvre automatiquement la circulation en France : aucune formalité, aucun document à faire viser à la frontière.",
        ],
        "Ce qui pose problème dans la pratique, c'est le calendrier plutôt que l'assurance elle-même. Un non-résident peut faire circuler son véhicule en France jusqu'à un an sans interruption. Mais dès qu'une personne installe sa résidence normale en France, logement, emploi ou famille, ce délai retombe à un mois pour immatriculer le véhicule (article R322-5 du code de la route), quel que soit le pays d'origine de la plaque.",
        "L'équipe AssuTempo voit régulièrement des dossiers de personnes convaincues d'avoir encore de la marge parce qu'elles ont entendu parler du délai d'un an, alors qu'elles ont déjà changé de domicile fiscal en France depuis plusieurs mois sans le rattacher à leur véhicule. Le repère à retenir n'est pas la date d'entrée du véhicule, mais la date à laquelle la résidence normale a réellement basculé.",
      ],
    },
    {
      type: 'text',
      heading: "Un pays de la carte verte internationale, hors UE : ce qui change",
      paragraphs: [
        [
          "Le système de la carte verte est un accord multilatéral entre bureaux nationaux d'assurance, antérieur à l'Union européenne et toujours en vigueur aujourd'hui. Un véhicule immatriculé au Maroc, en Turquie, au ",
          { to: '/carte/royaume-uni', texte: 'Royaume-Uni' },
          " ou dans un autre pays membre peut circuler en France muni de la carte verte remise par son assureur d'origine, valable pour la durée qui y est indiquée.",
        ],
        "Cette carte verte est un document que l'assureur étranger imprime ou transmet, distinct de tout dispositif français. Le point à vérifier avant de prendre la route reste simple : sa date de validité. Une carte verte expirée équivaut à une absence d'assurance aux yeux d'un contrôle, même si le contrat sous-jacent est toujours actif.",
      ],
    },
    {
      type: 'text',
      heading: "Ni l'UE ni la carte verte : l'assurance frontière",
      paragraphs: [
        "Quand le pays d'immatriculation ne relève ni de l'UE/EEE ni du système de la carte verte, la loi impose une assurance frontière dès l'entrée sur le territoire français (article R211-24 du code des assurances, décret n°2019-214 du 20 mars 2019). Elle se souscrit auprès d'un assureur agréé pour ce type de contrat, ou du groupement dédié géré par le Bureau central français.",
        "Sa durée est encadrée : 30 ou 90 jours, renouvelable une seule fois. Passé ce délai maximal, le véhicule doit être immatriculé en France ou avoir quitté le territoire.",
        "Ce contrat ne fait pas partie de l'offre d'AssuTempo. Notre assurance temporaire couvre la responsabilité civile d'un véhicule immatriculé à l'étranger conduit par un résident en cours de régularisation, pas la circulation frontalière d'un véhicule qui reste immatriculé à l'étranger. Pour une assurance frontière, l'interlocuteur reste un assureur agréé pour ce contrat précis ou le Bureau central français : s'y tromper fait perdre du temps plutôt qu'en gagner.",
      ],
      relatedLink: {
        text: 'Assurance pour rouler hors Europe : ce que couvre AssuTempo',
        href: '/assurance-internationale',
      },
    },
    {
      type: 'alert',
      heading: "Permis de conduire étranger : une règle indépendante du véhicule",
      items: [
        "Permis délivré dans l'UE ou l'EEE : reconnu directement en France, valable jusqu'à sa date d'expiration normale, tant qu'il n'a pas été suspendu ni annulé. Aucun échange obligatoire.",
        "Permis délivré hors UE/EEE : valable 1 an à compter de l'installation en France. Passé ce délai, seul un accord de réciprocité entre la France et le pays de délivrance permet l'échange contre un permis français.",
        "Le piège le plus fréquent : le délai d'un an court à partir de l'installation réelle en France, pas de l'entrée du véhicule ni d'une date de passeport. Beaucoup ne s'en aperçoivent qu'après coup.",
        "Depuis le 12 mai 2026, un droit de timbre de 40 euros est exigé pour toute demande d'échange de permis, français ou étranger, en application de la loi de finances 2026.",
      ],
      note:
        "Sans accord de réciprocité, il n'y a pas d'échange possible : il faut repasser l'examen du permis français. La liste des pays concernés est publiée par la sécurité routière, à vérifier avant toute démarche sur securite-routiere.gouv.fr.",
    },
    {
      type: 'text',
      heading: "Combien de temps peut-on rouler en France avec des plaques étrangères ?",
      paragraphs: [
        "La réponse dépend de la résidence de la personne, pas du véhicule. Un non-résident, de passage ou en usage réellement temporaire, peut circuler jusqu'à un an sans interruption avec sa plaque d'origine. Un résident, dès que sa résidence normale est en France, dispose d'un mois pour immatriculer le véhicule, quel que soit son pays de provenance.",
        "Cette durée d'un an ne dispense jamais de l'assurance : elle concerne uniquement l'obligation d'immatriculation. Un véhicule en visite depuis onze mois doit rester assuré du premier au dernier jour, selon le cas qui le concerne dans le tableau plus haut.",
      ],
    },
    {
      type: 'text',
      heading: "Que risque-t-on en cas de défaut d'assurance ?",
      paragraphs: [
        "Rouler sans assurance en France est un délit, pas une simple contravention (obligation d'assurance posée par l'article L211-1 du code des assurances, sanction fixée par le code de la route). L'amende forfaitaire délictuelle s'élève à 500 euros, minorée à 400 euros en cas de paiement rapide, majorée à 1 000 euros passé le délai.",
        "Devant le tribunal, l'amende peut atteindre 3 750 euros, 7 500 euros en cas de récidive, avec immobilisation ou confiscation du véhicule possibles. Ce risque existe dans les trois cas vus plus haut, pas seulement pour un véhicule français.",
      ],
      relatedLink: {
        text: 'Contrôlé sans assurance : risques, amende et que faire',
        href: '/articles/controle-sans-assurance-risques-amende',
      },
    },
    {
      type: 'text',
      heading: "Le pays d'immatriculation ne dit pas tout : les règles au volant changent aussi",
      paragraphs: [
        [
          "Le régime d'assurance dépend du pays d'immatriculation, mais une fois sur la route, ce sont les règles locales qui s'appliquent, et elles varient d'un pays à l'autre : vignette obligatoire, péages, équipements exigés à bord, limitations propres aux véhicules étrangers. Un trajet de retour vers la France traverse souvent trois ou quatre pays. Les fiches détaillées existent pour chacun, notamment ",
          { to: '/carte/italie', texte: "l'Italie" },
          ', la ',
          { to: '/carte/suisse', texte: 'Suisse' },
          ", l'",
          { to: '/carte/autriche', texte: 'Autriche' },
          ', les ',
          { to: '/carte/pays-bas', texte: 'Pays-Bas' },
          ', la ',
          { to: '/carte/pologne', texte: 'Pologne' },
          ', le ',
          { to: '/carte/portugal', texte: 'Portugal' },
          ' et la ',
          { to: '/carte/republique-tcheque', texte: 'République tchèque' },
          '.',
        ],
        [
          "Deux exemples de ce qui se joue au bord de la route plutôt que dans le contrat : la ",
          { to: '/carte/suisse', texte: 'Suisse' },
          " exige une vignette autoroutière valable à l'année, quel que soit le nombre de passages, et la ",
          { to: '/carte/slovenie', texte: 'Slovénie' },
          " impose l'équipement hiver à bord du 15 novembre au 15 mars. Ces règles ne touchent pas la validité de l'assurance, mais ce sont elles qui se verbalisent en contrôle. Le détail pays par pays est réuni sur ",
          { to: '/carte', texte: 'la carte des 34 pays couverts' },
          '.',
        ],
      ],
    },
    {
      type: 'text',
      heading: "Immatriculer le véhicule : la suite logique",
      paragraphs: [
        "Une fois assuré, la suite passe par l'immatriculation française. AssuTempo propose un service carte grise 100 % en ligne, qui prépare le dossier et le transmet à un professionnel habilité par le Ministère de l'Intérieur pour la saisie dans le système d'immatriculation des véhicules, ou à l'Agence nationale des titres sécurisés selon le dossier.",
      ],
      relatedLink: {
        text: 'Faire ma carte grise en ligne',
        href: '/carte-grise',
      },
    },
    {
      type: 'checklist',
      heading: "Les documents pour lancer l'immatriculation",
      intro:
        "L'assurance ne remplace pas l'immatriculation : elle couvre le véhicule pendant que le dossier se prépare. Ces pièces sont généralement demandées, en plus de la carte grise étrangère :",
      items: [
        "Le certificat de conformité européen ou un rapport technique d'identification si le véhicule vient d'un pays hors UE",
        "Le quitus fiscal délivré par l'administration fiscale pour un véhicule neuf ou récent acheté à l'étranger (impots.gouv.fr)",
        "Un contrôle technique français si le véhicule a plus de 4 ans",
        "Une preuve de domicile en France de moins de 6 mois",
      ],
      note: "Le certificat provisoire d'immatriculation permet de rouler légalement en France pendant que le dossier est instruit.",
      relatedLink: {
        text: 'Combien de temps pour obtenir une carte grise ? Les délais réels',
        href: '/articles/combien-de-temps-carte-grise',
      },
    },
    {
      type: 'text',
      heading: "L'assurance temporaire, la solution concrète pendant la régularisation",
      paragraphs: [
        "Pour un véhicule immatriculé à l'étranger qui doit être assuré en France le temps des démarches, la souscription se fait en ligne, à partir de la plaque étrangère ou du numéro de châssis si la plaque n'est plus exploitable. L'attestation arrive par email en quelques minutes, de 1 à 90 jours selon la durée réellement nécessaire.",
        "Cet article est rédigé par l'équipe AssuTempo, la marque du courtier Evidence Assurances, ORIAS 20005719, SIRET 884 641 523 00011. Les chiffres légaux cités proviennent de service-public.gouv.fr, legifrance.gouv.fr et securite-routiere.gouv.fr ; en cas de doute sur un montant ou un délai, cette vérification directe reste le bon réflexe avant toute démarche.",
      ],
      relatedLink: {
        text: 'Véhicule ou permis étranger : rouler assuré en France',
        href: '/articles/assurance-temporaire-vehicule-etranger-france',
      },
    },
  ],
  faqItems: [
    {
      q: "Peut-on assurer en France un véhicule immatriculé à l'étranger ?",
      a: "Oui. Un véhicule de l'UE ou de l'EEE circule avec son assurance d'origine, un véhicule d'un pays de la carte verte internationale avec la carte verte remise par son assureur, et un véhicule hors de ces deux ensembles doit souscrire une assurance frontière. Pour un résident qui doit encore régulariser l'immatriculation, une assurance temporaire de 1 à 90 jours couvre le véhicule à partir de la plaque étrangère ou du numéro de châssis.",
    },
    {
      q: 'Combien de temps peut-on rouler en France avec des plaques étrangères ?',
      a: "Jusqu'à un an sans interruption si la résidence normale du propriétaire reste hors de France. Dès que cette résidence bascule en France, le délai retombe à un mois pour immatriculer le véhicule (article R322-5 du code de la route), quel que soit le pays d'origine de la plaque.",
    },
    {
      q: "Qu'est-ce que l'assurance frontière et qui doit la souscrire ?",
      a: "C'est un contrat obligatoire pour tout véhicule immatriculé hors UE/EEE et hors système de la carte verte internationale qui entre en France. Sa durée est de 30 ou 90 jours, renouvelable une seule fois (article R211-24 du code des assurances). Elle se souscrit auprès d'un assureur agréé ou du groupement dédié, pas dans une offre d'assurance temporaire classique.",
    },
    {
      q: 'Un permis de conduire étranger est-il valable pour rouler en France ?',
      a: "Un permis délivré dans l'UE ou l'EEE reste valable en France jusqu'à sa date d'expiration, sans échange obligatoire. Un permis délivré hors UE/EEE reste valable un an après l'installation en France, puis doit être échangé contre un permis français si un accord de réciprocité existe avec le pays de délivrance, moyennant un droit de timbre de 40 euros depuis le 12 mai 2026.",
    },
    {
      q: "La carte verte d'assurance a-t-elle disparu en France ?",
      a: "Non. Le système international de la carte verte existe toujours et reste la référence pour les véhicules de pays tiers. Ce qui a disparu le 1er avril 2024, c'est uniquement le certificat papier et la vignette pour les véhicules assurés en France, remplacés par le Fichier des véhicules assurés et le Mémo véhicule assuré.",
    },
    {
      q: 'Que risque-t-on en circulant sans assurance en France ?',
      a: "Une amende forfaitaire délictuelle de 500 euros, pouvant grimper jusqu'à 3 750 euros devant le tribunal, 7 500 euros en cas de récidive, avec immobilisation ou confiscation du véhicule possibles. Rouler sans assurance est un délit, pas une contravention.",
    },
  ],
};
