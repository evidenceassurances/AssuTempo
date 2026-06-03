/* ─────────────────────────────────────────────────────────────────────────────
   countries-content.js — Données des 34 pays couverts par AssuTempo
   Règle : aucune spécificité juridique locale non vérifiée.
───────────────────────────────────────────────────────────────────────────── */

/* Gabarit générique — vrai, applicable à tous les pays couverts */
function generic(nom, flag, centreGeo) {
  return {
    flag,
    center: centreGeo,
    intro:
      `Votre assurance temporaire AssuTempo couvre la responsabilité civile automobile ` +
      `obligatoire en ${nom}, dès le premier jour du contrat. Que vous traversiez la ` +
      `frontière pour un trajet ponctuel, importiez un véhicule ou conduisiez un véhicule ` +
      `étranger, votre carte internationale d'assurance automobile vous permet de circuler ` +
      `en règle dans ce pays comme dans les 33 autres pays couverts.`,
    points: [
      {
        titre: 'RC couverte dès J1',
        texte:
          'La responsabilité civile obligatoire est active dès le premier jour du contrat — ' +
          'aucun délai de carence pour votre couverture en ' + nom + '.',
      },
      {
        titre: 'Carte internationale d\'assurance automobile',
        texte:
          'Votre carte internationale d\'assurance automobile est le document officiel ' +
          'reconnu dans les 34 pays couverts, dont ' + nom +
          '. Elle est délivrée immédiatement avec votre Mémo Véhicule Assuré.',
      },
      {
        titre: 'Attestation immédiate',
        texte:
          'La souscription prend moins de 5 minutes. Votre attestation est disponible ' +
          'instantanément, valable pour circuler sans attendre.',
      },
      {
        titre: 'Spécificités pratiques',
        texte:
          'À compléter — conseils locaux, documents recommandés au voyage, ' +
          'particularités du contrôle routier en ' + nom + ', etc.',
      },
    ],
  };
}

/* Helper — les 3 cartes communes conservées dans les overrides lot 1+ */
function genericPoints(nom) {
  return [
    {
      titre: 'RC couverte dès J1',
      texte:
        `La responsabilité civile obligatoire est active dès le premier jour du contrat — ` +
        `aucun délai de carence pour votre couverture en ${nom}.`,
    },
    {
      titre: `Carte internationale d'assurance automobile`,
      texte:
        `Votre carte internationale d'assurance automobile est le document officiel ` +
        `reconnu dans les 34 pays couverts, dont ${nom}. ` +
        `Elle est délivrée immédiatement avec votre Mémo Véhicule Assuré.`,
    },
    {
      titre: 'Attestation immédiate',
      texte:
        `La souscription prend moins de 5 minutes. Votre attestation est disponible ` +
        `instantanément, valable pour circuler sans attendre.`,
    },
  ];
}

