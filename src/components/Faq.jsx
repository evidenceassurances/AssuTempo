import { useState } from 'react';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
/* Donnees partagees avec le schema FAQPage de la Home (pages/Home.jsx) :
   source unique, le JSON-LD reflete toujours le texte affiche ici. */
import { faqHomeItems as items } from '../data/faqHome';

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div
      style={{
        background: isOpen ? 'rgba(255,255,255,0.04)' : 'var(--bg-card)',
        border: `1px solid ${isOpen ? 'var(--gold-border)' : 'var(--glass-border)'}`,
        borderRadius: 14,
        marginBottom: 12,
        overflow: 'hidden',
        transition: 'border-color 0.3s, background 0.3s',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '20px 24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--text)',
          fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-0.01em' }}>
          {item.q}
        </span>
        <m.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ flexShrink: 0, color: isOpen ? 'var(--gold)' : 'var(--text-muted)' }}
        >
          <ChevronDown size={20} />
        </m.span>
      </button>

      {/* Panneau toujours monte (hauteur 0 + inert quand ferme) : reponses
          et liens presents dans le HTML prerendu, crawlables sans JS. */}
      <m.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: 'hidden' }}
        inert={!isOpen}
      >
        <p
          style={{
            margin: 0,
            padding: item.link ? '0 24px 10px' : '0 24px 20px',
            fontSize: 15,
            color: 'var(--text-muted)',
            lineHeight: 1.65,
          }}
        >
          {item.a}
        </p>
        {item.link && (
          <p style={{ margin: 0, padding: '0 24px 20px' }}>
            <Link
              to={item.link.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--gold)',
                textDecoration: 'none',
              }}
            >
              {item.link.label}
              <ArrowRight size={13} strokeWidth={2} aria-hidden />
            </Link>
          </p>
        )}
      </m.div>
    </div>
  );
}

function Faq() {
  const [open, setOpen] = useState(null);
  const [ref, inView] = useScrollReveal();

  return (
    <section style={{ background: 'var(--bg-2)', padding: '100px 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 32px' }}>
        <m.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 14px',
            }}
          >
            Questions fréquentes
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
            Tout ce qu&apos;il faut savoir avant de souscrire.
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {items.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </m.div>
      </div>
    </section>
  );
}

export default Faq;
