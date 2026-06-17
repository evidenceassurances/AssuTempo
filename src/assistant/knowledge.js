/**
 * Base de connaissances de l'assistant Assutempo (« Tempo »).
 *
 * SOURCE DE VERITE : le contenu reel du site (FAQ /faq, pages Tarification,
 * Carte grise, International, Qui sommes-nous, articles). Ce fichier a ete
 * verifie et corrige a partir du depot (juin 2026). Les points encore
 * incertains sont marques 〔A CONFIRMER〕.
 *
 * Edition : modifier directement la chaine ci-dessous. Elle est concatenee au
 * prompt systeme cote serveur (api/chat.js) ; l'assistant ne doit repondre
 * QU'A PARTIR de ces informations. Aucun fait ne doit etre invente.
 *
 * Sources verifiees dans le depot :
 *   - src/data/siteConfig.js (FAQ d'accueil, pays, formules)
 *   - src/pages/Faq.jsx (FAQ /faq, source la plus detaillee)
 *   - src/pages/AssuranceInternationale.jsx (34 pays + destinations sur demande,
 *     exclusions de residence et d'antecedents)
 *   - src/pages/CarteGrise.jsx (service carte grise)
 *   - src/pages/About.jsx (programme partenaires B2B)
 *   - src/components/VehicleMarquee.jsx (types de vehicules affiches)
 *
 * Format CommonJS (module.exports) : ce fichier est charge par la fonction
 * serverless api/chat.js (runtime Node CommonJS). Il n'est jamais envoye au
 * client (la base reste cote serveur).
 */
