import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import { fadeUp, stagger } from '../animations';
import AccordionItem from '../components/ui/AccordionItem';
import { jsonLd } from '../lib/seo';

/* Chaque reponse porte un lien vers la page ou l'article qui detaille le
   sujet (item.link, rendu par AccordionItem sous la reponse) : la FAQ
   irrigue le reste du site. Le schema FAQPage ne reprend que q/a. */
const faqs = [
  {
    q: "Qu'est-ce qu'une assurance temporaire ?",
    a: "Une assurance auto temporaire est une assurance de courte durée de moins de 90 jours avec possibilité de renouvellement. Sa validité est immédiate à 15 minutes près pour répondre aux besoins ponctuels des assurés.",
    link: { href: '/articles/assurance-auto-temporaire-immediate-en-ligne', label: 'Souscrire une assurance temporaire en ligne, pas à pas' },
  },
  {
    q: 'Pourquoi souscrire une assurance temporaire ?',
    a: "De nombreuses situations le justifient : véhicule prêté non assuré entre vos mains, achat d'un véhicule à revendre rapidement, démarche de carte grise, import d'un véhicule étranger, permis étranger.",
    link: { href: '/articles', label: 'Tous nos guides, situation par situation' },
  },
  {
    q: 'Quelles sont les conditions pour souscrire ?',
    a: "Vous devez être particulier ou professionnel, âgé de 20 ans minimum avec un permis de plus de 2 ans. Impossibilité de souscrire en cas de : plus de 2 sinistres matériels responsables sur 36 mois, résiliation pour sinistre sur 5 ans, condamnation pénale au code de la route.",
    link: { href: '/articles/assurance-auto-temporaire-jeune-conducteur', label: "La condition d'âge et de permis en détail" },
  },
  {
    q: 'Que contient ma couverture ?',
    a: 'La couverture comprend la responsabilité civile, la défense recours suite à accident, et une assistance dépannage en cas de panne ou accident, valable partout en Europe.',
    link: { href: '/articles/assurance-temporaire-attestation-immediate', label: 'Ce que vous recevez : Mémo Véhicule Assuré et carte internationale' },
  },
  {
    q: 'Suis-je couvert contre le vol ou le bris de glace ?',
    a: "Non. La couverture ne comprend pas le vol ni le bris de glace. Uniquement la RC, la défense recours et l'assistance dépannage.",
    link: { href: '/articles/prix-assurance-auto-temporaire', label: 'Ce que couvre le tarif fixe, sans frais cachés' },
  },
  {
    q: "Quelles sont les conditions de l'assistance ?",
    a: "Assistance panne ET accident pour les véhicules de moins de 3T5 de moins de 10 ans. Assistance accident UNIQUEMENT pour les véhicules de moins de 3T5 de plus de 10 ans.",
    link: { href: '/carte', label: "Les 34 pays où l'assistance vous suit" },
  },
  {
    q: 'De quels documents ai-je besoin ?',
    a: "Uniquement votre permis de conduire, votre carte grise et votre carte bancaire. Aucun relevé d'information n'est exigé.",
    link: { href: '/articles/assurer-voiture-sans-carte-grise', label: 'Assurer un véhicule sans carte grise à votre nom : les documents acceptés' },
  },
  {
    q: 'Puis-je me rétracter après souscription ?',
    a: "Non. Les contrats RC véhicule ne sont pas éligibles au droit de rétractation prévu par le Code des Assurances.",
    link: { href: '/conditions-generales', label: 'Le détail dans nos conditions générales' },
  },
  {
    q: 'Quels moyens de paiement sont acceptés ?',
    a: "Carte bancaire uniquement. Aucune information bancaire n'est conservée sur le site pour votre sécurité.",
    link: { href: '/tarification', label: 'Obtenir un devis et payer en ligne de façon sécurisée' },
  },
  {
    q: 'Quand reçois-je mon Mémo Véhicule Assuré ?',
    a: "Dès la validation de votre paiement. Depuis avril 2024, la carte verte a été supprimée : votre véhicule est enregistré au Fichier des Véhicules Assurés (FVA), que les forces de l'ordre consultent directement via votre plaque d'immatriculation. Votre contrat comprend votre Mémo Véhicule Assuré (à conserver avec les papiers du véhicule) et votre carte internationale d'assurance automobile, valable dans les 34 pays couverts - les deux disponibles immédiatement en téléchargement.",
    link: { href: '/articles/controle-sans-assurance-risques-amende', label: 'Le FVA lors d’un contrôle routier, expliqué' },
  },
  {
    q: "Quelle est la durée maximum d'assurance ?",
    a: "De 1 à 90 jours, au jour près, avec possibilité de renouvellement.",
    link: { href: '/articles/assurance-auto-temporaire-1-mois', label: '1 semaine ou 1 mois : choisir la bonne durée' },
  },
  {
    q: 'Quelle est la puissance maximale acceptée ?',
    a: "Aucune limite fixée. Au-delà de 25 CV, une étude personnalisée peut être nécessaire. Contactez-nous, nous revenons vers vous sous 24h maximum.",
    link: { href: '/qui-sommes-nous', label: "Contacter l'équipe AssuTempo" },
  },
  {
    q: 'Puis-je payer en plusieurs fois ?',
    a: "Non, le paiement intégral est requis. Nous ne proposons pas de paiement fractionné pour le moment.",
    link: { href: '/articles/prix-assurance-auto-temporaire', label: 'La grille des prix, durée par durée' },
  },
  {
    q: 'Dans quels pays puis-je circuler ?',
    a: "Dans les 34 pays couverts par votre carte internationale d'assurance automobile : Autriche, Belgique, Bulgarie, Chypre, République tchèque, Allemagne, Danemark, Espagne, Estonie, France, Finlande, Grèce, Hongrie, Croatie, Italie, Irlande, Islande, Luxembourg, Lituanie, Lettonie, Malte, Norvège, Pays-Bas, Portugal, Pologne, Roumanie, Suède, Slovaquie, Slovénie, Suisse, Andorre, Bosnie-Herzégovine, Monténégro, Royaume-Uni.",
    link: { href: '/carte', label: 'La carte interactive des 34 pays couverts' },
  },
  {
    q: 'Peut-on souscrire la nuit, le dimanche ou un jour férié ?',
    a: "Oui, par le Guichet de Nuit AssuTempo. La souscription en ligne classique est ouverte du lundi au vendredi de 9h à 21h et le samedi de 9h à 20h. En dehors de ces heures, le Guichet de Nuit prend le relais : vous déposez votre demande avec vos photos, un conseiller prépare votre contrat, et le devis part dans les 30 minutes. Le dimanche, la permanence est assurée toute la journée, et les jours fériés suivent le même régime.",
    link: { href: '/guichet-de-nuit', label: 'Le Guichet de Nuit : assuré de 21h à 9h et le dimanche' },
  },
  {
    q: "Sortie de fourrière tôt le matin : comment obtenir l'attestation avant l'ouverture ?",
    a: "En passant par le Guichet de Nuit, qui reçoit les demandes de 21h à 9h. Vous déposez votre dossier pendant la nuit, avec la photo de votre permis recto verso et de la carte grise, et l'attestation arrive par mail dès le paiement. Vous vous présentez à la fourrière dès l'ouverture, document en main, sans payer une journée de gardiennage supplémentaire.",
    link: { href: '/articles/combien-de-jours-assurance-sortir-fourriere', label: "Combien de jours d'assurance pour sortir de fourrière" },
  },
];


