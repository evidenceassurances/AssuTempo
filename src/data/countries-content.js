/* ─────────────────────────────────────────────────────────────────────────────
   countries-content.js, Données des 34 pays couverts par AssuTempo
───────────────────────────────────────────────────────────────────────────── */

/* Gabarit générique, vrai, applicable à tous les pays couverts */
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
        icon: 'Shield',
        titre: 'RC couverte dès J1',
        texte:
          'La responsabilité civile obligatoire est active dès le premier jour du contrat, ' +
          'aucun délai de carence pour votre couverture en ' + nom + '.',
      },
      {
        icon: 'Globe',
        titre: 'Carte internationale d\'assurance automobile',
        texte:
          'Votre carte internationale d\'assurance automobile est le document officiel ' +
          'reconnu dans les 34 pays couverts, dont ' + nom +
          '. Elle est délivrée immédiatement avec votre Mémo Véhicule Assuré.',
      },
      {
        icon: 'MailCheck',
        titre: 'Attestation immédiate',
        texte:
          'La souscription prend moins de 5 minutes. Votre attestation est disponible ' +
          'instantanément, valable pour circuler sans attendre.',
      },
      {
        icon: 'Info',
        titre: 'Spécificités pratiques',
        texte:
          'À compléter, conseils locaux, documents recommandés au voyage, ' +
          'particularités du contrôle routier en ' + nom + ', etc.',
      },
    ],
  };
}

/* Helper, les 3 cartes communes (avec icônes) conservées dans les overrides */
function genericPoints(nom) {
  return [
    {
      icon: 'Shield',
      titre: 'RC couverte dès J1',
      texte:
        `La responsabilité civile obligatoire est active dès le premier jour du contrat, ` +
        `aucun délai de carence pour votre couverture en ${nom}.`,
    },
    {
      icon: 'Globe',
      titre: `Carte internationale d'assurance automobile`,
      texte:
        `Votre carte internationale d'assurance automobile est le document officiel ` +
        `reconnu dans les 34 pays couverts, dont ${nom}. ` +
        `Elle est délivrée immédiatement avec votre Mémo Véhicule Assuré.`,
    },
    {
      icon: 'MailCheck',
      titre: 'Attestation immédiate',
      texte:
        `La souscription prend moins de 5 minutes. Votre attestation est disponible ` +
        `instantanément, valable pour circuler sans attendre.`,
    },
  ];
}

/* ─── Liste complète des 34 pays ─────────────────────────────────────────── */
const RAW = [
  /* [slug, isoId, nom, flag, center[lng,lat]] */
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

/* ─── Contenu spécifique France - lot 5 ─────────────────────────────────── */
const FRANCE_OVERRIDE = {
  title: `Assurance temporaire France | Achat, prêt & carte grise - AssuTempo`,
  metaDescription:
    `Souscrivez une assurance temporaire en France dès le 1er jour : achat entre particuliers, véhicule prêté, attente de carte grise. ZFE, radars et 80 km/h expliqués.`,
  h1: `Assurance temporaire en France : couvrez votre véhicule dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en France dès le 1er jour : achat entre particuliers, véhicule prêté ou en attente de carte grise définitive. Votre attestation est disponible en moins de 5 minutes, sans engagement.`,
  points: [
    {
      icon: 'Wind',
      titre: `ZFE et vignette Crit'Air`,
      texte: `De nombreuses grandes villes ont leur Zone à Faibles Emissions. La vignette Crit'Air, obligatoire pour y circuler, s'applique aussi aux véhicules étrangers. Commandez-la avant d'entrer dans Paris, Lyon ou Marseille.`,
    },
    {
      icon: 'RotateCw',
      titre: `Championne mondiale des ronds-points`,
      texte: `La France compte plus de 50 000 ronds-points, davantage que n'importe quel autre pays au monde. Une adoption massive qui a fortement réduit la mortalité aux intersections.`,
    },
    {
      icon: 'Gauge',
      titre: `Réseau radar parmi les plus denses d'Europe`,
      texte: `Radars fixes, mobiles et contrôles de vitesse sur tronçon : aucune marge. Les amendes et retraits de points s'appliquent aussi aux conducteurs étrangers.`,
    },
    {
      icon: 'Globe',
      titre: `Première destination touristique mondiale`,
      texte: `Avec plus de 90 millions de visiteurs par an, la France est le pays le plus visité au monde. Ses routes, de la Côte d'Azur aux cols alpins, font partie du voyage.`,
    },
    {
      icon: 'AlertTriangle',
      titre: `80 km/h sur routes secondaires`,
      texte: `Depuis 2018, les routes à deux voies sans séparateur central sont limitées à 80 km/h. Une mesure qui surprend encore de nombreux conducteurs habitués aux 90.`,
    },
    {
      icon: 'FileText',
      titre: `Quand l'assurance temporaire s'impose`,
      texte: `Achat entre particuliers, véhicule prêté, attente de carte grise définitive : l'assurance temporaire couvre chaque situation dès le 1er jour, sans engagement, attestation immédiate.`,
    },
  ],
  faq: [
    {
      q: `Quand faut-il une assurance temporaire en France ?`,
      a: `Pour un véhicule acheté entre particuliers, prêté ou en attente de carte grise : l'assurance temporaire vous couvre dès le 1er jour, sans contrat à l'année.`,
    },
    {
      q: `La vignette Crit'Air est-elle obligatoire pour un véhicule étranger ?`,
      a: `Oui, dans les ZFE (Paris, Lyon, Marseille...) : les véhicules étrangers doivent aussi disposer de la vignette Crit'Air pour circuler en zone concernée.`,
    },
  ],
};

/* ─── Contenu spécifique Allemagne, lot 1 ──────────────────────────────── */
const ALLEMAGNE_OVERRIDE = {
  title: `Assurance temporaire Allemagne | Carte verte & RC dès le 1er jour, AssuTempo`,
  metaDescription:
    `Roulez assuré en Allemagne dès le 1er jour : RC auto, carte internationale d'assurance, attestation en 5 min. Autobahn, Umweltplakette et règles de conduite.`,
  h1: `Assurance temporaire en Allemagne : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Allemagne dès le 1er jour : trajet ponctuel, import d'un véhicule acheté outre-Rhin ou conduite d'une voiture étrangère. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    ...genericPoints('Allemagne'),
    {
      icon: 'Gauge',
      titre: `L'Autobahn, mode d'emploi`,
      texte: `Seul pays d'Europe avec des portions d'autoroute sans limite (130 km/h conseillés) ; ailleurs, radars stricts. On ne double jamais par la droite, on libère la gauche. Gilet, triangle et trousse de secours obligatoires.`,
    },
    {
      icon: 'Siren',
      titre: `La Rettungsgasse, le couloir qui sauve`,
      texte: `Trafic à l'arrêt sur l'Autobahn ? Les voitures forment aussitôt un couloir de secours, avant même la sirène : à gauche sur 2 voies, entre la 1re et les autres sur 3 voies. Ne pas le faire est lourdement sanctionné.`,
    },
    {
      icon: 'Leaf',
      titre: `Vignette environnementale (Umweltplakette)`,
      texte: `Pour entrer au centre de 50+ villes (Berlin, Munich, Cologne…), la pastille verte est obligatoire sur le pare-brise, voitures étrangères comprises. Sans elle, amende, même de passage.`,
    },
    {
      icon: 'History',
      titre: `Le berceau de l'automobile`,
      texte: `Tout est né ici : Carl Benz brevète la première voiture en 1886. En 1888, Bertha Benz signe le premier road-trip de l'histoire (100+ km, Mannheim-Pforzheim), aujourd'hui balisé comme itinéraire touristique.`,
    },
    {
      icon: 'ShoppingCart',
      titre: `Acheter ou importer un véhicule`,
      texte: `Premier marché européen de l'occasion : berlines premium, utilitaires, youngtimers. L'assurance temporaire couvre le rapatriement dès la sortie du concessionnaire. Gardez facture et certificat de cession.`,
    },
  ],
  faq: [
    {
      q: `Faut-il une assurance spécifique pour l'Allemagne ?`,
      a: `Non : votre RC et la carte verte valent dans les 34 pays, dès le 1er jour.`,
    },
    {
      q: `Couvert sur l'Autobahn sans limite ?`,
      a: `Oui, la couverture est identique quelle que soit la vitesse autorisée.`,
    },
  ],
};

/* ─── Contenu spécifique Espagne, lot 1 ────────────────────────────────── */
const ESPAGNE_OVERRIDE = {
  title: `Assurance temporaire Espagne | Carte verte & balise V16, AssuTempo`,
  metaDescription:
    `Roulez couvert en Espagne dès le 1er jour : RC auto, carte internationale d'assurance, attestation en 5 min. Balise V16, gilet obligatoire et zones à faibles émissions.`,
  h1: `Assurance temporaire en Espagne : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Espagne dès le 1er jour : descente vers la côte, import ou conduite d'une voiture étrangère. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    ...genericPoints('Espagne'),
    {
      icon: 'Lightbulb',
      titre: `La balise V16 remplace le triangle`,
      texte: `Depuis le 1er janvier 2026, la balise connectée V16 (feu orange à 360°, géolocalisé via DGT 3.0) remplace le triangle, mais seulement pour les véhicules immatriculés en Espagne. En voiture étrangère, triangles et gilet restent valables.`,
    },
    {
      icon: 'Shirt',
      titre: `Le gilet à portée de main`,
      texte: `Le gilet de haute visibilité se range dans l'habitacle, jamais dans le coffre : il faut l'enfiler avant de sortir. Deux triangles complètent l'équipement des véhicules non immatriculés en Espagne.`,
    },
    {
      icon: 'Route',
      titre: `Le plus grand réseau d'Europe`,
      texte: `Surprise : l'Espagne possède le plus long réseau d'autoroutes du continent, devant l'Allemagne et la France. Et plusieurs grands axes à péage sont devenus gratuits, dont l'AP-7 méditerranéenne.`,
    },
    {
      icon: 'Wind',
      titre: `Zones à faibles émissions (ZBE)`,
      texte: `Depuis 2023, chaque ville de 50 000+ habitants a sa ZBE. Madrid et Barcelone filtrent le centre selon la vignette DGT ; les caméras verbalisent seules les véhicules non autorisés.`,
    },
    {
      icon: 'RotateCw',
      titre: `Ronds-points : restez à l'extérieur`,
      texte: `Règle qui piège les Français : on circule sur la voie extérieure et on en sort par celle-ci, l'intérieur servant à dépasser. Couper par l'intérieur est verbalisable.`,
    },
    {
      icon: 'Car',
      titre: `Importer ou descendre depuis l'Espagne`,
      texte: `Frontière la plus franchie l'été, et marché de véhicules récents. L'assurance temporaire couvre dès la prise en main, le temps de finaliser la carte grise en France.`,
    },
  ],
  faq: [
    {
      q: `Dois-je acheter une balise V16 pour traverser l'Espagne ?`,
      a: `Non en véhicule étranger : triangles et gilet suffisent. La V16 ne vise que les véhicules immatriculés en Espagne.`,
    },
    {
      q: `Couvert dès le départ ?`,
      a: `Oui : RC et carte verte valent dès le 1er jour dans les 34 pays.`,
    },
  ],
};

