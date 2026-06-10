import { m } from 'framer-motion';
import { Zap, Shield, Clock } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const cards = [
  {
    Icon: Zap,
    title: 'Prix fixe, zéro surprise',
    body: 'Un tarif clair affiché dès le devis. Aucun frais caché, aucune surprise à la facturation.',
  },
  {
    Icon: Shield,
    title: 'Assistance Europe incluse',
    body: 'Responsabilité civile, défense recours et assistance dépannage dès le premier jour, dans 34 pays.',
  },
  {
    Icon: Clock,
    title: 'Attestation en 5 minutes',
    body: 'Souscription 100% en ligne. Votre attestation arrive immédiatement par email, prête à présenter.',
  },
];

function AdvantageCard({ Icon, title, body, delay, inView }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: 1,
        padding: 32,
        background: 'var(--glass)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 20,
        cursor: 'default',
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--gold-border)';
        e.currentTarget.style.boxShadow = '0 16px 48px -16px rgba(201,168,76,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: 'var(--gold-glow)',
          border: '1px solid var(--gold-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <Icon size={24} color="var(--gold)" strokeWidth={1.5} />
      </div>

      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--text)',
          margin: '0 0 10px',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.65 }}>
        {body}
      </p>
    </m.div>
  );
}

function Advantages() {
  const [ref, inView] = useScrollReveal();

  return (
    <section style={{ background: 'var(--bg-2)', padding: '100px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
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
            Pourquoi AssuTempo ?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: 'var(--text-muted)',
              margin: '0 auto',
              maxWidth: 480,
            }}
          >
            L&apos;assurance temporaire, sans les défauts de l&apos;assurance temporaire.
          </p>
        </m.div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'stretch' }} className="advantages-grid">
          {cards.map((card, i) => (
            <AdvantageCard key={card.title} {...card} delay={i * 0.12} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .advantages-grid { flex-direction: column !important; }
        }
      `}</style>
    </section>
  );
}

export default Advantages;
