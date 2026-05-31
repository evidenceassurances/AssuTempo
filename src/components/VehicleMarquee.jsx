import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';

const row1 = [
  { emoji: '🚗', label: 'Voiture' },
  { emoji: '🏎️', label: 'Sportive' },
  { emoji: '🚐', label: 'Utilitaire' },
  { emoji: '🚌', label: 'Minibus' },
  { emoji: '🚛', label: 'Poids lourd' },
  { emoji: '🚜', label: 'Tracteur' },
  { emoji: '🏕️', label: 'Camping-car' },
];

const row2 = [
  { emoji: '🚍', label: 'Autocar' },
  { emoji: '🛻', label: 'Pick-up' },
  { emoji: '🚎', label: 'Semi-remorque' },
  { emoji: '🏠', label: 'Caravane' },
  { emoji: '🏍️', label: 'Quad' },
  { emoji: '🚙', label: '4x4' },
  { emoji: '🚓', label: 'Berline' },
];

function VehicleCard({ emoji, label }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 148,
        padding: '22px 18px',
        background: 'var(--bg-card)',
        border: '1px solid var(--glass-border)',
        borderRadius: 16,
        textAlign: 'center',
        cursor: 'default',
        transition: 'border-color 0.3s, background 0.3s, transform 0.3s var(--ease-out), box-shadow 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--gold-border)';
        e.currentTarget.style.background = 'var(--bg-card-hover)';
        e.currentTarget.style.transform = 'scale(1.04)';
        e.currentTarget.style.boxShadow = '0 8px 32px -8px rgba(201,168,76,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.background = 'var(--bg-card)';
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize: '2.4rem', marginBottom: 10, lineHeight: 1 }}>{emoji}</div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function MarqueeRow({ items, direction }) {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="marquee-wrap" style={{ marginBottom: 16 }}>
      <div
        className={`marquee-track ${direction === 'left' ? 'marquee-left' : 'marquee-right'}`}
        style={{ gap: 16 }}
      >
        {repeated.map((item, i) => (
          <VehicleCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}

function VehicleMarquee() {
  const [ref, inView] = useScrollReveal();

  return (
    <section
      style={{
        padding: '100px 0',
        background: 'var(--bg-2)',
        overflow: 'hidden',
      }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', marginBottom: 56, padding: '0 24px' }}
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
          Tous vos véhicules, couverts en 5 minutes
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
          Quel que soit votre véhicule, une attestation immédiate.
        </p>
      </motion.div>

      <MarqueeRow items={row1} direction="left" />
      <MarqueeRow items={row2} direction="right" />
    </section>
  );
}

export default VehicleMarquee;
