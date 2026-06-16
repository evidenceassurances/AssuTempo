import { m, useReducedMotion } from 'framer-motion';
import { fadeUpVariants, stagger } from './articlesMeta';
import SearchBar from './SearchBar';

/* Chips de situations rapides : libelle visible -> cle de categorie. */
const CHIPS = [
  { label: 'Sortie de fourrière', key: 'urgence' },
  { label: 'Véhicule acheté', key: 'achat' },
  { label: "Rouler à l'étranger", key: 'international' },
  { label: 'Carte grise', key: 'carte-grise' },
];

function ArticlesHero({ query, onQueryChange, onChipSelect }) {
  const reduce = useReducedMotion();
  const fadeUp = fadeUpVariants(reduce);

  return (
    <m.div
      variants={stagger}
      initial="hidden"
      animate="show"
      style={{ position: 'relative', zIndex: 1, padding: '0 24px', textAlign: 'center' }}
    >
      <m.p
        variants={fadeUp}
        style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}
      >
        CENTRE DE RÉPONSES
      </m.p>

      {/* H1 : spans avec espaces inclus pour un texte continu cote crawlers/IA */}
      <m.h1
        variants={fadeUp}
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.4rem)',
          fontWeight: 800,
          color: 'var(--text)',
          margin: '0 auto 18px',
          maxWidth: 760,
          lineHeight: 1.12,
          letterSpacing: '-0.03em',
        }}
      >
        <span>Une réponse </span>
        <span style={{ color: 'var(--gold)' }}>claire</span>
        <span> à chaque situation</span>
      </m.h1>

      <m.p
        variants={fadeUp}
        style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto 30px', lineHeight: 1.7 }}
      >
        Le guide de l&apos;assurance temporaire, situation par situation.
      </m.p>

      <m.div variants={fadeUp} style={{ marginBottom: 22 }}>
        <SearchBar query={query} onChange={onQueryChange} />
      </m.div>

      <m.div
        variants={fadeUp}
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}
      >
        {CHIPS.map((chip) => (
          <m.button
            key={chip.label}
            type="button"
            onClick={() => onChipSelect(chip.key)}
            whileTap={{ scale: 0.96 }}
            whileHover={reduce ? undefined : { borderColor: 'var(--gold)' }}
            className="hero-chip"
            style={{
              padding: '8px 15px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.07)',
              background: '#141310',
              color: 'var(--text-muted)',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s var(--ease-out), color 0.2s var(--ease-out)',
            }}
          >
            {chip.label}
          </m.button>
        ))}
      </m.div>
    </m.div>
  );
}

export default ArticlesHero;
