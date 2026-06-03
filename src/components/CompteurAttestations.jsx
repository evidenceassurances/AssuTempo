import { useEffect, useRef, useState } from 'react';

const START_COUNT = 3267;
const START_DATE  = '2026-06-04'; // date de lancement : le compteur démarre à 3267 ce jour-là

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
  const target = computeCount();
  const [display, setDisplay] = useState(target);
  const ref      = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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
  }, [target]);

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
        {display.toLocaleString('fr-FR')}
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
