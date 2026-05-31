import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';

const countries = [
  '🇦🇹 Autriche', '🇧🇪 Belgique', '🇧🇬 Bulgarie', '🇨🇾 Chypre',
  '🇨🇿 République tchèque', '🇩🇪 Allemagne', '🇩🇰 Danemark',
  '🇪🇸 Espagne', '🇪🇪 Estonie', '🇫🇷 France', '🇫🇮 Finlande',
  '🇬🇷 Grèce', '🇭🇺 Hongrie', '🇭🇷 Croatie', '🇮🇹 Italie',
  '🇮🇪 Irlande', '🇮🇸 Islande', '🇱🇺 Luxembourg', '🇱🇹 Lituanie',
  '🇱🇻 Lettonie', '🇲🇹 Malte', '🇳🇴 Norvège', '🇳🇱 Pays-Bas',
  '🇵🇹 Portugal', '🇵🇱 Pologne', '🇷🇴 Roumanie', '🇸🇪 Suède',
  '🇸🇰 Slovaquie', '🇸🇮 Slovénie', '🇨🇭 Suisse', '🇦🇩 Andorre',
  '🇧🇦 Bosnie-Herzégovine', '🇲🇪 Monténégro', '🇬🇧 Royaume-Uni',
];

function Countries() {
  const [ref, inView] = useScrollReveal();

  return (
    <section style={{ background: 'var(--bg)', padding: '100px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 48 }}
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
            Valable dans toute l&apos;Europe
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
            34 pays couverts par votre carte verte.
          </p>
        </motion.div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
          }}
        >
          {countries.map((country, i) => (
            <motion.div
              key={country}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: '8px 14px',
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: 999,
                fontSize: 13,
                color: 'var(--text-muted)',
                transition: 'border-color 0.25s, background 0.25s, color 0.25s',
                cursor: 'default',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold-border)';
                e.currentTarget.style.background = 'var(--gold-glow)';
                e.currentTarget.style.color = 'var(--text)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.background = 'var(--glass)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              {country}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Countries;
