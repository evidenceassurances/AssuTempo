import { Handshake, Globe, Gauge, FileText, Users, Truck, AlertTriangle, ParkingSquare } from 'lucide-react';

/* Champs optionnels supportes par la page /articles (Centre de reponses).
   Tous additifs : laisser absent ne casse rien, la page applique des replis.
   - reponseRapide (string) : phrase de reponse affichee dans le bloc encadre.
     Si absent, repli automatique sur la 1re phrase de l'extrait.
   - updatedAt (string) : date de mise a jour affichee dans la ligne meta.
     Si absent, la date n'est pas affichee (le temps de lecture et "Verifie" restent).
     TODO Ayoub : renseigner les vraies dates de mise a jour, ex. updatedAt: '12 juin 2026'.
   - featured (boolean) : passe l'article en pilier "A la une".
     Si aucun article n'a featured: true, le 1er article du tableau sert de pilier.
     TODO Ayoub : poser featured: true sur l'article pilier souhaite. */
export const articles = [
  {
    slug: 'voiture-immobilisee-defaut-assurance',
    titre: "Voiture immobilisée pour défaut d'assurance : comment la récupérer",
    extrait:
      "Véhicule immobilisé ou en fourrière pour défaut d'assurance ? Assurez-vous en 5 minutes, attestation immédiate, et récupérez votre voiture légalement.",
    icone: AlertTriangle,
    accent: '#B05C3A',
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
    accent: '#B05C3A',
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
    accent: '#B05C3A',
    categorie: 'Urgence',
    readTime: '4 min',
    hasPage: true,
  },
  {
    slug: 'assurer-vehicule-achete-chez-particulier',
    titre: 'Assurer un véhicule acheté chez un particulier',
    extrait:
      "Vous venez d'acheter un véhicule entre particuliers ? Voici comment rouler assuré dès le premier trajet, sans attendre la carte grise.",
    icone: Handshake,
    accent: '#C98A3C',
    categorie: 'Achat véhicule',
    readTime: '5 min',
    hasPage: true,
  },
  {
    slug: 'assurance-temporaire-vehicule-etranger-france',
    titre: "Véhicule ou permis étranger : assurance temporaire en France",
    extrait:
      "Véhicule à plaque étrangère ou retour de l'étranger ? Roulez assuré en France le temps de l'immatriculer. Attestation immédiate, 1 à 90 jours.",
    icone: Globe,
    accent: '#5E7CA8',
    categorie: 'International',
    readTime: '5 min',
    hasPage: true,
  },
  {
    slug: 'assurance-temporaire-pret-de-vehicule',
    titre: 'Prêter ou emprunter un véhicule en toute sécurité',
    extrait:
      "Un ami vous prête sa voiture ou vous lui prêtez la vôtre ? L'assurance temporaire protège le conducteur désigné sans toucher au bonus-malus du propriétaire.",
    icone: Users,
    accent: '#7E9B79',
    categorie: 'Prêt de véhicule',
    hasPage: true,
  },
  {
    slug: 'assurance-temporaire-convoyage-professionnel',
    titre: 'Convoyage professionnel : quelle assurance ?',
    extrait:
      "Mandataires, négociants, transporteurs : assurez chaque véhicule convoyé (roulant) pour la durée exacte du trajet, sans contrat annuel inutile.",
    icone: Truck,
    accent: '#B0703F',
    categorie: 'Pro & convoyage',
    hasPage: true,
  },
  {
    slug: 'assurance-temporaire-rouler-en-attendant-carte-grise',
    titre: 'Rouler en attendant sa carte grise définitive',
    extrait:
      "Les délais de carte grise s'étirent ? Le CPI vous autorise à rouler 1 mois en France. Couvrez-vous pendant la période de transition avec une attestation immédiate, valable dès la souscription.",
    icone: FileText,
    accent: '#C9A84C',
    categorie: 'Carte grise',
    readTime: '4 min',
    hasPage: true,
  },
  {
    slug: 'assurance-temporaire-essai-vehicule-avant-achat',
    titre: 'Essayer un véhicule avant achat, bien assuré',
    extrait:
      "En concession vous êtes souvent couvert, chez un particulier c'est plus risqué. Une assurance d'un jour sécurise l'essai sans toucher au contrat du vendeur.",
    icone: Gauge,
    accent: '#8A6B9E',
    categorie: 'Essai & achat',
    hasPage: true,
  },
];