/* ─── Liste complète des 34 pays ─────────────────────────────────────────── */
const RAW = [
  /* [slug, isoId, nom, flag, center[lng,lat], overrides?] */
  ['autriche',            40,  'Autriche',             '🇦🇹', [14.5, 47.5]],
  ['belgique',            56,  'Belgique',             '🇧🇪', [4.5,  50.5]],
  ['bulgarie',           100,  'Bulgarie',             '🇧🇬', [25.5, 42.7]],
  ['chypre',             196,  'Chypre',               '🇨🇾', [33.0, 35.0]],
  ['republique-tcheque', 203,  'République tchèque',   '🇨🇿', [15.5, 49.8]],
  ['allemagne',          276,  'Allemagne',            '🇩🇪', [10.0, 51.2]],
  ['danemark',           208,  'Danemark',             '🇩🇰', [10.0, 56.0]],
  ['espagne',            724,  'Espagne',              '🇪🇸', [-3.7, 40.4]],
  ['estonie',            233,  'Estonie',              '🇪🇪', [25.0, 58.7]],
  ['france',             250,  'France',               '🇫🇷', [2.3,  46.2]],
  ['finlande',           246,  'Finlande',             '🇫🇮', [26.0, 64.0]],
  ['grece',              300,  'Grèce',                '🇬🇷', [22.0, 39.0]],
  ['hongrie',            348,  'Hongrie',              '🇭🇺', [19.5, 47.0]],
  ['croatie',            191,  'Croatie',              '🇭🇷', [16.5, 45.2]],
  ['italie',             380,  'Italie',               '🇮🇹', [12.5, 42.8]],
  ['irlande',            372,  'Irlande',              '🇮🇪', [-8.0, 53.4]],
  ['islande',            352,  'Islande',              '🇮🇸', [-19.0,65.0]],
  ['luxembourg',         442,  'Luxembourg',           '🇱🇺', [6.1,  49.8]],
  ['lituanie',           440,  'Lituanie',             '🇱🇹', [23.9, 55.3]],
  ['lettonie',           428,  'Lettonie',             '🇱🇻', [24.7, 56.9]],
  ['malte',              470,  'Malte',                '🇲🇹', [14.4, 35.9]],
  ['norvege',            578,  'Norvège',              '🇳🇴', [10.0, 64.0]],
  ['pays-bas',           528,  'Pays-Bas',             '🇳🇱', [5.3,  52.3]],
  ['portugal',           620,  'Portugal',             '🇵🇹', [-8.0, 39.5]],
  ['pologne',            616,  'Pologne',              '🇵🇱', [20.0, 52.1]],
  ['roumanie',           642,  'Roumanie',             '🇷🇴', [25.0, 45.9]],
  ['suede',              752,  'Suède',                '🇸🇪', [18.0, 62.0]],
  ['slovaquie',          703,  'Slovaquie',            '🇸🇰', [19.5, 48.7]],
  ['slovenie',           705,  'Slovénie',             '🇸🇮', [14.9, 46.1]],
  ['suisse',             756,  'Suisse',               '🇨🇭', [8.2,  46.8]],
  ['andorre',             20,  'Andorre',              '🇦🇩', [1.5,  42.5]],
  ['bosnie-herzegovine',  70,  'Bosnie-Herzégovine',   '🇧🇦', [17.8, 44.2]],
  ['montenegro',         499,  'Monténégro',           '🇲🇪', [19.4, 42.8]],
  ['royaume-uni',        826,  'Royaume-Uni',          '🇬🇧', [-2.0, 54.0]],
];

/* ─── Contenu spécifique France ──────────────────────────────────────────── */
const FRANCE_OVERRIDE = {
  title: 'Assurance temporaire en France — Mémo Véhicule Assuré & FVA | AssuTempo',
  metaDescription:
    'Assurance auto temporaire en France : RC couverte dès J1, Mémo Véhicule Assuré immédiat, ' +
    'FVA (fichier officiel depuis avril 2024). Attestation en moins de 5 minutes.',
  h1: 'Assurance temporaire en France : Mémo Véhicule Assuré dès la souscription',
  intro:
    'En France, votre assurance temporaire AssuTempo couvre la responsabilité civile ' +
    'obligatoire dès le premier jour. Depuis avril 2024, la carte verte physique n\'existe ' +
    'plus : la preuve d\'assurance se fait directement à la plaque via le Fichier des ' +
    'Véhicules Assurés (FVA), consultable par les forces de l\'ordre. À la souscription, ' +
    'vous recevez immédiatement votre Mémo Véhicule Assuré (France) et votre carte ' +
    'internationale d\'assurance automobile (valable dans les 34 pays couverts).',
  points: [
    {
      titre: 'RC couverte dès J1',
      texte:
        'La responsabilité civile obligatoire est active dès le premier jour du contrat — ' +
        'aucun délai de carence, quelle que soit la durée choisie (1 à 90 jours).',
    },
    {
      titre: 'Le FVA remplace la carte verte en France',
      texte:
        'Depuis avril 2024, la carte verte n\'existe plus comme justificatif en France. ' +
        'L\'assurance est vérifiée directement à la plaque via le Fichier des Véhicules ' +
        'Assurés (FVA), mis à jour à votre souscription.',
    },
    {
      titre: 'Mémo Véhicule Assuré — immédiat',
      texte:
        'À la souscription, vous recevez votre Mémo Véhicule Assuré (document de ' +
        'référence en France) et votre carte internationale d\'assurance automobile ' +
        '(pour les 34 pays européens couverts).',
    },
    {
      titre: 'Cas d\'usage typiques',
      texte:
        'Achat d\'un véhicule d\'occasion, démarche de carte grise, rapatriement, export, ' +
        'véhicule peu utilisé dans l\'année, permis ou véhicule étranger : le contrat ' +
        'temporaire couvre tous ces besoins sans relevé d\'information.',
    },
  ],
  faq: null,
};

