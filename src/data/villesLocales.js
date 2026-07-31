/* Données des pages locales « assurance temporaire et carte grise à <ville> ».
   Chantier structurel 04 (issue #43). Une entrée = une ville, un contenu
   réellement propre à cette ville (aucun bloc générique réutilisé mot pour
   mot d'une ville à l'autre). Faits vérifiés le 1er août 2026, sources
   listées dans QA.md ville par ville. */

export const VILLES_LOCALES = {
  paris: {
    slug: 'paris',
    routePath: '/assurance-temporaire-carte-grise-paris',
    nom: 'Paris',
    breadcrumbName: 'Assurance temporaire et carte grise à Paris',
    eyebrow: 'ASSURANCE TEMPORAIRE ET CARTE GRISE',
    h1: 'Assurance temporaire et carte grise à Paris',
    intro:
      "Un enlèvement, un achat de véhicule ou un dossier de carte grise à traiter dans la capitale : ce qu'il faut savoir avant de se déplacer.",
    dateMaj: '1er août 2026',
    meta: {
      title: 'Assurance temporaire et carte grise à Paris | AssuTempo',
      description:
        "Fourrière parisienne, ZFE du Grand Paris, carte grise après achat : le guide local à jour, attestation d'assurance immédiate.",
    },
    capsule: {
      answer:
        "À Paris, la mainlevée d'un véhicule enlevé se demande directement au guichet de la (pré)fourrière, sans détour par un commissariat : il faut une pièce d'identité, le certificat d'immatriculation et une attestation d'assurance en cours de validité. Une assurance temporaire souscrite en ligne fournit cette attestation en quelques minutes. Pour la carte grise, la démarche passe par l'ANTS ou un professionnel habilité, plus par un guichet de préfecture.",
      facts: [
        {
          anchor: 'Guichet unique',
          text: "La mainlevée se demande directement à la (pré)fourrière, jamais au commissariat : particularité parisienne confirmée par la Ville de Paris.",
        },
        {
          anchor: '2026',
          text: "La Métropole du Grand Paris reconduit sa période pédagogique ZFE sans sanction jusqu'au 31 décembre 2026 (annonce du 22 décembre 2025).",
        },
        {
          anchor: '1 mois',
          text: "Délai légal pour immatriculer un véhicule d'occasion à son nom, à compter de la date de cession (article R322-5 du code de la route).",
        },
      ],
      updated: '1er août 2026',
    },
    bandeau: [
      {
        figure: 'Guichet de fourrière',
        title: 'la mainlevée se traite sur place, pas au commissariat',
        body: "Sur présentation d'une pièce d'identité, du certificat d'immatriculation et d'une attestation d'assurance valide, directement au guichet de la (pré)fourrière.",
        ref: 'Ville de Paris, service Fourrières',
      },
      {
        figure: 'Zéro sanction',
        title: 'ZFE : période pédagogique prolongée pour 2026',
        body: "La Métropole du Grand Paris a reconduit le 22 décembre 2025 sa période sans amende pour les véhicules Crit'Air 3, 4, 5 et non classés, jusqu'au 31 décembre 2026.",
        ref: 'Métropole du Grand Paris',
      },
      {
        figure: '500 à 3 750 €',
        title: "l'amende pour défaut d'assurance",
        body: "Rouler sans attestation valide est un délit puni d'une amende forfaitaire délictuelle de 500 €, minorée à 400 €, majorée à 1 000 €, jusqu'à 3 750 € devant le tribunal.",
        ref: 'Article L324-2 du code de la route',
      },
    ],
    concretement: {
      title: 'À Paris, concrètement',
      paragraphs: [
        "Paris concentre le stationnement payant le plus dense de France et des dispositifs dédiés aux enlèvements sur voirie et en zones de circulation restreinte. Un enlèvement pour stationnement gênant ou défaut d'assurance se solde presque toujours par un passage en préfourrière avant restitution, la ville disposant de plusieurs sites intra muros pour absorber ce volume.",
        "Autre particularité locale : la Métropole du Grand Paris a choisi, fin 2025, de reconduire pour toute l'année 2026 une ZFE sans sanction pour les Crit'Air 3, 4, 5 et non classés. Concrètement, aucune amende automatique ne tombe encore sur ces véhicules dans la capitale et les 77 communes du périmètre A86, contrairement à d'autres métropoles déjà passées en phase répressive.",
        "Ce sursis réglementaire ne change rien à l'obligation d'assurance : un véhicule qui roule dans Paris, quel que soit son Crit'Air, doit être couvert dès le premier trajet.",
      ],
    },
    fourriere: {
      title: 'Sortir un véhicule de fourrière à Paris',
      paragraphs: [
        "À Paris, la mainlevée ne se demande pas au commissariat mais directement au guichet de la (pré)fourrière où le véhicule a été conduit. Il faut présenter une pièce d'identité ou un permis correspondant à la catégorie du véhicule, le certificat d'immatriculation, et une attestation d'assurance en cours de validité, consultable via le fichier des véhicules assurés. La démarche peut aussi se faire en ligne via FranceConnect, avec le numéro de permis et la date d'émission de la carte grise.",
        "Si le contrat d'assurance a expiré ou n'a jamais existé, la sortie de fourrière reste bloquée tant qu'aucune attestation valide n'est présentée. Une assurance temporaire souscrite en ligne délivre cette attestation en quelques minutes, jour et nuit, ce qui remplit l'exigence du guichet. Elle ne remplace pas la mainlevée elle-même : les deux démarches restent distinctes et se cumulent.",
      ],
      cta: { text: "Obtenir une attestation d'assurance maintenant", href: '/tarification' },
    },
    carteGrise: {
      title: 'La carte grise après un achat à Paris',
      paragraphs: [
        "Les guichets de la préfecture de police ne délivrent plus les certificats d'immatriculation depuis la fermeture de ce service en 2017. Toute demande, qu'il s'agisse d'un changement de titulaire après achat ou d'un duplicata, passe désormais par le site de l'ANTS ou par un professionnel de l'automobile habilité au SIV, mandaté pour effectuer la démarche.",
        "Le nouveau titulaire dispose d'un mois à compter de la date de cession pour immatriculer le véhicule à son nom. Pendant ce délai, il peut circuler à Paris avec la carte grise barrée par le vendeur et le certificat de cession. Passé ce délai, la contravention de 4e classe s'applique, jusqu'à 750 € devant le tribunal.",
      ],
      cta: { text: 'Faire ma carte grise en ligne', href: '/carte-grise' },
    },
    faq: [
      {
        q: "Où obtenir la mainlevée d'un véhicule mis en fourrière à Paris ?",
        a: "Directement au guichet de la (pré)fourrière où le véhicule a été emmené, sans passage préalable par un commissariat. Il faut présenter une pièce d'identité, le certificat d'immatriculation et une attestation d'assurance en cours de validité. La démarche est aussi possible en ligne via FranceConnect.",
      },
      {
        q: "La ZFE parisienne sanctionne-t-elle déjà les véhicules Crit'Air 3 en 2026 ?",
        a: "Non. La Métropole du Grand Paris a reconduit le 22 décembre 2025 sa période pédagogique sans amende jusqu'au 31 décembre 2026 pour les Crit'Air 3, 4, 5 et non classés. La circulation reste restreinte en semaine, mais aucune sanction automatique n'est appliquée.",
      },
      {
        q: 'Une assurance temporaire suffit-elle à faire sortir une voiture de la fourrière ?',
        a: "Non. Elle couvre une des conditions exigées au guichet, l'attestation d'assurance en cours de validité, mais la mainlevée reste une démarche distincte à obtenir séparément, directement auprès de la (pré)fourrière à Paris. Sans l'un des deux documents, le véhicule reste immobilisé : une assurance temporaire souscrite en ligne délivre l'attestation en quelques minutes, ce qui débloque au moins cette partie du dossier.",
      },
      {
        q: "Peut-on encore faire sa carte grise au guichet d'une préfecture parisienne ?",
        a: "Non, ce service a fermé en 2017, comme dans toutes les préfectures de France. La demande de certificat d'immatriculation se fait désormais en ligne sur le site de l'Agence Nationale des Titres Sécurisés, ou via un professionnel de l'automobile habilité au Système d'Immatriculation des Véhicules, qui peut prendre en charge le dossier et parfois accélérer son traitement.",
      },
      {
        q: 'Combien de temps pour immatriculer une voiture achetée à Paris ?',
        a: "Un mois calendaire à compter de la date de cession (article R322-5 du code de la route). Pendant ce délai, la carte grise barrée par le vendeur et le certificat de cession suffisent à circuler. Passé ce délai, l'amende forfaitaire est de 135 €, minorée à 90 €, majorée à 375 €, jusqu'à 750 € devant le tribunal.",
      },
    ],
    maillage: {
      lead: 'Pour aller plus loin :',
      items: [
        { text: 'le rétroplanning complet de J0 à J+30 après un achat de véhicule', href: '/roulez-legal-apres-achat' },
        { text: "comment sortir de fourrière pour défaut d'assurance", href: '/articles/voiture-immobilisee-defaut-assurance' },
        { text: 'ce que risque un conducteur contrôlé sans attestation', href: '/articles/controle-sans-assurance-risques-amende' },
        { text: "les délais réels d'obtention d'une carte grise", href: '/articles/combien-de-temps-carte-grise' },
      ],
    },
  },

  lyon: {
    slug: 'lyon',
    routePath: '/assurance-temporaire-carte-grise-lyon',
    nom: 'Lyon',
    breadcrumbName: 'Assurance temporaire et carte grise à Lyon',
    eyebrow: 'ASSURANCE TEMPORAIRE ET CARTE GRISE',
    h1: 'Assurance temporaire et carte grise à Lyon',
    intro:
      "Entre les tunnels qui traversent les collines, une ZFE qui verbalise déjà et une carte grise qui ne se traite plus en préfecture, voici ce qui compte pour rouler en règle dans la métropole.",
    dateMaj: '1er août 2026',
    meta: {
      title: 'Assurance temporaire et carte grise à Lyon | AssuTempo',
      description:
        "Fourrière de Lyon rue Pierre Sémard, ZFE du Grand Lyon et Crit'Air 3, carte grise après achat : le guide local à jour.",
    },
    capsule: {
      answer:
        "La topographie de Lyon impose ses passages obligés : les collines de Fourvière et de la Croix-Rousse concentrent la circulation vers deux tunnels, sous une ZFE qui verbalise les Crit'Air 3 depuis le 1er juillet 2026. En cas d'enlèvement, la fourrière municipale se trouve rue Pierre Sémard, dans le 7e arrondissement, et la mainlevée s'obtient auprès des forces de l'ordre concernées. Pour la carte grise, la démarche passe par l'ANTS ou un professionnel habilité.",
      facts: [
        {
          anchor: '38 rue Pierre Sémard',
          text: 'Adresse de la fourrière municipale de Lyon, dans le 7e arrondissement (Mairie du 7e arrondissement de Lyon).',
        },
        {
          anchor: '1er juillet 2026',
          text: "Date de début de la verbalisation effective des véhicules Crit'Air 3 dans la ZFE du Grand Lyon, 68 € pour une voiture particulière.",
        },
        {
          anchor: '1 mois',
          text: "Délai légal pour immatriculer un véhicule d'occasion à son nom après achat (article R322-5 du code de la route).",
        },
      ],
      updated: '1er août 2026',
    },
    bandeau: [
      {
        figure: '38 rue Pierre Sémard',
        title: "l'adresse de la fourrière municipale, 7e arrondissement",
        body: 'Ouverte du lundi au samedi de 7h à 20h, le dimanche et les jours fériés de 8h à 12h.',
        ref: 'Mairie du 7e arrondissement de Lyon',
      },
      {
        figure: '68 €',
        title: "l'amende Crit'Air 3 dans la ZFE du Grand Lyon",
        body: "Verbalisation appliquée depuis le 1er juillet 2026 pour les véhicules Crit'Air 3, 4, 5 et non classés, interdits de circulation depuis le 1er janvier 2025.",
        ref: 'Métropole de Lyon, zfe.grandlyon.com',
      },
      {
        figure: '1 mois',
        title: 'de circulation avec le certificat provisoire',
        body: "Une fois le dossier déposé auprès de l'ANTS ou d'un professionnel habilité, le certificat provisoire d'immatriculation autorise à circuler en France pendant ce délai.",
        ref: 'service-public.gouv.fr',
      },
    ],
    concretement: {
      title: 'À Lyon, concrètement',
      paragraphs: [
        "La topographie de Lyon canalise la circulation : les collines de Fourvière et de la Croix-Rousse séparent la presqu'île du reste de l'agglomération, et l'essentiel des flux passe par un nombre restreint d'axes, dont les tunnels percés sous ces deux collines. Un incident de circulation ou un contrôle qui immobilise un véhicule dans ce secteur complique davantage la suite du trajet qu'ailleurs, faute d'itinéraire de repli immédiat.",
        "La métropole a aussi choisi d'accélérer sur la ZFE : après une interdiction des Crit'Air 3, 4, 5 et non classés entrée en vigueur le 1er janvier 2025, la verbalisation réelle de ces véhicules a commencé le 1er juillet 2026, à 68 € l'infraction pour une voiture particulière. Contrairement à Paris, Lyon n'a pas reconduit de période sans sanction.",
        "Un véhicule loué ou emprunté le temps d'un déplacement dans l'agglomération mérite donc une vérification de son Crit'Air avant d'entrer dans le périmètre, en semaine comme le week-end.",
      ],
    },
    fourriere: {
      title: 'Sortir un véhicule de fourrière à Lyon',
      paragraphs: [
        "La fourrière municipale de Lyon se trouve au 38 rue Pierre Sémard, dans le 7e arrondissement, ouverte du lundi au samedi de 7h à 20h et le dimanche de 8h à 12h. La mainlevée, c'est-à-dire l'autorisation de restituer le véhicule, est délivrée par les forces de l'ordre à l'origine de l'enlèvement : police nationale, police municipale ou gendarmerie selon le motif.",
        "Au guichet, il faut présenter une pièce d'identité, le certificat d'immatriculation et une attestation d'assurance en cours de validité. Sans ce dernier document, la restitution reste bloquée : une assurance temporaire souscrite en ligne délivre une attestation immédiate qui remplit cette condition, sans se substituer à la mainlevée elle-même.",
      ],
      cta: { text: "Obtenir une attestation d'assurance maintenant", href: '/tarification' },
    },
    carteGrise: {
      title: 'La carte grise après un achat à Lyon',
      paragraphs: [
        "Comme partout en France, les guichets de la préfecture du Rhône ne traitent plus les certificats d'immatriculation depuis 2017. La démarche passe par le site de l'ANTS ou par un professionnel de l'automobile habilité au SIV, une option souvent plus rapide pour un dossier urgent.",
        "Le nouveau propriétaire dispose d'un mois à compter de la date de cession pour immatriculer le véhicule à son nom. Durant ce délai, la carte grise barrée par le vendeur et le certificat de cession suffisent à circuler dans la métropole, à condition que le véhicule reste assuré.",
      ],
      cta: { text: 'Faire ma carte grise en ligne', href: '/carte-grise' },
    },
    faq: [
      {
        q: 'Où se trouve la fourrière de Lyon et comment récupérer son véhicule ?',
        a: "Au 38 rue Pierre Sémard, dans le 7e arrondissement, ouverte du lundi au samedi de 7h à 20h et le dimanche de 8h à 12h. La mainlevée est délivrée par les forces de l'ordre à l'origine de l'enlèvement ; présentez une pièce d'identité, la carte grise et une attestation d'assurance valide.",
      },
      {
        q: "La ZFE de Lyon verbalise-t-elle les Crit'Air 3 en 2026 ?",
        a: "Oui, depuis le 1er juillet 2026, après une interdiction de circulation entrée en vigueur le 1er janvier 2025 pour les Crit'Air 3, 4, 5 et non classés. L'amende est de 68 € pour une voiture particulière et 135 € pour un poids lourd, sans période de tolérance supplémentaire annoncée, contrairement à la Métropole du Grand Paris.",
      },
      {
        q: "Une attestation d'assurance suffit-elle pour sortir un véhicule de la fourrière lyonnaise ?",
        a: "Elle couvre une des pièces exigées au guichet du 38 rue Pierre Sémard, mais la mainlevée délivrée par les forces de l'ordre à l'origine de l'enlèvement reste indispensable en plus, qu'il s'agisse de la police nationale, de la police municipale ou de la gendarmerie. Les deux démarches sont distinctes et se cumulent avant toute restitution du véhicule.",
      },
      {
        q: 'Peut-on encore faire une carte grise à la préfecture du Rhône ?',
        a: "Non, ce guichet a fermé en 2017 comme partout en France, à la suite de la réforme des préfectures. La demande de certificat d'immatriculation se fait désormais en ligne via le site de l'ANTS, ou par un professionnel de l'automobile habilité au Système d'Immatriculation des Véhicules, une option qui peut accélérer un dossier urgent.",
      },
      {
        q: 'Combien de temps pour immatriculer une voiture achetée à Lyon ?',
        a: "Un mois calendaire à compter de la date de cession (article R322-5 du code de la route). Durant ce délai, la carte grise barrée par le vendeur, accompagnée du certificat de cession, permet de circuler dans l'agglomération lyonnaise. Au-delà, une contravention de 4e classe s'applique : 135 € forfaitaires, jusqu'à 750 € devant le tribunal.",
      },
    ],
    maillage: {
      lead: 'Pour approfondir :',
      items: [
        { text: 'le rétroplanning complet après un achat de véhicule', href: '/roulez-legal-apres-achat' },
        { text: 'ce que la loi sanctionne vraiment en cas de retard de carte grise', href: '/articles/rouler-sans-carte-grise-a-son-nom' },
        { text: 'le changement de titulaire étape par étape', href: '/articles/changement-titulaire-carte-grise' },
        { text: "combien de jours d'assurance souscrire pour sortir de fourrière", href: '/articles/combien-de-jours-assurance-sortir-fourriere' },
      ],
    },
  },

  marseille: {
    slug: 'marseille',
    routePath: '/assurance-temporaire-carte-grise-marseille',
    nom: 'Marseille',
    breadcrumbName: 'Assurance temporaire et carte grise à Marseille',
    eyebrow: 'ASSURANCE TEMPORAIRE ET CARTE GRISE',
    h1: 'Assurance temporaire et carte grise à Marseille',
    intro:
      "Port d'import de véhicules, ZFE en vigueur depuis 2023 et fourrière municipale du 14e arrondissement : ce qu'il faut savoir pour rouler en règle à Marseille.",
    dateMaj: '1er août 2026',
    meta: {
      title: 'Assurance temporaire et carte grise à Marseille | AssuTempo',
      description:
        "Fourrière du boulevard Capitaine Gèze, ZFE Aix-Marseille-Provence, carte grise après achat ou import : le guide local à jour.",
    },
    capsule: {
      answer:
        "Marseille reçoit chaque année des flux de véhicules par son port, souvent réimmatriculés et assurés dès l'arrivée. En cas d'enlèvement, la fourrière municipale se trouve boulevard Capitaine Gèze, dans le 14e arrondissement ; la mainlevée s'obtient sur place auprès de la police municipale ou dans un commissariat de police nationale. La ZFE interdit les Crit'Air 4, 5 et non classés depuis 2023. Pour la carte grise, la démarche passe par l'ANTS ou un professionnel habilité.",
      facts: [
        {
          anchor: '58 bd Capitaine Gèze',
          text: 'Adresse de la fourrière municipale de Marseille, 14e arrondissement, ouverte du lundi au samedi de 8h à 19h (Ville de Marseille).',
        },
        {
          anchor: '24h/24',
          text: 'La mainlevée peut aussi être obtenue dans un commissariat de police nationale, en dehors des horaires de la police municipale à la fourrière.',
        },
        {
          anchor: '2023',
          text: "Interdiction des véhicules Crit'Air 4, 5 et non classés dans la ZFE de la métropole Aix-Marseille-Provence, en vigueur depuis septembre 2023.",
        },
      ],
      updated: '1er août 2026',
    },
    bandeau: [
      {
        figure: '58 bd Capitaine Gèze',
        title: 'la fourrière municipale, 14e arrondissement',
        body: "Ouverte du lundi au samedi de 8h à 19h, fermée le dimanche. La mainlevée s'y obtient auprès de la police municipale.",
        ref: 'Ville de Marseille',
      },
      {
        figure: '24h/24',
        title: 'la mainlevée aussi disponible en commissariat',
        body: "Trois secteurs de police nationale peuvent délivrer l'autorisation de restitution en dehors des horaires de la fourrière.",
        ref: 'Ville de Marseille',
      },
      {
        figure: 'Depuis 2023',
        title: "la ZFE interdit les Crit'Air 4, 5 et non classés",
        body: "Amende de 68 € pour une voiture particulière en cas d'infraction, périmètre centré sur le centre-ville et ses accès.",
        ref: 'Métropole Aix-Marseille-Provence',
      },
    ],
    concretement: {
      title: 'À Marseille, concrètement',
      paragraphs: [
        "Le Grand Port Maritime de Marseille est une plateforme majeure de trafic roulier vers la Corse, l'Afrique du Nord et la Méditerranée, avec des lignes dédiées au transport de véhicules neufs et d'occasion. Une nouvelle ligne RoRo ouverte en octobre 2025 relie même Marseille à la Turquie pour l'import de voitures depuis l'Asie. Chaque véhicule qui débarque doit être immatriculé et assuré avant de circuler sur le territoire français.",
        "Autre trait marseillais : le tunnel du Vieux-Port et le tunnel Prado-Carénage restent accessibles à tous les Crit'Air, y compris aux véhicules exclus de la ZFE ailleurs dans le centre-ville, ce qui dessine des itinéraires de contournement propres à la ville.",
      ],
    },
    fourriere: {
      title: 'Sortir un véhicule de fourrière à Marseille',
      paragraphs: [
        "La fourrière municipale de Marseille se situe au 58 boulevard Capitaine Gèze, dans le 14e arrondissement, ouverte du lundi au samedi de 8h à 19h. La mainlevée peut être délivrée sur place par la police municipale aux horaires d'ouverture, ou dans un commissariat de police nationale, disponible 24h/24 selon les trois secteurs de la ville. Une demande en ligne est également possible.",
        "Au guichet, les documents originaux exigés sont la carte grise, le permis de conduire, une attestation d'assurance en cours de validité et la mainlevée elle-même. Sans attestation d'assurance à jour, aucune restitution n'est possible : une assurance temporaire souscrite en ligne fournit ce document en quelques minutes, à toute heure.",
      ],
      cta: { text: "Obtenir une attestation d'assurance maintenant", href: '/tarification' },
    },
    carteGrise: {
      title: 'La carte grise après un achat à Marseille',
      paragraphs: [
        "Les guichets de la préfecture des Bouches-du-Rhône ne délivrent plus les certificats d'immatriculation depuis la réforme de 2017. La demande se fait en ligne sur le site de l'ANTS, ou via un professionnel de l'automobile habilité au SIV qui peut prendre en charge tout le dossier, un service utile pour un véhicule qui vient d'arriver par le port.",
        "Le nouveau titulaire dispose d'un mois à compter de la date de cession pour immatriculer le véhicule à son nom. Un véhicule neuf ou importé sans titre définitif circule avec des plaques provisoires WW et un certificat provisoire dédié, valables 4 mois depuis le 1er janvier 2026, sans prorogation possible.",
      ],
      cta: { text: 'Faire ma carte grise en ligne', href: '/carte-grise' },
    },
    faq: [
      {
        q: 'Où se trouve la fourrière de Marseille et comment obtenir la mainlevée ?',
        a: "Au 58 boulevard Capitaine Gèze, dans le 14e arrondissement, ouverte du lundi au samedi de 8h à 19h et fermée le dimanche. La mainlevée s'obtient sur place auprès de la police municipale aux heures d'ouverture, ou dans un commissariat de police nationale, disponible 24h/24 selon le secteur de la ville concerné.",
      },
      {
        q: 'La ZFE de Marseille interdit-elle déjà certains véhicules en 2026 ?',
        a: "Oui, les véhicules Crit'Air 4, 5 et non classés sont interdits de circulation dans le périmètre depuis septembre 2023, avec une amende de 68 € pour une voiture particulière en cas d'infraction. Fait notable, les tunnels du Vieux-Port et de Prado-Carénage restent accessibles à tous les Crit'Air, quel que soit le classement du véhicule.",
      },
      {
        q: 'Un véhicule qui arrive par le port de Marseille doit-il être assuré immédiatement ?',
        a: "Oui. Dès qu'il roule sur le territoire français, même pour un simple trajet de convoyage entre le port et un garage, il doit être couvert par une assurance en cours de validité, indépendamment de l'avancement de sa carte grise. Une assurance temporaire souscrite en ligne délivre l'attestation nécessaire en quelques minutes.",
      },
      {
        q: 'Peut-on encore faire une carte grise à la préfecture des Bouches-du-Rhône ?',
        a: "Non, ce service a fermé en 2017, comme dans toutes les préfectures françaises. La demande de certificat d'immatriculation passe désormais par le site de l'ANTS en ligne, ou par un professionnel de l'automobile habilité au Système d'Immatriculation des Véhicules, une option utile pour un dossier urgent lié à un véhicule tout juste arrivé par le port.",
      },
      {
        q: 'Combien de temps pour immatriculer un véhicule acheté à Marseille ?',
        a: "Un mois calendaire à compter de la date de cession (article R322-5 du code de la route). Pendant ce délai, la carte grise barrée par le vendeur et le certificat de cession suffisent à circuler. Au-delà, l'amende forfaitaire est de 135 €, minorée à 90 €, majorée à 375 €, jusqu'à 750 € devant le tribunal.",
      },
    ],
    maillage: {
      lead: 'Pour aller plus loin :',
      items: [
        { text: 'le rétroplanning complet après un achat de véhicule', href: '/roulez-legal-apres-achat' },
        { text: 'assurer un véhicule à plaque étrangère ou tout juste importé', href: '/articles/assurance-temporaire-vehicule-etranger-france' },
        { text: "que faire si un dossier reste bloqué sur l'ANTS", href: '/articles/carte-grise-ants-bloquee' },
        { text: "combien de jours d'assurance souscrire pour sortir de fourrière", href: '/articles/combien-de-jours-assurance-sortir-fourriere' },
      ],
    },
  },
};

export const VILLES_LOCALES_LIST = Object.values(VILLES_LOCALES);
