import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { fadeUp, stagger } from '../animations';

const faqs = [
  {
    q: "Qu'est-ce qu'une assurance temporaire ?",
    a: "Une assurance auto temporaire est une assurance de courte durée de moins de 90 jours avec possibilité de renouvellement. Sa validité est immédiate à 15 minutes près pour répondre aux besoins ponctuels des assurés.",
  },
  {
    q: 'Pourquoi souscrire une assurance temporaire ?',
    a: "De nombreuses situations le justifient : véhicule prêté non assuré entre vos mains, achat d'un véhicule à revendre rapidement, démarche de carte grise, import d'un véhicule étranger, permis étranger.",
  },
  {
    q: 'Quelles sont les conditions pour souscrire ?',
    a: "Vous devez être particulier ou professionnel, âgé de 20 ans minimum avec un permis de plus de 2 ans. Impossibilité de souscrire en cas de : plus de 2 sinistres matériels responsables sur 36 mois, résiliation pour sinistre sur 5 ans, condamnation pénale au code de la route.",
  },
  {
    q: 'Que contient ma couverture ?',
    a: 'La couverture comprend la responsabilité civile, la défense recours suite à accident, et une assistance dépannage en cas de panne ou accident, valable partout en Europe.',
  },
  {
    q: 'Suis-je couvert contre le vol ou le bris de glace ?',
    a: "Non. La couverture ne comprend pas le vol ni le bris de glace. Uniquement la RC, la défense recours et l'assistance dépannage.",
  },
  {
    q: "Quelles sont les conditions de l'assistance ?",
    a: "Assistance panne ET accident pour les véhicules de moins de 3T5 de moins de 10 ans. Assistance accident UNIQUEMENT pour les véhicules de moins de 3T5 de plus de 10 ans.",
  },
  {
    q: 'De quels documents ai-je besoin ?',
    a: "Uniquement votre permis de conduire, votre carte grise et votre carte bancaire. Aucun relevé d'information n'est exigé.",
  },
  {
    q: 'Puis-je me rétracter après souscription ?',
    a: "Non. Les contrats RC véhicule ne sont pas éligibles au droit de rétractation prévu par le Code des Assurances.",
  },
  {
    q: 'Quels moyens de paiement sont acceptés ?',
    a: "Carte bancaire uniquement. Aucune information bancaire n'est conservée sur le site pour votre sécurité.",
  },
  {
    q: 'Quand reçois-je mon attestation ?',
    a: "Immédiatement après le paiement, votre carte verte et votre contrat sont disponibles en téléchargement direct.",
  },
  {
    q: "Quelle est la durée maximum d'assurance ?",
    a: "De 1 à 90 jours, au jour près, avec possibilité de renouvellement.",
  },
  {
    q: 'Quelle est la puissance maximale acceptée ?',
    a: "Aucune limite fixée. Au-delà de 25 CV, une étude personnalisée peut être nécessaire. Contactez-nous, nous revenons vers vous sous 24h maximum.",
  },
  {
    q: 'Puis-je payer en plusieurs fois ?',
    a: "Non, le paiement intégral est requis. Nous ne proposons pas de paiement fractionné pour le moment.",
  },
  {
    q: 'Dans quels pays puis-je circuler ?',
    a: "Dans les 34 pays indiqués sur votre carte verte : Autriche, Belgique, Bulgarie, Chypre, République tchèque, Allemagne, Danemark, Espagne, Estonie, France, Finlande, Grèce, Hongrie, Croatie, Italie, Irlande, Islande, Luxembourg, Lituanie, Lettonie, Malte, Norvège, Pays-Bas, Portugal, Pologne, Roumanie, Suède, Slovaquie, Slovénie, Suisse, Andorre, Bosnie-Herzégovine, Monténégro, Royaume-Uni.",
  },
];

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: isOpen ? 'var(--gold)' : '#fff',
          fontSize: 16,
          fontWeight: 500,
          textAlign: 'left',
          transition: 'color 0.2s',
          gap: 16,
          fontFamily: 'inherit',
        }}
      >
        <span>{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ flexShrink: 0 }}
        >
          <ChevronDown size={20} style={{ color: 'var(--gold)' }} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ paddingBottom: 24, fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.75 }}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
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
        <motion.div
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
        </motion.div>
      </section>

      <section style={{ background: 'var(--bg)', padding: '80px 24px' }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: 760, margin: '0 auto' }}
        >
          {faqs.map((item, i) => (
            <motion.div key={item.q} variants={fadeUp}>
              <AccordionItem
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}

export default Faq;
