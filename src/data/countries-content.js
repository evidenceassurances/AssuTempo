/* ─────────────────────────────────────────────────────────────────────────────
   countries-content.js — Données des 34 pays couverts par AssuTempo
   Règle : aucune spécificité juridique locale non vérifiée.
   Les emplacements "À compléter" sont à remplir manuellement.
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
};

/* ─── Contenu spécifique Espagne ─────────────────────────────────────────── */
const ESPAGNE_OVERRIDE = {
  title: 'Assurance temporaire en Espagne — RC couverte dès J1 | AssuTempo',
  metaDescription:
    'Circulez en Espagne avec votre assurance temporaire AssuTempo. RC couverte dès le 1er jour, ' +
    'carte internationale d\'assurance automobile, attestation immédiate en moins de 5 minutes.',
  h1: 'Assurance temporaire en Espagne : roulez couvert dès le premier jour',
  intro:
    'Votre assurance temporaire AssuTempo est valable en Espagne dès le premier jour du ' +
    'contrat. La responsabilité civile obligatoire (seguro de responsabilidad civil) est ' +
    'couverte, et votre carte internationale d\'assurance automobile (anciennement ' +
    '« carte verte ») est le document officiel reconnu par les autorités espagnoles. ' +
    'Idéal pour un transit, un achat de véhicule ou une conduite ponctuelle en Espagne.',
  points: [
    {
      titre: 'RC couverte dès J1',
      texte:
        'La responsabilité civile obligatoire est active dès le premier jour, sans délai ' +
        'de carence. Vous pouvez prendre la route vers l\'Espagne immédiatement après la souscription.',
    },
    {
      titre: 'Carte internationale d\'assurance automobile',
      texte:
        'La carte internationale d\'assurance automobile est le document officiel reconnu en ' +
        'Espagne. Elle est délivrée avec votre Mémo Véhicule Assuré, dès la souscription.',
    },
    {
      titre: 'Attestation immédiate',
      texte:
        'Souscription en moins de 5 minutes. Vous recevez instantanément votre attestation ' +
        'pour circuler en France et en Espagne sans attendre.',
    },
    {
      titre: 'Spécificités pratiques',
      texte:
        'À compléter — règles de circulation particulières, documents recommandés à ' +
        'avoir dans le véhicule, informations sur les contrôles routiers en Espagne, etc.',
    },
  ],
};

/* ─── Construction de la liste et des indexes ────────────────────────────── */
export const COUNTRIES = RAW.map(([slug, isoId, nom, flag, center]) => {
  const base = generic(nom, flag, center);

  /* Overrides spécifiques */
  const over =
    slug === 'france'  ? FRANCE_OVERRIDE  :
    slug === 'espagne' ? ESPAGNE_OVERRIDE  :
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
    h1:    over.h1    ?? `Assurance temporaire en ${nom} : circulez couvert dès le 1er jour`,
    intro: over.intro ?? base.intro,
    points: over.points ?? base.points,
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