/* ─── Contenu spécifique Belgique, lot 1 ───────────────────────────────── */
const BELGIQUE_OVERRIDE = {
  title: `Assurance temporaire Belgique | Carte verte & RC dès le 1er jour, AssuTempo`,
  metaDescription:
    `Roulez assuré en Belgique dès le 1er jour : RC auto, carte internationale d'assurance, attestation en 5 min. Priorité de droite, LEZ de Bruxelles et réseau autoroutier.`,
  h1: `Assurance temporaire en Belgique : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Belgique dès le 1er jour : trajet transfrontalier, achat de véhicule ou conduite d'une voiture étrangère. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    ...genericPoints('Belgique'),
    {
      icon: 'CornerUpRight',
      titre: `La priorité de droite, reine des carrefours`,
      texte: `Plus stricte qu'en France : sans panneau ni marquage, celui qui vient de droite passe, même d'une petite rue. Première cause d'accrochages pour les étrangers, au moindre doute, on cède et on ralentit.`,
    },
    {
      icon: 'Camera',
      titre: `La Low Emission Zone (LEZ)`,
      texte: `Bruxelles, Anvers et Gand interdisent les véhicules les plus polluants. Avec une plaque étrangère, l'enregistrement en ligne est obligatoire avant d'entrer à Bruxelles, sinon les caméras verbalisent, même de passage.`,
    },
    {
      icon: 'Lightbulb',
      titre: `Un réseau gratuit… et longtemps illuminé`,
      texte: `Aucune vignette pour les voitures : le réseau, parmi les plus denses d'Europe, est gratuit. Et si éclairé qu'on le disait « visible depuis l'espace », légende tenace, depuis largement éteinte par souci d'économie.`,
    },
    {
      icon: 'GraduationCap',
      titre: `Le permis qui s'obtenait sans examen`,
      texte: `Anecdote qui explique la réputation des carrefours : longtemps, le permis belge s'obtenait sans examen pratique, rendu obligatoire seulement dans les années 1970.`,
    },
    {
      icon: 'Flag',
      titre: `Terre de sport automobile`,
      texte: `Impossible d'ignorer Spa-Francorchamps, dans les Ardennes, et son Raidillon de l'Eau Rouge : l'un des virages les plus impressionnants du sport automobile mondial.`,
    },
    {
      icon: 'FileText',
      titre: `Documents et frontaliers`,
      texte: `Permis, carte grise et carte verte suffisent ; gilet et triangle obligatoires. Pour les frontaliers et acheteurs d'occasion, l'assurance temporaire couvre le rapatriement dès le parking vendeur.`,
    },
  ],
  faq: [
    {
      q: `Faut-il une vignette en Belgique ?`,
      a: `Non, le réseau autoroutier est gratuit pour les voitures.`,
    },
    {
      q: `Enregistrement pour Bruxelles ?`,
      a: `Oui, obligatoire avant d'entrer dans la LEZ avec une plaque étrangère.`,
    },
  ],
};

/* ─── Contenu spécifique Suisse, lot 1 ─────────────────────────────────── */
const SUISSE_OVERRIDE = {
  title: `Assurance temporaire Suisse | Carte verte & vignette, AssuTempo`,
  metaDescription:
    `Roulez couvert en Suisse dès le 1er jour : RC auto, carte internationale d'assurance, attestation en 5 min. Vignette autoroutière, amendes au revenu et cols alpins.`,
  h1: `Assurance temporaire en Suisse : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Suisse dès le 1er jour : traversée des Alpes, import ou conduite d'une voiture étrangère. Hors Union européenne, la Suisse fait bien partie des 34 pays couverts par votre carte verte.`,
  points: [
    ...genericPoints('Suisse'),
    {
      icon: 'Sticker',
      titre: `La vignette autoroutière obligatoire`,
      texte: `Vignette annuelle obligatoire sur autoroutes et semi-autoroutes, désormais aussi en e-vignette liée à la plaque. Valable toute l'année, quel que soit le nombre de passages. Sans elle, amende, contrôles fréquents.`,
    },
    {
      icon: 'Gavel',
      titre: `Des amendes parmi les plus sévères d'Europe`,
      texte: `Tolérance quasi nulle aux excès : les amendes sont calculées sur le revenu, d'où des sanctions record pour les plus fortunés. Pour les grands excès, la loi Via sicura prévoit saisie du véhicule et prison.`,
    },
    {
      icon: 'Bus',
      titre: `Le car postal et son klaxon à trois tons`,
      texte: `En montagne, le car postal jaune est prioritaire dans les passages étroits. Son klaxon à trois tons, tiré de Guillaume Tell, annonce son arrivée en virage aveugle : serrez à droite et laissez passer.`,
    },
    {
      icon: 'Mountain',
      titre: `Tunnels et cols alpins`,
      texte: `Le tunnel du Gothard, l'un des plus longs d'Europe, sature aux vacances. L'hiver, équipements neige indispensables (pneus, parfois chaînes) et plusieurs cols fermés de novembre à mai : vérifiez l'ouverture.`,
    },
    {
      icon: 'Clapperboard',
      titre: `La Furka, virage de cinéma`,
      texte: `C'est sur le col de la Furka qu'a été tournée la poursuite en Aston Martin de James Bond dans Goldfinger (1964). Ses lacets comptent parmi les plus belles routes des Alpes, vignette en règle et assurance valide.`,
    },
    {
      icon: 'Car',
      titre: `Importer un véhicule depuis la Suisse`,
      texte: `Hors UE : importer une voiture suisse suppose dédouanement et démarches douanières. L'assurance temporaire couvre dès la prise en main, le temps de régulariser l'immatriculation française.`,
    },
  ],
  faq: [
    {
      q: `Faut-il une vignette en Suisse ?`,
      a: `Oui, autocollant ou e-vignette, sur autoroutes et semi-autoroutes.`,
    },
    {
      q: `La Suisse est-elle couverte ?`,
      a: `Oui, hors UE mais parmi les 34 pays de la carte verte, dès le 1er jour.`,
    },
  ],
};

/* ─── Contenu spécifique Italie - lot 2 ─────────────────────────────────── */
const ITALIE_OVERRIDE = {
  title: `Assurance temporaire Italie | Carte verte, ZTL & péages - AssuTempo`,
  metaDescription:
    `Roulez couvert en Italie dès le 1er jour : RC auto, carte internationale d'assurance, attestation en 5 min. ZTL, système Tutor et péages autoroutiers expliqués.`,
  h1: `Assurance temporaire en Italie : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Italie dès le 1er jour : trajet ponctuel, import d'un véhicule ou conduite d'une voiture étrangère. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    ...genericPoints('Italie'),
    {
      icon: 'Camera',
      titre: `Les ZTL, piège des centres historiques`,
      texte: `Rome, Florence, Milan, Bologne, Naples... la plupart des centres historiques sont des Zones à Trafic Limité (ZTL), interdites aux non-autorisés et surveillées par caméras. L'amende tombe automatiquement, même pour un véhicule étranger. Repérez le panneau ZTL avant d'entrer.`,
    },
    {
      icon: 'Gauge',
      titre: `Le système Tutor mesure la moyenne`,
      texte: `Sur autoroute, le système Tutor calcule votre vitesse moyenne entre deux points, pas seulement à un instant : ralentir pile au radar ne sert à rien. Gilet et triangle restent obligatoires à bord.`,
    },
    {
      icon: 'Ticket',
      titre: `Péages : gardez votre ticket`,
      texte: `Autoroutes à péage avec ticket à l'entrée et paiement à la sortie ; les voies Telepass sont réservées aux abonnés. Perdre le ticket fait payer le trajet maximal : conservez-le précieusement.`,
    },
    {
      icon: 'History',
      titre: `La première autoroute du monde`,
      texte: `Fierté locale : l'autoroute Milan-lacs, inaugurée en 1924, fut la toute première au monde. L'Italie roulait déjà sur autoroute quand la plupart des pays n'avaient que des nationales.`,
    },
    {
      icon: 'Trophy',
      titre: `La Motor Valley`,
      texte: `Autour de Modène et Bologne s'étend la Motor Valley : Ferrari, Lamborghini, Maserati, Pagani et Ducati y sont nés. Un concentré de passion automobile unique au monde, jalonné de musées à visiter.`,
    },
    {
      icon: 'Car',
      titre: `Importer une voiture italienne`,
      texte: `Fiat 500, Alfa Romeo, Lancia de collection : l'Italie est un terrain de chasse pour les amateurs. L'assurance temporaire couvre le rapatriement dès la prise en main, le temps de finaliser la carte grise en France.`,
    },
  ],
  faq: [
    {
      q: `Comment éviter une amende dans les ZTL ?`,
      a: `Repérez les panneaux ZTL et n'entrez pas dans un centre historique sans autorisation : les caméras verbalisent automatiquement, même un véhicule étranger.`,
    },
    {
      q: `L'Italie est-elle couverte dès le départ ?`,
      a: `Oui : RC et carte verte valent dès le 1er jour dans les 34 pays, Italie incluse.`,
    },
  ],
};