const KNOWLEDGE = `# Base de connaissances Assutempo

## Presentation
Assutempo : assurance auto temporaire et carte grise, 100 % en ligne. Opere par Evidence Assurances (cabinet de courtage), souscription via un partenaire assureur. Demarche simple, souscription en moins de 5 minutes, attestation a validite immediate (a 15 minutes pres). Portail accessible 24h/24, 7j/7.

## Duree et engagement
- Couverture de 1 a 90 jours, au jour pres, selon le besoin, avec possibilite de renouvellement.
- Sans engagement, aucun contrat annuel impose, aucune reconduction ni prelevement ulterieur.
- Le client choisit la date et l'heure de debut de couverture.

## Zone geographique : 34 pays (zone carte verte), couverts des le 1er jour
Allemagne, Andorre, Autriche, Belgique, Bosnie-Herzegovine, Bulgarie, Chypre, Croatie, Danemark, Espagne, Estonie, Finlande, France, Grece, Hongrie, Irlande, Islande, Italie, Lettonie, Lituanie, Luxembourg, Malte, Montenegro, Norvege, Pays-Bas, Pologne, Portugal, Republique tcheque, Roumanie, Royaume-Uni, Slovaquie, Slovenie, Suede, Suisse.

## Destinations sur demande (hors zone carte verte)
Devis sur mesure envoye sous 12h, accompagnement jusqu'a la souscription. Reserve aux voitures et aux poids lourds.
Pays : Albanie, Azerbaidjan, Macedoine du Nord, Maroc, Moldavie, Tunisie, Turquie.

## Garanties (couverture)
Incluses des le 1er jour, dans les 34 pays :
- Responsabilite civile (dommages corporels et materiels causes aux tiers).
- Defense-recours suite a accident.
- Assistance depannage.
Conditions de l'assistance : panne ET accident pour les vehicules de moins de 3,5 tonnes et de moins de 10 ans ; assistance accident UNIQUEMENT pour les vehicules de moins de 3,5 tonnes et de plus de 10 ans. L'assistance depannage comporte une franchise kilometrique de 50 km (variable selon le vehicule).
NON couverts par la formule temporaire : le vol et le bris de glace ne sont PAS inclus.
Aucune option de garantie supplementaire : la couverture se limite a la RC, la defense-recours et l'assistance depannage (pas de garantie dommages du conducteur).

## Vehicules
Large eventail de vehicules accepte (d'apres le site) : voiture, berline, sportive, utilitaire, minibus, camping-car, 4x4, pick-up, poids lourd, tracteur, autocar, semi-remorque, caravane, quad.
Puissance : aucune limite fixee ; au-dela de 25 CV, une etude personnalisee peut etre necessaire (reponse sous 24h maximum). Contacter l'equipe le cas echeant.
Exclusions : les deux-roues (motos, scooters) ne sont PAS assurables ; les vehicules de location ne sont PAS eligibles. Il n'y a pas de valeur maximale du vehicule, mais au-dela d'un certain prix, des photos du vehicule peuvent etre demandees.

## Eligibilite du conducteur (repondre avec precision, sans minimiser une condition)
- Profil : particulier ou professionnel.
- Age minimum : 20 ans. A 18 ou 19 ans, la souscription n'est PAS possible.
- Permis : permis de conduire en cours de validite, avec plus de 2 ans d'anciennete.
- Residence : la souscription n'est PAS possible si le conducteur reside en Corse, a Monaco ou en France d'Outre-mer.
- Antecedents : impossibilite de souscrire en cas de
  - plus de 2 sinistres materiels responsables sur 36 mois,
  - resiliation pour sinistre au cours des 5 dernieres annees,
  - condamnation penale au code de la route,
  - condamnation pour delit de fuite, suspension ou annulation de permis au cours des 24 derniers mois.
- Permis etranger : la plupart des pays du monde sont pris en charge. La regle d'anciennete reste la reference : permis de plus de 2 ans requis (un permis de moins de 2 ans n'est pas eligible).

## Documents necessaires
- Permis de conduire valide.
- Carte grise du vehicule (ou carte grise barree + certificat de vente, ou justificatif d'immobilisation, ou certificat d'immatriculation provisoire, selon la situation).
- Carte bancaire pour le paiement.
- AUCUN releve d'information exige (declaration sur l'honneur des antecedents).

## Apres souscription
- Paiement en ligne securise, par carte bancaire uniquement (aucun paiement en plusieurs fois ; aucune information bancaire conservee sur le site).
- Le client recoit immediatement, en telechargement : le « Memo Vehicule Assure » et la carte internationale d'assurance automobile (valable dans les 34 pays cites).
- Le vehicule est inscrit au FVA (Fichier des Vehicules Assures), consulte par les forces de l'ordre via la plaque.
- Depuis avril 2024, la carte verte papier n'est plus obligatoire ; le justificatif est le Memo Vehicule Assure + l'inscription au FVA.

## Tarification
- Prix fixe, affiche clairement des le devis, aucun frais cache.
- Le tarif depend du vehicule, de la duree et du profil.
- Ne JAMAIS annoncer de prix ferme : toujours orienter vers le devis en ligne.

## Retractation
- Pas de droit de retractation une fois le contrat active (les contrats RC vehicule ne sont pas eligibles au droit de retractation prevu par le Code des assurances). Primes non remboursables.

## Carte grise (service distinct)
- Demarche d'immatriculation 100 % en ligne, habilitee par le Ministere de l'Interieur, via un partenaire agree (France Titres / Certimat).
- Certificat provisoire immediat, carte grise livree a domicile, CERFA preremplis et signature electronique, paiement des taxes possible en plusieurs fois.

## Process de souscription
1) Choisir la duree. 2) Renseigner le vehicule. 3) Renseigner le conducteur et les coordonnees. 4) Verification du dossier par l'equipe. 5) Lien de paiement. 6) Signature, puis attestation immediate.

## Professionnels / partenaires (B2B)
Programme partenaires (agences carte grise, garages, concessionnaires, mandataires, loueurs, import-export, controle technique, auto-ecoles...) : devis en quelques minutes, attestation immediate remise au client, commission versee par virement chaque mois.

## Contact
Telephone : 09 74 19 78 20 (Lun-Ven 9h-21h, Sam 9h-20h). Portail accessible 24h/24, 7j/7.`;

module.exports = { KNOWLEDGE };
