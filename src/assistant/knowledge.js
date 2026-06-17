/**
 * Base de connaissances de l'assistant Assutempo (« Tempo »).
 *
 * SOURCE DE VERITE : le contenu reel du site (FAQ /faq, pages Tarification,
 * Carte grise, International, Qui sommes-nous, articles). Ce fichier a ete
 * verifie et corrige a partir du depot (juin 2026).
 *
 * Edition : modifier directement la chaine ci-dessous. Elle est concatenee au
 * prompt systeme cote serveur (api/chat.js) ; l'assistant ne doit repondre
 * QU'A PARTIR de ces informations. Aucun fait ne doit etre invente.
 *
 * Le texte est redige en francais correct (accents + apostrophes) afin que
 * l'assistant reponde lui-meme dans un francais soigne.
 *
 * Format CommonJS (module.exports) : ce fichier est charge par la fonction
 * serverless api/chat.js (runtime Node CommonJS). Il n'est jamais envoye au
 * client (la base reste cote serveur).
 */
const KNOWLEDGE = `# Base de connaissances Assutempo

## Présentation
Assutempo : assurance auto temporaire et carte grise, 100 % en ligne. Opéré par Evidence Assurances (cabinet de courtage), souscription via un partenaire assureur. Démarche simple, souscription en moins de 5 minutes, attestation à validité immédiate (à 15 minutes près). Portail accessible 24h/24, 7j/7.

## Durée et engagement
- Couverture de 1 à 90 jours, au jour près, selon le besoin, avec possibilité de renouvellement.
- Sans engagement, aucun contrat annuel imposé, aucune reconduction ni prélèvement ultérieur.
- Le client choisit la date et l'heure de début de couverture.

## Zone géographique : 34 pays (zone carte verte), couverts dès le 1er jour
Allemagne, Andorre, Autriche, Belgique, Bosnie-Herzégovine, Bulgarie, Chypre, Croatie, Danemark, Espagne, Estonie, Finlande, France, Grèce, Hongrie, Irlande, Islande, Italie, Lettonie, Lituanie, Luxembourg, Malte, Monténégro, Norvège, Pays-Bas, Pologne, Portugal, République tchèque, Roumanie, Royaume-Uni, Slovaquie, Slovénie, Suède, Suisse.

## International : destinations hors zone carte verte (demande de devis)
Pour ces pays, il ne s'agit pas d'une souscription immédiate mais d'une demande de devis : l'équipe établit une proposition sur mesure envoyée sous 12h, puis accompagne jusqu'à la souscription. Réservé aux voitures et aux poids lourds.
Pays concernés : Albanie, Azerbaïdjan, Macédoine du Nord, Maroc, Moldavie, Tunisie, Turquie.

## Garanties (couverture)
Incluses dès le 1er jour, dans les 34 pays :
- Responsabilité civile (dommages corporels et matériels causés aux tiers).
- Défense-recours suite à accident.
- Assistance dépannage.
Conditions de l'assistance : panne ET accident pour les véhicules de moins de 3,5 tonnes et de moins de 10 ans ; assistance accident UNIQUEMENT pour les véhicules de moins de 3,5 tonnes et de plus de 10 ans. L'assistance dépannage comporte une franchise kilométrique de 50 km (variable selon le véhicule).
NON couverts par la formule temporaire : le vol et le bris de glace ne sont PAS inclus.
Aucune option de garantie supplémentaire : la couverture se limite à la responsabilité civile, la défense-recours et l'assistance dépannage (pas de garantie dommages du conducteur).

## Véhicules
Large éventail de véhicules accepté (d'après le site) : voiture, berline, sportive, utilitaire, minibus, camping-car, 4x4, pick-up, poids lourd, tracteur, autocar, semi-remorque, caravane, quad.
Puissance : aucune limite fixée ; au-delà de 25 CV, une étude personnalisée peut être nécessaire (réponse sous 24h maximum). Contacter l'équipe le cas échéant.
Exclusions : les deux-roues (motos, scooters) ne sont PAS assurables ; les véhicules de location ne sont PAS éligibles. Il n'y a pas de valeur maximale du véhicule, mais au-delà d'un certain prix, des photos du véhicule peuvent être demandées.

## Éligibilité du conducteur (répondre avec précision, sans minimiser une condition)
- Profil : particulier ou professionnel.
- Âge minimum : 20 ans. À 18 ou 19 ans, la souscription n'est PAS possible.
- Permis : permis de conduire en cours de validité, avec plus de 2 ans d'ancienneté.
- Résidence : la souscription n'est PAS possible si le conducteur réside en Corse, à Monaco ou en France d'Outre-mer.
- Antécédents : impossibilité de souscrire en cas de
  - plus de 2 sinistres matériels responsables sur 36 mois,
  - résiliation pour sinistre au cours des 5 dernières années,
  - condamnation pénale au code de la route,
  - condamnation pour délit de fuite, suspension ou annulation de permis au cours des 24 derniers mois.
- Permis étranger : la plupart des pays du monde sont pris en charge. La règle d'ancienneté reste la référence : permis de plus de 2 ans requis (un permis de moins de 2 ans n'est pas éligible).

## Documents nécessaires
- Permis de conduire valide.
- Carte grise du véhicule (ou carte grise barrée + certificat de vente, ou justificatif d'immobilisation, ou certificat d'immatriculation provisoire, selon la situation).
- Carte bancaire pour le paiement.
- AUCUN relevé d'information exigé (déclaration sur l'honneur des antécédents).

## Après souscription
- Paiement en ligne sécurisé, par carte bancaire uniquement (aucun paiement en plusieurs fois ; aucune information bancaire conservée sur le site).
- Le client reçoit immédiatement, en téléchargement : le « Mémo Véhicule Assuré » et la carte internationale d'assurance automobile (valable dans les 34 pays cités).
- Le véhicule est inscrit au FVA (Fichier des Véhicules Assurés), consulté par les forces de l'ordre via la plaque.
- Depuis avril 2024, la carte verte papier n'est plus obligatoire ; le justificatif est le Mémo Véhicule Assuré et l'inscription au FVA.

## Tarification
- Prix fixe, affiché clairement dès le devis, aucun frais caché.
- Le tarif dépend du véhicule, de la durée et du profil.
- Ne JAMAIS annoncer de prix ferme : toujours orienter vers le devis en ligne.

## Rétractation
- Pas de droit de rétractation une fois le contrat activé (les contrats RC véhicule ne sont pas éligibles au droit de rétractation prévu par le Code des assurances). Primes non remboursables.

## Carte grise (service distinct)
- Démarche d'immatriculation 100 % en ligne, habilitée par le Ministère de l'Intérieur, via un partenaire agréé (France Titres / Certimat).
- Certificat provisoire immédiat, carte grise livrée à domicile, CERFA préremplis et signature électronique, paiement des taxes possible en plusieurs fois.

## Process de souscription
1) Choisir la durée. 2) Renseigner le véhicule. 3) Renseigner le conducteur et les coordonnées. 4) Vérification du dossier par l'équipe. 5) Lien de paiement. 6) Signature, puis attestation immédiate.

## Professionnels / partenaires (B2B)
Programme partenaires (agences carte grise, garages, concessionnaires, mandataires, loueurs, import-export, contrôle technique, auto-écoles...) : devis en quelques minutes, attestation immédiate remise au client, commission versée par virement chaque mois.

## Contact
Téléphone : 09 74 19 78 20 (Lun-Ven 9h-21h, Sam 9h-20h). Portail accessible 24h/24, 7j/7.`;

module.exports = { KNOWLEDGE };