/* ─── Contenu spécifique Allemagne — lot 1 ──────────────────────────────── */
const ALLEMAGNE_OVERRIDE = {
  title: `Assurance temporaire Allemagne | Carte verte & RC dès le 1er jour — AssuTempo`,
  metaDescription:
    `Roulez assuré en Allemagne dès le premier jour : RC automobile, carte internationale d'assurance, attestation en 5 min. Autobahn, vignette environnementale et règles de conduite expliquées.`,
  h1: `Assurance temporaire en Allemagne : roulez couvert dès le 1er jour`,
  intro:
    `Votre assurance temporaire AssuTempo couvre la responsabilité civile automobile obligatoire en Allemagne, dès le premier jour du contrat. Trajet ponctuel, importation d'un véhicule acheté outre-Rhin ou conduite d'un véhicule étranger : votre carte internationale d'assurance (carte verte) vous permet de circuler en règle, comme dans les 33 autres pays couverts.`,
  points: [
    ...genericPoints('Allemagne'),
    {
      titre: `L'Autobahn, mode d'emploi`,
      texte:
        `L'Allemagne reste le seul pays d'Europe où certaines portions d'autoroute n'ont aucune limite de vitesse : une vitesse conseillée de 130 km/h (Richtgeschwindigkeit) y sert de repère, sans être obligatoire. Ailleurs, les limites sont appliquées strictement, radars à l'appui. On ne double jamais par la droite, et la voie de gauche se libère dès qu'un véhicule plus rapide approche. Gilet, triangle et trousse de secours conforme restent obligatoires à bord.`,
    },
    {
      titre: `La Rettungsgasse, le couloir qui sauve`,
      texte:
        `Dès que le trafic se fige sur l'Autobahn, les conducteurs doivent former un couloir de secours (Rettungsgasse) entre les files pour laisser passer les secours, avant même d'entendre une sirène. Sur deux voies, on se range à gauche et à droite ; sur trois voies, le couloir se crée entre la file de gauche et les deux autres. Ne pas le former, ou l'emprunter soi-même, est lourdement sanctionné.`,
    },
    {
      titre: `La vignette environnementale (Umweltplakette)`,
      texte:
        `Pour entrer dans le centre de plus de cinquante villes — Berlin, Munich, Stuttgart, Cologne… — votre véhicule doit afficher la pastille verte Umweltplakette sur le pare-brise. Elle s'achète une seule fois pour la durée de vie du véhicule et concerne aussi les voitures immatriculées à l'étranger. Circuler sans pastille dans une Umweltzone, même de passage, expose à une amende.`,
    },
    {
      titre: `Le pays qui a inventé l'automobile`,
      texte:
        `C'est en Allemagne que tout a commencé : Carl Benz y dépose le brevet de la première automobile en 1886. Deux ans plus tard, son épouse Bertha Benz réalise le premier vrai road-trip de l'histoire, parcourant seule plus de 100 km entre Mannheim et Pforzheim, et prouvant au passage la fiabilité de l'invention. Aujourd'hui encore, la « route Bertha Benz » se parcourt comme un itinéraire touristique.`,
    },
    {
      titre: `Acheter ou importer un véhicule allemand`,
      texte:
        `Premier marché européen de la voiture d'occasion, l'Allemagne attire de nombreux acheteurs français : berlines premium, utilitaires, youngtimers. Le temps de rapatrier le véhicule et d'engager l'immatriculation française, l'assurance temporaire vous couvre dès la sortie du concessionnaire, sans contrat à l'année pour un trajet unique. Conservez la facture et le certificat de cession : ils vous seront demandés à l'immatriculation.`,
    },
  ],
  faq: [
    {
      q: `Faut-il une assurance spécifique pour rouler en Allemagne ?`,
      a: `Non. Votre RC AssuTempo et la carte internationale d'assurance valent dans les 34 pays couverts, Allemagne comprise, dès le 1er jour.`,
    },
    {
      q: `Suis-je couvert sur l'Autobahn, même sans limite de vitesse ?`,
      a: `Oui. La couverture est identique quelle que soit la vitesse autorisée, sur autoroute comme en ville.`,
    },
  ],
};

