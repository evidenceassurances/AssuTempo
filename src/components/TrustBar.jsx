const items = [
  '🔒 Paiement 100% sécurisé',
  'Attestation immédiate',
  'Sans engagement',
  'Disponible 24h/24',
  '34 pays couverts',
  'Depuis 2018',
];

const DOT = <span style={{ color: 'var(--gold)', margin: '0 16px', opacity: 0.6 }}>•</span>;

const Row = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, whiteSpace: 'nowrap' }}>
    {[...items, ...items, ...items].map((item, i) => (
      <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <span>{item}</span>
        {DOT}
      </span>
    ))}
  </div>
);

function TrustBar() {
  return (
    <div
      style={{
        background: '#111111',
        borderTop: '0.5px solid var(--gold-border)',
        borderBottom: '0.5px solid var(--gold-border)',
        padding: '14px 0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div className="trustbar-track">
        <Row />
      </div>

      <style>{`
        .trustbar-track {
          display: flex;
          animation: trustbar-scroll 30s linear infinite;
          font-size: 13px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .trustbar-track:hover {
          animation-play-state: paused;
        }
        @keyframes trustbar-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}

export default TrustBar;
