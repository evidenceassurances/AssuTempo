import { Link } from 'react-router-dom';
import { Moon, ArrowRight } from 'lucide-react';

/* Section courte, 100 % statique (aucun etat initial invisible, regle du
   8 juillet) : relais du Guichet de Nuit sur la Home, en plus du header. */
function CtaGuichetDeNuit() {
  return (
    <section style={{ background: 'var(--bg-2)', padding: '64px 0' }}>
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <span
          aria-hidden
          style={{
            flexShrink: 0, width: 48, height: 48, borderRadius: 13,
            background: 'var(--gold-glow)', border: '1px solid var(--gold-border)',
            display: 'grid', placeItems: 'center',
          }}
        >
          <Moon size={22} color="var(--gold)" strokeWidth={1.75} />
        </span>
        <div style={{ flex: '1 1 320px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>
            Après 21h ou un dimanche ?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
            Le Guichet de Nuit prépare votre contrat pendant que la souscription classique est fermée.
          </p>
        </div>
        <Link
          to="/guichet-de-nuit"
          className="btn-glass"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 22px',
            fontSize: 14,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          Le Guichet de Nuit
          <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export default CtaGuichetDeNuit;