/* ─── Contenu spécifique Espagne — lot 1 ────────────────────────────────── */
const ESPAGNE_OVERRIDE = {
  title: `Assurance temporaire Espagne | Carte verte & balise V16 — AssuTempo`,
  metaDescription:
    `Roulez couvert en Espagne dès le 1er jour : RC automobile, carte internationale d'assurance, attestation en 5 min. Balise V16, gilet obligatoire et zones à faibles émissions expliqués.`,
  h1: `Assurance temporaire en Espagne : roulez couvert dès le 1er jour`,
  intro:
    `Votre assurance temporaire AssuTempo couvre la responsabilité civile automobile obligatoire en Espagne, dès le premier jour du contrat. Que vous descendiez vers la Costa Brava, importiez un véhicule ou conduisiez une voiture étrangère, votre carte internationale d'assurance (carte verte) vous permet de circuler en règle dans le pays comme dans les 33 autres pays couverts.`,
  points: [
    ...genericPoints('Espagne'),
    {
      titre: `La balise V16 remplace le triangle`,
      texte:
        `Depuis le 1er janvier 2026, l'Espagne impose la balise lumineuse connectée V16 — un feu orange visible à 360° et à plus d'un kilomètre, qui transmet la position du véhicule à la plateforme DGT 3.0 — à la place du triangle de présignalisation. Bonne nouvelle pour les voyageurs : l'obligation ne vise que les véhicules immatriculés en Espagne. Avec un véhicule étranger, vos deux triangles et votre gilet restent parfaitement valables.`,
    },
    {
      titre: `Le gilet à portée de main, pas dans le coffre`,
      texte:
        `En Espagne, le gilet de haute visibilité doit se trouver dans l'habitacle, à portée de main, et non dans le coffre. La règle paraît anodine mais piège beaucoup d'étrangers : il faut pouvoir l'enfiler avant de descendre du véhicule en cas d'arrêt d'urgence. Deux triangles de présignalisation complètent l'équipement obligatoire pour les véhicules non immatriculés en Espagne.`,
    },
    {
      titre: `Le plus grand réseau autoroutier d'Europe`,
      texte:
        `Peu le savent : l'Espagne possède le plus long réseau d'autoroutes et de voies rapides du continent, devant l'Allemagne et la France. Autre bonne surprise, plusieurs grandes autoroutes à péage sont devenues gratuites ces dernières années à l'expiration de leurs concessions, dont l'AP-7 le long de la Méditerranée. De quoi relier la frontière à l'Andalousie en grande partie sans barrière de péage.`,
    },
    {
      titre: `Les zones à faibles émissions (ZBE)`,
      texte:
        `Depuis 2023, toutes les villes espagnoles de plus de 50 000 habitants doivent instaurer une Zona de Bajas Emisiones. Madrid et Barcelone filtrent déjà l'accès au centre selon la vignette environnementale (etiqueta DGT). Renseignez-vous avant d'entrer dans une grande ville : les caméras à lecture de plaque verbalisent automatiquement les véhicules non autorisés.`,
    },
    {
      titre: `Ronds-points : restez sur la voie extérieure`,
      texte:
        `Au volant en Espagne, une règle surprend les Français : sur un rond-point à plusieurs voies, on circule sur la voie extérieure et l'on en sort par celle-ci, les voies intérieures servant surtout à dépasser. S'installer durablement à l'intérieur pour « couper » est non seulement mal vu mais verbalisable. Dans le doute, restez à droite et signalez clairement votre sortie.`,
    },
    {
      titre: `Importer ou descendre depuis l'Espagne`,
      texte:
        `Frontière la plus franchie par les Français l'été, l'Espagne est aussi un marché d'achat de véhicules récents. Le temps de regagner la France et de finaliser la carte grise, l'assurance temporaire vous couvre dès la prise en main, sans engagement. Pour un long trajet, anticipez tout de même les autopistas à péage qui subsistent sur certains axes.`,
    },
  ],
  faq: [
    {
      q: `Dois-je acheter une balise V16 pour traverser l'Espagne ?`,
      a: `Avec un véhicule immatriculé hors d'Espagne, non : vos triangles et votre gilet suffisent. La V16 n'est obligatoire que pour les véhicules immatriculés en Espagne.`,
    },
    {
      q: `Mon assurance temporaire couvre-t-elle l'Espagne dès le départ ?`,
      a: `Oui. La RC et la carte internationale d'assurance valent dès le 1er jour dans les 34 pays, Espagne incluse.`,
    },
  ],
};

