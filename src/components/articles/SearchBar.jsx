import { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, X } from 'lucide-react';

const ROTATING = [
  'Sortie de fourrière...',
  'Véhicule acheté à l’étranger...',
  'Carte grise en attente...',
  'Rouler au Maroc...',
  'Contrôle sans assurance...',
];

const STATIC_PLACEHOLDER = 'Décrivez votre situation...';

/* Barre de recherche : placeholder rotatif (uniquement quand le champ est vide
   et que l'utilisateur n'a pas tape), anneau or au focus, bouton reset. */
function SearchBar({ query, onChange }) {
  const reduce = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const [rotIndex, setRotIndex] = useState(0);
  const inputRef = useRef(null);

  const hasQuery = query.trim().length > 0;
  const rotate = !reduce && !hasQuery;

  useEffect(() => {
    if (!rotate) return undefined;
    const id = setInterval(() => {
      setRotIndex((i) => (i + 1) % ROTATING.length);
    }, 2500);
    return () => clearInterval(id);
  }, [rotate]);

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: 540,
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 16px',
        height: 54,
        background: '#141310',
        border: '1px solid',
        borderColor: focused ? 'var(--gold)' : 'rgba(255,255,255,0.07)',
        borderRadius: 14,
        boxShadow: focused ? '0 0 0 3px rgba(201,168,76,0.15)' : 'none',
        transition: 'border-color 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out)',
      }}
    >
      <Search size={18} color="var(--gold)" strokeWidth={2} style={{ flexShrink: 0 }} />

      <div style={{ position: 'relative', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Rechercher une situation"
          placeholder={rotate ? '' : STATIC_PLACEHOLDER}
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontSize: 15,
            fontFamily: 'inherit',
          }}
        />
        {/* Placeholder rotatif factice : jamais une vraie valeur du champ */}
        {rotate && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              color: 'var(--text-subtle)',
              fontSize: 15,
              overflow: 'hidden',
            }}
          >
            <AnimatePresence mode="wait">
              <m.span
                key={rotIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {ROTATING[rotIndex]}
              </m.span>
            </AnimatePresence>
          </div>
        )}
      </div>

      {hasQuery && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            if (inputRef.current) inputRef.current.focus();
          }}
          aria-label="Effacer la recherche"
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 30,
            borderRadius: 8,
            border: '1px solid var(--glass-border)',
            background: 'var(--glass)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={15} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
