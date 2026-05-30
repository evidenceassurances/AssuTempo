import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navLinks } from '../../data/siteConfig';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-gold/20 transition-all duration-300 ${
        scrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.55)]' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-white">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-[#111111] text-gold shadow-gold">A</span>
          <div className="leading-tight">
            <p className="text-sm uppercase tracking-[0.35em]">AssuTemp</p>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gold">o</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-white' : 'text-textSub hover:text-white'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/tarification"
            className="inline-flex rounded-full border border-gold px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-transparent hover:bg-gold hover:text-black"
          >
            Obtenir un devis
          </Link>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#111111]/95 p-3 text-white shadow-[0_16px_40px_-24px_rgba(0,0,0,0.7)] md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Menu mobile"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gold/20 bg-[#0A0A0A]/98 px-6 py-6 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-textSub transition hover:text-white"
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/tarification"
              onClick={() => setOpen(false)}
              className="inline-flex rounded-full border border-gold bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-transparent hover:bg-gold hover:text-black"
            >
              Obtenir un devis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
