import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  ParkingSquare, AlertTriangle, FileText, Lock, Tag,
  GraduationCap, AlertOctagon, Percent, Truck, ArrowRight,
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

/* Hub de maillage vers le cluster de guides le plus consulte. Chaque tuile
   part vers un article existant (jamais de contenu invisible), et ferme le
   maillage retour depuis la page la plus proche du haut de l'entonnoir. */
const GUIDES = [
  { Icon: ParkingSquare, title: "Sortie de fourrière", to: '/articles/combien-de-jours-assurance-sortir-fourriere' },
  { Icon: AlertTriangle, title: "Voiture immobilisée sans assurance", to: '/articles/voiture-immobilisee-defaut-assurance' },
  { Icon: FileText, title: 'Carte grise en urgence : le CPI', to: '/articles/carte-grise-urgence-cpi-immediat' },
  { Icon: Lock, title: "Dossier ANTS bloqué", to: '/articles/carte-grise-ants-bloquee' },
  { Icon: Tag, title: "Prix de l'assurance temporaire", to: '/articles/prix-assurance-auto-temporaire' },
  { Icon: GraduationCap, title: 'Jeune conducteur', to: '/articles/assurance-auto-temporaire-jeune-conducteur' },
  { Icon: AlertOctagon, title: "Rouler sans carte grise à son nom", to: '/articles/rouler-sans-carte-grise-a-son-nom' },
  { Icon: Percent, title: 'Assurance et malus', to: '/articles/assurance-temporaire-malus' },
  { Icon: Truck, title: 'Assurance temporaire utilitaire', to: '/assurance-temporaire-utilitaire' },
];

function GuidesEtDemarches() {
  const [ref, inView] = useScrollReveal();

  return (
    <section style={{ background: 'var(--bg)', padding: '88px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <m.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 36, textAlign: 'center' }}
        >
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>
            RESSOURCES
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)', margin: 0 }}>
            Guides &amp; démarches
          </h2>
        </m.div>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}
          className="guides-grid"
        >
          {GUIDES.map(({ Icon, title, to }, i) => (
            <m.div
              key={to}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 18px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-border)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
              >
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0, width: 34, height: 34, borderRadius: 9,
                    background: 'var(--gold-glow)', border: '1px solid var(--gold-border)',
                    display: 'grid', placeItems: 'center',
                  }}
                >
                  <Icon size={16} color="var(--gold)" strokeWidth={1.75} />
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>
                  {title}
                </span>
                <ArrowRight size={14} strokeWidth={2} style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--text-subtle)' }} aria-hidden="true" />
              </Link>
            </m.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .guides-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .guides-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

export default GuidesEtDemarches;
