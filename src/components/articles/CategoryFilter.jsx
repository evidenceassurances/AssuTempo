import { m } from 'framer-motion';
import { CATEGORY_META } from './articlesMeta';

/* Pills compactes de filtrage. L'indicateur actif est un motion.div en
   layoutId="filterActive" qui glisse d'une pill a l'autre (spring). */
function CategoryFilter({ categoryKeys, active, onSelect }) {
  const pills = [{ key: 'tous', label: 'Tous' }, ...categoryKeys.map((k) => CATEGORY_META[k]).filter(Boolean)];

  return (
    <div
      role="group"
      aria-label="Filtrer par situation"
      style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
    >
      {pills.map((pill) => {
        const isActive = active === pill.key;
        return (
          <button
            key={pill.key}
            type="button"
            onClick={() => onSelect(pill.key)}
            aria-pressed={isActive}
            style={{
              position: 'relative',
              padding: '8px 16px',
              borderRadius: 999,
              border: '1px solid',
              borderColor: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.07)',
              background: 'transparent',
              color: isActive ? 'var(--gold)' : 'var(--text-muted)',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'color 0.2s var(--ease-out), border-color 0.2s var(--ease-out)',
            }}
          >
            {isActive && (
              <m.span
                layoutId="filterActive"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 999,
                  background: 'var(--gold-glow)',
                  zIndex: 0,
                }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{pill.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
