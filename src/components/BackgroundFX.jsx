import { useScroll, useTransform, motion } from 'framer-motion';

/* Données statiques des particules (20 particules) */
const PARTICLES = [
  { x: 7,  y: 8,  size: 2,   opacity: 0.25, blur: false, speed: 0.18, drift: 9  },
  { x: 19, y: 22, size: 1.5, opacity: 0.18, blur: true,  speed: 0.28, drift: 11 },
  { x: 34, y: 5,  size: 2.5, opacity: 0.22, blur: false, speed: 0.14, drift: 8  },
  { x: 48, y: 15, size: 1.5, opacity: 0.30, blur: true,  speed: 0.32, drift: 10 },
  { x: 62, y: 3,  size: 2,   opacity: 0.20, blur: false, speed: 0.22, drift: 12 },
  { x: 77, y: 18, size: 3,   opacity: 0.17, blur: true,  speed: 0.12, drift: 9  },
  { x: 89, y: 10, size: 2,   opacity: 0.28, blur: false, speed: 0.26, drift: 7  },
  { x: 12, y: 38, size: 1.5, opacity: 0.20, blur: true,  speed: 0.35, drift: 11 },
  { x: 28, y: 45, size: 2.5, opacity: 0.15, blur: false, speed: 0.16, drift: 13 },
  { x: 43, y: 32, size: 2,   opacity: 0.32, blur: true,  speed: 0.24, drift: 8  },
  { x: 57, y: 55, size: 1.5, opacity: 0.19, blur: false, speed: 0.30, drift: 10 },
  { x: 71, y: 40, size: 2,   opacity: 0.24, blur: true,  speed: 0.20, drift: 9  },
  { x: 85, y: 48, size: 3,   opacity: 0.16, blur: false, speed: 0.13, drift: 12 },
  { x: 5,  y: 65, size: 2,   opacity: 0.22, blur: true,  speed: 0.28, drift: 11 },
  { x: 23, y: 72, size: 1.5, opacity: 0.18, blur: false, speed: 0.36, drift: 8  },
  { x: 38, y: 60, size: 2.5, opacity: 0.26, blur: true,  speed: 0.18, drift: 10 },
  { x: 54, y: 78, size: 2,   opacity: 0.20, blur: false, speed: 0.22, drift: 9  },
  { x: 69, y: 68, size: 1.5, opacity: 0.30, blur: true,  speed: 0.15, drift: 13 },
  { x: 82, y: 82, size: 2,   opacity: 0.18, blur: false, speed: 0.25, drift: 7  },
  { x: 94, y: 30, size: 2.5, opacity: 0.22, blur: true,  speed: 0.32, drift: 11 },
];

/* Particule individuelle avec useTransform pour le parallaxe au scroll */
function Particle({ p, scrollYProgress }) {
  const range = p.speed * 300;
  const y = useTransform(scrollYProgress, [0, 1], [0, range]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: p.size,
        height: p.size,
        borderRadius: '50%',
        background: p.x % 3 === 0
          ? `rgba(232,201,122,${p.opacity})`
          : `rgba(201,168,76,${p.opacity})`,
        filter: p.blur ? 'blur(0.5px)' : 'none',
        y,
        animation: `particle-drift-${(Math.round(p.x) % 3) + 1} ${p.drift}s ease-in-out infinite alternate`,
      }}
    />
  );
}

/* Couche particules - 20 max, will-change sur le conteneur */
function ScrollParticles() {
  const { scrollYProgress } = useScroll();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    >
      {PARTICLES.map((p, i) => (
        <Particle key={i} p={p} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
}

/* Couche particules statiques si prefers-reduced-motion */
function StaticParticles() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.x % 3 === 0
              ? `rgba(232,201,122,${p.opacity})`
              : `rgba(201,168,76,${p.opacity})`,
            filter: p.blur ? 'blur(0.5px)' : 'none',
          }}
        />
      ))}
    </div>
  );
}

/* BackgroundFX - fond atmosphérique 5 couches + particules scroll */
function BackgroundFX() {
  const prefersReduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* COUCHE 1 - Dégradé radial de base */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, var(--bg-3) 0%, var(--bg) 60%)',
        }}
      />

      {/* COUCHE 2 - 3 orbes lumineux flous */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          filter: 'blur(110px)',
          animation: 'orb-drift-1 28s ease-in-out infinite alternate',
          willChange: 'transform',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '-8%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,134,47,0.04) 0%, transparent 70%)',
          filter: 'blur(110px)',
          animation: 'orb-drift-2 35s ease-in-out infinite alternate',
          willChange: 'transform',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-5%',
          left: '30%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 70%)',
          filter: 'blur(110px)',
          animation: 'orb-drift-3 32s ease-in-out infinite alternate',
          willChange: 'transform',
        }}
      />

      {/* COUCHE 3 - Champ d'étoiles (CSS pur) */}
      <Stars />

      {/* COUCHE 3b - Particules dorées au scroll */}
      {prefersReduced ? <StaticParticles /> : <ScrollParticles />}

      {/* COUCHE 4 - Grille technique */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 75%)',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 75%)',
        }}
      />

      {/* COUCHE 5 - Grain filmique */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}