/* ─── Contenu spécifique Belgique — lot 1 ───────────────────────────────── */
const BELGIQUE_OVERRIDE = {
  title: `Assurance temporaire Belgique | Carte verte & RC dès le 1er jour — AssuTempo`,
  metaDescription:
    `Roulez assuré en Belgique dès le premier jour : RC automobile, carte internationale d'assurance, attestation en 5 min. Priorité de droite, LEZ de Bruxelles et réseau autoroutier expliqués.`,
  h1: `Assurance temporaire en Belgique : roulez couvert dès le 1er jour`,
  intro:
    `Votre assurance temporaire AssuTempo couvre la responsabilité civile automobile obligatoire en Belgique, dès le premier jour du contrat. Trajet transfrontalier, achat d'un véhicule ou conduite d'une voiture étrangère : votre carte internationale d'assurance (carte verte) vous permet de circuler en règle dans le pays et dans les 33 autres pays couverts.`,
  points: [
    ...genericPoints('Belgique'),
    {
      titre: `La priorité de droite, reine des carrefours`,
      texte:
        `La Belgique applique la priorité de droite plus systématiquement qu'en France : à une intersection sans signalisation ni marquage au sol, le véhicule venant de droite passe, même lorsqu'il débouche d'une voie plus petite. C'est la première cause d'accrochages pour les conducteurs étrangers. Règle simple : en l'absence de panneau, on cède toujours à droite et on aborde les carrefours au ralenti.`,
    },
    {
      titre: `La Low Emission Zone (LEZ)`,
      texte:
        `Bruxelles, Anvers et Gand appliquent une zone de basses émissions qui interdit les véhicules les plus polluants. Avec une plaque étrangère, un enregistrement en ligne préalable est nécessaire avant d'entrer dans la LEZ de Bruxelles : faute de quoi les caméras verbalisent automatiquement, y compris pour un simple passage.`,
    },
    {
      titre: `Un réseau gratuit… et longtemps illuminé`,
      texte:
        `La Belgique n'impose aucune vignette autoroutière aux voitures particulières, et son réseau, parmi les plus denses d'Europe, est gratuit. Il fut aussi l'un des plus éclairés au monde, au point d'alimenter la légende tenace d'autoroutes « visibles depuis l'espace ». L'éclairage a depuis été largement réduit pour des raisons d'économies d'énergie, mais l'anecdote a la vie dure.`,
    },
    {
      titre: `Le permis qui s'obtenait sans examen`,
      texte:
        `Curiosité historique souvent citée pour expliquer la réputation de ses carrefours : longtemps, le permis belge a pu s'obtenir sans examen pratique, devenu obligatoire seulement dans les années 1970. Les règles ont bien sûr été modernisées depuis, mais la prudence reste de mise, en particulier face à la priorité de droite.`,
    },
    {
      titre: `Terre de sport automobile`,
      texte:
        `Impossible d'évoquer la Belgique sans Spa-Francorchamps, l'un des circuits les plus mythiques du calendrier, niché dans les Ardennes. Son enchaînement du Raidillon de l'Eau Rouge, avalé à pleine vitesse, fait partie des virages les plus impressionnants de la planète automobile. Un héritage qui imprègne la culture auto du pays bien au-delà du paddock.`,
    },
    {
      titre: `Documents, frontaliers et import`,
      texte:
        `Permis, carte grise et carte internationale d'assurance suffisent à un contrôle ; gilet et triangle restent obligatoires à bord. Pour les nombreux frontaliers et acheteurs de véhicules d'occasion, l'assurance temporaire couvre le trajet de rapatriement dès la sortie du parking vendeur, sans contrat annuel.`,
    },
  ],
  faq: [
    {
      q: `Faut-il une vignette pour rouler en Belgique ?`,
      a: `Non, le réseau autoroutier belge est gratuit pour les voitures particulières.`,
    },
    {
      q: `Dois-je m'enregistrer pour entrer dans Bruxelles ?`,
      a: `Oui, avec une plaque étrangère, l'enregistrement préalable à la LEZ de Bruxelles est obligatoire.`,
    },
  ],
};