/* ─── Contenu spécifique Royaume-Uni - lot 2 ────────────────────────────── */
const ROYAUMEUNI_OVERRIDE = {
  title: `Assurance temporaire Royaume-Uni | Carte verte & conduite à gauche - AssuTempo`,
  metaDescription:
    `Roulez couvert au Royaume-Uni dès le 1er jour : RC auto, carte internationale d'assurance, attestation en 5 min. Conduite à gauche, ULEZ de Londres et Brexit expliqués.`,
  h1: `Assurance temporaire au Royaume-Uni : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire au Royaume-Uni dès le 1er jour : séjour ponctuel, import d'un véhicule ou conduite d'une voiture étrangère. Bien que hors Union européenne depuis le Brexit, le Royaume-Uni reste couvert, et votre carte internationale d'assurance y fait foi.`,
  points: [
    ...genericPoints('Royaume-Uni'),
    {
      icon: 'AlertTriangle',
      titre: `Conduite à gauche : les bons réflexes`,
      texte: `On roule à gauche, les ronds-points tournent dans le sens horaire, et distances comme vitesses sont en miles (autoroutes limitées à 70 mph). Pensez aux adhésifs déflecteurs de phares pour ne pas éblouir les véhicules en sens inverse.`,
    },
    {
      icon: 'ShieldCheck',
      titre: `Couvert malgré le Brexit`,
      texte: `Bien que sorti de l'Union européenne, le Royaume-Uni reste l'un des 34 pays couverts. Votre carte internationale d'assurance (carte verte) y atteste votre couverture dès le 1er jour.`,
    },
    {
      icon: 'Wind',
      titre: `Londres : ULEZ et Congestion Charge`,
      texte: `Londres applique l'ULEZ (péage des véhicules polluants, étendu à tout le Grand Londres) et la Congestion Charge au centre. Les véhicules étrangers doivent s'enregistrer et payer en ligne, sous peine d'amende.`,
    },
    {
      icon: 'RotateCw',
      titre: `Le rond-point, invention britannique`,
      texte: `Le code britannique a façonné le rond-point moderne : on cède le passage à la circulation venant de droite. Curiosité, le Magic Roundabout de Swindon enchaîne cinq mini-ronds-points autour d'un central, casse-tête devenu célèbre.`,
    },
    {
      icon: 'Flag',
      titre: `Au coeur du sport automobile`,
      texte: `L'Angleterre concentre la majorité des écuries de Formule 1, la fameuse Motorsport Valley. Silverstone a accueilli le tout premier Grand Prix du championnat du monde en 1950 ; Goodwood, Aston Martin, McLaren et Mini font le reste.`,
    },
    {
      icon: 'Car',
      titre: `Importer une voiture britannique`,
      texte: `Depuis le Brexit, importer une voiture du Royaume-Uni implique des formalités douanières (pays tiers), et le véhicule est à conduite à droite, à prendre en compte pour l'usage en France. L'assurance temporaire couvre le trajet de rapatriement.`,
    },
  ],
  faq: [
    {
      q: `Faut-il payer pour rouler dans Londres ?`,
      a: `Oui : l'ULEZ et la Congestion Charge s'appliquent, y compris aux véhicules étrangers, qui doivent s'enregistrer et payer en ligne.`,
    },
    {
      q: `Le Royaume-Uni est-il couvert malgré le Brexit ?`,
      a: `Oui : il fait partie des 34 pays couverts, et votre carte internationale d'assurance y atteste votre couverture.`,
    },
  ],
};

/* ─── Contenu spécifique Portugal - lot 3 ───────────────────────────────── */
const PORTUGAL_OVERRIDE = {
  title: `Assurance temporaire Portugal | Carte verte & péages électroniques - AssuTempo`,
  metaDescription:
    `Roulez couvert au Portugal dès le 1er jour : RC auto, carte internationale d'assurance, attestation en 5 min. Péages électroniques, zone de Lisbonne et N2 expliqués.`,
  h1: `Assurance temporaire au Portugal : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire au Portugal dès le 1er jour : séjour ponctuel, import d'un véhicule ou conduite d'une voiture étrangère. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    ...genericPoints('Portugal'),
    {
      icon: 'ScanLine',
      titre: `Péages électroniques : enregistrez votre plaque`,
      texte: `De nombreuses autoroutes portugaises sont en péage 100% électronique, sans barrière : des portiques lisent votre plaque. En voiture étrangère, enregistrez-la avant le départ (Easytoll, carte prépayée ou boîtier Via Verde), sous peine d'amende.`,
    },
    {
      icon: 'Route',
      titre: `La N2, la Route 66 portugaise`,
      texte: `La Estrada Nacional 2 traverse tout le pays sur près de 740 km, de Chaves au nord à Faro au sud. C'est la plus longue route nationale du Portugal, devenue un itinéraire de road-trip culte.`,
    },
    {
      icon: 'Wind',
      titre: `La zone à émissions réduites de Lisbonne`,
      texte: `Le centre de Lisbonne (Baixa, Avenida da Liberdade) est une Zona de Emissões Reduzidas qui interdit les véhicules les plus anciens. Vérifiez l'éligibilité de votre véhicule avant d'y entrer.`,
    },
    {
      icon: 'Flag',
      titre: `Des circuits de légende`,
      texte: `Le Portugal a sa part de mythe automobile : l'Estoril a accueilli la Formule 1 jusqu'aux années 1990, et le circuit de Portimão, dans l'Algarve, reçoit aujourd'hui les plus grandes compétitions.`,
    },
    {
      icon: 'Gauge',
      titre: `Équipement et contrôles`,
      texte: `Gilet de haute visibilité et triangle de présignalisation sont obligatoires à bord. Les limites de vitesse sont contrôlées : adaptez votre allure, surtout sur les autoroutes à péage rapides.`,
    },
    {
      icon: 'Car',
      titre: `Importer depuis le Portugal`,
      texte: `Le Portugal étant dans l'Union européenne, l'import vers la France se fait sans douane, simplement avec le quitus fiscal et l'immatriculation. L'assurance temporaire couvre le trajet de rapatriement.`,
    },
  ],
  faq: [
    {
      q: `Comment payer les péages au Portugal en voiture étrangère ?`,
      a: `Enregistrez votre plaque avant le départ (Easytoll, carte prépayée ou boîtier Via Verde) : beaucoup d'autoroutes sont en péage électronique, sans barrière, et lisent la plaque.`,
    },
    {
      q: `Le Portugal est-il couvert dès le départ ?`,
      a: `Oui : RC et carte verte valent dès le 1er jour dans les 34 pays, Portugal inclus.`,
    },
  ],
};

/* ─── Contenu spécifique Pays-Bas - lot 3 ───────────────────────────────── */
const PAYSBAS_OVERRIDE = {
  title: `Assurance temporaire Pays-Bas | Carte verte & 100 km/h - AssuTempo`,
  metaDescription:
    `Roulez couvert aux Pays-Bas dès le 1er jour : RC auto, carte internationale d'assurance, attestation en 5 min. Priorité aux vélos, 100 km/h le jour et milieuzones expliqués.`,
  h1: `Assurance temporaire aux Pays-Bas : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire aux Pays-Bas dès le 1er jour : séjour ponctuel, import d'un véhicule ou conduite d'une voiture étrangère. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    ...genericPoints('Pays-Bas'),
    {
      icon: 'Bike',
      titre: `Priorité aux vélos, partout`,
      texte: `Premier pays cycliste au monde : les vélos sont rois, avec leurs propres pistes (fietspad). En tournant ou en ouvrant une portière, vérifiez toujours : les cyclistes ont souvent la priorité, et ils sont nombreux.`,
    },
    {
      icon: 'Gauge',
      titre: `100 km/h le jour sur autoroute`,
      texte: `Depuis 2020, les autoroutes sont limitées à 100 km/h de 6h à 19h, parfois 120 ou 130 la nuit selon les panneaux. Les contrôles de vitesse, dont les contrôles de tronçon, sont omniprésents.`,
    },
    {
      icon: 'Wind',
      titre: `Les zones environnementales (milieuzone)`,
      texte: `Amsterdam, Rotterdam, Utrecht et d'autres villes appliquent une milieuzone interdisant les diesels les plus anciens. Les véhicules étrangers y sont soumis : vérifiez avant d'entrer en centre-ville.`,
    },
    {
      icon: 'Waves',
      titre: `Rouler sous le niveau de la mer`,
      texte: `Une grande partie du pays est sous le niveau de la mer : on roule sur des digues et des ouvrages spectaculaires, comme l'Afsluitdijk, barrage de 32 km, ou les barrages anti-tempête du plan Delta.`,
    },
    {
      icon: 'Cog',
      titre: `Le berceau de la boîte automatique`,
      texte: `Curiosité automobile : c'est le constructeur néerlandais DAF qui a popularisé la transmission à variation continue, le Variomatic, dès la fin des années 1950. Une innovation que l'on retrouve aujourd'hui dans bien des voitures.`,
    },
    {
      icon: 'Car',
      titre: `Importer depuis les Pays-Bas`,
      texte: `Plaque tournante de l'occasion en Europe, les Pays-Bas sont dans l'Union européenne : l'import vers la France se fait sans douane, avec quitus fiscal et immatriculation. L'assurance temporaire couvre le rapatriement.`,
    },
  ],
  faq: [
    {
      q: `Quelle vitesse sur les autoroutes néerlandaises ?`,
      a: `100 km/h de 6h à 19h, parfois 120 ou 130 la nuit selon les panneaux. Les contrôles de vitesse, dont les contrôles de tronçon, sont très nombreux.`,
    },
    {
      q: `Les Pays-Bas sont-ils couverts dès le départ ?`,
      a: `Oui : RC et carte verte valent dès le 1er jour dans les 34 pays, Pays-Bas inclus.`,
    },
  ],
};

