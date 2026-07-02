import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import './TempoDial.css';
import './CadranAssutempo.css';

/* Cadran interactif du hero scrollytelling.
   Base visuelle : les classes atd de TempoDial.css (bloom, anneaux, comete),
   scopees ici par .atc pour ne pas toucher les autres pages.
   Par-dessus : une couche SVG (arc de remplissage, aiguille-point,
   90 graduations allumables) generee et pilotee apres hydratation.
   Machine a etats de rotation : idle > interacting > resuming > idle,
   servie par un seul requestAnimationFrame. */

const R = 34.6;                      /* rayon de l'orbite, en unites viewBox (100) */
const CIRC = +(2 * Math.PI * R).toFixed(3);
const IDLE_SPEED = 360 / 75;         /* comete au repos : 1 tour en 75 s */
const DASH_SPEED = 360 / 180;        /* contre-rotation : 1 tour en 3 min, sens inverse */

const CadranAssutempo = forwardRef(function CadranAssutempo(_, ref) {
  const rootRef = useRef(null);
  const cometRef = useRef(null);
  const trailRef = useRef(null);
  const dashRef = useRef(null);
  const gradsRef = useRef(null);
  const numsRef = useRef(null);
  const fillRef = useRef(null);
  const arcRef = useRef(null);
  const arcGlowRef = useRef(null);
  const needleRef = useRef(null);
  const wakeRef = useRef(null);

  /* Etat mutable hors React : aucune re-render pendant le scroll ou le drag */
  const st = useRef({
    angle: 0,
    dashAngle: 0,
    speed: IDLE_SPEED,
    mode: 'idle',
    raf: 0,
    last: 0,
    active: true,
    started: false,
    reduced: false,
    timer: 0,
    wakeTimer: 0,
    days: 7,          /* derniere valeur choisie (re-materialisation) */
    lit: 0,           /* nombre de graduations allumees */
    zeroed: true,     /* cadran "pur" (retour en haut) */
    lastP2: -1,
    grads: [],
  }).current;

  /* Applique une valeur de jours a l'arc, l'aiguille et aux graduations */
  const applyVisual = (days, animate) => {
    const fill = fillRef.current;
    if (!fill) return;
    if (!animate) fill.classList.add('atc-notrans');

    const offset = (CIRC * (1 - days / 90)).toFixed(3);
    arcRef.current.style.strokeDashoffset = offset;
    arcGlowRef.current.style.strokeDashoffset = offset;
    needleRef.current.style.transform = `rotate(${days * 4}deg)`;
    /* Finition 4 : le sillage vise le meme angle avec une transition plus
       lente que l'aiguille, il traine donc derriere elle pendant le mouvement */
    wakeRef.current.style.transform = `rotate(${days * 4}deg)`;

    const grads = st.grads;
    if (grads.length) {
      if (days > st.lit) {
        for (let j = st.lit + 1; j <= days; j++) grads[j].classList.add('on');
      } else if (days < st.lit) {
        for (let j = days + 1; j <= st.lit; j++) grads[j].classList.remove('on');
      }
    }
    st.lit = days;

    if (!animate) {
      void fill.offsetWidth; /* flush : les prochains changements retransitionnent */
      fill.classList.remove('atc-notrans');
    }
  };

  /* Boucle unique du cadran : rotation de la comete (lissage exponentiel) */
  const loop = (ts) => {
    if (!st.active) { st.raf = 0; return; }
    if (!st.last) st.last = ts;
    const dt = Math.min((ts - st.last) / 1000, 0.05);
    st.last = ts;

    const target = st.mode === 'interacting' ? 0 : IDLE_SPEED;
    const k = st.mode === 'resuming' ? 1.2 : 6;
    st.speed += (target - st.speed) * Math.min(1, k * dt);
    if (st.mode === 'resuming' && Math.abs(st.speed - IDLE_SPEED) < 0.02) {
      st.speed = IDLE_SPEED;
      st.mode = 'idle';
    }
    st.angle = (st.angle + st.speed * dt) % 360;
    cometRef.current.style.transform = `rotate(${st.angle.toFixed(3)}deg)`;

    /* Finition 1 : contre-rotation lente et constante, deux vitesses opposees */
    st.dashAngle = (st.dashAngle - DASH_SPEED * dt) % 360;
    dashRef.current.style.transform = `rotate(${st.dashAngle.toFixed(3)}deg)`;

    /* Finition 5 : respiration de la lueur au repos (cycle ~4 s, faible
       amplitude), amortie proportionnellement quand la rotation s'arrete */
    const kIdle = Math.max(0, Math.min(1, st.speed / IDLE_SPEED));
    const breathe = 0.86 + 0.14 * Math.sin(ts / 636.6);
    trailRef.current.style.opacity = (1 - kIdle + breathe * kIdle).toFixed(3);

    st.raf = requestAnimationFrame(loop);
  };

  const startLoop = () => {
    if (!st.started || st.raf || !st.active || st.reduced) return;
    st.last = 0;
    st.raf = requestAnimationFrame(loop);
  };

  useEffect(() => {
    st.active = true;
    st.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Generation des 90 graduations (une par jour, majeures toutes les 10).
       textContent = '' : idempotent sous StrictMode (double montage en dev). */
    const NS = 'http://www.w3.org/2000/svg';
    const g = gradsRef.current;
    g.textContent = '';
    const grads = [null];
    for (let j = 1; j <= 90; j++) {
      const a = (j * 4 * Math.PI) / 180;
      const maj = j % 10 === 0;
      const r1 = maj ? 32.9 : 34.3;
      const r2 = maj ? 35.15 : 35.0;
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', (50 + r1 * Math.sin(a)).toFixed(2));
      line.setAttribute('y1', (50 - r1 * Math.cos(a)).toFixed(2));
      line.setAttribute('x2', (50 + r2 * Math.sin(a)).toFixed(2));
      line.setAttribute('y2', (50 - r2 * Math.cos(a)).toFixed(2));
      line.setAttribute('class', maj ? 'atc-grad atc-grad-maj' : 'atc-grad');
      g.appendChild(line);
      grads.push(line);
    }
    st.grads = grads;
    st.lit = 0;
    if (!st.zeroed) applyVisual(st.days, false);

    /* Finition 2 : chiffres reperes graves aux graduations majeures,
       orientes vers le centre. Le 90 se lit a midi : l'echelle du cadran
       est racontee sans un mot. */
    const nums = numsRef.current;
    nums.textContent = '';
    for (let v = 15; v <= 90; v += 15) {
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', '50');
      t.setAttribute('y', '20.9');
      t.setAttribute('transform', `rotate(${v * 4} 50 50)`);
      t.setAttribute('class', 'atc-num');
      t.textContent = String(v);
      nums.appendChild(t);
    }

    /* Prise de controle des rotations CSS sans saut : on lit l'angle courant */
    if (!st.reduced) {
      const readAngle = (el) => {
        const mtx = getComputedStyle(el).transform;
        if (!mtx || !mtx.startsWith('matrix')) return 0;
        const [ma, mb] = mtx.slice(7).split(',');
        return ((Math.atan2(+mb, +ma) * 180) / Math.PI + 360) % 360;
      };
      st.angle = readAngle(cometRef.current);
      st.dashAngle = readAngle(dashRef.current);
      cometRef.current.style.animation = 'none';
      dashRef.current.style.animation = 'none';
      st.started = true;
      startLoop();
    }

    return () => {
      st.active = false;
      if (st.raf) cancelAnimationFrame(st.raf);
      st.raf = 0;
      clearTimeout(st.timer);
      clearTimeout(st.wakeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    /* Interaction curseur : la rotation decelere (~600 ms), memoire 3 s, reprise douce */
    interact(days) {
      st.days = days;
      if (!st.reduced) {
        st.mode = 'interacting';
        clearTimeout(st.timer);
        st.timer = setTimeout(() => { st.mode = 'resuming'; }, 3000);
        /* Sillage visible pendant le remplissage, evanoui a l'arret */
        wakeRef.current.style.opacity = 1;
        clearTimeout(st.wakeTimer);
        st.wakeTimer = setTimeout(() => { wakeRef.current.style.opacity = 0; }, 650);
      }
      applyVisual(days, !st.reduced);
    },

    /* Presence de l'acte 2 (p2 du scroll) : materialise arc + aiguille */
    setPresence(p2) {
      const v = p2.toFixed(3);
      if (v === st.lastP2) return;
      st.lastP2 = v;
      fillRef.current.style.opacity = v;

      /* Finition 7 : zoom imperceptible, le cadran s'avance quand il devient l'outil */
      if (!st.reduced) {
        rootRef.current.style.transform = `translate(-50%, -50%) scale(${(1 + 0.03 * p2).toFixed(4)})`;
      }

      if (p2 <= 0.02 && !st.zeroed) {
        /* Retour en haut : cadran pur (arc vide, graduations eteintes, aiguille masquee) */
        st.zeroed = true;
        applyVisual(0, false);
      } else if (p2 > 0.06 && st.zeroed) {
        st.zeroed = false;
        applyVisual(st.days, !st.reduced);
      }
    },

    /* Pause hors viewport / onglet cache */
    setActive(on) {
      st.active = on;
      if (on) startLoop();
      else if (st.raf) { cancelAnimationFrame(st.raf); st.raf = 0; }
    },
  }));

  return (
    <div className="atd atc" aria-hidden="true" ref={rootRef}>
      <div className="atd-bloom" />
      <div className="atd-ring atd-r1" />
      <div className="atd-ring atd-r2" />
      <div className="atd-ring atd-dash" ref={dashRef} />
      <div className="atd-ticks" />
      <div className="atd-ticks atd-ticks-major" />

      <svg className="atc-svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="atcArc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E8C97A" />
            <stop offset="1" stopColor="#C9A84C" />
          </linearGradient>
          <radialGradient id="atcDotGlow">
            <stop offset="0" stopColor="rgba(246,231,182,0.9)" />
            <stop offset="0.4" stopColor="rgba(232,201,122,0.45)" />
            <stop offset="1" stopColor="rgba(232,201,122,0)" />
          </radialGradient>
          {/* Degrade du sillage : de la queue transparente vers la tete lumineuse */}
          <linearGradient id="atcWake" gradientUnits="userSpaceOnUse" x1="41.05" y1="16.58" x2="50" y2="15.4">
            <stop offset="0" stopColor="rgba(246,231,182,0)" />
            <stop offset="1" stopColor="rgba(246,231,182,0.85)" />
          </linearGradient>
        </defs>

        <g ref={numsRef} />

        {/* Tout ce qui se materialise avec l'acte 2 (opacite = p2) vit ici */}
        <g ref={fillRef} className="atc-fill" style={{ opacity: 0 }}>
          <g ref={gradsRef} />
          <circle ref={arcGlowRef} className="atc-arc-glow" cx="50" cy="50" r={R} style={{ strokeDashoffset: CIRC }} />
          <circle ref={arcRef} className="atc-arc" cx="50" cy="50" r={R} style={{ strokeDashoffset: CIRC }} />
          {/* Finition 4 : sillage de ~15 degres derriere le point-aiguille */}
          <g ref={wakeRef} className="atc-wake" style={{ transform: 'rotate(0deg)', opacity: 0 }}>
            <path className="atc-wake-path" d="M 41.05 16.58 A 34.6 34.6 0 0 1 50 15.4" />
          </g>
          <g ref={needleRef} className="atc-needle" style={{ transform: 'rotate(0deg)' }}>
            <line className="atc-needle-line" x1="50" y1="21.4" x2="50" y2="16.6" />
            <circle className="atc-needle-glow" cx="50" cy="15.4" r="2.6" fill="url(#atcDotGlow)" />
            <circle className="atc-needle-dot" cx="50" cy="15.4" r="0.85" />
          </g>
        </g>
      </svg>

      <div className="atd-comet" ref={cometRef}>
        <span className="atd-trail" ref={trailRef} />
        <span className="atd-dot" />
      </div>
    </div>
  );
});

export default CadranAssutempo;