/* ─── Contenu spécifique Suisse — lot 1 ─────────────────────────────────── */
const SUISSE_OVERRIDE = {
  title: `Assurance temporaire Suisse | Carte verte & vignette — AssuTempo`,
  metaDescription:
    `Roulez couvert en Suisse dès le 1er jour : RC automobile, carte internationale d'assurance, attestation en 5 min. Vignette autoroutière, amendes calculées au revenu et cols alpins expliqués.`,
  h1: `Assurance temporaire en Suisse : roulez couvert dès le 1er jour`,
  intro:
    `Votre assurance temporaire AssuTempo couvre la responsabilité civile automobile obligatoire en Suisse, dès le premier jour du contrat. Que vous traversiez les Alpes, importiez un véhicule ou conduisiez une voiture étrangère, votre carte internationale d'assurance (carte verte) vous permet de circuler en règle. La Suisse n'appartient pas à l'Union européenne, mais figure bien parmi les 34 pays couverts.`,
  points: [
    ...genericPoints('Suisse'),
    {
      titre: `La vignette autoroutière obligatoire`,
      texte:
        `Pour emprunter les autoroutes et semi-autoroutes suisses, une vignette annuelle est obligatoire, désormais disponible en version électronique (e-vignette) liée à la plaque, en plus de l'autocollant classique. Elle vaut pour l'année entière, quel que soit le nombre de passages : pour un simple transit, le coût à l'usage peut donc sembler élevé. Rouler sans vignette sur le réseau concerné expose à une amende forfaitaire, les contrôles étant fréquents.`,
    },
    {
      titre: `Des amendes parmi les plus sévères d'Europe`,
      texte:
        `La Suisse applique une tolérance quasi nulle aux excès de vitesse et calcule les amendes en fonction du revenu du contrevenant, d'où des sanctions pouvant atteindre des sommes record pour les conducteurs les plus fortunés. Pour les grands excès, la loi « Via sicura » prévoit la saisie du véhicule et des peines de prison. Respecter scrupuleusement les limites n'est pas une option ici.`,
    },
    {
      titre: `Le car postal et son klaxon à trois tons`,
      texte:
        `Sur les routes de montagne, le car postal jaune (PostAuto) est roi : il a la priorité dans les passages étroits, et son célèbre klaxon à trois tons, emprunté à l'ouverture de Guillaume Tell de Rossini, prévient de son arrivée dans les virages sans visibilité. Quand vous l'entendez, serrez à droite et laissez-le passer : c'est la règle, et le bon sens en altitude.`,
    },
    {
      titre: `Tunnels et cols alpins`,
      texte:
        `Le tunnel routier du Gothard, l'un des plus longs d'Europe, canalise une grande partie du trafic nord-sud et connaît de fortes affluences en période de vacances. En hiver, des équipements neige adaptés (pneus hiver, parfois chaînes) sont indispensables en montagne, et plusieurs cols ferment de novembre à mai. Vérifiez leur ouverture avant de planifier un itinéraire panoramique.`,
    },
    {
      titre: `La Furka, virage de cinéma`,
      texte:
        `Les routes suisses ont leurs lettres de noblesse à l'écran : c'est sur le col de la Furka que fut tournée la légendaire poursuite en Aston Martin de James Bond dans Goldfinger, en 1964. Aujourd'hui, ses lacets spectaculaires figurent parmi les plus belles routes des Alpes, à savourer prudemment, vignette en règle et assurance valide.`,
    },
    {
      titre: `Importer un véhicule depuis la Suisse`,
      texte:
        `Importer une voiture suisse en France suppose des démarches douanières, la Suisse étant hors Union européenne, et un passage par le dédouanement. Le temps d'acheminer le véhicule et de régulariser son immatriculation française, l'assurance temporaire vous couvre dès la prise en main, sans engagement à l'année.`,
    },
  ],
  faq: [
    {
      q: `Faut-il une vignette pour rouler en Suisse ?`,
      a: `Oui, une vignette autoroutière (autocollant ou e-vignette) est obligatoire sur les autoroutes et semi-autoroutes.`,
    },
    {
      q: `La Suisse est-elle couverte par mon assurance temporaire ?`,
      a: `Oui. Bien que hors Union européenne, la Suisse fait partie des 34 pays couverts par la carte internationale d'assurance, dès le 1er jour.`,
    },
  ],
};

