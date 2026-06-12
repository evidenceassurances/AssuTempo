import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';
import { useScrollReveal } from '../hooks/useScrollReveal';
import CompteurAttestations from './CompteurAttestations';

const stats = [
  { value: 6, suffix: '', unit: 'ans', label: "d'expertise" },
  { value: 90, suffix: '', unit: 'jours', label: 'de couverture max' },
  { value: 34, suffix: '', unit: 'pays', label: 'européens' },
  { value: 5, suffix: '', unit: 'min', label: 'pour souscrire' },
];

function StatItem({ stat, inView, index }) {
  const count = useCountUp(stat.value, inView);
  const isLast = index === stats.length - 1;

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: 1,
        textAlign: 'center',
        padding: '32px 24px',
        position: 'relative',
      }}
    >
      {/* Séparateur vertical entre blocs */}
      {!isLast && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '20%',
            height: '60%',
            width: 1,
            background: 'linear-gradient(to bottom, transparent, var(--gold-border), transparent)',
          }}
          className="stat-sep"
        />
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: 4,
          marginBottom: 8,
        }}
      >
        <span
          className="text-gold-gradient"
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}
        >
          {count}
        </span>
        <span
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: 600,
            color: 'var(--gold-deep)',
            lineHeight: 1,
          }}
        >
          {stat.unit}
        </span>
      </div>

      <p
        style={{
          fontSize: 14,
          color: 'var(--text-muted)',
          margin: 0,
          letterSpacing: '0.01em',
        }}
      >
        {stat.label}
      </p>
    </m.div>
  );
}

function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  const [headRef, headInView] = useScrollReveal();

  return (
    <section
      style={{
        background: 'var(--bg)',
        padding: '100px 0',
        position: 'relative',
      }}
    >
      {/* Halo d'ambiance dore */}
      <div aria-hidden className="halo-gold" />
      {/* Hairline doree */}
      <div aria-hidden className="hairline-gold" style={{ position: 'absolute', top: 0, left: '10%', right: '10%' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
        {/* Heading */}
        <m.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 64 }}
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
            AssuTempo en chiffres
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
            Simple, rapide, et vraiment efficace.
          </p>
        </m.div>

        {/* Compteur attestations live */}
        <CompteurAttestations />

        {/* Compteurs */}
        <div
          ref={ref}
          style={{
            display: 'flex',
            alignItems: 'stretch',
            background: 'var(--bg-2)',
            borderRadius: 20,
          }}
          className="stats-grid card-jewel"
        >
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} inView={inView} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .stats-grid {
            flex-wrap: wrap !important;
          }
          .stats-grid > div {
            flex-basis: 50% !important;
          }
          .stat-sep {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default Stats;
