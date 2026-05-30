import { motion } from 'framer-motion';
import { fadeUp } from '../animations';

const rowOne = [
  { emoji: '🚗', label: 'Automobile' },
  { emoji: '🏍️', label: 'Quad' },
  { emoji: '🛻', label: 'Buggy' },
  { emoji: '🚐', label: 'Utilitaire' },
  { emoji: '🏕️', label: 'Camping-car' },
  { emoji: '🚃', label: 'Caravane' },
];

const rowTwo = [
  { emoji: '🚛', label: 'Poids-lourd' },
  { emoji: '🚌', label: 'Bus' },
  { emoji: '🚍', label: 'Autocar' },
  { emoji: '🚜', label: 'Tracteur' },
  { emoji: '🚋', label: 'Remorque' },
  { emoji: '🚚', label: 'Semi-remorque' },
];

const triple = (arr) => [...arr, ...arr, ...arr];

function VehicleCard({ emoji, label }) {
  return (
    <div
      style={{
        width: 150,
        height: 90,
        flexShrink: 0,
        background: 'var(--bg-card)',
        border: '1px solid var(--gold-border)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'border-color 0.2s, background 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--gold)';
        e.currentTarget.style.background = '#1a1a1a';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--gold-border)';
        e.currentTarget.style.background = 'var(--bg-card)';
      }}
    >
      <span style={{ fontSize: 28 }}>{emoji}</span>
      <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>{label}</p>
    </div>
  );
}

function VehicleCarousel() {
  return (
    <section style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #0F0E0B 50%, #0A0A0A 100%)', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Orbe doré gauche */}
      <div
        style={{
          position: 'absolute',
          left: -200,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>
            PARTICULIERS ET PROFESSIONNELS
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, color: '#fff' }}>
            Tous vos véhicules assurés
          </h2>
        </motion.div>
      </div>

      {/* Rangée 1 → droite */}
      <div className="marquee-mask" style={{ marginBottom: 16 }}>
        <div className="marquee-track marquee-row-right">
          {triple(rowOne).map(({ emoji, label }, i) => (
            <VehicleCard key={`r1-${i}`} emoji={emoji} label={label} />
          ))}
        </div>
      </div>

      {/* Rangée 2 → gauche */}
      <div className="marquee-mask">
        <div className="marquee-track marquee-row-left">
          {triple(rowTwo).map(({ emoji, label }, i) => (
            <VehicleCard key={`r2-${i}`} emoji={emoji} label={label} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default VehicleCarousel;
