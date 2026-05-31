import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const TARGET = 'https://assutempo.fr/tarification';

/* CTA #1 — Après VehicleMarquee : barre centrée sobre */
export function CtaAfterVehicles() {
  const [ref, inView] = useScrollReveal();

  return (
    <section
      style={{
        background: 'var(--bg)',
        padding: '60px 24px',
        textAlign: 'center',
      }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          style={{
            fontSize: 15,
            color: 'var(--text-muted)',
            margin: '0 0 20px',
            letterSpacing: '0.01em',
          }}
        >
          Votre véhicule en fait partie ?
        </p>
        <button
          className="btn-gold"
          onClick={() => window.open(TARGET)}
          style={{
            padding: '13px 26px',
            fontSize: 15,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          Obtenir mon devis
          <ArrowRight size={16} strokeWidth={2} />
        </button>
      </motion.div>
    </section>
  );
}

/* CTA #2 — Après Process : bandeau pleine largeur glass */
export function CtaAfterProcess() {
  const [ref, inView] = useScrollReveal();

  return (
    <section
      style={{
        background: 'var(--bg)',
        padding: '0 0 8px',
      }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 32px 56px',
        }}
      >
        <div
          style={{
            background: 'var(--gold-glow)',
            border: '1px solid var(--gold-border)',
            borderRadius: 20,
            padding: '32px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          className="cta-process-inner"
        >
          <div>
            <p
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--text)',
                margin: '0 0 6px',
                letterSpacing: '-0.02em',
              }}
            >
              Prêt en moins de 5 minutes.
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
              Attestation immédiate, sans engagement.
            </p>
          </div>
          <button
            className="btn-gold"
            onClick={() => window.open(TARGET)}
            style={{ flexShrink: 0, padding: '13px 24px', fontSize: 15 }}
          >
            Souscrire maintenant
          </button>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 640px) {
          .cta-process-inner {
            flex-direction: column !important;
            text-align: center;
            padding: 28px 24px !important;
          }
          .cta-process-inner button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}

/* CTA #3 — Après Countries : centré, sobre, bouton outline */
export function CtaAfterCountries() {
  const [ref, inView] = useScrollReveal();

  return (
    <section
      style={{
        background: 'var(--bg)',
        padding: '0 24px 80px',
        textAlign: 'center',
      }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          style={{
            fontSize: 17,
            fontWeight: 500,
            color: 'var(--text-muted)',
            margin: '0 0 22px',
            letterSpacing: '-0.01em',
          }}
        >
          Roulez assuré partout en Europe.
        </p>
        <button
          className="btn-glass"
          onClick={() => window.open(TARGET)}
        >
          Voir les tarifs
        </button>
      </motion.div>
    </section>
  );
}