/* ─── Contenu spécifique Croatie - lot 5 ────────────────────────────────── */
const CROATIE_OVERRIDE = {
  title: `Assurance temporaire Croatie | Carte verte & péages - AssuTempo`,
  metaDescription:
    `Roulez couvert en Croatie dès le 1er jour : RC auto, carte internationale d'assurance, attestation en 5 min. Péages, ferries, Schengen 2023 et trousse de secours expliqués.`,
  h1: `Assurance temporaire en Croatie : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Croatie dès le 1er jour : séjour ponctuel, import d'un véhicule ou conduite d'une voiture étrangère. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Ticket',
      titre: `Des péages, pas de vignette`,
      texte: `Les autoroutes (Autocesta) sont à péage, payé en cabine ou par transpondeur ENC. L'A1 longe la côte dalmate sur des centaines de kilomètres : prévoyez les arrêts péage sur votre itinéraire.`,
    },
    {
      icon: 'Anchor',
      titre: `1200 îles et quelques ferries`,
      texte: `La Croatie compte plus de 1200 îles. Pour rejoindre Brač, Hvar ou Korčula, le ferry s'impose. Renseignez-vous sur les horaires et la capacité, surtout en juillet et août.`,
    },
    {
      icon: 'ShieldCheck',
      titre: `Dans l'espace Schengen depuis 2023`,
      texte: `Le 1er janvier 2023, la Croatie a rejoint Schengen et adopté l'euro. Fini les contrôles aux frontières avec la Slovénie ou la Hongrie, et fini la conversion de monnaie.`,
    },
    {
      icon: 'HeartPulse',
      titre: `Trousse de secours obligatoire`,
      texte: `Une trousse de premiers secours est exigée à bord, en plus du gilet et du triangle. Vérifiez votre coffre avant de franchir la frontière.`,
    },
    {
      icon: 'Zap',
      titre: `Rimac, le constructeur électrique croate`,
      texte: `Rimac Automobili, basé près de Zagreb, construit certaines des hypercars électriques les plus rapides du monde. En 2021, Bugatti lui a été rattaché : une fierté nationale née du garage d'un jeune ingénieur de 23 ans.`,
    },
    {
      icon: 'Car',
      titre: `Importer depuis la Croatie`,
      texte: `Membre de l'Union européenne depuis 2013, la Croatie permet un import sans douane vers la France, avec quitus fiscal et immatriculation. L'assurance temporaire couvre le rapatriement.`,
    },
  ],
  faq: [
    {
      q: `Faut-il une vignette en Croatie ?`,
      a: `Non : les autoroutes sont à péage payé en cabine ou par transpondeur. Aucune vignette, mais prévoyez carte bancaire ou pièces pour les barrières.`,
    },
    {
      q: `La Croatie est-elle couverte dès le départ ?`,
      a: `Oui : RC et carte verte valent dès le 1er jour dans les 34 pays, Croatie incluse.`,
    },
  ],
};

