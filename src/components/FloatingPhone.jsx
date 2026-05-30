import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';

function FloatingPhone() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a
        href="tel:0974197820"
        aria-label="Appeler AssuTempo"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 28,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--gold)',
          color: '#000',
          borderRadius: 999,
          height: 50,
          minWidth: 50,
          padding: hovered ? '0 20px 0 16px' : '0 13px',
          textDecoration: 'none',
          boxShadow: '0 8px 32px rgba(201,168,76,0.35)',
          transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          transform: visible ? 'translateX(0)' : 'translateX(100px)',
          opacity: visible ? 1 : 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <Phone size={20} style={{ flexShrink: 0 }} />
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            maxWidth: hovered ? 140 : 0,
            opacity: hovered ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-width 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
          }}
        >
          09 74 19 78 20
        </span>
      </a>
    </>
  );
}

export default FloatingPhone;
