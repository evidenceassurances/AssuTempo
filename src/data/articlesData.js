import { Car, FileText, Users, Truck, Clock, ShoppingCart, AlertTriangle, ParkingSquare } from 'lucide-react';

export const articles = [
  {
    slug: 'voiture-immobilisee-defaut-assurance',
    titre: "Voiture immobilisée pour défaut d'assurance : comment la récupérer",
    extrait:
      "Véhicule immobilisé ou en fourrière pour défaut d'assurance ? Assurez-vous en 5 minutes, attestation immédiate, et récupérez votre voiture légalement.",
    icone: AlertTriangle,
    categorie: 'Urgence',
    readTime: '4 min',
    hasPage: true,
  },
  {
    slug: 'controle-sans-assurance-risques-amende',
    titre: "Contrôlé sans assurance : risques, amende et que faire",
    extrait:
      "Amende de 500 € à 3 750 €, immobilisation possible, peines complémentaires… Les vrais risques du défaut d'assurance et comment se mettre en règle en 5 minutes.",
    icone: AlertTriangle,
    categorie: 'Urgence',
    readTime: '4 min',
    hasPage: true,
    featured: false,
  },
  {
    slug: 'combien-de-jours-assurance-sortir-fourriere',
    titre: "Sortie de fourrière : combien de jours d'assurance faut-il souscrire ?",
    extrait:
      "Combien de jours d'assurance pour sortir une voiture de la fourrière ? La fiche d'immobilisation fixe le minimum. Attestation immédiate en ligne, dès 1 jour.",
    icone: ParkingSquare,
    categorie: 'Urgence',
    readTime: '4 min',
    hasPage: true,
  },
  {
    slug: 'assurer-vehicule-achete-chez-particulier',
    titre: 'Assurer un véhicule acheté chez un particulier',
    extrait:
      "Vous venez d'acheter un véhicule entre particuliers ? Voici comment rouler assuré dès le premier trajet, sans attendre la carte grise.",
    icone: ShoppingCart,
    categorie: 'Achat véhicule',
    readTime: '5 min',
    hasPage: true,
  },
  {
    slug: 'assurance-temporaire-vehicule-etranger-france',
    titre: "Véhicule ou permis étranger : assurance temporaire en France",
    extrait:
      "Véhicule à plaque étrangère ou retour de l'étranger ? Roulez assuré en France le temps de l'immatriculer. Attestation immédiate, 1 à 90 jours.",
    icone: Car,
    categorie: 'International',
    readTime: '5 min',
    hasPage: true,
  },
  {
    slug: 'preter-emprunter-vehicule',
    titre: 'Prêter ou emprunter un véhicule en toute sécurité',
    extrait:
      "Un ami vous prête sa voiture ou vous lui prêtez la vôtre ? L'assurance temporaire protège le conducteur désigné sans toucher à votre contrat annuel.",
    icone: Users,
    categorie: 'Prêt de véhicule',
    hasPage: false,
  },
  {
    slug: 'convoyage-professionnel-assurance',
    titre: 'Convoyage professionnel : quelle assurance ?',
    extrait:
      "Mandataires, négociants, transporteurs : l'assurance temporaire est la solution pour couvrir chaque véhicule convoyé, sans contrat annuel inutile.",
    icone: Truck,
    categorie: 'Pro & convoyage',
    hasPage: false,
  },
  {
    slug: 'rouler-en-attendant-carte-grise',
    titre: 'Rouler en attendant sa carte grise définitive',
    extrait:
      "Les délais de carte grise s'étirent ? Couvrez-vous pendant la période de transition avec une attestation immédiate, valable dès la souscription.",
    icone: Clock,
    categorie: 'Carte grise',
    hasPage: false,
  },
  {
    slug: 'essayer-vehicule-avant-achat',
    titre: 'Essayer un véhicule avant achat, bien assuré',
    extrait:
      "Avant de signer, vous voulez l'essayer sur route ? Une assurance d'un jour suffit pour couvrir le test dans les règles.",
    icone: FileText,
    categorie: 'Essai & achat',
    hasPage: false,
  },
];
