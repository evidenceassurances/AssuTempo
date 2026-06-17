/**
 * Configuration deterministe du tour guide.
 *
 * Chaque flux est un tableau d'etapes editables. Une etape cible un element
 * reel via un selecteur stable. Si la cible est absente du DOM (autre page,
 * DOM modifie), l'etape se degrade proprement (tooltip centre, jamais de crash).
 *
 * Champs d'une etape :
 *   - path       : route a charger avant de localiser la cible (optionnel)
 *   - target     : selecteur CSS de l'element a surligner (optionnel)
 *   - title      : titre du tooltip
 *   - text       : texte du tooltip
 *   - placement  : 'top' | 'bottom' | 'auto' (defaut 'auto')
 *
 * Mur de l'iframe : on guide jusqu'au bord de l'iframe tierce (tarification,
 * Certimat) sans jamais tenter d'acceder a son contenu (cross-origin interdit).
 */
export const TOUR_FLOWS = {
  temporaire: {
    label: 'Assurance temporaire',
    sub: 'Devis et souscription en ligne',
    icon: 'shield',
    steps: [
      {
        target: '[data-assistant-target="devis"]',
        title: 'Tout commence ici',
        text: `Pour lancer votre assurance temporaire, cliquez sur « Obtenir mon devis ». Ce bouton est disponible sur chaque page. Je vous emmène au formulaire.`,
        placement: 'bottom',
      },
      {
        path: '/tarification',
        target: '[data-assistant-target="tarif-iframe"]',
        title: 'Votre formulaire sécurisé',
        text: `Renseignez le véhicule, la durée (de 1 à 90 jours) et vos informations dans ce module. L'attestation arrive en quelques minutes, sans relevé d'information.`,
        placement: 'top',
      },
    ],
  },
  'carte-grise': {
    label: 'Carte grise',
    sub: 'Immatriculation en ligne',
    icon: 'file',
    steps: [
      {
        path: '/carte-grise',
        target: '[data-assistant-target="carte-grise-iframe"]',
        title: 'Votre demande de carte grise',
        text: `Cette démarche est propulsée par notre partenaire agréé Certimat. Renseignez votre véhicule directement dans ce module sécurisé pour obtenir votre carte grise.`,
        placement: 'top',
      },
    ],
  },
};
