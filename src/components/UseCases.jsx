import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

const cases = [
  { emoji: '🚗', title: 'Véhicule récemment acquis', body: 'Vous venez d’acquérir un véhicule et souhaitez l’assurer immédiatement.' },
  { emoji: '📄', title: 'Démarche de carte grise', body: 'En attente d’immatriculation, restez couvert pendant vos démarches.' },
  { emoji: '🌍', title: 'Véhicule ou permis étranger', body: 'Permis ou véhicule d’origine étrangère, sans complication.' },
  { emoji: '🅿️', title: 'Véhicule qui circule peu', body: 'Inutile d’assurer à l’année un véhicule utilisé quelques jours par an.' },
  { emoji: '🛣️', title: 'Véhicule en transit', body: 'Couvert en France ou à l’étranger pour un déplacement ponctuel.' },
  { emoji: '📦', title: 'Export de véhicule', body: 'Assurez votre véhicule pour un export dans les meilleures conditions.' },
];

function UseCases() {
  const [ref, inView] = useScrollReveal();

  return (
    <section style={{ background: 'var(--bg-2)', padding: '100px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <motion.div
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
            Pensée pour toutes vos situations
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
            L&apos;assurance temporaire qui s&apos;adapte à votre besoin réel.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="cases-grid">
          {cases.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: '24px 20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--glass-border)',
                borderRadius: 16,
                transition: 'border-color 0.3s, transform 0.3s var(--ease-out)',
                cursor: 'default',
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-border)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: 12 }}>{item.emoji}</div>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--text)',
                  margin: '0 0 8px',
                  letterSpacing: '-0.01em',
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Lien discret vers la page Articles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: 36 }}
        >
          <Link
            to="/articles"
            style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            Lire nos articles &rarr;
          </Link>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cases-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .cases-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

export default UseCases;
