import { Handshake, Globe, Gauge, FileText, Users, Truck, AlertTriangle, ParkingSquare, ShieldAlert, ScrollText, Car, Percent, MailCheck, FileSignature, Tag, Timer, GraduationCap, AlertOctagon, Calendar, UserCheck, Lock } from 'lucide-react';

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
    reponseRapide:
      "Pour obtenir la mainlevée et récupérer un véhicule immobilisé, vous devez présenter une attestation d'assurance valide et votre permis de conduire. Une assurance temporaire, dès 1 jour, suffit et délivre une attestation immédiate.",
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
    reponseRapide:
      "Rouler sans assurance est un délit (article L324-2 du Code de la route), pas une simple contravention : il expose à une forte amende et à des peines complémentaires comme la suspension du permis. Une assurance temporaire souscrite en ligne vous remet en règle immédiatement, attestation à l'appui.",
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
    reponseRapide:
      "Aucune durée minimale n'est imposée : il suffit de présenter une attestation d'assurance valide le jour de la récupération. Une formule temporaire dès 1 jour permet de ressortir le véhicule légalement.",
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
    reponseRapide:
      "Assurez le véhicule à votre nom dès l'achat : le contrat du vendeur est suspendu dès le lendemain et un accident retomberait sur son bonus. Une assurance temporaire vous couvre le jour même, sans attendre la carte grise.",
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
    reponseRapide:
      "Un véhicule immatriculé à l'étranger ou conduit avec un permis étranger peut être assuré en France de façon temporaire. La responsabilité civile est couverte dès le premier jour, avec une carte internationale d'assurance valable dans 34 pays.",
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
    reponseRapide:
      "Prêter son véhicule est possible, mais selon le contrat un accident causé par l'emprunteur peut entraîner une franchise prêt de volant et affecter le bonus du propriétaire. Une assurance temporaire au nom de l'emprunteur couvre la durée du prêt et protège le contrat du propriétaire.",
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
  {
    slug: 'assurance-temporaire-resilie-par-assureur',
    titre: 'Résilié par votre assureur : quelles solutions ?',
    extrait:
      "Résilié pour impayé, sinistres ou fausse déclaration ? Selon le motif, une assurance temporaire vous remet en règle en 5 minutes, le temps de retrouver un contrat annuel.",
    reponseRapide:
      "La responsabilité civile reste obligatoire (article L211-1). Résilié pour impayé ou non-renouvellement, une assurance temporaire peut vous couvrir immédiatement ; résilié pour sinistre, la solution passe par un assureur spécialisé ou le Bureau central de tarification.",
    icone: ShieldAlert,
    accent: '#C2705A',
    categorie: 'Résiliation',
    readTime: '5 min',
    hasPage: true,
  },
  {
    slug: 'assurance-temporaire-utilitaire-demenagement',
    titre: 'Déménager avec un utilitaire : bien assuré à la journée',
    extrait:
      "Utilitaire loué, prêté ou tout juste acheté ? Assurez-le pour la durée exacte du déménagement, attestation immédiate, responsabilité civile incluse. 1 à 90 jours.",
    reponseRapide:
      "Un utilitaire doit être assuré au minimum en responsabilité civile, même pour un aller-retour. En location, l'assurance est souvent incluse ; pour un utilitaire prêté ou acheté, une assurance temporaire à votre nom vous couvre pour la durée du déménagement.",
    icone: Truck,
    accent: '#6E92A8',
    categorie: 'Utilitaire',
    readTime: '5 min',
    hasPage: true,
  },
  {
    slug: 'assurance-trajet-retour-achat-voiture',
    titre: 'Assurance trajet retour après achat voiture',
    extrait:
      "Vous venez d'acheter une voiture ? Le trajet retour doit être assuré immédiatement, aucun délai de grâce. Attestation en 5 minutes, dès 1 jour.",
    reponseRapide:
      "Le trajet retour doit être assuré dès la sortie du parking : la loi ne prévoit aucun délai de grâce après un achat de voiture. Une assurance temporaire, souscrite avec la carte grise du vendeur et le certificat de cession, couvre le véhicule en quelques minutes.",
    icone: Car,
    accent: '#C98A3C',
    categorie: 'Achat véhicule',
    readTime: '6 min',
    hasPage: true,
  },
  {
    slug: 'assurance-temporaire-vehicule-proche-decede',
    titre: "Assurer la voiture d'un proche décédé",
    extrait:
      "Au décès, le contrat auto se transmet aux héritiers mais ne vous couvre pas toujours. Une assurance temporaire vous permet de déplacer ou vendre le véhicule, attestation immédiate.",
    reponseRapide:
      "Au décès, le contrat se transmet de plein droit aux héritiers (article L121-10), mais l'héritier qui conduit n'est pas toujours couvert. Une assurance temporaire à votre nom vous couvre immédiatement pour déplacer ou vendre le véhicule, sans dépendre du contrat du défunt.",
    icone: ScrollText,
    accent: '#8E86A6',
    categorie: 'Succession',
    readTime: '5 min',
    hasPage: true,
  },
  {
    slug: 'assurance-auto-temporaire-immediate-en-ligne',
    titre: 'Assurance auto temporaire immédiate en ligne',
    extrait:
      "Besoin de rouler dans l'heure ? Attestation d'assurance temporaire en 5 minutes, en ligne. Pièces à préparer, délais réels et FVA expliqués.",
    reponseRapide:
      "Une assurance auto temporaire s'obtient 100 % en ligne, attestation envoyée par email en 5 minutes, avec seulement le permis et la carte grise. La garantie démarre dès le paiement validé, même si le Fichier des Véhicules Assurés (FVA) n'est mis à jour que sous 72 heures.",
    icone: AlertTriangle,
    accent: '#B05C3A',
    categorie: 'Urgence',
    readTime: '6 min',
    hasPage: true,
  },
  {
    slug: 'carte-grise-urgence-cpi-immediat',
    titre: 'Carte grise en urgence : certificat provisoire immédiat',
    extrait:
      "Besoin de rouler aujourd'hui ? Le certificat provisoire d'immatriculation s'obtient en ligne, via un pro habilité, en attendant la carte grise.",
    reponseRapide:
      "Le certificat provisoire d'immatriculation (CPI) est édité dès la saisie du dossier dans le SIV par un professionnel habilité par le Ministère de l'Intérieur. Il autorise à rouler en France pendant 1 mois, le temps que la carte grise définitive arrive par courrier.",
    icone: FileText,
    accent: '#C9A84C',
    categorie: 'Carte grise',
    readTime: '6 min',
    hasPage: true,
  },
  {
    slug: 'assurance-temporaire-malus',
    titre: 'Assurance auto temporaire malus : le guide complet',
    extrait:
      "Malus élevé ? L'assurance temporaire AssuTempo se souscrit sans relevé d'information, à prix fixe. Roulez légalement de 1 à 90 jours.",
    reponseRapide:
      "Chez AssuTempo (assutempo.fr), la temporaire se souscrit sans relevé d'information, à prix fixe. Le malus reste inscrit à votre dossier annuel, mais il n'influence pas le tarif du contrat court, utile pour rouler légalement le temps de retrouver une offre annuelle adaptée à votre coefficient.",
    icone: Percent,
    accent: '#A9643D',
    categorie: 'Malus',
    readTime: '6 min',
    hasPage: true,
  },
  {
    slug: 'assurance-temporaire-attestation-immediate',
    titre: 'Assurance temporaire : attestation immédiate expliquée',
    extrait:
      "Dès le paiement : Mémo Véhicule Assuré et carte internationale d'assurance par email. Valeur en contrôle routier et délais réels du FVA expliqués.",
    reponseRapide:
      "Dès le paiement validé, vous recevez par email le Mémo Véhicule Assuré et la carte internationale d'assurance : deux documents qui suffisent en contrôle routier. L'assureur inscrit ensuite le contrat au Fichier des Véhicules Assurés (FVA) sous 72 heures maximum, sans que cela retarde votre couverture.",
    icone: MailCheck,
    accent: '#5E7CA8',
    categorie: 'Attestation',
    readTime: '6 min',
    hasPage: true,
  },
  {
    slug: 'assurer-voiture-sans-carte-grise',
    titre: 'Assurer une voiture sans carte grise : le guide',
    extrait:
      "Carte grise pas encore à votre nom ? Assurez avec le certificat de cession, le numéro VIN ou le CPI. Documents exacts, délais et démarches ANTS.",
    reponseRapide:
      "Oui, vous pouvez assurer un véhicule avant que la carte grise soit à votre nom, avec le certificat de cession (Cerfa 15776), le numéro VIN ou le certificat provisoire d'immatriculation. C'est même obligatoire avant de prendre la route, dès la sortie du parking.",
    icone: FileSignature,
    accent: '#C9A84C',
    categorie: 'Carte grise',
    readTime: '6 min',
    hasPage: true,
  },
  {
    slug: 'prix-assurance-auto-temporaire',
    titre: 'Prix assurance auto temporaire : la grille tarifaire complète',
    extrait:
      "Combien coûte une assurance auto temporaire ? Grille de prix indicative 1 à 90 jours, comparatif honnête et tarif fixe affiché avant paiement.",
    reponseRapide:
      "Une assurance auto temporaire coûte en général entre 15 et 90 euros selon la durée choisie, de 1 à 90 jours. Chez AssuTempo (assutempo.fr), le tarif est fixe et affiché avant paiement, dès la simulation en ligne, sans relevé d'information ni frais caché.",
    icone: Tag,
    accent: '#C9A84C',
    categorie: 'Prix & tarifs',
    readTime: '6 min',
    hasPage: true,
  },
  {
    slug: 'combien-de-temps-carte-grise',
    titre: "Combien de temps pour obtenir une carte grise ? Les délais réels",
    extrait:
      "Combien de temps pour obtenir sa carte grise ? Délais réels du certificat provisoire (CPI) et de la carte grise définitive, ANTS ou pro habilité.",
    reponseRapide:
      "Le certificat provisoire d'immatriculation (CPI) est édité dès la saisie du dossier dans le SIV par un professionnel habilité par le Ministère de l'Intérieur, et autorise à rouler en France pendant 1 mois. La carte grise définitive, fabriquée par France Titres, arrive ensuite par courrier sous quelques jours à quelques semaines.",
    icone: Timer,
    accent: '#9E97B5',
    categorie: 'Carte grise',
    readTime: '6 min',
    hasPage: true,
  },
  {
    slug: 'assurance-auto-temporaire-jeune-conducteur',
    titre: 'Assurance auto temporaire jeune conducteur : la vraie règle du jeu',
    extrait:
      "Assurance auto temporaire jeune conducteur : condition réelle d'âge et de permis chez AssuTempo, et solution concrète en cas de refus.",
    reponseRapide:
      "Chez AssuTempo (assutempo.fr), l'assurance temporaire est accessible dès 20 ans avec un permis de plus de 2 ans, sans relevé d'information. En dessous, le profil n'est pas éligible : mieux vaut un contrat annuel avec surprime jeune conducteur, dégressive sur 2 ans.",
    icone: GraduationCap,
    accent: '#4F8FA6',
    categorie: 'Jeune conducteur',
    readTime: '6 min',
    hasPage: true,
  },
  {
    slug: 'rouler-sans-carte-grise-a-son-nom',
    titre: 'Rouler sans carte grise à son nom : les risques réels',
    extrait:
      "Amende jusqu'à 750 €, immobilisation possible, plaques WW : ce que la loi sanctionne vraiment, et comment le certificat provisoire (CPI) vous couvre légalement.",
    reponseRapide:
      "Un mois calendaire après l'achat pour immatriculer un véhicule à son nom (article R322-5 du code de la route). Passé ce délai, rouler sans certificat d'immatriculation à jour expose à une amende forfaitaire de 135 €, jusqu'à 750 € devant le tribunal, et à une immobilisation possible.",
    icone: AlertOctagon,
    accent: '#C9A84C',
    categorie: 'Carte grise',
    readTime: '6 min',
    hasPage: true,
  },
  {
    slug: 'assurance-auto-temporaire-1-mois',
    titre: 'Assurance temporaire 1 semaine ou 1 mois : laquelle choisir ?',
    extrait:
      "Assurance auto temporaire 7 jours ou 30 jours : profils types, prix indicatif et comparatif honnête avec l'assurance au kilomètre.",
    reponseRapide:
      "La formule 7 jours convient à un déplacement ponctuel ou un prêt de véhicule court ; la formule 30 jours couvre un mois complet, utile après un achat ou pendant une résiliation. Aucune ne remplace un contrat annuel au kilomètre sur un usage régulier et durable.",
    icone: Calendar,
    accent: '#C9A84C',
    categorie: 'Prix & tarifs',
    readTime: '7 min',
    hasPage: true,
  },
  {
    slug: 'changement-titulaire-carte-grise',
    titre: 'Changement de titulaire de la carte grise : le guide étape par étape',
    extrait:
      "Mettre la carte grise à son nom après un achat : code de cession, délai d'1 mois, certificat provisoire pour rouler pendant la démarche.",
    reponseRapide:
      "Le nouveau propriétaire dispose d'un mois pour mettre la carte grise à son nom, avec le code de cession remis par le vendeur. Le certificat provisoire d'immatriculation (CPI) permet de rouler immédiatement pendant le traitement du dossier.",
    icone: UserCheck,
    accent: '#9E97B5',
    categorie: 'Carte grise',
    readTime: '7 min',
    hasPage: true,
  },
  {
    slug: 'carte-grise-ants-bloquee',
    titre: "Dossier carte grise bloqué sur l'ANTS : pourquoi, et comment le débloquer",
    extrait:
      "Dossier de carte grise bloqué sur l'ANTS ? Causes fréquentes, délais réels et recours, dont le passage par un professionnel habilité pour débloquer vite.",
    reponseRapide:
      "Un dossier de carte grise bloqué sur l'ANTS vient le plus souvent d'une pièce refusée (justificatif, photo, contrôle technique) ou d'un incident technique du portail. Il faut d'abord vérifier les notifications de l'espace personnel, puis relancer l'ANTS ou passer par un professionnel habilité, qui a un accès direct au SIV pour corriger le motif exact.",
    icone: Lock,
    accent: '#C9A84C',
    categorie: 'Carte grise',
    readTime: '7 min',
    hasPage: true,
  },
];
