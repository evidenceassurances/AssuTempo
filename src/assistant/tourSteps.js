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
 *   - frame      : true => grand element (iframe / formulaire). On le cadre par
 *                  un ENCADRE DORE lumineux (bordure + halo), sans decoupe sombre
 *                  ni assombrissement marque, et son haut est amene confortablement
 *                  en vue (~20 % du haut de fenetre). Re-mesure apres chargement de
 *                  l'iframe pour epouser la vraie taille. Les petites cibles (sans
 *                  ce flag) gardent le projecteur sombre, joli sur petit element.
 *
 * Champ `mobile` (par flux) : sur petit ecran / pointeur grossier, on n'ouvre
 * PAS le tour a projecteur (trop fragile : iframe lourde + barre Safari mouvante).
 * On affiche a la place un court message + un bouton CTA qui mene directement
 * a la bonne destination.
 *   - message     : texte d'accompagnement injecte dans le chat
 *   - ctaLabel    : libelle du bouton
 *   - path        : route a ouvrir (si differente de la page courante)
 *   - scrollTarget: selecteur vers lequel faire un smooth-scroll une fois arrive
 *
 * Mur de l'iframe : on guide jusqu'au bord de l'iframe tierce (tarification,
 * Certimat) sans jamais tenter d'acceder a son contenu (cross-origin interdit).
 */
export const TOUR_FLOWS = {
  temporaire: {
    label: 'Assurance temporaire',
    sub: 'Devis et souscription en ligne',
    icon: 'shield',
    mobile: {
      message: `Renseignez votre véhicule, la durée (1 à 90 jours) et vos informations dans le formulaire ; l'attestation arrive en quelques minutes, sans relevé d'information. Je vous y emmène.`,
      ctaLabel: 'Aller au formulaire',
      path: '/tarification',
      scrollTarget: '[data-assistant-target="tarif-iframe"]',
    },
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
        text: `Voici votre formulaire. Renseignez-y le véhicule, la durée (de 1 à 90 jours) et vos informations. L'attestation arrive en quelques minutes, sans relevé d'information.`,
        placement: 'top',
        frame: true,
      },
    ],
  },
  'carte-grise': {
    label: 'Carte grise',
    sub: 'Immatriculation en ligne',
    icon: 'file',
    mobile: {
      message: `Votre demande passe par notre partenaire agréé Certimat. Renseignez votre véhicule dans le module sécurisé pour obtenir votre carte grise. Je vous y emmène.`,
      ctaLabel: 'Accéder à la carte grise',
      path: '/carte-grise',
      scrollTarget: '[data-assistant-target="carte-grise-iframe"]',
    },
    steps: [
      {
        path: '/carte-grise',
        target: '[data-assistant-target="carte-grise-iframe"]',
        title: 'Votre demande de carte grise',
        text: `Voici le module sécurisé, propulsé par notre partenaire agréé Certimat. Renseignez-y votre véhicule pour obtenir votre carte grise.`,
        placement: 'top',
        frame: true,
      },
    ],
  },
};
