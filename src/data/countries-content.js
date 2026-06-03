/* ─────────────────────────────────────────────────────────────────────────────
   countries-content.js — Données des 34 pays couverts par AssuTempo
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
        icon: 'Shield',
        titre: 'RC couverte dès J1',
        texte:
          'La responsabilité civile obligatoire est active dès le premier jour du contrat — ' +
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
          'À compléter — conseils locaux, documents recommandés au voyage, ' +
          'particularités du contrôle routier en ' + nom + ', etc.',
      },
    ],
  };
}

/* Helper — les 3 cartes communes (avec icônes) conservées dans les overrides */
function genericPoints(nom) {
  return [
    {
      icon: 'Shield',
      titre: 'RC couverte dès J1',
      texte:
        `La responsabilité civile obligatoire est active dès le premier jour du contrat — ` +
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
      icon: 'Shield',
      titre: 'RC couverte dès J1',
      texte:
        'La responsabilité civile obligatoire est active dès le premier jour du contrat — ' +
        'aucun délai de carence, quelle que soit la durée choisie (1 à 90 jours).',
    },
    {
      icon: 'FileSearch',
      titre: 'Le FVA remplace la carte verte en France',
      texte:
        'Depuis avril 2024, la carte verte n\'existe plus comme justificatif en France. ' +
        'L\'assurance est vérifiée directement à la plaque via le Fichier des Véhicules ' +
        'Assurés (FVA), mis à jour à votre souscription.',
    },
    {
      icon: 'MailCheck',
      titre: 'Mémo Véhicule Assuré — immédiat',
      texte:
        'À la souscription, vous recevez votre Mémo Véhicule Assuré (document de ' +
        'référence en France) et votre carte internationale d\'assurance automobile ' +
        '(pour les 34 pays européens couverts).',
    },
    {
      icon: 'Car',
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
      texte: `Pour entrer au centre de 50+ villes (Berlin, Munich, Cologne…), la pastille verte est obligatoire sur le pare-brise, voitures étrangères comprises. Sans elle, amende — même de passage.`,
    },
    {
      icon: 'History',
      titre: `Le berceau de l'automobile`,
      texte: `Tout est né ici : Carl Benz brevète la première voiture en 1886. En 1888, Bertha Benz signe le premier road-trip de l'histoire (100+ km, Mannheim–Pforzheim), aujourd'hui balisé comme itinéraire touristique.`,
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

/* ─── Contenu spécifique Espagne — lot 1 ────────────────────────────────── */
const ESPAGNE_OVERRIDE = {
  title: `Assurance temporaire Espagne | Carte verte & balise V16 — AssuTempo`,
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
      texte: `Depuis le 1er janvier 2026, la balise connectée V16 (feu orange à 360°, géolocalisé via DGT 3.0) remplace le triangle — mais seulement pour les véhicules immatriculés en Espagne. En voiture étrangère, triangles et gilet restent valables.`,
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

/* ─── Contenu spécifique Belgique — lot 1 ───────────────────────────────── */
const BELGIQUE_OVERRIDE = {
  title: `Assurance temporaire Belgique | Carte verte & RC dès le 1er jour — AssuTempo`,
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
      texte: `Plus stricte qu'en France : sans panneau ni marquage, celui qui vient de droite passe, même d'une petite rue. Première cause d'accrochages pour les étrangers — au moindre doute, on cède et on ralentit.`,
    },
    {
      icon: 'Camera',
      titre: `La Low Emission Zone (LEZ)`,
      texte: `Bruxelles, Anvers et Gand interdisent les véhicules les plus polluants. Avec une plaque étrangère, l'enregistrement en ligne est obligatoire avant d'entrer à Bruxelles, sinon les caméras verbalisent — même de passage.`,
    },
    {
      icon: 'Lightbulb',
      titre: `Un réseau gratuit… et longtemps illuminé`,
      texte: `Aucune vignette pour les voitures : le réseau, parmi les plus denses d'Europe, est gratuit. Et si éclairé qu'on le disait « visible depuis l'espace » — légende tenace, depuis largement éteinte par souci d'économie.`,
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

/* ─── Contenu spécifique Suisse — lot 1 ─────────────────────────────────── */
const SUISSE_OVERRIDE = {
  title: `Assurance temporaire Suisse | Carte verte & vignette — AssuTempo`,
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
      texte: `Vignette annuelle obligatoire sur autoroutes et semi-autoroutes, désormais aussi en e-vignette liée à la plaque. Valable toute l'année, quel que soit le nombre de passages. Sans elle, amende — contrôles fréquents.`,
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
      texte: `C'est sur le col de la Furka qu'a été tournée la poursuite en Aston Martin de James Bond dans Goldfinger (1964). Ses lacets comptent parmi les plus belles routes des Alpes — vignette en règle et assurance valide.`,
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
