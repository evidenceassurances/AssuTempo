import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const items = [
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
  },
  {
    q: "Faut-il un relevé d'information ?",
    a: "Non, aucun relevé d'information n'est exigé pour souscrire.",
  },
  {
    q: 'Puis-je prêter mon véhicule pendant le contrat ?',
    a: 'Non, vous êtes conducteur exclusif pendant toute la durée du contrat.',
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div
      style={{
        background: isOpen ? 'rgba(255,255,255,0.04)' : 'var(--bg-card)',
        border: `1px solid ${isOpen ? 'var(--gold-border)' : 'var(--glass-border)'}`,
        borderRadius: 14,
        marginBottom: 12,
        overflow: 'hidden',
        transition: 'border-color 0.3s, background 0.3s',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '20px 24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--text)',
          fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-0.01em' }}>
          {item.q}
        </span>
        <m.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ flexShrink: 0, color: isOpen ? 'var(--gold)' : 'var(--text-muted)' }}
        >
          <ChevronDown size={20} />
        </m.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p
              style={{
                margin: 0,
                padding: '0 24px 20px',
                fontSize: 15,
                color: 'var(--text-muted)',
                lineHeight: 1.65,
              }}
            >
              {item.a}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Faq() {
  const [open, setOpen] = useState(null);
  const [ref, inView] = useScrollReveal();

  return (
    <section style={{ background: 'var(--bg-2)', padding: '100px 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 32px' }}>
        <m.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 14px',
            }}
          >
            Questions fréquentes
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
            Tout ce qu&apos;il faut savoir avant de souscrire.
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {items.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </m.div>
      </div>
    </section>
  );
}

export default Faq;
