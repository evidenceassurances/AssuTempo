import { FileSignature, CalendarClock, CreditCard, MailCheck } from 'lucide-react';

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Assurance auto temporaire 1 jour : prix, délais et souscription',
    description:
      "Assurance auto temporaire 1 jour : prix indicatif, documents nécessaires et souscription en 5 minutes. Attestation immédiate, RC obligatoire dès la sortie.",
    author: { '@type': 'Organization', name: 'Evidence Assurances' },
    publisher: {
      '@type': 'Organization',
      name: 'AssuTempo',
      logo: { '@type': 'ImageObject', url: 'https://assutempo.fr/logo.png' },
    },
    mainEntityOfPage: 'https://assutempo.fr/articles/assurance-auto-temporaire-1-jour',
    datePublished: '2026-09-03',
    dateModified: '2026-09-03',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://assutempo.fr' },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://assutempo.fr/articles' },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Assurance auto temporaire 1 jour : prix, délais et souscription',
        item: 'https://assutempo.fr/articles/assurance-auto-temporaire-1-jour',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: "Quel est le prix d'une assurance auto temporaire pour 1 jour ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Comptez en général entre 15 et 20 euros chez AssuTempo pour une journée, contre 11 à 25 euros sur le marché selon le véhicule et le profil du conducteur. Le tarif exact s'affiche avant paiement, à l'issue de la simulation en ligne.",
        },
      },
      {
        '@type': 'Question',
        name: "Une assurance de 24 heures suffit-elle vraiment pour respecter la loi ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui. La responsabilité civile obligatoire (article L211-1 du Code des assurances) ne fixe aucune durée minimale : un contrat d'un seul jour couvre légalement un véhicule, du départ à l'échéance choisie.",
        },
      },
      {
        '@type': 'Question',
        name: "Quels documents faut-il pour souscrire en 5 minutes ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Le permis de conduire et la carte grise du véhicule suffisent, ou à défaut le certificat de cession et le numéro VIN pour un véhicule tout juste acheté. Aucun relevé d'information n'est demandé.",
        },
      },
      {
        '@type': 'Question',
        name: "Une assurance auto temporaire 1 jour couvre-t-elle le vol, l'incendie ou le bris de glace ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "La garantie responsabilité civile est incluse d'office et couvre les dommages causés aux tiers. Vol, incendie ou bris de glace relèvent de garanties complémentaires, à vérifier au moment de la simulation selon la formule choisie.",
        },
      },
      {
        '@type': 'Question',
        name: "Peut-on souscrire une assurance 1 jour en pleine nuit ou un dimanche ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Le tunnel de souscription en ligne classique ferme à 21h en semaine et 20h le samedi. En dehors de ces horaires et le dimanche, le Guichet de Nuit AssuTempo prend le relais avec un devis sous 30 minutes.",
        },
      },
      {
        '@type': 'Question',
        name: "Que faire si le besoin dépasse finalement 24 heures ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Il n'existe pas de prolongation automatique d'un contrat déjà souscrit. Le plus simple reste un nouveau devis à la durée exacte, plutôt que d'empiler plusieurs contrats d'un jour.",
        },
      },
    ],
  },
];

