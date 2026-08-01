import { Fragment } from 'react';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Car, FileText, Globe, CircleParking, Route, Package } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const cases = [
  { Icon: Car, title: 'Véhicule récemment acquis', body: 'Vous venez d’acquérir un véhicule et souhaitez l’assurer immédiatement.', to: '/articles/assurance-trajet-retour-achat-voiture' },
  { Icon: FileText, title: 'Démarche de carte grise', body: 'En attente d’immatriculation, restez couvert pendant vos démarches.', to: '/carte-grise' },
  { Icon: Globe, title: 'Véhicule ou permis étranger', body: 'Permis ou véhicule d’origine étrangère, sans complication.', to: '/articles/assurance-temporaire-vehicule-etranger-france' },
  { Icon: CircleParking, title: 'Véhicule qui circule peu', body: 'Inutile d’assurer à l’année un véhicule utilisé quelques jours par an.', to: '/tarification' },
  { Icon: Route, title: 'Véhicule en transit', body: 'Couvert en France ou à l’étranger pour un déplacement ponctuel.', to: '/carte' },
  { Icon: Package, title: 'Export de véhicule', body: 'Assurez votre véhicule pour un export dans les meilleures conditions.', to: '/assurance-internationale' },
];

function UseCases() {
  const [ref, inView] = useScrollReveal();

  return (
    <section style={{ background: 'var(--bg-2)', padding: '100px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <m.div
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
        </m.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="cases-grid">
          {cases.map((item, i) => {
            const card = (
            <m.div
              className="card-jewel"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: '24px 20px',
                background: 'var(--bg-card)',
                borderRadius: 16,
                cursor: item.to ? 'pointer' : 'default',
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] },
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}
              >
                <item.Icon size={20} color="var(--gold)" strokeWidth={1.5} />
              </div>
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
            </m.div>
            );
            return item.to ? (
              <Link key={item.title} to={item.to} style={{ textDecoration: 'none', display: 'block' }}>
                {card}
              </Link>
            ) : (
              <Fragment key={item.title}>{card}</Fragment>
            );
          })}
        </div>

        {/* Lien discret vers la page Articles */}
        <m.div
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
        </m.div>
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
