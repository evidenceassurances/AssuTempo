import { m } from 'framer-motion';
import { Phone, IdCard, ClipboardList, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { trackEvent } from '../lib/analytics';

function FinalCTA() {
  const navigate = useNavigate();
  const [ref, inView] = useScrollReveal();

  return (
    <section style={{ background: 'var(--bg)', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>

      {/* Hairline doree */}
      <div aria-hidden className="hairline-gold" style={{ position: 'absolute', top: 0, left: '10%', right: '10%' }} />

      {/* Halo doré central qui pulse */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 60%)',
          filter: 'blur(60px)',
          animation: 'halo-pulse 7s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Anneau principal - sens horaire */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        <svg
          width="480"
          height="480"
          viewBox="0 0 480 480"
          style={{ display: 'block', animation: 'rotate-slow 50s linear infinite', opacity: 0.18 }}
        >
          <defs>
            <linearGradient id="cta-ring-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--gold-deep)" />
              <stop offset="100%" stopColor="var(--gold-light)" />
            </linearGradient>
          </defs>
          <circle cx="240" cy="240" r="230" fill="none" stroke="url(#cta-ring-1)" strokeWidth="1.2" strokeDasharray="55 22" />
        </svg>

        {/* Second anneau - sens inverse */}
        <svg
          width="480"
          height="480"
          viewBox="0 0 480 480"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'block',
            animation: 'rotate-slow-reverse 70s linear infinite',
            opacity: 0.10,
          }}
        >
          <defs>
            <linearGradient id="cta-ring-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--gold)" />
              <stop offset="100%" stopColor="var(--gold-deep)" />
            </linearGradient>
          </defs>
          <circle cx="240" cy="240" r="185" fill="none" stroke="url(#cta-ring-2)" strokeWidth="0.8" strokeDasharray="35 25" />
        </svg>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 32px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <m.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              margin: '0 0 16px',
              lineHeight: 1.1,
            }}
          >
            Besoin d&apos;assistance ?
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', margin: '0 0 44px', lineHeight: 1.6 }}>
            Notre équipe vous accompagne, 6 jours sur 7.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <button
              className="btn-gold"
              onClick={() => {
                trackEvent('cta_devis_click', { "cta_label": 'Souscrire maintenant', "page_path": window.location.pathname });
                navigate('/tarification');
              }}
              style={{ padding: '14px 28px', fontSize: 15, position: 'relative', overflow: 'hidden' }}
            >
              Souscrire maintenant
            </button>
            <a href="tel:0974197820" className="btn-glass" style={{ textDecoration: 'none' }}>
              <Phone size={16} strokeWidth={1.5} />
              Nous appeler
            </a>
          </div>

          {/* Bloc contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <a
              href="tel:0974197820"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--text)',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text)';
              }}
            >
              <Phone size={20} strokeWidth={1.75} style={{ color: 'var(--gold)', flexShrink: 0 }} aria-hidden />
              09 74 19 78 20
            </a>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
              Lun-Ven 9h-21h &middot; Sam 9h-20h
            </p>

            {/* Ligne séparatrice dorée dégradée */}
            <div
              style={{
                width: 200,
                height: 1,
                background: 'linear-gradient(to right, transparent, var(--gold-border), transparent)',
                margin: '4px 0',
              }}
            />

            <p style={{ fontSize: 12, color: 'var(--text-subtle)', margin: 0, letterSpacing: '0.05em' }}>
              Portail accessible 24h/24 - 7j/7
            </p>

            {/* Pills documents */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 }}>
              {[
                { Icon: IdCard, label: 'Permis' },
                { Icon: ClipboardList, label: 'Carte grise' },
                { Icon: CreditCard, label: 'Carte bancaire' },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 999,
                    fontSize: 13,
                    color: 'var(--text-muted)',
                    transition: 'border-color 0.25s, color 0.25s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold-border)';
                    e.currentTarget.style.color = 'var(--text)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  <Icon size={14} strokeWidth={1.75} style={{ color: 'var(--gold)', flexShrink: 0 }} aria-hidden />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

export default FinalCTA;
