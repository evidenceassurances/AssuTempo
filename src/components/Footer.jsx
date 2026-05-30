import { Link } from 'react-router-dom';

const SEPARATOR_STYLE = {
  height: 1,
  background:
    'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.3) 20%, rgba(201,168,76,0.7) 50%, rgba(201,168,76,0.3) 80%, transparent 100%)',
  boxShadow: '0 0 30px rgba(201,168,76,0.2), 0 0 60px rgba(201,168,76,0.1)',
};

const FOOTER_STYLE = {
  background: 'linear-gradient(180deg, #080808 0%, #050505 100%)',
  borderTop: 'none',
  padding: '60px 0 30px',
  color: 'var(--text-muted)',
  position: 'relative',
  overflow: 'hidden',
};

function Footer() {
  return (
    <div>
      {/* Séparateur lumineux */}
      <div style={SEPARATOR_STYLE} />

      <footer style={FOOTER_STYLE}>
        {/* Orbe centré fond */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 200,
            background:
              'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 48,
            position: 'relative',
            zIndex: 1,
          }}
          className="footer-grid"
        >
          {/* Colonne gauche */}
          <div>
            <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              <span style={{ color: '#fff' }}>Assu</span>
              <span style={{ color: 'var(--gold)' }}>Tempo</span>
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 20,
                color: 'var(--text-muted)',
              }}
            >
              Démarche simple, attestation immédiate.
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {'©'} {new Date().getFullYear()} Evidence Assurances
            </p>
          </div>

          {/* Colonne navigation */}
          <div>
            <p
              style={{
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 20,
              }}
            >
              Navigation
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Tarification', to: '/tarification' },
                { label: 'FAQ', to: '/faq' },
                { label: 'Qui sommes-nous', to: '/qui-sommes-nous' },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    fontSize: 14,
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Colonne contact */}
          <div>
            <p
              style={{
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 20,
              }}
            >
              Contact
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <a
                href="tel:0974197820"
                style={{
                  color: 'var(--gold)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                📞 09 74 19 78 20
              </a>
              <p>Lun–Ven : 9h00 – 21h00</p>
              <p>Samedi : 9h00 – 20h00</p>
              <a
                href="https://assutempo.fr/conditions-generales"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  marginTop: 8,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                Conditions Générales
              </a>
            </div>
          </div>
        </div>

        {/* Ligne séparatrice + signal de confiance */}
        <div
          style={{
            maxWidth: 1280,
            margin: '40px auto 0',
            padding: '0 32px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              height: 1,
              background:
                'linear-gradient(90deg, transparent, rgba(201,168,76,0.25) 30%, rgba(201,168,76,0.25) 70%, transparent)',
              marginBottom: 24,
            }}
          />
          <p
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              textAlign: 'center',
              lineHeight: 1.8,
            }}
          >
            🔒 Paiement sécurisé SSL &nbsp;•&nbsp; Données protégées RGPD &nbsp;•&nbsp;
            Evidence Assurances — Cabinet de courtage enregistré ORIAS
          </p>
        </div>

        <style>{`
          .footer-grid { }
          @media (max-width: 768px) {
            .footer-grid {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
            }
          }
        `}</style>
      </footer>
    </div>
  );
}

export default Footer;
