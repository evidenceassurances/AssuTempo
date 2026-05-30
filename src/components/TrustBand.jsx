const items = [
  { icon: '🔒', text: 'Paiement 100% sécurisé' },
  { icon: '⚡', text: 'Attestation immédiate' },
  { icon: '✓', text: 'Sans engagement' },
  { icon: '🕐', text: 'Disponible 24h/24' },
  { icon: '🌍', text: '34 pays couverts' },
  { icon: '📅', text: 'Depuis 2018' },
];

const DOT = (
  <span
    style={{ color: 'var(--gold)', opacity: 0.5, margin: '0 24px', flexShrink: 0, fontSize: 7 }}
    aria-hidden
  >
    ●
  </span>
);

function TrustBand() {
  const all = [...items, ...items, ...items];

  return (
    <div
      style={{
        background: '#111111',
        borderTop: '0.5px solid rgba(201,168,76,0.3)',
        borderBottom: '0.5px solid rgba(201,168,76,0.3)',
        padding: '14px 0',
        overflow: 'hidden',
        position: 'relative',
      }}
      className="trust-band"
    >
      <div className="trust-track">
        {all.map(({ icon, text }, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: 14 }}>{icon}</span>
            <span
              style={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--text-muted)',
              }}
            >
              {text}
            </span>
            {DOT}
          </span>
        ))}
      </div>

      <style>{`
        .trust-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: trust-scroll 32s linear infinite;
        }
        .trust-band:hover .trust-track {
          animation-play-state: paused;
        }
        @keyframes trust-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}

export default TrustBand;
