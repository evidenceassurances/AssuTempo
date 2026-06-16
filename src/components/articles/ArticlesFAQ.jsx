import { useId, useState } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { fadeUpVariants, stagger } from './articlesMeta';

/* Accordeon FAQ accessible (aria-expanded / aria-controls + region). */
function FaqRow({ item, open, onToggle, index }) {
  const reduce = useReducedMotion();
  const baseId = useId();
  const btnId = `${baseId}-btn`;
  const panelId = `${baseId}-panel`;

  return (
    <m.div variants={fadeUpVariants(reduce)} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <h3 style={{ margin: 0 }}>
        <button
          id={btnId}
          type="button"
          onClick={() => onToggle(index)}
          aria-expanded={open}
          aria-controls={panelId}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            padding: '22px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: open ? 'var(--gold)' : 'var(--text)',
            fontSize: 16,
            fontWeight: 500,
            fontFamily: 'inherit',
            transition: 'color 0.2s var(--ease-out)',
          }}
        >
          <span>{item.q}</span>
          <m.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} style={{ flexShrink: 0, display: 'flex' }}>
            <ChevronDown size={20} color="var(--gold)" />
          </m.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            key="content"
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ paddingBottom: 22, margin: 0, fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.75 }}>
              {item.a}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

function ArticlesFAQ({ items }) {
  const reduce = useReducedMotion();
  const [openIndex, setOpenIndex] = useState(0);
  const toggle = (i) => setOpenIndex((cur) => (cur === i ? null : i));

  return (
    <m.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <m.p
        variants={fadeUpVariants(reduce)}
        style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14, textAlign: 'center' }}
      >
        QUESTIONS FRÉQUENTES
      </m.p>
      <m.h2
        variants={fadeUpVariants(reduce)}
        style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 700, color: 'var(--text)', textAlign: 'center', margin: '0 0 36px', letterSpacing: '-0.025em' }}
      >
        Les réponses essentielles
      </m.h2>
      <div>
        {items.map((item, i) => (
          <FaqRow key={item.q} item={item} index={i} open={openIndex === i} onToggle={toggle} />
        ))}
      </div>
    </m.div>
  );
}

export default ArticlesFAQ;
