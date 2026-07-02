/* Index LEGER des 34 pays : slug, isoId, nom, drapeau, centre carte.
   C'est le SEUL module pays importe par la Home (section Countries) et
   par tout code du bundle critique. Le contenu redactionnel complet
   (countries-content.js, ~80 KB source) reste dans le chunk lazy de la
   page Carte : ne jamais l'importer depuis la Home ou le shell. */

export const COUNTRIES_RAW = [
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

export const COUNTRIES_INDEX = COUNTRIES_RAW.map(
  ([slug, isoId, nom, flag, center]) => ({ slug, isoId, nom, flag, center }),
);
