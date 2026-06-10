import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Tarification', href: '/tarification' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Articles', href: '/articles' },
  { label: 'Carte', href: '/carte' },
  { label: 'International', href: '/assurance-internationale' },
  { label: 'Qui sommes-nous ?', href: '/qui-sommes-nous' },
];

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.06, delayChildren: 0.05 },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const mobileLinkVariants = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
        zIndex: 100,
        height: 68,
        display: 'flex',
        alignItems: 'center',
        transition: 'background 300ms ease, backdrop-filter 300ms ease, border-color 300ms ease, padding 300ms ease',
        background: scrolled ? 'rgba(10,10,10,0.72)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'rgba(201,168,76,0.15)' : 'transparent'}`,
        paddingTop: scrolled ? 4 : 0,
        paddingBottom: scrolled ? 4 : 0,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 32px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: '-0.02em',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <span style={{ color: 'var(--text)' }}>Assu</span>
            <span style={{ color: 'var(--gold)' }}>Tempo</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="nav-desktop">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className="nav-link"
              style={{ textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="nav-desktop">
          <button
            onClick={() => navigate('/tarification')}
            className="btn-gold nav-cta shimmer-btn"
            style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600 }}
          >
            Obtenir mon devis
          </button>
        </div>

        {/* Hamburger mobile */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="nav-mobile"
          style={{
            background: 'var(--glass)',
            border: '1px solid var(--glass-border)',
            borderRadius: 8,
            padding: 10,
            color: 'var(--text)',
            cursor: 'pointer',
            display: 'none',
            lineHeight: 0,
          }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <m.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{
              position: 'fixed',
              top: 68,
              left: 0,
              right: 0,
              background: 'rgba(8,7,6,0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderTop: '1px solid var(--gold-border)',
              padding: '32px 32px 40px',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              zIndex: 99,
            }}
          >
            {links.map((link) => (
              <m.div key={link.href} variants={mobileLinkVariants}>
                <NavLink
                  to={link.href}
                  onClick={() => setOpen(false)}
                  style={{
                    textDecoration: 'none',
                    fontSize: 18,
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    display: 'block',
                    textAlign: 'center',
                    transition: 'color 0.2s',
                  }}
                >
                  {link.label}
                </NavLink>
              </m.div>
            ))}
            <m.div variants={mobileLinkVariants}>
              <button
                onClick={() => { navigate('/tarification'); setOpen(false); }}
                className="btn-gold"
                style={{ width: '100%', borderRadius: 10, fontSize: 16, padding: '14px 20px' }}
              >
                Obtenir mon devis
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }

        .nav-link {
          color: var(--text-muted);
          position: relative;
          padding-bottom: 4px;
          transition: color 0.2s;
        }
        .nav-link:hover { color: var(--text) !important; }
        .nav-link.active { color: var(--text) !important; }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--gold);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s var(--ease-out);
        }
        .nav-link:hover::after,
        .nav-link.active::after {
          transform: scaleX(1);
        }

        .nav-cta {
          position: relative;
          overflow: hidden;
        }
        .nav-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -120%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: skewX(-20deg);
        }
        .nav-cta:hover::before {
          animation: shimmer 1.2s ease-in-out;
        }
      `}</style>
    </header>
  );
}

export default Navbar;