/* ─── Construction de la liste et des indexes ────────────────────────────── */
export const COUNTRIES = RAW.map(([slug, isoId, nom, flag, center]) => {
  const base = generic(nom, flag, center);

  /* Overrides spécifiques */
  const over =
    slug === 'france'    ? FRANCE_OVERRIDE    :
    slug === 'allemagne' ? ALLEMAGNE_OVERRIDE :
    slug === 'espagne'   ? ESPAGNE_OVERRIDE   :
    slug === 'belgique'  ? BELGIQUE_OVERRIDE  :
    slug === 'suisse'    ? SUISSE_OVERRIDE    :
    {};

  return {
    slug,
    isoId,
    nom,
    flag,
    center,
    title:           over.title           ?? `Assurance temporaire en ${nom} — RC dès J1 | AssuTempo`,
    metaDescription: over.metaDescription ?? (
      `Circulez en ${nom} avec l'assurance temporaire AssuTempo. Responsabilité civile couverte ` +
      `dès le premier jour, carte internationale d'assurance automobile, attestation en 5 min.`
    ),
    h1:     over.h1     ?? `Assurance temporaire en ${nom} : circulez couvert dès le 1er jour`,
    intro:  over.intro  ?? base.intro,
    points: over.points ?? base.points,
    faq:    over.faq    ?? null,
  };
});

/* ─── Index de recherche rapide ──────────────────────────────────────────── */
export const SLUG_TO_COUNTRY = {};
export const ISO_TO_SLUG     = {};
export const COUNTRY_SLUGS   = [];

for (const c of COUNTRIES) {
  SLUG_TO_COUNTRY[c.slug]  = c;
  ISO_TO_SLUG[c.isoId]     = c.slug;
  COUNTRY_SLUGS.push(c.slug);
}

export function getCountryBySlug(slug) {
  return SLUG_TO_COUNTRY[slug] ?? null;
}
