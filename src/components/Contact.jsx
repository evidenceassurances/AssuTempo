import { m } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fadeUp, stagger } from '../animations';

const docs = [
  { emoji: '🪪', label: 'Permis de conduire' },
  { emoji: '📋', label: 'Carte grise' },
  { emoji: '💳', label: 'Carte bancaire' },
];

function Contact() {
  const navigate = useNavigate();
  return (
    <section
      style={{
        background: 'var(--bg)',
        padding: '120px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ligne dorée haut */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            'linear-gradient(90deg, transparent, rgba(201,168,76,0.8) 50%, transparent)',
          boxShadow: '0 0 20px rgba(201,168,76,0.4)',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.7,
        }}
      />

      {/* Grille de points */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(201,168,76,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Orbe central pulsant */}
      <m.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.07, 0.04] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 900,
          height: 900,
          background:
            'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: '0 32px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Badge disponibilité - vert pulsant */}
          <m.div variants={fadeUp} style={{ marginBottom: 32 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(0,229,185,0.06)',
                border: '1px solid rgba(0,229,185,0.2)',
                borderRadius: 999,
                padding: '8px 20px',
                fontSize: 12,
                letterSpacing: '0.1em',
                color: 'var(--gold)',
                textTransform: 'uppercase',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#00E5B9',
                  animation: 'pulse-dot 2s infinite',
                  flexShrink: 0,
                }}
              />
              Disponible maintenant • Lun-Sam
            </div>
          </m.div>

          {/* Téléphone */}
          <m.div variants={fadeUp}>
            <a
              href="tel:0974197820"
              style={{
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 800,
                color: 'var(--gold)',
                textDecoration: 'none',
                display: 'block',
                margin: '0 0 16px',
                transition: 'opacity 0.2s',
                letterSpacing: '-0.03em',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              09 74 19 78 20
            </a>

            {/* Lien souscription directe */}
            <Link
              to="/tarification"
              style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'color 0.2s',
                marginBottom: 32,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Ou souscrivez directement en ligne →
            </Link>
          </m.div>

          {/* Horaires */}
          <m.div
            variants={fadeUp}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              alignItems: 'center',
              marginBottom: 48,
            }}
          >
            {['Lundi - Vendredi : 9h00 - 21h00', 'Samedi : 9h00 - 20h00'].map((h) => (
              <p
                key={h}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 16,
                  color: 'var(--text-muted)',
                }}
              >
                <Clock size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                {h}
              </p>
            ))}
          </m.div>

          {/* CTA */}
          <m.div variants={fadeUp}>
            <button
              className="btn-gold"
              onClick={() => navigate('/tarification')}
              style={{ fontSize: 16, padding: '18px 48px' }}
            >
              Souscrire maintenant →
            </button>
            <p style={{ marginTop: 14, fontSize: 13, color: 'var(--text-muted)' }}>
              Portail de souscription accessible 24h/24 - 7j/7
            </p>

            {/* Texte de réassurance */}
            <div
              style={{
                marginTop: 24,
                padding: '16px 24px',
                background: 'rgba(201,168,76,0.04)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: 12,
                fontSize: 13,
                color: 'var(--text-muted)',
                lineHeight: 1.8,
                textAlign: 'left',
              }}
            >
              <span style={{ color: 'var(--gold)' }}>✓</span> Sans engagement{'  '}
              <span style={{ color: 'var(--gold)' }}>✓</span> Attestation immédiate{'  '}
              <span style={{ color: 'var(--gold)' }}>✓</span> Remboursement impossible légalement - vous êtes protégé dès le paiement
            </div>
          </m.div>

          {/* Pills documents */}
          <m.div
            variants={fadeUp}
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              marginTop: 40,
              flexWrap: 'wrap',
            }}
          >
            {docs.map(({ emoji, label }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#1A1A1A',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 999,
                  padding: '8px 20px',
                  fontSize: 14,
                  color: 'var(--text-muted)',
                }}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </div>
            ))}
          </m.div>
        </m.div>
      </div>
    </section>
  );
}

export default Contact;
