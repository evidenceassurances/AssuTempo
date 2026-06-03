import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

/* ISO 3166-1 numérique — miroir de COUNTRY_NAMES dans Carte.jsx */
const COUNTRY_ISO = {
  'Autriche': 40, 'Belgique': 56, 'Bulgarie': 100, 'Chypre': 196,
  'République tchèque': 203, 'Allemagne': 276, 'Danemark': 208,
  'Espagne': 724, 'Estonie': 233, 'France': 250, 'Finlande': 246,
  'Grèce': 300, 'Hongrie': 348, 'Croatie': 191, 'Italie': 380,
  'Irlande': 372, 'Islande': 352, 'Luxembourg': 442, 'Lituanie': 440,
  'Lettonie': 428, 'Malte': 470, 'Norvège': 578, 'Pays-Bas': 528,
  'Portugal': 620, 'Pologne': 616, 'Roumanie': 642, 'Suède': 752,
  'Slovaquie': 703, 'Slovénie': 705, 'Suisse': 756, 'Andorre': 20,
  'Bosnie-Herzégovine': 70, 'Monténégro': 499, 'Royaume-Uni': 826,
};

/* Extrait "Autriche" de "🇦🇹 Autriche" (flag emoji = 4 chars JS) */
const getName = (pill) => pill.substring(pill.indexOf(' ') + 1);

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
  const navigate = useNavigate();

  const goToMap = (pill) => {
    const iso = COUNTRY_ISO[getName(pill)];
    navigate(iso ? `/carte?pays=${iso}` : '/carte');
  };

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
            34 pays européens couverts dès le premier jour.
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
            <motion.button
              type="button"
              key={country}
              onClick={() => goToMap(country)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: '8px 14px',
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: 999,
                fontSize: 13,
                fontFamily: 'inherit',
                color: 'var(--text-muted)',
                transition: 'border-color 0.25s, background 0.25s, color 0.25s',
                cursor: 'pointer',
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
            </motion.button>
          ))}
        </div>

        {/* Lien vers la carte interactive */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginTop: 32 }}
        >
          <Link
            to="/carte"
            className="btn-glass"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              fontSize: 14,
            }}
          >
            Voir la carte interactive
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Countries;
