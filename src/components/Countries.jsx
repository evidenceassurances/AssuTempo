import { motion } from 'framer-motion';
import { fadeUp, stagger } from '../animations';

const countries = [
  '🇦🇹 Autriche', '🇧🇪 Belgique', '🇧🇬 Bulgarie', '🇨🇾 Chypre',
  '🇨🇿 Rép. Tchèque', '🇩🇪 Allemagne', '🇩🇰 Danemark', '🇪🇸 Espagne',
  '🇪🇪 Estonie', '🇫🇷 France', '🇫🇮 Finlande', '🇬🇷 Grèce',
  '🇭🇺 Hongrie', '🇭🇷 Croatie', '🇮🇹 Italie', '🇮🇪 Irlande',
  '🇮🇸 Islande', '🇱🇺 Luxembourg', '🇱🇹 Lituanie', '🇱🇻 Lettonie',
  '🇲🇹 Malte', '🇳🇴 Norvège', '🇳🇱 Pays-Bas', '🇵🇹 Portugal',
  '🇵🇱 Pologne', '🇷🇴 Roumanie', '🇸🇪 Suède', '🇸🇰 Slovaquie',
  '🇸🇮 Slovénie', '🇨🇭 Suisse', '🇦🇩 Andorre', '🇧🇦 Bosnie-Herzégovine',
  '🇲🇪 Monténégro', '🇬🇧 Royaume-Uni',
];

function CountryPill({ country }) {
  const [flag, ...nameParts] = country.split(' ');
  const name = nameParts.join(' ');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--bg-card-2)',
        border: '1px solid var(--gold-border)',
        borderRadius: 999,
        padding: '10px 18px',
        fontSize: 14,
        color: 'var(--text-muted)',
        cursor: 'default',
        transition: 'all 0.2s ease',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--gold)';
        e.currentTarget.style.borderColor = 'var(--gold)';
        e.currentTarget.style.color = '#000';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg-card-2)';
        e.currentTarget.style.borderColor = 'var(--gold-border)';
        e.currentTarget.style.color = 'var(--text-muted)';
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{flag}</span>
      <span>{name}</span>
    </div>
  );
}

function Countries() {
  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #0A0A0A 0%, #0C0B09 50%, #0A0A0A 100%)',
        backgroundImage: [
          'linear-gradient(180deg, #0A0A0A 0%, #0C0B09 50%, #0A0A0A 100%)',
          'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: 'auto, 50px 50px, 50px 50px',
        borderTop: '1px solid var(--gold-border)',
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Orbe coin supérieur droit */}
      <div style={{ position: 'absolute', top: -50, right: -50, width: 400, height: 400, background: 'radial-gradient(circle, rgba(201,168,76,0.035) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      {/* Orbe coin inférieur gauche */}
      <div style={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
            COUVERTURE GÉOGRAPHIQUE
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#fff', marginBottom: 16 }}>
            Votre couverture en Europe
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            34 pays inclus dans votre contrat, indiqués sur votre carte verte
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}
          className="countries-grid"
        >
          {countries.map((c) => (
            <motion.div key={c} variants={fadeUp}>
              <CountryPill country={c} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .countries-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

export default Countries;
