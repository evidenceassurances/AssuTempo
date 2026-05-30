import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';
import { fadeUp } from '../animations';

const stats = [
  { prefix: '', target: 100, suffix: '%', label: 'EN LIGNE' },
  { prefix: '< ', target: 5, suffix: ' min', label: 'DE SOUSCRIPTION' },
  { prefix: '', target: 34, suffix: ' pays', label: 'COUVERTS' },
  { prefix: '1 à ', target: 60, suffix: ' jours', label: 'AU CHOIX' },
];

function StatItem({ stat, inView }) {
  const count = useCountUp(stat.target, inView);
  return (
    <div
      style={{
        padding: '32px 28px',
        background: 'rgba(201,168,76,0.03)',
        border: '1px solid rgba(201,168,76,0.12)',
        borderRadius: 12,
        transition: 'all 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(201,168,76,0.06)';
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(201,168,76,0.03)';
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)';
      }}
    >
      <p
        className="text-gold-gradient"
        style={{
          fontSize: 'clamp(48px, 6vw, 80px)',
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.03em',
        }}
      >
        {stat.prefix}{count}{stat.suffix}
      </p>
      <p style={{ fontSize: 11, letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 12 }}>
        {stat.label}
      </p>
    </div>
  );
}

function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px -80px 0px' });

  return (
    <section
      ref={ref}
      style={{
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--gold-border)',
        borderBottom: '1px solid var(--gold-border)',
        padding: '100px 0',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', textAlign: 'center', marginBottom: 12 }}>
            CE QUE ÇA CHANGE POUR VOUS
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 12 }}>
            Simple, rapide, et vraiment efficace.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 500, margin: '12px auto 60px', textAlign: 'center', lineHeight: 1.7 }}>
            Pas de paperasse inutile, pas de délai. Juste ce qu'il vous faut, quand vous en avez besoin.
          </p>
        </motion.div>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
          className="stats-grid"
        >
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
      `}</style>
    </section>
  );
}

export default Stats;