/* Étoiles CSS pur */
function Stars() {
  const stars = [
    { x: 8, y: 12, s: 1, o: 0.3 },
    { x: 15, y: 5, s: 1.5, o: 0.4, t: true },
    { x: 22, y: 28, s: 1, o: 0.2 },
    { x: 31, y: 8, s: 1, o: 0.35 },
    { x: 38, y: 18, s: 1.5, o: 0.45, t: true },
    { x: 45, y: 3, s: 1, o: 0.25 },
    { x: 52, y: 22, s: 1, o: 0.3 },
    { x: 59, y: 11, s: 1.5, o: 0.4, t: true },
    { x: 67, y: 30, s: 1, o: 0.2 },
    { x: 74, y: 6, s: 1, o: 0.35 },
    { x: 81, y: 17, s: 1.5, o: 0.45, t: true },
    { x: 88, y: 25, s: 1, o: 0.3 },
    { x: 5, y: 40, s: 1, o: 0.2 },
    { x: 13, y: 55, s: 1.5, o: 0.35, t: true },
    { x: 20, y: 45, s: 1, o: 0.25 },
    { x: 28, y: 62, s: 1, o: 0.3 },
    { x: 35, y: 50, s: 1.5, o: 0.4, t: true },
    { x: 42, y: 38, s: 1, o: 0.2 },
    { x: 50, y: 65, s: 1, o: 0.35 },
    { x: 57, y: 42, s: 1.5, o: 0.45, t: true },
    { x: 64, y: 58, s: 1, o: 0.25 },
    { x: 72, y: 47, s: 1, o: 0.3 },
    { x: 79, y: 70, s: 1.5, o: 0.35, t: true },
    { x: 86, y: 53, s: 1, o: 0.2 },
    { x: 93, y: 60, s: 1, o: 0.4 },
    { x: 3, y: 75, s: 1.5, o: 0.3, t: true },
    { x: 11, y: 80, s: 1, o: 0.2 },
    { x: 18, y: 72, s: 1, o: 0.35 },
    { x: 26, y: 85, s: 1.5, o: 0.45, t: true },
    { x: 33, y: 78, s: 1, o: 0.25 },
    { x: 40, y: 88, s: 1, o: 0.3 },
    { x: 48, y: 82, s: 1.5, o: 0.4, t: true },
    { x: 55, y: 92, s: 1, o: 0.2 },
    { x: 62, y: 76, s: 1, o: 0.35 },
    { x: 70, y: 84, s: 1.5, o: 0.45, t: true },
    { x: 77, y: 90, s: 1, o: 0.3 },
    { x: 84, y: 68, s: 1, o: 0.25 },
    { x: 91, y: 79, s: 1.5, o: 0.35, t: true },
    { x: 96, y: 35, s: 1, o: 0.2 },
    { x: 7, y: 92, s: 1, o: 0.3 },
    { x: 16, y: 33, s: 1.5, o: 0.4, t: true },
    { x: 24, y: 15, s: 1, o: 0.25 },
    { x: 43, y: 7, s: 1, o: 0.35 },
    { x: 63, y: 14, s: 1.5, o: 0.45, t: true },
    { x: 76, y: 2, s: 1, o: 0.3 },
    { x: 89, y: 9, s: 1, o: 0.2 },
    { x: 97, y: 20, s: 1.5, o: 0.35, t: true },
    { x: 4, y: 60, s: 1, o: 0.25 },
    { x: 12, y: 48, s: 1, o: 0.3 },
    { x: 30, y: 35, s: 1.5, o: 0.4, t: true },
    { x: 46, y: 73, s: 1, o: 0.2 },
    { x: 53, y: 32, s: 1, o: 0.35 },
    { x: 68, y: 20, s: 1.5, o: 0.45, t: true },
    { x: 83, y: 43, s: 1, o: 0.3 },
    { x: 90, y: 88, s: 1, o: 0.25 },
    { x: 95, y: 50, s: 1.5, o: 0.35, t: true },
    { x: 1, y: 22, s: 1, o: 0.2 },
    { x: 37, y: 95, s: 1, o: 0.3 },
    { x: 54, y: 86, s: 1.5, o: 0.4, t: true },
    { x: 71, y: 97, s: 1, o: 0.25 },
    { x: 78, y: 58, s: 1, o: 0.35 },
    { x: 85, y: 32, s: 1.5, o: 0.4, t: true },
    { x: 92, y: 14, s: 1, o: 0.3 },
    { x: 99, y: 65, s: 1, o: 0.2 },
    { x: 2, y: 85, s: 1.5, o: 0.35, t: true },
    { x: 9, y: 70, s: 1, o: 0.3 },
    { x: 17, y: 95, s: 1, o: 0.25 },
    { x: 25, y: 52, s: 1.5, o: 0.4, t: true },
    { x: 44, y: 27, s: 1, o: 0.2 },
    { x: 60, y: 40, s: 1, o: 0.35 },
    { x: 73, y: 63, s: 1.5, o: 0.45, t: true },
    { x: 80, y: 10, s: 1, o: 0.3 },
    { x: 87, y: 75, s: 1, o: 0.25 },
    { x: 94, y: 42, s: 1.5, o: 0.35, t: true },
    { x: 6, y: 18, s: 1, o: 0.2 },
    { x: 21, y: 63, s: 1, o: 0.3 },
    { x: 39, y: 44, s: 1.5, o: 0.4, t: true },
    { x: 56, y: 8, s: 1, o: 0.25 },
    { x: 65, y: 55, s: 1, o: 0.35 },
    { x: 82, y: 22, s: 1.5, o: 0.45, t: true },
  ];

  const twinkleDelays = [0, 0.8, 1.6, 2.4, 3.2, 0.4, 1.2, 2.0, 2.8, 3.6, 0.6, 1.8, 2.2, 3.0, 0.2];

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.s,
            height: star.s,
            borderRadius: '50%',
            background: i % 3 === 0
              ? `rgba(232,201,122,${star.o})`
              : `rgba(244,241,234,${star.o})`,
            animation: star.t
              ? `twinkle ${3 + (i % 3)}s ease-in-out ${twinkleDelays[i % twinkleDelays.length]}s infinite`
              : 'none',
          }}
        />
      ))}
    </div>
  );
}

export default BackgroundFX;
