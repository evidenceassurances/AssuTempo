const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: "Combien de temps pour obtenir une carte grise ? Les délais réels",
    description:
      "Combien de temps pour obtenir sa carte grise ? Délais réels du certificat provisoire et de la carte grise définitive, ANTS ou pro habilité.",
    author: { '@type': 'Organization', name: 'Evidence Assurances' },
    publisher: {
      '@type': 'Organization',
      name: 'AssuTempo',
      logo: { '@type': 'ImageObject', url: 'https://assutempo.fr/logo.png' },
    },
    mainEntityOfPage: 'https://assutempo.fr/articles/combien-de-temps-carte-grise',
    datePublished: '2026-07-13',
    dateModified: '2026-07-13',
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
        name: "Combien de temps pour obtenir une carte grise ? Les délais réels",
        item: 'https://assutempo.fr/articles/combien-de-temps-carte-grise',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: "Combien de temps faut-il pour obtenir une carte grise après un achat ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Le certificat provisoire d'immatriculation (CPI) s'obtient en quelques heures via un professionnel habilité, ou en un délai variable en direct sur le site de l'ANTS. La carte grise définitive, fabriquée par France Titres, arrive ensuite par courrier sous quelques jours à plusieurs semaines selon le département.",
        },
      },
      {
        '@type': 'Question',
        name: 'Le certificat provisoire d\'immatriculation permet-il de rouler immédiatement ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui, dès sa délivrance et pendant 1 mois, en France uniquement. Il porte la plaque définitive du véhicule et vaut carte grise le temps que le titre papier arrive.",
        },
      },
      {
        '@type': 'Question',
        name: 'Quelle amende en cas de carte grise non faite dans les délais ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Une amende forfaitaire de 135 €, minorée à 90 € en paiement rapide, majorée à 375 € (service-public.gouv.fr). Devant le tribunal, l'amende peut atteindre 750 €, plafond des contraventions de 4e classe (article 131-13 du code pénal).",
        },
      },
      {
        '@type': 'Question',
        name: "Un professionnel habilité va-t-il plus vite qu'une démarche seule sur le site de l'ANTS ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Pour le certificat provisoire, oui en général : le dossier est vérifié avant transmission, ce qui réduit le risque de rejet. Pour la fabrication du titre définitif, le délai dépend de France Titres et reste comparable quelle que soit la voie choisie.",
        },
      },
    ],
  },
];