/* ─── Contenu spécifique Danemark - lot 6 ───────────────────────────────── */
const DANEMARK_OVERRIDE = {
  title: `Assurance temporaire Danemark | Carte verte & RC dès le 1er jour - AssuTempo`,
  metaDescription:
    `Roulez couvert au Danemark dès le 1er jour : RC auto, carte verte, attestation en 5 min. Ponts à péage, vélos prioritaires et feux de jour expliqués.`,
  h1: `Assurance temporaire au Danemark : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire au Danemark dès le 1er jour : transit vers la Scandinavie, séjour ponctuel ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Bike',
      titre: `Le royaume du vélo`,
      texte: `À Copenhague, les cyclistes sont partout et prioritaires. Avant de tourner à droite, on vérifie toujours la piste cyclable : c'est le réflexe qui évite l'accrochage.`,
    },
    {
      icon: 'Sun',
      titre: `Feux allumés toute l'année`,
      texte: `Les feux de croisement sont obligatoires de jour comme de nuit, toute l'année. Une règle scandinave systématique et contrôlée.`,
    },
    {
      icon: 'Ticket',
      titre: `Autoroutes gratuites, deux grands ponts payants`,
      texte: `Pas de péage classique : seuls les ponts du Grand Belt (Storebælt) et de l'Øresund vers la Suède sont payants. Le pays fonctionne largement sans espèces, carte acceptée partout.`,
    },
    {
      icon: 'Wine',
      titre: `Alcool : sanction très lourde`,
      texte: `Le taux autorisé est de 0,5 g/L, mais la peine est sévère : même un léger dépassement peut coûter l'équivalent d'un mois de salaire.`,
    },
  ],
  faq: [
    {
      q: `Faut-il payer un péage pour traverser le Danemark ?`,
      a: `Non, les autoroutes sont gratuites. Seuls les ponts du Grand Belt et de l'Øresund (vers la Suède) sont payants.`,
    },
    {
      q: `Ma carte verte couvre-t-elle le Danemark ?`,
      a: `Oui. Le Danemark fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Suède - lot 6 ──────────────────────────────────── */
const SUEDE_OVERRIDE = {
  title: `Assurance temporaire Suède | Carte verte & péages - AssuTempo`,
  metaDescription:
    `Roulez couvert en Suède dès le 1er jour : RC auto, carte verte, attestation en 5 min. Feux 24h/24, pneus hiver, alcool à 0,2 g/L et péages urbains expliqués.`,
  h1: `Assurance temporaire en Suède : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Suède dès le 1er jour : road-trip nordique, transit ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'ArrowRightLeft',
      titre: `Le jour où la Suède a changé de côté`,
      texte: `Le 3 septembre 1967, lors du "Dagen H", tout le pays est passé de la conduite à gauche à la conduite à droite en une seule nuit. On roule donc à droite, comme en France.`,
    },
    {
      icon: 'Snowflake',
      titre: `Feux 24h/24 et pneus hiver`,
      texte: `Feux de croisement obligatoires de jour comme de nuit. Pneus hiver imposés du 1er décembre au 31 mars, et dès que la route est enneigée ou verglacée.`,
    },
    {
      icon: 'Wine',
      titre: `Alcool : parmi les plus stricts d'Europe`,
      texte: `Le seuil est de 0,2 g/L, l'un des plus bas du continent. Les amendes sont proportionnelles aux revenus et la conduite sous influence peut mener à la prison.`,
    },
    {
      icon: 'Building2',
      titre: `Péages urbains et pont de l'Øresund`,
      texte: `Le réseau est gratuit, sauf le pont de l'Øresund vers le Danemark et les péages urbains de Stockholm et Göteborg, facturés automatiquement à la plaque.`,
    },
  ],
  faq: [
    {
      q: `Roule-t-on à droite ou à gauche en Suède ?`,
      a: `À droite, comme en France, depuis le passage historique du 3 septembre 1967.`,
    },
    {
      q: `La carte verte est-elle valable en Suède ?`,
      a: `Oui. La Suède fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Norvège - lot 7 ────────────────────────────────── */
const NORVEGE_OVERRIDE = {
  title: `Assurance temporaire Norvège | Carte verte & RC dès le 1er jour - AssuTempo`,
  metaDescription:
    `Roulez couvert en Norvège dès le 1er jour : RC auto, carte verte, attestation en 5 min. Péages AutoPASS, feux 24h/24 et alcool à 0,2 g/L expliqués.`,
  h1: `Assurance temporaire en Norvège : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Norvège dès le 1er jour : road-trip des fjords, transit ou conduite d'un véhicule étranger. Hors UE mais incluse, la Norvège fait partie des 34 pays couverts par votre carte internationale d'assurance (carte verte).`,
  points: [
    {
      icon: 'Receipt',
      titre: `Péages AutoPASS automatiques`,
      texte: `Pas de barrière : des caméras lisent votre plaque et la facture arrive à domicile. S'y ajoutent des péages urbains et de nombreux ferries le long des fjords.`,
    },
    {
      icon: 'Sun',
      titre: `Feux allumés 24h/24`,
      texte: `Feux de croisement obligatoires toute l'année, de jour comme de nuit. Gilet réfléchissant et triangle doivent rester à bord.`,
    },
    {
      icon: 'Wine',
      titre: `Alcool : tolérance quasi nulle`,
      texte: `Le seuil est de 0,2 g/L, parmi les plus bas d'Europe, et les amendes sont élevées. On évite la moindre goutte avant de prendre le volant.`,
    },
    {
      icon: 'Snowflake',
      titre: `Pneus hiver et grands espaces`,
      texte: `Pneus hiver imposés dès que la route l'exige. Dans le nord, des troupeaux de rennes circulent en liberté : vigilance, surtout au crépuscule.`,
    },
  ],
  faq: [
    {
      q: `La Norvège est-elle couverte alors qu'elle n'est pas dans l'UE ?`,
      a: `Oui. La Norvège fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
    {
      q: `Comment se paient les péages norvégiens ?`,
      a: `Sans badge, votre plaque est photographiée et la facture vous parvient ensuite. Côté assurance, votre carte verte suffit.`,
    },
  ],
};

/* ─── Contenu spécifique Finlande - lot 7 ───────────────────────────────── */
const FINLANDE_OVERRIDE = {
  title: `Assurance temporaire Finlande | Carte verte & RC dès le 1er jour - AssuTempo`,
  metaDescription:
    `Roulez couvert en Finlande dès le 1er jour : RC auto, carte verte, attestation en 5 min. Réseau gratuit, feux 24h/24, rennes et amendes au revenu expliqués.`,
  h1: `Assurance temporaire en Finlande : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Finlande dès le 1er jour : séjour nordique, transit ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Route',
      titre: `Un réseau entièrement gratuit`,
      texte: `Bonne nouvelle : il n'existe aucun péage en Finlande. Malgré le climat, les routes sont en excellent état.`,
    },
    {
      icon: 'Sun',
      titre: `Feux allumés toute l'année`,
      texte: `Feux de croisement obligatoires de jour comme de nuit, toute l'année, pour tous les véhicules.`,
    },
    {
      icon: 'Gauge',
      titre: `Des amendes proportionnelles aux revenus`,
      texte: `Particularité nordique : les grosses amendes de vitesse sont calculées sur les revenus du conducteur. Mieux vaut lever le pied.`,
    },
    {
      icon: 'TriangleAlert',
      titre: `Rennes et élans sur la route`,
      texte: `Au crépuscule surtout, rennes et élans traversent librement. Pneus hiver imposés de décembre à fin février, ou dès que les conditions l'exigent.`,
    },
  ],
  faq: [
    {
      q: `Y a-t-il des péages en Finlande ?`,
      a: `Non, le réseau est entièrement gratuit. Seule l'assurance reste obligatoire : votre carte verte AssuTempo en fait foi.`,
    },
    {
      q: `La carte verte couvre-t-elle la Finlande ?`,
      a: `Oui. La Finlande fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Islande - lot 7 ────────────────────────────────── */
const ISLANDE_OVERRIDE = {
  title: `Assurance temporaire Islande | Carte verte & routes F expliquées - AssuTempo`,
  metaDescription:
    `Roulez couvert en Islande dès le 1er jour : RC auto, carte verte, attestation en 5 min. Route 1, pistes de gravier, routes F en 4x4 et hors-piste interdit expliqués.`,
  h1: `Assurance temporaire en Islande : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Islande dès le 1er jour : tour de l'île, séjour ou conduite d'un véhicule étranger. Hors UE mais incluse, l'Islande fait partie des 34 pays couverts par votre carte internationale d'assurance (carte verte).`,
  points: [
    {
      icon: 'Route',
      titre: `La route 1 et les pistes de gravier`,
      texte: `La route circulaire (n°1) fait le tour de l'île, goudronnée. Hors d'elle, beaucoup de pistes de gravier : on ralentit au changement de revêtement, où les graviers font déraper.`,
    },
    {
      icon: 'Mountain',
      titre: `Routes F : 4x4 obligatoire`,
      texte: `Les routes F (montagne) sont réservées aux 4x4 et ouvertes l'été seulement. Elles comportent des gués à franchir sans pont : interdites et dangereuses pour une voiture classique.`,
    },
    {
      icon: 'TriangleAlert',
      titre: `Ponts à voie unique et collines aveugles`,
      texte: `Ponts et tunnels souvent à voie unique, collines sans visibilité, moutons en liberté. On ralentit et l'on serre à droite par prudence.`,
    },
    {
      icon: 'Ban',
      titre: `Hors-piste interdit, feux en permanence`,
      texte: `Conduire hors des pistes est strictement interdit (amendes lourdes, sols fragiles). Feux de croisement obligatoires de jour comme de nuit.`,
    },
  ],
  faq: [
    {
      q: `Ma carte verte est-elle valable en Islande ?`,
      a: `Oui. L'Islande fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
    {
      q: `Puis-je emprunter les routes F ?`,
      a: `Votre responsabilité civile reste valable, mais les routes F exigent un 4x4 et le hors-piste est interdit : prudence sur ces pistes.`,
    },
  ],
};

/* ─── Contenu spécifique Irlande - lot 7 ────────────────────────────────── */
const IRLANDE_OVERRIDE = {
  title: `Assurance temporaire Irlande | Carte verte & conduite à gauche - AssuTempo`,
  metaDescription:
    `Roulez couvert en Irlande dès le 1er jour : RC auto, carte verte, attestation en 5 min. Conduite à gauche, péage sans barrière M50 et petites routes expliqués.`,
  h1: `Assurance temporaire en Irlande : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Irlande dès le 1er jour : séjour, transit ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'ArrowLeft',
      titre: `On roule à gauche`,
      texte: `Comme au Royaume-Uni, la circulation se fait à gauche. Attention aux carrefours et aux ronds-points, qui se prennent dans le sens horaire.`,
    },
    {
      icon: 'Receipt',
      titre: `La M50 : péage sans barrière`,
      texte: `Autour de Dublin, la M50 se paie sans barrière (eFlow) : la plaque est scannée, le règlement doit être fait avant 20h le lendemain sous peine de pénalités. Méfiez-vous des faux SMS de paiement.`,
    },
    {
      icon: 'Route',
      titre: `Petites routes et signalisation`,
      texte: `Hors des grands axes, le réseau est étroit et sinueux. La signalisation est en kilomètres, parfois uniquement en gaélique.`,
    },
    {
      icon: 'Wine',
      titre: `Alcool : seuil abaissé pour les novices`,
      texte: `Le taux autorisé est de 0,5 g/L, ramené à 0,2 g/L pour les jeunes permis et les conducteurs professionnels.`,
    },
  ],
  faq: [
    {
      q: `Roule-t-on à gauche en Irlande ?`,
      a: `Oui, comme au Royaume-Uni. La circulation se fait à gauche sur tout le territoire.`,
    },
    {
      q: `La carte verte couvre-t-elle l'Irlande ?`,
      a: `Oui. L'Irlande fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Luxembourg - lot 8 ─────────────────────────────── */
const LUXEMBOURG_OVERRIDE = {
  title: `Assurance temporaire Luxembourg | Carte verte & RC dès le 1er jour - AssuTempo`,
  metaDescription:
    `Roulez couvert au Luxembourg dès le 1er jour : RC auto, carte verte, attestation en 5 min. Autoroutes gratuites, carburant et transports gratuits expliqués.`,
  h1: `Assurance temporaire au Luxembourg : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire au Luxembourg dès le 1er jour : trajet transfrontalier, séjour ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Fuel',
      titre: `Carburant et transports`,
      texte: `Le Grand-Duché est resté connu pour ses carburants moins chers qu'ailleurs. Depuis 2020, les transports publics y sont gratuits sur tout le territoire.`,
    },
    {
      icon: 'Route',
      titre: `Autoroutes gratuites`,
      texte: `Aucun péage : tout le réseau autoroutier est gratuit. Ces axes mènent rapidement vers la France, la Belgique et l'Allemagne.`,
    },
    {
      icon: 'Milestone',
      titre: `Priorité à droite`,
      texte: `On roule à droite, priorité à droite sauf panneau contraire. Par temps de pluie, la vitesse est plafonnée à 110 km/h, même sans panneau.`,
    },
    {
      icon: 'Wine',
      titre: `Alcool et équipements`,
      texte: `Le seuil est de 0,5 g/L, ramené à 0,2 g/L pour les permis de moins de deux ans. Gilet réfléchissant et triangle restent obligatoires à bord.`,
    },
  ],
  faq: [
    {
      q: `Faut-il payer un péage au Luxembourg ?`,
      a: `Non, le réseau autoroutier est entièrement gratuit. Côté assurance, votre carte verte AssuTempo suffit.`,
    },
    {
      q: `La carte verte couvre-t-elle le Luxembourg ?`,
      a: `Oui. Le Luxembourg fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Grèce - lot 8 ──────────────────────────────────── */
const GRECE_OVERRIDE = {
  title: `Assurance temporaire Grèce | Carte verte & péages - AssuTempo`,
  metaDescription:
    `Roulez couvert en Grèce dès le 1er jour : RC auto, carte verte, attestation en 5 min. Autoroutes à péage, routes de montagne et alcool expliqués.`,
  h1: `Assurance temporaire en Grèce : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Grèce dès le 1er jour : séjour, transit ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Ticket',
      titre: `Autoroutes à péage`,
      texte: `Les grands axes (Athènes-Thessalonique, Attiki Odos...) sont à péage, réglé au poste ou par badge. Gardez de quoi payer en espèces ou par carte.`,
    },
    {
      icon: 'Mountain',
      titre: `Routes étroites et sinueuses`,
      texte: `Sur les îles et en montagne, les routes sont étroites, le revêtement irrégulier. On adapte son allure, surtout à deux-roues.`,
    },
    {
      icon: 'Wine',
      titre: `Alcool : seuil abaissé pour certains`,
      texte: `Le taux autorisé est de 0,5 g/L, abaissé à 0,2 g/L pour les jeunes permis, les professionnels et les motards.`,
    },
    {
      icon: 'Car',
      titre: `Trafic dense à Athènes`,
      texte: `Dans la capitale, le trafic est dense et la conduite vive. Anticipez, gardez vos distances et vérifiez le stationnement, souvent réglementé.`,
    },
  ],
  faq: [
    {
      q: `Y a-t-il des péages en Grèce ?`,
      a: `Oui, les principaux axes autoroutiers sont à péage. Côté assurance, votre carte verte AssuTempo reste nécessaire.`,
    },
    {
      q: `La carte verte est-elle valable en Grèce ?`,
      a: `Oui. La Grèce fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique République tchèque - lot 8 ─────────────────────── */
const REPUBLIQUETCHEQUE_OVERRIDE = {
  title: `Assurance temporaire République tchèque | Carte verte & vignette - AssuTempo`,
  metaDescription:
    `Roulez couvert en République tchèque dès le 1er jour : RC auto, carte verte, attestation en 5 min. E-vignette, alcool à 0,0 g/L et feux 24h/24 expliqués.`,
  h1: `Assurance temporaire en République tchèque : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en République tchèque dès le 1er jour : séjour, transit ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Sticker',
      titre: `E-vignette obligatoire`,
      texte: `Sur autoroutes et voies rapides, une e-vignette liée à la plaque est obligatoire (véhicules jusqu'à 3,5 t). À activer avant d'entrer sur l'autoroute, sous peine d'amende salée.`,
    },
    {
      icon: 'Wine',
      titre: `Alcool : tolérance zéro`,
      texte: `La Tchéquie applique le 0,0 g/L : aucune trace d'alcool tolérée au volant, contrôles fréquents. Un seul verre suffit à vous mettre en faute.`,
    },
    {
      icon: 'Sun',
      titre: `Feux allumés 24h/24`,
      texte: `Feux de croisement obligatoires de jour comme de nuit, toute l'année. Vérifiez-en le bon fonctionnement avant le départ.`,
    },
    {
      icon: 'Snowflake',
      titre: `Pneus hiver`,
      texte: `Du 1er novembre à fin mars, les pneus hiver sont obligatoires dès que la route est enneigée ou verglacée.`,
    },
  ],
  faq: [
    {
      q: `Faut-il une vignette pour rouler en République tchèque ?`,
      a: `Oui, une e-vignette liée à la plaque est obligatoire sur autoroutes et voies rapides. Elle est distincte de l'assurance : votre carte verte AssuTempo couvre la responsabilité civile.`,
    },
    {
      q: `La carte verte couvre-t-elle la République tchèque ?`,
      a: `Oui. Elle fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Hongrie - lot 8 ────────────────────────────────── */
const HONGRIE_OVERRIDE = {
  title: `Assurance temporaire Hongrie | Carte verte & e-vignette - AssuTempo`,
  metaDescription:
    `Roulez couvert en Hongrie dès le 1er jour : RC auto, carte verte, attestation en 5 min. E-vignette (matrica), alcool à 0,0 g/L et contrôles expliqués.`,
  h1: `Assurance temporaire en Hongrie : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Hongrie dès le 1er jour : séjour, transit vers les Balkans ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Sticker',
      titre: `E-vignette (matrica) automatique`,
      texte: `Depuis 2013, la vignette hongroise est entièrement numérique, liée à la plaque et contrôlée par caméras. Pas d'autocollant : on l'achète en ligne ou en station avant l'autoroute.`,
    },
    {
      icon: 'Wine',
      titre: `Alcool : tolérance zéro`,
      texte: `Le 0,0 g/L s'applique à tous les conducteurs. En cas d'infraction, retrait immédiat du permis et amendes lourdes.`,
    },
    {
      icon: 'Sun',
      titre: `Feux et équipements`,
      texte: `Feux de croisement obligatoires de jour hors agglomération, et de nuit partout. Gilet réfléchissant et triangle à bord.`,
    },
    {
      icon: 'Camera',
      titre: `Contrôles renforcés`,
      texte: `Radars automatiques, patrouilles mobiles et surveillance se sont multipliés. Les conducteurs étrangers sont sanctionnés au même titre que les locaux.`,
    },
  ],
  faq: [
    {
      q: `Comment fonctionne la vignette en Hongrie ?`,
      a: `Elle est 100% numérique : on achète une e-vignette liée à la plaque, sans autocollant, vérifiée par caméras. L'assurance reste distincte.`,
    },
    {
      q: `La carte verte est-elle valable en Hongrie ?`,
      a: `Oui. La Hongrie fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Bulgarie - lot 9 ───────────────────────────────── */
const BULGARIE_OVERRIDE = {
  title: `Assurance temporaire Bulgarie | Carte verte & vignette - AssuTempo`,
  metaDescription:
    `Roulez couvert en Bulgarie dès le 1er jour : RC auto, carte verte, attestation en 5 min. E-vignette, alcool et ponts du Danube expliqués.`,
  h1: `Assurance temporaire en Bulgarie : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Bulgarie dès le 1er jour : séjour, transit ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Sticker',
      titre: `E-vignette numérique`,
      texte: `Depuis 2019, la vignette bulgare est électronique et liée à la plaque, obligatoire sur autoroutes et de nombreuses routes nationales. À activer avant d'entrer dans le pays.`,
    },
    {
      icon: 'Wine',
      titre: `Alcool au volant`,
      texte: `Le seuil autorisé est de 0,5 g/L. Contrôles et sanctions sont au rendez-vous, comme partout dans la région.`,
    },
    {
      icon: 'Ticket',
      titre: `Ponts du Danube payants à part`,
      texte: `Les ponts sur le Danube, comme celui de Vidin vers la Roumanie, se paient séparément de la vignette. Prévoyez ce péage si vous franchissez le fleuve.`,
    },
    {
      icon: 'Route',
      titre: `Un réseau en évolution`,
      texte: `Le réseau s'améliore mais reste inégal selon les axes. Hors autoroutes, prudence sur l'état de la chaussée et les usagers lents.`,
    },
  ],
  faq: [
    {
      q: `Faut-il une vignette pour rouler en Bulgarie ?`,
      a: `Oui, une e-vignette liée à la plaque est obligatoire sur autoroutes et de nombreuses routes nationales. Elle est distincte de l'assurance : votre carte verte AssuTempo couvre la responsabilité civile.`,
    },
    {
      q: `La carte verte couvre-t-elle la Bulgarie ?`,
      a: `Oui. La Bulgarie fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Roumanie - lot 9 ───────────────────────────────── */
const ROUMANIE_OVERRIDE = {
  title: `Assurance temporaire Roumanie | Carte verte & rovinieta - AssuTempo`,
  metaDescription:
    `Roulez couvert en Roumanie dès le 1er jour : RC auto, carte verte, attestation en 5 min. Rovinieta, alcool à 0,0 g/L et routes de montagne expliqués.`,
  h1: `Assurance temporaire en Roumanie : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Roumanie dès le 1er jour : séjour, transit ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Sticker',
      titre: `La rovinieta obligatoire`,
      texte: `La rovinieta, vignette électronique liée à la plaque, est obligatoire sur presque toutes les routes nationales, pas seulement les autoroutes. À activer avant de rouler.`,
    },
    {
      icon: 'Wine',
      titre: `Alcool : tolérance zéro`,
      texte: `La Roumanie applique le 0,0 g/L : aucune trace d'alcool tolérée au volant. Sanctions immédiates en cas de contrôle positif.`,
    },
    {
      icon: 'Mountain',
      titre: `La Transfăgărășan`,
      texte: `La Transfăgărășan, route de montagne spectaculaire des Carpates, n'ouvre qu'en été. En zone rurale, attendez-vous à des attelages et à des véhicules lents.`,
    },
    {
      icon: 'Ticket',
      titre: `Ponts du Danube payants`,
      texte: `Certains ponts, comme Fetești-Cernavodă, se paient en plus de la rovinieta. À prévoir sur les grands itinéraires vers la mer Noire.`,
    },
  ],
  faq: [
    {
      q: `Qu'est-ce que la rovinieta ?`,
      a: `C'est la vignette électronique roumaine, liée à la plaque, obligatoire sur presque toutes les routes nationales. Elle ne remplace pas l'assurance : votre carte verte AssuTempo reste nécessaire.`,
    },
    {
      q: `La carte verte est-elle valable en Roumanie ?`,
      a: `Oui. La Roumanie fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Slovaquie - lot 9 ──────────────────────────────── */
const SLOVAQUIE_OVERRIDE = {
  title: `Assurance temporaire Slovaquie | Carte verte & vignette - AssuTempo`,
  metaDescription:
    `Roulez couvert en Slovaquie dès le 1er jour : RC auto, carte verte, attestation en 5 min. E-vignette, alcool à 0,0 g/L et conduite hivernale expliqués.`,
  h1: `Assurance temporaire en Slovaquie : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Slovaquie dès le 1er jour : séjour, transit ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Sticker',
      titre: `E-vignette sur routes D et R`,
      texte: `Une e-vignette liée à la plaque est obligatoire sur les autoroutes (D) et voies rapides (R). À activer avant d'y circuler, sous peine d'amende.`,
    },
    {
      icon: 'Wine',
      titre: `Alcool : tolérance zéro`,
      texte: `Le 0,0 g/L s'applique à tous les conducteurs : aucune goutte d'alcool avant de prendre le volant.`,
    },
    {
      icon: 'Sun',
      titre: `Feux allumés 24h/24`,
      texte: `Feux de croisement obligatoires de jour comme de nuit, toute l'année.`,
    },
    {
      icon: 'Snowflake',
      titre: `Tatras et conduite hivernale`,
      texte: `Pays montagneux (Hautes Tatras), l'hiver y est rude : pneus hiver imposés dès que la route est enneigée ou verglacée.`,
    },
  ],
  faq: [
    {
      q: `Faut-il une vignette en Slovaquie ?`,
      a: `Oui, sur les routes D et R. C'est une e-vignette liée à la plaque, distincte de l'assurance ; votre carte verte AssuTempo couvre la responsabilité civile.`,
    },
    {
      q: `La carte verte couvre-t-elle la Slovaquie ?`,
      a: `Oui. Elle fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Slovénie - lot 9 ───────────────────────────────── */
const SLOVENIE_OVERRIDE = {
  title: `Assurance temporaire Slovénie | Carte verte & vignette - AssuTempo`,
  metaDescription:
    `Roulez couvert en Slovénie dès le 1er jour : RC auto, carte verte, attestation en 5 min. E-vignette, pays de transit et équipement hiver expliqués.`,
  h1: `Assurance temporaire en Slovénie : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Slovénie dès le 1er jour : transit entre l'Italie, l'Autriche et la Croatie, séjour ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Sticker',
      titre: `Vignette obligatoire dès l'entrée`,
      texte: `Sur autoroutes et voies rapides, une e-vignette liée à la plaque est obligatoire, en formule hebdomadaire, mensuelle ou plus. Les contrôles se font après le premier point de vente.`,
    },
    {
      icon: 'Route',
      titre: `Un petit pays de transit`,
      texte: `Carrefour entre l'Italie, l'Autriche et la Croatie : on le traverse vite, mais la vignette est exigée dès les premiers kilomètres d'autoroute.`,
    },
    {
      icon: 'Snowflake',
      titre: `Équipement hiver imposé`,
      texte: `Du 15 novembre au 15 mars, l'équipement hiver (pneus adaptés ou chaînes à bord) est obligatoire.`,
    },
    {
      icon: 'Wine',
      titre: `Alcool : seuil abaissé pour certains`,
      texte: `Le seuil est de 0,5 g/L, abaissé à 0,0 g/L pour les jeunes permis et les conducteurs professionnels.`,
    },
  ],
  faq: [
    {
      q: `Faut-il une vignette pour traverser la Slovénie ?`,
      a: `Oui, dès les premiers kilomètres d'autoroute. La e-vignette liée à la plaque est exigée, en plus de l'assurance que couvre votre carte verte AssuTempo.`,
    },
    {
      q: `La carte verte est-elle valable en Slovénie ?`,
      a: `Oui. La Slovénie fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Estonie - lot 10 ───────────────────────────────── */
const ESTONIE_OVERRIDE = {
  title: `Assurance temporaire Estonie | Carte verte & RC dès le 1er jour - AssuTempo`,
  metaDescription:
    `Roulez couvert en Estonie dès le 1er jour : RC auto, carte verte, attestation en 5 min. Alcool à 0,2 g/L, feux 24h/24 et pneus hiver expliqués.`,
  h1: `Assurance temporaire en Estonie : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Estonie dès le 1er jour : séjour balte, transit ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Wine',
      titre: `Alcool : seuil très bas`,
      texte: `Le seuil est de 0,2 g/L, parmi les plus stricts d'Europe : le moindre verre est à proscrire avant de conduire.`,
    },
    {
      icon: 'Sun',
      titre: `Feux allumés 24h/24`,
      texte: `Feux de croisement obligatoires de jour comme de nuit, toute l'année, pour tous les véhicules.`,
    },
    {
      icon: 'Snowflake',
      titre: `Pneus hiver imposés`,
      texte: `Pneus hiver obligatoires du 1er décembre au 1er mars. Au dégel, la chaussée peut être abîmée : prudence.`,
    },
    {
      icon: 'Route',
      titre: `Un réseau gratuit`,
      texte: `Aucun péage : les routes sont gratuites. La conduite y est posée, plus calme que dans le sud de l'Europe.`,
    },
  ],
  faq: [
    {
      q: `Y a-t-il des péages en Estonie ?`,
      a: `Non, les routes sont gratuites. Côté assurance, votre carte verte AssuTempo suffit.`,
    },
    {
      q: `La carte verte couvre-t-elle l'Estonie ?`,
      a: `Oui. L'Estonie fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Lettonie - lot 10 ──────────────────────────────── */
const LETTONIE_OVERRIDE = {
  title: `Assurance temporaire Lettonie | Carte verte & RC dès le 1er jour - AssuTempo`,
  metaDescription:
    `Roulez couvert en Lettonie dès le 1er jour : RC auto, carte verte, attestation en 5 min. Alcool, feux de jour et réseau gratuit expliqués.`,
  h1: `Assurance temporaire en Lettonie : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Lettonie dès le 1er jour : séjour balte, transit ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Wine',
      titre: `Alcool au volant`,
      texte: `Le seuil est de 0,5 g/L, ramené à 0,2 g/L pour les permis récents. Les contrôles sont fréquents.`,
    },
    {
      icon: 'Sun',
      titre: `Feux de jour en saison sombre`,
      texte: `Feux de croisement obligatoires de jour comme de nuit pendant la saison sombre, du 1er octobre au 1er avril.`,
    },
    {
      icon: 'CircleAlert',
      titre: `Pas de passage à l'orange`,
      texte: `Particularité locale : franchir un feu à l'orange est interdit. On anticipe le freinage dès l'allumage.`,
    },
    {
      icon: 'Route',
      titre: `Un réseau gratuit`,
      texte: `Aucun péage ni route payante. Le réseau est correct autour de Riga, plus rustique en s'en éloignant.`,
    },
  ],
  faq: [
    {
      q: `Faut-il payer un péage en Lettonie ?`,
      a: `Non, il n'y a ni péage ni route payante. Côté assurance, votre carte verte AssuTempo reste nécessaire.`,
    },
    {
      q: `La carte verte est-elle valable en Lettonie ?`,
      a: `Oui. La Lettonie fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Lituanie - lot 10 ──────────────────────────────── */
const LITUANIE_OVERRIDE = {
  title: `Assurance temporaire Lituanie | Carte verte & RC dès le 1er jour - AssuTempo`,
  metaDescription:
    `Roulez couvert en Lituanie dès le 1er jour : RC auto, carte verte, attestation en 5 min. Alcool, feux de jour et réseau gratuit pour les voitures expliqués.`,
  h1: `Assurance temporaire en Lituanie : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Lituanie dès le 1er jour : séjour balte, transit ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Wine',
      titre: `Alcool : seuil abaissé pour certains`,
      texte: `Le seuil général est de 0,4 g/L, ramené à 0,0 g/L pour les jeunes permis et les conducteurs professionnels.`,
    },
    {
      icon: 'Sun',
      titre: `Feux de jour en hiver`,
      texte: `Feux de croisement obligatoires de jour comme de nuit durant la période hivernale, du 1er novembre au 1er mars.`,
    },
    {
      icon: 'Snowflake',
      titre: `Conduite hivernale`,
      texte: `Pneus hiver imposés en saison froide. Les hivers baltes sont rigoureux : équipez-vous en conséquence.`,
    },
    {
      icon: 'Route',
      titre: `Gratuit pour les voitures`,
      texte: `Pas de péage pour les voitures particulières. Sur autoroute, la vitesse peut monter à 130 km/h l'été.`,
    },
  ],
  faq: [
    {
      q: `Les autoroutes lituaniennes sont-elles payantes ?`,
      a: `Non pour les voitures particulières. L'assurance, elle, reste obligatoire : votre carte verte AssuTempo en fait foi.`,
    },
    {
      q: `La carte verte couvre-t-elle la Lituanie ?`,
      a: `Oui. La Lituanie fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Chypre - lot 10 ────────────────────────────────── */
const CHYPRE_OVERRIDE = {
  title: `Assurance temporaire Chypre | Carte verte & conduite à gauche - AssuTempo`,
  metaDescription:
    `Roulez couvert à Chypre dès le 1er jour : RC auto, carte verte, attestation en 5 min. Conduite à gauche, autoroutes gratuites et routes de montagne expliquées.`,
  h1: `Assurance temporaire à Chypre : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire à Chypre dès le 1er jour : séjour sur l'île, location ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'ArrowLeft',
      titre: `On roule à gauche`,
      texte: `Héritage britannique : à Chypre, la circulation se fait à gauche. Attention aux ronds-points, pris dans le sens horaire, et aux carrefours.`,
    },
    {
      icon: 'Route',
      titre: `Autoroutes gratuites`,
      texte: `Aucun péage sur l'île : les autoroutes sont gratuites. Le réseau principal est moderne et bien entretenu.`,
    },
    {
      icon: 'Mountain',
      titre: `Routes du massif du Troodos`,
      texte: `Vers les montagnes du Troodos, les routes deviennent étroites et sinueuses. On adapte son allure, surtout en été.`,
    },
    {
      icon: 'Wine',
      titre: `Contrôles d'alcoolémie stricts`,
      texte: `Les contrôles sont fréquents et fermes. Par prudence, on s'abstient de tout verre avant de prendre le volant.`,
    },
  ],
  faq: [
    {
      q: `Roule-t-on à gauche à Chypre ?`,
      a: `Oui. Comme en Irlande et à Malte, la circulation se fait à gauche sur toute l'île.`,
    },
    {
      q: `La carte verte est-elle valable à Chypre ?`,
      a: `Oui. Chypre fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Malte - lot 11 ─────────────────────────────────── */
const MALTE_OVERRIDE = {
  title: `Assurance temporaire Malte | Carte verte & conduite à gauche - AssuTempo`,
  metaDescription:
    `Roulez couvert à Malte dès le 1er jour : RC auto, carte verte, attestation en 5 min. Conduite à gauche, routes étroites et trafic dense expliqués.`,
  h1: `Assurance temporaire à Malte : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire à Malte dès le 1er jour : séjour, location ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'ArrowLeft',
      titre: `On roule à gauche`,
      texte: `Héritage britannique : à Malte, la circulation se fait à gauche. Ronds-points dans le sens horaire et carrefours demandent une vigilance constante.`,
    },
    {
      icon: 'Wine',
      titre: `Le seuil d'alcool le plus haut`,
      texte: `Avec le Royaume-Uni, Malte affiche le seuil le plus élevé d'Europe, à 0,8 g/L. Cela n'enlève rien aux risques : la prudence reste de mise.`,
    },
    {
      icon: 'Car',
      titre: `Routes étroites et denses`,
      texte: `Sur la plus petite île de l'UE, le trafic est dense, les routes étroites et les ronds-points nombreux. On roule lentement, l'oeil sur les cyclistes.`,
    },
    {
      icon: 'Route',
      titre: `Pas d'autoroute, vitesses basses`,
      texte: `Pas de véritable autoroute : le réseau est essentiellement urbain et la vitesse plafonne autour de 80 km/h sur les axes les plus rapides.`,
    },
  ],
  faq: [
    {
      q: `Roule-t-on à gauche à Malte ?`,
      a: `Oui. Comme en Irlande et à Chypre, la circulation se fait à gauche sur tout l'archipel.`,
    },
    {
      q: `La carte verte est-elle valable à Malte ?`,
      a: `Oui. Malte fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Andorre - lot 11 ───────────────────────────────── */
const ANDORRE_OVERRIDE = {
  title: `Assurance temporaire Andorre | Carte verte & cols de montagne - AssuTempo`,
  metaDescription:
    `Roulez couvert en Andorre dès le 1er jour : RC auto, carte verte, attestation en 5 min. Cols pyrénéens, duty-free et conduite hivernale expliqués.`,
  h1: `Assurance temporaire en Andorre : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Andorre dès le 1er jour : escapade pyrénéenne, achats transfrontaliers ou conduite d'un véhicule étranger. Votre carte internationale d'assurance (carte verte) vaut ici comme dans les 33 autres pays.`,
  points: [
    {
      icon: 'Mountain',
      titre: `Cols de haute montagne`,
      texte: `Nichée dans les Pyrénées, la principauté se gagne par des cols, dont le Port d'Envalira, le plus haut col routier des Pyrénées. Équipement hiver vivement conseillé en saison froide.`,
    },
    {
      icon: 'ShoppingBag',
      titre: `Le paradis du duty-free`,
      texte: `Hors UE mais à l'euro, l'Andorre attire pour ses prix : carburant, tabac et alcool y sont moins chers, d'où un trafic dense aux frontières.`,
    },
    {
      icon: 'Route',
      titre: `Aucun péage`,
      texte: `Pas de péage sur le territoire andorran. Les routes de montagne, sinueuses, demandent une conduite prudente, surtout l'hiver.`,
    },
    {
      icon: 'Wine',
      titre: `Alcool au volant`,
      texte: `Le seuil autorisé est de 0,5 g/L. Les contrôles sont présents, notamment à l'approche des stations de ski.`,
    },
  ],
  faq: [
    {
      q: `Faut-il un péage pour rouler en Andorre ?`,
      a: `Non, il n'y a pas de péage. Côté assurance, votre carte verte AssuTempo suffit.`,
    },
    {
      q: `La carte verte couvre-t-elle l'Andorre ?`,
      a: `Oui. L'Andorre fait partie des 34 pays couverts par votre carte internationale d'assurance AssuTempo.`,
    },
  ],
};

