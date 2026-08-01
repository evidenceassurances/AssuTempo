/* Pays voisins reels de chaque pays couvert (frontieres terrestres, ou
   liaisons routieres/ferry directes pour les iles). Slugs uniquement, tous
   membres des 34 pays couverts : le rendu recupere nom et drapeau via
   SLUG_TO_COUNTRY. `international: true` signale des voisins hors carte
   standard (Maroc, Turquie, Albanie, Serbie...) : la page ajoute alors un
   lien vers /assurance-internationale. */

export const PAYS_VOISINS = {
  'allemagne':           { voisins: ['france', 'belgique', 'pays-bas', 'suisse', 'autriche'], international: false },
  'andorre':             { voisins: ['france', 'espagne', 'portugal'], international: false },
  'autriche':            { voisins: ['allemagne', 'suisse', 'italie', 'slovenie', 'hongrie'], international: false },
  'belgique':            { voisins: ['france', 'pays-bas', 'luxembourg', 'allemagne'], international: false },
  'bosnie-herzegovine':  { voisins: ['croatie', 'montenegro', 'slovenie'], international: true },
  'bulgarie':            { voisins: ['roumanie', 'grece'], international: true },
  'chypre':              { voisins: ['grece', 'italie', 'malte'], international: true },
  'croatie':             { voisins: ['slovenie', 'hongrie', 'bosnie-herzegovine', 'montenegro'], international: true },
  'danemark':            { voisins: ['allemagne', 'suede', 'norvege'], international: false },
  'espagne':             { voisins: ['portugal', 'france', 'andorre'], international: true },
  'estonie':             { voisins: ['lettonie', 'lituanie', 'finlande'], international: false },
  'finlande':            { voisins: ['suede', 'norvege', 'estonie'], international: false },
  'france':              { voisins: ['espagne', 'italie', 'allemagne', 'belgique', 'suisse'], international: false },
  'grece':               { voisins: ['bulgarie', 'italie', 'chypre'], international: true },
  'hongrie':             { voisins: ['autriche', 'slovaquie', 'roumanie', 'croatie', 'slovenie'], international: true },
  'irlande':             { voisins: ['royaume-uni', 'france'], international: false },
  'islande':             { voisins: ['danemark', 'norvege', 'royaume-uni'], international: false },
  'italie':              { voisins: ['france', 'suisse', 'autriche', 'slovenie'], international: false },
  'lettonie':            { voisins: ['estonie', 'lituanie'], international: false },
  'lituanie':            { voisins: ['lettonie', 'pologne', 'estonie'], international: false },
  'luxembourg':          { voisins: ['france', 'belgique', 'allemagne'], international: false },
  'malte':               { voisins: ['italie', 'grece', 'chypre'], international: true },
  'montenegro':          { voisins: ['bosnie-herzegovine', 'croatie'], international: true },
  'norvege':             { voisins: ['suede', 'finlande', 'danemark'], international: false },
  'pays-bas':            { voisins: ['belgique', 'allemagne', 'luxembourg'], international: false },
  'pologne':             { voisins: ['allemagne', 'republique-tcheque', 'slovaquie', 'lituanie'], international: false },
  'portugal':            { voisins: ['espagne', 'france', 'andorre'], international: true },
  'republique-tcheque':  { voisins: ['allemagne', 'autriche', 'slovaquie', 'pologne'], international: false },
  'roumanie':            { voisins: ['hongrie', 'bulgarie'], international: true },
  'royaume-uni':         { voisins: ['france', 'irlande', 'belgique', 'pays-bas'], international: false },
  'slovaquie':           { voisins: ['republique-tcheque', 'pologne', 'hongrie', 'autriche'], international: false },
  'slovenie':            { voisins: ['italie', 'autriche', 'hongrie', 'croatie'], international: false },
  'suede':               { voisins: ['norvege', 'finlande', 'danemark'], international: false },
  'suisse':              { voisins: ['france', 'allemagne', 'italie', 'autriche'], international: false },
};
