import { useEffect, useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Tarification', href: '/tarification' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Qui sommes-nous', href: '/qui-sommes-nous' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setPulsing(y > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--gold-border)',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease',
        background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        boxShadow: scrolled ? '0 20px 60px -30px rgba(0,0,0,0.6)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: '-0.02em',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#FFFFFF' }}>Assu</span>
            <span style={{ color: 'var(--gold)' }}>Tempo</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav
          style={{ display: 'flex', alignItems: 'center', gap: 36 }}
          className="hidden-mobile"
        >
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              style={{
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text-muted)',
                transition: 'color 0.2s',
                position: 'relative',
                paddingBottom: 4,
              }}
              className="nav-link"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="hidden-mobile">
          <button
            ref={btnRef}
            onClick={() => window.open('https://assutempo.fr/tarification', '_blank')}
            className={`btn-gold${pulsing ? ' nav-btn-pulse' : ''}`}
            style={{ padding: '11px 22px', borderRadius: 8, fontSize: 14 }}
          >
            Obtenir un devis
          </button>
        </div>

        {/* Hamburger mobile */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="show-mobile"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: 10,
            color: '#fff',
            cursor: 'pointer',
            display: 'none',
          }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            background: '#111111',
            borderTop: '1px solid var(--gold-border)',
            padding: '24px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              style={{
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 500,
                color: 'var(--text-muted)',
                textAlign: 'center',
                transition: 'color 0.2s',
              }}
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              window.open('https://assutempo.fr/tarification', '_blank');
              setOpen(false);
            }}
            className="btn-gold"
            style={{ width: '100%', borderRadius: 8, fontSize: 15 }}
          >
            Obtenir un devis
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        .nav-link:hover { color: #fff !important; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: var(--gold);
          transition: width 0.25s ease;
        }
        .nav-link:hover::after { width: 100%; }

        @keyframes navPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(201,168,76,0); }
        }
        .nav-btn-pulse {
          animation: navPulse 2s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
}

export default Navbar;