export const articleData = {
  slug: 'combien-de-temps-carte-grise',
  seo: {
    title: "Carte grise : combien de temps pour l'obtenir ?",
    description:
      "Combien de temps pour obtenir sa carte grise ? Délais réels du certificat provisoire (CPI) et de la carte grise définitive, ANTS ou pro habilité.",
    canonical: 'https://assutempo.fr/articles/combien-de-temps-carte-grise',
    jsonLd,
  },
  category: 'Carte grise',
  readTime: '6 min',
  updatedDate: '13 juillet 2026',
  author: 'Evidence Assurances',
  headline: 'Combien de temps pour obtenir une carte grise en 2026 ?',
  cta: {
    href: '/carte-grise',
    label: 'Démarrer ma carte grise',
    title: 'Certificat provisoire délivré sous 24 h ouvrées.',
    subtitle: 'Dossier vérifié avant transmission, saisie SIV par un professionnel habilité.',
    suffix: 'Sans rendez-vous.',
  },
  answerCapsule: {
    answer:
      "Le certificat provisoire d'immatriculation (CPI) est édité dès la saisie du dossier dans le SIV par un professionnel habilité par le Ministère de l'Intérieur, et autorise à rouler en France pendant 1 mois. La carte grise définitive, fabriquée par France Titres, arrive ensuite par courrier sous quelques jours à quelques semaines.",
    facts: [
      {
        anchor: '1 mois',
        text: "Délai légal pour immatriculer un véhicule après achat, à partir de la date du certificat de cession (article R322-5 du code de la route).",
      },
      {
        anchor: 'Sous 24 h ouvrées',
        text: "Délai de vérification du dossier annoncé par Certimat, la plateforme partenaire d'AssuTempo (assutempo.fr) ; le CPI est ensuite édité dès la saisie dans le SIV.",
      },
      {
        anchor: '135 €',
        text: "Amende forfaitaire si le véhicule circule sans carte grise à votre nom passé le délai : contravention de 4e classe, jusqu'à 750 € devant le tribunal (article 131-13 du code pénal).",
      },
    ],
    updated: '13 juillet 2026',
  },
  sections: [
    {
      type: 'alert',
      heading: "L'essentiel",
      items: [
        "1 mois calendaire pour immatriculer un véhicule après achat, à partir de la date du certificat de cession (article R322-5 du code de la route).",
        "Le certificat provisoire d'immatriculation (CPI) autorise à rouler en France dès sa délivrance, pendant 1 mois.",
        "Le CPI est édité dès la saisie du dossier dans le SIV par un professionnel habilité ; une démarche seule auprès de l'ANTS prend souvent plus de temps, sans vérification préalable du dossier.",
        "Passé le délai, maintenir le véhicule en circulation est une contravention de 4e classe : 135 € d'amende forfaitaire, jusqu'à 750 € devant le tribunal (article 131-13 du code pénal).",
      ],
    },
    {
      type: 'table',
      heading: 'Quel délai selon la voie choisie pour immatriculer son véhicule ?',
      intro:
        "Le délai pour ROULER (certificat provisoire) et le délai pour RECEVOIR le titre définitif ne se confondent pas. Voici ce que change concrètement chaque voie.",
      columns: ['Voie', 'Délai pour rouler (CPI)', 'Délai carte grise définitive', 'Habilitation'],
      rows: [
        [
          "Démarche seule sur le site de l'ANTS",
          'Variable, souvent plusieurs jours si le dossier est incomplet ou rejeté',
          'De quelques jours à plusieurs semaines selon le département',
          'Aucune vérification préalable du dossier par un tiers',
        ],
        [
          'Dossier préparé par une plateforme (ex. Certimat, partenaire AssuTempo), saisie SIV par un professionnel habilité',
          'Dossier vérifié sous 24 h ouvrées, puis CPI édité dès la saisie dans le SIV',
          'Idem, dépend de la fabrication par France Titres, mais moins de rejets pour pièce manquante',
          "Le professionnel qui saisit est habilité par le préfet, au nom du Ministère de l'Intérieur. La plateforme, elle, est un intermédiaire technologique : elle n'est pas habilitée au SIV",
        ],
      ],
      note:
        "Dans les deux cas, c'est France Titres (ANTS) qui fabrique et expédie le titre définitif : aucun circuit ne peut accélérer cette étape précise. Le gain de temps se joue en amont, sur la qualité du dossier déposé.",
    },
    {
      type: 'text',
      heading: 'Quel est le délai légal pour faire sa carte grise après un achat ?',
      paragraphs: [
        "Un mois calendaire, à compter de la date inscrite sur le certificat de cession (Cerfa 15776) : c'est l'article R322-5 du code de la route qui le fixe. Ce qui est sanctionné ensuite, c'est le fait de maintenir le véhicule en circulation sans certificat d'immatriculation à son nom. Un contrôle routier expose alors à une amende forfaitaire de 135 €, minorée à 90 € en cas de paiement rapide, majorée à 375 € (service-public.gouv.fr), et jusqu'à 750 € devant le tribunal, plafond des contraventions de 4e classe (article 131-13 du code pénal). Le véhicule peut aussi être immobilisé.",
        "Le compteur démarre à la signature, pas à la première sortie du véhicule. Un dossier déposé le 25e jour reste dans les temps, à condition d'être complet dès l'envoi.",
      ],
    },
    {
      type: 'text',
      heading: "Comment fonctionne le certificat provisoire d'immatriculation (CPI) ?",
      paragraphs: [
        "Le CPI est un document délivré par France Titres via le système d'immatriculation des véhicules (SIV), dès que le dossier est validé. Il porte la plaque définitive du véhicule et autorise à circuler en France, en attendant la fabrication et l'envoi du titre papier. Sa durée de validité est d'un mois dans le cas général, un peu plus longue pour certains cas particuliers comme la location courte durée.",
        "Concrètement, une fois le CPI en main, imprimé ou au format numérique, le véhicule roule normalement : contrôle routier, péage, stationnement. Seul un déplacement hors de France reste exclu tant que le titre définitif n'est pas arrivé.",
        "Nuance à connaître : la durée d'un mois correspond au cas général d'un achat entre particuliers ou chez un professionnel. Certaines situations spécifiques, comme la location longue durée ou une immatriculation diplomatique, suivent des durées de validité différentes fixées par la réglementation. Pour un achat de voiture classique, retenir un mois reste le repère fiable.",
      ],
    },
    {
      type: 'text',
      heading: "Pourquoi la démarche directe auprès de l'ANTS prend-elle souvent plus de temps ?",
      paragraphs: [
        "Le site de l'ANTS reste ouvert à tous, sans intermédiaire obligatoire. Le délai de traitement varie fortement selon le département et la charge du service instructeur, en général de quelques jours à plusieurs semaines. Un professionnel habilité ne contourne pas cette file d'attente institutionnelle : il pré-vérifie le dossier, CERFA, pièces, calcul des taxes, avant de le transmettre, ce qui réduit le risque de rejet.",
        "Un dossier rejeté pour une pièce manquante ou une photo illisible repart en bas de la pile. C'est cet aller-retour, plus que la fabrication du titre elle-même, qui allonge le plus souvent le délai réellement ressenti par le nouveau propriétaire.",
      ],
      relatedLink: {
        text: "Dossier bloqué sur l'ANTS : les causes fréquentes et comment le débloquer",
        href: '/articles/carte-grise-ants-bloquee',
      },
    },
    {
      type: 'text',
      heading: "Qu'est-ce qu'un professionnel habilité au SIV, concrètement ?",
      paragraphs: [
        "L'habilitation est accordée par le préfet du département, au nom du Ministère de l'Intérieur, à des professionnels de l'automobile qui signent une convention avec France Titres. Elle les autorise à transmettre directement une demande d'immatriculation dans le système national (SIV), CERFA préremplis et pièces vérifiées avant l'envoi. À ne pas confondre avec l'agrément, lui accordé par la DGFIP, qui autorise à percevoir les taxes d'immatriculation pour le compte de l'État : on peut être habilité sans être agréé.",
        "Une plateforme en ligne, elle, n'est pas forcément habilitée, et c'est le point que la plupart des sites laissent volontairement flou. Le service carte grise d'AssuTempo (assutempo.fr) passe par la plateforme Certimat, qui agit comme intermédiaire technologique : elle prépare le dossier, puis vous met en relation avec des professionnels habilités par le Ministère de l'Intérieur pour la saisie dans le SIV, ou transmet le dossier à l'ANTS (France Titres). Avant de confier une démarche urgente à une plateforme, le bon réflexe n'est donc pas de chercher un logo officiel, mais de lui demander qui saisit réellement dans le SIV.",
      ],
      relatedLink: {
        text: 'Le guide complet pour obtenir un certificat provisoire immédiat',
        href: '/articles/carte-grise-urgence-cpi-immediat',
      },
    },
    {
      type: 'text',
      heading: 'Le certificat provisoire expire avant l\'arrivée de la carte grise : que faire ?',
      paragraphs: [
        "Le cas reste rare, mais il arrive quand la fabrication du titre définitif prend exceptionnellement plus d'un mois, souvent en période de forte affluence chez France Titres. Le réflexe n'est pas de continuer à rouler avec un CPI expiré : mieux vaut vérifier l'avancement du dossier depuis l'espace personnel ANTS et se rapprocher du professionnel habilité qui a monté la demande, plutôt que de risquer un contrôle sans document valide.",
        "Un renouvellement du certificat provisoire est possible dans ce cas précis, sur justification du retard. La démarche se fait auprès du même professionnel ou service qui a traité le dossier initial, sans repartir de zéro.",
      ],
    },
    {
      type: 'text',
      heading: 'La démarche peut-elle se faire un soir ou un week-end ?',
      paragraphs: [
        "Oui pour la partie en ligne : saisie du dossier, calcul des taxes et paiement sont accessibles à toute heure, depuis un téléphone ou un ordinateur. Le traitement effectif du dossier par le service instructeur, lui, suit des horaires ouvrés classiques, que la demande passe par l'ANTS ou par un professionnel habilité.",
        "La différence se joue donc surtout en amont, sur la rapidité à constituer un dossier complet et exploitable dès son dépôt, plutôt que sur l'heure à laquelle il est envoyé. Un dossier déposé un dimanche soir n'est traité que le lundi, mais un dossier complet évite d'attendre un second aller-retour.",
      ],
    },
    {
      type: 'checklist',
      heading: 'Quels documents accélèrent vraiment le délai ?',
      intro: "Un dossier complet dès le premier envoi évite l'aller-retour qui coûte le plus de temps. Réunissez avant de commencer :",
      items: [
        "Le certificat de cession (Cerfa 15776) ou l'ancienne carte grise barrée, datée et signée",
        'Un justificatif de domicile de moins de 6 mois',
        "Une pièce d'identité en cours de validité",
        'Le contrôle technique en cours de validité si le véhicule a plus de 4 ans',
        "Un moyen de paiement pour les taxes d'immatriculation",
      ],
      relatedLink: {
        text: "Combien coûte l'assurance à prévoir en parallèle de la carte grise ?",
        href: '/articles/prix-assurance-auto-temporaire',
      },
    },
    {
      type: 'text',
      heading: 'Quels véhicules sont concernés par ces délais ?',
      paragraphs: [
        "Le principe s'applique à tout véhicule soumis au système d'immatriculation des véhicules (SIV) : voiture particulière, utilitaire léger, camping-car ou moto, acheté neuf ou d'occasion, en France comme importé d'un autre pays européen. Les délais de traitement décrits plus haut restent globalement les mêmes d'une catégorie à l'autre.",
        "Un véhicule importé demande en général une pièce supplémentaire, le certificat de conformité européen ou le quitus fiscal selon les cas, ce qui peut allonger le délai de constitution du dossier sans changer le principe : certificat provisoire d'abord, titre définitif ensuite. Un dossier d'importation mal préparé est justement le type de dossier où un professionnel habilité fait gagner le plus de temps, en anticipant la pièce manquante avant l'envoi plutôt qu'en la découvrant au rejet.",
      ],
      relatedLink: { text: 'Le guide complet du changement de titulaire, étape par étape', href: '/articles/changement-titulaire-carte-grise' },
    },
    {
      type: 'text',
      heading: 'Faut-il être assuré pendant ce délai, même avec un simple certificat provisoire ?',
      paragraphs: [
        "Oui, sans exception. Le CPI ne dispense jamais de l'obligation d'assurance : la responsabilité civile doit couvrir le véhicule dès le premier trajet, plaque provisoire ou définitive. L'absence d'assurance est une infraction distincte de l'absence de carte grise, sanctionnée séparément (amende forfaitaire de 500 €, jusqu'à 3 750 € d'amende pénale, Code de la route article L324-2).",
        "Une assurance temporaire AssuTempo délivre une attestation par email en 5 minutes, sans attendre que la carte grise soit finalisée à votre nom. De quoi couvrir le véhicule dès la sortie du parking, CPI en poche ou non.",
      ],
      relatedLink: {
        text: 'Assurer le véhicule dès la sortie du parking',
        href: '/tarification',
      },
    },
  ],
  faqItems: [
    {
      q: "Combien de temps faut-il pour obtenir une carte grise après un achat ?",
      a: "Le certificat provisoire d'immatriculation (CPI) s'obtient en quelques heures via un professionnel habilité, ou en un délai variable en direct sur le site de l'ANTS. La carte grise définitive, fabriquée par France Titres, arrive ensuite par courrier sous quelques jours à plusieurs semaines selon le département.",
    },
    {
      q: "Le certificat provisoire d'immatriculation permet-il de rouler immédiatement ?",
      a: "Oui, dès sa délivrance et pendant 1 mois, en France uniquement. Il porte la plaque définitive du véhicule et vaut carte grise le temps que le titre papier arrive.",
    },
    {
      q: 'Quelle amende en cas de carte grise non faite dans les délais ?',
      a: "Une amende forfaitaire de 135 €, minorée à 90 € en paiement rapide, majorée à 375 € (service-public.gouv.fr). Devant le tribunal, l'amende peut atteindre 750 €, plafond des contraventions de 4e classe (article 131-13 du code pénal).",
    },
    {
      q: "Un professionnel habilité va-t-il plus vite qu'une démarche seule sur le site de l'ANTS ?",
      a: "Pour le certificat provisoire, oui en général : le dossier est vérifié avant transmission, ce qui réduit le risque de rejet. Pour la fabrication du titre définitif, le délai dépend de France Titres et reste comparable quelle que soit la voie choisie.",
    },
  ],
};
