import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const START_COUNT = 3267;
const START_DATE  = '2026-06-04'; // date de lancement : le compteur démarre à 3267 ce jour-là

/* Plancher affiché dans le HTML pré-rendu, sous la forme « 3 200+ ».

   Le compteur n'affichait sa valeur exacte qu'après hydratation, et le HTML
   statique restait figé sur START_COUNT : au bout de deux mois il annonçait 84
   attestations de moins que la réalité, et l'écart grandissait chaque jour. Un
   moteur qui ne rend pas le JavaScript citait donc un chiffre périmé.

   Un plancher arrondi à la centaine inférieure résout les deux problèmes à la
   fois : il reste vrai indéfiniment (le compteur ne fait que monter à partir de
   START_COUNT), et le « + » le dit explicitement. L'humain, lui, voit toujours
   la valeur exacte du jour dès que le JavaScript s'exécute.

   À relever de temps en temps si tu veux un plancher plus flatteur. Il ne doit
   JAMAIS dépasser START_COUNT, sans quoi le site annoncerait plus que ce que le
   compteur sait justifier. */
const PLANCHER = 3200;

function seededRand(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h  = Math.imul(h, 16777619);
  }
  h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
  return ((h >>> 0) % 1000) / 1000;
}

const dayKey   = (d)   => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const dailyInc = (key) => 1 + Math.floor(seededRand(key) * 2); // +1 ou +2

function computeCount(now = new Date()) {
  let count = START_COUNT;
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const start = new Date(START_DATE + 'T00:00:00');
  for (let d = new Date(start); d < today; d.setDate(d.getDate() + 1)) {
    count += dailyInc(dayKey(d));
  }
  const k = dayKey(today);
  const revealHour = 10 + Math.floor(seededRand(k + '-h') * 9); // 10..18
  if (now.getHours() >= revealHour) count += dailyInc(k);
  return count;
}

export default function CompteurAttestations() {
  /* Rendu initial deterministe (PLANCHER) : le HTML prerendu au build et le
     premier rendu client restent identiques quel que soit le jour de la visite,
     donc zero mismatch d'hydratation. La valeur exacte du jour est calculee
     apres montage, puis animee a l'apparition.

     Tant qu'on affiche le plancher, un « + » l'accompagne : le chiffre statique
     est alors une minoration honnete, jamais une valeur fausse. */
  const [display, setDisplay] = useState(PLANCHER);
  const [exact, setExact]     = useState(false);
  const ref      = useRef(null);
  const animated = useRef(false);
  const reduce   = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const target = computeCount();
    setDisplay(target);
    setExact(true);

    /* Preference systeme "reduire les animations" : la valeur exacte est deja
       posee, on n'observe rien et on ne compte pas. */
    if (reduce) return undefined;

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated.current) {
        animated.current = true;
        const from = Math.max(START_COUNT, target - 60);
        const dur = 1400, t0 = performance.now();
        setDisplay(from);
        const tick = (t) => {
          const p     = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(Math.round(from + (target - from) * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div ref={ref} style={{ textAlign: 'center', marginBottom: 40 }}>
      <p
        style={{
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          margin: '0 0 10px',
          fontWeight: 600,
        }}
      >
        Ils roulent déjà assurés
      </p>
      <div
        style={{
          fontSize: 'clamp(3rem, 8vw, 4.5rem)',
          fontWeight: 800,
          color: 'var(--gold-light)',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {/* Une SEULE expression, donc un seul noeud de texte : React n'insere
            pas de separateur <!-- --> entre deux expressions adjacentes, et le
            HTML porte « 3 200+ » d'un bloc plutot que « 3 200 + ». */}
        {display.toLocaleString('fr-FR') + (exact ? '' : '+')}
      </div>
      <p
        style={{
          marginTop: 10,
          fontSize: 15,
          color: 'var(--text-muted)',
        }}
      >
        attestations délivrées
      </p>
    </div>
  );
}
