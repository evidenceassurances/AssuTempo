import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import CrescentMoon from './ui/CrescentMoon';

const navLinks = [
  { label: 'Tarification', href: '/tarification' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Carte', href: '/carte' },
  { label: 'Assurance internationale', href: '/assurance-internationale' },
  { label: 'Carte grise', href: '/carte-grise' },
  { label: 'Qui sommes-nous ?', href: '/qui-sommes-nous' },
];

const colLabel = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--gold)',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  marginBottom: 16,
  display: 'block',
};

/* Lien footer : hover → --gold-light + trait qui se dessine */
function FooterLink({ to, href, children, external }) {
  const baseStyle = {
    textDecoration: 'none',
    fontSize: 14,
    color: 'var(--text-muted)',
    transition: 'color 0.2s',
    position: 'relative',
    paddingBottom: 3,
    display: 'inline-block',
  };

  const handleEnter = (e) => {
    e.currentTarget.style.color = 'var(--gold-light)';
    const line = e.currentTarget.querySelector('.footer-link-line');
    if (line) line.style.transform = 'scaleX(1)';
  };
  const handleLeave = (e) => {
    e.currentTarget.style.color = 'var(--text-muted)';
    const line = e.currentTarget.querySelector('.footer-link-line');
    if (line) line.style.transform = 'scaleX(0)';
  };

  const inner = (
    <>
      {children}
      <span
        className="footer-link-line"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 1,
          background: 'var(--gold-light)',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.25s var(--ease-out)',
          display: 'block',
        }}
      />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={baseStyle}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link to={to} style={baseStyle} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {inner}
    </Link>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: 'var(--footer-bg)',
        padding: '56px 0 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Bordure haute - ligne dorée dégradée */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: 'linear-gradient(to right, transparent, var(--gold-border), transparent)',
        }}
      />

      {/* Halo doré centré en bas - très discret */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 200,
          background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(201,168,76,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 32px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: 48,
          position: 'relative',
        }}
        className="footer-grid"
      >
        {/* Col 1 - Identité */}
        <div>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: '-0.02em',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'var(--text)' }}>Assu</span>
              <span style={{ color: 'var(--gold)' }}>Tempo</span>
            </span>
          </Link>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, margin: '0 0 8px', maxWidth: 280 }}>
            Démarche simple, attestation immédiate.
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-subtle)', margin: 0, maxWidth: 280, lineHeight: 1.6 }}>
            Evidence Assurances - cabinet de courtage engagé RSE, 6 ans d&apos;expérience.
          </p>
        </div>

        {/* Col 2 - Navigation. Le Guichet de Nuit ouvre la colonne, en pastille :
            c'est la seule offre du site disponible en dehors des horaires. */}
        <div>
          <span style={colLabel}>Navigation</span>
          <Link to="/guichet-de-nuit" className="gn-pill gn-pill-footer">
            <CrescentMoon uid="footer" size={15} />
            Le Guichet de Nuit
          </Link>
          <p style={{ fontSize: 12, color: 'var(--text-subtle)', margin: '8px 0 18px', lineHeight: 1.5 }}>
            21h - 9h du lundi au samedi,<br />dimanche toute la journée.
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {navLinks.map((link) => (
              <FooterLink key={link.href} to={link.href}>{link.label}</FooterLink>
            ))}
          </nav>
        </div>

        {/* Col 3 - Contact */}
        <div>
          <span style={colLabel}>Contact</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a
              href="tel:0974197820"
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--text)',
                textDecoration: 'none',
                transition: 'color 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
            >
              <Phone size={14} strokeWidth={1.75} style={{ color: 'var(--gold)', flexShrink: 0 }} aria-hidden />
              09 74 19 78 20
            </a>
            <a
              href="mailto:contact@assutempo.fr"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text)',
                textDecoration: 'none',
                transition: 'color 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
            >
              <Mail size={14} strokeWidth={1.75} style={{ color: 'var(--gold)', flexShrink: 0 }} aria-hidden />
              contact@assutempo.fr
            </a>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
              Lun-Ven 9h-21h<br />Sam 9h-20h
            </p>
            <div style={{ marginTop: 8 }}>
              <FooterLink to="/conditions-generales">Conditions Générales</FooterLink>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div
        style={{
          maxWidth: 1100,
          margin: '48px auto 0',
          padding: '20px 32px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          position: 'relative',
        }}
      >
        <p style={{ fontSize: 13, color: 'var(--text-subtle)', margin: 0 }}>
          &copy; 2026 Evidence Assurances - Tous droits réservés
        </p>
        <button
          onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: 13,
            color: 'var(--text-subtle)',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold-light)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-subtle)'; }}
        >
          Gérer les cookies
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
