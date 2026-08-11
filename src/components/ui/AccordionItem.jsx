import { m, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: isOpen ? 'var(--gold)' : '#fff',
          fontSize: 16,
          fontWeight: 500,
          textAlign: 'left',
          transition: 'color 0.2s',
          gap: 16,
          fontFamily: 'inherit',
        }}
      >
        <span>{item.q}</span>
        <m.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ flexShrink: 0 }}
        >
          <ChevronDown size={20} style={{ color: 'var(--gold)' }} />
        </m.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ paddingBottom: item.link ? 10 : 24, fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.75 }}>
              {item.a}
            </p>
            {item.link && (
              <Link
                to={item.link.to}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: 'var(--gold-light)',
                  textDecoration: 'none',
                  marginBottom: 24,
                }}
              >
                {item.link.label}
                <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
              </Link>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AccordionItem;
