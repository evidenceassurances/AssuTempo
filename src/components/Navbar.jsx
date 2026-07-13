import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import CrescentMoon from './ui/CrescentMoon';

/* Le Guichet de Nuit n'est pas un lien de nav comme les autres : il porte une
   offre que personne d'autre ne propose. Il sort donc de la liste et se rend
   en pastille (classe .gn-pill, index.css), avec son croissant de lune. */
const GUICHET = { label: 'Le Guichet de Nuit', href: '/guichet-de-nuit' };

/* Header : uniquement les destinations qui rapportent (tarification, carte
   grise, international, carte) plus les articles, qui alimentent le SEO. FAQ
   et Qui sommes-nous vivent dans le footer : ils informent, ils ne convertissent
   pas, et ils encombraient une nav qui doit rester lisible. */
const links = [
  { label: 'Tarification', href: '/tarification' },
  { label: 'Articles', href: '/articles' },
  { label: 'Carte', href: '/carte' },
  { label: 'Carte grise', href: '/carte-grise' },
  { label: 'International', href: '/assurance-internationale' },
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
  // Tactile : pas de backdrop-filter (resample couteux, re-rasterise a chaque
  // recomposition de couche -> participe au gel mobile). On compense par un fond
  // plus opaque, visuellement equivalent.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse), (max-width: 820px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
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
        transition: 'background 300ms ease, border-color 300ms ease, padding 300ms ease',
        /* Mobile : fond PLEIN (pas de backdrop-filter possible, cf. gel Safari) ;
           a 0.94 d'alpha, les vignettes vehicules transparaissaient derriere le
           logo. Desktop : translucide + blur (vrai masquage), inchange. */
        background: scrolled ? (isMobile ? '#0A0A0A' : 'rgba(10,10,10,0.72)') : 'transparent',
        backdropFilter: scrolled && !isMobile ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled && !isMobile ? 'blur(12px)' : 'none',
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
        <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="nav-desktop nav-list">
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
          <NavLink
            to={GUICHET.href}
            className={({ isActive }) => `gn-pill${isActive ? ' active' : ''}`}
          >
            <CrescentMoon uid="nav" size={16} />
            {GUICHET.label}
          </NavLink>
        </nav>

        {/* CTA desktop */}
        <div className="nav-desktop">
          <button
            data-assistant-target="devis"
            onClick={() => {
              trackEvent('cta_devis_click', { "cta_label": 'Obtenir mon devis', "page_path": window.location.pathname });
              navigate('/tarification');
            }}
            className="btn-gold"
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
              /* Fond PLEIN : a 0.97 d'alpha, le hero transparaissait derriere
                 les liens du menu (meme cause que le header scrolle mobile,
                 corrige en juillet). Aucun backdrop-filter ici : interdit sur
                 mobile (gel Safari). */
              background: '#0A0A0A',
              borderTop: '1px solid var(--gold-border)',
              padding: '32px 32px 40px',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              zIndex: 99,
            }}
          >
            {/* En tete du menu mobile : c'est l'entree qu'on doit voir en premier */}
            <m.div variants={mobileLinkVariants}>
              <NavLink
                to={GUICHET.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `gn-pill gn-pill-mobile${isActive ? ' active' : ''}`}
              >
                <CrescentMoon uid="navmob" size={18} />
                {GUICHET.label}
              </NavLink>
            </m.div>
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
                onClick={() => {
                  trackEvent('cta_devis_click', { "cta_label": 'Obtenir mon devis', "page_path": window.location.pathname });
                  navigate('/tarification');
                  setOpen(false);
                }}
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

      `}</style>
    </header>
  );
}

export default Navbar;