/* FAQPage : reprend mot pour mot les questions/reponses du tableau `faqs`
   ci-dessus, celui-la meme qui alimente l'accordeon affiche. Source unique :
   jamais de contenu invisible dans ce schema. */
const JSONLD_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const JSONLD_BREADCRUMB = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://assutempo.fr' },
    { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://assutempo.fr/faq' },
  ],
};

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <Helmet>
        <title>Assurance Temporaire : Questions Fréquentes (FAQ) | AssuTempo</title>
        <meta name="description" content="Toutes les réponses sur l'assurance temporaire : qui peut souscrire, véhicules couverts, garanties, attestation, relevé d'information. Guide complet AssuTempo." />
        <link rel="canonical" href="https://assutempo.fr/faq" />
        <meta property="og:title" content="Assurance Temporaire : Questions Fréquentes (FAQ) | AssuTempo" />
        <meta property="og:description" content="Toutes les réponses sur l'assurance temporaire : qui peut souscrire, véhicules couverts, garanties, attestation, relevé d'information. Guide complet AssuTempo." />
        <meta property="og:url" content="https://assutempo.fr/faq" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{jsonLd(JSONLD_FAQ)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_BREADCRUMB)}</script>
      </Helmet>
      <section
        style={{
          paddingTop: 160,
          textAlign: 'center',
          background: 'var(--bg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,0.10) 0%, transparent 60%)',
          }}
        />
        <m.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ position: 'relative', padding: '0 24px' }}
        >
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
            QUESTIONS FRÉQUENTES
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 800, color: '#fff', marginBottom: 20, letterSpacing: '-0.03em' }}>
            Toutes vos réponses
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Retrouvez les réponses aux questions les plus fréquentes sur l'assurance temporaire AssuTempo.
          </p>
        </m.div>
      </section>

      <section style={{ background: 'var(--bg)', padding: '80px 24px' }}>
        <m.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: 760, margin: '0 auto' }}
        >
          {faqs.map((item, i) => (
            <m.div key={item.q} variants={fadeUp}>
              <AccordionItem
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </m.div>
          ))}
        </m.div>
      </section>
    </>
  );
}

export default Faq;
