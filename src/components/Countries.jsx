import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
/* Index leger uniquement : le contenu complet des 34 pays (~80 KB source)
   ne doit JAMAIS entrer dans le bundle critique de la Home */
import { COUNTRIES_INDEX as COUNTRIES } from '../data/countries-index';

function Countries() {
  const [ref, inView] = useScrollReveal();

  return (
    <section style={{ background: 'var(--bg)', padding: '100px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <m.div
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
        </m.div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
          }}
        >
          {COUNTRIES.map((c, i) => (
            <m.div
              key={c.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/carte/${c.slug}`}
                state={{ fromHome: true }}
                style={{
                  display: 'block',
                  padding: '8px 14px',
                  background: 'var(--glass)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 999,
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
                  e.currentTarget.style.background = 'var(--gold-glow)';
                  e.currentTarget.style.color = 'var(--text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.background = 'var(--glass)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                {c.flag} {c.nom}
              </Link>
            </m.div>
          ))}
        </div>

        {/* Lien vers la carte interactive */}
        <m.div
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
        </m.div>
      </div>
    </section>
  );
}

export default Countries;
