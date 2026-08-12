/* Index LEGER des 34 pays : slug, isoId, nom, code ISO, centre carte.
   Le champ `code` est le code ISO 3166-1 alpha-2 minuscule : source de verite
   unique du drapeau, consomme par <Flag /> (src/components/ui/Flag.jsx).
   C'est le SEUL module pays importe par la Home (section Countries) et
   par tout code du bundle critique. Le contenu redactionnel complet
   (countries-content.js, ~80 KB source) reste dans le chunk lazy de la
   page Carte : ne jamais l'importer depuis la Home ou le shell. */

export const COUNTRIES_RAW = [
  /* [slug, isoId, nom, code, center[lng,lat]] */
  ['autriche',            40,  'Autriche',             'at', [14.5, 47.5]],
  ['belgique',            56,  'Belgique',             'be', [4.5,  50.5]],
  ['bulgarie',           100,  'Bulgarie',             'bg', [25.5, 42.7]],
  ['chypre',             196,  'Chypre',               'cy', [33.0, 35.0]],
  ['republique-tcheque', 203,  'République tchèque',   'cz', [15.5, 49.8]],
  ['allemagne',          276,  'Allemagne',            'de', [10.0, 51.2]],
  ['danemark',           208,  'Danemark',             'dk', [10.0, 56.0]],
  ['espagne',            724,  'Espagne',              'es', [-3.7, 40.4]],
  ['estonie',            233,  'Estonie',              'ee', [25.0, 58.7]],
  ['france',             250,  'France',               'fr', [2.3,  46.2]],
  ['finlande',           246,  'Finlande',             'fi', [26.0, 64.0]],
  ['grece',              300,  'Grèce',                'gr', [22.0, 39.0]],
  ['hongrie',            348,  'Hongrie',              'hu', [19.5, 47.0]],
  ['croatie',            191,  'Croatie',              'hr', [16.5, 45.2]],
  ['italie',             380,  'Italie',               'it', [12.5, 42.8]],
  ['irlande',            372,  'Irlande',              'ie', [-8.0, 53.4]],
  ['islande',            352,  'Islande',              'is', [-19.0,65.0]],
  ['luxembourg',         442,  'Luxembourg',           'lu', [6.1,  49.8]],
  ['lituanie',           440,  'Lituanie',             'lt', [23.9, 55.3]],
  ['lettonie',           428,  'Lettonie',             'lv', [24.7, 56.9]],
  ['malte',              470,  'Malte',                'mt', [14.4, 35.9]],
  ['norvege',            578,  'Norvège',              'no', [10.0, 64.0]],
  ['pays-bas',           528,  'Pays-Bas',             'nl', [5.3,  52.3]],
  ['portugal',           620,  'Portugal',             'pt', [-8.0, 39.5]],
  ['pologne',            616,  'Pologne',              'pl', [20.0, 52.1]],
  ['roumanie',           642,  'Roumanie',             'ro', [25.0, 45.9]],
  ['suede',              752,  'Suède',                'se', [18.0, 62.0]],
  ['slovaquie',          703,  'Slovaquie',            'sk', [19.5, 48.7]],
  ['slovenie',           705,  'Slovénie',             'si', [14.9, 46.1]],
  ['suisse',             756,  'Suisse',               'ch', [8.2,  46.8]],
  ['andorre',             20,  'Andorre',              'ad', [1.5,  42.5]],
  ['bosnie-herzegovine',  70,  'Bosnie-Herzégovine',   'ba', [17.8, 44.2]],
  ['montenegro',         499,  'Monténégro',           'me', [19.4, 42.8]],
  ['royaume-uni',        826,  'Royaume-Uni',          'gb', [-2.0, 54.0]],
];

export const COUNTRIES_INDEX = COUNTRIES_RAW.map(
  ([slug, isoId, nom, code, center]) => ({ slug, isoId, nom, code, center }),
);