/* ─── Contenu spécifique Bosnie-Herzégovine - lot 11 ────────────────────── */
const BOSNIEHERZEGOVINE_OVERRIDE = {
  title: `Assurance temporaire Bosnie-Herzégovine | Carte verte indispensable - AssuTempo`,
  metaDescription:
    `Roulez couvert en Bosnie-Herzégovine dès le 1er jour : RC auto, carte verte incluse, attestation en 5 min. Péage A1, routes de montagne et vigilance expliqués.`,
  h1: `Assurance temporaire en Bosnie-Herzégovine : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire en Bosnie-Herzégovine dès le 1er jour : transit balkanique, séjour ou conduite d'un véhicule étranger. Hors UE mais incluse, elle fait partie des 34 pays couverts par votre carte internationale d'assurance (carte verte).`,
  points: [
    {
      icon: 'ShieldCheck',
      titre: `Carte verte indispensable`,
      texte: `Hors Union européenne, la Bosnie-Herzégovine exige la carte internationale d'assurance (carte verte) à la frontière. Avec AssuTempo, elle est incluse.`,
    },
    {
      icon: 'Ticket',
      titre: `Péage sur l'A1`,
      texte: `Le réseau est en partie gratuit, mais l'autoroute A1 comporte un péage. Gardez de quoi régler en espèces ou par carte.`,
    },
    {
      icon: 'Mountain',
      titre: `Routes de montagne et vigilance`,
      texte: `Les grands axes sont bien entretenus, mais certaines routes secondaires restent rustiques. En zone isolée, mieux vaut s'en tenir aux voies balisées.`,
    },
    {
      icon: 'Sun',
      titre: `Feux et équipements`,
      texte: `Feux de croisement allumés recommandés de jour, gilet et triangle à bord. Équipement hiver requis en conditions enneigées.`,
    },
  ],
  faq: [
    {
      q: `La Bosnie-Herzégovine est-elle couverte alors qu'elle n'est pas dans l'UE ?`,
      a: `Oui. Hors UE, elle exige la carte verte à la frontière, et celle-ci est incluse dans votre contrat AssuTempo. C'est l'un des 34 pays couverts.`,
    },
    {
      q: `Y a-t-il des péages en Bosnie-Herzégovine ?`,
      a: `Oui, sur l'autoroute A1. Le reste du réseau est largement gratuit.`,
    },
  ],
};