export const articleData = {
  slug: 'assurance-auto-temporaire-1-jour',
  seo: {
    title: 'Assurance auto temporaire 1 jour : prix et délais',
    description:
      "Assurance auto temporaire 1 jour : prix indicatif, documents nécessaires et souscription en ligne en 5 minutes. Attestation immédiate.",
    canonical: 'https://assutempo.fr/articles/assurance-auto-temporaire-1-jour',
    jsonLd,
  },
  category: 'Prix & tarifs',
  readTime: '6 min',
  updatedDate: '3 septembre 2026',
  author: 'Evidence Assurances',
  headline: 'Assurance auto temporaire 1 jour : prix, délais et souscription',
  cta: {
    href: '/tarification',
    label: 'Voir mon tarif pour 1 jour',
    title: 'Simulez votre assurance pour la durée exacte de votre besoin.',
    subtitle: "Prix fixe affiché avant paiement, sans relevé d'information.",
    suffix: 'Attestation immédiate.',
  },
  answerCapsule: {
    answer:
      "Une assurance auto temporaire 1 jour couvre un véhicule pendant 24 heures pleines, responsabilité civile obligatoire incluse. Chez AssuTempo, comptez environ 15 à 20 euros, tarif fixe affiché avant paiement. L'attestation, Mémo Véhicule Assuré et carte internationale, arrive par email en 5 minutes après la souscription en ligne.",
    facts: [
      {
        anchor: '15 à 20 €',
        text: "Ordre de prix indicatif chez AssuTempo pour une journée, hors profil à risque aggravé, contre 11 à 25 € en moyenne sur le marché.",
      },
      {
        anchor: 'Aucune durée minimale légale',
        text: "L'article L211-1 du Code des assurances impose la responsabilité civile pour circuler, sans imposer de durée plancher : 1 jour suffit.",
      },
      {
        anchor: '3 septembre 2026',
        text: 'Faits et grille de prix vérifiés à cette date. Le tarif ferme reste toujours celui affiché par la simulation en ligne.',
      },
    ],
    updated: '3 septembre 2026',
  },
  sections: [
    {
      type: 'alert',
      heading: "L'essentiel",
      items: [
        "Une assurance temporaire d'un jour couvre 24 heures pleines, à partir de l'heure indiquée sur le contrat.",
        "Chez AssuTempo, comptez environ 15 à 20 euros, tarif fixe affiché avant paiement.",
        "Permis et carte grise suffisent pour souscrire en ligne, sans relevé d'information.",
        "Aucune prolongation automatique : un besoin plus long se traite avec un nouveau devis, à la durée exacte.",
      ],
    },
    {
      type: 'text',
      heading: "Qu'est-ce qu'une assurance auto temporaire d'un jour ?",
      paragraphs: [
        "C'est un contrat autonome, sans lien avec une assurance annuelle existante ou à venir, qui couvre un véhicule pour une seule journée. La garantie responsabilité civile, seule obligatoire par la loi (article L211-1 du Code des assurances), y est incluse d'office : elle indemnise les dommages causés à un tiers, quelle que soit la durée du contrat souscrit.",
        "La formule vise un besoin ponctuel et borné dans le temps : un trajet isolé, une sortie de fourrière, un essai avant achat, un prêt de véhicule le temps d'un week-end. Rien n'empêche de la renouveler plus tard pour un autre besoin, mais elle ne se prolonge pas d'elle-même.",
      ],
    },
    {
      type: 'table',
      heading: '1 jour, 1 semaine ou 1 mois : comment choisir ?',
      intro:
        "La bonne durée dépend du besoin réel, pas d'un réflexe de prudence. Voici les repères les plus utiles avant la simulation.",
      columns: ['Durée', 'Profil type', 'Ordre de prix chez AssuTempo'],
      rows: [
        ['1 jour', 'Trajet isolé, sortie de fourrière, essai avant achat', '≈ 15 à 20 €, à partir de'],
        ['7 jours', 'Prêt de véhicule, déplacement professionnel court', '≈ 55 à 70 €, à partir de'],
        ['30 jours', "Résiliation récente, achat d'occasion, transition entre deux contrats", '≈ 140 à 170 €, à partir de'],
      ],
      note:
        "Ordres de grandeur indicatifs pour un véhicule courant. Le tarif ferme dépend du véhicule, du profil du conducteur et de la durée exacte, affiché avant paiement à l'issue de la simulation.",
    },
    {
      type: 'text',
      heading: 'Combien coûte une assurance auto temporaire pour 1 jour ?',
      paragraphs: [
        "Comptez généralement entre 15 et 20 euros chez AssuTempo, contre une fourchette de 11 à 25 euros observée sur le marché français selon le véhicule et le profil du conducteur. Le prix à la journée reste plus élevé que sur une formule longue : les frais fixes d'ouverture du contrat, vérification du profil, édition de l'attestation, se répartissent sur un seul jour au lieu d'une semaine ou d'un mois.",
        "Le tarif dépend surtout de trois éléments : le véhicule (puissance, valeur), l'ancienneté du permis du conducteur, et d'éventuels antécédents récents comme une résiliation. Chez AssuTempo, ce montant s'affiche avant paiement et ne bouge plus une fois la simulation validée.",
      ],
      relatedLink: { text: 'Voir la grille de prix complète, de 1 à 90 jours', href: '/articles/prix-assurance-auto-temporaire' },
    },
    {
      type: 'text',
      heading: '24 heures pleines ou jour calendaire : une nuance à connaître',
      paragraphs: [
        "Un point surprend souvent les nouveaux souscripteurs : « 1 jour » ne signifie pas forcément minuit à minuit. La garantie prend effet à l'heure indiquée sur le contrat, en général celle du paiement, et court pour la durée choisie à partir de ce moment précis. Souscrire à 14h pour 1 jour couvre donc jusqu'au lendemain 14h, pas jusqu'à minuit le soir même.",
        "Cette précision compte pour caler une sortie de fourrière tôt le matin ou un trajet retour après un achat en fin de journée : mieux vaut lancer la simulation juste avant de prendre la route plutôt qu'anticiper la veille, sous peine de voir la garantie expirer avant la fin réelle du besoin.",
      ],
    },
    {
      type: 'checklist',
      heading: 'Quels documents pour souscrire en ligne ?',
      items: [
        'Le permis de conduire du conducteur, valide depuis plus de 2 ans',
        'La carte grise du véhicule, à son nom',
        "À défaut de carte grise à son nom : le certificat de cession (Cerfa 15776) ou le numéro VIN",
        'Un moyen de paiement par carte bancaire',
      ],
      note: "Aucun relevé d'information ni questionnaire bonus-malus n'est demandé pour une formule temporaire.",
      relatedLink: { text: "Assurer un véhicule sans carte grise à son nom", href: '/carte-grise' },
    },
    {
      type: 'stepflow',
      ariaLabel: "Souscrire une assurance temporaire 1 jour en quatre étapes",
      steps: [
        { icon: CalendarClock, label: 'Choisissez 1 jour (ou toute durée jusqu\'à 90 j)' },
        { icon: FileSignature, label: 'Renseignez le véhicule et le conducteur' },
        { icon: CreditCard, label: 'Payez en ligne' },
        { icon: MailCheck, label: "Recevez l'attestation (5 min)" },
      ],
    },
    {
      type: 'text',
      heading: 'Dans quelles situations une seule journée suffit-elle ?',
      paragraphs: [
        "La sortie de fourrière arrive en tête des besoins d'un jour : la fiche d'immobilisation ne fixe aucune durée minimale, une attestation valide le jour de la récupération suffit à faire lever la mesure. Le trajet retour après un achat entre particuliers relève de la même logique : aucun délai de grâce, le véhicule doit être assuré dès la sortie du parking, souvent pour la seule journée du transfert.",
        "Un contrôle technique à faire passer, un essai avant achat chez un particulier, un dépannage ponctuel : autant de situations qui ne justifient ni un contrat annuel ni même une semaine complète. La formule d'un jour évite de payer une marge de sécurité inutile.",
      ],
      relatedLink: { text: "Sortie de fourrière : combien de jours d'assurance faut-il ?", href: '/articles/combien-de-jours-assurance-sortir-fourriere' },
    },
    {
      type: 'callout',
      title: "L'attestation compte, pas le fichier",
      icon: 'navigation',
      text: "Dès le paiement, le Mémo Véhicule Assuré et la carte internationale d'assurance arrivent par email et font foi en contrôle routier. L'assureur alimente ensuite le Fichier des Véhicules Assurés (FVA) sous 72 heures maximum : ce délai administratif ne retarde jamais le début de votre garantie.",
    },
    {
      type: 'text',
      heading: 'Peut-on souscrire une assurance 1 jour en pleine nuit ou un dimanche ?',
      paragraphs: [
        "Le tunnel de souscription en ligne classique ferme à 21h en semaine et 20h le samedi, comme la plupart des assureurs du marché. En dehors de ces horaires, et le dimanche sans interruption, le Guichet de Nuit AssuTempo prend le relais : un devis préparé sous 30 minutes, attestation par email dès le paiement, pour un besoin d'un jour qui ne peut pas attendre l'ouverture du lendemain.",
      ],
      relatedLink: { text: "Le Guichet de Nuit, 21h à 9h et le dimanche", href: '/guichet-de-nuit' },
    },
    {
      type: 'text',
      heading: 'Et si le besoin dépasse finalement 24 heures ?',
      paragraphs: [
        "Il n'existe pas de prolongation automatique d'un contrat déjà souscrit. Si la situation s'éternise, un déménagement qui prend deux jours au lieu d'un, par exemple, le plus simple reste un nouveau devis à la durée exacte plutôt que d'empiler deux contrats d'un jour, ce qui reviendrait plus cher que d'anticiper la bonne durée dès la simulation.",
      ],
      relatedLink: { text: 'Assurance temporaire 1 semaine ou 1 mois : laquelle choisir ?', href: '/articles/assurance-auto-temporaire-1-mois' },
    },
  ],
  faqItems: [
    {
      q: "Quel est le prix d'une assurance auto temporaire pour 1 jour ?",
      a: "Comptez en général entre 15 et 20 euros chez AssuTempo pour une journée, contre 11 à 25 euros sur le marché selon le véhicule et le profil du conducteur. Le tarif exact s'affiche avant paiement, à l'issue de la simulation en ligne.",
    },
    {
      q: 'Une assurance de 24 heures suffit-elle vraiment pour respecter la loi ?',
      a: "Oui. La responsabilité civile obligatoire (article L211-1 du Code des assurances) ne fixe aucune durée minimale : un contrat d'un seul jour couvre légalement un véhicule, du départ à l'échéance choisie.",
    },
    {
      q: 'Quels documents faut-il pour souscrire en 5 minutes ?',
      a: "Le permis de conduire et la carte grise du véhicule suffisent, ou à défaut le certificat de cession et le numéro VIN pour un véhicule tout juste acheté. Aucun relevé d'information n'est demandé.",
    },
    {
      q: "Une assurance auto temporaire 1 jour couvre-t-elle le vol, l'incendie ou le bris de glace ?",
      a: "La garantie responsabilité civile est incluse d'office et couvre les dommages causés aux tiers. Vol, incendie ou bris de glace relèvent de garanties complémentaires, à vérifier au moment de la simulation selon la formule choisie.",
    },
    {
      q: 'Peut-on souscrire une assurance 1 jour en pleine nuit ou un dimanche ?',
      a: "Le tunnel de souscription en ligne classique ferme à 21h en semaine et 20h le samedi. En dehors de ces horaires et le dimanche, le Guichet de Nuit AssuTempo prend le relais avec un devis sous 30 minutes.",
    },
    {
      q: 'Que faire si le besoin dépasse finalement 24 heures ?',
      a: "Il n'existe pas de prolongation automatique d'un contrat déjà souscrit. Le plus simple reste un nouveau devis à la durée exacte, plutôt que d'empiler plusieurs contrats d'un jour.",
    },
  ],
};
