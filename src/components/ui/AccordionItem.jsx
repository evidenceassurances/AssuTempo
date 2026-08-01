import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';

/* Le panneau reste MONTE quand il est ferme (hauteur 0 + inert), au lieu
   d'etre demonte par AnimatePresence : les reponses et leurs liens sont
   ainsi presents dans le HTML prerendu (crawlables sans JavaScript), et
   le schema FAQPage reflete un contenu reellement present dans le DOM.
   inert retire le contenu ferme du focus clavier et des lecteurs d'ecran.

   item.link (optionnel) : { href, label } affiche sous la reponse un lien
   vers la page qui detaille le sujet (maillage interne). */
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

      <m.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: 'hidden' }}
        inert={!isOpen}
      >
        <p style={{ margin: 0, paddingBottom: item.link ? 12 : 24, fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.75 }}>
          {item.a}
        </p>
        {item.link && (
          <p style={{ margin: 0, paddingBottom: 24 }}>
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

export default AccordionItem;