/* ─── Contenu spécifique Monténégro - lot 11 ────────────────────────────── */
const MONTENEGRO_OVERRIDE = {
  title: `Assurance temporaire Monténégro | Carte verte incluse - AssuTempo`,
  metaDescription:
    `Roulez couvert au Monténégro dès le 1er jour : RC auto, carte verte incluse, attestation en 5 min. Tunnel de Sozina, ferry de Kotor et routes de montagne expliqués.`,
  h1: `Assurance temporaire au Monténégro : roulez couvert dès le 1er jour`,
  intro:
    `AssuTempo couvre la responsabilité civile automobile obligatoire au Monténégro dès le 1er jour : road-trip adriatique, transit ou conduite d'un véhicule étranger. Hors UE mais incluse, il fait partie des 34 pays couverts par votre carte internationale d'assurance (carte verte).`,
  points: [
    {
      icon: 'ShieldCheck',
      titre: `Carte verte indispensable`,
      texte: `Hors UE mais à l'euro, le Monténégro demande la carte verte à l'entrée. Elle est incluse dans votre contrat AssuTempo.`,
    },
    {
      icon: 'Ticket',
      titre: `Tunnel de Sozina et ferry de Kotor`,
      texte: `Le tunnel de Sozina, sur l'axe Podgorica-littoral, est payant, tout comme le ferry de la baie de Kotor. À prévoir sur votre itinéraire.`,
    },
    {
      icon: 'Mountain',
      titre: `Routes spectaculaires et exigeantes`,
      texte: `Les routes de montagne, comme les lacets au-dessus de Kotor, offrent des panoramas saisissants mais demandent une conduite attentive.`,
    },
    {
      icon: 'Sun',
      titre: `Feux et conduite hivernale`,
      texte: `Feux de croisement obligatoires de jour, gilet et triangle à bord. Équipement hiver nécessaire dès que la neige s'installe.`,
    },
  ],
  faq: [
    {
      q: `Le Monténégro est-il couvert par la carte verte ?`,
      a: `Oui. Hors UE, il demande la carte verte à l'entrée ; elle est incluse dans votre contrat AssuTempo. C'est l'un des 34 pays couverts.`,
    },
    {
      q: `Quels sont les péages au Monténégro ?`,
      a: `Le tunnel de Sozina et le ferry de la baie de Kotor sont payants. Le reste du réseau est gratuit.`,
    },
  ],
};

