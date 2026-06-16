import { m, useReducedMotion } from 'framer-motion';
import { CATEGORY_META, fadeUpVariants, stagger } from './articlesMeta';

/* Grille "Par situation" : une carte par categorie reellement presente.
   Clic = set activeCategory + smooth-scroll vers la liste. */
function SituationGrid({ categoryKeys, counts, active, onSelect }) {
  const reduce = useReducedMotion();
  const fadeUp = fadeUpVariants(reduce);

  return (
    <m.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="situation-grid"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
    >
      {categoryKeys.map((key) => {
        const meta = CATEGORY_META[key];
        if (!meta) return null;
        const { Icon, accent, label, subtitle } = meta;
        const isActive = active === key;
        const count = counts[key] || 0;

        return (
          <m.button
            key={key}
            type="button"
            variants={fadeUp}
            onClick={() => onSelect(key)}
            aria-pressed={isActive}
            aria-label={`${label} : ${count} ${count > 1 ? 'réponses' : 'réponse'}`}
            whileHover={reduce ? undefined : { y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="situation-card"
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: '22px 20px',
              borderRadius: 16,
              background: '#141310',
              border: '1px solid',
              borderColor: isActive ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.07)',
              transition: 'border-color 0.25s var(--ease-out)',
            }}
          >
            <span
              className="situation-icon"
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: `${accent}1A`,
                border: `1px solid ${accent}3D`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.3s var(--ease-out)',
              }}
            >
              <Icon size={22} color={accent} strokeWidth={1.6} />
            </span>

            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                {label}
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {subtitle}
              </p>
            </div>

            <span style={{ marginTop: 'auto', fontSize: 12, color: 'var(--text-subtle)' }}>
              {count} {count > 1 ? 'réponses' : 'réponse'}
            </span>
          </m.button>
        );
      })}
    </m.div>
  );
}

export default SituationGrid;
