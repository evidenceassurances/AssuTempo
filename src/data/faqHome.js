/* Questions/reponses de la section FAQ de la Home.
   Module de donnees pur (aucun import) : partage entre le rendu
   (components/Faq.jsx, chunk HomeSections) et le schema FAQPage
   (pages/Home.jsx, Helmet). Le JSON-LD doit refleter EXACTEMENT
   ce texte visible : toute modification ici met a jour les deux.
   `link` (optionnel) n'entre PAS dans le schema : c'est un lien de
   maillage interne affiche sous la reponse. */
export const faqHomeItems = [
  {
    q: 'Qui peut souscrire une assurance temporaire ?',
    a: 'Toute personne de 20 ans minimum, titulaire d\'un permis depuis plus de 2 ans. Paiement par carte bancaire uniquement.',
  },
  {
    q: "L'assurance temporaire est-elle sans engagement ?",
    a: "Oui. Contrairement à une assurance auto classique, qui est un contrat annuel reconduit tacitement et impose un engagement minimal d'un an, l'assurance temporaire est un contrat à durée déterminée. Elle couvre uniquement la période choisie, de 1 à 90 jours, puis prend fin automatiquement, sans reconduction ni démarche de résiliation. Aucun engagement dans le temps et aucun prélèvement ultérieur.",
  },
  {
    q: 'Quels véhicules sont assurés ?',
    a: 'Voitures, utilitaires, camping-cars, camions, tracteurs, remorques et plus. Pour tout type de véhicule, contactez-nous.',
  },
  {
    q: 'Que contient ma couverture ?',
    a: 'Responsabilité civile, défense recours suite à accident et assistance dépannage. Le vol et le bris de glace ne sont pas couverts.',
  },
  {
    q: 'Quand vais-je recevoir mon attestation et mon Mémo Véhicule Assuré ?',
    a: "Dès la validation de votre paiement. Depuis avril 2024, la carte verte a été supprimée : votre véhicule est enregistré au Fichier des Véhicules Assurés (FVA), que les forces de l'ordre consultent directement via votre plaque d'immatriculation. Votre contrat comprend votre Mémo Véhicule Assuré (à conserver avec les papiers du véhicule) et votre carte internationale d'assurance automobile, valable dans les 34 pays couverts - les deux disponibles immédiatement en téléchargement.",
    link: { href: '/articles/assurance-temporaire-attestation-immediate', label: "L'attestation immédiate expliquée en détail" },
  },
  {
    q: "Faut-il un relevé d'information ?",
    a: "Non, aucun relevé d'information n'est exigé pour souscrire.",
  },
  {
    q: 'Puis-je prêter mon véhicule pendant le contrat ?',
    a: 'Non, vous êtes conducteur exclusif pendant toute la durée du contrat.',
  },
  {
    q: 'Peut-on souscrire la nuit, le dimanche ou un jour férié ?',
    a: "Oui, par le Guichet de Nuit AssuTempo. La souscription en ligne classique est ouverte du lundi au vendredi de 9h à 21h et le samedi de 9h à 20h. En dehors de ces heures, le Guichet de Nuit prend le relais : vous déposez votre demande avec vos photos, un conseiller prépare votre contrat, et le devis part dans les 30 minutes. Le dimanche, la permanence est assurée toute la journée.",
    link: { href: '/guichet-de-nuit', label: 'Découvrir le Guichet de Nuit' },
  },
];