/* ─── Micro-info tooltip carte (5 mots max) ──────────────────────────────
   Renseignée uniquement quand le contenu de page ci-dessus mentionne déjà
   clairement une vignette ou un péage. Aucune invention : pays absent de
   cette liste = pas d'information affichée. */
const INFO_CLE = {
  "france":             `Vignette Crit'Air en ZFE`,
  "allemagne":          `Vignette environnementale en ville`,
  "espagne":            `Vignette DGT en ville`,
  "belgique":           `Réseau gratuit, sans vignette`,
  "suisse":             `Vignette autoroutière obligatoire`,
  "italie":             `Autoroutes à péage`,
  "royaume-uni":        `ULEZ et péage à Londres`,
  "portugal":           `Péages électroniques sans barrière`,
  "croatie":            `Autoroutes à péage`,
  "danemark":           `Ponts à péage uniquement`,
  "suede":              `Péages urbains automatiques`,
  "norvege":            `Péages AutoPASS automatiques`,
  "finlande":           `Aucun péage`,
  "irlande":            `Péage M50 sans barrière`,
  "luxembourg":         `Aucun péage`,
  "grece":              `Autoroutes à péage`,
  "republique-tcheque": `E-vignette obligatoire`,
  "hongrie":            `E-vignette liée à la plaque`,
  "bulgarie":           `E-vignette obligatoire`,
  "roumanie":           `Vignette rovinieta obligatoire`,
  "slovaquie":          `E-vignette obligatoire`,
  "slovenie":           `Vignette obligatoire`,
  "estonie":            `Aucun péage`,
  "lettonie":           `Aucun péage`,
  "lituanie":           `Aucun péage pour voitures`,
  "chypre":             `Aucun péage`,
  "andorre":            `Aucun péage`,
  "bosnie-herzegovine": `Péage sur l'A1`,
  "montenegro":         `Tunnel de Sozina payant`,
};

/* ─── Construction de la liste et des indexes ────────────────────────────── */
export const COUNTRIES = RAW.map(([slug, isoId, nom, flag, center]) => {
  const base = generic(nom, flag, center);

  /* Overrides spécifiques */
  const over =
    slug === 'france'      ? FRANCE_OVERRIDE      :
    slug === 'allemagne'   ? ALLEMAGNE_OVERRIDE   :
    slug === 'espagne'     ? ESPAGNE_OVERRIDE     :
    slug === 'belgique'    ? BELGIQUE_OVERRIDE    :
    slug === 'suisse'      ? SUISSE_OVERRIDE      :
    slug === 'italie'      ? ITALIE_OVERRIDE      :
    slug === 'royaume-uni' ? ROYAUMEUNI_OVERRIDE  :
    slug === 'portugal'    ? PORTUGAL_OVERRIDE    :
    slug === 'pays-bas'    ? PAYSBAS_OVERRIDE     :
    slug === 'croatie'     ? CROATIE_OVERRIDE     :
    slug === 'danemark'    ? DANEMARK_OVERRIDE    :
    slug === 'suede'       ? SUEDE_OVERRIDE       :
    slug === 'norvege'     ? NORVEGE_OVERRIDE     :
    slug === 'finlande'    ? FINLANDE_OVERRIDE    :
    slug === 'islande'     ? ISLANDE_OVERRIDE     :
    slug === 'irlande'          ? IRLANDE_OVERRIDE          :
    slug === 'luxembourg'       ? LUXEMBOURG_OVERRIDE       :
    slug === 'grece'            ? GRECE_OVERRIDE            :
    slug === 'republique-tcheque' ? REPUBLIQUETCHEQUE_OVERRIDE :
    slug === 'hongrie'          ? HONGRIE_OVERRIDE          :
    slug === 'bulgarie'         ? BULGARIE_OVERRIDE         :
    slug === 'roumanie'         ? ROUMANIE_OVERRIDE         :
    slug === 'slovaquie'        ? SLOVAQUIE_OVERRIDE        :
    slug === 'slovenie'         ? SLOVENIE_OVERRIDE         :
    slug === 'estonie'          ? ESTONIE_OVERRIDE          :
    slug === 'lettonie'         ? LETTONIE_OVERRIDE         :
    slug === 'lituanie'         ? LITUANIE_OVERRIDE         :
    slug === 'chypre'              ? CHYPRE_OVERRIDE              :
    slug === 'malte'               ? MALTE_OVERRIDE               :
    slug === 'andorre'             ? ANDORRE_OVERRIDE             :
    slug === 'bosnie-herzegovine'  ? BOSNIEHERZEGOVINE_OVERRIDE   :
    slug === 'montenegro'          ? MONTENEGRO_OVERRIDE          :
    {};

  return {
    slug,
    isoId,
    nom,
    flag,
    center,
    infoCle: INFO_CLE[slug],
    title:           over.title           ?? `Assurance temporaire en ${nom}, RC dès J1 | AssuTempo`,
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
