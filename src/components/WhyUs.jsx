import { m } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { slideLeft, fadeUp, stagger } from '../animations';

const items = [
  'Véhicule nouvellement acquis à assurer immédiatement',
  'Démarche de carte grise en cours',
  "Permis ou véhicule d'origine étrangère",
  "Véhicule qui circule peu dans l'année",
  "Véhicule en transit en France ou à l'étranger",
  'Export de véhicule',
];

function WhyUs() {
  const navigate = useNavigate();
  return (
    <section style={{ background: '#0D0D0D', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Ligne dorée haut */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.3) 40%, rgba(201,168,76,0.5) 50%, rgba(201,168,76,0.3) 60%, transparent 100%)', pointerEvents: 'none', zIndex: 0, opacity: 0.7 }} />
      {/* Orbe bas-droite */}
      <div style={{ position: 'absolute', bottom: -100, right: -100, width: 500, height: 500, background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div
        style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', position: 'relative', zIndex: 1 }}
        className="whyus-grid"
      >
        {/* Colonne gauche */}
        <m.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>
            CAS D'USAGE
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 24 }}>
            Quand souscrire une assurance temporaire ?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 40 }}>
            L'assurance temporaire répond à des besoins précis et ponctuels. Voici les situations les plus fréquentes.
          </p>
          <button
            className="btn-gold"
            onClick={() => navigate('/tarification')}
            style={{ fontSize: 15, padding: '16px 36px' }}
          >
            Voir nos tarifs
          </button>
        </m.div>

        {/* Colonne droite */}
        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {items.map((item) => (
            <m.div
              key={item}
              variants={fadeUp}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '20px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'padding-left 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.paddingLeft = '8px')}
              onMouseLeave={(e) => (e.currentTarget.style.paddingLeft = '0px')}
            >
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <Check size={18} style={{ color: 'var(--gold)' }} />
              </div>
              <p style={{ fontSize: 15, color: '#fff', lineHeight: 1.6 }}>{item}</p>
            </m.div>
          ))}
        </m.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .whyus-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}

export default WhyUs;
